import app from "../../klipfolio.app.mjs";

export default {
  key: "klipfolio-create-datasource",
  name: "Create Datasource",
  description: "Create a data source. [See the documentation](https://apidocs.klipfolio.com/reference/data-sources#post-datasources)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    format: {
      propDefinition: [
        app,
        "format",
      ],
    },
    connector: {
      propDefinition: [
        app,
        "connector",
      ],
    },
    refreshInterval: {
      propDefinition: [
        app,
        "refreshInterval",
      ],
    },
    endpointUrl: {
      propDefinition: [
        app,
        "endpointUrl",
      ],
    },
    method: {
      propDefinition: [
        app,
        "method",
      ],
    },
    additionalProperties: {
      propDefinition: [
        app,
        "additionalProperties",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.createDatasource({
      $,
      data: {
        name: this.name,
        description: this.description,
        format: this.format,
        connector: this.connector,
        refresh_interval: parseInt(this.refreshInterval, 10),
        properties: {
          endpoint_url: this.endpointUrl,
          method: this.method,
          ...this.additionalProperties,
        },
      },
    });

    $.export("$summary", `Successfully created Datasource named '${this.name}'`);

    return response;
  },
};
