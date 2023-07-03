// @Author: Mohammed Al-Rasheed

// Purpose: Build out our main page which is the trades of the congress

// Imports
import React, { Component } from "react";
import Navbar from "../Navbar/Navbar";

import { DownOutlined, SlidersOutlined, DollarOutlined } from "@ant-design/icons";
import { Table, Tag, Card, Col, Row, Dropdown, Button, Layout, Menu } from "antd";

import axios from 'axios';
import Chart from "../Chart";

import numeral from 'numeral';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Initilze that our content is equal to the layout
const { Content } = Layout;
// Initilze our columns
const columns = [
  {
    title: "Nome do Asset",
    dataIndex: "assetName",
    key: "assetType",
  },
  {
    title: "Preço Atual",
    dataIndex: "currentPrice",
    key: "amount",
  },
  {
    title: 'Preço de Abertura',
    dataIndex: 'openPrice',
    key: 'amount',
  },
  {
    title: "Preço de Fechamento",
    dataIndex: "closePrice",
    key: "amount",
  },
  {
    title: "Market Value",
    dataIndex: "marketCap",
    key: "amount",
    render: (marketCap: any) => (
      <Tag color="green" key={marketCap}
      >
        {numeral(marketCap).format('0.[00]a').toUpperCase()}
      </Tag>
    )
  },
  {
    title: "Volume",
    dataIndex: "volume",
    key: "amount",
    render: (volume: any) => (
      <Tag color="blue" key={volume}
      >
        {numeral(volume).format('0.[00]a').toUpperCase()}
      </Tag>
    )
  },
];


// This variable keeps track of dynamic URL params such as how much data the user wants to see per page or what transaction type they want to see to allow features such as filtering 
const getURLParams = (params: any) => ({
  // search represents the search of the user 
  search: params.search,
  // Limit represents how much data per page
  limit: params.pagination.pageSize,
  // offset represents how much data is being ignored
  offset: (params.pagination.current - 1) * params.pagination.pageSize,
  // trnasaction type represents the type of transaction the user wants to see
  transactionType: params.transactionType,
});


class Home extends Component<{}> {
  state: any = {
    data: [],
    pagination: {
      current: 1,
      pageSize: 20,
    },
    search: "",
    tableLoading: false,
    statsLoading: false,
    stats: {
      total: "0",
      volume: "0",
      purchases: "0",
      sales: "0",
    },
    graphData: [],
    summary: "90",
    transactionType: "",
  };

  componentDidMount() {
    const { pagination } = this.state;
    this.fetch({ pagination });
  }

  handleTableChange = (pagination: any) => {
    this.fetch({
      pagination,
      search: this.state.search,
      transactionType: this.state.transactionType,
      summary: this.state.summary,
    });
  };

  handleSearch = (search: string) => {
    this.setState({ search });
    this.fetch({
      search,
      pagination: this.state.pagination,
      transactionType: this.state.transactionType,
      summary: this.state.summary,
    });
  };

  handleTransactionTypeFilter = (filterInput: any) => {
    this.setState({
      transactionType: filterInput.key,
    });
    this.fetch({
      pagination: this.state.pagination,
      search: this.state.search,
      transactionType: filterInput.key,
      summary: this.state.summary,
    });
  };

  handleSummaryMenuClick = (e: any) => {
    this.setState({
      summary: e.key,
    });
    this.fetch({
      pagination: this.state.pagination,
      search: this.state.search,
      transactionType: this.state.transactionType,
      summary: e.key,
    });
  };

