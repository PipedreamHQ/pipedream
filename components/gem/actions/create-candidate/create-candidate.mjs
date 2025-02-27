import gem from "../../gem.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "gem-create-candidate",
  name: "Create Candidate",
  description: "Creates a new candidate in Gem. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    gem,
    firstName: {
      propDefinition: [
        gem,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        gem,
        "lastName",
      ],
    },
    emails: {
      propDefinition: [
        gem,
        "emails",
      ],
    },
    jobPosition: {
      propDefinition: [
        gem,
        "jobPosition",
      ],
      optional: true,
    },
    source: {
      propDefinition: [
        gem,
        "source",
      ],
      optional: true,
    },
    notes: {
      propDefinition: [
        gem,
        "notes",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const candidate = await this.gem.createCandidate({
      firstName: this.firstName,
      lastName: this.lastName,
      emails: this.emails,
      jobPosition: this.jobPosition,
      source: this.source,
      notes: this.notes,
    });
    $.export(
      "$summary",
      `Created candidate ${candidate.first_name} ${candidate.last_name} with ID: ${candidate.id}`,
    );
    return candidate;
  },
};
