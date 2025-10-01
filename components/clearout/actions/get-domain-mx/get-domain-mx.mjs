import app from "../../clearout.app.mjs";

export default {
  name: "Get Domain MX",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "clearout-get-domain-mx",
  description: "Get a domain MX. [See the documentation](https://docs.clearout.io/api-misc.html)",
  type: "action",
  props: {
    app,
    domain: {
      type: "string",
      label: "Domain",
      description: "Domain to verify MX records",
    },
  },
  async run({ $ }) {
    const response = await this.app.getDomainMx({
      $,
      data: {
        domain: this.domain,
      },
    });

    if (response) {
      $.export("$summary", `Successfully verified domain ${this.domain}`);
    }

    return response;
  },
};
