<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true">
        <el-form-item label="执行器名称">
          <el-input placeholder="执行器名称"/>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input placeholder="创建人"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getExecutorList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="dialogTableVisible=true">新增执行器</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table v-loading="listLoading" :data="executorList" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="ID" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.executor.id }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="名字">
          <template slot-scope="scope">
            <span>{{ scope.row.executor.name }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="在线机器">
          <template slot-scope="scope">
            <span style="color: #67C23A;font-weight: bold" v-for="executorDetail in scope.row.executorDetailList">{{ executorDetail.socket }}</span><br/>
          </template>
        </el-table-column>

        <el-table-column align="center" label="创建者">
          <template slot-scope="scope">
            <span>{{ scope.row.executor.creator }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.executor.createTime==0 ? '': parseTime(scope.row.executor.createTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="300">
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
        @current-change="pageChange"
      />
    </el-row>
    <el-dialog v-el-drag-dialog :visible.sync="dialogTableVisible" title="执行器信息" @dragDialog="handleDrag">
      <el-form ref="executorForm" :inline="false" :model="executorInfo" :rules="executorRules" label-width="120px">
        <el-form-item label="触发器名字" prop="name">
          <el-input ref="name" v-model="executorInfo.name" placeholder="触发器名字"/>
        </el-form-item>
        <el-form-item label="触发器描述" prop="description">
          <el-input ref="name" v-model="executorInfo.description" placeholder="触发器描述"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveExecutor">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import elDragDialog from '@/directive/el-drag-dialog'
  import { getAllExecutor, addExecutor } from '@/api/executor'
  import { parseTime } from '@/utils'
  import constant from './constant'

  export default {
    name: 'Executor',
    directives: { elDragDialog },
    data() {
      return {
        listLoading: true,
        executorRules: {
          name: [{ required: true, message: '输入名字', executor: 'blur' }],
          description: [{ required: true, message: '输入执行器描述', executor: 'blur' }]
        },
        executorList: [],
        pageInfo: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        dialogTableVisible: false,
        executorInfo: {
          name: null,
          description: null
        }
      }
    },
    mounted() {
      this.getExecutorList()
    },
    methods: {
      pageChange(currentPage) {
        this.pageInfo.currentPage = currentPage
        this.getExecutorList()
      },
      parseTime: parseTime,
      getExecutorList() {
        getAllExecutor(this.pageInfo).then(response => {
          this.pageInfo = response.pageInfo
          this.executorList = response.executorList
          this.listLoading = false
        })
      },
      // v-el-drag-dialog onDrag callback function
      handleDrag() {
        this.$refs.select.blur()
      },
      saveExecutor() {
        this.$refs.executorForm.validate(valid => {
          if (valid) {
            addExecutor(this.executorInfo).then(() => {
              this.$alert('保存成功')
              this.getExecutorList()
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
