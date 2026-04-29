import virtualsms from "../../virtualsms.app.mjs";

export default {
  key: "virtualsms-list-services",
  name: "List Services",
  description: "List all supported services (700+) with their service codes, categories, and base prices. Use the returned `service_id` (or `code`) when calling **Rent Number**. [See the documentation](https://virtualsms.io/docs/api-reference/introduction)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    virtualsms,
  },
  async run({ $ }) {
    const response = await this.virtualsms.listServices({
      $,
    });
    const count = Array.isArray(response?.services)
      ? response.services.length
      : (Array.isArray(response)
        ? response.length
        : 0);
    $.export("$summary", `Retrieved ${count} services`);
    return response;
  },
};
