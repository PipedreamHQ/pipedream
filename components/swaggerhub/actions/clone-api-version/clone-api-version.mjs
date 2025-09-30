import swaggerhub from "../../swaggerhub.app.mjs";

export default {
  key: "swaggerhub-clone-api-version",
  name: "Clone API Version",
  description: "Clones a version for an API. [See the docs here](https://app.swaggerhub.com/apis/swagger-hub/registry-api/1.0.66#/APIs/cloneApi)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
      description: "The version to clone from",
    },
    newVersion: {
      type: "string",
      label: "New Version",
      description: "The new version",
    },
    makePrivate: {
      type: "boolean",
      label: "Make Private",
      description: "Make the new version private",
      default: true,
    },
  },
  async run({ $ }) {
    const response = await this.swaggerhub.cloneApiVersion({
      owner: this.owner,
      api: this.api,
      version: this.version,
      newVersion: this.newVersion,
      makePrivate: this.makePrivate,
    });
    $.export("$summary", "Successfully cloned API version");
    return response;
  },
};
