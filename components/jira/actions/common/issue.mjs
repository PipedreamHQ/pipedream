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
    getIssueTypes(args = {}) {
      return this.app._makeRequest({
        path: "/issuetype",
        ...args,
      });
    },
    getOptions(key) {
      switch (key) {
      case constants.FIELD_KEY.PARENT:
        return async ({ prevContext: { startAt = 0 } }) => {
          const {
            app,
            cloudId,
          } = this;
          const maxResults = 50;
          const { issues } = await app.getIssues({
            cloudId,
            params: {
              maxResults,
              startAt,
            },
          });
          return {
            options: issues.map(({
              id: value, key: label,
            }) => ({
              value,
              label,
            })),
            context: {
              startAt: startAt + maxResults,
            },
          };
        };
      case constants.FIELD_KEY.LABELS:
        return async ({ prevContext: { startAt = 0 } }) => {
          const {
            app,
            cloudId,
          } = this;
          const maxResults = 50;
          const { values } = await app.getLabels({
            cloudId,
            params: {
              maxResults,
              startAt,
            },
          });
          return {
            options: values,
            context: {
              startAt: startAt + maxResults,
            },
          };
        };
      case constants.FIELD_KEY.ISSUETYPE:
        return async () => {
          const {
            getIssueTypes,
            cloudId,
          } = this;

          const issueTypes = await getIssueTypes({
            cloudId,
          });
          return {
            options: issueTypes.map(({
              id: value, name: label,
            }) => ({
              value,
              label,
            })),
          };
        };
      default:
        return [];
      }
    },
    async getDynamicFields({
      fields, predicate = (field) => field,
    } = {}) {
      const schemaTypes = Object.keys(constants.SCHEMA);

      const keysForResourceRequest = [
        constants.FIELD_KEY.PARENT,
        constants.FIELD_KEY.LABELS,
        constants.FIELD_KEY.ISSUETYPE,
      ];

      return Object.values(fields)
        .filter(predicate)
        .reduce(async (props, {
          schema, name: label, key, autoCompleteUrl,
        }) => {
          const reduction = await props;

          const {
            type: schemaType,
            custom,
          } = schema;

          const newKey = custom?.includes(":")
            ? `${key}_${custom.split(":")[1]}`
            : key;

          const value = {
            // It defaults to object because it may expect a structure like { id: "123" }
            type: constants.TYPE[schemaType] || "object",
            label,
            description: "Set your field value",
            optional: true,
          };

          // Requests by URL
          if (schemaTypes.includes(schemaType)) {
            try {
              const resources = await this.app._makeRequest({
                url: autoCompleteUrl,
              });

              return Promise.resolve({
                ...reduction,
                [newKey]: {
                  ...value,
                  options: resources.map(constants.SCHEMA[schemaType].mapping),
                },
              });

            } catch (error) {
              console.log("Error fetching resources requested by URL", autoCompleteUrl, error);
              return Promise.resolve(reduction);
            }
          }

          // Requests by Resource
          if (keysForResourceRequest.includes(key)) {
            return Promise.resolve({
              ...reduction,
              [newKey]: {
                ...value,
                options: this.getOptions(key),
              },
            });
          }

          return Promise.resolve({
            ...reduction,
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
        constants.FIELD_KEY.ISSUETYPE,
      ];

      const keysToConsiderAsArray = [
        constants.FIELD_KEY.LABELS,
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
                : keysToConsiderAsArray.includes(fieldName) && Array.isArray(value)
                  ? [
                    value,
                    value.length,
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
