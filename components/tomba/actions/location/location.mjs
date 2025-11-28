import app from "../../tomba.app.mjs";

export default {
  key: "tomba-location",
  name: "Get Location",
  description:
    "Get employees location based on the domain name. [See the documentation](https://tomba.io/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    const response = await this.app.getLocation({
      $,
      domain: this.domain,
    });

    $.export(
      "$summary",
      `Successfully retrieved location data for domain: ${this.domain}`,
    );
    return response;
  },
};
