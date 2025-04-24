import methods from "../../common/methods.mjs";
import bogus from "./bogus-data/bogus-data-google-date.mjs";


// Any other case from bogus data shoul lead to throw
// Valid data : expected result;
const validCases = {
    
    aValidYMDDashDate: bogus.aValidYMDDashDate.value,
};




console.log("Running throwIfNotYMDDashDate() tests...");

let counterOfFails = 0;

for (const bogusCase in bogus) {

        
        console.log ("==============");
    
        let result;
        const testArg = bogus[bogusCase].value;
        const extendedType = bogus[bogusCase].extendedType;

        try {
            console.log("ENTERED VALUE", testArg, "of extended type ", extendedType);
            // Call function
            result = methods.throwIfNotYMDDashDate(testArg);
            
        } catch(err) {
            if (err.isCustom) {
                console.log ("------- \x1b[32m EXPECTED THROW PASS!\x1b[0m", "Custom error was thrown as expected" );
                console.log(err.message);
            } else {
                console.log ("!!!!!! HARD FAIL!", "UNEXPECTED ERROR WAS THROWN");
                console.log (err);
                counterOfFails++;
            };
            continue;
        }
        
  

        const pass = 
        (result === validCases[bogusCase]);

        if (pass) {
            console.log ("--- \x1b[32m  PASS! \x1b[0m", "Function returned expected values");
            continue;
        }
        else {
            console.log (" ****************************************** FAIL!", "ENTERED VALUE", testArg);
            console.log ("Expected ", validCases[bogusCase] , "got ", result);
            counterOfFails++;
        };
};

console.log ("OOOOOOOOOOOOOOOOOOOOOOOOOOOO");
console.log ("TOTAL FAILS = ", counterOfFails);
console.log ("OOOOOOOOOOOOOOOOOOOOOOOOOOOO");