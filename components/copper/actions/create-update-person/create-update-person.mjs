import copper from "../../copper.app.mjs";

export default {
  key: "copper-create-update-person",
  name: "Create or Update Person",
  description: "Creates a new person or updates an existing one based on the matching criteria. [See the documentation](https://developer.copper.com/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    copper,
    personData: copper.propDefinitions.personData,
  },
  async run({ $ }) {
    const response = await this.copper.createOrUpdatePerson(this.personData);
    $.export("$summary", `Successfully created or updated person with id: ${response.id}`);
    return response;
  },
};
