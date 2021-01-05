<template>
    <div class="h-full w-full flex items-center justify-center">
        <p v-html="text"></p>
    </div>
</template>
<script>
export default {
    props: ['text']
}
</script>