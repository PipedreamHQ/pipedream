import { axios } from "@pipedream/platform";
import skillzrun from "../../skillzrun.app.mjs";

export default {
  key: "skillzrun-upsert-user",
  name: "Upsert User",
  description: "Creates or updates a user based on the user email prop. The email prop is required and must be unique. Name and other optional props can be added for more specificity.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    skillzrun,
    userEmail: {
      propDefinition: [
        skillzrun,
        "userEmail",
      ],
    },
    userName: {
      propDefinition: [
        skillzrun,
        "userName",
        (c) => ({
          optional: true,
        }),
      ],
    },
    offerIds: {
      propDefinition: [
        skillzrun,
        "offerIds",
      ],
    },
  },
  async run({ $ }) {
    let response;
    try {
      // Try to update the user
      response = await this.skillzrun.updateUser({
        userEmail: this.userEmail,
        userName: this.userName,
      });
    } catch (error) {
      // If user does not exist, create a new one
      if (error.response && error.response.status === 404) {
        response = await this.skillzrun.createUserWithOffers({
          userEmail: this.userEmail,
          userName: this.userName,
          offerIds: this.offerIds,
        });
      } else {
        throw error;
      }
    }
    $.export("$summary", `Upserted user ${this.userEmail}`);
    return response;
  },
};
