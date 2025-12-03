import common from "../common/base.mjs";

export default {
  ...common,
  key: "growsurf-new-participant-added",
  name: "New Participant Added",
  description: "Emit new event when a new participant is added to a campaign. [See the documentation](https://docs.growsurf.com/developer-tools/rest-api/api-reference#get-participants)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    campaignId: {
      propDefinition: [
        common.props.growsurf,
        "campaignId",
      ],
    },
  },
  methods: {
    ...common.methods,
    async getResources(max) {
      const results = this.growsurf.paginate({
        fn: this.growsurf.listParticipants,
        args: {
          campaignId: this.campaignId,
          params: {
            limit: 100,
          },
        },
        resourceKey: "participants",
      });
      const participants = [];
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      for await (const participant of results) {
        const ts = participant.createdAt;
        if (ts > lastTs) {
          participants.push(participant);
          maxTs = Math.max(ts, maxTs);
        }
      }
      this._setLastTs(maxTs);
      if (max && participants.length > max) {
        participants.length = max;
      }
      return participants;
    },
    generateMeta(participant) {
      return {
        id: participant.id,
        summary: `New Participant Added: ${participant.firstName} ${participant.lastName}`,
        ts: participant.createdAt,
      };
    },
  },
};
