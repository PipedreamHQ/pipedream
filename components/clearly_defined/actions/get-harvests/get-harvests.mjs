import clearlyDefined from "../../clearly_defined.app.mjs";

export default {
  key: "clearly_defined-get-harvests",
  name: "Get Harvests",
  description: "Get all the harvested data for a component revision. [See the documentation](https://api.clearlydefined.io/api-docs/#/harvest/get_harvest__type___provider___namespace___name___revision_).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    form: {
      propDefinition: [
        clearlyDefined,
        "form",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.clearlyDefined.getHarvests({
      $,
      type: this.type,
      provider: this.provider,
      name: this.name,
      namespace: this.namespace,
      revision: this.revision,
      params: {
        form: this.form,
      },
    });

    if (response && Object.keys(response).length > 0) {
      $.export("$summary", "Successfully retrieved harvest details");
    }

    return response;
  },
};
