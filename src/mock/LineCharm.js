// mock.js

// 引入mockjs
const Mock = require('mockjs')
// 获取 mock.Random 对象
// mock新闻数据，包括新闻标题title、内容content、创建时间createdTime
const produceNewsData = function () {
    let dataObj = {
        title: '项目整体情绪变化折线图',
        data: {
            pos: [54, 68, 53, 66, 51, 53],
            neg: [46, 32, 47, 34, 49, 47],
            xAxis: ['2016/3', '2016/9', '2017/3', '2017/9', '2018/3', '2018/9',]
        }
    }
    return dataObj
}

const produceNewsData_issue = function () {
    let dataObj = {
        title: '项目整体情绪变化折线图——issue',
        data: {
            pos: [54, 68, 53, 66, 51, 53],
            neg: [46, 32, 47, 34, 49, 47],
            xAxis: ['2016/3', '2016/9', '2017/3', '2017/9', '2018/3', '2018/9',]
        }
    }
    return dataObj
}

const produceNewsData_comment = function () {
    let dataObj = {
        title: '项目整体情绪变化折线图——comment',
        data: {
            pos: [54, 68, 53, 66, 51, 53],
            neg: [46, 32, 47, 34, 49, 47],
            xAxis: ['2016/3', '2016/9', '2017/3', '2017/9', '2018/3', '2018/9',]
        }
    }
    return dataObj
}
// 请求该url，就可以返回newsList
Mock.mock('/analyse/linecharm/all', produceNewsData) // 后面讲这个api的使用细节
Mock.mock('/analyse/linecharm/issue', produceNewsData_issue) // 后面讲这个api的使用细节
Mock.mock('/analyse/linecharm/comment', produceNewsData_comment) // 后面讲这个api的使用细节

