"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/utils/storage";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    setTimeout(() => {
     setChecking(false);
    }, 0);
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return children;
}