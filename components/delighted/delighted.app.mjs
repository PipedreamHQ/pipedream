import delightedLib from "delighted";

export default {
  type: "app",
  app: "delighted",
  label: "Delighted",
  description: "The Delighted app that will be used to send the survey.",
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
