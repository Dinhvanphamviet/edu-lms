export type ActivationCodeStatus = "UNUSED" | "USED" | "EXPIRED" | "DISABLED";

export interface CourseOption {
  id: string;
  title: string;
}

export interface ActivationUserInfo {
  id?: string;
  name: string;
  email?: string;
}

export interface ActivationCodeItem {
  id: string;
  code: string;
  courses: CourseOption[];
  usedBy?: ActivationUserInfo | null;
  usedAt?: string | null;
  expiresAt: string | null;
  accessDurationValue: number | null;
  accessDurationUnit: "DAY" | "MONTH" | "YEAR" | null;
  status: "ACTIVE" | "DISABLED" | "USED";
  displayStatus: ActivationCodeStatus;
  createdAt: string;
}

export interface CreateActivationCodesPayload {
  courseIds: string[];
  quantity: number;
  expiresAt: string | null;
  accessDurationValue: number | null;
  accessDurationUnit: "DAY" | "MONTH" | "YEAR" | null;
}

export function computeDisplayStatus(item: {
  status: "ACTIVE" | "DISABLED" | "USED";
  usedAt?: string | null;
  expiresAt: string | null;
}): ActivationCodeStatus {
  if (item.status === "USED" || Boolean(item.usedAt)) {
    return "USED";
  }
  if (item.status === "DISABLED") {
    return "DISABLED";
  }
  if (item.expiresAt) {
    const expDate = new Date(item.expiresAt);
    if (!isNaN(expDate.getTime()) && expDate.getTime() < Date.now()) {
      return "EXPIRED";
    }
  }
  return "UNUSED";
}
