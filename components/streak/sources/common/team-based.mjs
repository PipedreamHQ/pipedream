import common from "./base.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    teamId: {
      propDefinition: [
        common.props.streak,
        "teamId",
      ],
    },
  },
  hooks: {
    ...common.hooks,
    async activate() {
      const { key } = await this.streak.createWebhook({
        params: {
          teamKey: this.teamId,
        },
        data: {
          targetUrl: this.http.endpoint,
          event: this.getEventType(),
        },
      });
      this._setHookId(key);
    },
  },
  methods: {
    ...common.methods,
    async getContactsInPipeline(limit) {
      const boxes = await this.streak.listBoxes({
        pipelineId: this.pipelineId,
        params: {
          limit,
          sortBy: "lastUpdatedTimestamp",
        },
      });
      const contactIds = [];
      for (const box of boxes) {
        if (!box.contacts) {
          continue;
        }
        const contactKeys = box.contacts.map((contact) => contact.key);
        if (contactKeys?.length > 0) {
          contactIds.push(...contactKeys);
        }
      }
      const contacts = [];
      for (const contactId of contactIds) {
        const contact = await this.streak.getContact({
          contactId,
        });
        contacts.push(contact);
        if (contacts.length >= limit) {
          contacts.length = limit;
          break;
        }
      }
      return contacts;
    },
  },
};
