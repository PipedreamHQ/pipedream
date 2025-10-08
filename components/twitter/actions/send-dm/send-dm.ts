import common from "../../common/appValidation";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
import { defineAction } from "@pipedream/types";
import { getUserId } from "../../common/methods";
import { SendMessageParams } from "../../common/types/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/direct-messages/manage/api-reference/post-dm_conversations-with-participant_id-messages";

export default defineAction({
  ...common,
  key: "twitter-send-dm",
  name: "Send Direct Message (DM)",
  description: `Send a message to a user. [See the documentation](${DOCS_LINK})`,
  version: "1.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    userNameOrId: {
      propDefinition: [
        common.props.app,
        "userNameOrId",
      ],
      label: "Recipient Name or ID",
      optional: false,
    },
    text: {
      type: "string",
      label: "Message Text",
      description:
        "Text of the Direct Message being created. Text messages support up to 10,000 characters.",
    },
  },
  methods: {
    ...common.methods,
    getUserId,
  },
  async run({ $ }): Promise<object> {
    const userId = await this.getUserId();

    const params: SendMessageParams = {
      $,
      userId,
      data: {
        text: this.text,
      },
      fallbackError: ACTION_ERROR_MESSAGE,
    };

    const response = await this.app.sendMessage(params);

    $.export(
      "$summary",
      `Successfully sent message (event ID ${response.data?.dm_event_id})`,
    );

    return response;
  },
});
