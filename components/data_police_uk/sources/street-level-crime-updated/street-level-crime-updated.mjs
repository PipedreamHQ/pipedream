import moment from "moment";
import dataPoliceUK from "../../data_police_uk.app.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "data_police_uk-street-level-crime-updated",
  name: "New Street Level Crime Updated",
  description: "Emit new event when a specific street level crime is updated.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
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
    ...common.methods,
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
};
