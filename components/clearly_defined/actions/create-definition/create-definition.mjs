import clearlyDefined from "../../clearly_defined.app.mjs";

export default {
  key: "clearly_defined-create-definition",
  name: "Create Definition",
  description: "Request the creation of a resource. [See the documentation](https://api.clearlydefined.io/api-docs/#/definitions/post_definitions).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    clearlyDefined,
    type: {
      propDefinition: [
        clearlyDefined,
        "type",
      ],
    },
    provider: {
      propDefinition: [
        clearlyDefined,
        "provider",
      ],
    },
    namespace: {
      propDefinition: [
        clearlyDefined,
        "namespace",
      ],
    },
    name: {
      propDefinition: [
        clearlyDefined,
        "name",
      ],
    },
    revision: {
      propDefinition: [
        clearlyDefined,
        "revision",
      ],
    },
  },
  async run({ $ }) {
    const component = `${this.type}/${this.provider}/${this.namespace}/${this.name}${this.revision
      ? "/" + this.revision
      : ""}`;

    const response = await this.clearlyDefined.createDefinition({
      $,
      data: [
        component,
      ],
    });

    if (response && Object.keys(response).length > 0) {
      $.export("$summary", "Successfully created definition");
    }

    return response;
  },
};
