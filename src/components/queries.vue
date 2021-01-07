<template>
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8" v-if="selectedRequest.data.queries.statements.length > 0">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <p class="text-sm text-gray-700 pb-4">
                {{ selectedRequest.data.queries.nb_statements }} queries were executed. 
                <template v-if="numDuplicates > 0">
                    {{ numDuplicates }} duplicated queries.
                </template>
                Total: {{ selectedRequest.data.queries.accumulated_duration_str }}
            </p>
            <div class="space-x-2 pb-4">
                <span 
                :class="! showDuplicates ? 'bg-opacity-50' : ''"
                @click="toggleDuplicates()"
                class="bg-gray-700 cursor-pointer uppercase py-1 px-2 rounded-md leading-tight text-white text-xs">Duplicates Only</span>
            </div>
            <div class="shadow border-b border-gray-200 rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            Query
                        </th>
                        <th class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            Duration
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    <tr class="bg-white" v-for="(statement, key) in statements" :key="`statement_${key}`">
                        <td class="px-6 py-4 text-sm leading-5 font-medium text-gray-900 font-mono">
                            <pre v-highlightjs="sqlFormatter.format(statement.sql)"><code class="sql"></code></pre>
                            <div class="pt-2">
                                <span class="font-bold">Backtrace:</span>
                                <ul>
                                    <li 
                                    :class="fileExists(trace.name) ? 'cursor-pointer' : ''"
                                    @click="openEditor(trace.name, trace.line)"
                                    class="font-mono text-gray-800 text-xs"
                                    v-for="(trace, traceKey) in statement.backtrace" :key="`statement_${key}_${traceKey}`">
                                    {{ trace.name }}:{{ trace.line }}
                                    </li>
                                </ul>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                            {{ statement.duration_str }}
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>
        </div>
    </div>
    <Empty v-else text="There are no queries" />
</template>

<script>
import Empty from './empty'
import sqlFormatter from "sql-formatter";
import fileMixin from "@/mixins/fileMixin";

export default {
    props: ['selectedRequest'],
    mixins: [fileMixin],
    components: {
        Empty,
    },
    data() {
        return {
            sqlFormatter,
            showDuplicates: false,
        }
    },
    computed: {
        numDuplicates() {
            let duplicates = 0;

            for (let query in this.duplicateQueries) {
                duplicates += this.duplicateQueries[query];
            }

            return duplicates;
        },
        duplicateQueries() {
            let duplicates = {};

            this.selectedRequest.data.queries.statements.map(statement => {
                if (duplicates[statement.sql]) {
                    duplicates[statement.sql]++;
                } else {
                    duplicates[statement.sql] = 1;
                }
            });

            return Object.keys(duplicates).filter(sql => {
                return duplicates[sql] > 1;
            }).reduce( (res, key) => (res[key] = duplicates[key], res), {} );
        },
        statements() {
            if (this.showDuplicates) {
                return this.selectedRequest.data.queries.statements.filter(stm => {
                    return this.duplicateQueries[stm.sql] > 1;
                })
            }
            return this.selectedRequest.data.queries.statements;
        }
    },
    methods: {
        toggleDuplicates() {
            this.showDuplicates = ! this.showDuplicates;
        }
    }
}
</script>