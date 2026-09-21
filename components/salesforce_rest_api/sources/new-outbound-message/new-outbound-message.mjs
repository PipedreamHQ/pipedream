import { XMLParser } from "fast-xml-parser";
import salesforce from "../../salesforce_rest_api.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  type: "source",
  name: "New Outbound Message (Instant)",
  key: "salesforce_rest_api-new-outbound-message",
  description: "Emit new event when a new outbound message is received in Salesforce. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_om_outboundmessaging_notifications.htm)",
  version: "1.0.0",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    salesforce,
    validateSessionId: {
      type: "boolean",
      label: "Validate Session ID",
      description: "Additionally verify the `SessionId` of each outbound message against the Salesforce API. Requires the outbound message's `Send Session ID` option to be enabled. Leave this disabled unless you need it: sessions that are IP-locked, or that belong to a user without API access, cannot be verified and their messages are rejected.",
      optional: true,
      default: false,
    },
    infoBox: {
      type: "alert",
      alertType: "info",
      content: `See Salesforce's guide on [setting up Outbound Messaging](https://sforce.co/3JbZJom).
\\
Set the Outbound Message's \`Endpoint URL\` to the endpoint of this source, which you can view after it is created.
\\
The outbound message must be sent from the same Salesforce org as the connected account above. Each message is verified against that org's \`Organization Id\`, so the \`Send Session ID\` option is no longer required.`,
    },
  },
  methods: {
    _getOrganizationId() {
      return this.db.get("organizationId");
    },
    _setOrganizationId(organizationId) {
      this.db.set("organizationId", organizationId);
    },
    _getOrganizationCheckedAt() {
      return this.db.get("organizationCheckedAt") || 0;
    },
    _setOrganizationCheckedAt(timestamp) {
      this.db.set("organizationCheckedAt", timestamp);
    },
    _unwrapMessage(message) {
      const parser = new XMLParser({
        removeNSPrefix: true,
        // Salesforce sends identifiers such as CaseNumber, postal codes and
        // external IDs as digit strings. Parsing those as numbers strips
        // leading zeros and rewrites E-notation and hex-like values.
        numberParseOptions: {
          leadingZeros: false,
          eNotation: false,
          hex: false,
        },
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
    // Compare on the leading 15 characters so that a 15 character ID and its 18
    // character form match. Both values come from Salesforce in canonical case,
    // so the comparison stays case-sensitive.
    _toShortId(id) {
      return `${id}`.slice(0, constants.ID_SHORT_LENGTH);
    },
    async _fetchOrganizationId() {
      const { organization_id: organizationId } =
        await this.salesforce.getUserInfo(this.salesforce._authToken());
      return organizationId;
    },
    // The cached ID belongs to whichever account was connected when it was
    // stored, and Salesforce exposes no stable connection identity to key it
    // on. So re-resolve from the connected account whenever the incoming ID
    // does not match: pointing the source at a different org then heals itself
    // on the next message instead of rejecting every message from then on.
    async _matchesConnectedOrganization(organizationId) {
      const cachedOrganizationId = this._getOrganizationId();
      if (cachedOrganizationId
        && this._toShortId(organizationId) === this._toShortId(cachedOrganizationId)) {
        return true;
      }

      // Re-resolve on a mismatch, but at most once per cooldown, so a stream of
      // rejected messages cannot amplify into a stream of Salesforce API calls.
      const now = Date.now();
      if (now - this._getOrganizationCheckedAt() < constants.ORGANIZATION_REFRESH_COOLDOWN_MS) {
        return false;
      }

      // Stamp before the request so a failing or concurrent refresh still
      // consumes the cooldown rather than retrying on every delivery.
      this._setOrganizationCheckedAt(now);
      const currentOrganizationId = await this._fetchOrganizationId();
      this._setOrganizationId(currentOrganizationId);
      return this._toShortId(organizationId) === this._toShortId(currentOrganizationId);
    },
    // Errors are intentionally not caught: a session that cannot be verified
    // must surface as a failed execution rather than a discarded message.
    async _isValidSessionId(sessionId) {
      const data = await this.salesforce.getUserInfo(sessionId);
      return Boolean(data);
    },
    async _isValidSource(data) {
      const {
        OrganizationId: organizationId,
        SessionId: sessionId,
      } = data;
      if (!organizationId) {
        return false;
      }

      if (!(await this._matchesConnectedOrganization(organizationId))) {
        return false;
      }

      if (!this.validateSessionId) {
        return true;
      }

      return sessionId
        ? this._isValidSessionId(sessionId)
        : false;
    },
    generateMeta(data) {
      const {
        ActionId: actionId,
        Notification: { Id: eventId },
      } = data;
      const id = `${eventId}-${actionId}`;
      const summary = `New outbound message with ID ${eventId}`;
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
    const data = this._unwrapMessage(bodyRaw);

    if (!(await this._isValidSource(data))) {
      // Acknowledge `false` so Salesforce keeps the message queued and retries
      // for up to 24 hours, rather than dropping it as delivered.
      this._sendHttpResponse(false);
      throw new Error(`Rejected an outbound message from Salesforce organization \`${data.OrganizationId}\` (connected organization: \`${this._getOrganizationId() || "unknown"}\`). Check that this source is connected to the organization that sends the outbound message, and, if \`Validate Session ID\` is enabled, that the message includes a valid Session ID.`);
    }

    this._sendHttpResponse(true);

    let notifications = data.Notification;
    if (!Array.isArray(notifications)) {
      notifications = [
        data.Notification,
      ];
    }

    notifications.forEach((n) => {
      const notification = Object.assign({}, data, {
        Notification: n,
      });
      this.$emit(notification, this.generateMeta(notification));
    });
  },
};
