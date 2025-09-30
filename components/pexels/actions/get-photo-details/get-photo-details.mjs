import pexels from "../../pexels.app.mjs";

export default {
  key: "pexels-get-photo-details",
  name: "Get Photo Details",
  description: "Retrieve detailed information about a specific photo by providing its photo ID. [See the documentation](https://www.pexels.com/api/documentation/#photos-show)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pexels,
    photoId: {
      propDefinition: [
        pexels,
        "photoId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pexels.getPhoto({
      $,
      photoId: this.photoId,
    });
    $.export("$summary", `Successfully retrieved details for photo ID: ${this.photoId}`);
    return response;
  },
};
