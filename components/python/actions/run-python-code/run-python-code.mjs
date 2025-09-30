import python from "../../python.app.mjs";

export default {
  name: "Run Python Code",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "python-run-python-code",
  description: "Write Python and use any of the 350k+ PyPi packages available. Refer to the [Pipedream Python docs](https://pipedream.com/docs/code/python) to learn more.",
  props: {
    python,
  },
  type: "action",
  methods: {},
  async run({
    steps, $,
  }) {
    // Placeholder action for Python code app
  },
};
