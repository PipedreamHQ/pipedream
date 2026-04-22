import fellow from "../../fellow.app.mjs";

export default {
  key: "fellow-complete-action-item",
  name: "Complete Action Item",
  description: "Complete an action item. [See the documentation](https://developers.fellow.ai/reference/apps_developer_api_api_mark_action_item_complete)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    const result = await this.fellow.completeActionItem({
      $,
      actionItemId: this.actionItemId,
      data: {
        completed: true,
      },
    });
    $.export("$summary", `Successfully completed action item ${this.actionItemId}`);
    return result;
  },
};
