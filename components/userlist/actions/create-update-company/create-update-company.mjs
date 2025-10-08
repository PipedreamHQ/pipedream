import userlist from "../../userlist.app.mjs";

export default {
  key: "userlist-create-update-company",
  name: "Create or Update Company",
  description: "Creates a new company or replaces an existing one using a given identifier. [See the documentation](https://userlist.com/docs/getting-started/integration-guide/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    userlist,
    identifier: {
      propDefinition: [
        userlist,
        "company",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the company",
      optional: true,
    },
    properties: {
      type: "object",
      label: "Company Properties",
      description: "Custom company properties. Example: `{{ {\"industry\": \"Testing\", \"billing_plan\": \"enterprise\"} }}`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.userlist.createOrReplaceCompany({
      data: {
        identifier: this.identifier,
        name: this.name,
        properties: this.properties,
      },
      $,
    });
    $.export("$summary", `Successfully created or updated company with identifier: ${this.identifier}`);
    return response;
  },
};
