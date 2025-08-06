import React, { Component } from 'react';
import { FormGroup, Button, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
import Dropdown from 'react-bootstrap/Dropdown';
import {  Link } from 'react-router-dom';
import { FiClock } from "react-icons/fi";
import * as ComplaintService from '../../service/Complaint'
import * as ComplaintStatus from'../../service/ComplaintStatus'
import Constants from '../../helpers/Constants';
import * as Utilities from '../../helpers/Utilities'
import moment from 'moment';
import {sortableContainer, sortableElement,sortableHandle} from 'react-sortable-hoc';
import GlobalData from '../../helpers/GlobalData';
import Config from '../../helpers/Config';
import Loader from 'react-loader-spinner';
import Avatar from 'react-avatar';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getMessaging, onMessage, isSupported } from "firebase/messaging";
import { FiMove } from "react-icons/fi";
import arrayMove from 'array-move';
import Labels from '../../containers/language/labels';
import { Notify, orderSupportBubbleNotification, requestBubbleNotification } from '../../containers/DefaultLayout/DefaultLayout';

const DragHandle = sortableHandle(() => <span className='mr-2 d-flex align-items-center font-20 cursor-pointer' style={{padding:'4px', background:'#f2f2f2', border:'1px solid #d2d2d2'}}>
<FiMove className='text-dark' /></span>);
const SortableItem = sortableElement(({value, toggleDropDown, selectDropDownColor, onCheckboxChanges, isOpen, onChangeField, deleteStatusConfirmation}) => (
  
  <tr>
    <td data-label="Status"><div className='d-flex align-items-center'><DragHandle/>
    <AvField  type="text"  maxLength={15} name={value.Name + (value.SortOrder + 1)} className=" form-control mr-3" id="" onChange={onChangeField}  value={value.Name} style={{height:"30px"}}
     validate={{
      required: { value: true, errorMessage: 'This is a required field' },
      }} 
    />
    </div></td>
    <td data-label="color"> 
           <Dropdown isOpen={isOpen} toggle={toggleDropDown} className={`padding-dropdown assign-drop-d-wrap`}>
                   <Dropdown.Toggle variant="secondary back-drop-color" >
                  <div className={`d-flex color-active ${value.Color}`}>  </div>
                   </Dropdown.Toggle>
                   <Dropdown.Menu className='w-100'>
                     <div className="menu-data-action-btn-wrap py-0">
                       <Dropdown.Item ><span style={{border: "1px solid #ed0000"}} onClick={()=>selectDropDownColor({bgColor:'status-color-white'})} class={`${value.Color == 'status-color-white' && 'selected-border'} statusChangeLink m-r-20 status-color-white`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>selectDropDownColor({bgColor:'status-color-light-yellow'})} class={`${value.Color == 'status-color-light-yellow' && 'selected-border'} statusChangeLink m-r-20 status-color-light-yellow`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>selectDropDownColor({bgColor:'status-color-light-blue'})} class={`${value.Color == 'status-color-light-blue' && 'selected-border'} statusChangeLink m-r-20 status-color-light-blue`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>selectDropDownColor({bgColor:'status-color-cyan'})} class={`${value.Color == 'status-color-cyan' && 'selected-border'} statusChangeLink m-r-20 status-color-cyan`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>selectDropDownColor({bgColor:'status-color-green'})}class={`${value.Color == 'status-color-green' && 'selected-border'} statusChangeLink m-r-20 status-color-green`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>selectDropDownColor({bgColor:'status-color-baby-pink'})}class={`${value.Color == 'status-color-baby-pink' && 'selected-border'} statusChangeLink m-r-20 status-color-baby-pink`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>selectDropDownColor({bgColor:'status-color-purple'})}class={`${value.Color == 'status-color-purple' && 'selected-border'} statusChangeLink m-r-20 status-color-purple`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>selectDropDownColor({bgColor:'status-color-yellow'})}class={`${value.Color == 'status-color-yellow' && 'selected-border'} statusChangeLink m-r-20 status-color-yellow`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>selectDropDownColor({bgColor:'status-color-royal-blue'})}class={`${value.Color == 'status-color-royal-blue' && 'selected-border'} statusChangeLink m-r-20 status-color-royal-blue`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>selectDropDownColor({bgColor:'status-color-silver'})}class={`${value.Color == 'status-color-silver' && 'selected-border'} statusChangeLink m-r-20 status-color-silver`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>selectDropDownColor({bgColor:'status-color-dark-cyan'})} class={`${value.Color == 'status-color-dark-cyan' && 'selected-border'} statusChangeLink m-r-20  status-color-dark-cyan`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>selectDropDownColor({bgColor:'status-color-orange'})} class={`${value.Color == 'status-color-orange' && 'selected-border'} statusChangeLink m-r-20 status-color-orange`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>selectDropDownColor({bgColor:'status-color-pink'})} class={`${value.Color == 'status-color-pink' && 'selected-border'} statusChangeLink m-r-20 status-color-pink`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>selectDropDownColor({bgColor:'status-color-dark-green'})} class={`${value.Color == 'status-color-dark-green' && 'selected-border'} statusChangeLink m-r-20 status-color-dark-green`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>selectDropDownColor({bgColor:'status-color-red'})} class={`${value.Color == 'status-color-red' && 'selected-border'} statusChangeLink m-r-20  status-color-red`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>selectDropDownColor({bgColor:'status-color-dark-red'})} class={`${value.Color == 'status-color-dark-red' && 'selected-border'} statusChangeLink m-r-20  status-color-dark-red`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>selectDropDownColor({bgColor:'status-color-dark-blue'})} class={`${value.Color == 'status-color-dark-blue' && 'selected-border'} statusChangeLink m-r-20  status-color-dark-blue`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>selectDropDownColor({bgColor:'status-color-dark-magenta'})} class={`${value.Color == 'status-color-dark-magenta' && 'selected-border'} statusChangeLink m-r-20 status-color-dark-magenta`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>selectDropDownColor({bgColor:'status-color-black'})} class={`${value.Color == 'status-color-black' && 'selected-border'} statusChangeLink m-r-20 status-color-black`}></span></Dropdown.Item>
                     </div>
                   </Dropdown.Menu>
               </Dropdown>
     </td>
    
    { !value.IsDefault &&
    <td data-label="Actions"> <label for="chkAll" className='d-flex align-items-center ml-auto mb-0'>
                                <input onChange={(e)=>onCheckboxChanges(e)} value={value.IsClosed} checked={value.IsClosed} type="checkbox" className="form-checkbox" name="chkAll" id="chkAll"/> <span className="button-link text-nowrap font-12">{Labels.Close_complaint}</span>
                            </label>
                            
                            </td>
                         }     
      
      { !value.IsDefault &&
      <td data-label="delete" onClick={()=>deleteStatusConfirmation(value.Id, value.Name)}> 
    <a className='p-2 cursor-pointer'>
    <i class="fa fa-trash font-13" title="Remove" aria-hidden="true"></i>
    </a>
    
     </td>}
  </tr>
));
const SortableContainer = sortableContainer(({children}) => {
  return  <div className='complaint-status-wrap color-pallette'>
    <table>
  {/* <tr className='hide-on-mobile-480'> */}
  <tr>
    <th>{Labels.Status}</th>
    <th>{Labels.Color}</th>
    <th>{Labels.Action}</th>
  </tr>
  {children}

</table></div>;
});

