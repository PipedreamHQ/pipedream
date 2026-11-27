import app from "../../dealport.app.mjs";

export default {
  key: "dealport-find-contact",
  name: "Find Principal Contact",
  description: "Find verified phones, emails, and professional profile for a company owner or named principal on a Dealport company Record ($0.09 per verified hit, $0.00 miss). [See the documentation](https://app.dealport.com/llms.txt)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
    },
    person: {
      propDefinition: [
        app,
        "person",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.findContact({
      $,
      data: {
        company_id: this.companyId,
        person: this.person,
      },
    });
    $.export("$summary", `Completed verified principal contact lookup for company ${this.companyId}`);
    return response;
  },
};
