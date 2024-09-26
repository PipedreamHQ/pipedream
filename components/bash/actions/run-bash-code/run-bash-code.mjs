import bash from "../../bash.app.mjs";

export default {
  name: "Run Bash Code",
  version: "0.0.2",
  key: "bash-run-bash-code",
  description: "Run any Bash in a Pipedream step within your workflow. Refer to the [Pipedream Bash docs](https://pipedream.com/docs/code/bash) to learn more.",
  props: {
    bash,
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    // Placeholder action for Bash code app
  },
};
