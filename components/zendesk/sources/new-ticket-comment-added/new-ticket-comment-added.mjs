import app from "../../zendesk.app.mjs";
import common from "../common/ticket.mjs";

export default {
  ...common,
  name: "New Ticket Comment Added (Instant)",
  key: "zendesk-new-ticket-comment-added",
  type: "source",
  description: "Emit new event when a ticket comment has been added",
  version: "0.1.0",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    http: "$.interface.http",
    categoryId: {
      propDefinition: [
        app,
        "categoryId",
      ],
    },
    customSubdomain: {
      propDefinition: [
        app,
        "customSubdomain",
      ],
    },
  },
  methods: {
    ...common.methods,
    _getLastTs() {
      return this.db.get("lastTs");
    },
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
    getWebhookName() {
      return "Ticket Comment Added Webhook";
    },
    getTriggerTitle() {
      return "Ticket Comment Added Trigger";
    },
    getTriggerConditions() {
      return {
        all: [
          {
            field: "update_type",
            value: "Change",
          },
        ],
      };
    },
    getTriggerPayload() {
      const payload = common.methods.getTriggerPayload.call(this);
      return {
        ...payload,
        ticketComments: "{{ticket.comments}}",
      };
    },
    convertCommentsToJson(raw) {
      return [
        ...raw.matchAll(/#<Comment (.*?)(value: "[^"]*")(.*?)>/g),
      ].map((match) => {
        const valueField = match[0].match(/(?<=, )value: "([^"]|\\")*[^\\]",/)?.[0];
        const baseMatch = match[0].replace(/^#<Comment /, "");
        const baseMatchWithoutValue = valueField
          ? baseMatch.split(valueField).join("")
          : baseMatch;
        const fields = baseMatchWithoutValue
          .split(",")
          .map((part) => part.trim())
          .map((pair) => {
            const [
              key,
              value,
            ] = pair.split(/:\s+/);
            // Clean up values: remove extra quotes or cast to appropriate types
            let cleaned = value;
            if (cleaned === "nil") cleaned = null;
            else if (cleaned === "true") cleaned = true;
            else if (cleaned === "false") cleaned = false;
            else if (/^\d+$/.test(cleaned)) cleaned = parseInt(cleaned, 10);
            else if (/^".*"$/.test(cleaned)) cleaned = cleaned.slice(1, -1);
            return [
              key,
              cleaned,
            ];
          });
        return Object.fromEntries(valueField
          ? [
            ...fields,
            [
              "value",
              valueField?.replace(/^value: ?/, ""),
            ],
          ]
          : fields);
      });
    },
    isRelevant(payload) {
      const lastTs = this._getLastTs() || 0;
      let maxTs = lastTs;
      const comments = this.convertCommentsToJson(payload.ticketComments);
      for (const comment of comments) {
        const ts = Date.parse(comment.created_at);
        maxTs = Math.max(maxTs, ts);
      }
      this._setLastTs(maxTs);
      return comments.length > 0 && maxTs > lastTs;
    },
    emitEvent(payload) {
      payload.ticketComments = this.convertCommentsToJson(payload.ticketComments);
      const {
        ticketComments, ...ticketData
      } = payload;
      for (const comment of ticketComments) {
        const ts = Date.parse(comment.created_at);
        const id = `${payload.ticketId}-${ts}`;
        this.$emit({
          ...comment,
          ticketData,
        }, {
          id,
          summary: comment.value,
          ts,
        });
      }
    },
  },
};
