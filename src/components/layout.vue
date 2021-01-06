<template>
    <div class="h-screen flex flex-col">
        <div 
        class="h-10 bg-gray-50 flex items-center justify-center text-center cursor-pointer border-b text-sm relative"
        style="-webkit-app-region: drag">
        Laravel DebugBar
            <button @click="openSettings">
                <svg 
                class="h-4 w-4 text-gray-500 hover:text-gray-700 focus:text-gray-900 cursor-pointer absolute right-4 top-3"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
        </div>
        <div class="w-full flex-1" v-if="this.requests.length === 0">
            <Empty :text="`There are no requests yet. Please configure the Laravel DebugBar to get started.<br>
            <pre class='text-left text-sm bg-gray-800 p-4 mt-4 text-white rounded shadow-xl'>
// In config/debugbar.php

'storage' => [
    'enabled'    => true,
    'driver'     => 'socket',
    'path'       => storage_path('debugbar'),
    'connection' => null,
    'hostname'   => '127.0.0.1',
    'port'       => ${port},
],

// ...</pre>
            `" />
        </div>
        <div class="flex flex-1 overflow-hidden bg-gray-50" v-else>
            <div class="flex flex-1 w-full">
                <div class="w-1/4 bg-white overflow-x-hidden overflow-y-scroll">
                    <div class="p-2 flex">
                        <select 
                        v-model="selectedApp"
                        class="mt-1 form-select block w-full pl-3 pr-10 py-2 text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5">
                            <option v-for="app in apps" :key="app">{{ app }}</option>
                        </select>
                        <button @click="clearRequests()">
                            <svg 
                            class="text-gray-800 h-4 w-4 mx-2"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                    <ul class="divide-y divide-gray-200">
                        <li 
                        v-for="request in filteredRequests"
                        :key="request.id"
                        :class="selectedRequest === request ? 'bg-gray-100' : ''"
                        @click="selectRequest(request)"
                        class="px-4 py-4 flex flex-col">
                            <div class="flex flex-justify-between w-full">
                                <span class="text-sm flex-1 leading-5 font-medium text-gray-900">{{ request.data.route.uri }}</span>
                                <span 
                                class="text-sm leading-5 font-medium text-gray-700" 
                                v-html="request.data.request.status_code"></span>
                            </div>
                            <div class="flex flex-justify-between w-full text-xs">
                                <span class="flex-1 leading-5 font-medium text-gray-600">{{ request.data.time.duration_str }} /  {{ request.data.memory.peak_usage_str }}</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div v-if="selectedRequest" class="w-3/4 ml-4 overflow-x-hidden overflow-y-scroll flex flex-col">
                    <div class="pt-2 hidden sm:block">
                        <nav class="flex text-xs space-x-3">
                            <tab
                                label="Messages"
                                :count="selectedRequest.data.messages.count"
                                tab="messages"
                                :activeTab="activeTab"
                                @click="setTab('messages')"
                            />
                            <tab
                                label="Timeline"
                                tab="timeline"
                                :activeTab="activeTab"
                                @click="setTab('timeline')"
                            />
                            <tab
                                label="Exceptions"
                                tab="exceptions"
                                :count="selectedRequest.data.exceptions.count"
                                :activeTab="activeTab"
                                @click="setTab('exceptions')"
                            />
                            <tab
                                label="Views"
                                tab="views"
                                :activeTab="activeTab"
                                :count="selectedRequest.data.views.nb_templates"
                                @click="setTab('views')"
                            />
                            <tab
                                label="Route"
                                tab="route"
                                :activeTab="activeTab"
                                @click="setTab('route')"
                            />
                            <tab
                                label="Livewire"
                                tab="livewire"
                                :activeTab="activeTab"
                                :count="selectedRequest.data.livewire.count"
                                @click="setTab('livewire')"
                            />
                            <tab
                                label="Queries"
                                tab="queries"
                                :activeTab="activeTab"
                                :count="selectedRequest.data.queries.nb_statements"
                                @click="setTab('queries')"
                            />
                            <tab
                                label="Models"
                                tab="models"
                                :activeTab="activeTab"
                                :count="selectedRequest.data.models.count"
                                @click="setTab('models')"
                            />
                            <tab
                                label="Request"
                                tab="request"
                                :activeTab="activeTab"
                                @click="setTab('request')"
                            />
                        </nav>
                    </div>
                    <div class="w-full flex flex-col pt-4 px- flex-1">
                        <Messages :selectedRequest="selectedRequest" v-if="activeTab === 'messages'" />

                        <Exceptions :selectedRequest="selectedRequest" v-if="activeTab === 'exceptions'" />

                        <Timeline :selectedRequest="selectedRequest" v-if="activeTab === 'timeline'" />

                        <Views :selectedRequest="selectedRequest" v-if="activeTab === 'views'" />

                        <Route :selectedRequest="selectedRequest" v-if="activeTab === 'route'" />
                        
                        <Livewire :selectedRequest="selectedRequest" v-if="activeTab === 'livewire'" />

                        <Queries :selectedRequest="selectedRequest" v-if="activeTab === 'queries'" />

                        <Models :selectedRequest="selectedRequest" v-if="activeTab === 'models'" />

                        <Request :selectedRequest="selectedRequest" v-if="activeTab === 'request'" />
                    </div>

                </div>
            </div>
        </div>
        <Settings :show.sync="showSettings" />
    </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import Views from './views';
import Queries from './queries';
import Models from './models';
import Messages from './messages';
import Timeline from './timeline';
import Livewire from './livewire';
import Route from './route';
import Request from './request';
import Exceptions from './exceptions';
import Tab from './tab';
import Empty from './empty';
import Settings from './settings';

export default {
    components: {
        Empty,
        Tab,
        Messages,
        Views,
        Exceptions,
        Queries,
        Route,
        Models,
        Livewire,
        Request,
        Settings,
        Timeline
    },
    data() {
        return {
            showSettings: false,
            activeTab: 'messages',
            selectedRequest: null,
            selectedApp: null,
            requests: [],
            port: null,
        };
    },
    computed: {
        filteredRequests() {
            return this.requests.filter(req => {
                return req.app === this.selectedApp;
            }).filter(req => {
                return req.data.route.uri;
            });
        },
        apps() {
            let apps = [];
            
            this.requests.map(request => {
                if (! apps.includes(request.app)) {
                    apps.push(request.app);
                }
            })

            return apps;
        }
    },
    methods: {
        clearRequests() {
            this.requests = this.requests.filter(req => {
                return req.app !== this.selectedApp;
            });
        },

        setTab(tab) {
            this.activeTab = tab;
        },

        selectRequest(request) {
            this.selectedRequest = request;
        },

        openSettings() {
            this.showSettings = true;
        }
    },
    mounted() {
        this.port = mainStorage.get('port');

        ipcRenderer.on('request', (event, data) => {
            if (this.selectedApp === null) {
                this.selectedApp = data.app;
            }

            if (this.selectedRequest === null || mainStorage.get("followRequests")) {
                this.selectedRequest = data;
            }

            this.requests.unshift(data)
        });
    }
}
</script>