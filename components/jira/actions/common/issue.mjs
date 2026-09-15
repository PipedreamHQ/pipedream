import app from "../../jira.app.mjs";

export default {
  props: {
    app,
    cloudId: {
      type: "string",
      label: "Cloud ID",
      description: "The Jira Cloud site ID (e.g., `11223344-a1b2-3b33-c444-def123456789`). Use the **Get Cloud ID** action to look up the ID for your site.",
    },
    historyMetadata: {
      type: "object",
      label: "History Metadata",
      description: "Additional issue history details",
      optional: true,
    },
    properties: {
      propDefinition: [
        app,
        "properties",
      ],
      description: "Details of issue properties to be added or updated. Please provide an array of objects with keys and values.",
    },
    update: {
      type: "object",
      label: "Update",
      description: "Advanced: a Map of field names to a list of add/remove/set operations to perform (e.g. appending a value to a multi-value field), following Jira's issue update operations format. For setting field values directly (`summary`, `description`, `priority`, `labels`, etc.), use `additionalProperties` instead.",
      optional: true,
    },
    additionalProperties: {
      propDefinition: [
        app,
        "additionalProperties",
      ],
      description: "The primary way to set issue field values not already covered by other props. Provide a flat object of Jira field keys to values, e.g. `{ \"summary\": \"Fix login bug\", \"description\": \"Plain text is fine here\", \"priority\": { \"name\": \"High\" }, \"labels\": [\"bug\"] }`. `description` and `environment` may be given as plain strings — they're automatically converted to Jira's required document format. Use this instead of `update` for straightforward field assignments.",
    },
  },
  methods: {
    /**
     * Jira requires `description` and `environment` as Atlassian Document Format
     * objects rather than plain strings. Converts any plain-string values for those
     * keys so callers can pass ordinary text through `additionalProperties`.
     */
    formatAdfFields(fields = {}) {
      const adfKeys = [
        "description",
        "environment",
      ];
      return Object.entries(fields).reduce((acc, [
        key,
        value,
      ]) => {
        acc[key] = adfKeys.includes(key) && typeof value === "string"
          ? this.atlassianDocumentFormat(value)
          : value;
        return acc;
      }, {});
    },
    /**
     * Formats the value to be compatible with the Jira API
     * https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/
     * @param {*} str - The value to be formatted
     * @returns {object} - The formatted value
     */
    atlassianDocumentFormat(str) {
      const text = str?.trim();
      if (!text) {
        return;
      }
      return {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                text,
                type: "text",
              },
            ],
          },
        ],
      };
    },
  },
};
