
export default {

isString(input){
  return typeof input === "string";
},

isNumber(input){
  return typeof input === "number";
},

isEmptySting(input){
  if(this.isString(input)){
    if(input.trim() === "") return true;
  };

  return false;
},

isIdNumber(input){
  return Number.isInteger(input) && input > 0;
},

isObject(input) {
  return ( 
    typeof input === "object" && 
    input !== null && 
    !Array.isArray(input)
  );
},

isArrayOfStrings(input){

  if (!Array.isArray(input)) return false;

  for (let i = 0; i < input.length; i++) {
    if (!this.isString(input[i]))
      return false;
    };

  return true;
},

isFormData(input) {
  return (
    typeof input === "object" &&
    input !== null &&
    typeof input.getHeaders === "function" &&
    typeof input.append === "function"
  );
},


/* ===================================================================================================
    Return the trimmed string or input as is if it's not a string
====================================================================================================== */
trimIfString(input) {
  return (typeof input === 'string') ? input.trim() : input; 
},


/* ===================================================================================================
  Function tries to parse the input as JSON, If it is not return the value as it was passed 
//====================================================================================================*/
  parseIfJSONString(input) {

    if (typeof input === "string") {
      try {
        return JSON.parse(input);
      } catch (error) {
        // Parsing failed — return original input
        return input;
      }
    }

    // If input is not a string, just return it as-is
    return input;
  },

/* ===================================================================================================
    Validates a URL string:
    - Rejects blank strings, spaces, tabs, and newlines
    - Warns about suspicious or unusual characters
    - Adds a warning if protocol is missing or malformed
====================================================================================================== */
  checkIfUrlValid(input) {
  
    // Warnin accumulator
    let warnings = [];

    if (!this.isString(input)) {
      warnings.push('URL is not a string');
     
    };

    if (this.isEmptySting(input)) {
      warnings.push('URL is empty string');
      return warnings;
    };


    const trimmedInput = input.trim();

    // Reject if spaces, tabs, or newlines are present
    if ((/[ \t\n]/.test(trimmedInput))) {
      warnings.push( `Url contains invalid characters like space, backslash etc., please check.`  +  this._reasonMsg(input));
      return warnings;
    };
  
  // Warn about suspicious characters
    const dubiousCharRegex = /[\\<>{}|"`^]|[\u200B\u200C\u200D\u2060\uFEFF\u00A0]/g;

    const dubiousMatches = trimmedInput.match(dubiousCharRegex);

    if (dubiousMatches) {
      const uniqueChars = [...new Set(dubiousMatches)].join(" ");
         warnings.push(` URL contains dubious or non-standard characters ` + this._reasonMsg(input) );
    };

    // urlObject for further use if the next check passes.
    let urlObject; 
    // Tries to create a new URL object with the input string;
    try {
      urlObject =  new URL(trimmedInput); // throws if invalid or has no protocol

      // Warn if user typed only one slash (e.g., https:/)
      if (/^(https?):\/(?!\/)/.test(input)) {

         warnings.push(` It looks like you're missing one slash after "${urlObject.protocol}".` + 
        `Did you mean "${urlObject.protocol}//..."? ${this._reasonMsg(input)} `);
        
      };

    } catch (err) {
      // If the URL is invalid, try to create a new URL object with "http://" in case user forgot to add it;
        try  { 
          // If it works then there was no protocol in the input string;
          urlObject = new URL("http://" + trimmedInput); 

          warnings.push(` URL does not have http or https protocol "`);
                    
        } catch(err) {
          // If after all checks we are here that means that the url contain potentially unacceptable characters.
          warnings.push(` URL contains potentionally unacceptable characters"  ${this._reasonMsg(input)}`);

        };

    };

    return warnings;
    
  },

  /* ===================================================================================================
    Validates a Site Identifier string, which may be either:
    - A numeric Site ID (e.g., "123456")
    - A custom or subdomain (e.g., "mysite.example.com")
====================================================================================================== */

  checkDomainOrId(input) {
    
    const warnings = [];

    // If it's an ID like number or string (e.g 12345 or "12345");
    // it's Valid. Return empty warnings array.
    if(this.isIdNumber(Number(input))) return warnings;

    // If it's not a string.
    if (!this.isString(input)) {
      warnings.push("Provided value is not a domain or ID-like value (e.g., 1234 or '1234').");
      return warnings;
    }

    const trimmed = input.trim();

    // Now treat it as a domain and run checks:
    if (/https?:\/\//.test(trimmed)) {
      warnings.push(`Domain contains protocol (http or https). Remove it.` + this._reasonMsg(input));
    }
  
    if (/[^a-zA-Z0-9.-]/.test(trimmed)) {
      warnings.push(`Domain contains unusual characters. Only letters, numbers, dots, and dashes are allowed.` + this._reasonMsg(input));
    }
  
    if (!trimmed.includes(".")) {
      warnings.push(`Domain should contain at least one dot (e.g. example.com).` + this._reasonMsg(input));
    }
  
    return warnings;
  },



  /* ===================================================================================================
    Throws  if axios request fails.
    Determines whether an error originated from your own validation code or from the API request.
    Useful for debugging and crafting more helpful error messages.
====================================================================================================== */
  onAxiosCatch(mainMessage, error, warnings){

    const thrower = error?.response?.status ? "API response" : "Internal Code";                                   
    
    throw new Error(` ${mainMessage} ( ${thrower} error ) : ${error.message}. ` + "\n- " + warnings.join("\n- "));
  },

/* ===================================================================================================
    Appends a reason string to error messages for additional context.
====================================================================================================== */
    
  _reasonMsg(reason){

    return (reason && typeof reason === "string") ? ` Reason: ${reason} ` : "";
  },
  

};


/* ===================================================================================================
   If 
====================================================================================================== */

