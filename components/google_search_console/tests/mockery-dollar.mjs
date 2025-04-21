// This is just mockery for test runs. Immitiates $ runtime.
export default { 
    $ : {
    export : (a,b) => console.log(a,b),
    },
  };