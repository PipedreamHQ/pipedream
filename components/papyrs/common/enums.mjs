export default {
  CREATE_PARAGRAPH_HEADING_FORMAT: [
    {
      value: "html",
      label: "html — The value is HTML and is used unescaped (but sanitized to remove certain tags).",
    },
    {
      value: "text",
      label: "text — The value is Text, any HTML tags are escaped, and line breaks are converted.",
    },
  ],
  CREATE_PARAGRAPH_STYLE_CLASS: [
    "block",
    "quote",
    "note",
    "emphasis",
    "thin",
  ],
  CREATE_HEADING_STYLE_CLASS: [
    "line",
    "emphasis",
    "bars",
    "quote",
    "boxquote",
  ],
  CREATE_HEADING_HEADING: [
    "h0",
    "h1",
    "h2",
    "h3",
    "h4",
  ],
};
