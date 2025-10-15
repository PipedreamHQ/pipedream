import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "List User Invites",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "waitwhile-list-user-invites",
  description: "List of user invites. [See the doc here](https://developers.waitwhile.com/reference/listinvites)",
  props: {
    waitwhile,
    limit: {
      propDefinition: [
        waitwhile,
        "limit",
      ],
    },
    startAfter: {
      propDefinition: [
        waitwhile,
        "startAfter",
      ],
    },
    desc: {
      propDefinition: [
        waitwhile,
        "desc",
      ],
    },
    locationId: {
      propDefinition: [
        waitwhile,
        "locationId",
      ],
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const params = {
      limit: this.limit,
      startAfter: this.startAfter,
      desc: this.desc,
      locationId: this.locationId,
    };
    try {
      const data = await this.waitwhile.listUserInvites(params);
      $.export("summary", "Successfully listed user invites");
      return data;
    } catch (error) {
      const statusCode = error[Object.getOwnPropertySymbols(error)[1]].status;
      const statusText = error[Object.getOwnPropertySymbols(error)[1]].statusText;
      throw new Error(`Error status code: ${statusCode}. Error status response: ${statusText}`);
    }
  },
});
