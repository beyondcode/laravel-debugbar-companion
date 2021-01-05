export default function editorUrl(editor, file, lineNumber) {
    const editors = {
        sublime: 'subl://open?url=file://%path&line=%line',
        phpstorm: 'phpstorm://open?file=%path&line=%line',
        vscode: 'vscode://file/%path:%line',
        nova: 'nova://core/open/file?filename=%path&line=%line',
    };
console.log(editor);
    return editors[editor]
        .replace('%path', encodeURIComponent(file))
        .replace('%line', encodeURIComponent(lineNumber));
}