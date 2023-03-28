import pipedream from "../../pipedream.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "pipedream-generate-component-code",
  name: "Generate Component Code",
  description: "Generate component code using AI.",
  version: "0.0.1",
  type: "action",
  props: {
    pipedream,
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The prompt that will be sent to the AI. Try to be very specific with your prompt.",
    },
    app: {
      type: "string",
      label: "App",
      description: "The name of the app integration that the AI model will use as context.",
      optional: true,
    },
  },
  async run({ $ }) {
    return axios($, {
      url: "https://ai.m.pipedream.net",
      method: "post",
      data: {
        prompt: this.prompt,
        app: this.app,
      },
    });
  },
};
