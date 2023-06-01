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
            <label for="selectBox" class="placeholder" style="font-size: 16px">请选择范围：</label>
            <select v-model="selectedPie" class="box" >
<!--                <option value="option1">issues and comments</option>-->
                <option value="option2">issues</option>
                <option value="option3">comments</option>
            </select>
        </div>
            <div id="PieOfAll" style="width: 90% ;height: 400px;position: relative;">

            </div>


        <div class="selectedbox">
            <label for="selectBox" class="placeholder" style="font-size: 16px">请选择范围：</label>
            <select v-model="selectedLine" class="box" >
<!--                <option value="option1">issues and comments</option>-->
                <option value="option2">issues</option>
                <option value="option3">comments</option>
            </select>
        </div>
        <div id="LineOfAll" style="width: 90%;height: 600px;"></div>


        <!--        label-->

        <h3 style="text-align: left">label情绪对比图</h3>

        <div  style="margin-top: 16px;margin-bottom: 5px">
            <p style="text-align: left">项目labels：</p>
            <div class="options">
                <div class="option" v-for="option in options" :key="option.value"  style="margin-top: 10px">
                    <label  style="width: 200px; text-align: left;">
                        <input type="checkbox" v-model="selectedOptions" :value="option.value" @change="submitSelectedOptions" />
                        {{ option.label }}
                    </label>
                </div>
            </div>
        </div>

        <div class="selectedbox">
            <label for="selectBox" class="placeholder" style="font-size: 16px">请选择范围：</label>
            <select v-model="selectedLalel" class="box" >
                <option value="option1">issues and comments</option>
                <option value="option2">issues</option>
                <option value="option3">comments</option>
            </select>
        </div>
        <div id="LineOfLabel" style="width: 90%;height: 600px;"></div>

<!--        reaction-->
        <h3 style="text-align: left;margin-top: 50px">Reaction情绪对比图</h3>
        <div class="selectedbox">
            <label for="selectBox" class="placeholder" style="font-size: 16px">请选择范围：</label>
            <select v-model="selectedLineReaction" class="box" id="selectBox" >
                <option value="option1">issues and comments</option>
                <option value="option2">issues</option>
                <option value="option3">comments</option>
            </select>
        </div>
        <div id="LineOfReaction" style="width: 90%;height: 600px;"></div>

        <h1>个人粒度分析</h1>

        <h3 style="text-align: left">个人情绪波动图</h3>
      <div>

          <div class="selectedbox">
              <select v-model="selectedLineUser" class="box" placeholder="Select an option" >
                  <label for="selectBox" class="placeholder" style="font-size: 16px">请选择范围：</label>
                  <option value="option1">issues and comments</option>
                  <option value="option2">issues</option>
                  <option value="option3">comments</option>
              </select>
          </div>

          <div class="dropdown" style="margin-bottom: 20px" >
              <el-text style="margin-left: 20px;font-size: 16px">请选择user: </el-text>
              <el-select v-model="searchQuery"  filterable >
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
    //background-color: rgba(254,248,239,1);
    background-color: white;
    margin-top: 100px;
}

.selectedbox{
    position: absolute;
    left: 400px;
    z-index: 999;
}
.dropdown{
    position: absolute;
    left: 15px;
    z-index: 999;
}
.el-input__wrapper{
    width: 200px;
    height: 2px;
    padding: 10px;
    border: 2px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    color: #252525;
}
h1{
    margin: 20px;
}
.box {
    width: 300px;
    height: 25px;
    //padding: 10px;
    border: 3px solid #ccc;
    border-radius: 5px;
    //font-size: 16px;
    //color: #333;
    //background-color: #f7f7f7;
    //font-family: Arial, sans-serif;
}

.options {
    display: flex;
    flex-wrap: wrap;
}

