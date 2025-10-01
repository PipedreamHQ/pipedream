import confection from "../../confection.app.mjs";

export default {
  key: "confection-get-related-uuids",
  name: "Get Related UUIDs",
  type: "action",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description:
    "This action will retrieve all UUIDs that have a likeness score of at least 50 (default) with the provided UUID. The likeness score can be customized in configuration.",
  props: {
    confection,
    uuid: {
      propDefinition: [
        confection,
        "uuid",
      ],
      description: "Provide the UUID to retrieve related UUIDs of.",
    },
    likeness: {
      propDefinition: [
        confection,
        "likeness",
      ],
      description:
        "Accepts values 50 to 100. 100 meaning only pull back records where we are certain the UUIDs are the same record",
    },
    stopOnNoResults: {
      propDefinition: [
        confection,
        "stopOnNoResults",
      ],
      description:
        "If set to true, action execution will be halted when no related UUIDs are found and any subsequent steps that rely on data from this step will not be run.",
    },
  },
  async run({ $ }) {
    const data = await this.confection.getRelatedUUIDs(
      this.uuid,
      this.likeness,
      $,
    );

    if (data.related.length === 0 && this.stopOnNoResults === true) {
      throw new Error(
        `No related UUIDs with likeness score greater than or equal to ${this.likeness} were found.`,
      );
    }
    return data;
  },
};
