/**
 * 获取所有带子集的节点
 * @param data
 * @param key
 */
export function getNode(data, key = "key") {

    if (!Array.isArray(data)) return [];
    if (data.length === 0) return [];

    let Node = [];

    for (let count = 0; count < data.length; count++) {

        let i = data[count]; //数据对象

        /* 跳过非叶节点 */
        if (!i.children) continue;

        Node.push(i[key]);//新增节点
        let nodes = getNode(i.children, key);

        if (nodes && nodes.length > 0) {
            Node = Node.concat(nodes);
        }
    }

    return Node;
}