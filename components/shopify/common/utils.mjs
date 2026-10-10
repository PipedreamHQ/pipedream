import {
  Kind, parse,
} from "graphql";

function getIdFromGid(gid) {
  return gid.split("/").pop();
}

function parseJson(obj) {
  if (!obj) return undefined;

  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === "string") {
        try {
          return JSON.parse(item);
        } catch (e) {
          return item;
        }
      }
      return item;
    });
  }
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch (e) {
      return obj;
    }
  }
  return obj;
}

function getOperationTypes(document) {
  return parse(document).definitions
    .filter(({ kind }) => kind === Kind.OPERATION_DEFINITION)
    .map(({ operation }) => operation);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default {
  getIdFromGid,
  parseJson,
  getOperationTypes,
  delay,
};
