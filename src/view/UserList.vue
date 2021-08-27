<template>
  <el-col>
    <el-row>
      <UserCard v-for="obj in userList" :key="obj.id"
                style="float: left"
                :user="obj"
                ></UserCard>
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
</template>

<script>
import UserCard from "@/components/UserCard";

export default {
  name: "UserList",
  components: {
    UserCard
  },
  data() {
    return {
      isEmpty: true,
      detailCardVisible: false,
      showImgList: [],
      showRecordList: [],
      showPage: 0,
    }
  },
  computed: {
    queryPage () {
      return this.$store.state.queryPage
    },
    isQuery () {
      return this.$store.state.isQuery
    },
    userList () {
      return this.$store.state.userList
    },
    totalPages () {
      return this.$store.state.totalPages
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.$store.dispatch('getUserList',{process: 0,page: val}).then((res) => {
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
    handleCurrentQueryChange(val) {
      this.$store.commit('showQueryList', val)
    },
  },
  created() {
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

}
</script>

<style scoped>


</style>