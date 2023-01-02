export default {
  CREATE_TEXT_BOX_FORMAT: [
    {
      value: "html",
      label: "html — The value is HTML and is used unescaped (but sanitized to remove certain tags).",
    },
    {
      value: "text",
      label: "text — The value is Text, any HTML tags are escaped, and line breaks are converted.",
    },
  ],
  CREATE_TEXT_BOX_STYLE_CLASS: [
    "block",
    "quote",
    "note",
    "emphasis",
    "thin",
  ],
};
