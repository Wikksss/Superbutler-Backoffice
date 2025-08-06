import React, { Component } from 'react';
import { Chart } from "react-google-charts";
import Loader from 'react-loader-spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import Constants from '../../helpers/Constants';
import * as EnterpriseService from '../../service/Enterprise';
import * as Utilities from '../../helpers/Utilities';
const $ = require("jquery");
const moment = require('moment-timezone');

class GoogleAnalytics extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showLoader: true,
            StartDate: this.props.StartDate,
            EndDate: this.props.EndDate,
           viewType: 'Graph',
      sessionViewType: "Country",
      analyticsPropertyId: "0",
      analyticsData: {},
      defaultAnalyticsData: {
    "totalActiveUsers": 0, "totalNewUsers": 0,  "totalSessions": 0,  "totalPageViews": 0,  "averageBounceRate": 0, "averageSessionDuration": 0,
    "dailyTrend": [],
    "pages": [],
    "countries": [],
    "browsers": [],
    "devices": []
     },
     visibleRecords: 7, // Initially show 10 records
     showAllRecords: false // Flag to toggle between showing all or just 10
   

}

    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
      this.state.userObject = userObj;
      this.state.analyticsPropertyId = userObj.EnterpriseRestaurant.RestaurantSettings.AnalyticsPropertyId
    }
    }

  loading = () => <div className="allorders-loader all-order-loader-new">
    <div className="loader-menu-inner">
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
      <div className="loading-label">Loading.....</div>
    </div>
  </div>

  formatNumberShort = (num) => {
    if (num === null || num === undefined) return 0;
    if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    return num;
  }