var timeZone = '';
export default class Complaints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IsSave : false,
      statusModal: false,
      dropdownOpen: false,
      ComplaintStatus:false,
      ComplaintDetail:false,
      ComplaintStatusesList:[],
      complaints: [],
      filteredComplaints: [],
      complaintsStatus: [],
      complaintStatusWithCount: [],
      saff: [],
      currentUtcTime:  moment().utc(),
      items: [],
      pageNumber: 1,
      startDate: moment(),
      endDate: moment(),
      statusIdCsv: '-1',
      pageSize: GlobalData.restaurants_data.Supermeal_dev.PageSize,
      chkAll: true,
      countAll: 0,
      allComplaints: [],
      complaintDetailCount: 0,
      isLoading: true,
      showDeleteConfirmation: false,
      deleteConfirmationModelText: '',
      deleteComfirmationModelType:'',
      statusName: '', 
      statusId: '',
      isExist: false,
      errorMessage: 'Status already exist', 
      selectedDuration: 0,
      complainDetail:{},
      complainHistory:[],
      ResolutionCommentsModal:false,
      averageTime:0,
      resolutionComment:'',
      complaintID: 0, 
      complaintStatus: {}, 
      complaintAssigneeId: 0, 
      complaintIsAssigned: false, 
      complainCIndex: 0, 
      complaintDetailIndex: 0,
      loggedInUser: {},
      statusAssignedId: 0,
      sinceStartDate: new Date(),
      daysSinceStartDate: 365
    }

    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
      this.state.loggedInUser = userObj;
      timeZone = Config.Setting.timeZone;

      if(userObj.Enterprise.FirstRequestDate != undefined)
      {
        this.state.sinceStartDate = userObj.Enterprise.FirstRequestDate;
        this.state.daysSinceStartDate = moment().utc().diff(moment(userObj.Enterprise.FirstRequestDate), 'days');
      }

    // let isSupported = firebase.messaging.isSupported();
    if (isSupported() && userObj.Enterprise.EnterpriseTypeId == 15) {

      const messaging = getMessaging();
      
       onMessage(messaging, (payload) => {
        if(payload.data.ActivityType == "OrderSupportNotification"){
          if(orderSupportBubbleNotification){
            orderSupportBubbleNotification(payload)
          }
          return
        } 
        
      Notify(payload);
        var lastPageNumber = this.state.pageNumber + "";
        this.state.pageSize = Number(GlobalData.restaurants_data.Supermeal_dev.PageSize) * Number(this.state.pageNumber)
        this.state.pageNumber = 1
        this.GetAllComplaints(true)
        this.state.pageNumber = Number(lastPageNumber);
        this.state.pageSize = GlobalData.restaurants_data.Supermeal_dev.PageSize;

        });

    }
   
    if(userObj.EnterpriseRestaurant.Country != null) {
      timeZone = userObj.EnterpriseRestaurant.Country.TimeZone;
    }
    

    }
    
    // console.log("currentUtcTime", this.state.currentUtcTime);
    this.state.startDate = moment().format('YYYY-MM-DD 00:00:00'); 
    this.state.endDate = moment().format('YYYY-MM-DD 23:59:58'); 

    if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.SELECTED_COMPLAINTS_STATUS))){

      var sessionStatuses = localStorage.getItem(Constants.Session.SELECTED_COMPLAINTS_STATUS)
      var statusesArray = sessionStatuses.split('|');
      this.state.selectedDuration = statusesArray[0];
      this.handleChange(statusesArray[0], false);
      this.state.statusIdCsv = statusesArray[1];
    }

  }
  onSortEnd = ({oldIndex, newIndex}) => {


    this.setState(({ComplaintStatusesList}) => ({
      ComplaintStatusesList: arrayMove(ComplaintStatusesList, oldIndex, newIndex),
    }));
  

     this.updateSortOrder();
  
  }

  updateSortOrder = () => {

    var ComplaintStatusesList = this.state.ComplaintStatusesList
    
    ComplaintStatusesList.forEach((status, index) => {

      status.SortOrder = index + 1;

    })

    this.setState({ComplaintStatusesList: ComplaintStatusesList});

  }

  //#region API Calling
  AddStatusRow = async () =>{
   var  items =this.state.ComplaintStatusesList;
   var newStatus = {
    Id: 0,
    EnterpriseId: Utilities.GetEnterpriseIDFromSession(),
    Name: "",
    Color: "status-color-white",
    SortOrder: 0,
    IsDefault: false,
    IsClosed: false
  };
   items.splice(items.length - 1, 0, newStatus)
   this.setState({
    ComplaintStatusesList:items
   })
  }
  changeVale = (index, value) => {
    var isExist =  this.state.ComplaintStatusesList.filter(v=> v.Name == value)
    // console.log('isExist', isExist.length > 0)
    this.setState({ isExist:  isExist.length > 0})
      this.state.ComplaintStatusesList[index].Name = value;
  }

  GetColor = (value, index)=>{
    this.state.ComplaintStatusesList[index].Color = value.bgColor;
    this.setState({ ComplaintStatusesList: this.state.ComplaintStatusesList })
  }

  changeCheckboxValue = (value, index) =>{
    this.state.ComplaintStatusesList[index].IsClosed = value;
    this.setState({});
  }

  GetAllComplaintStatus = async ()=>{
   let data = await ComplaintStatus.Get();

   var complaintsStatusGet = [];
   if(!data.HasError){
    // console.log('GetAllComplaintStatus', data)
    if(data.Dictionary.ComplaintStatuses != undefined && !Utilities.stringIsEmpty(data.Dictionary.ComplaintStatuses))
    {
      complaintsStatusGet = JSON.parse(data.Dictionary.ComplaintStatuses)
    }
    this.setState({
      ComplaintStatusesList:complaintsStatusGet
    })
    // console.log("last ComplaintStatusesList", this.state.ComplaintStatusesList)
   }
   //console.log('statuses', data)
  }


  SaveStatuses = async () => {
    try{
      if(this.state.isExist) return;
      this.setState({ IsSave: true })
      let message = await ComplaintStatus.Save(this.state.ComplaintStatusesList)
      if (message == '1') {
        // SetMenuStatus(true);
        this.ComplaintStatusModal();
        this.GetAllComplaintStatus();
        //this.GetAllComplaints();

        var lastPageNumber = this.state.pageNumber + "";
        this.state.pageSize = Number(GlobalData.restaurants_data.Supermeal_dev.PageSize) * Number(this.state.pageNumber)
        this.state.pageNumber = 1
        this.GetAllComplaints(true)
        this.state.pageNumber = Number(lastPageNumber);
        this.state.pageSize = GlobalData.restaurants_data.Supermeal_dev.PageSize;


        this.setState({ IsSave: false })
        Utilities.notify("Statuses updated successfully.", "s");
        return
      }
      this.setState({ IsSave: false })
      Utilities.notify(message, "e");
    }catch(e){
      console.log('Error in SaveStatuses Complaints' , e)
    }
   
  }

  GenerateSweetConfirmationWithCancel() {
    return (
      <SweetAlert
        show={this.state.showDeleteConfirmation}
        title=""
        text={this.state.deleteConfirmationModelText}
        showCancelButton
        onConfirm={() => { this.HandleOnConfirmation() }}
        confirmButtonText="Yes"
        onCancel={() => {
          this.setState({ showDeleteConfirmation: false });
        }}
        onEscapeKey={() => this.setState({ showDeleteConfirmation: false })}
      // onOutsideClick={() => this.setState({ showDeleteConfirmation: false })}
      />
    )
  }
  
  HandleOnConfirmation() {
  
    let type = this.state.deleteComfirmationModelType;
  
    switch (type.toUpperCase()) {
      case 'DS':
        this.DeleteStatus();
        break;
     
      default:
        break;
    }
  
  }
  
  DeleteStatusConfirmation = (Id, name, index) =>{
    if(Id > 0){
      this.setState({ statusName: name, statusId: Id, deleteComfirmationModelType: 'ds', showDeleteConfirmation: true, deleteConfirmationModelText: 'Remove ' + Utilities.SpecialCharacterDecode(name) + '?' })
      return
    }
    this.state.ComplaintStatusesList.splice(index, 1)
    this.setState({ ComplaintStatusesList: this.state.ComplaintStatusesList })
  }

  DeleteStatus = async () => {
  
    this.setState({ showDeleteConfirmation: false });
    let DeletedMessage = await ComplaintStatus.Delete(this.state.statusId)
    if (DeletedMessage === '1') {
      Utilities.notify(("Status " + Utilities.SpecialCharacterDecode(this.state.statusName) + " deleted successfully."), "s");
      this.GetAllComplaintStatus()
      // this.setState({ showAlert: true, alertModelTitle: 'Removed!', alertModelText: name + ' has been removed' });
      return;
    }
  
    let message = DeletedMessage === '0' ? '"' + Utilities.SpecialCharacterDecode(this.state.statusName) + '" has not been deleted' : DeletedMessage;
    Utilities.notify(message, "e");
  
  }

  GetAllComplaints = async (onUpdate) => {
   

    let data = await ComplaintService.Get(this.state.statusIdCsv, this.state.startDate, this.state.endDate, this.state.pageNumber, this.state.pageSize);
    var allComplaints = [];
    var complaints = [];
    var complaintsStatus = [];
    var complaintStatusWithCount = [];
    var staff = [];
    var countAll = 0;
    var complaintDetailCount = 0;
    if(!data.HasError && Object.keys(data).length > 0) {
      if(data.Dictionary.Complaints != undefined && !Utilities.stringIsEmpty(data.Dictionary.Complaints)) {
        complaints = JSON.parse(data.Dictionary.Complaints)
      }
      
      if(data.Dictionary.ComplaintsStatus != undefined && !Utilities.stringIsEmpty(data.Dictionary.ComplaintsStatus)) {
        complaintsStatus = JSON.parse(data.Dictionary.ComplaintsStatus)

        var statusAssigned = complaintsStatus.find(c => c.Name.toUpperCase() == "ASSIGNED")
        if(statusAssigned != undefined) this.state.statusAssignedId = statusAssigned.Id;

      }

      if(data.Dictionary.ComplaintStatusWithCount != undefined && !Utilities.stringIsEmpty(data.Dictionary.ComplaintStatusWithCount)) {
        complaintStatusWithCount = JSON.parse(data.Dictionary.ComplaintStatusWithCount)

        complaintStatusWithCount.forEach((status, index) => {
          var check = this.state.complaintStatusWithCount.length;
          countAll += status.Count;
          status.Checked = this.state.complaintStatusWithCount.length > 0 && index < this.state.complaintStatusWithCount.length ? this.state.complaintStatusWithCount[index].Checked : true;
        });
    
      }

      if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.SELECTED_COMPLAINTS_STATUS))) {
        var sessionStatuses = localStorage.getItem(Constants.Session.SELECTED_COMPLAINTS_STATUS)
        var statusesArray = sessionStatuses.split('|');
        complaintStatusWithCount.forEach((status, index) => {
          
          if(statusesArray[1] != '-1') {

            status.Checked =  Utilities.isExistInCsv(status.Id, statusesArray[1]+",", ',');
            this.state.chkAll = false;
          }
         
        })
      } 
 if(onUpdate) allComplaints = complaints

  else if(complaints.length > 0) allComplaints.push(...this.state.complaints, ...complaints)
     else allComplaints =  this.state.complaints;

      if(data.Dictionary.Staff != undefined && !Utilities.stringIsEmpty(data.Dictionary.Staff)) {
        staff = JSON.parse(data.Dictionary.Staff)
      }

        allComplaints.forEach((complaint) => {
          complaintDetailCount += complaint.ComplaintDetail.length;
        });
    
      
      this.setState({complaints: allComplaints, complaintDetailCount: complaintDetailCount, filteredComplaints: allComplaints, complaintsStatus: complaintsStatus, staff: staff, complaintStatusWithCount: complaintStatusWithCount, bottomLoader: false, countAll: countAll, isLoading: false})
}
}


