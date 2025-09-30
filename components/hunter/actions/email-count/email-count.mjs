import { ConfigurationError } from "@pipedream/platform";
import app from "../../hunter.app.mjs";

export default {
  key: "hunter-email-count",
  name: "Email Count",
  description: "Get the number of email addresses Hunter has for one domain or company. [See the documentation](https://hunter.io/api-documentation/v2#email-count).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
      optional: true,
    },
    company: {
      propDefinition: [
        app,
        "company",
      ],
      optional: true,
    },
    type: {
      propDefinition: [
        app,
        "type",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      domain,
      company,
      type,
    } = this;

    if (!domain && !company) {
      throw new ConfigurationError("You must provide either a **Domain** or **Company** name");
    }

    const response = await app.emailCount({
      $,
      params: {
        domain,
        company,
        type,
      },
    });

    $.export("$summary", "Successfully retrieved email count");
    return response;
  },
};
