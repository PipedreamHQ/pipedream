import buildchatbot from "../../buildchatbot.app.mjs";

export default {
  key: "buildchatbot-scrap-single-site-url",
  name: "Scrap Single Site URL",
  description: "Scrap a single site URL. [See the API documentation](https://documenter.getpostman.com/view/27680478/2s9YR6baAb#6595ce98-a232-415f-abf3-501bc0fb8e3f)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    buildchatbot,
    chatbotId: {
      propDefinition: [
        buildchatbot,
        "chatbotId",
      ],
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL to scrape",
    },
  },
  async run({ $ }) {
    const response = await this.buildchatbot.scrapSingleSiteURL({
      $,
      chatbotId: this.chatbotId,
      params: {
        url: this.url,
      },
    });

    console.log("response: ", response);

    $.export("$summary", `Successfully scraped URL: ${this.url}`);
    return response;
  },
};
