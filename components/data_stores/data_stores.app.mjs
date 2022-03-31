export default {
  type: "app",
  app: "data_stores",
  propDefinitions: {
    data_store: {
      label: "Data Store",
      type: "data_store",
      description: "Select an existing Data Store or create a new one.",
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
