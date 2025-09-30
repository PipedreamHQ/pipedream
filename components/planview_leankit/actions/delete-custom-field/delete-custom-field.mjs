import planviewLeankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-delete-custom-field",
  name: "Delete Custom Field",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Delete a custom field. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/custom-field)",
  type: "action",
  props: {
    planviewLeankit,
    boardId: {
      propDefinition: [
        planviewLeankit,
        "boardId",
      ],
    },
    customFieldId: {
      propDefinition: [
        planviewLeankit,
        "customFieldId",
        ({ boardId }) => ({
          boardId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      planviewLeankit,
      boardId,
      customFieldId,
    } = this;

    const { customFields } = await planviewLeankit.updateCustomField({
      $,
      boardId,
      data: [
        {
          op: "remove",
          path: `/${customFieldId}`,
        },
      ],
    });

    $.export("$summary", `The custom field with id ${customFieldId} was successfully removed!`);
    return customFields;
  },
};
