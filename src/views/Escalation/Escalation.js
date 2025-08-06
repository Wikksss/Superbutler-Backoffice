import React, { Component } from 'react';
import { FormGroup, Button, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import 'sweetalert/dist/sweetalert.css';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import Dropdown from 'react-bootstrap/Dropdown';
import *as svgIcon from '../../containers/svgIcon';
import {  Link } from 'react-router-dom';
import { FiClock } from "react-icons/fi";
import ReactTooltip from 'react-tooltip';
export default class Escalation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusModal: false,
      dropdownOpen: false,
      ComplaintStatus:false,
      ComplaintDetail:false,
    }
  }
  // StatusModalHTML = ()=> {
  //   return(
  //     <Modal isOpen={this.state.statusModal} className={this.props.className}>
  //     <ModalHeader>Add New</ModalHeader>
  //     <ModalBody className="padding-0">
  //       <AvForm >
  //       <div className="padding-20 scroll-model-web">
  //           <FormGroup className="modal-form-group">
  //             <Label htmlFor="categoryName" className="control-label">Department Name</Label> 
  //             <AvField errorMessage="This is a required field" value="" name="categoryName" type="text" className="form-control" required />
  //           </FormGroup>

  //           <FormGroup className="modal-form-group">
  //             <Label htmlFor="CategoryTopping" className="control-label">Choose Service </Label>
  //             <select className="select2 form-control custom-select"  name="CategoryTopping"  > 
  //               <option  value="0" >Tour Package</option>
  //               <option  value="-1">Room Support</option>
  //              </select>
  //           </FormGroup>

  //         </div>
  //         <FormGroup className="modal-footer">
  //           <Button color="secondary" onClick={() => this.StatusModalHTML({})}>Cancel</Button>
  //           <Button color="success" >
  //           {/* {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
  //                          : <span className="comment-text">Save</span>} */}
  //                          <span className="comment-text">Save</span>

  //         </Button> 
  //         </FormGroup>
  //       </AvForm>
  //     </ModalBody>
  //   </Modal>
  //   )
  //     }
  ComplaintStatusModal() {
    this.setState({
      ComplaintStatus: !this.state.ComplaintStatus,
    })
}
ComplaintDetailModal() {
    this.setState({
      ComplaintDetail: !this.state.ComplaintDetail,
    })
}
  toggleDropDown = () => this.setState({ dropdownOpen: !this.state.dropdownOpen });
  orderStatusClasses = (status) => {

    var orderStatus = 'new-bg';

    if (status == 1) {
      orderStatus = 'confirm-bg';
    }
    else if (status == 2) {
      orderStatus = 'ready-bg';
    }
    else if (status == 3) {
      orderStatus = 'cancelled-bg';
    }
    else if (status == 4) {
      orderStatus = 'completed-bg';
    }
    return orderStatus;
  }
  tOrderStatusClasses = (status) => {

    var orderStatus = 't-new-bg';

    if (status == 1) {
      orderStatus = 't-confirm-bg';
    }
    else if (status == 2) {
      orderStatus = 't-ready-bg';
    }
    else if (status == 3) {
      orderStatus = 't-cancelled-bg';
    }
    else if (status == 4) {
      orderStatus = 't-completed-bg';
    }
    return orderStatus;
  }
  orderStatusIcon = (icon, type) => {
    var orderStatusIcon = ""
    if (icon == 0) {
      orderStatusIcon = <div><span className='ml-2'>New</span></div>;
    }
    else if (icon == 1) {
      if (type > 4) {
        orderStatusIcon = <div><span className='ml-2'>Confirmed</span></div>
      }
      else {
        orderStatusIcon = <div><span className='ml-2'>Ready</span></div>

      }
    }

    else if (icon == 2) {
      orderStatusIcon = <div><span className='ml-2'>Ready</span></div>
    }
    else if (icon == 3) {
      orderStatusIcon = <div><span className='ml-2'>Cancelled</span></div>
    }
    else if (icon == 4) {
      orderStatusIcon = <div><span className='ml-2'>Completed</span></div>
    }
    return orderStatusIcon;
  }
  // componentWillMount(){
 
  //   document.body.classList = "hide-overflow-hidden";
    
  // }
  
  // componentWillUnmount(){
    
  //   document.body.classList = "hide-overflow-hidden";
  
  // }
  render() {
    return (
      <div className='card'>
        <div style={{padding:"0px 15px"}}>
      <div className="d-flex align-items-center mb-2 p-l-r flex-wrap complaint-header-wrap">
                    <h3 class="card-title card-new-title ml-0 mb-0 pl-0 d-flex align-items-center" >
                        Escalations
                    </h3>
                </div>
                <div className='sub-text-p'>
                <p className='font-12'>Configure who do you want to notify when reported issues are not resolved on time. You can set up to 5 escalattions.</p>
                </div>
                </div>
        <div class="card-body m-0">
        {/* <ul className='d-flex align-items-center mb-4 flex-wrap'>
                        <li>
                            <label for="chkAll" className='d-flex align-items-center mr-3'>
                                <input type="checkbox" className="form-checkbox" name="chkAll" id="chkAll" value="false" /> <span className="button-link"> All <span className="badge badge-info">183</span></span>
                            </label>
                        </li>
                        <li>
                            <label for="chkNew" className='d-flex align-items-center mr-3'>
                                <input type="checkbox" className="form-checkbox" name="chkNew" id="chkNew" value="true" checked="" /> <span className="button-link"> New <span className="badge badge-info">52</span></span>
                            </label>
                        </li>
                        <li>
                            <label for="chkInKitchen" className='d-flex align-items-center mr-3'>
                                <input type="checkbox" className="form-checkbox" name="chkInKitchen" id="chkInKitchen" value="false" /> <span className="button-link"> Confirmed <span className="badge badge-info">47</span></span>
                            </label>
                        </li>
                        <li>
                            <label for="chkReady" className='d-flex align-items-center mr-3'>
                                <input type="checkbox" className="form-checkbox" name="chkReady" id="chkReady" value="false" /> <span className="button-link"> Ready <span className="badge badge-info">3</span></span>
                            </label>
                        </li>
                        <li>
                            <label for="chkDelivered" className='d-flex align-items-center mr-3'>
                                <input type="checkbox" className="form-checkbox" name="chkDelivered" id="chkDelivered" value="false" /> <span className="button-link"> Completed <span className="badge badge-info">54</span></span>
                            </label>
                        </li>
                        <li>
                            <label for="chkCancelled" className='d-flex align-items-center mr-3'>
                                <input type="checkbox" className="form-checkbox" name="chkCancelled" id="chkCancelled" value="true" checked="" /> <span className="button-link">Not Fixable<span className="badge badge-info">19</span></span>
                            </label>
                        </li>
                        <li>
                            <label for="chkCancelled" className='d-flex align-items-center mr-3'>
                                <input type="checkbox" className="form-checkbox" name="chkCancelled" id="chkCancelled" value="true" checked="" /> <span className="button-link">Overdue<span className="badge badge-info">19</span></span>
                            </label>
                        </li>
                        <li>
                            <label for="chkAssigned" className='d-flex align-items-center mr-3'>
                                <input type="checkbox" className="form-checkbox" name="chkAssigned" id="chkAssigned" value="true" checked="" /> <span className="button-link">New Assigned<span className="badge badge-info">4</span></span>
                            </label>
                        </li>
                        <li>
                            <label for="chkResolved" className='d-flex align-items-center mr-3'>
                                <input type="checkbox" className="form-checkbox" name="chkResolved" id="chkResolved" value="true" checked="" /> <span className="button-link">Resolved<span className="badge badge-info">30</span></span>
                            </label>
                        </li>
                    </ul> */}
          {/* <div className='d-flex justify-content-end mb-3 mt-2'>
            <div class="search-item-wrap">
              <input type="text" class="form-control common-serch-field" placeholder="Search" />
              <i class="fa fa-search" aria-hidden="true"></i>
            </div>
          </div> */}
          <div className='escalation-main-wrap'>
            <div className='mb-4'>
            <div className='d-flex' style={{maxWidth:"350px"}}>
          <label  className=" bold mb-2">Escalation 03 </label>
          <span className='ml-auto'>
             <i class="fa fa-trash font-16 ml-3 delete cursor-pointer text-danger " aria-hidden="true" data-tip data-for='Delete'></i>
             <ReactTooltip id='Delete'><span>Delete</span></ReactTooltip> 
             <span className='ml-2 font-12'>Remove</span>
             </span>
             </div>
          <div className='escalation-table-wrap d-flex flex-md-wrap mb-3 align-items-center'>
            <div className="d-flex flex-column mr-3">
          <AvForm>
          <label  className="color-7 ">Escalate to </label>
          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown} className={`padding-dropdown assign-drop-d-wrap`}>
                   <Dropdown.Toggle variant="secondary" className='mt-0'>
                  <div className='d-flex assign-text-img'> <span><img src='https://preview.keenthemes.com/metronic8/demo17/assets/media/avatars/300-5.jpg'/></span> <span>Bilal Manzoor</span></div>
                   </Dropdown.Toggle>
                   <Dropdown.Menu>
                     <div className="menu-data-action-btn-wrap">
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span><img src='https://preview.keenthemes.com/metronic8/demo17/assets/media/avatars/300-5.jpg'/></span> <span>Bilal Manzoor</span></div></span></Dropdown.Item>
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span><img src='https://preview.keenthemes.com/metronic8/demo17/assets/media/avatars/300-5.jpg'/></span> <span>Abdul Mannan</span></div></span></Dropdown.Item>
                     </div>
                   </Dropdown.Menu>
                 </Dropdown>
          </AvForm>
          </div>
            <div className="d-flex flex-column ">
          <AvForm>
          <label  className="color-7">after </label>
          <div className='d-flex align-items-center escalation-time-wrap'>
          <div >
          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown} className={`padding-dropdown assign-drop-d-wrap`}>
                   <Dropdown.Toggle variant="secondary" className='mt-0'>
                  <div className='d-flex assign-text-img'>  <span>5 mins</span></div>
                   </Dropdown.Toggle>
                   <Dropdown.Menu>
                     <div className="menu-data-action-btn-wrap">
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span>5 mins</span></div></span></Dropdown.Item>
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span>10 mins</span></div></span></Dropdown.Item>
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span>30 mins</span></div></span></Dropdown.Item>
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span>45 mins</span></div></span></Dropdown.Item>
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span>1 hrs</span></div></span></Dropdown.Item>
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span>3 hrs</span></div></span></Dropdown.Item>
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span>5 hrs</span></div></span></Dropdown.Item>
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span>10 hrs</span></div></span></Dropdown.Item>
                       
                     </div>
                   </Dropdown.Menu>
                 </Dropdown>
             </div>
              <label  className=" ml-2 font-12 mb-0 color-7">of report time</label>
           
              </div>
          </AvForm>
          
          </div>
         

          </div>
          </div>
          <div className='mb-4'>
          <div className='d-flex' style={{maxWidth:"350px"}}>
          <label  className=" bold mb-2">Escalation 03 </label>
          <span className='ml-auto'> 
             <i class="fa fa-trash font-16 ml-3 delete cursor-pointer text-danger" aria-hidden="true" data-tip data-for='Delete'></i>
             <ReactTooltip id='Delete'><span>Delete</span></ReactTooltip> 
             <span className='ml-2 font-12'>Remove</span>
             </span>
             </div>
          <div className='escalation-table-wrap d-flex flex-md-wrap mb-3 align-items-center'>
            <div className="d-flex flex-column mr-3">
          <AvForm>
          <label  className=" color-7">Escalate to </label>
          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown} className={`padding-dropdown assign-drop-d-wrap`}>
                   <Dropdown.Toggle variant="secondary" className='mt-0'>
                  <div className='d-flex assign-text-img'> <span><img src='https://preview.keenthemes.com/metronic8/demo17/assets/media/avatars/300-5.jpg'/></span> <span>Bilal Manzoor</span></div>
                   </Dropdown.Toggle>
                   <Dropdown.Menu>
                     <div className="menu-data-action-btn-wrap">
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span><img src='https://preview.keenthemes.com/metronic8/demo17/assets/media/avatars/300-5.jpg'/></span> <span>Bilal Manzoor</span></div></span></Dropdown.Item>
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span><img src='https://preview.keenthemes.com/metronic8/demo17/assets/media/avatars/300-5.jpg'/></span> <span>Abdul Mannan</span></div></span></Dropdown.Item>
                     </div>
                   </Dropdown.Menu>
                 </Dropdown>
          </AvForm>
          </div>
            <div className="d-flex flex-column ">
          <AvForm>
          <label  className="color-7">after </label>
          <div className='d-flex align-items-center escalation-time-wrap'>
          <div >
          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown} className={`padding-dropdown assign-drop-d-wrap`}>
                   <Dropdown.Toggle variant="secondary" className='mt-0'>
                  <div className='d-flex assign-text-img'>  <span>5 mins</span></div>
                   </Dropdown.Toggle>
                   <Dropdown.Menu>
                     <div className="menu-data-action-btn-wrap">
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span>5 mins</span></div></span></Dropdown.Item>
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span>10 mins</span></div></span></Dropdown.Item>
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span>30 mins</span></div></span></Dropdown.Item>
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span>45 mins</span></div></span></Dropdown.Item>
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span>1 hrs</span></div></span></Dropdown.Item>
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span>3 hrs</span></div></span></Dropdown.Item>
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span>5 hrs</span></div></span></Dropdown.Item>
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span>10 hrs</span></div></span></Dropdown.Item>
                       
                     </div>
                   </Dropdown.Menu>
                 </Dropdown>
             </div>
              <label  className=" ml-2 font-12 mb-0 color-7">of report time</label>
             
              </div>
          </AvForm>
          
          </div>
         

          </div>
          </div>
          <div className='mb-4'>
            <div className='d-flex' style={{maxWidth:"350px"}}>
          <label  className=" bold mb-2">Escalation 03 </label>
          <span className='ml-auto'>
             <i class="fa fa-trash font-16 ml-3 delete cursor-pointer text-danger" aria-hidden="true" data-tip data-for='Delete'></i>
             <ReactTooltip id='Delete'><span>Delete</span></ReactTooltip> 
             <span className='ml-2 font-12'>Remove</span>
             </span>
             </div>
          <div className='escalation-table-wrap d-flex flex-md-wrap mb-3 align-items-center'>
            <div className="d-flex flex-column mr-3">
          <AvForm>
          <label  className="color-7 ">Escalate to </label>
          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown} className={`padding-dropdown assign-drop-d-wrap`}>
                   <Dropdown.Toggle variant="secondary" className='mt-0'>
                  <div className='d-flex assign-text-img'> <span><img src='https://preview.keenthemes.com/metronic8/demo17/assets/media/avatars/300-5.jpg'/></span> <span>Bilal Manzoor</span></div>
                   </Dropdown.Toggle>
                   <Dropdown.Menu>
                     <div className="menu-data-action-btn-wrap">
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span><img src='https://preview.keenthemes.com/metronic8/demo17/assets/media/avatars/300-5.jpg'/></span> <span>Bilal Manzoor</span></div></span></Dropdown.Item>
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span><img src='https://preview.keenthemes.com/metronic8/demo17/assets/media/avatars/300-5.jpg'/></span> <span>Abdul Mannan</span></div></span></Dropdown.Item>
                     </div>
                   </Dropdown.Menu>
                 </Dropdown>
          </AvForm>
          </div>
            <div className="d-flex flex-column ">
          <AvForm>
          <label  className="color-7">after </label>
          <div className='d-flex align-items-center escalation-time-wrap'>
          <div >
          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown} className={`padding-dropdown assign-drop-d-wrap`}>
                   <Dropdown.Toggle variant="secondary" className='mt-0'>
                  <div className='d-flex assign-text-img'>  <span>5 mins</span></div>
                   </Dropdown.Toggle>
                   <Dropdown.Menu>
                     <div className="menu-data-action-btn-wrap">
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span>5 mins</span></div></span></Dropdown.Item>
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span>10 mins</span></div></span></Dropdown.Item>
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span>30 mins</span></div></span></Dropdown.Item>
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span>45 mins</span></div></span></Dropdown.Item>
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span>1 hrs</span></div></span></Dropdown.Item>
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span>3 hrs</span></div></span></Dropdown.Item>
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span>5 hrs</span></div></span></Dropdown.Item>
                       <Dropdown.Item ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img'> <span>10 hrs</span></div></span></Dropdown.Item>
                       
                     </div>
                   </Dropdown.Menu>
                 </Dropdown>
             </div>
              <label  className=" ml-2 font-12 mb-0 color-7">of report time</label>
            
              </div>
          </AvForm>
          
          </div>
         

          </div>
          </div>
          <div className='mt-4'>
          <a className="text-primary cursor-pointer ">+ add another escalation</a>
          </div>
        
          </div>
        </div>
      



        <Modal isOpen={this.state.ComplaintDetail} toggle={() => this.ComplaintDetailModal()} className={this.props.className}>
          <ModalHeader toggle={() => this.ComplaintDetailModal()} >Complaint Detail</ModalHeader>
          <ModalBody >
          
          </ModalBody>
          <FormGroup className="modal-footer" >
            <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger"></label>
            </div>
            <div>
              <Button className='mr-2 text-dark' color="secondary" onClick={() => this.ComplaintDetailModal()}>cancel</Button>
              <Button color="primary" >
              {/* <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>   */}
                 <span className="comment-text">save</span> 
              </Button>
            </div>
          </FormGroup>
        </Modal>
      </div>
    )
  }
}
