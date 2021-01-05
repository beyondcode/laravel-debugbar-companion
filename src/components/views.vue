<template>
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8" v-if="selectedRequest.data.views.templates.length > 0">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                    <th class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Name
                    </th>
                    <th class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Type
                    </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    <!-- Odd row -->
                    <tr class="bg-white" v-for="(template, index) in selectedRequest.data.views.templates" :key="`template_${index}`">
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
                            {{ template.name }}
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                            {{ template.type }}
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>
        </div>
    </div>
    <Empty v-else text="There are no views" />
</template>

<script>
import Empty from './empty'

export default {
    props: ['selectedRequest'],
    components: {
        Empty,
    }
}
</script>