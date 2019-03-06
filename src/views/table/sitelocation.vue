<template>
  <div class="app-container">
    <el-checkbox-group v-model="checkList">
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="读取中" border fit highlight-current-row>
      <el-table-column align="center" label='序号'>
        <template slot-scope="scope">
          <el-checkbox :label=scope.row.siteId>{{scope.row.index}}</el-checkbox>
        </template>
      </el-table-column>
      <el-table-column align="center" label='站点ID'>
        <template slot-scope="scope">
          {{scope.row.siteId}}
        </template>
      </el-table-column>
      <el-table-column align="center" label='纬度'>
        <template slot-scope="scope">
          {{scope.row.latitude}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="经度" >
        <template slot-scope="scope">
          {{scope.row.longitude}}
        </template>
      </el-table-column>
      <el-table-column  align="center" label="时间">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
    </el-table>
    </el-checkbox-group>
    <br>
    <div style="float: left">
      <el-button @click="selectAll">全选</el-button>
      <el-button @click="deleteBike">批量删除所选项</el-button>
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

    <el-dialog
      title="重置密码"
      :visible.sync="dialogVisible"
      width="30%">
      <spen>确定删除：{{checkList.toString()}}站点？</spen>
      <span slot="footer" class="dialog-footer">
    <el-button @click="[dialogVisible = false]">取 消</el-button>
    <el-button type="primary" @click="[dialogVisible = false,deleteMore(checkList)]">删 除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
import { findAllSiteLocation } from '@/api/siteLocation'
import { queryPageSiteLocation } from '@/api/siteLocation'
import { deleteMoreSiteLocation } from '@/api/siteLocation'

export default {
  inject: ['reload'],
  data() {
    return {
      list: null,
      size: 0,
      listLoading: true,
      currentPage: 1,
      dialogVisible: false,
      checkList: []
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
      findAllSiteLocation().then(response => {
        this.size = response.data.length
        this.queryPage(1)
      })
    },
    queryPage(pageIndex) {
      queryPageSiteLocation(pageIndex, 5).then(response => {
        this.list = response.data
        for (var i = 0; i < response.data.length; i++) {
          this.list[i].index = (pageIndex - 1) * 5 + i
        }
        this.listLoading = false
      })
    },
    deleteBike() {
      if (this.checkList.length === 0) {
        Message({
          message: '请选择车辆',
          type: 'error',
          duration: 3 * 1000
        })
        return
      }
      this.dialogVisible = true
    },
    deleteMore() {
      deleteMoreSiteLocation(this.checkList).then(response => {
        if (response.code === 1) {
          Message({
            message: '删除成功',
            type: 'success',
            duration: 3 * 1000
          })
        } else {
          Message({
            message: '出现异常',
            type: 'error',
            duration: 3 * 1000
          })
        }
      })
      this.fetchData()
    },
    changePage() {
      this.queryPage(this.currentPage)
    },
    selectAll() {
      var ids = []
      for (var i = 0; i < this.list.length; i++) {
        ids[i] = this.list[i].siteId
      }
      if (this.checkList.length === ids.length) {
        this.checkList = []
      } else {
        this.checkList = ids
      }
    }
  }
}
</script>
