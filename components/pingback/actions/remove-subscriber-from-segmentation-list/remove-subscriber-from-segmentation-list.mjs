import { defineAction } from "@pipedream/types";
import pingback from "../../pingback.app.mjs";

export default defineAction({
  name: "Remove Subscriber From Segmentation List",
  description: "Remove a subscriber from a segmentation list by email [See the documentation](https://developer.pingback.com/docs/api/remove-subscriber-from-segment)",
  key: "pingback-remove-subscriber-from-segmentation-list",
  version: "0.0.1",
  type: "action",
  props: {
    pingback,
    email: {
      propDefinition: [
        pingback,
        "email",
      ],
    },
    segmentationListId: {
      propDefinition: [
        pingback,
        "segmentationListId",
      ],
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.pingback.removeSubscriberFromSegmentationList({
      $,
      email: this.email,
      segmentationListId: this.segmentationListId,
    });

    $.export("$summary", `Subscriber ${this.email} removed from segmentation list ${this.segmentationListId} successfully`);
    return response;
  },
});
