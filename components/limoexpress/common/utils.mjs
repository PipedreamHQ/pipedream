import { ConfigurationError } from "@pipedream/platform";

export const throwError = (response) => {
  const errors = Object.keys(response.data.errors);
  throw new ConfigurationError(response.data.errors[errors[0]]?.[0]);
};

export const checkNumbers = (numbers, lastNumber) => {
  return (parseInt(numbers[1]) < parseInt(lastNumber[1])) ||
    ((parseInt(numbers[1]) >= parseInt(lastNumber[1])) &&
    (parseInt(numbers[0]) <= parseInt(lastNumber[0])));
};
