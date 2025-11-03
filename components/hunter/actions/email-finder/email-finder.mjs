import { ConfigurationError } from "@pipedream/platform";
import app from "../../hunter.app.mjs";

export default {
  key: "hunter-email-finder",
  name: "Email Finder",
  description: "Find the most likely email address from a domain name, a first name and a last name. [See the documentation](https://hunter.io/api-documentation/v2#email-finder).",
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
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      domain,
      company,
      firstName,
      lastName,
    } = this;

    if (!domain && !company) {
      throw new ConfigurationError("You must provide either a **Domain** or **Company** name");
    }

    const response = await app.emailFinder({
      $,
      params: {
        domain,
        company,
        first_name: firstName,
        last_name: lastName,
      },
    });

    $.export("$summary", "Successfully searched for email address");
    return response;
  },
};
