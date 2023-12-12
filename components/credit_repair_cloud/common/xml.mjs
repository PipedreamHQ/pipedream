import js2xmlparser from "js2xmlparser";
import xml2js from "xml2js";

export const convertToXML = (data) => {
  let xml = js2xmlparser.parse("crcloud", data);
  // Remove all new lines, tabs, and multiple spaces with single space
  xml = xml.replace(/\s+/g, " ");
  // Remove spaces between tags
  xml = xml.replace(/> </g, "><");

  return xml;
};

export const convertToJSON = async (data) => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(data, (err, result) => {
      if (err) {
        reject(err);
      }

      resolve(result);
    });
  });
};

export const checkForSuccess = (data) => {
  if (data.response?.success[0] === "True") {
    return;
  }

  console.log(data);
  const {
    error_no,
    error_message,
  } = data.response?.result[0]?.errors[0] ?? {};

  if (!error_no || !error_message) {
    throw new Error("Unknown error");
  }

  throw new Error(`Error ${error_no[0]}: ${error_message[0]}`);
};

export const getResult = (data) => {
  const newObj = {
    ...data.response?.result[0],
  };
  for (const prop in newObj) {
    newObj[prop] = newObj[prop][0];
  }
  return newObj;
};
