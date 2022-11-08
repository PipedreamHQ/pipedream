import asana from "../../asana.app.mjs";

export default {
  key: "asana-new-tag",
  type: "source",
  name: "New Tag",
  description: "Emit new event for each tag created in a workspace.",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    asana,
    workspace: {
      label: "Workspace",
      description: "Gid of a workspace.",
      type: "string",
      propDefinition: [
        asana,
        "workspaces",
      ],
      optional: true,
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },

  async run() {
    const tags = await this.asana.getTags(this.organization);

    for (let tag of tags) {
      tag = await this.asana.getTag(tag.gid);

      if (this.workspace && tag.workspace.gid !== this.workspace) continue;

      this.$emit(tag, {
        id: tag.gid,
        summary: tag.name,
        ts: Date.now(),
      });
    }
  },
};
