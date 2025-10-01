import base from "../common/base.mjs";
import { optionalRecordId as recordId } from "../common/props.mjs";

export default {
  ...base,
  key: "knack-get-record",
  name: "Get Record(s)",
  description:
    "Get one or more Records for a Knack object [(See docs here)](https://docs.knack.com/docs/retrieving-records)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
      description: "The order to sort the records by, based on `Sort Field`.",
    },
    filters: {
      type: "string[]",
      label: "Filters",
      description: `One or more filters the returned records should match. Each filter should be a string representing a JSON object.
        \\
        Example value: \`{ "field": "field_1", "operator": "contains", "value": "my name" }\`
        \\
        See [the Knack API docs](https://docs.knack.com/docs/constructing-filters) for more information.`,
      optional: true,
    },
    filterType: {
      type: "string",
      label: "Filter Type",
      optional: true,
      options: [
        {
          label: "Match any filter",
          value: "or",
        },
        {
          label: "Match all filters",
          value: "and",
        },
      ],
      description: "If using multiple `Filters`, sets whether the returned records should match **any** or **all** filters specified.",
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
        filters: this.filters,
        filterType: this.filterType,
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
