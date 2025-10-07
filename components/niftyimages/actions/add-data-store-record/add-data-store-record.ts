import niftyimages from "../../app/niftyimages.app";
import { defineAction } from "@pipedream/types";
import { ConfigurationError } from "@pipedream/platform";
import {
  AddRecordParams, DataStoreField,
} from "../../common/types";

export default defineAction({
  name: "Add Data Store Record",
  description:
    "Create or update a Data Store Record [See docs here](https://api.niftyimages.com/)",
  key: "niftyimages-add-data-store-record",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    niftyimages,
    dataStoreApiKey: {
      label: "Data Store API Key",
      description:
        `The API Key for the Data Store you want to create/update a record on.
        \\
        To find this, go to **Data Sources**, choose a Data Store, and click on **"Use Our API"**.
        \\
        *Note that only a **Custom Store** can be updated.*`,
      type: "string",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const newProps: object = {};
    const apiKey: string = this.dataStoreApiKey?.trim();

    let fields: DataStoreField[];
    try {
      fields = await this.niftyimages.getDataStoreFields(apiKey);
    } catch (err) {
      throw new ConfigurationError("Error fetching data - please check the **API Key**.");
    }
    const newPropNames = [];

    fields.forEach((field) => {
      const {
        name, type, date_input_format,
      } = field;
      newProps[name] = {
        label: this.niftyimages.getFieldLabel(field),
        description: date_input_format
          ? `Must be a date in the \`${date_input_format}\` format`
          : undefined,
        type: this.niftyimages.getFieldPropType(type),
      };
      newPropNames.push(name);
    });

    newProps["$fieldNames"] = {
      label: "Fields to Update",
      description: "Comma-separated list of the fields to be updated (defaults to all).",
      type: "string",
      optional: true,
      default: newPropNames.join(),
    };

    return newProps;
  },
  async run({ $ }) {
    // I had to explicitly cast the type here due to a current limitation
    // in the action type combined with the additionalProps method
    const $this = this as {
      niftyimages: {
        addRecord: (args: AddRecordParams) => Promise<object>;
      };
      $fieldNames?: string;
      dataStoreApiKey: string;
    };

    const strNames: string = $this.$fieldNames?.trim();
    if (!strNames) {
      throw new ConfigurationError("Please check the `Fields to Update` prop.");
    }

    const data: object = {};
    strNames.split(",").forEach((fieldName) => {
      const name = fieldName.trim();
      data[name] = $this[name];
    });

    const params: AddRecordParams = {
      $,
      apiKey: $this.dataStoreApiKey,
      data,
    };

    const response: object = await $this.niftyimages.addRecord(params);

    $.export("$summary", "Updated record successfully");

    return response;
  },
});
