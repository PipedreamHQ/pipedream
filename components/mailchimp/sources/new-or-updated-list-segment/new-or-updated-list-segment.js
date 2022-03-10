const common = require("../common/timer-based");
const moment = require("moment");

module.exports = {
  ...common,
  key: "mailchimp-new-or-updated-list-segment",
  name: "New Or Updated List Segment",
  description: "Emit new event when segment is either created or updated.",
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
      "The unique ID of the audience list which you'd like to watch for new or updated segments.",
    },
    watchFor: {
      type: "string",
      label: "Watch for new created or updated segments?",
      description:
        "If set to `Created`, it will include new created segments only.  When set to `Updated`, it will only include recently updated segments.",
      options: [
        "Created",
        "Updated",
      ],
      optional: false,
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
      };
      const mailchimpAudienceSegmentsInfo =
        await this.mailchimp.getAudienceSegments(this.listId, config);
      const { segments: mailchimpAudienceSegments = [] } =
        mailchimpAudienceSegmentsInfo;
      if (!mailchimpAudienceSegments.length) {
        console.log("No data available, skipping iteration");
        return;
      }
      const relevantDate = [
        "Created",
      ].includes(this.watchFor)
        ? mailchimpAudienceSegments[0].created_at
        : mailchimpAudienceSegments[0].updated_at;
      this.mailchimp.setDbServiceVariable("lastRelevantDate", relevantDate);
      mailchimpAudienceSegments.forEach(this.processEvent);
    },
  },
  methods: {
    ...common.methods,
    generateMeta(eventPayload) {
      if ([
        "Created",
      ].includes(this.watchFor)) {
        return {
          id: eventPayload.id,
          summary: `A new segment "${eventPayload.name}" was created.`,
          ts: +new Date(eventPayload.created_at),
        };
      } else {
        const ts = +new Date(eventPayload.updated_at);
        return {
          id: `${eventPayload.id}${ts}`,
          summary: `Segment "${eventPayload.name}" was updated.`,
          ts,
        };
      }
    },
    processEvent(eventPayload) {
      const meta = this.generateMeta(eventPayload);
      this.$emit(eventPayload, meta);
    },
  },
  async run() {
    let sinceCreatedAt;
    let beforeCreatedAt;
    let sinceUpdatedAt;
    let beforeUpdatedAt;
    if ([
      "Created",
    ].includes(this.watchFor)) {
      sinceCreatedAt = this.mailchimp.getDbServiceVariable("lastRelevantDate");
      beforeCreatedAt = moment().toISOString();
    } else {
      sinceUpdatedAt = this.mailchimp.getDbServiceVariable("lastRelevantDate");
      beforeUpdatedAt = moment().toISOString();
    }
    let mailchimpAudienceSegmentsInfo;
    let mailchimpAudienceSegments;
    let offset = 0;
    const config = {
      count: 1000,
      sinceCreatedAt,
      beforeCreatedAt,
      sinceUpdatedAt,
      beforeUpdatedAt,
    };
    do {
      config.offset = offset;
      mailchimpAudienceSegmentsInfo = await this.mailchimp.getAudienceSegments(this.listId, config);
      mailchimpAudienceSegments = mailchimpAudienceSegmentsInfo.segments;
      if (!mailchimpAudienceSegments.length) {
        console.log("No data available, skipping iteration");
        return;
      }
      mailchimpAudienceSegments.forEach(this.processEvent);
      const relevantDate = [
        "Created",
      ].includes(this.watchFor)
        ? mailchimpAudienceSegments[0].created_at
        : mailchimpAudienceSegments[0].updated_at;
      this.mailchimp.setDbServiceVariable("lastRelevantDate", relevantDate);
      offset = offset + mailchimpAudienceSegments.length;
    } while (mailchimpAudienceSegments.length > 0);
  },
};
