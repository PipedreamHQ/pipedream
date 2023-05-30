import _ from "lodash";

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
  anniversary,
  customFields = [],
  phoneNumbers = [],
  streetAddresses = [],
  listMemberships,
  taggings,
  notes = [],
}) => {
  return _.merge(
    contact,
    _.pickBy({
      email_address: _.pickBy({
        address: emailAddress,
        permission_to_send: permissionToSend,
      }),
      first_name: firstName,
      last_name: lastName,
      job_title: jobTitle,
      company_name: companyName,
      update_source: updateSource,
      birthday_month: birthdayMonth,
      birthday_day: birthdayDay,
      anniversary,
      custom_fields: customFields.length
        ? customFields.map((item) => JSON.parse(item))
        : null,
      phone_numbers: phoneNumbers.length
        ? phoneNumbers.map((item) => JSON.parse(item))
        : null,
      street_addresses: streetAddresses.length
        ? streetAddresses.map((item) => JSON.parse(item))
        : null,
      list_memberships: listMemberships,
      notes: notes.length
        ? notes.map((item) => JSON.parse(item))
        : null,
      taggings: taggings,
    }),
  );
};
