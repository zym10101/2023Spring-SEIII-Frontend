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
          <el-col class="line" :span="2">-</el-col>
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
          <el-button type="primary" id="scrapy_issue" @click="scrapy_issue">开始</el-button>&nbsp;&nbsp;
          <el-text>当前状态:{{ issue_message }}</el-text>
        </el-form-item>
        <el-form-item label="爬取评论">
          <el-button type="primary" id="scrapy_comment" @click="scrapy_comment">开始</el-button>&nbsp;&nbsp;
          <el-text>当前状态:{{ comment_message }}</el-text>
        </el-form-item>
      </el-form>
    </div>
    <div class="step3">
      <h2>数据下载</h2>
      <el-form label-width="20%">
        <el-form-item label="下载格式">
          <el-radio v-model="radio" label="1">csv</el-radio>
          <el-radio v-model="radio" label="2">xlsx</el-radio>
          <el-radio v-model="radio" label="3">txt</el-radio>
          <el-button type="primary" id="scrapy_comment" @click="download">下载</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";

export default {
  name: "ScrapyView",
  data() {
    return {
      form: {
        name: '',
        version: '',
        startTime: '',
        endTime: '',
      },
      radio: '1',
      issue_message: "未处理",
      comment_message: "未处理",
      repo_name: "未定义",
    }
  },
  methods: {
    onSubmit() {
      axios.post(
          "/api/project/info",
          this.form
      ).then((res) => {
        console.log(res)
        this.repo_name = res.data
      })
      this.$message({
        message: '数据源保存成功！',
        type: 'success'
      });
    },
    scrapy_issue() {
      if (this.issue_message === "未处理") {
        this.issue_message = "正在爬取问题，请稍候……";
        this.$message({
          message: this.issue_message,
          type: 'success'
        });
        axios.get("/api/issue/get-and-save-db").then((res) => {
          this.issue_message = res.data;
          this.$message({
            message: this.issue_message,
            type: 'success'
          });
        });
      } else {
        this.$message({
          message: '问题已爬取，请不要重试！',
          type: 'error'
        });
      }
    },
    scrapy_comment() {
      if (this.comment_message === "未处理") {
        this.comment_message = "正在爬取评论，请稍候……";
        this.$message({
          message: this.comment_message,
          type: 'success'
        });
        axios.get("/api/issue/comments/get-and-save-db").then((res) => {
          this.comment_message = res.data;
          this.$message({
            message: this.comment_message,
            type: 'success'
          });
        });
      } else {
        this.$message({
          message: '评论已爬取，请不要重试！',
          type: 'error'
        });
      }
    },
    download() {
      // todo
      console.log('download!');
    }
  },
};
</script>
