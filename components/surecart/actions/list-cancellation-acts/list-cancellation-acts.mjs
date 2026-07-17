import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-cancellation-acts",
  name: "List Cancellation Acts",
  description: "Return a list of cancellation acts. [See the documentation](https://developer.surecart.com/api-reference/cancellation-acts/list)",
  version: "1.0.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    ids: {
      propDefinition: [
        surecart,
        "ids",
      ],
    },
    maxResults: {
      propDefinition: [
        surecart,
        "maxResults",
      ],
    },
    liveMode: {
      propDefinition: [
        surecart,
        "liveMode",
      ],
    },
  },
  async run({ $ }) {
    const results = this.surecart.paginate({
      fn: this.surecart.listCancellationActs,
      args: {
        $,
        params: {
          "ids[]": this.ids,
          "live_mode": this.liveMode,
        },
      },
      max: this.maxResults,
    });

    const cancellationActs = [];
    for await (const cancellationAct of results) {
      cancellationActs.push(cancellationAct);
    }

    $.export("$summary", `Successfully retrieved ${cancellationActs.length} cancellation act(s)`);
    return cancellationActs;
  },
};
