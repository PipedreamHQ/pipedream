import odoo from "../../odoo.app.mjs";
const DEFAULT_LIMIT = 20;

export default {
  key: "odoo-update-record",
  name: "Update Record",
  description: "Update an existing record in Odoo. [See the documentation](https://www.odoo.com/documentation/18.0/developer/reference/external_api.html#update-records)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    odoo: {
      ...odoo,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const fieldProps = await this.odoo.getFieldProps({
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
      const records = await this.odoo.searchAndReadRecords([], {
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
      recordId,
      ...data
    } = this;
    const response = await odoo.updateRecord([
      [
        recordId,
      ],
      data,
    ]);
    $.export("$summary", `Successfully updated record with ID: ${recordId}`);
    return response;
  },
};
