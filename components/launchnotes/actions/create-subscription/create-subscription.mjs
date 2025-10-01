import { ConfigurationError } from "@pipedream/platform";
import {
  SUBSCRIBE_TYPE_OPTIONS, SUBSCRIPTION_TYPE_OPTIONS,
} from "../../common/constants.mjs";
import launchnotes from "../../launchnotes.app.mjs";

export default {
  key: "launchnotes-create-subscription",
  name: "Create Subscription",
  description: "Adds a new subscriber to the current LaunchNotes project. [See the documentation](https://developer.launchnotes.com/index.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    launchnotes,
    clientMutationId: {
      propDefinition: [
        launchnotes,
        "clientMutationId",
      ],
      optional: true,
    },
    projectId: {
      propDefinition: [
        launchnotes,
        "projectId",
      ],
    },
    eventTypes: {
      propDefinition: [
        launchnotes,
        "eventTypes",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
    categories: {
      propDefinition: [
        launchnotes,
        "categories",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
    subscribeType: {
      type: "string",
      label: "Subscribe Type",
      description: "The type you would like to create a subscription for.",
      options: SUBSCRIBE_TYPE_OPTIONS,
      optional: true,
      reloadProps: true,
    },
    subscriptionType: {
      type: "string",
      label: "Subscription Type",
      description: "The type of subscription - eg. SimpleMailApp or SlackApp.",
      options: SUBSCRIPTION_TYPE_OPTIONS,
    },
    skipOptIn: {
      type: "boolean",
      label: "Skip OptIn",
      description: "If set to true, opt in a newly created subscriber without sending a confirmation email.",
      optional: true,
    },
    subscriber: {
      type: "string",
      label: "Subscriber",
      description: "The subscriber of the subscription.",
      withLabel: true,
      async options () {
        const { data: { project: { projectUsers } } } = await this.launchnotes.getProject({
          projectId: this.projectId,
        });

        return projectUsers.nodes.map(({
          id: value, email: label,
        }) => ({
          value,
          label,
        }));
      },
    },
  },
  async additionalProps() {
    const props = {};
    if (this.subscribeType) {
      if (this.subscribeType === "WORK_ITEM") {
        props.workItemId = {
          type: "string",
          label: "Work Item Id",
          description: "Work Item ID",
          options: async () => {
            const { data: { project: { workItems } } } = await this.launchnotes.getProject({
              projectId: this.projectId,
            });

            return workItems.nodes.map(({
              id: value, name: label,
            }) => ({
              value,
              label,
            }));
          },
        };
      }
    }
    return props;
  },
  async run({ $ }) {
    const subscribedObject = {
      type: "PROJECT",
      id: this.projectId,
    };

    if (this.subscribeType === "WORK_ITEM") {
      subscribedObject.type = "WORK_ITEM";
      subscribedObject.id = this.workItemId;
    }

    const {
      data, errors: responseErrors,
    } = await this.launchnotes.createSubscription({
      $,
      variables: {
        input: {
          clientMutationId: this.clientMutationId,
          subscription: {
            eventTypes: this.eventTypes.map((eventType) => ({
              id: eventType,
            })),
            categories: this.categories.map((category) => ({
              id: category,
            })),
            subscribedObject,
            subscriber: {
              type: "USER",
              id: this.subscriber.value,
              email: this.subscriber.email,
            },
            type: this.subscriptionType,
            skipOptIn: this.skipOptIn,
          },
        },
      },
    });

    const errors = responseErrors || data.createSubscription.errors;

    if (errors.length) {
      throw new ConfigurationError(JSON.stringify(errors[0]));
    }

    $.export("$summary", `Successfully created subscription with Id: ${data.createSubscription.subscription.id}`);
    return data;
  },
};
