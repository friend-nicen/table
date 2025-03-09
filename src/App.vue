<template>
  <a-config-provider :locale="zhCN">
    <div class="demo">
      <div class="top">
        <div class="form">
          <a-space :size="20">
            <a-form-item label="文件名称" :colon="false">
              <a-input v-model:value="table.condition.data.name" placeholder="请输入名称" style="width: 200px"/>
            </a-form-item>
            <a-form-item label="数据类型" :colon="false">
              <a-input v-model:value="table.condition.data.type" placeholder="请输入类型" style="width: 200px"/>
            </a-form-item>
          </a-space>
        </div>

        <a-space>
          <div class="github">
            <github-outlined style="font-size: 24px;"/>
          </div>
          <v-pop/>
        </a-space>

      </div>
      <v-table init="/ad/cats/list" :sticky="{offsetHeader:0}">
        <template #bodyCell="{ column, record }">
          <template v-if="column.title === 'ID'">
            {{ record.id }}
          </template>
          <template v-else-if="column.title === '关联商品'">
            <a>{{ record.goods }}个</a>
          </template>
          <template v-else-if="column.dataIndex === 'visible'">
            <a-switch :checked="record.visible === 1"/>
          </template>
          <template v-else-if="column.dataIndex === 'sku'">
            <a-tag :color="['red','green'][record.sku]">{{ ['不需要', '需要选择'][record.sku] }}
            </a-tag>
          </template>
          <template v-else-if="column.title === '操作'">
            <a>操作</a> <!--操作-->
          </template>
        </template>
      </v-table>
    </div>
  </a-config-provider>
</template>

<script setup>
import {initTable} from "@/table";
import {ConfigProvider as aConfigProvider} from "ant-design-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import {GithubOutlined} from '@ant-design/icons-vue';


/**
 * open
 */
const open = () => {
  window.open('https://github.com/friend-nicen/table', '_blank');
}
/*
* 初始化表头
* */
const columns = [
  {
    title: "ID",
    width: 60
  },
  {
    title: "类型名称",
    dataIndex: 'name',
    width: 120,
  },
  {
    title: "展示状态",
    dataIndex: 'visible',
    width: 120,
  },
  {
    title: "sku",
    dataIndex: 'sku',
    width: 120,
  },
  {
    title: "按钮文字",
    dataIndex: 'text',
    width: 120,
  },
  {
    title: "所属类目",
    dataIndex: 'kname',
    width: 150,
  },
  {
    title: "关联商品",
    dataIndex: 'goods',
    width: 150,
  },
  {
    title: "排序",
    dataIndex: 'sort',
    sortable: "number",
    width: 100,
  },
  {
    title: "操作人",
    dataIndex: 'uname',
    width: 120,
  },
  {
    title: "添加时间",
    dataIndex: 'a_time',
    sortable: "dayjs",
    width: 180,
  },
  {
    title: "修改时间",
    dataIndex: 'u_time',
    width: 180,
  },
  {
    title: "操作",
    fixed: "right",
    width: 100
  }
];


/* 初始化表格 */
const table = initTable({
  unique: 'Types-A-List-Table',
  column: columns,
  localize: true,
  condition: {
    kind: null,
    name: null
  }
});

</script>

<style lang="scss">

body {
  background-color: #f5f5f5;
}


.ant-form-item {
  margin-bottom: 0 !important;
}

.demo {
  background-color: white;
  margin: 20px 10vw;
  padding: 30px;

  .top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .github {
    cursor: pointer;
  }
}
</style>
