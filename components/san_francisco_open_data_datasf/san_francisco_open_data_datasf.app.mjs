export default {
  type: "app",
  app: "san_francisco_open_data_datasf",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
