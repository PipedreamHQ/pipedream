import scrapeless from "../../scrapeless.app.mjs";
import { countryOptions } from "../../common/constants.mjs";

export default {
  key: "scrapeless-universal-scraping-api",
  name: "Universal Scraping API",
  description: "Access any website at scale and say goodbye to blocks.",
  version: "0.0.1",
  type: "action",
  props: {
    scrapeless,
    apiServer: {
      type: "string",
      label: "Please select a API server",
      default: "webUnlocker",
      description: "Please select a API server to use",
      options: [
        {
          label: "Web Unlocker",
          value: "webUnlocker",
        },
      ],
      reloadProps: true,
    },
  },
  async run({ $ }) {
    const {
      apiServer, ...rest
    } = this;

    if (apiServer === "webUnlocker") {
      const submitData = {
        actor: "unlocker.webunlocker",
        country: rest.country,
        url: rest.url,
        jsRender: rest.jsRender,
        headless: rest.headless,
      };
      const response = await this.scrapeless.universalScrapingApi({
        $,
        submitData,
        ...rest,
      });

      $.export("$summary", "Successfully retrieved scraping results for Web Unlocker");
      return response;
    }
  },
  async additionalProps() {
    const { apiServer } = this;

    const props = {};

    if (apiServer === "webUnlocker") {
      props.url = {
        type: "string",
        label: "Target URL",
        description: "Parameter defines the URL you want to scrape.",
      };

      props.jsRender = {
        type: "boolean",
        label: "Js Render",
        default: true,
      };

      props.headless = {
        type: "boolean",
        label: "Headless",
        default: true,
      };

      props.country = {
        type: "string",
        label: "Country",
        default: "ANY",
        options: countryOptions.map((country) => ({
          label: country.label,
          value: country.value,
        })),
      };
    }

    return props;
  },
};
