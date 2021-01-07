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
                            <div class="mt-2 bg-gray-100">
                                <span
                                    class="text-gray-800 text-xs block whitespace-pre"
                                    v-for="(line, lineKey) in exception.surrounding_lines"
                                    :key="`exception${key}_${lineKey}`">
                                    {{ sanitizeString(line) }}
                                </span>
                            </div>
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

import fileMixin from "@/mixins/fileMixin";

export default {
    props: ['selectedRequest'],
    mixins: [fileMixin],
    computed: {
        exceptions() {
            return this.selectedRequest.data.exceptions.exceptions
        },
    },
    methods: {
        stackTraceLines(stackTrace) {
            return stackTrace.split('\n');
        },

        sanitizeString(string) {
            return string.replace(/\r?\n|\r|\n/g, '');
        }
    }
}
</script>