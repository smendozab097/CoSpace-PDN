"use client";

import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      window.dispatchEvent(new Event("cospace-auth-change"));

      // Redirigir según el rol del usuario
      if (data.data?.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 p-3 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
          Correo Electrónico
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@cospace.com o tu email"
          className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
          Contraseña
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Iniciando..." : "Iniciar Sesión"}
      </button>

      <div className="pt-2 text-center text-xs text-zinc-500">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-semibold text-blue-600 hover:underline">
          Regístrate gratis
        </Link>
      </div>

      <div className="mt-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 p-3 text-xs text-zinc-500 border border-zinc-200 dark:border-zinc-700">
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">Admin Seed:</span>
        <br />
        Email: <code className="text-blue-600">admin@cospace.com</code>
        <br />
        Pass: <code className="text-blue-600">Admin123!</code>
      </div>
    </form>
  );
}
