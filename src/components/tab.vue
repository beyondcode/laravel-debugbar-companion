<template>
    <a href="#" 
    @click.prevent="$emit('click', tab)"
    :class="activeTab === tab ? 'text-gray-700 bg-gray-100 focus:outline-none focus:bg-gray-100' : 'text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 focus:bg-gray-100'"
    class="px-1 py-1 font-medium text-xs leading-5 rounded-md " aria-current="page">
        {{ label }} <template v-if="count >= 0">({{ count }})</template>
    </a>
</template>
<script>
export default {
    props: ['label', 'count', 'tab', 'activeTab', 'selectedRequest']
}
</script>