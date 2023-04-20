import { axios } from "@pipedream/platform";
import { clearObj } from "./common/utils.mjs";

export default {
  type: "app",
  app: "data_police_uk",
  propDefinitions: {
    forceId: {
      type: "string",
      label: "Forces",
      description: "The id of the force you want to retrieve.",
      async options() {
        const data = await this.listForces();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    specificCrimeId: {
      type: "string",
      label: "Specific Crime",
      description: "The Id of the crime you want to retrieve the outcomes.",
      async options({
        date,
        lat,
        lng,
        poly,
      }) {
        const data = await this.listStreetLevelCrimes({
          params: clearObj({
            date,
            lat,
            lng,
            poly,
          }),
        });

        return data.filter((crime) => crime.persistent_id).map(({
          persistent_id: value, id, category, location: { street: { name } },
        }) => ({
          label: `(${id}) ${category} - ${name}`,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://data.police.uk/api";
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        ...opts,
      };

      return axios($, config);
    },
    getForce({
      forceId, ...args
    }) {
      return this._makeRequest({
        path: `forces/${forceId}`,
        ...args,
      });
    },
    listCrimes(args = {}) {
      return this._makeRequest({
        path: "crimes-at-location",
        ...args,
      });
    },
    listStreetLevelCrimes(args = {}) {
      return this._makeRequest({
        path: "crimes-street/all-crime",
        ...args,
      });
    },
    listForces(args = {}) {
      return this._makeRequest({
        path: "forces",
        ...args,
      });
    },
    listOutcomes(args = {}) {
      return this._makeRequest({
        path: "outcomes-at-location",
        ...args,
      });
    },
    listOutcomesForSpecificCrime({
      persistentId, ...args
    }) {
      return this._makeRequest({
        path: `outcomes-for-crime/${persistentId}`,
        ...args,
      });
    },
    listPeople({
      forceId, ...args
    }) {
      return this._makeRequest({
        path: `forces/${forceId}/people`,
        ...args,
      });
    },
    async getForceWithPeople(args = {}) {
      const force = await this.getForce(args);
      const people = await this.listPeople(args);

      return {
        ...force,
        people,
      };
    },
  },
};
