export const orderOptions = [
  "+first_name",
  "+last_name",
  "+company",
  "+industry",
  "+website",
  "+linkedin_url",
  "+tags",
  "+title",
  "+phone",
  "+address",
  "+city",
  "+state",
  "+country",
  "-first_name",
  "-last_name",
  "-company",
  "-industry",
  "-website",
  "-linkedin_url",
  "-tags",
  "-title",
  "-phone",
  "-address",
  "-city",
  "-state",
  "-country",
];

export const removeEmpty = (obj) => {
  return Object.fromEntries(Object.entries(obj).filter(([
    // eslint-disable-next-line no-unused-vars
    _,
    v,
  ]) => (v != "" && v != null)));
};
