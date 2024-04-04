import cinc from "../../cinc.app.mjs";

export default {
  key: "cinc-add-saved-search",
  name: "Add Saved Search",
  description: "Creates a saved search based on lead search data in CINC",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    cinc,
    leadSearchData: {
      propDefinition: [
        cinc,
        "leadSearchData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.cinc.createSavedSearch(this.leadSearchData);
    $.export("$summary", "Successfully created a saved search");
    return response;
  },
};
