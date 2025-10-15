import symblAIApp from "../../symbl_ai.app.mjs";
import utils from "../common/utils.mjs";

export default {
  key: "symbl_ai-put-speaker-events",
  name: "Update Speaker Events",
  description: "Update the Speaker Events of the Conversation. See the doc [here](https://docs.symbl.ai/docs/conversation-api/speaker-events/).",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    symblAIApp,
    conversationId: {
      propDefinition: [
        symblAIApp,
        "conversationId",
      ],
    },
    speakerEvents: {
      type: "string[]",
      label: "Speaker Events",
      description: "Provide a JSON array of speaker events with their `type`, `user` and `offset` information. Each Speaker Event object is represented by the following structure: `[{\"type\": \"started_speaking\",\"user\": {\"id\": \"4194eb50-357d-4712-a02d-94215ead1064\",\"name\": \"user\",\"email\": \"user@example.com\"},\"offset\": {\"seconds\": 0,\"nanos\": 5000000000}},{\"type\": \"stopped_speaking\",\"user\": {\"id\": \"4194eb50-357d-4712-a02d-94215ead1064\",\"name\": \"User\",\"email\": \"user@example.com\"},\"offset\": {\"seconds\": 15,\"nanos\": 5000000000}}]`. See doc [here](https://docs.symbl.ai/docs/conversation-api/speaker-events/#speaker-event-object)",
    },
  },
  async run({ $ }) {
    const response =
      await this.symblAIApp.putSpeakerEvents({
        $,
        conversationId: this.conversationId,
        data: {
          speakerEvents: utils.parseArrayOfJSONStrings(this.speakerEvents),
        },
      });
    $.export("$summary", `${response.message}`);
    return response;
  },
};
// hello, world test
