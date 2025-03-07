import { DefineComponent } from 'vue';

/**
 * 表格列配置接口
 */
export interface TableColumn {
  /** 列标题 */
  title: string;
  /** 列数据字段名 */
  dataIndex: string;
  /** 列宽度 */
  width?: number;
  /** 列固定位置 */
  fixed?: boolean | 'left' | 'right';
  /** 是否可调整列宽 */
  resizable?: boolean;
  /** 是否显示列 */
  display?: boolean;
  /** 是否可编辑 */
  editable?: boolean;
  /** 是否允许为空 */
  empty?: boolean;
  /** 排序类型 */
  sortable?: 'number' | 'dayjs';
  /** 时间戳格式 */
  timestamp?: string;
  /** 自定义单元格渲染 */
  customCell?: (record: any, rowIndex: number, column: TableColumn) => { textContent: string };
}

/**
 * 分页配置接口
 */
export interface TablePagination {
  /** 当前页码 */
  current?: number;
  /** 每页条数 */
  pageSize?: number;
  /** 可选的每页条数 */
  pageSizeOptions?: string[];
  /** 是否显示页码跳转 */
  showQuickJumper?: boolean;
  /** 是否显示页面条数选择 */
  showSizeChanger?: boolean;
  /** 总条数 */
  total?: number;
}

/**
 * 表格组件属性接口
 */
export interface TableProps {
  /** 数据初始化接口地址 */
  init?: string;
  /** 静态数据源 */
  dataSource?: Record<string, any>[];
  /** 分页配置 */
  pagination?: TablePagination;
  /** 表头吸顶配置 */
  sticky?: { offsetHeader: number };
  /** 行唯一标识字段 */
  rowsKey?: string;
  /** 表格滚动配置 */
  scroll?: { x: string | number };
  /** 表格大小 */
  size?: 'small' | 'middle' | 'large';
  /** 行选择配置 */
  rowSelection?: boolean | Record<string, any>;
}

/**
 * 表格配置接口
 */
export interface TableConfig {
  /** 唯一标识字段 */
  unique?: string;
  /** 列配置 */
  column: TableColumn[];
  /** 查询条件 */
  condition?: Record<string, any>;
  /** 数据加载成功回调 */
  callback?: (data: any, pagination: TablePagination) => void;
  /** 数据加载失败回调 */
  error?: (error: any, pagination: TablePagination) => void;
  /** 数据过滤器 */
  filter?: (data: any[]) => any[];
  /** 是否立即加载数据 */
  immediate?: boolean;
  /** 是否监听条件变化 */
  watch?: boolean;
  /** 是否本地化处理 */
  localize?: boolean;
  /** 是否默认展开所有行 */
  defaultExpandAllRows?: boolean;
  /** 列校验函数 */
  check?: (column: TableColumn) => boolean;
}

/**
 * 表格实例接口
 */
export interface TableInstance {
  /** 加载数据方法 */
  loadData: (paginate?: TablePagination, filters?: Record<string, any>, sorter?: Record<string, any>) => Promise<void>;
  /** 选中行数据 */
  selectRows: {
    keys: any[];
    rows: any[];
  };
  /** 查询条件 */
  condition: {
    data: Record<string, any>;
  };
  /** 数据加载成功回调 */
  callback?: (data: any, pagination: TablePagination) => void;
  /** 数据加载失败回调 */
  error?: (error: any, pagination: TablePagination) => void;
  /** 数据过滤器 */
  filter?: (data: any[]) => any[];
  /** 是否监听条件变化 */
  watch: boolean;
  /** 是否立即加载数据 */
  immediate: boolean;
  /** 是否默认展开所有行 */
  defaultExpandAllRows: boolean;
  /** 单元格是否可编辑 */
  editable: boolean[][];
}

/** 表格组件 */
export const VTable: DefineComponent<TableProps>;

/** 初始化表格方法 */
export function initTable(config: TableConfig): TableInstance;

export default {
  install: (app) => {
      app.component('VTable', VTable)
      app.component('VPop', VPop)
  }
};