import common from "../common/common-updated-record.mjs";
const { salesforce } = common.props;

export default {
  ...common,
  type: "source",
  name: "New Updated Record (Instant, of Selectable Type)",
  key: "salesforce_rest_api-record-updated-instant",
  description: "Emit new event when a record of the selected type is updated. [See the documentation](https://sforce.co/3yPSJZy)",
  version: "0.2.3",
  props: {
    ...common.props,
    fields: {
      propDefinition: [
        salesforce,
        "field",
        ({ objectType }) => ({
          objectType,
          filter: ({ updateable }) => updateable,
        }),
      ],
      label: "Fields To Watch",
      type: "string[]",
      optional: true,
      description: "If specified, events will only be emitted if at least one of the selected fields is updated. This filter is only available when a webhook is created successfully.",
    },
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return this.objectType;
    },
  },
};
