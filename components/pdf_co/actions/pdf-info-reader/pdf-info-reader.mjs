import app from "../../pdf_co.app.mjs";

export default {
  name: "PDF Info Reader",
  description: "Get detailed information about the PDF document, properties and security permissions. [See docs here](https://apidocs.pdf.co/02-pdf-info-reader)",
  key: "pdf_co-pdf-info-reader",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    httpusername: {
      propDefinition: [
        app,
        "httpusername",
      ],
    },
    httppassword: {
      propDefinition: [
        app,
        "httppassword",
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
      httpusername: this.httpusername,
      httppassword: this.httppassword,
      async: this.async,
      profiles: this.profiles,
    };
    const endpoint = "/pdf/info";
    const response = await this.app.genericRequest(
      $,
      payload,
      endpoint,
    );
    $.export("$summary", `Successfully fetched PDF info from: ${this.url}`);
    return response;
  },
};
