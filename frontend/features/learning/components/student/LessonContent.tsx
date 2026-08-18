"use client";

import { ExternalLink, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useLessonLayout } from "./LessonLayoutContext";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { useState, useEffect } from "react";
import { markLessonCompleted } from "@/features/course/api/course.api";
import { Button } from "@/components/ui/button";

import { VideoPlayer } from "./VideoPlayer";

interface LessonContentProps {
  lessonData?: any;
}

export function LessonContent({ lessonData }: LessonContentProps) {
  const { layoutMode } = useLessonLayout();
  const isFullscreen = layoutMode === "fullscreen";
  
  const [playbackData, setPlaybackData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMarking, setIsMarking] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!lessonData?.id) return;
      try {
        const res = await api.get(`/student/lessons/${lessonData.id}/progress`);
        if (res.data.data?.isCompleted) {
          setIsCompleted(true);
        }
      } catch (error) {
        console.error("Failed to fetch lesson progress:", error);
      }
    };

    const fetchPlayback = async () => {
      if (!lessonData?.id) return;
      if (lessonData?.type !== "VIDEO" && lessonData?.type !== "LIVE") {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setErrorMsg("");
      try {
        const res = await api.get(`/student/lessons/${lessonData.id}/playback`);
        setPlaybackData(res.data.data);
      } catch (error: any) {
        if (error.response?.status === 401) {
          setErrorMsg("Vui lòng đăng nhập để xem bài giảng.");
        } else if (error.response?.status === 403) {
          setErrorMsg(error.response.data?.error || "Bạn đã hết lượt xem cho bài giảng này.");
          // Set view data from error response so UI shows correct count
          if (error.response.data?.data) {
            setPlaybackData(error.response.data.data);
          }
        } else {
          setErrorMsg("Không thể tải video. Vui lòng thử lại sau.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
    fetchPlayback();
  }, [lessonData?.id, lessonData?.type]);

  const handleMarkCompleted = async () => {
    if (!lessonData?.id || isCompleted) return;
    try {
      setIsMarking(true);
      await markLessonCompleted(lessonData.id);
      setIsCompleted(true);
    } catch (error) {
      console.error("Failed to mark lesson completed:", error);
    } finally {
      setIsMarking(false);
    }
  };

  const lessonTitle = lessonData?.title || "Bài giảng";
  const assessments = lessonData?.assessments || [];
  const resources = lessonData?.resources || [];

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: playbackData ? [{
      src: playbackData.playbackUrl,
      type: 'application/x-mpegURL'
    }] : []
  };

  const maxViews = playbackData?.maxViews || 21;
  const usedViews = playbackData?.usedViews || 0;
  const remainingViews = Math.max(0, maxViews - usedViews);

  return (
    <div className={cn(
      "flex flex-col bg-white overflow-hidden",
      isFullscreen ? "fixed inset-0 z-[9999]" : "rounded-xl shadow-sm border border-[var(--border-default)]"
    )}>
        {/* Header Title & Views */}
        {!isFullscreen && (
          <div className="flex flex-wrap gap-4 justify-between items-center p-6 pb-4 border-b border-[var(--border-default)]">
            <h1 className="text-lg md:text-xl font-bold text-[var(--surface-strong)] leading-tight">
              {lessonTitle}
            </h1>
            
            {(lessonData?.type === "VIDEO" || lessonData?.type === "LIVE") && (
              <div className="flex items-center gap-1.5 text-sm font-medium text-surface-strong bg-surface-strong/10 px-3 py-1.5 rounded-full flex-shrink-0">
                <Clock className="size-4" />
                Còn {remainingViews}/{maxViews} lượt xem
              </div>
            )}
          </div>
        )}

        {/* Video Player (Chỉ hiển thị nếu là bài giảng Video hoặc có errorMsg) */}
        {(lessonData?.type === "VIDEO" || lessonData?.type === "LIVE" || playbackData || errorMsg) && (
        <div className={cn("w-full bg-black flex-shrink-0 flex items-center justify-center relative", isFullscreen ? "h-screen" : "aspect-[16/9]")}>
          {isLoading ? (
            <div className="text-white flex flex-col items-center gap-3">
              <div className="size-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              <span>Đang tải video...</span>
            </div>
          ) : errorMsg ? (
            <div className="text-white flex flex-col items-center gap-3 bg-red-500/10 p-6 rounded-xl border border-red-500/20">
              <AlertCircle className="size-10 text-red-400" />
              <span className="text-red-200 font-medium">{errorMsg}</span>
            </div>
          ) : playbackData ? (
            <div className={cn("w-full h-full", isFullscreen ? "[&_.video-js]:h-screen" : "[&_.video-js]:aspect-[16/9]")}>
              <VideoPlayer options={videoJsOptions} />
            </div>
          ) : null}
        </div>
        )}

        {/* Đề thi & Tài liệu */}
        {!isFullscreen && (assessments.length > 0 || resources.length > 0) && (
        <div className="flex flex-col gap-6 p-6">
          {/* Đề thi */}
          {assessments.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-lg text-[var(--surface-strong)]">Đề thi [BTTL - BTVN]</h3>
            <div className="flex flex-col gap-2">
              {assessments.map((assessment: any) => (
                <Link 
                  href={`/de-thi/${assessment.id}?lessonId=${lessonData.id}`} 
                  key={assessment.id} 
                  className="flex items-center gap-2 text-surface-strong hover:underline font-medium p-3 bg-white rounded-lg border border-[var(--border-default)] shadow-sm"
                >
                  <Clock className="size-5" />
                  {assessment.title}
                </Link>
              ))}
            </div>
          </div>
          )}

          {/* Tài liệu */}
          {resources.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-lg text-[var(--surface-strong)]">Tài liệu đi kèm buổi học</h3>
            <div className="flex flex-col gap-2">
              {resources.map((resource: any) => (
                <a href={resource.resource_url} target="_blank" rel="noreferrer" key={resource.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-[var(--border-default)] shadow-sm group hover:border-surface-strong/50 transition-colors">
                  <span className="text-surface-strong font-medium group-hover:underline">{resource.resource_name}</span>
                  <ExternalLink className="size-5 text-[var(--text-primary)]/40 group-hover:text-surface-strong transition-colors" />
                </a>
              ))}
            </div>
          </div>
          )}
        </div>
        )}

        {/* Nút Đánh dấu hoàn thành */}
        {!isFullscreen && !isLoading && (
          <div className="p-6 flex justify-end border-t border-[var(--border-default)] bg-[var(--surface-subtle)]/30">
            <Button 
              onClick={handleMarkCompleted} 
              disabled={isCompleted || isMarking}
              variant={isCompleted ? "secondary" : "default"}
              className={cn(
                "transition-all",
                isCompleted ? "bg-green-100 text-green-700 hover:bg-green-200 border-none opacity-100" : "bg-[#008ca5] hover:bg-[#007b91] text-white"
              )}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="size-4 mr-1.5" />
                  Đã hoàn thành
                </>
              ) : isMarking ? (
                "Đang xử lý..."
              ) : (
                "Đánh dấu hoàn thành"
              )}
            </Button>
          </div>
        )}
    </div>
  );
}
