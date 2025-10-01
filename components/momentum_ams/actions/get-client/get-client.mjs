import app from "../../momentum_ams.app.mjs";

export default {
  key: "momentum_ams-get-client",
  name: "Get Client",
  description: "Get data for the client with the specified ID. [See the documentation](https://support.momentumamp.com/nowcerts-rest-api-search-insureds)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "id",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getClient({
      $,
      id: this.id,
    });
    $.export("$summary", "Successfully retrieved the client with ID: " + this.id);
    return response;
  },
};
