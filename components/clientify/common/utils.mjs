export const prepareData = (data) => {
  const responseObj = {};
  for (const [
    key,
    value,
  ] of Object.entries(data)) {
    const el = getKey(key);
    responseObj[el] = getValue(key, value, responseObj);
  }
  return responseObj;
};

const getKey = (key) => {
  const elements = {
    firstName: "first_name",
    lastName: "last_name",
    contactType: "contact_type",
    contactSource: "contact_source",
    customFields: "custom_fields",
  };

  return elements[key] || key;
};

const getValue = (key, value, obj) => {
  switch (key) {
  case "customFields": return Object.keys(value).map((key) => ({
    field: key,
    value: value[key],
  }));
  case "address": return [
    {
      street: obj.street,
      city: obj.city,
      state: obj.state,
      country: obj.country,
      postal_code: obj.postalCode,
      type: obj.addressType,
    },
  ];
  default: return value;
  }
};
