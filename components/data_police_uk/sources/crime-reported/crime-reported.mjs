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
};
