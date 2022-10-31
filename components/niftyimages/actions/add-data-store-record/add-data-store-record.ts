import niftyimages from "../../app/niftyimages.app";
import { defineAction } from "@pipedream/types";
import { ConfigurationError } from "@pipedream/platform";
import { DataStoreField } from "../../common/types";

export default defineAction({
  name: "Add Data Store Record",
  description:
    "Create or update a Data Store Record [See docs here](https://api.niftyimages.com/)",
  key: "niftyimages-add-data-store-record",
  version: "0.0.1",
  type: "action",
  props: {
    niftyimages,
    dataStoreApiKey: {
      label: "Data Store API Key",
      description:
        "The API Key for the Data Store you want to create/update a record on.",
      type: "string",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const newProps = {};
    const apiKey = this.dataStoreApiKey;

    const fields: DataStoreField[] = await this.niftyimages.getDataStoreFields(
      apiKey,
    );
    const newPropNames = [];

    fields.forEach((field) => {
      const {
        name, type, date_input_format,
      } = field;
      const filteredName = name.replace(/ /g, "_");
      newProps[filteredName] = {
        label: this.niftyimages.getFieldLabel(field),
        description: date_input_format
          ? `Must be a date in the \`${date_input_format}\` format`
          : undefined,
        type: this.niftyimages.getFieldPropType(type),
      };
      newPropNames.push(filteredName);
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
  async run({ $ }): Promise<object> {
    const data = {};
    const $this = this as any;

    const strNames: string = $this.$fieldNames?.trim();
    if (!strNames) {
      throw new ConfigurationError("Please check the `Fields to Update` prop.");
    }

    strNames.split(",").forEach((fieldName) => {
      data[fieldName] = $this[fieldName];
    });

    const params = {
      $,
      data,
      apiKey: $this.dataStoreApiKey,
    };

    const response = await $this.niftyimages.addRecord(params);

    $.export("$summary", "Added record successfully");

    return response;
  },
});
