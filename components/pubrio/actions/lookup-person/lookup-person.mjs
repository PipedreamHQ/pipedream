import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-lookup-person",
  name: "Lookup Person",
  description: "Look up a person's professional profile by LinkedIn URL or Pubrio ID. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
  },
  props: {
    pubrio,
    lookupType: { propDefinition: [pubrio, "lookupTypePerson"] },
    value: { propDefinition: [pubrio, "lookupValue"] },
  },
  async run({ $ }) {
    const response = await this.pubrio.lookupPerson({
      $,
      data: { [this.lookupType]: this.value },
    });
    $.export("$summary", "Successfully looked up person");
    return response;
  },
};
