<template>
  <el-card
    id="box-card"
    shadow="hover"
    >
    <div slot="header">
      <span id="header-text">{{userInfo.name}}</span>
      <el-button
          style="float: right"
          icon="el-icon-delete"
          type="danger"
          size="mini"
          circle
          @click.stop="onDelete($event)">
      </el-button>
      <el-button
        style="float: right;margin-right: 7px"
        icon="el-icon-edit"
        type="primary"
        size="mini"
        circle
        @click="onEdit($event)">
      </el-button>
    </div>
    <div>
      <el-col
          @click.native="showDetail">
        <el-row class="info-text">
          <span>学号： {{userInfo.number}}</span>
        </el-row>
        <el-row class="info-text">
          <span>性别： {{userInfo.sex}}</span>
        </el-row>
        <el-row class="info-text" id="last-info">
          <span>年龄： {{userInfo.age}}</span>
        </el-row>
      </el-col>
    </div>

    <el-dialog
      title="修改用户信息"
      :visible.sync="editFormVisible"
      @close="onClose">
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" type="text"></el-input>
        </el-form-item>
        <el-form-item label="编号" prop="number">
          <el-input disabled v-html="user.number"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex" >
          <el-radio v-model="editForm.sex" label="1">男</el-radio>
          <el-radio v-model="editForm.sex" label="0">女</el-radio>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="editForm.age" placeholder="editForm.age"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>

    <el-drawer
        title="测试结果"
        :visible.sync="detailCardVisible"
        direction="rtl"
        :before-close="beforeClose"
        size="60%">
      <el-col v-if="!isEmpty">
        <el-row>
          <div
            style=" margin-left: 20px;
                    margin-bottom: 20px">
            开始时间：{{this.showBgTime}} -- 结束时间：{{this.showEdTime}}
          </div>
        </el-row>
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
        <el-row>
          <el-pagination
              @current-change="handleShowChange"
              style="text-align: center"
              hide-on-single-page
              :page-count="showPage"
              layout="prev,pager,next,jumper">
          </el-pagination>
        </el-row>
      </el-col>
      <el-empty v-if="isEmpty"></el-empty>
    </el-drawer>
  </el-card>
</template>

