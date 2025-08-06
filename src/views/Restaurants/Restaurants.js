import React, { Component } from 'react';
import { FormGroup, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import 'sweetalert/dist/sweetalert.css';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
//import DropdownButton from 'react-bootstrap/DropdownButton';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import MUIDataTable, { ExpandButton } from "mui-datatables";
import Dropdown from 'react-bootstrap/Dropdown';
import Pagination from "react-js-pagination";
import * as EnterpriseService from '../../service/Enterprise';
import * as ExternalService from '../../service/ExternalService';
import * as EnterpriseUserService from '../../service/EnterpriseUsers';
import * as EnterpriseMenuService from '../../service/EnterpriseMenu';
import * as UserService from '../../service/User';
import * as CountryService from '../../service/Country';
import * as AccountService from '../../service/Account';
import * as Utilities from '../../helpers/Utilities';
import Constants from '../../helpers/Constants';
import Config from '../../helpers/Config';
import Loader from 'react-loader-spinner';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import moment from 'moment';
import GlobalData from '../../helpers/GlobalData'
import Labels from '../../containers/language/labels';
import S3Browser from '../PhotoGallery/PhotoGallery'
import arrayMove from 'array-move';

const $ = require('jquery');
const pageSize = 10 //GlobalData.restaurants_data.Supermeal_dev.PageSize;

$.DataTable = require('datatables.net');

const SortableItem = sortableElement(({ value }) => <li className="sortableHelper">{value}</li>);

const SortableContainer = sortableContainer(({ items }) => {

  if (items === undefined) { return; }
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} style={{ zIndex: 100000 }} index={index} value={Utilities.SpecialCharacterDecode(value.name)} />
      ))}
    </ul>
  );
});

