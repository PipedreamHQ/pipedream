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
    getResourcesInfo(key) {
      switch (key) {
      case constants.FIELD_KEY.PARENT:
        return {
          fn: this.app.getIssues,
          args: {
            cloudId: this.cloudId,
            params: {
              maxResults: 100,
            },
          },
          map: ({ issues }) =>
            issues?.map(({
              id: value, key: label,
            }) => ({
              value,
              label,
            })),
        };
      case constants.FIELD_KEY.LABELS:
        return {
          fn: this.app.getLabels,
          args: {
            cloudId: this.cloudId,
            params: {
              maxResults: 100,
            },
          },
          map: ({ values }) => values,
        };
      default:
        return {};
      }
    },
    getPropType(schemaType) {
      return constants.TYPE[schemaType] || "object";
    },
    async getDynamicFields({
      fields, predicate = (field) => field,
    } = {}) {
      const schemaTypes = Object.keys(constants.SCHEMA);

      const keysForResourceRequest = [
        constants.FIELD_KEY.PARENT,
        constants.FIELD_KEY.LABELS,
      ];

      return Object.values(fields)
        .filter(predicate)
        .reduce(async (props, {
          schema, name: label, key, required, autoCompleteUrl,
        }) => {
          const {
            type: schemaType,
            custom,
          } = schema;

          const newKey = custom?.includes(":")
            ? `${key}_${custom.split(":")[1]}`
            : key;

          const value = {
            type: this.getPropType(schemaType),
            label,
            description: "Set your field value",
            optional: !required,
          };

          // Requests by URL
          if (schemaTypes.includes(schemaType)) {
            const resources = await this.app._makeRequest({
              url: autoCompleteUrl,
            });

            return Promise.resolve({
              ...await props,
              [newKey]: {
                ...value,
                options: resources.map(constants.SCHEMA[schemaType].mapping),
              },
            });
          }

          // Requests by Resource
          if (keysForResourceRequest.includes(key)) {
            const {
              fn: resourcesFn,
              args: resourcesFnArgs,
              map: resourcesFnMap,
            } = this.getResourcesInfo(key);

            const response = await resourcesFn(resourcesFnArgs);

            return Promise.resolve({
              ...await props,
              [newKey]: {
                ...value,
                options: resourcesFnMap(response),
              },
            });
          }

          return Promise.resolve({
            ...await props,
            [newKey]: value,
          });
        }, Promise.resolve({}));
    },
    formatFields(fields) {
      const keysToFormat = [
        constants.FIELD_KEY.DESCRIPTION,
        constants.FIELD_KEY.ENVIRONMENT,
      ];

      const fieldTypesToFormat = [
        constants.FIELD_TYPE.TEXTAREA,
      ];

      const keysToCheckForId = [
        constants.FIELD_KEY.ASSIGNEE,
        constants.FIELD_KEY.REPORTER,
        constants.FIELD_KEY.PARENT,
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
              : keysToCheckForId.includes(fieldName)
                ? {
                  id: value,
                }
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
