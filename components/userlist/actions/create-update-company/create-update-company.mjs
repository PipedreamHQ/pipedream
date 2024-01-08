import userlist from "../../userlist.app.mjs";

export default {
  key: "userlist-create-update-company",
  name: "Create or Update Company",
  description: "Creates a new company or replaces an existing one using a given identifier.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    userlist,
    identifier: {
      propDefinition: [
        userlist,
        "identifier",
      ],
    },
    companyInfo: {
      propDefinition: [
        userlist,
        "companyInfo",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.userlist.createOrReplaceCompany({
      identifier: this.identifier,
      companyInfo: this.companyInfo,
    });
    $.export("$summary", `Successfully ${response
      ? "updated"
      : "created"} company with identifier: ${this.identifier}`);
    return response;
  },
};