class Restaurants extends Component {

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ sortServices }) => ({
      sortServices: arrayMove(sortServices, oldIndex, newIndex),
    }));

    this.GetUpdatedSort(this.state.sortServices);

  };

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      showAlert: false,
      alertModelText: '',
      alertModelTitle: '',
      ConfirmationModelText: '',
      deleteComfirmationModelType: '',
      showConfirmation: false,
      modalVisible: false,
      activePage: 0,
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
      ImpersonateId: 0,
      UserObj: {},
      hasParent: true,
      ExternalService: false,
      ImageGallery: false,
      shouldRefresh: true,
      currentFolder: "",
      parentsEnterprises: [],
      childEnterprises:[],
      childLoader: true,
      width: window.innerWidth,
      isExpandable: true,
      SelectedEnterprise: {},
      Sort: false,
      sortServices: [],
      SortServiceIdCsv: "",
      ellipsisToggle: false
    };

    this.GetEnterprises = this.GetEnterprises.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.credibilityBalanceLimitUpdate = this.credibilityBalanceLimitUpdate.bind(this);
    this.UpdateCredibilityBalanceLimit = this.UpdateCredibilityBalanceLimit.bind(this);
    this.CancleModal = this.CancleModal.bind(this);
    this.UpdateCredibilityBalanceLimitApi = this.UpdateCredibilityBalanceLimitApi.bind(this);
    this.SearchEnterprise = this.SearchEnterprise.bind(this);
    this.ChurnedEnterprise = this.ChurnedEnterprise.bind(this);
    this.ShowChurnedConfirmation = this.ShowChurnedConfirmation.bind(this);

    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {

      let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))

      this.state.UserObj = userObj;
      if (Number(localStorage.getItem(Constants.Session.ENTERPRISE_ID)) !== userObj.Enterprise.Id) {
        localStorage.setItem(Constants.Session.ENTERPRISE_ID, userObj.Enterprise.Id);
        localStorage.setItem(Constants.Session.ENTERPRISE_NAME, userObj.Enterprise.Name);
        this.props.history.push('/businesses');
      }

    }



  }

  loading = () => <div className="res-loader-wraper" style={{ position: 'relative' }}>
    <div className="loader-menu-inner">
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
      <div className="loading-label">Loading.....</div>
    </div>
  </div>


  //#region  Confirmation Model Generation

  SetChurnedStates(enterpriseId, name, typeId, isChurned, selectedEnterprise) {

    this.setState({
      ChurnedModal: !this.state.ChurnedModal,
      SelectedEnterpriseId: enterpriseId,
      SelectedEnterpriseTypeId: typeId,
      SelectedEnterpriseName: name,
      SelectedEnterprise: selectedEnterprise,
      IsChurned: isChurned
    });
  }

  ChurnedConfirmation() {

    this.setState({
      ChurnedModal: !this.state.ChurnedModal, deleteComfirmationModelType: 'ch', showConfirmation: true,
      ConfirmationModelText: !this.state.IsChurned ? 'Are you sure you want to unchurned ' + this.state.SelectedEnterpriseName : 'Once you churned the restaurant ' + this.state.SelectedEnterpriseName + ' will be removed from the superbutler.'
    })

  }

  DeleteConfirmation(enterpriseId, name, typeId, enterprise) {

    this.setState({SelectedEnterprise: enterprise, SelectedEnterpriseId: enterpriseId, SelectedEnterpriseTypeId: typeId, SelectedEnterpriseName: name, deleteComfirmationModelType: 'de', showConfirmation: true, ConfirmationModelText: '"' + name + '" will be deleted permanently.' })

  }

  ActivateConfirmation(enterpriseId, name, typeId, enterprise) {

    this.setState({SelectedEnterprise: enterprise, SelectedEnterpriseId: enterpriseId, SelectedEnterpriseTypeId: typeId, SelectedEnterpriseName: name, deleteComfirmationModelType: 'ae', showConfirmation: true, ConfirmationModelText: '"' + name + '" will be Activated.' })

  }

  SuspendConfirmation(enterpriseId, name, typeId, enterprise) {

    this.setState({ SelectedEnterprise: enterprise, SelectedEnterpriseId: enterpriseId, SelectedEnterpriseTypeId: typeId, SelectedEnterpriseName: name, deleteComfirmationModelType: 'se', showConfirmation: true, ConfirmationModelText: '"' + name + '" will be Suspended.' })

  }

  HandleOnConfirmation() {

    let type = this.state.deleteComfirmationModelType;

    switch (type.toUpperCase()) {

      case 'DE':
        this.DeleteEnterprise();
        break;
      case 'AE':
        this.ActivateEnterprise();
        break;
      case 'SE':
        this.SuspendEnterprise();
        break;
      case 'CH':
        this.ChurnedEnterprise();
        break;
      default:
        break;
    }

  }

  //#endregion


  //#region Models and alerts Html

  GenerateSweetConfirmationWithCancel() {
    return (
      <SweetAlert
        show={this.state.showConfirmation}
        title="Are you sure?"
        text={this.state.ConfirmationModelText}
        showCancelButton
        onConfirm={() => { this.HandleOnConfirmation() }}
        onCancel={() => {
          this.setState({ showConfirmation: false });
        }}
        onEscapeKey={() => this.setState({ showConfirmation: false })}
        onOutsideClick={() => this.setState({ showConfirmation: false })}
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

  GenerateSortModel() {

    if (!this.state.Sort) {
      return ('');
    }

    return (

      <Modal isOpen={this.state.Sort} toggle={this.SortModal} className={this.props.className}>
        <ModalHeader>Sort items</ModalHeader>
        <ModalBody>
          <div className="m-b-15">Use mouse or finger to drag items and sort their positions.</div>
          <div className="sortable-wrap sortable-item sortable-new-wrap">

            <SortableContainer
              items={this.state.sortServices}
              onSortEnd={this.onSortEnd}
              hideSortableGhost={true} >

            </SortableContainer>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => this.SortModal()}>Cancel</Button>
          <Button color="primary" onClick={() => this.UpdateCategorySort()}>
          {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                             : <span className="comment-text">Save</span>}

            </Button>
        </ModalFooter>
      </Modal>

    )

  }



  GenerateChurnedModel() {

    if (!this.state.ChurnedModal) {
      return ('');
    }

    return (
      <Modal isOpen={this.state.ChurnedModal} className="modal-md">
        <ModalHeader >{(this.state.IsChurned ? 'Churned ' : 'Unchurned ') + this.state.SelectedEnterpriseName} </ModalHeader>
        <ModalBody className="padding-0">
          <AvForm onValidSubmit={this.ShowChurnedConfirmation}>
            <div className="padding-20">
              <FormGroup className="modal-form-group">
                <div className="name-field form-group">
                  <AvField errxorMessage="This is a required field" name="txtChurnedNotes" type="textarea" value={this.state.ChurnedNotes} className="form-control" required placeholder="Reason" />

                </div>
              </FormGroup>

              <br />  <br />  <br />
            </div>
            <FormGroup className="modal-footer">

              <div color="secondary" className='btn btn-secondary' onClick={() => this.SetChurnedStates(false)}>Cancel</div>
              <Button color="primary">{this.state.IsChurned ? 'Churned' : 'Unchurned'}</Button>
            </FormGroup>
          </AvForm>
        </ModalBody>
      </Modal>
    );

  }


  //#endregion



  SortModal() {
    this.setState({
      Sort: !this.state.Sort,
    });
  }

  SetSortServices() {

    let childEnterprises = this.state.childEnterprises;

    let services = []

    for (var i = 0; i < childEnterprises.length; i++) {

      services.push({ "id": childEnterprises[i].Id, "name": childEnterprises[i].Name, "SortOrder": childEnterprises[i].SortOrder });
    }

    services.sort((x, y) => ((x.SortOrder === y.SortOrder) ? 0 : ((x.SortOrder > y.SortOrder) ? 1 : -1)))

    this.setState({ sortServices: services });

  }

  GetUpdatedSort(services) {

    let sortCSV = '';
    services = this.state.sortServices

    for (var u = 0; u < services.length; u++) {
      sortCSV += services[u].id + Config.Setting.csvSeperator;
    }

    sortCSV = Utilities.FormatCsv(sortCSV, Config.Setting.csvSeperator);

    this.setState({ SortServiceIdCsv: sortCSV })
  }

  //#region  api calling



  UpdateServiceSort = async () => {

    // if(this.state.IsSave) return;
    //  this.setState({IsSave:true})

    // let csv = this.state.SortServiceIdCsv;

    // let isUpdated = await CategoryService.UpdateSort(csv);
    //   this.setState({IsSave:false})
    // if (isUpdated === true) {
    //   this.GetEnterprises();
    //   this.setState({ Sort: false })

    // }

  }



  GetEnterprises = async (pageNumber, pageSize, searchKeyword) => {
    this.state.FilterEnterprises = this.state.parentsEnterprises.length > 1 ? this.state.parentsEnterprises : this.state.FilterEnterprises;
    pageNumber = pageNumber + 1
    // let sessionStart = moment(localStorage.getItem(Constants.Session.SESSION_START_AT));
    // let sessionExpire = moment(new Date());
    // let isSessionExpire = sessionExpire.diff(sessionStart, 'hours') >= Config.Setting.SessionExpiry;

    // if (isSessionExpire || Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.SESSION_START_AT))) {
    //   this.setState({ ShowLoader: false });
    //   return;
    // }

    this.setState({ ShowLoader: true });
    let data = await EnterpriseService.GetAllParentEnterprise(pageNumber, pageSize, searchKeyword, this.state.ChkChurned, this.state.ChkAll);
    if (data === null) {
      Utilities.ClearSession();
      window.location.href = "/login"
    }

    if (data.length !== 0) {

      var parentsEnterprises =  data.filter((p) =>
        {
          var index = this.state.FilterEnterprises.findIndex(e => e.Id == p.Id)
          if(index != -1) p.ChildEnterprises = this.state.FilterEnterprises[index].ChildEnterprises;
          return p.EnterpriseId != 0

        })
      this.setState({ Enterprises: parentsEnterprises, FilterEnterprises: data.length > 1 ? parentsEnterprises : this.state.FilterEnterprises , totalRecord: data[data.length - 1].Id, parentsEnterprises: parentsEnterprises, ShowLoader: false,  });
      return
    }

    this.setState({ ShowLoader: false });
    // this.GetAllEnterprises();

  }


  // GetAllEnterprises = async (pageNumber, pageSize) => {

  //   let data = await EnterpriseService.GetAll(1, 5000);
  //   this.setState({ AllEnterprises: data, Enterprises: data, ShowLoader: false });
  //   // this.SearchEnterprise(this.state.FilterText);
  // }


  Impersonate = async (enterpriseId, enterpriseName) => {

    this.setState({isExpandable: false});
    this.setState({ ImpersonateId: enterpriseId });
    localStorage.setItem(Constants.Session.ENTERPRISE_ID, enterpriseId);
    localStorage.setItem(Constants.Session.ENTERPRISE_NAME, enterpriseName);
    localStorage.removeItem(Constants.Session.PRIVACY_SWITCH)
    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.ENTERPRISE_ID))) {

      let allEnterpriseUsers = await EnterpriseUserService.GetAll(Number(enterpriseId));

      if (allEnterpriseUsers.length === 0) {
        this.setState({ ImpersonateId: 0 })
        return;
      }

      let enterpriseUsers = allEnterpriseUsers.filter(user => {
        return (user.RoleLevel === Constants.Role.ENTERPRISE_ADMIN_ID) && !user.IsDeleted && user.IsActive
      });
      if(this.state.UserObj.RoleLevel == Constants.Role.STAFF_ID){
        enterpriseUsers = allEnterpriseUsers.filter(user => {
          return (user.RoleLevel === Constants.Role.STAFF_ID) && !user.IsDeleted && user.IsActive
        });
      }
      let enterpriseUser = enterpriseUsers[0];
      let loginUser = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT));

      localStorage.setItem(loginUser.RoleLevel === Constants.Role.ENTERPRISE_ADMIN_ID && loginUser.RoleLevel !== Constants.Role.ENTERPRISE_MANAGER_ID ? Constants.Session.PARENT_OBJECT : Constants.Session.ADMIN_OBJECT, JSON.stringify(loginUser));

      let membershipUser = await UserService.GetByMembershipId(enterpriseUser.MembershipUserId);
      membershipUser.Impersonator = enterpriseUser.MembershipUserId;
      membershipUser.RoleLevel = Utilities.HasPermission(loginUser.RoleLevel, Constants.Permission.ENTERPRISE_MANAGER_IMPERSONATE) ? Constants.Role.ENTERPRISE_MANAGER_ID : membershipUser.RoleLevel;
      localStorage.setItem(Constants.Session.IMPERSONATORID, enterpriseUser.MembershipUserId);
      if (localStorage.getItem(Constants.Session.PARENTIMPERSONATORID) === null) {
        localStorage.setItem(Constants.Session.PARENTIMPERSONATORID, enterpriseUser.MembershipUserId);
      }
      localStorage.setItem(Constants.Session.USER_OBJECT, JSON.stringify(membershipUser));
      localStorage.setItem(Constants.Session.ENTERPRISE_TYPE_ID, membershipUser.Enterprise.EnterpriseTypeId);
      let json = await EnterpriseMenuService.GetEnterpriseJson();
      let countyObj = await CountryService.getCountry(membershipUser.EnterpriseRestaurant.CountryId);
      localStorage.setItem(Constants.Session.COUNTRY_CONFIGURATION, JSON.stringify(countyObj))

      if (membershipUser.Enterprise.EnterpriseTypeId == 19) {
        window.location.href = "/menu/build-menu";
      } else if (membershipUser.Enterprise.EnterpriseTypeId == 15) {
        window.location.href = "/support";
      }
      else {
        window.location.href = "/dashboard";
      }

    }
  }

  ShowChurnedConfirmation(event, values) {
    let enterprise = EnterpriseService.Enterprise;
    enterprise.EnterpriseDetail.EnterpriseId = this.state.SelectedEnterpriseId;
    enterprise.EnterpriseTypeId = this.state.SelectedEnterpriseTypeId;
    enterprise.IsChurned = this.state.IsChurned;
    enterprise.ChurnedNotes = values.txtChurnedNotes;

    this.setState({ ChurnedEnterprise: enterprise })
    this.ChurnedConfirmation();
  }


  ReloadChildEnterprises = () => {

    if(this.state.SelectedEnterprise.ParentId != undefined) {

      var index =  this.state.parentsEnterprises.findIndex(v => v.Id == this.state.SelectedEnterprise.ParentId)

      if(index != -1) this.state.parentsEnterprises[index].ChildEnterprises = [];

      this.getChildEnterprises(this.state.SelectedEnterprise.ParentId)
    }

  }


  ChurnedEnterprise = async () => {

    this.setState({ ChurnedModal: false });

    let ChurnedMessage = await EnterpriseService.Churned(this.state.ChurnedEnterprise)
    let name = this.state.SelectedEnterpriseName;

    if (ChurnedMessage === '1') {
      this.ReloadChildEnterprises();
      this.setState({ SelectedUserId: 0, showConfirmation: false });
      // this.GetEnterprises(this.state.activePage, pageSize);
      this.setState({ showAlert: true, alertModelTitle: (this.state.IsChurned ? "Churned!" : "Unchurned!"), alertModelText: name + " has been " + (this.state.IsChurned ? "churned" : "unchurned") + " successfully." });
      return;
    }

    let message = ChurnedMessage === '0' ? '"' + name + " " + (this.state.IsChurned ? "churned" : "unchurned") + "  failed." : ChurnedMessage;

    this.setState({ showAlert: true, alertModelTitle: 'Error!', alertModelText: message });

    // Utilities.notify(name + "  " + (this.state.IsChurned ? "churned" : "unchurned") +"  failed.", "e");

  }

  DeleteEnterprise = async () => {

    this.setState({ showConfirmation: false });

    let DeletedMessage = "0";

    if(this.state.SelectedEnterprise.IsExternal){
      DeletedMessage = await ExternalService.Delete(this.state.SelectedEnterpriseId, this.state.SelectedEnterpriseTypeId)
    } else
    {
      DeletedMessage = await EnterpriseService.Delete(this.state.SelectedEnterpriseId, this.state.SelectedEnterpriseTypeId)
    }

    let name = this.state.SelectedEnterpriseName;

    if (DeletedMessage === '1') {
      setTimeout(() => {
      this.ReloadChildEnterprises();
      this.setState({ SelectedUserId: 0, showConfirmation: false });
      // this.GetEnterprises(this.state.activePage, pageSize);
      this.setState({ showAlert: true, alertModelTitle: 'Deleted!', alertModelText: 'Enterprise ' + name + ' deleted successfully' });
    }, 1000);
      return;
    }

    let message = DeletedMessage === '0' ? '"' + name + '" not deleted successfully' : DeletedMessage;

    //this.setState({SelectedCategoryId: 0});
    this.setState({ showAlert: true, alertModelTitle: 'Error!', alertModelText: message });

  }


  SuspendEnterprise = async () => {

    this.setState({ showConfirmation: false });
    let SuspendMessage = "0";

    if(this.state.SelectedEnterprise.IsExternal){

      SuspendMessage = await ExternalService.ActiveSuspend(this.state.SelectedEnterpriseId, this.state.SelectedEnterpriseTypeId, false)

    } else

    {
      SuspendMessage = await EnterpriseService.ActiveSuspend(this.state.SelectedEnterpriseId, this.state.SelectedEnterpriseTypeId, false)

    }


    let name = this.state.SelectedEnterpriseName;

    if (SuspendMessage === '1') {

      this.ReloadChildEnterprises()
      this.setState({ SelectedEnterpriseId: 0, showConfirmation: false});
      // setTimeout(() => {
      //   this.GetEnterprises(this.state.activePage, pageSize);
      // }, 1000);
        this.setState({ showAlert: true, alertModelTitle: 'Suspended!', alertModelText: 'Enterprise  ' + name + ' suspended successfully' });
      return;
    }

    let message = SuspendMessage === '0' ? '"' + name + '" not suspended successfully' : SuspendMessage;
    this.setState({ showAlert: true, alertModelTitle: 'Error!', alertModelText: message });

  }

  ActivateEnterprise = async () => {

    this.setState({ showConfirmation: false });

    let ActivateMessage = "0";

    if(this.state.SelectedEnterprise.IsExternal){

      ActivateMessage = await ExternalService.ActiveSuspend(this.state.SelectedEnterpriseId, this.state.SelectedEnterpriseTypeId, true)

    } else

    {
      ActivateMessage = await EnterpriseService.ActiveSuspend(this.state.SelectedEnterpriseId, this.state.SelectedEnterpriseTypeId, true);

    }

    let name = this.state.SelectedEnterpriseName;

    if (ActivateMessage === '1') {

      this.ReloadChildEnterprises()
      this.setState({ SelectedUserId: 0, showConfirmation: false });
    //   setTimeout(() => {
    //   this.GetEnterprises(this.state.activePage, pageSize);
    // }, 1000);
      this.setState({ showAlert: true, alertModelTitle: 'Activated!', alertModelText: 'Enterprise ' + name + ' activated successfully' });
      return;
    }

    let message = ActivateMessage === '0' ? '"' + name + '" not activated successfully' : ActivateMessage;

    this.setState({ showAlert: true, alertModelTitle: 'Error!', alertModelText: message });

  }


  UpdateCredibilityBalanceLimitApi = async (accountId, limit) => {

    let message = await AccountService.Update(accountId, limit);

    if (message === '1') {
      this.GetEnterprises(this.state.activePage, pageSize);

      this.setState({ modalVisible: false })

      Utilities.notify("Updated successfully.", "s");
    }
    else
      Utilities.notify("Update failed.", "e");

  }

  UpdateCredibilityBalanceLimit(event, values) {

    this.UpdateCredibilityBalanceLimitApi(this.state.SelectedAccountId, values.txtCredibilityLimit);
  }

  GetEnterpriseType = (type) => {

    var enterpriseType = "";

    if (type == 1)
      enterpriseType = "Food Portal";

    if (type == 2)
      enterpriseType = "Agent";

    if (type == 3)
      enterpriseType = "Room Service";

    if (type == 4)
      enterpriseType = "Mini Bar";

    if (type == 5)
      enterpriseType = "Hotel";

    if (type == 6)
      enterpriseType = "Restaurant";

    if (type == 7)
      enterpriseType = "Shop";

    if (type == 10)
      enterpriseType = "Laundry";

    if (type == 11)
      enterpriseType = "SPA & Fitness";

    if (type == 12)
      enterpriseType = "Car Rental";

    if (type == 13)
      enterpriseType = "Travel & Tour";

    if (type == 14)
      enterpriseType = "Meeting & Events";

    if (type == 15)
      enterpriseType = "Housekeeping";

    if (type == 16)
      enterpriseType = "Chat Support";

    if (type == 17)
      enterpriseType = "Room Booking";

    if (type == 18)
      enterpriseType = "Luggage Storage";

    if (type == 19)
      enterpriseType = "Concierge Chat";

  if (type == 20)
      enterpriseType = "Restaurant & Cafe"

    return enterpriseType;

  }

  //#endregion


  //#region render Html


  LoadEnterpriseHtml(enterprise) {
    if (((enterprise.Id === 0 || enterprise.Id === undefined) || (enterprise.EnterpriseId != undefined && enterprise.EnterpriseId == 0)))
      return;
    let userObj = {}
    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))

    }

    let enterpriseName = Utilities.SpecialCharacterDecode(enterprise.Name);
    let dvActiveSuspend = enterprise.IsActive ? <span className="link-t-c m-b-0 statusChangeLink m-r-20" onClick={() => this.SuspendConfirmation(enterprise.Id, enterpriseName, enterprise.EnterpriseTypeId, enterprise)}><i className="fa fa-ban" aria-hidden="true"></i><span>{Labels.Suspend}</span></span> : <span className="m-b-0 statusChangeLink  m-r-20" onClick={() => this.ActivateConfirmation(enterprise.Id, enterpriseName, enterprise.EnterpriseTypeId, enterprise)}><i className="fa fa-check" aria-hidden="true"></i><span>{Labels.Active}</span></span>;
    return (

      <div className={`admin-restaurant-wrap ${(enterprise.ParentId != 0 && this.state.hasParent) && this.state.UserObj.Enterprise.EnterpriseTypeId != 5  && "admin-nested-row"}`} key={enterprise.Id}>
        <div className="admin-restaurant-row">
          <div className="image-wrap" onClick={(e) => this.SetSession(enterprise.Id, enterpriseName, enterprise.EnterpriseTypeId, enterprise.IsExternal)}>
            <img src={Utilities.generatePhotoLargeURL(enterprise.PhotoName, true, false)} />
          </div>
          <div className="rest-main-inner-row">
            <div className="rest-name-heading" onClick={(e) => this.SetSession(enterprise.Id, enterpriseName, enterprise.EnterpriseTypeId, enterprise.IsExternal )}>{enterpriseName}</div>
            <div className="my-order-new-row">

              <div className="left-row">
                <div className="my-order-left">
                  {!enterprise.IsChurned ?
                    <div className='d-flex'>
                      {/* <div className='flex-1' style={{ flex: 1 }}>
                                <div className="my-order-label">Balance</div>
                                <div className="my-order-label-sub"><span>{Config.Setting.currencySymbol + enterprise.Account.CurrentBalance}</span></div>
                                </div> */}
                      <div className='flex-1' style={{ flex: 1 }}>
                        <div className="my-order-label-sub text-dark">{Labels.Type}</div>
                        <div className="my-order-label bold"><span>{Utilities.GetEnterpriseType(enterprise.EnterpriseTypeId)}</span></div>
                      </div>
                    </div>
                    : ""
                  }
                </div>
                <div className="my-order-right">
                  {

                    enterprise.IsChurned ?
                      <div>
                        <div className="my-order-label-sub text-dark">{Labels.Churned}</div>
                        <div className="my-order-label bold"><span>{enterprise.ChurnedNotes}</span></div>
                      </div>
                      :

                      this.state.HasTopUpPermission ?
                        <div>
                          {
                            enterprise.ParentId != 0 &&
                            //  <div>
                            //   <div className="my-order-label-sub text-dark">{Labels.Credibility_Limit}</div>
                            //   <div className="my-order-label bold"><span>{Config.Setting.currencySymbol + enterprise.Account.CrBalanceLimit}</span><span className="link-t-c m-l-10" onClick={(e) => this.credibilityBalanceLimitUpdate(enterprise.Account.Id, enterpriseName, enterprise.Account.CrBalanceLimit)} >{Labels.Update}</span></div>
                            // </div>

                            <div className=''>
                              <div className="my-order-label-sub text-dark">Hotel Group</div>
                              <div className="my-order-label bold"><span>{enterprise.ParentName}</span></div>
                            </div>
                          }
                        </div>
                        :
                        ""
                  }
                </div>

              </div>


              <div className={`right-row ${this.state.UserObj.Enterprise.EnterpriseTypeId != 5? "show-web" : "services-imperso"}`}>
                <div className="my-order-left center-s-i">
                  {!enterprise.IsChurned ?
                    <div className="my-order-label-sub">
                      {enterprise.EnterpriseTypeId == 5 &&  (this.state.UserObj.RoleLevel == Constants.Role.SYSTEM_ADMIN_ID || this.state.UserObj.RoleLevel == Constants.Role.SYSTEM_OPERATOR_ID || this.state.UserObj.RoleLevel == Constants.Role.RESELLER_ADMIN_ID || this.state.UserObj.RoleLevel == Constants.Role.RESELLER_MODERATOR_ID) &&
                        <span class="link-t-c"><span onClick={() => this.AddNewRestaurant(enterprise.Id, enterprise.EnterpriseTypeId)}><i className='fa fa-plus'></i> Add Service</span>   </span>}
                      {(this.state.HasEnterpriseImpersonatePermission || enterprise.ParentId === userObj.Enterprise.Id) && enterprise.Id !== userObj.Enterprise.Id  && !enterprise.IsExternal && this.state.UserObj.RoleLevel != Constants.Role.STAFF_ID?
                        <span className="link-t-c" onClick={() => this.Impersonate(enterprise.Id, enterpriseName)}><i className="fa fa-user-plus" aria-hidden="true"></i><span>{Labels.Impersonate}</span> {this.state.ImpersonateId === enterprise.Id ? <span className="imp-lodar"> <Loader type="Oval" color="#ed0000" height={25} width={25} /> </span> : ""}  </span> : ""}

                      {this.state.HasEnterpriseSuspendPermission ? dvActiveSuspend : ""}
                      {enterprise.IsExternal && (this.state.UserObj.RoleLevel == Constants.Role.SYSTEM_ADMIN_ID || this.state.UserObj.RoleLevel == Constants.Role.SYSTEM_OPERATOR_ID || this.state.UserObj.RoleLevel == Constants.Role.RESELLER_ADMIN_ID || this.state.UserObj.RoleLevel == Constants.Role.RESELLER_MODERATOR_ID) ? <span className="link-t-c m-b-0 statusChangeLink m-r-20" onClick={() => this.DeleteConfirmation(enterprise.Id, enterpriseName, enterprise.EnterpriseTypeId, enterprise)}><i className="fa fa-trash-o" aria-hidden="true"></i><span>{Labels.Delete}</span></span> : ''}
                      {this.state.HasEnterpriseChurnedPermission && !enterprise.IsExternal ? <span className="link-t-c" onClick={() => this.SetChurnedStates(enterprise.Id, enterpriseName, enterprise.EnterpriseTypeId, 1, enterprise)}><i className="fa fa-thumbs-o-down" aria-hidden="true"></i><span>{Labels.Mark_As_Churned}</span></span> : ""}

                    </div>
                    :
                    <div className="my-order-label-sub">
                      {this.state.HasEnterpriseChurnedPermission && !enterprise.IsExternal? <span className="link-t-c" onClick={() => this.SetChurnedStates(enterprise.Id, enterpriseName, enterprise.EnterpriseTypeId, 0, enterprise)}><i className="fa fa-thumbs-o-up" aria-hidden="true"></i><span>{Labels.UnChurned}</span></span> : ""}
                      {this.state.HasEnterpriseDeletePermission || enterprise.IsExternal? <span className="link-t-c" onClick={() => this.DeleteConfirmation(enterprise.Id, enterpriseName, enterprise.EnterpriseTypeId, enterprise)}><i className="fa fa-trash-o" aria-hidden="true"></i><span>{Labels.Delete}</span></span> : ""}

                    </div>
                  }
                </div>

              </div>

            </div>
          </div>
          {
            enterprise.EnterpriseTypeId == 5 &&
            (this.state.HasEnterpriseSuspendPermission ||
              this.state.HasEnterpriseDeletePermission ||
              this.state.HasEnterpriseImpersonatePermission ||
              this.state.HasEnterpriseChurnedPermission && (enterprise.ParentId === userObj.Enterprise.Id || userObj.RoleLevel === 1)) ?

              <div className="user-data-action-btn-res right-dropdown">
                <div className="show-res" onClick={()=>this.setState({isExpandable: false, ellipsisToggle: !this.state.ellipsisToggle})}>
                  <Dropdown>
                    <Dropdown.Toggle  variant="secondary" id="dropdown-basic">
                      <span>
                        <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                      </span>
                      <span>
                        {Labels.Options}
                      </span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>

                      {!enterprise.IsChurned ?

                        <div>
                          {enterprise.EnterpriseTypeId == 5 &&
                            (this.state.UserObj.RoleLevel == Constants.Role.SYSTEM_ADMIN_ID || this.state.UserObj.RoleLevel == Constants.Role.SYSTEM_OPERATOR_ID || this.state.UserObj.RoleLevel == Constants.Role.RESELLER_ADMIN_ID || this.state.UserObj.RoleLevel == Constants.Role.RESELLER_MODERATOR_ID) &&
                            <span class="link-t-c m-b-0 statusChangeLink m-r-20" onClick={() => this.AddNewRestaurant(enterprise.Id, enterprise.EnterpriseTypeId)}><span ><i className='fa fa-plus'></i>Add Service</span>   </span>}
                          {(this.state.HasEnterpriseImpersonatePermission || enterprise.ParentId === userObj.Enterprise.Id) && enterprise.Id !== userObj.Enterprise.Id && !enterprise.IsExternal &&
                            (userObj.RoleLevel != Constants.Role.STAFF_ID) ?

                            <span className="link-t-c m-b-0 statusChangeLink m-r-20" onClick={() => this.Impersonate(enterprise.Id, enterpriseName)}><i className="fa fa-user-plus" aria-hidden="true"></i> {Labels.Impersonate}
                            {this.state.ImpersonateId === enterprise.Id ? <span className="imp-lodar"> <Loader type="Oval" color="#ed0000" height={25} width={25} /> </span>
                              :

                              ""}</span> : ''}
                          {this.state.HasEnterpriseSuspendPermission ? dvActiveSuspend : ''}
                          {enterprise.IsExternal? <span className="link-t-c m-b-0 statusChangeLink m-r-20" onClick={() => this.DeleteConfirmation(enterprise.Id, enterpriseName, enterprise.EnterpriseTypeId, enterprise)}><i className="fa fa-trash-o" aria-hidden="true"></i><span>{Labels.Delete}</span></span> : ''}
                          {this.state.HasEnterpriseChurnedPermission && !enterprise.IsExternal ? <span className="link-t-c m-b-0 statusChangeLink m-r-20" onClick={() => this.SetChurnedStates(enterprise.Id, enterpriseName, enterprise.EnterpriseTypeId, 1, enterprise)}><i className="fa fa-thumbs-o-down" aria-hidden="true"></i><span>{Labels.Mark_As_Churned}</span></span> : ''}
                        </div>
                        :
                        <div>
                          {this.state.HasEnterpriseChurnedPermission && !enterprise.IsExternal ? <span className="link-t-c m-b-0 statusChangeLink m-r-20" onClick={() => this.SetChurnedStates(enterprise.Id, enterpriseName, enterprise.EnterpriseTypeId, 0, enterprise)}><i className="fa fa-thumbs-o-up" aria-hidden="true"></i><span>{Labels.UnChurned}</span></span> : ''}
                          {this.state.HasEnterpriseDeletePermission || enterprise.IsExternal? <span className="link-t-c m-b-0 statusChangeLink m-r-20" onClick={() => this.DeleteConfirmation(enterprise.Id, enterpriseName, enterprise.EnterpriseTypeId, enterprise)}><i className="fa fa-trash-o" aria-hidden="true"></i><span>{Labels.Delete}</span></span> : ''}
                        </div>
                      }
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

              </div> : ''}
        </div>

      </div>
    )

  }


  RenderEnterprise = (enterprises) => {

    if (this.state.ShowLoader) {
      return this.loading();
      // return;
    }

    var htmlEnterprise = [];

    if (enterprises === null || (enterprises.length == 1 && enterprises[0].EnterpriseTypeId == 0)) {
      return <div className="no-record">{Labels.No_Record_Found}</div>
    }

    for (var i = 0; i < enterprises.length; i++) {

      if((this.state.UserObj.Enterprise.EnterpriseTypeId == 5 &&  !this.state.childEnterprises[i].IsChurned &&  this.state.childEnterprises[i].IsActive) || this.state.UserObj.RoleLevel == Constants.Role.SYSTEM_ADMIN_ID || this.state.UserObj.RoleLevel == Constants.Role.SYSTEM_OPERATOR_ID)
        {
          htmlEnterprise.push(this.LoadEnterpriseHtml(enterprises[i], i));
        }
    }

    return (

      <div>{htmlEnterprise.map((enterpriseHtml) => enterpriseHtml)}</div>

    )
  }


  //#endregion

  credibilityBalanceLimitUpdate(accountId, enterpriseName, limit) {
    this.setState({
      modalVisible: !this.state.modalVisible,
      SelectedAccountId: accountId,
      SelectedEnterpriseName: enterpriseName,
      SelectedCredibilityBalanceLimitUpdate: limit,

    });
  }
  ExternalServiceModal() {
    this.setState({
      ExternalService: !this.state.ExternalService,
    })
  }
  ImageGalleryModal() {
    this.setState({
      ImageGallery: !this.state.ImageGallery,
    })
  }


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


  SetSession(enterpriseId, enterpriseName, enterpriseType, isExternalService) {

    if(isExternalService) {

      this.props.history.push(`/external-service/${enterpriseId}`);
      return;
    }

    if (!this.state.HasEnterpriseCreatePermission) return;

    localStorage.setItem(Constants.Session.ENTERPRISE_ID, enterpriseId);
    localStorage.setItem(Constants.Session.ENTERPRISE_NAME, enterpriseName);
    localStorage.setItem(Constants.Session.ENTERPRISE_TYPE_ID, enterpriseType);
    this.setState({ toRestaurant: true });
    // }
  }

  RefreshS3Files = (shouldRefresh) => {

    if (!shouldRefresh) this.state.currentFolder = "";

    if (this.state.viewS3ImageModal)
      this.setState({ viewS3ImageModal: false })


    this.setState({ shouldRefresh: shouldRefresh })
  }


  toggleViewS3ImageModal = (image) => {
    this.setState({
      viewS3ImageModal: !this.state.viewS3ImageModal,
      btnShow: false,
      imageToOpen: image,
      currentFolder: image ? image.parentId : ""
    })
  }


  SetSelectedMedia = (media) => {
    this.state.selectedMedia = media;
    this.state.Image = media.length > 0 ? media : null;
    var btnNext = document.getElementById("btnNext");

    if (btnNext) {
      if (media.length > 0) {
        btnNext.style.display = 'block';
      } else {
        btnNext.style.display = 'none';
      }
    }

  }


  ValidateFiles = (files) => {

    this.setState({ ignoredFiles: files });

  }

  SearchEnterprise(e) {

    let value = e.target.value
    value = value.toString().trim();
    if (value === '') {

      if (this.state.FilterText !== '')
        this.GetEnterprises(this.state.activePage, pageSize);

      this.setState({ FilterText: value });
      return;
    }

    if (e.keyCode === 13) {
      this.GetEnterprises(0, pageSize, value);

    }

    this.setState({ FilterText: value });
    // if()

    // this.GetEnterprises(this.state.activePage,pageSize,value);

    // this.setState({FilterText: value});
    // let searchText = value;
    // let filteredData = []
    // let allEnterprises = this.state.AllEnterprises;
    // let enterprises = this.state.Enterprises;
    // let count =0;

    // if(searchText.toString().trim() === ''){

    //  this.setState({FilterEnterprises: this.state.Enterprises});
    //  this.setState({ShowLoader : false});
    //  return;
    // }



    // filteredData = this.state.AllEnterprises.filter((enterprise) => {

    //   let arr = searchText.toUpperCase().split(' ');
    //   let isExists = false;

    //   for (var t = 0; t <= arr.length; t++) {

    //       if (enterprise.Name.toUpperCase().indexOf(arr[t]) != -1) {
    //           isExists = true;
    //           count++;
    //           break;
    //       }

    //   }

    //   if(count > pageSize)
    //   {
    //      return;
    //   }

    //   return isExists
    // })

    // this.setState({FilterEnterprises: filteredData});
    // this.setState({ShowLoader : false});


  }



  FilterCheckbox(e, control) {

    let value = e.target.value == 'false' ? true : false

    switch (control.toUpperCase()) {

      case 'C':
        this.state.ChkChurned = value;
        // this.setState({ChkChurned : value});
        break;

      case 'A':
        this.state.ChkAll = value;
        // this.setState({ChkAll: value});
        break;

      default:
        break;
    }

    if (this.state.FilterText !== '')
      this.GetEnterprises(this.state.activePage, pageSize, this.state.FilterText);
    else
      this.GetEnterprises(this.state.activePage, pageSize);

  }


  GenerateCategorySortModel() {

    if (!this.state.Sort) {
      return ('');
    }

    return (

      <Modal isOpen={this.state.Sort} toggle={this.SortModal} className={this.props.className}>
        <ModalHeader>Sort items</ModalHeader>
        <ModalBody>
          <div className="m-b-15">Use mouse or finger to drag items and sort their positions.</div>
          <div className="sortable-wrap sortable-item sortable-new-wrap">

            <SortableContainer
              items={this.state.sortServices}
              onSortEnd={this.onSortEnd}
              hideSortableGhost={true} >

            </SortableContainer>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => this.SortModal()}>Cancel</Button>
          <Button color="primary" onClick={() => this.UpdateSort()}>
          {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                             : <span className="comment-text">Save</span>}

            </Button>
        </ModalFooter>
      </Modal>

    )

  }

  componentDidMount() {
    document.body.classList.add('bussiness-override');
    setTimeout(() => {
      const searchInput = document.querySelector('input[placeholder="Search"]');
      if (searchInput) {
        searchInput.blur();
      }
    }, 100);

    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
      let UserRole = userObj.RoleLevel;
      //  console.log("RoleLevel", userObj.RoleLevel);
      //  console.log("ENTERPRISE_ADMIN_IMPERSONATE", Utilities.HasPermission(userObj.RoleLevel, Constants.Permission.ENTERPRISE_ADMIN_IMPERSONATE));
      let hasTopUpPermission = Utilities.HasPermission(userObj.RoleLevel, Constants.Permission.TOPUP_UPDATE);
      let hasEnterpriseCreatePermission = Utilities.HasPermission(userObj.RoleLevel, Constants.Permission.ENTERPRISE_RESTAURANT_CREATE);
      let hasEnterpriseImpersonatePermission = Utilities.HasPermission(userObj.RoleLevel, Constants.Permission.ENTERPRISE_ADMIN_IMPERSONATE) || Utilities.HasPermission(userObj.RoleLevel, Constants.Permission.ENTERPRISE_MANAGER_IMPERSONATE);
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
        IsEnterprise: userObj.Enterprise.EnterpriseTypeId === 3 || userObj.Enterprise.EnterpriseTypeId === 4 || userObj.RoleLevel === Constants.Role.FOORTAL_SUPPORT_USER_ID
      }, () => {

      });

    }



    let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
    if(userObj.Enterprise.EnterpriseTypeId !== 5){
      this.GetEnterprises(this.state.activePage, pageSize)
    }
    if(userObj.Enterprise.EnterpriseTypeId === 5){
      this.state.parentsEnterprises.push({Id: userObj.Enterprise.Id})
      this.getChildEnterprises(userObj.Enterprise.Id)
    }

  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.page !== this.state.activePage) {
        // this.GetEnterprises(this.state.activePage, pageSize)
    }
  }
  componentWillUnmount() {
    document.body.classList.remove('bussiness-override');
  }

  shouldComponentUpdate() {
    return true;
  }
  handlePageChange = (pageNumber) => {
    // this.state.activePage = pageNumber + 1;
    // this.GetEnterprises(this.state.activePage, pageSize);
    // this.setState({ activePage: pageNumber });
  }

  AddNewRestaurant(enterpiseId, typeId) {

    localStorage.removeItem(Constants.Session.ENTERPRISE_TYPE_ID);

    if (typeId == 5) {
      localStorage.setItem(Constants.Session.ENTERPRISE_ID, 1);
      localStorage.setItem(Constants.Session.ENTERPRISE_TYPE_ID, typeId);
      window.location.href = `/enterprise/general-setup/${enterpiseId}`;
      return;
    }

    localStorage.setItem(Constants.Session.ENTERPRISE_ID, 1);
    window.location.href = '/enterprise/general-setup';
  }

  getChildEnterprises = async (parentId) =>{
    var parentIndex =  this.state.parentsEnterprises.findIndex(v => v.Id == parentId)
    this.setState({ childLoader: true, ShowLoader: false })

    if(this.state.parentsEnterprises[parentIndex].ChildEnterprises == undefined || this.state.parentsEnterprises[parentIndex].ChildEnterprises.length == 0 ){
      let data = await EnterpriseService.GetAllServices(parentId, this.state.UserObj.Id);   
      if(data.length > 0 ){

        data.forEach(enterprise => {
          enterprise.ParentId = parentId;
        });

        this.state.parentsEnterprises[parentIndex].ChildEnterprises = data
         this.setState({ childLoader: false, ShowLoader: false, childEnterprises: data },() => {this.SetSortServices()})
         return
      }
      this.setState({ childLoader: false, ShowLoader: false})
    }
  }

  render() {

    //   let hasPermision = false;
    //   let userObj= []
    //   let UserRole = 0;
    //   if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
    //      userObj= JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
    //      UserRole = userObj.RoleLevel;
    //   if (UserRole === Constants.Role.SYSTEM_OPERATOR_ID || UserRole === Constants.Role.SYSTEM_ADMIN_ID || UserRole === Constants.Role.FOORTAL_SUPPORT_ADMIN_ID)
    //     hasPermision = true;

    // }
 const { parentsEnterprises } = this.state;
    const columns = [
      {
        name: 'Name',
        label: " ",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div>
                {this.LoadEnterpriseHtml(parentsEnterprises[tableMeta.rowIndex])}
            </div>

            );
          }
        }
      },


    ];

    const options1 = {
      searchOpen: false,
      searchAlwaysOpen: true,
      searchPlaceholder: "Search",
      rowsPerPage: 10, //GlobalData.restaurants_data.Supermeal_dev.PageSize,
      rowsPerPageOptions:['10'],
      // fixedHeader: true,
      //  fixedSelectColumn: true,
      //  sortFilterList: true,
       search: true,
      //  filterType: 'checkbox',
       pagination: true,
       print:false,
       download:false,
       filter:false,
       viewColumns:false,
       searchPlaceholder:'Search',
        responsive:window.innerWidth < 800 ? "scroll":"",
      //  sortOrder: sortOrder,
      selectableRowsHeader: false,
      selectableRows: 'none',
      expandableRows: true,
      expandableRowsHeader: false,
      expandableRowsOnClick: true,
      count: this.state.totalRecord,
      serverSide: true,

       textLabels: {
         body: {
           noMatch: this.state.ShowLoader ? <span className="comment-loader"><Loader type="Oval" color="#000" height={22} width={22} /></span> : "Sorry, no matching records found",
         }
       },
       onSearchClose: () => {
        this.setState({ FilterText: '' })
        this.GetEnterprises(this.state.activePage, pageSize);
       },
       searchProps: {
         onKeyUp: (e) => {
          this.SearchEnterprise(e)
         }
       },
      // serverSide: true,
        onTableChange: (action, tableState) => {
          switch (action) {
            case 'changePage':
              this.state.activePage = tableState.page
              this.GetEnterprises(this.state.activePage, pageSize)
              break;
            default:
              break;
          }


       },

           renderExpandableRow: (rowData, rowMeta) => {

            var childEnterprises = this.state.parentsEnterprises[rowMeta.rowIndex]?.ChildEnterprises || []
            if(childEnterprises.length > 0){
              // this.state.parentsEnterprises[rowMeta.rowIndex].ChildEnterprises.ParentName = this.state.parentsEnterprises[rowMeta.rowIndex].Name
              // console.log('childEnterprises', childEnterprises)
             var newChildArray = childEnterprises.map(item => ({
                ...item,
                ParentName: this.state.parentsEnterprises[rowMeta.rowIndex].Name
              }))
              childEnterprises = newChildArray
            }
             return (

             <tr>
               <td colSpan={15}>

               <table className='nested-table' aria-label="simple table">
               <tbody>
                {childEnterprises.length > 0 && this.state.isExpandable && this.RenderEnterprise(childEnterprises)}
                {/* {childEnterprises.length == 0 && <span>No result found</span>} */}
               </tbody>
             </table>
             </td>
             </tr>

             );
           },

           onRowExpansionChange: (curExpanded, allExpanded, rowsExpanded) => {
            if(this.state.ellipsisToggle){
                this.setState({ isExpandable: true})
            }else{
              this.setState({ ellipsisToggle: true})
            }
            var parentId = this.state.parentsEnterprises[curExpanded[0].index].Id
             if(this.state.isExpandable) this.getChildEnterprises(parentId);

      },
      onChangePage: (e) => this.handlePageChange(e),

    };

    if (this.state.toRestaurant === true && !this.state.IsEnterprise) {
      this.setState({ toRestaurant: false });
      return <Redirect to='/enterprise/general-setup' />
    }

    return (

      <div className="card mb-0">

        <div className="m-b-20 card-new-title busines-resp-set" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title " data-tip data-for='happyFace'>{Utilities.GetResourceValue(GlobalData.restaurants_data.Supermeal_dev.Platform, (this.state.UserObj.Enterprise.EnterpriseTypeId != 5 ? `Businesses ${"(" + this.state.totalRecord +")"}` : `Services ${"(" + this.state.childEnterprises.filter(ce => !ce.IsChurned && ce.IsActive).length + ")"}`), 'Shops')}
          </h3>

          {/* <div className="menu-sort-link" onClick={() => this.SortModal()}>
                      <i className=" fa fa-sort-amount-asc" aria-hidden="true"></i>{Labels.Sort_Services}</div> */}

          {this.state.HasEnterpriseCreatePermission &&
            (this.state.UserObj.Enterprise.EnterpriseTypeId == 5 ||
              this.state.UserObj.Enterprise.EnterpriseTypeId == 1 ||
              this.state.UserObj.Enterprise.EnterpriseTypeId == 2) ? <div>

                {this.state.UserObj.Enterprise.EnterpriseTypeId == 5 &&

                <a className="add-cat-btn mr-2" href="/external-service"><i className="fa fa-plus mr-2" aria-hidden="true"></i>{"Add External Service"}</a>

                 }
                 {
                  (this.state.UserObj.RoleLevel == Constants.Role.SYSTEM_ADMIN_ID || this.state.UserObj.RoleLevel == Constants.Role.SYSTEM_OPERATOR_ID) &&
                    <a className="add-cat-btn mr-2" href="/hotel-demos"><i className="fa fa-plus mr-2" aria-hidden="true"></i>{this.state.UserObj.Enterprise.EnterpriseTypeId == 5 ? "Create Demo" : "Create Demo"}</a>
                 }
                <span className="btn btn-primary  " onClick={(e) => this.AddNewRestaurant(this.state.UserObj.Enterprise.Id, this.state.UserObj.Enterprise.EnterpriseTypeId)}><i className="fa fa-plus mr-2" aria-hidden="true"></i>{this.state.UserObj.Enterprise.EnterpriseTypeId == 5 ? "Add Service" : "Add new"}</span> </div>
                : ""}
        </div>
        <div className="card-body card-body-res pb-0">



          {this.state.IsEnterprise ? "" :
            <>
              {this.state.UserObj.Enterprise.EnterpriseTypeId != 5 &&
                <div className="left-row-rest">

                  <label htmlFor="chkAll">
                    <input type="checkbox" className="form-checkbox" name="chkAll" id="chkAll" value={this.state.ChkAll} checked={this.state.ChkAll} onChange={(e) => this.FilterCheckbox(e, 'A')} /> <span className="settingsLabel" >{'Active    '}</span>
                  </label>
                  <label htmlFor="chkChurned">
                    <input type="checkbox" name="chkChurned" className="form-checkbox" id="chkChurned" checked={this.state.ChkChurned} value={this.state.ChkChurned} onChange={(e) => this.FilterCheckbox(e, 'C')} /><span className="settingsLabel" >{'Churned    '}</span>
                  </label>
                </div>}
            </>
          }

        {
            this.state.UserObj.Enterprise.EnterpriseTypeId != 5 ?

             <div className='min-height-table position-relative business-mui-table mui-search-open'>
                 {/* <div className="dataTables_filter"><label><input type="text" id="txtSearchEnterprise" className="form-control common-serch-field" placeholder="Search" onKeyUp={(e) => this.SearchEnterprise(e)} /></label>
              </div> */}
                <MUIDataTable
                  // title={"Employee List"}
                  data={this.state.parentsEnterprises}
                  columns={columns}
                  options={options1}
                />
              </div>
            :
            <div>
              {/* <div className="dataTables_filter"><label><input type="text" id="txtSearchEnterprise" className="form-control common-serch-field" placeholder="Search" onKeyUp={(e) => this.SearchEnterprise(e)} /></label>
              </div> */}
              {this.RenderEnterprise(this.state.childEnterprises)}
            </div>
          }



          {/* {


   !Utilities.stringIsEmpty(this.state.UserObj.Enterprise.ParentName) && !this.state.ShowLoader ?
   <div className="admin-restaurant-wrap" key={this.state.UserObj.Enterprise.Id}>

    <h2> Parent Enterprise </h2>
    <div>
    <div className="admin-restaurant-row">
          <div className="image-wrap">
        <img src={Utilities.generatePhotoLargeURL(this.state.UserObj.Enterprise.ParentPhotoName, true, false)}/>
        </div>
        <div className="rest-main-inner-row">
        <div className="rest-name-heading">{this.state.UserObj.Enterprise.ParentName}</div>
  </div>
    </div>
    </div>
<hr/>
     </div>

     :

     this.state.FilterEnterprises.length > 0 && (this.state.FilterEnterprises[0].Id !== this.state.UserObj.Enterprise.Id) &&  Utilities.stringIsEmpty(this.state.UserObj.Enterprise.ParentName) && !this.state.ShowLoader && this.state.UserObj.RoleLevel === 4 ?
     <div className="admin-restaurant-wrap" key={this.state.UserObj.Enterprise.Id}>

     <h2> This is You </h2>
      <div>
      <div className="admin-restaurant-row">
            <div className="image-wrap">
          <img src={Utilities.generatePhotoLargeURL(this.state.UserObj.Enterprise.PhotoName, true, false)}/>
          </div>
          <div className="rest-main-inner-row">
          <div className="rest-name-heading">{this.state.UserObj.Enterprise.Name}</div>
    </div>
      </div>
      </div>
  <hr/>
       </div> : ""
  } */}

          {/* {this.RenderEnterprise(this.state.FilterEnterprises)}  */}

          {/* {this.state.FilterEnterprises !== null && this.state.FilterEnterprises.length > pageSize ?

            <div className="res-page-wrap">   <Pagination
              activePage={this.state.activePage}
              itemsCountPerPage={pageSize}
              totalItemsCount={this.state.totalRecord}
              onChange={this.handlePageChange}

            />
            </div>
            : ""
          } */}
          <Modal isOpen={this.state.modalVisible} toggle={this.credibilityBalanceLimitUpdate} className={this.props.className}>
            <AvForm onValidSubmit={this.UpdateCredibilityBalanceLimit}>
              <ModalHeader>{Labels.Credibility_Limit} </ModalHeader>
              <ModalBody>
                <AvField name="txtCredibilityLimit" value={this.state.SelectedCredibilityBalanceLimitUpdate} type="number" className="form-control"
                  validate={{
                    required: { value: true, errorMessage: 'This is a required field' },
                    pattern: { value: /^-?[0-9]+(\.[0-9]{1,2})?$/, errorMessage: 'please fill correct value' }
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <div className="btn btn-secondary" onClick={this.CancleModal}>{Labels.Cancel}</div>
                <Button color="primary">{Labels.Confirm}</Button>{' '}

              </ModalFooter>
            </AvForm>
          </Modal>


          <Modal isOpen={this.state.ExternalService} toggle={() => this.ExternalServiceModal()} className='modal-media-main external-service-wrap'>
            <AvForm>
              <ModalHeader toggle={() => this.ExternalServiceModal()} >Add External Service</ModalHeader>
              <ModalBody >

                <div className="row mb-3">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label id="firstName" className="control-label">Service Name
                      </label>
                      <AvField errorMessage="This is a required field" name="frstName" type="text" className="form-control"
                        validate={{
                          required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                        }}

                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label id="firstName" className="control-label">Add Service Link
                      </label>
                      <AvField errorMessage="This is a required field" name="frstName" type="text" className="form-control"
                        validate={{
                          required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                        }}

                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <div className="form-group">
                    <label id="firstName" className="control-label">Enterprise Type
                      </label>
                      <select style={{minHeight:35}}
                        className="form-control w-100 mb-2"

                      >
                        <option value={''}>5</option>

                      </select>
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label id="shortDesc" className="control-label">Short Description
                      </label>
                      <AvField style={{minHeight:120}} errorMessage="This is a required field" name="frstName" type="textarea" className="form-control"
                        validate={{
                          required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                        }}

                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label id="firstName" className="control-label mb-0">Add Logo
                      </label>
                      <p>Upload a 1:1 PNG/JPG file which is not larger than 1 MB in size.</p>
                      <div className='logo-image-wrap' onClick={() => this.ImageGalleryModal()}>
                        <div className='logo-inner text-center d-flex'>
                          <i className="fa fa-plus"></i>
                        </div>
                      </div>
                      <div className='inner-logo-img d-none'>
                        <img src="https://cdn.superme.al/s/butler/images/000/001/000001045_download--5-.jfif" />
                      </div>

                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label id="firstName" className="control-label mb-0">Add Cover Photo
                      </label>
                      <p>Upload a PNG/JPG file not more than 1 MB in size.</p>
                      <div className='logo-image-wrap cvr-p' onClick={() => this.ImageGalleryModal()}>
                        <div className='logo-inner text-center d-flex'>
                          <i className="fa fa-plus"></i>
                        </div>
                      </div>
                      <div className='inner-logo-img cvr-p d-none'>
                        <img src="https://cdn.superme.al/s/butler/images/000/001/000001045_download--5-.jfif" />
                      </div>

                    </div>
                  </div>
                </div>
              </ModalBody>
              <FormGroup className="modal-footer" >
                <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger"></label>
                </div>
                <div>
                  <Button className='mr-2 text-dark' color="secondary" onClick={() => this.ExternalServiceModal()}>Cancel</Button>
                  <Button color="primary" >
                    {/* <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>   */}
                    <span className="comment-text">Save</span>
                  </Button>
                </div>
              </FormGroup>
            </AvForm>
          </Modal>

          <Modal isOpen={this.state.ImageGallery} toggle={() => this.ImageGalleryModal()} style={{ maxWidth: "80%" }} className={this.props.className}>
            <ModalHeader toggle={() => this.ImageGalleryModal()} >Choose from media library</ModalHeader>
            <ModalBody className='scroll-media modal-media-wrap'>
              <S3Browser toggleViewS3ImageModal={this.toggleViewS3ImageModal} setSelectedMedia={this.SetSelectedMedia} ignoredFilesBySize={this.ValidateFiles} shouldRefresh={this.state.shouldRefresh} RefreshS3Files={this.RefreshS3Files} currentFolder={this.state.currentFolder} />
            </ModalBody>
            <FormGroup className="modal-footer" >
              <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger"></label>
              </div>
              <div>
                <Button className='mr-2 text-dark' color="secondary" onClick={() => this.ImageGalleryModal()}>Cancel</Button>
                <Button color="primary" >
                  {/* <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>   */}
                  <span className="comment-text">Save</span>
                </Button>
              </div>
            </FormGroup>
          </Modal>

        </div>
        {this.GenerateSweetConfirmationWithCancel()}
        {this.GenerateSweetAlert()}
        {this.GenerateChurnedModel()}

        {this.GenerateCategorySortModel()}
      </div>
    );
  }

}

export default Restaurants;
