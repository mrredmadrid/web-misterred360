import { siteContact } from "./data";

/* ───────────────────────────────────────────────────────────
   Envío de formularios (contacto y llamada) por email
   ────────────────────────────────────────────────────────────
   La web es estática (sin servidor propio), así que el envío
   pasa por FormSubmit (https://formsubmit.co): un servicio
   gratuito sin registro que reenvía el POST a una bandeja de
   entrada real. La primera vez que llega un envío de verdad,
   FormSubmit manda un email de confirmación a esa dirección
   que hay que abrir una sola vez para activar el buzón.
   ─────────────────────────────────────────────────────────── */

const ENDPOINT = `https://formsubmit.co/ajax/${siteContact.email}`;

export async function sendLead(
  subject: string,
  fields: Record<string, string>
): Promise<boolean> {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        ...fields,
        _subject: subject,
        _template: "table",
        _captcha: "false",
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
