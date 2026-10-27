import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-lg border border-zinc-200 dark:border-zinc-800">
        <div className="mb-6 text-center">
          <a href="/" className="text-2xl font-bold tracking-tight text-blue-600">
            CoSpace
          </a>
        </div>
        {children}
      </div>
    </div>
  );
}
