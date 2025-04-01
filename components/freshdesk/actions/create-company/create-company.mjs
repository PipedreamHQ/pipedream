import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-create-company",
  name: "Create a Company",
  description: "Create a company. [See the documentation](https://developers.freshdesk.com/api/#create_company)",
  version: "0.0.3",
  type: "action",
  props: {
    freshdesk,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the company",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the company",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Any specific note about the company",
      optional: true,
    },
    industry: {
      type: "string",
      label: "Industry",
      description: "The industry the company serves in",
      optional: true,
    },
    domains: {
      type: "string[]",
      label: "Domains",
      description: "Domains of the company. Email addresses of contacts that contain this domain will be associated with that company automatically. e.g. [\"supernova\",\"nova\"]",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      freshdesk, ...data
    } = this;
    const response = await freshdesk.createCompany({
      $,
      data,
    });
    response && $.export("$summary", "Company successfully created");
    return response;
  },
};
