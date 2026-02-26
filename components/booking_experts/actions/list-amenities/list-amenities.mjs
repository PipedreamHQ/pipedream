import bookingExperts from "../../booking_experts.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "booking_experts-list-amenities",
  name: "List Amenities",
  description: "List amenities from BookingExperts. [See the documentation](https://developers.bookingexperts.com/reference/amenities-index)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    bookingExperts,
    page: {
      propDefinition: [
        bookingExperts,
        "page",
      ],
    },
    perPage: {
      propDefinition: [
        bookingExperts,
        "perPage",
      ],
    },
    sort: {
      propDefinition: [
        bookingExperts,
        "sort",
      ],
    },
    fields: {
      propDefinition: [
        bookingExperts,
        "fields",
      ],
    },
    include: {
      propDefinition: [
        bookingExperts,
        "include",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Filter by name",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Filter by type",
      optional: true,
    },
    position: {
      type: "string",
      label: "Position",
      description: "Filter by position",
      optional: true,
    },
    semanticAmenityType: {
      type: "string",
      label: "Semantic Amenity Type",
      description: "Filter by semantic amenity type",
      optional: true,
    },
    amenityGroup: {
      propDefinition: [
        bookingExperts,
        "amenityGroupId",
      ],
      optional: true,
    },
    amenityOptions: {
      type: "string",
      label: "Amenity Options",
      description: "Filter on amenity_options. Specify a comma separated list of IDs to filter on.",
      optional: true,
    },
    filters: {
      type: "object",
      label: "Filters",
      description: "Additional query params to filter amenities. Example: `filter[name]=Wifi`. If a key overlaps with an explicit filter prop, the value provided here will override it.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      "page[number]": this.page,
      "page[size]": this.perPage,
      "sort": this.sort,
      "fields[amenity]": this.fields,
      "include": this.include,
      "filter[name]": this.name,
      "filter[type]": this.type,
      "filter[position]": this.position,
      "filter[semantic_amenity_type]": this.semanticAmenityType,
      "filter[amenity_group]": this.amenityGroup,
      "filter[amenity_options]": this.amenityOptions,
      ...(parseObject(this.filters) || {}),
    };

    const response = await this.bookingExperts.listAmenities({
      $,
      params,
    });

    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} amenities`);

    return response;
  },
};
