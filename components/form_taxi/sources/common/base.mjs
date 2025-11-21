import formTaxi from "../../form_taxi.app.mjs";

export default {
  props: {
    formTaxi,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    async registerWebhook() {
      const targetUrl = this.http.endpoint;
      const resp = await this.formTaxi.createWebhook(targetUrl);

      if (resp.status < 200 || resp.status >= 300) {
        const msg = resp?.data?.message || "Unknown error";
        throw new Error(
          `Error (${resp.status}): ${msg}`,
        );
      }

      const id = resp?.id;
      const expires_at = resp?.expires_at;

      if (!id) throw new Error("Response without id!");
      if (!expires_at) throw new Error("Response without Expire-Date!");

      await this.db.set("webhookId", id);
      await this.db.set("webhookExpiresAt", expires_at);

      return resp;
    },
    async deleteWebhookById(hookId) {
      if (!hookId) return;
      const resp = await this.formTaxi.deleteWebhook(hookId);
      if (resp.status >= 400) {
        const msg = resp?.message || "Unknown error";
        console.warn(`Webhook-Delete failed: ${resp.status} ${msg}`);
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

      const msLeft = this.msUntilExpiry(expiresAt);
      const windowMs = 60 * 60 * 1000;

      const shouldRenew =
        !webhookId ||
        !msLeft ||
        msLeft <= 0 ||
        msLeft < windowMs;

      if (!shouldRenew) return;

      try {
        const oldId = webhookId;
        const res = await this.registerWebhook();

        if (oldId && res?.id && res.id !== oldId) {
          await this.deleteWebhookById(oldId);
        }

        console.log(`Webhook renewed. New ID: ${res?.id || "unknown"}, expires at: ${res?.expires_at || "unknown"}`);
      } catch (err) {
        console.error(`Automatic renewal failed: ${err.message}`);
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
        const resp = await this.formTaxi.getSampleData();
        if (resp.status < 200 || resp.status >= 300) {
          const msg = resp?.message || "Unknown error";
          console.warn(`Sample-GET failed (${resp.status}): ${msg}`);
          return;
        }

        const data = resp;
        if (!data) {
          console.warn("Sample-GET: empty response");
          return;
        }

        const emitOne = (obj) => {
          const id = this.eventIdFromBody(obj || {}) || `sample-${Date.now()}`;
          const ts =
            (obj?.created_at && Date.parse(obj.created_at)) ||
            Date.now();

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
          console.warn("Sample-GET: unknown format", data);
        }
      } catch (err) {
        console.error(`Sample-GET Exception: ${err.message}`);
      }
    },
  },
  hooks: {
    async deploy() {
      await this.fetchAndEmitSamples();
    },
    async activate() {
      const res = await this.registerWebhook();
      console.log("Webhook registered:", res);
    },
    async deactivate() {
      try {
        await this.deleteWebhook();
      } catch (err) {
        console.warn("Error removing the webhook:", err.message);
      }
    },
  },
  async run(event) {
    await this.ensureWebhookFresh();

    await this.http.respond({
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ok: true,
      }),
    });

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
