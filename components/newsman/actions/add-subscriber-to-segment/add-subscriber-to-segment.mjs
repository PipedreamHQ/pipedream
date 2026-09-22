import newsman from "../../newsman.app.mjs";

export default {
  key: "newsman-add-subscriber-to-segment",
  name: "Add Subscriber To Segment",
  description: "Add a subscriber to a segment in Newsman. [See the documentation](https://kb.newsman.com/api/1.2/subscriber.addToSegment)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    newsman,
    listId: {
      propDefinition: [
        newsman,
        "listId",
      ],
    },
    subscriberId: {
      propDefinition: [
        newsman,
        "subscriberId",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
    segmentId: {
      propDefinition: [
        newsman,
        "segmentId",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.newsman.addSubscriberToSegment({
      $,
      data: {
        subscriber_id: this.subscriberId,
        segment_id: this.segmentId,
      },
    });
    if (response === true) {
      $.export("$summary", `Subscriber ${this.subscriberId} added to segment ${this.segmentId} successfully.`);
    }
    return response;
  },
};
