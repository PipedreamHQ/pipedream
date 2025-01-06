import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import appName from "../../easypromos.app.mjs";

export default {
  key: "easypromos-new-participation",
  name: "New Participation Submitted",
  description: "Emit new event when a registered user submits a participation in the promotion. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    easypromos: {
      type: "app",
      app: "easypromos",
    },
    promotionid: {
      propDefinition: [
        appName,
        "promotionid",
      ],
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const lastParticipationId = this.db.get("lastParticipationId") || 0;
      const participations = await this.easypromos._makeRequest({
        method: "GET",
        path: "/participations",
        params: {
          promotion_id: this.promotionid,
          limit: 50,
          sort: "id_desc",
        },
      });

      const newParticipations = participations.filter((participation) => participation.id > lastParticipationId);

      newParticipations.forEach((participation) => {
        this.$emit(participation, {
          id: participation.id.toString(),
          summary: `New Participation by User ID ${participation.user_id}`,
          ts: Date.parse(participation.created),
        });
      });

      if (participations.length > 0) {
        const maxId = Math.max(...participations.map((p) => p.id));
        this.db.set("lastParticipationId", maxId);
      }
    },
    async activate() {
      // No webhook setup needed for polling
    },
    async deactivate() {
      // No webhook teardown needed for polling
    },
  },
  async run() {
    const lastParticipationId = this.db.get("lastParticipationId") || 0;

    const participations = await this.easypromos._makeRequest({
      method: "GET",
      path: "/participations",
      params: {
        promotion_id: this.promotionid,
        limit: 50,
        sort: "id_desc",
      },
    });

    const newParticipations = participations.filter((participation) => participation.id > lastParticipationId);

    newParticipations.forEach((participation) => {
      this.$emit(participation, {
        id: participation.id.toString(),
        summary: `New Participation by User ID ${participation.user_id}`,
        ts: Date.parse(participation.created) || Date.now(),
      });
    });

    if (participations.length > 0) {
      const maxId = Math.max(...participations.map((p) => p.id));
      this.db.set("lastParticipationId", maxId);
    }
  },
};
