import { parseObject } from "../../common/utils.mjs";
import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-generate-egift-link",
  name: "Generate eGift Link",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Generate a new E-Gift link [See the docs here](https://sendoso.docs.apiary.io/#reference/send-management/generate-egift-links/sending-a-e-gift)",
  type: "action",
  props: {
    sendoso,
    via: {
      propDefinition: [
        sendoso,
        "via",
      ],
    },
    template: {
      propDefinition: [
        sendoso,
        "template",
      ],
      optional: true,
    },
    groupId: {
      propDefinition: [
        sendoso,
        "groupId",
      ],
    },
    touchId: {
      propDefinition: [
        sendoso,
        "touchId",
        (c) => ({
          groupId: c.groupId,
        }),
      ],
    },
    recipientUsers: {
      propDefinition: [
        sendoso,
        "recipientUsers",
        (c) => ({
          groupId: c.groupId,
        }),
      ],
      optional: true,
    },
    viaFrom: {
      propDefinition: [
        sendoso,
        "viaFrom",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      via,
      template,
      touchId,
      viaFrom,
      recipientUsers,
    } = this;

    const response = await this.sendoso.sendGift({
      $,
      via,
      template,
      touch_id: touchId,
      via_from: viaFrom,
      recipient_users: parseObject(recipientUsers),
    });

    $.export("$summary", `E-Gift successfully generated with tracking code: ${response.tracking_code}!`);
    return response;
  },
};
