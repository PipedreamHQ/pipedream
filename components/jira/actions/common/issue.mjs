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
      description: "A Map containing the field name and a list of operations to perform on the issue screen field. Note that fields included here cannot be included in `fields`.",
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
          const { issues } = await app.searchIssues({
            cloudId,
            params: {
              jql: "project is not EMPTY ORDER BY created DESC",
              maxResults,
              startAt,
              fields: "id,key",
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
    getAssignableUserOptions() {
      return async ({
        prevContext, query,
      }) => {
        const {
          app,
          cloudId,
          projectId,
        } = this;
        const { startAt = 0 } = prevContext || {};
        // The endpoint may return fewer users than requested while more remain, so
        // paging advances by the requested size rather than by the returned count
        const maxResults = app.getDefaultLimit();

        try {
          const users = await app.findAssignableUsers({
            cloudId,
            params: {
              project: projectId,
              query: query || "",
              startAt,
              maxResults,
            },
          });
          return {
            options: users.map(({
              displayName: label, accountId: value,
            }) => ({
              label,
              value,
            })),
            context: {
              startAt: startAt + maxResults,
            },
          };
        } catch (error) {
          console.log("Error listing assignable users", error);
          return {
            options: [],
          };
        }
      };
    },
    getUserOptions() {
      return async ({
        prevContext, query,
      }) => {
        const {
          app,
          cloudId,
        } = this;
        const { startAt = 0 } = prevContext || {};
        // The endpoint may return fewer users than requested while more remain, so
        // paging advances by the requested size rather than by the returned count
        const maxResults = app.getDefaultLimit();

        try {
          const users = await app.findUsers({
            cloudId,
            params: {
              query: query || "",
              startAt,
              maxResults,
            },
          });
          return {
            options: users.map(({
              displayName: label, accountId: value,
            }) => ({
              label,
              value,
            })),
            context: {
              startAt: startAt + maxResults,
            },
          };
        } catch (error) {
          console.log("Error listing users", error);
          return {
            options: [],
          };
        }
      };
    },
    getDynamicFields({
      fields, predicate = (field) => field,
    } = {}) {
      const keysForResourceRequest = [
        constants.FIELD_KEY.PARENT,
        constants.FIELD_KEY.LABELS,
        constants.FIELD_KEY.ISSUETYPE,
      ];

      return Object.values(fields)
        .filter(predicate)
        .reduce((props, {
          schema, name: label, key, required, allowedValues,
        }) => {
          const {
            type: schemaType,
            items: itemsType,
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
            optional: !required,
          };

          // Handle dropdown fields (option type) with allowedValues
          if (schemaType === constants.SCHEMA_TYPE.OPTION && Array.isArray(allowedValues)) {
            return {
              ...props,
              [newKey]: {
                ...value,
                type: "string",
                options: allowedValues.map((option) => ({
                  label: option.value || option.name,
                  value: option.id,
                })),
              },
            };
          }

          if (schemaType === constants.SCHEMA_TYPE.USER
            || (schemaType === constants.SCHEMA_TYPE.ARRAY
              && itemsType === constants.SCHEMA_TYPE.USER)) {
            const isMultiUser = schemaType === constants.SCHEMA_TYPE.ARRAY;
            return {
              ...props,
              [newKey]: {
                ...value,
                description: isMultiUser
                  ? "Account IDs of the users (e.g. `5b10ac8d82e05b22cc7d4ef5`)"
                  : "Account ID of the user (e.g. `5b10ac8d82e05b22cc7d4ef5`)",
                useQuery: true,
                options: key === constants.FIELD_KEY.ASSIGNEE
                  ? this.getAssignableUserOptions()
                  : this.getUserOptions(),
              },
            };
          }

          // Requests by Resource
          if (keysForResourceRequest.includes(key)) {
            return {
              ...props,
              [newKey]: {
                ...value,
                options: this.getOptions(key),
              },
            };
          }

          return {
            ...props,
            [newKey]: value,
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

      const keysToCheckForId = [
        constants.FIELD_KEY.ASSIGNEE,
        constants.FIELD_KEY.REPORTER,
        constants.FIELD_KEY.PARENT,
        constants.FIELD_KEY.ISSUETYPE,
      ];

      const keysToConsiderAsArray = [
        constants.FIELD_KEY.LABELS,
      ];

      const fieldTypesNeedingId = [
        "select",
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

          // Jira user fields expect the account ID wrapped in a user object, and an
          // array of them for multi-user fields
          if (value && constants.USER_FIELD_TYPES.includes(fieldType)) {
            return {
              ...props,
              [key]: Array.isArray(value)
                ? value.map((accountId) => ({
                  accountId,
                }))
                : {
                  accountId: value,
                },
            };
          }

          // Handle select/dropdown fields - always include with { id: value } format
          if (fieldTypesNeedingId.includes(fieldType)) {
            return {
              ...props,
              [key]: {
                id: value,
              },
            };
          }

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
