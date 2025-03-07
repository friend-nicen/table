import load from "../load";
import {computed, inject} from "vue";
import {cloneDeep} from "lodash";


export default function () {

    const usedColumns = inject("usedColumns");
    const defaultColumns = inject("defaultColumns");
    const sort = inject('sort'); //排序

    /**
     * 如果有一个不显示
     * 代表没有全选
     * */
    const allChecked = computed({
        get() {
            for (let i of usedColumns.value) {
                if (!i.display) {
                    return false;
                }
            }
            return true;
        },
        set(newValue) {
            if (newValue) {
                for (let i of usedColumns.value) {
                    i.display = true;
                }
            } else {
                for (let i of usedColumns.value) {
                    if (!i.default) {
                        i.display = false;
                    }
                }
            }
        }
    })


    /**
     * 重置列
     * */
    const reset = () => {
        usedColumns.value = cloneDeep(defaultColumns.value);
        load.success("重置成功！")
    }


    return {
        allChecked,
        usedColumns,
        reset,
        sort
    }

}