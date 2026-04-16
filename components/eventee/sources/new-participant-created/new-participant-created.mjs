import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "eventee-new-participant-created",
  name: "New Participant Created",
  description: "Emit new event when a new participant is created. [See the documentation](https://publiceventeeapi.docs.apiary.io/#reference/participants/get-all-participants/get-all)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(participant) {
      return {
        id: participant.id,
        summary: `New Participant with ID: ${participant.id}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const participants = await this.eventee.listParticipants();
    for (const participant of participants) {
      const meta = this.generateMeta(participant);
      this.$emit(participant, meta);
    }
  },
};
