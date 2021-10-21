import common from "../common.mjs";

export default {
  key: "confection-get-related-uuids",
  name: "Get All Related UUIDs",
  type: "action",
  version: "0.0.1",
  description:
    "This action will retrieve all UUIDs that have a likeness score of at least 50 (default) with the provided UUID. The likeness score can be customized in configuration.",
  props: {
    ...common.props,
    uuid: {
      type: "string",
      label: "UUID",
      description: "Provide the UUID to retrieve related UUIDs of.",
    },
    likeness: {
      type: "integer",
      label: "Likeness Score",
      min: 50,
      max: 100,
      default: 50,
      optional: true,
      description:
        "Accepts values 50 to 100. 100 meaning only pull back records where we are certain the UUIDs are the same record",
    },
    stopExecution: {
      label:
        "Should this step be considered a success if no results are found?",
      type: "boolean",
      default: false,
      optional: true,
      description:
        "If set to false, action execution will be halted when no related UUIDs are found and any subsequent steps that rely on data from this step will not be run.",
    },
  },
  methods: common.methods,
  async run({ $ }) {
    const data = this.postRequest(
      $,
      `https://transmission.confection.io/${this.accountId}/${this.uuid}/related/${this.likeness}`,
    );

    if (data.related.length === 0 && this.stopExecution === false) {
      throw new Error(
        `No related UUIDs with likeness score greater than or equal to ${this.likeness} were found.`,
      );
    }
    return data;
  },
};
