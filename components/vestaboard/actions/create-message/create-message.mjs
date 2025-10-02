import vestaboard from "../../vestaboard.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "vestaboard-create-message",
  name: "Create Message",
  description: "Creates a new message for a subscription. [See the docs](https://swagger.vestaboard.com/docs/vestaboard/b3A6MTYwMTA4OTc-post-v2-0-subscriptions-with-id-message)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    vestaboard,
    subscriptionId: {
      propDefinition: [
        vestaboard,
        "subscriptionId",
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "The message to send to the specified Subscription. If text is specified, lines will be centered horizontally and vertically if possible. Character codes will be inferred for alphanumeric and punctuation, or can be explicitly specified in-line in the message with curly braces containing the character code. Either `text` or `characters` must be entered.",
      optional: true,
    },
    characters: {
      type: "string",
      label: "Characters",
      description: "A 6x22 two-dimensional array of character codes to send to the specified Subscription. If characters are specified, the characters will be shown in the exact position in the array. [See Character Code Reference](https://docs.vestaboard.com/characters). Either `text` or `characters` must be entered.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      subscriptionId,
      text,
      characters,
    } = this;

    if (!text && !characters) {
      throw new ConfigurationError("Either `text` or `characters` must be entered");
    }

    const data = {};
    if (text) {
      data.text = text;
    } else {
      data.characters = Array.isArray(characters)
        ? characters
        : JSON.parse(characters);
    }

    const response = await this.vestaboard.createMessage({
      subscriptionId,
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created message with ID ${response.message.id}`);
    }

    return response;
  },
};
