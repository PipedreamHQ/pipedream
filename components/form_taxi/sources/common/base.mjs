import form_taxi from "../../form_taxi.app.mjs";

export default {
  props: {
    form_taxi,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    async registerWebhook() {

      const targetUrl = this.http.endpoint;
      const resp = await this.form_taxi.createWebhook(targetUrl);

      if (resp.status < 200 || resp.status >= 300) {
        const msg = resp?.data?.message || "Unknown error";
        throw new Error(
          `Error (${resp.status}): ${msg}`,
        );
      }

      const id = resp?.id;
      const expires_at = resp?.expires_at; // ISO-8601 erwartet

      if (!id) throw new Error("Response without id!");
      if (!expires_at) throw new Error("Response without Expire-Date!");

      await this.db.set("webhookId", id);
      await this.db.set("webhookExpiresAt", expires_at);

      return resp;
    },
    async deleteWebhookById(hookId) {
      if (!hookId) return;
      const resp = await this.form_taxi.deleteWebhook(hookId);
      if (resp.status >= 400) {
        const msg = resp?.message || "Unknown error";
        console.warn(`Webhook-Delete fehlgeschlagen: ${resp.status} ${msg}`);
      }
    },
    async deleteWebhook() {
      const webhookId = await this.db.get("webhookId");
      if (!webhookId) return;
      await this.deleteWebhookById(webhookId);
    },
    msUntilExpiry(expiresAtIso) {
      if (!expiresAtIso) return null;
      const expMs = Date.parse(expiresAtIso);
      if (Number.isNaN(expMs)) return null;
      return expMs - Date.now();
    },
    async ensureWebhookFresh() {
      const webhookId = await this.db.get("webhookId");
      const expiresAt = await this.db.get("webhookExpiresAt");

      // Wenn wir kein Ablaufdatum kennen, machen wir nichts (oder könnten aggressiv erneuern).
      const msLeft = this.msUntilExpiry(expiresAt);
      const windowMs = 60 * 60 * 1000; // 60 Minuten

      // Erneuerungsbedingungen:
      // - kein webhookId (unerwartet) ODER
      // - kein expiresAt bekannt ODER
      // - bereits abgelaufen ODER
      // - Restlaufzeit < renewal window
      const shouldRenew =
        !webhookId ||
        !msLeft ||
        msLeft <= 0 ||
        msLeft < windowMs;

      if (!shouldRenew) return;

      try {
        // Neu registrieren
        const oldId = webhookId;
        const res = await this.registerWebhook();

        // Alten Hook bereinigen (best effort), wenn wir eine neue ID haben
        if (oldId && res?.id && res.id !== oldId) {
          await this.deleteWebhookById(oldId);
        }

        console.log(`Webhook erneuert. Neue ID: ${res?.id || "unbekannt"}, läuft bis: ${res?.expires_at || "unbekannt"}`);
      } catch (err) {
        console.error(`Automatische Erneuerung fehlgeschlagen: ${err.message}`);
      }
    },
    eventIdFromBody(body) {
      return (
        body?._id ||
        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`
      );
    },
    async fetchAndEmitSamples() {
      try {
        const resp = await this.form_taxi.getSampleData();
        if (resp.status < 200 || resp.status >= 300) {
          const msg = resp?.message || "Unknown error";
          console.warn(`Sample-GET fehlgeschlagen (${resp.status}): ${msg}`);
          return;
        }

        const data = resp;
        if (!data) {
          console.warn("Sample-GET: leere Antwort");
          return;
        }

        const emitOne = (obj) => {
          const id = this.eventIdFromBody(obj || {}) || `sample-${Date.now()}`;
          const ts =
            (obj?.created_at && Date.parse(obj.created_at)) ||
            Date.now();

          // Wir packen die Daten in das gleiche Format wie echte Events
          this.$emit(
            {
              headers: {
                "x-sample": "true",
              },
              query: {},
              body: obj,
              received_at: new Date().toISOString(),
              source: "Form.taxi",
              sample: true,
            },
            {
              id,
              summary: "Sample submission",
              ts,
            },
          );
        };

        if (Array.isArray(data)) {
          data.forEach(emitOne);
        } else if (typeof data === "object") {
          emitOne(data);
        } else {
          console.warn("Sample-GET: unbekanntes Format", data);
        }
      } catch (err) {
        console.error(`Sample-GET Exception: ${err.message}`);
      }
    },
  },
  hooks: {
    async deploy() {
      await this.fetchAndEmitSamples(); // Unmittelbar Sample-Daten laden und emittieren
    },
    async activate() {
      // Webhook frisch registrieren
      const res = await this.registerWebhook();
      console.log("Webhook registriert:", res);
    },
    async deactivate() {
      try {
        await this.deleteWebhook();
      } catch (err) {
        console.warn("Fehler beim Entfernen des Webhooks:", err.message);
      }
    },
  },
  async run(event) {
    // Vor der Verarbeitung prüfen, ob der Hook bald abläuft und ggf. erneuern
    await this.ensureWebhookFresh();

    // Sofort ACK an Form.taxi
    await this.http.respond({
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ok: true,
      }),
    });

    // Event emittieren
    const id = this.eventIdFromBody(event.body || {});
    const summary = `Form Submission ID: ${id}`;
    const ts = (event.body?.created_at && Date.parse(event.body.created_at)) || Date.now();

    const payload = {
      headers: event.headers,
      query: event.query,
      body: event.body,
      received_at: new Date().toISOString(),
      source: "Form.taxi",
    };

    this.$emit(payload, {
      id,
      summary: summary,
      ts,
    });
  },
};
