import apify from "../../apify.app.mjs";

export default {
  key: "apify-set-key-value-store-record",
  name: "Set Key-Value Store Record",
  description: "Create or update a record in an Apify Key-Value Store. Supports strings, numbers, booleans, null, arrays, and objects. Automatically infers content type (JSON vs. plain text).",
  version: "0.2.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    apify,
    keyValueStoreId: {
      propDefinition: [
        apify,
        "keyValueStoreId",
        () => ({
          unnamed: false,
        }),
      ],
      optional: false,
    },
    key: {
      type: "string",
      label: "Key",
      description: "The key of the record to create or update.",
      optional: false,
    },
    value: {
      type: "any",
      label: "Value",
      description:
                "String, number, boolean, null, array, or object. Strings that are valid JSON will be stored as JSON; otherwise as plain text.",
      optional: false,
    },
  },
  methods: {
    inferFromValue(input) {
      // Returns { data, contentType, mode }
      if (
        input === null ||
          typeof input === "number" ||
          typeof input === "boolean" ||
          Array.isArray(input) ||
          (typeof input === "object")
      ) {
        return {
          data: input,
          contentType: "application/json; charset=utf-8",
          mode: "json",
        };
      }
      if (typeof input === "string") {
        const trimmed = input.trim();
        // Try to parse as JSON if it looks plausible
        if (this.looksLikeJson(trimmed)) {
          try {
            const parsed = JSON.parse(trimmed);
            return {
              data: parsed,
              contentType: "application/json; charset=utf-8",
              mode: "json-from-string",
            };
          } catch {
            // fall back to text/plain
            return {
              data: trimmed,
              contentType: "text/plain; charset=utf-8",
              mode: "plain-text",
            };
          }
        }
      }
      // Fallback: coerce to string as text/plain
      return {
        data: String(input ?? ""),
        contentType: "text/plain; charset=utf-8",
        mode: "coerced-text",
      };
    },
    looksLikeJson(string) {
      if (!string) return false;
      const firstChar = string[0];
      const lastChar = string[string.length - 1];
      if ((firstChar === "{" && lastChar === "}") || (firstChar === "[" && lastChar === "]")) return true;
      if (string === "null" || string === "true" || string === "false") return true;
      if (firstChar === "\"" && lastChar === "\"") return true;
      return !Number.isNaN(Number(string));

    },
  },
  async run({ $ }) {
    const {
      data, contentType, mode,
    } = this.inferFromValue(this.value);

    const response = await this.apify.setKeyValueStoreRecord({
      storeId: this.keyValueStoreId,
      key: this.key,
      value: data,
      contentType,
    });

    $.export(
      "$summary",
      `Set record '${this.key}' as ${mode} (${contentType}) in store '${this.keyValueStoreId}'.`,
    );

    return {
      success: true,
      storeId: this.keyValueStoreId,
      key: this.key,
      mode,
      usedContentType: contentType,
      apifyResponse: response,
    };
  },
};
