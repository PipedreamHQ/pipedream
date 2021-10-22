import twitter from "../../twitter.app.mjs";

export default {
  key: "twitter-create-tweet",
  name: "Create Tweet",
  description: "Create a new tweet",
  version: "0.0.1",
  type: "action",
  props: {
    twitter,
    status: {
      propDefinition: [
        twitter,
        "status",
      ],
    },
    inReplyToStatusId: {
      propDefinition: [
        twitter,
        "inReplyToStatusId",
      ],
    },
    autoPopulateReplyMetadata: {
      propDefinition: [
        twitter,
        "autoPopulateReplyMetadata",
      ],
    },
    excludeReplyUserIds: {
      propDefinition: [
        twitter,
        "excludeReplyUserIds",
      ],
    },
    attachmentUrl: {
      propDefinition: [
        twitter,
        "attachmentUrl",
      ],
    },
    mediaIds: {
      propDefinition: [
        twitter,
        "mediaIds",
      ],
    },
    possiblySensitive: {
      propDefinition: [
        twitter,
        "possiblySensitive",
      ],
    },
    lat: {
      propDefinition: [
        twitter,
        "lat",
      ],
    },
    long: {
      propDefinition: [
        twitter,
        "long",
      ],
    },
    placeId: {
      propDefinition: [
        twitter,
        "placeId",
      ],
    },
    displayCoordinates: {
      propDefinition: [
        twitter,
        "displayCoordinates",
      ],
    },
    trimUser: {
      propDefinition: [
        twitter,
        "trimUser",
      ],
    },
    enableDmcommands: {
      propDefinition: [
        twitter,
        "enableDmcommands",
      ],
    },
    failDmcommands: {
      propDefinition: [
        twitter,
        "failDmcommands",
      ],
    },
    cardUri: {
      propDefinition: [
        twitter,
        "cardUri",
      ],
    },
  },
  async run() {
    const {
      status,
      inReplyToStatusId,
      autoPopulateReplyMetadata,
      excludeReplyUserIds,
      attachmentUrl,
      mediaIds: this.mediaIds,
      possiblySensitive,
      lat,
      long,
      placeId,
      displayCoordinates,
      trimUser,
      enableDmcommands,
      failDmcommands,
      cardUri,
    } = this;

    const params = {
      status,
      inReplyToStatusId,
      autoPopulateReplyMetadata,
      excludeReplyUserIds,
      attachmentUrl,
      mediaIds,
      possiblySensitive,
      lat,
      long,
      placeId,
      displayCoordinates,
      trimUser: this.trimUser,
      enableDmcommands,
      failDmcommands,
      cardUri,
    };
    Object.keys(params).forEach((k) => params[k] == "" && delete params[k]);
    return await this.twitter.createTweet(params);
  },
};
