import wubook from "../../wubook_ratechecker.app.mjs";

export default {
  key: "wubook_ratechecker-get-monitored-competitors",
  name: "Get Monitored Competitors",
  description: "Retrieve a list of montiored competitors. [See the docs](https://wubook.net/wrpeeker/ratechecker/api_examples)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    wubook,
  },
  async run({ $ }) {
    const response = await this.wubook.getMonitoredCompetitors({
      $,
      params: {
        user_id: "auto",
      },
    });

    $.export("$summary", `Successfully retrieved ${response.length} competitor(s).`);

    return response;
  },
};
