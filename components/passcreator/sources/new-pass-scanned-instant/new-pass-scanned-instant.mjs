import passcreator from "../../passcreator.app.mjs";

export default {
  key: "passcreator-new-pass-scanned-instant",
  name: "New Pass Scanned Instant",
  description: "Emits a new event when a new app scan has been recorded in Passcreator. [See the documentation](https://developer.passcreator.com/space/api/23331116/subscription+endpoint)",
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
      customResponse: false,
    },
    db: "$.service.db",
  },
  async run(event) {
    const { body } = event;
    this.$emit(body, {
      id: body.scanId,
      summary: `New scan ${body.scanId} recorded`,
      ts: Date.parse(body.createdAt),
    });
    this.http.respond({
      status: 200,
    });
  },
};
