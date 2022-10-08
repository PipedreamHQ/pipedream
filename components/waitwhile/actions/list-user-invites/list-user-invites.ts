import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "List User Invites",
  version: "0.0.2",
  key: "waitwhile-list-user-invites",
  description: "List of user invites",
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

    const data = await this.waitwhile.retrieveUserInvite(params);
    $.export("summary", "Successfully listed user invites");
    return data;
  },
});
