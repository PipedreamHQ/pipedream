const DEFAULT_LIMIT = 50;

const SORT_COLUMNS = [
  {
    label: "Custom Order (ASC)",
    value: "Notebook.CustomOrder",
  },
  {
    label: "Created Time (ASC)",
    value: "Notebook.CreatedTime",
  },
  {
    label: "Created Time (DESC)",
    value: "-Notebook.CreatedTime",
  },
  {
    label: "Last Modified Time (ASC)",
    value: "Notebook.LastModifiedTime",
  },
  {
    label: "Last Modified Time (DESC)",
    value: "-Notebook.LastModifiedTime",
  },
  {
    label: "Last Accessed (ASC)",
    value: "Notebook.LastAccessed",
  },
  {
    label: "Last Accessed (DESC)",
    value: "-Notebook.LastAccessed",
  },
  {
    label: "Alphabet (ASC)",
    value: "Notebook.Alphabet",
  },
  {
    label: "Alphabet (DESC)",
    value: "-Notebook.Alphabet",
  },
];

export default {
  DEFAULT_LIMIT,
  SORT_COLUMNS,
};
