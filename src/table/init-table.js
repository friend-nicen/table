/**
 * @author 友人a丶
 * @date
 * */

import {computed, provide, reactive, ref, watch} from "vue";
import {cloneDeep, debounce} from "lodash";
import dayjs from "dayjs";

/**
 * 组件版本控制
 * */
const Version = ['1.0.1', '1.0.2'];

/**
 * 数据容器，并提供重置的方法
 * @param  res
 * @returns {{data: *, reset: ()=>void,$set: (object)=>void,save: (object)=>void}}
 */
export function store(res) {

    const init = reactive({
        primary: cloneDeep(res),
        data: cloneDeep(res),
        /**
         * 重置回上一个快照
         * */
        reset: () => {
            init.data = Object.assign(init.data, init.primary);
            return true;
        },
        /**
         * 替换
         * */
        $set(set) {
            init.data = Object.assign(init.data, set);
            return true;
        },
        /**
         * 保存快照
         * */
        save: (snap) => {
            init.primary = cloneDeep(snap);
            return true;
        }
    })

    return init;
}


/**
 * 规范表头
 * @param columns
 */
export function Columns(columns) {

    /* 默认列配置对象 */
    const column = {
        fixed: false,
        resizable: true,
        display: true, //是否展示
        editable: false,  //可编辑
        empty: false, //允许为空
        width: 100
    };

    return columns.map((item) => {
        item = Object.assign(cloneDeep(column), item);
        return item;
    })
}


/**
 * 响应式本地存储
 * @param key
 * @param value
 * @param local 是否要本地化同步
 * @returns {any|WritableComputedRef<any>}
 */
export function useLocalStorage(key, value = [], local = true) {


    /* 本地同步 */

    let item = ref(value);

    /**
     * 如果已经有值了
     * */
    if (local) {

        let primary = localStorage.getItem(key);

        if (primary) {
            item.value = JSON.parse(primary);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }

        /**
         * 监视属性，同步整个对象到localstorage
         * 节流运行
         * */
        watch(item, debounce(() => {
            if (!!item.value) {
                localStorage.setItem(key, JSON.stringify(item.value));
            }
        }, 500), {
            deep: true
        });

        /**
         * 计算属性，获取和
         * */
        return computed({
            get() {
                return item.value;
            },
            set(newVlaue) {
                item.value = newVlaue;
                /*如果为null，则清空本地存储*/
                if (newVlaue === null) {
                    localStorage.removeItem(key);
                } else {
                    localStorage.setItem(key, JSON.stringify(newVlaue));
                }
            }
        })

    } else {
        return item;
    }


}


/**
 * 初始化表格
 */
export default function (set) {

    /**
     * 初始化的默认配置
     * */
    const config = {
        unique: null, //区分本地存储的表头
        column: null, //列配置
        condition: null, //查询条件
        callback: null,//数据加载完毕后的回调函数
        error: null,//数据加载完毕后的回调函数
        filter: null,//数据加载完后是否要过滤
        immediate: true, //组件初始化后立即加载数据
        watch: true, //监听条件变化，加载数据
        localize: false, //表头是否本地存储
        defaultExpandAllRows: true,//是否要展开所有行
        check: null //权限校验，过滤无权限查看的列
    };

    Object.assign(config, set); //重载用户的配置

    /* 解构配置 */
    let {
        unique,
        column,
        condition,
        callback,
        localize,
        filter,
        defaultExpandAllRows,
        check,
        error
    } = config

    /**
     * 用于自定义排序的列
     * */
    const sort = reactive({
        left: [], plain: [], right: []
    });

    column = Columns(column); //处理表头


    /**
     * 删除旧记录
     * */
    localStorage.removeItem(unique + "-default" + Version[0]);
    localStorage.removeItem(unique + "-used" + Version[0]);

    const defaultColumns = useLocalStorage(unique + "-default" + Version[1], cloneDeep(column), localize);
    const usedColumns = useLocalStorage(unique + "-used" + Version[1], cloneDeep(column), localize);

    /* 表配置 */
    const columns = computed(() => {

        let items = usedColumns.value;


        /**
         * 如果已经请求了表头
         * 这个表头是完整的包括所有数据的表头
         * 初次请求的是默认的表头（用户修改指标之后保存的表头）
         * */
        if (!!items) {

            let left = [];
            let plain = [];
            let right = [];


            /**
             * 如果需要权限判断
             * */
            if (check) {
                items = items.filter(item => {
                    return check(item);
                })
            }


            items.forEach((item) => {
                /**
                 * 判断是否需要排序
                 * */
                // eslint-disable-next-line no-prototype-builtins
                if (item.hasOwnProperty("sortable")) {


                    if (item.sortable === "number") {
                        item.sorter = {
                            compare: (a, b) => a[item.dataIndex] - b[item.dataIndex], multiple: 2
                        }
                    } else if (item.sortable === "dayjs") {
                        item.sorter = {
                            compare(a, b) {

                                if (dayjs(a[item.dataIndex]).isBefore(dayjs(b[item.dataIndex]))) {
                                    return -1
                                } else if (a[item.dataIndex] === b[item.dataIndex]) {
                                    return 0
                                } else {
                                    return 1
                                }
                            },
                            multiple: 2
                        }
                    }

                }


                /**
                 * 是否是时间戳字段
                 * */
                // eslint-disable-next-line no-prototype-builtins
                if (item.hasOwnProperty("timestamp")) {
                    item.customCell = (record, rowIndex, column) => {
                        return {textContent: !!record[column.dataIndex] ? (dayjs(record[column.dataIndex] * 1000).format(item.timestamp)) : "-"};
                    }
                }


                /**
                 * 判断是否显示
                 * */
                if (item.fixed === "left") {
                    left.push(item);
                } else if (item.fixed === "right") {
                    right.push(item);
                } else {
                    item.fixed = false;
                    plain.push(item)
                }

            });

            sort.left = left;
            sort.plain = plain;
            sort.right = right;

            return left.concat(plain).concat(right).filter((item) => {
                return item.display;
            }); //合并

        }


        return [];
    });


    /**
     * 初始化表头
     * */
    provide("usedColumns", usedColumns); //完整的表头
    provide("defaultColumns", defaultColumns); //默认表头的备份
    provide("sort", sort); //默认表头的备份
    provide("columns", columns); //默认表头的备份


    /*暴露出表格初始化数据的方法*/
    const table = reactive({
        loadData: null,
        selectRows: {
            keys: [],
            rows: []
        },
        condition: !condition ? {} : store(condition),
        callback: callback,
        error: error,
        filter: filter,
        watch: config.watch, //监听条件变化，加载数据
        immediate: config.immediate,
        defaultExpandAllRows,
        editable: []
    });

    /* 注入 */
    provide("table", table);


    return table;

}