import app from "../../leadzen_ai.app.mjs";

export default {
  key: "leadzen_ai-unlock-email-details",
  name: "Unlock Email Details",
  description: "Fetches the work email of a LinkedIn profile based on the specified URL. [See the documentation](https://api.leadzen.ai/docs#/People/people_search_work_email_api_people_linkedin_url_work_email_post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
  },
  methods: {
    unlockEmailDetails(args = {}) {
      return this.app.post({
        path: "/people/linkedin_url/work_email",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      app,
      unlockEmailDetails,
      url,
    } = this;

    const { id: searchId } = await unlockEmailDetails({
      $,
      data: {
        url,
      },
    });

    const response = await app.retry({
      $,
      fn: app.getWorkEmail,
      delay: 5000,
      searchId,
    });

    if (response?.status === "failed") {
      $.export("$summary", "Failed to unlock details for email");
      return response;
    }

    $.export("$summary", `Successfully unlocked details for email with ID \`${response?.search_result?.id}\``);
    return response;
  },
};
