<template>
  <div class="app-container">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="读取中" border fit highlight-current-row>
      <el-table-column align="center" label='序号'>
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>
      <el-table-column align="center" label='管理员ID'>
        <template slot-scope="scope">
          {{scope.row.adminId}}
        </template>
      </el-table-column>
      <el-table-column label="管理员姓名"align="center">
        <template slot-scope="scope">
          {{scope.row.adminName}}
        </template>
      </el-table-column>
      <el-table-column label="联系电话" align="center">
        <template slot-scope="scope">
          {{scope.row.adminPhone}}
        </template>
      </el-table-column>
      <el-table-column label="权限" align="center">
        <template slot-scope="scope">
          {{scope.row.adminType}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { findAllAdminInfo } from '@/api/table'

export default {
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      findAllAdminInfo().then(response => {
        var datas = response.data
        for (var i = 0; i < datas.length; i++) {
          datas[i].adminType = datas[i].adminType === '0' ? '超级管理员' : '管理员'
        }
        this.list = response.data
        this.listLoading = false
      })
    }
  }
}
</script>
