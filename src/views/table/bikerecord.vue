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
      <el-table-column align="center" label='订单编号ID'>
        <template slot-scope="scope">
          {{scope.row.orderId}}
        </template>
      </el-table-column>
      <el-table-column align="center" label='用户ID'>
        <template slot-scope="scope">
          {{scope.row.userId}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="车辆ID">
        <template slot-scope="scope">
          {{scope.row.bikeId}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="计费（元）" >
        <template slot-scope="scope">
          {{scope.row.charge}}
        </template>
      </el-table-column>
      <el-table-column align="center"  label="里程（米）">
        <template slot-scope="scope">
          {{scope.row.mileage}}
        </template>
      </el-table-column>
      <el-table-column  align="center" label="时长">
        <template slot-scope="scope">
          {{scope.row.duration}}
        </template>
      </el-table-column>
      <el-table-column  align="center" label="创建时间">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column  align="center" label="结束时间">
        <template slot-scope="scope">
          {{scope.row.endTime}}
        </template>
      </el-table-column>
      <el-table-column  align="center" label="状态">
        <template slot-scope="scope">
          {{scope.row.status}}
        </template>
      </el-table-column>
    </el-table>
    <br>
    <div style="float: left">
      <el-button @click="exportExcel">导出报表</el-button>
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
import { findAllBikeRecord } from '@/api/bikerecord'
import { queryPageBikeRecord } from '@/api/bikerecord'
import { findAllDateBikeRecord } from '@/api/bikerecord'

export default {
  inject: ['reload'],
  data() {
    return {
      list: null,
      size: 0,
      listLoading: true,
      currentPage: 1,
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
      findAllBikeRecord().then(response => {
        this.size = response.data.length
        this.queryPage(1)
      })
    },
    queryPage(pageIndex) {
      queryPageBikeRecord(pageIndex, 5).then(response => {
        this.list = response.data
        for (var i = 0; i < response.data.length; i++) {
          var createTime = (Date.parse(response.data[i].endTime) - Date.parse(response.data[i].createTime)) / 1000
          this.list[i].index = (pageIndex - 1) * 5 + i
          this.list[i].duration = Math.round(createTime / 60 * 100) / 100 + '分钟'
          this.list[i].endTime = response.data[i].createTime === response.data[i].endTime ? 'NULL' : response.data[i].endTime
          this.list[i].status = response.data[i].orderStatus === '1' ? '已结算' : '未结算'
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
        window.location.href = 'http://' + window.location.host + '/YKBikeServer/common/exportBikeRecord'
      }
    },
    changePage() {
      this.queryPage(this.currentPage)
    },
    searchTime() {
      findAllDateBikeRecord(this.startTime, this.endTime).then(response => {
        if (response.code === 1) {
          this.list = response.data
          for (var i = 0; i < response.data.length; i++) {
            var createTime = (Date.parse(response.data[i].endTime) - Date.parse(response.data[i].createTime)) / 1000
            this.list[i].index = i
            this.list[i].duration = Math.round(createTime / 60 * 100) / 100 + '分钟'
            this.list[i].endTime = response.data[i].createTime === response.data[i].endTime ? 'NULL' : response.data[i].endTime
            this.list[i].status = response.data[i].orderStatus === '1' ? '已结算' : '未结算'
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
