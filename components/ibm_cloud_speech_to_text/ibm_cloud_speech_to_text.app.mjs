export default {
  type: "app",
  app: "ibm_cloud_speech_to_text",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
