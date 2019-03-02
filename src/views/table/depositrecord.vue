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
      <el-table-column align="center" label="押金出入" >
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
      总额：{{total}}
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
import { findAllDepositRecord } from '@/api/table'
import { queryPageDepositRecord } from '@/api/table'

export default {
  inject: ['reload'],
  data() {
    return {
      list: null,
      size: 0,
      listLoading: true,
      currentPage: 1,
      total: 0
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
      findAllDepositRecord().then(response => {
        this.size = response.data.length
        for (var i = 0; i < response.data.length; i++) {
          this.total = this.total + response.data[i].deposit
        }
        this.queryPage(1)
      })
    },
    queryPage(pageIndex) {
      queryPageDepositRecord(pageIndex, 5).then(response => {
        this.list = response.data
        for (var i = 0; i < response.data.length; i++) {
          this.list[i].index = (pageIndex - 1) * 5 + i
          this.list[i].depositText = (response.data[i].deposit > 0 ? '充值' : '退还') + Math.abs(response.data[i].deposit) + '元'
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
        window.location.href = 'http://' + window.location.host + '/YKBikeService/common/exportDepositRecord'
      }
    },
    changePage() {
      this.queryPage(this.currentPage)
    }
  }
}
</script>
