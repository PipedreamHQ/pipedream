import common from "../common/base.mjs";

export default {
  ...common,
  key: "firsttouch-new-social-engager",
  name: "New Social Engager",
  description: "Emit new event when someone reacts to or comments on a LinkedIn post watched by a FirstTouch signal. [See the documentation](https://docs.firsttouch.com)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    signalId: {
      propDefinition: [
        common.props.firsttouch,
        "signalId",
      ],
    },
    engagementType: {
      type: "string",
      label: "Engagement Type",
      description: "Only this kind of engagement, e.g. `comment`. Leave empty for reactions and comments.",
      optional: true,
      options: [
        {
          label: "Comments",
          value: "comment",
        },
        {
          label: "Reactions",
          value: "reaction",
        },
      ],
    },
  },
  methods: {
    ...common.methods,
    async fetchEvents() {
      const engagedFromUtc = this.daysAgoIso(7);
      const engagers = await this.paginate(async (cursor) => {
        const response = await this.firsttouch.listEngagers({
          data: {
            signalId: this.signalId,
            engagementType: this.engagementType || undefined,
            engagedFromUtc,
            // Keep every engagement, not only each person's first one.
            earliestEngagementPerContact: false,
            limit: 100,
            cursor,
          },
        });
        return {
          items: response.engagers?.items,
          cursor: response.engagers?.cursor,
        };
      });
      return engagers.map((engager) => ({
        id: engager.id || `${engager.profile_url}:${engager.engaged_at}`,
        occurredAt: engager.engaged_at || "",
        data: engager,
      }));
    },
    getSummary(engager) {
      const name = [
        engager.first_name,
        engager.last_name,
      ].filter(Boolean).join(" ") || "Someone";
      return `${name} ${engager.engagement_type === "COMMENT"
        ? "commented"
        : "reacted"}`;
    },
  },
};
