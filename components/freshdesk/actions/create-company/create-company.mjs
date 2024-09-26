import { removeNullEntries } from "../../common/utils.mjs";
import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-create-company",
  name: "Create a Company",
  description: "Create a company. [See docs here](https://developers.freshdesk.com/api/#companies)",
  version: "0.0.1",
  type: "action",
  props: {
    freshdesk,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the company.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the company.",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Any specific note about the company.",
      optional: true,
    },
    industry: {
      type: "string",
      label: "Industry",
      description: "The industry the company serves in.",
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
    const payload = removeNullEntries({
      name: this.name,
      domains: this.domains,
      note: this.note,
      industry: this.industry,
      description: this.description,
    });
    const response = await this.freshdesk.createCompany({
      $,
      payload,
    });
    response && $.export("$summary", "Company sucessfully created");
    return response;
  },
};
