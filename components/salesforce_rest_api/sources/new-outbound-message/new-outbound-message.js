const { axios } = require("@pipedream/platform");
const salesforce = require("../../salesforce.app.js");
const { XMLParser } = require("fast-xml-parser");
const { toSingleLineString } = require("../../utils.js");

module.exports = {
  type: "source",
  name: "New Outbound Message",
  key: "salesforce_rest_api-new-outbound-message",
  description: toSingleLineString(`
    Emit new event (at regular intervals) when a new outbound message is received in
    Salesforce. See Salesforce's guide on setting up [Outbound
    Messaging](https://sforce.co/3JbZJom).
  `),
  version: "0.0.1",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    // eslint-disable-next-line pipedream/props-label,pipedream/props-description
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    salesforce,
  },
  methods: {
    _unwrapMessage(message) {
      const parser = new XMLParser({
        removeNSPrefix: true,
      });
      const obj = parser.parse(message);
      const notifications = obj["Envelope"]["Body"].notifications;
      return notifications;
    },
    _sendHttpResponse(successValue = true, status) {
      // eslint-disable-next-line multiline-ternary
      status = status ?? (successValue ? 200 : 400);
      this.http.respond({
        status,
        body: `
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:out="http://soap.sforce.com/2005/09/outbound">
            <soapenv:Header/>
            <soapenv:Body>
              <out:notificationsResponse>
                <out:Ack>${successValue}</out:Ack>
              </out:notificationsResponse>
            </soapenv:Body>
          </soapenv:Envelope>
        `,
        headers: {
          "content-type": "text/xml",
        },
      });
    },
    async _isValidSessionId(sessionId) {
      const authToken = sessionId;
      const url = this.salesforce.userApiUrl();
      const headers = {
        "Authorization": `Bearer ${authToken}`,
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
      const requestConfig = {
        method: "GET",
        url,
        headers,
      };
      // To validate the SessionId, try to make a Salesforce API request using the outbound
      // message's SessionId token
      try {
        const response = await axios(this, requestConfig);
        return Boolean(response);
      } catch (err) {
        console.log("Error validating SessionId:", err);
        return false;
      }
    },
    async _isValidSource(data) {
      const { SessionId: sessionId } = data;
      if (!sessionId) {
        throw new Error("The outbound message is missing a Session ID. Please configure the outbound message to send Session ID to validate the webhook source.");
      }

      return this._isValidSessionId(sessionId);
    },
    generateMeta(data) {
      const id = JSON.stringify(data);
      const ts = Date.now();
      return {
        id,
        summary: id,
        ts,
      };
    },
  },
  async run(event) {
    const { bodyRaw } = event;
    this._sendHttpResponse(true);
    const data = this._unwrapMessage(bodyRaw);
    if (!(await this._isValidSource(data))) {
      console.log("Skipping event from unrecognized source");
      return;
    }
    this.$emit(data, this.generateMeta(data));
  },
};
