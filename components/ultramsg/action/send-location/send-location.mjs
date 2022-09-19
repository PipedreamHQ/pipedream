import ultramsg from "../../ultramsg.app.mjs";

export default {
  name: "Send a Location",
  description: "Send a location to a specified number. [See the docs here](https://docs.ultramsg.com/api/post/messages/location)",
  key: "ultramsg-send-location",
  version: "0.0.1",
  type: "action",
  props: {
    ultramsg,
    to: {
      propDefinition: [
        ultramsg,
        "to",
      ],
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of your location. It will be used as a label",
    },
    lat: {
      type: "string",
      label: "Lat",
      description: "The latitude of your location. (e.g., `25.197197`)",
    },
    lng: {
      type: "string",
      label: "Lng",
      description: "The longitude of your location. (e.g., `55.2721877`)",
    },
  },
  async run({ $ }) {
    const {
      to,
      address,
      lat,
      lng,
    } = this;

    const data = {
      to,
      address,
      lat,
      lng,
    };
    const res = await this.ultramsg.sendLocation(data, $);
    $.export("$summary", `Location successfully sent to "${to}"`);

    return res;
  },
};
