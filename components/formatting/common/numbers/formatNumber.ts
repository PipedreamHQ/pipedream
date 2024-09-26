export default function (
  integer: string,
  decimal?: string,
  groupChar = ",",
  decimalChar = ".",
) {
  const result = [];

  if (groupChar) {
    for (let i = integer.length; i > 0; i -= 3) {
      result.push(groupChar, integer.slice(Math.max(0, i - 3), i));
    }
    result.reverse().pop();
  } else result.push(integer);

  if (decimal) {
    result.push(decimalChar + decimal);
  }

  return result.join("");
}
