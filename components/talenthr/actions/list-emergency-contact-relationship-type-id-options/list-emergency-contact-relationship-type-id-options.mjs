import talenthr from "../../talenthr.app.mjs";

export default {
  key: "talenthr-list-emergency-contact-relationship-type-id-options",
  name: "List Emergency Contact Relationship Type Options",
  description: "Retrieves available options for the Emergency Contact Relationship Type field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    talenthr,
  },
  async run({ $ }) {
    const options = await talenthr.propDefinitions.emergencyContactRelationshipTypeId.options
      .call(this.talenthr);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
