import infobip from "../../infobip.app.mjs";

export default {
  key: "send-sms-messages-over-query-parameters",
  name: "Send SMS Messages Over Query Parameters",
  description:
    "Send SMS message over query parameters All message parameters of the message can be defined in the query string. Use this method only if [Send SMS message](#channels/sms/send-sms-messages) is not a... [See the documentation](https://www.infobip.com/docs/sms)",
  version: "0.0.1",
  type: "action",
  props: {
    infobip,
    bulkId: {
      type: "string",
      label: "Bulk Id",
      description: "Unique ID assigned to the request if messaging multiple recipients or sending multiple messages via a single API request.",
      optional: true,
    },
    from: {
      type: "string",
      label: "From",
      description: "The sender ID which can be alphanumeric or numeric (e.g., `CompanyName`).",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description: "List of message recipients.",
      optional: false,
    },
    text: {
      type: "string",
      label: "Text",
      description: "Content of the message being sent.",
      optional: false,
    },
    flash: {
      type: "boolean",
      label: "Flash",
      description: "Sends a [flash SMS](https://www.infobip.com/docs/sms/message-types#flash-sms) if set to true.",
      optional: true,
    },
    transliteration: {
      type: "string",
      label: "Transliteration",
      description: "Conversion of a message text from one script to another.",
      optional: true,
    },
    languageCode: {
      type: "string",
      label: "Language Code",
      description: "Code for language character set of a message content.",
      optional: true,
    },
    intermediateReport: {
      type: "boolean",
      label: "Intermediate Report",
      description: "Use a [real-time intermediate delivery report](#channels/sms/receive-outbound-sms-message-report-v3) that will be sent on your callback server.",
      optional: true,
    },
    notifyUrl: {
      type: "string",
      label: "Notify Url",
      description: "The URL on your call back server on to which a delivery report will be sent.",
      optional: true,
    },
    notifyContentType: {
      type: "string",
      label: "Notify Content Type",
      description: "Preferred delivery report content type, `application/json` or `application/xml`.",
      optional: true,
    },
    callbackData: {
      type: "string",
      label: "Callback Data",
      description: "Additional data that can be used for identifying, managing, or monitoring a message. Data included here will also be automatically included in the message [Delivery Report](#channels/sms/get-outbound-sms-message-delivery-reports-v3). The maximum value is 4000 characters.",
      optional: true,
    },
    validityPeriod: {
      type: "integer",
      label: "Validity Period",
      description: "The message validity period in minutes. When the period expires, it will not be allowed for the message to be sent. Validity period longer than 48h is not supported. Any bigger value will automatically default back to `2880`.",
      optional: true,
    },
    sendAt: {
      type: "string",
      label: "Send At",
      description: "Date and time when the message is to be sent. Used for [scheduled SMS](#channels/sms/get-scheduled-sms-messages). Has the following format: `yyyy-MM-dd'T'HH:mm:ss.SSSZ`. Must be sooner than 180 days from now.",
      optional: true,
    },
    includeSmsCountInResponse: {
      type: "boolean",
      label: "Include Sms Count In Response",
      description: "Set to true to return smsCount in the response. Default is false. smsCount is the total count of SMS submitted in the request. SMS messages have a character limit and messages longer than that limit will be split into multiple SMS and reflected in the total count of SMS submitted. ",
      optional: true,
    },
    trackingUrl: {
      type: "string",
      label: "Tracking Url",
      description: "The URL of your callback server on to which the Click report will be sent.",
      optional: true,
    },
    trackingType: {
      type: "string",
      label: "Tracking Type",
      description: "Sets a custom conversion type naming convention, e.g. ONE_TIME_PIN, SOCIAL_INVITES, etc.",
      optional: true,
    },
    indiaDltContentTemplateId: {
      type: "string",
      label: "India Dlt Content Template Id",
      description: "The ID of your registered DLT (Distributed Ledger Technology) content template.",
      optional: true,
    },
    indiaDltPrincipalEntityId: {
      type: "string",
      label: "India Dlt Principal Entity Id",
      description: "Your DLT (Distributed Ledger Technology) entity id.",
      optional: true,
    },
    indiaDltTelemarketerId: {
      type: "string",
      label: "India Dlt Telemarketer Id",
      description: "Your assigned Telemarketer ID. (required for Aggregators)",
      optional: true,
    },
    turkeyIysBrandCode: {
      type: "integer",
      label: "Turkey Iys Brand Code",
      description: "Brand code is an ID of the company based on a company VAT number. If not provided in request, default value is used from your Infobip account.",
      optional: true,
    },
    turkeyIysRecipientType: {
      type: "string",
      label: "Turkey Iys Recipient Type",
      description: "Recipient Type must be TACIR or BIREYSEL",
      optional: true,
    },
    southKoreaResellerCode: {
      type: "integer",
      label: "South Korea Reseller Code",
      description: "Reseller identification code: 9-digit registration number in the business registration certificate for South Korea. Resellers should submit this when sending.",
      optional: true,
    },
    southKoreaTitle: {
      type: "string",
      label: "South Korea Title",
      description: "Title of the message.",
      optional: true,
    },
    applicationId: {
      propDefinition: [infobip, "applicationId"],
      optional: true,
    },
    entityId: {
      propDefinition: [infobip, "entityId"],
      optional: true,
    }
  },
  async run({ $ }) {
    const { infobip, bulkId, from, to, text, flash, transliteration, languageCode, intermediateReport, notifyUrl, notifyContentType, callbackData, validityPeriod, sendAt, includeSmsCountInResponse, trackingUrl, trackingType, indiaDltContentTemplateId, indiaDltPrincipalEntityId, indiaDltTelemarketerId, turkeyIysBrandCode, turkeyIysRecipientType, southKoreaResellerCode, southKoreaTitle, ...params } = this;

    const pathQuery = [];
    if (bulkId !== undefined && bulkId !== null) pathQuery.push({ name: "bulkId", value: bulkId.toString() });
    if (from !== undefined && from !== null) pathQuery.push({ name: "from", value: from.toString() });
    if (to !== undefined && to !== null) pathQuery.push({ name: "to", value: to.toString() });
    if (text !== undefined && text !== null) pathQuery.push({ name: "text", value: text.toString() });
    if (flash !== undefined && flash !== null) pathQuery.push({ name: "flash", value: flash.toString() });
    if (transliteration !== undefined && transliteration !== null) pathQuery.push({ name: "transliteration", value: transliteration.toString() });
    if (languageCode !== undefined && languageCode !== null) pathQuery.push({ name: "languageCode", value: languageCode.toString() });
    if (intermediateReport !== undefined && intermediateReport !== null) pathQuery.push({ name: "intermediateReport", value: intermediateReport.toString() });
    if (notifyUrl !== undefined && notifyUrl !== null) pathQuery.push({ name: "notifyUrl", value: notifyUrl.toString() });
    if (notifyContentType !== undefined && notifyContentType !== null) pathQuery.push({ name: "notifyContentType", value: notifyContentType.toString() });
    if (callbackData !== undefined && callbackData !== null) pathQuery.push({ name: "callbackData", value: callbackData.toString() });
    if (validityPeriod !== undefined && validityPeriod !== null) pathQuery.push({ name: "validityPeriod", value: validityPeriod.toString() });
    if (sendAt !== undefined && sendAt !== null) pathQuery.push({ name: "sendAt", value: sendAt.toString() });
    if (includeSmsCountInResponse !== undefined && includeSmsCountInResponse !== null) pathQuery.push({ name: "includeSmsCountInResponse", value: includeSmsCountInResponse.toString() });
    if (trackingUrl !== undefined && trackingUrl !== null) pathQuery.push({ name: "trackingUrl", value: trackingUrl.toString() });
    if (trackingType !== undefined && trackingType !== null) pathQuery.push({ name: "trackingType", value: trackingType.toString() });
    if (indiaDltContentTemplateId !== undefined && indiaDltContentTemplateId !== null) pathQuery.push({ name: "indiaDltContentTemplateId", value: indiaDltContentTemplateId.toString() });
    if (indiaDltPrincipalEntityId !== undefined && indiaDltPrincipalEntityId !== null) pathQuery.push({ name: "indiaDltPrincipalEntityId", value: indiaDltPrincipalEntityId.toString() });
    if (indiaDltTelemarketerId !== undefined && indiaDltTelemarketerId !== null) pathQuery.push({ name: "indiaDltTelemarketerId", value: indiaDltTelemarketerId.toString() });
    if (turkeyIysBrandCode !== undefined && turkeyIysBrandCode !== null) pathQuery.push({ name: "turkeyIysBrandCode", value: turkeyIysBrandCode.toString() });
    if (turkeyIysRecipientType !== undefined && turkeyIysRecipientType !== null) pathQuery.push({ name: "turkeyIysRecipientType", value: turkeyIysRecipientType.toString() });
    if (southKoreaResellerCode !== undefined && southKoreaResellerCode !== null) pathQuery.push({ name: "southKoreaResellerCode", value: southKoreaResellerCode.toString() });
    if (southKoreaTitle !== undefined && southKoreaTitle !== null) pathQuery.push({ name: "southKoreaTitle", value: southKoreaTitle.toString() });

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        pathQuery.push({ name: key, value: value.toString() });
      }
    });

    const response = await infobip.sendSmsMessagesOverQueryParameters({
      $,
      pathQuery: pathQuery.length > 0 ? pathQuery : undefined,
    });

    $.export(
      "$summary",
      `Message sent successfully: ${response.status?.description || "Success"}`
    );
    return response;
  },
};
