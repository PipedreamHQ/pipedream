import utils from "../../common/utils.mjs";
import app from "../../jira.app.mjs";

export default {
  key: "jira-create-custom-field-options-context",
  name: "Create Custom Field Options (Context)",
  description: "Create a context for custom field options. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-custom-field-options/#api-rest-api-3-field-fieldid-context-contextid-option-post).",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    cloudId: {
      propDefinition: [
        app,
        "cloudId",
      ],
    },
    fieldId: {
      propDefinition: [
        app,
        "fieldId",
        ({ cloudId }) => ({
          cloudId,
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
        ({
          cloudId, fieldId,
        }) => ({
          cloudId,
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
  async run({ $ }) {
    const {
      createCustomFieldOptionsContext,
      cloudId,
      fieldId,
      contextId,
      options,
    } = this;

    const response = await createCustomFieldOptionsContext({
      $,
      cloudId,
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
