import app from "../../superdocu.app.mjs";

export default {
  type: "actions",
  key: "superdocu-create-contacttttttt",
  name: "Create Contact",
  description: "Create a new contact in Superdoc. [See the docs here](https://developers.superdocu.com/api/index.html)",
  version: "0.0.2",
  props: {
    app,
  },
  async run({ $ }) {
    this.app.authKeys();
    $.export("$summary", "Contact successfully created");
  },
};
