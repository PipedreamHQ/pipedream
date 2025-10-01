import findymail from "../../findymail.app.mjs";

export default {
  key: "findymail-find-email",
  name: "Find Email",
  description: "Finds an email address using a given full name and a website domain. [See the documentation](https://app.findymail.com/docs/#finder-POSTapi-search-name)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    findymail,
    name: {
      propDefinition: [
        findymail,
        "name",
      ],
    },
    domain: {
      propDefinition: [
        findymail,
        "domain",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.findymail.findEmailByNameAndDomain({
      $,
      data: {
        name: this.name,
        domain: this.domain,
      },
    });

    $.export("$summary", response.contact.email
      ? `Found email: ${response.contact.email}`
      : "No email found");
    return response;
  },
};
