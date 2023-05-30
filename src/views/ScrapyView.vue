<template>
  <div class="scrapy" style="margin-top: 100px;width: 90%">
    <div class="container">
      <h1 style="margin-left: 10%">数据获取</h1>
      <el-form ref="form" :model="form" label-width="20%">
        <el-form-item label="仓库名称" prop="repo"
                      :rules="[{required: true, message: '请输入仓库名称', trigger: 'blur'}]">
          <el-input v-model="form.repo"></el-input>
        </el-form-item>
        <el-form-item label="版本时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="起始时间" v-model="form.since"
                            style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;至</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="结束时间" v-model="form.until"
                            style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="个人邮箱" prop="email" :rules="[
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-col class="line" :span="11">当前项目:{{ repo_name }}</el-col>&nbsp;
          <el-col class="line" :span="11">当前状态:{{ scrapy_status }}</el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="primaryButton buttonitem" @click="onSubmit">保存配置</el-button>
          <el-button type="primary" class="primaryButton buttonitem" @click="crawling">爬取</el-button>
          <el-button type="success" class="successButton buttonitem" id="scrapy_issue_detail"
                     @click="dataTableVisible = true">查看详情
          </el-button>
          <el-button type="success" class="successButton buttonitem" @click="chooseType">下载</el-button>
          <el-button type="success" class="successButton buttonitem" @click="analyse">情感分析</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="dataTable">
      <el-dialog v-model="dataTableVisible" title="问题列表">
        <el-table :data="issueData" id="issueDataTable">
          <el-table-column property="title" label="Title" width="150" show-overflow-tooltip/>
          <el-table-column property="body" label="Body" width="150" show-overflow-tooltip/>
          <el-table-column property="labels" label="Labels" width="150" show-overflow-tooltip/>
          <el-table-column property="created_at" label="Create_at" width="150" show-overflow-tooltip/>
          <el-table-column property="updated_at" label="Update_at" width="150" show-overflow-tooltip/>
          <el-table-column property="user" label="User" width="150" show-overflow-tooltip/>
        </el-table>
      </el-dialog>
    </div>
    <div class="type">
      <el-dialog v-model="chooseTypeVisible" title="请选择下载格式">
        <el-form label-width="20%">
          <el-form-item label="下载格式" :class="{ 'selected': radio }">
            <el-radio v-model="radio" label="csv">csv</el-radio>
            <el-radio v-model="radio" label="xlsx">xlsx</el-radio>
            <el-radio v-model="radio" label="txt">txt</el-radio>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="success" class="successButton buttonitem" @click="download(this.radio)">下载</el-button>
            <el-button type="warning" class="primaryButton buttonitem"
                       @click="chooseTypeVisible = false">取消</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<style>
.buttonitem {
  width: 18%;
  background: #4ea397;
  color: white;
  border-radius: 15px;
  border: none;
  outline: none;
  padding: 23px 0;
  cursor: pointer;
  margin-top: 20px;
  margin-left: 12px;

&
:hover {
  background: #71b5ac;
}

}
.successButton {
  background: #2c3e50;

&
:hover {
  background: #566573;
}

}

.el-radio__input.is-checked .el-radio__inner {
  border-color: #71b5ac;
  background: #71b5ac;
}

.el-radio__input.is-checked + .el-radio__label {
  color: #71b5ac;

}
</style>

<script>
// @ is an alias to /src
import axios from "axios";
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';

