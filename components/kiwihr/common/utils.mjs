export const parseError = (response) => {
  const errors = response.errors[0].data;
  const errorsArray = Object.entries(errors);
  const error = errorsArray[0];
  return `${error[0]} ${error[1].message}`;
};
