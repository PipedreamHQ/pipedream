import constants from "../../common/constants.mjs";
import app from "../../procore.app.mjs";

export default {
  key: "procore-invite-user",
  name: "Invite User",
  description: "Invites a user to a project. [See the docs](https://developers.procore.com/reference/rest/v1/company-users?version=1.1#send-invite).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
    },
    userId: {
      propDefinition: [
        app,
        "userId",
        ({ companyId }) => ({
          companyId,
        }),
      ],
    },
  },
  methods: {
    sendInvite({
      companyId, userId, ...args
    } = {}) {
      return this.app.patch({
        apiVersion: constants.API_VERSION.V11,
        path: `/companies/${companyId}/users/${userId}/invite`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      companyId,
      userId,
    } = this;

    await this.sendInvite({
      step,
      companyId,
      userId,
      headers: this.app.companyHeader(companyId),
    });

    step.export("$sumary", "Successfully sent invite to user");

    return userId;
  },
};