GetComplaintDetail = async (id, averageTime) => {

  let data = await ComplaintService.GetComplainDetail(id);
  if (Object.keys(data).length > 0) {
    this.setState({ complainDetail: data.ComplaintDetails, complainHistory: data.ComplaintDetailStatusHistory, averageTime: averageTime })
  }
}

UpdateApi = async(id, status, assigneeId, isAssigned, cIndex, detailIndex) => {

  assigneeId = isAssigned ? assigneeId : 0;
  var statusId = isAssigned ? (this.state.statusAssignedId > 0 ? this.state.statusAssignedId : status) : status.Id;
  let message =  await ComplaintService.Update(id, statusId, assigneeId, this.state.resolutionComment);
  this.setState({IsSave:false,Outline: ''})

  if(message == '1') {

    var lastPageNumber = this.state.pageNumber + "";
    this.state.pageSize = Number(GlobalData.restaurants_data.Supermeal_dev.PageSize) * Number(this.state.pageNumber)
    this.state.pageNumber = 1
    this.GetAllComplaints(true)
    this.state.pageNumber = Number(lastPageNumber);
    this.state.pageSize = GlobalData.restaurants_data.Supermeal_dev.PageSize;

    this.setState({ResolutionCommentsModal: false});
    
  }
}


renderDefaultStatuses = (value, index) => {


  return (
    <tr>
    <td data-label="Status"><div className='d-flex align-items-center'><DragHandle/>
    <AvField disabled type="text" name={value.Name + (value.SortOrder + 1)} className=" form-control mr-3" id="" onChange={(e) => this.changeVale(index, e.target.value)}  value={value.Name} style={{height:"30px"}}
     validate={{
      required: { value: true, errorMessage: 'This is a required field' },
      }} 
    />
    </div></td>
    <td data-label="color"> 
           <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown} className={`padding-dropdown assign-drop-d-wrap`}>
                   <Dropdown.Toggle variant="secondary back-drop-color" >
                  <div className={`d-flex color-active ${value.Color}`}>  </div>
                   </Dropdown.Toggle>
                   <Dropdown.Menu className='w-100'>
                     <div className="menu-data-action-btn-wrap py-0">
                       <Dropdown.Item ><span onClick={()=>this.GetColor({bgColor:'status-color-white'}, index)} class={`${value.Color == 'status-color-white' && 'selected-border'} statusChangeLink m-r-20 status-color-white`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>this.GetColor({bgColor:'status-color-light-yellow'}, index)} class={`${value.Color == 'status-color-light-yellow' && 'selected-border'} statusChangeLink m-r-20 status-color-light-yellow`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>this.GetColor({bgColor:'status-color-light-blue'}, index)} class={`${value.Color == 'status-color-light-blue' && 'selected-border'} statusChangeLink m-r-20 status-color-light-blue`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>this.GetColor({bgColor:'status-color-cyan'}, index)} class={`${value.Color == 'status-color-cyan' && 'selected-border'} statusChangeLink m-r-20 status-color-cyan`}></span></Dropdown.Item>
                       <Dropdown.Item ><span  onClick={()=>this.GetColor({bgColor:'status-color-green'}, index)}class={`${value.Color == 'status-color-green' && 'selected-border'} statusChangeLink m-r-20 status-color-green`}></span></Dropdown.Item>
                       <Dropdown.Item ><span  onClick={()=>this.GetColor({bgColor:'status-color-baby-pink'}, index)}class={`${value.Color == 'status-color-baby-pink' && 'selected-border'} statusChangeLink m-r-20 status-color-baby-pink`}></span></Dropdown.Item>
                       <Dropdown.Item ><span  onClick={()=>this.GetColor({bgColor:'status-color-purple'}, index)}class={`${value.Color == 'status-color-purple' && 'selected-border'} statusChangeLink m-r-20 status-color-purple`}></span></Dropdown.Item>
                       <Dropdown.Item ><span  onClick={()=>this.GetColor({bgColor:'status-color-yellow'}, index)}class={`${value.Color == 'status-color-yellow' && 'selected-border'} statusChangeLink m-r-20 status-color-yellow`}></span></Dropdown.Item>
                       <Dropdown.Item ><span  onClick={()=>this.GetColor({bgColor:'status-color-royal-blue'}, index)}class={`${value.Color == 'status-color-royal-blue' && 'selected-border'} statusChangeLink m-r-20 status-color-royal-blue`}></span></Dropdown.Item>
                       <Dropdown.Item ><span  onClick={()=>this.GetColor({bgColor:'status-color-silver'}, index)}class={`${value.Color == 'status-color-silver' && 'selected-border'} statusChangeLink m-r-20 status-color-silver`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>this.GetColor({bgColor:'status-color-dark-cyan'}, index)} class={`${value.Color == 'status-color-dark-cyan' && 'selected-border'} statusChangeLink m-r-20  status-color-dark-cyan`}></span></Dropdown.Item>

                       <Dropdown.Item ><span onClick={()=>this.GetColor({bgColor:'status-color-orange'}, index)} class={`${value.Color == 'status-color-orange' && 'selected-border'} statusChangeLink m-r-20 status-color-orange`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>this.GetColor({bgColor:'status-color-pink'}, index)} class={`${value.Color == 'status-color-pink' && 'selected-border'} statusChangeLink m-r-20 status-color-pink`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>this.GetColor({bgColor:'status-color-dark-green'}, index)} class={`${value.Color == 'status-color-dark-green' && 'selected-border'} statusChangeLink m-r-20 status-color-dark-green`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>this.GetColor({bgColor:'status-color-red'}, index)} class={`${value.Color == 'status-color-red' && 'selected-border'} statusChangeLink m-r-20  status-color-red`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>this.GetColor({bgColor:'status-color-dark-red'}, index)} class={`${value.Color == 'status-color-dark-red' && 'selected-border'} statusChangeLink m-r-20  status-color-dark-red`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>this.GetColor({bgColor:'status-color-dark-blue'}, index)} class={`${value.Color == 'status-color-dark-blue' && 'selected-border'} statusChangeLink m-r-20  status-color-dark-blue`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>this.GetColor({bgColor:'status-color-dark-magenta'}, index)} class={`${value.Color == 'status-color-dark-magenta' && 'selected-border'} statusChangeLink m-r-20 status-color-dark-magenta`}></span></Dropdown.Item>
                       <Dropdown.Item ><span onClick={()=>this.GetColor({bgColor:'status-color-black'}, index)} class={`${value.Color == 'status-color-black' && 'selected-border'} statusChangeLink m-r-20 status-color-black`}></span></Dropdown.Item>
                     </div>
                   </Dropdown.Menu>
               </Dropdown>
     </td>
    
    { !value.IsDefault &&
    <td data-label="Actions"> <label for="chkAll" className='d-flex align-items-center ml-auto mb-0'>
                                <input onChange={(e)=>this.changeCheckboxValue(e.target.checked, index)} value={value.IsClosed} checked={value.IsClosed}  type="checkbox" className="form-checkbox" name="chkAll" id="chkAll"/> <span className="button-link text-nowrap font-12">{Labels.Close_complaint}</span>
                            </label>
                            
                            </td>
                         }     
      
      { !value.IsDefault &&
      <td data-label="delete" onClick={()=>this.DeleteStatusConfirmation(value.Id, value.Name, index)}> 
    <a className='p-2 cursor-pointer'>
    <i class="fa fa-trash font-13" title="Remove" aria-hidden="true"></i>
    </a>
    
     </td>}
  </tr>
  )


}


