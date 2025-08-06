import React, { Component } from 'react'
import MUIDataTable from "mui-datatables";
import Datepicker from "react-tailwindcss-datepicker";
import * as ComplaintService from '../../service/Complaint'
import Constants from '../../helpers/Constants';
import * as Utilities from '../../helpers/Utilities'
import moment from 'moment';
import GlobalData from '../../helpers/GlobalData';
import Config from '../../helpers/Config';
import Loader from 'react-loader-spinner';
import Labels from '../../containers/language/labels';
import Dropdown from 'react-bootstrap/Dropdown';
import { FormGroup, Button, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
var timeZone = '';
export default class PastComplaints extends Component {
  constructor(props) {
    super(props);
    this.state = {

      value: { },
      startDate: moment(),
      endDate: moment(),
      histroyComplaints: [],
      pageNumber: 1,
      pageSize: GlobalData.restaurants_data.Supermeal_dev.PageSize,
      showLoader: true,
      isLoading: true,
      TotalComplaint: 0,
      TotalResolved: 0,
      ComplaintDetail: false,
      complainDetail:{},
      complainHistory:[],
      averageTime:0,
      dropdownOpen: false,
      sinceStartDate: new Date(),
    }

    this.state.startDate = moment().add(-30, 'day').format('YYYY-MM-DD 00:00:00');
    this.state.endDate = moment().format('YYYY-MM-DD 23:59:59');

    this.state.value = {startDate: new Date(this.state.startDate),  endDate: new Date(),}
    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
      timeZone = Config.Setting.timeZone;

      if (userObj.EnterpriseRestaurant.Country != null) {
        timeZone = userObj.EnterpriseRestaurant.Country.TimeZone;
      }

      if(userObj.Enterprise.FirstRequestDate != undefined)
        {
          this.state.sinceStartDate = userObj.Enterprise.FirstRequestDate;
        }

        console.log("sinceStartDate: ", new Date(this.state.sinceStartDate));
    }

    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.SELECTED_PAST_COMPLAINTS_STATUS))) {

      var selectedDate = localStorage.getItem(Constants.Session.SELECTED_PAST_COMPLAINTS_STATUS)
      var dateArray = selectedDate.split('|');
      this.state.startDate = dateArray[0];
      this.state.endDate = dateArray[1];
      var value = JSON.parse(dateArray[2].replace(/\\/gi, ""));
      var selectedDates = {startDate: new Date(value.startDate), endDate: new Date(value.endDate)}
      this.state.value = selectedDates;

    }

  }


  GetHistroyComplaints = async () => {

    let data = await ComplaintService.GetHistory(this.state.startDate, this.state.endDate, this.state.pageNumber, this.state.pageSize);
    var histroyComplaints = [];
    var allHistoryComplaints = []

    if (!data.HasError) {
      if (data.Dictionary.ComplaintHistory != undefined && !Utilities.stringIsEmpty(data.Dictionary.ComplaintHistory)) {
        histroyComplaints = JSON.parse(data.Dictionary.ComplaintHistory)

      }

      // if (histroyComplaints.length > 0) allHistoryComplaints.push(...this.state.histroyComplaints, ...histroyComplaints)
      // else allHistoryComplaints = this.state.histroyComplaints;
      allHistoryComplaints = histroyComplaints;

      if (this.state.pageNumber == 1 && allHistoryComplaints.length > 0) {

        this.state.TotalComplaint = allHistoryComplaints[0].TotalComplaint
        this.state.TotalResolved = allHistoryComplaints[0].TotalResolved
      } else 
      {
        this.state.TotalComplaint = this.state.TotalResolved = 0;
        
      }
      this.setState({ histroyComplaints: allHistoryComplaints, filteredComplaints: allHistoryComplaints, bottomLoader: false, isLoading: false, showLoader: false })
    }
  }

  handleValueChange = (newValue) => {

    var startDateFormat = 'YYYY-MM-DD 00:00:00';
    var endDateFomat = 'YYYY-MM-DD 23:59:59';


    if(newValue.startDate == null || newValue.startDate == undefined) 
      {
        this.setState({value: {startDate: this.state.startDate,  endDate: this.state.endDate}});
        return;
      }

    this.setState({
      startDate: moment(newValue.startDate).format(startDateFormat),
      endDate: moment(newValue.endDate).format(endDateFomat),
      value: newValue,
    }, () => {

      localStorage.setItem(Constants.Session.SELECTED_PAST_COMPLAINTS_STATUS, `${this.state.startDate}|${this.state.endDate}|${JSON.stringify(newValue)}`)
      this.state.pageNumber = 1;
      this.state.histroyComplaints = [];
      this.GetHistroyComplaints();
    })



  }
  componentWillMount() {
    document.body.classList.add('hide-overflow-hidden');

  }

  componentDidMount() {
    setTimeout(() => {
      const searchInput = document.querySelector('input[placeholder="Search"]');
      if (searchInput) {
        searchInput.blur();
      }
    }, 100);
    // document.addEventListener('scroll', this.trackScrolling);
    this.GetHistroyComplaints();
  }


  isBottom(el) {

    if (el != null) return el.getBoundingClientRect().bottom <= window.innerHeight + 5;
    else return null;
  }

  trackScrolling = () => {
    const wrappedElement = document.getElementById('header');

    // console.log("this.state.countAll", this.state.TotalComplaint);

    if (this.isBottom(wrappedElement) && this.state.histroyComplaints.length < this.state.TotalResolved) {
      this.setState(
        {
          pageNumber: this.state.pageNumber += 1,
          bottomLoader: true
        }, () => {
          this.GetHistroyComplaints()
        }
      )

    }
  }


  componentWillUnmount() {
    document.body.classList.remove('hide-overflow-hidden');
  }

  ComplaintDetailModal(id) {
    this.setState({
      ComplaintDetail: !this.state.ComplaintDetail,
    })
    if(id != undefined) this.GetComplaintDetail(id)
  }

  GetComplaintDetail = async (id) => {

    let data = await ComplaintService.GetComplainDetail(id);
    // console.log('data', data)
    if (Object.keys(data).length > 0) {
      this.setState({ complainDetail: data.ComplaintDetails, complainHistory: data.ComplaintDetailStatusHistory, averageTime: data.ComplaintDetails?.AverageJobTime })
    }
  }

  GetOverDue = (reportedOn, resolveOn, averageTime) => {
    // console.log('averageTime', this.state.averageTime)
    var time =  Utilities.GetWaitingTime(reportedOn, averageTime, timeZone, resolveOn);
    return time != '' ? time + ' Over due' : 'Yes'
}

