import React, { Component } from 'react';
// import { FormGroup, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader, Table, Alert } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { read, utils, writeFile } from 'xlsx';
import 'sweetalert/dist/sweetalert.css';
import { AvForm, AvField } from 'availity-reactstrap-validation';
//import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Pagination from "react-js-pagination";
import * as UserService from '../../service/User';
import * as Utilities from '../../helpers/Utilities';
import Constants from '../../helpers/Constants';
import Config from '../../helpers/Config';
import Loader from 'react-loader-spinner';
import 'sweetalert/dist/sweetalert.css';
import { AppSwitch } from '@coreui/react';
import moment from 'moment';
import DatePicker from "react-datepicker";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import "react-datepicker/dist/react-datepicker.css";
import GlobalData from '../../helpers/GlobalData'
import SweetAlert from 'sweetalert-react'; 
import SweetAlertHtml from '../Components/SweetAlertHtml'
import { renderToStaticMarkup } from 'react-dom/server';
import Labels from '../../containers/language/labels';
import Messages from '../../containers/language/Messages';

var timeZone = '';

class QrPin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: true,
      AddQr: false,
      confirmationMessage: '',
      confirmationText: '',
      validTillDate: moment().add(1, 'day').format("YYYY-MM-DDT14:00:00"),
      isSaving: false,
      showConfirmation: false,
      isPinVerificationRequired: false,
      showSearch:false,
      Id: 0,
      roomNo:'',
      pin:'',
      guestName:'',
      firstName: '',
      lastName: '',
      guestEmail:'',
      phone:'',
      userObj:{},
      AllPINs: [],
      savedAllPINs: [],
      activePage: 1,
      totalRecord: 0,
      searchText: "",
      pageSize: GlobalData.restaurants_data.Supermeal_dev.PageSize,
      selectedPIN: {},
      isPINRequired: false,
      isPINActive: false,
      verificationToggle: true,
      validateUserPIN: true,
      CountryCode: '',
      countryCallingCode: '',
      EnterpriseName: '',
      mobile: ''

    }; 

    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
      this.setState({ userObj: userObj })
      
      timeZone = Config.Setting.timeZone;
      
      this.state.EnterpriseName = Utilities.SpecialCharacterDecode(userObj.Enterprise.Name)
      if(userObj.EnterpriseRestaurant.Country != null) {
        timeZone = userObj.EnterpriseRestaurant.Country.TimeZone;
        this.state.CountryCode = userObj.EnterpriseRestaurant.Country.IsoCode2.toLowerCase();
        }
    }
    }

    AddQrModal() {
      
      this.setState({
        AddQr: !this.state.AddQr,
      }, () => {
        if(!this.state.AddQr) {
          this.setDefaultValues();
        }
      })
  }


  setDefaultValues = () => {
    this.setState({
      Id: 0,
      guestName: '',
      firstName: '',
      lastName: '',
      guestEmail: '',
      mobile: '',
      phone: '', 
      roomNo: '',
      pin: '',
      validTillDate: moment().add(1, 'day').format("YYYY-MM-DDT14:00:00"),
      validateUserPIN: true,
    })
    

  }

  handleOnChange = (value, data, event, formattedValue) => {
    // console.log('value',value)
    // console.log('data',data)
    // console.log('formattedValue',formattedValue)

    var value = "+"+value;
    var countryCallingCode =  "+" + data.dialCode
    var phoneNo = value.replace(countryCallingCode, '')

    const withoutLeading0 = phoneNo == "" ? "" : parseInt(phoneNo, 10);

    // console.log(withoutLeading0);

    this.setState({phone: formattedValue, mobile: withoutLeading0 + "", countryCallingCode: data.dialCode});

    // this.setState({ mobOne: '+' + value, dialCode: '+'+ data.dialCode, focusout: false });
  }
  handleOnFocus = (value, data, event, formattedValue) => {
    // console.log('value',data)
   
    this.setState({ mobOne: value.target.value, dialCode: '+'+ data.dialCode, focusout: false });
  }


  handleDateChange = (date) => {

    // Parse the input date string
    const parsedDate = moment(date, "ddd MMM DD YYYY");

    // Format the date as "YYYY-MM-DD"
    const formattedDate = parsedDate.format("YYYY-MM-DDT14:00");

    this.setState({
      validTillDate: formattedDate,
    });

    // console.log("date", formattedDate)
  }

  GenerateSweetConfirmationWithCancel() {
    return (
      <SweetAlert
        show={this.state.showConfirmation}
        title=""
        html
        text={renderToStaticMarkup(<SweetAlertHtml confirmationText={this.state.confirmationText} confirmationMessage={this.state.confirmationMessage}/>)}
        showCancelButton
        onConfirm={() => { this.HandleOnConfirmation() }}
        confirmButtonText="Yes"
        onCancel={() => {
          this.setState({ showConfirmation: false, AllPINs: JSON.parse(this.state.savedAllPINs) });
        }}
        onEscapeKey={() => this.setState({ showConfirmation: false })}
        // onOutsideClick={() => this.setState({ showConfirmation: false })}
      />
    )
  }

  HandleOnConfirmation() {

    let type = this.state.deleteComfirmationModelType;

    switch (type.toUpperCase()) {

      case 'DP':
        this.DeletePIN();
        break;
      case 'PV':
        this.ActivateDeactivatePINVerification();
        break;
      case 'PS':
        this.ActivateDeActivatePINStatus();
        break;
      default:
        break;
    }

  }

  ActivateDeactivatePINVerification = async () => {

    this.setState({ showConfirmation: false, isPinVerificationRequired: this.state.isPINRequired });

    
    let result = await UserService.UpdatePINVerification(this.state.selectedPIN.Id, this.state.isPINRequired)
    let message = '';

    if (!result.HasError && result !== undefined) {
      if(result.Dictionary.IsUpdated) {
       Utilities.notify(`PIN verification ${this.state.isPINRequired ? "activated" : "deactivated"}.`, "s");
      }else {
        Utilities.notify(`Could not ${this.state.isPINRequired ? "activated" : "deactivated"} PIN verification.`, "e");
       }
   } else 
   {
     message = result.ErrorCodeCsv !='' ? result.ErrorCodeCsv : '';
     Utilities.notify(`Could not ${this.state.isPINRequired ? "activated" : "deactivated"} PIN verification. ${message}`, "e")
   }
   
  }

  ActivateDeActivatePINStatus = async () => {

    this.setState({ showConfirmation: false});

    let result = await UserService.UpdatePINStatus(this.state.selectedPIN.Id, this.state.isPINActive)
    let message = '';
    var PINs = this.state.AllPINs;
    var selectedPINIndex = PINs.findIndex(a => a.Id == this.state.selectedPIN.Id)

    if (!result.HasError && result !== undefined) {
       if(result.Dictionary.IsUpdated){
       
        if(selectedPINIndex != -1 && selectedPINIndex != undefined) {
          PINs[selectedPINIndex].IsActive = this.state.isPINActive
          this.setState({AllPINs: PINs})
        }
       
       Utilities.notify(`PIN status ${this.state.isPINActive ? "activated" : "deactivated"}.`, "s");
       return;
       }else {
        
        Utilities.notify(`Could not ${this.state.isPINActive ? "activated" : "deactivated"} PIN status.`, "e");
       }
   } else 
   {
     message = result.ErrorCodeCsv !='' ? result.ErrorCodeCsv : '';
     Utilities.notify(`Could not ${this.state.isPINActive ? "activated" : "deactivated"} PIN status. ${message}`, "e");
   }

   if(selectedPINIndex != -1 && selectedPINIndex != undefined) {
    PINs[selectedPINIndex].IsActive = !this.state.isPINActive
    this.setState({AllPINs: PINs})
  }
   
  }

  DeletePIN = async () => {

    this.setState({ showConfirmation: false });
    var id = this.state.selectedPIN.Id;
    let result = await UserService.DeleteUserPIN(id)
    let message = '';

     if (!result.HasError && result !== undefined) {
       if(result.Dictionary.IsDeleted) {
        
        var PINs = this.state.AllPINs;
        var selectedPINIndex = PINs.findIndex(a => a.Id == id)
        
        if(selectedPINIndex != -1 && selectedPINIndex != undefined) {
          PINs.splice(selectedPINIndex, 1);
          this.setState({AllPINs: PINs})
        }

         Utilities.notify("PIN deleted", "s");

        }else {
          Utilities.notify(`Could not deleted PIN.`, "e");
       }

    } else 
    {
      message = result.HasError == true && result.ErrorCodeCsv !='' ? result.ErrorCodeCsv : '0';
      Utilities.notify(`Could not deleted PIN. ${message}`, "e");
    }
    
  }

  DeletePINConfirmation(pin) {

    this.setState({selectedPIN: pin, deleteComfirmationModelType: 'DP', showConfirmation: true, confirmationText: '', confirmationMessage: `Delete PIN for ${pin.FirstName + ' ' + pin.LastName } in Room No. ${pin.RoomNo}?` })

  }

  ActivateDeActivatePINStatusConfirmation(pin, isActive) {

    pin.IsActive = isActive;
    this.setState({isPINActive: isActive, selectedPIN: pin, deleteComfirmationModelType: 'PS', showConfirmation: true, confirmationText: '', confirmationMessage: `Do you want to ${isActive ? "activate" : "deactivate"} the PIN for ${pin.FirstName + ' ' + pin.LastName } in Room No. ${pin.RoomNo}? Guest will not be able use your digital services.` })

  }

    
  ActivateDeActivatePINVerificationConfirmation(isRequired) {

    this.setState({isPINRequired: isRequired, deleteComfirmationModelType: 'PV', showConfirmation: true, confirmationText: `Turn ${isRequired? "On" : "Off"} PIN Verification?`, confirmationMessage: 'Guests will be asked to enter a PIN to use your digital services' })

  }


  handleEditPIN = (pin) => {

    this.setState({
      Id: pin.Id,
      //guestName:  `${pin.FirstName} ${pin.LastName}`,
      firstName: pin.FirstName,
      lastName: pin.LastName,
      guestEmail: pin.Email,
      countryCallingCode: pin.CountryCode,
      mobile: pin.Mobile1,
      phone: pin.CountryCode + ' ' + pin.Mobile1, 
      roomNo: pin.RoomNo,
      pin: pin.Pin,
      validTillDate: moment(pin.CheckoutDate).format("YYYY-MM-DDTHH:mm:ss"),
      AddQr: true,
      validateUserPIN: true,
    })
    
  }


  handleSaveSubmit = async (event, values) => {

    if(this.state.isSaving) return;
    this.setState({isSaving:true})

    var validTill = Utilities.ConvertLocalTimeToUTCWithZone(this.state.validTillDate, "YYYY-MM-DDTHH:mm", timeZone);
    // console.log(this.state.mobile);

    var guest = {};

       guest.Id = this.state.Id
       guest.UserId = Object.keys(this.state.userObj).length > 0 ?  this.state.userObj.Id : 4
       guest.FirstName =  this.state.firstName; //this.state.guestName.split(' ')[0];
       guest.LastName =  this.state.lastName; //this.state.guestName.split(' ').length > 1 ? this.state.guestName.split(' ')[1] : '';
       guest.Email =  this.state.guestEmail
       guest.CountryCode =  this.state.countryCallingCode;
       guest.Mobile1 =  this.state.mobile;
       guest.Pin =  this.state.pin
       guest.RoomNo = this.state.roomNo;
       guest.CheckinDate =   Utilities.ConvertLocalTimeToUTCWithZone(moment().format("YYYY-MM-DDT14:00:00"), "YYYY-MM-DDTHH:mm", timeZone);
       guest.CheckoutDate =  validTill;
       guest.EnterpriseId = Utilities.GetEnterpriseIDFromSession();
       guest.EnterpriseName = this.state.EnterpriseName;

      //  console.log(guest);
      //  this.setState({isSaving: false})
      //  return;
       
       var result = await UserService.PostQrPin(guest)

          if (!result.HasError && result !== undefined) {
          
              if (result.Dictionary.IsSaved) {
                  
                  if(guest.Id > 0){
                    var index = this.state.AllPINs.findIndex(p => p.Id == guest.Id)
                    Utilities.notify(`QR PIN is updated.`, "s");
                    this.setDefaultValues();
                    this.GetEnterpriseQrPINs(false);
                  } else {
                    this.setDefaultValues();
                    guest.Id = this.state.Id = result.Dictionary.NewPINId;
                    guest.Pin = this.state.pin = result.Dictionary.NewPIN;
                  }
                  this.AddQrModal();
              }
              
            } else {
              var msg =  result.ErrorCodeCsv !='' ? result.ErrorCodeCsv : '';
              Utilities.notify(`There is something wrong when create user PIN. ${msg}`, "e");
            }
              
      this.setState({isSaving: false})
   
  }

  GetEnterpriseQrPINs = async (loading) => {

    this.setState({showLoader: loading});
    let enterpriseId = Utilities.GetEnterpriseIDFromSession()
    var result = await UserService.GetAllUserPINs(enterpriseId, this.state.activePage, this.state.pageSize, this.state.searchText);
    var dataPIN = [];
    var isPinVerificationRequired = false;
    var totalRecords = 0;
   if (!result.HasError && result != undefined) {

            if (result.Dictionary.PINs != undefined) {
                dataPIN = JSON.parse(result.Dictionary.PINs);
            }

            if (result.Dictionary.TotalRecords != undefined) {
              totalRecords = result.Dictionary.TotalRecords;
            }
          
          if (result.Dictionary.IsPinVerificationRequired != undefined) {
            isPinVerificationRequired = result.Dictionary.IsPinVerificationRequired;
           }
            
   } else {

     var error =  result.HasError === true && result.ErrorCodeCsv !=='' ? result.ErrorCodeCsv : '0';
     console.log("Error: ", error);

   }

   this.setState({
    AllPINs: dataPIN,
    savedAllPINs: JSON.stringify(dataPIN),
    totalRecords: totalRecords,
    isPinVerificationRequired: isPinVerificationRequired,
    showLoader: false,
    verificationToggle: false
   })
   
  }

  IsUserPINAlreadyExists = async () => {

    if (this.state.pin == "") {
      this.setState({ validateUserPIN: true })
      return true;
    }

    let isExists = await UserService.IsUserPINAlreadyExists(this.state.pin ,this.state.Id);
    this.setState({ validateUserPIN: !isExists })

    return isExists;
  }

  handlePageChange = (pageNumber) => {
    this.setState({activePage: pageNumber},() => this.GetEnterpriseQrPINs(true));
  }
  
  componentDidMount() {
    document.body.classList.add('qr-body');
    this.GetEnterpriseQrPINs(true);
  }
  componentWillUnmount() {
    document.body.classList.remove('qr-body');
  }

  changeToggleValue = (e, check)=>{

    this.ActivateDeActivatePINVerificationConfirmation(check);
      
  }

  showSearchRes = () => {
    this.setState({
      showSearch:!this.state.showSearch,
      searchText: ""
    })
  }

  searchPIN = (text) => {
    this.setState({searchText: text.trim()},() => {
    this.GetEnterpriseQrPINs(true)
    }
    )

  }

  loading = () => <div>
  <div className="loader-menu-inner">
    <Loader type="Oval" color="#ed0000" height={50} width={50} />
    <div className="loading-label">Loading.....</div>
  </div>
