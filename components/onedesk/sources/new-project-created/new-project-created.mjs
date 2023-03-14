import common from "../common/common.mjs";

export default {
  ...common,
  key: "onedesk-new-project-created",
  name: "New Project Created",
  description: "Emit new event when a new project is created. [See the docs](https://www.onedesk.com/developers/#_get_item_updates)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getUpdates(applicationId) {
      const { data } = await this.onedesk.getItemUpdates({
        data: {
          applicationId,
          itemTypes: [
            "ProjectVariables",
          ],
          operations: [
            "CREATE",
          ],
        },
      });
      return data;
    },
    generateMeta(project) {
      return {
        id: project.itemId,
        summary: project.itemName,
        ts: Date.parse(project.collectedTimestamp),
      };
    },
  },
};
