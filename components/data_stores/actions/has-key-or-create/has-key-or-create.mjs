import app from "../../data_stores.app.mjs";

export default {
  key: "data_stores-has-key-or-create",
  name: "Check for existence of key",
  description: "Check if a key exists in your [Pipedream Data Store](https://pipedream.com/data-stores/) or create one if it doesn't exist.",
  version: "0.1.4",
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
      description: "Enter the key you'd like to check.",
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
    if (await this.dataStore.has(this.key)) {
      $.export("$summary", `Key \`${this.key}\` exists.`);

      return {
        existingKeyFound: true,
        newKeyCreated: false,
      };
    }

    if (!this.app.shouldAddRecord(this.addRecordIfNotFound)) {
      $.export("$summary", `Key \`${this.key}\` does not exist.`);

      return {
        existingKeyFound: false,
        newKeyCreated: false,
      };
    }

    const parsedValue = this.app.parseValue(this.value);

    if (this.ttl) {
      await this.dataStore.set(this.key, parsedValue, {
        ttl: this.ttl,
      });
      $.export("$summary", `Key \`${this.key}\` was not found. Successfully added a new record (expires in ${this.app.formatTtl(this.ttl)}).`);
    } else {
      await this.dataStore.set(this.key, parsedValue);
      $.export("$summary", `Key \`${this.key}\` was not found. Successfully added a new record.`);
    }

    return {
      existingKeyFound: false,
      newKeyCreated: true,
      value: parsedValue,
      ttl: this.ttl || null,
    };
  },
};
