import surveysparrow from "../../surveysparrow.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "surveysparrow-share-nps-survey-sms",
  name: "Share NPS Survey via SMS",
  description: "Sends a saved NPS share template via SMS to given mobile number recipients. [See the documentation](https://developers.surveysparrow.com/rest-apis)",
  version: "0.0.1",
  type: "action",
  props: {
    surveysparrow,
    savedSmsTemplateName: {
      propDefinition: [
        surveysparrow,
        "savedSmsTemplateName",
      ],
    },
    recipientMobileNumbers: {
      propDefinition: [
        surveysparrow,
        "recipientMobileNumbers",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surveysparrow.sendSmsShareTemplate({
      savedSmsTemplateName: this.savedSmsTemplateName,
      recipientMobileNumbers: this.recipientMobileNumbers,
    });

    $.export("$summary", "Successfully sent NPS survey via SMS");
    return response;
  },
};
