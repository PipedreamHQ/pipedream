const DESIGN_TYPE_OPTIONS = [
  {
    label: "Provide the common design type",
    value: "preset",
  },
  {
    label: "Provide the width and height to define a custom design type",
    value: "custom",
  },
];

const DESIGN_TYPE_NAME_OPTIONS = [
  {
    label: "Doc: A document for Canva's online text editor",
    value: "doc",
  },
  {
    label: "Whiteboard: A design which gives you infinite space to collaborate",
    value: "whiteboard",
  },
  {
    label: "Presentation: Lets you create and collaborate for presenting to an audience",
    value: "presentation",
  },
  {
    label: "Email: A design for an email",
    value: "email",
  },
];

const EXPORT_TYPES = [
  "pdf",
  "jpg",
  "png",
  "pptx",
  "gif",
  "mp4",
];

const MP4_QUALITY = [
  "horizontal_480p",
  "horizontal_720p",
  "horizontal_1080p",
  "horizontal_4k",
  "vertical_480p",
  "vertical_720p",
  "vertical_1080p",
  "vertical_4k",
];

const EXPORT_QUALITY = [
  "regular",
  "pro",
];

const PAPER_SIZE = [
  "a4",
  "a3",
  "letter",
  "legal",
];

const OWNERSHIP_OPTIONS = [
  {
    label: "Any (owned by and shared with the user)",
    value: "any",
  },
  {
    label: "Owned (owned by the user)",
    value: "owned",
  },
  {
    label: "Shared (shared with the user)",
    value: "shared",
  },
];

const SORT_BY_OPTIONS = [
  {
    label: "Relevance",
    value: "relevance",
  },
  {
    label: "Modified (newest first)",
    value: "modified_descending",
  },
  {
    label: "Modified (oldest first)",
    value: "modified_ascending",
  },
  {
    label: "Title (Z to A)",
    value: "title_descending",
  },
  {
    label: "Title (A to Z)",
    value: "title_ascending",
  },
];

const FOLDER_ITEM_TYPE_OPTIONS = [
  "design",
  "folder",
  "image",
  "brand_template",
];

const FOLDER_ITEM_SORT_BY_OPTIONS = [
  "modified_descending",
  "modified_ascending",
  "created_descending",
  "created_ascending",
  "title_ascending",
  "title_descending",
];

const PIN_STATUS_OPTIONS = [
  "any",
  "pinned",
];

const BRAND_TEMPLATE_OWNERSHIP_OPTIONS = [
  "any",
  "owned",
  "shared",
];

const BRAND_TEMPLATE_SORT_BY_OPTIONS = [
  "relevance",
  "modified_descending",
  "modified_ascending",
  "title_descending",
  "title_ascending",
];

const BRAND_TEMPLATE_DATASET_OPTIONS = [
  "any",
  "non_empty",
];

const AUTOFILL_TYPE_OPTIONS = [
  "create_from_brand_template",
  "create_from_design",
];

const PARENT_FOLDER_SPECIAL_VALUES = [
  "root",
  "uploads",
];

const JOB_STATUS = {
  IN_PROGRESS: "in_progress",
  SUCCESS: "success",
  FAILED: "failed",
};

export default {
  DESIGN_TYPE_OPTIONS,
  DESIGN_TYPE_NAME_OPTIONS,
  EXPORT_TYPES,
  MP4_QUALITY,
  EXPORT_QUALITY,
  PAPER_SIZE,
  OWNERSHIP_OPTIONS,
  SORT_BY_OPTIONS,
  FOLDER_ITEM_TYPE_OPTIONS,
  FOLDER_ITEM_SORT_BY_OPTIONS,
  PIN_STATUS_OPTIONS,
  BRAND_TEMPLATE_OWNERSHIP_OPTIONS,
  BRAND_TEMPLATE_SORT_BY_OPTIONS,
  BRAND_TEMPLATE_DATASET_OPTIONS,
  AUTOFILL_TYPE_OPTIONS,
  PARENT_FOLDER_SPECIAL_VALUES,
  JOB_STATUS,
};
