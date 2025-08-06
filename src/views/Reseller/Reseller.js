import React, { Component,Fragment } from 'react';
import Avatar from 'react-avatar';
import Slider from '@material-ui/core/Slider'
import SweetAlert from 'sweetalert-react'; // eslint-disable-line import/no-extraneous-dependencies
import 'sweetalert/dist/sweetalert.css';
import { Link } from 'react-router-dom'
import { FormGroup, Label, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
import * as EnterpriseUserService from '../../service/EnterpriseUsers';
import * as UserService from '../../service/User';
import * as DepartmentService from '../../service/Department';
import * as Utilities from '../../helpers/Utilities';
import Loader from 'react-loader-spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import Cropper from 'react-easy-crop';
import UserInfo from '../Users/UserInfo/UserInfo';
import Labels from '../../containers/language/labels';
import { FaUserTie } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import Constants from '../../helpers/Constants';
const $ = require('jquery');


const PhotoGroupName = ["Restaurant", "RestaurantCoverPhoto", "Cover-Photo"];

const passwordTextValidation = (value, ctx) => {

  if (value.toUpperCase() === "PASSWORD") {
    return "Your password cannot be 'password'";
  }
  return true;
}

$.DataTable = require('datatables.net');

class Reseller extends Component {

  //#region Constructor
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      UserList: [],
      ShowLoader: true,
      showAlert: false,
      alertModelText: '',
      alertModelTitle: '',
      deleteConfirmationModelText: '',
      deleteComfirmationModelType: '',
      showDeleteConfirmation: false,
      SelectedUserId: 0,
      SelectedUserRoleLevel: 0,
      SelectedUserName: '',
      SuspendActiveHtml: '',
      ResetPasswordModal: false,
      membershipUserId: '',
      ResetModal: '',
      dropdownOpen: false,
      type: 'password',
      IsSave:false,
      modalLogo: false,
      LogoCrop: { x: 0, y: 0 },
      LogoZoom: 1,
      LogoAspect: 200 / 200,
      CroppedAreaPixels: null,
      AddNewUser: false,
      id: 0,
      save: false,
      departments: [],
    };
    this.toggle = this.toggle.bind(this);
    this.showHide = this.showHide.bind(this);  
    //#region button binding
    this.ResetPasswordModelShowHide = this.ResetPasswordModelShowHide.bind(this);
    this.ResetPassword = this.ResetPassword.bind(this);
    this.getResellerByType()
    //#endregion

  }

  //#endregion



  //#region toggle functions
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }
  ResetPasswordModelShowHide(user) {
    this.setState({ ResetPasswordModal: !this.state.ResetPasswordModal, membershipUserId: user.MembershipUserId, SelectedUserName: user.UserName })
  }
  //#endregion

  loading = () => <div className="page-laoder-users">
    <div className="loader-menu-inner">
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
      <div className="loading-label">Loading.....</div>
    </div>
  </div>

  //#region Event 

  ResetPasswordApi = async (membershipId, newPassword, confirmPassword) => {

    let changed = await EnterpriseUserService.ResetPassword(membershipId, newPassword, confirmPassword)

    if (changed === '1') {
      this.ResetPasswordModelShowHide({});
      this.setState({ showAlert: true, alertModelTitle: 'Password Changed!', alertModelText: 'Password has been changed successfully' });
      this.setState({IsSave:false})
      return;
    }

    let message = changed === '0' ? 'Password has not been changed successfully' : changed;

    //this.setState({SelectedCategoryId: 0});
    this.setState({ showAlert: true, alertModelTitle: 'Error!', alertModelText: message });
    this.setState({IsSave:false})

  }

  ResetPassword(event, values) {
    if(this.state.IsSave) return;
    let selectedMembershipId = values.hdMembershipId;
    this.setState({IsSave:true})
    if (selectedMembershipId !== '') {
      this.ResetPasswordApi(selectedMembershipId, values.newPassword, values.confirmPassword);
      return;
    }
  }
  AddNewUserModal = (id) => {
    this.setState({
      id: id,
      AddNewUser: !this.state.AddNewUser,
    })

    if(id == -1){
     
      this.GetEnterpriseUsers();
    }
}

  //#endregion

  //#region api calling

  getResellerByType = async () => {
    let response = await UserService.GetResller(Constants.Role.RESELLER_ADMIN_ID, 1, 100, 'username', 1)
    this.setState({ UserList: response, ShowLoader: false });
    // console.log('getResellerByType',response)
  }


  GetEnterpriseUsers = async () => {

    let enterpriseId = Utilities.GetEnterpriseIDFromSession()
    var data = await EnterpriseUserService.GetAll(enterpriseId);
    this.GetDepartmentss();
    this.setState({ UserList: data, ShowLoader: false });
    // this.bindDataTable();
  }

  GetDepartmentss = async () => {

    var data = await DepartmentService.GetAll();
  
    if(data.length !== 0){
      
      this.setState({departments:data});
  
      // console.log("departments", data)
    }
  
  }


  GetDepartmentName = (departmentId) => {

  }
  

  DeleteEnterpriseUser = async () => {

    this.setState({ showDeleteConfirmation: false });
    let DeletedMessage = await EnterpriseUserService.Delete(this.state.SelectedUserId, this.state.SelectedUserRoleLevel)
    let name = this.state.SelectedUserName;

    if (DeletedMessage === '1') {

      this.setState({ SelectedUserId: 0 });
      this.GetEnterpriseUsers();
      this.setState({ showAlert: true, alertModelTitle: 'Removed!', alertModelText: 'Enterprise User "' + name + '" has been removed' });
      return;
    }

    let message = DeletedMessage === '0' ? '"' + name + '" has not been removed ' : DeletedMessage;

    //this.setState({SelectedCategoryId: 0});
    this.setState({ showAlert: true, alertModelTitle: 'Error!', alertModelText: message });

  }


  SuspendEnterpriseUser = async () => {

    this.setState({ showDeleteConfirmation: false });
    let SuspendMessage = await EnterpriseUserService.ActiveSuspend(this.state.SelectedUserId, this.state.SelectedUserRoleLevel, false)
    let name = this.state.SelectedUserName;

    if (SuspendMessage === '1') {

      this.setState({ SelectedUserId: 0 });
      this.GetEnterpriseUsers();
      this.setState({ showAlert: true, alertModelTitle: 'suspended!', alertModelText: 'Enterprise User "' + name + '" has been suspended' });
      return;
    }

    let message = SuspendMessage === '0' ? '"' + name + '" has not been suspended' : SuspendMessage;

    //this.setState({SelectedCategoryId: 0});
    this.setState({ showAlert: true, alertModelTitle: 'Error!', alertModelText: message });

  }

  ActivateEnterpriseUser = async () => {

    this.setState({ showDeleteConfirmation: false });
    let ActivateMessage = await EnterpriseUserService.ActiveSuspend(this.state.SelectedUserId, this.state.SelectedUserRoleLevel, true)
    let name = this.state.SelectedUserName;

    if (ActivateMessage === '1') {

      this.setState({ SelectedUserId: 0 });
      this.GetEnterpriseUsers();
      this.setState({ showAlert: true, alertModelTitle: 'Activated!', alertModelText: 'Enterprise User "' + name + '" activated successfully' });
      return;
    }

    let message = ActivateMessage === '0' ? 'This user "' + name + '" not activated successfully' : ActivateMessage;

    //this.setState({SelectedCategoryId: 0});
    this.setState({ showAlert: true, alertModelTitle: 'Error!', alertModelText: message });

  }

  //#endregion

  //#region  Confirmation Model Generation

  DeleteUserConfirmation(userId, name, roleLevel) {

    this.setState({ SelectedUserId: userId, SelectedUserName: name, SelectedUserRoleLevel: roleLevel, deleteComfirmationModelType: 'du', showDeleteConfirmation: true, deleteConfirmationModelText: 'This User "' + name + '" will be deleted permanently.' })

  }

  ActivateUserConfirmation(userId, name, roleLevel) {

    this.setState({ SelectedUserId: userId, SelectedUserName: name, SelectedUserRoleLevel: roleLevel, deleteComfirmationModelType: 'au', showDeleteConfirmation: true, deleteConfirmationModelText: '"' + name + '" will be Activated.' })

  }

  SuspendUserConfirmation(userId, name, roleLevel) {

    this.setState({ SelectedUserId: userId, SelectedUserName: name, SelectedUserRoleLevel: roleLevel, deleteComfirmationModelType: 'su', showDeleteConfirmation: true, deleteConfirmationModelText: '"' + name + '" will be suspended.' })

  }

  HandleOnConfirmation() {

    let type = this.state.deleteComfirmationModelType;

    switch (type.toUpperCase()) {

      case 'DU':
        this.DeleteEnterpriseUser();
        break;
      case 'AU':
        this.ActivateEnterpriseUser();
        break;
      case 'SU':
        this.SuspendEnterpriseUser();
        break;
      default:
        break;
    }

  }

  //#endregion
  onChangeText = (key, value) => {
    this.setState({ [key]: value })
  }
  showHide(e){
    e.preventDefault();
    e.stopPropagation();
    
    this.setState({
      type: this.state.type === 'password' ? 'text' : 'password'
    })  
  }
  //#region Models and alerts Html 

  GenerateSweetConfirmationWithCancel() {
    return (
      <SweetAlert
        show={this.state.showDeleteConfirmation}
        title=""
        text={this.state.deleteConfirmationModelText}
        showCancelButton
        onConfirm={() => { this.HandleOnConfirmation() }}
        onCancel={() => {
          this.setState({ showDeleteConfirmation: false });
        }}
        onEscapeKey={() => this.setState({ showDeleteConfirmation: false })}
        onOutsideClick={() => this.setState({ showDeleteConfirmation: false })}
      />
    )
  }

  GenerateSweetAlert() {
    return (
      <SweetAlert
        show={this.state.showAlert}
        title={this.state.alertModelTitle}
        text={this.state.alertModelText}
        onConfirm={() => this.setState({ showAlert: false })}
        onEscapeKey={() => this.setState({ showAlert: false })}
        onOutsideClick={() => this.setState({ showAlert: false })}
      />
    )
  }



  GenerateResetPasswordModel() {
    return (

      <Modal isOpen={this.state.ResetPasswordModal} className={this.props.className}>
        <ModalHeader>Reset Password</ModalHeader>
        <ModalBody className="padding-0">
          <AvForm onValidSubmit={this.ResetPassword}>

            <div className="padding-20">
              <FormGroup className="modal-form-group font-14 control-label">
                <span>User:</span> <span>{this.state.SelectedUserName}</span>
              </FormGroup>

              <FormGroup className="modal-form-group position-relative">
                <Label for="newPassword" className="control-label">{Labels.New_Password}</Label>
                <AvField errorMessage="This is a required field" value="" onChange={e => this.onChangeText('password', e.target.value)} name="newPassword" type={this.state.type}  validate={{
                  required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                  myValidation: passwordTextValidation,
                  minLength: { value: 6, errorMessage: 'Your password must be more than 6 characters' },
                }}
                  className="form-control" required />
                      <span className="password__show show-password-users" onClick={this.showHide}> <span className={this.state.type === 'password' ? 'fa fa-eye-slash ' : 'fa fa-eye '}></span></span>
              </FormGroup>

              <FormGroup className="modal-form-group">
                <Label for="confirmPassword" className="control-label">{Labels.Confirm_Password}</Label>
                <AvField value="" name="confirmPassword" type={this.state.type} validate={{
                  required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                  myValidation: passwordTextValidation,
                  match: { value: 'newPassword', errorMessage: 'Confirm Password does not match' },
                  minLength: { value: 6, errorMessage: 'Your password must be more than 6 characters' },
                }}
                  className="form-control" required />
              </FormGroup>

              <FormGroup className="modal-form-group">
                <AvField name="hdMembershipId" type="hidden" value={this.state.membershipUserId} />
              </FormGroup>

            </div>
            <FormGroup className="modal-footer">
              <Button color="secondary" onClick={() => this.ResetPasswordModelShowHide({})}>{Labels.Cancel}</Button>
          

              <Button color="primary" style={{width: '61px'}}>
                {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                : <span className="comment-text">{Labels.Save}</span>}
              </Button>
            </FormGroup>

          </AvForm>
        </ModalBody>
      </Modal>

    )
  }



  //#endregion


  componentDidMount() {

    // this.GetEnterpriseUsers();

  }
  componentWillUnmount() {

  }
  shouldComponentUpdate() {
    return true;
  }


  EditEnterpriseUser(userId, uName) {

    this.AddNewUserModal(userId);
    this.state.SelectedUserName = uName;
    //this.props.history.push('/users/' + userId)

  }

  GetRoleClass = (roleLevel) => {
   
    var className = "";

    switch (roleLevel) {

      case 4:
        className = "admin-color";
        break;
      case 5:
        className = "manager-color"
        break;
      case 6 || 18:
        className = "staff-color";
        break;
      case 2 || 16:
        className = "moderator-color";
        break;
      case 17:
        className = "agent-color";
          break;
  
      default:
        break
    }

    return className;

  }
  onLogoCropChange = crop => {
    this.setState({ LogoCrop: crop })
  }
  onCropComplete = (croppedArea, croppedAreaPixels) => {
    
    this.setState({ CroppedAreaPixels: croppedAreaPixels })
  }

  onZoomChange(zoom, group) {

    switch (group) {

      case PhotoGroupName[0]:
        this.setState({ LogoZoom: zoom })
        break;

      case PhotoGroupName[1]:
        this.setState({ MenuCoverZoom: zoom })
        break;

      case PhotoGroupName[2]:
        this.setState({ SearchCoverZoom: zoom })
        break;
      default:
        break;
    }

  }
  
  toggleLogoModal =()=> {
    this.setState({
      modalLogo: !this.state.modalLogo,
      // LogoImage: null,
      // PhotoError: false
    });
  }

  RenderUser(user) {

    var fullName = user.FirstName + ' ' + user.SurName
    var suspendActive = user.IsActive ? <span className="m-b-0 statusChangeLink  m-r-20" onClick={() => this.SuspendUserConfirmation(user.Id, fullName, user.RoleLevel)}><i className="fa fa-ban" aria-hidden="true" ></i><span>{user.IsActive === true ? 'Suspend' : 'Activate'}</span></span> : <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.ActivateUserConfirmation(user.Id, fullName, user.RoleLevel)}><i className="fa fa-check" aria-hidden="true" ></i><span>{user.IsActive === true ? 'Deactivate' : 'Activate'}</span> </span>;
    // var actions = user.IsDeleted ? "Deleted" : 
    // <div> 
    //   {user.IsActive ?
    //   <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.EditEnterpriseUser(user.Id, fullName)}>
    //     <span><i className="fa fa-edit font-18" ></i>{Labels.Edit}</span>
    //   </span>
    //   : ""  }
    //         {user.IsActive ?
    //   <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.ResetPasswordModelShowHide(user)} >
    //   <span><i className="fa fa-key font-18" ></i> {Labels.Reset_Password}</span>
    //   </span>
    //   : ""  }
    //   {suspendActive}
    //   <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.DeleteUserConfirmation(user.Id, fullName, user.RoleLevel)} ><i className="fa fa-trash-o font-18 delete" aria-hidden="true"  ></i> {Labels.Delete}</span>
    // </div>;
    
    var checkDeletedRow = user.IsDeleted ? "disable-user-row" : "";
    return (

      <tr key={user.Id} className={checkDeletedRow} >
        <td>
          <div className="vatar-name-wraper">
            <div className="user-avatar-web">
              <Avatar className="header-avatar" name={fullName} round={true} size="45" textSizeRatio={2} />
            </div>
            <div className="user-avatar-res">
              <Avatar className="header-avatar" name={fullName} round={true} size="35" textSizeRatio={1} />
            </div>
         
            {/* <div onClick={()=>this.setState({modalLogo: true})} className='user-icon-upload-wrap d-none'>
              <div className='user-icon-inner'>
              <i class="fa fa-user font-20"></i>
              </div>

            </div> */}
              {/* <div onClick={()=>this.setState({modalLogo: true})} className='user-image-upload-wrap position-relative'>
            <img src="https://cdn.superme.al/s/shoply/enterprise/45/images/rayban-logo-638019488385472627.jpeg" alt="" />
            </div> */}
           
            <div className="user-left-col flex-md-row d-flex flex-column">
              <span className="u-heading d-flex flex-wrap mr-3">
                <span className='w-100 text-dark font-18'>{'  ' + fullName}  </span>
               <span className={`alert alert-secondary enterprise-txt mt-2 mb-2 p-2 ${this.GetRoleClass(user.RoleLevel)}`}>{user.RoleLevel==4? <RiAdminFill/>: user.RoleLevel==5? <FaUserTie/>:<i className='fa fa-user'/>} {Utilities.GetRoleName(user.RoleLevel)}</span>
                </span>
              <span className="user-d-wrap d-flex flex-column">
                {
                  user.Mobile1 != "" && 
                  <span className='mt-2'>
                  <i className="fa fa-phone"></i> {user.Mobile1}
                </span>
                }
           
              <span className='mt-2'><i className="fa fa-user-o"></i>{user.UserName}</span>
              </span>
            </div>
          </div>
        </td>

        {/* <td> {user.UserName}</td>
      <td> {user.Mobile1}</td>
      <td> {user.RoleLevel}</td> */}
        <td>
          <div className="user-data-action-btn-res">

            <div className="show-res">
              <Dropdown className={checkDeletedRow}>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  <span>
                    <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                  </span>
                  <span>
                    {Labels.Options}
           </span>
                </Dropdown.Toggle>

                {/* <Dropdown.Menu >
                  {actions}
                </Dropdown.Menu> */}
              </Dropdown>

            </div>
            {/* <div className="show-web">
              {actions}
            </div> */}
          </div>
        </td>
      </tr>
    )
  }

  LoadEnterpriseUsers(enterpriseUsers) {

    var htmlUsers = [];
    if (this.state.ShowLoader === true) {
      return this.loading()
    }
    if (enterpriseUsers.length === 0) {
      return <div></div>
    }

    for (var i = 0; i < enterpriseUsers.length; i++) {

      htmlUsers.push(this.RenderUser(enterpriseUsers[i]));

    }

    return (

      <tbody>{htmlUsers.map((userHtml) => userHtml)}</tbody>

    )

  }

