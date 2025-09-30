import app from "../../urlbae.app.mjs";

export default {
  name: "Shorten URL",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "urlbae-shorten-url",
  description: "Creates a shorten URL. [See the documentation](https://urlbae.com/developers#shorten-a-link)",
  type: "action",
  props: {
    app,
    url: {
      type: "string",
      label: "URL",
      description: "URL to be shortened",
    },
    password: {
      type: "string",
      label: "Password",
      description: "Password to access the URL",
      optional: true,
    },
    custom: {
      type: "string",
      label: "Custom",
      description: "Custom alias for the shortened URL",
      optional: true,
    },
    expiry: {
      type: "string",
      label: "Expiry",
      description: "Expiration for the URL, i.e. `2023-12-31 23:59:59`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.shortenUrl({
      $,
      data: {
        url: this.url,
        password: this.password,
        custom: this.custom,
        expiry: this.expiry,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created short URL with ID ${response.id}`);
    }

    return response;
  },
};
