const SHARING_LINK_TYPE_OPTIONS = [
  {
    label: "Create a read-only link to the DriveItem",
    value: "view",
  },
  {
    label: "Create a read-write link to the DriveItem",
    value: "edit",
  },
  {
    label: "Create an embeddable link to the DriveItem. Only available for files in OneDrive personal.",
    value: "embed",
  },
];

const SHARING_LINK_SCOPE_OPTIONS = [
  {
    label: "Anyone with the link has access, without needing to sign in",
    value: "anonymous",
  },
  {
    label: "Anyone signed into your organization can use the link. Only available in OneDrive for Business and SharePoint.",
    value: "organization",
  },
];

const PDF_CONVERTIBLE_FORMATS = [
  "doc",
  "docx",
  "dot",
  "dotx",
  "dotm",
  "dsn",
  "dwg",
  "eml",
  "epub",
  "fluidframework",
  "form",
  "htm",
  "html",
  "loop",
  "loot",
  "markdown",
  "md",
  "msg",
  "note",
  "odp",
  "ods",
  "odt",
  "page",
  "pps",
  "ppsx",
  "ppt",
  "pptx",
  "pulse",
  "rtf",
  "task",
  "tif",
  "tiff",
  "wbtx",
  "whiteboard",
  "xls",
  "xlsm",
  "xlsx",
];

const HTML_CONVERTIBLE_FORMATS = [
  "loop",
  "fluid",
  "wbtx",
];
const RETURN_CONTENT_TYPE_OPTIONS = [
  {
    label: "Only Files",
    value: "files",
  },
  {
    label: "Only Folders",
    value: "folders",
  },
  {
    label: "Both Files and Folders",
    value: "all",
  },
];

export default {
  SHARING_LINK_TYPE_OPTIONS,
  SHARING_LINK_SCOPE_OPTIONS,
  PDF_CONVERTIBLE_FORMATS,
  HTML_CONVERTIBLE_FORMATS,
  RETURN_CONTENT_TYPE_OPTIONS,
};
