import { ConfigurationError } from "@pipedream/platform";
import odoo from "../../odoo.app.mjs";
const DEFAULT_LIMIT = 20;

export default {
  key: "odoo-update-record",
  name: "Update Record",
  description: "Update an existing record in Odoo. [See the documentation](https://www.odoo.com/documentation/18.0/developer/reference/external_api.html#update-records)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
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
      options: async function ({ page }) {
        return this.getRecordIdOptions(page);
      },
    },
    fieldsToUpdate: {
      type: "string[]",
      label: "Fields to Update",
      description: "Select the fields you want to update. Only selected fields will appear as individual inputs.",
      optional: true,
      reloadProps: true,
      options: async function () {
        return this.getUpdatableFieldOptions();
      },
    },
  },
  async additionalProps() {
    const allFieldProps = await this.odoo.getFieldProps(this.modelName, {
      update: true,
    });
    const selected = Array.isArray(this.fieldsToUpdate)
      ? this.fieldsToUpdate
      : [];
    const fieldProps = Object.fromEntries(
      Object.entries(allFieldProps).filter(([
        key,
      ]) => selected.includes(key)),
    );
    const recordId = {
      type: "integer",
      label: "Record ID",
      description: "The ID of the record to update",
      options: async ({ page }) => await this.getRecordIdOptions(page),
      optional: true,
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
    async getUpdatableFieldOptions() {
      const fieldProps = await this.odoo.getFieldProps(this.modelName, {
        update: true,
      });
      return Object.entries(fieldProps).map(([
        key,
        prop,
      ]) => ({
        value: key,
        label: prop.label
          ? `${prop.label} (${key})`
          : key,
      }));
    },
  },
  async run({ $ }) {
    const {
      odoo,
      // eslint-disable-next-line no-unused-vars
      getRecordIdOptions,
      // eslint-disable-next-line no-unused-vars
      getUpdatableFieldOptions,
      modelName,
      recordId,
      recordIds,
      // eslint-disable-next-line no-unused-vars
      fieldsToUpdate,
      ...data
    } = this;
    const payload = Object.fromEntries(Object.entries(data).filter(([
      ,
      value,
    ]) => value !== undefined));
    const hasRecordId = Number.isInteger(recordId);
    const hasRecordIds = Array.isArray(recordIds) && recordIds.length > 0;
    if (!hasRecordId && !hasRecordIds) {
      throw new ConfigurationError("Provide either Record ID or Record IDs.");
    }
    if (hasRecordId && hasRecordIds) {
      throw new ConfigurationError("Provide either Record ID or Record IDs, not both.");
    }
    if (hasRecordIds && !recordIds.every(Number.isInteger)) {
      throw new ConfigurationError("Record IDs must be an array of integers.");
    }
    const ids = hasRecordIds
      ? recordIds
      : [
        recordId,
      ];
    if (!Object.keys(payload).length) {
      throw new ConfigurationError("Provide at least one field to update.");
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
