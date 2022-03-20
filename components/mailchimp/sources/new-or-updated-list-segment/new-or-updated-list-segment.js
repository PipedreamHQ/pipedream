const common = require("../common/timer-based");

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
     let segments;
     if(this.watchFor === "Created" ) {
      segments = await this.mailchimp.getAudienceSegmentsByCreatedDate(config);
     } else {
      segments = await this.mailchimp.getAudienceSegmentsByUpdatedDate(config);
     }
      if (!segments.length) {
        console.log("No data available, skipping iteration");
        return;
      }
      const relevantDate = this.watchFor === "Created" ?
        segments[0].created_at
        : segments[0].updated_at;
      segments.forEach(this.emitEvent);
      this.setDbServiceVariable("lastRelevantDate", relevantDate);
    },
  },
  methods: {
    ...common.methods,
    generateMeta(eventPayload) {
      if (this.watchFor === "Created") {
        return {
          id: eventPayload.id,
          summary: `A new segment "${eventPayload.name}" was created.`,
          ts: +new Date(eventPayload.created_at),
        }
      } else {
        const ts = +new Date(eventPayload.updated_at);
        return {
          id: `${eventPayload.id}${ts}`,
          summary: `Segment "${eventPayload.name}" was updated.`,
          ts,
        };
      }
    },
  },
  async run() {
    let startDateTime = this.getDbServiceVariable("lastRelevantDate");
    const endDateTime = (new Date).toISOString();
    let segments;
    let offset = 0;
    const pageSize = 1000;
    const config = {
      count: pageSize,
      endDateTime,
    };
    do {
      config.offset = offset;
      config.startDateTime = startDateTime;
      segments = await this.mailchimp.getAudienceSegments(this.listId, config);
      if (!segments.length) {
        console.log("No data available, skipping iteration");
        return;
      }
      segments.forEach(this.emitEvent);
      startDateTime = this.watchFor === "Created" ?
        segments[0].created_at
        : segments[0].updated_at;
      this.setDbServiceVariable("lastRelevantDate", startDateTime);
      offset = offset + segments.length;
    } while (segments.length === pageSize);
  },
};
