<template>
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow border-b border-gray-200 sm:rounded-lg">
            </div>
        </div>
    </div>
</template>

<script>
import {xor} from 'lodash';

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
                    classList = 'bg-orange-500';
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