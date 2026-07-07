import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-cancellation-reasons",
  name: "List Cancellation Reasons",
  description: "Return a list of cancellation reasons. [See the documentation](https://developer.surecart.com/api-reference/cancellation-reasons/list)",
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
  },
  async run({ $ }) {
    const results = this.surecart.paginate({
      fn: this.surecart.listCancellationReasons,
      args: {
        $,
        params: {
          "ids[]": this.ids,
        },
      },
      max: this.maxResults,
    });

    const cancellationReasons = [];
    for await (const cancellationReason of results) {
      cancellationReasons.push(cancellationReason);
    }

    $.export("$summary", `Successfully retrieved ${cancellationReasons.length} cancellation reason(s)`);
    return cancellationReasons;
  },
};
