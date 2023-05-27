// mock.js

// 引入mockjs
const Mock = require('mockjs')
// 获取 mock.Random 对象
// mock新闻数据，包括新闻标题title、内容content、创建时间createdTime
const produceNewsData = function () {
    let dataObj = {
        title: '项目整体情绪分布图——issue+comment',
        data: [67, 34]
    }

    return dataObj
}
const produceNewsData_issues = function () {
    let dataObj = {
        title: '项目整体情绪分布图——issue',
        data: [50, 50]
    }

    return dataObj
}
const produceNewsData_comments = function () {
    let dataObj = {
        title: '项目整体情绪分布图——comment',
        data: [60, 40]
    }

    return dataObj
}
// 请求该url，就可以返回newsList
Mock.mock('/analyse/pie/all', produceNewsData) // 项目整体情绪分布
Mock.mock('/analyse/pie/issue', produceNewsData_issues)// 项目issue情绪分布
Mock.mock('/analyse/pie/comment', produceNewsData_comments)//项目comment情绪分布
