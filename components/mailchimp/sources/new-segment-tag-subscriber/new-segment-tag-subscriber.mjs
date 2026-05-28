import common from "../common/timer-based.mjs";
import constants from "../constants.mjs";

export default {
  ...common,
  key: "mailchimp-new-segment-tag-subscriber",
  name: "New Segment Tag Subscriber",
  description: "Emit new event when a subscriber is added to a segment or tags within an audience list.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    listId: {
      propDefinition: [
        common.props.mailchimp,
        "listId",
      ],
      description: "The unique ID of the audience list related to the segment or tag you'd like to watch for new subscribers",
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
      const config = {
        count: 10,
        offset: 0,
        includeTransactional: this.includeTransactional,
        includeUnsubscribed: false,
      };
      const subscribers =
        await this.mailchimp.getSegmentMembersList(
          this.listId,
          this.segmentId,
          config,
        );
      if (!subscribers?.length) {
        console.log("No data available, skipping iteration");
        return;
      }
      subscribers.forEach(this.processEvent);
    },
  },
  methods: {
    ...common.methods,
    generateMeta(eventPayload) {
      const ts = Date.parse(eventPayload.timestamp_opt);
      return {
        id: eventPayload.id,
        summary: `A new subscriber "${eventPayload.merge_fields.FNAME}" was added to a segment or tag. `,
        ts,
      };
    },
  },
  async run() {
    const pageSize = constants.PAGE_SIZE;
    let mailchimpSegmentMembersInfo;
    let mailchimpSegmentMembers;
    let offset = 0;
    const config = {
      count: pageSize,
      includeTransactional: this.includeTransactional,
      includeUnsubscribed: false,
    };
    do {
      config.offset = offset;
      mailchimpSegmentMembersInfo = await this.mailchimp.getSegmentMembersList(
        this.listId,
        this.segmentId,
        config,
      );
      mailchimpSegmentMembers = mailchimpSegmentMembersInfo.members;
      if (!mailchimpSegmentMembers?.length) {
        return;
      }
      mailchimpSegmentMembers.forEach(this.processEvent);
      offset = offset + mailchimpSegmentMembers.length;
    } while (mailchimpSegmentMembers.length === pageSize);
  },
};
