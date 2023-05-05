import { ConfigurationError } from "@pipedream/platform";
import app from "../../data_stores.app.mjs";

export default {
  key: "data_stores-append-to-record",
  name: "Append to record",
  description: "Append to a record in your data store [Pipedream Data Store](https://pipedream.com/data-stores/). If the record does not exist, a new record will be created in an array format.",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    dataStore: {
      propDefinition: [
        app,
        "dataStore",
      ],
    },
    key: {
      propDefinition: [
        app,
        "key",
        ({ dataStore }) => ({
          dataStore,
        }),
      ],
      description: "Enter a key for the record set you'd like to append to. Refer to your existing keys [here](https://pipedream.com/data-stores/).",
    },
    value: {
      propDefinition: [
        app,
        "value",
      ],
    },
  },
  async run({ $ }) {
    const {
      key,
      value,
    } = this;
    const currentValue = await this.dataStore.get(key);
    if (currentValue && !Array.isArray(currentValue)) {
      throw new ConfigurationError("The value for the specified key is not an array. You can only append records to an array.");
    }
    const recordSet = currentValue ?? [];
    const parsedValue = this.app.parseValue(value);
    recordSet.push(parsedValue);
    await this.dataStore.set(key, recordSet);
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully ${currentValue ? "appended to the record for" : "created new record with the"} key: \`${key}\`.`);
    return {
      key,
      value: parsedValue,
    };
  },
};
