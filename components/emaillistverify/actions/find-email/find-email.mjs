import app from "../../emaillistverify.app.mjs";

export default {
  key: "emaillistverify-find-email",
  name: "Find Email",
  description: "Generate a series of potential email addresses by synthesizing first names, last names, and company domains. [See the documentation](https://emaillistverify.com/docs/#tag/Email-Validation-API/operation/find-contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
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
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.findEmail({
      $,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        domain: this.domain,
      },
    });

    $.export("$summary", `Successfully generated ${response.length} email addresses`);

    return response;
  },
};
