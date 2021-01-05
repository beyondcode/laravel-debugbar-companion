<template>
    <div
        v-show="show"
        style="z-index: 99999"
        class="fixed bottom-0 inset-x-0 px-4 pb-4 inset-0 flex items-center justify-center"
    >
        <transition
            enter-class="opacity-0"
            enter-active-class="ease-out duration-300"
            enter-to-class="opacity-100"
            leave-class="opacity-100"
            leave-active-class="ease-in duration-200"
            leave-to-class="opacity-0"
        >
            <div
                key="backdrop"
                @click="close"
                v-show="show"
                class="fixed inset-0 transition-opacity"
            >
                <div @click="close" class="absolute inset-0 bg-black opacity-75"></div>
            </div>
        </transition>

        <transition
            enter-active-class="ease-out duration-300"
            enter-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="ease-in duration-200"
            leave-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
            <div
                v-show="show"
                class="ml-14 bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full"
            >
                <div
                    class="bg-white flex justify-between items-center px-6 py-4 border-b border-gray-200"
                >
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Settings</h3>

                    <button
                        @click="close"
                        type="button"
                        class="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
                    >
                        <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div class="bg-white p-6 pb-4">
                    <div class="grid row-gap-3 col-gap-4 grid-cols-6">

                        <div class="col-span-6 pb-4">
                            <label
                                for="editor"
                                class="block text-sm font-medium leading-5 text-gray-700"
                            >Editor</label>
                            <div class="mt-1 rounded-md shadow-sm">
                                <select
                                    v-model="editor"
                                    id="editor"
                                    class="form-select rounded block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                >
                                    <option value="sublime">Sublime Text</option>
                                    <option value="phpstorm">PHPStorm</option>
                                    <option value="vscode">VSCode</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-span-6 pb-4">
                            <label
                                for="followRequests"
                                class="block text-sm font-medium leading-5 text-gray-700"
                            >Follow Request</label>
                            <div class="mt-1 rounded-md shadow-sm">
                                <input type="checkbox"
                                    v-model="followRequests"
                                    id="followRequests"
                                    class="form-checkbox rounded transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                >
                            </div>
                        </div>

                        <div class="col-span-6">
                            <label
                                for="port"
                                class="block text-sm font-medium leading-5 text-gray-700"
                            >Port</label>
                            <div class="mt-1 rounded-md shadow-sm">
                                <input 
                                    type="text"
                                    v-model="port"
                                    id="port"
                                    class="form-input rounded block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <span class="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                        <button
                            @click="save"
                            type="button"
                            class="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-gray-900 text-base leading-6 font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                        >
                            Save changes</button>
                    </span>

                    <span class="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                        
                    </span>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { ipcRenderer } from 'electron';

export default {
    props: ['show'],
    data() {
        return {
            editor: 'vscode',
            followRequests: true,
            port: 2304,
        };
    },

    methods: {
        close() {
            this.$emit('update:show', false)
        },

        /**
         * Load settings from storage
         */
        fetch() {
            this.port = mainStorage.get("port");
            this.editor = mainStorage.get("editor");
            this.followRequests = mainStorage.get("followRequests");
        },

        save() {
            mainStorage.set({
                port: this.port,
                followRequests: this.followRequests,
                editor: this.editor,
            });

            ipcRenderer.send('restartServer');

            this.close();
        },
    },

    mounted() {
        this.fetch();
    }
};
</script>