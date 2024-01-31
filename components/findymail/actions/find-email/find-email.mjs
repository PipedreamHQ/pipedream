import findymail from "../../findymail.app.mjs";

export default {
  key: "findymail-find-email",
  name: "Find Email",
  description: "Finds an email address using a given full name and a website domain. [See the documentation](https://app.findymail.com/docs/)",
  version: "0.0.1",
  type: "action",
  props: {
    findymail,
    fullName: {
      propDefinition: [
        findymail,
        "fullName",
      ],
    },
    websiteDomain: {
      propDefinition: [
        findymail,
        "websiteDomain",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.findymail.findEmailByNameAndDomain({
      fullName: this.fullName,
      websiteDomain: this.websiteDomain,
    });
    $.export("$summary", `Found email: ${response.contact
      ? response.contact.email
      : "No email found"}`);
    return response;
  },
};