onChangePage = (pageNo) => {

  this.setState({isLoading: true});
  this.state.pageNumber = pageNo + 1;
  this.GetHistroyComplaints()
}

onChangeRowsPerPage = (pageSize) => {

  this.state.pageSize = pageSize;
  var totalPages = this.state.TotalComplaint/pageSize

  if(this.state.pageNumber > totalPages){
  
    this.state.pageNumber = totalPages > Number(totalPages.toFixed(0)) ? Number(totalPages.toFixed(0)) + 1 : totalPages;
  }

  this.GetHistroyComplaints();

}


toggleDropDown = () => this.setState({ dropdownOpen: !this.state.dropdownOpen });


  render() {


    const columns = [
      {
        name: "Id",
        label: "No.",
        options: {
          sort: false,
          filter: true,

          customBodyRender: (value, tableMeta, updateValue) => (
            <div>
              <span>{value}</span>
            </div>
          )
        }
      },
      {
        name: "ReportedOn",
        label: "Reported On",
        options: {
          sort: false,
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <div className='cursor-pointer'>
              <span onClick={()=>this.ComplaintDetailModal(this.state.histroyComplaints[tableMeta.currentTableData[tableMeta.rowIndex].index].Id, this.state.histroyComplaints[tableMeta.currentTableData[tableMeta.rowIndex].index].AverageJobTime)}>{Utilities.getDateByZone(moment(value).format("YYYY-MM-DDTHH:mm:ss"), "DD MMM YYYY hh:mm a", timeZone)}</span>
            </div>
          )
        }
      },
      {
        name: "RoomNumber",
        label: "Room No.",
        options: {
          sort: false,
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <div>
              <span>{value}</span>
            </div>
          )
        }
      },
      {
        name: "Description",
        label: "Request",
        options: {
          sort: false,
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <div>
              <span>{value}</span>  </div>
          )
        }
      },
      {
        name: "GuestName",
        label: "Guest Name",
        options: {
          sort: false,
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <div>
              <span>{value}</span>         </div>
          )
        }
      },
      {
        name: "AssignedTo",
        label: "Assigned To",
        options: {
          sort: false,
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <div>
              <span>{value}</span>         </div>
          )
        }
      },
      {
        name: "Status",
        label: "Status",
        options: {
          sort: false,
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <div>
              <span className={`confirmed-mui-c ${this.state.histroyComplaints[tableMeta.currentTableData[tableMeta.rowIndex].index].Color}`}> <span>{value}</span></span>

              {/* <span className='confirmed-mui-c'> Confirmed</span> */}
              {/* <span className='new-mui-c'>New</span> */}
              {/* <span className='completed-mui-c'> Completed</span> */}
              {/* <span className='ready-mui-c'> Ready</span> */}
              {/* <span className='cancelled-mui-c'> Cancelled</span> */}


            </div>
          )
        }
      },
      {
        name: "ResolvedOn",
        label: "Resolved on",
        options: {
          sort: false,
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <div>
              {!Utilities.stringIsEmpty(value) ? <span>{Utilities.getDateByZone(moment(value).format("YYYY-MM-DDTHH:mm:ss"), "DD MMM YYYY hh:mm a", timeZone)}</span> : '-'}

            </div>
          )
        }
      },
      {
        name: "Escalations",
        label: "Escalations",
        options: {
          sort: false,
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <div>
              <span>{value}</span>
            </div>
          )
        }
      },

    ];


    const options = {
      searchOpen: false,
      searchAlwaysOpen: true,
      searchPlaceholder: "Search",
      filterType: '',
      searchOpen: false,
      selectableRowsHideCheckboxes: true,
      selectableRowsOnClick: false,
      sort: false,
      sortFilterList: false,
      pagination: true,
      serverSide: true,
      rowsPerPage: this.state.pageSize,
      rowsPerPageOptions: [100, 200, 500],
      print: false,
      download: false,
      filter: false,
      viewColumns: false,
      count: this.state.TotalComplaint,
      responsive: window.innerWidth < 700 ? "scroll" : "",
      textLabels: {
        body: {
          noMatch: this.state.isLoading ? <span className="comment-loader"><Loader type="Oval" color="#000" height={22} width={22} /></span> : "Sorry, no matching records found",
        }
      },
      onChangePage: this.onChangePage,
      onChangeRowsPerPage: this.onChangeRowsPerPage,

    }
  

    return (
      <div className='card' id='header'>
        <div className="d-flex align-items-center mb-2 p-l-r card-body tailwind-date-picker-main">
          <h3 className="card-title card-new-title ml-0 mb-0 pl-0">{Labels.Past_Complaints}</h3>
          <div className='tailwind-date-picker-wrap  tailwind ml-5' style={{ width: 280 }}>
            <Datepicker
              showShortcuts={true}
              
              configs={{
                shortcuts: {
                  today: {
                    text: "Today",
                    period: {
                      start: new Date(),
                      end: new Date(),
                    },
                  },
                  yesterday: {
                    text: "Yesterday",
                    period: {
                      start: new Date(new Date().setDate(new Date().getDate() - 1)),
                      end: new Date(new Date().setDate(new Date().getDate() - 1)),
                    },
                  },
                  last7Days: {
                    text: "Last 7 days",
                    period: {
                      start: new Date(new Date().setDate(new Date().getDate() - 7)),
                      end: new Date(new Date().setDate(new Date().getDate() - 1)),
                    },
                  },
                  last30Days: {
                    text: "Last 30 days",
                    period: {
                      start: new Date(new Date().setDate(new Date().getDate() - 30)),
                      end: new Date(new Date().setDate(new Date().getDate() - 1)),
                    },
                  },
                  thisMonth: {
                    text: "This Month",
                    period: {
                      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                      end: new Date(),
                    },
                  },
                  lastMonth: {
                    text: "Last Month",
                    period: {
                      start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
                      end: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
                    },
                  },
                  last6Months: {
                    text: "Last 6 Months",
                    period: {
                      start: new Date(new Date().setMonth(new Date().getMonth() - 6)),
                      end: new Date(),
                    },
                  },
                  thisYear: {
                    text: "This Year",
                    period: {
                      start: new Date(new Date().getFullYear(), 0, 1),
                      end: new Date(),
                    },
                  },
                  lastYear: {
                    text: "Last Year",
                    period: {
                      start: new Date(new Date().getFullYear() - 1, 0, 1),
                      end: new Date(new Date().getFullYear() - 1, 11, 31),
                    },
                  },
                  ...(new Date(this.state.sinceStartDate) !== new Date()
                  ? {
                      lifetime: {
                        text: "Lifetime",
                        period: {
                          start: new Date(moment(this.state.sinceStartDate)), 
                          end: new Date(),
                        },
                      },
                    }
                  : {}),
                },
                footer: {
                  cancel: "Cancel",
                  apply: "Apply",
                },
              }}
              
              value={this.state.value}
              onChange={(e) => this.handleValueChange(e)}
              displayFormat={"DD MMM YYYY"}
              readOnly={true}
            />
          </div>

        </div>

        <div class="card-body">
          <div className="order-r mb-4 justify-content-start">
            <div className="total-r-label "><span className="t-label">{Labels.Complaints}</span><span>{this.state.TotalComplaint}</span></div>
            <div className="total-r-label r "><span className="t-label">Resolved</span><span>{this.state.TotalResolved}</span></div>
            {/* <div className="total-r-label "><span className="t-label">Overdue</span><span>80</span></div> */}

          </div>


          <div className='past-comp-mui-wrap mui-search-open'>
            <MUIDataTable
              // title={"Employee List"}
              data={this.state.histroyComplaints}
              columns={columns}
              options={options}
            />

            {/* {
              this.state.bottomLoader &&
              <div className='page-end-loader d-flex w-100 justify-content-center  mt-4'>
                <Loader type="Oval" color="#ed0000" height={30} width={30} />
              </div>
            }
            {
              this.state.histroyComplaints.length >= this.state.TotalResolved && this.state.histroyComplaints.length > 0 && this.state.histroyComplaints.length > this.state.pageSize &&
              <div className='page-end-loader d-flex w-100 justify-content-center mt-4'>
                <p>End of results</p>
              </div>
            } */}

          </div>
        </div>
        <Modal isOpen={this.state.ComplaintDetail} toggle={() => this.ComplaintDetailModal()} className={this.props.className}>
          <ModalHeader toggle={() => this.ComplaintDetailModal()} >{Labels.Complaint_Detail_Modal}</ModalHeader>
          <ModalBody className='Complaint-parent-detail-wrap'>

            <AvForm>
              {

                this.state.complainDetail != null && Object.keys(this.state.complainDetail).length > 0 &&
                <div className="ticket-issue bold flex-1 cursor-pointer font-16 mb-3">{this.state.complainDetail.Description}</div>
              }
              <div className='Complaint-modal-detail-wrap'>
                {
                  this.state.complainDetail != null && Object.keys(this.state.complainDetail).length > 0 &&
                  <div className='row flex-nowrap'>
                    <div className='col-md-12 mb-3'>
                      <div className="row mb-2 d-flex align-items-center flex-nowrap">
                        <label className="col-lg-4 fw-semibold text-muted mb-0">Status</label>
                        <div className="col-lg-8">
                          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown} className="padding-dropdown-complaint hide-arrow-status">
                            <Dropdown.Toggle variant="secondary" className={this.state.complainDetail.Color}> <div ><span className='ml-2'>{this.state.complainDetail.Status}</span></div>
                            </Dropdown.Toggle>
                          </Dropdown>
                        </div>
                      </div>
                      <div className="row mb-2 flex-nowrap">
                        <label className="col-lg-4 fw-semibold text-muted mb-0">Room No.</label>
                        <div className="col-lg-8">
                          <span className="fw-bold fs-6 text-gray-800">{this.state.complainDetail.RoomNumber}</span>
                        </div>
                      </div>

                      <div className="row mb-2 flex-nowrap">
                        <label className="col-lg-4 fw-semibold text-muted mb-0">Department</label>
                        <div className="col-lg-8">
                          <span className="fw-bold fs-6 text-gray-800">{this.state.complainDetail.Department}</span>
                        </div>
                      </div>
                      <div className="row mb-2 flex-nowrap">
                        <label className="col-lg-4 fw-semibold text-muted mb-0">Assigned to</label>
                        <div className="col-lg-8">
                          <span className="fw-bold fs-6 text-gray-800">{this.state.complainDetail.AssignedTo}</span>
                        </div>
                      </div>
                      <div className="row mb-2 flex-nowrap">
                        <label className="col-lg-4 fw-semibold text-muted mb-0">Resolved on time</label>
                        <div className="col-lg-8">
                          <span className="fw-bold fs-6 text-gray-800">{this.state.complainDetail.ResolvedOn != "" ? this.GetOverDue(this.state.complainDetail.ReportedOn, this.state.complainDetail.ResolvedOn, this.state.averageTime) : '-'}</span>
                        </div>
                      </div>
                      <div className="row mb-2 flex-nowrap">
                        <label className="col-lg-4 fw-semibold text-muted mb-0">Guest Name</label>
                        <div className="col-lg-8">
                          <span className="fw-bold fs-6 text-gray-800">{this.state.complainDetail.GuestName}</span>
                        </div>
                      </div>
                      <div className="row mb-2 flex-nowrap">
                        <label className="col-lg-4 fw-semibold text-muted mb-0">Reported on</label>
                        <div className="col-lg-8">
                          <span className="fw-bold fs-6 text-gray-800">{Utilities.getDateByZone(this.state.complainDetail.ReportedOn, 'DD MMM YYYY hh:mm a', timeZone)}</span>
                        </div>
                      </div>

                      <div className="row mb-2 flex-nowrap">
                        <label className="col-lg-4 fw-semibold text-muted mb-0">Resolved on</label>
                        <div className="col-lg-8">
                          <span className="fw-bold fs-6 text-gray-800">{this.state.complainDetail.ResolvedOn != "" ? Utilities.getDateByZone(this.state.complainDetail.ResolvedOn, 'DD MMM YYYY hh:mm a', timeZone) : '-'}</span>
                        </div>
                      </div>

                    </div>
                  </div>
                }
                {
                  this.state.complainHistory.length > 0 &&
                  <div className='Complaint-activity-wrap'>
                  <label for="productName" class="control-label  mb-3 ">Request Activity</label>
                  <div className='row'>
                    <div className='col-md-12 c-status-table' style={{height:"auto"}}>

                    <table className='w-100'>
                        <tr >
                        <th style={{width: '180px'}}>Time</th>
                            <th>Activity</th>
                        </tr>
                        {
                        this.state.complainHistory.map((v,i)=>(
                          <tr>
                      <td data-label="Status">{moment(v.DateTime).format('DD MMM YYYY hh:mma')}</td>
                      {i > 0 ? 
                      <td data-label="color">{v.Mode == 1 ? `Assigned to '${v.AssignedTo}'` : v.Mode == 2 ? `Request reassigned from ${v.PreviousAssignTo} to ${v.AssignedTo} ` : `Status changed to '${v.Status}'`}</td>
                      :
                      <td data-label="color">{"New request is reported."}</td>

                      }
                       </tr>
                        ))
                      }
                    </table>
                   
                      
                    </div>
                  </div>
                  </div>
                }
              </div>
            </AvForm>
          </ModalBody>
          <FormGroup className="modal-footer" >
            <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger"></label>
            </div>
            <div>
              <Button className='mr-2 text-dark' color="secondary" onClick={() => this.ComplaintDetailModal()}>Close</Button>
            </div>
          </FormGroup>
        </Modal>
      </div>
    )
  }
}
