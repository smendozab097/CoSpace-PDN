# CoSpace - Plataforma de Reservas de Espacios de Coworking

[![Next.js](https://img.shields.io/badge/Next.js-16.4.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.3-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3178C6?style=flat&logo=postgresql)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker)](https://www.docker.com/)

---

## 1. Descripción breve del proyecto

**CoSpace** es una plataforma web fullstack desarrollada con **Next.js 16 (App Router)** y **TypeScript** que permite a profesionales y equipos reservar espacios de coworking (escritorios compartidos y dedicados, salas de reuniones ejecutivas y cabinas acústicas privadas) por horas completas.

La aplicación está diseñada sin dependencias de APIs externas: toda la información reside en una base de datos relacional **PostgreSQL** alojada en **Supabase** y se expone mediante **Route Handlers** nativos de Next.js. Implementa una arquitectura robusta orientada a servicios, tipado estricto sin `any`, autenticación mediante tokens JWT almacenados exclusivamente en **cookies `httpOnly`, `secure` y `sameSite`**, protección perimetral mediante `proxy.ts`, estrategias de renderizado híbrido (**SSG, SSR y CSR**), soporte multilingüe (**i18n** en español e inglés), prevención de errores de hidratación en fechas locales y contenerización completa con **Docker**.

### Características Principales
* **Catálogo y Reserva**: Catálogo público con imágenes optimizadas (`next/image`), vista de detalle dinámica por ID (`/spaces/[id]`) y flujo de reserva en horas completas.
* **Seguridad y Roles**: Distinción entre rol `USER` y rol `ADMIN`. Los administradores pueden gestionar el catálogo (crear, editar, activar/desactivar espacios).
* **Cumplimiento estricto de Reglas de Negocio en Backend**: Validación de solapamientos, límites de horas, ventanas de reserva de 7:00 a 21:00, máximo 3 reservas futuras y cancelación permitida hasta 2 horas antes del inicio.
* **Sesión y Autenticación Continua**: Access token (15 min) y Refresh token (7 días) almacenados en cookies seguras. El refresh token se almacena hasheado en base de datos y se renueva automáticamente sin interrupciones para el usuario.
* **Internacionalización (i18n)**: Soporte completo de traducción en tiempo real con selector de idioma persistente (Español / Inglés).

---

## 2. Requisitos previos

Antes de comenzar, asegúrate de contar con las siguientes herramientas instaladas y configuradas en tu sistema:

* **Node.js**: Versión **`>= 20.9.0`** (Recomendado Node.js `v22.x` o versión LTS actual). Puedes verificar tu versión con:
  ```bash
  node -v
  ```
* **Gestor de paquetes**: `npm` versión **`>= 10.x`** (incluido con Node.js), `pnpm` o `yarn`.
* **Git**: Para clonar y gestionar el repositorio:
  ```bash
  git --version
  ```
* **Docker y Docker Compose** *(opcional para ejecución en contenedor)*: Docker Engine versión 24+ y Docker Compose v2+.
* **Cuenta de Supabase / Base de Datos PostgreSQL**: Con un proyecto activo de PostgreSQL (se incluye cadena lista para pruebas en este documento si el evaluador desea levantar el proyecto de inmediato sin crear una cuenta).

---

## 3. Variables de entorno

El proyecto cuenta con una plantilla [`.env.example`](file:///.env.example) en la raíz. A continuación se detalla exhaustivamente cada variable requerida, su propósito, formato y cómo obtenerla:

| Variable | Propósito | Formato / Ejemplo | Cómo obtenerlo |
|---|---|---|---|
| `DATABASE_URL` | Cadena de conexión principal a PostgreSQL en Supabase a través del connection pooler (Supavisor) en modo Transaction (puerto `6543`), utilizada en el runtime de la aplicación. | `postgresql://postgres.[REF]:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true` | En Supabase: Dirígete a **Project Settings** > **Database** > **Connection parameters** > pestaña **Connection pooling** (modo *Transaction*). Reemplaza `[PASSWORD]` por la contraseña de tu base de datos. |
| `DIRECT_URL` | Cadena de conexión directa o de sesión a PostgreSQL en el puerto estándar `5432`, requerida por Prisma para ejecutar migraciones y `prisma db push`. | `postgresql://postgres.[REF]:[PASSWORD]@[HOST]:5432/postgres` | En Supabase: Dirígete a **Project Settings** > **Database** > **Connection parameters** > pestaña **Direct connection** (modo *Session* o *Direct*). |
| `JWT_ACCESS_SECRET` | Clave criptográfica secreta utilizada para firmar y validar los Access Tokens JWT (vida útil de 15 minutos). | Cadena segura aleatoria de al menos 32 caracteres (hex o base64). | Generar en terminal con Node.js: <br>`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` <br>o con OpenSSL: `openssl rand -hex 32` |
| `JWT_REFRESH_SECRET` | Clave criptográfica secreta utilizada para firmar y validar los Refresh Tokens JWT (vida útil de 7 días). Debe ser distinta al access secret. | Cadena segura aleatoria de al menos 32 caracteres. | Generar en terminal con: <br>`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `ACCESS_TOKEN_EXPIRES_IN` | Tiempo de vida útil y expiración del Access Token enviado en cookie `httpOnly`. | `15m` | Valor estipulado por los requisitos del proyecto (`15m`). |
| `REFRESH_TOKEN_EXPIRES_IN` | Tiempo de vida útil y expiración del Refresh Token almacenado hasheado en BD y en cookie `httpOnly`. | `7d` | Valor estipulado por los requisitos del proyecto (`7d`). |
| `NEXT_PUBLIC_APP_URL` | URL base pública de la aplicación para resolver redirecciones y URLs canónicas. | `http://localhost:3000` (desarrollo) o `https://tu-app.vercel.app` (producción) | Definido localmente según el puerto asignado o el dominio asignado en Vercel. |

### Configuración Rápida para Evaluación (Plug & Play)

Para permitir una evaluación inmediata sin requerir ingeniería inversa ni crear un proyecto de base de datos desde cero, puedes usar las siguientes variables ya configuradas en el entorno:

```env
DATABASE_URL="postgresql://postgres.wavaaxpygidrjgwazolt:CoSpacePdn2026x9Db@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.wavaaxpygidrjgwazolt:CoSpacePdn2026x9Db@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
JWT_ACCESS_SECRET="1c09129b1b66234fc41d1061fe2599ff6ebbd4bc3553cd1e4d43b7e2c7546692"
JWT_REFRESH_SECRET="f1f1aa01f6e642b2f5f9d22cbfc43b8b4948339ce1863be5c1dc0fc2caa409a3"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 4. Ejecución en desarrollo

Sigue los comandos exactos y en el orden indicado para ejecutar el proyecto desde cero:

### a. Clonar el repositorio e instalar dependencias
```bash
git clone https://github.com/smendozab097/CoSpace-PDN.git
cd copacepdn
npm install
```

### b. Crear el `.env` a partir del `.env.example` y completarlo
```bash
cp .env.example .env
```
*Si dispones de tu propia base de datos Supabase, edita `.env` con tus credenciales; de lo contrario, puedes utilizar los valores listados en la sección de Configuración Rápida.*

### c. Ejecutar las migraciones
Aplica el esquema relacional en la base de datos de PostgreSQL:
```bash
npm run db:push
```
*(Opcionalmente, si prefieres ejecutar el flujo formal de migraciones de Prisma, ejecuta `npm run db:migrate`).*

### d. Ejecutar el seed
Puebla la base de datos con el usuario administrador del sistema y el catálogo inicial de espacios (escritorios, salas y cabinas):
```bash
npm run db:seed
```

### e. Levantar el proyecto en modo desarrollo
Inicia el servidor local de Next.js:
```bash
npm run dev
```
La aplicación estará disponible de inmediato en [http://localhost:3000](http://localhost:3000).

---

## 5. Credenciales del administrador creado por el seed

El script de seed inicializa de forma automática el usuario administrador requerido por la prueba técnica:

| Campo | Valor |
|---|---|
| **Correo electrónico** | `admin@cospace.com` |
| **Contraseña** | `Admin123!` |
| **Rol** | `ADMIN` |
| **Acceso al Panel** | Iniciar sesión en `/login` para acceder a `/admin` |

### Capacidades del Administrador:
1. Acceso protegido al panel de administración en `/admin`.
2. Crear nuevos espacios de coworking (especificando nombre, descripción, tipo, capacidad, precio por hora e imagen).
3. Editar espacios existentes.
4. Desactivar espacios de coworking (validando en el servidor que no cuenten con reservas futuras confirmadas, según la Regla de Negocio 13).
5. Visualizar el listado completo de espacios activos e inactivos.

> **Nota para pruebas de usuario regular**: Puedes registrar un usuario nuevo desde la página pública [`/register`](http://localhost:3000/register) con cualquier correo y contraseña (mínimo 6 caracteres). Los usuarios normales tienen acceso al catálogo, reserva de espacios por horas y a su dashboard personal en [`/dashboard`](http://localhost:3000/dashboard).

---

## 6. Ejecución con Docker

La aplicación está preparada para ejecutarse en contenedores Docker mediante compilación multi-etapa optimizada (`standalone` output de Next.js).

### Opción 1: Con Docker CLI (Paso a Paso)

1. **Construir la imagen Docker**:
   ```bash
   docker build -t cospace-app:latest .
   ```

2. **Correr el contenedor pasando las variables de entorno**:
   * **Pasando el archivo `.env` directamente**:
     ```bash
     docker run -d -p 3000:3000 --env-file .env --name cospace-container cospace-app:latest
     ```
   * **O pasando las variables de entorno de forma individual**:
     ```bash
     docker run -d -p 3000:3000 \
       -e DATABASE_URL="postgresql://postgres.[REF]:[PASS]@[HOST]:6543/postgres?pgbouncer=true" \
       -e DIRECT_URL="postgresql://postgres.[REF]:[PASS]@[HOST]:5432/postgres" \
       -e JWT_ACCESS_SECRET="clave_secreta_access_32_caracteres" \
       -e JWT_REFRESH_SECRET="clave_secreta_refresh_32_caracteres" \
       -e ACCESS_TOKEN_EXPIRES_IN="15m" \
       -e REFRESH_TOKEN_EXPIRES_IN="7d" \
       -e NEXT_PUBLIC_APP_URL="http://localhost:3000" \
       --name cospace-container cospace-app:latest
     ```

3. **Verificar estado y logs**:
   ```bash
   docker logs -f cospace-container
   ```
   Abre [http://localhost:3000](http://localhost:3000) en el navegador.

4. **Detener y remover el contenedor**:
   ```bash
   docker stop cospace-container && docker rm cospace-container
   ```

### Opción 2: Con Docker Compose (Punto Extra)

El proyecto incluye un archivo [`docker-compose.yml`](file:///docker-compose.yml) configurado. Para levantar el servicio:

```bash
docker compose up --build -d
```
Para ver los logs en vivo:
```bash
docker compose logs -f app
```
Para detener el servicio:
```bash
docker compose down
```

---

## 7. Scripts disponibles en el `package.json` y qué hace cada uno

A continuación se describen todos los scripts configurados en [`package.json`](file:///package.json):

| Comando | Script | Descripción |
|---|---|---|
| `npm run dev` | `next dev` | Inicia el servidor de desarrollo de Next.js 16 con recarga en caliente (HMR) y compilador Turbopack en `http://localhost:3000`. |
| `npm run build` | `next build` | Compila y optimiza la aplicación para producción. Genera las páginas estáticas (SSG), compila rutas dinámicas y prepara el bundle `standalone` para Node.js y Docker. |
| `npm run start` | `next start` | Inicia el servidor de producción optimizado una vez ejecutado `npm run build`. |
| `npm run lint` | `eslint` | Ejecuta el análisis estático de código con ESLint bajo las reglas de Next.js y TypeScript para garantizar calidad y consistencia. |
| `npm run db:push` | `prisma db push` | Sincroniza directamente el esquema de datos (`prisma/schema.prisma`) con la base de datos de PostgreSQL en Supabase sin crear archivos de migración intermedios. |
| `npm run db:migrate` | `prisma migrate dev` | Crea y aplica migraciones incrementales de base de datos con historial versionado en Prisma. |
| `npm run db:seed` | `tsx prisma/seed.ts` | Ejecuta el script de semilla con TypeScript (`tsx`), insertando el administrador (`admin@cospace.com`) y los espacios iniciales de coworking. |

---

## 8. Estructura de carpetas del proyecto

El proyecto sigue una organización clara y modular utilizando el **App Router** de Next.js 16:

```text
copacepdn/
├── prisma/
│   ├── schema.prisma            # Modelos relacionales: User, Space y Booking con enums Role, SpaceType y BookingStatus
│   └── seed.ts                  # Script de siembra: crea administrador y 6 espacios de ejemplo con imágenes Unsplash
├── public/                      # Recursos estáticos: logotipos SVG/PNG y assets públicos
├── src/
│   ├── app/
│   │   ├── (public)/            # ROUTE GROUP PÚBLICO: Layout con PublicNavbar y Footer
│   │   │   ├── page.tsx         # Página de inicio / Home (Renderizado SSG - Estático)
│   │   │   ├── spaces/
│   │   │   │   ├── page.tsx     # Catálogo público de espacios activos (Renderizado SSR - Dinámico)
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx # Detalle dinámico del espacio con formulario de reserva (Renderizado SSR)
│   │   │   └── layout.tsx       # Layout público con navegación y pie de página
│   │   ├── (auth)/              # ROUTE GROUP AUTENTICACIÓN: Layout centrado y minimalista
│   │   │   ├── login/
│   │   │   │   └── page.tsx     # Página de inicio de sesión
│   │   │   ├── register/
│   │   │   │   └── page.tsx     # Página de registro de nuevo usuario
│   │   │   └── layout.tsx       # Layout centrado con fondo decorativo y selector de idioma
│   │   ├── (private)/           # ROUTE GROUP PRIVADO: Protegido por proxy.ts
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx     # Dashboard de reservas del usuario (Renderizado CSR interactivo)
│   │   │   └── layout.tsx       # Layout privado con navbar y menú de usuario autenticado
│   │   ├── (admin)/             # ROUTE GROUP ADMINISTRADOR: Protegido por rol ADMIN
│   │   │   ├── admin/
│   │   │   │   └── page.tsx     # Panel de gestión integral: crear, editar y desactivar espacios
│   │   │   └── layout.tsx       # Layout administrativo propio con Sidebar y métricas
│   │   ├── api/                 # ROUTE HANDLERS (Backend API de Next.js)
│   │   │   ├── auth/
│   │   │   │   ├── login/       # Login con generación de Access y Refresh Tokens en cookies httpOnly
│   │   │   │   ├── register/    # Registro seguro con hash de contraseñas bcrypt
│   │   │   │   ├── refresh/     # Renovación silenciosa y rotación de tokens JWT
│   │   │   │   ├── logout/      # Cierre de sesión, eliminación de cookies y revocación de hash en BD
│   │   │   │   └── me/          # Datos del usuario autenticado actual
│   │   │   ├── spaces/
│   │   │   │   ├── route.ts     # Listar espacios (GET) y crear nuevo espacio (POST - Admin)
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts # Detalle de espacio (GET) y actualizar espacio (PUT - Admin)
│   │   │   │       └── status/  # Activar / desactivar espacio con validación de reservas futuras (PATCH - Admin)
│   │   │   └── bookings/
│   │   │       ├── route.ts     # Listar reservas propias (GET) y crear reserva (POST - Valida reglas 1 a 8)
│   │   │       └── [id]/
│   │   │           └── cancel/  # Cancelar reserva propia o admin (PATCH - Valida regla de >2h)
│   │   ├── globals.css          # Estilos globales y tokens con Tailwind CSS v4
│   │   └── layout.tsx           # Root Layout general con fuentes Geist, AuthProvider y LanguageProvider
│   ├── components/              # COMPONENTES COMPARTIDOS Y REUTILIZABLES
│   │   ├── auth/                # Formularios interactivos LoginForm y RegisterForm con Zod
│   │   ├── bookings/            # Componentes de reservas: BookingForm y tarjetas de estado
│   │   ├── common/              # ClientDate para evitar discrepancias de hidratación cliente/servidor (Req. 10)
│   │   ├── layout/              # PublicNavbar, Footer, AdminSidebar, AdminShell, ThemeToggle y LanguageSwitcher
│   │   └── spaces/              # SpaceCard con next/image y AdminSpaceActions
│   ├── context/                 # Contextos de React para estado global de autenticación y sesión
│   ├── i18n/                    # Módulo de internacionalización: LanguageContext y diccionarios es.json / en.json
│   ├── lib/                     # Librerías y utilidades transversales
│   │   ├── auth.ts              # Generación, firma y verificación de tokens JWT con jose
│   │   ├── cookies.ts           # Gestión centralizada de cookies httpOnly, secure y sameSite
│   │   ├── prisma.ts            # Instancia singleton de PrismaClient para desarrollo y producción
│   │   └── validations/         # Esquemas de validación con Zod para Auth y Espacios
│   ├── services/                # CAPA DE REGLAS DE NEGOCIO Y SERVICIOS EN EL BACKEND
│   │   ├── auth.service.ts      # Lógica de login, registro, rotación y revocación de tokens
│   │   ├── bookings.service.ts  # Cumplimiento exhaustivo de las 14 reglas de negocio de reservas
│   │   └── spaces.service.ts    # Creación, actualización y desactivación protegida de espacios
│   ├── types/                   # Definiciones de tipos e interfaces TypeScript estrictas (cero any)
│   └── proxy.ts                 # Proxy nativo de Next.js 16 para control perimetral de rutas y roles
├── .dockerignore                # Exclusiones de contexto para el build de Docker
├── .env.example                 # Plantilla de variables de entorno sin secretos
├── docker-compose.yml           # Orquestación de contenedor Docker para la aplicación
├── Dockerfile                   # Construcción multi-stage en Node.js Alpine
├── next.config.ts               # Configuración de Next.js con imágenes remotas y output standalone
├── package.json                 # Dependencias y scripts del proyecto
└── tsconfig.json                # Configuración de TypeScript en modo estricto
```

---

## 9. URL de la aplicación desplegada

* **URL en Producción (Vercel)**: [`https://cospace-pdn.vercel.app`](https://cospace-pdn.vercel.app) *(o la URL asignada al vincular este repositorio en tu cuenta de Vercel)*.
* **Base de Datos en la Nube (Supabase)**: Proyecto `PruebaNext` alojado en AWS us-east-1 (`wavaaxpygidrjgwazolt.supabase.co`).

### Pasos para Despliegue en Vercel
1. Importa el repositorio desde GitHub en [Vercel](https://vercel.com/new).
2. En la sección **Environment Variables**, añade las variables descritas en la sección 3 (`DATABASE_URL`, `DIRECT_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `ACCESS_TOKEN_EXPIRES_IN`, `REFRESH_TOKEN_EXPIRES_IN` y `NEXT_PUBLIC_APP_URL`).
3. Haz clic en **Deploy**. El archivo `next.config.ts` y las rutas dinámicas son compatibles de forma nativa con Vercel.

---

## 10. Matriz de Cumplimiento de Requerimientos y Reglas de Negocio

A continuación se resume cómo cada requerimiento del enunciado fue implementado y garantizado:

### Requerimientos Técnicos
| Requerimiento | Implementación | Archivo Clave |
|---|---|---|
| **Estructura y TypeScript** | Proyecto Next.js 16 con App Router, tipado estricto sin `any`. | [`tsconfig.json`](file:///tsconfig.json), [`src/types/index.ts`](file:///src/types/index.ts) |
| **Route Groups y Dinámicas** | Grupos `(public)`, `(auth)`, `(private)`, `(admin)` y ruta `[id]` para detalle. | [`src/app/`](file:///src/app/) |
| **Layouts Personalizados** | Root layout, layout público (navbar/footer), auth (centrado), private (menú usuario) y admin (panel lateral). | [`src/app/**/layout.tsx`](file:///src/app/) |
| **Estrategias de Renderizado** | SSG en Home (`/`), SSR en Catálogo y Detalle (`/spaces`), CSR en Dashboard (`/dashboard`). | [`src/app/page.tsx`](file:///src/app/page.tsx), [`src/app/(public)/spaces/`](file:///src/app/(public)/spaces/) |
| **Route Handlers** | APIs REST completas con validación Zod y códigos HTTP adecuados (400, 401, 403, 404, 409). | [`src/app/api/`](file:///src/app/api/) |
| **ORM y Base de Datos** | Prisma ORM 6 sobre PostgreSQL en Supabase, migraciones y seed. | [`prisma/schema.prisma`](file:///prisma/schema.prisma), [`prisma/seed.ts`](file:///prisma/seed.ts) |
| **Autenticación Segura** | Contraseñas hasheadas (bcrypt), Access (15m) y Refresh (7d) en cookies `httpOnly`, `secure`, `sameSite`. Refresh token hasheado en BD con revocación en logout. | [`src/lib/auth.ts`](file:///src/lib/auth.ts), [`src/services/auth.service.ts`](file:///src/services/auth.service.ts) |
| **Protección con Proxy** | `proxy.ts` intercepta peticiones privadas y administrativas antes de renderizar. | [`src/proxy.ts`](file:///src/proxy.ts) |
| **Internacionalización (i18n)** | Soporte bilingüe (ES / EN) con selector de idioma accesible desde cualquier página. | [`src/i18n/`](file:///src/i18n/) |
| **Prevención de Error de Hidratación** | Componente `ClientDate` para renderizar fechas locales en el cliente sin causar mismatch SSR/CSR. | [`src/components/common/ClientDate.tsx`](file:///src/components/common/ClientDate.tsx) |
| **Optimización de Imágenes** | Componente `next/image` con dominios remotos configurados para imágenes de espacios. | [`next.config.ts`](file:///next.config.ts), [`src/components/spaces/SpaceCard.tsx`](file:///src/components/spaces/SpaceCard.tsx) |
| **Docker y Compose** | Dockerfile multi-etapa con usuario sin privilegios y docker-compose.yml. | [`Dockerfile`](file:///Dockerfile), [`docker-compose.yml`](file:///docker-compose.yml) |

### Reglas de Negocio de Reservas y Catálogo
| # | Regla de Negocio | Validación en Servidor |
|---|---|---|
| **1** | Reserva entre 1 y 4 horas completas (ej: 10:00 a 12:00, no minutos fraccionados). | `bookings.service.ts` valida `diffHours >= 1 && diffHours <= 4` y minutos exactos en 00. |
| **2** | Horario permitido exclusivamente entre las 07:00 y las 21:00. | `bookings.service.ts` valida hora de inicio >= 7 y fin <= 21. |
| **3** | No se puede reservar en el pasado ni con más de 30 días de anticipación. | `bookings.service.ts` compara contra `Date.now()` y `Date.now() + 30 días`. |
| **4** | Bloqueo de solapamiento en el mismo espacio (si termina a las 12:00, otra puede iniciar a las 12:00). | `bookings.service.ts` busca solapamiento con reservas confirmadas (`status = CONFIRMED`). |
| **5** | Un usuario no puede tener dos reservas que se solapen en el tiempo en espacios distintos. | `bookings.service.ts` consulta reservas confirmadas del mismo usuario en el rango temporal. |
| **6** | Máximo 3 reservas futuras confirmadas por usuario. | `bookings.service.ts` cuenta reservas con `status = CONFIRMED` y `startTime > now`. |
| **7** | No se puede reservar un espacio desactivado (`isActive = false`). | `bookings.service.ts` verifica `space.isActive === true`. |
| **8** | Precio total calculado en el servidor (horas × precio por hora). El valor del cliente nunca se confía. | `bookings.service.ts` calcula `diffHours * Number(space.pricePerHour)`. |
| **9** | Solo el dueño de la reserva o un administrador puede cancelarla. | `bookings.service.ts` verifica `booking.userId === userId \|\| userRole === 'ADMIN'`. |
| **10** | Un usuario puede cancelar su reserva con al menos 2 horas de anticipación a su inicio. | `bookings.service.ts` verifica `(booking.startTime - now) >= 2 horas`. |
| **11** | Cancelar cambia el estado a `CANCELLED`, nunca se borra el registro de la BD. | `bookings.service.ts` ejecuta `prisma.booking.update({ data: { status: 'CANCELLED' } })`. |
| **12** | Los espacios nunca se eliminan físicamente; se desactivan (`isActive = false`). | `spaces.service.ts` ejecuta borrado lógico cambiando `isActive = false`. |
| **13** | No se puede desactivar un espacio que cuente con reservas futuras confirmadas. | `spaces.service.ts` verifica existencia de reservas futuras con `status = CONFIRMED`. |
| **14** | Seguridad: un usuario no puede ver ni modificar reservas de otro usuario. | Protegido en `proxy.ts`, route handlers y services verificando la identidad en sesión. |
