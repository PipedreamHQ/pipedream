import { ConfigurationError } from "@pipedream/platform";
import { v4 as uuid } from "uuid";
import common from "../../common/common.mjs";

export default {
  ...common,
  key: "figma-new-comment",
  name: "New Comment (Instant)",
  description: "Emit new event when someone comments on a file",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  props: {
    alert: {
      type: "alert",
      alertType: "info",
      content: "A Figma Organization Plan or higher is required to use webhooks. See Figma's [pricing page](https://www.figma.com/pricing) for more details.",
    },
    ...common.props,
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      try {
        const passcode = uuid();
        this.setPasscode(passcode);

        const hookId = await this.figmaApp.createHook(
          "FILE_COMMENT",
          this.getTeamId(),
          this.http.endpoint,
          passcode,
        );

        this.setHookId(hookId);
      } catch (error) {
        if (error.response.status === 400) {
          throw new ConfigurationError("A Figma Organization Plan or higher is required to use webhooks. See Figma's [pricing page](https://www.figma.com/pricing) for more details.");
        }
        throw error;
      }
    },
    async deactivate() {
      await this.figmaApp.deleteHook(this.getHookId());
    },
  },
  methods: {
    ...common.methods,
    getHookId() {
      return this.db.get("hookId");
    },
    setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getPasscode() {
      return this.db.get("passcode");
    },
    setPasscode(passcode) {
      this.db.set("passcode", passcode);
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    if (event.body.passcode === this.getPasscode()) {
      this.$emit(event.body, {
        summary: `New comment on a file (${event.body.comment_id})`,
        id: event.body.comment_id,
        ts: event.body.timestamp,
      });
    }
  },
};
