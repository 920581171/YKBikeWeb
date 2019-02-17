<template>
  <div class="app-container">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="读取中" border fit highlight-current-row>
      <el-table-column align="center" label='序号'>
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>
      <el-table-column align="center" label='用户ID'>
        <template slot-scope="scope">
          {{scope.row.userId}}
        </template>
      </el-table-column>
      <el-table-column label="用户账号"align="center">
        <template slot-scope="scope">
          {{scope.row.userName}}
        </template>
      </el-table-column>
      <el-table-column label="联系电话" align="center">
        <template slot-scope="scope">
          {{scope.row.userPhone}}
        </template>
      </el-table-column>
      <el-table-column label="押金" align="center">
        <template slot-scope="scope">
          {{scope.row.deposit}}
        </template>
      </el-table-column>
      <el-table-column label="余额" align="center">
        <template slot-scope="scope">
          {{scope.row.balance}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { findAllUserInfo } from '@/api/table'

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
      findAllUserInfo().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    }
  }
}
</script>
