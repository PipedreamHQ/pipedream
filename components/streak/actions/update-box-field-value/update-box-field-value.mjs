import streak from "../../streak.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

const docLink = "https://streak.readme.io/reference/update-field-value-for-a-box";
const JSON_FIELD_TYPES = [
  "DATE",
  "CHECKBOX",
  "TAG",
];

export default {
  key: "streak-update-box-field-value",
  name: "Update Box Field Value",
  description: `Update the values of the custom fields for a box. Use **List Pipeline Fields** to get each field's key and type. [See the documentation](${docLink})`,
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    streak,
    pipelineId: {
      propDefinition: [
        streak,
        "pipelineId",
      ],
    },
    boxId: {
      propDefinition: [
        streak,
        "boxId",
        (c) => ({
          pipelineId: c.pipelineId,
        }),
      ],
    },
    fieldValues: {
      type: "object",
      label: "Field Values",
      description: "Field keys mapped to their new values. Use **List Pipeline Fields** and pass each field's `key`. Value format by field type: `TEXT_INPUT` string, `DATE` Unix ms timestamp, `CHECKBOX` boolean, `DROPDOWN` item key, `TAG` array of tag keys. Example: `{\"1001\": \"Acme\", \"1002\": 1735689600000, \"1003\": [\"9003\"]}`",
    },
  },
  methods: {
    parseValue(value, fieldType) {
      if (!JSON_FIELD_TYPES.includes(fieldType) || typeof value !== "string") {
        return value;
      }
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    },
  },
  async run({ $ }) {
    const entries = Object.entries(this.fieldValues);
    if (!entries.length) {
      throw new ConfigurationError("Field Values must include at least one field key");
    }

    const fields = await this.streak.listPipelineFields({
      $,
      pipelineId: this.pipelineId,
    });
    const fieldTypes = Object.fromEntries(fields.map(({
      key, type,
    }) => [
      key,
      type,
    ]));
    const unknownKeys = entries.map(([
      key,
    ]) => key).filter((key) => !fieldTypes[key]);
    if (unknownKeys.length) {
      throw new ConfigurationError(`Unknown field key(s) for this pipeline: ${unknownKeys.join(", ")}. Use **List Pipeline Fields** to get valid keys`);
    }

    await Promise.all(entries.map(([
      fieldId,
      value,
    ]) => this.streak.updateFieldValue({
      $,
      boxId: this.boxId,
      fieldId,
      value: this.parseValue(value, fieldTypes[fieldId]),
    })));

    $.export("$summary", `Successfully updated ${entries.length} field${entries.length === 1
      ? ""
      : "s"} on box ${this.boxId}`);
    return this.streak.getBox({
      $,
      boxId: this.boxId,
    });
  },
};
