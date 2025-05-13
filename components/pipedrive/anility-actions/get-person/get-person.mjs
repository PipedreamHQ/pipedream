import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "anility-pipedrive-get-person",
  name: "Get Person (Anility)",
  description:
    "Returns the details of a person. Note that this also returns some additional fields which are not present when asking for all persons. Also note that custom fields appear as long hashes in the resulting data. These hashes can be mapped against the key value of personFields.",
  version: "0.0.5",
  type: "action",
  props: {
    pipedriveApp,
    personId: {
      propDefinition: [
        pipedriveApp,
        "personId",
      ],
    },
  },
  async run({ $ }) {
    const { personId } = this;

    const person = await this.pipedriveApp.getPerson(personId);

    try {

      $.export(
        "$summary",
        `Successfully found person with id ${personId}`,
      );

      return person;
    } catch (error) {
      console.error(error.context?.body || error);
      throw error.context?.body?.error || "Failed to get person";
    }
  },
};

