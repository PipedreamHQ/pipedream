export default {
  formatObjectArray: (objectArray) => {
    if (!objectArray) {
      return [];
    }
    if (typeof (objectArray) === "string") {
      return JSON.parse(objectArray);
    }
    let parsedObjectArray = [];
    for (let object of objectArray) {
      if (!object) {
        continue;
      }
      if (typeof (object) === "string") {
        object = JSON.parse(object);
      }
      parsedObjectArray.push(object);
    }
    return parsedObjectArray;
  },
}