import { useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sunrise,
  Sunset,
} from "lucide-react";
import { useI18n } from "../lib/i18n";

/* ───────────────────────────────────────────────────────────
   BookingBlock · Pedir una llamada
   Modelo simple: día + franja horaria aproximada (mañana o
   tarde) + datos mínimos. NOSOTROS le llamamos, no es una
   reserva de agenda con hora exacta.
   ─────────────────────────────────────────────────────────── */

const ease = [0.22, 1, 0.36, 1] as const;

const SLOTS: {
  id: "morning" | "afternoon";
  icon: typeof Sunrise;
  hours: string;
}[] = [
  { id: "morning", icon: Sunrise, hours: "09:00 · 13:30" },
  { id: "afternoon", icon: Sunset, hours: "16:00 · 18:00" },
];

/* Genera 5 días laborables consecutivos a partir de un offset semanal */
function useBusinessDays(cursorOffset: number) {
  return useMemo(() => {
    const days: Date[] = [];
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    let added = 0;
    let offset = cursorOffset * 7 + 1; // empieza mañana
    while (added < 5) {
      const d = new Date(start);
      d.setDate(start.getDate() + offset);
      const wd = d.getDay();
      if (wd !== 0 && wd !== 6) {
        days.push(d);
        added++;
      }
      offset++;
    }
    return days;
  }, [cursorOffset]);
}

interface Form {
  date: string;
  slot: "morning" | "afternoon" | "";
  nombre: string;
  telefono: string;
  email: string;
  tema: string;
  privacidad: boolean;
}

const initialForm: Form = {
  date: "",
  slot: "",
  nombre: "",
  telefono: "",
  email: "",
  tema: "",
  privacidad: false,
};

