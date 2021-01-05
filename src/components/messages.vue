<template>
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8" v-if="this.selectedRequest.data.messages.messages.length > 0">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="space-x-2 pb-4">
                <span 
                v-for="label in labels"
                :key="label"
                :class="labelColor(label) + ' ' + isFiltered(label)"
                @click="toggleLabel(label)"
                class="cursor-pointer uppercase py-1 px-2 rounded-md leading-tight text-white text-xs">{{ label }}</span>
            </div>

            <div class="shadow border-b border-gray-200 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                    <tbody class="divide-y divide-gray-200">
                        <tr class="bg-white" v-for="message in messages" :key="`message_${message.time}`">
                            <td class="relative px-2 py-2 text-sm leading-5 text-gray-500 break-all focus:outline-none">
                                <span 
                                :class="labelColor(message.label)"
                                class="absolute right-2 top-1 uppercase py-1 px-2 rounded-md leading-tight text-white text-xs">{{ message.label }}</span>
                                <div v-html="message.message_html || message.message"></div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <Empty v-else text="There are no messages" />
</template>

<script>
import {xor} from 'lodash';
import Empty from './empty';

export default {
    components: {
        Empty,
    },
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
        labels() {
            let labels = [];
            
            this.selectedRequest.data.messages.messages.map(message => {
                if (! labels.includes(message.label)) {
                    labels.push(message.label);
                }
            })

            return labels;
        },
        messages() {
            return this.selectedRequest.data.messages.messages.filter(message => {
                return ! this.filteredLabels.includes(message.label);
            });
        }
    },
    methods: {
        applySymfonyJS() {
            document.querySelectorAll('.sf-dump').forEach(element => {
                window.Sfdump(element.id);
            });
        },
        toggleLabel(label) {
            this.filteredLabels = xor(this.filteredLabels, [label]);

            this.$nextTick(() => {
                this.applySymfonyJS();
            })
        },
        isFiltered(label) {
            if (this.filteredLabels.includes(label)) {
                return 'bg-opacity-50';
            }
            return '';
        },
        labelColor(label) {
            let classList = '';
            switch (label) {
                case 'debug':
                    classList = 'bg-green-600';
                    break;

                case 'info':
                    classList = 'bg-blue-700';
                    break;

                case 'error':
                    classList = 'bg-red-700';
                    break;
            
                case 'warning':
                    classList = 'bg-yellow-500';
                    break;
            
                default:
                    classList = 'bg-gray-700';
                    break;
            }

            return classList;
        }
    }
}
</script>