import app from "../../salesflare.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "salesflare-find-person",
  version: "0.0.1",
  type: "action",
  name: "Find Person",
  description: "Finds people according to props configured, if no prop configured returns all people [See the docs here](https://api.salesflare.com/docs#operation/getPersons)",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "personId",
      ],
      type: "integer[]",
      label: "Person IDs",
      description: "Person IDs",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email",
      optional: true,
    },
    search: {
      type: "string",
      label: "Search",
      description: "Any search string.",
      optional: true,
    },
  },
  async run ({ $ }) {
    const params = utils.extractProps(this, {});
    const resp = await this.app.getPeople({
      $,
      params,
    });
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${resp.length} ${resp.length != 1 ? "people" : "person"} has been found.`);
    return resp;
  },
};
