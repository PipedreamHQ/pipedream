import sharepoint from "../sharepoint/sharepoint.app.mjs";

export default {
  ...sharepoint,
  app: "sharepoint_admin",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
