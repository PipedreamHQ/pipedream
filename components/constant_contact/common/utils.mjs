export const prepareData = (contact, {
  emailAddress,
  permissionToSend,
  firstName,
  lastName,
  jobTitle,
  companyName,
  updateSource,
  birthdayMonth,
  birthdayDay,
  aniversary,
  customFields,
  phoneNumbers,
  streetAddresses,
  listMembership,
  taggings,
  notes,
}) => {
  if (emailAddress) contact.email_address.address = emailAddress;
  if (permissionToSend) contact.email_address.permission_to_send = permissionToSend;
  if (firstName) contact.first_name = firstName;
  if (lastName) contact.last_name = lastName;
  if (jobTitle) contact.job_title = jobTitle;
  if (companyName) contact.company_name = companyName;
  if (updateSource) contact.update_source = updateSource;
  if (birthdayMonth) contact.birthday_month = birthdayMonth;
  if (birthdayDay) contact.birthday_day = birthdayDay;
  if (aniversary) contact.aniversary = aniversary;
  if (customFields.length) contact.custom_fields = customFields.map((item) => JSON.parse(item));
  if (phoneNumbers.length) contact.phone_numbers = phoneNumbers.map((item) => JSON.parse(item));
  if (streetAddresses.length)
    contact.street_addresses = streetAddresses.map((item) => JSON.parse(item));
  if (listMembership.length) contact.list_memberships = listMembership;
  if (notes.length) contact.notes = notes.map((item) => JSON.parse(item));
  if (taggings.length) contact.taggings = taggings;

  return contact;
};
