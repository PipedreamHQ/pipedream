const timezoneNames = [
  "-8 (PST)",
  "-7 (MST)",
  "-6 (CST)",
  "-5 (EST)",
  "-4 (AST)",
  "-3 (BRT)",
  "-2",
  "-1",
  "0 (GMT)",
  "+1 (CET)",
  "+2 (EET)",
  "+3 (MSK)",
  "+4",
];
let initialValue = -9 * 60;

function getTimezoneString() {
  const value = (initialValue += 60);
  return value > 0
    ? `+${value}`
    : value.toString();
}

const timezoneOptions = timezoneNames.map((name) => ({
  label: "UTC " + name,
  value: getTimezoneString(),
}));

export default timezoneOptions;
