import app from "../../klipfolio.app.mjs";

export default {
  key: "klipfolio-delete-datasource",
  name: "Delete Datasource",
  description: "Delete the data source associated with a specific data source ID. [See the documentation](https://apidocs.klipfolio.com/reference/data-sources#delete-datasourcesid)",
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
  },

  async run({ $ }) {
    const response = await this.app.deleteDatasource({
      $,
      datasourceId: this.datasourceId,
    });

    $.export("$summary", `Successfully deleted datasource with ID: ${this.datasourceId}`);

    return response;
  },
};
