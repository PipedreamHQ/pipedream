import affinity from "../../affinity.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "affinity-create-person",
  name: "Create Person",
  description: "Creates a new person entry. [See the documentation](https://api-docs.affinity.co/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    affinity,
    personDetails: {
      propDefinition: [
        affinity,
        "personDetails",
      ],
    },
  },
  async run({ $ }) {
    const { personDetails } = this;
    const existingPersons = await this.affinity.searchEntities(personDetails.name);
    if (existingPersons.length > 0) {
      $.export("$summary", `Person ${personDetails.name} already exists.`);
      return existingPersons[0];
    }
    const response = await this.affinity.createEntity({
      ...personDetails,
      type: 0, // Type for person entity
    });
    $.export("$summary", `Created person ${personDetails.name}`);
    return response;
  },
};
