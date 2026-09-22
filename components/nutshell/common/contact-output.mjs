/**
 * Standard list of contact fields to include in client output.
 * Edit this array to add/remove fields returned from get-contact, create-contact, etc.
 *
 * Nutshell getContact / full Contact _render() uses "email" and "phone" (object maps);
 * search stubs may expose primaryEmail, primaryPhone, emails, or phones. We keep
 * both shapes so all callers receive what the API returns.
 *
 * Pipeline-specific custom fields from findCustomFields are returned under customFields
 * when present on the entity. Other documented pass-through fields below avoid dropping
 * RPC data (same pattern as email/phone).
 */
export const CONTACT_OUTPUT_FIELDS = [
  "id",
  "name",
  "entityType",
  "rev",
  "htmlUrl",
  "email",
  "emails",
  "phone",
  "phones",
  "primaryEmail",
  "primaryPhone",
  "description",
  "address",
  "url",
  "tags",
  "notes",
  "territory",
  "createdTime",
  "modifiedTime",
  "lastContactedDate",
  "contactedCount",
  "customFields",
];

/**
 * Returns a contact object with only the standard output fields.
 * Use wherever a contact is returned to clients (get-contact, create-contact, etc.).
 * @param {object|null|undefined} contact - Raw contact from Nutshell API
 * @returns {object|null} Contact with only CONTACT_OUTPUT_FIELDS
 */
export const formatContact = (contact) => {
  if (contact == null) {
    return null;
  }
  const out = {};
  for (const key of CONTACT_OUTPUT_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(contact, key)) {
      out[key] = contact[key];
    }
  }
  return out;
};
