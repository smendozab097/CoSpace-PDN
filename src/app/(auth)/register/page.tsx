import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAccessToken, verifyRefreshToken } from "@/lib/jwt";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/cookies";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  // Si ya tiene sesión activa, redirigir inmediatamente según rol
  if (token) {
    const payload = await verifyAccessToken(token);
    if (payload) {
      redirect(payload.role === "ADMIN" ? "/admin" : "/dashboard");
    }
  }

  if (refreshToken) {
    const refreshPayload = await verifyRefreshToken(refreshToken);
    if (refreshPayload) {
      redirect("/dashboard");
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-center tracking-tight text-zinc-900 dark:text-zinc-100 mb-1">
        Crea tu cuenta CoSpace
      </h2>
      <p className="text-xs text-center text-zinc-500 mb-6">
        Únete a la comunidad de coworking y reserva por horas
      </p>
      <RegisterForm />
    </div>
  );
}
