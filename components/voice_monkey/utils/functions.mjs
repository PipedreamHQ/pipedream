const objectFilterNull = (obj) => Object.fromEntries(
  Object.entries(obj).filter(([
    ,
    value,
  ]) => !!value),
);

export {
  objectFilterNull,
};

