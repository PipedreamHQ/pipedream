import ironclad from "../../ironclad.app.mjs";

export default {
  key: "ironclad-update-workflow",
  name: "Update Workflow Metadata",
  description: "Updates the metadata of an existing workflow. [See the documentation]()",
  version: "0.0.1",
  type: "action",
  props: {
    ironclad,
    workflowId: {
      propDefinition: [
        ironclad,
        "workflowId",
      ],
      reloadProps: true,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "A comment that explains the updates you are making to the workflow",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.workflowId) {
      return props;
    }
    const { schema } = await this.ironclad.getWorkflow({
      workflowId: this.workflowId,
    });
    for (const [
      key,
      value,
    ] of Object.entries(schema)) {
      if (!value?.readOnly && value?.type !== "document" && value?.elementType?.type !== "document") {
        props[key] = {
          type: value.type === "boolean"
            ? "boolean"
            : value.type === "array"
              ? "string[]"
              : "string",
          label: value.displayName,
          optional: true,
        };
      }
    }
    return props;
  },
  async run({ $ }) {
    const {
      ironclad,
      workflowId,
      comment,
      ...attributes
    } = this;
    const response = await ironclad.updateWorkflowMetadata({
      $,
      workflowId: workflowId,
      data: {
        updates: attributes && Object.entries(attributes).map(([
          key,
          value,
        ]) => ({
          action: "set",
          path: key,
          value,
        })),
        comment: comment,
      },
    });
    $.export("$summary", `Workflow ${workflowId} updated successfully`);
    return response;
  },
};
