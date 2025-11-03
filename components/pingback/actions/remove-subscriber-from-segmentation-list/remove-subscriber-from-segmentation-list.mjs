import pingback from "../../pingback.app.mjs";

export default {
  name: "Remove Subscriber From Segmentation List",
  description: "Remove a subscriber from a segmentation list by email [See the documentation](https://developer.pingback.com/docs/api/remove-subscriber-from-segment)",
  key: "pingback-remove-subscriber-from-segmentation-list",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
        "segmentationLists",
      ],
      type: "string[]",
      label: "Segmentation Lists",
      description: "Segmentation list ID to remove the subscriber from. You can get the ID by clicking audience and lists at Pingback dashboard.",
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
};
