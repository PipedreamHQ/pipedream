import common from "../common/base.mjs";

export default {
  ...common,
  key: "vbout-create-email-marketing-campaign",
  name: "Create Email Marketing Campaign",
  description: "This action creates a new email marketing campaign. [See the docs here](https://developers.vbout.com/docs#emailmarketing_addcampaign)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    name: {
      propDefinition: [
        common.props.vbout,
        "name",
      ],
      description: "Name of the campaign.",
    },
    subject: {
      propDefinition: [
        common.props.vbout,
        "subject",
      ],
    },
    fromEmail: {
      propDefinition: [
        common.props.vbout,
        "fromEmail",
      ],
      description: "The From email of the campaign.",
    },
    fromName: {
      propDefinition: [
        common.props.vbout,
        "fromName",
      ],
      description: "The From name of the campaign.",
    },
    replyTo: {
      propDefinition: [
        common.props.vbout,
        "replyTo",
      ],
      description: "The Reply to email of the campaign.",
    },
    body: {
      propDefinition: [
        common.props.vbout,
        "body",
      ],
    },
    type: {
      propDefinition: [
        common.props.vbout,
        "type",
      ],
      optional: true,
    },
    isScheduled: {
      propDefinition: [
        common.props.vbout,
        "isScheduled",
      ],
      optional: true,
    },
    isDraft: {
      propDefinition: [
        common.props.vbout,
        "isDraft",
      ],
      optional: true,
    },
    scheduledDatetime: {
      propDefinition: [
        common.props.vbout,
        "scheduledDatetime",
      ],
      optional: true,
    },
    audiences: {
      propDefinition: [
        common.props.vbout,
        "audiences",
      ],
    },
    lists: {
      propDefinition: [
        common.props.vbout,
        "listArray",
      ],
      optional: true,
    },
  },
  methods: {
    async processEvent($) {
      const {
        name,
        subject,
        fromEmail,
        fromName,
        replyTo,
        body,
        type,
        isScheduled,
        isDraft,
        scheduledDatetime,
        audiences,
        lists,
      } = this;
      return this.vbout.createCampaign({
        $,
        params: {
          name,
          subject,
          fromemail: fromEmail,
          from_name: fromName,
          reply_to: replyTo,
          body,
          type,
          isscheduled: isScheduled,
          isdraft: isDraft,
          scheduled_datetime: scheduledDatetime,
          audiences: audiences && audiences.toString(),
          lists: lists && lists.toString(),
        },
      });
    },
    getSummary() {
      return `Marketing Campaign "${this.name}" Successfully created!`;
    },
  },
};
