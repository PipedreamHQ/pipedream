import app from "../../y_gy.app.mjs";

export default {
  key: "y_gy-create-short-link",
  name: "Create Short Link",
  description: "Create new short links with y.gy. [See the documentation](https://app.y.gy/docs/api-docs/links#create-a-short-link)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    destinationUrl: {
      propDefinition: [
        app,
        "destinationUrl",
      ],
    },
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
    },
    suffix: {
      propDefinition: [
        app,
        "suffix",
      ],
    },
    password: {
      propDefinition: [
        app,
        "password",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createShortLink({
      $,
      data: {
        destination_url: this.destinationUrl,
        domain: this.domain,
        suffix: this.suffix,
        password: this.password,
      },
    });

    $.export("$summary", `The URL was successfully shortened: '${response.url}'`);

    return response;
  },
};
