<template>
  <div ref="chartContainer" style="width: 100%; height: 600px"></div>
</template>

<script>
import * as echarts from 'echarts';
import axios from "axios";

export default {
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      axios.get('/api/annotation').then((res) => {
        const _data = res.data;
        this.renderChart(_data);
      })
    },
    renderChart(_data) {
      const chartContainer = this.$refs.chartContainer;
      const chart = echarts.init(chartContainer);

      const option = {
        title: {
          text: '标注情绪方面',
          subtext: '对200条情绪文本进行标注'
        },
        grid: {
          left: '3%',
          right: '7%',
          bottom: '7%',
          containLabel: true
        },
        tooltip: {
          trigger: 'item',
          showDelay: 0,
          formatter: function (params) {
            const data = params.data
            if (data.value[0] !== undefined) {
              return `情绪方面：${data.name}<br>情绪值：${data.value[1]}<br>数量：${data.value[0]}<br>情绪文本：${data.context}`
            } else {
              return null;
            }
          },
          axisPointer: {
            show: true,
            type: 'cross',
            lineStyle: {
              type: 'dashed',
              width: 1
            }
          }
        },
        toolbox: {
          feature: {
            dataZoom: {},
            brush: {
              type: ['rect', 'polygon', 'clear']
            }
          }
        },
        brush: {},
        legend: {
          data: ['情绪方面'],
          left: 'center',
          bottom: 10
        },
        xAxis: [
          {
            type: 'value',
            interval: 2,
            scale: false,
            axisLabel: {
              formatter: '{value}'
            },
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            interval: 0.5,
            scale: false,
            axisLabel: {
              formatter: '{value}'
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '情绪方面',
            type: 'scatter',
            emphasis: {
              focus: 'series'
            },
            symbolSize: function (params) {
              if (params[0] * 3 + params[1] * 6 < 0) {
                return 1;
              }
              return params[0] * 3 + params[1] * 6;
            },
            label: {
              show: true, // 显示标签
              position: 'top',
              distance: 10,
              formatter: function (params) {
                return params.name;
              },
            },
            data: _data,
            // data: [
            //   {name: 'aspect1', value: [8, 2.1], context: ['context1', 'context1']},
            //   {name: 'aspect2', value: [6, 1.2], context: ['context2', 'context1']},
            //   {name: 'aspect3', value: [9, -2.0], context: ['context3', 'context1']},
            //   {name: 'aspect4', value: [10, -0.7], context: ['context3', 'context1']},
            //   {name: 'aspect5', value: [10, -1.8], context: ['context3', 'context1']},
            //   {name: 'aspect6', value: [20, 2.2], context: ['context3', 'context1']},
            // ],
            markArea: {
              silent: true,
              itemStyle: {
                color: 'transparent',
                borderWidth: 1,
                borderType: 'dashed'
              },
              data: [
                [
                  {
                    name: '数据范围',
                    xAxis: 'min',
                    yAxis: 'min'
                  },
                  {
                    xAxis: 'max',
                    yAxis: 'max'
                  }
                ]
              ]
            },
            markLine: {
              lineStyle: {
                type: 'solid'
              },
              data: [{type: 'average', name: 'Average'}]
            }
          }
        ]
      };
      chart.setOption(option);
    },
  },
};
</script>

<style>

</style>
