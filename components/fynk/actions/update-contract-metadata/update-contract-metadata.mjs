import fynk from "../../fynk.app.mjs";

export default {
  key: "fynk-update-contract-metadata",
  name: "Update Contract Metadata",
  description: "Update metadata values or dynamic fields associated with a contract in Fynk. [See the documentation](https://app.fynk.com/v1/docs#/operations/v1.documents.metadata-values.update).",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    fynk,
    documentUuid: {
      propDefinition: [
        fynk,
        "documentUuid",
      ],
    },
    metadataValueUuid: {
      propDefinition: [
        fynk,
        "metadataValueUuid",
        (c) => ({
          documentUuid: c.documentUuid,
        }),
      ],
    },
    value: {
      type: "string",
      label: "Value",
      description: "The new value for the metadata field. The format depends on the metadata's `value_type`. [See the documentation](https://app.fynk.com/v1/docs#/operations/v1.documents.metadata-values.store#value-format) for format details.",
    },
  },
  methods: {
    // Helper function to validate and format the metadata value according to its `value_type`
    formatMetadataValue(rawValue, metadata) {
      const valueType = metadata.value_type;

      switch (valueType) {
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailStr = String(rawValue).trim();
        if (!emailRegex.test(emailStr)) {
          throw new Error(`Invalid email format: ${rawValue}`);
        }
        return emailStr;
      }

      case "number": {
        const num = typeof rawValue === "string"
          ? parseFloat(rawValue)
          : Number(rawValue);
        if (isNaN(num)) {
          throw new Error(`Invalid number: ${rawValue}`);
        }
        return num;
      }

      case "currency": {
        const currencyStr = String(rawValue).trim();
        const parts = currencyStr.split(";");
        if (parts.length !== 2) {
          throw new Error(`Invalid currency format. Expected "CURRENCY;AMOUNT", got: ${rawValue}`);
        }
        const [
          currency,
          amount,
        ] = parts;
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) {
          throw new Error(`Invalid currency amount: ${amount}`);
        }
        if (metadata.settings?.currencies && !metadata.settings.currencies.includes(currency)) {
          throw new Error(`Invalid currency code. Allowed: ${metadata.settings.currencies.join(", ")}, got: ${currency}`);
        }
        return `${currency};${numAmount}`;
      }

      case "currency_duration": {
        const currencyDurationStr = String(rawValue).trim();
        const parts = currencyDurationStr.split(";");
        if (parts.length !== 3) {
          throw new Error(`Invalid currency_duration format. Expected "CURRENCY;AMOUNT;PERIOD", got: ${rawValue}`);
        }
        const [
          currency,
          amount,
          period,
        ] = parts;
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) {
          throw new Error(`Invalid currency amount: ${amount}`);
        }
        if (period !== "monthly" && period !== "yearly") {
          throw new Error(`Invalid period. Must be "monthly" or "yearly", got: ${period}`);
        }
        if (metadata.settings?.currencies && !metadata.settings.currencies.includes(currency)) {
          throw new Error(`Invalid currency code. Allowed: ${metadata.settings.currencies.join(", ")}, got: ${currency}`);
        }
        return `${currency};${numAmount};${period}`;
      }

      case "select": {
        const selectStr = String(rawValue).trim();
        if (metadata.select_values && !metadata.select_values.includes(selectStr)) {
          throw new Error(`Invalid select value. Allowed: ${metadata.select_values.join(", ")}, got: ${selectStr}`);
        }
        return selectStr;
      }

      case "date": {
        const dateStr = String(rawValue).trim();
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateStr)) {
          throw new Error(`Invalid date format. Expected "YYYY-MM-DD", got: ${rawValue}`);
        }
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          throw new Error(`Invalid date: ${rawValue}`);
        }
        return dateStr;
      }

      case "bool": {
        if (typeof rawValue === "boolean") {
          return rawValue;
        }
        const str = String(rawValue).toLowerCase()
          .trim();
        if (str === "true" || str === "1" || str === "yes") {
          return true;
        }
        if (str === "false" || str === "0" || str === "no") {
          return false;
        }
        throw new Error(`Invalid boolean value. Expected true/false, got: ${rawValue}`);
      }

      case "duration": {
        const durationStr = String(rawValue).trim();
        const durationRegex = /^P(\d+D)?(\d+W)?(T(\d+H)?(\d+M)?(\d+S)?)?$/;
        if (!durationRegex.test(durationStr)) {
          throw new Error(`Invalid duration format. Expected ISO 8601 duration (e.g., "P6D", "P2W", "PT12H"), got: ${rawValue}`);
        }
        return durationStr;
      }

      case "text": {
        const textStr = String(rawValue);
        if (textStr.length > 4096) {
          throw new Error("Text exceeds maximum length of 4096 characters");
        }
        return textStr;
      }

      case "textarea": {
        const textareaStr = String(rawValue);
        if (textareaStr.length > 4096) {
          throw new Error("Textarea exceeds maximum length of 4096 characters");
        }
        return textareaStr;
      }

      case "timestamp": {
        const timestampStr = String(rawValue).trim();
        const timestamp = new Date(timestampStr);
        if (isNaN(timestamp.getTime())) {
          throw new Error(`Invalid timestamp format. Expected ISO 8601 format (e.g., "2025-06-02T14:30:00+00:00"), got: ${rawValue}`);
        }
        return timestampStr;
      }

      case "clause": {
        if (typeof rawValue === "boolean") {
          return rawValue;
        }
        const str = String(rawValue).toLowerCase()
          .trim();
        if (str === "true" || str === "1" || str === "yes") {
          return true;
        }
        if (str === "false" || str === "0" || str === "no") {
          return false;
        }
        throw new Error(`Invalid clause value. Expected true/false, got: ${rawValue}`);
      }

      case "id":
      case "uuid": {
        return String(rawValue).trim();
      }

      default:
        return rawValue;
      }
    },
  },
  async run({ $ }) {
    const {
      documentUuid,
      metadataValueUuid,
      value,
    } = this;

    // Step 1: Fetch metadata values to get the metadata definition
    const metadataResponse = await this.fynk.listDocumentMetadataValues({
      $,
      documentUuid,
    });

    const metadataValue = metadataResponse.data?.find(
      (mv) => mv.uuid === metadataValueUuid,
    );

    if (!metadataValue) {
      throw new Error(`Metadata value with UUID ${metadataValueUuid} not found`);
    }

    if (!metadataValue.metadata) {
      throw new Error(`Metadata definition not found for metadata value ${metadataValueUuid}`);
    }

    // Step 2: Format the value according to its value_type
    const formattedValue = this.formatMetadataValue(value, metadataValue.metadata);

    // Step 3: Update the metadata value
    const response = await this.fynk.updateDocumentMetadataValue({
      $,
      documentUuid,
      metadataValueUuid,
      data: {
        value: formattedValue,
      },
    });

    $.export("$summary", `Successfully updated metadata value for contract ${documentUuid}`);
    return response;
  },
};

