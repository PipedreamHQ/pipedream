import oxylabs from "../../oxylabs.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "oxylabs-create-schedule",
  name: "Create Schedule",
  description: "Create a schedule for a scraping job. [See the documentation](https://developers.oxylabs.io/scraping-solutions/web-scraper-api/features/scheduler#create-a-new-schedule)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    oxylabs,
    chron: {
      type: "string",
      label: "Cron Expression",
      description: "Cron schedule expression. It determines how often the submitted schedule will run. E.g. `0 3 * * 1`. Read more [here](https://crontab.guru/) and [here](https://docs.oracle.com/cd/E12058_01/doc/doc.1014/e12030/cron_expressions.htm).",
    },
    items: {
      type: "string[]",
      label: "Items",
      description: "List of Scraper APIs job parameter sets that should be executed as part of the schedule. E.g. `[{\"source\": \"universal\", \"url\": \"https://ip.oxylabs.io\"}]` [See the documentation](https://developers.oxylabs.io/scraping-solutions/web-scraper-api/features/scheduler#create-a-new-schedule) for more information.",
      propDefinition: [
        oxylabs,
        "items",
      ],
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The time at which the schedule should stop running. E.g. `2032-12-21 12:34:45`",
    },
  },
  async run({ $ }) {
    const response = await this.oxylabs.createSchedule({
      $,
      data: {
        cron: this.chron,
        items: parseObject(this.items),
        end_time: this.endTime,
      },
    });
    $.export("$summary", `Successfully created schedule: ${response.schedule_id}`);
    return response;
  },
};
