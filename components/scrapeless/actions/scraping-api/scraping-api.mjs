import scrapeless from "../../scrapeless.app.mjs";
import { log } from "../../common/utils.mjs";
export default {
  key: "scrapeless-scraping-api",
  name: "Scraping API",
  description: "Endpoints for fresh, structured data from 100+ popular sites. [See the documentation](https://apidocs.scrapeless.com/api-12919045).",
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

    const MAX_RETRIES = 3;
    // 10 seconds
    const DELAY = 1000 * 10;
    const { run } = $.context;

    let submitData;
    let job;

    // pre check if the job is already in the context
    if (run?.context?.job) {
      job = run.context.job;
    }

    if (apiServer === "googleSearch") {
      submitData = {
        actor: "scraper.google.search",
        input: {
          q: inputProps.q,
          hl: inputProps.hl,
          gl: inputProps.gl,
        },
      };
    }

    if (!submitData) {
      throw new Error("No actor found");
    }
    // 1. Create a new scraping job
    if (!job) {
      job = await scrapeless._scrapelessClient().deepserp.createTask({
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
      const result = await scrapeless._scrapelessClient().deepserp.getTaskResult(job.data.taskId);
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
