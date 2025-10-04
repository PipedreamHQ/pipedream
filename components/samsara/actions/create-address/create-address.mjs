import { ConfigurationError } from "@pipedream/platform";
import {
  cleanObject,
  parseObject,
} from "../../common/utils.mjs";
import samsara from "../../samsara.app.mjs";

export default {
  key: "samsara-create-address",
  name: "Create Address",
  description: "Adds a new address to the organization. The user must provide the necessary props such as formatted address, geofence, and name. [See the documentation](https://developers.samsara.com/reference/createaddress)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    samsara,
    addressTypes: {
      type: "string[]",
      label: "Address Types",
      description: "Reporting location type associated with the address (used for ELD reporting purposes).",
      options: [
        "yard",
        "shortHaul",
        "workforceSite",
        "riskZone",
        "industrialSite",
        "alertsOnly",
      ],
      optional: true,
    },
    contactIds: {
      propDefinition: [
        samsara,
        "contactIds",
      ],
      optional: true,
    },
    externalIds: {
      propDefinition: [
        samsara,
        "externalIds",
      ],
      optional: true,
    },
    formattedAddress: {
      type: "string",
      label: "Formatted Address",
      description: "The full street address for this address/geofence, as it might be recognized by Google Maps.",
    },
    geofence: {
      type: "object",
      label: "Geofence",
      description: "The geofence that defines this address and its bounds. This can either be a circle or a polygon, but not both. [See the documentation](https://developers.samsara.com/reference/createaddress)",
    },
    latitude: {
      type: "string",
      label: "Latitude",
      description: "Latitude of the address. Will be geocoded from **Formatted Address** if not provided.",
      optional: true,
    },
    longitude: {
      type: "string",
      label: "Longitude",
      description: "Longitude of the address. Will be geocoded from **Formatted Address** if not provided.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the address.",
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes about the address.",
    },
    tagIds: {
      propDefinition: [
        samsara,
        "tagIds",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.samsara.createAddress({
        $,
        data: cleanObject({
          addressTypes: parseObject(this.addressTypes),
          contactIds: parseObject(this.contactIds),
          externalIds: parseObject(this.externalIds),
          formattedAddress: this.formattedAddress,
          geofence: parseObject(this.geofence),
          latitude: this.latitude,
          longitude: this.longitude,
          name: this.name,
          notes: this.notes,
          tagIds: parseObject(this.tagIds),
        }),
      });

      $.export("$summary", `Successfully created address with name Id: ${response.data?.id}`);
      return response;

    } catch (error) {
      throw new ConfigurationError(JSON.parse(error.message).message);
    }
  },
};
