import nutshell from "../../nutshell.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "nutshell-find-or-create-person",
  name: "Find or Create Person",
  description: "Looks for an existing person in Nutshell. If not found, creates a new person. [See the documentation](https://developers.nutshell.com)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    nutshell,
    email: nutshell.propDefinitions.email,
    firstName: {
      ...nutshell.propDefinitions.firstName,
      optional: true,
    },
    lastName: {
      ...nutshell.propDefinitions.lastName,
      optional: true,
    },
    jobTitle: {
      ...nutshell.propDefinitions.jobTitle,
      optional: true,
    },
  },
  async run({ $ }) {
    const existingPerson = await this.nutshell.findOrCreatePerson({
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      jobTitle: this.jobTitle,
    });

    const actionResult = existingPerson
      ? "found"
      : "created";
    $.export("$summary", `Person ${actionResult} with email ${this.email}`);
    return existingPerson;
  },
};
