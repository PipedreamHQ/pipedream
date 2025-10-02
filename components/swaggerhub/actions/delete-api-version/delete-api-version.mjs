import swaggerhub from "../../swaggerhub.app.mjs";

export default {
  key: "swaggerhub-delete-api-version",
  name: "Delete API Version",
  description: "Deletes a version of an API. [See the docs here](https://app.swaggerhub.com/apis/swagger-hub/registry-api/1.0.66#/APIs/deleteApiVersion)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    swaggerhub,
    owner: {
      propDefinition: [
        swaggerhub,
        "owner",
      ],
    },
    api: {
      propDefinition: [
        swaggerhub,
        "api",
        (c) => ({
          owner: c.owner,
        }),
      ],
    },
    version: {
      propDefinition: [
        swaggerhub,
        "version",
        (c) => ({
          owner: c.owner,
          api: c.api,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.swaggerhub.deleteApiVersion({
      owner: this.owner,
      api: this.api,
      version: this.version,
    });
    $.export("$summary", "Successfully deleted API version");
    return response;
  },
};
