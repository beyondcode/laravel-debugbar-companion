<template>
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div v-for="measure in measures" 
            class="relative h-6 mb-2"
            :key="measure.start">
                <div
                class="rounded h-6 bg-blue-200 absolute block text-xs"
                :style="`left: ${measure.left}%; width: ${measure.width}%; min-width: 2px`"
                >
                    
                </div>
                <div
                class="rounded h-6 leading-6 ml-2 bg-transparent absolute block text-xs"
                :style="``"
                >
                    {{ measure.label }} ({{ measure.duration_str }} / {{ measure.width.toFixed(2) }}%)
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['selectedRequest'],

    computed: {
        measures() {
            const data = this.selectedRequest.data.time;

            return data.measures.map(measure => {
                measure.left = (measure.relative_start * 100 / data.duration).toFixed(2),
                measure.width = Math.min((measure.duration * 100 / data.duration).toFixed(2), 100 - measure.left);

                return measure;
            })
        }
    }
}
</script>