  fetch = (params: any = {}) => {
    this.setState({ tableLoading: true, statsLoading: true });
    axios.get("http://127.0.0.1:7071/api/get_current_stocks_data", {params: getURLParams(params)
})
  .then(response => {
    const data = response.data;
    console.log(data);
    this.setState({
      tableLoading: false,
      data: data.results,
      pagination: {
        ...params.pagination,
        total: 10 - params.pagination.pageSize,
      },
    });
  })
  .catch(error => {
    console.error('Error:', error);
  }).then(() => {
      axios.get("http://127.0.0.1:7071/api/get_current_stocks_data")
      .then(response => {
        const data = response.data;
        this.setState({
          statsLoading: false,
          stats: {
            volume: data.totalVolume,
            total: data.totalMarketCap,
            purchases: data.results[0].purchases,
            sales: data.results[0].sales,
          },
          graphData: JSON.parse(data.graphData),
        });
        console.log(data.graphData)
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });
  };

  render() {
    const { data, pagination, tableLoading, statsLoading, stats, graphData, summary } = this.state;
    const CustomYAxisTick = (props: any) => {
      const { x, y, payload } = props;
      return (
        <g transform={`translate(${x},${y})`}>
          <text
            x={0}
            y={0}
            dy={16}
            textAnchor="end"
            fill="#666"
            transform="rotate(-35)"
          >
            {payload.value.toFixed(2)}
          </text>
        </g>
      );
    };
    console.log(graphData);
    return (
      <Layout style={{ marginRight: 0, minHeight: 1000 }}>
        <Content>

          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <Row justify="space-between" gutter={[16, 16]} style={{ margin: 30 }}>
              <Col xs={24} xl={8}>
                <Card hoverable title="Volume Total" className="smooth-card" loading={statsLoading}>
                  <h1 style={{ fontSize: '30px' }}>{numeral(stats.volume).format('0.[00]a').toUpperCase()}</h1>
                  <p style={{ bottom: 0, margin: 0 }}>Volume Total</p>
                </Card>
              </Col>
              <Col xs={24} xl={8}>
                <Card hoverable title="Valor de Mercado Total" className="smooth-card" loading={statsLoading}>
                  <h1 style={{ fontSize: '30px' }}>${ numeral(stats.total).format('0.[00]a').toUpperCase()}</h1>
                  <p style={{ bottom: 0, margin: 0 }}>Valor de Mercado Total</p>
                </Card>
              </Col>
            </Row>
          </div>
          {
          graphData ? 
          <div style={{ marginBottom: 20 }}>
            {/*<!-- make this row put components justify space between */}
            
            <Row justify="space-between" gutter={[16, 16]} style={{ margin: 20, padding: 10}}>
              <Card hoverable title="META - Preço da Ação" className="smooth-card" loading={statsLoading}>
                  <LineChart width={500} height={300} data={graphData}>
                    <XAxis dataKey="x" />
                    <YAxis tick={<CustomYAxisTick />} domain={['dataMin - 5', 'dataMax + 5']} />
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="META" stroke="#8884d8" />
                    <Tooltip />
                    <Legend />
                  </LineChart>
              </Card>
              <Card hoverable title="AMAZON - Preço da Ação" className="smooth-card" loading={statsLoading}>
                  <LineChart width={500} height={300} data={graphData}>
                    <XAxis dataKey="x" />
                    <YAxis tick={<CustomYAxisTick />} domain={['dataMin - 5', 'dataMax + 5']} />
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="AMZN" stroke="#8884d8" />
                    <Tooltip />
                    <Legend />
                  </LineChart>
              </Card>
            </Row>
            <Row justify="space-between" gutter={[16, 16]} style={{ margin: 20, padding: 10 }}>
              <Card hoverable title="APPLE - Preço da Ação" className="smooth-card" loading={statsLoading}>
                  <LineChart width={500} height={300} data={graphData}>
                    <XAxis dataKey="x"/>
                    <YAxis tick={<CustomYAxisTick />} domain={['dataMin - 5', 'dataMax + 5']} />
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="AAPL" stroke="#8884d8" />
                    <Tooltip />
                    <Legend />
                  </LineChart>
              </Card>
              <Card hoverable title="NETFLIX - Preço da Ação" className="smooth-card" loading={statsLoading}>
                  <LineChart width={500} height={300} data={graphData}>
                    <XAxis dataKey="x"/>
                    <YAxis tick={<CustomYAxisTick />} domain={['dataMin - 5', 'dataMax + 5']} />
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="NFLX" stroke="#8884d8" />
                    <Tooltip />
                    <Legend />
                  </LineChart>
              </Card>
            </Row>
            <Row justify="center" gutter={[16, 16]} style={{ margin: 20, padding: 10 }}>
              <Card hoverable title="GOOGLE - Preço da Ação" className="smooth-card" loading={statsLoading}>
                  <LineChart width={500} height={300} data={graphData}>
                    <XAxis dataKey="x" />
                    <YAxis tick={<CustomYAxisTick />} domain={['dataMin - 5', 'dataMax + 5']} />
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="GOOGL" stroke="#8884d8" />
                    <Tooltip />
                    <Legend />
                  </LineChart>
              </Card>
            </Row>
          </div> : <p>Data is null or undefined</p>}
          

          <Row
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
          </Row>

          <Table
            columns={columns}
            dataSource={data}
            pagination={pagination}
            loading={tableLoading}
            onChange={this.handleTableChange}
            scroll={{ x: 1500, y: "48vh" }}
            style={{ margin: 20, boxShadow: "1px 1px 1px 1px #ccc" }}
          />
        </Content>
      </Layout>
    );
  }
}

export default Home;