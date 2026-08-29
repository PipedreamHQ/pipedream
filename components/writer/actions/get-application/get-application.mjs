// x-pd-ai: optimized
import app from "../../writer.app.mjs";

export default {
  key: "writer-get-application",
  name: "Get Application",
  description: "Get a single no-code application (agent) by its application id, including its **input schema** — the `inputs` array, where each entry's `id` is an **input field name** that **Run Application** must supply a value for (it is NOT the application's id). "
    + "Use **List Applications** first to find the application's `id`, then call this before **Run Application** so you know the input field `id`s (names) the agent expects. "
    + "Example: call with `applicationId=\"3f9c...\"` -> returns `{ id, name, type, status, inputs: [{ id, name, ... }], created_at, updated_at }`, where each `inputs[].id` is an input field name such as `\"topic\"`. "
    + "[See the documentation](https://dev.writer.com/api-reference/application-api/application-details)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    applicationId: {
      propDefinition: [
        app,
        "applicationId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getApplication({
      $,
      applicationId: this.applicationId,
    });
    $.export("$summary", `Retrieved application ${response?.name || this.applicationId}`);
    return response;
  },
};
