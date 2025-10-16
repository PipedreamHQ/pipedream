import app from "../../data_stores.app.mjs";

export default {
  key: "data_stores-get-record-or-create",
  name: "Get record (or create one if not found)",
  description: "Get a single record in your [Pipedream Data Store](https://pipedream.com/data-stores/) or create one if it doesn't exist.",
  version: "0.0.14",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
      description: "Select the key for the data you'd like to retrieve, or enter one manually.",
    },
    addRecordIfNotFound: {
      propDefinition: [
        app,
        "addRecordIfNotFound",
      ],
    },
    ttl: {
      propDefinition: [
        app,
        "ttl",
      ],
    },
  },
  async additionalProps() {
    const props = {};
    if (this.app.shouldAddRecord(this.addRecordIfNotFound)) {
      props.value = app.propDefinitions.value;
    }
    return props;
  },
  async run({ $ }) {
    const record = await this.dataStore.get(this.key);
    let summary, response;

    if (record !== undefined) {
      summary = `Found data for the key, \`${this.key}\`.`;
      response = record;
    }
    else if (!this.app.shouldAddRecord(this.addRecordIfNotFound)) {
      summary = `No data found for key, \`${this.key}\`.`;
    }
    else {
      const parsedValue = this.app.parseValue(this.value);

      if (this.ttl) {
        await this.dataStore.set(this.key, parsedValue, {
          ttl: this.ttl,
        });
        summary = `Successfully added a new record with the key, \`${this.key}\` (expires in ${this.app.formatTtl(this.ttl)}).`;
      } else {
        await this.dataStore.set(this.key, parsedValue);
        summary = `Successfully added a new record with the key, \`${this.key}\`.`;
      }

      response = parsedValue;

      // Include TTL information in the return value if it was set
      if (this.ttl) {
        response = {
          value: parsedValue,
          ttl: this.ttl,
        };
      }
    }

    $.export("$summary", summary);
    $.export("key", this.key);
    return response;
  },
};
