export default {
  type: "app",
  app: "google_cloud_translate",
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
