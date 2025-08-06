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
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import Avatar from 'react-avatar';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
var timeZone = '';
export default class ConciergeCommission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: null, // Initial state for the selected date
   
    }

  }

  handleDateChange = (date) => {
    this.setState({ selectedDate: date }); // Update state when a new date is selected
  };

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
  }


  componentWillUnmount() {
    document.body.classList.remove('hide-overflow-hidden');
  }




  render() {

    const columns = [
      {
        name: "",
        label: "",
        options: {
          customBodyRender: (value) => (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src="https://cdn.superme.al/s/butler/images/000/062/000062445_IMG_0126.JPG"
                alt="profile"
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              />
                   {/* <Avatar className="header-avatar" name={"Imran Arif"} round={true} size="40" textSizeRatio={2} /> */}
              <span>{value}</span>
            </div>
          ),
        },
      },
      { name: "Total Orders", label: "Total Orders" },
      { name: "Total Value", label: "Total Value" },
      { name: "Commission", label: "Commission" },
    ];
    const data = [
      ["Ali Zaman", "22", "22", "$ 18.00"],
      ["Imran Arif", "12", "12", "$12.00"],
      ["Afroz Ahmed", "9", "9", "$8.00"],
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
      responsive: window.innerWidth < 700 ? "scroll" : "",
      textLabels: {
        body: {
          noMatch: this.state.isLoading ? <span className="comment-loader"><Loader type="Oval" color="#000" height={22} width={22} /></span> : "Sorry, no matching records found",
        }
      },

    }

   
  

    return (
      <div className='card conc-commi-wrap' id='header'>
        <div className="d-flex align-items-center mb-2 p-l-r card-body tailwind-date-picker-main">
          <h3 className="card-title card-new-title ml-0 mb-0 pl-0 mr-4">Concierge Commission</h3>
          <div className='conc-date-selection d-flex align-items-center'>
            <a class="add-cat-btn left-btn ml-0"><FaChevronLeft /></a>
            <DatePicker
              selected={this.state.selectedDate} // Bind to state
              onChange={this.handleDateChange} // Update state on change
              dateFormat="MM/yyyy" // Display format for month and year only
              showMonthYearPicker // Enables the month/year picker
              placeholderText="Select Month & Year" // Placeholder text for the input
              className="form-control" // Add the form-control class to style the input
            />
            <a class="add-cat-btn right-btn ml-0 mr-2"> <FaChevronRight /></a>
          </div>
        </div>

        <div class="card-body">

               <div className='conc-commi-mui-t mui-search-open'>
                      <MUIDataTable
                        // title={"Employee List"}
                        // data={this.state.histroyComplaints}
                        columns={columns}
                        options={options}
                        data={data}
                      />
                      </div>
            {/* <div className='commision-u-list'>
              <div className='commision-u-list-inner'>
                <div className='comm-user-im'>
                <img className="" src="https://cdn.superme.al/s/butler/images/000/062/000062445_IMG_0126.JPG" />
                </div>
                <div className='comm-u-info-p'>
                <div className='comm-u-info'>
                  <span className='comm-u-n'>Name</span>
                  <span className='comm-u-n-v'>Ali Zaman</span>
                </div>
                <div className='comm-u-info'>
                  <span className='comm-u-n'>Total Orders</span>
                  <span className='comm-u-n-v'>22</span>
                </div>
                <div className='comm-u-info'>
                  <span className='comm-u-n'>Commission</span>
                  <span className='comm-u-n-v'>$ 18.00</span>
                </div>
                </div>
                </div>
                <div className='commision-u-list-inner'>
                <div className='comm-user-im'>
                <Avatar className="header-avatar" name={"Imran Arif"} round={"10px"} size="45" textSizeRatio={2} />
                </div>
                <div className='comm-u-info-p'>
                <div className='comm-u-info'>
                  <span className='comm-u-n'>Name</span>
                  <span className='comm-u-n-v'>Imran Arif</span>
                </div>
                <div className='comm-u-info'>
                  <span className='comm-u-n'>Total Orders</span>
                  <span className='comm-u-n-v'>12</span>
                </div>
                <div className='comm-u-info'>
                  <span className='comm-u-n'>Commission</span>
                  <span className='comm-u-n-v'>$ 12.00</span>
                </div>
                </div>
                </div>
                <div className='commision-u-list-inner'>
                <div className='comm-user-im'>
                <img className="" src="https://cdn-superme-test.s3.eu-west-1.amazonaws.com/s/butler/images/000/062/000062446_WhatsApp_Image_2025-01-07_at_3.24.19_PM.jpeg" />
                </div>
                <div className='comm-u-info-p'>
                <div className='comm-u-info'>
                  <span className='comm-u-n'>Name</span>
                  <span className='comm-u-n-v'>Afroz Ahmed</span>
                </div>
                <div className='comm-u-info'>
                  <span className='comm-u-n'>Total Orders</span>
                  <span className='comm-u-n-v'>9</span>
                </div>
                <div className='comm-u-info'>
                  <span className='comm-u-n'>Commission</span>
                  <span className='comm-u-n-v'>$ 8.00</span>
                </div>
                </div>
                </div>
            </div> */}
        </div>
        {/* <Modal isOpen={this.state.ComplaintDetail} toggle={() => this.ComplaintDetailModal()} className={this.props.className}>
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
        </Modal> */}
      </div>
    )
  }
}
