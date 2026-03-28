"use client";

import { useState } from "react";
import type { ContactFormData } from "@/lib/validations";

type Status = "idle" | "loading" | "success" | "error";

interface UseContactReturn {
  submit:      (data: ContactFormData, honeypot?: string) => Promise<void>;
  status:      Status;
  fieldErrors: Record<string, string>;
  apiError:    string | null;
  reset:       () => void;
}

export function useContact(): UseContactReturn {
  const [status,      setStatus]      = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError,    setApiError]    = useState<string | null>(null);

  const reset = () => {
    setStatus("idle");
    setFieldErrors({});
    setApiError(null);
  };

  const submit = async (data: ContactFormData, honeypot = "") => {
    setStatus("loading");
    setFieldErrors({});
    setApiError(null);

    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        // Include honeypot field — API checks it server-side
        body: JSON.stringify({ ...data, website: honeypot }),
        signal: AbortSignal.timeout(12_000),
      });

      const json = await res.json() as {
        success: boolean;
        message: string;
        errors?: Record<string, string>;
      };

      if (!res.ok) {
        if (res.status === 422 && json.errors) {
          setFieldErrors(json.errors);
          setStatus("error");
          return;
        }
        setApiError(json.message ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");

    } catch (error) {
      if (error instanceof Error && error.name === "TimeoutError") {
        setApiError("Request timed out. Please check your connection and try again.");
      } else {
        setApiError("Failed to send message. Please try emailing me directly.");
      }
      setStatus("error");
    }
  };

  return { submit, status, fieldErrors, apiError, reset };
}