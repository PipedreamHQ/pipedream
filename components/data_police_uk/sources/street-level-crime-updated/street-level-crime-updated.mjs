import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";
import dataPoliceUK from "../../data_police_uk.app.mjs";

export default {
  key: "data_police_uk-street-level-crime-updated",
  name: "New Street Level Crime Updated",
  description: "Emit new event when a specific street level crime is updated.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
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
    specificCrimeId: {
      propDefinition: [
        dataPoliceUK,
        "specificCrimeId",
        ({
          date, lat, lng, poly,
        }) => ({
          date,
          lat,
          lng,
          poly,
        }),
      ],
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    async startEvent(maxResults) {
      const lastDate = this._getLastDate();
      const responseArray = [];
      let tempLastDate = lastDate;

      const { outcomes } = await this.dataPoliceUK.listOutcomesForSpecificCrime({
        persistentId: this.specificCrimeId,
      });

      if (maxResults && (outcomes.length > maxResults) ) {
        outcomes.length = maxResults;
      }

      for await (const outcome of outcomes) {
        const newLastDate = moment(outcome.date).format("YYYY-MM");

        if (moment(newLastDate).isSameOrAfter(lastDate)) {
          if (moment(newLastDate).isAfter(tempLastDate)) {
            tempLastDate = newLastDate;
          }
          responseArray.push(outcome);
        } else {
          break;
        }
      }

      if (lastDate != tempLastDate)
        this._setLastDate(tempLastDate);

      for (const responseItem of responseArray) {
        this.$emit(
          responseItem,
          {
            id: `${responseItem.date}-${responseItem.category.code}`,
            summary: `A new outcome update with code "${responseItem.category.code}" was created!`,
            ts: responseItem.date || new Date(),
          },
        );
      }
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
