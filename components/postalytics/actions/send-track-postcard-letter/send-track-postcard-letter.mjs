import common from "../common/base.mjs";

export default {
  ...common,
  key: "postalytics-send-track-postcard-letter",
  name: "Send and Track Postcard or Letter",
  description: "Send a postcard or letter with the capability of tracking delivery and response. [See the documentation](https://postalytics.docs.apiary.io/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    campaignId: {
      propDefinition: [
        common.props.postalytics,
        "campaignId",
      ],
    },
  },
  methods: {
    getFn() {
      return this.postalytics.sendMailPiece;
    },
    getObject({ campaignId }, objToSend) {
      return {
        campaignId,
        ...objToSend,
      };
    },
    getSummary({ campaignId }) {
      return `Sent postcard/letter for campaign ID ${campaignId}.`;
    },
  },
};
