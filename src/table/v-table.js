/* eslint-disable */
/**
 * @author 友人a丶
 * @date
 * */
import {computed, inject, isRef, onMounted, reactive, ref, watch} from "vue";
import axios from "axios";
import load from "./load";
import {cloneDeep, debounce} from 'lodash';
import {getNode} from "./tree";
import {isDayjs} from "dayjs";


/**
 * 条件转换
 * */
export function switchForm(data, format = "YYYY-MM-DD") {

    //参数检测
    if (!data) {
        console.warn("无效参数");
        return {};
    }

    try {

        let condition;

        if (isRef(data)) {
            condition = cloneDeep(data.value);
        } else {
            condition = cloneDeep(data);
        }


        /**
         * 转换所有dayjs
         * */
        for (let i in condition) {

            if (condition[i] === "" || condition[i] === null || condition[i] === undefined) {
                delete condition[i];
                continue;
            }

            if (isDayjs(condition[i])) {

                condition[i] = condition[i].format(format);
                continue;
            }

            if (isRef(condition[i])) {
                condition[i] = condition[i].value;
            }

            if (condition[i] instanceof Array) {

                if (condition[i].length === 0) {
                    delete condition[i];
                    continue;
                }

                let count = 0; //有效数据量

                condition[i] = condition[i].map(item => {
                    if (isDayjs(item)) {
                        item = item.format(format);
                    }
                    if (item !== null) {
                        count++;
                    }
                    return item
                })

                if (count === 0) {
                    delete condition[i];
                }
            }
        }


        return condition;
    } catch (e) {
        console.warn(e)
    }


}


export default function (props) {


    const table = inject("table");
    const expandedRowKeys = ref([]); //展开的行
    const loaded = ref(false);

    /**
     * 返回表格行key值
     * @param record
     * @returns {*}
     */
    function key(record) {
        return record[props.rowsKey];
    }

    /**
     * 表数据
     * */
    const dataSource = reactive({
        data: {
            data: []
        }
    })

    /* 注入 */
    table.dataSource = dataSource; //挂载到标对象

    /**
     * 如果指定了数据源
     * */
    if (!!props.dataSource) {
        dataSource.data.data = computed(() => {

            let data = []; //最终输出的数据
            /**
             * 筛选条件
             * */
                // eslint-disable-next-line no-prototype-builtins
            let condition = switchForm(table.condition.hasOwnProperty('data') ? table.condition.data : {});

            /**
             * 筛选遍历
             * */
            props.dataSource.forEach(item => {

                let result = true; //筛选结果

                /* 条件过滤 */
                for (let i in condition) {
                    if (item[i].indexOf(condition[i]) === -1) {
                        result = false;
                    }
                }

                if (result) data.push(item);
            })

            return data;

        })
    }


    /**
     * 分页
     * */
    const pagination = reactive(Object.assign({
        current: 1,
        pageSize: 30,
        pageSizeOptions: ['30', '50', '100'],
        showSizeChanger: true,
        showQuickJumper: true,
        total: 0
    }, props.pagination))


    /**
     * 初始化表头
     * */
    const column = inject("columns");//表头
    const loadingTable = ref(false);

    /* 可编辑的键值 */
    const editKey = Object.create(null);


    /* 计算 */
    column.value.filter(item => {
        return item.editable;
    }).forEach(item => {
        editKey[item.dataIndex] = false;
    });

    /**
     * 初始化数据
     * @param paginate
     * @param filters
     * @param sorter
     */
    /* eslint-disable-next-line */
    const loadData = function (paginate = null, filters, sorter) {


        /**
         * 翻页的页号
         * */
        let page = pagination.current;

        /* 排序 */
        sorter = !!sorter ? (Array.isArray(sorter) ? {
            order: {
                field: sorter[0].field,
                by: sorter[0].order
            }
        } : {
            order: {
                field: sorter.field,
                by: sorter.order
            }
        }) : {}; //排序

        /* 分页计算 */
        if (paginate) {
            if (!!paginate.current) {
                page = paginate.current;
                pagination.current = paginate.current;
                pagination.pageSize = paginate.pageSize;
            }
        } else {
            pagination.current = 1;
        }

        if (!!props.dataSource) return; //如果传递了静态数据
        loadingTable.value = true; //加载效果
        /**
         开始请求
         合并请求条件
         */
        axios.post(props.init, Object.assign({
            pageSize: pagination.pageSize,
            page: page
            // eslint-disable-next-line no-prototype-builtins
        }, sorter, switchForm(table.condition.hasOwnProperty('data') ? table.condition.data : {})))
            .then((res) => {
                /**
                 * 判断请求结果
                 * */
                if (res.data.code) {

                    /**
                     * 是否需要过滤数据
                     * */
                    if (!!table.filter) {
                        dataSource.data = table.filter(res.data.data.data);
                    } else {
                        dataSource.data = res.data.data;
                    }


                    /**
                     * 是否需要展开行
                     * */
                    if (!!table.defaultExpandAllRows) {
                        expandedRowKeys.value = getNode(dataSource.data.data, 'id');
                    }


                    /*更新分页信息*/
                    pagination.current = res.data.data.current_page;
                    pagination.total = res.data.data.total;
                    pagination.pageSize = res.data.data.per_page;

                    if (!!table.callback) {
                        table.callback(res.data, pagination);
                    }


                    /* 可编辑的列和索引 */
                    table.editable = dataSource.data.data.map(() => {
                        return cloneDeep(editKey);
                    });

                } else {
                    /* 弹出错误原因 */
                    load.error(res.data.errMsg);

                    /* 错误回调 */
                    if (!!table.error) {
                        table.error(res.data, pagination);
                    }

                }
            }).catch((e) => {
            /* 弹出错误原因 */
            load.error(e.message);
        }).finally(() => {
            /* 关闭加载效果 */
            loadingTable.value = false;
            loaded.value = true;
            /* 关闭加载信息 */
            load.loaded();
        });
    }


    /**
     * 列宽调整
     * */
    const handleResizeColumn = (w, col) => {
        col.width = w;
    };


    /* 是否需要加载数据 */
    if (table.immediate) {
        onMounted(loadData);
    }

    /* 注入方法 */
    table.loadData = debounce(loadData, 500);


    /**
     * 表格是否具有条件
     * 监控条件变化
     * */
    if (!!table.condition.data && table.watch) {
        watch(table.condition.data, () => {
            /* 筛选条件变化。重置页号 */
            pagination.current = 1;
            table.loadData(); //重新加载数据
        }, {
            deep: true
        })
    }

    /**
     * 列选择触发
     * */
    if (props.rowSelection) {

        let rowsAll = []; //所有被选中的列

        var selectConfig = {
            onChange(keys, rows) {
                table.selectRows.keys = keys;
                rowsAll = rows;
            },
            selectedRowKeys: computed(() => {
                return table.selectRows.keys;
            })
        }

        /**
         * keys被删除时，同步rows的状态
         * */
        table.selectRows.rows = computed(() => {
            let keys = table.selectRows.keys;
            return rowsAll.filter(item => {
                return keys.indexOf(item[props.rowsKey]) > -1
            })
        });
    }


    /* 表格布局 */
    const layout = computed(() => {
        if (dataSource.data.data.length === 0) {
            return "auto";
        } else {
            return "fixed";
        }
    });


    return {
        column,
        data: dataSource,
        key,
        loadData: table.loadData,
        loadingTable,
        paginate: pagination,
        handleResizeColumn,
        selectConfig,
        expandedRowKeys,
        layout,
        loaded
    }
}