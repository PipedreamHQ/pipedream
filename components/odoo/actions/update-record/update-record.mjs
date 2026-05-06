import odoo from "../../odoo.app.mjs";
import { parseObject } from "../../common/utils.mjs";
const DEFAULT_LIMIT = 20;

export default {
  key: "odoo-update-record",
  name: "Update Record",
  description: "Update an existing record in Odoo. [See the documentation](https://www.odoo.com/documentation/18.0/developer/reference/external_api.html#update-records)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    odoo,
    modelName: {
      propDefinition: [
        odoo,
        "modelName",
      ],
      reloadProps: true,
    },
    recordIds: {
      type: "integer[]",
      label: "Record IDs",
      description: "Optional list of record IDs to update in bulk. If provided, this takes precedence over Record ID.",
      optional: true,
    },
    values: {
      type: "string",
      label: "Values",
      description: "JSON mapping of fields to update. Example: `{\"name\":\"Newer Partner\"}`.",
      optional: true,
    },
  },
  async additionalProps() {
    const fieldProps = await this.odoo.getFieldProps(this.modelName, {
      update: true,
    });
    const recordId = {
      type: "integer",
      label: "Record ID",
      description: "The ID of the record to update",
      options: async ({ page }) => await this.getRecordIdOptions(page),
    };
    return {
      recordId,
      ...fieldProps,
    };
  },
  methods: {
    async getRecordIdOptions(page) {
      const records = await this.odoo.searchAndReadRecords(this.modelName, [], {
        limit: DEFAULT_LIMIT,
        offset: page * DEFAULT_LIMIT,
      });
      return records?.map(({
        id: value, display_name: label,
      }) => ({
        value,
        label,
      })) || [];
    },
  },
  async run({ $ }) {
    const {
      odoo,
      // eslint-disable-next-line no-unused-vars
      getRecordIdOptions,
      modelName,
      recordId,
      recordIds,
      values,
      ...data
    } = this;
    const parsedValues = parseObject(values);
    if (values && (typeof parsedValues !== "object" || Array.isArray(parsedValues) || parsedValues === null)) {
      throw new Error("Values must be a JSON object mapping field names to values.");
    }
    const payload = {
      ...data,
      ...(parsedValues && typeof parsedValues === "object" && !Array.isArray(parsedValues)
        ? parsedValues
        : {}),
    };
    const ids = recordIds?.length
      ? recordIds
      : Number.isInteger(recordId)
        ? [
          recordId,
        ]
        : [];
    if (!ids.length) {
      throw new Error("Provide either Record ID or Record IDs.");
    }
    if (!Object.keys(payload).length) {
      throw new Error("Provide at least one field to update.");
    }
    const response = await odoo.updateRecord(modelName, [
      ids,
      payload,
    ]);
    $.export("$summary", `Successfully updated ${ids.length} record${ids.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
