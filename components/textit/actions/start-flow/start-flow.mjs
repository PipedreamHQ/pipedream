import textit from "../../textit.app.mjs";

export default {
  name: "Start Flow",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "textit-start-flow",
  description: "Starts a flow. [See docs here](https://textit.in/api/v2/flow_starts)",
  type: "action",
  props: {
    textit,
    flowUuid: {
      propDefinition: [
        textit,
        "flowUuid",
      ],
    },
    contactUuid: {
      propDefinition: [
        textit,
        "contactUuid",
      ],
    },
    groupUuid: {
      propDefinition: [
        textit,
        "groupUuid",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.textit.startFlow({
      $,
      data: {
        flow: this.flowUuid,
        contacts: [
          this.contactUuid,
        ],
        groups: [
          this.groupUuid,
        ],
      },
    });

    if (response) {
      $.export("$summary", `Successfully started flow with uuid ${this.flowUuid}`);
    }

    return response;
  },
};
