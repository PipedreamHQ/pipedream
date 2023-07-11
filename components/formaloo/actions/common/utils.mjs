export const prepareData = (data) => {
  const responseObj = {};
  for (const [
    key,
    value,
  ] of Object.entries(data)) {
    const el = getKey(key);
    responseObj[el] = value;
  }
  return responseObj;
};

const getKey = (key) => {
  const elements = {
    fullName: "full_name",
    firstName: "first_name",
    lastName: "last_name",
    phoneNumber: "phone_number",
    customerData: "customer_data",
  };

  return elements[key] || key;
};