<script>
export default {
  name: "UserCard",
  data() {
    return {
      userInfo: {
        name: '',
        number: '',
        sex: '',
        age: '',
      },
      editFormVisible: false,
      editForm: {},
      editRules: {
        name: [
          {required: true, message: '请输入用户姓名', trigger: 'blur'}
        ],
        age: [
          {required: true, message: '请输入年龄', trigger: 'blur'}
        ]
      },
      isEmpty: true,
      detailCardVisible: false,
      showImgList: [],
      showRecordList: [],
      showPage: 0,
      showBgTime: '',
      showEdTime: '',
    }
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  watch: {
    user: {
      handler(newVal,oldVal) {
        this.userInfo.number = newVal.number
        this.judgeSex(newVal.sex.toString())
        this.userInfo.age = newVal.age
        this.userInfo.name = newVal.nature && JSON.parse(this.user.nature).name

        this.editForm = {...this.userInfo}
        this.editForm.sex = newVal.sex.toString()
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    onEdit(e) {
      this.editFormVisible = true
      e.stopPropagation()
    },
    onDelete(e) {
      e.stopPropagation()
      this.$store.dispatch('getRecordByNumber',this.user.number).then((res) => {
        if(res.data.code === 2001){
          this.$confirm('此操作将永久删除当前用户信息与数据，是否继续？','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$store.dispatch('deleteUser',this.user.number).then((res) => {
              if(res.data.code === 200){
                this.$store.commit('deleteUser',this.user.number)
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              }else{
                this.$message({
                  type: 'error',
                  message: '删除失败'
                })
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
        }else if(res.data.code === 200){
          this.$alert('当前用户仍存在测试记录，请清理完毕后再进行操作')
        }else{
          this.$message({
            type: 'warning',
            message: '出错了'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '系统错误'
        })
      })
    },
    onClose() {
      this.$refs["editForm"].resetFields()
    },
    submitForm() {
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          let updateUser = {...this.editForm}
          updateUser.nature = "{  \"name\": \"" + this.editForm.name + "\"}"
          this.$delete(updateUser,'name')
          updateUser.sex = parseInt(updateUser.sex)
          updateUser.age = parseInt(updateUser.age)
          updateUser.timestamp = new Date().getTime()
          updateUser.id = this.user.id

          this.$store.dispatch('updateUser',updateUser).then((res) => {
            if(res.data.code === 200){
              this.$message({
                type: 'success',
                message: '修改成功'
              })

              this.$store.commit('updateUser', updateUser)
              this.userInfo.name = this.editForm.name
              this.judgeSex(this.editForm.sex)
              this.editFormVisible = false
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          }).catch(() => {
            this.$message({
              type: 'error',
              message: "系统错误，已取消操作"
            })
          })
        }else {
          this.$message({
            type: 'error',
            message: '信息填写有误'
          })
        }
      })
    },
    beforeClose() {
      this.isEmpty = true
      this.detailCardVisible = false
    },
    handleShowChange(val) {
      this.showImgList.splice(0,this.showImgList.length)
      this.showBgTime = this.showRecordList[val -1].start
      this.showEdTime = this.showRecordList[val -1].end
        this.$store.dispatch('getReportByRid',this.showRecordList[val - 1].id).then((res) => {
          if(res.data.code === 200){
            this.isEmpty = false
            this.showImgList = JSON.parse(JSON.stringify(res.data.data.reverse()));
          }else {
            this.$message({
              type: 'info',
              message: '该用户没有评测结果'
            })
          }
        })
      },
    showDetail() {
      let user = this.user
      this.detailCardVisible = true
      this.showRecordList.splice(0,this.showRecordList.length)
      this.showImgList.splice(0,this.showImgList.length)

      this.$store.dispatch('getRecordByNumber',user.number).then((res) => {
        if(res.data.code === 200){
          this.isEmpty = false
          let data = res.data.data
          this.showRecordList = data.filter(item => item.record === 3 && item.tag === 1)
          this.sortKey(this.showRecordList,'unixstart')
          this.showPage = this.showRecordList.length
          if(this.showRecordList.length > 0){
            this.showBgTime = this.showRecordList[0].start
            this.showEdTime = this.showRecordList[0].end
            this.$store.dispatch('getReportByRid',this.showRecordList[0].id).then((res) => {
              if(res.data.code === 200){
                this.showImgList = JSON.parse(JSON.stringify(res.data.data.reverse()));
              }else {
                this.$message({
                  type: 'info',
                  message: '当前评测结果为空'
                })
              }
            })
          }
        }else if(res.data.code === 2001){
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
    },
    judgeSex(sex) {
      if(sex === "1"){
        this.userInfo.sex = "男"
      }else{
        this.userInfo.sex = "女"
      }
    },
    sortKey(list,key){
      return list.sort(function(a,b){
        let x = a[key];
        let y = b[key];
        return ((x<y)?-1:(x>y)?1:0)
      })
    }
  },
  created() {
    this.userInfo.name = this.user.nature && JSON.parse(this.user.nature).name
    this.judgeSex(this.user.sex.toString())

    let tempUser = {};
    tempUser.name = this.userInfo.name
    tempUser.number = this.user.number
    tempUser.sex = this.user.sex.toString()
    tempUser.age = this.user.age

    this.editForm = {...tempUser}

  }
}
</script>

<style scoped>
#box-card{
  margin-right: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  border-width: 5px;
  width: 300px;
}
#header-text{
  line-height: 45px;
  font-family: "Arial";
  font-size: 30px;
}
.info-text{
  margin-bottom: 5px;
}
#last-info{
  margin-bottom: 15px;
}
.image {
  width: 100%;
  display: block;
}
</style>