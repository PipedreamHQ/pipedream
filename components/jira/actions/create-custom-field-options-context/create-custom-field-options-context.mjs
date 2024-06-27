import app from "../../jira.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "jira-create-custom-field-options-context",
  name: "Create Custom Field Options (Context)",
  description: "Create a context for custom field options",
  version: "0.0.1",
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
        debug: true,
        method: "POST",
        path: `/field/${fieldId}/context/${contextId}/`,
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
        options: utils.parseArray(options).map((option) => utils.parseObject(option)),
      },
    });

    $.export("$summary", `Successfully created custom field options for field ${fieldId} and context ${contextId}`);
    return response;
  },
};
