<template>
  <div class="app-container">
    <div>
      <el-date-picker
        v-model="startTime"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择开始日期">
      </el-date-picker>
      <el-date-picker
        v-model="endTime"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择结束日期">
      </el-date-picker>
      <el-button type="primary" @click="searchTime">搜索创建时间</el-button>
      <el-button type="primary" @click="reset">重置</el-button>
    </div>
    <br>
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
        :disabled="isChangePage"
        layout="prev, pager, next"
        :total="size">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { findAllDepositRecord } from '@/api/deposit'
import { queryPageDepositRecord } from '@/api/deposit'
import { findAllDateDepositRecord } from '@/api/deposit'

export default {
  inject: ['reload'],
  data() {
    return {
      list: null,
      size: 0,
      listLoading: true,
      currentPage: 1,
      total: 0,
      startTime: '',
      endTime: '',
      isChangePage: false
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
      this.total = 0
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
        window.location.href = 'http://' + window.location.host + '/YKBikeServer/common/exportDepositRecord'
      }
    },
    changePage() {
      this.queryPage(this.currentPage)
    },
    searchTime() {
      findAllDateDepositRecord(this.startTime, this.endTime).then(response => {
        if (response.code === 1) {
          this.list = response.data
          this.total = 0
          for (var i = 0; i < response.data.length; i++) {
            this.list[i].index = i
            this.list[i].depositText = (response.data[i].deposit > 0 ? '充值' : '退还') + Math.abs(response.data[i].deposit) + '元'
            this.total = this.total + response.data[i].deposit
          }
          this.listLoading = false
          this.isChangePage = true
          this.size = 0
        } else {
          this.$message({
            message: response.msg,
            type: 'error',
            duration: 3 * 1000
          })
        }
      })
    },
    reset() {
      this.startTime = ''
      this.endTime = ''
      this.fetchData()
      this.isChangePage = false
    }
  }
}
</script>
