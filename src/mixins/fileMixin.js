import {shell} from "electron";
import editorUrl from "@/lib/editor";
import {existsSync} from "fs";
import {join} from "path";

export default {
    methods: {
        openEditor(filename, lineNumber) {
            if (this.fileExists(filename)) {
                shell.openExternal(editorUrl(mainStorage.get('editor'), this.detectFilename(filename), lineNumber))
            }
        },

        detectFilename(filename) {
            if (existsSync(filename)) {
                return filename;
            }

            return join(this.selectedRequest.base_path, filename);
        },

        fileExists(filename) {
            return existsSync(filename) || existsSync(join(this.selectedRequest.base_path, filename));
        },
    },
}