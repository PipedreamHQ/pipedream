import app from "../../envoy.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "envoy-visitor-invited",
  name: "New event when a visitor is invited",
  description: "Emit new event for each invitations to a person or a group of people to visit a location. [See the docs](https://developers.envoy.com/hub/reference/invites-2).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      label: "Watching timer",
      description: "How often to watch the summaries.",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    emit(meta) {
      const ts = Date.parse(meta.createdAt);
      this.$emit(meta, {
        id: meta.id,
        summary: `New invite: ${meta.invitee?.name || meta.id}`,
        ts,
      });
    },
  },
  async run({ $ }) {
    const result = await this.app.listInvites($, {
      sort: "CREATED_AT",
      order: "DESC",
    });
    for (const invite of result.data) {
      this.emit(invite);
    }
  },
};
