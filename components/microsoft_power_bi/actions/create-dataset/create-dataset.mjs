import powerBi from "../../microsoft_power_bi.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "microsoft_power_bi-create-dataset",
  name: "Create Dataset",
  description: "Creates a new Push Dataset in Power BI. [See the documentation](https://learn.microsoft.com/en-us/rest/api/power-bi/push-datasets/datasets-post-dataset)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    powerBi,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the new dataset",
    },
    tables: {
      type: "string",
      label: "Tables",
      description: `An array of [Table](https://learn.microsoft.com/en-us/rest/api/power-bi/push-datasets/datasets-post-dataset#table) objects. Custom expression recommended.
      Example: [{
        "name": "Product",
        "columns": [
          {
            "name": "ProductID",
            "dataType": "Int64"
          },
          {
            "name": "Name",
            "dataType": "string"
          }
        ]
      }]`,
    },
  },
  async run({ $ }) {
    let tables = this.tables;
    if (!Array.isArray(tables)) {
      try {
        tables = JSON.parse(tables);
      } catch {
        throw new ConfigurationError("Could not parse Tables array.");
      }
    }
    const response = await this.powerBi.createDataset({
      data: {
        name: this.name,
        defaultMode: "Push",
        tables,
      },
      $,
    });

    $.export("$summary", `Successfully created new dataset "${this.name}".`);

    return response;
  },
};
