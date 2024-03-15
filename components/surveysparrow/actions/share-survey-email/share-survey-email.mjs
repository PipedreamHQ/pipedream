import surveysparrow from "../../surveysparrow.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "surveysparrow-share-survey-email",
  name: "Share Survey via Email",
  description: "Sends a saved email share template to a provided email address. Configure the saved template's name and the recipient's email address. [See the documentation](https://developers.surveysparrow.com/rest-apis)",
  version: "0.0.1",
  type: "action",
  props: {
    surveysparrow,
    savedEmailTemplateName: {
      propDefinition: [
        surveysparrow,
        "savedEmailTemplateName",
      ],
    },
    recipientEmailAddress: {
      type: "string",
      label: "Recipient's Email Address",
      description: "Email address of the recipient",
      required: true,
    },
  },
  async run({ $ }) {
    const response = await this.surveysparrow.sendEmailShareTemplate({
      savedEmailTemplateName: this.savedEmailTemplateName,
      recipientEmailAddress: this.recipientEmailAddress,
    });
    $.export("$summary", `Successfully sent email share template to ${this.recipientEmailAddress}`);
    return response;
  },
};