export default function BookingBlock() {
  const { t, locale } = useI18n();
  const [week, setWeek] = useState(0);
  const [form, setForm] = useState<Form>(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const days = useBusinessDays(week);

  const canSubmit =
    !!form.date &&
    !!form.slot &&
    !!form.nombre.trim() &&
    /^[+\d\s()-]{7,}$/.test(form.telefono) &&
    form.privacidad;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || status !== "idle") return;
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 1300);
  };

  const dayFmt = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const fullDayFmt = new Intl.DateTimeFormat(
    locale === "en" ? "en-GB" : "es-ES",
    { weekday: "long", day: "numeric", month: "long" }
  );

  const reset = () => {
    setForm(initialForm);
    setWeek(0);
    setStatus("idle");
  };

  if (status === "sent") {
    return <SuccessState form={form} fullDayFmt={fullDayFmt} onReset={reset} />;
  }

  return (
    <form onSubmit={submit} className="space-y-9">
      {/* ── PASO 1 · Día ── */}
      <section aria-labelledby="call-step-1">
        <div className="flex items-center justify-between gap-4">
          <StepHeader n={1} title={t("call.step.1.title")} />
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setWeek((v) => Math.max(0, v - 1))}
              disabled={week === 0}
              aria-label={t("call.prev")}
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-smoke hover:text-paper hover:border-white/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setWeek((v) => Math.min(3, v + 1))}
              disabled={week === 3}
              aria-label={t("call.next")}
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-smoke hover:text-paper hover:border-white/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {days.map((d) => {
            const iso = d.toISOString().slice(0, 10);
            const active = form.date === iso;
            return (
              <button
                key={iso}
                type="button"
                onClick={() => setForm({ ...form, date: iso })}
                aria-pressed={active}
                className={`rounded-xl border py-3 px-2 flex flex-col items-center gap-1 transition-all duration-300 ${
                  active
                    ? "bg-brand border-brand text-white"
                    : "bg-white/[0.02] border-white/12 text-paper hover:border-brand/60"
                }`}
              >
                <span
                  className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${
                    active ? "text-white/85" : "text-smoke"
                  }`}
                >
                  {dayFmt.format(d).split(" ")[0]}
                </span>
                <span className="font-display font-semibold text-lg leading-none">
                  {d.getDate()}
                </span>
                <span
                  className={`text-[9px] uppercase tracking-[0.14em] ${
                    active ? "text-white/70" : "text-ash"
                  }`}
                >
                  {d.toLocaleString(locale === "en" ? "en-GB" : "es-ES", {
                    month: "short",
                  })}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── PASO 2 · Franja horaria aproximada ── */}
      <section aria-labelledby="call-step-2">
        <StepHeader n={2} title={t("call.step.2.title")} />
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SLOTS.map((s) => {
            const Icon = s.icon;
            const active = form.slot === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setForm({ ...form, slot: s.id })}
                aria-pressed={active}
                className={`text-left rounded-2xl border p-4 flex items-center gap-4 transition-all duration-300 ${
                  active
                    ? "bg-brand border-brand text-white shadow-[0_0_28px_-10px_rgba(232,38,43,0.6)]"
                    : "bg-white/[0.02] border-white/12 text-paper hover:border-brand/60"
                }`}
              >
                <span
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                    active ? "bg-white/15" : "bg-white/[0.04] border border-white/12"
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.7} />
                </span>
                <div>
                  <p className="font-display font-semibold text-base leading-tight">
                    {t(`call.slot.${s.id}`)}
                  </p>
                  <p
                    className={`mt-0.5 text-xs ${
                      active ? "text-white/80" : "text-smoke"
                    }`}
                  >
                    {s.hours}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── PASO 3 · Datos ── */}
      <AnimatePresence>
        {form.date && form.slot && (
          <motion.section
            aria-labelledby="call-step-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <StepHeader n={3} title={t("call.step.3.title")} />
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <FloatInput
                id="call-nombre"
                label={t("call.field.name")}
                value={form.nombre}
                onChange={(v) => setForm({ ...form, nombre: v })}
                autoComplete="name"
              />
              <FloatInput
                id="call-tel"
                type="tel"
                label={t("call.field.phone")}
                value={form.telefono}
                onChange={(v) => setForm({ ...form, telefono: v })}
                autoComplete="tel"
              />
              <FloatInput
                id="call-email"
                type="email"
                label={t("call.field.email")}
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                autoComplete="email"
              />
              <FloatInput
                id="call-tema"
                label={t("call.field.topic")}
                value={form.tema}
                onChange={(v) => setForm({ ...form, tema: v })}
              />
              <label
                htmlFor="call-privacidad"
                className="sm:col-span-2 flex items-start gap-3 text-sm text-smoke cursor-pointer"
              >
                <input
                  id="call-privacidad"
                  type="checkbox"
                  required
                  checked={form.privacidad}
                  onChange={(e) =>
                    setForm({ ...form, privacidad: e.target.checked })
                  }
                  className="mt-0.5 w-4 h-4 rounded accent-[#e8262b]"
                />
                {t("call.privacy")}
              </label>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Confirmación ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        {form.date && form.slot ? (
          <p className="text-sm text-smoke">
            <CalendarDays className="w-4 h-4 inline mr-2 -mt-0.5 text-brand" />
            <span className="text-paper font-semibold">
              {fullDayFmt.format(new Date(form.date))}
            </span>{" "}
            · {t(`call.slot.${form.slot}`).toLowerCase()}
          </p>
        ) : (
          <p className="text-sm text-ash italic">{t("call.pending")}</p>
        )}
        <button
          type="submit"
          disabled={!canSubmit || status === "sending"}
          className="group inline-flex items-center justify-center gap-3 rounded-full bg-brand px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-flame transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_36px_-10px_rgba(232,38,43,0.55)]"
        >
          {status === "sending" ? (
            <>
              {t("call.sending")}
              <Loader2 className="w-4 h-4 animate-spin" />
            </>
          ) : (
            <>
              {t("call.confirm")}
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
            </>
          )}
        </button>
      </div>

    </form>
  );
}

/* ────────────────────────────────────────────────────────── */

function StepHeader({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-7 h-7 rounded-full bg-brand text-white text-[11px] font-semibold flex items-center justify-center">
        {n}
      </span>
      <h3 className="font-display font-semibold text-lg md:text-xl leading-tight text-paper">
        {title}
      </h3>
    </div>
  );
}

function FloatInput({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  const filled = value.length > 0;
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder=" "
        className="peer w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 pt-6 pb-2 text-paper outline-none transition-colors focus:border-brand focus:bg-white/[0.07]"
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-ash transition-all duration-200 peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.22em] peer-focus:text-brand ${
          filled
            ? "!top-3 !translate-y-0 !text-[10px] !uppercase !tracking-[0.22em] !text-smoke"
            : ""
        }`}
      >
        {label}
      </label>
    </div>
  );
}

function SuccessState({
  form,
  fullDayFmt,
  onReset,
}: {
  form: Form;
  fullDayFmt: Intl.DateTimeFormat;
  onReset: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="py-8 flex flex-col items-center text-center">
      <motion.span
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.7, ease }}
        className="w-16 h-16 rounded-full bg-brand flex items-center justify-center mb-8"
      >
        <Check className="w-8 h-8 text-white" strokeWidth={2.4} />
      </motion.span>
      <h3 className="font-display font-semibold text-3xl">{t("call.sent.title")}</h3>
      <p className="mt-4 text-smoke max-w-md leading-relaxed">{t("call.sent.desc")}</p>
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-left inline-flex flex-col gap-1.5 text-sm">
        <span className="text-brand text-[10px] font-semibold uppercase tracking-[0.24em]">
          {t("call.sent.card")}
        </span>
        <span className="text-paper font-semibold">
          {fullDayFmt.format(new Date(form.date))}
        </span>
        <span className="text-smoke">
          {t(`call.slot.${form.slot}`)} · {form.telefono}
        </span>
      </div>
      <div className="mt-8 flex justify-center">
        <button
          onClick={onReset}
          className="text-[11px] font-semibold uppercase tracking-[0.18em] text-smoke hover:text-paper transition-colors"
        >
          {t("call.sent.another")}
        </button>
      </div>
    </div>
  );
}
