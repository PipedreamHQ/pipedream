import { ConfigurationError } from "@pipedream/platform";
import moment from "moment";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "data_police_uk-crime-reported",
  name: "New Crime Reported",
  description: "Emit new event when a new crime is reported in a specific area.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async startEvent(maxResults) {
      const lastDate = this._getLastDate();
      const responseArray = [];
      let tempLastDate = lastDate;

      const {
        dataPoliceUK,
        date,
        lat,
        lng,
        poly,
      } = this;

      if (!lat && !lng && !poly)
        throw new ConfigurationError("It is necessary to use at least one type of localization, lat/lng or poly");

      const reg = new RegExp(/^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})$/);

      if (!reg.exec(lat) || !reg.exec(lng))
        throw new ConfigurationError("Invalid lat/lng value");

      const crimes = await dataPoliceUK.listCrimes({
        params: {
          date: date
            ? `${date.split("-")[0]}-${date.split("-")[1]}`
            : null,
          lat,
          lng,
          poly,
        },
      });

      crimes.sort((a, b) => {
        return a.id - b.id;
      });

      if (maxResults && (crimes.length > maxResults)) {
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
};
