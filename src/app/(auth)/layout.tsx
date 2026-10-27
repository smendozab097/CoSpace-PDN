import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-transparent p-4">
      <div className="w-full max-w-md mb-4 flex items-center justify-start">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-[#00d2ff] bg-white/60 dark:bg-white/[0.04] backdrop-blur-md border border-zinc-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-[#00d2ff]/40 transition-all shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al inicio</span>
        </Link>
      </div>

      <div className="glass-card w-full max-w-md rounded-2xl bg-white dark:bg-white/[0.03] dark:backdrop-blur-md p-8 shadow-lg border border-zinc-200 dark:border-white/10">
        <div className="mb-6 flex justify-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <Image
              src="/logo-icon.png"
              alt="CoSpace Emblem"
              width={42}
              height={42}
              className="h-10 w-auto"
              priority
            />
            <div className="relative flex items-center">
              <Image
                src="/logo-brand-light.png"
                alt="CoSpace"
                width={140}
                height={44}
                className="h-9 w-auto dark:hidden"
                priority
              />
              <Image
                src="/logo-brand.png"
                alt="CoSpace"
                width={140}
                height={44}
                className="h-9 w-auto hidden dark:block"
                priority
              />
            </div>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
