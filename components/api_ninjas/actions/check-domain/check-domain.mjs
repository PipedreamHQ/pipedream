import app from "../../api_ninjas.app.mjs";

export default {
  key: "api_ninjas-check-domain",
  name: "Check Domain",
  description: "Returns domain availability status and registration details for a given domain name. [See the documentation](https://api-ninjas.com/api/domain)",
  version: "0.0.3",
  annotations: {
    openWorldHint: true,
    destructiveHint: false,
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
    },
  },
  async run({ $ }) {
    const response = await this.app.checkDomain({
      $,
      params: {
        domain: this.domain,
      },
    });
    $.export("$summary", "Successfully submited domain to be checked. Domain availability: " + response.available);
    return response;
  },
};
