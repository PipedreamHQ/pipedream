import findymail from "../../findymail.app.mjs";

export default {
  key: "findymail-find-email-name-domain",
  name: "Find Email by company domain",
  description: "Locates an email using a company's website. [See the documentation](https://app.findymail.com/docs/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    findymail,
    domain: {
      propDefinition: [
        findymail,
        "domain",
      ],
    },
    roles: {
      type: "string[]",
      label: "Roles",
      description: "Target roles related to the given domain (max 3 roles)",
    },
  },
  async run({ $ }) {
    const response = await this.findymail.findEmailByCompanyDomain({
      $,
      data: {
        domain: this.domain,
        roles: this.roles,
      },
    });
    $.export("$summary", `Successfully found ${response.contacts?.length || 0} email for ${this.domain}`);
    return response;
  },
};
