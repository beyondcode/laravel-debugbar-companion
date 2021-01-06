<template>
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow border-b border-gray-200 rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead>
                    <tr>
                        <th class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            Message
                        </th>
                    </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                    <tr class="bg-white" v-for="(exception, key) in exceptions" :key="`exception_${key}`">
                        <td class="px-6 py-4 text-sm leading-5 font-medium text-gray-900 font-mono">
                            <span class="text-red-800 block">{{ exception.message }}</span>
                            <span :class="fileExists(exception.file) ? 'cursor-pointer' : ''"
                                  @click="openEditor(exception.file, exception.line)"
                                  class="font-mono text-gray-800 text-xs block">
                                {{ exception.file }}#{{ exception.line }}
                            </span>
                            <code>
                                <ul class="bg-gray-100">
                                    <li
                                        class="text-gray-800 text-xs"
                                        v-for="(line, lineKey) in exception.surrounding_lines"
                                        :key="`exception${key}_${lineKey}`">
                                        {{ line }}
                                    </li>
                                </ul>
                            </code>
                            <div class="pt-2">
                                <span class="font-bold">Stack trace:</span>
                                <ul>
                                    <li
                                        class="font-mono text-gray-800 text-xs"
                                        v-for="(trace, traceKey) in stackTraceLines(exception.stack_trace)"
                                        :key="`exception${key}_${traceKey}`">
                                        {{ trace }}
                                    </li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>

import {shell} from "electron";
import editorUrl from "@/lib/editor";
import {existsSync} from "fs";
import {join} from "path";

export default {
    props: ['selectedRequest'],
    data() {
        return {
            filteredLabels: []
        };
    },
    mounted() {
        this.applySymfonyJS();
    },
    computed: {
        exceptions() {
            return this.selectedRequest.data.exceptions.exceptions
        },
    },
    methods: {
        applySymfonyJS() {
            document.querySelectorAll('.sf-dump').forEach(element => {
                window.Sfdump(element.id);
            });
        },

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

        stackTraceLines(stackTrace) {
            return stackTrace.split('\n');

        }
    }
}
</script>