<template>
  <div class="app">
    <h1>{{ this.reponame }}情绪分析可视化结果</h1>
    <div style="position: fixed;top: 11%;right: 8%;z-index: 1001;">
      <el-select v-model="selectedValueFreq" placeholder="请选择">
        <template #prefix>
          <span class="prefix-text">时间跨度：</span>
        </template>
        <el-option v-for="option in options_freq" :key="option.value" :label="option.label" :value="option.value"/>

      </el-select>&nbsp;&nbsp;
    </div>
    <div style="position: fixed;top: 16%;right: 8%;z-index: 1001;">
      <el-select v-model="selectedValuePeriod" placeholder="请选择" class="period">
        <template #prefix>
          <span class="prefix-text">时段数量：</span>
        </template>
        <el-option v-for="option in options_period" :key="option.value" :label="option.label" :value="option.value"/>
      </el-select>&nbsp;&nbsp;
    </div>
    <el-form class="dateForm" ref="form" :model="form" label-width="20%">
      <el-row type="flex" justify="center">
        <el-col :span="4" style="margin-top: 3px;">
          <el-date-picker v-model="form.since" type="date" :disabled-date="disabledDateSince" placeholder="起始时间"
                          style="width: 100%;z-index: 999;"></el-date-picker>
        </el-col>
        <el-col :span="1" style="text-align:center;margin-top: 4px;">至</el-col>
        <el-col :span="4" style="margin-right: 10px;margin-top: 3px;">
          <el-date-picker v-model="form.until" type="date" :disabled-date="disabledDateUntil" placeholder="结束时间"
                          style="width:100%;z-index: 999;"></el-date-picker>
        </el-col>
        <el-col :span="2" style="text-align:center;">
          <el-button type="success" @click="saveRepoDate"
                     style="background-color: #4ea397; color: white; display: inline-block;">保存
          </el-button>
        </el-col>
      </el-row>
    </el-form>

    <h2>项目粒度分析</h2>
    <div class="selectedbox">
      <label for="selectBox" class="placeholder" style="font-size: 16px">请选择范围：</label>
      <select v-model="selectedPie" class="box">
        <option value="option1">issues and comments</option>
        <option value="option2">issues</option>
        <option value="option3">comments</option>
      </select>
    </div>
    <div v-if="selectedPie === 'option1'" class="weighting">
      <label class="placeholder" style="font-size: 16px">请选择issue权重：</label>
      <input type="number" class="inputbox" id="pieAll" v-model="weightingPieAll" placeholder="0~1" @input="checkRange1"
             @change="drawAllByWeighting" min="0" max="1" step="0.1">
    </div>
    <div id="PieOfAll" style="width: 90% ;height: 400px;position: relative;"></div>


    <div class="selectedbox">
      <label for="selectBox" class="placeholder" style="font-size: 16px">请选择范围：</label>
      <select v-model="selectedLine" class="box">
        <option value="option1">issues and comments</option>
        <option value="option2">issues</option>
        <option value="option3">comments</option>
      </select>
    </div>
    <div v-if="selectedLine === 'option1'" class="weighting">
      <label class="placeholder" style="font-size: 16px">请选择issue权重：</label>
      <input type="number" class="inputbox" id="lineAll" v-model="weightingLineAll" placeholder="0~1"
             @input="checkRange2" @change="drawAllByWeighting" min="0" max="1" step="0.1">
    </div>
    <div id="LineOfAll" style="width: 90%;height: 600px;"></div>


    <h3 style="text-align: left">label情绪对比图</h3>

    <div style="margin-top: 16px;margin-bottom: 5px">
      <p style="text-align: left">项目labels：</p>
      <div class="options">
        <div class="option" v-for="option in options" :key="option.value" style="margin-top: 10px">
          <label style="width: 200px; text-align: left;">
            <input type="checkbox" v-model="selectedOptions" :value="option.value" @change="submitSelectedOptions"/>
            {{ option.label }}
          </label>
        </div>
      </div>
    </div>

    <div class="selectedbox">
      <label for="selectBox" class="placeholder" style="font-size: 16px">请选择范围：</label>
      <select v-model="selectedLabel" class="box">
        <option value="option1">issues and comments</option>
        <option value="option2">issues</option>
        <option value="option3">comments</option>
      </select>
    </div>
    <div v-if="selectedLabel === 'option1'" class="weighting">
      <label class="placeholder" style="font-size: 16px">请选择issue权重：</label>
      <input type="number" class="inputbox" id="labelAll" v-model="weightingLabelAll" placeholder="0~1"
             @input="checkRange3" @change="drawAllByWeighting" min="0" max="1" step="0.1">
    </div>
    <div id="BarOfLabel" style="width: 90%;height: 600px;"></div>

    <!--        reaction-->
    <h3 style="text-align: left;margin-top: 50px">Reaction情绪对比图</h3>
    <div class="selectedbox">
      <label for="selectBox" class="placeholder" style="font-size: 16px">请选择范围：</label>
      <select v-model="selectedLineReaction" class="box" id="selectBox">
        <option value="option1">issues and comments</option>
        <option value="option2">issues</option>
        <option value="option3">comments</option>
      </select>
    </div>
    <div v-if="selectedLineReaction === 'option1'" class="weighting">
      <label class="placeholder" style="font-size: 16px">请选择issue权重：</label>
      <input type="number" class="inputbox" id="reactionAll" v-model="weightingReactionAll" placeholder="0~1"
             @input="checkRange4" @change="drawAllByWeighting" min="0" max="1" step="0.1">
    </div>
    <div id="BarOfReaction" style="width: 90%;height: 600px;"></div>

    <h1>个人粒度分析</h1>

    <h3 style="text-align: left">个人情绪波动图</h3>
    <div>

      <div class="selectedbox">
        <label for="selectBox" class="placeholder" style="font-size: 16px">请选择范围：</label>
        <select v-model="selectedLineUser" class="box" placeholder="Select an option">
          <option value="option1">issues and comments</option>
          <option value="option2">issues</option>
          <option value="option3">comments</option>
        </select>
      </div>

      <div v-if="selectedLineUser === 'option1'" class="weighting">
        <label class="placeholder" style="font-size: 16px">请选择issue权重：</label>
        <input type="number" class="inputbox" id="UserAll" v-model="weightingUserAll" placeholder="0~1"
               @input="checkRange5" @change="drawAllByWeighting" min="0" max="1" step="0.1">
      </div>

      <div class="dropdown" style="margin-bottom: 20px">
        <el-text style="margin-left: 20px;font-size: 16px">请选择user:</el-text>
        <el-select v-model="searchQuery" filterable>
          <el-option
              v-for="item in items"
              :key="item"
              :label="item"
              :value="item"
              @click="HandleClick"
          />
        </el-select>
      </div>
    </div>

    <div id="LineOfUser" style="width: 90%;height: 600px;margin-top: 80px"></div>

  </div>

