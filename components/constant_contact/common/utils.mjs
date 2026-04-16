import _ from "lodash";

export const prepareData = async (contact, {
  emailAddress,
  permissionToSend,
  firstName,
  lastName,
  jobTitle,
  companyName,
  createSource,
  updateSource,
  birthdayMonth,
  birthdayDay,
  anniversary,
  listMemberships,
  taggings,
  numberOfPhoneNumbers,
  numberOfStreetAddresses,
  numberOfNotes,
  ...data
}, listCustomFields) => {

  const { custom_fields: customFields } = await listCustomFields();

  const preparedCustomFields = customFields.map(
    ({ custom_field_id: id }) => getCustomField(id, data),
  );

  const phoneNumbers = Array.from({
    length: numberOfPhoneNumbers,
  }).map((_, index) => getPhoneNumber(index, data));

  const streetAddresses = Array.from({
    length: numberOfStreetAddresses,
  }).map((_, index) => getStreetAddress(index, data));

  const notes = Array.from({
    length: numberOfNotes,
  }).map((_, index) => getNotes(index, data));

  return _.merge(
    contact,
    _.omitBy(_.pickBy({
      email_address: _.pickBy({
        address: emailAddress,
        permission_to_send: permissionToSend,
      }),
      first_name: firstName,
      last_name: lastName,
      job_title: jobTitle,
      company_name: companyName,
      create_source: createSource,
      update_source: updateSource,
      birthday_month: birthdayMonth,
      birthday_day: birthdayDay,
      anniversary,
      custom_fields: concat(contact.custom_fields, preparedCustomFields),
      phone_numbers: concat(contact.phone_numbers, phoneNumbers),
      street_addresses: concat(contact.street_addresses, streetAddresses),
      list_memberships: listMemberships,
      notes: concat(contact.notes, notes),
      taggings: taggings,
    }), _.isEmpty),
  );
};

const concat = (obj1, obj2) => {
  return rejectEmpty(_.concat(obj1, obj2));
};

const rejectEmpty = (obj) => {
  return _.reject(obj, (i) => _.isEmpty(i));
};

const getCustomField = (id, data) => {
  const { [`customField_${id}`]: value } = data;
  return value
    ? {
      custom_field_id: id,
      value,
    }
    : false;
};

const getNotes = (index, data) => {
  const { [`notes_${index}`]: content } = data;
  return {
    content,
  };
};

const getPhoneNumber = (index, data) => {
  const {
    [`phoneNumberKind_${index}`]: kind,
    [`phoneNumberValue_${index}`]: phone_number,
  } = data;
  return {
    kind,
    phone_number,
  };
};

const getStreetAddress = (index, data) => {
  const {
    [`streetAddressKind_${index}`]: kind,
    [`streetAddressStreet_${index}`]: street,
    [`streetAddressCity_${index}`]: city,
    [`streetAddressState_${index}`]: state,
    [`streetAddressPostalCode_${index}`]: postal_code,
    [`streetAddressCountry_${index}`]: country,
  } = data;
  return {
    kind,
    street,
    city,
    state,
    postal_code,
    country,
  };
};

export const parseObject = (obj) => {
  if (!obj) return undefined;

  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === "string") {
        try {
          return JSON.parse(item);
        } catch (e) {
          return item;
        }
      }
      return item;
    });
  }
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch (e) {
      return obj;
    }
  }
  return obj;
};
