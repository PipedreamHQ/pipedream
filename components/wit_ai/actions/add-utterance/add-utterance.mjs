import app from "../../wit_ai.app.mjs";
import utils from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "wit_ai-add-utterance",
  name: "Add Utterance",
  description: "Add a sample utterance to train your app with an intent. [See the documentation](https://wit.ai/docs/http/20240304#post__utterances).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    text: {
      type: "string",
      label: "Text",
      description: "The text (sentence) you want your app to understand.",
    },
    outOfScope: {
      type: "boolean",
      label: "Out of Scope",
      description: "To train your app to recognize utterances that it should not handle set this to `true`.",
      optional: true,
      default: false,
      reloadProps: true,
    },
  },
  async additionalProps() {
    if (this.outOfScope === true) {
      return {};
    }

    const data = await this.app.listIntents();
    const intents = data.map(({ name }) => name);
    const intentOptions = intents.concat(Object.values(constants.BUILTIN_INTENTS));

    return {
      intent: {
        type: "string",
        label: "Intent",
        description: "The name of the intent you wish to create or train.",
        options: intentOptions,
      },
      entities: {
        type: "string[]",
        label: "Entities",
        description: "The list of entities appearing in this sentence, that you want your app to extract once it is trained. Each entity must be a JSON string with the following properties:\n- `entity` (string, required): The entity name, including the role (e.g., `temperature:temperature` or `wit$temperature:temperature`).\n- `start` (integer, required): The starting index within the text.\n- `end` (integer, required): The ending index within the text.\n- `body` (string, required): The span of the text for the entity.\n- `entities` (array, required): List of entities found within the composite entity.\n\nExample: `{\"entity\":\"wit$temperature:temperature\",\"start\":19,\"end\":26,\"body\":\"34 degrees\",\"entities\":[]}`",
        optional: true,
      },
      traits: {
        type: "string[]",
        label: "Traits",
        description: "The list of traits that are relevant for the utterance. Each trait must be a JSON string with the following properties:\n- `trait` (string, required): The trait name. This can be a trait you created, or a built-in one. i.e `faq` or `wit$sentiment`.\n- `value` (string, required): The value for the trait, e.g. `positive`.\n\nExample: `{\"trait\":\"wit$sentiment\",\"value\":\"neutral\"}`",
        optional: true,
      },
    };
  },
  methods: {
    addUtterance(args = {}) {
      return this.app.post({
        path: "/utterances",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      addUtterance,
      text,
      intent,
      entities,
      traits,
    } = this;

    const response = await addUtterance({
      $,
      data: [
        {
          text,
          intent,
          entities: utils.parseArray(entities),
          traits: utils.parseArray(traits),
        },
      ],
    });

    $.export("$summary", "Successfully added an utterance to your app.");
    return response;
  },
};
