import common from "./send-common.mjs";

export default {
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
      description: "Mailing List from which to select recipients",
    },
    recipients: {
      propDefinition: [
        common.props.thanksIo,
        "recipients",
        (c) => ({
          mailingListId: c.mailingList,
        }),
      ],
    },
  },
  methods: {
    async getRecipients(recipientIds, $) {
      const recipients = [];
      for (const recipientId of recipientIds) {
        const info = await this.thanksIo.getRecipient({
          recipientId,
          $,
        });
        recipients.push({
          name: info.name,
          address: info.address,
          address2: info?.address2,
          city: info.city,
          province: info.province,
          postal_code: info.postal_code,
          country: info.country,
        });
      }
      return recipients;
    },
  },
};
