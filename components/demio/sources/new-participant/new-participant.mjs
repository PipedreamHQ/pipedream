import demio from "../../demio.app.mjs";

export default {
  key: "demio-new-participant",
  name: "New Participant",
  description: "Emit new event for each participant in an event",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    demio,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    eventId: {
      propDefinition: [
        demio,
        "eventId",
      ],
    },
    dateId: {
      propDefinition: [
        demio,
        "dateId",
        (c) => ({
          eventId: c.eventId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const participants = await this.demio.getEventDateParticipants({
      $,
      dateId: this.dateId,
    });

    for (const participant of participants) {
      this.$emit(participant, {
        id: participant.email,
        summary: `New participant ${participant.email}`,
        ts: new Date(),
      });
    }
  },
};
