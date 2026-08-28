import { siteContact } from "./data";

/* ───────────────────────────────────────────────────────────
   MISTERRED360 · Configuración de WhatsApp
   Centraliza el número, mensaje por defecto y ajustes de la
   integración con la Cloud API de Meta para respuestas
   automáticas con IA (opcional).
   ─────────────────────────────────────────────────────────── */

export interface WhatsAppConfig {
  /* Número en formato internacional SIN + ni espacios (ej: 34609904063) */
  phone: string;
  /* Texto pre-rellenado en el chat cuando el usuario abre WhatsApp */
  defaultMessage: string;
  /* Nombre visible en la ventana emergente */
  agentName: string;
  /* Rol del agente (ej: "Comunicación estratégica") */
  agentRole: string;
  /* Horario laboral en formato "HH:MM-HH:MM" para mostrar disponibilidad */
  hours: {
    weekdays: string;
    weekend?: string;
  };
  /* Mensaje que se muestra si el usuario escribe fuera de horario */
  offlineMessage: string;
  /* Si está activo, muestra un tooltip auto al cabo de X segundos */
  autoTeaser: {
    enabled: boolean;
    delayMs: number;
    text: string;
  };
}

export const whatsappConfig: WhatsAppConfig = {
  /* Se toma del teléfono editable en /admin ("Marca, footer y contacto")
     para que WhatsApp nunca quede desincronizado con el resto de la web. */
  phone: siteContact.phoneHref.replace(/^\+/, ""),
  defaultMessage:
    "Hola MISTERRED360, me gustaría hablar sobre un proyecto de comunicación.",
  agentName: "MISTERRED360",
  agentRole: "Contesta una persona · en 24h",
  hours: {
    weekdays: "09:00 – 18:00",
  },
  offlineMessage:
    "Estamos fuera de horario. Escríbenos igualmente: contestaremos a primera hora del próximo día laborable.",
  autoTeaser: {
    enabled: true,
    delayMs: 12000,
    text: "¿Hablamos por WhatsApp?",
  },
};

/* Devuelve true si ahora estamos dentro del horario laboral (Lun–Vie 09-18) */
export function isBusinessHoursNow(): boolean {
  const now = new Date();
  const day = now.getDay(); // 0 domingo, 6 sábado
  const hour = now.getHours();
  return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
}

/* Construye la URL wa.me con mensaje pre-rellenado */
export function buildWhatsAppUrl(msg?: string): string {
  const text = encodeURIComponent(msg ?? whatsappConfig.defaultMessage);
  return `https://wa.me/${whatsappConfig.phone}?text=${text}`;
}
