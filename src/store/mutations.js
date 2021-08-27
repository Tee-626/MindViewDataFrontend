export default {
    //为userList添加下一页的用户信息
    initUserList (state,data) {
        if(state.userList.length > 0){
            state.userList.splice(0,state.userList.length)
        }
        changeList(data.records,state.userList)
        state.totalPages = data.pages
        state.isQuery = false;
    },
    //单击页码进行用户列表内容的更改
    changeUserList (state,records) {
        state.userList.splice(0,state.userList.length)
        changeList(records,state.userList)
    },

    changeTitle (state,payload) {
        switch (payload) {
            case 0: state.title = "用户列表";
                    break;
            case 1: state.title = "测试列表";
                    break;
            default: break;
        }
    },

    deleteUser (state,number) {
        let list = state.userList
        list.some((user, index) => {
            if(user.number === number){
                list.splice(index,1)
                return true
            }
        })
    },

    deleteRecord (state,payload) {
        let list
        if(payload.list === 'tableData'){
          list = state.tableData

        } else if(payload.list === 'recordList'){
          list = state.recordList

        }
        list.some((record, index) => {
            if(record.id === payload.rid){
                list.splice(index,1)
                return true
            }
        })
    },

    queryUsers (state,userList) {
        if(state.queryList.length > 0) {
            state.queryList.splice(0,state.queryList.length)
        }
        changeList(userList,state.queryList)
        state.queryPage = Math.floor(userList.length / 25)
        if(userList.length % 25 > 0){
            state.queryPage ++
        }
        state.queryIndex = 1
        showQueryList(state,1)
        state.isQuery = true
        if(state.title === '测试列表'){
            state.showUser = true
        }
    },

    showQueryList (state, queryIndex) {
        showQueryList(state,queryIndex)
    },

    updateUser (state, user) {
        let userList = state.userList
        userList.some(obj => {
            if(obj.number === user.number) {
                obj.nature = user.nature
                obj.age = user.age
                obj.sex = user.sex
                obj.timestamp = user.timestamp
                return true
            }
        })
    },

    insertUser (state,user) {
        let userList = state.userList
        userList.unshift(user)
        userList.pop()
    },

    changeTableData (state,records) {
        changeList(records,state.tableData)
    },

    clearTableData (state) {
        clearList(state.tableData)
    },

    changeShowType(state) {
        state.showUser = !state.showUser
    },

    initRecordList (state,data) {
        if(state.recordList.length > 0){
            state.recordList.splice(0,state.recordList.length)
        }
        changeList(data.records,state.recordList)
        state.totalPages = data.pages
        state.isQuery = false;
    },

    changeRecordList (state,records) {
        state.recordList.splice(0,state.recordList.length)
        changeList(records,state.recordList)
    },

    setDeleteList (state,list) {
        if(state.deleteList.length > 0){
            clearList(state.deleteList)
        }
        changeList(list,state.deleteList)
    },

    setNumberList (state){
        if(state.numberList.length > 0){
            clearList(state.numberList)
        }
        state.userList.forEach(function(user){
            state.numberList.push(user.number)
        })
    },

    deleteMultiUser (state){
        for(let i = 0;i < state.deleteList.length; i++){
            let number = state.deleteList[i]
            state.userList.splice(findIndex(state.userList,number),1)
        }
    },

    setFalse (state) {
        state.canDelete = false
    },

    setTrue (state) {
        state.canDelete = true
    }

}
//更新列表内容
function changeList(sourceList,targetList) {
    let tempList = sourceList.concat()
    while (tempList.length > 0){
        targetList.push(tempList.pop());
    }
    targetList.reverse()
}

function showQueryList(state,queryIndex) {
    state.userList.splice(0,state.userList.length)
    let begIndex = 25 * (queryIndex - 1)
    let endIndex = 25 * queryIndex - 1
    let queryList = state.queryList
    let showList = queryList.filter(user => queryList.indexOf(user)>=begIndex && queryList.indexOf(user)<=endIndex)
    changeList(showList,state.userList)
}

function clearList(list) {
    list.splice(0,list.length)
}

function findIndex(list,target) {
    return list.findIndex(item => item.number === target)
}