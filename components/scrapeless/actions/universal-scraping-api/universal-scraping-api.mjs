import scrapeless from "../../scrapeless.app.mjs";
import { COUNTRY_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "scrapeless-universal-scraping-api",
  name: "Universal Scraping API",
  description: "Access any website at scale and say goodbye to blocks. [See the documentation](https://apidocs.scrapeless.com/api-11949854).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
  additionalProps() {
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
        options: COUNTRY_OPTIONS.map((country) => ({
          label: country.label,
          value: country.value,
        })),
      };
    }

    return props;
  },
  async run({ $ }) {
    const {
      scrapeless,
      apiServer, ...inputProps
    } = this;

    const client = await scrapeless._scrapelessClient();

    if (apiServer === "webUnlocker") {
      const response = await client.universal.scrape({
        actor: "unlocker.webunlocker",
        input: {
          url: inputProps.url,
          headless: inputProps.headless,
          js_render: inputProps.jsRender,
        },
        proxy: {
          country: inputProps.country,
        },
      });

      $.export("$summary", "Successfully retrieved scraping results for Web Unlocker");
      return response;
    }
  },

};
