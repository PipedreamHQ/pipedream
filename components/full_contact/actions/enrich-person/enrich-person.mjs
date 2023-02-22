import app from "../../full_contact.app.mjs";

export default {
  name: "Enrich Person",
  description: "Enrich a person. [See the docs here](https://docs.fullcontact.com/docs/getting-started-with-enrich-1)",
  key: "full_contact-enrich_person",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the person to enrich",
    },
  },
  async run({ $ }) {
    const data = {
      email: this.email,
    };
    const res = await this.app.enrichPerson(data, $);

    $.export("$summary", "Person successfully enriched");
    return res;
  },
};
