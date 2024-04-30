import foursquare from "../../foursquare.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "foursquare-new-check-in",
  name: "New Check-In",
  description: "Emit new event when a user checks in. [See the documentation](https://docs.foursquare.com/developer/reference/get-user-checkins)",
  version: "0.0.${ts}",
  type: "source",
  dedupe: "unique",
  props: {
    foursquare,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    userId: {
      propDefinition: [
        foursquare,
        "userId",
      ],
    },
    geolocationScope: {
      propDefinition: [
        foursquare,
        "geolocationScope",
        (c) => ({
          userId: c.userId,
        }),
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      // Perform a manual run to backfill events on first deploy
      await this.run();
    },
  },
  async run() {
    const sinceId = this.db.get("sinceId") || "0";
    let maxId = sinceId;

    const { items: checkins } = await this.foursquare.getUserCheckins({
      userId: this.userId,
      limit: 50,
    });

    const filteredCheckins = this.geolocationScope
      ? checkins.filter((checkin) => {
        return checkin.venue && checkin.venue.location && checkin.venue.location === this.geolocationScope;
      })
      : checkins;

    filteredCheckins.forEach((checkin) => {
      const checkinId = checkin.id;
      if (checkinId > sinceId) {
        const ts = new Date(checkin.createdAt * 1000).getTime();
        this.$emit(checkin, {
          id: checkin.id,
          summary: `New Check-In: ${checkin.venue.name}`,
          ts,
        });
        maxId = checkinId > maxId
          ? checkinId
          : maxId;
      }
    });

    this.db.set("sinceId", maxId);
  },
};
