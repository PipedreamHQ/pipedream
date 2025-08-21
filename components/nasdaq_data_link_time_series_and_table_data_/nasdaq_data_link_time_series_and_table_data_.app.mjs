export default {
  type: "app",
  app: "nasdaq_data_link_time_series_and_table_data_",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
