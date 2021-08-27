<template>
  <el-container>
    <vue-canvas-nest :config="{color:'76,110,245', count: 200, opacity: 1}"></vue-canvas-nest>
    <el-aside width="20%">
      <Aside style="margin-top: 100px" id="aside"></Aside>
    </el-aside>
    <el-container>
      <el-header
          height="70px"
          style="margin-top: 10px;width: 80%">
        <div>
          <div style="line-height: 70px;
                    font-size: 35px;
                    float: left;
                    /*text-align: center;*/
                    font-family: 'PingFang SC'">
            {{ title }}
          </div>
          <div class="header-right" v-if="title === '用户列表'">
            <el-input
              @change="onUserQuery"
              style=" display: inline-block;
                      width: 180px;
                      margin-right: 10px"
              placeholder="请输入姓名或学号"
              prefix-icon="el-icon-search"
              v-model="query"
              size="small"
              clearable>
            </el-input>
            <el-button
              size="small"
              type="primary"
              icon="el-icon-plus"
              style=" display: inline-block;
                      padding-bottom: 10px;
                      height: 30px"
              @click="insertFormVisible = true"
              ></el-button>
          </div>
          <div class="header-right" v-if="title === '测试列表'">
            <el-input
                @change="onTestQuery"
                style=" display: inline-block;
                      width: 180px;
                      margin-right: 10px"
                placeholder="请输入姓名或学号"
                prefix-icon="el-icon-search"
                v-model="query"
                size="small"
                clearable>
            </el-input>
            <el-tooltip :content="decision" placement="top">
              <el-switch
                :disabled="isDisabled"
                v-model="decision"
                active-color="#409EFF"
                active-value="通过用户列表形式展示测试记录"
                inactive-value="直接枚举测试记录"
                active-icon-class="el-icon-user-solid"
                inactive-icon-class="el-icon-tickets"
                @change="changeShowType"
              ></el-switch>
            </el-tooltip>
          </div>
        </div>
        <el-divider id="divider"></el-divider>
      </el-header>
      <el-main style="overflow-y: hidden;">
        <div id="main-body">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
    <el-dialog
      title="添加用户"
      :visible.sync="insertFormVisible"
      @close="onCLose">
      <el-form
        v-if="!isMultiple"
        :model="insertForm"
        :rules="insertRules"
        ref="insertForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="insertForm.name" type="text" placeholder="请输入被测者姓名"></el-input>
        </el-form-item>
        <el-form-item label="编号" prop="number">
          <el-input v-model="insertForm.number" tyoe="text" placeholder="请输入被测者编号"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex" >
          <el-radio v-model="insertForm.sex" label="1">男</el-radio>
          <el-radio v-model="insertForm.sex" label="0">女</el-radio>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="insertForm.age" placeholder="请输入1-3位数字"></el-input>
        </el-form-item>
      </el-form>
      <el-upload
          v-if="isMultiple"
          :auto-upload="false"
          action=""
          multiple
          accept=".xls,.xlsx"
          ref="upload">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件,请提前确认当前文件内容格式是否符合要求！</div>
      </el-upload>
      <div slot="footer">
        <el-button v-if="!isMultiple" type="text" @click="onUpload"  style="float:left;">批量上传</el-button>
        <el-button v-if="isMultiple" type="text" @click="onUpload" style="float:left;">单独上传</el-button>
        <el-button @click="insertFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import vueCanvasNest from 'vue-canvas-nest'
import Aside from './components/Aside'

