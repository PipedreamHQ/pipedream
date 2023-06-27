import googleContacts from "../../google_contacts.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import constants from "../../constants.mjs";

export default {
  key: "google_contacts-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created. [See the documentation](https://developers.google.com/people/api/rest/v1/people.connections/list)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    googleContacts,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const client = this.googleContacts.getClient();
      const { connections } = await this.googleContacts.listContacts(client, {
        resourceName: constants.RESOURCE_NAME,
        personFields: constants.FIELD_OPTIONS.join(),
        sortOrder: "LAST_MODIFIED_DESCENDING",
        pageSize: 25,
      });
      if (!connections?.length) {
        return;
      }
      connections.forEach((connection) => this.emitEvent(connection));
      this._setLastCreated(Date.parse(connections[0].metadata.sources[0].updateTime));
    },
  },
  methods: {
    _getLastCreated() {
      return this.db.get("lastCreated");
    },
    _setLastCreated(lastCreated) {
      this.db.set("lastCreated", lastCreated) || 0;
    },
    emitEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
    generateMeta(contact) {
      return {
        id: contact.resourceName,
        summary: contact.names[0].displayName,
        ts: Date.parse(contact.metadata.sources[0].updateTime),
      };
    },
  },
  async run() {
    const lastCreated = this._getLastCreated();
    let maxLastCreated = lastCreated;
    const client = this.googleContacts.getClient();

    const params = {
      resourceName: constants.RESOURCE_NAME,
      personFields: constants.FIELD_OPTIONS.join(),
      sortOrder: "LAST_MODIFIED_DESCENDING",
    };

    do {
      const {
        connections,
        nextPageToken,
      } = await this.googleContacts.listContacts(client, params);
      params.pageToken = nextPageToken;

      for (const contact of connections) {
        const ts = Date.parse(contact.metadata.sources[0].updateTime);
        if (ts > lastCreated) {
          this.emitEvent(contact);
          if (ts > maxLastCreated) {
            maxLastCreated = ts;
          }
        } else {
          params.pageToken = null;
          break;
        }
      }
    } while (params.pageToken);

    this._setLastCreated(maxLastCreated);
  },
};
