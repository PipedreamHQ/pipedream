import utils from "../../common/utils.mjs";
import app from "../../jira.app.mjs";

export default {
  key: "jira-create-custom-field-options-context",
  name: "Create Custom Field Options (Context)",
  description: "Create a context for custom field options. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-custom-field-options/#api-rest-api-3-field-fieldid-context-contextid-option-post).",
  version: "0.0.11",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    fieldId: {
      propDefinition: [
        app,
        "fieldId",
        () => ({
          params: {
            type: [
              "custom",
            ],
          },
        }),
      ],
    },
    contextId: {
      propDefinition: [
        app,
        "contextId",
        ({ fieldId }) => ({
          fieldId,
        }),
      ],
    },
    options: {
      type: "string[]",
      label: "Options",
      description: "Options to create. Each option should be a JSON object with the following structure as an example: `{ \"value\": \"Manhattan\", \"optionId\": \"1000\", \"disabled\": true }` where the only required field is `value`.",
    },
  },
  methods: {
    /**
     * Creates custom field options for a specific field context.
     * @param {object} args - Object containing fieldId, contextId, and options data
     * @returns {Promise<object>} The created options
     */
    createCustomFieldOptionsContext({
      fieldId, contextId, ...args
    }) {
      return this.app._makeRequest({
        method: "POST",
        path: `/field/${fieldId}/context/${contextId}/option`,
        ...args,
      });
    },
  },
  /**
   * Runs the action and returns the API response.
   * @param {object} $ - The Pipedream step context
   * @returns {Promise<object>} The API response
   */
  async run({ $ }) {
    const {
      createCustomFieldOptionsContext,
      fieldId,
      contextId,
      options,
    } = this;

    const response = await createCustomFieldOptionsContext({
      $,
      fieldId,
      contextId,
      data: {
        options: utils.parseArray(options).map(utils.parseOne),
      },
    });

    $.export("$summary", `Successfully created custom field options for field \`${fieldId}\` and context \`${contextId}\``);
    return response;
  },
};
