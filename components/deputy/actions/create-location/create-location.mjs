import deputy from "../../deputy.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "deputy-create-location",
  name: "Create Location",
  description: "Creates a new location in Deputy app. [See the documentation](https://developer.deputy.com/deputy-docs/reference)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    deputy,
    locationDetails: {
      propDefinition: [
        deputy,
        "locationDetails",
      ],
    },
    photo: {
      propDefinition: [
        deputy,
        "photo",
      ],
      optional: true,
    },
    notes: {
      propDefinition: [
        deputy,
        "notes",
      ],
      optional: true,
    },
    relatedBusinessUnits: {
      propDefinition: [
        deputy,
        "relatedBusinessUnits",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.deputy.createNewLocation({
      data: {
        locationDetails: this.locationDetails,
        photo: this.photo,
        notes: this.notes,
        relatedBusinessUnits: this.relatedBusinessUnits,
      },
    });
    $.export("$summary", `Successfully created location with ID: ${response.Id}`);
    return response;
  },
};
