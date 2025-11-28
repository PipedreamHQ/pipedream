import app from "../../tomba.app.mjs";

export default {
  key: "tomba-email-finder",
  name: "Find Email",
  description:
    "Generate or retrieve the most likely email address from a domain name, a first name and a last name. [See the documentation](https://tomba.io/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.findEmail({
      $,
      domain: this.domain,
      firstName: this.firstName,
      lastName: this.lastName,
    });

    $.export(
      "$summary",
      `Successfully found email for ${this.firstName} ${this.lastName} at ${this.domain}`,
    );
    return response;
  },
};
