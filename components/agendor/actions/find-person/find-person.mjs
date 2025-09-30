import app from "../../agendor.app.mjs";

export default {
  name: "Find Person",
  description: "Find Person [See the documentation](https://api.agendor.com.br/docs/#operation/Get%20person).",
  key: "agendor-find-person",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    personId: {
      propDefinition: [
        app,
        "personId",
      ],
    },
  },
  async run({ $ }) {
    const person = await this.app.getPerson(this.personId);
    $.export("summary", `Person successfully retrieved with id "${person.data.id}".`);
    return person;
  },
};
