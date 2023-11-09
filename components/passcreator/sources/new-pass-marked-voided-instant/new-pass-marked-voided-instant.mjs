import passcreator from "../../passcreator.app.mjs";

export default {
  key: "passcreator-new-pass-marked-voided-instant",
  name: "New Pass Marked Voided Instant",
  description: "Emit new event when a pass is marked as voided. [See the documentation]()",
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
    scanId: {
      propDefinition: [
        passcreator,
        "scanId",
      ],
    },
    voidPassId: {
      propDefinition: [
        passcreator,
        "voidPassId",
      ],
    },
    newPassId: {
      propDefinition: [
        passcreator,
        "newPassId",
      ],
    },
  },
  hooks: {
    async activate() {
      const scan = await this.passcreator.getScan(this.scanId);
      const voidedPass = await this.passcreator.getVoidedPass(this.voidPassId);
      const newPass = await this.passcreator.getNewPass(this.newPassId);
      this.db.set("scan", scan);
      this.db.set("voidedPass", voidedPass);
      this.db.set("newPass", newPass);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    if (headers["x-passcreator-signature"] !== this.passcreator.$auth.api_key) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.$emit(body, {
      id: headers["x-passcreator-signature"],
      summary: `New event: ${body.event}`,
      ts: Date.now(),
    });
  },
};