</template>

<style>

.app {
  /* 设置背景颜色 */
  background-color: white;
  margin-top: 100px;
}

.weighting {
  position: absolute;
  left: 50%;
  z-index: 1000;
}

.inputbox {
  border: 3px solid #ccc;
  border-radius: 5px;
}

.selectedbox {
  position: absolute;
  left: 30%;
  z-index: 999;
}

.dropdown {
  position: absolute;
  left: 15px;
  z-index: 999;
}

.el-input__wrapper {
  width: 200px;
  height: 2px;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  color: #252525;
}

h1 {
  margin: 20px;
}

.box {
  width: 150px;
  height: 25px;
  border: 3px solid #ccc;
  border-radius: 5px;
}

.options {
  display: flex;
  flex-wrap: wrap;
}

.option {;
  display: flex;
  align-items: center;
  margin-right: 10px;
  margin-bottom: 10px;
}

</style>

<script>
import axios from "axios";
import * as echarts from "echarts";
import mytheme1 from "../assets/wonderland.json"

export default {
  data() {
    return {
      title: '',
      data: [],
      selectedPie: null,
      weightingPieAll: 0.7,
      selectedLine: null,
      weightingLineAll: 0.7,
      selectedLabel: null,
      weightingLabelAll: 0.7,
      selectedLineReaction: null,
      selectedLineUser: null,
      curTheme: mytheme1,
      reponame: "apache/superset",
      form: {
        repo: "",
        since: "",
        until: "",
      },
      earliestTime: "2022-3-1",
      latestTime: "2023-5-31",
      //label选项列表
      options: [], // 存储从后端获取的选项值列表
      selectedOptions: [], // 存储被选择的选项值
      topLabels: [], //存储issue最多的八个
      labeloption: "option1",
      //个人分析
      searchQuery: '',
      isDropdownOpen: false,
      items: [],
      clickedItem: null,
      selectedValueFreq: '',
      options_freq: [
        {label: '5天', value: '5D'},
        {label: '1周', value: '1W'},
        {label: '1月', value: '1Q'},
      ],
      selectedValuePeriod: 8,
      options_period: [
        {label: 2, value: 2},
        {label: 4, value: 4},
        {label: 6, value: 6},
        {label: 8, value: 8},
      ],
    };
  },
  props: {
    placeholder: {
      type: String,
      default: 'Search...',
    },
  },
  mounted() {
    this.form.since = this.earliestTime;
    this.form.until = this.latestTime;
    this.getPieData('option2');
    this.getLineData('option2');
    this.fetchOptions();
    this.drawInitLineLabel();
    this.getLineReaction("option1");
    this.getAllUser()

  },
  watch: {
    selectedPie(newValue, oldValue) {
      // 在这里执行向后台请求数据的逻辑
      // 根据 newValue 值发送请求，并处理返回的数据
      console.log(oldValue, newValue)
      this.getPieData(newValue);
    },
    selectedLine(newValue, oldValue) {
      // 在这里执行向后台请求数据的逻辑
      // 根据 newValue 值发送请求，并处理返回的数据
      console.log(oldValue, newValue)
      this.getLineData(newValue);
    },
    selectedLabel(new_value) {
      console.log("label改变option", new_value)
      this.labeloption = new_value
      this.submitSelectedOptions()
    },
    selectedLineReaction(new_value) {
      this.getLineReaction(new_value);
    },
    selectedLineUser(new_value) {
      console.log("user变选项", new_value)
      this.UserChangeOption(new_value);
    }


  },
  methods: {

    getPieData(newValue) {
      const element = "PieOfAll";
      if (newValue === 'option1') {
        const params = {
          repo_name: this.reponame,
          start_time: this.form.since,
          end_time: this.form.until,
          weighting: this.weightingPieAll
        };
        axios.get('/api/analyse/pie/all', {params}).then(res => { // url即在mock.js中定义的
          console.log(res.data)
          console.log(res.data.data)// 打印一下响应数据
          this.drawPieChart(element, res.data.data, res.data.title);
        })
      }
      if (newValue == 'option2') {
        const params = {
          repo_name: this.reponame,
          start_time: this.form.since,
          end_time: this.form.until
        };
        axios.get('/api/analyse/pie/issue', {params}).then(res => { // url即在mock.js中定义的
          console.log(res.data.data)// 打印一下响应数据
          this.drawPieChart(element, res.data.data, "项目总体情绪占比图");

        })
      }
      if (newValue === 'option3') {
        const params = {
          repo_name: this.reponame,
          start_time: this.form.since,
          end_time: this.form.until
        };
        axios.get('/api/analyse/pie/comment', {params}).then(res => { // url即在mock.js中定义的
          console.log(res.data)
          console.log(res.data.data)// 打印一下响应数据
          this.drawPieChart(element, res.data.data, res.data.title);

        })
      }

    },

    getPieDataByWeighting(weight) {
      const element = "PieOfAll";
      const params = {
        repo_name: this.reponame,
        start_time: this.form.since,
        end_time: this.form.until,
        weighting: weight
      };
      axios.get('/api/analyse/pie/all', {params}).then(res => { // url即在mock.js中定义的
        console.log(res.data)
        console.log(res.data.data)// 打印一下响应数据
        this.drawPieChart(element, res.data.data, res.data.title);
      })

    },

    getLineData(newValue) {
      // axios.get('/analyse/linecharm/all').then(res => { // url即在mock.js中定义的
      //     console.log(res.data.data)// 打印一下响应数据
      //     console.log(res.data.title)
      //     this.drawLineChart(res.data.data,res.data.title)
      // })
      const element = "LineOfAll";
      if (newValue == 'option1') {
        const params = {
          repo_name: this.reponame,
          start_time: this.form.since,
          end_time: this.form.until,
          weighting: this.weightingLineAll
        };
        axios.get('/api/analyse/line/all', {params}).then(res => { // url即在mock.js中定义的
          console.log(res.data)
          console.log(res.data.data)// 打印一下响应数据
          this.drawLineChart(element, res.data.data, res.data.title);

        })
      }
      if (newValue === 'option2') {
        console.log("change to 2")
        const params = {
          repo_name: this.reponame,
          start_time: this.form.since,
          end_time: this.form.until,
          // freq: this.selectedValueFreq,
          periods: this.selectedValuePeriod,
        };
        axios.get('/api/analyse/line/issue', {params}).then(res => { // url即在mock.js中定义的
          console.log(res.data.data)// 打印一下响应数据
          this.drawLineChart(element, res.data.data, res.data.title);
        })
      }
      if (newValue === 'option3') {
        const params = {
          repo_name: this.reponame,
          start_time: this.form.since,
          end_time: this.form.until,
          // freq: this.selectedValueFreq,
          periods: this.selectedValuePeriod,
        };
        axios.get('/api/analyse/line/comment', {params}).then(res => { // url即在mock.js中定义的
          console.log(res.data.data)// 打印一下响应数据
          this.drawLineChart(element, res.data.data, res.data.title);
        })
      }


    },
    getLineDataByWeighting(weight) {
      const element = "LineOfAll";
      const params = {
        repo_name: this.reponame,
        start_time: this.form.since,
        end_time: this.form.until,
        // freq: this.selectedValueFreq,
        periods: this.selectedValuePeriod,
        weighting: weight
      };
      axios.get('/api/analyse/line/all', {params}).then(res => { // url即在mock.js中定义的
        console.log(res.data)
        console.log(res.data.data)// 打印一下响应数据
        this.drawLineChart(element, res.data.data, res.data.title);
      })

    },
    drawLineChart(element, data, title) {
      const chartContainer = document.getElementById(element);
      console.log(chartContainer)
      const mychart = echarts.init(chartContainer, this.curTheme);
      window.addEventListener('resize', function () {
        mychart.resize();
      });
      console.log(element)
      const option = {
        title: {
          text: title
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '10%',
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
            dataView: {readOnly: false},
            magicType: {type: ['line', 'bar']},
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.xAxis,
          axisLabel: {
            rotate: 45 // 设置标签旋转角度，单位为度，默认为 0
          }
        },
        yAxis: {},
        series: [
          {
            name: 'positive',
            data: data.pos,
            type: 'line'
          },
          {
            name: 'negative',
            data: data.neg,
            type: 'line'
          },
          {
            name: 'neutral',
            data: data.neu,
            type: 'line'
          }
        ]
      };
      mychart.setOption(option);
    },
    drawPieChart(element, data, title) {
      const chartContainer = document.getElementById(element);
      const mychart = echarts.init(chartContainer, this.curTheme);
      window.addEventListener('resize', function () {
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
                value: data.neg[0],
                name: 'negative'
              },
              {
                value: data.neu[0],
                name: 'neutral'
              },
            ],
            radius: '50%',
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
    drawBarChart(element, data, title) {
      const chartContainer = document.getElementById(element);
      const mychart = echarts.init(chartContainer, this.curTheme);
      window.addEventListener('resize', function () {
        mychart.resize();
      });
      console.log(element)

      const option = {
        title: {
          text: title
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '10%',
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
            dataView: {readOnly: false},
            magicType: {type: ['line', 'bar']},
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: data.xAxis,
          axisLabel: {
            rotate: 45 // 设置标签旋转角度，单位为度，默认为 0
          }
        },
        yAxis: {},
        series: [
          {
            name: 'positive',
            data: data.pos,
            type: 'bar'
          },
          {
            name: 'negative',
            data: data.neg,
            type: 'bar'
          },
          {
            name: 'neutral',
            data: data.neu,
            type: 'bar'
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
    saveRepoDate() {
      this.form.since = this.dateFormat(this.form.since)
      this.form.until = this.dateFormat(this.form.until)
      console.log(this.form.since, this.form.until)
      this.getPieData('option2');
      this.getLineData('option2');
    },
    dateFormat(date) {
      const this_date = new Date(date);
      return this_date.getFullYear() + '-' + (this_date.getMonth() + 1) + '-' + this_date.getDate();
    },
    fetchOptions() {
      // 向后端发起请求获取选项值列表的逻辑
      // 可以使用 Axios 或其他请求库进行请求
      // 请求成功后将返回的数据赋值给 options
      // 示例：模拟异步请求延迟，并设置示例选项值列表
      const params = {
        repo_name: this.reponame,
        start_time: this.form.since,
        end_time: this.form.until
      };

      axios.get('/api/get-issue-labels', {params}).then(res => { // url即在mock.js中定义的
        console.log(res.data)
        this.options = res.data.map((item) => ({value: item, label: item}));
      })
    },
    submitSelectedOptions() {
      // 将选择的选项值提交给后端的逻辑
      // 可以在这里使用 Axios 或其他请求库发送请求，并将 selectedOptions 作为请求参数传递给后端
      // 示例：打印被选择的选项值
      let params = {
        repo_name: this.reponame,
        start_time: this.form.since,
        end_time: this.form.until,
        weighting: 0.7,
        labels: Array.from(this.selectedOptions)
      };
      console.log("参数：", params)
      let url;
      let title;
      //没有选择label时
      if (params.labels.length === 0 && this.weightingLabelAll === 0.7) {
        this.drawInitLineLabel()
      } else {
        if (this.labelopthion === "option1") {
          url = '/api/analyse/line/all/label'
          title = "label情绪对比图--issue+comment"
          params.weighting = this.weightingLabelAll
          if (params.labels.length === 0) {
            params.labels = this.topLabels
          }
        }
        if (this.labelopthion === "option2") {
          url = '/api/analyse/line/issue/label'
          title = "label情绪对比图--issue"
        }
        if (this.labelopthion === "option3") {
          url = '/api/analyse/line/comment/label'
          title = "label情绪对比图--comment"
        }
        console.log("参数2：", params)
        axios.post(url, params).then(res => { // url即在mock.js中定义的
          // console.log(res.data)
          this.drawBarChart("BarOfLabel", res.data.data, title)
          // this.options = res.data.map((item) => ({ value: item, label: item }));
        })
        // console.log('被选择的选项值：', this.selectedOptions);
      }
    },
    async drawInitLineLabel() {
      // 将选择的选项值提交给后端的逻辑
      // 可以在这里使用 Axios 或其他请求库发送请求，并将 selectedOptions 作为请求参数传递给后端
      // 示例：打印被选择的选项值
      let params = {
        repo_name: this.reponame,
        start_time: this.form.since,
        end_time: this.form.until,
      };
      console.log(params)
      this.topLabels = (await axios.get('/api/get-most-used-labels', {params})).data
      params = {
        repo_name: this.reponame,
        start_time: this.form.since,
        end_time: this.form.until,
        weighting: 0.7,
        labels: this.topLabels
      }
      let url = "";
      let title = "";
      if (this.labelopthion === "option1") {
        url = '/api/analyse/line/all/label'
        title = "label情绪对比图--issue+comment"
      } else if (this.labelopthion === "option2") {
        url = '/api/analyse/line/issue/label'
        title = "label情绪对比图--issue"
      } else if (this.labelopthion === "option3") {
        url = '/api/analyse/line/comment/label'
        title = "label情绪对比图--comment"
      }
      axios.post(url, params).then(res => {
        console.log(res.data)
        this.drawBarChart("BarOfLabel", res.data.data, title)
      })
    },
    getLineReaction(newvalue) {
      let url = "";
      let title = "";
      const params = {
        repo_name: this.reponame,
        start_time: this.form.since,
        end_time: this.form.until,
        weighting: this.weightingReactionAll
      }
      //http://localhost:5000/analyse/line/all/reaction?repo_name=apache/superset&start_time=2022-3-1&end_time=2023-5-31&weighting=0.7
      //http://localhost:5000/analyse/line/all/reaction?repo_name="apache/superset"&start_time=2022-3-1&end_time=2023-5-31&weighting=0.7
      //
      if (newvalue === "option1") {
        url = '/api/analyse/line/all/reaction'
        title = "reaction情绪对比图--issue+comment"
      }
      if (newvalue === "option2") {
        url = '/api/analyse/line/issue/reaction'
        title = "reaction情绪对比图--issue"
      }
      if (newvalue === "option3") {
        url = '/api/analyse/line/comment/reaction'
        title = "reaction情绪对比图--comment"
      }
      console.log("reaction", params)
      console.log("url", url)
      axios.post(url, params).then(res => { // url即在mock.js中定义的
        console.log(res.data.data)// 打印一下响应数据
        this.drawBarChart("BarOfReaction", res.data.data, title);
      })
    },
    //个人分析粒度
    HandleClick() {
      console.log(this.searchQuery)
      const param = {
        repo_name: this.reponame,
        start_time: "2022-5-1",
        end_time: "2023-5-31",
        // freq: this.selectedValueFreq,
        periods: this.selectedValuePeriod,
        user: this.searchQuery,
      };
      console.log("发送user请求")
      axios.post("/api/analyse/line/issue/user", param)
          .then((response) => {
            console.log(response.data)
            const title = this.searchQuery + "的情绪波动图--issue+comment"
            this.drawLineChart("LineOfUser", response.data.data, title)
          })
    },
    UserChangeOption(newvalue) {
      let url = "";
      let title = "";
      const params = {
        repo_name: this.reponame,
        start_time: "2022-5-1",
        end_time: "2023-5-31",
        // freq: this.selectedValueFreq,
        periods: this.selectedValuePeriod,
        user: this.searchQuery,
        weighting: this.weightingUserAll
      };
      if (newvalue === "option1") {
        url = '/api/analyse/line/all/user'
        title = this.searchQuery + "的情绪波动图--issue+comment"
      }
      if (newvalue === "option2") {
        url = '/api/analyse/line/issue/user'
        title = this.searchQuery + "的情绪波动图--issue"
      }
      if (newvalue === "option3") {
        url = '/api/analyse/line/comment/user'
        title = this.searchQuery + "的情绪波动图--comment"
      }
      axios.post(url, params).then(res => { // url即在mock.js中定义的
        console.log(res.data.data)// 打印一下响应数据
        this.drawLineChart("LineOfUser", res.data.data, title);
      })
    },
    getAllUser() {
      const params = {
        repo_name: this.reponame,
        start_time: "2022-5-1",
        end_time: "2023-5-31"
      };
      const url = "/api/get-issue-users";
      axios.post(url, params).then(res => {
        console.log(res.data)
        this.items = res.data.map((item) => (item))
        this.searchQuery = this.items[0];
        this.HandleClick();
      })
    },
    checkRange1(event) {
      const input = event.target;
      // const value = input.value;
      const value = this.weightingPieAll
      const min = input.min;
      const max = input.max;
      const maxLength = 5; // 最大长度为5
      if (/^0[^.]/.test(input.value) && input.value.length != 0) {
        input.value = min;
        this.weightingPieAll = min;
      }
      if (value < min && input.value.length != 0) {
        input.value = min;
        this.weightingPieAll = min;
      } else if (value > max && input.value.length != 0) {
        input.value = max;
        this.weightingPieAll = max;
      }
      if (input.value.length > maxLength) {
        input.value = input.value.slice(0, maxLength);
        this.weightingPieAll = input.value.slice(0, maxLength);
      }
    },
    checkRange2(event) {
      const input = event.target;
      // const value = input.value;
      const value = this.weightingLineAll
      const min = input.min;
      const max = input.max;
      const maxLength = 5; // 最大长度为5
      if (/^0[^.]/.test(input.value) && input.value.length != 0) {
        input.value = min;
        this.weightingLineAll = min;
      }
      if (value < min && input.value.length != 0) {
        input.value = min;
        this.weightingLineAll = min;
      } else if (value > max && input.value.length != 0) {
        input.value = max;
        this.weightingLineAll = max;
      }
      if (input.value.length > maxLength) {
        input.value = input.value.slice(0, maxLength);
        this.weightingLineAll = input.value.slice(0, maxLength);
      }
    },
    checkRange3(event) {
      const input = event.target;
      // const value = input.value;
      const value = this.weightingLabelAll
      const min = input.min;
      const max = input.max;
      const maxLength = 5; // 最大长度为5
      if (/^0[^.]/.test(input.value) && input.value.length != 0) {
        input.value = min;
        this.weightingLabelAll = min;
      }
      if (value < min && input.value.length != 0) {
        input.value = min;
        this.weightingLabelAll = min;
      } else if (value > max && input.value.length != 0) {
        input.value = max;
        this.weightingLabelAll = max;
      }
      if (input.value.length > maxLength) {
        input.value = input.value.slice(0, maxLength);
        this.weightingLabelAll = input.value.slice(0, maxLength);
      }
    },
    checkRange4(event) {
      const input = event.target;
      // const value = input.value;
      const value = this.weightingReactionAll
      const min = input.min;
      const max = input.max;
      const maxLength = 5; // 最大长度为5
      if (/^0[^.]/.test(input.value) && input.value.length != 0) {
        input.value = min;
        this.weightingReactionAll = min;
      }
      if (value < min && input.value.length != 0) {
        input.value = min;
        this.weightingReactionAll = min;
      } else if (value > max && input.value.length != 0) {
        input.value = max;
        this.weightingReactionAll = max;
      }
      if (input.value.length > maxLength) {
        input.value = input.value.slice(0, maxLength);
        this.weightingReactionAll = input.value.slice(0, maxLength);
      }
    },
    checkRange5(event) {
      const input = event.target;
      // const value = input.value;
      const value = this.weightingUserAll
      const min = input.min;
      const max = input.max;
      const maxLength = 5; // 最大长度为5
      if (/^0[^.]/.test(input.value) && input.value.length != 0) {
        input.value = min;
        this.weightingUserAll = min;
      }
      if (value < min && input.value.length != 0) {
        input.value = min;
        this.weightingUserAll = min;
      } else if (value > max && input.value.length != 0) {
        input.value = max;
        this.weightingUserAll = max;
      }
      if (input.value.length > maxLength) {
        input.value = input.value.slice(0, maxLength);
        this.weightingUserAll = input.value.slice(0, maxLength);
      }
    },


    drawAllByWeighting(event) {
      const input = event.target;
      if (input.value.length != 0) {
        if (input.id === "pieAll") {
          console.log(this.weightingPieAll)
          this.getPieDataByWeighting(this.weightingPieAll);
        } else if (input.id === "lineAll") {
          console.log(this.weightingLineAll)
          this.getLineDataByWeighting(this.weightingLineAll);
        } else if (input.id === "labelAll") {
          console.log(this.weightingLabelAll)
          this.submitSelectedOptions();
        } else if (input.id === "reactionAll") {
          console.log(this.weightingReactionAll)
          this.getLineReaction('option1');
        } else {
          console.log(this.weightingUserAll)
          this.UserChangeOption('option1');
        }

      }
    }


  },


};
</script>
