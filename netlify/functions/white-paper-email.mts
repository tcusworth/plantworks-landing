// Runs when a Netlify form submission is verified. Emails the white paper
// (as an attachment) to the person who submitted the white-paper form.
// Requires the RESEND_API_KEY environment variable in Netlify.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const PDF_NAME = "The-Hidden-Factory-ZLA-White-Paper.pdf";
const FROM = "Trevor Cusworth <trevor@plantworks.ai>";

function loadPdfBase64(): string {
  const roots = [process.cwd(), process.env.LAMBDA_TASK_ROOT, "/var/task"].filter(Boolean) as string[];
  for (const root of roots) {
    const p = join(root, "private", PDF_NAME);
    if (existsSync(p)) return readFileSync(p).toString("base64");
  }
  throw new Error("White paper PDF not found in function bundle. Checked: " + roots.join(", "));
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export default {
  async formSubmitted(event: any) {
    const d = (event && event.data) || {};
    if (d.source !== "white-paper") return; // ignore other forms (e.g. training-inquiry)

    const to = String(d.email || "").trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
      console.error("white-paper-email: invalid email, not sending");
      return;
    }
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("white-paper-email: RESEND_API_KEY is not set");
      return;
    }

    const first = esc(String(d.name || "").trim().split(/\s+/)[0] || "there");
    const html = `<p>Hi ${first},</p>
<p>Thanks for your interest. The white paper, <strong>The Hidden Factory: Zero Loss Analysis</strong>, is attached to this email.</p>
<p>If you'd like to talk about what this would look like for your plant, you can
<a href="https://cal.com/tcusworthfcs/plantworks-30-minute-discovery-call">book a 30-minute discovery call</a>
or just reply to this email.</p>
<p>Trevor Cusworth<br>Plantworks | <a href="https://plantworks.ai">plantworks.ai</a></p>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [to],
        reply_to: "trevor@plantworks.ai",
        subject: "Your white paper: The Hidden Factory",
        html,
        attachments: [{ filename: PDF_NAME, content: loadPdfBase64() }],
      }),
    });
    if (!res.ok) console.error("white-paper-email: Resend error", res.status, await res.text());
    else console.log("white-paper-email: sent");
  },
};
