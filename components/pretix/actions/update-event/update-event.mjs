import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import pretix from "../../pretix.app.mjs";

export default {
  key: "pretix-update-event",
  name: "Update Event",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Updates a specific event. [See the documentation](https://docs.pretix.eu/en/latest/api/resources/events.html#patch--api-v1-organizers-(organizer)-events-(event)-)",
  type: "action",
  props: {
    pretix,
    organizerSlug: {
      propDefinition: [
        pretix,
        "organizerSlug",
      ],
    },
    eventSlug: {
      propDefinition: [
        pretix,
        "eventSlug",
        ({ organizerSlug }) => ({
          organizerSlug,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The event's full name",
      optional: true,
    },
    live: {
      type: "boolean",
      label: "Live",
      description: "If **true**, the event ticket shop is publicly available.",
      optional: true,
    },
    testmode: {
      type: "boolean",
      label: "Test Mode",
      description: "If **true**, the ticket shop is in test mode.",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The currency this event is handled in.",
      optional: true,
    },
    dateFrom: {
      type: "string",
      label: "Date From",
      description: "The event's start date.",
      optional: true,
    },
    dateTo: {
      type: "string",
      label: "Date To",
      description: "The event's end date.",
      optional: true,
    },
    dateAdmission: {
      type: "string",
      label: "Date Admission",
      description: "The event's admission date.",
      optional: true,
    },
    isPublic: {
      type: "boolean",
      label: "Is Public",
      description: "If **true**, the event shows up in places like the organizer's public list of events",
      optional: true,
    },
    presaleStart: {
      type: "string",
      label: "Presale Start",
      description: "The date at which the ticket shop opens.",
      optional: true,
    },
    presaleEnd: {
      type: "string",
      label: "Presale End",
      description: "The date at which the ticket shop closes.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "The event location.",
      optional: true,
    },
    getLat: {
      type: "string",
      label: "Geo Lat",
      description: "Latitude of the location.",
      optional: true,
    },
    getLon: {
      type: "string",
      label: "Geo Lon",
      description: "Longitude of the location.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "Event timezone name.",
      optional: true,
    },
    itemMetaProperties: {
      type: "object",
      label: "Item Meta Properties",
      description: "Item-specific meta data parameters and default values.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      pretix,
      organizerSlug,
      eventSlug,
      dateFrom,
      dateTo,
      dateAdmission,
      isPublic,
      presaleStart,
      presaleEnd,
      getLat,
      getLon,
      metaData,
      itemMetaProperties,
      ...data
    } = this;

    try {
      const response = await pretix.updateEvent({
        $,
        organizerSlug,
        eventSlug,
        data: {
          date_from: dateFrom,
          date_to: dateTo,
          date_admission: dateAdmission,
          is_public: isPublic,
          presale_start: presaleStart,
          presale_end: presaleEnd,
          geo_lat: getLat,
          geo_lon: getLon,
          meta_data: metaData && parseObject(metaData),
          item_meta_properties: itemMetaProperties && parseObject(itemMetaProperties),
          ...data,
        },
      });

      $.export("$summary", `The event with slug: ${response.slug} was successfully updated!`);
      return response;
    } catch (e) {
      const message = Object.values(e.response.data)[0][0];
      throw new ConfigurationError(message.replace("a href=\"", "a href=\"https://pretix.eu" ));
    }
  },
};
