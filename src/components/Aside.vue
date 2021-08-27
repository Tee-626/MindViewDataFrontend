<template>
  <el-row>
    <el-col>
      <el-button
          icon="el-icon-user-solid"
          circle
          @click="onChangeTitle(0);
                  onHandleClick(0)"></el-button>
    </el-col>
    <el-col>
      <el-button
          icon="el-icon-document"
          circle
          @click="onChangeTitle(1);
                  onHandleClick(1)"></el-button>
    </el-col>
    <el-col>
      <el-button
          icon="el-icon-menu"
          circle
          @click="onChangeTitle(2);
                  onHandleClick(2)"></el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "Aside",
  methods: {
    onChangeTitle(index) {
      this.$store.commit("changeTitle", index);
    },
    onHandleClick(index) {
      switch (index) {
        case 0: this.$router.replace('/userList');
                break;
        case 1: this.$router.replace('/testList');
                break;
        default:this.$message({
                  type: "warning",
                  message: "敬请期待"
                })
                break;
      }
    }

  }
}
</script>

<style scoped>
.el-col{
  margin-top: 25px;
}
.el-button{
  width: 100px;
  height: 100px;
  font-size: 50px;
  box-shadow: rgba(0,0,0,0.2) 0px 2px 12px 0px
}
</style>