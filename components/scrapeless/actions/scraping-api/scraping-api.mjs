import scrapeless from "../../scrapeless.app.mjs";
import { log } from "../../common/utils.mjs";
import {
  GOOGLE_DOMAIN_OPTIONS, GOOGLE_SEARCH_LR_OPTIONS,
  GOOGLE_SEARCH_TBM_OPTIONS,
  GOOGLE_TRENDS_DATA_TYPE_OPTIONS,
  GOOGLE_TRENDS_GEO_OPTIONS,
  GOOGLE_TRENDS_CATEGORY_OPTIONS,
  GOOGLE_TRENDS_PROPERTY_OPTIONS,
} from "../../common/constants.mjs";

export default {
  key: "scrapeless-scraping-api",
  name: "Scraping API",
  description: "Endpoints for fresh, structured data from 100+ popular sites. [See the documentation](https://apidocs.scrapeless.com/api-12919045).",
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
      default: "googleSearch",
      description: "Please select a API server to use",
      options: [
        {
          label: "Google Search",
          value: "googleSearch",
        },
        {
          label: "Google Trends",
          value: "googleTrends",
        },
      ],
      reloadProps: true,
    },
  },
  additionalProps() {
    const { apiServer } = this;

    const props = {};

    if (apiServer === "googleSearch") {
      props.g_search_query = {
        type: "string",
        label: "Search Query",
        description: "Parameter defines the query you want to search. You can use anything that you would use in a regular Google search. e.g. inurl:, site:, intitle:. We also support advanced search query parameters such as as_dt and as_eq.",
        default: "coffee",
      };

      props.g_search_language = {
        type: "string",
        label: "Language",
        description: "Parameter defines the language to use for the Google search. It's a two-letter language code. (e.g., en for English, es for Spanish, or fr for French).",
        default: "en",
      };

      props.g_search_country = {
        type: "string",
        label: "Country",
        description: "Parameter defines the country to use for the Google search. It's a two-letter country code. (e.g., us for the United States, uk for United Kingdom, or fr for France).",
        default: "us",
      };

      props.g_search_google_domain = {
        type: "string",
        label: "Domain",
        description: "Parameter defines the Google domain to use. It defaults to 'google.com'.",
        default: "google.com",
        options: GOOGLE_DOMAIN_OPTIONS.map((domain) => ({
          label: domain.label,
          value: domain.value,
        })),
        optional: true,
      };

      props.g_search_location = {
        type: "string",
        label: "Location",
        default: "",
        description: "Parameter defines from where you want the search to originate. If several locations match the location requested, we'll pick the most popular one. The location and uule parameters can't be used together. It is recommended to specify location at the city level in order to simulate a real user’s search. If location is omitted, the search may take on the location of the proxy.",
        optional: true,
      };

      props.g_search_start = {
        type: "integer",
        label: "Result Offset",
        description: "Parameter defines the result offset. It skips the given number of results. It's used for pagination. (e.g., `0` (default) is the first page of results, `10` is the 2nd page of results, `20` is the 3rd page of results, etc.).",
        default: 0,
        optional: true,
      };

      props.g_search_num = {
        type: "integer",
        label: "Number of Results",
        description: "Parameter defines the maximum number of results to return. (e.g., `10` (default) returns 10 results, `40` returns 40 results, and `100` returns 100 results).",
        default: 10,
        optional: true,
      };

      props.g_search_ludocid = {
        type: "string",
        label: "Google Place ID",
        description: "Parameter defines the id (`CID`) of the Google My Business listing you want to scrape. Also known as Google Place ID.",
        default: "",
        optional: true,
      };

      props.g_search_kgmid = {
        type: "string",
        label: "Google Knowledge Graph ID",
        description: "Parameter defines the id (`KGMID`) of the Google Knowledge Graph listing you want to scrape. Also known as Google Knowledge Graph ID. Searches with `kgmid` parameter will return results for the originally encrypted search parameters. For some searches, `kgmid` may override all other parameters except `start`, and `num` parameters.",
        default: "",
        optional: true,
      };

      props.g_search_ibp = {
        type: "string",
        label: "Google Element Rendering",
        default: "",
        description: "Parameter is responsible for rendering layouts and expansions for some elements (e.g., `gwp;0,7` to expand searches with `ludocid` for expanded knowledge graph).",
        optional: true,
      };

      props.g_search_cr = {
        type: "string",
        label: "Set Multiple Countries",
        default: "",
        description: "Parameter defines one or multiple countries to limit the search to. It uses country{two-letter upper-case country code} to specify countries and | as a delimiter. (e.g., countryFR|countryDE will only search French and German pages).",
        optional: true,
      };

      props.g_search_lr = {
        type: "string",
        label: "Set Multiple Languages",
        default: "",
        description: "Parameter defines one or multiple languages to limit the search to. It uses lang_{two-letter language code} to specify languages and | as a delimiter. (e.g., lang_fr|lang_de will only search French and German pages).",
        optional: true,
        options: GOOGLE_SEARCH_LR_OPTIONS.map((language) => ({
          label: language.label,
          value: language.value,
        })),
      };

      props.g_search_tbs = {
        type: "string",
        label: "Time Range",
        default: "",
        description: "(to be searched) parameter defines advanced search parameters that aren't possible in the regular query field. (e.g., advanced search for patents, dates, news, videos, images, apps, or text contents).",
        optional: true,
      };

      props.g_search_safe = {
        type: "string",
        label: "Safe Search",
        default: "",
        description: "Parameter defines the level of filtering for adult content. It can be set to `active` or `off`, by default Google will blur explicit content.",
        optional: true,
      };

      props.g_search_nfpr = {
        label: "Exclude Auto-corrected Results",
        type: "string",
        default: "",
        description: "Parameter defines whether to exclude auto-corrected results. It can be set to `true` or `false`, by default Google will include auto-corrected results.",
        optional: true,
      };

      props.g_search_filter = {
        label: "Results Filtering",
        type: "string",
        default: "",
        description: "Parameter defines if the filters for 'Similar Results' and 'Omitted Results' are on or off. It can be set to 1 (default) to enable these filters, or 0 to disable these filters.",
        optional: true,
      };

      props.g_search_tbm = {
        label: "Search Type",
        type: "string",
        default: "",
        description: "(to be matched) parameter defines the type of search you want to do.\n\nIt can be set to:\n`(no tbm parameter)`: `regular Google Search`,\n`isch`: `Google Images API`,\n`lcl` - `Google Local API`\n`vid`: `Google Videos API`,\n`nws`: `Google News API`,\n`shop`: `Google Shopping API`,\n`pts`: `Google Patents API`,\nor any other Google service.",
        optional: true,
        options: GOOGLE_SEARCH_TBM_OPTIONS.map((tbm) => ({
          label: tbm.label,
          value: tbm.value,
        })),
      };
    } else if (apiServer === "googleTrends") {
      props.g_trends_query = {
        type: "string",
        label: "Search Query",
        description: "Parameter defines the query or queries you want to search. You can use anything that you would use in a regular Google Trends search. The maximum number of queries per search is 5 (this only applies to `interest_over_time` and `compared_breakdown_by_region` data_type, other types of data will only accept 1 query per search).",
        default: "Mercedes-Benz,BMW X5",
      };

      props.g_trends_data_type = {
        type: "string",
        label: "Data Type",
        description: "The supported types are: `autocomplete`,`interest_over_time`,`compared_breakdown_by_region`,`interest_by_subregion`,`related_queries`,`related_topics`.",
        default: "interest_over_time",
        options: GOOGLE_TRENDS_DATA_TYPE_OPTIONS.map((dataType) => ({
          label: dataType.label,
          value: dataType.value,
        })),
      };

      props.g_trends_date = {
        type: "string",
        label: "Date",
        description: "The supported dates are: `now 1-H`, `now 4-H`, `now 1-d`, `now 7-d`, `today 1-m`, `today 3-m`, `today 12-m`, `today 5-y`, `all`. You can also pass custom values: Dates from 2004 to present: `yyyy-mm-dd yyyy-mm-dd` (e.g. `2021-10-15 2022-05-25`). Dates with hours within a week range: `yyyy-mm-ddThh yyyy-mm-ddThh` (e.g. `2022-05-19T10 2022-05-24T22`). Hours will be calculated depending on the tz (time zone) parameter.",
        default: "today 1-m",
        optional: true,
      };

      props.g_trends_language = {
        type: "string",
        label: "Language",
        description: "Parameter defines the language to use for the Google Trends search. It's a two-letter language code. (e.g., `en` for English, `es` for Spanish, or `fr` for French).",
        default: "en",
        optional: true,
      };

      props.g_trends_time_zone = {
        type: "string",
        label: "Time zone",
        description: "Time zone offset. default is `420`.",
        default: "420",
        optional: true,
      };

      props.g_trends_geo = {
        type: "string",
        label: "Location",
        description: "Parameter defines the location from where you want the search to originate. It defaults to Worldwide (activated when the value of geo parameter is not set or empty).",
        default: "",
        optional: true,
        options: GOOGLE_TRENDS_GEO_OPTIONS.map((geo) => ({
          label: geo.label,
          value: geo.value,
        })),
      };

      props.g_trends_category = {
        type: "string",
        label: "Category",
        description: "Parameter is used to define a search category. The default value is set to `0` (\"All categories\").",
        default: "",
        optional: true,
        options: GOOGLE_TRENDS_CATEGORY_OPTIONS.map((category) => ({
          label: category.label,
          value: category.value,
        })),
      };

      props.g_trends_property = {
        type: "string",
        label: "Property",
        description: "Parameter is used for sorting results by property. The default property is set to `Web Search` (activated when the value of property parameter is not set or empty). Other available options: `images` - Image Search `news` - News Search `froogle` - Google Shopping `youtube` - YouTube Search",
        default: "",
        optional: true,
        options: GOOGLE_TRENDS_PROPERTY_OPTIONS.map((property) => ({
          label: property.label,
          value: property.value,
        })),
      };
    }

    return props;
  },
  async run({ $ }) {
    const {
      scrapeless, apiServer, ...inputProps
    } = this;

    const MAX_RETRIES = 3;
    // 10 seconds
    const DELAY = 1000 * 10;
    const { run } = $.context;

    let submitData;
    let job;
    const client = await scrapeless._scrapelessClient();

    // pre check if the job is already in the context
    if (run?.context?.job) {
      job = run.context.job;
    }

    if (apiServer === "googleSearch") {
      submitData = {
        actor: "scraper.google.search",
        input: {
          q: inputProps.g_search_query,
          hl: inputProps.g_search_language,
          gl: inputProps.g_search_country,
          google_domain: inputProps.g_search_google_domain,
          location: inputProps.g_search_location,
          start: inputProps.g_search_start,
          num: inputProps.g_search_num,
          ludocid: inputProps.g_search_ludocid,
          kgmid: inputProps.g_search_kgmid,
          ibp: inputProps.g_search_ibp,
          cr: inputProps.g_search_cr,
          lr: inputProps.g_search_lr,
          tbs: inputProps.g_search_tbs,
          safe: inputProps.g_search_safe,
          nfpr: inputProps.g_search_nfpr,
          filter: inputProps.g_search_filter,
          tbm: inputProps.g_search_tbm,
        },
      };
    } else if (apiServer === "googleTrends") {
      submitData = {
        actor: "scraper.google.trends",
        input: {
          q: inputProps.g_trends_query,
          data_type: inputProps.g_trends_data_type,
          date: inputProps.g_trends_date,
          hl: inputProps.g_trends_language,
          tz: inputProps.g_trends_time_zone,
          geo: inputProps.g_trends_geo,
          cat: inputProps.g_trends_category,
          property: inputProps.g_trends_property,
        },
      };
    }

    log("submitData", submitData, "apiServer", apiServer, "inputProps", inputProps);

    if (!submitData) {
      throw new Error("No actor found");
    }
    // 1. Create a new scraping job
    if (!job) {
      job = await client.deepserp.createTask({
        actor: submitData.actor,
        input: submitData.input,
      });

      if (job.status === 200) {
        $.export("$summary", "Successfully retrieved scraping results");
        return job.data;
      }

      log("task in progress");
    }

    // 2. Wait for the job to complete
    if (run.runs === 1) {
      $.flow.rerun(DELAY, {
        job,
      }, MAX_RETRIES);
    } else if (run.runs > MAX_RETRIES ) {
      throw new Error("Max retries reached");
    } else if (job && job?.data?.taskId) {
      const result = await client.deepserp.getTaskResult(job.data.taskId);
      if (result.status === 200) {
        $.export("$summary", "Successfully retrieved scraping results");
        return result.data;
      } else {
        $.flow.rerun(DELAY, {
          job,
        }, MAX_RETRIES);
      }
    } else {
      throw new Error("No job found");
    }
  },

};
