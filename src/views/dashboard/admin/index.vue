<template>
  <div class="dashboard-editor-container">
    <github-corner class="github-corner"/>

    <panel-group @handleSetLineChartData="handleSetLineChartData"/>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"/>
    </el-row>

    <el-row :gutter="32">
      <!--<el-col :xs="24" :sm="24" :lg="8">-->
      <!--<div class="chart-wrapper">-->
      <!--<raddar-chart/>-->
      <!--</div>-->
      <!--</el-col>-->
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart :chart-data="pieChartData"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <bar-chart :chart-data="barChartData"/>
        </div>
      </el-col>
    </el-row>

    <!--<el-row :gutter="8">-->
    <!--<el-col-->
    <!--:xs="{span: 24}"-->
    <!--:sm="{span: 24}"-->
    <!--:md="{span: 24}"-->
    <!--:lg="{span: 12}"-->
    <!--:xl="{span: 12}"-->
    <!--style="padding-right:8px;margin-bottom:30px;">-->
    <!--<transaction-table/>-->
    <!--</el-col>-->
    <!--<el-col-->
    <!--:xs="{span: 24}"-->
    <!--:sm="{span: 12}"-->
    <!--:md="{span: 12}"-->
    <!--:lg="{span: 6}"-->
    <!--:xl="{span: 6}"-->
    <!--style="margin-bottom:30px;">-->
    <!--<todo-list/>-->
    <!--</el-col>-->
    <!--<el-col-->
    <!--:xs="{span: 24}"-->
    <!--:sm="{span: 12}"-->
    <!--:md="{span: 12}"-->
    <!--:lg="{span: 6}"-->
    <!--:xl="{span: 6}"-->
    <!--style="margin-bottom:30px;">-->
    <!--<box-card/>-->
    <!--</el-col>-->
    <!--</el-row>-->
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
import { statisticsLogLine, statisticsLogPie } from '@/api/log'
import { statisticsUser } from '@/api/user'

const xAxisData = []
// 往前七天
let startDate = new Date(new Date() + 6 * 24 * 3600 * 1000)
for (let i = 0; i < 7; i++) {
  const m = startDate.getMonth() + 1
  const d = startDate.getDate()
  const dateStr = m + '-' + d
  xAxisData.unshift(dateStr)
  startDate = new Date(startDate - 1 * 24 * 3600 * 1000)
}
const lineChartData = {
  user: {
    showNameData_1: [0, 0, 0, 0, 0, 0, 0],
    showNameData_2: [0, 0, 0, 0, 0, 0, 0],
    xAxisData: xAxisData,
    showName_1: '活跃用户',
    showName_2: ''
  },
  log: {
    showNameData_1: [0, 0, 0, 0, 0, 0, 0],
    showNameData_2: [0, 0, 0, 0, 0, 0, 0],
    xAxisData: xAxisData,
    showName_1: '成功',
    showName_2: '失败'
  }
}
const pieChartData = {
  log: {
    showNameList: ['成功', '失败', '执行中', '未收到执行器确认'],
    name: '日志分析饼图',
    dataList: []
  }
}
const animationDuration = 6000
const barChartData = {
  log: {
    showNameList: xAxisData,
    name: '日志分析柱形图',
    dataList: []
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      lineChartData: lineChartData.user,
      pieChartData: pieChartData.log,
      barChartData: barChartData.log
    }
  },
  mounted() {
    // 获取日志统计
    statisticsLogLine().then(response => {
      lineChartData.log.showNameData_1 = response['success']
      lineChartData.log.showNameData_2 = response['fail']

      barChartData.log.dataList.push({
        name: '成功',
        type: 'bar',
        stack: 'vistors',
        barWidth: '60%',
        data: response['success'],
        itemStyle: { color: '#05dc90' },
        animationDuration
      }, {
        name: '失败',
        type: 'bar',
        stack: 'vistors',
        barWidth: '60%',
        data: response['fail'],
        itemStyle: { color: '#DC143C' },
        animationDuration
      })
    })
    // 获取日志饼图
    statisticsLogPie().then(response => {
      for (const data of response) {
        switch (data.name) {
          // {value: 320, name: '成功', itemStyle: {color: '#DC143C'}}
          case '成功':
            data.itemStyle = { color: '#05dc90' }
            break
          case '失败':
            data.itemStyle = { color: '#DC143C' }
            break
          case '执行中':
            data.itemStyle = { color: '#dc409e' }
            break
          case '未收到执行器确认':
            data.itemStyle = { color: '#dcd324' }
            break
        }
      }
      pieChartData.log.dataList = response
    })
    // 获取用户统计
    statisticsUser().then(response => {
      lineChartData.user.showNameData_1 = response
    })
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0px;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  @media (max-width: 1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
