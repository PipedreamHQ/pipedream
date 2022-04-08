import filter from "../../filter.app.mjs";

export default {
  name: "Filter",
  version: "0.0.1",
  key: "filter-filter",
  description: "Select 2 values to compare against each other and choose whether you'd like to continue or stop your workflow based on the output.",
  props: {
    filter,
    inputField: {
      propDefinition: [
        filter,
        "inputField",
      ],
    },
    condition: {
      propDefinition: [
        filter,
        "condition",
      ],
    },
    valueToCompare: {
      propDefinition: [
        filter,
        "valueToCompare",
      ],
    },
    continue: {
      propDefinition: [
        filter,
        "continue",
      ],
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    // $.export("name", "value");
    // return $.flow.exit("end reason");
  },
};
