<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true">
        <el-form-item label="执行器">
          <el-input placeholder="执行器" />
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input placeholder="任务描述" />
        </el-form-item>
        <el-form-item label="状态">
          <el-input placeholder="状态" />
        </el-form-item>
        <el-form-item label="创建人">
          <el-input placeholder="创建人" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="dialogTableVisible=true">新增触发器</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table v-loading="listLoading" :data="triggerList" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="ID" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="名字">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="下一次调度时间" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.nextTriggerTime==0 ? '': parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="上一次调度时间" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.prevTriggerTime==0 ? '': parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="cron表达式">
          <template slot-scope="scope">
            <span>{{ scope.row.cron }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="调度策略">
          <template slot-scope="scope">
            <span>{{ strategyMap.get(scope.row.strategy) }}</span>
          </template>

        </el-table-column>
        <el-table-column align="center" label="分片数">
          <template slot-scope="scope">
            <span>{{ scope.row.shardingNum }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="重试次数">
          <template slot-scope="scope">
            <span>{{ scope.row.retryCount }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span>{{ statusMap.get(scope.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建者">
          <template slot-scope="scope">
            <span>{{ scope.row.creator }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="450">
          <template slot-scope="{row}">
            <el-button
              type="warning"
              size="small"
              icon="el-icon-edit"
              @click="row.edit=!row.edit"
            >
              修改
            </el-button>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="row.edit=!row.edit"
            >
              执行
            </el-button>
            <el-button
              v-if="row.status==0"
              type="success"
              size="small"
              icon="el-icon-edit"
              @click="row.edit=!row.edit"
            >
              启动
            </el-button>
            <el-button
              v-else
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="row.edit=!row.edit"
            >
              停止
            </el-button>
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="row.edit=!row.edit"
            >
              删除
            </el-button>
          </template>

        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination
        align="center"
        background
        layout="prev, pager, next"
        :total="pageInfo.total"
        :current-page="pageInfo.currentPage"
        :page-size="pageInfo.pageSize"
      />
    </el-row>
    <el-dialog v-el-drag-dialog :visible.sync="dialogTableVisible" title="触发器信息" @dragDialog="handleDrag">
      <el-form ref="triggerForm" :inline="false" :model="triggerInfo" :rules="triggerRules" label-width="120px">
        <el-form-item label="触发器名字" prop="name">
          <el-input ref="name" v-model="triggerInfo.name" placeholder="触发器名字" />
        </el-form-item>
        <el-form-item label="cron表达式" prop="cron">
          <el-input ref="cron" v-model="triggerInfo.cron" placeholder="cron表达式" />
        </el-form-item>
        <el-form-item label="分片数" prop="shardingNum">
          <el-input ref="shardingNum" v-model.number="triggerInfo.shardingNum" placeholder="分片数" />
        </el-form-item>
        <el-form-item label="失败重试数" prop="retryCount">
          <el-input ref="retryCount" v-model.number="triggerInfo.retryCount" placeholder="分片数" />
        </el-form-item>
        <el-form-item label="调度策略">
          <el-select v-model="triggerInfo.strategy" placeholder="调度策略">
            <el-option v-for="strategy in strategyList" :label="strategy.value" :value="strategy.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveTrigger">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import { getAllTrigger, addTrigger } from '@/api/trigger'
import constant from './constant'

export default {
  name: 'Trigger',
  directives: { elDragDialog },
  data() {
    return {
      triggerRules: {
        name: [{ required: true, message: '输入触发器名字', trigger: 'blur' }],
        cron: [{ required: true, message: '输入cron表达式', trigger: 'blur' }],
        shardingNum: [{ required: true, message: '输入分片数', trigger: 'blur' }, {
          type: 'number',
          message: '分片数必须为数字值'
        }],
        retryCount: [{ required: true, message: '输入重试次数', trigger: 'blur' }, {
          type: 'number',
          message: '重试次数必须为数字值'
        }]
      },
      triggerList: [],
      pageInfo: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      dialogTableVisible: false,
      triggerInfo: {
        name: null,
        cron: null,
        strategy: 0,
        shardingNum: 0,
        retryCount: 0
      },
      strategyList: constant.strategyList,
      strategyMap: constant.strategyMap,
      statusMap: constant.statusMap
    }
  },
  mounted() {
    this.getTriggerList()
  },
  methods: {
    getTriggerList() {
      getAllTrigger(this.pageInfo).then(response => {
        this.pageInfo = response.pageInfo
        this.triggerList = response.triggerList
      })
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      this.$refs.select.blur()
    },
    saveTrigger() {
      this.$refs.triggerForm.validate(valid => {
        if (valid) {
          addTrigger(this.triggerInfo).then(() => {
            this.$alert('保存成功')
            this.getTriggerList()
            this.dialogTableVisible = false
          })
        } else {
          this.$alert('表单填写错误')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
