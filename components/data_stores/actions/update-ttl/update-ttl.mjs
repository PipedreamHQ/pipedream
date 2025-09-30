import app from "../../data_stores.app.mjs";

export default {
  key: "data_stores-update-ttl",
  name: "Update Record Expiration",
  description: "Update the expiration time for a record in your [Pipedream Data Store](https://pipedream.com/data-stores/).",
  version: "0.0.2",
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
      description: "Select the key for the record you'd like to update the expiration time.",
    },
    ttlOption: {
      type: "string",
      label: "Expiration Type",
      description: "Choose a common expiration time or specify a custom value",
      options: [
        {
          label: "Custom value",
          value: "custom",
        },
        {
          label: "No expiration (remove expiry)",
          value: "0",
        },
        {
          label: "1 hour",
          value: "3600",
        },
        {
          label: "1 day",
          value: "86400",
        },
        {
          label: "1 week",
          value: "604800",
        },
        {
          label: "30 days",
          value: "2592000",
        },
        {
          label: "90 days",
          value: "7776000",
        },
        {
          label: "1 year",
          value: "31536000",
        },
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.ttlOption === "custom") {
      props.ttl = {
        type: "integer",
        label: "Custom TTL (seconds)",
        description: "The number of seconds until this record expires and is automatically deleted. Use 0 to remove expiration.",
        min: 0,
        max: 31536000, // 1 year (safe upper limit)
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      key, ttlOption, ttl,
    } = this;

    // Determine TTL value to use
    const ttlValue = ttlOption === "custom"
      ? ttl
      : parseInt(ttlOption, 10);

    if (!await this.dataStore.has(key)) {
      $.export("$summary", `No record found with key \`${key}\`.`);
      return {
        success: false,
        message: `No record found with key ${key}`,
      };
    }

    if (ttlValue === 0) {
      // Remove expiration
      await this.dataStore.setTtl(key, null);
      $.export("$summary", `Successfully removed expiration for key \`${key}\`.`);
      return {
        success: true,
        key,
        ttl: null,
        message: "Expiration removed",
      };
    } else {
      // Update TTL
      await this.dataStore.setTtl(key, ttlValue);
      $.export("$summary", `Successfully updated expiration for key \`${key}\` (expires in ${this.app.formatTtl(ttlValue)}).`);
      return {
        success: true,
        key,
        ttl: ttlValue,
        ttlFormatted: this.app.formatTtl(ttlValue),
      };
    }
  },
};
