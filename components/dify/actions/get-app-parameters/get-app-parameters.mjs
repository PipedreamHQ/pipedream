import dify from "../../dify.app.mjs";

export default {
  key: "dify-get-app-parameters",
  name: "Get App Parameters",
  description: "Return the connected Dify app's configuration: its `user_input_form` (the exact input variable names, types, and which are required), file-upload limits, opening statement, and suggested questions. Call this before **Send Chat Message** or **Run Workflow** to know what to pass in their `Inputs` parameter, instead of guessing variable names. [See the documentation](https://docs.dify.ai/en/api-reference/applications/get-app-parameters)",
  version: "0.0.1",
  ai: "optimized",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    dify,
  },
  async run({ $ }) {
    const response = await this.dify.getAppParameters({
      $,
    });

    const inputCount = response.user_input_form?.length ?? 0;
    $.export("$summary", `Retrieved app parameters (${inputCount} input variable(s))`);
    return response;
  },
};
