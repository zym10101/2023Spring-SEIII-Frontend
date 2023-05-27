<template>
    <div class="app">
        <h1>项目粒度分析</h1>
        <div class="selectedbox" >
            <select v-model="selectedPie" class="box" >
                <option value="option1">issues and comments</option>
                <option value="option2">issues</option>
                <option value="option3">comments</option>
            </select>
        </div>
            <div id="PieOfAll" style="width: 90% ;height: 400px;position: relative;">

            </div>


        <div class="selectedbox">
            <select v-model="selectedLine" class="box" >
                <option value="option1">issues and comments</option>
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
    z-index: 9999;
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
        };
    },
    mounted() {
       this.getPieData('option1');
       this.getLineData('option1');
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
            if(newValue=='option1'){
                axios.get('/analyse/pie/all').then(res => { // url即在mock.js中定义的
                    console.log(res.data)
                    console.log(res.data.data)// 打印一下响应数据
                    this.drawPieChart(res.data.data,res.data.title);

                })
            }
            if(newValue=='option2'){
                console.log("change to 2")
                axios.get('/analyse/pie/issue').then(res => { // url即在mock.js中定义的
                    console.log(res.data.data)// 打印一下响应数据
                    this.drawPieChart(res.data.data,res.data.title);

                })
            }
            if(newValue=='option3'){
                axios.get('/analyse/pie/comment').then(res => { // url即在mock.js中定义的
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
                axios.get('/analyse/linecharm/all').then(res => { // url即在mock.js中定义的
                    console.log(res.data)
                    console.log(res.data.data)// 打印一下响应数据
                    this.drawLineChart(res.data.data,res.data.title);

                })
            }
            if(newValue=='option2'){
                console.log("change to 2")
                axios.get('/analyse/linecharm/issue').then(res => { // url即在mock.js中定义的
                    console.log(res.data.data)// 打印一下响应数据
                    this.drawLineChart(res.data.data,res.data.title);

                })
            }
            if(newValue=='option3'){
                axios.get('/analyse/linecharm/comment').then(res => { // url即在mock.js中定义的
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
                                value: data[0],
                                name: 'positive'
                            },
                            {
                                value: data[1],
                                name: 'negtive'
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
        }

    }


};
</script>
