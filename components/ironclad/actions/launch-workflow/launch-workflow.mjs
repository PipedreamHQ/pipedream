import ironclad from "../../ironclad.app.mjs";

export default {
  key: "ironclad-launch-workflow",
  name: "Launch Workflow",
  description: "Launches a new workflow in Ironclad. [See the documentation](https://developer.ironcladapp.com/reference/launch-a-new-workflow)",
  version: "0.0.1",
  type: "action",
  props: {
    ironclad,
    templateId: {
      propDefinition: [
        ironclad,
        "templateId",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.templateId) {
      return props;
    }
    const { schema } = await this.ironclad.getWorkflowSchema({
      templateId: this.templateId,
    });
    for (const [
      key,
      value,
    ] of Object.entries(schema)) {
      if (!value.readOnly && value?.type !== "document" && value?.elementType?.type !== "document") {
        props[key] = {
          type: value.type === "boolean"
            ? "boolean"
            : value.type === "array"
              ? "string[]"
              : "string",
          label: value.displayName,
          optional: !(key === "counterpartyName"),
        };
        if (key === "paperSource") {
          props[key].options = [
            "Counterparty paper",
            "Our paper",
          ];
        }
      }
    }
    return props;
  },
  async run({ $ }) {
    const {
      ironclad,
      templateId,
      ...attributes
    } = this;

    const response = await ironclad.launchWorkflow({
      $,
      data: {
        template: templateId,
        attributes: {
          ...attributes,
        },
      },
    });
    $.export("$summary", `Workflow launched successfully with ID ${response.id}`);
    return response;
  },
};
