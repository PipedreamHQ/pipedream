import app from "../../contact_enhance.app.mjs";

export default {
  key: "contact_enhance-find-contact",
  name: "Find Contact",
  description: "Locates a specific contact in the database using the email. [See the documentation](https://u.pcloud.link/publink/show?code=XZ8tzp0ZjaO5gqh55FuTmEEbwt0GOJPtqqgX)",
  version: "0.0.3",
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
      label: "Email",
      description: "The email address of the contact to find",
    },
  },
  methods: {
    getContacts(args = {}) {
      return this.app.post({
        path: "/contacts",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      getContacts,
      email,
    } = this;

    const response = await getContacts({
      $,
      params: {
        email,
      },
    });

    if (response.message) {
      $.export("$summary", `Failed to find contact with email \`${email}\``);
      return response;
    }

    $.export("$summary", `Successfully found contact with email \`${email}\``);
    return response;
  },
};
