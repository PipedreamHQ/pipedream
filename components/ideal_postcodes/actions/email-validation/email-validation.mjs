import app from "../../ideal_postcodes.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "ideal_postcodes-email-validation",
  name: "Email Validation",
  description: "Validate email addresses using Ideal Postcodes. [See the documentation](https://docs.ideal-postcodes.co.uk/docs/api/email-validation).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    query: {
      type: "string",
      label: "Email Address",
      description: "The email address to validate.",
    },
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
    },
  },
  methods: {
    validateEmail(args = {}) {
      return this.app._makeRequest({
        path: "/emails",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      validateEmail,
      query,
      tags,
    } = this;

    const response = await validateEmail({
      $,
      params: {
        query,
        tags: utils.encode(tags),
      },
    });

    $.export("$summary", `Successfully validated email address with message \`${response.message}\``);
    return response;
  },
};
