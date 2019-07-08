<template>
  <div class="dashboard-editor-container">
    <github-corner class="github-corner"/>

    <panel-group @handleSetLineChartData="handleSetLineChartData"/>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"/>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart/>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 12}"
        :xl="{span: 12}"
        style="padding-right:8px;margin-bottom:30px;">
        <transaction-table/>
      </el-col>
      <el-col
        :xs="{span: 24}"
        :sm="{span: 12}"
        :md="{span: 12}"
        :lg="{span: 6}"
        :xl="{span: 6}"
        style="margin-bottom:30px;">
        <todo-list/>
      </el-col>
      <el-col
        :xs="{span: 24}"
        :sm="{span: 12}"
        :md="{span: 12}"
        :lg="{span: 6}"
        :xl="{span: 6}"
        style="margin-bottom:30px;">
        <box-card/>
      </el-col>
    </el-row>
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
import { statisticsLog } from '@/api/log'

const xAxisData = []
const lineChartData = {
  newVisitis: {
    expectedData: [0, 0, 0, 0, 0, 0, 0],
    actualData: [0, 0, 0, 0, 0, 0, 0],
    xAxisData: xAxisData
  },
  log: {
    expectedData: [0, 10, 0, 0, 0, 0, 0],
    actualData: [0, 0, 0, 0, 0, 0, 0],
    xAxisData: xAxisData
  },
  purchases: {
    expectedData: [0, 0, 0, 0, 0, 0, 0],
    actualData: [0, 0, 0, 0, 0, 0, 0],
    xAxisData: xAxisData
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
      lineChartData: lineChartData.newVisitis
    }
  },
  mounted() {
    // 往前七天
    let startDate = new Date(new Date() + 7 * 24 * 3600 * 1000)
    for (let i = 0; i < 7; i++) {
      const tmpDate = new Date(startDate - 1 * 24 * 3600 * 1000)
      const m = tmpDate.getMonth() + 1
      const d = tmpDate.getDate()
      const dateStr = m + '-' + d
      xAxisData.unshift(dateStr)
      startDate = tmpDate
    }

    // 获取日志统计
    statisticsLog().then(response => {
      lineChartData.log.expectedData = response['success']
      lineChartData.log.actualData = response['fail']
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
