import formIo from "../../form_io.app.mjs";
import { parseJson } from "../../common/utils.mjs";

export default {
  key: "form_io-update-form-action",
  name: "Update Form Action",
  description: "Update an action attached to a Form.io form. Only the fields you provide are changed; omitted fields keep their current values. Use **List Form Actions** to find the action ID. The `settings` prop is a JSON-string object specific to the action type. [See the documentation](https://apidocs.form.io/#2b553c0c-f857-4bfc-8023-1ddd0fc216e9).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    formIo,
    formId: {
      propDefinition: [
        formIo,
        "formId",
      ],
    },
    actionId: {
      propDefinition: [
        formIo,
        "actionId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Updated title of the action.",
      optional: true,
    },
    handler: {
      type: "string[]",
      label: "Handler",
      description: "When the action runs. Values: `before`, `after`.",
      optional: true,
      options: [
        "before",
        "after",
      ],
    },
    method: {
      type: "string[]",
      label: "Method",
      description: "Which operations trigger the action. Values: `create`, `update`, `read`, `delete`, `index`.",
      optional: true,
      options: [
        "create",
        "update",
        "read",
        "delete",
        "index",
      ],
    },
    priority: {
      type: "integer",
      label: "Priority",
      description: "Execution priority of the action.",
      optional: true,
    },
    settings: {
      type: "string",
      label: "Settings",
      description: "JSON-string object of action-specific settings. Parsed with JSON.parse() before sending.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      formId,
      actionId,
      title,
      handler,
      method,
      priority,
      settings,
    } = this;

    const response = await this.formIo.updateFormAction({
      $,
      formId,
      actionId,
      data: {
        title,
        handler,
        method,
        priority,
        settings: parseJson(settings, "settings"),
      },
    });

    $.export("$summary", `Updated form action "${response.title}" (${response._id})`);
    return response;
  },
};
