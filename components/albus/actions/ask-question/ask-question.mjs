import albus from "../../albus.app.mjs";

export default {
  key: "albus-ask-question",
  name: "Ask Question",
  description: "Ask a question to Albus and receive a response.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    albus,
    prompt: {
      propDefinition: [
        albus,
        "prompt",
      ],
    },
    waitForCompletion: {
      propDefinition: [
        albus,
        "waitForCompletion",
      ],
    },
  },
  async run({ $ }) {
    let response = await this.albus.chatCompletion({
      $,
      data: {
        prompt: this.prompt,
      },
    });
    let summary = "Successfully submitted question.";

    if (this.waitForCompletion) {
      const timer = (ms) => new Promise((res) => setTimeout(res, ms));
      let canPoll = true;
      const url = response.pollEndpoint;
      while (canPoll) {
        response = await this.albus.makeRequest({
          $,
          url,
        });
        if (!response.ok) {
          throw new Error(`Error retrieving response - ${JSON.stringify(response)}`);
        }
        canPoll = response.data.canPoll;
        await timer(3000);
      }
      summary = "Successfully submitted question and received response";
    }

    $.export("$summary", summary);
    return response;
  },
};
