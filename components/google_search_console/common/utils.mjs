// Returns a new object containing only standard prop fields, removing any custom keys.
// Considered using JSON deep cloning, but opted for a manual approach to safely preserve functions or complex types in future data structures.
export function removeCustomPropFields(input) {
    const blacklist = new Set(["extendedType", "postBody"]);
    const clean = {};
  
    for (const key of Object.keys(input)) {
      const prop = input[key];
      const cloned = {};
  
      for (const field of Object.keys(prop)) {
        if (!blacklist.has(field)) {
          cloned[field] = prop[field];
        }
      }
  
      clean[key] = cloned;
    }
  
    return clean;
  }



// return the trimmed string or input as is if its not a string
export function trimIfString(input) {
    return (typeof input === 'string') ? input.trim() : input; 
};