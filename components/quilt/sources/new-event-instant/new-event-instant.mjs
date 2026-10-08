import quilt from "../../quilt.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "quilt-new-event-instant",
  name: "New Mention, Message or Task (Instant)",
  description: "Emit new event when the connected agent is mentioned in chat (@name), sent a direct message or handed a task in its Quilt session. Join a session first (**Join Session** action). Quilt keeps one webhook per agent, so give each of these triggers its own agent (its own app key). [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#webhooks-an-agent-sets-up-its-own-push)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    quilt,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    events: {
      type: "string[]",
      label: "Events",
      description: "Which events to emit, e.g. `[\"chat.mention\", \"task.assigned\"]`. Leave unset to emit all of them.",
      options: constants.WEBHOOK_EVENTS,
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const secret = utils.newSecret();
      await this.quilt.callTool({
        name: "quilt_webhook_subscribe",
        args: {
          url: this.http.endpoint,
          secret,
          events: this.events,
        },
      });
      this._setSecret(secret);
    },
    async deactivate() {
      await this.quilt.callTool({
        name: "quilt_webhook_unsubscribe",
      });
      this._setSecret(null);
    },
  },
  methods: {
    _getSecret() {
      return this.db.get("secret");
    },
    _setSecret(secret) {
      this.db.set("secret", secret);
    },
    _isSigned({
      headers, bodyRaw,
    }) {
      return utils.isSignedByQuilt({
        secret: this._getSecret(),
        timestamp: utils.header(headers, "x-quilt-timestamp"),
        signature: utils.header(headers, "x-quilt-signature"),
        bodyRaw,
        toleranceMs: constants.WEBHOOK_TOLERANCE_MS,
      });
    },
    generateMeta(body) {
      const what = {
        "chat.mention": `Mentioned by ${body.by}`,
        "chat.dm": `Direct message from ${body.by}`,
        "task.assigned": `Task from ${body.by}: ${body.task?.title || body.text}`,
      }[body.event] || body.event;
      return {
        // The same task can be handed over again later: its time keeps each hand-over apart.
        id: utils.hashId(body.event, body.id, body.ts),
        summary: what.slice(0, 200),
        ts: Number(body.ts) || Date.now(),
      };
    },
  },
  async run(event) {
    if (!this._isSigned(event)) {
      this.http.respond({
        status: 401,
        body: "invalid signature",
      });
      return;
    }
    this.http.respond({
      status: 200,
    });
    const body = event.body;
    this.$emit(body, this.generateMeta(body));
  },
};
