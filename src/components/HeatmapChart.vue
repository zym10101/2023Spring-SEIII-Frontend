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
          text: '标注版本问题分析散点图',
          subtext: '从2022年9月至2023年6月的所有关于apache superset项目的issue中摘取了200条进行人工标注'
        },
        grid: {
          left: '3%',
          right: '7%',
          bottom: '7%',
          containLabel: true
        },
        tooltip: {
          enterable: true,
          trigger: 'item',
          showDelay: 0,
          formatter: function (params) {
            let content = '<div class="echarts-tooltip">';
            const data = params.data
            if (data.value[0] !== undefined) {
              content += `<strong>情绪方面：</strong>${data.name}<br><strong>情绪值：</strong>${data.value[1]}<br><strong>句子数量：</strong>${data.value[0]}<br><strong>具体文本：</strong>(eg.【aspect】, {bug} ,（request）)<br>`;
              var additionalContent = `${data.context}`;
              var strings = additionalContent.split(',');
              for (var i = 0; i < strings.length; i++) {
                content += (i + 1) +'. ' + strings[i] + '<br>';
              }
              return content;
            }
            content += '</div>';
            return content;
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
              formatter: function(value) {
                return value + ' 条';
              }
            },
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            interval: 0.1,
            scale: false,
            axisLabel: {
              formatter: function(value) {
                return value + ' 分';
              }
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
              if (params[0] * 3 + params[1] * 10 < 0) {
                return 1;
              }
              return params[0] * 3 + params[1] * 10;
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
.echarts-tooltip {
  text-align: left;
  max-width: 400px;
  max-height: 300px;
  overflow: auto;
}
</style>
