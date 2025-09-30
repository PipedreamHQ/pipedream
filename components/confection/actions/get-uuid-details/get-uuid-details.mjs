import confection from "../../confection.app.mjs";

export default {
  key: "confection-get-uuid-details",
  name: "Get Full Details of UUID",
  type: "action",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description:
    "This action will retrieve the full details of a specified UUID.",
  props: {
    confection,
    uuid: {
      propDefinition: [
        confection,
        "uuid",
      ],
      description: "Provide the UUID to retrieve details of.",
    },
  },
  async run({ $ }) {
    return this.confection.getUUIDDetails(this.uuid, $);
  },
};
