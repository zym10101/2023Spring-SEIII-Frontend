<template>
    <div>
        <div id="PieOfAll" style="width: 600px;height: 400px;"></div>
        <div id="LineOfAll" style="width: 600px;height: 400px;"></div>
    </div>
</template>

<script >
import axios from "axios";
import * as echarts from "echarts";
import mytheme from "../assets/vintage.json"


export default {
    data() {
        return {
            title: '',
            data: []
        };
    },
    mounted() {
       this.getPieData();
       this.getLineData();
    },
    methods:{
        getPieData(){
            axios.get('/mock/news').then(res => { // url即在mock.js中定义的
                console.log(res.data)
                console.log(res.data.data)// 打印一下响应数据
                this.drawPieChart(res.data.data);

            })
        },
        getLineData(){
            axios.get('/mock/linecharm').then(res => { // url即在mock.js中定义的
                console.log(res.data.data)// 打印一下响应数据
                this.drawLineChart((res.data.data))
            })
        },
        drawLineChart(data){
            const chartContainer = document.getElementById('LineOfAll');
            const chart = echarts.init(chartContainer,mytheme);
            console.log(data.neg)
            console.log(data.pos)

            const option = {
                title: {
                    text: '项目情绪变化折线图'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['positive', 'negtive']
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
            chart.setOption(option);
        },
        drawPieChart(data) {

            const chartContainer = document.getElementById('PieOfAll');
            const chart = echarts.init(chartContainer,mytheme);

            // 使用后台数据绘制扇形图
            const option = {
                title: {
                    text: '项目情绪整体情绪分布图'
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
            chart.setOption(option);
        }

    }


};
</script>
