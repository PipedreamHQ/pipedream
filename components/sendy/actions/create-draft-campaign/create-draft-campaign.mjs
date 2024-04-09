import sendy from "../../sendy.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sendy-create-draft-campaign",
  name: "Create Draft Campaign",
  description: "Creates a new draft campaign ready to be filled in with details. [See the documentation](https://sendy.co/api)",
  version: "0.0.1",
  type: "action",
  props: {
    sendy,
    fromName: sendy.propDefinitions.fromName,
    fromEmail: sendy.propDefinitions.fromEmail,
    replyTo: sendy.propDefinitions.replyTo,
    title: sendy.propDefinitions.title,
    subject: sendy.propDefinitions.subject,
    htmlText: sendy.propDefinitions.htmlText,
    brandId: sendy.propDefinitions.brandId,
    trackOpens: sendy.propDefinitions.trackOpens,
    trackClicks: sendy.propDefinitions.trackClicks,
    plainText: {
      ...sendy.propDefinitions.plainText,
      optional: true,
    },
    listIds: {
      ...sendy.propDefinitions.listIds,
      optional: true,
    },
    segmentIds: {
      ...sendy.propDefinitions.segmentIds,
      optional: true,
    },
    excludeListIds: {
      ...sendy.propDefinitions.excludeListIds,
      optional: true,
    },
    excludeSegmentIds: {
      ...sendy.propDefinitions.excludeSegmentIds,
      optional: true,
    },
    queryString: {
      ...sendy.propDefinitions.queryString,
      optional: true,
    },
    scheduleDateTime: {
      ...sendy.propDefinitions.scheduleDateTime,
      optional: true,
    },
    scheduleTimezone: {
      ...sendy.propDefinitions.scheduleTimezone,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.sendy.createDraftCampaign({
      fromName: this.fromName,
      fromEmail: this.fromEmail,
      replyTo: this.replyTo,
      title: this.title,
      subject: this.subject,
      htmlText: this.htmlText,
      brandId: this.brandId,
      trackOpens: this.trackOpens,
      trackClicks: this.trackClicks,
      plainText: this.plainText,
      listIds: this.listIds,
      segmentIds: this.segmentIds,
      excludeListIds: this.excludeListIds,
      excludeSegmentIds: this.excludeSegmentIds,
      queryString: this.queryString,
      scheduleDateTime: this.scheduleDateTime,
      scheduleTimezone: this.scheduleTimezone,
      send_campaign: 1,
    });

    $.export("$summary", "Draft campaign created successfully");
    return response;
  },
};
