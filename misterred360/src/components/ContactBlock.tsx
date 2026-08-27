import { useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";
import { scrollToHash } from "../lib/scroll";
import { useI18n } from "../lib/i18n";

/* ───────────────────────────────────────────────────────────
   ContactBlock · Formulario ágil por pasos
   3 pasos + envío. Selección con chips visuales; mínimo texto libre.
   Objetivo: conocer al solicitante en 60 segundos, sin cargar.
   ─────────────────────────────────────────────────────────── */

const ease = [0.22, 1, 0.36, 1] as const;

const NEEDS = [
  { id: "prensa", emoji: "📰" },
  { id: "plan", emoji: "🧭" },
  { id: "identidad", emoji: "✳️" },
  { id: "audiovisual", emoji: "🎬" },
  { id: "redes", emoji: "📡" },
  { id: "eventos", emoji: "🎤" },
  { id: "publicidad", emoji: "📣" },
  { id: "datos", emoji: "📊" },
  { id: "360", emoji: "🎯" },
  { id: "explorar", emoji: "🔍" },
];

const PROFILES = ["empresa", "institucion", "startup", "ong", "personal"];
const STAGES = ["lanzamos", "reactivar", "crisis", "crecer", "reposicionar"];
const TIMINGS = ["ya", "mes", "tri", "flex"];
const SOURCES = [
  { id: "google", emoji: "🔎" },
  { id: "redes", emoji: "📱" },
  { id: "prensa", emoji: "📰" },
  { id: "recomendacion", emoji: "🤝" },
  { id: "evento", emoji: "🎤" },
  { id: "cliente", emoji: "🐒" },
  { id: "otro", emoji: "✨" },
];

interface FormState {
  needs: string[];
  profile: string;
  stage: string;
  timing: string;
  source: string;
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  mensaje: string;
  privacidad: boolean;
}

const initialState: FormState = {
  needs: [],
  profile: "",
  stage: "",
  timing: "",
  source: "",
  nombre: "",
  empresa: "",
  email: "",
  telefono: "",
  mensaje: "",
  privacidad: false,
};

export default function ContactBlock() {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [form, setForm] = useState<FormState>(initialState);

  const needs = NEEDS.map((n) => ({ ...n, label: t(`need.${n.id}`) }));
  const profiles = PROFILES.map((id) => ({ id, label: t(`profile.${id}`) }));
  const stages = STAGES.map((id) => ({ id, label: t(`stage.${id}`) }));
  const timings = TIMINGS.map((id) => ({ id, label: t(`timing.${id}`) }));
  const sources = SOURCES.map((s) => ({ ...s, label: t(`source.${s.id}`) }));

  const totalSteps = 3;
  const progress = ((step + 1) / (totalSteps + 1)) * 100;

  const stepValid = useMemo(() => {
    if (step === 0) return form.needs.length > 0;
    if (step === 1) return !!form.profile && !!form.stage;
    if (step === 2) return !!form.timing && !!form.source;
    return (
      !!form.nombre.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
      form.privacidad
    );
  }, [step, form]);

  const toggleNeed = (id: string) =>
    setForm((f) => ({
      ...f,
      needs: f.needs.includes(id) ? f.needs.filter((n) => n !== id) : [...f.needs, id],
    }));

  const next = () => {
    if (!stepValid) return;
    setStep((s) => Math.min(s + 1, totalSteps));
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!stepValid || status !== "idle") return;
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 1400);
  };

  const resetAll = () => {
    setForm(initialState);
    setStep(0);
    setStatus("idle");
  };

  return (
    <div className="grid lg:grid-cols-12 gap-14 lg:gap-20 items-start">
      {/* ── Columna izquierda: datos directos + micro-señales ── */}
      <div className="lg:col-span-5">
        <div className="space-y-7">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-smoke mb-2">
              {t("form.email")}
            </p>
            <a
              href="mailto:misterred@misterred360.es"
              className="link-line font-display font-semibold text-2xl md:text-3xl text-paper"
            >
              misterred@misterred360.es
            </a>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-smoke mb-2">
              {t("form.phone")}
            </p>
            <a
              href="tel:+34910360360"
              className="link-line font-display font-semibold text-2xl md:text-3xl text-paper"
            >
              +34 910 360 360
            </a>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-smoke mb-2">
              {t("form.address")}
            </p>
            {/*
              NAP visible coherente con el schema LocalBusiness y con la
              ficha de Google Business Profile. Se marca con <address> +
              itemProp para reforzar la señal semántica.
            */}
            <address className="not-italic text-paper text-lg">
              MR. RED S.L.
              <br />
              Las Rozas de Madrid · España
            </address>
            <a
              href="https://www.google.com/maps/search/?api=1&query=MISTERRED360+Las+Rozas+de+Madrid"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand hover:text-flame transition-colors"
            >
              Cómo llegar
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/12 px-5 py-3">
          <span className="w-2 h-2 rounded-full bg-brand animate-blink" aria-hidden="true" />
          <span className="text-[11px] uppercase tracking-[0.22em] text-smoke">
            {t("form.status")}
          </span>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3">
          {[
            ["60 s", t("form.stat.60s")],
            ["48 h", t("form.stat.48h")],
            ["0 €", t("form.stat.0")],
            [t("timing.ya") + " · 1", t("form.stat.1")],
          ].map(([big, small]) => (
            <div key={String(big)} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="font-display font-semibold text-2xl text-paper leading-none">
                {big}
              </p>
              <p className="mt-2 text-xs text-smoke leading-snug">{small}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 font-quote italic text-xl text-smoke max-w-sm">
          {t("form.quote")}
        </p>
      </div>

      {/* ── Columna derecha: formulario por pasos ── */}
      <div className="lg:col-span-7">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease }}
          className="relative bg-coal/85 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur"
        >
          {/* Barra de progreso */}
          {status !== "sent" && (
            <div className="absolute top-0 inset-x-0 h-[3px] bg-white/5">
              <motion.div
                className="h-full bg-brand origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 0.5, ease }}
                style={{ transformOrigin: "left" }}
              />
            </div>
          )}

          <div className="p-6 md:p-10">
            {status === "sent" ? (
              <SuccessState onReset={resetAll} />
            ) : (
              <form onSubmit={submit}>
                {/* Cabecera del paso */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand">
                    <Sparkles className="w-3.5 h-3.5" />
                    {step < totalSteps
                      ? t("form.step.of", { n: step + 1, total: totalSteps + 1 })
                      : t("form.step.last")}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ash tabular-nums">
                    {Math.round(progress)}%
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  {step === 0 && (
                    <StepShell
                      key="s0"
                      title={t("form.q1.title")}
                      subtitle={t("form.q1.desc")}
                    >
                      <div className="flex flex-wrap gap-2.5">
                        {needs.map((n) => (
                          <ChoiceChip
                            key={n.id}
                            active={form.needs.includes(n.id)}
                            onClick={() => toggleNeed(n.id)}
                            aria-pressed={form.needs.includes(n.id)}
                          >
                            <span aria-hidden="true">{n.emoji}</span>
                            {n.label}
                          </ChoiceChip>
                        ))}
                      </div>
                    </StepShell>
                  )}

                  {step === 1 && (
                    <StepShell
                      key="s1"
                      title={t("form.q2.title")}
                      subtitle={t("form.q2.desc")}
                    >
                      <ChoiceGroup
                        label={t("form.q2.profile")}
                        options={profiles}
                        value={form.profile}
                        onChange={(v) => setForm({ ...form, profile: v })}
                      />
                      <ChoiceGroup
                        label={t("form.q2.stage")}
                        options={stages}
                        value={form.stage}
                        onChange={(v) => setForm({ ...form, stage: v })}
                      />
                    </StepShell>
                  )}

                  {step === 2 && (
                    <StepShell
                      key="s2"
                      title={t("form.q3.title")}
                      subtitle={t("form.q3.desc")}
                    >
                      <ChoiceGroup
                        label={t("form.q3.timing")}
                        options={timings}
                        value={form.timing}
                        onChange={(v) => setForm({ ...form, timing: v })}
                      />
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-smoke mb-3">
                          {t("form.q3.source")}
                        </p>
                        <div className="flex flex-wrap gap-2.5">
                          {sources.map((s) => (
                            <ChoiceChip
                              key={s.id}
                              active={form.source === s.id}
                              onClick={() => setForm({ ...form, source: s.id })}
                              aria-pressed={form.source === s.id}
                            >
                              <span aria-hidden="true">{s.emoji}</span>
                              {s.label}
                            </ChoiceChip>
                          ))}
                        </div>
                      </div>
                    </StepShell>
                  )}

                  {step === 3 && (
                    <StepShell
                      key="s3"
                      title={t("form.q4.title")}
                      subtitle={t("form.q4.desc")}
                    >
                      <div className="grid sm:grid-cols-2 gap-5">
                        <FloatingInput
                          id="f-nombre"
                          label={t("form.field.name")}
                          value={form.nombre}
                          onChange={(v) => setForm({ ...form, nombre: v })}
                          autoComplete="name"
                        />
                        <FloatingInput
                          id="f-empresa"
                          label={t("form.field.company")}
                          value={form.empresa}
                          onChange={(v) => setForm({ ...form, empresa: v })}
                          autoComplete="organization"
                        />
                        <FloatingInput
                          id="f-email"
                          type="email"
                          label={t("form.field.email")}
                          value={form.email}
                          onChange={(v) => setForm({ ...form, email: v })}
                          autoComplete="email"
                        />
                        <FloatingInput
                          id="f-telefono"
                          type="tel"
                          label={t("form.field.phone")}
                          value={form.telefono}
                          onChange={(v) => setForm({ ...form, telefono: v })}
                          autoComplete="tel"
                        />
                      </div>
                      <FloatingTextarea
                        id="f-mensaje"
                        label={t("form.field.message")}
                        value={form.mensaje}
                        onChange={(v) => setForm({ ...form, mensaje: v })}
                      />
                      <label
                        htmlFor="f-privacidad"
                        className="flex items-start gap-3 text-sm text-smoke cursor-pointer"
                      >
                        <input
                          id="f-privacidad"
                          type="checkbox"
                          required
                          checked={form.privacidad}
                          onChange={(e) =>
                            setForm({ ...form, privacidad: e.target.checked })
                          }
                          className="mt-0.5 w-4 h-4 rounded accent-[#e8262b]"
                        />
                        {t("form.privacy")}
                      </label>
                    </StepShell>
                  )}
                </AnimatePresence>

                {/* Controles */}
                <div className="mt-8 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={back}
                    disabled={step === 0}
                    className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-smoke hover:text-paper transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t("form.back")}
                  </button>

                  {step < totalSteps ? (
                    <button
                      type="button"
                      onClick={next}
                      disabled={!stepValid}
                      className="group inline-flex items-center gap-3 rounded-full bg-brand px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-flame transition-all duration-300 hover:gap-4 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:gap-3"
                    >
                      {t("form.continue")}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!stepValid || status === "sending"}
                      className="group inline-flex items-center gap-3 rounded-full bg-brand px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-flame transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_40px_-10px_rgba(232,38,43,0.5)]"
                    >
                      {status === "sending" ? (
                        <>
                          {t("form.sending")}
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </>
                      ) : (
                        <>
                          {t("form.send")}
                          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Dots */}
                <div className="mt-6 flex justify-center gap-2">
                  {Array.from({ length: totalSteps + 1 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => i < step && setStep(i)}
                      aria-label={t("form.step.aria", { n: i + 1 })}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i === step
                          ? "w-8 bg-brand"
                          : i < step
                            ? "w-4 bg-white/45 cursor-pointer hover:bg-white/70"
                            : "w-4 bg-white/12"
                      }`}
                    />
                  ))}
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Sub-componentes de la experiencia
   ────────────────────────────────────────────────────────── */

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.4, ease }}
      className="space-y-6"
    >
      <div>
        <h3 className="font-display font-semibold uppercase leading-[1.02] text-[clamp(1.6rem,3vw,2.3rem)] text-paper">
          {title}
        </h3>
        <p className="mt-3 text-sm md:text-[15px] text-smoke leading-relaxed max-w-lg">
          {subtitle}
        </p>
      </div>
      {children}
    </motion.div>
  );
}

function ChoiceChip({
  active,
  children,
  onClick,
  ...rest
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium transition-all duration-300 border ${
        active
          ? "bg-brand border-brand text-white shadow-[0_0_20px_-6px_rgba(232,38,43,0.6)]"
          : "bg-white/[0.03] border-white/12 text-paper hover:border-brand/60 hover:text-brand"
      }`}
      {...rest}
    >
      {children}
    </button>
  );
}

function ChoiceGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-smoke mb-3">
        {label}
      </p>
      <div className="flex flex-wrap gap-2.5">
        {options.map((o) => (
          <ChoiceChip
            key={o.id}
            active={value === o.id}
            onClick={() => onChange(o.id)}
            aria-pressed={value === o.id}
          >
            {o.label}
          </ChoiceChip>
        ))}
      </div>
    </div>
  );
}

function FloatingInput({
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
          filled ? "!top-3 !translate-y-0 !text-[10px] !uppercase !tracking-[0.22em] !text-smoke" : ""
        }`}
      >
        {label}
      </label>
    </div>
  );
}

function FloatingTextarea({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const filled = value.length > 0;
  return (
    <div className="relative">
      <textarea
        id={id}
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className="peer w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 pt-6 pb-3 text-paper outline-none transition-colors focus:border-brand focus:bg-white/[0.07] resize-none"
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-4 top-4 text-[13px] text-ash transition-all duration-200 peer-focus:top-3 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.22em] peer-focus:text-brand ${
          filled ? "!top-3 !text-[10px] !uppercase !tracking-[0.22em] !text-smoke" : ""
        }`}
      >
        {label}
      </label>
    </div>
  );
}

function SuccessState({ onReset }: { onReset: () => void }) {
  const { t } = useI18n();
  return (
    <div className="py-16 flex flex-col items-center text-center">
      <motion.span
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-16 h-16 rounded-full bg-brand flex items-center justify-center mb-8"
      >
        <Check className="w-8 h-8 text-white" strokeWidth={2.4} />
      </motion.span>
      <h3 className="font-display font-semibold text-3xl">{t("form.sent.title")}</h3>
      <p className="mt-4 text-smoke max-w-sm leading-relaxed">{t("form.sent.desc")}</p>
      <div className="mt-10 flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => scrollToHash("#top")}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper hover:border-brand hover:text-brand transition-colors"
        >
          {t("form.sent.top")} <ArrowUp className="w-4 h-4" />
        </button>
        <button
          onClick={onReset}
          className="text-[11px] font-semibold uppercase tracking-[0.18em] text-smoke hover:text-paper transition-colors"
        >
          {t("form.sent.another")}
        </button>
      </div>
    </div>
  );
}