save = (save) => {
this.setState({save: save});
}
  bindDataTable = () => {
    $("#userData").DataTable().destroy();
    $('#userData').DataTable({
      "paging": true,
      "ordering": false,
      "info": true,
      "lengthChange": false,
      "search": {
        "smart": false
      },
      "language": {
        "searchPlaceholder": "Search",
        "search":""
    }
      //   "oLanguage": {
      //     "sLengthMenu": "Show  _MENU_ results",
      //     //Showing 1 to 7 of 7 entries
      //     "sInfo": "Showing  _TOTAL_ results (_START_ to _END_)"
      // }


    });
  }

  render() {

    const { UserList } = this.state;
    return (
      <div className="card" id="userDataWraper">
               <div className="card-new-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>   <h3 className="card-title" data-tip data-for='happyFace'>{Labels.Reseller +"(" + this.state.UserList.length +")"}
                                </h3>
              {/* <button className="btn btn-primary"onClick={() => this.AddNewUserModal(0)}><i className="fa fa-plus" aria-hidden="true"></i> {Labels.Add_Users}</button> */}
          
          </div>
        <div className="card-body">
          {/* <AvForm>
            <div className='mb-3'>
              <ul className="d-flex flex-wrap all-users-chkbxs">
                <li className="mr-4 mb-2 ">
                  <label for="chkAll" className="d-flex mb-0 align-items-center">
                    <AvInput type="checkbox" className="form-checkbox" name="all" id="chkAll" value="true" checked="" />
                    <span className="button-link">All [3]</span></label></li><li className="mr-4 mb-2">
                  <label for="chkIS" className="d-flex mb-0 align-items-center">
                    <AvInput type="checkbox" className="form-checkbox" name="inStock" id="chkIS" value="true" checked="" />
                    <span className="button-link">Manager   [0]</span>
                  </label>
                </li>
              </ul>
            </div>
          </AvForm> */}
   
          <table id="userData" cellSpacing="0">
            <thead>
              <tr>
                <th style={{ width: '190px' }}></th>
                <th style={{ width: '200px' }}></th>
              </tr>
            </thead>

            {this.LoadEnterpriseUsers(UserList)}

          </table>
        </div>

        {this.GenerateSweetConfirmationWithCancel()}
        {this.GenerateSweetAlert()}
        {this.GenerateResetPasswordModel()}


        <Modal isOpen={this.state.modalLogo} toggle={()=>this.toggleLogoModal()} className={this.props.className}>
            <ModalHeader toggle={()=>this.toggleLogoModal()}>{Labels.Upload_Logo}</ModalHeader>
            <ModalBody>
              <div className="popup-web-body-wrap-new">
                <div className="file-upload-btn-wrap position-relative">
                  <div className="fileUpload">
                    <span>{Labels.Choose_File}</span>
                    <input type="file" accept="image/*" id="logoUpload" className="upload"
                      // onChange={(e) => this.onFileChange(e, PhotoGroupName[0])} 
                      />
                  </div>
                </div>

                <div id="logo-upload-image" className="upload-image-wrap-new">
                  <div className="upload-dragdrop-wrap" id="logoDragImage">
                    <div>
                      <div className="dragdrop-icon-text-wrap">{Labels.PREVIEW_ONLY}</div>
                      <div className="dragdrop-icon-wrap">
                        <i className="fa fa-file-image-o" aria-hidden="true"></i>
                      </div>
                    </div>
                  </div>
                  <div className="crop-image-main-wrap ">

                   <Fragment>
                      <div className="crop-container">
                      <Cropper
                            image={"https://cdn.superme.al/s/butler/images/000/001/000001115_ghk030121laundrypackage-015-1617040989.jpg"}
                            crop={this.state.LogoCrop}
                            zoom={this.state.LogoZoom}
                            aspect={this.state.LogoAspect}
                            onCropChange={this.onLogoCropChange}
                            onCropComplete={this.onCropComplete}
                            onZoomChange={(e) => this.onZoomChange(e, PhotoGroupName[0])}
            />
                      </div>
                      <div className="controls">
                        <Slider
                          value={this.state.LogoZoom}
                          min={1}
                          max={3}
                          step={0.1}
                          aria-labelledby="Zoom"
                          onChange={(e, zoom) => this.onZoomChange(zoom, PhotoGroupName[0])}
                        />
                      </div>
                    </Fragment>
               
                  </div>

                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={()=>this.toggleLogoModal()}>Cancel</Button>
              {/* {this.state.LogoImage !== null && <Button color="success" style={{ marginRight: 10 }} onClick={(e) => this.SaveCroppedImage(PhotoGroupName[0])}>
              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                             : <span className="comment-text">Save</span>}
              </Button>}
              {this.state.PhotoError ? <div className="error media-imgerror " style={{margin: 0}} >Photo upload unsuccessful.</div> : ''}  */}
            </ModalFooter>
          </Modal>

          <Modal size="lg" isOpen={this.state.AddNewUser} toggle={() => this.AddNewUserModal(0)} className={this.props.className}>
          <ModalHeader toggle={() => this.AddNewUserModal(0)} >{this.state.id == 0 ? Labels.AddUser : 'Edit User'}</ModalHeader>
          <ModalBody className='User-info-modal-main'>
          <UserInfo userId={this.state.id} saved={this.AddNewUserModal} props={this.props}/>
          </ModalBody>
      
        </Modal>
      </div>

    );
  }

}

export default Reseller;
