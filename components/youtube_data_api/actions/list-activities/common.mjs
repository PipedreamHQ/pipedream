import consts from "../../common/consts.mjs";

export default {
  async run({ $ }) {
    const {
      channelId,
      regionCode,
      maxResults,
      publishedBefore,
      publishedAfter,
    } = this;
    const part = consts.LIST_ACTIVITIES_PART;
    const mine = this.useCase === "mine" ?
      true :
      undefined;
    const activities = (await this.youtubeDataApi.listActivities({
      channelId,
      mine,
      part,
      regionCode,
      maxResults,
      publishedBefore,
      publishedAfter,
    })).data;
    $.export("$summary", `Successfully fetched ${activities.items.length} ${activities.items.length === 1
      ? "activity"
      : "activities"}`);
    return activities;
  },
};
