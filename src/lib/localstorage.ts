import type { User } from "@/lib/types";

export function saveAccessToken(token: string) {
  sessionStorage.setItem("access-token", token);
}

export function loadAccessToken(): string | null {
  return sessionStorage.getItem("access-token") ?? null;
}

export function saveSelectedUsers(users: User[]) {
  localStorage.setItem("selected-users", JSON.stringify(users));
}

export function loadSelectedUsers(): User[] {
  const serialized = localStorage.getItem("selected-users");
  if (!serialized) {
    return [];
  }
  return JSON.parse(serialized);
}
