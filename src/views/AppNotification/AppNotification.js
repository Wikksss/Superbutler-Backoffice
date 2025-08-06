import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FormGroup, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import * as EnterpriseService from '../../service/Enterprise';
import * as Utilities from '../../helpers/Utilities';
import Constants from '../../helpers/Constants';
import Loader from 'react-loader-spinner';
import Cropper from 'react-easy-crop';
import Slider from '@material-ui/core/Slider';
import getCroppedImg from '../../helpers/CropImage'
import * as NotificationService from '../../service/Notification';
import GlobalData from '../../helpers/GlobalData';
import Dropdown from 'react-bootstrap/Dropdown';
import { Badge } from 'reactstrap';
import moment from 'moment-timezone';
const $ = require('jquery');
const pageSize = 10;


$.DataTable = require('datatables.net');

const phoneNumValidation = (value, ctx) => {

  if (/^[+()\d-]+$/.test(value) || value == "") {
    return true;
  } else {
    return "Invalid input"
  }
}

function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.addEventListener(
      'load',
      () => resolve(reader.result),
      false
    )
    reader.readAsDataURL(file)
  })
}

class AppNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      showAlert: false,
      alertModelText: '',
      alertModelTitle: '',
      deleteConfirmationModelText : '',
      deleteComfirmationModelType : '',
      showDeleteConfirmation: false,
      modalVisible: false,
      activePage: 1,
      Enterprises: [],
      ShowLoader: true,
      totalRecord: 0,
      pageSize: 10,
      toRestaurant: false,
      SelectedEnterpriseId: 0,
      SelectedEnterpriseTypeId: 0,
      SelectedEnterpriseName: "",
      SelectedAccountId: 0,
      SelectedCredibilityBalanceLimitUpdate: 0,
      AllEnterprises: [],
      FilterEnterprises: [],
      FilterText: "",
      HasTopUpPermission: false,
      HasEnterpriseReadPermission: false,
      HasEnterpriseImpersonatePermission: false,
      HasEnterpriseSuspendPermission: false,
      HasEnterpriseDeletePermission: false,
      HasEnterpriseChurnedPermission: false,
      ChurnedModal: false,
      ChurnedNotes: '',
      ChkChurned: true,
      ChkAll: true,
      IsChurned: true,
      ChurnedEnterprise: {},
      IsEnterprise: true,

      //new variables from here

      allCuisinesList: [],
      allNotifications: [],
      openEditModal: false,
      addEditLabel: "",
      cuisineTypes: [{ id: 1, name: 'Cuisine' }, { id: 2, name: 'Dietary' }],
      cuisineSelectedType: 'Cuisine',
      CuisineName: '',
      hitCounts: 0,
      editCuisine: {},
      PhotoName: null,
      CroppedAreaPixels: null,
      CroppedImage: null,

      LogoImage: null,
      LogoCrop: { x: 0, y: 0 },
      LogoZoom: 1,
      LogoAspect: 200 / 200,
      OldLogoImage: null,
      modalLogo: false,
      showDeleteCuisinePopup: false,
      showDeleteCuisineTitle: "Are you sure?",
      showDeleteCuisineMessage: "You want to delete",
      deletedSuccessfully: false,
      deleteAlertTitle: 'Deleted!',
      deleteAlertMessage: '',
      checkedCuisine: true,
      checkedDietry: true,
      SelectedNotificationId: 0
    };

    this.getAllNotifications()
    this.toggleLogoModal = this.toggleLogoModal.bind(this);
  }


  getAllNotifications = async () => {
    this.setState({ ShowLoader: true });
    var response = await NotificationService.GetAll()
    this.setState({
      allNotifications: response, allCuisinesList: response, ShowLoader: false
    });

    this.bindDataTable();

  }

  loading = () => <div className="res-loader-wraper"><div className="loader-menu-inner">
    <Loader type="Oval" color="#ed0000" height={50} width={50} />
    <div className="loading-label">Loading.....</div>
  </div>
  </div>


  //#region  api calling

  // GetEnterprises = async (pageNumber, pageSize, searchKeyword) => {

  //   // this.setState({ ShowLoader: true });
  //   let data = await EnterpriseService.GetAll(pageNumber, pageSize, searchKeyword, this.state.ChkChurned, this.state.ChkAll);

  //   if (data === null)
  //     this.props.history.push('/Login')

  //   if (data.length !== 0) {
  //     this.setState({ Enterprises: data, FilterEnterprises: data, totalRecord: data[data.length - 1].Id, ShowLoader: false });
  //   }

  //   // this.setState({ ShowLoader: false });
  //   // this.GetAllEnterprises();

  // }


  // GetAllEnterprises = async (pageNumber, pageSize) => {

  //   let data = await EnterpriseService.GetAll(1, 5000);
  //   this.setState({ AllEnterprises: data, Enterprises: data, ShowLoader: false });
  //   // this.SearchEnterprise(this.state.FilterText);
  // }

  DeleteNotification = async () => {
		this.setState({ classDisplay: '', MessageClass: '', MessageText: '' });

		let isDeleted = await NotificationService.DeleteNotification(this.state.SelectedNotificationId);

		if (isDeleted) {
      Utilities.notify("Successfully removed.", "s");
      this.getAllNotifications();
		}
		else {
			Utilities.notify("Unable to remove.", "e");
		}
		this.setState({ showDeleteConfirmation: false, classDisplay: 'no-display'});
  }
  



  //#endregion

