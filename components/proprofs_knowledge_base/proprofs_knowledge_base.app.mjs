export default {
  type: "app",
  app: "proprofs_knowledge_base",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
