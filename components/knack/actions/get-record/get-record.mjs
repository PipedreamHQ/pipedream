import common from "../common.mjs";
import knack from "../../knack.app.mjs";

export default {
  ...common,
  key: "knack-get-record",
  name: "Get Record(s)",
  description:
    "Get one or all Records for a Knack object [(See docs here)](https://docs.knack.com/docs/retrieving-records)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    recordId: {
      propDefinition: [
        knack,
        "recordId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.knack.httpRequest($, {
      method: "GET",
      objectKey: this.objectKey,
      recordId: this.recordId,
    });

    $.export(
      "$summary",
      `Obtained record successfully (array: ${response instanceof Array})`,
    );

    return response;
  },
};
