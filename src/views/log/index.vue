<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true" :model="selectInfo">
        <el-form-item label="触发器名字">
          <el-input v-model="selectInfo.triggerName" placeholder="触发器名字"/>
        </el-form-item>
        <el-form-item label="执行器地址">
          <el-input v-model="selectInfo.socket" placeholder="执行器地址"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="selectInfo.status" placeholder="请选择状态">
            <el-option v-for="status in statusList" :label="status.value" :value="status.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="执行信息">
          <el-input v-model="selectInfo.msg" placeholder="执行信息"/>
        </el-form-item>
        <el-form-item label="创建者">
          <el-input v-model="selectInfo.creator" placeholder="创建者"/>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="createTimeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"/>
        </el-form-item>
        <el-form-item label="完成时间">
          <el-date-picker
            v-model="updateTimeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getLogList">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table v-loading="listLoading" :data="logList" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="ID" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="触发器名字">
          <template slot-scope="scope">
            <span>{{ scope.row.triggerName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="执行器地址">
          <template slot-scope="scope">
            <span>{{ scope.row.socket }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status==0" style="color:#DC143C">{{ statusMap.get(scope.row.status) }}</span>
            <span v-if="scope.row.status==1" style="color:#05dc90">{{ statusMap.get(scope.row.status) }}</span>
            <span v-if="scope.row.status==2" style="color:#dcd324">{{ statusMap.get(scope.row.status) }}</span>
            <span v-if="scope.row.status==3" style="color:#d92fdc">{{ statusMap.get(scope.row.status) }}</span>
          </template>
        </el-table-column>
        <!--        <el-table-column align="center" label="执行信息">-->
        <!--          <template slot-scope="scope">-->
        <!--            <span>{{ scope.row.msg }}</span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column align="center" label="操作者">
          <template slot-scope="scope">
            <span>{{ scope.row.creator }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime==0 ? '': parseTime(scope.row.endTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="结束时间" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.endTime==0 ? '': parseTime(scope.row.endTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="showMsg(row.msg)"
            >
              查看执行信息
            </el-button>
          </template>

        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination
        :total="selectInfo.total"
        :current-page="selectInfo.currentPage"
        :page-size="selectInfo.pageSize"
        align="center"
        background
        layout="prev, pager, next"
        @current-change="pageChange"
      />
    </el-row>
    <el-dialog v-el-drag-dialog :visible.sync="msgDialogVisible" title="执行信息" @dragDialog="handleDrag">
      {{ logMsg }}
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import { getAllLog } from '@/api/log'
import constant from './constant'
import { parseTime } from '@/utils'

export default {
  name: 'Log',
  directives: { elDragDialog },
  data() {
    return {
      logList: [],
      selectInfo: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        status: null,
        triggerName: null,
        socket: null,
        msg: null,
        creator: null,

        startCreateTime: null,
        endCreateTime: null,
        startUpdateTime: null,
        endUpdateTime: null
      },
      createTimeRange: [],
      updateTimeRange: [],
      dialogTableVisible: false,
      statusMap: constant.statusMap,
      statusList: constant.statusList,
      msgDialogVisible: false,
      logMsg: null
    }
  },
  mounted() {
    const start = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime() // 当天0点
    const end = new Date(new Date(new Date().toLocaleDateString()).getTime() +
        24 * 60 * 60 * 1000).getTime()
    // this.createTimeRange.push(start, end)
    // this.updateTimeRange.push(start, end)
    this.getLogList()
  },
  methods: {
    showMsg(msg) {
      this.logMsg = msg
      this.msgDialogVisible = true
    },
    parseTime: parseTime,
    pageChange(currentPage) {
      this.selectInfo.currentPage = currentPage
      this.getLogList()
    },
    getLogList() {
      if (this.createTimeRange) {
        this.selectInfo.startCreateTime = this.createTimeRange[0]
        this.selectInfo.endCreateTime = this.createTimeRange[1]
      }
      if (this.startUpdateTime) {
        this.selectInfo.startUpdateTime = this.updateTimeRange[0]
        this.selectInfo.endUpdateTime = this.updateTimeRange[1]
      }
      getAllLog(this.selectInfo).then(response => {
        this.selectInfo = response.pageInfo
        this.logList = response.logList
      })
    },
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      this.$refs.select.blur()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
