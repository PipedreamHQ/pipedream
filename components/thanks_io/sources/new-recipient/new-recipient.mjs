import common from "../common/common.mjs";
import { format } from "date-fns";

export default {
  ...common,
  key: "thanks_io-new-recipient",
  name: "New Recipient",
  description: "Emit new event for each new recipient is added to a mailing list.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    mailingList: {
      propDefinition: [
        common.props.thanksIo,
        "mailingList",
        (c) => ({
          subAccount: c.subAccount,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    generateMeta(recipient) {
      return {
        id: recipient.id,
        summary: `New recipient ${recipient.name}`,
        ts: Date.parse(recipient?.updated_at),
      };
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    const params = lastTimestamp
      ? {
        updated_since: lastTimestamp,
      }
      : {
        items_per_page: 25,
      };

    const { data: recipients } = await this.thanksIo.listRecipients({
      listId: this.mailingList,
      params,
    });
    for (const recipient of recipients) {
      this.$emit(recipient, this.generateMeta(recipient));
    }

    this._setLastTimestamp(format(new Date(), "yyyy-MM-dd H:mm:ss"));
  },
};