//#region Models and alerts Html 
  
GenerateSweetConfirmationWithCancel(){
  return( 
     <SweetAlert
       show={this.state.showDeleteConfirmation}
       title="Are you sure?"
       text={this.state.deleteConfirmationModelText}
       showCancelButton
       onConfirm={() => {this.DeleteNotification()}}
       onCancel={() => { this.setState({ showDeleteConfirmation: false });
       }}
       onEscapeKey={() => this.setState({ showDeleteConfirmation: false })}
      //  onOutsideClick={() => this.setState({ showDeleteConfirmation: false })}
     />
   )
}

 GenerateSweetAlert(){
  return( 
     <SweetAlert
       show={this.state.showAlert}
       title={this.state.alertModelTitle}
       text={this.state.alertModelText}
       onConfirm={() => this.setState({ showAlert: false })}
       onEscapeKey={() => this.setState({ showAlert: false })}
      //  onOutsideClick={() => this.setState({ showAlert: false })}
     />
   )
 }

//#endregion


//#region  Confirmation Model Generation

DeleteNotificationConfirmation(name,id){

  this.setState({SelectedNotificationId: id, SelectedNotificationName: name,  showDeleteConfirmation:true, deleteConfirmationModelText: 'Do you want to delete "'+name+'".'})

}

