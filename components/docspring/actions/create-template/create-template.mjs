import { ConfigurationError } from "@pipedream/platform";
import docspring from "../../docspring.app.mjs";
import utils from "../../common/utils.mjs";

const HTML_PROPS = {
  html: "HTML",
  scss: "SCSS",
  headerHtml: "Header HTML",
  footerHtml: "Footer HTML",
};

const FIELD_DETECTION_PROPS = {
  fieldSource: "Field Source",
  fieldNaming: "Field Naming",
  fieldLogic: "Field Logic",
};

export default {
  key: "docspring-create-template",
  name: "Create Template",
  description: "Create a template from a PDF (a public URL or a file in `/tmp`) or from HTML and SCSS."
    + " For a PDF, **Detect Fields** sets up its fields with AI, as DocSpring's \"Automatically detect fields\" upload option does."
    + " Returns the template; `ready` says whether it can generate PDFs yet, and `document.state` how its PDF is processing."
    + " Use **Generate PDF** with its `id` next, or **Replace Template PDF** to change its PDF later."
    + " [See the documentation](https://docspring.com/docs/api/#tag/templates/post/templates)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    docspring,
    name: {
      type: "string",
      label: "Name",
      description: "The template's name, e.g. `Rental Agreement`.",
    },
    templateType: {
      type: "string",
      label: "Template Type",
      description: "`pdf` places fields on a PDF you provide; `html` renders a PDF from HTML and SCSS. It can't be changed later. e.g. `pdf`.",
      options: [
        {
          label: "PDF",
          value: "pdf",
        },
        {
          label: "HTML",
          value: "html",
        },
      ],
      default: "pdf",
    },
    document: {
      propDefinition: [
        docspring,
        "document",
      ],
      description: "PDF templates only: the PDF, as a public `https://` URL that DocSpring downloads (up to 100 MB), e.g. `https://example.com/form.pdf`,"
        + " or a file in `/tmp` (up to 7 MB), e.g. `/tmp/form.pdf`.",
      optional: true,
    },
    filename: {
      propDefinition: [
        docspring,
        "filename",
      ],
    },
    detectFields: {
      type: "boolean",
      label: "Detect Fields",
      description: "PDF templates only: `true` imports the PDF's form fields or detects its fields, names them with AI and sets up conditional logic. e.g. `true`.",
      optional: true,
    },
    fieldSource: {
      type: "string",
      label: "Field Source",
      description: "With **Detect Fields**: where the fields come from. `auto` (the default) imports a fillable PDF's fields and detects the fields of other PDFs;"
        + " `pdf_detection` always detects them; `pdf_form_fields` only imports form fields. e.g. `auto`.",
      options: [
        "auto",
        "pdf_detection",
        "pdf_form_fields",
      ],
      optional: true,
    },
    fieldNaming: {
      type: "string",
      label: "Field Naming",
      description: "With **Detect Fields**: `ai` (the default) names the fields and sets their types with AI; `preserve` keeps the PDF's form field names. e.g. `ai`.",
      options: [
        "ai",
        "preserve",
      ],
      optional: true,
    },
    fieldLogic: {
      type: "string",
      label: "Field Logic",
      description: "With **Detect Fields**: `ai` (the default) sets up conditional logic and required fields with AI; `none` doesn't. e.g. `none`.",
      options: [
        "ai",
        "none",
      ],
      optional: true,
    },
    html: {
      type: "string",
      label: "HTML",
      description: "HTML templates only: the HTML, as a Liquid template that uses your data, e.g. `<h1>Invoice for {{ customer_name }}</h1>`.",
      optional: true,
    },
    scss: {
      type: "string",
      label: "SCSS",
      description: "HTML templates only: the SCSS for the HTML, e.g. `h1 { color: #333; }`.",
      optional: true,
    },
    headerHtml: {
      type: "string",
      label: "Header HTML",
      description: "HTML templates only: HTML printed at the top of each page, e.g. `<div class=\"header\">ACME Inc.</div>`.",
      optional: true,
    },
    footerHtml: {
      type: "string",
      label: "Footer HTML",
      description: "HTML templates only: HTML printed at the bottom of each page, e.g. `<div class=\"footer\">Confidential</div>`.",
      optional: true,
    },
    folderId: {
      propDefinition: [
        docspring,
        "folderId",
      ],
      description: "The folder to put the template in, e.g. `fld_1234567890abcdef01`. Use **List Folders** to find it (the `id` field)."
        + " Leave blank for the root folder.",
      optional: true,
    },
    wait: {
      propDefinition: [
        docspring,
        "wait",
      ],
      description: "`true` (the default) waits until the template's PDF has been downloaded and processed. `false` returns at once:"
        + " check `ready` later with **Get Template**. e.g. `true`.",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    /**
     * The labels of the filled-in inputs among `props` (a map of prop name to label).
     * @param {object} props
     * @returns {string[]}
     */
    filledIn(props) {
      return Object.entries(props)
        .filter(([
          prop,
        ]) => !utils.isBlank(this[prop]))
        .map(([
          , label,
        ]) => label);
    },
  },
  async run({ $ }) {
    const templateType = this.templateType || "pdf";
    const detectFields = utils.toBoolean(this.detectFields, "Detect Fields");
    let body = {
      name: this.name,
      template_type: templateType,
      parent_folder_id: this.folderId,
    };
    if (templateType === "pdf") {
      const htmlInputs = this.filledIn(HTML_PROPS);
      if (htmlInputs.length) {
        throw new ConfigurationError(`${htmlInputs.join(", ")} only apply to HTML templates`);
      }
      const detectionInputs = this.filledIn(FIELD_DETECTION_PROPS);
      if (detectionInputs.length && !detectFields) {
        throw new ConfigurationError(`${detectionInputs.join(", ")} only apply with **Detect Fields** on`);
      }
      body = {
        ...body,
        ...(await utils.documentParams(this.document, this.filename)),
        detect_fields: detectFields,
        field_source: this.fieldSource,
        field_naming: this.fieldNaming,
        field_logic: this.fieldLogic,
      };
    } else {
      const pdfInputs = this.filledIn({
        document: "PDF File or URL",
        filename: "File Name",
        ...FIELD_DETECTION_PROPS,
      });
      // Detect Fields set to false asks for nothing, so only true counts as a PDF input.
      if (detectFields) {
        pdfInputs.push("Detect Fields");
      }
      if (pdfInputs.length) {
        throw new ConfigurationError(`${pdfInputs.join(", ")} only apply to PDF templates`);
      }
      body = {
        ...body,
        html: this.html,
        scss: this.scss,
        header_html: this.headerHtml,
        footer_html: this.footerHtml,
      };
    }
    const wait = utils.toBoolean(this.wait, "Wait for the PDF") ?? true;
    const template = await this.docspring.createTemplate({
      $,
      params: {
        wait,
      },
      data: utils.compact(body),
    });
    const failure = utils.failureMessage("template", template);
    if (failure) {
      throw new Error(failure);
    }
    $.export("$summary", `Created ${templateType.toUpperCase()} template ${template.id}: ${template.name}`);
    return template;
  },
};
