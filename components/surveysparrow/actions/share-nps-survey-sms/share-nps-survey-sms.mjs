import common from "../common/share-base.mjs";

export default {
  ...common,
  key: "surveysparrow-share-nps-survey-sms",
  name: "Share NPS Survey via SMS",
  description: "Sends a saved NPS share template via SMS to given mobile number recipients. [See the documentation](https://developers.surveysparrow.com/rest-apis/channels#postV3Channels)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    sms: {
      type: "string",
      label: "SMS message",
      description: "Message of sms, both {company_name} and {survey_link} variables are required.",
      default: "{survey_link} from {company_name}",
    },
  },
  methods: {
    ...common.methods,
    getChannelType() {
      return "SMS";
    },
    getSummary() {
      return "Successfully sent NPS survey via SMS";
    },
    getData() {
      return {
        sms: {
          message: this.sms,
        },
      };
    },
  },
};
