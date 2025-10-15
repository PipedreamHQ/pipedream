import app from "../../mailgenius.app.mjs";

export default {
  key: "mailgenius-get-email-result",
  name: "Get Email Results",
  description: "Returns the results of the test. [See the documentation](https://app.mailgenius.com/api-docs/index.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    slug: {
      propDefinition: [
        app,
        "slug",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.emailResult({
      $,
      slug: this.slug,
    });

    $.export("$summary", `The test results are '${response.status}'`);

    return response;
  },
};
