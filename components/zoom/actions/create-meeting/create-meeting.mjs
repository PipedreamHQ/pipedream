import zoom from "../../zoom.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  name: "Create a meeting",
  description: "Create a new room in zoom",
  key: "zoom-action-create-a-meeting",
  version: "0.0.6",
  type: "action",
  props: {
    zoom,
    name: {
      propDefinition: [
        zoom,
        "zoomRoomName",
      ],
    },
    type: {
      propDefinition: [
        zoom,
        "zoomRoomType",
      ],
    },
    locationId: {
      propDefinition: [
        zoom,
        "locationId",
      ],
    },
  },
  async run ({ $ }) {
    const res = await axios($, this.zoom._getAxiosParams({
      path: "/rooms",
      data: {
        name: this.name,
        type: this.type,
        location_id: this.locationId,
      },
    }));

    return res;
  },
};
