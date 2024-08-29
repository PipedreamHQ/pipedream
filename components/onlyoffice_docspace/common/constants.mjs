const SUBDOMAIN_PLACEHOLDER = "{subdomain}";
const VERSION_PATH = "/api/2.0";
const BASE_URL = `https://${SUBDOMAIN_PLACEHOLDER}.onlyoffice.com${VERSION_PATH}`;

const FILE_PROP_NAMES = [
  "File",
];

const CONTENT_TYPE_KEY_HEADER = "Content-Type";
const MULTIPART_FORM_DATA_VALUE_HEADER = "multipart/form-data";
const MULTIPART_FORM_DATA_HEADERS = {
  [CONTENT_TYPE_KEY_HEADER]: MULTIPART_FORM_DATA_VALUE_HEADER,
};

const RESOURCE_NAME = {
  FILES: "files",
  FOLDERS: "folders",
};

const FILTER_TYPE = {
  NONE: "None",
  FILES_ONLY: "FilesOnly",
  FOLDERS_ONLY: "FoldersOnly",
  DOCUMENTS_ONLY: "DocumentsOnly",
  PRESENTATIONS_ONLY: "PresentationsOnly",
  SPREADSHEETS_ONLY: "SpreadsheetsOnly",
  IMAGES_ONLY: "ImagesOnly",
  BY_USER: "ByUser",
  BY_DEPARTMENT: "ByDepartment",
  ARCHIVE_ONLY: "ArchiveOnly",
  BY_EXTENSION: "ByExtension",
  MEDIA_ONLY: "MediaOnly",
  EDITING_ROOMS: "EditingRooms",
  CUSTOM_ROOMS: "CustomRooms",
  OFORM_TEMPLATE_ONLY: "OFormTemplateOnly",
  OFORM_ONLY: "OFormOnly",
};

export default {
  SUBDOMAIN_PLACEHOLDER,
  BASE_URL,
  VERSION_PATH,
  RESOURCE_NAME,
  FILTER_TYPE,
  FILE_PROP_NAMES,
  MULTIPART_FORM_DATA_VALUE_HEADER,
  MULTIPART_FORM_DATA_HEADERS,
  CONTENT_TYPE_KEY_HEADER,
};
