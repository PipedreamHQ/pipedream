import trello from "../trello.app.mjs";

export default {
  props: {
    trello,
  },
  methods: {
    /**
     * Returns an array of objects that matches the object's `name` property with the `query` param
     *
     * @param {array} foundObjects an array of objects results of a Trello's get
     * endpoint on `labels` and `lists`.
     * @param {string} query the name string that will be use to query against `foundObjects.name`
     * property
     * @returns {array} the objects from `foundObjects` matching the specified query.
     */
    getMatches(foundObjects, query) {
      return foundObjects?.filter((obj) => obj.name.includes(query)) ?? [];
    },
  },
};
