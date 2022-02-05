const common = require("../common/timer-based");

module.exports = {
  ...common,
  key: "mailchimp-new-segment-tag-subscriber",
  name: "New Segment Tag Subscriber",
  description:
    "Emit new event when an subscriber is added to a segment or tags within an audience list.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    listId: {
      propDefinition: [
        common.props.mailchimp,
        "listId",
      ],
      description:
        "The unique ID of the audience list related to the segment or tag you'd like to watch for new subscribers.",
    },
    segmentId: {
      propDefinition: [
        common.props.mailchimp,
        "segmentId",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
    includeTransactional: {
      propDefinition: [
        common.props.mailchimp,
        "includeTransactional",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      const mailchimpSegmentMembersInfo =
        await this.mailchimp.getSegmentMembersList(
          this.listId,
          this.segmentId,
          10,
          0,
          this.includeTransactional,
        );

      const { members: mailchimpSegmentMembers = [] } =
        mailchimpSegmentMembersInfo;
      if (!mailchimpSegmentMembers.length) {
        console.log("No data available, skipping iteration");
        return;
      }
      mailchimpSegmentMembers.forEach(this.processEvent);
    },
  },
  methods: {
    ...common.methods,
    generateMeta(eventPayload) {
      const ts = +new Date(eventPayload.timestamp_opt);
      return {
        id: eventPayload.id,
        summary: `A new subscriber "${eventPayload.merge_fields.FNAME}" was added to a segment or tag. `,
        ts,
      };
    },
    processEvent(eventPayload) {
      const meta = this.generateMeta(eventPayload);
      this.$emit(eventPayload, meta);
    },
  },
  async run() {
    let mailchimpSegmentMembersInfo;
    let mailchimpSegmentMembers;
    let offset = 0;
    do {
      mailchimpSegmentMembersInfo = await this.mailchimp.getSegmentMembersList(
        this.listId,
        this.segmentId,
        1000,
        offset,
        this.includeTransactional,
      );
      mailchimpSegmentMembers = mailchimpSegmentMembersInfo.members;
      if (!mailchimpSegmentMembers.length) {
        console.log("No data available, skipping iteration");
        return;
      }
      mailchimpSegmentMembers.forEach(this.processEvent);
      offset = offset + mailchimpSegmentMembers.length;
    } while (mailchimpSegmentMembers.length > 0);
  },
};
