import base from "../_common/base.mjs";
import { optionalRecordId as recordId } from "../_common/props.mjs";

export default {
  ...base,
  key: "knack-get-record",
  name: "Get Record(s)",
  description:
    "Get one or all Records for a Knack object [(See docs here)](https://docs.knack.com/docs/retrieving-records)",
  version: "0.0.1",
  type: "action",
  props: {
    ...base.props,
    recordId,
  },
  async run({ $ }) {
    const params = {
      objectKey: this.objectKey,
      recordId: this.recordId,
    };

    const response = await this.knack.getRecord($, params);

    $.export(
      "$summary",
      `Obtained record successfully (array: ${response instanceof Array})`,
    );

    return response;
  },
};
