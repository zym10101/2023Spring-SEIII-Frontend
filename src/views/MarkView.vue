<template>
  <div id="app" style="margin-top: 100px">
    <heatmap-chart></heatmap-chart>
  </div>
  <div style="text-align: left;margin-bottom: 10%">
    <h2>报告详情</h2>
    <h3>一、数据来源</h3>
    <el-text>
      apache superset项目是一个开源的大数据探索分析、可视化报表平台，支持丰富的数据源，且拥有不同种类的可视化图表选择。我们从2022年9月至2023年6月的所有关于apache
      superset项目的issue中摘取了200条进行人工标注，该时间段内的issue主要是针对该项目的第二个（同时也是最近的一个）大版本，针对这些issue的分析有助于我们了解当前github用户比较关心的bug
      report和function request中的方面。
    </el-text>
    <br>
    <h3>二、标注符号解释</h3>
    <el-text>[]：方面（aspect）</el-text>&nbsp;&nbsp;
    <el-text>{}：具体问题（bug）</el-text>&nbsp;&nbsp;
    <el-text>()：功能点需求（request）</el-text>
    <br>
    <h3>三、问题方面分析</h3>
    <el-text>选择关键词出现频率大于1的方面进行分析，总计19个方面。统计相应聚类中的文本数量，情绪值平均数和文本序号。
    </el-text>
    <h4>情绪值平均数特点与解释</h4>
    <el-text>1.所有的情绪值平均数在-0.6~0.5之间，没有极端值</el-text>
    <br>
    <el-text>2.反映issue通常需要客观清晰的表达，情绪强度不高</el-text>
    <br>
    <el-text>3.情绪值平均数为负数的有12个方面，为0的有5个，为正的有2个</el-text>
    <br>
    <el-text>4.选择的issue中多数为缺陷报告（bug
      report），用户在进行缺陷报告时会用到wrong、missing、unable等情绪评分为负值的语素，故情绪值平均数的统计结果符合我们的预期
    </el-text>
    <br>
    <h4>详细列表</h4>
    <div>
      <el-table :data="tableData">
        <el-table-column type="expand">
          <template #default="props">
            <el-table :data="props.row.context" :border="childBorder">
              <el-table-column>
                <template v-slot="scope">
                  文本：{{ scope.row }}
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="方面关键词" width="200px"></el-table-column>
        <el-table-column prop="value[0]" label="文本条数" width="200px" sortable></el-table-column>
        <el-table-column prop="value[1]" label="情绪值平均数" width="200px" sortable></el-table-column>
        <el-table-column prop="issue" label="问题汇聚" width="600px" ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

import HeatmapChart from '../components/HeatmapChart.vue';
import axios from "axios";

export default {
  data() {
    return {
      tableData: []
    }
  },
  components: {
    HeatmapChart,
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      axios.get('/api/annotation').then((res) => {
        let tempData = []
        res.data.forEach((item) => {
          tempData = tempData.concat(item)
        })
        this.tableData = tempData
        this.tableData[0].issue = '表格中数据的显示问题（标题或数据过长）；创建或重置图标操作失败';
        this.tableData[1].issue = '未提供应有的功能选项；500 error；加载速度慢';
        this.tableData[2].issue = 'helm模块问题';
        this.tableData[3].issue = 'docker-compose失败；在docker中运行镜像失败；dockerfile报错';
        this.tableData[4].issue = '数据库连接失败；没用数据库的访问权限；无法改变数据源';
        this.tableData[5].issue = '获取access token失败';
        this.tableData[6].issue = '将数据导出为csv格式失败；无法将导出的文件通过邮件发送';
        this.tableData[7].issue = '在某些模式下custom api无法正常调用';
        this.tableData[8].issue = '图表中user维度设置失败；无法添加大量user数据';
        this.tableData[9].issue = '修改默认的过滤条件参数失败；返回结果不是预期结果';
        this.tableData[10].issue = '图表信息无法以某些语言呈现';
        this.tableData[11].issue = 'url参数缺失；图表参数传递中的格式问题';
        this.tableData[12].issue = '按钮功能失效；按键美化问题';
        this.tableData[13].issue = 'url参数缺失、不匹配';
        this.tableData[14].issue = 'npm install失败；加载clickhouse driver、sqlalchemy、StatStatsLogger等失败';
        this.tableData[15].issue = '页面美化问题；页面显示问题';
        this.tableData[16].issue = '连接spark sql、clickhouse、SnowFlake等失败';
        this.tableData[17].issue = '删除图表、修改数据时缺少警告提示信息；';
        this.tableData[18].issue = '人工更新日期失败；手动设置时间间隔无效';
      })
    }
  }
};
</script>
