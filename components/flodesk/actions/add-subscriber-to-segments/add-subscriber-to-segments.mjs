import flodesk from "../../flodesk.app.mjs";

export default {
  key: "flodesk-add-subscriber-to-segments",
  name: "Add Subscriber To Segments",
  description: "Add a subscriber to one or more segments in Flodesk. [See the documentation](https://developers.flodesk.com/#tag/subscriber/operation/addSubscriberToSegments)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    flodesk,
    subscriberId: {
      propDefinition: [
        flodesk,
        "subscriberId",
      ],
    },
    segmentIds: {
      propDefinition: [
        flodesk,
        "segmentIds",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.flodesk.addSubscriberToSegment({
      subscriberId: this.subscriberId,
      data: {
        segment_ids: this.segmentIds,
      },
      $,
    });

    if (response?.id) {
      $.export("$summary", "Successfully added subscriber to segment(s).");
    }

    return response;
  },
};
