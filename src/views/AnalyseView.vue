<template>
    <div class="app">

        <h1>{{ this.reponame }}情绪分析可视化结果</h1>
        <el-form class="datefrom" ref="form" :model="form" label-width="20%">
          <el-row>
              <el-col :span="9" style="margin-right: 10px">
                  <el-date-picker v-model="form.since" type="date" :disabled-date="disabledDateSince" placeholder="起始时间" style="width: 100%;z-index: 999;"></el-date-picker>
              </el-col>
              <el-col :span="2">至</el-col>
              <el-col :span="9" style="margin-right: 10px">
                  <el-date-picker v-model="form.until" type="date" :disabled-date="disabledDateUntil" placeholder="结束时间" style="width:100%;z-index: 999;"></el-date-picker>
              </el-col>
              <el-col :span="2">
                  <el-button type="success" @click="saveRepoDate" style="background-color: #4ea397; color: white; display: inline-block;">保存</el-button>
              </el-col>
          </el-row>
        </el-form>




        <h2>项目粒度分析</h2>
        <div class="selectedbox" >
            <select v-model="selectedPie" class="box" >
<!--                <option value="option1">issues and comments</option>-->
                <option value="option2">issues</option>
                <option value="option3">comments</option>
            </select>
        </div>
            <div id="PieOfAll" style="width: 90% ;height: 400px;position: relative;">

            </div>


        <div class="selectedbox">
            <select v-model="selectedLine" class="box" >
<!--                <option value="option1">issues and comments</option>-->
                <option value="option2">issues</option>
                <option value="option3">comments</option>
            </select>
        </div>
        <div id="LineOfAll" style="width: 90%;height: 600px;"></div>
        <h1>个人粒度分析</h1>
    </div>

</template>

<style>

.app {
    /* 设置背景颜色 */
    //background-color: rgba(254,248,239,1);
    background-color: white;
    margin-top: 100px;
}

.selectedbox{
    position: absolute;
    left: 400px;
    z-index: 999;
}
h1{
    margin: 20px;
}
.box {
    width: 300px;
    height: 20px;
    padding: 10px;
    border: 2px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    color: #333;
    background-color: #f7f7f7;
    font-family: Arial, sans-serif;
}

</style>

<script >
import axios from "axios";
import * as echarts from "echarts";
import mytheme1 from "../assets/wonderland.json"




