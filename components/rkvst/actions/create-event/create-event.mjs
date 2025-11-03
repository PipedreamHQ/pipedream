import { parseObject } from "../../common/utils.mjs";
import rkvst from "../../rkvst.app.mjs";

export default {
  key: "rkvst-create-event",
  name: "Create Event",
  description: "Create a new event based on an asset. [See the documentation](https://docs.datatrails.ai/developers/api-reference/events-api/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rkvst,
    assetId: {
      propDefinition: [
        rkvst,
        "assetId",
      ],
    },
    eventData: {
      type: "string",
      label: "Event Data",
      description: "The JSON data of the event",
    },
  },
  async run({ $ }) {
    const response = await this.rkvst.createEvent({
      $,
      assetId: this.assetId,
      data: this.eventData && parseObject(this.eventData),
    });
    $.export("$summary", `Successfully created new event with ID ${response.identity.split("/")[3]}`);
    return response;
  },
};
