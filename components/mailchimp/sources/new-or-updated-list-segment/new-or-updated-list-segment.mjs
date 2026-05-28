import common from "../common/timer-based.mjs";
import constants from "../constants.mjs";

export default {
  ...common,
  key: "mailchimp-new-or-updated-list-segment",
  name: "New or Updated List Segment",
  description: "Emit new event when segment is either created or updated.",
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
      description: "The unique ID of the audience list which you'd like to watch for new or updated segments",
    },
    watchFor: {
      type: "string",
      label: "Watch for new created or updated segments?",
      description: "If set to `Created`, it will include new created segments only.  When set to `Updated`, it will only include recently updated segments.",
      options: constants.SEGMENT_WATCH_TYPES,
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
      const segments = this.watchFor === "Created"
        ? await this.mailchimp.getAudienceSegmentsByCreatedDate(this.listId, config)
        : await this.mailchimp.getAudienceSegmentsByUpdatedDate(this.listId, config);
      if (!segments?.length) {
        throw new Error("No segment data available");
      }
      const relevantDate = this.watchFor === "Created" ?
        segments[0].created_at
        : segments[0].updated_at;
      segments.forEach(this.processEvent);
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
          ts: Date.parse(eventPayload.created_at),
        };
      } else {
        const ts = Date.parse(eventPayload.updated_at);
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
    const pageSize = constants.PAGE_SIZE;
    const config = {
      count: pageSize,
      endDateTime,
    };
    do {
      config.offset = offset;
      config.startDateTime = startDateTime;
      segments = this.watchFor === "Created"
        ? segments = await this.mailchimp.getAudienceSegmentsByCreatedDate(this.listId, config)
        : segments = await this.mailchimp.getAudienceSegmentsByUpdatedDate(this.listId, config);
      if (!segments?.length) {
        return;
      }
      segments.forEach(this.processEvent);
      startDateTime = this.watchFor === "Created" ?
        segments[0].created_at
        : segments[0].updated_at;
      this.setDbServiceVariable("lastRelevantDate", startDateTime);
      offset = offset + segments.length;
    } while (segments.length === pageSize);
  },
};
