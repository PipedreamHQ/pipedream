import dhlParcel from "../../dhl_parcel.app.mjs";

export default {
  key: "dhl-parcel-track-and-trace-parcel",
  name: "Track and Trace Parcel",
  description: "Get track and trace information for a parcel. [See the documentation](https://api-gw.dhlparcel.nl/docs/guide/chapters/05-track-and-trace.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dhlParcel,
    key: {
      type: "string",
      label: "Key (Tracker Code)",
      description: "The tracker code returned when creating the label. Example: `3SPET9596258883`",
    },
  },
  async run({ $ }) {
    const response = await this.dhlParcel.trackAndTrace({
      $,
      params: {
        key: this.key,
      },
    });
    $.export("$summary", `Successfully fetched track and trace information for ${this.key}`);
    return response;
  },
};
