"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Power,
  PowerOff,
  Users,
} from "lucide-react";
import type { SpaceType } from "@/types";
import { useLanguage } from "@/i18n/LanguageContext";

export interface AdminSpaceItem {
  id: string;
  name: string;
  description: string;
  type: SpaceType;
  capacity: number;
  pricePerHour: number;
  imageUrl?: string | null;
  isActive: boolean;
  futureBookingsCount: number;
}

export function AdminSpaceActions({
  initialSpaces,
}: {
  initialSpaces: AdminSpaceItem[];
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const [spaces, setSpaces] = useState<AdminSpaceItem[]>(initialSpaces);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingSpaceId, setEditingSpaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<SpaceType>("DESK");
  const [capacity, setCapacity] = useState("1");
  const [pricePerHour, setPricePerHour] = useState("20000");
  const [imageUrl, setImageUrl] = useState("");

  const total = spaces.length;
  const activeCount = spaces.filter((s) => s.isActive).length;
  const inactiveCount = total - activeCount;

  const handleOpenCreate = () => {
    setModalMode("create");
    setEditingSpaceId(null);
    setName("");
    setDescription("");
    setType("DESK");
    setCapacity("1");
    setPricePerHour("20000");
    setImageUrl("");
    setMessage(null);
    setShowModal(true);
  };

  const handleOpenEdit = (space: AdminSpaceItem) => {
    setModalMode("edit");
    setEditingSpaceId(space.id);
    setName(space.name);
    setDescription(space.description || "");
    setType(space.type);
    setCapacity(String(space.capacity));
    setPricePerHour(String(space.pricePerHour));
    setImageUrl(space.imageUrl || "");
    setMessage(null);
    setShowModal(true);
  };

  const handleSubmitSpace = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        name,
        description,
        type,
        capacity: parseInt(capacity, 10),
        pricePerHour: parseFloat(pricePerHour),
        imageUrl: imageUrl.trim() || undefined,
      };

      if (modalMode === "create") {
        const res = await fetch("/api/spaces", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Error al crear el espacio");
        }

        const newSpace: AdminSpaceItem = {
          id: data.data.id,
          name: data.data.name,
          description: data.data.description,
          type: data.data.type,
          capacity: data.data.capacity,
          pricePerHour: Number(data.data.pricePerHour),
          imageUrl: data.data.imageUrl,
          isActive: data.data.isActive ?? true,
          futureBookingsCount: 0,
        };

        setSpaces((prev) => [newSpace, ...prev]);
        setMessage({ text: t.admin.messages.created, type: "success" });
      } else {
        // Edit mode
        const res = await fetch(`/api/spaces/${editingSpaceId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Error al actualizar el espacio");
        }

        setSpaces((prev) =>
          prev.map((s) =>
            s.id === editingSpaceId
              ? {
                  ...s,
                  name: data.data.name,
                  description: data.data.description,
                  type: data.data.type,
                  capacity: data.data.capacity,
                  pricePerHour: Number(data.data.pricePerHour),
                  imageUrl: data.data.imageUrl,
                }
              : s
          )
        );
        setMessage({
          text: t.admin.messages.updated,
          type: "success",
        });
      }

      setShowModal(false);
      router.refresh();
    } catch (err) {
      setMessage({ text: (err as Error).message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (space: AdminSpaceItem) => {
    const targetActive = !space.isActive;

    if (!targetActive) {
      const confirmText = t.admin.messages.confirmDeactivate.replace(
        "{name}",
        space.name
      );
      if (!confirm(confirmText)) {
        return;
      }
    }

    setActionLoadingId(space.id);
    setMessage(null);

    try {
      const res = await fetch(`/api/spaces/${space.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: targetActive }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error ||
            (targetActive
              ? "Error al activar el espacio"
              : "Error al desactivar el espacio")
        );
      }

      setSpaces((prev) =>
        prev.map((s) =>
          s.id === space.id ? { ...s, isActive: targetActive } : s
        )
      );

      setMessage({
        text: targetActive
          ? t.admin.messages.activated
          : t.admin.messages.deactivated,
        type: "success",
      });
      router.refresh();
    } catch (err) {
      setMessage({ text: (err as Error).message, type: "error" });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div>
      {/* Encabezado y Métricas Rápidas (Adaptativo Mobile y Desktop) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <span className="text-xs font-bold text-blue-600 dark:text-[#00d2ff] uppercase tracking-widest">
            {t.admin.badge}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
            {t.admin.title}
          </h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {t.admin.subtitle}
          </p>
        </div>

        {/* Métricas rápidas: grid de 3 columnas en móvil, flex en desktop */}
        <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-3 shrink-0">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-2.5 sm:px-3.5 sm:py-2 rounded-xl text-center sm:text-left text-xs shadow-2xs">
            <span className="text-zinc-500 dark:text-zinc-400 block sm:inline">
              {t.admin.metrics.total}:{" "}
            </span>
            <strong className="text-zinc-900 dark:text-zinc-100 font-bold block sm:inline">
              {total}
            </strong>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 p-2.5 sm:px-3.5 sm:py-2 rounded-xl text-center sm:text-left text-xs text-emerald-700 dark:text-emerald-300 shadow-2xs">
            <span className="block sm:inline">{t.admin.metrics.active}: </span>
            <strong className="font-bold block sm:inline">{activeCount}</strong>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-2.5 sm:px-3.5 sm:py-2 rounded-xl text-center sm:text-left text-xs text-zinc-600 dark:text-zinc-400 shadow-2xs">
            <span className="block sm:inline">{t.admin.metrics.inactive}: </span>
            <strong className="font-bold block sm:inline">{inactiveCount}</strong>
          </div>
        </div>
      </div>

      {/* Botón Nuevo Espacio y Notificaciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <button
          type="button"
          onClick={handleOpenCreate}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{t.admin.actions.newSpace}</span>
        </button>

        {message && (
          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold border ${
              message.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50"
                : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}
      </div>

      {/* Modal Crear / Editar Espacio (Responsive) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#080816] border border-zinc-200 dark:border-white/10 p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-200 dark:border-white/10">
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                {modalMode === "edit" ? (
                  <>
                    <Pencil className="h-4 w-4 text-blue-600 dark:text-[#00d2ff]" />
                    <span>{t.admin.modal.editTitle}</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 text-blue-600 dark:text-[#00d2ff]" />
                    <span>{t.admin.modal.createTitle}</span>
                  </>
                )}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition p-1 rounded-lg cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitSpace} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  {t.admin.modal.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.admin.modal.namePlaceholder}
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  {t.admin.modal.descriptionLabel}
                </label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.admin.modal.descriptionPlaceholder}
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Grid adaptable: 1 columna en móvil, 3 en pantallas mayores */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    {t.admin.modal.typeLabel}
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as SpaceType)}
                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="DESK">{t.admin.types.DESK}</option>
                    <option value="MEETING_ROOM">
                      {t.admin.types.MEETING_ROOM}
                    </option>
                    <option value="CABIN">{t.admin.types.CABIN}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    {t.admin.modal.capacityLabel}
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    {t.admin.modal.priceLabel}
                  </label>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    required
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  {t.admin.modal.imageLabel}
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  {t.admin.actions.cancel}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer shadow-xs active:scale-95 transition"
                >
                  {loading
                    ? t.admin.actions.saving
                    : modalMode === "edit"
                    ? t.admin.actions.saveChanges
                    : t.admin.actions.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. Vista de Tarjetas Móviles (< md): Experiencia nativa para pantallas estrechas */}
      <div className="md:hidden space-y-3">
        {spaces.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#040410] p-4 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                  {s.name}
                </h4>
                {s.description && (
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 line-clamp-2 mt-0.5">
                    {s.description}
                  </p>
                )}
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                  s.isActive
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                    : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    s.isActive ? "bg-emerald-500" : "bg-zinc-400"
                  }`}
                />
                {s.isActive ? t.admin.table.active : t.admin.table.deactivated}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2.5 my-2 border-t border-b border-zinc-100 dark:border-white/5 text-center text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block">
                  {t.admin.table.type}
                </span>
                <span className="font-semibold text-zinc-700 dark:text-zinc-300 text-[11px] truncate block">
                  {t.admin.types[s.type] || s.type}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block">
                  {t.admin.table.capacity}
                </span>
                <span className="font-semibold text-zinc-700 dark:text-zinc-300 text-[11px]">
                  {s.capacity} {t.admin.table.max}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block">
                  {t.admin.table.pricePerHour}
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 text-[11px]">
                  ${s.pricePerHour.toLocaleString("es-CO")}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleOpenEdit(s)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10 active:scale-95 transition cursor-pointer shadow-2xs"
              >
                <Pencil className="h-3.5 w-3.5 text-blue-600 dark:text-[#00d2ff]" />
                <span>{t.admin.actions.edit}</span>
              </button>

              {s.isActive ? (
                <button
                  type="button"
                  disabled={actionLoadingId === s.id}
                  onClick={() => handleToggleStatus(s)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 active:scale-95 transition cursor-pointer disabled:opacity-50"
                  title={
                    s.futureBookingsCount > 0
                      ? t.admin.messages.futureBookingsWarning
                      : t.admin.actions.deactivate
                  }
                >
                  <PowerOff className="h-3.5 w-3.5" />
                  <span>{t.admin.actions.deactivate}</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={actionLoadingId === s.id}
                  onClick={() => handleToggleStatus(s)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 active:scale-95 transition cursor-pointer disabled:opacity-50"
                >
                  <Power className="h-3.5 w-3.5" />
                  <span>{t.admin.actions.activate}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 2. Vista de Tabla (Tablets y Desktop >= md): con scroll horizontal fluido y anchos adaptativos */}
      <div className="hidden md:block rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#040410] shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-white/10 text-zinc-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-5 py-3.5 whitespace-nowrap">
                  {t.admin.table.space}
                </th>
                <th className="px-4 py-3.5 whitespace-nowrap">
                  {t.admin.table.type}
                </th>
                <th className="px-4 py-3.5 whitespace-nowrap">
                  {t.admin.table.capacity}
                </th>
                <th className="px-4 py-3.5 whitespace-nowrap">
                  {t.admin.table.pricePerHour}
                </th>
                <th className="px-4 py-3.5 whitespace-nowrap">
                  {t.admin.table.status}
                </th>
                <th className="px-5 py-3.5 text-right whitespace-nowrap">
                  {t.admin.table.actions}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
              {spaces.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-zinc-50/60 dark:hover:bg-white/[0.02] transition"
                >
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-zinc-900 dark:text-zinc-100 max-w-[180px] lg:max-w-xs truncate">
                      {s.name}
                    </div>
                    {s.description && (
                      <div className="text-[11px] text-zinc-400 dark:text-zinc-500 max-w-[180px] lg:max-w-xs truncate">
                        {s.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-zinc-600 dark:text-zinc-300">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 font-medium text-[11px]">
                      {t.admin.types[s.type] || s.type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-zinc-600 dark:text-zinc-300">
                    <span className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                      <Users className="h-3.5 w-3.5 text-zinc-400" />
                      <span>
                        {s.capacity} {t.admin.table.max}
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap font-semibold text-zinc-900 dark:text-zinc-100">
                    ${s.pricePerHour.toLocaleString("es-CO")}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        s.isActive
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          s.isActive ? "bg-emerald-500" : "bg-zinc-400"
                        }`}
                      />
                      {s.isActive
                        ? t.admin.table.active
                        : t.admin.table.deactivated}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(s)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10 active:scale-95 transition cursor-pointer shadow-2xs"
                      >
                        <Pencil className="h-3.5 w-3.5 text-blue-600 dark:text-[#00d2ff]" />
                        <span>{t.admin.actions.edit}</span>
                      </button>

                      {s.isActive ? (
                        <button
                          type="button"
                          disabled={actionLoadingId === s.id}
                          onClick={() => handleToggleStatus(s)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 px-2.5 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 active:scale-95 transition cursor-pointer disabled:opacity-50"
                          title={
                            s.futureBookingsCount > 0
                              ? t.admin.messages.futureBookingsWarning
                              : t.admin.actions.deactivate
                          }
                        >
                          <PowerOff className="h-3.5 w-3.5" />
                          <span>{t.admin.actions.deactivate}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={actionLoadingId === s.id}
                          onClick={() => handleToggleStatus(s)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 active:scale-95 transition cursor-pointer disabled:opacity-50"
                        >
                          <Power className="h-3.5 w-3.5" />
                          <span>{t.admin.actions.activate}</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
