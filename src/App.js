
import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import PieHooks from "./charts/PieHooks";
import IndexHooks from "./charts/Indexchart";

import BarHooks from "./charts/BarHooks";
import StackedAreaHooks from "./charts/StackedAreaHooks";
import LineHooks1 from "./charts/LineHooks1";
import ScatterHooks from "./charts/ScatterHooks";
import Table from "./Tables"
import { Container, Row, Col, Card } from 'react-bootstrap'
import './App.css';

function App() {
  const generateData = (value, length = 5) =>
    d3.range(length).map((item, index) => ({
      date: index,
      value: value === null || value === undefined ? Math.random() * 100 : value
    }));

  const [data, setData] = useState(generateData(0));
  const [barData, setBarData] = useState([25, 30, 45, 60, 10, 65, 75]);
  const lineData = [
    { date: "2013-04-28", value: 135.98 },
    { date: "2013-04-28", value: 135.98 },
    { date: "2013-04-29", value: 147.49 },
    { date: "2013-04-30", value: 146.93 },
    { date: "2013-05-01", value: 139.89 },
    { date: "2013-05-02", value: 125.6 },
    { date: "2013-05-03", value: 108.13 },
    { date: "2013-05-04", value: 115 },
    { date: "2013-05-05", value: 118.8 },
    { date: "2013-05-06", value: 124.66 }
  ];

  const keys = ["🥑", "🍌", "🍆"];

  const colors = {
    "🥑": "green",
    "🍌": "orange",
    "🍆": "purple"
  };
  const stackedAreaData = [
    {
      year: 1980,
      "🥑": 10,
      "🍌": 20,
      "🍆": 30
    },
    {
      year: 1990,
      "🥑": 20,
      "🍌": 40,
      "🍆": 60
    },
    {
      year: 4000,
      "🥑": 30,
      "🍌": 45,
      "🍆": 80
    },
    {
      year: 2010,
      "🥑": 40,
      "🍌": 60,
      "🍆": 100
    },
    {
      year: 2020,
      "🥑": 50,
      "🍌": 80,
      "🍆": 120
    }
  ];
  const [scatterData, setScatterData] = useState([
    [0, 3],
    [5, 13],
    [10, 22],
    [15, 36],
    [20, 48],
    [25, 59],
    [30, 77],
    [35, 85],
    [40, 95],
    [45, 105],
    [50, 120],
    [55, 150],
    [60, 147],
    [65, 168],
    [70, 176],
    [75, 188],
    [80, 199],
    [85, 213],
    [90, 222],
    [95, 236],
    [100, 249]
  ]);
  const indexChartData = [
    {
      name: "AAPL",
      date: '2013-05-13',
      value: 1
    },
    {
      name: "AAPL",
      date: '2013-05-14',
      value: 63
    },
    {
      name: "AAPL",
      date: '2013-05-15',
      value: 12
    },
    {
      name: "AAPL",
      date: '2013-05-16',
      value: 162
    },
    {
      date: '13-05-2013',
      name: "AMZN",
      value: 2
    },
    {
      date: '14-05-2013',
      name: "AMZN",
      value: 6
    },
    {
      date: '15-05-2013',
      name: "AMZN",
      value: 14
    },
    {
      date: '16-05-2013',
      name: "AMZN",
      value: 6
    },

    {
      date: '13-05-2013',
      name: "MSFT",
      value: 24
    },
    {
      date: '14-05-2013',
      name: "MSFT",
      value: 124
    },
    {
      date: '15-05-2013',
      name: "MSFT",
      value: 224
    },
    {
      date: '16-05-2013',
      name: "MSFT",
      value: 324
    }
  ];

  const changeData = () => {
    setData(generateData());
  };

  useEffect(() => {
    setData(generateData());
  }, [!data]);

  return (
    <div className="App">
      <Container>
        <Row>
          <Col sm={12} md={12} mb={4}>
            <Card>
              <Table />
            </Card>
          </Col>
        </Row>

        <Row>
          <Col sm={12} md={6}>
            <Card>
              <Card.Header>Pie Chart</Card.Header>
              <PieHooks
                data={data}
                width={400}
                height={400}
                innerRadius={60}
                outerRadius={100}
              />
            </Card>
          </Col>
          <Col sm={12} md={6}>
            <Card>

              <Card.Header>Index Chart</Card.Header>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <IndexHooks data={indexChartData} width={300} height={400} />
              </div>
            </Card>

          </Col>
        </Row>

        <Row>
          <Col sm={12} md={6}>
            <Card>

              <Card.Header>Bar Chart</Card.Header>
              <BarHooks data={barData} width={400} height={400} />
            </Card>

          </Col>
          <Col sm={12} md={6}>
            <Card>

              <Card.Header>Line Chart</Card.Header>
              <LineHooks1 data={lineData} width={400} height={400} />
            </Card>

          </Col>
        </Row>

        <Row>
          <Col sm={12} md={6}>
            <Card>

              <Card.Header>Stacked Area Chart</Card.Header>
              <StackedAreaHooks
                data={stackedAreaData}
                width={400}
                height={400}
                keys={keys}
                colors={colors}
              />
            </Card>

          </Col>
          <Col sm={12} md={6}>
            <Card>

              <Card.Header>Scatter Plot</Card.Header>
              <ScatterHooks
                data={scatterData}
                width={400}
                height={400}
                keys={keys}
                colors={colors}
              />
            </Card>

          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
