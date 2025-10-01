import awork from "../../awork.app.mjs";

export default {
  name: "Create Client",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "awork-create-client",
  description: "Creates a client. [See docs here](https://openapi.awork.io/#/Companies/post_companies)",
  type: "action",
  props: {
    awork,
    name: {
      label: "Name",
      description: "The name of the company",
      type: "string",
    },
    description: {
      label: "Description",
      description: "The description of the company",
      type: "string",
      optional: true,
    },
    industry: {
      label: "Industry",
      description: "The industry of the company. E.g. `Brand Agency`",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.awork.createCompany({
      $,
      data: {
        name: this.name,
        description: this.description,
        industry: this.industry,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created company with id ${response.id}`);
    }

    return response;
  },
};
