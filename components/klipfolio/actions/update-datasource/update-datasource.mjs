import app from "../../klipfolio.app.mjs";

export default {
  key: "klipfolio-update-datasource",
  name: "Update Datasource",
  description: "Update the specified data source. [See the documentation](https://apidocs.klipfolio.com/reference/data-sources#put-datasourcesid)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    datasourceId: {
      propDefinition: [
        app,
        "datasourceId",
      ],
    },
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
    refreshInterval: {
      propDefinition: [
        app,
        "refreshInterval",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.updateDatasource({
      $,
      datasourceId: this.datasourceId,
      data: {
        name: this.name,
        description: this.description,
        refresh_interval: parseInt(this.refreshInterval, 10),
      },
    });

    $.export("$summary", `Successfully updated Datasource named '${this.name}'`);

    return response;
  },
};
