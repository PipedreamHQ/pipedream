import passcreator from "../../passcreator.app.mjs";

export default {
  key: "passcreator-new-wallet-pass-created-instant",
  name: "New Wallet Pass Created (Instant)",
  description: "Emit new event when a new wallet pass is created. [See the documentation](https://developer.passcreator.com/space/api/23331211)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    passcreator: {
      type: "app",
      app: "passcreator",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    newPassId: {
      propDefinition: [
        passcreator,
        "newPassId",
      ],
    },
  },
  hooks: {
    async activate() {
      const newPass = await this.passcreator.getNewPass(this.newPassId);
      this.db.set("lastPassId", newPass.id);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    if (headers["content-type"] !== "application/json") {
      this.http.respond({
        status: 415,
      });
      return;
    }

    if (!body || !body.id) {
      this.http.respond({
        status: 400,
      });
      return;
    }

    const lastPassId = this.db.get("lastPassId");

    if (body.id !== lastPassId) {
      const newPass = await this.passcreator.getNewPass(body.id);
      this.$emit(newPass, {
        id: newPass.id,
        summary: `New wallet pass created: ${newPass.id}`,
        ts: Date.now(),
      });
      this.db.set("lastPassId", newPass.id);
    }

    this.http.respond({
      status: 200,
    });
  },
};