GetGoogleAnalyticsData = async () => {

    this.state.StartDate = this.props.StartDate;
    this.state.EndDate = this.props.EndDate;
    this.setState({showLoader: true});
    var data = await EnterpriseService.GetGoogleAnalytics(moment(this.state.StartDate).format("YYYY-MM-DD"), moment(this.state.EndDate).format("YYYY-MM-DD"), this.state.analyticsPropertyId);
    
    if (data != undefined && !data.HasError && data !== undefined) {
      
      this.setState({ analyticsData: data})
    } else 
    {
      this.setState({ analyticsData: this.state.defaultAnalyticsData})
    }

        this.setState({showLoader: false});
  }

    // Toggle between showing all or just 10 records
  handleToggleRecords = () => {
    this.setState(prevState => ({
      showAllRecords: !prevState.showAllRecords,
      visibleRecords: prevState.showAllRecords ? 10 : prevState.analyticsData.pages.length // Show 10 records if showing all, else show all
    }));
  }

  formatBounceRate = (rate) => {
    return (rate * 100).toFixed(1) + "%";
  }

  formatSessionDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.round(duration % 60);
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  }

   handleViewChange = (viewType) => {
    this.setState({ viewType });
  };

   handleSessionViewChange = (sessionViewType) => {
    this.setState({ sessionViewType });

  };

  renderTopPagesGraph = () => {
    const { analyticsData, showLoader } = this.state;

    if(showLoader) {
      return(<div>{this.loading()}</div>)
    }

     let data;
    if(analyticsData.dailyTrend.length === 0 ) {
      return(<div className='ana-nothing-wrap'> Nothing to Show</div>)
    } else 
    {
     data = [
      ["Page Path", "Page Views"],
      ...analyticsData.pages.map(page => [page.PagePath,  page.PageViews])
    ];

     var data1 = [
      ["Page Path", "Sessions"],
      ...analyticsData.pages.map(page => [page.PagePath,  page.Sessions])
    ];
  }
    return (
      
      <div>
      <Chart
            chartType="AreaChart"
            width="100%"
            height="400px"
            data={data}
            options={{
            //   legend: { position: "bottom" },
              legend: 'none',
              chartArea: { left: 70, right: 10, top: 20, bottom: 100 },
              hAxis: { textPosition: 'none' },
              vAxis: {
                // title: this.state.dailyDataByOrder ? "Number of Orders" : 'Amount',
                titleTextStyle: { italic: false, color: "#000", bold: true },
                format: '0',
              },
            //   colors: ['#670066', '#7F007F'],
            //colors: ['#1f77b4', '#ff7f0e'],
            }}
                  />

                  </div>
    );
  };

   renderTopPagesTable = () => {
    const { analyticsData, showLoader, visibleRecords, showAllRecords } = this.state;

    if (showLoader) {
      return (<div>{this.loading()}</div>);
    }

    if(analyticsData?.pages.length == 0 ) {
      return(<div className='ana-nothing-wrap'> Nothing to Show</div>)
    }

    var sortedPages = [];
    if (analyticsData?.pages != undefined && analyticsData?.pages.length > 0) {
      // Sort pages by PageViews in descending order
      sortedPages = analyticsData.pages.sort((a, b) => b.PageViews - a.PageViews);
    }

    // Slice the pages array to show only the top "visibleRecords" number of pages
    const pagesToShow = sortedPages.slice(0, visibleRecords);

    return (
      <div className="analytics-table-wrap px-4">
        <table className="analytics-table w-100">
          <thead>
            <tr>
              <th>Page Title</th>
              <th>Page Views</th>
            </tr>
          </thead>
          <tbody>
            {pagesToShow.map((page, index) => (
              <tr key={index}>
                <td style={{maxWidth: '450px'}}>{page.PageTitle}</td>
                <td style={{textAlign: 'center'}}>{this.formatNumberShort(page.PageViews)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Render "Load More" button if there are more records to show */}
        {pagesToShow.length > 0 && analyticsData?.pages.length > this.state.visibleRecords  && 
        
        (showAllRecords ? (
          <div className="load-more-wrap">
            <a onClick={this.handleToggleRecords} className="text-primary float-right font-14 mt-3 cursor-pointer">
              Show Less
            </a>
          </div>
        ) : (
          <div className="load-more-wrap">
            <a onClick={this.handleToggleRecords} className="text-primary float-right font-14 mt-3 cursor-pointer">
              Show More
            </a>
          </div>
        ))}
      </div>
    );
  };



//   renderTopPagesTable = () => {
//     const { analyticsData, showLoader } = this.state;

//     if(showLoader) {
//       return(<div>{this.loading()}</div>)
//     }
    
//     var sortedPages = [];
//     // sortedPages = analyticsData.pages.sort((a, b) => b.PageViews - a.PageViews);
//     if(analyticsData?.pages != undefined && analyticsData?.pages.length > 0 ) {
        
//         // Sort pages by PageViews in descending order
//         sortedPages =  analyticsData.pages.sort((a, b) => b.PageViews - a.PageViews);
//     }

//     return (
//       <div className="analytics-table-wrap px-4">
//         <table className="analytics-table w-100">
//           <thead>
//             <tr>
//               <th>Page Path</th>
//               {/* <th>Sessions</th> */}
//               <th>Page Views</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Object.keys(analyticsData).length > 0 && sortedPages.map((page, index) => (
//               <tr key={index}>
//                 <td>{page.PagePath}</td>
//                 {/* <td>{page.Sessions}</td> */}
//                 <td>{page.PageViews}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

  renderDailyUsersChart = () => {
  const { analyticsData } = this.state;

  if (Object.keys(analyticsData).length === 0) {
    return <div>{this.loading()}</div>;
  }

  let data;
  if (analyticsData.dailyTrend.length === 0) {
    return <div className='ana-nothing-wrap'> Nothing to Show</div>;
  } else {
    
    // Create data for the chart, converting the date from YYYYMMDD to MM/DD/YYYY format
    data = [
      ["Date", "Active Users", "New Users"], // Column Headers
      ...analyticsData.dailyTrend.map((entry) => [
        "",
        entry.ActiveUsers || 0, // Active Users
        entry.NewUsers || 0, // New Users
      ]),
    ];

  }

  return (
    <div>
      <Chart
        chartType="AreaChart"
        width="100%"
        height="400px"
        data={data}
        options={{
          legend: { position: "bottom" },
          chartArea: { left: 70, right: 10, top: 20, bottom: 100 },
          hAxis: {
            
            titleTextStyle: { italic: false, color: "#000", bold: true },
            slantedText: true, // Slanted x-axis labels for better readability
            slantedTextAngle: 45,
          },
          vAxis: {
            title: "Users",
            titleTextStyle: { italic: false, color: "#000", bold: true },
            format: "0",
          },
          colors: ['#670066', '#FF3399'], // Active Users in purple, New Users in pink
        }}
      />
    </div>
  );
};

  renderSessionsChart = (dataType) => {
  const { analyticsData } = this.state;

   if(Object.keys(analyticsData).length === 0 ) {
      return(<div>{this.loading()}</div>)
    }

     let data;
    if(analyticsData.dailyTrend.length === 0 ) {
      return(<div className='ana-nothing-wrap'> Nothing to Show</div>)
    } else 

    {
      
  // Dynamically choose the data source based on the `dataType`
  switch (dataType.toLocaleLowerCase()) {
    case "country":
      data = [
        ["Country", "Sessions"],
        ...analyticsData.countries.map(country => [country.Country, country.Sessions])
      ];
      break;

    case "browser":
      data = [
        ["Browser", "Sessions"],
        ...analyticsData.browsers.map(browser => [browser.Browser, browser.Sessions])
      ];
      break;

    case "device":
      data = [
        ["Device Category", "Sessions"],
        ...analyticsData.devices.map(device => [device.DeviceCategory, device.Sessions])
      ];
      break;

    default:
      data = [];
      break;
  }
  }

  return (
    
    <div>
    
    <Chart
      chartType="BarChart"
      width="100%"
      height="400px"
      data={data}
      options={{
        legend: 'none',
        chartArea: { width: '80%', height: '70%' },
        hAxis: { 
          minValue: 0,
        },
        vAxis: { 
          textStyle: { color: "#000", fontSize: 12 },
        },
        colors: ['#670066']
      }}
    />

    </div>
  );
};

  componentWillReceiveProps(props) {
    var date = moment(this.props.StartDate);
   if (this.props.StartDate !== this.state.StartDate || this.props.EndDate !== this.state.EndDate) {
      this.GetGoogleAnalyticsData();
    }
  }


  componentDidMount() {
    this.GetGoogleAnalyticsData();

  }

    render() {
        const { viewType, sessionViewType, analyticsData } = this.state;
        return(
       
            <div className='google-analytics-wrap'>
              <h3 className="card-new-title ml-0 mb-4 pl-0">Google Analytics</h3>
              <div className="analytics-total-wrap">
                <div className="analytics-r-label ">
                  <span className="top-label">Active Users</span>
                  <span className='top-value'>{Object.keys(analyticsData).length > 0 ? this.formatNumberShort(analyticsData.totalActiveUsers) : 0}</span>
                </div>
                <div className="analytics-r-label ">
                  <span className="top-label">New Users</span>
                  <span className='top-value'>{Object.keys(analyticsData).length > 0 ? this.formatNumberShort(analyticsData.totalNewUsers) : 0}</span>
                </div>
                <div className="analytics-r-label ">
                  <span className="top-label">Total Sessions</span>
                  <span className='top-value'>{Object.keys(analyticsData).length > 0 ? this.formatNumberShort(analyticsData.totalSessions) : 0}</span>
                </div>
                <div className="analytics-r-label">
                  <span className="top-label">Total Page Views</span>
                  <span className='top-value'>{Object.keys(analyticsData).length > 0 ? this.formatNumberShort(analyticsData.totalPageViews) : 0}</span>
                </div>
                <div className="analytics-r-label">
                  <span className="top-label">Bounce Rate </span>
                  <span className='top-value'>{Object.keys(analyticsData).length > 0 ? this.formatNumberShort(this.formatBounceRate(analyticsData.averageBounceRate)) : "0%"}</span>
                </div>
                <div className="analytics-r-label">
                  <span className="top-label">Session Duration </span>
                  <span  className='top-value'>{Object.keys(analyticsData).length > 0 ? this.formatNumberShort(this.formatSessionDuration(analyticsData.averageSessionDuration)) : "0%"}</span>
                </div>
              </div>
              <div className='analytics-grid-wrap'>
                              <div className='ana-grid-r high-demand-wrap mb-5 px-0'>
                 <div className='mb-3 d-flex align-items-center px-4'>
                  <span className="d-flex font-16 bold mr-4">Daily Users</span>

                  {/* <div className='iten-d-down top-10-d-down'>
                    <Dropdown>
                      <Dropdown.Toggle id="dropdown-basic">
                        <div className='d-flex assign-text-img align-items-center justify-content-between w-100'>
                          <span className='mr-2'>By {sessionViewType}</span>
                          <span className='theme-d-wrap'></span>
                        </div>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => this.handleSessionViewChange('Country')}>
                          <div className="orderlink-wraper my-0">
                            <span className="button-link"> By Country</span>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => this.handleSessionViewChange('Browser')}>
                          <div className="orderlink-wraper my-0">
                            <span className="button-link"> By Browser </span>
                          </div>
                        </Dropdown.Item>
                         <Dropdown.Item onClick={() => this.handleSessionViewChange('Device')}>
                          <div className="orderlink-wraper my-0">
                            <span className="button-link"> By Device </span>
                          </div>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div> */}
                </div>
                  {this.renderDailyUsersChart()}

              </div>
              <div className="high-demand-wrap mb-5 px-0 ana-grid-l">
                <div className='mb-3 d-flex align-items-center px-4'>
                  <span className="d-flex font-16 bold mr-4">Top Pages</span>
                  {/* <div className='iten-d-down top-10-d-down'>
                    <Dropdown>
                      <Dropdown.Toggle id="dropdown-basic">
                        <div className='d-flex assign-text-img align-items-center justify-content-between w-100'>
                          <span className='mr-2'>By {viewType}</span>
                          <span className='theme-d-wrap'></span>
                        </div>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => this.handleViewChange('Graph')}>
                          <div className="orderlink-wraper my-0">
                            <span className="button-link"> By Graph</span>
                          </div>
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => this.handleViewChange('Table')}>
                          <div className="orderlink-wraper my-0">
                            <span className="button-link"> By Table </span>
                          </div>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div> */}
                </div>
                {/* { Object.keys(analyticsData).length > 0 && 
                viewType.toLocaleLowerCase() == 'graph' ? this.renderTopPagesGraph() : this.renderTopPagesTable() 
                } */}
                 { this.renderTopPagesTable() }
              </div>

                </div>
            </div>
  
        )
    }
}

export default GoogleAnalytics