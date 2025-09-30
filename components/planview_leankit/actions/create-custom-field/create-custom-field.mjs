import planviewLeankit from "../../planview_leankit.app.mjs";
import { customFieldOptions } from "../common/utils.mjs";

export default {
  key: "planview_leankit-create-custom-field",
  name: "Create Custom Field",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new custom field. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/custom-field)",
  type: "action",
  props: {
    planviewLeankit,
    boardId: {
      propDefinition: [
        planviewLeankit,
        "boardId",
      ],
    },
    label: {
      type: "string",
      label: "Label",
      description: "The label of the custom field.",
    },
    helpText: {
      type: "string",
      label: "Help Text",
      description: "The text to explain the custom field.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Field Type",
      description: "The type of the custom field.",
      default: "text",
      reloadProps: true,
      options: [
        "text",
        "number",
        "date",
        "dropdown",
        "multi-select",
        "richText",
      ],
    },
  },
  async additionalProps() {
    const props = {};
    if (this.type && customFieldOptions.includes(this.type)) {
      props.values = {
        type: "string[]",
        label: "Values",
        description: `The options of the ${this.type}`,
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      planviewLeankit,
      boardId,
      values,
      type,
      ...data
    } = this;

    const { customFields } = await planviewLeankit.updateCustomField({
      $,
      boardId,
      data: [
        {
          op: "add",
          path: "/",
          value: {
            type: (type === "dropdown")
              ? "choice"
              : (type === "multi-select")
                ? "multi"
                : type,
            choiceConfiguration: {
              choices: values,
            },
            ...data,
          },
        },
      ],
    });

    $.export("$summary", `A new custom field with id ${customFields[0].id} was successfully created!`);
    return customFields[0];
  },
};
