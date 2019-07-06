<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true">
        <el-form-item label="用户名">
          <el-input placeholder="用户名" />
        </el-form-item>
        <el-form-item label="用户状态">
          <el-input placeholder="用户状态" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-input placeholder="开始时间" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-input placeholder="结束时间" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="dialogTableVisible=true">新增用户</el-button>
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
            <span>{{ statusMap.get(scope.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime==0 ? '': parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="更新时间" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime==0 ? '': parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
              密码重置
            </el-button>

            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="row.edit=!row.edit"
            >
              停用
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
      <el-form ref="userForm" :inline="false" :model="userInfo" :rules="userRules" label-width="120px">
        <el-form-item label="用户名" prop="name">
          <el-input ref="name" v-model="userInfo.name" placeholder="触发器名字" />
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
import { getAllUser, addUser } from '@/api/user'
import constant from './constant'

export default {
  name: 'User',
  directives: { elDragDialog },
  data() {
    return {
      userRules: {
        name: [{ required: true, message: '输入用户名', user: 'blur' }]
      },
      userList: [],
      pageInfo: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      dialogTableVisible: false,
      userInfo: {
        name: null
      },
      statusMap: constant.statusMap
    }
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      getAllUser(this.pageInfo).then(response => {
        this.pageInfo = response.pageInfo
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
