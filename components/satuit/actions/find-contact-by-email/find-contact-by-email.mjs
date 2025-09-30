import app from "../../satuit.app.mjs";

export default {
  key: "satuit-find-contact-by-email",
  name: "Find Contact By Email",
  description: "Searches for a specific contact within the Satuit platform using an email address as the key identifier. [See the documentation](https://satuittechnologies.zendesk.com/hc/en-us/articles/360055725213-Satuit-REST-API-Postman-Documentation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address of the contact",
    },
  },
  async run({ $ }) {
    const {
      app,
      email,
    } = this;

    const response = await app.getContact({
      $,
      params: {
        top: 1,
        filters: encodeURIComponent(
          JSON.stringify({
            ["pcontact.ccemail"]: email,
          }),
        ),
      },
    });

    if (!response) {
      $.export("$summary", `No contact was found with the email address \`${email}\``);
      return {
        success: false,
      };
    }

    $.export("$summary", `Successfully found a contact with the email address \`${email}\``);

    return response?.Result[0];
  },
};