</div>

    render() {  
    const { validTillDate, AllPINs } = this.state;

    return (
<div className='card'>
  <div className='qr-header-sticky'>
  <div className='d-flex align-items-center justify-content-between my-3 px-2 qr-header-sticky-inner'>
  <div className=" d-flex w-100 align-items-center mb-0 ">
    <h3 className="card-title " data-tip="true" data-for="happyFace">{Labels.QR_PINs}</h3>
    <div className='status-qc qr-toggle-c ml-4'>
                     <AppSwitch name="ALC" disabled={this.state.verificationToggle} onChange={(e) => this.changeToggleValue(e, e.target.checked)} checked={this.state.isPinVerificationRequired} value={this.state.isPinVerificationRequired} className={'mr-auto'} variant={'3d'} color={'primary'} label data-on="On" data-off="Off"/>
     
                    </div>       
      </div>
      { this.state.isPinVerificationRequired &&
      <div className='d-flex align-items-center w-100 justify-content-start justify-content-md-end flex-row-reverse flex-md-row '>
            <div className='qr-pin-action-btn-res'> 
            <div className="user-data-action-btn-res ">
              <div className="show-res ml-2 ml-md-0 mr-0 mr-md-2">
                <Dropdown >
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    <span>
                      <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                    </span>
                    <span>{Labels.Options}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <div>
                      <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.handleSaveSubmit()}>
                        <span>
                        {this.state.isSaving ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span> :
                       <span  className="comment-text"><i className="fa fa-plus mr-1" aria-hidden="true"></i>{Labels.Add_New}</span> }
                        </span>
                      </span>
                      <span onClick={() => this.props.history.push("/importQRPins")} className="m-b-0 statusChangeLink m-r-20" > {Labels.Bulk_Upload}</span>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="show-web">
                <div className='d-flex'>
                    <span onClick={() => this.props.history.push("/importQRPins")} className="add-cat-btn mr-3" style={{minWidth:"105px"}}>
                      <span className="hide-in-responsive">{Labels.Bulk_Upload}</span>
                    </span>
                  <span className="btn btn-primary m-r-15 "  style={{minWidth:"105px"}} onClick={() => this.handleSaveSubmit()}>
                    
                    {this.state.isSaving ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span> :
                    <span  className="comment-text"><i className="fa fa-plus mr-1" aria-hidden="true"></i>{Labels.Add_New}</span> }
                    </span>
                </div>
              </div>
            </div>
            </div>
      <div className="ml-1 mr-md-2 search-item-wrap qr-search qr-h-m"  style={{ position: 'relative', minWidth:240 }}>
                    <input type="text" className="form-control common-serch-field"   placeholder="Search Room no, PIN, Guest" value={this.state.searchText} onChange={(e) => this.searchPIN(e.target.value)} />
                    <i className="fa fa-search" aria-hidden="true" ></i>
        </div>
        <div className='res-pin-search-r cursor-pointer'  onClick={()=> this.showSearchRes()}>.
        <i class="fa fa-search"></i>
        </div>

        <div className={`${this.state.showSearch? 'show-s-res ':''}mb-2 ml-3 mr-md-2 search-item-wrap qr-search qr-h-w`}  style={{ position: 'relative' }}>
                    <input type="search" className="form-control common-serch-field"   placeholder="Search Room no, PIN, Guest" value={this.state.searchText} onChange={(e) => this.searchPIN(e.target.value)} />
                    <i className="fa fa-search" aria-hidden="true" ></i>
                    <span className='cross-search' onClick={()=> this.showSearchRes()}>Close</span>
        </div>
      </div>
      
    }
      </div>
      </div>



      <div className={`parent-w ${!this.state.isPinVerificationRequired && !this.state.showLoader && 'p-opacity'}`}>
        {
          !this.state.isPinVerificationRequired && !this.state.showLoader &&  AllPINs.length > 0 &&
          <>
          <div className='overlay-opacity'></div>
          <div className='over-lay-msg-wrap'>
           You have switched off QR PINs security.
            <div className='status-qc qr-toggle-c '>
                     {/* <AppSwitch name="ALC" disabled={this.state.verificationToggle} onChange={(e) => this.changeToggleValue(e, e.target.checked)} checked={this.state.isPinVerificationRequired} value={this.state.isPinVerificationRequired} className={'mr-auto'} variant={'3d'} color={'primary'} label data-on="On" data-off="Off"/> */}
                     <span className="btn btn-primary m-r-15 "  style={{minWidth:"105px"}} onClick={() => this.ActivateDeActivatePINVerificationConfirmation(true)}>
                  {Labels.Activate_QR_PINs}</span>
                    </div> 
          </div>
          </>
         
        }

        <div className="card-body card-body-res qr-pin-main">
          
          {this.state.showLoader ? this.loading() : 
          
          AllPINs.length > 0 ?

          AllPINs.map((PIN) => {
            
            var currentUtcDate = moment.utc(); // Get current UTC date
            var tillValid = moment(PIN.CheckoutDate);
            if(PIN.Pin == 0 || PIN.Pin == undefined || tillValid.isBefore(currentUtcDate)) return;

         return(
          <div className="grid-s-res-table-wrap">
           
              <div className='grid-table-res'>
                    <div className='room-no'>
                       <span className='common-n'> {Labels.Room} </span> <span className='common-t'>{PIN.RoomNo} </span>
                    </div>
                    <div className='pin-no d-flex flex-column'>
                      
                      <span className='common-n'> {Labels.PIN} </span> <span className='common-t'>{PIN.Pin} </span>
                     </div>

                    <div className='c-name-wrap'>

                       <div className="d-flex flex-column">
                       <span className='common-n'> {Labels.Guest} </span>
                          <span className='bold font-14 '>{`${PIN.Title != null ? PIN.Title : ''} ${PIN.FirstName != null ? PIN.FirstName : `${PIN.LastName != null ? '': '-' }`} ${PIN.LastName != null ? PIN.LastName : ''}`}</span>
                          <span className='color-7 font-13'>{Utilities.maskString(`${PIN.Mobile1 != null && PIN.Mobile1 != '' ? (PIN.CountryCode + PIN.Mobile1) : PIN.Mobile1}`)}</span>
                       </div>
                    </div>
                  
                    <div className='valid-date '>
                     <span className="qr-expired d-flex flex-column" style={{color:"#000"}}>
                     
                      <span className='common-n'> {Labels.Valid_Till} </span> <span className='common-t'>
                        {Utilities.getDateByZone(PIN.CheckoutDate, "DD MMM YYYY hh:mm a", timeZone)}
                      </span>
                      </span>
                    </div>
                    <div className='status-qc d-flex flex-column'>
                     <span className='common-n mb-1'> {Labels.Status} </span>
                     <AppSwitch name="ALC" onChange={(e) => this.ActivateDeActivatePINStatusConfirmation(PIN, e.target.checked)} checked={PIN.IsActive} value={PIN.IsActive} className={'mr-auto'} variant={'3d'} color={'primary'} label data-on="On" data-off="Off"/>
                    </div>
                    
               <div className="user-data-action-btn-res">
                      <div className="show-res">
                        <Dropdown >
                          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            <span>
                              <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                            </span>
                            <span>{Labels.Options}</span>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <div>
                              <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.handleEditPIN(PIN)}>
                                <span><i className="fa fa-edit font-18" ></i>{Labels.Edit}</span>
                              </span>
                            
                              <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.DeletePINConfirmation(PIN)}  ><i className="fa fa-trash-o font-18 delete" aria-hidden="true"></i> {Labels.Delete}</span>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                      <div className="show-web">
                        <div className='d-flex'>
                          <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.handleEditPIN(PIN)}>
                            <span className='d-flex flex-column'><i className="fa fa-edit font-18"></i>Edit</span>
                          </span>
                          <span className="m-b-0 statusChangeLink m-r-20 d-flex flex-column" onClick={() => this.DeletePINConfirmation(PIN)}><i className="fa fa-trash-o font-18 delete" aria-hidden="true"></i> {Labels.Delete}</span>
                        </div>
                      </div>
               </div>

              </div>

          </div>

          
          )})
         : <div className='text-center p-5'><h5>{this.state.searchText.trim() == "" ? Messages.NO_QR_PIN_DATA_FOUND : Messages.NO_QR_PIN_DATA_FOUND_SEARCH }</h5></div>
            }
        </div>

      </div>
      <div className="res-page-wrap">   <Pagination
         activePage={this.state.activePage}
         itemsCountPerPage={this.state.pageSize}
         totalItemsCount={this.state.totalRecords}
         onChange={this.handlePageChange}
       />
   </div>
      
        <Modal isOpen={this.state.AddQr} toggle={() => this.AddQrModal()} className={this.props.className}>
          <ModalHeader toggle={() => this.AddQrModal()} >{this.state.Id > 0 ? "Update" : "Add new"} {Labels.QR_PIN}</ModalHeader>
          <ModalBody id='userInfoDv' className='qr-pin-modal'>
          <AvForm onValidSubmit={this.handleSaveSubmit}>
            <div className='pin-section'>
                <span className='pin-label'>{Labels.PIN}</span>
                <span className='digits'>{this.state.pin}</span>
            </div>
          <div className="row">
          <div className="col-md-6">
                  <div className="form-group">
                    <label id="roomNo" className="control-label">{Labels.Room_No}
                    </label>
                    <AvField  name="roomNo" onChange={(e)=>this.setState({roomNo: e.target.value})} value={this.state.roomNo} type="text" className="form-control"
                      // validate={{
                      //   required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      // }}
                    />
                  </div>
                </div>
                {/* <div className="col-md-4">
                  <div className="form-group">
                    <label id="pin" className="control-label"> PIN
                    </label>
                    <AvField  name="pin" onChange={(e)=>this.setState({pin: e.target.value})} onBlur={(e) => this.IsUserPINAlreadyExists()} value={this.state.pin} type="text" className={this.state.validateUserPIN ? "form-control" : "form-control is-touched is-pristine av-invalid is-invalid form-control"}
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}

                    />
                    {this.state.validateUserPIN ? <div></div> : <div className="invalid-feedback" style={{ display: 'block', fontSize: '12px'}}>This PIN already taken.</div>}
                  </div>
                </div> */}

                <div className="col-md-6">
                  <div className="form-group d-flex flex-column">
                    <label id="validity" className="control-label"> {Labels.Valid_Till}
                    </label>
                    <DatePicker className="form-control w-100"
                     minDate={new Date()}
                    selected={new Date(Utilities.getDateByZone(moment(validTillDate).format("DD MMM YYYY hh:mm a"), "DD MMM YYYY hh:mm a", timeZone))} 
                    onChange={this.handleDateChange} 
                    dateFormat="dd/MM/yyyy"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label id="fName" className="control-label">{Labels.First_Name}
                    </label>
                    <AvField  name="fName" onChange={(e)=>this.setState({firstName: e.target.value})} value={this.state.firstName}  type="text" className="form-control"
                      // validate={{
                      //   required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      // }}

                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label id="lName" className="control-label">{Labels.Last_Name}
                    </label>
                    <AvField  name="lName" onChange={(e)=>this.setState({lastName: e.target.value})} value={this.state.lastName}  type="text" className="form-control"
                      // validate={{
                      //   required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      // }}

                    />
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="form-group">
                    <label id="gEmail" className="control-label">{Labels.Guest_Email}
                    </label>
                    <AvField  name="gEmail" onChange={(e)=>this.setState({guestEmail: e.target.value})}  value={this.state.guestEmail} type="text" className="form-control"
                      // validate={{
                      //   required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      // }}

                    />
                  </div>
                </div>

                <div className="col-md-6 phone-res-pad">
                  <div className="form-group">
                    <label id="gMobile" className="control-label">{Labels.Guest_Phone_Number}
                    </label>
                   <div className='custom-ph-no'>
                    <PhoneInput
                    autocompleteSearch
                    enableSearch
                      country={this.state.CountryCode}
                      value={this.state.countryCallingCode + this.state.mobile}
                      // onChange={phone => this.setState({ phone })}
                      onChange={this.handleOnChange}
                    />
                    </div>
                  </div>
                </div>

               

            </div>
          
          <FormGroup className="modal-footer" >
            <div className='mr-auto'> <label id="name" className="control-label mt-2 text-danger"></label>
            </div>
            <div>
              <Button className='mr-2 text-dark' color="secondary" onClick={() => this.AddQrModal()}>{Labels.Cancel}</Button>
              <Button color="primary" >
              {this.state.isSaving ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span> :
                 <span  className="comment-text">{Labels.Save}</span> }
              </Button>
            </div>
           
          </FormGroup>
        </AvForm>
          </ModalBody>
        </Modal>

        {this.GenerateSweetConfirmationWithCancel()}
       
      </div>
    );

  }
}


export default QrPin;