.option {
    ;
    display: flex;
    align-items: center;
    margin-right: 10px;
    margin-bottom: 10px;
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
            selectedLalel:null,
            selectedLineReaction:null,
            selectedLineUser:null,
            curTheme:mytheme1 ,
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
            labelopthion:"option1",
            //个人分析
            searchQuery: '',
            isDropdownOpen: false,
            items: [],
            clickedItem: null,
        };
    },
    props: {
        placeholder: {
            type: String,
            default: 'Search...',
        },
    },
    mounted() {
        this.form.since=this.earliestTime;
        this.form.until=this.latestTime;
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
            console.log(oldValue,newValue)
            this.getPieData(newValue);
        },
        selectedLine(newValue, oldValue) {
            // 在这里执行向后台请求数据的逻辑
            // 根据 newValue 值发送请求，并处理返回的数据
            console.log(oldValue,newValue)
            this.getLineData(newValue);
        },
        selectedLalel(newvalue){
            console.log("label改变option",newvalue)
            this.labelopthion=newvalue
            this.submitSelectedOptions()
        },
        selectedLineReaction(newvalue){
            // console.log("改变选项",newvalue)
            this.getLineReaction(newvalue);
        },
        selectedLineUser(newvalue){
            console.log("user变选项",newvalue)
            this.UserChangeOption(newvalue);
        }


    },
    methods:{

        getPieData(newValue){
            const element="PieOfAll";
            // if(newValue=='option1'){
            //     axios.get('/api/analyse/pie/all',{params}).then(res => { // url即在mock.js中定义的
            //         console.log(res.data)
            //         console.log(res.data.data)// 打印一下响应数据
            //         this.drawPieChart(element,res.data.data,res.data.title);
            //
            //     })
            // }
            if(newValue=='option2'){
                const params = {
                    repo_name: this.reponame,
                    start_time: this.form.since,
                    end_time: this.form.until
                };
                console.log("change to 2")
                axios.get('/api/analyse/pie/issue',{params}).then(res => { // url即在mock.js中定义的
                    console.log(res.data.data)// 打印一下响应数据
                    this.drawPieChart(element,res.data.data,"项目总体情绪占比图");

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
                    this.drawPieChart(element,res.data.data,res.data.title);

                })
            }

        },
        getLineData(newValue){
            // axios.get('/analyse/linecharm/all').then(res => { // url即在mock.js中定义的
            //     console.log(res.data.data)// 打印一下响应数据
            //     console.log(res.data.title)
            //     this.drawLineChart(res.data.data,res.data.title)
            // })
            const element="LineOfAll";
            if(newValue=='option1'){
                const params = {
                    repo_name: this.reponame,
                    start_time: this.form.since,
                    end_time: this.form.until
                };
                axios.get('/api/analyse/line/all', { params }).then(res => { // url即在mock.js中定义的
                    console.log(res.data)
                    console.log(res.data.data)// 打印一下响应数据
                    this.drawLineChart(element,res.data.data,res.data.title);

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
                    this.drawLineChart(element,res.data.data,res.data.title);

                })
            }
            if(newValue=='option3'){
                const params = {
                    repo_name: this.reponame,
                    start_time: this.form.since,
                    end_time: this.form.until
                };
                axios.get('/api/analyse/line/comment',{params}).then(res => { // url即在mock.js中定义的
                    console.log(res.data.data)// 打印一下响应数据
                    this.drawLineChart(element,res.data.data,res.data.title);
                })
            }
        },
        drawLineChart(element,data,title){
            const chartContainer = document.getElementById(element);
            const mychart = echarts.init(chartContainer,this.curTheme);
            window.addEventListener('resize', function() {
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
                        dataView: { readOnly: false },
                        magicType: { type: ['line', 'bar'] },
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
        drawPieChart(element,data,title) {

            const chartContainer = document.getElementById(element);
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
                                value: data.neg[0],
                                name: 'negative'
                            },
                            {
                                value: data.neu[0],
                                name: 'neutral'
                            },
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

            axios.get('/api/get-issue-labels',{params}).then(res => { // url即在mock.js中定义的
                console.log(res.data)
                this.options = res.data.map((item) => ({ value: item, label: item }));
            })
        },
        submitSelectedOptions() {
            // 将选择的选项值提交给后端的逻辑
            // 可以在这里使用 Axios 或其他请求库发送请求，并将 selectedOptions 作为请求参数传递给后端
            // 示例：打印被选择的选项值
            const params = {
                repo_name: this.reponame,
                start_time: this.form.since,
                end_time: this.form.until,
                weighting:0.7,
                labels:Array.from(this.selectedOptions)
            };
            console.log("参数：",params)
            let url;
            let title;
            //没有选择label时
            if(params.labels.length===0){
                this.drawInitLineLabel()
            }else {
                if(this.labelopthion==="option1"){
                    url='/api/analyse/line/all/label'
                    title ="label情绪对比图--issue+comment"
                }
                if(this.labelopthion==="option2"){
                    url='/api/analyse/line/issue/label'
                    title ="label情绪对比图--issue"
                }
                if(this.labelopthion==="option3"){
                    url='/api/analyse/line/comment/label'
                    title ="label情绪对比图--comment"
                }
                axios.post(url, params).then(res => { // url即在mock.js中定义的
                    // console.log(res.data)
                    this.drawLineChart("LineOfLabel",res.data.data,title)
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
            params={
                repo_name: this.reponame,
                start_time: this.form.since,
                end_time: this.form.until,
                weighting: 0.7,
                labels:(await axios.get('/api/get-most-used-labels', {params})).data
            }
            let url="";
            let title="";
            if(this.labelopthion==="option1"){
                url='/api/analyse/line/all/label'
                title ="label情绪对比图--issue+comment"
            }else if(this.labelopthion==="option2"){
                url='/api/analyse/line/issue/label'
                title ="label情绪对比图--issue"
            }else if(this.labelopthion==="option3"){
                url='/api/analyse/line/comment/label'
                title ="label情绪对比图--comment"
            }
            axios.post(url,params).then(res=>{
                console.log(res.data)
                this.drawLineChart("LineOfLabel",res.data.data,title)
            })

        },
        getLineReaction(newvalue){
            let url="";
            let title="";
            const params ={
                repo_name: this.reponame,
                start_time: this.form.since,
                end_time: this.form.until,
                weighting: 0.7
            }
            //http://localhost:5000/analyse/line/all/reaction?repo_name=apache/superset&start_time=2022-3-1&end_time=2023-5-31&weighting=0.7
            //http://localhost:5000/analyse/line/all/reaction?repo_name="apache/superset"&start_time=2022-3-1&end_time=2023-5-31&weighting=0.7
            //
            if(newvalue==="option1"){
                url='/api/analyse/line/all/reaction'
                title ="reaction情绪对比图--issue+comment"
            }
            if(newvalue==="option2"){
                url='/api/analyse/line/issue/reaction'
                title ="reaction情绪对比图--issue"
            }
            if(newvalue==="option3"){
                url='/api/analyse/line/comment/reaction'
                title ="reaction情绪对比图--comment"
            }
            console.log("reaction",params)
            axios.post(url,params).then(res => { // url即在mock.js中定义的
                console.log(res.data.data)// 打印一下响应数据
                this.drawLineChart("LineOfReaction",res.data.data,title);
            })
        },
        //个人分析粒度
        HandleClick(){
            console.log(this.searchQuery)
            const param = {
                repo_name: this.reponame,
                start_time: "2022-5-1",
                end_time: "2023-5-31",
                user: this.searchQuery
            };
            console.log("发送user请求")
            axios.post("/api/analyse/line/issue/user", param )
                .then((response) => {
                    console.log(response.data)
                    const title=this.searchQuery+"的情绪波动图--issue+comment"
                    this.drawLineChart("LineOfUser",response.data.data,title)
                })
        },
        UserChangeOption(newvalue){
            let url="";
            let title="";
            const params = {
                repo_name: this.reponame,
                start_time: "2022-5-1",
                end_time: "2023-5-31",
                user: this.searchQuery
            };
            if(newvalue==="option1"){
                url='/api/analyse/line/all/user'
                title =this.searchQuery+"的情绪波动图--issue+comment"
            }
            if(newvalue==="option2"){
                url='/api/analyse/line/issue/user'
                title =this.searchQuery+"的情绪波动图--issue"
            }
            if(newvalue==="option3"){
                url='/api/analyse/line/comment/user'
                title =this.searchQuery+"的情绪波动图--comment"
            }
            axios.post(url,params).then(res => { // url即在mock.js中定义的
                console.log(res.data.data)// 打印一下响应数据
                this.drawLineChart("LineOfUser",res.data.data,title);
            })
        },
        getAllUser(){
            const params = {
                repo_name: this.reponame,
                start_time: "2022-5-1",
                end_time: "2023-5-31"
            };
            const url="/api/get-issue-users";
            axios.post(url, params).then( res=>{
                console.log(res.data)
                this.items=res.data.map((item)=>(item))
                this.searchQuery=this.items[0];
                this.HandleClick();
            })
        },
    },




};
</script>
