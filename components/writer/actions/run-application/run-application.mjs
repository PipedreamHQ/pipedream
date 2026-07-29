// x-pd-ai: optimized
import app from "../../writer.app.mjs";

export default {
  key: "writer-run-application",
  name: "Run Application",
  description: "Run a saved no-code application (agent) with the inputs it expects and return the generated content. "
    + "Discover the agent's `id` with **List Applications**, then call **Get Application** to see its required input `id`s before running. "
    + "Provide `inputs` as a JSON array of `{ id, value }` objects, where `value` is an array of strings (one entry per value for that input). "
    + "Example: call with `applicationId=\"3f9c...\"` and `inputs=[{ \"id\": \"topic\", \"value\": [\"Velociraptor exhibit\"] }, { \"id\": \"tone\", \"value\": [\"exciting\"] }]` -> returns the agent's generated content. "
    + "[See the documentation](https://dev.writer.com/api-reference/application-api/applications)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    applicationId: {
      propDefinition: [
        app,
        "applicationId",
      ],
    },
    inputs: {
      type: "string",
      label: "Inputs",
      description: "JSON array of the agent's inputs. Each entry is `{ \"id\": <input id>, \"value\": [<string>, ...] }`. Use **Get Application** to discover the valid input `id`s. Example: `[{ \"id\": \"topic\", \"value\": [\"raptors\"] }]`.",
    },
  },
  async run({ $ }) {
    const inputs = JSON.parse(this.inputs);
    const response = await this.app.runApplication({
      $,
      applicationId: this.applicationId,
      data: {
        inputs,
      },
    });
    $.export("$summary", `Ran application ${this.applicationId}`);
    return response;
  },
};
