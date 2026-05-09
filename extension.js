const vscode = require("vscode");

const LANGUAGE_ID = "xjnl";
const HIGHLIGHT_ENABLED = "dmIsatisXjnl.variableHighlight.enabled";

let variableDecorationType;
let updateTimer;

function activate(context) {
  variableDecorationType = createVariableDecorationType();

  context.subscriptions.push(variableDecorationType);
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(scheduleUpdateVisibleEditors),
    vscode.window.onDidChangeVisibleTextEditors(scheduleUpdateVisibleEditors),
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document.languageId === LANGUAGE_ID) {
        scheduleUpdateVisibleEditors();
      }
    }),
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(HIGHLIGHT_ENABLED)) {
        scheduleUpdateVisibleEditors();
      }
    })
  );

  updateVisibleEditors();
}

function deactivate() {
  if (updateTimer) {
    clearTimeout(updateTimer);
  }
}

function createVariableDecorationType() {
  return vscode.window.createTextEditorDecorationType({
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
    dark: {
      color: "#FFD166",
      backgroundColor: "rgba(255, 209, 102, 0.16)",
      border: "1px solid rgba(255, 209, 102, 0.58)",
      borderRadius: "3px",
      fontWeight: "700"
    },
    light: {
      color: "#7A3F00",
      backgroundColor: "rgba(255, 176, 0, 0.22)",
      border: "1px solid rgba(158, 87, 0, 0.48)",
      borderRadius: "3px",
      fontWeight: "700"
    }
  });
}

function scheduleUpdateVisibleEditors() {
  if (updateTimer) {
    clearTimeout(updateTimer);
  }

  updateTimer = setTimeout(updateVisibleEditors, 60);
}

function updateVisibleEditors() {
  const enabled = vscode.workspace.getConfiguration().get(HIGHLIGHT_ENABLED, true);

  for (const editor of vscode.window.visibleTextEditors) {
    if (editor.document.languageId !== LANGUAGE_ID) {
      continue;
    }

    if (!enabled) {
      editor.setDecorations(variableDecorationType, []);
      continue;
    }

    editor.setDecorations(variableDecorationType, findVariableReferenceRanges(editor.document));
  }
}

function findVariableReferenceRanges(document) {
  const ranges = [];

  for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++) {
    const line = document.lineAt(lineNumber);
    for (const match of findVariableReferenceSpans(line.text)) {
      ranges.push(
        new vscode.Range(
          new vscode.Position(lineNumber, match.start),
          new vscode.Position(lineNumber, match.end)
        )
      );
    }
  }

  return ranges;
}

function findVariableReferenceSpans(text) {
  const spans = [];
  let index = 0;

  while (index < text.length) {
    const start = text.indexOf("$(", index);
    if (start === -1) {
      break;
    }

    const end = findInterpolationEnd(text, start + 2);
    if (end === -1) {
      index = start + 2;
      continue;
    }

    spans.push({ start, end });
    index = end;
  }

  return spans;
}

function findInterpolationEnd(text, expressionStart) {
  let depth = 1;
  let quote = "";

  for (let index = expressionStart; index < text.length; index++) {
    const char = text[index];

    if (quote) {
      if (char === "\\" && index + 1 < text.length) {
        index++;
        continue;
      }

      if (char === quote) {
        quote = "";
      }

      continue;
    }

    if (char === "'" || char === "\"") {
      quote = char;
      continue;
    }

    if (char === "(") {
      depth++;
      continue;
    }

    if (char === ")") {
      depth--;
      if (depth === 0) {
        return index + 1;
      }
    }
  }

  return -1;
}

module.exports = {
  activate,
  deactivate,
  findVariableReferenceSpans
};
