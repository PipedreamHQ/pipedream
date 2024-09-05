const PRINTED_FORMAT_OPTIONS = [
  {
    value: "Pdf",
    label: "Portable Document Format (.pdf)",
  },
  {
    value: "Docx",
    label: "OpenXML, Microsoft Word (.docx)",
  },
  {
    value: "Doc",
    label: "Microsoft Word 97-2003 (.doc)",
  },
  {
    value: "Rtf",
    label: "Rich Text Format (.rtf)",
  },
  {
    value: "Epub",
    label: "E-books and other digital publications (.epub)",
  },
  {
    value: "Odt",
    label: "OpenDocument, OpenOffice.org file format (.odt)",
  },
  {
    value: "Mht",
    label: "Web archive in one file (.mht)",
  },
];

const OTHER_FORMAT_OPTIONS = [
  {
    value: "WebHelp",
    label: "HTML5 Web Help (no border, built-in search, page tree and index, one .zip archive)",
  },
  {
    value: "PureHtml",
    label: "HTML files (page content without user interface in one .zip archive)",
  },
  {
    value: "Chm",
    label: "Microsoft Compiled HTML Help (.chm)",
  },
];

export default {
  PRINTED_FORMAT_OPTIONS,
  OTHER_FORMAT_OPTIONS,
};
