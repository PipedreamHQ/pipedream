import craftmypdf from "../../craftmypdf.app.mjs";

export default {
  key: "craftmypdf-create-editor-session",
  name: "Create Editor Session",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new PDF editor session. The PDF editor url can be embedded into an IFrame. [See the documentation](https://craftmypdf.com/docs/index.html#tag/Template-Management-API/operation/delete-template)",
  type: "action",
  props: {
    craftmypdf,
    templateId: {
      propDefinition: [
        craftmypdf,
        "templateId",
      ],
    },
    expiration: {
      propDefinition: [
        craftmypdf,
        "expiration",
      ],
    },
    canSave: {
      type: "boolean",
      label: "Can Save",
      description: "Can save the template. Default to `true`.",
      optional: true,
    },
    canCreatePDF: {
      type: "boolean",
      label: "Can Create PDF",
      description: "Can Generate PDF. Default to `true`.",
      optional: true,
    },
    canViewSettings: {
      type: "boolean",
      label: "Can View Settings",
      description: "Can view settings. Default to `true`.",
      optional: true,
    },
    canPreview: {
      type: "boolean",
      label: "Can Preview",
      description: "Can preview. Default to `true`.",
      optional: true,
    },
    canEditJSON: {
      type: "boolean",
      label: "Can Edit JSON",
      description: "Can edit JSON. Default to `true`.",
      optional: true,
    },
    canShowHeader: {
      type: "boolean",
      label: "Can Show Header",
      description: "Show CraftMyPDF header. Default to `true`.",
      optional: true,
    },
    canShowLayers: {
      type: "boolean",
      label: "Can Show Layers",
      description: "Show layer dialogue. Default to `true`.",
      optional: true,
    },
    canShowPropertyPanel: {
      type: "boolean",
      label: "Can Show Property Panel",
      description: "Show property panel. Default to `true`.",
      optional: true,
    },
    canShowHelp: {
      type: "boolean",
      label: "Can Show Help",
      description: "Show `Help` tab. Default to `true`.",
      optional: true,
    },
    canShowData: {
      type: "boolean",
      label: "Can Show Data",
      description: "Show `Data` tab. Default to `true`.",
      optional: true,
    },
    canShowExpressionDoc: {
      type: "boolean",
      label: "Can Show Expression Doc",
      description: "Show `Expression Doc` tab. Default to `true`.",
      optional: true,
    },
    canShowPropertyBinding: {
      type: "boolean",
      label: "Can Show Property Binding",
      description: "Show `Property Bind` tab for element. Default to `true`.",
      optional: true,
    },
    canShowBackURL: {
      type: "boolean",
      label: "Can Show Back URL",
      description: "Show `BackURL` button. Default to `true`.",
      optional: true,
    },
    jsonMode: {
      type: "integer",
      label: "JSON Mode",
      description: "JSON editor - `1`, JSON viewer - `2`.",
      optional: true,
    },
    backURL: {
      type: "string",
      label: "Back URL",
      description: "The URL for the back button",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      craftmypdf,
      templateId,
      ...data
    } = this;

    const response = await craftmypdf.createEditorSession({
      $,
      data: {
        ...data,
        template_id: templateId,
      },
    });

    $.export("$summary", "A new editor session was successfully created!");
    return response;
  },
};
