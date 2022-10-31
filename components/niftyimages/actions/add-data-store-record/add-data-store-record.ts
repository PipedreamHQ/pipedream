import niftyimages from "../../app/niftyimages.app";
import { defineAction } from "@pipedream/types";
import { DataStoreField } from "../../common/types";

export default defineAction({
  name: "Add Data Store Record",
  description:
    "Create or update a Data Store Record [See docs here](https://api.niftyimages.com/)",
  key: "niftyimages-add-data-store-record",
  version: "0.0.1",
  type: "action",
  methods: {
    async additionalProps() {
      const props = {};

      const apiKey = this.dataStoreApiKey;

      const fields: DataStoreField[] = await this.niftyimages.getDataStoreFields(apiKey);

      fields.forEach((field, index) => {
        const {
          type, date_input_format,
        } = field;
        props[`field${index}`] = {
          label: this.niftyimages.getFieldLabel(field),
          description: date_input_format
            ? `Must be a date in the \`|${date_input_format}\` format`
            : undefined,
          type: (type === "NUMBER")
            ? "integer"
            : "string",
        };
      });

      return props;
    },
  },
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
  async run({ $ }): Promise<object> {
    const data = {};

    const params = {
      $,
      data,
    };

    const response = await this.niftyimages.addRecord(params);

    $.export("$summary", "Created document successfully");

    return response;
  },
});
