import twilio from "../../twilio.app.mjs";
import { omitEmptyStringValues } from "../../common/utils.mjs";

export default {
  key: "twilio-list-message-media",
  name: "List Message Media",
  description: "Return a list of media associated with your message. [See the documentation](https://www.twilio.com/docs/sms/api/media-resource#read-multiple-media-resources)",
  version: "0.1.5",
  type: "action",
  props: {
    twilio,
    messageId: {
      propDefinition: [
        twilio,
        "messageId",
      ],
      optional: false,
    },
    limit: {
      propDefinition: [
        twilio,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const resp = await this.twilio.listMessageMedia(this.messageId, omitEmptyStringValues({
      limit: this.limit,
    }));
    $.export("$summary", `Successfully fetched ${resp.length} media object${resp.length === 1
      ? ""
      : "s"} associated with the message, "${this.messageId}"`);
    return resp;
  },
};
