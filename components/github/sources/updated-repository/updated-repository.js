const common = require("../common-webhook.js");
const eventTypes = [
  "created",
  "deleted",
  "archived",
  "unarchived",
  "edited",
  "renamed",
  "transfered",
  "publicized",
  "privatized",
];

module.exports = {
  ...common,
  key: "github-updated-repository",
  name: "Updated Repository (Instant)",
  description: "Emit an event when an existing repository is updated.",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    getEventNames() {
      return ["repository"];
    },
    generateMeta(data) {
      const ts = data.repository.updated_at
        ? Date.parse(data.repository.updated_at)
        : Date.parse(data.repository.created_at);
      return {
        id: `${data.repository.id}${ts}`,
        summary: `${data.repository.full_name} ${data.action} by ${data.sender.login}`,
        ts,
      };
    },
    emitEvent(body) {
      if (eventTypes.indexOf(body.action) > -1) {
        const meta = this.generateMeta(body);
        this.$emit(body, meta);
      }
      if (
        body.action == "edited" &&
        body.repository.full_name !== this.repoFullName
      )
        this.repoFullName = body.repository.full_name;
    },
  },
};