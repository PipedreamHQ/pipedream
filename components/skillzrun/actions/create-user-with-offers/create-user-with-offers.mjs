import { defineAction } from "@pipedream/platform";
import skillzrun from "../../skillzrun.app.mjs";

const component = {
  key: "skillzrun-create-user-with-offers",
  name: "Create User With Offers",
  description: "Creates a new user with their associated offers in the SkillzRun app. The user's email and the associated offer IDs are required props. The offer IDs must exist within the SkillzRun app. Optional props like user name can be supplied.",
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
    const response = await this.skillzrun.createUserWithOffers({
      userEmail: this.userEmail,
      offerIds: this.offerIds,
      userName: this.userName,
    });
    $.export("$summary", "Successfully created user with offers");
    return response;
  },
};

export default defineAction(component);
