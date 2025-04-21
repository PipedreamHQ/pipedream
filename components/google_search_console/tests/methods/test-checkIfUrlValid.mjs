import methods from "../../common/methods.mjs";
import bogus from "./bogus-data/bogus-data-url.mjs";


// Any other case from bogus data should lead to throw
// Valid data : expected result;
const validCases = {
    
    aSingleWordString:
    { 
        warnings : 1,
        url : bogus.aSingleWordString.value,
    },
    aValidHttpsUrl: 
    { 
        warnings : 0,
        url : bogus.aValidHttpsUrl.value,
    },
    aValidHttpUrl : 
    { 
        warnings : 0,
        url : bogus.aValidHttpUrl.value,
    },
    aValidUrlWithoutProtocol : 
    { 
        warnings : 1,
        url : bogus.aValidUrlWithoutProtocol.value,
    },
    aValidUrlWithDubiousCharacters :
    {  
        warnings : 1,
        url : bogus.aValidUrlWithDubiousCharacters.value,
    },

    aOneSlashUrl :
    {
        warnings : 1,
        url : bogus.aOneSlashUrl.value,
    },

    aReverseSlashUrl : 
    {
        warnings : 1,
        url : bogus.aReverseSlashUrl.value,
    },
};




console.log("Running checkUrl() tests...");

let counterOfFails = 0;

for (const bogusCase in bogus) {

        
        console.log ("==============");
    
        let result;
        const testArg = bogus[bogusCase].value;
        const extendedType = bogus[bogusCase].extendedType;

        try {
            console.log("ENTERED VALUE", testArg, "of extended type ", extendedType);
            result = methods.checkIfUrlValid(testArg);
            
        } catch(err) {
            if (err.isCustom) {
                console.log ("------- \x1b[32m EXPECTED THROW PASS!\x1b[0m", "Custom error was thrown as expected" );
                console.log();
            } else {
                console.log ("--- \x1b[31m HARD FAIL! \x1b[0m", "UNEXPECTED ERROR WAS THROWN");
                console.log (err);
                counterOfFails++;
            };
            continue;
        }
        
  

        const pass = 
        (result.warnings.length === validCases[bogusCase].warnings )&&
        (result.url === validCases[bogusCase].url);

        if (pass) {
            console.log ("--- \x1b[32m  PASS! \x1b[0m", "Function returned expected values");
            continue;
        }
        else {
            console.log ("--- \x1b[31m FAIL! \x1b[0m", "ENTERED VALUE", testArg);
            console.log ("Expected ", validCases[bogusCase].warnings, "warnings" , "got ", result.warnings.length );
            console.log ("Expected ", validCases[bogusCase].url, "got ", result.url );
            counterOfFails++;
        };
};

console.log ("OOOOOOOOOOOOOOOOOOOOOOOOOOOO");
console.log ("TOTAL FAILS = ", counterOfFails);
console.log ("OOOOOOOOOOOOOOOOOOOOOOOOOOOO");