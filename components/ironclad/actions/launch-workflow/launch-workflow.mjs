import ironclad from "../../ironclad.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import {
  getAttributeDescription, parseValue,
} from "../../common/utils.mjs";

export default {
  key: "ironclad-launch-workflow",
  name: "Launch Workflow",
  description: "Launches a new workflow in Ironclad. [See the documentation](https://developer.ironcladapp.com/reference/launch-a-new-workflow)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      if (!value.readOnly) {
        props[key] = {
          type: value.type === "boolean"
            ? "boolean"
            : value.type === "array"
              ? "string[]"
              : "string",
          label: value.displayName,
          description: getAttributeDescription(value),
          optional: (!(key === "counterpartyName") && !value.displayName.toLowerCase().includes("required")),
        };
        if (key === "paperSource") {
          props[key].options = [
            "Counterparty paper",
            "Our paper",
          ];
        }
        if (key === "recordType") {
          const { recordTypes } = await this.ironclad.getRecordsSchema();
          props[key].options = Object.values(recordTypes)
            .map((recordType) => recordType.displayName);
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

    const parsedAttributes = {};
    for (const [
      key,
      value,
    ] of Object.entries(attributes)) {
      parsedAttributes[key] = parseValue(value);
    }

    try {
      const response = await ironclad.launchWorkflow({
        $,
        params: {
          useDefaultValues: true,
        },
        data: {
          template: templateId,
          attributes: parsedAttributes,
        },
      });
      $.export("$summary", `Workflow launched successfully with ID ${response.id}`);
      return response;
    } catch (error) {
      const msg = JSON.parse(error.message);
      const { schema } = await ironclad.getWorkflowSchema({
        templateId,
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
