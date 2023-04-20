import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";
import dataPoliceUK from "../../data_police_uk.app.mjs";

export default {
  key: "data_police_uk-crime-reported",
  name: "New Crime Reported",
  description: "Emit new event when a new crime is reported in a specific area.",
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

      const {
        dataPoliceUK,
        ...params
      } = this;

      const crimes = await dataPoliceUK.listCrimes({
        params,
      });

      crimes.sort((a, b) => {
        return a.id - b.id;
      });

      if (maxResults && (crimes.length > maxResults) ) {
        crimes.length = maxResults;
      }

      for await (const crime of crimes) {
        const newLastDate = moment(crime.date).format("YYYY-MM");

        if (moment(newLastDate).isSameOrAfter(lastDate)) {
          if (moment(newLastDate).isAfter(tempLastDate)) {
            tempLastDate = newLastDate;
          }
          responseArray.push(crime);
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
            id: responseItem.id,
            summary: `A new crime with id: "${responseItem.id}" was reported!`,
            ts: responseItem.month || new Date(),
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
