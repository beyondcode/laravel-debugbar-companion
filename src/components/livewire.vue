<template>
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8" v-if="Object.keys(selectedRequest.data.livewire.data).length > 0">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow border-b border-gray-200 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            Component
                        </th>
                        <th class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                            Data
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    <tr class="bg-white" v-for="(data, component) in selectedRequest.data.livewire.data" :key="`component_${component}`">
                        <td class="px-6 py-4 text-sm leading-5 font-medium text-gray-900" valign="top">
                            {{ component }}
                        </td>
                        <td class="px-6 py-4 text-sm leading-5 text-gray-500 break-all whitespace-pre-wrap focus:outline-none">
                            <pre v-text="data"></pre>
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>
        </div>
    </div>
    <Empty v-else text="There is no livewire data" />
</template>

<script>
import Empty from './empty'
export default {
    props: ['selectedRequest'],
    components: {
        Empty,
    },
    mounted() {
        document.querySelectorAll('.sf-dump').forEach(element => {
            window.Sfdump(element.id);
        });
    }
}
</script>