import docuwriterAi from "../../docuwriter_ai.app.mjs";

export default {
  key: "docuwriter_ai-generate-uml-diagram",
  name: "Generate UML Diagram",
  description: "Generate a UML diagram from source code using Mermaid syntax. Consumes 1 Docuwriter credit. Requires workflow timeout of 5+ minutes for large files. [See the documentation](https://docs.docuwriter.ai/docuwriterai-api-docs/92070)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    docuwriterAi,
    sourceCode: {
      propDefinition: [
        docuwriterAi,
        "sourceCode",
      ],
    },
    filename: {
      propDefinition: [
        docuwriterAi,
        "filename",
      ],
    },
    diagramType: {
      type: "string",
      label: "Diagram Type",
      description: "UML diagram type to generate (e.g., `Class Diagrams`, `Sequence Diagrams`, `Activity Diagrams`)",
      options: [
        "Class Diagrams",
        "Sequence Diagrams",
        "Use Case Diagrams",
        "Activity Diagrams",
        "Component Diagrams",
        "State Diagrams",
        "Object Diagrams",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.docuwriterAi.generateUmlDiagram($, {
      source_code: this.sourceCode,
      filename: this.filename,
      diagram_type: this.diagramType,
    });
    $.export("$summary", `${this.diagramType} generated for ${this.filename}`);
    return response;
  },
};
