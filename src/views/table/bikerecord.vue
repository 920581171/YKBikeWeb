<template>
  <div class="app-container">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="读取中" border fit highlight-current-row>
      <el-table-column align="center" label='序号'>
        <template slot-scope="scope">
          {{scope.$index}}
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
    <el-button @click="exportExcel">导出报表</el-button>
  </div>
</template>

<script>
import { findAllBikeRecord } from '@/api/table'
// import { exportBikeRecord } from '@/api/exportExcel'

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
      findAllBikeRecord().then(response => {
        this.list = response.data
        for (var i = 0; i < response.data.length; i++) {
          var createTime = (Date.parse(response.data[i].endTime) - Date.parse(response.data[i].createTime)) / 1000
          this.list[i].duration = Math.round(createTime / 60 * 100) / 100 + '分钟'
          this.list[i].endTime = response.data[i].createTime === response.data[i].endTime ? 'NULL' : response.data[i].endTime
          this.list[i].status = response.data[i].orderStatus === '1' ? '已结算' : '未结算'
        }
        this.listLoading = false
      })
    },
    exportExcel() {
      window.location.href = 'http://' + window.location.host + '/YKBikeService/common/exportBikeRecord'
    }
  }
}
</script>
