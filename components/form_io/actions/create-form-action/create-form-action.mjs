import formIo from "../../form_io.app.mjs";
import { parseJson } from "../../common/utils.mjs";

export default {
  key: "form_io-create-form-action",
  name: "Create Form Action",
  description: "Attach an action (e.g. email, webhook, save) to a Form.io form. Use **List Forms** to find the form ID and **List Form Actions** to review existing actions. The `settings` prop is a JSON-string object specific to the action type. Example: `actionType` `webhook`, `title` `Notify endpoint`, `handler` `[after]`, `method` `[create]`, `settings` `{\"url\":\"https://example.com/hook\",\"method\":\"post\"}` → returns the new action with its `_id`. [See the documentation](https://apidocs.form.io/#b3435953-c007-48d9-9f4c-a8e2ee717419).",
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
    actionType: {
      type: "string",
      label: "Action Type",
      description: "The Form.io action type to attach — e.g. `webhook`, `email`, `save`, `login`, `role`. This selects which built-in action runs; it is NOT a display label (use `title` for that).",
    },
    title: {
      propDefinition: [
        formIo,
        "title",
      ],
      description: "The human-readable title of the action.",
    },
    handler: {
      propDefinition: [
        formIo,
        "handler",
      ],
    },
    method: {
      propDefinition: [
        formIo,
        "method",
      ],
    },
    priority: {
      propDefinition: [
        formIo,
        "priority",
      ],
    },
    settings: {
      propDefinition: [
        formIo,
        "settings",
      ],
      description: "JSON-string object of action-specific settings. Example: `{\"transport\":\"default\",\"from\":\"noreply@example.com\",\"to\":\"admin@example.com\",\"subject\":\"New submission\"}`. Parsed from a JSON string before sending.",
    },
  },
  async run({ $ }) {
    const {
      formId,
      actionType,
      title,
      handler,
      method,
      priority,
      settings,
    } = this;

    const response = await this.formIo.createFormAction({
      $,
      formId,
      data: {
        name: actionType,
        title,
        handler,
        method,
        priority,
        settings: parseJson(settings, "settings", "object"),
      },
    });

    $.export("$summary", `Created form action "${response.title}" (${response._id})`);
    return response;
  },
};
