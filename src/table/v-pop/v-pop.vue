<template>
  <a-space>
    <a-button v-if="showRefresh" @click="table.loadData">刷新</a-button>
    <a-popover overlayClassName="ant-popover-placement-column" placement="bottomRight" trigger="click">
      <template #title>
        <div class="title">
          <div class="checkAll">
            <a-checkbox :indeterminate="!allChecked" v-model:checked="allChecked">列选项</a-checkbox>
          </div>
          <div class="reset" @click="reset">
            <a>重置</a>
          </div>
        </div>
      </template>


      <template #content>

        <div class="content">
          <div class="fixed" v-if="sort.left.length > 0">
            <div class="title">固定在左侧</div>
            <div class="dragitem" v-for="(item) of sort.left" :key="item.title">


              <div class="drag">
                <drag-outlined :size="14"/>
              </div>


              <template v-if="item.default">
                <div class="item">
                  <a-checkbox disabled v-model:checked="item.display">{{ item.title }}</a-checkbox>
                </div>
              </template>
              <template v-else>
                <div class="item">
                  <a-checkbox v-model:checked="item.display">{{ item.title }}</a-checkbox>
                </div>
              </template>


              <div class="move">
                <a-tooltip>
                  <template #title>不固定</template>
                  <vertical-align-middle-outlined :size="14" @click="item.fixed=false"/>
                </a-tooltip>

                <a-tooltip>
                  <template #title>固定到右侧</template>
                  <vertical-align-bottom-outlined :size="14" @click="item.fixed='right'"/>
                </a-tooltip>
              </div>


            </div>
          </div>

          <div class="columns">
            <div class="title" v-if="sort.left !== 0 || sort.right !== 0">不固定</div>
            <draggable
                v-model="usedColumns"
                group="people"
                handle=".drag"
                tag="div"
                :animation="200"
                item-key="title">

              <template #item="{element}">

                <template v-if="element.fixed === false">


                  <div class="dragitem">

                    <div class="drag">
                      <drag-outlined :size="14"/>
                    </div>

                    <template v-if="element.default">
                      <div class="item">
                        <a-checkbox disabled v-model:checked="element.display">{{ element.title }}</a-checkbox>
                      </div>
                    </template>
                    <template v-else>
                      <div class="item">
                        <a-checkbox v-model:checked="element.display">{{ element.title }}</a-checkbox>
                      </div>
                    </template>


                    <div class="move">
                      <a-tooltip>
                        <template #title>固定到左侧</template>
                        <vertical-align-top-outlined style="margin-right: 5px" size="14px"
                                                     @click="element.fixed='left'"/>
                      </a-tooltip>

                      <a-tooltip>
                        <template #title>固定到右侧</template>
                        <vertical-align-bottom-outlined :size="14" @click="element.fixed='right'"/>
                      </a-tooltip>
                    </div>

                  </div>
                </template>
              </template>
            </draggable>
          </div>

          <div class="fixed" v-if="sort.right.length > 0">
            <div class="title">固定在右侧</div>
            <div class="dragitem" v-for="(item) of sort.right" :key="item.title">


              <div class="drag">
                <drag-outlined :size="14"/>
              </div>

              <template v-if="item.default">
                <div class="item">
                  <a-checkbox disabled v-model:checked="item.display">{{ item.title }}</a-checkbox>
                </div>
              </template>
              <template v-else>
                <div class="item">
                  <a-checkbox v-model:checked="item.display">{{ item.title }}</a-checkbox>
                </div>
              </template>

              <div class="move">
                <a-tooltip>
                  <template #title>不固定</template>
                  <vertical-align-middle-outlined style="margin-right: 5px" :size="14" @click="item.fixed=false"/>
                </a-tooltip>

                <a-tooltip>
                  <template #title>固定到左侧</template>
                  <vertical-align-top-outlined size="14px" @click="item.fixed='left'"/>
                </a-tooltip>
              </div>
            </div>
          </div>
        </div>
      </template>
      <a-tooltip>
        <template #title>表格设置</template>
        <setting-outlined :size="14" style="cursor: pointer;margin-left: 5px;"/>
      </a-tooltip>
    </a-popover>
  </a-space>
</template>


<script setup>
import draggable from 'vuedraggable';
import pop from './v-pop';
import {inject} from 'vue';
import {
  Checkbox as ACheckbox,
  Tooltip as aTooltip,
  Button as aButton,
  Space as aSpace,
  Popover as aPopover
} from "ant-design-vue";


import {
  DragOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignMiddleOutlined,
  SettingOutlined
} from "@ant-design/icons-vue";

/* 刷新 */
defineProps({
  showRefresh: {
    default: true,
    required: false
  }
})

const {allChecked, usedColumns, reset, sort} = pop();
const table = inject('table'); //表格对象


</script>

<style lang="scss">

@import "../variables.scss";

/* 弹出层 */
.ant-popover-placement-column {

  .ant-popover-arrow {
    display: none;
  }

  .ant-popover-title {
    min-width: 185px;
    min-height: 32px;
    margin: 0;
    padding: 5px 16px 4px;
    color: rgba(0, 0, 0, .85);
    font-weight: 500;
    border-bottom: 1px solid #f0f0f0;

    .ant-checkbox-wrapper {
      span:last-of-type {
        line-height: normal;
      }
    }

    .title {
      height: 32px;
      @include flex-center;
      justify-content: space-between;
      width: 100%;

    }
  }

  .ant-popover-inner {
    padding: 0 0 3px 3px;

    .ant-popover-inner-content {
      width: 210px;
      padding: 0 0 8px;

      .content {
        overflow: auto;
        @include scroll-bar;
        max-height: 45vh;


        .columns, .fixed {

          padding: 3px;


          .title {
            margin-left: 10%;;
            padding: 2px;
            font-size: $font-size-4;
          }

          .dragitem {

            @include flex-center;
            justify-content: flex-start;
            padding: 6px 4px;
            border-radius: 3px;

            &:hover {
              background-color: rgba($primary-color, 0.1);

              .move {
                visibility: visible;
              }
            }

            .drag {
              width: 18%;
              cursor: grab;
            }

            .item {
              width: 60%;
              @include overflow;
            }

            .move {
              @include flex-center;
              justify-content: flex-end;
              width: 22%;

              visibility: hidden;

              span {
                color: $primary-color;
                cursor: pointer;
              }
            }
          }
        }

        .fixed:first-of-type {
          margin-top: 7px;
        }
      }
    }
  }

}
</style>