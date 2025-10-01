import orderspace from "../../orderspace.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "orderspace-create-dispatch",
  name: "Create Dispatch",
  description: "Create a new dispatch. [See the documentation](https://apidocs.orderspace.com/#create-a-dispatch)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    orderspace,
    orderId: {
      propDefinition: [
        orderspace,
        "orderId",
      ],
    },
    comments: {
      type: "string",
      label: "Comments",
      description: "The comments to add to the dispatch",
      optional: true,
    },
    dispatchLines: {
      type: "string[]",
      label: "Dispatch Lines",
      description: "The lines of the dispatch. Each line should contain values for `sku` and `quantity`. [See the documentation](https://apidocs.orderspace.com/#create-a-dispatch) for information.",
    },
  },
  async run({ $ }) {
    const { dispatch } = await this.orderspace.createDispatch({
      $,
      data: {
        dispatch: {
          order_id: this.orderId,
          comments: this.comments,
          dispatch_lines: parseObject(this.dispatchLines),
        },
      },
    });
    $.export("$summary", `Successfully created dispatch ${dispatch.id}`);
    return dispatch;
  },
};
