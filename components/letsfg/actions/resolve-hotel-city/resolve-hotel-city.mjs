import app from "../../letsfg.app.mjs";

export default {
  key: "letsfg-resolve-hotel-city",
  name: "Resolve Hotel City",
  description: "Resolve a place name to the supplier city id that Search Hotels needs. [See the documentation](https://letsfg.co/developers/docs/hotels/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    text: {
      propDefinition: [
        app,
        "hotelText",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.resolveHotelCity({
      $,
      data: {
        text: this.text,
      },
    });

    const results = response?.results ?? [];
    $.export("$summary", results.length
      ? `Resolved \`${this.text}\` to ${results[0].Name} (id ${results[0].Id})`
      : `No hotel destination matched \`${this.text}\``);

    return response;
  },
};