Update = (id, status, assigneeId, isAssigned, cIndex, detailIndex, currentState ) => {
  
  if(this.state.IsSave || (isAssigned && assigneeId == currentState) || (!isAssigned && status.Id == currentState)) return;
  this.setState({IsSave:true})
  if(status.IsClosed){
    this.ResolutionCommentsModal(id, status, assigneeId, isAssigned, cIndex, detailIndex)
    this.setState({IsSave:false})
    return
  }
  // updating
    this.UpdateApi(id, status, assigneeId, isAssigned, cIndex, detailIndex);
}

  //#endregion
  
  ComplaintStatusModal() {
    this.setState({
      ComplaintStatus: !this.state.ComplaintStatus,
    })
}
ResolutionCommentsModal(id, status, assigneeId, isAssigned, cIndex, detailIndex) {
  this.setState({
    ResolutionCommentsModal: !this.state.ResolutionCommentsModal,
    complaintID: id ?? 0, 
    complaintStatus: status ?? {}, 
    complaintAssigneeId: assigneeId ?? 0, 
    complaintIsAssigned: isAssigned ?? false, 
    complainCIndex: cIndex ?? 0, 
    complaintDetailIndex: detailIndex ?? 0,
    resolutionComment: "Your request has been completed."
  })
}
saveComments = () =>{
    this.setState({IsSave:true})
    const { complaintID, complaintStatus, complaintAssigneeId, complaintIsAssigned, complainCIndex, complaintDetailIndex } = this.state;
    // console.log('check', complaintID, complaintAssigneeId, complaintIsAssigned, complainCIndex, complaintDetailIndex)
    // console.log('check', complaintStatus)
    this.UpdateApi(complaintID, complaintStatus, complaintAssigneeId, complaintIsAssigned, complainCIndex, complaintDetailIndex)
}
ComplaintDetailModal(id, averageTime) {
    this.setState({
      ComplaintDetail: !this.state.ComplaintDetail,
    })
    if(id != undefined) this.GetComplaintDetail(id, averageTime)
}
  toggleDropDown = () => this.setState({ dropdownOpen: !this.state.dropdownOpen });


  SetStatuss = () => {

    var statusIdCsv = this.genarateStatusIdCSV();
    localStorage.setItem(Constants.Session.SELECTED_COMPLAINTS_STATUS, `${this.state.selectedDuration}|${statusIdCsv}`)
    
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
 
  complaintStatusText = (statusId) => {
    
    var status = ""
    
    var selectedStatus = this.state.complaintsStatus.find(status => status.Id == statusId)
    
    if(selectedStatus != undefined) status = selectedStatus.Name

    return status;
  }


  complaintStatusBgColor = (statusId) => {
    
    var color = ""
    
    var selectedStatus = this.state.complaintsStatus.find(status => status.Id == statusId)
    
    if(selectedStatus != undefined) color = selectedStatus.Color

    return color;
  }

  complaintStatusTextColor = (statusId) => {
    
    var color = ""
    var textColor = "#fff"
    var selectedStatus = this.state.complaintsStatus.find(status => status.Id == statusId)
    
    if(selectedStatus != undefined) 
      color = selectedStatus.Color

    if(color == '#fff')
      textColor = "#000";
    
    return textColor;
  }

  GetOverDue = (reportedOn, resolveOn, averageTime) => {
       var time =  Utilities.GetWaitingTime(reportedOn, averageTime, timeZone, resolveOn);
       return time != '' ? time + ' Over due' : 'Yes'
  }


  complaintHtml = (complaint, detailIndex, cIndex) => {
    var staff = this.state.staff.filter(user => user.DepartmentID == complaint.DepartmentId)
    var assignedTo = this.state.staff.find( assignee => assignee.ID == complaint.AssignedTo)
    var findStatus = this.state.complaintsStatus.find(v=> v.Id == complaint.Status)
    var isOverDue = false;

    return (

      <div className={`ticket-wrap ${this.tOrderStatusClasses('')}`}>
      <div className='ticket-complaint-issue-wrap'>
        <div className='ticket-issue bold flex-1 cursor-pointer' onClick={() => this.ComplaintDetailModal(complaint.Id, complaint.AverageJobTime)}>{complaint.Description}</div>
       
        <div className='ml-auto'>
          <span className='complaint-time mr-2'><FiClock className='mr-1'/>{Utilities.GetWaitingTime(moment(complaint.ReportedOn),0, timeZone)}</span>
        {Utilities.GetWaitingTime(moment(complaint.ReportedOn), complaint.AverageJobTime, timeZone) &&  Utilities.stringIsEmpty(complaint.ResolvedOn) && !findStatus.IsClosed &&
        <span class="over-due">{Labels.Overdue}</span>
        }
        </div>
      
      </div>
   
   <div className='d-flex justify-content-between'>

   <div class="d-flex flex-column mr-3">
       <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown} className={`padding-dropdown assign-drop-d-wrap ${staff.length == 0 && 'hide-arrow-status'}`} >
         <Dropdown.Toggle variant="secondary" >
        {assignedTo == undefined ? 
        <div className='d-flex assign-text-img'> <span></span><span >{"Assign To"}</span></div>
        :
        <div className='d-flex assign-text-img '> <span className='mr-2'>
          {!Utilities.stringIsEmpty(assignedTo.PhotoName) ? 
          <img src={!Utilities.stringIsEmpty(assignedTo.PhotoName) ? Utilities.generatePhotoLargeURL(assignedTo.PhotoName, true, false) : ""}/>
          :
          <div className="user-avatar-web">
          <Avatar className="header-avatar" name={assignedTo.Name} round={true} size="25" textSizeRatio={2} />
        </div>
          }

          </span> <span>{ Utilities.SpecialCharacterDecode(assignedTo.Name)}</span></div>
        }
         </Dropdown.Toggle>
         {staff.length > 0 ?  <Dropdown.Menu>
           <div className="menu-data-action-btn-wrap">
             {staff.map( user => 
             <Dropdown.Item>
             
              <span onClick={() => this.Update(complaint.Id, complaint.Status, user.ID, true, cIndex, detailIndex, complaint.AssignedTo)} class="m-b-0 statusChangeLink m-r-20 ">
                <div className='d-flex assign-text-img align-items-center'> <span className='mr-2'>
              
              {!Utilities.stringIsEmpty(user.PhotoName) ? 
              <img src={!Utilities.stringIsEmpty(user.PhotoName) ? Utilities.generatePhotoLargeURL(user.PhotoName, true, false) : ""}/>
              :
              <div className="user-avatar-web">
              <Avatar className="header-avatar" name={user.Name} round={true} size="25" textSizeRatio={2} />
            </div>
              }
              
              </span> <span>{Utilities.SpecialCharacterDecode(user.Name)}</span>
              {complaint.AssignedTo == user.ID &&
                 <i class="fa fa-check text-success" aria-hidden="false"></i>
              }
              </div></span></Dropdown.Item>
             )}
           </div> 
         </Dropdown.Menu> 
         : 
         <Dropdown.Menu>
           <div className="menu-data-action-btn-wrap">
             
             <Dropdown.Item  ><span class="m-b-0 statusChangeLink m-r-20 "><div className='d-flex assign-text-img align-items-center'> <span className='mr-0'>
              </span> <span>{"Staff not available"}</span></div></span></Dropdown.Item>
           </div> 
         </Dropdown.Menu> 
         
         
         }
       </Dropdown>
     </div>
    
     {assignedTo != undefined &&
     <div class="d-flex flex-column ">
     

       <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}  className={`padding-dropdown-complaint ${assignedTo == undefined && 'hide-arrow-status'}`}>
         <Dropdown.Toggle variant="secondary" className={this.complaintStatusBgColor(complaint.Status)}> <div ><span className='ml-2'>{this.complaintStatusText(complaint.Status)}</span></div>
         </Dropdown.Toggle>
         <Dropdown.Menu>
           <div className="menu-data-action-btn-wrap">
            {this.state.complaintsStatus.map((statusOption) => {

                return <Dropdown.Item ><span onClick={() => this.Update(complaint.Id, statusOption, complaint.AssignedTo, false, cIndex, detailIndex, complaint.Status)} class={`m-b-0 statusChangeLink m-r-20`}><span className={`item-color ${statusOption.Color}`}>
                   
                  </span><span>{ Utilities.SpecialCharacterDecode(statusOption.Name)}</span> 
                  <div className='ml-auto'>
                  {complaint.Status == statusOption.Id &&
                 <i class="fa fa-check text-success" aria-hidden="false"></i>
              }
                  </div></span></Dropdown.Item>
            })}
             
           </div>
         </Dropdown.Menu>
       </Dropdown> 
        </div> }
  
   </div>
 </div>

    )
  }


  handleChange = (value, load) => {

    var value = Number(value);
    var startDateFormat = 'YYYY-MM-DD 00:00:00';
    var endDateFomat = 'YYYY-MM-DD 23:59:59';
    this.state.selectedDuration = value;

    this.state.endDate = moment().format(endDateFomat);

    switch (value) {
      case 0:
          this.state.startDate = moment().format(startDateFormat); 
          break;

        case 1:
          this.state.startDate = moment().add(-1, 'd').format(startDateFormat); 
          this.state.endDate = moment().add(-1, 'd').format(endDateFomat);
        break;

        case 7:
          this.state.startDate = moment().add(-1, 'W').format(startDateFormat); 
        break;

        case 30:
          this.state.startDate = moment().add(-1, 'M').format(startDateFormat); 
        break;
    
        case 90:
          this.state.startDate = moment().add(-3, 'M').format(startDateFormat); 
        break;
    
        case 180:
          this.state.startDate = moment().add(-6, 'M').format(startDateFormat); 
        break;

        case -1:
          this.state.startDate = moment(this.state.sinceStartDate).format(startDateFormat); 
        break;

      default:
        break;
    }

    if(load){ 
      this.state.pageNumber = 1;
      this.state.complaints = []
      this.SetStatuss();
      this.GetAllComplaints();
      this.setState({isLoading: true});
    }
    

  }

  renderComplaints = (complaints, index) => {

    let htmlArr = [];
  
    for (var i = 0; i < complaints.length; i++){
      htmlArr.push(this.complaintHtml(complaints[i], i, index ))
    }
  
    return(
       htmlArr.map((complaintHtml) => complaintHtml)
    )      
  }

  handleCheckboxChange = (isChecked, id, load) => {

    var complaintStatusWithCount = this.state.complaintStatusWithCount;
    var checkAll = true;
    if(id == -1) {
        complaintStatusWithCount.forEach(status => {
        status.Checked = isChecked;
      });
      checkAll = this.state.chkAll = isChecked;
      
    } else {

      var statusIndex = complaintStatusWithCount.findIndex( status => status.Id == id);
      complaintStatusWithCount[statusIndex].Checked = isChecked;

      complaintStatusWithCount.forEach(status => {
      
        if(!status.Checked && checkAll)
        
          checkAll = this.state.chkAll = false;
      });

    }

    var statusIdCsv = this.genarateStatusIdCSV();
    this.state.pageNumber = 1;
    this.state.complaints = []
    this.setState({chkAll: checkAll, statusIdCsv: Utilities.stringIsEmpty(statusIdCsv) ? '-1' : statusIdCsv , complaintStatusWithCount: complaintStatusWithCount, isLoading: true}, () => {
     if(load) this.SetStatuss();
      this.GetAllComplaints()
    })
   
  }

  genarateStatusIdCSV = () => {

    if(this.state.chkAll) return "-1";

    var csv = '';

    this.state.complaintStatusWithCount.forEach(status => {
      
      if(status.Checked)
      
      csv += status.Id + ',';
    });

    if(Utilities.stringIsEmpty(csv)) return "0"
    return Utilities.FormatCsv(csv, ',');

  }


  SearchExtra = (e) => {

    let searchText = e.target.value;
    let filteredData = []
  
    this.setState({SearchExtraText: searchText})
   if(searchText.toString().trim() === ''){
    this.setState({FilterExtraGroup: this.state.ExtrasGroups, IsSearchingGroup: false });
    return;
   }
  
   filteredData = this.state.ExtrasGroups.filter((extra) => {
      
      let arr = searchText.toUpperCase().trim();
      let isExists = false;
  
    
  
        if (extra.Name.toUpperCase().indexOf(arr) !== -1) {
          isExists = true;
         
      }
      
      return isExists
    })

    this.setState({FilterExtraGroup: filteredData, IsSearchingGroup: true});

}  



  
  componentWillMount(){
    document.body.classList.add('hide-overflow-hidden');
  
  }
  
  componentDidMount() {
    document.addEventListener('scroll', this.trackScrolling);
    this.GetAllComplaints();
    this.GetAllComplaintStatus();
    this.notificationStatus()
  }
  
  componentWillUnmount(){
    document.body.classList.remove('hide-overflow-hidden');
  }

  isBottom(el) {

    if (el != null) return el.getBoundingClientRect().bottom <= window.innerHeight + 5;
    else return null;
  }

  trackScrolling = () => {
    const wrappedElement = document.getElementById('header');

    console.log("this.state.countAll", this.state.countAll);

    if (this.isBottom(wrappedElement) && this.state.complaintDetailCount < this.state.countAll) {
      this.setState(
        {
          pageNumber: this.state.pageNumber += 1,
          bottomLoader: true
        }, () => {
          this.GetAllComplaints()
        }
      )

    }
  }


  notificationStatus = async() =>{
    let result = await ComplaintService.NotificationStatus(); 
    if(result == '1'){
      requestBubbleNotification()
      localStorage.removeItem(Constants.REQUEST_NOTIFICATION);
      return
    } 
  }


  render() {

    const {complaints, complaintsStatus, staff, items} = this.state;

    return (
      <div className='card'  id='header'>
      <div className="d-flex align-items-center mb-3 p-l-r flex-wrap complaint-header-wrap">
                    <h3 class="card-title card-new-title ml-0 mb-0 pl-0 d-flex align-items-center" >
                   <span className='text-nowrap'> {Labels.Active_Complaints}</span>
                        {/* <select className="order-date-dropdown form-control custom-select ml-4" value={this.state.selectedDuration} onChange={(e) => this.handleChange(e.target.value, true)} style={{height:37}}>
                            <option value={0}>{Labels.Today}</option>
                            <option value={1}>{Labels.Yesterday}</option>
                            <option value={7}>{Labels.Seven_Days}</option>
                            <option value={30}>{Labels.Thirty_Days}</option>
                            <option value={90}>{Labels.Three_Months}</option>
                            <option value={180}>{Labels.Six_Months}</option>
                            <option value={-1}>{Labels.Since_Start}</option>
                           
                        </select> */}
                    </h3>
                    <a className= ' ml-sm-auto text-primary cursor-pointer mr-4 d-none'onClick={() => this.ComplaintDetailModal()}>{Labels.Complaint_Detail}</a>
                    {this.state.loggedInUser.RoleLevel != Constants.Role.STAFF_ID && this.state.loggedInUser.Enterprise.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.ROOM_SUPPORT &&
                    <a className= ' ml-sm-auto text-primary cursor-pointer mr-4'onClick={() => this.ComplaintStatusModal()}>{Labels.Manage_Statuses}</a>
                    }
                   <Link onClick ={()=>window.location.href = '/past-requests'} className={`${this.state.loggedInUser.RoleLevel == Constants.Role.STAFF_ID || this.state.loggedInUser.Enterprise.EnterpriseTypeId != Constants.ENTERPRISE_TYPE_IDS.ROOM_SUPPORT? 'ml-sm-auto' : ""}`} ><span className= 'text-primary cursor-pointer ml-3'>Past Requests</span></Link> 
                    {/* <a className= ' ml-sm-auto text-primary cursor-pointer'onClick={() => this.ComplaintDetailModal()}>View detail</a> */}
                </div>
        {/* onClick={() => this.statusModalHTML ()} */}

        <div class="card-body">
        
        {this.state.countAll > 0 &&
        <ul className='d-flex align-items-center mb-4 flex-wrap orderlink-wraper mt-0 justify-content-start'>
                        
        <li>
                            <label for="chkAll" className='d-flex align-items-center mr-3'>
                                <input type="checkbox" className="form-checkbox" name="chkAll" id="chkAll" checked={this.state.chkAll} value={this.state.chkAll} onClick={(e) => this.handleCheckboxChange(e.target.checked, -1, true)} /> <span className="button-link"> All {this.state.countAll > 0 && '('+ this.state.countAll + ')'}</span>
                            </label>
                        </li>

                        {this.state.complaintStatusWithCount.map((status) => {
                          return (

                        <li>
                        <label for={"chk" + status.Id} className='d-flex align-items-center mr-3'>
                            <input type="checkbox" className="form-checkbox" name={"chk" + status.Id} id={"chk" + status.Id} checked={status.Checked} value={status.Checked} onClick={(e) => this.handleCheckboxChange(e.target.checked, status.Id, true)} /> 
                            <span className="button-link"> {status.Name}  { status.Count > 0 && ' ('+ status.Count +')'}
                            </span>
                        </label>
                        </li>)

                        })}

                      
                    </ul>}
          {/* <div className='d-flex justify-content-end mb-3 mt-2'>
            <div class="search-item-wrap">
              <input type="text" class="form-control common-serch-field" placeholder="Search" />
              <i class="fa fa-search" aria-hidden="true"></i>
            </div>
          </div> */}
          {this.state.complaints.length > 0 ?
          <div className='complaints-table-wrap'>
           {complaints.map((complaint, index) => {

            if(complaint.ComplaintDetail == null) return <></> 
            return (
            <section>
              <div className="ticket-label mb-2">
                <span class="bold room-label">{Labels.Room} {complaint.RoomNo}</span>
                <div className='d-flex ml-4'><span className='complaint-date mr-3'>{complaint.CompletionTime != null ? complaint.CompletionTime : ""}</span> <div class="bold complaint-date">{parseFloat((complaint.TotalFixed/complaint.Count) * 100).toFixed(0)}% {Labels.completed}</div></div>
              <div className='ml-auto'>{Utilities.getDateByZone(moment(complaint.ComplaintDetail[0].ReportedOn).format("YYYY-MM-DDTHH:mm:ss"), "DD MMM YYYY hh:mm a", timeZone)   }</div>
              </div>
              {this.renderComplaints(complaint.ComplaintDetail, index)}
                {(complaint.Comment != "" && complaint.Comment != null)&& (
                  <div className='room-para-e'>
                    <span>{complaint.Comment}</span>
                  </div>
                )}
           
            </section>
            )

           })}

{
              this.state.bottomLoader &&
              <div className='page-end-loader d-flex w-100 justify-content-center' style={{ bottom: 6, maxWidth:"800px" }}>
                <Loader type="Oval" color="#ed0000" height={30} width={30} />
              </div>
            }
            {
              this.state.complaintDetailCount >= this.state.countAll && this.state.complaints.length > 0 && this.state.complaints.length > this.state.PageSize  && 
              <div className='page-end-loader d-flex w-100 justify-content-center' style={{ bottom: 6, maxWidth:"800px" }}>
                <p>{Labels.End_Of_Results}</p>
              </div>
            }

          </div>

: <div class="text-center">{this.state.isLoading ? 
<Loader type="Oval" color="#ed0000" height={30} width={30} /> : <h3 className='font-weight-normal'>{Labels.There_Is_No_Complaint}</h3>}</div>
}

        </div>
        {/* {this.statusModalHTML()} */}
        <Modal isOpen={this.state.ComplaintStatus} toggle={() => this.ComplaintStatusModal()} className={this.props.className}>
          <ModalHeader toggle={() => this.ComplaintStatusModal()} >{Labels.Complaint_Statuses}</ModalHeader>
          <AvForm onValidSubmit={this.SaveStatuses}>
          <ModalBody className='c-status-table'>
          <SortableContainer onSortEnd={this.onSortEnd} useDragHandle>
        {this.state.ComplaintStatusesList.map((value, index) => 
          {
            var count = this.state.ComplaintStatusesList.length -1;
          return(
          (index > 1 && index < count) || (index != count && index > 1 ) ?

          <SortableItem key={`items-${index}`} style={{ zIndex: 100000 }} 
          isOpen={this.state.dropdownOpen} 
          selectDropDownColor={(value)=>this.GetColor(value, index)} 
          onCheckboxChanges={(e)=>this.changeCheckboxValue(e.target.checked, index)} 
          onChangeField={(e)=>this.changeVale(index, e.target.value)} 
          deleteStatusConfirmation={(Id, name)=> this.DeleteStatusConfirmation(Id, name, index)}
          index={index} value={value}   /> : this.renderDefaultStatuses(value, index) )
          }
        )}
      </SortableContainer>
             
               
               <a className="text-primary cursor-pointer mt-3" onClick={()=>this.AddStatusRow()}>+ {Labels.Add_Another}</a>
            
          </ModalBody>
          <FormGroup className="modal-footer" >
            {
              this.state.isExist &&
              <div className='mr-auto'> 
                <label id="name" class="control-label mt-2 text-danger">{this.state.errorMessage}</label>
              </div>
            }
            <div>
              <Button className='mr-2 text-dark' color="secondary" onClick={() => this.ComplaintStatusModal()}>{Labels.Cancel}</Button>
              <Button color="primary" >
                {
                  this.state.IsSave ? 
                    <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>  
                     : <span   className="comment-text">{Labels.Save}</span> 
                }
              </Button>
            </div>
          </FormGroup>
          </AvForm>
        </Modal>

        <Modal isOpen={this.state.ResolutionCommentsModal} toggle={() => this.ResolutionCommentsModal()} className={this.props.className}>
          <ModalHeader toggle={() => this.ResolutionCommentsModal()} >Resolution Comments</ModalHeader>
          <AvForm onValidSubmit={this.saveComments}>
          <ModalBody className='Resolution-comments-wrap'>
          <label className="bold">Comments</label>
         
          <AvField value={this.state.resolutionComment} onChange={(e)=>this.setState({ resolutionComment:  Utilities.SpecialCharacterDecode(e.target.value)})} type="textarea" className=" form-control mr-3" name="address" id="address" 
           validate={{
            required: { value: true, errorMessage: 'This is a required field' },
            }} 
          />
          </ModalBody>
          <FormGroup className="modal-footer" >
            <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger"></label>
            </div>
            <div>
              <Button className='mr-2 text-dark' color="secondary" onClick={() => this.ResolutionCommentsModal()}>Cancel</Button>
              <Button color="primary" >
                {
                 this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>  
                 :<span className="comment-text">Done</span>
                } 
              </Button>
            </div>
          </FormGroup>
          </AvForm>
        </Modal>

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
                        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}  className="padding-dropdown-complaint hide-arrow-status">
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
                          <span className="fw-bold fs-6 text-gray-800">{this.state.complainDetail.ResolvedOn !="" ? this.GetOverDue(this.state.complainDetail.ReportedOn, this.state.complainDetail.ResolvedOn, this.state.averageTime) : '-'}</span>
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
                          <span className="fw-bold fs-6 text-gray-800">{this.state.complainDetail.ResolvedOn !="" ? Utilities.getDateByZone(this.state.complainDetail.ResolvedOn, 'DD MMM YYYY hh:mm a', timeZone) : '-'}</span>
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
                      <td data-label="Status">{Utilities.getDateByZone(v.DateTime, 'DD MMM YYYY hh:mm a', timeZone)}</td>
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
        {this.GenerateSweetConfirmationWithCancel()}
      </div>
    )
  }
}
