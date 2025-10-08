import app from "../../uplead.app.mjs";

export default {
  name: "Get Contact By Email",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "uplead-get-contact-by-email",
  description: "Get a contact by email. [See the documentation](https://docs.uplead.com/#person-api)",
  type: "action",
  props: {
    app,
    email: {
      label: "Email",
      description: "Email of the contact",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.app.getContactByEmail({
      $,
      query: {
        email: this.email,
      },
    });

    if (response?.data?.id) {
      $.export("$summary", `Successfully retrieved contact with ID \`${response.data.id}\``);
    }

    return response;
  },
};
