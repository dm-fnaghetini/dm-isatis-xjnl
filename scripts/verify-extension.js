const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const requiredFiles = [
  "package.json",
  "extension.js",
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

const extensionPath = path.join(root, "extension.js");
if (fs.existsSync(extensionPath)) {
  const extension = fs.readFileSync(extensionPath, "utf8");
  const expectedTokens = [
    "createTextEditorDecorationType",
    "findVariableReferenceSpans",
    "dmIsatisXjnl.variableHighlight.enabled",
    "onDidChangeTextDocument"
  ];

  for (const token of expectedTokens) {
    if (!extension.includes(token)) {
      console.error(`Extension script does not mention expected token: ${token}`);
      hasError = true;
    }
  }
}

const grammarPath = path.join(root, "syntaxes/xjnl.tmLanguage.json");
if (fs.existsSync(grammarPath)) {
  const grammar = fs.readFileSync(grammarPath, "utf8");
  const expectedTokens = [
    "SCRIPT_START",
    "SCRIPT",
    "SCRIPT_END",
    "source.python",
    "source.python.embedded.xjnl string.quoted",
    "injections",
    "variable-reference",
    "embedded-python-patterns",
    "interpolation-parentheses",
    "interpolation-brackets",
    "interpolation-string-single",
    "xml-entity-reference",
    "keyword.operator.interpolation.begin.xjnl",
    "entity.name.variable.reference.xjnl"
  ];

  for (const token of expectedTokens) {
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
