/**
 * Utility for extracting custom fields from SharePoint list item
 * fields by filtering out known standard/system fields.
 */

/**
 * Known standard SharePoint field internal names.
 * These are fields created by SharePoint itself, not by users.
 */
const STANDARD_FIELDS = new Set([
  "id",
  "Title",
  "ContentType",
  "Created",
  "Modified",
  "Edit",
  "Attachments",
  "FileLeafRef",
  "FileDirRef",
  "File_x0020_Type",
  "DocIcon",
  "FileSizeDisplay",
  "LinkTitle",
  "LinkTitleNoMenu",
  "LinkFilename",
  "LinkFilenameNoMenu",
  "ItemChildCount",
  "FolderChildCount",
  "Order",
  "GUID",
  "UniqueId",
  "ServerUrl",
  "EncodedAbsUrl",
  "BaseName",
  "ProgId",
  "ScopeId",
  "SelectTitle",
  "AccessPolicy",
  "ComplianceAssetId",
]);

/**
 * Determines if a field name represents a standard SharePoint
 * system field rather than a user-created custom column.
 *
 * @param {string} fieldName - The field internal name
 * @returns {boolean} true if this is a standard system field
 */
function isStandardField(fieldName) {
  if (STANDARD_FIELDS.has(fieldName)) {
    return true;
  }
  // System fields start with _ (e.g. _UIVersionString,
  // _ComplianceFlags, _CheckinComment)
  if (fieldName.startsWith("_")) {
    return true;
  }
  // OData metadata fields
  if (fieldName.startsWith("@")) {
    return true;
  }
  // Lookup reference fields (e.g. AuthorLookupId,
  // EditorLookupId, ParentVersionStringLookupId)
  if (fieldName.endsWith("LookupId")) {
    return true;
  }
  return false;
}

/**
 * Extracts custom (user-created) field values from a SharePoint
 * list item fields object by filtering out standard system fields.
 *
 * @param {Object} fields - The fields object from a list item
 * @returns {Object} Custom fields key-value pairs, or empty object
 */
function extractCustomFields(fields) {
  if (!fields) {
    return {};
  }
  const customFields = {};
  for (const [
    key,
    value,
  ] of Object.entries(fields)) {
    if (!isStandardField(key)) {
      customFields[key] = value;
    }
  }
  return customFields;
}

export {
  extractCustomFields,
  isStandardField,
};
