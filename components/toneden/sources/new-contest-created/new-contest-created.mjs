import common from "../common/polling.mjs";

export default {
  ...common,
  key: "toneden-new-contest-created",
  name: "New Contest Created",
  description: "Emit new event when a new contest is created. [See the documentation](https://developers.toneden.io/reference/get_users-userid-attachments)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isResourceRelevant(resource) {
      return resource.type === "contest";
    },
    getResourceName() {
      return "attachments";
    },
    getResourceFn() {
      return this.app.getUserAttachments;
    },
    getResourceFnArgs() {
      return {
        userId: this.userId,
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Contest Attachment: ${resource.title}`,
        ts: Date.now(),
      };
    },
  },
};
