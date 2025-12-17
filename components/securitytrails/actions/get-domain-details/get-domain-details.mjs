import app from "../../securitytrails.app.mjs";

export default {
  key: "securitytrails-get-domain-details",
  name: "Get Domain Details",
  description: "Returns the current data about the given hostname. [See the documentation](https://docs.securitytrails.com/reference/domain-details)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    hostname: {
      propDefinition: [
        app,
        "hostname",
      ],
    },
  },
  methods: {
    getDomainDetails({
      hostname, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/domain/${hostname}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      getDomainDetails,
      hostname,
    } = this;

    const response = await getDomainDetails({
      $,
      hostname,
    });
    $.export("$summary", `Successfully retrieved details for hostname \`${response.hostname}\`.`);
    return response;
  },
};
