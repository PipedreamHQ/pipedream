import app from "../../veilstrat.app.mjs";

export default {
  key: "veilstrat-get-company",
  name: "Get Company Dossier",
  description: "Retrieve a company dossier using a UUID from **Search Companies Page**. [See the documentation](https://app.veilstrat.com/docs/api/endpoints)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    companyId: {
      "type": "string",
      "label": "Company ID",
      "description": "A company UUID returned by Search Companies Page.",
    },
  },
  async run({ $ }) {
    const result = await this.app.getCompany({
      $,
      companyId: this.companyId,
    });
    $.export("$summary", "Retrieved a company dossier");
    return result;
  },
};
