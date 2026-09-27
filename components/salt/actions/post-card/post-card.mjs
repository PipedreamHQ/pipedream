import { ConfigurationError } from "@pipedream/platform";
import salt from "../../salt.app.mjs";

const MAX_LABEL = 40;

// Salt's Card model requires action_id to match /\A[a-z0-9_-]{1,40}\z/ — this
// turns a human button label into a valid, stable id, with the button's
// position appended so two identically-labelled buttons never collide.
function actionIdFor(label, index) {
  const slug = String(label)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 36);
  return `${slug || "button"}-${index}`;
}

export default {
  key: "salt-post-card",
  name: "Post Card",
  description: "Post a declarative \"blocks\" card into a Salt chat — a section of text plus"
    + " up to 4 tappable buttons, rendered by Salt's own first-party components (never raw"
    + " HTML, so nothing an author writes ever runs as code)."
    + " Use **Get Card Taps** afterward to read which button a human tapped."
    + " [See the documentation](https://saltapp.ai/developers)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    salt,
    chatId: {
      propDefinition: [
        salt,
        "chatId",
      ],
    },
    question: {
      type: "string",
      label: "Question / Text",
      description: "The card's main text, up to 2,000 characters. e.g. `Approve this refund of $42.00?`",
    },
    button1Label: {
      type: "string",
      label: "Button 1 Label",
      description: `The first button's label, 1–${MAX_LABEL} characters. e.g. \`Approve\`.`,
    },
    button2Label: {
      type: "string",
      label: "Button 2 Label",
      description: `An optional second button's label, 1–${MAX_LABEL} characters. e.g. \`Deny\`.`,
      optional: true,
    },
    button3Label: {
      type: "string",
      label: "Button 3 Label",
      description: `An optional third button's label, 1–${MAX_LABEL} characters.`,
      optional: true,
    },
    button4Label: {
      type: "string",
      label: "Button 4 Label",
      description: `An optional fourth button's label, 1–${MAX_LABEL} characters.`,
      optional: true,
    },
    text: {
      type: "string",
      label: "Fallback Preview Text",
      description: "A short plain-text preview shown to clients that don't render cards, up to 200"
        + " characters. Defaults to a generic \"shared a card\" line when left blank.",
      optional: true,
    },
  },
  async run({ $ }) {
    const labels = [
      this.button1Label,
      this.button2Label,
      this.button3Label,
      this.button4Label,
    ].filter(Boolean);

    if (labels.some((label) => label.length > MAX_LABEL)) {
      throw new ConfigurationError(`Button labels must be ${MAX_LABEL} characters or fewer.`);
    }

    const blocks = [
      {
        type: "section",
        text: this.question,
      },
      {
        type: "actions",
        elements: labels.map((label, index) => ({
          type: "button",
          action_id: actionIdFor(label, index),
          label,
          action_type: "default",
        })),
      },
    ];

    const response = await this.salt.postCard({
      $,
      chatId: this.chatId,
      blocks,
      text: this.text,
    });

    // The response is a formatted chat message, not a bare card: the card's
    // own id rides as `resource_id` and the bubble's id as `message_id` —
    // there is no top-level `id`. Both are echoed back under friendlier
    // names too, for a downstream step that expects `card_id`.
    const cardId = response.resource_id;
    $.export("$summary", `Posted card ${cardId} to chat ${this.chatId}`);
    return {
      ...response,
      card_id: cardId,
    };
  },
};
