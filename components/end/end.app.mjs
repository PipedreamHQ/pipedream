export default {
  type: "app",
  app: "end",
  propDefinitions: {
    reason: {
      type: "string",
      label: "Reason",
      description: "Reason for ending workflow execution",
      optional: true,
    },
  },
  methods: {},
};
