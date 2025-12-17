import tisaneLabs from "../../tisane_labs.app.mjs";

export default {
  key: "tisane_labs-detect-language",
  name: "Detect Language",
  description: "Detects languages used in the specified text fragment. [See the documentation](https://docs.tisane.ai/#bf10f7e0-6643-4d8e-861f-9fa158327170)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    tisaneLabs,
    content: {
      type: "string",
      label: "Content",
      description: "The content to analyze",
    },
    languages: {
      propDefinition: [
        tisaneLabs,
        "language",
      ],
      type: "string[]",
      label: "Languages",
      description: "An array of language codes to choose from; used for intelligent cues.",
      optional: true,
    },
    delimiter: {
      type: "string",
      label: "Delimiter",
      description: "A regular expression to segment the fragment; by default, languages are detected globally",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.tisaneLabs.detectLanguage({
      data: {
        content: this.content,
        languages: this.languages?.join(",") || "",
        delimiter: this.delimiter,
      },
      $,
    });

    if (response) {
      $.export("$summary", "Successfully detected languages.");
    }

    return response;
  },
};
