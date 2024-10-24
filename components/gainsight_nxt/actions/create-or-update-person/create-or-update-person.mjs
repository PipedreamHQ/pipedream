import gainsight_nxt from "../../gainsight_nxt.app.mjs";

export default {
  key: "gainsight_nxt-create-or-update-person",
  name: "Create or Update Person",
  description: "Adds or updates a person's record in Gainsight NXT. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    gainsight_nxt: {
      type: "app",
      app: "gainsight_nxt",
    },
    personFields: {
      propDefinition: [
        gainsight_nxt,
        "personFields",
      ],
    },
  },
  async run({ $ }) {
    const personData = this.personFields.reduce((acc, field) => {
      const parsed = JSON.parse(field);
      return {
        ...acc,
        ...parsed,
      };
    }, {});

    if (!personData.email) {
      throw new Error("Person 'email' field is required.");
    }

    const response = await this.gainsight_nxt.createOrUpdatePerson(personData);

    $.export("$summary", `Created or updated person with email ${personData.email}`);
    return response;
  },
};
