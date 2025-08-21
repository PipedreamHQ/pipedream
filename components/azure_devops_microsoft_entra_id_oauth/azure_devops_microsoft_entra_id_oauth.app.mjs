export default {
  type: "app",
  app: "azure_devops_microsoft_entra_id_oauth",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};