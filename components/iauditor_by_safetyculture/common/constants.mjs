const DEFAULT_LIMIT = 25;

const SEAT_TYPES = [
  "full",
  "free",
];

const PERMISSIONS = [
  "view",
  "edit",
  "delete",
];

const USER_STATUS = [
  "active",
  "inactive",
];

const EXPORT_TYPES = [
  "DOCUMENT_TYPE_UNSPECIFIED",
  "DOCUMENT_TYPE_PDF",
  "DOCUMENT_TYPE_WORD",
  "DOCUMENT_TYPE_MEDIA",
  "DOCUMENT_TYPE_EXCEL",
  "DOCUMENT_TYPE_JSON",
  "DOCUMENT_TYPE_CSV",
  "DOCUMENT_TYPE_CSV_MEDIA",
  "DOCUMENT_TYPE_CSV_EXCEL",
];

export default {
  DEFAULT_LIMIT,
  SEAT_TYPES,
  PERMISSIONS,
  USER_STATUS,
  EXPORT_TYPES,
};
