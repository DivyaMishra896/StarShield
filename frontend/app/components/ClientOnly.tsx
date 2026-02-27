"use client";
import { useEffect, useState, ReactNode } from "react";

export default function ClientOnly({ children }: { children: ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => { setHasMounted(true); }, []);
  if (!hasMounted) return <div className="h-[250px] w-full animate-pulse bg-slate-900/20 rounded-2xl" />;
  return <>{children}</>;
}