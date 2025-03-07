import VTable from './v-table.vue'
import VPop from './v-pop/v-pop.vue'
import initTable from './init-table'

export {VTable, VPop, initTable}

export default {
    install: (app) => {
        app.component('VTable', VTable)
        app.component('VPop', VPop)
    }
}