import scrapeless from "../../scrapeless.app.mjs";

export default {
  key: "scrapeless-scraping-api",
  name: "Scraping API",
  description: "Endpoints for fresh, structured data from 100+ popular sites.",
  version: "0.0.1",
  type: "action",
  props: {
    scrapeless,
    apiServer: {
      type: "string",
      label: "Please select a API server",
      default: "googleSearch",
      description: "Please select a API server to use",
      options: [
        {
          label: "Google Search",
          value: "googleSearch",
        },
      ],
      reloadProps: true,
    },
  },
  async run({ $ }) {
    const {
      scrapeless, apiServer, ...inputProps
    } = this;

    if (apiServer === "googleSearch") {
      const submitData = {
        actor: "scraper.google.search",
        input: {
          q: inputProps.q,
          hl: inputProps.hl,
          gl: inputProps.gl,
        },
      };
      const response = await scrapeless.scrapingApi({
        $,
        submitData,
        ...inputProps,
      });

      $.export("$summary", "Successfully retrieved scraping results for Google Search");
      return response;
    }
  },
  async additionalProps() {
    const { apiServer } = this;

    const props = {};

    if (apiServer === "googleSearch") {
      props.q = {
        type: "string",
        label: "Search Query",
        description: "Parameter defines the query you want to search. You can use anything that you would use in a regular Google search. e.g. inurl:, site:, intitle:. We also support advanced search query parameters such as as_dt and as_eq.",
        default: "coffee",
      };

      props.hl = {
        type: "string",
        label: "Language",
        description: "Parameter defines the language to use for the Google search. It's a two-letter language code. (e.g., en for English, es for Spanish, or fr for French).",
        default: "en",
      };

      props.gl = {
        type: "string",
        label: "Country",
        description: "Parameter defines the country to use for the Google search. It's a two-letter country code. (e.g., us for the United States, uk for United Kingdom, or fr for France).",
        default: "us",
      };
    }

    return props;
  },
};
