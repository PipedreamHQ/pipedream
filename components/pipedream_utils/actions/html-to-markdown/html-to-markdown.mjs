// legacy_hash_id: a_oViLn2
import TurndownService from "turndown";
import pipedream_utils from "../../pipedream_utils.app.mjs";

export default {
  key: "pipedream_utils-html-to-markdown",
  name: "Helper Functions - HTML to Markdown",
  description: "Convert via turndown",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pipedream_utils,
    input: {
      type: "string",
      label: "HTML",
    },
    headingStyle: {
      type: "string",
      label: "Heading Style",
      optional: true,
      options: [
        "setext",
        "atx",
      ],
    },
    hr: {
      type: "string",
      label: "HR",
      optional: true,
      options: [
        "***",
        "===",
        "---",
      ],
    },
    bulletListMarker: {
      type: "string",
      label: "Bullet List Marker",
      optional: true,
      options: [
        "-",
        "+",
        "*",
      ],
    },
    codeBlockStyle: {
      type: "string",
      label: "Code Block Style",
      optional: true,
      options: [
        "indented",
        "fenced",
      ],
    },
    fence: {
      type: "string",
      label: "Fence",
      optional: true,
      options: [
        "```",
        "~~~",
      ],
    },
    emDelimiter: {
      type: "string",
      label: "EM Delimiter",
      optional: true,
      options: [
        "_",
        "*",
      ],
    },
    strongDelimiter: {
      type: "string",
      label: "Strong Delimiter",
      optional: true,
      options: [
        "**",
        "__",
      ],
    },
    linkStyle: {
      type: "string",
      label: "Link Style",
      optional: true,
      options: [
        "inlined",
        "referenced",
      ],
    },
    linkReferenceStyle: {
      type: "string",
      label: "Link Reference Style",
      optional: true,
      options: [
        "full",
        "collapsed",
        "shortcut",
      ],
    },
  },
  async run() {
    const converter = new TurndownService({
      headingStyle: this.headingStyle,
      hr: this.hr,
      bulletListMarker: this.bulletListMarker,
      codeBlockStyle: this.codeBlockStyle,
      fence: this.fence,
      emDelimiter: this.emDelimiter,
      strongDelimiter: this.strongDelimiter,
      linkStyle: this.linkStyle,
      linkReferenceStyle: this.linkReferenceStyle,
    });
    const markdown = await converter.turndown(this.input);

    return markdown;
  },
};
