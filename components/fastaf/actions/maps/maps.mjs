import fastaf from "../../fastaf.app.mjs";

export default {
  key: "fastaf-maps",
  name: "Search Maps",
  description: "Search Google Maps or retrieve one place by its place ID. Costs 5 credits. [Documentation](https://fastaf.co/docs/#maps)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fastaf,
    query: {
      propDefinition: [
        fastaf,
        "query",
      ],
      optional: true,
      description: "Maps search text. Required unless **Place ID** is set. A named place may determine the search centre. [Documentation](https://fastaf.co/docs/#maps)",
    },
    placeId: {
      type: "string",
      label: "Place ID",
      description: "Google Maps place identifier for one place. Required unless **Search Query** is set. [Documentation](https://fastaf.co/docs/#maps)",
      optional: true,
    },
    location: {
      type: "string",
      label: "Search Centre",
      description: "Place name, such as `Rome, Italy`, up to 200 characters. Cannot combine with **Coordinates**. [Documentation](https://fastaf.co/docs/#maps)",
      optional: true,
    },
    coordinates: {
      type: "string",
      label: "Coordinates",
      description: "Centre as `@latitude,longitude,zoom`, such as `@41.9028,12.4964,13z`. Cannot combine with **Search Centre**; supply for pagination. [Documentation](https://fastaf.co/docs/#maps)",
      optional: true,
    },
    page: {
      propDefinition: [
        fastaf,
        "page",
      ],
      description: "Maps result offset: 0 first page, 20 second, 40 third, up to 100. Omitted: 0. Requires coordinates for pagination. Each execution requests one page. [Documentation](https://fastaf.co/docs/#maps)",
    },
    country: {
      propDefinition: [
        fastaf,
        "country",
      ],
    },
    language: {
      propDefinition: [
        fastaf,
        "language",
      ],
    },
    domain: {
      propDefinition: [
        fastaf,
        "domain",
      ],
    },
  },
  async run({ $ }) {
    if (!this.query?.trim() && !this.placeId?.trim()) throw new Error("Provide a query or place ID.");
    if (this.location && this.coordinates) throw new Error("Use a search centre or coordinates, not both.");
    const { data } = await this.fastaf.maps({
      $,
      data: {
        query: this.query,
        place_id: this.placeId,
        location: this.location,
        ll: this.coordinates,
        page: this.page,
        country: this.country,
        language: this.language,
        domain: this.domain,
      },
    });
    $.export("$summary", "Successfully retrieved Maps data for the requested search or place.");
    return data;
  },
};
