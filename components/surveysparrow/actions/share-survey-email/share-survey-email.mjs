import common from "../common/share-base.mjs";

export default {
  ...common,
  key: "surveysparrow-share-survey-email",
  name: "Share Survey via Email",
  description: "Sends a saved email share template to a provided email address. Configure the saved template's name and the recipient's email address. [See the documentation](https://developers.surveysparrow.com/rest-apis)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the email.",
    },
    themeId: {
      propDefinition: [
        common.props.surveysparrow,
        "themeId",
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getChannelType() {
      return "EMAIL";
    },
    getSummary() {
      return "Successfully sent NPS survey via Email";
    },
    getData() {
      return {
        email: {
          subject: this.subject,
          theme_id: this.themeId,
        },
      };
    },
  },
};

