import app from "../../pdf_co.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  name: "PDF Merge",
  description: "Merge PDF from two or more PDF files into a new one. [See docs here](https://apidocs.pdf.co/31-pdf-merge)",
  key: "pdf_co-pdf-merge",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    urls: {
      propDefinition: [
        app,
        "urls",
      ],
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
    if (!Array.isArray(this.urls) || this.urls.length <= 1) {
      throw new ConfigurationError("You have to provide at least two PDF urls");
    }
    const payload = {
      url: this.urls.join(","),
      name: this.name,
      expiration: this.expiration,
      async: this.async,
      profiles: this.profiles,
    };
    const endpoint = "/pdf/merge";
    const response = await this.app.genericRequest(
      $,
      payload,
      endpoint,
    );
    $.export("$summary", `Successfully merged ${this.urls.length} PDF files`);
    return response;
  },
};
