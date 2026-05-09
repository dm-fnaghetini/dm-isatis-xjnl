const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const requiredFiles = [
  "package.json",
  "language-configuration.json",
  "syntaxes/xjnl.tmLanguage.json",
  ".vscode/launch.json",
  "examples/sample.xjnl",
  "README.md"
];

let hasError = false;

for (const relativePath of requiredFiles) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`Missing required file: ${relativePath}`);
    hasError = true;
  }
}

for (const relativePath of [
  "package.json",
  "language-configuration.json",
  "syntaxes/xjnl.tmLanguage.json",
  ".vscode/launch.json"
]) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    continue;
  }

  try {
    JSON.parse(fs.readFileSync(fullPath, "utf8"));
  } catch (error) {
    console.error(`Invalid JSON in ${relativePath}: ${error.message}`);
    hasError = true;
  }
}

const grammarPath = path.join(root, "syntaxes/xjnl.tmLanguage.json");
if (fs.existsSync(grammarPath)) {
  const grammar = fs.readFileSync(grammarPath, "utf8");
  for (const token of ["SCRIPT_START", "SCRIPT", "SCRIPT_END", "source.python"]) {
    if (!grammar.includes(token)) {
      console.error(`Grammar does not mention expected token: ${token}`);
      hasError = true;
    }
  }
}

if (hasError) {
  process.exit(1);
}

console.log("XJNL syntax extension structure looks good.");
