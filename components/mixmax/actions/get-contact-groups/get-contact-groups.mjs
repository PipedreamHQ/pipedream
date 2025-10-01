import common from "../common/base.mjs";
import FIELDS from "../common/fields.mjs";

export default {
  ...common,
  key: "mixmax-get-contact-groups",
  name: "Get Contact Groups",
  description: "Contact groups that you have access to (either that you have created, or that have been shared with you). [See the docs here](https://developer.mixmax.com/reference/contactgroups)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    limit: {
      propDefinition: [
        common.props.mixmax,
        "limit",
      ],
      optional: true,
    },
    fields: {
      propDefinition: [
        common.props.mixmax,
        "fields",
      ],
      options: FIELDS.GROUPS,
      optional: true,
    },
  },
  methods: {
    async processEvent() {
      const {
        limit,
        fields,
      } = this;

      const items = this.mixmax.paginate({
        fn: this.mixmax.listGroups,
        maxResults: limit,
        params: {
          fields: fields?.toString(),
          expand: "count",
        },
      });

      const results = [];
      for await (const item of items) {
        results.push(item);
      }
      return results;
    },
    getSummary() {
      return "Contact Groups Successfully fetched!";
    },
  },
};