//#endregion 






  //#region render Html

 ResendNotification(id,edit){

  if(edit) {
    this.props.history.push(`/edit-notification/${id}`);
    return;
  }
   this.props.history.push(`/new-notification/${id}`);

 }

  parseNotificationJson = (notificationJson) => {
    return JSON.parse(notificationJson)
  }

  notificationStatus = (status) =>{
    return status == 0 ? 'Pending' :  'Sent'
  }

  setNotificationDate = (date) =>{
    var date = moment(date).format('DD MMM YYYY hh:mm:ss A')
    return date
  }

  LoadNotificationssHtml(notifications) {
    var notificationObj = this.parseNotificationJson(notifications.NotificationJson)

    var date = moment(notifications.DateToDeliver, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    var today = moment(new Date()).format('YYYY-MM-DD H:mm:ss');
    var diff = moment.duration(moment(date).diff(moment(today)));
    var hours = parseInt(diff.asHours());
    var min = parseInt(diff.asMinutes());

    var availableToUpdate = min >=30;

    return (
      <tr>
        <td>
          <div className="Notification-restaurant-wrap" key={notifications.Id}>
            <div className="admin-restaurant-row">

              <div className="rest-main-inner-row">
    <div className="rest-name-heading">{notificationObj.Title}</div>
                <div className="my-order-new-row">

                  <div class="App-notifi-wrap">
                    <div class="d-start">
                      <span class="h-label">Date</span>
    <span class="u-heading">{this.setNotificationDate(notifications.DateToDeliver)}</span>
                    </div>
                    <div class="d-start">
                      <span class="h-label">Total Devices</span>
    <span class="u-heading">{notifications.TotalDevices}</span>
                    </div>
                    <div class="d-start">
                      <span class="h-label">Staus</span>
    <span class="u-heading"><Badge color="success">{this.notificationStatus(notifications.NotificationStatus)}</Badge></span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </td>

        <td>
          <div className="user-data-action-btn-res">

            <div className="show-res">
              <Dropdown >
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  <span>
                    <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                  </span>
                  <span>
                    Options
</span>
                </Dropdown.Toggle>

                <Dropdown.Menu >
                  <div>
                  {notifications.NotificationStatus === 1 ? 
                <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.ResendNotification(notifications.Id,false)} >
                  <span><i className="fa fa-repeat font-18" ></i> Resend</span>
                </span>
:
availableToUpdate ? 
                <span className="m-b-0 statusChangeLink m-r-20"  onClick={() => this.ResendNotification(notifications.Id,true)}>
                  <span><i className="fa fa-pencil-square-o font-18">Update</i></span>
                </span> : ""
  }

                    <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.DeleteNotificationConfirmation(notificationObj.Title,notifications.Id)}><i className="fa fa-trash-o font-18 delete" aria-hidden="true"></i> Delete</span>
                  </div>
                </Dropdown.Menu>
              </Dropdown>

            </div>
            <div className="show-web">
              <div>
                {notifications.NotificationStatus === 1 ? 
                <span onClick={() => this.ResendNotification(notifications.Id,false)} className="m-b-0 statusChangeLink m-r-20"  >
                  <span><i className="fa fa-repeat font-18"></i> Resend</span>
                </span>
:

availableToUpdate ? 

              <span className="m-b-0 statusChangeLink m-r-20"  onClick={() => this.ResendNotification(notifications.Id,true)}>
              <span><i className="fa fa-pencil-square-o font-18">Update</i></span>
              </span> : ""
  }

                <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.DeleteNotificationConfirmation(notificationObj.Title,notifications.Id)} ><i className="fa fa-trash-o font-18 delete" aria-hidden="true"></i> Delete</span>
              </div>
            </div>
          </div>
        </td>
      </tr>
    )
  }


  RenderNotifications(Notifications) {
    if (this.state.ShowLoader) {
      return this.loading()
      // return;
    }

    var htmlNotifications = [];

    if (Notifications === null || Notifications.length == 0) {
      return <div className="no-record">no record found</div>
    }

    for (var i = 0; i < Notifications.length; i++) {

      htmlNotifications.push(this.LoadNotificationssHtml(Notifications[i], i));

    }

    return (
      <tbody>
        {htmlNotifications.map((cuisinesHtml) => cuisinesHtml)}
      </tbody>

    )
  }


  //#endregion

  CancleModal() {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  }


  CurrentDate() {
    this.setState({
      Date: new Date()
    })
  }

  FilterCheckbox(e, control) {
    let value = e.target.value == 'false' ? true : false

    switch (control.toUpperCase()) {

      case 'C':
        this.state.checkedDietry = value;
        this.setState({ checkedDietry: value });
        break;

      case 'A':
        this.state.checkedCuisine = value;
        this.setState({ checkedCuisine: value });
        break;

      default:
        break;
    }
    this.state.cuisines = []
    for (let index = 0; index < this.state.allCuisinesList.length; index++) {
      if (this.state.checkedDietry == true && this.state.checkedCuisine == true) {
        this.state.cuisines = this.state.allCuisinesList
      }
      else if (this.state.checkedDietry == false && this.state.checkedCuisine == true) {
        if (this.state.allCuisinesList[index].Type != 'Dietary') {
          this.state.cuisines.push(this.state.allCuisinesList[index])
        }
      } else if (this.state.checkedCuisine == false && this.state.checkedDietry == true) {
        if (this.state.allCuisinesList[index].Type != 'Cuisine') {
          this.state.cuisines.push(this.state.allCuisinesList[index])
        }
      } else {
        this.state.cuisines = []
      }


    }
    this.setState({
      cuisines: this.state.cuisines
    })
  
  }


  componentDidMount() {

    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
      let UserRole = userObj.RoleLevel;

      let hasTopUpPermission = Utilities.HasPermission(userObj.RoleLevel, Constants.Permission.TOPUP_UPDATE);
      let hasEnterpriseCreatePermission = Utilities.HasPermission(userObj.RoleLevel, Constants.Permission.ENTERPRISE_RESTAURANT_CREATE);
      let hasEnterpriseImpersonatePermission = Utilities.HasPermission(userObj.RoleLevel, Constants.Permission.ENTERPRISE_ADMIN_IMPERSONATE);
      let hasEnterpriseSuspendPermission = Utilities.HasPermission(userObj.RoleLevel, Constants.Permission.ENTERPRISE_RESTAURANT_SUSPEND) && userObj.RoleLevel != Constants.Role.ENTERPRISE_ADMIN_ID;
      let hasEnterpriseDeletePermission = Utilities.HasPermission(userObj.RoleLevel, Constants.Permission.ENTERPRISE_RESTAURANT_DELETE) && userObj.RoleLevel != Constants.Role.ENTERPRISE_ADMIN_ID;
      let hasEnterpriseChurnedPermission = Utilities.HasPermission(userObj.RoleLevel, Constants.Permission.ENTERPRISE_CHURNED_UPDATE) && userObj.RoleLevel != Constants.Role.ENTERPRISE_ADMIN_ID;


      this.setState({

        HasTopUpPermission: hasTopUpPermission,
        HasEnterpriseCreatePermission: hasEnterpriseCreatePermission,
        HasEnterpriseImpersonatePermission: hasEnterpriseImpersonatePermission,
        HasEnterpriseSuspendPermission: hasEnterpriseSuspendPermission,
        HasEnterpriseDeletePermission: hasEnterpriseDeletePermission,
        HasEnterpriseChurnedPermission: hasEnterpriseChurnedPermission,
        IsEnterprise: userObj.Enterprise.EnterpriseTypeId === 3
      }, () => {

      });

    }

  }

  shouldComponentUpdate() {
    return true;
  }

  bindDataTable() {
    $("#tblNotification").DataTable().destroy();
    $('#tblNotification').DataTable({
      "paging": true,
      "ordering": false,
      "info": true,
      "lengthChange": false,
      "search": {
        "smart": true
      },
      "language": {
        "searchPlaceholder": "Search",
        "search": ""
      }

    });
  }

  LoadCuisineTypeDropDown(types) {
    var htmlCuisines = [];
    if (types === null || types.length < 1) {
      return;
    }
    for (var i = 0; i < types.length; i++) {

      htmlCuisines.push(this.renderCuisineOptions(types[i]));
    }
    return (
      <div className="input-group mb-3 form-group">
        <select value={this.state.cuisineSelectedType} className="form-control" onChange={(e) => {
          this.state.cuisineSelectedType = e.target.value
          this.setState({ cuisineSelectedType: e.target.value })
        }
        } >{htmlCuisines.map((cuisineHtml) => cuisineHtml)}
        </select>
      </div>
    )
  }

  renderCuisineOptions(type) {
    return (
      <option key={type.id} value={type.name}>{type.name}</option>
    )
  }


  MakeCuisineName(e) {

    let CuisineName = e.target.value;

    this.RemoveSpecialChars(e);

    this.setState({ CuisineName: CuisineName });
  }

  RemoveSpecialChars(e) {

    Utilities.RemoveSpecialChars(e);
    Utilities.RemoveDefinedSpecialChars(e);
    e.target.value = e.target.value.replace(/'/gi, "").replace(/_/gi, "").replace(/\./g, "").replace(/#/gi, "");

  }

  SaveCuisine = (event, values) => {

    var info = {
      Type: this.state.cuisineSelectedType,
      Name: values.cuisineName,
      HitCount: values.hitcounts
    }
    this.processSaveCuisine(info)
  }


  updateCuisine = (event, values) => {

    var info = {
      Id: this.state.editCuisine.Id,
      Type: this.state.cuisineSelectedType,
      Name: values.cuisineName,
      HitCount: values.hitcounts
    }
    this.processUpdation(info)
  }

  // processUpdation = async (info) => {
  //   var response = await CuisinesService.Update(info)
  //   if (response === '1') {
  //     // this.GetEnterprises(this.state.activePage, pageSize);

  //     this.setState({
  //       CuisineName: '',
  //       hitCounts: 0,
  //       openEditModal: false
  //     })
  //     this.getCuisines()
  //     Utilities.notify("Updated successfully.", "s");
  //   }
  //   else
  //     Utilities.notify("Update failed.", "e");

  // }

  editCuisines = (cuisines) => {

    this.state.editCuisine = cuisines
    this.setState({
      editCuisine: cuisines
      , openEditModal: true
      , addEditLabel: 'Edit'
      , cuisineSelectedType: cuisines.Type
      , CuisineName: cuisines.Name
      , hitCounts: cuisines.HitCount + ""
    }, () => {
      // console.log('cuisineSelectedType', this.state.cuisineSelectedType)
    })
  }

  deleteCuisine = (cuisine) => {
    // console.log('cuisines', cuisine)
    this.state.editCuisine = cuisine
    this.setState({
      showDeleteCuisinePopup: true
    })
    //this.processDeletion(cuisine.Id)
  }

  // processDeletion = async (Id) => {
  //   var response = await CuisinesService.Delete(Id)
  //   if (response === '1') {
  //     // this.GetEnterprises(this.state.activePage, pageSize);
  //     this.getCuisines()
  //     this.setState({
  //       deletedSuccessfully: true,
  //       deleteAlertTitle: 'Deleted!',
  //       deleteAlertMessage: '\"' + this.state.editCuisine.Name + '\"' + ' deleted successfully'
  //     })
  //     //Utilities.notify("Deleted successfully.", "s");
  //   }
  //   else {
  //     this.setState({
  //       deletedSuccessfully: true,
  //       deleteAlertTitle: 'Error!',
  //       deleteAlertMessage: '\"' + this.state.editCuisine.Name + '\"' + ' not deleted successfully'
  //     })

  //   }
  // }

  toggleLogoModal() {
    this.setState({
      modalLogo: !this.state.modalLogo,
      LogoImage: null,
      IsSave: false
    });
  }

  onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      this.setState({ PhotoName: e.target.files[0].name });
      const imageDataUrl = await readFile(e.target.files[0])
      this.setState({
        LogoImage: imageDataUrl,
        LogoCrop: { x: 0, y: 0 },
        LogoZoom: 1,
      })
    }
  }


  onLogoCropChange = crop => {
    this.setState({ LogoCrop: crop })
  }

  onCropComplete = (croppedArea, croppedAreaPixels) => {
    this.setState({ CroppedAreaPixels: croppedAreaPixels })
  }

  onZoomChange(zoom) {
    this.setState({ LogoZoom: zoom })
  }

  SaveCroppedImage = async () => {
    debugger
    if (this.state.IsSave) return;
    this.setState({ IsSave: true })

    let croppedImage;
    croppedImage = await getCroppedImg(
      this.state.LogoImage,
      this.state.CroppedAreaPixels
    )
    var info = {
      Id: this.state.editCuisine.Id,
      ImageNameBitStream: croppedImage,
      PhotoName: this.state.PhotoName,
      OldPhotoName: this.state.editCuisine.PhotoName
    }
    this.photoSavingApi(info)
    //this.SavePhotoApi(this.state.OldLogoImage, croppedImage, this.state.PhotoName, "Restaurant")
  }

  // photoSavingApi = async (info) => {
  //   var response = await CuisinesService.AddPhoto(info)
  //   this.setState({ IsSave: false })
  //   if (response === '1') {
  //     // this.GetEnterprises(this.state.activePage, pageSize);
  //     this.toggleLogoModal()
  //     this.setState({ openEditModal: false })
  //     this.getCuisines()
  //     Utilities.notify("Photo added successfully.", "s");
  //   }
  //   else {
  //     this.toggleLogoModal()
  //     Utilities.notify("Failed to add a photo.", "e");
  //   }
  // }

  render() {
    if (this.state.toRestaurant === true && !this.state.IsEnterprise) {
      this.setState({ toRestaurant: false });
      return <Redirect to='/enterprise/general-setup' />
    }

    return (
      <div className="card">
        
        <div className="m-b-20 card-new-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="card-title ">
              App Notification
            </h3>
            <Link to="/new-notification"> <span className="btn btn-primary-plus  btn btn-secondary"><i className="fa fa-plus" aria-hidden="true"></i>New Notification</span> </Link>
          </div>
        <div className="card-body card-body-res notifi-main-wrap">


          <table id="tblNotification">
            <thead>
              <tr>
                <th></th>
                {/* <th>Send date and time</th> */}

                <th className="hide-res-480"></th>
              </tr>
            </thead>

            {this.RenderNotifications(this.state.allNotifications)}

          </table>
        </div>

        <Modal isOpen={this.state.openEditModal} toggle={() => this.setState({ openEditModal: !this.state.openEditModal })} >
          {this.state.addEditLabel == 'Add' ?
            <ModalHeader>Add {Utilities.GetResourceValue(GlobalData.restaurants_data.Supermeal_dev.Platform, 'Cuisine', 'Category')}</ModalHeader> :
            <ModalHeader>Edit {this.state.editCuisine.Name}</ModalHeader>
          }

          <ModalBody>
            <AvForm onValidSubmit={this.state.addEditLabel == 'Add' ? this.SaveCuisine : this.updateCuisine} id="cuisineAdditionForm">
              <div className="sortable-wrap sortable-item sortable-new-wrap">
                <div className="col-md-6">
                  <label className="control-label">Type</label>
                  {this.LoadCuisineTypeDropDown(this.state.cuisineTypes)}
                </div>
              </div>
              <div className="col-md-6">
                <label className="control-label">Name</label>
                <div className="input-group m-b-10 form-group">
                  <AvField errorMessage="This is a required field" name="cuisineName" value={this.state.CuisineName} onKeyUp={this.RemoveSpecialChars} onChange={(e) => this.MakeCuisineName(e)} type="text" className="form-control" required />
                  <div className="help-block with-errors"></div>
                </div>

              </div>
              <div className="col-md-6">
                <label className="control-label font-weight-500">Hit Counts</label>
                <div className="input-group mb-3 form-group">
                  <AvField name="hitcounts" value={this.state.hitCounts} type="text" className="form-control"
                    validate={{ myValidation: phoneNumValidation, }}
                  />
                  <div className="help-block with-errors"></div>
                </div>

              </div>
              <ModalFooter>
                <div>  <Button color="secondary" onClick={() => {
                  this.setState({
                    openEditModal: false,
                    CuisineName: '',
                    hitCounts: 0
                  })
                }}>Cancel</Button></div>
                <Button color="primary">
                  {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                    : <span className="comment-text">{this.state.addEditLabel == "Add" ? 'Save' : 'Update'}</span>}

                </Button>
              </ModalFooter>
            </AvForm>
          </ModalBody>

        </Modal>
        <Modal isOpen={this.state.modalLogo} toggle={this.toggleLogoModal} className={this.props.className}>
          <ModalHeader toggle={this.toggleLogoModal}>Upload Photo</ModalHeader>
          <ModalBody>
            <div className="popup-web-body-wrap-new">
              <div className="file-upload-btn-wrap position-relative">
                <div className="fileUpload">
                  <span>Choose a file</span>
                  <input type="file" accept="image/*" id="logoUpload" className="upload"
                    onChange={(e) => this.onFileChange(e)} />
                </div>
              </div>

              <div id="logo-upload-image" className="upload-image-wrap-new">
                <div className="upload-dragdrop-wrap" id="logoDragImage">
                  <div>
                    <div className="dragdrop-icon-text-wrap">PREVIEW ONLY</div>
                    <div className="dragdrop-icon-wrap">
                      <i className="fa fa-file-image-o" aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
                <div className="crop-image-main-wrap ">

                  {this.state.LogoImage && <Fragment>
                    <div className="crop-container">
                      <Cropper
                        image={this.state.LogoImage}
                        crop={this.state.LogoCrop}
                        zoom={this.state.LogoZoom}
                        aspect={this.state.LogoAspect}
                        onCropChange={this.onLogoCropChange}
                        onCropComplete={this.onCropComplete}
                        onZoomChange={(e) => this.onZoomChange(e)}
                      />
                    </div>
                    <div className="controls">
                      <Slider
                        value={this.state.LogoZoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e, zoom) => this.onZoomChange(zoom)}
                      />
                    </div>
                  </Fragment>
                  }
                </div>

              </div>
            </div>
          </ModalBody>
          <ModalFooter>

            <Button color="secondary" onClick={this.toggleLogoModal}>Cancel</Button>
            {this.state.LogoImage !== null && <Button color="primary" style={{ marginRight: 10 }} onClick={(e) => this.SaveCroppedImage()}>
              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                : <span className="comment-text">Save</span>}
            </Button>}
          </ModalFooter>
        </Modal>
        {this.GenerateSweetConfirmationWithCancel()}
        {this.GenerateSweetAlert()}   
      </div>
    );
  }

}

export default AppNotification;
