import demio from "../../demio.app.mjs";
import constants from "../common/constants.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "demio-new-participant",
  name: "New Participant",
  description: "Emit new event for each participant in an event. [See docs here](https://publicdemioapi.docs.apiary.io/#reference/reports/event-date-participants/event-date-participants)",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    demio,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
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
    status: {
      label: "Status",
      description: "Status of the participant to filter",
      type: "string",
      options: constants.PARTICIPANT_STATUSES,
      optional: true,
    },
  },
  async run({ $ }) {
    let participants = await this.demio.getEventDateParticipants({
      $,
      dateId: this.dateId,
    });

    if (this.status) {
      participants = participants.filter((participant) => participant.status === this.status);
    }

    for (const participant of participants) {
      this.$emit(participant, {
        id: participant.email,
        summary: `New participant ${participant.email}`,
        ts: new Date(),
      });
    }
  },
};
