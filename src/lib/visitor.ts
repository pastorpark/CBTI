"use client";

const storageKey = "msh_visitor_id";

export function getVisitorId() {
  const existing = window.localStorage.getItem(storageKey);
  if (existing) return existing;

  const value = crypto.randomUUID();
  window.localStorage.setItem(storageKey, value);
  return value;
}
