<template>
  <div>
    <el-col v-if="showUser">
      <el-row style="margin-bottom: 5px">
        <el-col :span="2"><el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" label="全选" @change="selectAll"></el-checkbox></el-col>
        <el-col :span="3"><el-button @click="multiDelete" size="mini" type="danger" icon="el-icon-delete" :disabled="isEmpty"></el-button></el-col>
      </el-row>
      <el-row>
        <el-collapse
            v-model="activeNum"
            accordion
            @change="handleCollapseChange">
          <el-collapse-item
              v-for="o in userList"
              :key="o.number"
              :name="o.number">
            <template slot="title">
              <el-checkbox-group
                v-model="checkedList"
                @change="isSelect">
                <el-checkbox :label="o.number" @click.native="stopDefault($event)"></el-checkbox>
              </el-checkbox-group>
              <div class="collapse-title">{{JSON.parse(o.nature).name}}</div>
            </template>
            <el-table
                border
                max-height="500"
                :data="tableData"
                style="width: 100%">
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left" class="table-expand">
                    <el-form-item class="el-form-item" label="测试id" style="width: 100%">
                      <span>{{props.row.id}}</span>
                    </el-form-item>
                    <el-form-item label="测试进程">
                      <span>{{judgeRecord(props.row.record)}}</span>
                    </el-form-item>
                    <el-form-item label="进程结果">
                      <span>{{judgeTag(props.row.tag)}}</span>
                    </el-form-item>
                    <el-form-item label="开始时间">
                      <span>{{props.row.start}}</span>
                    </el-form-item>
                    <el-form-item label="结束时间">
                      <span>{{props.row.end}}</span>
                    </el-form-item>
                    <el-form-item style="width: 100%" v-if="props.row.record === 3 && props.row.tag === 1">
                      <el-button
                          type="primary"
                          style="float: right"
                          @click.native="showDetail(props.row.id)">详细结果</el-button>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column
                label="测试id"
                prop="id"></el-table-column>
              <el-table-column
                label="测试进程"
                width="150px" >
                <template slot-scope="scope">
                  <span>{{judgeRecord(scope.row.record)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="进程结果"
                width="150px">
                <template slot-scope="scope">
                  <el-tag
                      :type="scope.row.tag === 1 ? 'success' : scope.row.tag === 3 ? 'info' : 'danger'">{{judgeTag(scope.row.tag)}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150px">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="onDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row>
        <el-pagination
            v-if="!isQuery"
            @current-change="handleCurrentChange"
            style="text-align: center"
            hide-on-single-page
            :page-count="totalPages"
            layout="prev,pager,next,jumper">
        </el-pagination>
        <el-pagination
            v-if="isQuery"
            @current-change="handleCurrentQueryChange"
            style="text-align: center"
            hide-on-single-page
            :page-count="queryPage"
            layout="prev,pager,next,jumper">
        </el-pagination>
      </el-row>
    </el-col>
    <el-col v-if="!showUser">
      <el-row>
        <el-table
            :data="recordList"
            style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" class="table-expand">
                <el-form-item class="el-form-item" label="测试id" style="width: 100%">
                  <span>{{props.row.id}}</span>
                </el-form-item>
                <el-form-item label="测试进程">
                  <span>{{judgeRecord(props.row.record)}}</span>
                </el-form-item>
                <el-form-item label="进程结果">
                  <span>{{judgeTag(props.row.tag)}}</span>
                </el-form-item>
                <el-form-item label="开始时间">
                  <span>{{props.row.start}}</span>
                </el-form-item>
                <el-form-item label="结束时间">
                  <span>{{props.row.end}}</span>
                </el-form-item>
                <el-form-item style="width: 100%" v-if="props.row.record === 3 && props.row.tag === 1">
                  <el-button
                      type="primary"
                      style="float: right"
                      @click.native="showDetail(props.row.id)">详细结果</el-button>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
              label="测试id"
              prop="id"></el-table-column>
          <el-table-column
              label="测试进程"
              width="150px">
            <template slot-scope="scope">
              <span>{{judgeRecord(scope.row.record)}}</span>
            </template>
          </el-table-column>
          <el-table-column
              label="进程结果"
              width="150px">
            <template slot-scope="scope">
              <el-tag
                  :type="scope.row.tag === 1 ? 'success' : scope.row.tag === 3 ? 'info' : 'danger'">{{judgeTag(scope.row.tag)}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <el-button
                  type="text"
                  @click="onDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-pagination
            v-if="!isQuery"
            @current-change="handleCurrentRecordChange"
            style="text-align: center"
            hide-on-single-page
            :page-count="totalPages"
            layout="prev,pager,next,jumper">
        </el-pagination>
        <el-pagination
            v-if="isQuery"
            @current-change="handleCurrentQueryChange"
            style="text-align: center"
            hide-on-single-page
            :page-count="queryPage"
            layout="prev,pager,next,jumper">
        </el-pagination>
      </el-row>
    </el-col>
    <el-drawer
        title="测试结果"
        :visible.sync="detailCardVisible"
        direction="rtl"
        :before-close="beforeClose"
        size="60%">
      <el-row>
        <el-col v-for="(o, index) in showImgList"
                :key="o"
                :offset="index <= 1 || index >= 3 ? 2 : 4"
                :span="index <= 1 || index >= 3? 9 : 16"
                style="margin-bottom: 25px">
          <el-card :body-style="{ padding: '0px'}">
            <el-image
                :src="o"
                class="image"
                :preview-src-list="showImgList.slice(index,index+1)"></el-image>
            <div style="padding: 14px;">
              <span>测试结果{{index}}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "TestList",
  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
      activeNum: '',
      detailCardVisible: false,
      showImgList: [],
      isEmpty: true,
      checkedList: [],
      unableList: [],
    }
  },
  computed: {

    userList() {
      return this.$store.state.userList
    },
    tableData() {
      return this.$store.state.tableData
    },
    isQuery() {
      return this.$store.state.isQuery
    },
    totalPages () {
      return this.$store.state.totalPages
    },
    queryPage () {
      return this.$store.state.queryPage
    },
    showUser () {
      return this.$store.state.showUser
    },
    recordList() {
      return this.$store.state.recordList
    },
    numberList() {
      return this.$store.state.numberList
    },
    canDelete() {
      return this.$store.state.canDelete
    }
  },
  watch: {
    checkedList(val) {
      if(val.length > 0){
        this.isEmpty = false
      }else {
        this.isEmpty = true
      }
    },
    showUser (val) {
      if(val === true && !this.isQuery()){
        this.$store.dispatch('getUserList',{process: 1,page: 1}).then((res) => {
          let tempData = res.data.data;
          if(tempData.records.length <= 0){
            this.$message({
              message: '已经没有更多数据了哦',
              type: 'warning'
            })
          }else{
            this.$store.commit('initUserList',tempData)
            this.activeNum = this.userList[0].number.toString()

            this.$store.dispatch('getRecordByNumber',this.userList[0].number.toString()).then((res) => {
              if(res.data.code === 200){
                this.$store.commit('changeTableData',res.data.data)
              }
              else if(res.data.code === 2001){
                this.$message({
                  type: 'info',
                  message: '当前用户暂时没有测试数据'
                })
              }else{
                this.$message({
                  type: 'warning',
                  message: '出错了'
                })
              }
            })
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: "系统错误，已取消操作"
          })
        })
      }else if(val === false) {
        this.$store.dispatch('getAllRecords', '1').then((res) => {
          let tempData = res.data.data
          if(tempData.records.length <= 0){
            this.$message({
              message: '已经没有更多数据了哦',
              type: 'warning'
            })
          }else {
            this.$store.commit('initRecordList',tempData)
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: "系统错误，已取消操作"
          })
        })
      }
    },
    userList() {
      this.isIndeterminate = false
      this.$store.commit('setNumberList')
    }
  },
  methods: {
    judgeRecord(record) {
      switch(record) {
        case 0: return '暂无进程'
        case 1: return '主界面'
        case 2: return '眼动校准'
        case 3: return '评测'
        case 4: return '干预'
        case 5: return '放松'
        default: return '数据失效'
      }
    },
    judgeTag(tag) {
      switch (tag) {
        case 0: return '暂无结果'
        case 1: return '成功'
        case 2: return '错误'
        case 3: return '停止'
        default: return '数据失效'
      }
    },
    handleCollapseChange(val) {
      if(val){
        this.$store.commit('clearTableData')
        this.$store.dispatch('getRecordByNumber',val).then((res) => {
          if(res.data.code === 200){
            this.$store.commit('changeTableData',res.data.data)
          }
          else if(res.data.code === 2001){
            this.$message({
              type: 'info',
              message: '当前用户暂时没有测试数据'
            })
          }else{
            this.$message({
              type: 'warning',
              message: '出错了'
            })
          }
        })
      }
    },
    beforeClose() {
      this.detailCardVisible = false
    },
    showDetail(rid) {
      this.detailCardVisible = true
      this.showImgList.splice(0,this.showImgList.length)
      this.$store.dispatch('getReportByRid',rid).then((res) => {
        if(res.data.code === 200){
          this.showImgList = JSON.parse(JSON.stringify(res.data.data.reverse()));
        }else {
          this.$message({
            type: 'info',
            message: '当前评测结果为空'
          })
        }
      })
    },
    handleCurrentChange(val) {
      this.$store.dispatch('getUserList',{process: 1,page: val}).then((res) => {
        let tempList = res.data.data.records
        if(tempList.length <= 0){
          this.$message({
            message: '已经没有更多数据了哦',
            type: 'warning'
          })
        }else{
          this.$store.commit('changeUserList',tempList)
        }
      })
    },
    handleCurrentRecordChange(val) {
      this.$store.dispatch('getAllRecords', val).then((res) => {
        let tempList = res.data.data.records
        if(tempList.length <= 0){
          this.$message({
            message: '已经没有更多数据了哦',
            type: 'warning'
          })
        }else{
          this.$store.commit('changeRecordList',tempList)
        }
      })
    },
    handleCurrentQueryChange(val) {
      this.$store.commit('showQueryList', val)
    },
    onDelete(record) {
      let rid = record.id
      this.$store.dispatch('deleteReport',rid).then((res1) => {
        if(res1.data.code === 200){
          this.$store.dispatch('deleteRecordData',rid).then((res2) => {
            if(res2.data.code === 200){
              this.$store.dispatch('deleteRecord',rid).then((res3) => {
                if(res3.data.code === 200){
                  let list
                  if(this.showUser){
                    list = 'tableData'
                  }else{
                    list = 'recordList'
                  }
                  this.$store.commit('deleteRecord',{rid: rid,list: list})
                  this.$message({
                    type: 'success',
                    message: '删除成功'
                  })
                }else{
                  this.$message({
                    type: 'error',
                    message: '删除报告失败'
                  })
                }
              }).catch(() => {
                this.$message({
                  type: 'error',
                  message: '删除报告失败'
                })
              })
            }else{
              this.$message({
                type: 'error',
                message: '删除测试数据失败'
              })
            }
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '删除测试数据失败'
            })
          })
        }else{
          this.$message({
            type: 'error',
            message: '删除测试记录失败'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '删除测试记录失败'
        })
      })
    },
    isSelect(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.userList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.userList.length
    },
    selectAll(val) {
      this.checkedList = val ? this.numberList : []
      this.isIndeterminate = false
    },
    stringJoint(list) {
      let names = list.pop()
      while (list.length > 0) {
        names += '、' + list.pop()
      }
      return names
    },
    async judgeDelete(number) {
      await this.$store.dispatch('getRecordByNumber',number).then((res) => {
        if(res.data.code === 2001){
          let x = 0
        }else if(res.data.code === 200){
          this.unableList.push(number)
          this.$store.commit('setFalse')
        }else{
          this.$message({
            type: 'warning',
            message: '出错了'
          })
          this.$store.commit('setFalse')
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '系统错误'
        })
        this.$store.commit('setFalse')
      })

    },
    async multiDelete() {
      for(let i = 0;i < this.checkedList.length; i++){
        await this.judgeDelete(this.checkedList[i])
      }
      if(this.canDelete) {
        this.$confirm('此操作将永久删除当前用户信息与数据，是否继续？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.commit('setDeleteList', this.checkedList)
          this.$store.dispatch('deleteMultiUser').then((res) => {

            if (res.data.code === 200) {
              this.$store.commit('deleteMultiUser')
              this.checkedList.splice(0,this.checkedList.length)
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            } else {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            }
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '系统错误'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      }else if(!this.canDelete && this.unableList.length > 0){
        this.$alert('学号为  ' + this.stringJoint(this.unableList) + '  的用户仍存在测试记录，请清理完毕后再进行操作')
      }else{
        this.$message({
          type: 'error',
          message: '系统错误'
        })
      }

      this.unableList.splice(0,this.unableList.length)
      this.$store.commit('setTrue')
    },
    stopDefault(e){
      e.stopPropagation()
    }
  },
  created() {
    this.$store.dispatch('getUserList',{process: 1,page: 1}).then((res) => {
      let tempData = res.data.data;
      if(tempData.records.length <= 0){
        this.$message({
          message: '已经没有更多数据了哦',
          type: 'warning'
        })
      }else{
        this.$store.commit('initUserList',tempData)
        this.activeNum = this.userList[0].number.toString()

        this.$store.dispatch('getRecordByNumber',this.userList[0].number.toString()).then((res) => {
          if(res.data.code === 200){
            this.$store.commit('changeTableData',res.data.data)
          }
          else if(res.data.code === 2001){
            this.$message({
              type: 'info',
              message: '当前用户暂时没有测试数据'
            })
          }else{
            this.$message({
              type: 'warning',
              message: '出错了'
            })
          }
        })
      }
    }).catch(() => {
      this.$message({
        type: 'error',
        message: "系统错误，已取消操作"
      })
    })

  }
}
</script>

<style>
.collapse-title {
  margin-left: 15px;
  font-size: 20px;
  font-family: Arial;
}
.table-expand {
  font-size: 0;
}
.table-expand label {
  width: 90px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.el-table__body-wrapper::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #d5d5db;
  border-radius: 3px;
}

</style>