export default {
    data() {
        return {
            title: '',
            data: [],
            selectedPie: null,
            selectedLine:null,
            curTheme:mytheme1 ,
            reponame: "apache/superset",
            form: {
                repo: "",
                since: "",
                until: "",
            },
            earliestTime: "2022-3-1",
            latestTime: "2023-5-31",
        };
    },
    mounted() {
        this.form.since=this.earliestTime;
        this.form.until=this.latestTime;
       this.getPieData('option2');
       this.getLineData('option2');

    },
    watch: {
        selectedPie(newValue, oldValue) {
            // 在这里执行向后台请求数据的逻辑
            // 根据 newValue 值发送请求，并处理返回的数据
            console.log(oldValue,newValue)
            this.getPieData(newValue);
        },
        selectedLine(newValue, oldValue) {
            // 在这里执行向后台请求数据的逻辑
            // 根据 newValue 值发送请求，并处理返回的数据
            console.log(oldValue,newValue)
            this.getLineData(newValue);
        },

    },
    methods:{

        getPieData(newValue){
            const params = {
                repo_name: this.reponame,
                start_time: this.form.since,
                end_time: this.form.until
            };
            if(newValue=='option1'){
                axios.get('/api/analyse/pie/all',{params}).then(res => { // url即在mock.js中定义的
                    console.log(res.data)
                    console.log(res.data.data)// 打印一下响应数据
                    this.drawPieChart(res.data.data,res.data.title);

                })
            }
            if(newValue=='option2'){
                const params = {
                    repo_name: this.reponame,
                    start_time: this.form.since,
                    end_time: this.form.until
                };
                console.log("change to 2")
                axios.get('/api/analyse/pie/issue',{params}).then(res => { // url即在mock.js中定义的
                    console.log(res.data.data)// 打印一下响应数据
                    this.drawPieChart(res.data.data,res.data.title);

                })
            }
            if(newValue=='option3'){
                const params = {
                    repo_name: this.reponame,
                    start_time: this.form.since,
                    end_time: this.form.until
                };
                axios.get('/api/analyse/pie/comment',{params}).then(res => { // url即在mock.js中定义的
                    console.log(res.data)
                    console.log(res.data.data)// 打印一下响应数据
                    this.drawPieChart(res.data.data,res.data.title);

                })
            }

        },
        getLineData(newValue){
            // axios.get('/analyse/linecharm/all').then(res => { // url即在mock.js中定义的
            //     console.log(res.data.data)// 打印一下响应数据
            //     console.log(res.data.title)
            //     this.drawLineChart(res.data.data,res.data.title)
            // })
            if(newValue=='option1'){
                const params = {
                    repo_name: this.reponame,
                    start_time: this.form.since,
                    end_time: this.form.until
                };
                axios.get('/api/analyse/line/all', { params }).then(res => { // url即在mock.js中定义的
                    console.log(res.data)
                    console.log(res.data.data)// 打印一下响应数据
                    this.drawLineChart(res.data.data,res.data.title);

                })
            }
            if(newValue=='option2'){
                console.log("change to 2")
                const params = {
                    repo_name: this.reponame,
                    start_time: this.form.since,
                    end_time: this.form.until
                };
                axios.get('/api/analyse/line/issue',{params}).then(res => { // url即在mock.js中定义的
                    console.log(res.data.data)// 打印一下响应数据
                    this.drawLineChart(res.data.data,res.data.title);

                })
            }
            if(newValue=='option3'){
                const params = {
                    repo_name: this.reponame,
                    start_time: this.form.since,
                    end_time: this.form.until
                };
                axios.get('/api/analyse/line/comment',{params}).then(res => { // url即在mock.js中定义的
                    console.log(res.data)
                    console.log(res.data.data)// 打印一下响应数据
                    this.drawLineChart(res.data.data,res.data.title);

                })
            }
        },
        drawLineChart(data,title){
            const chartContainer = document.getElementById('LineOfAll');
            const mychart = echarts.init(chartContainer,this.curTheme);
            window.addEventListener('resize', function() {
                mychart.resize();
            });


            const option = {
                title: {
                    text: title
                },
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        dataView: { readOnly: false },
                        magicType: { type: ['line', 'bar'] },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: data.xAxis
                },
                yAxis: {},
                series: [
                    {   name: 'positive',
                        data: data.pos,
                        type: 'line'
                    },
                    {   name: 'negative',
                        data: data.neg,
                        type: 'line'
                    },
                    {   name: 'neutral',
                        data: data.neu,
                        type: 'line'
                    }
                ]
            };
            mychart.setOption(option);
        },
        drawPieChart(data,title) {

            const chartContainer = document.getElementById('PieOfAll');
            const mychart = echarts.init(chartContainer,this.curTheme);
            window.addEventListener('resize', function() {
                mychart.resize();
            });
            // 使用后台数据绘制扇形图
            const option = {
                title: {
                    text: title
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
            series: [
                    {
                        type: 'pie',
                        data: [
                            {
                                value: data.pos[0],
                                name: 'positive'
                            },
                            {
                                value: data.neu[0],
                                name: 'neutral'
                            },
                            {
                                value: data.neg[0],
                                name: 'negative'
                            }
                        ],
                        radius:'50%',
                        label: {
                            normal: {
                                show: true,
                                formatter: '{b} ({d}%)' //自定义显示格式(b:name, c:value, d:百分比)
                            }
                        }
                    }
                ]
            };
            mychart.setOption(option);
        },

        disabledDateSince(date) {
            return date < new Date(this.earliestTime);
        },
        disabledDateUntil(date) {
            return date < new Date(this.form.since);
        },
        saveRepoDate(){
            this.form.since=this.dateFormat(this.form.since)
            this.form.until=this.dateFormat(this.form.until)
            console.log(this.form.since,this.form.until)
            this.getPieData('option2');
            this.getLineData('option2');
        },
        dateFormat(date) {
            const this_date = new Date(date);
            return this_date.getFullYear() + '-' + (this_date.getMonth() + 1) + '-' + this_date.getDate();
        },
    }


};
</script>
