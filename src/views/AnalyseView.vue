<template>
  <div class="scrapy" style="margin-left: 20%;margin-right: 20%">
    <h2>爬取大型apache项目某一版本的问题及评论数据</h2>
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
          <el-date-picker type="date" placeholder="起始时间" v-model="form.startTime" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-date-picker type="date" placeholder="结束时间" v-model="form.endTime" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确认</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    <el-button type="primary" id="scrapy_issue" @click="scrapy_issue">爬取issues</el-button>
    <el-button type="primary" id="scrapy_comment" @click="scrapy_comment">爬取comments</el-button>

    <p>当前爬取问题状态:{{ issue_message }}</p>
    <p>当前爬取评论状态:{{ comment_message }}</p>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";

export default {
  name: "AnalyseView",
  data() {
    return {
      form: {
        name: '',
        version: '',
        startTime: '',
        endTime: '',
      },
      issue_message: "未处理",
      comment_message: "未处理",
    }
  },
  methods: {
    onSubmit() {
      // todo
      console.log('submit!');
    },
    scrapy_issue() {
      if (this.issue_message === "未处理") {
        this.issue_message = "正在爬取问题，请稍候……";
        axios.get("/api/issue/get-and-save-db").then((res) => {
          this.issue_message = res.data;
        });
      } else {
        alert("问题已爬取，请不要重试");
      }
    },
    scrapy_comment() {
      if (this.comment_message === "未处理") {
        this.comment_message = "正在爬取问题评论，请稍候……";
        axios.get("/api/issue/comments/get-and-save-db").then((res) => {
          this.comment_message = res.data;
        });
      } else {
        alert("问题评论已爬取，请不要重试");
      }
    },
  },
};
</script>
