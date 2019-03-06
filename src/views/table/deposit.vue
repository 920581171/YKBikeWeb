<template>
  <div class="app-container">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="读取中" border fit highlight-current-row>
      <el-table-column align="center" label='序号'>
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>
      <el-table-column align="center" label='记录ID'>
        <template slot-scope="scope">
          {{scope.row.recordId}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="金额">
        <template slot-scope="scope">
          {{scope.row.depositText}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { findDepositRecordByUserId } from '@/api/table'

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
      findDepositRecordByUserId(this.$route.params.userId).then(response => {
        this.list = response.data
        for (var i = 0; i < response.data.length; i++) {
          this.list[i].depositText = (response.data[i].deposit > 0 ? '充值' : '退还') + Math.abs(response.data[i].deposit) + '元'
        }
        this.listLoading = false
      })
    }
  }
}
</script>