export default {
  name: 'App',
  components: {
    vueCanvasNest,
    Aside
  },
  computed:{
    title () {
      return this.$store.state.title
    },
    isQuery () {
      return this.$store.state.isQuery
    }
  },
  watch: {
    isQuery(val) {
      if(val === true){
        this.isDisabled = true
      }else {
        this.isDisabled = false
      }
    }
  },
  data() {
    return {
      uploadList: [],
      isMultiple: false,
      isDisabled: false,
      decision: "通过用户列表形式展示测试记录",
      query: '',
      insertFormVisible: false,
      insertForm: {},
      insertRules: {
        name: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        age: [
          {required: true, message: '请输入年龄', trigger: 'blur'},
          {pattern: /^[1-9][0-9]{0,2}$/, message: '请输入1到3位非零数字', trigger: 'blur'}
        ],
        number: [
          {required: true, message: '请输入被测者编号', trigger: 'blur'}
        ],
        sex: [
          {required: true, message: '请选择性别', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    onUserQuery() {
      let query = this.query
      let name = /^[(\u4e00-\u9fa5)]+|[a-zA-Z]+$/gi
      let number = /^[a-zA-Z]?[0-9]+$/gi
      if(number.test(query)){
        this.$store.dispatch('queryUserByNum',query).then((res) => {
          if(res.data.code === 200){
            this.$message({
              type: 'success',
              message: '查询成功'
            })
            this.$store.commit('queryUsers', res.data.data)

          }else if(res.data.code === 1005){
            this.$message({
              type: 'warning',
              message: '查无此人'
            })
          }else {
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
      }else if(name.test(query)){
        this.$store.dispatch('queryUserByName',query).then((res) => {
          if(res.data.code === 200){
            this.$message({
              type: 'success',
              message: '查询成功'
            })
            this.$store.commit('queryUsers', res.data.data)

          }else if(res.data.code === 1005){
            this.$message({
              type: 'warning',
              message: '查无此人'
            })
          }else {
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
        this.$store.dispatch('getUserList',{process: 0,page: 1}).then((res) => {
          let tempData = res.data.data;
          if(tempData.records.length <= 0){
            this.$message({
              message: '已经没有更多数据了哦',
              type: 'warning'
            })
          }else{
            this.$store.commit('initUserList',tempData)
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: "系统错误，已取消操作"
          })
        })
      }
    },
    onTestQuery() {
      let query = this.query
      let name = /^[(\u4e00-\u9fa5)]+|[a-zA-Z]+$/gi
      let number = /^[a-zA-Z]?[0-9]+$/gi
      if(number.test(query)){
        this.$store.dispatch('queryUserByNum',query).then((res) => {
          if(res.data.code === 200){
            this.$message({
              type: 'success',
              message: '查询成功'
            })
            this.$store.commit('queryUsers', res.data.data)

          }else if(res.data.code === 1005){
            this.$message({
              type: 'warning',
              message: '查无此人'
            })
          }else {
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
      }else if(name.test(query)){
        this.$store.dispatch('queryUserByName',query).then((res) => {
          if(res.data.code === 200){
            this.$message({
              type: 'success',
              message: '查询成功'
            })
            this.$store.commit('queryUsers', res.data.data)

          }else if(res.data.code === 1005){
            this.$message({
              type: 'warning',
              message: '查无此人'
            })
          }else {
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
        this.$store.dispatch('getUserList',{process: 1,page: 1}).then((res) => {
          let tempData = res.data.data;
          if(tempData.records.length <= 0){
            this.$message({
              message: '已经没有更多数据了哦',
              type: 'warning'
            })
          }else{
            this.$store.commit('initUserList',tempData)
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: "系统错误，已取消操作?"
          })
        })
      }
    },
    onCLose() {
      if(!this.isMultiple){
        this.$refs["insertForm"].resetFields()
      }
    },
    submitForm() {
      if(!this.isMultiple){
        this.$refs["insertForm"].validate((valid) => {
          if(valid) {
            let insertUser = {...this.insertForm}
            insertUser.nature = "{  \"name\": \"" + this.insertForm.name + "\"}"
            this.$delete(insertUser,'name')
            insertUser.sex = parseInt(insertUser.sex)
            insertUser.age = parseInt(insertUser.age)
            this.$store.dispatch('insertUser',insertUser).then((res) => {
              if(res.data.code === 200){
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
                this.insertFormVisible = false
                this.$store.dispatch('queryUserByNum',insertUser.number).then((res) => {
                  if(res.data.code === 200) {
                    let user = res.data.data[0]
                    this.$store.commit('insertUser',user)
                  }else {
                    this.$message({
                      type: 'error',
                      message: res.data.message
                    })
                  }
                }).catch(() => {
                  this.$message({
                    type: 'error',
                    message: '系统错误'
                  })
                })
              }else {
                this.$message({
                  type: 'error',
                  message: res.data.message
                })
              }
            }).catch(() => {
              this.$message({
                type: 'error',
                message: '系统出错'
              })
            })
          }else {
            this.$message({
              type: 'error',
              message: '信息填写有误'
            })
          }
        })
      }else{
        this.insertFormVisible = false
      }
    },
    changeShowType() {
      this.$store.commit('changeShowType')
    },
    onUpload() {
      this.isMultiple = !this.isMultiple
    },
    submitUpload() {
      let fileList = this.$refs.upload.uploadFiles
      while(fileList.length > 0){
        let file = fileList.pop()
        let formData = new FormData()
        formData.append('multipartFile',file.raw)
        this.$store.dispatch('uploadFile',formData).then((res) => {
          if(res.data.code === 200){
            this.$store.dispatch('uploadMultiPersonnel',res.data.data).then((res) => {
              if(res.data.code === 200){
                this.init()
                this.$message({
                  type: 'success',
                  message: file.name + '上传成功'
                })

              }else{
                this.$message({
                  type: 'error',
                  message: '用户信息上传失败'
                })
              }
            }).catch(() => {
              this.$message({
                type: 'error',
                message: '系统错误'
              })
            })
          }else{
            this.$message({
              type: 'error',
              message: file.name + '上传失败'
            })
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '系统错误'
          })
        })
      }
    },
    init() {
      this.$router.push('/userList')
      this.$store.dispatch('getUserList',{process: 0,page: 1}).then((res) => {
        let tempData = res.data.data;
        if(tempData.records.length <= 0){
          this.$message({
            message: '已经没有更多数据了哦',
            type: 'warning'
          })
        }else{
          this.$store.commit('initUserList',tempData)
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: "系统错误，已取消操作"
        })
      })
    }
  },
  created() {
    this.init()
  }

}
</script>

<style>
#aside{
  position:fixed;
  margin-left: 10%;
}
#main-body{
  width: 80%;
}
#divider{
  float: right;
  margin-top: 0px;
}
.header-right{
  margin-top: 30px;
  float: right;
}
</style>
