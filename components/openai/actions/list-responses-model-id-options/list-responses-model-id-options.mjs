import openai from "../../openai.app.mjs";
import { getResponsesVisionModelIds } from "../common/responses-vision-model.mjs";

export default {
  key: "openai-list-responses-model-id-options",
  name: "List Model Options",
  description: "Retrieves available options for the Model field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    openai,
  },
  async run({ $ }) {
    const options = await getResponsesVisionModelIds(this.openai, $);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