export default {
  name: "ScrapyView",
  data() {
    return {
      issueData: [],
      dataTableVisible: false,
      chooseTypeVisible: false,
      form: {
        repo: "",
        since: "",
        until: "",
        email: ""
      },
      scrapy_status: '未处理',
      radio: 'csv',
      repo_name: "未定义",
    }
  },
  mounted() {
    this.form.repo = "apache/superset";
    this.form.since = Date.now();
    this.form.until = Date.now();
    this.form.email = "3320415065@qq.com";
  },
  methods: {
    onSubmit() {
      if (this.form.repo === '' || this.form.email === '') {
        this.$message({
          message: '项目配置不完整！',
          type: 'error'
        });
        return
      }
      this.$message({
        message: '数据源保存成功！',
        type: 'success'
      });
      this.repo_name = this.form.repo;
      this.scrapy_status = '未处理';
    },
    checkRepoNull() {
      if (this.repo_name === "未定义" || this.repo_name === '') {
        this.$message({
          message: '请检查配置是否保存',
          type: 'warning'
        });
        return true
      }
    },
    checkRepeatTry() {
      if (this.scrapy_status !== '未处理') {
        this.$message({
          message: '数据已爬取，请不要重试！',
          type: 'warning'
        });
        return true
      }
    },
    checkScrapyNotFinish() {
      if (this.scrapy_status !== '数据爬取完成') {
        this.$message({
          message: '数据不存在',
          type: 'error'
        });
        return true
      }
    },
    crawling() {
      if (this.checkRepoNull() || this.checkRepeatTry()) {
        return
      }
      this.$message({
        message: '数据爬取中，请稍候……',
        type: 'success'
      });
      this.scrapy_status = '数据爬取中，请稍候……';
      this.form.since = this.dateFormat(this.form.since)
      this.form.until = this.dateFormat(this.form.until)
      axios.post(
          "api/crawling",
          this.form
      ).then((res) => {
        res.data.forEach(item => {
          let labelsName = "";
          item.labels.forEach(_item => {
            labelsName += _item.name + " ";
          })
          item.labels = labelsName
          item.user = item.user.login
          this.issueData = this.issueData.concat(item)
        })
        this.$message({
          message: '数据爬取完成',
          type: 'success'
        });
        this.scrapy_status = '数据爬取完成'
      })
    },
    dateFormat(date) {
      const this_date = new Date(date);
      return this_date.getFullYear() + '-' + (this_date.getMonth() + 1) + '-' + this_date.getDate();
    },
    generateData(format) {
      const data = this.issueData;
      if (format === 'csv') {
        const csvData = Papa.unparse(data);
        return {data: csvData, extension: 'csv'};
      } else if (format === 'xlsx') {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const jsonComments = XLSX.utils.sheet_to_json(worksheet);
        // 拆分长文本到多个单元格
        const maxLength = 32767;
        jsonComments.forEach((comment) => {
          Object.keys(comment).forEach((key) => {
            const value = comment[key];
            if (typeof value === 'string' && value.length > maxLength) {
              const parts = [];
              for (let i = 0; i < value.length; i += maxLength) {
                parts.push(value.substr(i, maxLength));
              }
              comment[key] = parts;
            }
          });
        });
        const workbook = XLSX.utils.book_new();
        const updatedWorksheet = XLSX.utils.json_to_sheet(jsonComments);
        XLSX.utils.book_append_sheet(workbook, updatedWorksheet, '评论');
        const xlsxData = XLSX.write(workbook, {type: 'array', bookType: 'xlsx'});
        return {data: xlsxData, extension: 'xlsx'};
      } else if (format === 'txt') {
        let txtData = '';
        txtData += "Title\tBody\tLabels\tCreated_at\tUpdated_at\tUser\n";
        data.forEach(item => {
          txtData += `${item.title}\t${item.body}\t${item.labels}\t${item.created_at}\t${item.updated_at}\t${item.user}\n`;
        });
        return {data: txtData, extension: 'txt'};
      } else {
        return null; // 处理未知格式
      }
    },
    download(format) {
      this.$message({
        message: '数据下载成功',
        type: 'success'
      });
      const formatData = this.generateData(format);
      if (formatData) {
        const {data, extension} = formatData;
        const blob = new Blob([data], {type: `text/${extension};charset=utf-8;`});
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `issues.${extension}`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    },

    chooseType() {
      this.checkScrapyNotFinish();
      this.chooseTypeVisible = true;
    },
    analyse() {
      if (this.checkScrapyNotFinish()) {
        return
      }
      this.$message({
        message: '情感分析中，请稍候……',
        type: 'success'
      });
      this.scrapy_status = '情感分析中，请稍候……';
      axios.get("/api/issue/cal-Senti").then((res) => {
        this.$router.push({
          // 跳转到的页面名
          name: 'analyse',
          // 传递的参数集合
          params: {
            detailData: res.data
          }
        })
      })
    }
  },
};
</script>
