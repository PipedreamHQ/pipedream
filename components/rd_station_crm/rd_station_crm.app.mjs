export default {
    type: "app",
    app: "rd_station_crm",
    propDefinitions: {},
    methods: {
      // this.$auth contains connected account data
      authKeys() {
        console.log(Object.keys(this.$auth));
      },
    },
  };