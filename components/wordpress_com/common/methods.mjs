
export default {

/* ===================================================================================================
    Iterates through the provided props metadata and validates each input value.

    - Trims input strings using `trimIfString()`.
    - Skips validation for optional fields that are undefined, null, or blank.
    - Calls `validateUserInput()` for each defined input and accumulates any warnings.

    Parameters:
      propsMeta (object): An object describing metadata for each prop.
      context (object): The source of values to be validated (usually `this`).

    Returns:
      Array: A flat array of warning messages (empty if no issues).
====================================================================================================== */

validationLoop(propsMeta, context){

  const warnings = [];

  for (let propName in propsMeta){
    
  const meta = propsMeta[propName];

  // Trim the input if it's a string
  context[propName] = this.trimIfString(context[propName]);

  // If the optional prop is undefined, null, or a blank string — skip it
  if (meta.optional === true && ((context[propName] ?? '') === '')) continue;
      
  // Validate the input and accumulate the warning message if any.
  warnings.push(...this.validateUserInput(meta, context[propName]));

    console.log("SUCCESS");
  

  };

  return warnings;
  
},

/* ===================================================================================================
    Calls the appropriate validation method based on the input's type.
    Uses either the standard `type` or an extended override via `extendedType`.
    Throws if no validator is found or if the value fails validation.
====================================================================================================== */

validateUserInput(propMeta, value){

  this.throwIfNotObject(propMeta, propMeta.label);

  const warnings = [];

  // Check if there is extra type in prop meta. Like string can be also date type
  const type = ("extendedType" in propMeta) ? propMeta.extendedType : propMeta.type;

  // Decide which method to call based on the input we want to check.

  const validators = {
    "string": this.throwIfBlankOrNotString,
    "integer": this.throwIfNotWholeNumber,
    "string[]": this.throwIfNotArrayOfStrings,
    "object": this.checkObject,
    "array": this.throwIfNotArray,
    "YYYY-MM-DD": this.throwIfNotYMDDashDate,
    "url": this.checkIfUrlValid,
    "domainOrId" : this.checkDomainOrId,
  };

  const validator = validators[type];

  if (!validator) {
    this.throwCustomError(`No validator found for type "${type}"`, propMeta.label);
  };

  // Calls the correct function and passes label 
  const validationResult = validator.call(this, value, propMeta.label);
  
  // Just to double-check: we're expecting an array here.
  // Helps catch developer mistakes early.
  if (validationResult){
    this.throwIfNotArray(validationResult);
    warnings.push(...validationResult);
  };

  // Returns empty array if no warnings.
  return warnings;
},



/* ===================================================================================================
    Builds a payload object using only the props marked for inclusion in the POST body.

    Parameters:
      propsMeta (object): Metadata for each prop, including the `postBody` flag.
      context (object): Typically `this`; contains raw user input values that may or may not be validated.
                        It is advised to call this function only after running `validationLoop()` to ensure inputs are trimmed and validated.

    Returns:
      Object: A payload object containing only the props that should be sent in the request body.
====================================================================================================== */

preparePayload(propsMeta, context) {
  
  const payload = {};

  for (const propName in propsMeta) {

    // If the optional prop is undefined, null, or a blank string — skip it
    if ( propsMeta[propName].optional === true && ((context[propName] ?? '') === '')) continue;

    // If the prop is meant for the payload - add it.
    if (propsMeta[propName].postBody === true) {
      payload[propName] = context[propName];
    };
  }

  return payload;
},




/* ===================================================================================================
    Return the trimmed string or input as is if its not a string
====================================================================================================== */
// 
trimIfString(input) {
  return (typeof input === 'string') ? input.trim() : input; 
},

/* ===================================================================================================
    Throws a custom error and marks it with a flag (`isCustom`) for easier debugging and testing.
====================================================================================================== */

  throwCustomError(msg){
    const err = new Error(msg);
    err.isCustom = true;
    throw err; 
  },

/* ===================================================================================================
    Determines whether an error originated from your own validation code or from the API request.
    Useful for debugging and crafting more helpful error messages.
====================================================================================================== */

  // ===================================================================== 
  checkWhoThrewError(error) {   
    return { whoThrew: error?.response?.status ? "API response" : "Internal Code", error, };
  },

/* ===================================================================================================
    Throws if the input is not a string or is a blank string (only whitespace, tabs, newlines, etc.).
====================================================================================================== */

  throwIfBlankOrNotString(input, reason) {

    if (typeof input !== "string") {
      this.throwCustomError(
        `Expected a string, but got ${typeof input}` + this._reasonMsg(reason)
      );
    }
    if (input.trim() === "") {
      this.throwCustomError(
        "Expected a non-empty string with visible characters." + this._reasonMsg(reason)
      );
    }
  },


/* ===================================================================================================
    Throws if the input is not a JSON.
====================================================================================================== */

throwIfNotJSON(input, reason) {
  try {
    return JSON.parse(input);
  } catch (err) {
    this.throwCustomError( `Can not parse JSON. Error : ${err}`  +  this._reasonMsg(reason))
  };
}, 

/* ===================================================================================================
    Throws if the input is not a whole number (non-negative integer).
====================================================================================================== */

  throwIfNotWholeNumber(input, reason) {
    if (!Number.isInteger(input) || input < 0) {
      this.throwCustomError( `Expected a whole number (0 or positive integer), but got ${typeof input}` + this._reasonMsg(reason));
    };
  },

/* ===================================================================================================
    Throws if not string or if not whole number.
====================================================================================================== */

throwIfNotStrOrId(input, reason) {
  if (typeof input === "number") {
    this.throwIfNotWholeNumber(input, reason);
    return;
  }

  if (typeof input === "string") {
    this.throwIfBlankOrNotString(input, reason);
    return;
  }

  this.throwCustomError(
    `Expected a non-empty string or a whole number. but got ${typeof input}` + this._reasonMsg(reason)
  );
},


/* ===================================================================================================
    Throws if the input is not an array.
====================================================================================================== */


  throwIfNotArray(input, reason) {

    if (!Array.isArray(input)) {
      this.throwCustomError(`Invalid argument type. Expected an array ` +  this._reasonMsg(reason));
    };
  },

/* ===================================================================================================
    Throws if the input is not an array of strings.
====================================================================================================== */

  throwIfNotArrayOfStrings(input, reason){

    this.throwIfNotArray(input, reason);

    for (let i = 0; i < input.length; i++) {
      if (typeof input[i] !== "string"){
         this.throwCustomError(`Expected an array of strings ` +  this._reasonMsg(reason));
      }
    }; 
  },


/* ===================================================================================================
    Throws if the input is not a plain object (arrays are excluded).
====================================================================================================== */

  throwIfNotObject(input, reason) {
    
    if( typeof input === "object" && input !== null && !Array.isArray(input)){
      return input;
    };
      
    this.throwCustomError(`Invalid argument type. Expected an object ` +  this._reasonMsg(reason));
  },


/* ===================================================================================================
    Throws if the input is neither an object nor an array.
====================================================================================================== */

throwIfNotObjectOrArray(input, reason) {
    
  if( typeof input === "object" && input !== null){
    return input;
  };
  this.throwCustomError(`Invalid argument type. Expected an object or array` +  this._reasonMsg(reason));
},



/* ===================================================================================================
    Validates that a string follows the YYYY-MM-DD date format.
    Throws if the format or any individual part (year, month, day) is invalid.
====================================================================================================== */

  throwIfNotYMDDashDate(input, reason) {

    this.throwIfBlankOrNotString(input, reason);
  
    const parts = input.trim().split("-");
  
    if (parts.length !== 3) {
      this.throwCustomError("Date must be in format YYYY-MM-DD"  +  this._reasonMsg(reason));
    };
  
    let [year, month, day] = parts;
  
    // --- YEAR ---
    year = +year;
    if (!Number.isInteger(year) || year < 1990 || year > 2100) {
      this.throwCustomError("Year must be between 1990 and 2100" +  this._reasonMsg(reason));
    };
  
    const monthNum = +month;
    if (month.length !== 2 || Number.isNaN(monthNum) || monthNum < 1 || monthNum > 12 ) {
      this.throwCustomError(`Month must be between 01 and 12. Got: '${month}'` +  this._reasonMsg(reason));
    };
  
    const dayNum = +day;
    if (day.length !== 2 || Number.isNaN(dayNum) || dayNum < 1 || dayNum > 31 ) {
      this.throwCustomError(`Day must be between 01 and 31. Got: '${day}'` +  this._reasonMsg(reason));
    };
    
  },


/* ===================================================================================================
            *********** !!!!!! IMPORTANT !!!!!!!! **************************  
  Objects in Pipedream require special treatment. Technically, they can be arrays
  or even JSON strings. 

  This function checks whether the input is a JS object, JS array, or a JSON string.
  If it's a JSON string, it leaves it as-is but logs a message to the console indicating that a JSON string was received.
  
  It's up to the maintainer or contributor to decide what to do next.
//====================================================================================================*/

  checkObject (input, reason){
    
    // If type is string but can not be parsed as JSON then throw.
    if (typeof input === "string") {
      this.throwIfNotJSON(input, reason);
      console.log ('Object was received as JSON.' + this._reasonMsg(reason));
      return; // Return early
    };

    // If it’s not a string, ensure it’s either an object or an array – otherwise, throw.
    this.throwIfNotObjectOrArray(input, reason);
 
  },


/* ===================================================================================================
    Validates a URL string:
    - Rejects blank strings, spaces, tabs, and newlines
    - Warns about suspicious or unusual characters
    - Adds a warning if protocol is missing or malformed
    Returns:
      {
        warnings: string[],
        url: string (trimmed original input)
      }
====================================================================================================== */

  // =====================================================================
  checkIfUrlValid(input, reason) {
   
    // Throws an error if the input is not a string or if its a blank string;
    this.throwIfBlankOrNotString(input);

    // Warnin accumulator
    let warnings = [];
;
    // Trim the input (already checked for string);
    const trimmedInput = input.trim();

    // Reject if spaces, tabs, or newlines are present
    if ((/[ \t\n]/.test(trimmedInput))) {
      this.throwCustomError( `Url contains invalid characters like space, backslash etc., please check.`  +  this._reasonMsg(reason))
    };
  
  // Warn about suspicious characters
    const dubiousCharRegex = /[\\<>{}|"`^]|[\u200B\u200C\u200D\u2060\uFEFF\u00A0]/g;

    const dubiousMatches = trimmedInput.match(dubiousCharRegex);

    if (dubiousMatches) {
      const uniqueChars = [...new Set(dubiousMatches)].join(" ");
     
         warnings.push(` URL contains dubious or non-standard characters " ${uniqueChars} " ` + 
          `that may be rejected by Google. Proceed only if you know what you are doing.  ${this._reasonMsg(reason)}`) ;
    };

    // urlObject for further use if the next check passes.
    let urlObject; 
    // Tries to create a new URL object with the input string;
    try {
      urlObject =  new URL(trimmedInput); // throws if invalid or has no protocol

      // Warn if user typed only one slash (e.g., https:/)
      if (/^(https?):\/(?!\/)/.test(input)) {

         warnings.push(` It looks like you're missing one slash after "${urlObject.protocol}".` + 
        `Did you mean "${urlObject.protocol}//..."? ${this._reasonMsg(reason)} `);
        
      };

    } catch (err) {
      // If the URL is invalid, try to create a new URL object with "http://" in case user forgot to add it;
        try  { 
          // If it works then there was no protocol in the input string;
          urlObject = new URL("http://" + trimmedInput); 

          warnings.push(` URL does not have http or https protocol "`);
                    
        } catch(err) {
          // If after all checks we are here that means that the url contain potentially unacceptable characters.
          warnings.push(` URL contains potentionally unacceptable characters"  ${this._reasonMsg(reason)}`);

        };

    };

    // Here I wanted to check for "ftp" and other protocols but if user uses them they know what they are doing.

    return warnings;
    
  },

  /* ===================================================================================================
    Validates a Site Identifier string, which may be either:
    - A numeric Site ID (e.g., "123456")
    - A custom or subdomain (e.g., "mysite.example.com")

    The function:
    - Throws on blank or non-string input
    - Detects and skips further checks if the input is a valid numeric Site ID
    - If the input is not numeric, performs domain checks:
        - Warns if the input includes protocol (http:// or https://)
        - Warns if it starts with 'www.'
        - Warns about unusual characters (only letters, numbers, dots, and dashes are allowed)
        - Warns if the domain does not contain at least one dot (.)

    Returns:
      string[]: An array of warning messages (empty if input is clean)
====================================================================================================== */

  checkDomainOrId(input, reason) {
    
    const warnings = [];
    
    this.throwIfBlankOrNotString(input,reason);
    const trimmed = this.trimIfString(input);
  
  
    // Check if it’s a numeric ID (e.g. "123456")
    const num = Number(trimmed);
    const isNumericId = Number.isInteger(num) && num > 0;
  
    if (isNumericId) {
      //  Valid Site ID — skip domain checks
      return warnings;
    }
  
    // Now treat it as a domain and run checks:
    if (/https?:\/\//.test(trimmed)) {
      warnings.push(`Domain contains protocol (http or https). Remove it.` + this._reasonMsg(reason));
    }
  
    if (/^www\./i.test(trimmed)) {
      warnings.push(`Domain starts with 'www.'. May or may not cause problems.` + this._reasonMsg(reason));
    }
  
    if (/[^a-zA-Z0-9.-]/.test(trimmed)) {
      warnings.push(`Domain contains unusual characters. Only letters, numbers, dots, and dashes are allowed.` + this._reasonMsg(reason));
    }
  
    if (!trimmed.includes(".")) {
      warnings.push(`Domain should contain at least one dot (e.g. example.com).` + this._reasonMsg(reason));
    }
  
    return warnings;
  },


/* ===================================================================================================
    Appends a reason string to error messages for additional context.
====================================================================================================== */
    
  _reasonMsg(reason){

    return (reason && typeof reason === "string") ? ` Reason: ${reason} ` : "";
  },

};
