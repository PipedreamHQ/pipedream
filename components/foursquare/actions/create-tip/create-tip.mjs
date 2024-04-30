import foursquare from "../../foursquare.app.mjs";

export default {
  key: "foursquare-create-tip",
  name: "Create Tip",
  description: "Allows the user to create a new tip for a venue on Foursquare. [See the documentation](https://docs.foursquare.com/developer/reference/add-a-tip)",
  version: "0.0.1",
  type: "action",
  props: {
    foursquare,
    venueId: foursquare.propDefinitions.venueId,
    tipText: foursquare.propDefinitions.tipText,
  },
  async run({ $ }) {
    const response = await this.foursquare.addTip({
      venueId: this.venueId,
      text: this.tipText,
    });
    $.export("$summary", `Successfully created tip for venue ${this.venueId}`);
    return response;
  },
};
