/*
* @友人a丶
* 弹出层的简单封装
* */

import {message, Modal} from "ant-design-vue";
import {h} from "vue"

let hide = 0; //弹出的个数
let key = "loading"; //弹窗的key值
let close = null; //关闭的回调

export default {

    loading(text = '加载中...') {
        close = message.loading({
            content: text,
            key: key,
            duration: 0
        });
        hide++;
    },
    loaded(flag = false) {

        /* 强制关闭 */
        if (flag) {
            hide = 0;
        }

        if (hide > 0) {
            hide--;
            if (hide === 0 && !!close) close();
        } else {
            if (!!close) close();
        }
    },
    error(text = '加载异常') {
        message.error(text);
    },
    success(text = 'ok!') {
        message.success(text);
    },
    info(text, config) {

        return Modal.info(Object.assign({
            title: '提示',
            content: h('div', {style: 'font-size:15px;line-height:1.7;', innerHTML: text}),
            maskClosable: false
        }, config));

    },
    warning(text, config) {

        return Modal.warning(Object.assign({
            title: '提示',
            content: h('div', {style: 'font-size:15px;line-height:1.7;', innerHTML: text}),
            maskClosable: false
        }, config));

    },
    succeed(text, config) {

        return Modal.success(Object.assign({
            title: '提示',
            content: h('div', {style: 'font-size:15px;line-height:1.7;', innerHTML: text}),
            maskClosable: false
        }, config));

    },
    confirm(text, callback = null, cancel = null) {
        return Modal.confirm({
            title: '提示',
            content: text,
            maskClosable: false,
            onOk: (close) => {
                close(); //关闭
                if (callback) {
                    callback()
                }
            },
            onCancel() {
                if (cancel) {
                    cancel()
                }
            }
        })
    },

}
