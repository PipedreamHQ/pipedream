// Drops unset props (undefined, null, "", empty arrays) so the API only sees chosen fields.
export const cleanBody = (body) => {
  const isSet = (value) => value !== undefined && value !== null && value !== ""
    && !(Array.isArray(value) && !value.length);
  return Object.fromEntries(Object.entries(body).filter((entry) => isSet(entry[1])));
};
