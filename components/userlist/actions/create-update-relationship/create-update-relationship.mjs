import userlist from "../../userlist.app.mjs";

export default {
  key: "userlist-create-update-relationship",
  name: "Create or Update Relationship",
  description: "Establishes or modifies a relationship with the given user and company identifiers. [See the documentation](https://userlist.com/docs/getting-started/integration-guide/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    userlist,
    userId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier of the user",
    },
    companyId: {
      type: "string",
      label: "Company ID",
      description: "Unique identifier for the company",
    },
    extraInfo: {
      type: "object",
      label: "Extra Info",
      description: "Other relation attributes",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.userlist.establishOrModifyRelationship({
      userId: this.userId,
      companyId: this.companyId,
      extraInfo: this.extraInfo,
    });

    $.export("$summary", `Successfully established or modified relationship between user ${this.userId} and company ${this.companyId}`);
    return response;
  },
};
