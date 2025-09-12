export default {
  type: "app",
  app: "infobip",
  propDefinitions: {
    // OpenAPI Generated Props - START
    bulkId: {
      type: "string",
      label: "Bulk ID",
      description: "The ID which uniquely identifies the request for which the delivery reports are returned.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of messages to retrieve. Default is 50.",
      optional: true,
    },
    sendAt: {
      type: "string",
      label: "Send At",
      description: "Date and time when the message is to be sent. Used for scheduling messages.",
      optional: true,
    },
    validityPeriod: {
      type: "integer",
      label: "Validity Period",
      description: "The message validity period in minutes. How long the delivery will be attempted.",
      optional: true,
    },
    deliveryTimeWindow: {
      type: "object",
      label: "Delivery Time Window",
      description: "Sets specific delivery window for sending messages.",
      optional: true,
    },
    flash: {
      type: "boolean",
      label: "Flash Message",
      description: "Allows you to send a flash SMS to the destination number.",
      optional: true,
    },
    transliteration: {
      type: "string",
      label: "Transliteration",
      description: "Conversion of a message text from one script to another.",
      optional: true,
      options: [
        "TURKISH",
        "GREEK",
        "CYRILLIC",
        "SERBIAN_CYRILLIC",
        "CENTRAL_EUROPEAN",
        "BALTIC",
      ],
    },
    // OpenAPI Generated Props - END
  },
  methods: {
    // OpenAPI Generated Methods - START
    /**
     * Send SMS message
     *
* With this API method, you can do anything from sending a basic message to
* one person, all the way to sending customized messages to thousands of
* recipients in one go. It comes with a range of useful features like
* transliteration, scheduling, and tracking in a unified way.
     *
     * @see https://www.infobip.com/docs/sms
     * @param {Object} opts - Request options
     * @example
     * // Example usage:
     * await infobip.sendSmsMessages({
     *   data: {
     *     messages: [{
     *       from: "InfoSMS",
     *       to: "41793026727",
     *       text: "Hello world!"
     *     }]
     *   }
     * });
     * @returns {Promise<Object>} API response
     */
    sendSmsMessages(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sms/3/messages",
        ...opts,
      });
    },

    /**
     * Get outbound SMS message delivery reports
     *
* If you are for any reason unable to receive real-time delivery reports on
* your endpoint, you can use this API method to learn if and when the
* message has been delivered to the recipient.
     *
     * @see https://www.infobip.com/docs/sms
     * @param {Object} opts - Request options
     * @example
     * // Example usage:
     * await infobip.getOutboundSmsMessageDeliveryReports({
     *   params: {
     *     limit: 10,
     *     bulkId: 'bulk-id-123'
     *   }
     * });
     * @returns {Promise<Object>} API response
     */
    getOutboundSmsMessageDeliveryReports(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/sms/1/reports",
        ...opts,
      });
    },

    /**
     * Reschedule SMS messages
     *
* Change the date and time of already scheduled messages. To schedule a
* message, use the sendAt field when sending a message.
     *
     * @see https://www.infobip.com/docs/sms
     * @param {Object} opts - Request options
     * @example
     * // Example usage:
     * await infobip.rescheduleSmsMessages({
     *   data: {
     *     sendAt: "2024-12-25T10:00:00.000+01:00"
     *   }
     * });
     * @returns {Promise<Object>} API response
     */
    rescheduleSmsMessages(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/sms/1/bulks",
        ...opts,
      });
    },

    /**
     * Update scheduled SMS messages status
     *
* Change the status or completely cancel sending of scheduled messages. To
* schedule a message, use the sendAt field when sending a message.
     *
     * @see https://www.infobip.com/docs/sms
     * @param {Object} opts - Request options
     * @example
     * // Example usage:
     * await infobip.updateScheduledSmsMessagesStatus({
     *   data: {
     *     status: "PAUSED"
     *   }
     * });
     * @returns {Promise<Object>} API response
     */
    updateScheduledSmsMessagesStatus(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/sms/1/bulks/status",
        ...opts,
      });
    },

    /**
     * Confirm conversion
     *
* Use this endpoint to inform the Infobip platform about the successful
* conversion on your side. Infobip will use this information to monitor SMS
* performance and provide you with better service.
     * @param {Object} opts - Request options
     * @example
     * // Example usage:
     * await infobip.logEndTag({ messageId: "example-messageId", ...otherOptions });
     * @returns {Promise<Object>} API response
     */
    logEndTag({
      messageId, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/ct/1/log/end/${messageId}`,
        ...opts,
      });
    },
    // OpenAPI Generated Methods - END
  },
};
