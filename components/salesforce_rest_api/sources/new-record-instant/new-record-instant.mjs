import common from "../common/common-new-record.mjs";

export default {
  ...common,
  type: "source",
  name: "New Record (Instant, of Selectable Type)",
  key: "salesforce_rest_api-new-record-instant",
  description: "Emit new event when a record of the selected object type is created. [See the documentation](https://sforce.co/3yPSJZy)",
  version: "0.2.8",
  props: {
    ...common.props,
    fieldsToObtain: {
      propDefinition: [
        common.props.salesforce,
        "fieldsToObtain",
        (c) => ({
          objType: c.objectType,
        }),
      ],
      optional: true,
      description: "Select the field(s) to be retrieved for the records. Only applicable if the source is running on a timer. If running on a webhook, or if not specified, all fields will be retrieved.",
    },
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return this.objectType;
    },
  },
};
