<template>
  <div id='homepage'>
    <v-app>
      <v-card height="70px">
        <v-toolbar color="primary" height="70px">
          <img src="../assets/favicon.png" margin-left="-80px" width="70px" height="70px">
          <v-toolbar-title style="margin-left: 40px;" class="display-1" >Preferences Auditing Service</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items class="hidden-sm-and-down" absolute shift>
            <v-btn icon>
              <v-icon>help</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-card>
      <div style="padding: 20px;">
        <v-row class="mx-auto" justify="space-around">
          <v-text-field label="Username" style=" padding: 5px;" hint = "e.g. FDS_DEMO_US" title = "Enter source username e.g. FDS_DEMO_C" v-model.lazy="requestBody.username" ></v-text-field>
          <v-text-field label="Serial" style=" padding: 5px;" hint = "e.g. 000000" title = "Enter source serial e.g. 000000" v-model.lazy="requestBody.serial"></v-text-field>
          <v-select
            v-model="requestBody.section"
            :items="sectionNames"
            label="Section"
            style=" padding: 5px;"
            clearable
          ></v-select>
          <v-text-field label="Setting" style=" padding: 5px;" v-model.lazy="requestBody.setting" ></v-text-field>
          <v-text-field label="Value" style=" padding: 5px;" v-model.lazy="requestBody.value"></v-text-field>
        </v-row>
        <v-row class="mx-auto" justify="space-around">
            <v-menu
              ref="menu1"
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="requestBody.startDate"
                  label="Start Date"
                  hint="YYYY-MM-DD format"
                  persistent-hint
                  prepend-icon="event"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="requestBody.startDate" no-title @input="menu1 = false"></v-date-picker>
            </v-menu>
    
            <v-menu
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="requestBody.endDate"
                  label="End Date"
                  hint="YYYY-MM-DD format"
                  persistent-hint
                  prepend-icon="event"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="requestBody.endDate" no-title @input="menu2 = false"></v-date-picker>
            </v-menu>
        </v-row>
        <br>
        <v-btn v-on:click.prevent="get" color="primary">Search</v-btn>
        <br><br>
      </div>
      <div style="padding: 20px;">
        <v-tabs
          v-model="tab"
          background-color="transparent"
          grow
        >
          <v-tab
            v-for="tableName in tableNames"
            :key="tableName.text"
          >
            {{ tableName.text}}
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-data-table
              :headers="headers"
              :items="history"
              :items-per-page="itemNumber"
              class="elevation-1"
            ></v-data-table>
          </v-tab-item>
          <v-tab-item>
            <v-data-table
              :headers="headers"
              :items="current"
              :items-per-page="itemNumber"
              class="elevation-1"
            ></v-data-table>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </v-app>
  </div>
</template>>

<script>
  import frontFetcher from './frontFetcher';
  export default {
    data () {
      return {
        requestBody:{
          username:'',
          serial:'',
          section:'',
          setting:'',
          value:'',
          startDate:'',
          endDate: '',
        },
        itemNumber:50,
        sectionNames: [
            {text: 'Any', value: ''},
            {text: 'Active Workspace', value: '_WORKSPACES'},
            {text: 'Data Base Order', value: 'DBORDER'},
            {text: 'System-Wide Preferences', value: 'GUI_GLOBAL_PREFERENCES_V1_01'},
            {text: 'Workstation Preferences', value: '_MARQUEE_SETTINGS'},
        ],
        headers: [
          {
            text: 'User Name',
            align: 'left',
            sortable: false,
            value: 'Username',
          },
          { text: 'User Serial', value: 'Serial' },
          { text: 'Section', value: 'Section' },
          { text: 'Setting', value: 'Setting' },
          { text: 'Value', value: 'Value' },
          { text: 'Last Change', value: 'LastChanged' },
        ],
        history: [],
        current: [],
        tab: null,
        tableNames: [
          { text: 'Historical Table', value: 'history' },
          { text: 'Current Table', value: 'current' },
        ],
      }
    },
    methods:{
      async get() {
        await frontFetcher.loadSummary(this);
      }
    },
  }
</script>