import React from "react";

export default function RegisterPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-center mb-2">Crear Cuenta</h2>
      <p className="text-sm text-center text-zinc-500 mb-6">
        Únete a CoSpace y reserva tus espacios de coworking
      </p>

      {/* TODO: Integrar RegisterForm */}
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre Completo</label>
          <input
            type="text"
            placeholder="Juan Pérez"
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 bg-transparent text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
          <input
            type="email"
            placeholder="usuario@ejemplo.com"
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 bg-transparent text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 bg-transparent text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          Crear Cuenta
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-zinc-500">
        ¿Ya tienes cuenta?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Inicia sesión
        </a>
      </p>
    </div>
  );
}
