var fs = require('fs');

try {
  const data = fs.readFileSync("./secret.txt");
  console.log(data);
} catch (err) {
  console.log(err);
}
