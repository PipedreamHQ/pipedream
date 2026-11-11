import companyenrich from "../../companyenrich.app.mjs";

export default {
  key: "companyenrich-list-industries",
  name: "List Industries",
  description: "List industries and their NAICS code prefixes. Use the returned string codes in the company filter naicsCodes field. Does not consume credits. [See the documentation](https://docs.companyenrich.com/reference/get_v2-industries)",
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
    const response = await this.companyenrich.listIndustries({
      $,

    });
    $.export("$summary", `Retrieved ${response.items?.length ?? 0} industries`);
    return response;
  },
};
