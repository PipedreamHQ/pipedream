export function parseJson(value, label) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  if (typeof value !== "string") {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch (err) {
    throw new Error(`${label} must be valid JSON: ${err.message}`);
  }
}

/**
 * Returns a copy of `record` containing only the listed top-level fields.
 */
export function pluck(record, fields) {
  return Object.fromEntries(
    fields
      .filter((field) => field in record)
      .map((field) => [
        field,
        record[field],
      ]),
  );
}

function typed(values, type) {
  return values?.map((text) => ({
    Text: text,
    Type: type,
  }));
}

/**
 * Builds the fields shared by CreateContact and EditContact from flat action props.
 * Name/Company Name mapping differs between people and companies, so it is
 * handled by the callers.
 */
export function buildContactDetails(ctx) {
  const {
    emails, phones, websites, infoType, street, city, state, zip, country,
    jobTitle, backgroundInfo, birthday, assignedTo, customFields,
  } = ctx;

  const details = {};
  if (emails?.length) details.Email = typed(emails, infoType);
  if (phones?.length) details.Phone = typed(phones, infoType);
  if (websites?.length) details.Website = websites.map((Text) => ({
    Text,
  }));
  if (street || city || state || zip || country) {
    details.Address = [
      {
        Street: street,
        City: city,
        State: state,
        Zip: zip,
        Country: country,
        Type: infoType,
      },
    ];
  }
  if (jobTitle) details["Job Title"] = jobTitle;
  if (backgroundInfo) details["Background Info"] = backgroundInfo;
  if (birthday) details.Birthday = birthday;
  if (assignedTo) details.AssignedTo = assignedTo;

  return {
    ...details,
    ...parseJson(customFields, "Custom Fields"),
  };
}

export function contactSummaryName(contact) {
  if (contact.IsCompany) {
    return contact["Company Name"];
  }
  const {
    FirstName, LastName,
  } = contact.Name ?? {};
  return [
    FirstName,
    LastName,
  ].filter(Boolean).join(" ");
}
