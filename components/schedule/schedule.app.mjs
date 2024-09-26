export default {
  type: "app",
  app: "schedule",
  propDefinitions: {
    cron: {
      label: "Cron Schedule",
      type: "$.interface.timer",
      description: "Enter a cron expression",
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
