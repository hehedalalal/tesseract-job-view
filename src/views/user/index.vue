<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true" :model="selectInfo">
        <el-form-item label="用户名">
          <el-input v-model="selectInfo.name" placeholder="用户名"/>
        </el-form-item>
        <el-form-item label="用户状态">
          <el-select v-model="selectInfo.status" placeholder="请选择状态">
            <el-option v-for="status in statusList" :label="status.value" :value="status.key"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUserList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="addUserBtn">新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table v-loading="listLoading" :data="userList" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="ID" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户名">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1" style="color: #67C23A;font-weight: bold">{{ statusMap.get(scope.row.status) }}</span>
            <span v-else style="color: #F56C6C;font-weight: bold">{{ statusMap.get(scope.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime==0 ? '': parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="更新时间" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime==0 ? '': parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="340">
          <template slot-scope="scope">
            <el-button
              type="warning"
              size="small"
              icon="el-icon-edit"
              @click="passwordRevert(scope.row.id)"
            >
              密码重置
            </el-button>

            <el-button
              v-if="scope.row.status==1"
              type="warning"
              size="small"
              icon="el-icon-delete"
              @click="invalid(scope.row.id)"
            >
              停用
            </el-button>

            <el-button
              v-else
              type="success"
              size="small"
              icon="el-icon-edit"
              @click="valid(scope.row.id)"
            >
              启用
            </el-button>

            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="deleteUser(scope.row.id)"
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
    <el-dialog v-el-drag-dialog :visible.sync="dialogTableVisible" title="触发器信息" @dragDialog="handleDrag">
      <el-form ref="userForm" :inline="false" :model="userInfo" :rules="userRules" label-width="120px">
        <el-form-item label="用户名" prop="name">
          <el-input ref="name" v-model="userInfo.name" placeholder="触发器名字"/>
        </el-form-item>
        <el-form-item label="用户组" prop="group">
          <el-select v-model="userInfo.groupId" placeholder="用户组">
            <el-option v-for="group in groupList" :label="group.name" :value="group.id"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveUser">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import elDragDialog from '@/directive/el-drag-dialog'
  import {getAllUser, addUser, passwordRevert, validUser, invalidUser, deleteUser} from '@/api/user'
  import {getAllGroup} from '@/api/group'
  import constant from './constant'
  import {parseTime} from '@/utils'
  import commonUtils from '@/utils/commonUtils'


  export default {
    name: 'User',
    directives: {elDragDialog},
    data() {
      return {
        userRules: {
          name: [{required: true, message: '输入用户名', user: 'blur'}],
          group: [{required: true, message: '请选择用户组', trigger: 'blur'}],
        },
        userList: [],
        selectInfo: {
          currentPage: 1,
          pageSize: 10,
          total: 0,
          status: null
        },
        dialogTableVisible: false,
        userInfo: {
          name: null
        },
        statusMap: constant.statusMap,
        statusList: constant.statusList,
        listLoading: false,
        groupList: null,
        groupMap: null
      }
    },
    mounted() {
      this.getUserList()
    },
    methods: {
      parseTime: parseTime,
      addUserBtn() {
        getAllGroup().then(response => {
          if (response.length == 0) {
            this.$alert('请先创建组')
            return
          }
          this.groupList = response
          this.groupMap = commonUtils.listToMap(response)
          this.dialogTableVisible = true
        })

      },
      pageChange(currentPage) {
        this.selectInfo.currentPage = currentPage
        this.getUserList()
      },
      getUserList() {
        getAllUser(this.selectInfo).then(response => {
          this.selectInfo = response.pageInfo
          this.userList = response.userList
        })
      },
      // v-el-drag-dialog onDrag callback function
      handleDrag() {
        this.$refs.select.blur()
      },
      saveUser() {
        this.$refs.userForm.validate(valid => {
          if (valid) {
            this.userInfo.groupId = this.groupMap.get(this.userInfo.groupId)
            addUser(this.userInfo).then(() => {
              this.$alert('保存成功,用户密码为默认密码')
              this.getUserList()
              this.dialogTableVisible = false
            })
          } else {
            this.$alert('表单填写错误')
            return false
          }
        })
      },
      passwordRevert(userId) {
        passwordRevert(userId).then(() => {
          this.$alert('重置成功')
        })
      },
      valid(userId) {
        validUser({userId: userId}).then(() => {
          this.$alert('启用成功')
          this.getUserList()
        })
      },
      invalid(userId) {
        invalidUser({userId: userId}).then(() => {
          this.$alert('停用成功')
          this.getUserList()
        })
      },
      deleteUser(userId) {
        deleteUser({userId: userId}).then(() => {
          this.$alert('删除成功')
          this.getUserList()
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
