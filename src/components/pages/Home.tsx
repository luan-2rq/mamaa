// @Author: Mohammed Al-Rasheed

// Purpose: Build out our main page which is the trades of the congress

// Imports
import React, { Component } from "react";
import Navbar from "../Navbar/Navbar";

import { DownOutlined, SlidersOutlined, DollarOutlined } from "@ant-design/icons";
import { Table, Tag, Card, Col, Row, Dropdown, Button, Layout, Menu } from "antd";

import axios from 'axios';

// Initilze that our content is equal to the layout
const { Content } = Layout;
// Initilze our columns
const columns = [
  {
    title: "Transaction Date",
    dataIndex: "transactionDate",
    key: "transactionDate",
  },
  {
    title: 'Asset Type',
    dataIndex: 'assetType',
    key: 'assetType',
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Transaction Type",
    key: "transactionType",
    dataIndex: "transactionType",
    render: (type: string) => (
      <Tag
        // if type has sale in it then color it red
        color={type.includes("Sale") ? "volcano" : "green"}
        key={type.includes("Full") ? "Sale" : type.includes("Partial") ? "Partial Sale" : "Purchase"}
      >
        {type.includes("Full") ? "Sale" : type.includes("Partial") ? "Partial Sale" : "Purchase"}
      </Tag>
    ),
  },
  {
    title: "Source",
    dataIndex: "ptrLink",
    key: "ptrLink",
    render: (link: string) => <a href={link}>Source</a>,
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
    axios.get("https://insiderunlocked.herokuapp.com/government/congress-trades/?format=json", {
    params: getURLParams(params)
  })
  .then(response => {
    const data = response.data;
    this.setState({
      tableLoading: false,
      data: data.results,
      pagination: {
        ...params.pagination,
        total: data.count - params.pagination.pageSize,
      },
    });
  })
  .catch(error => {
    console.error('Error:', error);
  }).then(() => {
      axios.get(`https://insiderunlocked.herokuapp.com/government/summary-stats/${this.state.summary}/?format=json`)
      .then(response => {
        const data = response.data;
        this.setState({
          statsLoading: false,
          stats: {
            volume: data.results[0].totalVolume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            total: data.results[0].total,
            purchases: data.results[0].purchases,
            sales: data.results[0].sales,
          },
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });
  };

  render() {
    const { data, pagination, tableLoading, statsLoading, stats, summary } = this.state;
    return (
      <Layout style={{ marginRight: 0, minHeight: 1000 }}>
        <Content>
          <Row className="headerSummaryDiv">
            <Dropdown className="Dropdown" overlay={
              <Menu onClick={this.handleSummaryMenuClick}>
                <Menu.Item key="30" icon={<SlidersOutlined />}>
                  Last 30 Days
                </Menu.Item>
                <Menu.Item key="60" icon={<SlidersOutlined />}>
                  Last 60 Days
                </Menu.Item>
                <Menu.Item key="90" icon={<SlidersOutlined />}>
                  Last 90 Days
                </Menu.Item>
                <Menu.Item key="120" icon={<SlidersOutlined />}>
                  Last 120 Days
                </Menu.Item>
              </Menu>
            }>
              <div style={{ marginTop: 3 }}>
                <Button>
                  Filter Summary Stats <DownOutlined />
                </Button>
              </div>
            </Dropdown>
          </Row>

          <div style={{ marginBottom: 20 }}>
            <Row gutter={[16, 16]} style={{ margin: 10 }}>
              <Col xs={24} xl={8}>
                <Card hoverable title="Number of Transactions" className="smooth-card" loading={statsLoading}>
                  <h1 style={{ fontSize: '30px' }}>{stats.total}</h1>
                  <p style={{ bottom: 0, margin: 0 }}>Total Number of Trades in Disclosure</p>
                </Card>
              </Col>
              <Col xs={24} xl={8}>
                <Card hoverable title="Total Trade Volume" className="smooth-card" loading={statsLoading}>
                  <h1 style={{ fontSize: '30px' }}>${stats.volume}</h1>
                  <p style={{ bottom: 0, margin: 0 }}>Combined Volume of Asset Sales + Purchases</p>
                </Card>
              </Col>
              <Col xs={24} xl={8}>
                <Card hoverable title="Trade Type Ratio" className="smooth-card" loading={statsLoading}>
                  <h1 style={{ fontSize: '30px' }}><span color='green'>{stats.purchases}</span>/<span color='red'>{stats.sales}</span></h1>
                  <p style={{ bottom: 0, margin: 0 }}>Purchases Trades / Sales Trades</p>
                </Card>
              </Col>
            </Row>
          </div>

          <Row
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Dropdown overlay={
              <Menu onClick={this.handleTransactionTypeFilter}>
                <Menu.Item key="" icon={<DollarOutlined />}>
                  All Transactions
                </Menu.Item>
                <Menu.Item key="Purchase" icon={<DollarOutlined />}>
                  Purchases
                </Menu.Item>
                <Menu.Item key="Sale (Full)" icon={<DollarOutlined />}>
                  Full Sales
                </Menu.Item>
                <Menu.Item key="Sale (Partial)" icon={<DollarOutlined />}>
                  Partial Sales
                </Menu.Item>
              </Menu>
            }>
              <div style={{ marginRight: 20, marginLeft: 20 }} >
                <Button>
                  Filter Transaction Type <DownOutlined />
                </Button>
              </div>
            </Dropdown>
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