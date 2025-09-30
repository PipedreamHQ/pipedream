import userlist from "../../userlist.app.mjs";

export default {
  key: "userlist-create-update-relationship",
  name: "Create or Update Relationship",
  description: "Establishes or modifies a relationship with the given user and company identifiers. [See the documentation](https://userlist.com/docs/getting-started/integration-guide/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    userlist,
    user: {
      propDefinition: [
        userlist,
        "user",
      ],
    },
    company: {
      propDefinition: [
        userlist,
        "company",
      ],
    },
    properties: {
      type: "object",
      label: "Relationship Properties",
      description: "Custom relationship properties. Example: `{{ { \"role\": \"admin\" } }}`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.userlist.establishOrModifyRelationship({
      data: {
        user: this.user,
        company: this.company,
        properties: this.properties,
      },
      $,
    });

    $.export("$summary", `Successfully established or modified relationship between user ${this.user} and company ${this.company}.`);
    return response;
  },
};
