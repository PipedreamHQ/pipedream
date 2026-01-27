import caspio from "../../caspio.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "caspio-create-record",
  name: "Create Record",
  description: "Create a new record in the specified table. [See the documentation](https://demo.caspio.com/integrations/rest/swagger/index.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    caspio,
    table: {
      propDefinition: [
        caspio,
        "table",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    const { Result: fields } = await this.caspio.listTableFields({
      table: this.table,
    });
    for (const field of fields) {
      if (!field.Editable) continue;
      props[field.Name] = {
        type: field.Type === "YES/NO"
          ? "boolean"
          : "string",
        label: field.Name,
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      caspio,
      table,
      ...data
    } = this;

    if (Object.keys(data).length === 0) {
      throw new ConfigurationError("Must provide at least one field");
    }

    const { Result: fields } = await this.caspio.listTableFields({
      table: this.table,
    });

    for (const field of fields) {
      if (field.Type === "NUMBER" && data[field.Name]) {
        data[field.Name] = +data[field.Name];
      }
    }

    const response = await caspio.createRecord({
      $,
      table,
      data,
    });
    $.export("$summary", `Successfully created record in table ${table}`);
    return response;
  },
};
