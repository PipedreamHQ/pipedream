import companyenrich from "../../companyenrich.app.mjs";

export default {
  key: "companyenrich-get-regions",
  name: "Get Regions",
  description: "List geographic regions and their country codes for company and people filters. Does not consume credits. [See the documentation](https://docs.companyenrich.com/reference/get_v2-geo-regions)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    companyenrich,

  },
  async run({ $ }) {
    const response = await this.companyenrich.getRegions({
      $,

    });
    $.export("$summary", "Retrieved geographic regions");
    return response;
  },
};
