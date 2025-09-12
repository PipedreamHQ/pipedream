import { XMLParser } from "fast-xml-parser";
import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  type: "source",
  name: "New Outbound Message (Instant)",
  key: "salesforce_rest_api-new-outbound-message",
  description: "Emit new event when a new outbound message is received in Salesforce.",
  version: "0.1.9",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    salesforce,
    infoBox: {
      type: "alert",
      alertType: "info",
      content: `See Salesforce's guide on [setting up Outbound Messaging](https://sforce.co/3JbZJom).
\\
Set the Outbound Message's \`Endpoint URL\` to the endpoint of this source, which you can view after it is created.
\\
The \`Send Session ID\` option must be enabled in Salesforce for validating outbound messages.`,
    },
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
      try {
        const data = await this.salesforce.getUserInfo(sessionId);
        return Boolean(data);
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
      const {
        ActionId: actionId,
        Notification: { Id: eventId },
      } = data;
      const id = `${eventId}-${actionId}`;
      const summary = JSON.stringify(data);
      const ts = Date.now();
      return {
        id,
        summary,
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

    let notifications = data.Notification;
    if (!Array.isArray(notifications)) {
      notifications = [
        data.Notification,
      ];
    }

    notifications.forEach((n) => {
      const notification = Object.assign(data, {
        Notification: n,
      });
      this.$emit(notification, this.generateMeta(notification));
    });
  },
};
