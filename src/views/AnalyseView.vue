<template>
  <div class="analyse">
    <div>当前状态:{{ message }}</div>
    <el-button type="primary" id="scrapy_issue" @click="scrapy_issue()"
      >爬取issues
    </el-button>
    <el-button type="primary" id="scrapy_comment" @click="scrapy_comment()"
      >爬取comments
    </el-button>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";

export default {
  name: "AnalyseView",
  data() {
    return {
      message: "",
    };
  },
  methods: {
    scrapy_issue() {
      this.message = "正在爬取问题，请稍候……";
      axios.get("/api/issue/get-and-save-db").then((res) => {
        this.message = res.data;
      });
    },
    scrapy_comment() {
      this.message = "正在爬取问题评论，请稍候……";
      axios.get("/api/issue/comments/get-and-save-db").then((res) => {
        this.message = res.data;
      });
    },
  },
};
</script>
