import telnyxApp from "../../telnyx.app.mjs";

export default {
  key: "telnyx-get-messaging-profiles",
  name: "Get Messaging Profiles",
  description: "Get a list of messaging profiles. See documentation [here](https://developers.telnyx.com/api/messaging/list-messaging-profiles)",
  version: "1.0.0",
  type: "action",
  props: {
    telnyxApp,
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The size of the page. Default value is `20`.",
      optional: true,
      min: 1,
      max: 250,
    },
    pageNumber: {
      type: "integer",
      label: "Page Number",
      description: "The page number to load. Default value is `1`.",
      optional: true,
      min: 1,
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "Filter by name.",
      optional: true,
    },
  },
  async run({ $ }) {
    const profiles = await this.telnyxApp.getMessagingProfiles({
      $,
      params: {
        'page[size]': this.pageSize || 20,
        'page[number]': this.pageNumber || 1,
        filter: this.filter,
      },
    });
    $.export("$summary", `Successfully retrieved ${profiles.data.length} messaging profile${profiles.data.length === 1
        ? ""
        : "s"}.`);
    return profiles;
  },
};
