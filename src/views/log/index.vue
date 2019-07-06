<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true">
        <el-form-item label="触发器名字">
          <el-input placeholder="触发器名字" />
        </el-form-item>
        <el-form-item label="执行器地址">
          <el-input placeholder="执行器地址" />
        </el-form-item>
        <el-form-item label="状态">
          <el-input placeholder="状态" />
        </el-form-item>
        <el-form-item label="执行信息">
          <el-input placeholder="执行信息" />
        </el-form-item>
        <el-form-item label="创建者">
          <el-input placeholder="创建者" />
        </el-form-item>
        <el-form-item label="创建开始时间">
          <el-input placeholder="创建开始时间" />
        </el-form-item>
        <el-form-item label="创建结束时间">
          <el-input placeholder="创建结束时间" />
        </el-form-item>
        <el-form-item label="完成开始时间">
          <el-input placeholder="完成开始时间" />
        </el-form-item>
        <el-form-item label="完成结束时间">
          <el-input placeholder="完成结束时间" />
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
            <span>{{ statusMap.get(scope.row.status) }}</span>
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
        @current-change="pageChange"
      />
    </el-row>
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
      pageInfo: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      dialogTableVisible: false,
      statusMap: constant.statusMap
    }
  },
  mounted() {
    this.getLogList()
  },
  methods: {
    parseTime: parseTime,
    pageChange(currentPage) {
      this.pageInfo.currentPage = currentPage
      this.getLogList()
    },
    getLogList() {
      getAllLog(this.pageInfo).then(response => {
        this.pageInfo = response.pageInfo
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
