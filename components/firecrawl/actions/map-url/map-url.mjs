import firecrawl from "../../firecrawl.app.mjs";

export default {
  key: "firecrawl-map-url",
  name: "Map URL",
  description: "Maps a given URL using Firecrawl's Map endpoint. Optionally, you can provide a search term to filter the mapping. [See the documentation](https://docs.firecrawl.dev/features/map)",
  version: "0.0.2",
  type: "action",
  props: {
    firecrawl,
    url: {
      propDefinition: [
        firecrawl,
        "url",
      ],
      description: "The URL to map using Firecrawl.",
    },
    search: {
      type: "string",
      label: "Search",
      description: "Optional search term to filter the mapping results. [See the documentation](https://docs.firecrawl.dev/features/map).",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      firecrawl, search, ...data
    } = this;

    // Including search parameter in payload only when its not empty
    if (search && search.trim() !== "") {
      data.search = search.trim();
    }

    const response = await firecrawl._makeRequest({
      $,
      path: "/map",
      method: "POST",
      data,
    });

    console.log("Firecrawl Response:", response);

    if ($ && typeof $.export === "function") {
      $.export("$summary", `Mapped URL: ${this.url}`);
    }
    return response;
  },
};
