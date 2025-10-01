import { ConfigurationError } from "@pipedream/platform";
import prospeo from "../../prospeo.app.mjs";

export default {
  name: "Find Email",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "prospeo-find-email",
  description: "Find an email address. [See the documentation](https://prospeo.io/api/email-finder)",
  type: "action",
  props: {
    prospeo,
    fullName: {
      type: "string",
      label: "Full Name",
      description: "The person's full name. Prospeo advises you to submit the first and last name for higher accuracy.",
    },
    company: {
      type: "string",
      label: "Company Domain/Name",
      description: "The company domain, website, or name. Using a domain or website is recommended for better accuracy. If submitting a company name, it needs to be between 3 to 75 characters.",
    },
  },
  async run({ $ }) {
    try {
      const response = await this.prospeo.findEmail({
        $,
        data: {
          company: this.company,
          full_name: this.fullName,
        },
      });

      $.export("$summary", `Successfully found email for **${this.fullName}** at **${this.company}**`);

      return response;
    } catch ({ response }) {
      if (response.data.message === "NO_RESULT") {
        $.export("$summary", `No results found for **${this.fullName}** at ${this.company}`);
        return {};
      } else {
        throw new ConfigurationError(response.data);
      }
    }
  },
};
