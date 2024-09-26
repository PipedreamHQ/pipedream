import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import dataPoliceUK from "../../data_police_uk.app.mjs";

export default {
  props: {
    dataPoliceUK,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Data Police UK on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    date: {
      type: "string",
      label: "Date",
      description: "(YYYY-MM) Limit results to a specific month. The latest month will be shown by default",
      optional: true,
    },
    lat: {
      type: "string",
      label: "Latitude",
      description: "Latitude of the requested crime area. You must use either lat/lng or poly, never both.",
      optional: true,
    },
    lng: {
      type: "string",
      label: "Longitude",
      description: "Longitude of the requested crime area. You must use either lat/lng or poly, never both.",
      optional: true,
    },
    poly: {
      type: "string",
      label: "Poly",
      description: "The lat/lng pairs which define the boundary of the custom area. The `poly` parameter is formatted in lat/lng pairs, separated by colons: `[lat],[lng]:[lat],[lng]:[lat],[lng]`.  You must use either lat/lng or poly, never both.",
      optional: true,
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
};
