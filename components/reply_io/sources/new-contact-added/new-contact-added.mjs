import reply from "../../reply_io.app.mjs";
import constants from "../common/constants.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "reply_io-new-contact-added",
  name: "New Contact Added",
  description: "Emit new event when a new contact is added. [See the docs here](https://apidocs.reply.io/#0a39db6f-af24-494f-88d6-caefd76b40f9)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    reply,
    db: "$.service.db",
    timer: {
      label: "Timer",
      description: "The timer that will trigger the event source",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastPage() {
      return this.db.get("lastPage");
    },
    _setLastPage(lastPage) {
      this.db.set("lastPage", lastPage);
    },
    generateMeta(contact) {
      return {
        id: contact.id,
        summary: `New Contact Added with ID ${contact.id}`,
        ts: Date.parse(contact.addingDate),
      };
    },
  },
  async run() {
    const lastPage = this._getLastPage() || 1;
    const params = {
      limit: constants.DEFAULT_PAGE_SIZE,
      page: lastPage,
    };
    let people;

    do {
      people = (await this.reply.listContacts({
        params,
      })).people;
      for (const contact of people) {
        const meta = this.generateMeta(contact);
        this.$emit(contact, meta);
      }
      params.page += 1;
    } while (people.length === params.limit);

    this._setLastPage(params.page - 1);
  },
};
