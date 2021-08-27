import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
    //用户信息
    totalPages: null,
    currPage: null,
    userList: [],//用于前台展示的userList
    isQuery: false,
    queryList: [],//用于存储查询结果的userList
    queryPage: null,//用于存储查询总页数
    queryIndex: null,//用于存储当前页数
    currUser: {
        id: "",
        name: ""
    },

    //界面信息
    title: "用户列表",

    //testList
    showUser: true,
    tableData: [],
    recordList: [],

    deleteList: [],
    numberList: [],
    canDelete: true
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
})