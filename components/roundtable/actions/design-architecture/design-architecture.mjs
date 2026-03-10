import roundtable from "../../roundtable.app.mjs";

export default {
  key: "roundtable-design-architecture",
  name: "Design Architecture",
  description: "Get architectural recommendations from multiple AI models for system design decisions. [See the documentation](https://roundtable.now)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    roundtable,
    description: {
      type: "string",
      label: "Description",
      description: "System description or architectural question",
    },
    scale: {
      type: "string",
      label: "Scale",
      description: "Expected scale (e.g., startup, growth, enterprise)",
      options: ["startup", "growth", "enterprise"],
      default: "startup",
      optional: true,
    },
    techStack: {
      type: "string[]",
      label: "Tech Stack",
      description: "Preferred technologies",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.roundtable.architect({
      $,
      data: {
        description: this.description,
        scale: this.scale,
        tech_stack: this.techStack,
      },
    });
    $.export("$summary", "Architecture design completed");
    return response;
  },
};
