import ironclad from "../../ironclad.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import {
  getAttributeDescription, parseValue,
} from "../../common/utils.mjs";

export default {
  key: "ironclad-update-workflow",
  name: "Update Workflow Metadata",
  description: "Updates the metadata of an existing workflow. [See the documentation]()",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      if (!value?.readOnly) {
        props[key] = {
          type: value.type === "boolean"
            ? "boolean"
            : value.type === "array"
              ? "string[]"
              : "string",
          label: value.displayName,
          description: getAttributeDescription(value),
          optional: true,
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
      workflowId,
      comment,
      ...attributes
    } = this;

    const parsedAttributes = {};
    for (const [
      key,
      value,
    ] of Object.entries(attributes)) {
      parsedAttributes[key] = parseValue(value);
    }

    try {
      const response = await ironclad.updateWorkflowMetadata({
        $,
        workflowId: workflowId,
        data: {
          updates: Object.entries(parsedAttributes).map(([
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
    } catch (error) {
      const msg = JSON.parse(error.message);
      const { schema } = await ironclad.getWorkflow({
        workflowId,
      });
      if (msg.code === "MISSING_PARAM") {
        const paramNames = (JSON.parse(msg.param)).map((p) => `\`${schema[p].displayName}\``);
        throw new ConfigurationError(`Please enter or update the following required parameters: ${paramNames.join(", ")}`);
      }
      if (msg.code === "INVALID_PARAM") {
        const paramName = schema[msg.metadata.keyPath].displayName;
        throw new ConfigurationError(`Invalid parameter: \`${paramName}\`. ${msg.message}`);
      }
      throw new ConfigurationError(msg.message);
    }
  },
};
