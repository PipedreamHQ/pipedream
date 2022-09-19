import delightedLib from "delighted";

export default {
  type: "app",
  app: "delighted",
  propDefinitions: {},
  methods: {
    lib() {
      return delightedLib(this.$auth.api_key);
    },
    async sendingToPeople(params) {
      return this.lib().person.create(params);
    },
  },
};
