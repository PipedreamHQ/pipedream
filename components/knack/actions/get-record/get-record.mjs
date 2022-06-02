import base from "../common/base.mjs";
import { optionalRecordId as recordId } from "../common/props.mjs";

export default {
  ...base,
  key: "knack-get-record",
  name: "Get Record(s)",
  description:
    "Get one or all Records for a Knack object [(See docs here)](https://docs.knack.com/docs/retrieving-records)",
  version: "0.0.9",
  type: "action",
  props: {
    ...base.props,
    recordId,
    sortField: {
      type: "string",
      label: "Sort Field",
      optional: true,
      description: `The field key to sort the records by. Use in conjunction with \`Sort Order\`.
        \\
        Example value: \`field_1\`
        \\
        See [the Knack API docs](https://docs.knack.com/docs/sorting) for more information.`,
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      optional: true,
      options: [
        {
          label: "Ascending",
          value: "asc",
        },
        {
          label: "Descending",
          value: "desc",
        },
      ],
      description: `The order to sort the results by, based on \`Sort Field\`.
        \\
        See [the Knack API docs](https://docs.knack.com/docs/sorting) for more information.`,
    },
  },
  methods: {
    ...base.methods,
    getBaseParams() {
      return {
        objectKey: this.objectKey,
        recordId: this.recordId,
      };
    },
    getQueryParams() {
      return {
        sortField: this.sortField,
        sortOrder: this.sortOrder,
      };
    },
  },
  async run({ $ }) {
    const response = await this.knack.getRecord(
      $,
      this.getBaseParams(),
      this.getQueryParams(),
    );

    $.export(
      "$summary",
      `Obtained ${
        response instanceof Array
          ? `${response.length} records`
          : "record"
      } successfully`,
    );

    return response;
  },
};
