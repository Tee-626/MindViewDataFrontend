import axios from "axios"

export const getUserList = (context,payload) => {
    switch (payload.process) {
        case 0:return axios({
                    method: 'get',
                    url: '/api/personnel/multi',
                    params: {
                        pageIndex: payload.page.toString(),
                        pageSize: "15"
                    }
                })
        case 1:return axios({
                    method: 'get',
                    url: '/api/personnel/multi',
                    params: {
                        pageIndex: payload.page.toString(),
                        pageSize: "25"
                    }
                })
    }
}

export const deleteUser = (context,number) => {
    return axios({
        method: 'delete',
        url: '/api/personnel',
        params: {
            number: number
        }
    })
}

export const queryUserByName = (context,name) => {
    return axios({
        method: 'get',
        url: '/api/personnel/name',
        params: {
            name: name
        }
    })
}

export const queryUserByNum = (context,number) => {
    return axios({
        method: 'get',
        url: '/api/personnel/number/fuzzy',
        params: {
            number: number
        }
    })
}

export const updateUser = (context,user) => {
    return axios({
        method: 'put',
        url: '/api/personnel',
        data: user
    })
}

export const insertUser = (context,user) => {
    return axios({
        method: 'post',
        url: '/api/personnel',
        data: user
    })
}

export const getRecordByNumber = (context , num) => {
    return axios({
        method: 'get',
        url: '/api/record/personnel/number',
        params: {
            number: num
        }
    })
}

export const getReportByRid = (context,rid) => {
    return axios({
        method: 'get',
        url: '/api/report',
        params: {
            rid: rid
        }
    })
}

export const getAllRecords = (context,page) => {
    return axios({
        method: 'get',
        url: '/api/record/personnel',
        params: {
            pageIndex: page,
            pageSize: 25
        }
    })
}

export const deleteRecord = (context,rid) => {
    return axios({
        method: 'delete',
        url: '/api/record',
        params: {
            rid: rid
        }
    })
}

export const deleteRecordData = (context,rid) => {
    return axios({
        method: 'delete',
        url: '/api/record/data',
        params: {
            rid: rid
        }
    })
}

export const deleteReport = (context,rid) => {
    return axios({
        method: 'delete',
        url: '/api/report',
        params: {
            rid: rid
        }
    })
}

export const uploadFile = (context,file) => {
    return axios({
        method: 'post',
        url: '/api/personnel/upload',
        data: file,
        headers: {
            "Content-type": "multipart/form-data"
        }
    })
}

export const uploadMultiPersonnel = (context,fileName) => {
    return axios({
        method: 'post',
        url: '/api/personnel/multi',
        params: {
            excelFileName: fileName
        }
    })
}

export const deleteMultiUser = (context) => {
    console.log(context.state.deleteList)
    return axios({
        method: 'delete',
        url: '/api/personnel/multi',
        data: context.state.deleteList
    })
}

