import common from "../common/common.mjs";

export default {
  ...common,
  key: "onedesk-new-project-updated",
  name: "New Project Updated",
  description: "Emit new event when a project is updated. [See the docs](https://www.onedesk.com/developers/#_get_item_updates)",
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
            "Space",
          ],
          operations: [
            "PROPERTY_UPDATE",
          ],
        },
      });
      return data;
    },
    generateMeta(project) {
      const ts = Date.parse(project.collectedTimestamp);
      return {
        id: `${project.itemId}${ts}`,
        summary: project.itemName,
        ts,
      };
    },
  },
};
