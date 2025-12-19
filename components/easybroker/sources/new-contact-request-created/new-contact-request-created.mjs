import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "easybroker-new-contact-request-created",
  name: "New Contact Request Created",
  description: "Emit new event when a new contact request is created. [See the documentation](https://dev.easybroker.com/reference/get_contact-requests)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async processEvents(max) {
      const lastCreated = this._getLastCreated();
      let maxCreated = lastCreated;
      let page = 1;
      let contactRequests = [];
      let hasMore = true;

      do {
        const {
          content, pagination,
        } = await this.easybroker.listContactRequests({
          params: {
            page,
            limit: 50,
            happened_after: lastCreated,
          },
        });
        for (const contactRequest of content) {
          if (!lastCreated || Date.parse(contactRequest.happened_at) > Date.parse(lastCreated)) {
            contactRequests.push(contactRequest);
            if (!maxCreated || Date.parse(contactRequest.happened_at) > Date.parse(maxCreated)) {
              maxCreated = contactRequest.happened_at;
            }
          } else {
            break;
          }
        }
        hasMore = pagination.next_page !== null;
        page++;
      } while (hasMore);

      if (maxCreated) {
        this._setLastCreated(maxCreated);
      }

      if (max && contactRequests.length >= max) {
        contactRequests = contactRequests.slice(0, max);
      }

      for (const contactRequest of contactRequests) {
        this.$emit(contactRequest, this.generateMeta(contactRequest));
      }
    },
    generateMeta(contactRequest) {
      return {
        id: contactRequest.id,
        summary: `New Contact Request: ${contactRequest.name || contactRequest.id}`,
        ts: Date.parse(contactRequest.happened_at),
      };
    },
  },
};
