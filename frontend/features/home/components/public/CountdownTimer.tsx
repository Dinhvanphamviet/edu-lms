"use client";

import { useEffect, useState, useMemo } from "react";
import { CountdownConfig } from "../../api/home.api";

interface CountdownTimerProps {
  config: CountdownConfig | null;
}

function calcTimeLeft(targetDate: number) {
  const difference = targetDate - Date.now();
  if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  };
}

export function CountdownTimer({ config }: CountdownTimerProps) {
  const targetDate = useMemo(
    () => (config ? new Date(config.target_date).getTime() : 0),
    [config]
  );

  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(targetDate));
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!config || !targetDate) return;

    // Immediately compute on mount
    setTimeLeft(calcTimeLeft(targetDate));

    const interval = setInterval(() => {
      const tl = calcTimeLeft(targetDate);
      setTimeLeft(tl);
      if (tl.days === 0 && tl.hours === 0 && tl.minutes === 0 && tl.seconds === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [config, targetDate]);

  if (!config) return null;

  const timeBlocks = [
    { value: String(timeLeft.days).padStart(2, '0'), label: 'ngày' },
    { value: String(timeLeft.hours).padStart(2, '0'), label: 'giờ' },
    { value: String(timeLeft.minutes).padStart(2, '0'), label: 'phút' },
    { value: String(timeLeft.seconds).padStart(2, '0'), label: 'giây' },
  ];

  return (
    <div className="flex justify-center">
      <div className="bg-white rounded-[3rem] border border-[var(--border-default)] shadow-sm p-5 md:px-12 md:py-6 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-base md:text-lg font-semibold text-[var(--surface-strong)]">
          <span>{config.title}</span>
          <span className="text-surface-accent">❤</span>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4 mt-2">
          {timeBlocks.map((time, idx) => (
            <div key={idx} className="flex items-center justify-center bg-rose-50 border-2 border-rose-200 rounded-full px-3 py-1 md:px-5 md:py-2 min-w-[70px] md:min-w-[90px]">
              {isMounted ? (
                <>
                  <span className="text-surface-accent font-black text-lg md:text-2xl mr-1">{time.value}</span>
                  <span className="text-surface-accent/70 font-medium text-xs md:text-sm">{time.label}</span>
                </>
              ) : (
                <>
                  <span className="text-surface-accent/30 font-black text-lg md:text-2xl mr-1 animate-pulse">--</span>
                  <span className="text-surface-accent/30 font-medium text-xs md:text-sm">{time.label}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
