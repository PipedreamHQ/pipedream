import { axios } from "@pipedream/platform";
import duxSoup from "../../dux-soup.app.mjs";

export default {
  key: "dux-soup-new-action-event-instant",
  name: "New Action Event Instant",
  description: "Emit new event when a queued action executes. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    duxSoup: {
      type: "app",
      app: "dux-soup",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    actionId: {
      propDefinition: [
        duxSoup,
        "actionId",
      ],
    },
    messageType: {
      propDefinition: [
        duxSoup,
        "messageType",
      ],
    },
  },
  hooks: {
    async deploy() {
      const action = await this.duxSoup.getAction(this.actionId);
      this.$emit(action, {
        id: action.id,
        summary: `New action: ${action.name}`,
        ts: Date.parse(action.createdAt),
      });
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    if (
      headers["x-pipedream-source"] === this.db.get("sourceId") &&
      body.actionId === this.actionId &&
      body.messageType === this.messageType
    ) {
      this.$emit(body, {
        id: body.id,
        summary: `New action: ${body.actionId}`,
        ts: Date.parse(body.createdAt),
      });
    } else {
      this.http.respond({
        status: 200,
      });
    }
  },
};
