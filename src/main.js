import {createApp} from 'vue';
import App from './App.vue';
import table from './table';
import './mock'

/* 初始化vue */
const app = createApp(App);
app.use(table);
app.mount('#app')
