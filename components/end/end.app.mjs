export default {
  type: "app",
  app: "end",
  propDefinitions: {
    reason: {
      type: "string",
      label: "Reason",
      description: "A reason why the workflow execution was ended",
      optional: false,
    },
  },
  methods: {},
};
