<template>
  <div class="scrapy" style="text-align: left;margin-left: 20%;margin-right: 20%">
    <div class="step1">
      <h2>数据来源</h2>
      <el-form ref="form" :model="form" label-width="20%">
        <el-form-item label="爬取项目链接">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="默认版本时间">
          <el-select v-model="form.version" placeholder="请选择版本时间">
            <el-option label="2023.4-2023.6" value="2023.3-2023.6"></el-option>
            <el-option label="2023.1-2023.3" value="2023.1-2023.3"></el-option>
            <el-option label="2022.10-2022.12" value="2022.10-2022.12"></el-option>
            <el-option label="2022.7-2022.9" value="2022.7-2022.9"></el-option>
            <el-option label="2022.4-2022.6" value="2022.4-2022.6"></el-option>
            <el-option label="2022.1-2022.3" value="2022.1-2022.3"></el-option>
            <el-option label="2021.10-2021.12" value="2021.10-2021.12"></el-option>
            <el-option label="2021.7-2021.9" value="2021.7-2021.9"></el-option>
            <el-option label="2021.4-2021.6" value="2021.4-2021.6"></el-option>
            <el-option label="2021.1-2021.3" value="2021.1-2021.3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="自定义版本时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="起始时间" v-model="form.startTime"
                            style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;至</el-col>
          <el-col :span="11">
            <el-date-picker type="date" placeholder="结束时间" v-model="form.endTime"
                            style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>&nbsp;&nbsp;
          <el-text>当前项目:{{ repo_name }}</el-text>
        </el-form-item>
      </el-form>
    </div>
    <div class="step2">
      <h2>数据获取</h2>
      <el-form label-width="20%">
        <el-form-item label="爬取问题">
          <el-button type="primary" id="scrapy_issue" @click="scrapy_issue">开始</el-button>&nbsp;
          <el-button type="success" id="scrapy_issue_detail" @click="issueTableVisible = true">查看详情</el-button>&nbsp;&nbsp;
          <el-text>当前状态:{{ issue_message }}</el-text>
        </el-form-item>
        <el-form-item label="爬取评论">
          <el-button type="primary" id="scrapy_comment" @click="scrapy_comment">开始</el-button>&nbsp;
          <el-button type="success" id="scrapy_comment_detail" @click="commentTableVisible = true">查看详情</el-button>&nbsp;&nbsp;
          <el-text>当前状态:{{ comment_message }}</el-text>
        </el-form-item>
      </el-form>
    </div>
    <div class="issueTable">
      <el-dialog v-model="issueTableVisible" title="问题列表">
        <el-table :data="issueData" id="issueDataTable">
          <el-table-column property="title" label="Title" width="150" show-overflow-tooltip/>
          <el-table-column property="body" label="Body" width="150" show-overflow-tooltip/>
          <el-table-column property="labels" label="Labels" width="150" show-overflow-tooltip/>
          <el-table-column property="created_at" label="Create_at" width="150" show-overflow-tooltip/>
          <el-table-column property="user" label="User" width="150" show-overflow-tooltip/>
        </el-table>
      </el-dialog>
    </div>
    <div class="commentTable">
      <el-dialog v-model="commentTableVisible" title="评论列表">
        <el-table :data="commentData" id="commentDataTable">
          <el-table-column property="body" label="Body" width="250" show-overflow-tooltip/>
          <el-table-column property="created_at" label="Create_at" width="250" show-overflow-tooltip/>
          <el-table-column property="user" label="User" width="250" show-overflow-tooltip/>
        </el-table>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="请填写个人邮箱，以便数据爬取完成后及时通知您~" v-model="emailFormVisible">
        <el-form :model="emailForm">
          <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth" :rules="[
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
            <el-input v-model="emailForm.email" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
    <span class="dialog-footer">
      <el-button @click="emailFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitEmailForm">确 定</el-button>
    </span>
        </template>
      </el-dialog>
    </div>
    <div class="step3">
      <h2>数据下载</h2>
      <el-form label-width="20%">
        <el-form-item label="下载格式">
          <el-radio v-model="radio" label="csv">csv</el-radio>
          <el-radio v-model="radio" label="xlsx">xlsx</el-radio>
          <el-radio v-model="radio" label="txt">txt</el-radio>
          <el-button type="primary" id="download_issue" @click="download('issues',this.radio)">下载问题</el-button>
          <el-button type="primary" id="download_comment" @click="download('comments',this.radio)">下载评论</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

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
      commentData: [],
      issueTableVisible: false,
      commentTableVisible: false,
      form: {
        name: "https://github.com/apache/superset",
        version: '',
        startTime: '',
        endTime: '',
      },
      radio: 'csv',
      issue_message: "未处理",
      comment_message: "未处理",
      repo_name: "未定义",
      emailFormVisible: false,
      emailForm: {
        email: '',
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    submitEmailForm() {
      this.emailFormVisible = false;
      this.$message({
        message: '邮箱提交成功！',
        type: 'success'
      });
    },
    onSubmit() {
      if (this.form.name !== '') {
        this.$message({
          message: '数据源保存成功！',
          type: 'success'
        });
        this.comment_message = "未处理";
        this.issue_message = "未处理";
      } else {
        this.$message({
          message: '项目链接不能为空！',
          type: 'error'
        });
        return
      }
      axios.post(
          "/api/project/info",
          this.form
      ).then((res) => {
        this.repo_name = res.data
      })
    },
    checkRepoNotNull() {
      return !(this.repo_name === "" || this.repo_name === "未定义");
    },
    repoNullError() {
      this.$message({
        message: '项目名称不能为空！',
        type: 'error'
      });
    },
    RepeatTryError() {
      this.$message({
        message: '数据已爬取，请不要重试！',
        type: 'error'
      });
    },
    scrapy_issue() {
      if (this.checkRepoNotNull()) {
        if (this.issue_message === "未处理") {
          if (this.emailForm.email === '') {
            this.emailFormVisible = true;
          }
          this.issue_message = "正在爬取问题，请稍候……";
          this.$message({
            message: this.issue_message,
            type: 'success'
          });
          axios.get("/api/issue/get-and-save-db").then((res) => {
            this.issue_message = "爬取成功！";
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
              message: this.issue_message,
              type: 'success'
            });
            axios.post(
                "/api/email",
                this.emailForm
            )
          });
        } else {
          this.RepeatTryError()
        }
      } else {
        this.repoNullError()
      }
    },
    scrapy_comment() {
      if (this.checkRepoNotNull()) {
        if (this.comment_message === "未处理") {
          console.log(this.emailForm.email)
          if (this.emailForm.email === '') {
            this.emailFormVisible = true;
          }
          this.comment_message = "正在爬取评论，请稍候……";
          this.$message({
            message: this.comment_message,
            type: 'success'
          });
          axios.get("/api/issue/comments/get-and-save-db").then((res) => {
            this.comment_message = "爬取成功！";
            res.data.forEach(item => {
              console.log(item)
              item.user = item.user.login
              this.commentData = this.commentData.concat(item)
            })
            this.$message({
              message: this.comment_message,
              type: 'success'
            });
          });
        } else {
          this.RepeatTryError()
        }
      } else {
        this.repoNullError()
      }
    },
    generateData(type, format) {
      const data = type === 'issues' ? this.issueData : this.commentData;
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
        if (type === "issues") {
          txtData += "Title\tBody\tLabels\tCreated_at\tUser\n";
          data.forEach(item => {
            txtData += `${item.title}\t${item.body}\t${item.labels}\t${item.created_at}\t${item.user}\n`;
          });
        } else if (type === "comments") {
          txtData += "Body\tCreated_at\tUser\n";
          data.forEach(item => {
            txtData += `${item.body}\t${item.created_at}\t${item.user}\n`;
          });
        }
        return {data: txtData, extension: 'txt'};
      } else {
        return null; // 处理未知格式
      }
    },
    download(type, format) {
      const formatData = this.generateData(type, format);
      if (formatData) {
        const {data, extension} = formatData;
        const blob = new Blob([data], {type: `text/${extension};charset=utf-8;`});
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `${type}.${extension}`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    },
  },
};
</script>
