import odoo from "../../odoo.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "odoo-search-read-records",
  name: "Search and Read Records",
  description: "Search and read records from Odoo. [See the documentation](https://www.odoo.com/documentation/18.0/developer/reference/external_api.html#search-and-read)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    odoo,
    modelName: {
      propDefinition: [
        odoo,
        "modelName",
      ],
    },
    domain: {
      type: "string",
      label: "Search Domain",
      description: "Odoo search domain as JSON. Examples: phone contains `555` -> `[[\"phone\", \"ilike\", \"555\"]]`; email contains `acme.com` -> `[[\"email\", \"ilike\", \"acme.com\"]]`; companies only -> `[[\"is_company\", \"=\", true]]`. [See domain docs](https://www.odoo.com/documentation/18.0/developer/reference/backend/orm.html#search-domains).",
      optional: true,
    },
    fields: {
      propDefinition: [
        odoo,
        "fields",
        ({ modelName }) => ({
          modelName,
        }),
      ],
      optional: false,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of records to return.",
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of records to skip before returning results.",
      optional: true,
    },
    order: {
      type: "string",
      label: "Order",
      description: "Sort order (e.g. `write_date desc`, `name asc`).",
      optional: true,
    },
  },
  async run({ $ }) {
    const domain = parseObject(this.domain) ?? [];
    if (typeof domain === "string" || !Array.isArray(domain)) {
      throw new Error("Domain must be a valid JSON array.");
    }
    const normalizedDomain = Array.isArray(domain[0]) &&
      typeof domain[0][0] === "string"
      ? domain
      : [
        domain,
      ];
    if (!this.fields?.length) {
      throw new Error("Fields is required.");
    }
    const args = {
      fields: this.fields,
    };
    if (Number.isInteger(this.limit)) args.limit = this.limit;
    if (Number.isInteger(this.offset)) args.offset = this.offset;
    if (this.order) args.order = this.order;
    const response = await this.odoo.searchAndReadRecords(
      this.modelName,
      normalizedDomain,
      args,
    );
    $.export("$summary", `Successfully retrieved ${response.length} record${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
