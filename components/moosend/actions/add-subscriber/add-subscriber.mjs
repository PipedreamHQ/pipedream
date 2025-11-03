import app from "../../moosend.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "moosend-add-subscriber",
  name: "Add subscriber",
  description: "Adds a new subscriber to the specified mailing list. If there is already a subscriber with the specified email address in the list, an update will be performed instead. The rate limit for this request is 10 requests per 10 seconds (*per API key). See the [docs](https://moosendapp.docs.apiary.io/#reference/subscribers/add-or-update-subscribers/adding-subscribers) for more info.",
  version: "0.2.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the member",
    },
    mailingListId: {
      propDefinition: [
        app,
        "mailingListId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the subscriber. Example: `John Doe`.",
      optional: true,
    },
    hasExternalDoubleOptIn: {
      type: "string",
      label: "Has External Double Opt In",
      description: "When `true`, flags the added member as having given their subscription consent by other means.",
      optional: true,
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "A list of name-value pairs that match the member's custom fields defined in the mailing list. For example, if you have two custom fields named `Age` and `Country`, you should specify values for them as following example. `Age=25` and `Country=USA`.",
      optional: true,
    },
  },
  methods: {
    addSubscriber({
      mailingListId, ...args
    } = {}) {
      return this.app.create({
        path: `/subscribers/${mailingListId}/subscribe.json`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      email,
      mailingListId,
      name,
      hasExternalDoubleOptIn,
      customFields,
    } = this;

    const response = await this.addSubscriber({
      step,
      mailingListId,
      data: {
        Name: name,
        Email: email,
        HasExternalDoubleOptIn: hasExternalDoubleOptIn,
        CustomFields: utils.parseArray(customFields),
      },
    });

    if (response?.Error) {
      throw new Error(response.Error);
    }

    step.export("$summary", `Successfully added subscriber ${email} to mailing list \`${mailingListId}\``);

    return response;
  },
};
