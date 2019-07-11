<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true" :model="selectInfo">
        <el-form-item label="组名称">
          <el-input v-model="selectInfo.name" placeholder="组名称"/>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="selectInfo.creator" placeholder="创建人"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getGroupList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="dialogTableVisible=true">新增组</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table v-loading="listLoading" :data="groupList" border fit highlight-current-row style="width: 100%">

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

        <el-table-column align="center" label="报警邮件">
          <template slot-scope="scope">
            <span>{{ scope.row.mail }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="执行线程数">
          <template slot-scope="scope">
            <span>{{ scope.row.threadPoolNum }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="描述">
          <template slot-scope="scope">
            <span>{{ scope.row.description }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="创建者">
          <template slot-scope="scope">
            <span>{{ scope.row.creator }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime==0 ? '': parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="warning"
              size="small"
              icon="el-icon-edit"
              @click="modify(scope.row)"
            >
              修改
            </el-button>

            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="deleteGroup(scope.row)"
            >
              删除
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
    <el-dialog v-el-drag-dialog :visible.sync="dialogTableVisible" title="执行器信息" @dragDialog="handleDrag">
      <el-form ref="groupForm" :inline="false" :model="groupInfo" :rules="groupRules" label-width="120px">
        <el-form-item label="组名" prop="name">
          <el-input ref="name" v-model="groupInfo.name" placeholder="组名"/>
        </el-form-item>
        <el-form-item label="组报警邮件" prop="mail">
          <el-input ref="name" v-model="groupInfo.mail" placeholder="组报警邮件"/>
        </el-form-item>
        <el-form-item label="执行线程数" prop="threadPoolNum">
          <el-input ref="name" v-model.number="groupInfo.threadPoolNum" placeholder="执行线程数"/>
        </el-form-item>
        <el-form-item label="组描述" prop="description">
          <el-input ref="name" v-model="groupInfo.description" placeholder="组描述"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveGroup">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import elDragDialog from '@/directive/el-drag-dialog'
  import {getAllGroup, getAllGroupByPage, addGroup, deleteGroup} from '@/api/group'
  import {parseTime} from '@/utils'
  import constant from './constant'

  export default {
    name: 'Group',
    directives: {elDragDialog},
    data() {
      return {
        listLoading: true,
        groupRules: {
          name: [{required: true, message: '输入组名', group: 'blur'}],
          description: [{required: true, message: '输入组描述', group: 'blur'}],
          mail: [{required: true, message: '输入报警邮件', group: 'blur'}],
          threadPoolNum: [{required: true, message: '输入执行线程数', trigger: 'blur'}, {
            type: 'number',
            message: '执行线程数必须为数字值'
          }],
        },
        groupList: [],
        selectInfo: {
          currentPage: 1,
          pageSize:
            10,
          total:
            0
        },
        dialogTableVisible: false,
        groupInfo: {}
      }
    },
    mounted() {
      this.getGroupList()
    },
    methods: {
      pageChange(currentPage) {
        this.selectInfo.currentPage = currentPage
        this.getGroupList()
      },
      parseTime: parseTime,
      getGroupList() {
        getAllGroupByPage(this.selectInfo).then(response => {
          this.selectInfo = response.pageInfo
          this.groupList = response.groupList
          this.listLoading = false
        })
      },
      // v-el-drag-dialog onDrag callback function
      handleDrag() {
        this.$refs.select.blur()
      },
      saveGroup() {
        this.$refs.groupForm.validate(valid => {
          if (valid) {
            addGroup(this.groupInfo).then(() => {
              this.$alert('保存成功')
              this.getGroupList()
              this.dialogTableVisible = false
            })
          } else {
            this.$alert('表单填写错误')
            return false
          }
        })
      },
      modify(row) {
        this.groupInfo = row
        this.dialogTableVisible = true
      },
      deleteGroup(row) {
        deleteGroup({groupId: row.id}).then(() => {
          this.$alert('保存成功')
          this.getGroupList()
          this.dialogTableVisible = false
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
