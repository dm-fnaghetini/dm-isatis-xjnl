# XJNL Syntax Highlighting

Local Visual Studio Code extension for highlighting `.xjnl` **Isatis.neo batch files** as XML with embedded Python inside `CDATA` blocks.

It recognizes Python in two types of sections:

- `<python><![CDATA[ ... ]]></python>`
- `<param key="SCRIPT_START|SCRIPT|SCRIPT_END"><![CDATA[ ... ]]></param>`

It also highlights XJNL references to variables produced by Python blocks, such as `$(scale)` or `$(result_name)`.
Besides TextMate tokenization, the extension adds a high-visibility editor decoration over the whole `$(...)` call so variable edits stand out while reviewing batches.

The supported `$(...)` forms are based on real batch files and include:

- standalone XML values: `<path>$(FOLDER_BLOCKMODEL)</path>`
- mixed XML text: `<file>$(FNAME_MODEL)_tmp</file>` and `vmod_$(dom_sect[j])_$(sectors[k])`
- Python-like expressions: `$(PAR['blockmodel'].ox.iloc[0])`, `$(int(PAR['blockmodel'].nu.iloc[0]))`, `$(1 if not IS_DESTINATION_MODEL else 2)`
- method calls and strings inside the interpolation: `$('|'.join(pol_names))`
- interpolation inside Python CDATA code and strings: `df["A$(varor[i])1"]` and `df.loc[m1, "x"] = $(j) + $(k)`
- XML attribute values, for batches that use them: `<param value="$(result_name)" />`

## Structure

- `package.json`: extension manifest and VS Code contributions.
- `extension.js`: high-visibility editor decoration for `$(...)` variable calls.
- `syntaxes/xjnl.tmLanguage.json`: TextMate grammar that injects Python into the expected CDATA blocks.
- `language-configuration.json`: basic language settings for comments, pairs, and folding.
- `.vscode/launch.json`: configuration for testing the extension in a development window.
- `examples/sample.xjnl`: minimal file for visually validating the highlighting.
- `scripts/verify-extension.js`: simple check for the extension structure.

## How to test in development mode

1. Open VS Code.
2. Use `File > Open Folder...` and open the `dm-isatis-xjnl` folder.
3. Press `F5`.
4. VS Code will open a new window called `Extension Development Host`.
5. In that new window, open this whole project or open the `examples/sample.xjnl` file.
6. Check the bottom-right corner and make sure the language mode is `XJNL`.
7. If it is not, use `Ctrl+K M` and choose `XJNL`.

## How to package as VSIX

Run this inside the `dm-isatis-xjnl` folder:

```powershell
npm run package
```

This generates a file similar to `dm-isatis-xjnl-0.1.0.vsix`.

## How to install the VSIX

From VS Code:

1. Open the Extensions panel.
2. Click the `...` menu.
3. Choose `Install from VSIX...`.
4. Select the `dm-isatis-xjnl-0.1.0.vsix` file.

From the terminal, if the `code` command is available:

```powershell
code --install-extension .\dm-isatis-xjnl-0.1.0.vsix
```

After that, any `.xjnl` file should open with the `XJNL` language mode.

## Limits of this first version

This extension provides syntax highlighting. It does not execute Python, format Python inside CDATA, or enable Pylance linting/autocomplete inside those blocks.

Those features would require a more complete TypeScript extension with virtual Python documents for each block.

## Settings

The high-visibility variable overlay can be disabled if needed:

```json
{
  "dmIsatisXjnl.variableHighlight.enabled": false
}
```
