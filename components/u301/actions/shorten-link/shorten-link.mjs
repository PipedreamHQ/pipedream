import app from "../../u301.app.mjs";

export default {
  key: "u301-shorten-link",
  name: "Shorten URL",
  description: "Shorten a long link. [See the documentation](https://docs.u301.com/api-reference/endpoint/create)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.shortenLink({
      $,
      params: {
        url: this.url,
        title: this.title,
      },
    });

    $.export("$summary", `Successfully shortened the URL: ${response.shortened}`);

    return response;
  },
};
