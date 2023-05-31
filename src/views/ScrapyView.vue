<template>
  <div class="scrapy" style="margin-top: 100px;width: 90%">
    <div class="container">
      <h1 style="margin-left: 10%">数据获取</h1>
      <el-form ref="form" :model="form" label-width="20%">
        <el-form-item label="仓库名称" prop="repo"
                      :rules="[{required: true, message: '请输入仓库名称', trigger: 'blur'}]">
          <el-input v-model="form.repo" style="width: 80%;margin-right: 10px"></el-input>
          <el-button type="success" @click="saveRepoName">暂存</el-button>
          <el-button type="warning" @click="clearRepoName">还原</el-button>
        </el-form-item>
        <el-form-item label="版本时间">
          <el-col :span="9" style="margin-right: 10px">
            <el-date-picker type="date" :disabled-date="disabledDateSince" placeholder="起始时间" v-model="form.since"
                            style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="1">至</el-col>
          <el-col :span="9" style="margin-right: 10px">
            <el-date-picker type="date" :disabled-date="disabledDateUntil" placeholder="结束时间" v-model="form.until"
                            style="width:100%;"></el-date-picker>
          </el-col>
          <el-button type="success" @click="saveRepoDate">暂存</el-button>
          <el-button type="warning" @click="clearRepoDate">还原</el-button>
        </el-form-item>
        <el-form-item label="个人邮箱" prop="email" :rules="[
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
          <el-input v-model="form.email" autocomplete="off" style="width: 80%;margin-right: 10px"></el-input>
          <el-button type="success" @click="saveEmail">暂存</el-button>
          <el-button type="warning" @click="clearEmail">还原</el-button>
        </el-form-item>
        <el-form-item>
          <el-col class="line" :span="11">项目配置:{{ repo_name }}</el-col>&nbsp;
          <el-col class="line" :span="11">处理状态:{{ scrapy_status }}</el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="primaryButton buttonitem" @click="onSubmit">提交配置</el-button>
          <el-button type="primary" class="primaryButton buttonitem" @click="crawling">爬取数据</el-button>
          <el-button type="success" class="successButton buttonitem" @click="chooseType">下载数据</el-button>
          <el-button type="success" class="successButton buttonitem" @click="analyse">情感分析</el-button>
        </el-form-item>
      </el-form>
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
    <div class="data-container" style="width: 80%;margin-left: 15%;margin-top: 10%;margin-bottom: 20%">
      <h1>数据详情</h1>
      <div>
        <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" ref="filterTable">
          <el-table-column type="expand">
            <template #default="props">
              <div m="4">
                <el-table :data="props.row.issue_comments" :border="childBorder">
                  <el-table-column label="CommentBody" prop="body" show-overflow-tooltip/>
                  <el-table-column label="CreatedAt" prop="created_at" show-overflow-tooltip sortable/>
                  <el-table-column label="UpdatedAt" prop="updated_at" show-overflow-tooltip sortable/>
                  <el-table-column label="LoginUser" prop="user" show-overflow-tooltip/>
                </el-table>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="Id" width="130" show-overflow-tooltip sortable>
          </el-table-column>
          <el-table-column prop="state" label="State" width="130" show-overflow-tooltip sortable
                           :filters="[{ text: 'open', value: 'open' }, { text: 'closed', value: 'closed' }]"
                           :filter-method="filterTag"
                           filter-placement="bottom-end">
            <template v-slot="scope">
              <el-tag
                  :type="scope.row.state === 'open' ? 'success' : 'warning'"
                  disable-transitions>{{ scope.row.state }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="IssueTitle" width="130" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="body" label="IssueBody" width="130" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="labels" label="IssueLabels" width="130" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="created_at" label="CreatedAt" width="130" show-overflow-tooltip sortable>
          </el-table-column>
          <el-table-column prop="updated_at" label="UpdatedAt" width="130" show-overflow-tooltip sortable>
          </el-table-column>
          <el-table-column prop="user" label="LoginUser" show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </div>
      <div class="block" style="margin-top:15px;">
        <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-sizes="[1,5,10,20]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="tableData.length">
        </el-pagination>
      </div>
    </div>

  </div>
</template>
<style>
.buttonitem {
  width: 20%;
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
      tableData: [],
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 20, // 每页的数据条数
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
      earliestTime: '',
    }
  },
  mounted() {
    this.form.repo = "apache/superset";
    this.form.since = Date.now();
    this.form.until = Date.now();
    this.form.email = "3320415065@qq.com";
  },
  methods: {
    filterTag(value, row) {
      return row.state === value;
    },
    //每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    disabledDateSince(date) {
      return date < new Date(this.earliestTime);
    },
    disabledDateUntil(date) {
      return date < new Date(this.form.since);
    },
    saveRepoName() {
      axios.get('/api/issue/earliest', {
        params: {
          repo: this.form.repo
        }
      }).then((res) => {
        this.earliestTime = res.data
        this.$message({
          message: '仓库名称保存成功！',
          type: 'success'
        });
      })
    },
    clearRepoName() {
      this.form.repo = ''
    },
    saveRepoDate() {
      this.$message({
        message: '版本时间保存成功！',
        type: 'success'
      });
    },
    clearRepoDate() {
      this.form.since = Date.now();
      this.form.until = Date.now();
    },
    saveEmail() {
      this.$message({
        message: '个人邮箱保存成功！',
        type: 'success'
      });
    },
    clearEmail() {
      this.form.email = ''
    },
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
          "api/crawling/new",
          this.form
      ).then((res) => {
        console.log(res)
        axios.post(
            "/api/download",
            this.form
        ).then((res) => {
          console.log(res)
          res.data.forEach(item => {
            let labelsName = "";
            item.labels.forEach(_item => {
              labelsName += _item.name + " ";
            })
            item.labels = labelsName
            item.user = item.user.login
            let commentTable = item.issue_comments
            commentTable.forEach(_item => {
              _item.user = _item.user.login
            })
            this.tableData = this.tableData.concat(item)
          })
          this.$message({
            message: '数据爬取完成',
            type: 'success'
          });
          this.scrapy_status = '数据爬取完成'
        })
      })
    },
    dateFormat(date) {
      const this_date = new Date(date);
      return this_date.getFullYear() + '-' + (this_date.getMonth() + 1) + '-' + this_date.getDate();
    },
    generateData(format) {
      const data = this.tableData;
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
        txtData += "IssueTitle\tIssueBody\tIssueLabels\tCreatedAt\tUpdatedAt\tLoginUser\n";
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
      this.$router.push({
        name: 'analyse',
        params: {
          repoName: this.form.repo,
          repoSince: this.form.since,
          repoUntil: this.form.until
        }
      })
    }
  },
};
</script>
