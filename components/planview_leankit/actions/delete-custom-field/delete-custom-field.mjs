import planview_leankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-delete-custom-field",
  name: "Delete Custom Field",
  version: "0.0.1",
  description: "Delete a custom field. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/custom-field)",
  type: "action",
  props: {
    planview_leankit,
    boardId: {
      propDefinition: [
        planview_leankit,
        "boardId",
      ],
    },
    customFieldId: {
      propDefinition: [
        planview_leankit,
        "customFieldId",
        ({ boardId }) => ({
          boardId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      planview_leankit,
      boardId,
      customFieldId,
    } = this;

    const { customFields } = await planview_leankit.updateCustomField({
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
