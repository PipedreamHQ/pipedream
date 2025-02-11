import streamlabs from "../../streamlabs.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "streamlabs-update-overlay",
  name: "Update Stream Overlay",
  description: "Updates a specific stream overlay with new values, such as text, images, or stats. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    streamlabs,
    overlayId: {
      propDefinition: [
        streamlabs,
        "overlayId",
      ],
    },
    contentUpdates: {
      propDefinition: [
        streamlabs,
        "contentUpdates",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.streamlabs.updateOverlay({
      overlayId: this.overlayId,
      contentUpdates: this.contentUpdates,
    });
    $.export("$summary", `Updated overlay ${this.overlayId} successfully`);
    return response;
  },
};
