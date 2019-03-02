<template>
  <div class="app-container">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="读取中" border fit highlight-current-row>
      <el-table-column align="center" label='序号'>
        <template slot-scope="scope">
          {{scope.row.index}}
        </template>
      </el-table-column>
      <el-table-column align="center" label='记录ID'>
        <template slot-scope="scope">
          {{scope.row.recordId}}
        </template>
      </el-table-column>
      <el-table-column align="center" label='用户ID'>
        <template slot-scope="scope">
          {{scope.row.userId}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="充值/消费" >
        <template slot-scope="scope">
          {{scope.row.depositText}}
        </template>
      </el-table-column>
      <el-table-column  align="center" label="时间">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
    </el-table>
    <br>
    <div style="float: left">
      <el-button @click="exportExcel">导出报表</el-button>
    </div>
    <div style="position: fixed;left: 50%;">
      用户充值：{{totalRecharge}}&nbsp;&nbsp;&nbsp;&nbsp;用户消费：{{totalCharge}}
    </div>
    <div style="float: right">
      <el-pagination
        @current-change="changePage"
        :current-page.sync="currentPage"
        page-size="5"
        layout="prev, pager, next"
        :total="size">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { findAllBalanceRecord } from '@/api/table'
import { queryPageBalanceRecord } from '@/api/table'

export default {
  inject: ['reload'],
  data() {
    return {
      list: null,
      size: 0,
      listLoading: true,
      currentPage: 1,
      totalRecharge: 0,
      totalCharge: 0
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
  computed: {
    ...mapGetters([
      'adminType'
    ])
  },
  methods: {
    fetchData() {
      this.listLoading = true
      findAllBalanceRecord().then(response => {
        this.size = response.data.length
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].balance >= 0) {
            this.totalRecharge = this.totalRecharge + response.data[i].balance
          } else {
            this.totalCharge = this.totalCharge + response.data[i].balance
          }
        }
        this.totalCharge = Math.abs(this.totalCharge).toFixed(2)
        this.queryPage(1)
      })
    },
    queryPage(pageIndex) {
      queryPageBalanceRecord(pageIndex, 5).then(response => {
        this.list = response.data
        for (var i = 0; i < response.data.length; i++) {
          this.list[i].index = (pageIndex - 1) * 5 + i
          this.list[i].depositText = (response.data[i].balance > 0 ? '充值' : '消费') + Math.abs(response.data[i].balance) + '元'
        }
        this.listLoading = false
      })
    },
    exportExcel() {
      if (this.adminType === '1') {
        this.$message({
          message: '权限不够',
          type: 'error',
          duration: 3 * 1000
        })
      } else {
        window.location.href = 'http://' + window.location.host + '/YKBikeService/common/exportBalanceRecord'
      }
    },
    changePage() {
      this.queryPage(this.currentPage)
    }
  }
}
</script>
