import go from "../../go.app.mjs";

export default {
  name: "Run Go Code",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "go-run-go-code",
  description: "Run any Go code and use any Go package available with a simple import. Refer to the [Pipedream Go docs](https://pipedream.com/docs/code/go) to learn more.",
  props: {
    go,
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    // Placeholder action for Go code app
  },
};
