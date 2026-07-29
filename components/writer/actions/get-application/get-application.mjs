// x-pd-ai: optimized
import app from "../../writer.app.mjs";

export default {
  key: "writer-get-application",
  name: "Get Application",
  description: "Get a single no-code application (agent) by id, including its **input schema** — the `inputs` array that describes which values **Run Application** must supply. "
    + "Use **List Applications** first to find the application's `id`, then call this before **Run Application** so you know the required input `id`s. "
    + "Example: call with `applicationId=\"3f9c...\"` -> returns `{ id, name, type, status, inputs: [{ id, name, ... }], created_at, updated_at }`. "
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
