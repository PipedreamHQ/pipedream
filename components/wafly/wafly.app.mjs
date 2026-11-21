// Managed auth fields are requested in PipedreamHQ/pipedream#21549.
// No credential, network call or platform state is created on module import.
export default {
  type: "app",
  app: "wafly",
  propDefinitions: {
    phone: {
      type: "string",
      label: "Recipient",
      description: "International number, e.g. 5511999999999; group ID such as 120363000000000-group; newsletter ID such as 120363000000000@newsletter.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "Text to send to the authorized recipient.",
    },
  },
  methods: {
    _credentials() {
      const {
        instance_id, instance_token, client_token,
      } = this.$auth || {};
      if (![
        instance_id,
        instance_token,
        client_token,
      ].every((v) => typeof v === "string" && v.trim())) {
        throw new Error("Configure the Wafly Client Token, Instance ID and Instance Token.");
      }
      return {
        instance_id,
        instance_token,
        client_token,
      };
    },
    async _request({
      method = "GET", path, body,
    }) {
      // Fixed origin prevents accidental forwarding of account credentials to another host.
      if (![
        "/webhook",
        "/send-text",
      ].includes(path)) throw new Error("Unsupported connector route.");
      const c = this._credentials();
      const url = `https://wafly.com.br/api-bridge-whats/instances/${encodeURIComponent(c.instance_id)}/token/${encodeURIComponent(c.instance_token)}${path}`;
      let response;
      try {
        response = await fetch(url, {
          method,
          headers: {
            "Client-Token": c.client_token,
            "Content-Type": "application/json",
          },
          body: body === undefined
            ? undefined
            : JSON.stringify(body),
          redirect: "error",
          signal: AbortSignal.timeout(30000),
        });
      } catch {
        throw new Error("Wafly request did not complete; check the operation before retrying a send.");
      }
      if (!response.ok) throw new Error(`Wafly returned HTTP ${response.status}.`);
      if (response.status === 204) return {};
      try { return await response.json(); }
      catch { throw new Error("Wafly returned an unexpected response."); }
    },
    // Saved configuration validates instance credentials without a native session call.
    // This route requires a nonempty Client-Token but does not verify its value.
    async validateInstanceCredentials() { await this._request({
      path: "/webhook",
    }); return {
      instance_credentials_valid: true,
      client_token_verified: false,
    }; },
    async sendText({
      phone, message,
    }) {
      const recipient = String(phone || "").trim();
      const normalized = /^\d+(?:-\d+)?(?:@g\.us|-group|@newsletter)$/.test(recipient)
        ? recipient
        : /^\+?[\d\s().-]+$/.test(recipient)
          ? recipient.replace(/\D/g, "")
          : "";
      if (!normalized || typeof message !== "string" || !message.trim()) throw new Error("Recipient and message are required.");
      const result = await this._request({
        method: "POST",
        path: "/send-text",
        body: {
          phone: normalized,
          message,
        },
      });
      if (!result || typeof result.messageId !== "string" || !result.messageId.trim()) {
        throw new Error("Wafly did not return a message identifier. Result is unconfirmed; do not retry blindly.");
      }
      if (result.messageId.startsWith("DUPLICATE_")) {
        throw new Error("Wafly blocked a duplicate request; check the original operation before retrying.");
      }
      return result;
    },
  },
};
