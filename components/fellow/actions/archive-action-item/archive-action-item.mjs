import fellow from "../../fellow.app.mjs";

export default {
  key: "fellow-archive-action-item",
  name: "Archive Action Item",
  description: "Archive an action item. [See the documentation](https://developers.fellow.ai/reference/apps_developer_api_api_archive_action_item)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fellow,
    actionItemId: {
      propDefinition: [
        fellow,
        "actionItemId",
      ],
    },
  },
  async run({ $ }) {
    const result = await this.fellow.archiveActionItem({
      $,
      actionItemId: this.actionItemId,
    });
    $.export("$summary", `Successfully archived action item ${this.actionItemId}`);
    return result;
  },
};
