import lastpass from "../../lastpass.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "lastpass-push-sites-to-users",
  name: "Push Sites to Users",
  description: "Pushes specified sites to particular users",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    lastpass,
    userIDs: {
      propDefinition: [
        lastpass,
        "userIDs",
      ],
    },
    siteIDs: {
      propDefinition: [
        lastpass,
        "siteIDs",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lastpass.pushSitesToUsers({
      userIDs: this.userIDs,
      siteIDs: this.siteIDs,
    });
    $.export("$summary", "Successfully pushed sites to users");
    return response;
  },
};
