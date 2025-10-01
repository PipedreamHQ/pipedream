import app from "../../data_stores.app.mjs";

export default {
  key: "data_stores-add-update-record",
  name: "Add or update a single record",
  description: "Add or update a single record in your [Pipedream Data Store](https://pipedream.com/data-stores/).",
  version: "0.0.11",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      description: "Enter a key for the record you'd like to create or select an existing key to update.",
    },
    value: {
      propDefinition: [
        app,
        "value",
      ],
    },
    ttl: {
      propDefinition: [
        app,
        "ttl",
      ],
    },
  },
  async run({ $ }) {
    const {
      key,
      value,
      ttl,
    } = this;
    const exists = await this.dataStore.has(key);
    const parsedValue = this.app.parseValue(value);

    if (ttl) {
      await this.dataStore.set(key, parsedValue, {
        ttl,
      });
    } else {
      await this.dataStore.set(key, parsedValue);
    }

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully ${exists ? "updated the record for" : "added a new record with the"} key, \`${key}\`${ttl ? ` (expires in ${this.app.formatTtl(ttl)})` : ""}.`);
    return {
      key,
      value: parsedValue,
      ttl: ttl || null,
    };
  },
};
