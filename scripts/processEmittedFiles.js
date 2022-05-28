const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  const filename = line.replace(/^TSFILE: /g, '');
  if (filename.endsWith("js")) {
    console.log(filename);
  }
})