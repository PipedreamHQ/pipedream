import app from "../../pdf_co.app.mjs";

export default {
  name: "Remove PDF security",
  description: "Remove PDF security. [See docs here](https://apidocs.pdf.co/32-pdf-password-and-security)",
  key: "pdf_co-pdf-remove-security",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
    password: {
      propDefinition: [
        app,
        "password",
      ],
      optional: false,
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    expiration: {
      propDefinition: [
        app,
        "expiration",
      ],
    },
    async: {
      propDefinition: [
        app,
        "async",
      ],
    },
    profiles: {
      propDefinition: [
        app,
        "profiles",
      ],
    },
  },
  async run({ $ }) {
    const payload = {
      url: this.url,
      async: this.async,
      profiles: this.profiles,
      password: this.password,
      name: this.name,
      expiration: this.expiration,
    };
    const endpoint = "/pdf/security/remove";
    const response = await this.app.genericRequest(
      $,
      payload,
      endpoint,
    );
    $.export("$summary", `Successfully removed security from: ${this.url}`);
    return response;
  },
};
