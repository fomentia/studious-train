var fs = require('fs');

try {
  const data = fs.readFileSync("./secret.txt");
  console.log(data.toString());
} catch (err) {
  console.log(err);
}
