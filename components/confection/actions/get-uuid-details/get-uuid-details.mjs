import common from "../common.mjs";

export default {
  key: "confection-get-uuid-details",
  name: "Retrieve Full Details of UUID",
  type: "action",
  version: "0.0.1",
  description:
    "This action will retrieve the full details of a specified UUID.",
  props: {
    ...common.props,
    uuid: {
      type: "string",
      label: "UUID",
      description: "Provide the UUID to retrieve details of.",
    },
  },
  methods: common.methods,
  async run({ $ }) {
    return this.postRequest(
      $,
      `https://transmission.confection.io/${this.accountId}/${this.uuid}/full`,
    );
  },
};
