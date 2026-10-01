import cavyro from "../../cavyro.app.mjs";

export default {
  key: "cavyro-list-custom-fields",
  name: "List Custom Fields",
  description: "List the custom fields defined in the Cavyro workspace (`id`, `name`, `field_type`, `required`, `options`). Use the `id` values as keys of `customFields` in **Create Contact**, **Create Company**, **Create Deal** and **Update Deal**; fields with `required: true` must be set on create. [See the documentation](https://developers.cavyro.com)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    cavyro,
    entity: {
      type: "string",
      label: "Record Type",
      description: "Only return custom fields for this record type. One of `Contact`, `Company`, `Deal`, e.g. `Contact`.",
      optional: true,
      options: [
        "Contact",
        "Company",
        "Deal",
      ],
    },
  },
  async run({ $ }) {
    const items = await this.cavyro.listCustomFields({
      $,
      params: {
        entity: this.entity,
        limit: 100,
      },
    });
    $.export("$summary", `Found ${items.length} custom field(s)`);
    return items;
  },
};
