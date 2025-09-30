import { parseObject } from "../../common/utils.mjs";
import pingback from "../../pingback.app.mjs";

export default {
  name: "Add Subscriber To Segmentation Lists",
  description: "Add a subscriber to segmentation lists by email [See the documentation](https://developer.pingback.com/docs/api/add-subscriber-to-segment)",
  key: "pingback-add-subscriber-to-segmentation-lists",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    segmentationLists: {
      propDefinition: [
        pingback,
        "segmentationLists",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pingback.addSubscriberToSegmentationLists({
      $,
      email: this.email,
      data: {
        segmentationLists: parseObject(this.segmentationLists),
      },
    });

    $.export("$summary", `Subscriber ${this.email} added to segmentation list(s) successfully`);
    return response;
  },
};
