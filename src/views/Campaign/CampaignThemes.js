import React, { Component } from 'react';
import Avatar from 'react-avatar';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import { Link } from 'react-router-dom'
import { FormGroup, Label, Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import * as CampaignService from '../../service/Campaign';
import * as Utilities from '../../helpers/Utilities';
import Loader from 'react-loader-spinner';
import Dropdown from 'react-bootstrap/Dropdown';
const $ = require('jquery');

$.DataTable = require('datatables.net');

class CampaignThemes extends Component {

  //#region Constructor
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      CampaignList: [],
      ShowLoader: true,
      showAlert: false,
      alertModelText: '',
      alertModelTitle: '',
      deleteConfirmationModelText: '',
      deleteComfirmationModelType: '',
      showDeleteConfirmation: false,
      SelectedCampaignId: 0,
      SelectedCampaignName: '',
      SuspendActiveHtml: '',
      dropdownOpen: false,
      NewCampaignModal: false,
      NewCampaignName: ""
    };
   
    //#region binding
    
    this.SaveCampaignName = this.SaveCampaignName.bind(this);

    //#endregion

  }
  //#region toggle functions
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }
  //#endregion

  loading = () => <div className="page-laoder-users">
    <div className="loader-menu-inner">
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
      <div className="loading-label">Loading.....</div>
    </div>
  </div>

  //#region api calling

  GetCampaignContent = async () => {

    var data = await CampaignService.GetAll();
    this.setState({ CampaignList: data, ShowLoader: false });
    this.bindDataTable();
  }



  SuspendCampaignContent = async () => {

    this.setState({ showDeleteConfirmation: false });
    let SuspendMessage = await CampaignService.ActiveSuspend(this.state.SelectedCampaignId, false)
    let name = this.state.SelectedCampaignName;

    if (SuspendMessage === '1') {

      this.setState({ SelectedCampaignId: 0 });
      this.GetCampaignContent();
      this.setState({ showAlert: true, alertModelTitle: 'Inactive!', alertModelText: 'Campaign "' + name + '" has been Inactive' });
      return;
    }

    let message = SuspendMessage === '0' ? '"' + name + '" has not been Inactive' : SuspendMessage;

    //this.setState({SelectedCategoryId: 0});
    this.setState({ showAlert: true, alertModelTitle: 'Error!', alertModelText: message });

  }

  ActivateCampaignContent = async () => {

    this.setState({ showDeleteConfirmation: false });
    let ActivateMessage = await CampaignService.ActiveSuspend(this.state.SelectedCampaignId, true)
    let name = this.state.SelectedCampaignName;

    if (ActivateMessage === '1') {

      this.setState({ SelectedCampaignId: 0 });
      this.GetCampaignContent();
      this.setState({ showAlert: true, alertModelTitle: 'Activated!', alertModelText: 'Campaign "' + name + '" activated successfully' });
      return;
    }

    let message = ActivateMessage === '0' ? '"' + name + '" not activated successfully' : ActivateMessage;

    this.setState({ showAlert: true, alertModelTitle: 'Error!', alertModelText: message });

  }

  SaveCampaignNameApi = async (name) => {

     let id = await CampaignService.Save(name)

     if (id > 0) {
        this.EditCampaignContent(id);
        this.AddNewCampaignNameModal();
    } else {

    }
       

  }

  SaveCampaignName(event, values) {

    // let setting = EnterpriseSettingService.EnterpriseSettings;
    // setting.FlickerGalleryID = values.txtFlickerGalleryId;
    // setting.VideoUrl = values.txtVideoUrl;
    let name = values.campaignName;
    this.SaveCampaignNameApi(name);

  }

  //#endregion

  //#region  Confirmation Model Generation

  DeleteCampaignConfirmation(campaignId, name) {

    this.setState({ SelectedCampaignId: campaignId, SelectedCampaignName: name, deleteComfirmationModelType: 'du', showDeleteConfirmation: true, deleteConfirmationModelText: 'This User "' + name + '" will be deleted permanently.' })

  }

  ActivateCampaignConfirmation(campaignId, name) {

    this.setState({ SelectedCampaignId: campaignId, SelectedCampaignName: name, deleteComfirmationModelType: 'au', showDeleteConfirmation: true, deleteConfirmationModelText: '"' + name + '" will be Activated.' })

  }

  SuspendCampaignConfirmation(campaignId, name) {

    this.setState({ SelectedCampaignId: campaignId, SelectedCampaignName: name, deleteComfirmationModelType: 'su', showDeleteConfirmation: true, deleteConfirmationModelText: '"' + name + '" will be Inactive.' })

  }

  HandleOnConfirmation() {

    let type = this.state.deleteComfirmationModelType;

    switch (type.toUpperCase()) {

      case 'DU':
        this.DeleteCampaignContent();
        break;
      case 'AU':
        this.ActivateCampaignContent();
        break;
      case 'SU':
        this.SuspendCampaignContent();
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

  GenerateAddNewCampaignModel()
{

if(!this.state.NewCampaignModal){
  return('');
}

  return (  
    <Modal isOpen={this.state.NewCampaignModal}  className="modal-md">
      <ModalHeader >Add New Campaign</ModalHeader>
      <ModalBody className="padding-0">
        <AvForm onValidSubmit={this.SaveCampaignName}>
        <div className="padding-20">
        <FormGroup className="modal-form-group">
          <div className="name-field form-group">
            <AvField errorMessage="This is a required field" name="campaignName" type="text" value={this.state.NewCampaignName} className="form-control" required />
            <span>Name</span>
          </div>
          </FormGroup>
            </div>
            <br/><br/>

            <FormGroup className="modal-footer">
            <Button color="secondary" onClick={()=>this.AddNewCampaignNameModal()}>Cancel</Button>
            <Button color="primary">Save</Button> 
          </FormGroup>
        </AvForm>
      </ModalBody>
    </Modal>
);

}


  //#endregion

  AddNewCampaignNameModal() {
    this.setState({
      NewCampaignModal: !this.state.NewCampaignModal,
    })
  }

  componentDidMount() {

    this.GetCampaignContent();

  }
  componentWillUnmount() {

  }
  shouldComponentUpdate() {
    return true;
  }


  EditCampaignContent(id) {

    this.props.history.push('/campaign/edit/' + id)

  }

  RenderCampaignContent(campaign) {
    
    var suspendActive = campaign.IsActive ? <span className="m-b-0 statusChangeLink  m-r-20" onClick={() => this.SuspendCampaignConfirmation(campaign.Id, campaign.Name)}><i className="fa fa-ban font-18" aria-hidden="true" ></i><span>{campaign.IsActive === true ? ' Inactive' : ' Activate'}</span></span> : <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.ActivateCampaignConfirmation(campaign.Id, campaign.Name)}><i className="fa fa-check " aria-hidden="true" ></i><span>{campaign.IsActive === true ? 'Inactive' : 'Activate'}</span> </span>;
    var actions =  <div><span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.EditCampaignContent(campaign.Id)}><span><i className="fa fa-edit font-18" ></i> Edit</span></span>{suspendActive}</div>;
    
    return (

      <tr key={campaign.Id}>
        <td>
        <div className="campaign-wrap">             
           <div className="c-heading" onClick={() => this.EditCampaignContent(campaign.Id)}>{campaign.Name}</div>
          <div className="campaign-d-t-wrap">
          <div className="d-start">
            <span className="bold">Start:</span>  <span className="u-heading">{Utilities.FormatDate(campaign.StartDate).format("DD MMM YYYY hh:mm")}</span>
          </div>
          <div className="d-end">
            <span className="bold">End:</span>   <span className="u-heading">{Utilities.FormatDate(campaign.EndDate).format("DD MMM YYYY hh:mm")}</span>
          </div>
          </div>
          </div>
        </td>
{/* 
        <td>
          <div className="vatar-name-wraper">
            <div className="user-left-col">
              <span className="u-heading">{Utilities.FormatDate(campaign.StartDate).format("DD MMM YYYY hh:mm")}</span>
            </div>
          </div>
        </td>

        <td>
          <div className="vatar-name-wraper">
            <div className="user-left-col">
              <span className="u-heading">{Utilities.FormatDate(campaign.EndDate).format("DD MMM YYYY hh:mm")}</span>
            </div>
          </div>
        </td> */}

{/*        
        <td>
          <div className="vatar-name-wraper">
            <div className="user-left-col">
              <span className="u-heading">{campaign.IsActive ? ' Activate' : ' Inactive '}</span>
            </div>
          </div>
        </td> */}


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
      {actions}
    </Dropdown.Menu>
  </Dropdown>

</div>
<div className="show-web">
  {actions}
</div>
</div>
        </td>
      </tr>
    )
  }

  LoadCampaignContents(campaignContent) {

    var htmlCampaign = [];
    if (this.state.ShowLoader === true) {
      return this.loading()
    }
   
    for (var i = 0; i < campaignContent.length; i++) {

        htmlCampaign.push(this.RenderCampaignContent(campaignContent[i]));
    }

    return (

      <tbody>{htmlCampaign.map((campaignHtml) => campaignHtml)}</tbody>

    )

  }

  bindDataTable = () => {
    $("#CampaignData").DataTable().destroy();
    $('#CampaignData').DataTable({
      "paging": true,
      "ordering": false,
      "lengthChange": false,
      "info": true,
      "search": {
        "smart": false
      },
      "language": {
        "searchPlaceholder": "Search",
        "search":""
    }
     
    });
  }

  render() {

    const { CampaignList } = this.state;
    return (
      <div className="card" id="CampaignDataWraper">
          <div className="card-new-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>   <h3 className="card-title" data-tip data-for='happyFace'>Campaigns
                                </h3>
            {/* <Link to="/campaign/Add">   */}
            <div className=" btn btn-primary-plus " onClick={() => this.AddNewCampaignNameModal()}><i className="fa fa-plus" aria-hidden="true"></i> Add new</div>
            {/* </Link> */}
          </div>
        <div className="card-body">

          <table id="Campaign">
            <thead>
              <tr>
                <th style={{width:300}}>Name</th>
                {/* <th style={{width: 200}}>Start Date</th>
                <th style={{width: 200}}>End Date</th> */}
                <th className="hide-res-480">Action</th>
              </tr>
            </thead>

            {this.LoadCampaignContents(CampaignList)}

          </table>
        </div>

        {this.GenerateSweetConfirmationWithCancel()}
        {this.GenerateSweetAlert()}
        {this.GenerateAddNewCampaignModel()}
        
      </div>

    );
  }

}

export default CampaignThemes;
