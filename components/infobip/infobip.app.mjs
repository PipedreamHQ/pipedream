import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "infobip",
  propDefinitions: {
    applicationId: {
      type: "string",
      label: "Application ID",
      description: "Required for application use in a send request for outbound traffic. Returned in notification events. For more details, [see the Infobip documentation](https://www.infobip.com/docs/cpaas-x/application-and-entity-management).",
      async options({ page }) {
        const { results } = await this.listApplications({
          params: {
            page: page,
            size: LIMIT,
          },
        });

        return results.map(({
          applicationId: value, applicationName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    entityId: {
      type: "string",
      label: "Entity Id",
      description: "Required for entity use in a send request for outbound traffic. Returned in notification events. For more details, [see the Infobip documentation](https://www.infobip.com/docs/cpaas-x/application-and-entity-management).",
      async options({ page }) {
        const { results } = await this.listEntities({
          params: {
            page: page,
            size: LIMIT,
          },
        });

        return results.map(({
          entityId: value, entityName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    resourceKey: {
      type: "string",
      label: "Resource Key",
      description: "Required if `Resource` not present.",
      async options({
        page, channel,
      }) {
        const { results } = await this.listResources({
          params: {
            page: page,
            size: LIMIT,
            channel,
          },
        });

        return results.map(({ resourceId }) => resourceId);
      },
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Message destination address. Addresses must be in international format (Example: 41793026727).",
    },
    text: {
      type: "string",
      label: "Text",
      description: "Content of the message being sent.",
    },
    from: {
      type: "string",
      label: "From",
      description: "The sender ID which can be alphanumeric or numeric (e.g., CompanyName). Make sure you don't exceed [character limit](https://www.infobip.com/docs/sms/get-started#sender-names).",
    },
    to: {
      type: "string",
      label: "To",
      description: "The destination address of the message.",
    },
    messageId: {
      type: "string",
      label: "Message ID",
      description: "The ID that uniquely identifies the message sent via WhatsApp.",
    },
  },
  methods: {
    _baseUrl() {
      return (this.$auth.base_url.startsWith("https://"))
        ? this.$auth.base_url
        : `https://${this.$auth.base_url}`;
    },
    _headers() {
      return {
        "Authorization": `App ${this.$auth.api_key}`,
        "Content-type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
      });
    },
    listApplications(opts = {}) {
      return this._makeRequest({
        path: "/provisioning/1/applications",
        ...opts,
      });
    },
    listEntities(opts = {}) {
      return this._makeRequest({
        path: "/provisioning/1/entities",
        ...opts,
      });
    },
    listResources(opts = {}) {
      return this._makeRequest({
        path: "/provisioning/1/associations",
        ...opts,
      });
    },
    sendSms(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sms/2/text/advanced",
        ...opts,
      });
    },
    sendViberMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/viber/2/messages",
        ...opts,
      });
    },
    sendWhatsappMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/whatsapp/1/message/text",
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/resource-management/1/inbound-message-configurations",
        ...opts,
      });
    },
    deleteHook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/resource-management/1/inbound-message-configurations/${webhookId}`,
      });
    },


    // Generated methods from Infobip SMS OpenAPI specification
    // Total methods generated: 16
    // Generated on: 2025-09-18T14:28:48.395Z

    /**
     * Send SMS message
     *
     * With this API method, you can do anything from sending a basic message to one person,
     * all the way to sending customized messages to thousands of recipients in one go. It
     * comes with a range of useful features like transliteration, scheduling, and tracking in
     * a unified way.\
If utilizing Message Delivery Reports webhook, please consult the
     * documentation provided at [Receive outbound SMS message
     * reports](#channels/sms/receive-outbound-sms-message-report-v3).\
This endpoint is the
     * successor of [Send SMS message](#channels/sms/send-sms-message) and [Send binary SMS
     * message](#channels/sms/send-binary-sms-message).
     *
     * @see {@link https://www.infobip.com/docs/sms|External Documentation}
     *
     * @param {{
     *   data?: object, // Request body, required
     *   ...rest - Other optional parameters
     * },
     * }} [opts] - Optional parameters for the request.
     * @returns {Promise} - Promise resolving to the API response.
     */
sendSmsMessages(opts = {}) {
    const { pathQuery, ...rest } = opts;
    let path = "/sms/3/messages";

    pathQuery?.forEach(({ name, value }) => {
        const separator = path.includes("?") ? "&" : "?";
        path += `${separator}${name}=${encodeURIComponent(value)}`;
    });

    return this._makeRequest({
        method: "POST",
        path,
        ...rest,
    });
},
    /**
     * Send SMS message over query parameters
     *
     * All message parameters of the message can be defined in the query string. Use this
     * method only if [Send SMS message](#channels/sms/send-sms-messages) is not an option for
     * your use case!<br>**Note:** Make sure that special characters are properly encoded. Use
     * a [URL encoding reference](https://www.w3schools.com/tags/ref_urlencode.asp) as a guide.
     * This endpoint is the successor of [Send SMS message over query
     * parameters](#channels/sms/send-sms-message-over-query-parameters).
     *
     * @see {@link https://www.infobip.com/docs/sms|External Documentation}
     *
     * @param {{
     *   data?: object, // Request body, if applicable
     *   pathQuery?: [{
     *     name: string;
     *     value: string;
     *   }] // Query parameters,
     *   ...rest - Other optional parameters
     * },
     * }} [opts] - Optional parameters for the request.
     * @returns {Promise} - Promise resolving to the API response.
     */
sendSmsMessagesOverQueryParameters(opts = {}) {
    const { pathQuery, ...rest } = opts;
    let path = "/sms/3/text/query";

    pathQuery?.forEach(({ name, value }) => {
        const separator = path.includes("?") ? "&" : "?";
        path += `${separator}${name}=${encodeURIComponent(value)}`;
    });

    return this._makeRequest({
        method: "GET",
        path,
        ...rest,
    });
},
    /**
     * Send SMS message over query parameters
     *
     * All message parameters of the message can be defined in the query string. Use this
     * method only if [Send SMS message](#channels/sms/send-sms-message) is not an option for
     * your use case!<br>**Note:** Make sure that special characters and user credentials are
     * properly encoded. Use a [URL encoding
     * reference](https://www.w3schools.com/tags/ref_urlencode.asp) as a guide.
     *
     * @see {@link https://www.infobip.com/docs/sms|External Documentation}
     *
     * @param {{
     *   data?: object, // Request body, if applicable
     *   pathQuery?: [{
     *     name: string;
     *     value: string;
     *   }] // Query parameters,
     *   ...rest - Other optional parameters
     * },
     * }} [opts] - Optional parameters for the request.
     * @returns {Promise} - Promise resolving to the API response.
     */
sendSmsMessageOverQueryParameters(opts = {}) {
    const { pathQuery, ...rest } = opts;
    let path = "/sms/1/text/query";

    pathQuery?.forEach(({ name, value }) => {
        const separator = path.includes("?") ? "&" : "?";
        path += `${separator}${name}=${encodeURIComponent(value)}`;
    });

    return this._makeRequest({
        method: "GET",
        path,
        ...rest,
    });
},
    /**
     * Preview SMS message
     *
     * Avoid unpleasant surprises and check how different message configurations will affect
     * your message text, number of characters and message parts.
     *
     * @see {@link https://www.infobip.com/docs/sms|External Documentation}
     *
     * @param {{
     *   data?: object, // Request body, required
     *   ...rest - Other optional parameters
     * },
     * }} [opts] - Optional parameters for the request.
     * @returns {Promise} - Promise resolving to the API response.
     */
previewSmsMessage(opts = {}) {
    const { pathQuery, ...rest } = opts;
    let path = "/sms/1/preview";

    pathQuery?.forEach(({ name, value }) => {
        const separator = path.includes("?") ? "&" : "?";
        path += `${separator}${name}=${encodeURIComponent(value)}`;
    });

    return this._makeRequest({
        method: "POST",
        path,
        ...rest,
    });
},
    /**
     * Send SMS message
     *
     * Use this endpoint to send an SMS and set up a rich set of features, such as batch
     * sending with a single API request, scheduling, URL tracking, language and
     * transliteration configuration, etc. The API response will not contain the final delivery
     * status, use [Delivery
     * Reports](https://www.infobip.com/docs/api/channels/sms/sms-messaging/logs-and-status-reports/receive-outbound-sms-message-report)
     * instead.\
In light of improved features, this endpoint has been superseded. Please visit
     * [Send SMS message](#channels/sms/send-sms-messages) for the next version.
     *
     * @see {@link https://www.infobip.com/docs/sms|External Documentation}
     *
     * @param {{
     *   data?: object, // Request body, required
     *   ...rest - Other optional parameters
     * },
     * }} [opts] - Optional parameters for the request.
     * @returns {Promise} - Promise resolving to the API response.
     */
sendSmsMessage(opts = {}) {
    const { pathQuery, ...rest } = opts;
    let path = "/sms/2/text/advanced";

    pathQuery?.forEach(({ name, value }) => {
        const separator = path.includes("?") ? "&" : "?";
        path += `${separator}${name}=${encodeURIComponent(value)}`;
    });

    return this._makeRequest({
        method: "POST",
        path,
        ...rest,
    });
},
    /**
     * Send binary SMS message
     *
     * Send single or multiple binary messages to one or more destination address. The API
     * response will not contain the final delivery status, use [Delivery
     * Reports](https://www.infobip.com/docs/api/channels/sms/sms-messaging/logs-and-status-reports/receive-outbound-sms-message-report)
     * instead.\
In light of improved features, this endpoint has been superseded. Please visit
     * [Send SMS message](#channels/sms/send-sms-messages) for the next version.
     *
     * @see {@link https://www.infobip.com/docs/sms|External Documentation}
     *
     * @param {{
     *   data?: object, // Request body, required
     *   ...rest - Other optional parameters
     * },
     * }} [opts] - Optional parameters for the request.
     * @returns {Promise} - Promise resolving to the API response.
     */
sendBinarySmsMessage(opts = {}) {
    const { pathQuery, ...rest } = opts;
    let path = "/sms/2/binary/advanced";

    pathQuery?.forEach(({ name, value }) => {
        const separator = path.includes("?") ? "&" : "?";
        path += `${separator}${name}=${encodeURIComponent(value)}`;
    });

    return this._makeRequest({
        method: "POST",
        path,
        ...rest,
    });
},
    /**
     * Get scheduled SMS messages
     *
     * See all [scheduled messages](https://www.infobip.com/docs/sms/sms-over-api#schedule-sms)
     * and their scheduled date and time. To schedule a message, use the `sendAt` field when
     * [sending a
     * message](https://www.infobip.com/docs/api/channels/sms/sms-messaging/outbound-sms/send-sms-message).
     *
     * @see {@link https://www.infobip.com/docs/sms|External Documentation}
     *
     * @param {{
     *   data?: object, // Request body, if applicable
     *   pathQuery?: [{
     *     name: string;
     *     value: string;
     *   }] // Query parameters,
     *   ...rest - Other optional parameters
     * },
     * }} [opts] - Optional parameters for the request.
     * @returns {Promise} - Promise resolving to the API response.
     */
getScheduledSmsMessages(opts = {}) {
    const { pathQuery, ...rest } = opts;
    let path = "/sms/1/bulks";

    pathQuery?.forEach(({ name, value }) => {
        const separator = path.includes("?") ? "&" : "?";
        path += `${separator}${name}=${encodeURIComponent(value)}`;
    });

    return this._makeRequest({
        method: "GET",
        path,
        ...rest,
    });
},
    /**
     * Reschedule SMS messages
     *
     * Change the date and time of already [scheduled
     * messages](https://www.infobip.com/docs/sms/sms-over-api#schedule-sms). To schedule a
     * message, use the `sendAt` field when [sending a
     * message](https://www.infobip.com/docs/api/channels/sms/sms-messaging/outbound-sms/send-sms-message).
     *
     * @see {@link https://www.infobip.com/docs/sms|External Documentation}
     *
     * @param {{
     *   data?: object, // Request body, required
     *   pathQuery?: [{
     *     name: string;
     *     value: string;
     *   }] // Query parameters,
     *   ...rest - Other optional parameters
     * },
     * }} [opts] - Optional parameters for the request.
     * @returns {Promise} - Promise resolving to the API response.
     */
rescheduleSmsMessages(opts = {}) {
    const { pathQuery, ...rest } = opts;
    let path = "/sms/1/bulks";

    pathQuery?.forEach(({ name, value }) => {
        const separator = path.includes("?") ? "&" : "?";
        path += `${separator}${name}=${encodeURIComponent(value)}`;
    });

    return this._makeRequest({
        method: "PUT",
        path,
        ...rest,
    });
},
    /**
     * Get scheduled SMS messages status
     *
     * See the status of [scheduled
     * messages](https://www.infobip.com/docs/sms/sms-over-api#schedule-sms). To schedule a
     * message, use the `sendAt` field when [sending a
     * message](https://www.infobip.com/docs/api/channels/sms/sms-messaging/outbound-sms/send-sms-message).
     *
     * @see {@link https://www.infobip.com/docs/sms|External Documentation}
     *
     * @param {{
     *   data?: object, // Request body, if applicable
     *   pathQuery?: [{
     *     name: string;
     *     value: string;
     *   }] // Query parameters,
     *   ...rest - Other optional parameters
     * },
     * }} [opts] - Optional parameters for the request.
     * @returns {Promise} - Promise resolving to the API response.
     */
getScheduledSmsMessagesStatus(opts = {}) {
    const { pathQuery, ...rest } = opts;
    let path = "/sms/1/bulks/status";

    pathQuery?.forEach(({ name, value }) => {
        const separator = path.includes("?") ? "&" : "?";
        path += `${separator}${name}=${encodeURIComponent(value)}`;
    });

    return this._makeRequest({
        method: "GET",
        path,
        ...rest,
    });
},
    /**
     * Update scheduled SMS messages status
     *
     * Change the status or completely cancel sending of [scheduled
     * messages](https://www.infobip.com/docs/sms/sms-over-api#schedule-sms). To schedule a
     * message, use the `sendAt` field when [sending a
     * message](https://www.infobip.com/docs/api/channels/sms/sms-messaging/outbound-sms/send-sms-message).
     *
     * @see {@link https://www.infobip.com/docs/sms|External Documentation}
     *
     * @param {{
     *   data?: object, // Request body, required
     *   pathQuery?: [{
     *     name: string;
     *     value: string;
     *   }] // Query parameters,
     *   ...rest - Other optional parameters
     * },
     * }} [opts] - Optional parameters for the request.
     * @returns {Promise} - Promise resolving to the API response.
     */
updateScheduledSmsMessagesStatus(opts = {}) {
    const { pathQuery, ...rest } = opts;
    let path = "/sms/1/bulks/status";

    pathQuery?.forEach(({ name, value }) => {
        const separator = path.includes("?") ? "&" : "?";
        path += `${separator}${name}=${encodeURIComponent(value)}`;
    });

    return this._makeRequest({
        method: "PUT",
        path,
        ...rest,
    });
},
    /**
     * Confirm conversion
     *
     * Use this endpoint to inform the Infobip platform about the successful conversion on your
     * side. Infobip will use this information to monitor SMS performance and provide you with
     * better service. To enable Conversion Tracking, set up the “tracking” object to “SMS”
     * when [sending a
     * message](https://www.infobip.com/docs/api/channels/sms/sms-messaging/outbound-sms) over
     * HTTP API.
For more information, see: [Tracking
     * Conversion](https://www.infobip.com/docs/sms/api#track-conversion).
     *
     * @param {{
     *   data?: object, // Request body, if applicable
     *   pathParams?: [{
     *     name: string;
     *     value: string;
     *   }] // Path parameters: messageId,
     *   ...rest - Other optional parameters
     * },
     * }} [opts] - Optional parameters for the request.
     * @returns {Promise} - Promise resolving to the API response.
     */
logEndTag(opts = {}) {
    const { pathParams, pathQuery, ...rest } = opts;
    // Example of paths:
    // * /ct/1/log/end/{messageId}
    // * /sms/3/messages
    //* /whatsapp/{versionId}/message/template/{templateName}
    let path = `/ct/1/log/end/{messageId}`;
    pathParams.forEach(({ name, value }) => {
        path = path.replace(`{${name}}`, value);
    });

    pathQuery?.forEach(({ name, value }) => {
        const separator = path.includes("?") ? "&" : "?";
        path += `${separator}${name}=${encodeURIComponent(value)}`;
    });

    return this._makeRequest({
        method: "POST",
        path,
        ...rest,
    });
},
    /**
     * Get inbound SMS messages
     *
     * If you are unable to receive incoming SMS to the endpoint of your choice in real-time,
     * you can use this API call to fetch messages. Each request will return a batch of
     * received messages, only once. The API request will only return new messages that arrived
     * since the last API request. To use this method, you’d need to:<ol><li><a
     * href="https://www.infobip.com/docs/api/platform/numbers/phone-numbers/purchase-number">Buy
     * a number</a> capable of receiving SMS traffic.</li><li>Specify a forwarding endpoint for
     * the number and optionally configure other <a
     * href="https://www.infobip.com/docs/api/platform/numbers/my-numbers/resource-management/manage-inbound-configuration">inbound
     * settings</a>.</li></ol>
     *
     * @param {{
     *   data?: object, // Request body, if applicable
     *   pathQuery?: [{
     *     name: string;
     *     value: string;
     *   }] // Query parameters,
     *   ...rest - Other optional parameters
     * },
     * }} [opts] - Optional parameters for the request.
     * @returns {Promise} - Promise resolving to the API response.
     */
getInboundSmsMessages(opts = {}) {
    const { pathQuery, ...rest } = opts;
    let path = "/sms/1/inbox/reports";

    pathQuery?.forEach(({ name, value }) => {
        const separator = path.includes("?") ? "&" : "?";
        path += `${separator}${name}=${encodeURIComponent(value)}`;
    });

    return this._makeRequest({
        method: "GET",
        path,
        ...rest,
    });
},
    /**
     * Get outbound SMS message delivery reports
     *
     * If you are unable to receive real-time message delivery reports towards your endpoint
     * for various reasons, we offer you an API method to fetch batches of message reports to
     * confirm whether specific messages have been delivered. Each request towards this
     * endpoint will return batches of the latest message reports. Please note they will be
     * returned only once.
     *
     * @see {@link https://www.infobip.com/docs/sms|External Documentation}
     *
     * @param {{
     *   data?: object, // Request body, if applicable
     *   pathQuery?: [{
     *     name: string;
     *     value: string;
     *   }] // Query parameters,
     *   ...rest - Other optional parameters
     * },
     * }} [opts] - Optional parameters for the request.
     * @returns {Promise} - Promise resolving to the API response.
     */
getOutboundSmsMessageDeliveryReportsV3(opts = {}) {
    const { pathQuery, ...rest } = opts;
    let path = "/sms/3/reports";

    pathQuery?.forEach(({ name, value }) => {
        const separator = path.includes("?") ? "&" : "?";
        path += `${separator}${name}=${encodeURIComponent(value)}`;
    });

    return this._makeRequest({
        method: "GET",
        path,
        ...rest,
    });
},
    /**
     * Get outbound SMS message logs
     *
     * Use this method to obtain the logs associated with outbound messages. The available logs
     * are limited to those generated in the last 48 hours, and you can retrieve a maximum of
     * only 1000 logs per call. See [message delivery
     * reports](#channels/sms/get-outbound-sms-message-delivery-reports-v3) if your use case is
     * to verify message delivery.
     *
     * @see {@link https://www.infobip.com/docs/sms|External Documentation}
     *
     * @param {{
     *   data?: object, // Request body, if applicable
     *   pathQuery?: [{
     *     name: string;
     *     value: string;
     *   }] // Query parameters,
     *   ...rest - Other optional parameters
     * },
     * }} [opts] - Optional parameters for the request.
     * @returns {Promise} - Promise resolving to the API response.
     */
getOutboundSmsMessageLogsV3(opts = {}) {
    const { pathQuery, ...rest } = opts;
    let path = "/sms/3/logs";

    pathQuery?.forEach(({ name, value }) => {
        const separator = path.includes("?") ? "&" : "?";
        path += `${separator}${name}=${encodeURIComponent(value)}`;
    });

    return this._makeRequest({
        method: "GET",
        path,
        ...rest,
    });
},
    /**
     * Get outbound SMS message delivery reports
     *
     * If you are for any reason unable to receive real-time delivery reports on your endpoint,
     * you can use this API method to learn if and when the message has been delivered to the
     * recipient. Each request will return a batch of delivery reports - only once. The
     * following API request will return only new reports that arrived since the last API
     * request in the last 48 hours.
     *
     * @see {@link https://www.infobip.com/docs/sms|External Documentation}
     *
     * @param {{
     *   data?: object, // Request body, if applicable
     *   pathQuery?: [{
     *     name: string;
     *     value: string;
     *   }] // Query parameters,
     *   ...rest - Other optional parameters
     * },
     * }} [opts] - Optional parameters for the request.
     * @returns {Promise} - Promise resolving to the API response.
     */
getOutboundSmsMessageDeliveryReports(opts = {}) {
    const { pathQuery, ...rest } = opts;
    let path = "/sms/1/reports";

    pathQuery?.forEach(({ name, value }) => {
        const separator = path.includes("?") ? "&" : "?";
        path += `${separator}${name}=${encodeURIComponent(value)}`;
    });

    return this._makeRequest({
        method: "GET",
        path,
        ...rest,
    });
},
    /**
     * Get outbound SMS message logs
     *
     * Use this method for displaying logs for example in the user interface. Available are the
     * logs for the last 48 hours and you can only retrieve maximum of 1000 logs per call. See
     * [message delivery reports](#channels/sms/get-outbound-sms-message-delivery-reports) if
     * your use case is to verify message delivery.
     *
     * @see {@link https://www.infobip.com/docs/sms|External Documentation}
     *
     * @param {{
     *   data?: object, // Request body, if applicable
     *   pathQuery?: [{
     *     name: string;
     *     value: string;
     *   }] // Query parameters,
     *   ...rest - Other optional parameters
     * },
     * }} [opts] - Optional parameters for the request.
     * @returns {Promise} - Promise resolving to the API response.
     */
getOutboundSmsMessageLogs(opts = {}) {
    const { pathQuery, ...rest } = opts;
    let path = "/sms/1/logs";

    pathQuery?.forEach(({ name, value }) => {
        const separator = path.includes("?") ? "&" : "?";
        path += `${separator}${name}=${encodeURIComponent(value)}`;
    });

    return this._makeRequest({
        method: "GET",
        path,
        ...rest,
    });
}

  },
};