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

      
    }

  }
  componentWillMount() {
    document.body.classList.add('hide-overflow-hidden');

  }

  componentDidMount() {
   
  }


  

  render() {


    


   
  

    return (
      <div className='card' id='header'>
        <div className="d-flex align-items-center mb-2 p-l-r card-body tailwind-date-picker-main">
          <h3 className="card-title card-new-title ml-0 mb-0 pl-0">Request Detail</h3>
          

        </div>

        <div class="card-body">
        <div className="ticket-issue bold flex-1 cursor-pointer font-16 mb-3">Ceiling fan dimmer switch not working</div>
        <div className="Complaint-modal-detail-wrap">
    <div className="row flex-nowrap">
        <div className="col-md-12 mb-5">
            <div className="row mb-2 d-flex align-items-center flex-nowrap">
              <label className="col-lg-4 fw-semibold text-muted mb-0">Status</label>
              <div className="col-lg-8">
                          <Dropdown isOpen={this.state.dropdownOpen} toggle={""} className="padding-dropdown-complaint hide-arrow-status">
                            <Dropdown.Toggle variant="secondary" className={"status-color-dark-cyan"}> <div ><span className='ml-2'>Pending</span></div>
                            </Dropdown.Toggle>
                          </Dropdown>
                        </div>
            </div>
            
            <div className="row mb-2 flex-nowrap">
                <label className="col-lg-4 fw-semibold text-muted mb-0">Room No.</label>
                <div className="col-lg-8"><span className="fw-bold fs-6 text-gray-800">33</span></div>
            </div>
            <div className="row mb-2 flex-nowrap">
                <label className="col-lg-4 fw-semibold text-muted mb-0">Department</label>
                <div className="col-lg-8"><span className="fw-bold fs-6 text-gray-800">Plumber</span></div>
            </div>
            <div className="row mb-2 flex-nowrap">
                <label className="col-lg-4 fw-semibold text-muted mb-0">Assigned to</label>
                <div className="col-lg-8"><span className="fw-bold fs-6 text-gray-800">Abdul Mannan</span></div>
            </div>
            <div className="row mb-2 flex-nowrap">
                <label className="col-lg-4 fw-semibold text-muted mb-0">resolved on time</label>
                <div className="col-lg-8"><span className="fw-bold fs-6 text-gray-800">Yes</span></div>
            </div>
            <div className="row mb-2 flex-nowrap">
                <label className="col-lg-4 fw-semibold text-muted mb-0">Guest Name</label>
                <div className="col-lg-8"><span className="fw-bold fs-6 text-gray-800">AZ </span></div>
            </div>
            <div className="row mb-2 flex-nowrap">
                <label className="col-lg-4 fw-semibold text-muted mb-0">Reported on</label>
                <div className="col-lg-8"><span className="fw-bold fs-6 text-gray-800">07 Apr 2023 07:17 am</span></div>
            </div>
            <div className="row mb-2 flex-nowrap">
                <label className="col-lg-4 fw-semibold text-muted mb-0">Resolved on</label>
                <div className="col-lg-8"><span className="fw-bold fs-6 text-gray-800">07 Apr 2023 08:18 am</span></div>
            </div>
        </div>
    </div>
    <div className="Complaint-activity-wrap">
        <label for="productName" className="bold mb-3">Request Activity</label>
        <div className="row">
            <div className="col-md-12 c-status-table" style={{height:"auto"}}>
                <table className="w-100">
                    <tr>
                        <th style={{width:"33%"}}>Time</th>
                        <th>Activity</th>
                    </tr>
                    <tr>
                        <td className='font-12 color-7' data-label="Status">07 Apr 2023 06:17am</td>
                        <td className='font-14' data-label="color">New request is reported.</td>
                    </tr>
                    <tr>
                        <td className='font-12 color-7' data-label="Status">07 Apr 2023 06:17am</td>
                        <td className='font-14' data-label="color">Request reassigned from AZ to Abdul Mannan</td>
                    </tr>
                    <tr>
                        <td className='font-12 color-7' data-label="Status">07 Apr 2023 06:17am</td>
                        <td className='font-14' data-label="color">Status changed to 'New'</td>
                    </tr>
                    <tr>
                        <td className='font-12 color-7' data-label="Status">07 Apr 2023 06:17am</td>
                        <td className='font-14' data-label="color">Status changed to 'Assigned'</td>
                    </tr>
                    <tr>
                        <td className='font-12 color-7' data-label="Status">07 Apr 2023 07:18am</td>
                        <td className='font-14' data-label="color">Status changed to 'Resolved'</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</div>



         
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
                        <label className="col-lg-4 fw-semibold text-muted mb-0">resolved on time</label>
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
                  <label for="productName" class="control-label  mb-3 ">Complaint Activity</label>
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
                      <td data-label="color">{v.Mode == 1 ? `Assinged to '${v.AssignedTo}'` : v.Mode == 2 ? `Complaint reassigned from ${v.PreviousAssignTo} to ${v.AssignedTo} ` : `Status changed to '${v.Status}'`}</td>
                      :
                      <td data-label="color">{"New complaint is reported."}</td>

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
