<template>
  <div class="analyse">
    <el-button type="primary" id="scrapy_issue" @click="scrapy_issue()">爬取issues</el-button>
    <el-button type="primary" id="scrapy_comment" @click="scrapy_comment()">爬取comments</el-button>

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
      issue_message: "未处理",
      comment_message: "未处理",
    };
  },
  methods: {
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
