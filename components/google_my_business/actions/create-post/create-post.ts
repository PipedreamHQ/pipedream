import { defineAction } from "@pipedream/types";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../app/google_my_business.app";
import { CreatePostParams } from "../../common/requestParams";
import {
  LOCAL_POST_ALERT_TYPES, LOCAL_POST_TOPIC_TYPES, MEDIA_FORMAT_OPTIONS,
} from "../../common/constants";

const DOCS_LINK = "https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts/create";

export default defineAction({
  key: "google_my_business-create-post",
  name: "Create Post",
  description: `Create a new local post associated with a location. [See the documentation](${DOCS_LINK})`,
  version: "0.0.4",
  type: "action",
  props: {
    app,
    account: {
      propDefinition: [
        app,
        "account",
      ],
    },
    location: {
      propDefinition: [
        app,
        "location",
        ({ account }: { account: string; }) => ({
          account,
        }),
      ],
    },
    topicType: {
      type: "string",
      label: "Topic Type",
      description: "The [topic type of the local post](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts#LocalPostTopicType), which is used to select different templates to create and render a post.",
      options: LOCAL_POST_TOPIC_TYPES,
    },
    languageCode: {
      type: "string",
      label: "Language Code",
      description: "The language of the local post.",
      optional: true,
    },
    summary: {
      type: "string",
      label: "Summary",
      description: "Description/body of the local post.",
      optional: true,
    },
    callToAction: {
      type: "object",
      label: "Call to Action",
      description: "An action that is performed when the user clicks through the post. [See the documentation for more details](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts#CallToAction).",
      optional: true,
    },
    event: {
      type: "object",
      label: "Event",
      description: "Event information. Required for topic types **EVENT** and **OFFER**. [See the documentation for more details](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts#LocalPostEvent).",
      optional: true,
    },
    media: {
      type: "string[]",
      label: "Media",
      description: "The media associated with the post. Each entry is treated as a `sourceUrl` (a publicly accessible URL where the media item can be retrieved from). If included, **Media Format** must also be specified. [See the documentation for more details](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.media#MediaItem)",
      optional: true,
    },
    mediaFormat: {
      type: "string",
      label: "Media Format",
      description: "The format of the media item(s). [See the documentation for more details](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.media#MediaItem.MediaFormat)",
      optional: true,
      options: MEDIA_FORMAT_OPTIONS,
    },
    alertType: {
      type: "string",
      label: "Alert Type",
      description: "The type of alert the post is created for. [See the documentation for more details](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts#AlertType).",
      optional: true,
      options: LOCAL_POST_ALERT_TYPES,
    },
    offer: {
      type: "object",
      label: "Offer",
      description: "Additional data for offer posts. This should only be set when the topicType is **OFFER**. [See the documentation for more details](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts#LocalPostOffer).",
      optional: true,
    },
  },
  methods: {
    checkAndParseObject(obj: object | string): object {
      try {
        return typeof obj === "string"
          ? JSON.parse(obj)
          : obj;
      } catch (err) {
        throw new ConfigurationError(`**Invalid JSON string** for object prop: "${obj}"
          Error: ${err}`);
      }
    },
  },
  async run({ $ }) {
    const {
      account, location, topicType, languageCode, summary, media, mediaFormat, alertType,
    } = this;

    const params: CreatePostParams = {
      $,
      account,
      location,
      data: {
        topicType,
        languageCode,
        summary,
        callToAction: this.checkAndParseObject(this.callToAction),
        event: this.checkAndParseObject(this.event),
        media: media?.map?.((sourceUrl: string) => ({
          sourceUrl,
          mediaFormat,
        })),
        alertType,
        offer: this.checkAndParseObject(this.offer),
      },
    };

    const response = await this.app.createPost(params);

    $.export("$summary", "Successfully created post");

    return response;
  },
});
