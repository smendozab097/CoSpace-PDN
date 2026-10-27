# CoSpace - Plataforma de Reservas de Espacios de Coworking

## 1. Descripción breve del proyecto
**CoSpace** es una aplicación web fullstack desarrollada con **Next.js 16 (App Router)** y **TypeScript**, diseñada para la reserva y gestión por horas de espacios de coworking (escritorios compartidos y dedicados, salas de reuniones y cabinas acústicas privadas). La aplicación cuenta con una base de datos propia alojada en **PostgreSQL (Supabase)**, autenticación segura basada en tokens JWT almacenados exclusivamente en **cookies `httpOnly`, `secure` y `sameSite`**, protección de rutas mediante `proxy.ts`, soporte multilingüe (**i18n** en español e inglés), estrategias de renderizado híbrido (**SSG, SSR y CSR**), optimización de imágenes con `next/image` y contenerización con **Docker**.

---

## 2. Requisitos previos
Para ejecutar el proyecto localmente es necesario contar con:
* **Node.js**: Versión `v20.9.0` o superior (se recomienda `v22.x`).
* **Gestor de paquetes**: `npm` v10+ (o `pnpm` / `yarn`).
* **Docker y Docker Compose**: Instalado y con el daemon en ejecución (para levantar en contenedor).
* **Cuenta de Supabase**: Con un proyecto activo de PostgreSQL.
* **Git**: Para clonar y versionar el repositorio.

---

## 3. Variables de entorno
El proyecto requiere configurar las variables descritas en [.env.example](file:///.env.example). A continuación se explica cada una:

| Variable | Propósito | Formato / Valor esperado | Cómo obtenerlo |
|---|---|---|---|
| `DATABASE_URL` | Cadena de conexión principal a PostgreSQL mediante Supavisor Pooler (modo transacción en puerto 6543) | `postgresql://postgres.[REF]:[PASS]@[HOST]:6543/postgres?pgbouncer=true` | En Supabase: *Project Settings > Database > Connection Pooling > Transaction mode*. |
| `DIRECT_URL` | Cadena de conexión directa o de sesión (puerto 5432) utilizada por Prisma para migraciones y `db push` | `postgresql://postgres.[REF]:[PASS]@[HOST]:5432/postgres` | En Supabase: *Project Settings > Database > Connection string (Session mode o Direct)*. |
| `JWT_ACCESS_SECRET` | Clave criptográfica para firmar los Access Tokens (duración 15 minutos) | Cadena aleatoria de al menos 32 caracteres | Generar en consola con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. |
| `JWT_REFRESH_SECRET` | Clave criptográfica para firmar los Refresh Tokens (duración 7 días) | Cadena aleatoria de al menos 32 caracteres | Generar en consola con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. |
| `ACCESS_TOKEN_EXPIRES_IN` | Tiempo de expiración del token de acceso | `15m` | Configurado por defecto a `15m` según los requisitos. |
| `REFRESH_TOKEN_EXPIRES_IN` | Tiempo de expiración del token de renovación | `7d` | Configurado por defecto a `7d` según los requisitos. |
| `NEXT_PUBLIC_APP_URL` | URL base de la aplicación para redirecciones y metadatos | `http://localhost:3000` | URL local o de despliegue en Vercel. |

---

## 4. Ejecución en desarrollo
Sigue los comandos en orden exacto:

### a. Clonar el repositorio e instalar dependencias
```bash
git clone https://github.com/smendozab097/CoSpace-PDN.git
cd copacepdn
npm install
```

### b. Crear el archivo `.env` a partir de `.env.example`
```bash
cp .env.example .env
```
*Edita el archivo `.env` completando tu contraseña de Supabase en `DATABASE_URL` y `DIRECT_URL`.*

### c. Ejecutar las migraciones / sincronización del esquema
```bash
npm run db:push
```

### d. Ejecutar el seed de datos inicial
```bash
npm run db:seed
```

### e. Levantar el proyecto en modo desarrollo
```bash
npm run dev
```
Abre en tu navegador: [http://localhost:3000](http://localhost:3000).

---

## 5. Credenciales del administrador creado por el seed
El script de seed [prisma/seed.ts](file:///prisma/seed.ts) crea automáticamente el siguiente usuario con privilegios de administrador:
* **Correo Electrónico**: `admin@cospace.com`
* **Contraseña**: `Admin123!`
* **Rol**: `ADMIN`
* **Acceso**: Inicia sesión en `/login` para ser redirigido directamente al panel de control `/admin`.

---

## 6. Ejecución con Docker

### Opción 1: Con Docker Compose (Recomendada)
```bash
docker compose up --build
```

### Opción 2: Con comandos Docker CLI
1. Construir la imagen:
```bash
docker build -t cospace-app:latest .
```
2. Ejecutar el contenedor pasando las variables de entorno:
```bash
docker run -d -p 3000:3000 --env-file .env --name cospace-container cospace-app:latest
```
Accede en [http://localhost:3000](http://localhost:3000).

---

## 7. Scripts disponibles en `package.json`

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo de Next.js con soporte Turbopack en `http://localhost:3000`. |
| `npm run build` | Compila la aplicación para producción generando los bundles estáticos (SSG) y de servidor (SSR/CSR). |
| `npm run start` | Levanta el servidor de producción optimizado tras ejecutar `npm run build`. |
| `npm run lint` | Ejecuta ESLint para analizar la calidad y estilo del código. |
| `npm run db:push` | Sincroniza directamente el esquema de Prisma con la base de datos PostgreSQL de Supabase. |
| `npm run db:migrate` | Genera y ejecuta migraciones formales en Prisma. |
| `npm run db:seed` | Ejecuta el script `prisma/seed.ts` para sembrar el usuario administrador y el catálogo de espacios. |

---

## 8. Estructura de carpetas del proyecto

```text
src/
├── app/
│   ├── (public)/         # Rutas públicas (Home SSG, Catálogo SSR y Detalle dinámico SSR)
│   ├── (auth)/           # Rutas de autenticación (Login y Register con layout centrado)
│   ├── (private)/        # Rutas privadas de usuarios autenticados (Dashboard CSR)
│   ├── (admin)/          # Rutas de administración (Panel de gestión de espacios)
│   ├── api/              # Route Handlers para Auth, Spaces y Bookings
│   ├── globals.css       # Tailwind CSS v4 y variables globales
│   └── layout.tsx        # Root layout con fuentes Geist e i18n LanguageProvider
├── components/
│   ├── auth/             # Formularios de Login y Registro
│   ├── bookings/         # Formulario interactivo de reserva y tarjetas
│   ├── common/           # ClientDate para prevenir errores de hidratación (Req. 10)
│   ├── layout/           # Navbars (Pública, Privada), Footer, Sidebar Admin y LanguageSwitcher
│   └── spaces/           # SpaceCard (con next/image) y AdminSpaceActions
├── i18n/                 # Sistema de internacionalización con mensajes en es.json y en.json
├── lib/                  # Utilidades: Prisma Client, Cookies httpOnly, JWT con jose, y API Response
├── services/             # Lógica de negocio pura (BookingsService, SpacesService, AuthService)
├── types/                # Interfaces y tipos TypeScript estrictos (sin any)
└── proxy.ts              # Proxy nativo de Next.js 16 para protección de rutas y roles
```

---

## 9. URL de la aplicación desplegada
* **Producción (Vercel)**: `https://copacepdn.vercel.app` *(o tu URL generada tras conectar el repo a Vercel)*
* **Base de Datos (Supabase)**: Proyecto `PruebaNext` (`wavaaxpygidrjgwazolt.supabase.co`)
