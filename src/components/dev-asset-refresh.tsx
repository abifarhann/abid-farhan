"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { AssetVersions } from "@/lib/asset-versions";

export function DevAssetRefresh({ initialVersions }: { initialVersions: AssetVersions }) {
  const router = useRouter();
  const initialSignature = JSON.stringify(initialVersions);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    let disposed = false;
    let inFlight = false;
    let signature = initialSignature;
    let timer: ReturnType<typeof setTimeout>;
    let controller: AbortController | undefined;

    const poll = async () => {
      if (disposed || inFlight) return;
      inFlight = true;
      controller = new AbortController();
      const timeout = setTimeout(() => controller?.abort(), 5000);
      try {
        if (!document.hidden) {
          const response = await fetch("/api/dev-assets", { cache: "no-store", signal: controller.signal });
          if (response.ok) {
            const nextSignature = JSON.stringify(await response.json());
            if (!disposed && nextSignature !== signature) {
              signature = nextSignature;
              router.refresh();
            }
          }
        }
      } catch {
        // Keep the page usable while the dev server recompiles or reconnects.
      } finally {
        clearTimeout(timeout);
        inFlight = false;
        if (!disposed) timer = setTimeout(poll, 1500);
      }
    };
    const onVisible = () => {
      if (!document.hidden && !inFlight) {
        clearTimeout(timer);
        void poll();
      }
    };
    timer = setTimeout(poll, 1500);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      disposed = true;
      clearTimeout(timer);
      controller?.abort();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [initialSignature, router]);

  return null;
}
