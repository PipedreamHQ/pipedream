import foursquare from "../../foursquare.app.mjs";

export default {
  key: "foursquare-create-tip",
  name: "Create Tip",
  description: "Allows the user to create a new tip for a venue on Foursquare. [See the documentation](https://docs.foursquare.com/developer/reference/add-a-tip)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    foursquare,
    venueId: {
      propDefinition: [
        foursquare,
        "venueId",
      ],
    },
    tipText: {
      type: "string",
      label: "Tip Text",
      description: "The text of the tip.",
    },
  },
  async run({ $ }) {
    const response = await this.foursquare.addTip({
      $,
      params: {
        venueId: this.venueId,
        text: this.tipText,
      },
    });
    $.export("$summary", `Successfully created tip for venue ${this.venueId}`);
    return response;
  },
};
