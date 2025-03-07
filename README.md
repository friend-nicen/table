# VTable 多功能表格组件

基于 ant-design-vue 和 Vue 3 的功能强大的表格组件，支持列自定义、排序、本地化存储、行选择等特性。

当前组件继承了[Ant-Design-Vue Table](https://www.antdv.com/components/table-cn)组件的所有列属性和方法，并在此基础上进行扩展。

演示地址：[https://table.nicen.cn](https://table.nicen.cn)

## 特性

- 🚀 基于 ant-design-vue 3.x 和 Vue 3
- 📦 开箱即用的高性能表格组件
- 🎨 支持列自定义配置与本地存储
- 📊 灵活的排序和过滤功能

## 快速开始

```vue

<template>
  <v-table :init="'api/data'"/>
</template>

<script setup>
  import {initTable} from 'v-table';

  const columns = [
    {
      title: 'ID',
      width: 60
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 120,
      sortable: 'number'
    }
  ];

  const table = initTable({
    unique: 'my-table',
    column: columns,
    localize: true
  });
</script>
```

## API

### VTable Props

| 参数           | 说明        | 类型                             | 默认值                  |
|--------------|-----------|--------------------------------|----------------------|
| init         | 数据初始化接口地址 | string                         | -                    |
| dataSource   | 静态数据源     | Record<string, any>[]          | -                    |
| pagination   | 分页配置      | TablePagination                | {}                   |
| sticky       | 表头吸顶配置    | { offsetHeader: number }       | { offsetHeader: 60 } |
| rowsKey      | 行唯一标识字段   | string                         | 'id'                 |
| scroll       | 表格滚动配置    | { x: string \| number }        | { x: 'max-content' } |
| size         | 表格大小      | 'small' \| 'middle' \| 'large' | 'large'              |
| rowSelection | 行选择配置     | boolean \| Record<string, any> | false                |

### TableColumn

| 参数        | 说明      | 类型                           | 默认值   |
|-----------|---------|------------------------------|-------|
| title     | 列标题     | string                       | -     |
| dataIndex | 列数据字段名  | string                       | -     |
| width     | 列宽度     | number                       | 100   |
| fixed     | 列固定位置   | boolean \| 'left' \| 'right' | false |
| resizable | 是否可调整列宽 | boolean                      | true  |
| display   | 是否显示列   | boolean                      | true  |
| editable  | 是否可编辑   | boolean                      | false |
| empty     | 是否允许为空  | boolean                      | false |
| sortable  | 排序类型    | 'number' \| 'dayjs'          | -     |
| timestamp | 时间戳格式   | string                       | -     |

### TableConfig

initTable调用时，支持传递的参数对象：

| 参数                   | 说明         | 类型                                                | 默认值   |
|----------------------|------------|---------------------------------------------------|-------|
| unique               | 唯一标识字段     | string                                            | -     |
| column               | 列配置        | TableColumn[]                                     | -     |
| condition            | 查询条件       | Record<string, any>                               | -     |
| callback             | 数据加载成功回调   | (data: any, pagination: TablePagination) => void  | -     |
| error                | 数据加载失败回调   | (error: any, pagination: TablePagination) => void | -     |
| filter               | 数据过滤器      | (data: any[]) => any[]                            | -     |
| immediate            | 是否立即加载数据   | boolean                                           | true  |
| watch                | 是否监听条件变化   | boolean                                           | true  |
| localize             | 是否本地化保存列配置 | boolean                                           | false |
| defaultExpandAllRows | 是否默认展开所有行  | boolean                                           | true  |

### TableInstance

| 参数         | 说明        | 类型                                                                                                         |
|------------|-----------|------------------------------------------------------------------------------------------------------------|
| loadData   | 加载数据方法    | (paginate?: TablePagination, filters?: Record<string, any>, sorter?: Record<string, any>) => Promise<void> |
| selectRows | 选中行数据     | { keys: any[], rows: any[] }                                                                               |
| condition  | 查询条件      | { data: Record<string, any> }                                                                              |
| editable   | 单元格是否可编辑  | boolean[][]                                                                                                |
| dataSource | 当前表格的数据对象 | boolean[][]                                                                                                |

## 插槽

| 名称                | 说明       | 参数                              |
|-------------------|----------|---------------------------------|
| expandedRowRender | 展开行渲染    | { record }                      |
| headerCell        | 自定义表头单元格 | { column }                      |
| bodyCell          | 自定义表格内容  | { text, record, index, column } |
| summary           | 表格汇总行    | { data }                        |

## 示例

### 基础表格

```vue

<template>
  <v-table :init="'api/data'"/>
</template>

<script setup>
  import {initTable} from 'v-table';

  const columns = [
    {
      title: 'ID',
      width: 60
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 120
    }
  ];

  const table = initTable({
    unique: 'basic-table',
    column: columns
  });
</script>
```

### 可选择表格

```vue

<template>
  <v-table
      :init="'api/data'"
      :row-selection="true"
  />
</template>

<script setup>
  import {initTable} from 'v-table';

  const columns = [
    {
      title: 'ID',
      width: 60
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 120
    }
  ];

  const table = initTable({
    unique: 'selection-table',
    column: columns
  });

  // 获取选中行
  console.log(table.selectRows);
</script>
```

### 自定义列渲染

```vue

<template>
  <v-table :init="'api/data'">
    <template #bodyCell="{ text, record, column }">
      <template v-if="column.dataIndex === 'action'">
        <a-button @click="handleEdit(record)">编辑</a-button>
      </template>
    </template>
  </v-table>
</template>

<script setup>
  import {initTable} from 'v-table';

  const columns = [
    {
      title: 'ID',
      width: 60
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 120
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 120,
      fixed: 'right'
    }
  ];

  const table = initTable({
    unique: 'custom-table',
    column: columns
  });

  const handleEdit = (record) => {
    console.log('编辑行:', record);
  };
</script>
```

## 许可证

[MIT](LICENSE)