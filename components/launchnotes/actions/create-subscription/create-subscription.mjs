import launchnotes from "../../launchnotes.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "launchnotes-create-subscription",
  name: "Create Subscription",
  description: "Adds a new subscriber to the current LaunchNotes project. [See the documentation](https://developer.launchnotes.com/index.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    launchnotes,
    projectId: {
      propDefinition: [
        launchnotes,
        "projectId",
      ],
    },
    email: {
      propDefinition: [
        launchnotes,
        "email",
      ],
    },
    username: {
      propDefinition: [
        launchnotes,
        "username",
      ],
      optional: true,
    },
    subscriptionType: {
      propDefinition: [
        launchnotes,
        "subscriptionType",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const subscriber = await this.launchnotes.addSubscriber({
      email: this.email,
      username: this.username,
    });

    const response = await this.launchnotes.emitProjectSubscriptionCreatedEvent({
      projectId: this.projectId,
      subscriberId: subscriber.id,
      subscriptionType: this.subscriptionType,
    });

    $.export("$summary", `Successfully created subscription for ${this.email}`);
    return response;
  },
};
