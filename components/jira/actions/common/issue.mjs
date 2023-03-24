import app from "../../jira.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    cloudId: {
      propDefinition: [
        app,
        "cloudId",
      ],
    },
    historyMetadata: {
      type: "object",
      label: "History Metadata",
      description: "Additional issue history details.",
      optional: true,
    },
    properties: {
      propDefinition: [
        app,
        "properties",
      ],
      description: "Details of issue properties to be add or update, please provide an array of objects with keys and values.",
    },
    transitionId: {
      label: "Transition ID",
      propDefinition: [
        app,
        "transition",
      ],
    },
    transitionLooped: {
      type: "boolean",
      label: "Transition Looped",
      description: "Whether the transition is looped.",
      optional: true,
    },
    update: {
      type: "object",
      label: "Update",
      description: "A Map containing the field name and a list of operations to perform on the issue screen field. Note that fields included in here cannot be included in `fields`.",
      optional: true,
    },
    additionalProperties: {
      propDefinition: [
        app,
        "additionalProperties",
      ],
    },
  },
  methods: {
    getPropType(schemaType) {
      return constants.TYPE[schemaType] || "object";
    },
    getDynamicFields({
      fields, fieldFilter = (field) => field,
    } = {}) {
      return Object.values(fields)
        .filter(fieldFilter)
        .reduce((props, {
          schema, name: label, key, required,
        }) => {
          const {
            type: schemaType,
            custom,
          } = schema;

          key = custom?.includes(":")
            ? `${key}_${custom.split(":")[1]}`
            : key;

          return {
            ...props,
            [key]: {
              type: this.getPropType(schemaType),
              label,
              description: "Set your field value",
              optional: !required,
            },
          };
        }, {});
    },
    formatFields(fields) {
      const keysToFormat = [
        constants.FIELD_KEY.DESCRIPTION,
        constants.FIELD_KEY.ENVIRONMENT,
      ];

      const fieldTypesToFormat = [
        constants.FIELD_TYPE.TEXTAREA,
      ];

      return Object.entries(fields)
        .reduce((props, [
          key,
          value,
        ]) => {
          const [
            fieldName,
            fieldId,
            fieldType,
          ] = key.split("_");

          key = fieldId
            ? `${fieldName}_${fieldId}`
            : fieldName;

          return {
            ...props,
            [key]: keysToFormat.includes(fieldName) || fieldTypesToFormat.includes(fieldType)
              ? [
                this.atlassianDocumentFormat(value),
                value,
              ]
              : value,
          };
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
