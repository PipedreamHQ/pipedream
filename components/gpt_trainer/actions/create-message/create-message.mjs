import gptTrainer from "../../gpt_trainer.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "gpt_trainer-create-message",
  name: "Create Message",
  description: "Create a session message for a chatbot session specified by session UUID. [See the documentation](https://guide.gpt-trainer.com/api-reference/messages/create)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    gptTrainer,
    sessionUuid: {
      propDefinition: [
        gptTrainer,
        "sessionUuid",
      ],
    },
    messageQuery: {
      propDefinition: [
        gptTrainer,
        "messageQuery",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.gptTrainer.createSessionMessage({
      sessionUuid: this.sessionUuid,
      messageQuery: this.messageQuery,
    });

    $.export("$summary", `Successfully created a message in the session with UUID: ${this.sessionUuid}`);
    return response;
  },
};
