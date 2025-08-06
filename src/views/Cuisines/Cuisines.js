import React, { Component, Fragment } from 'react';
import { FormGroup, Button, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import 'sweetalert/dist/sweetalert.css';
import { AvForm, AvField } from 'availity-reactstrap-validation';
//import DropdownButton from 'react-bootstrap/DropdownButton';
 import Dropdown from 'react-bootstrap/Dropdown';
// import Pagination from "react-js-pagination";
import * as EnterpriseService from '../../service/Enterprise';
// import * as EnterpriseUserService from '../../service/EnterpriseUsers';
// import * as UserService from '../../service/User';
// import * as AccountService from '../../service/Account';
import * as Utilities from '../../helpers/Utilities';
import Constants from '../../helpers/Constants';
// import Config from '../../helpers/Config';
//import DefaultLayout from '../../containers/DefaultLayout';
import Loader from 'react-loader-spinner';
import SweetAlert from 'sweetalert-react'; // eslint-disable-line import/no-extraneous-dependencies
import 'sweetalert/dist/sweetalert.css';
import Cropper from 'react-easy-crop';
import Slider from '@material-ui/core/Slider'
import getCroppedImg from '../../helpers/CropImage'
//new services calling for cuisines
import * as CuisinesService from '../../service/Cuisines';
import GlobalData from '../../helpers/GlobalData'

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

class Cuisines extends Component {
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
            cuisines: [],
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
            checkedDietry: true
        };

        this.getCuisines()
        this.toggleLogoModal = this.toggleLogoModal.bind(this);
    }


    getCuisines = async () => {
        // this.setState({ ShowLoader: true });
        var response = await CuisinesService.getAll()
        this.setState({
            cuisines: response, allCuisinesList: response, ShowLoader: false
        });

        this.bindDataTable();

    }

    loading = () => <div className="res-loader-wraper"><div className="loader-menu-inner">
        <Loader type="Oval" color="#ed0000" height={50} width={50} />
        <div className="loading-label">Loading.....</div>
    </div>
    </div>


    //#region  api calling

    GetEnterprises = async (pageNumber, pageSize, searchKeyword) => {

        this.setState({ ShowLoader: true });
        let data = await EnterpriseService.GetAll(pageNumber, pageSize, searchKeyword, this.state.ChkChurned, this.state.ChkAll);

        if (data === null)
            this.props.history.push('/login')

        if (data.length !== 0) {
            this.setState({ Enterprises: data, FilterEnterprises: data, totalRecord: data[data.length - 1].Id, ShowLoader: false });
        }

        this.setState({ ShowLoader: false });
        // this.GetAllEnterprises();

    }


    GetAllEnterprises = async (pageNumber, pageSize) => {

        let data = await EnterpriseService.GetAll(1, 5000);
        this.setState({ AllEnterprises: data, Enterprises: data, ShowLoader: false });
        // this.SearchEnterprise(this.state.FilterText);
    }

    //#endregion


    //#region render Html


    LoadCuisinesHtml(Cuisines) {
        let cuisineName = Utilities.SpecialCharacterDecode(Cuisines.Name);
        return (
            <tr>
                <td>
                    <div className="admin-restaurant-wrap" key={Cuisines.ID}>
                        <div className="admin-restaurant-row">
                            <div className="image-wrap" onClick={() => {
                                this.state.editCuisine = Cuisines
                                this.toggleLogoModal()
                            }
                            }>
                                <img src={Utilities.generatePhotoLargeURL(Cuisines.PhotoName, true, false)} />
                            </div>
                            <div className="rest-main-inner-row">
                                <div className="rest-name-heading" onClick={() => this.editCuisines(Cuisines)}>{cuisineName}</div>
                                <div className="my-order-new-row">

                                    <div className="left-row">
                                        <div className="my-order-left">
                                            <div>
                                                <div className="my-order-label">Hit Counts: {Cuisines.HitCount}</div>
                                            </div>
                                        </div>
                                        <div className="my-order-right">
                                            <div>
                                                <div className="my-order-label">{Cuisines.Type}</div>

                                            </div>
                                        </div>

                                    </div>
                                    <div className="right-row show-web">
                                        <div className="my-order-left center-s-i">

                                            <div className="my-order-label-sub">
                                                <span className="link-t-c" onClick={() => this.editCuisines(Cuisines)}><i className="fa fa-pencil-square-o" aria-hidden="true"></i><span>Edit</span></span>
                                                <span className="link-t-c" onClick={() => this.deleteCuisine(Cuisines)}><i className="fa fa-trash-o" aria-hidden="true"></i><span>Delete</span></span>
                                            </div>
                                        </div>
                                    </div>
                                   
                                </div>
                            </div>
                            <div className="user-data-action-btn-res right-dropdown">
                                        <div className="show-res">
                                            <Dropdown>
                                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                                    <span>
                                                        <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                                                    </span>
                                                    <span>
                                                        Options
</span>
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                    <div>
                                                        <span className="link-t-c  m-b-0 statusChangeLink m-r-20" onClick={() => this.editCuisines(Cuisines)}><i className="fa fa-pencil-square-o" aria-hidden="true"></i><span>Edit</span></span>
                                                        <span className="link-t-c m-b-0 statusChangeLink m-r-20" onClick={() => this.deleteCuisine(Cuisines)}><i className="fa fa-trash-o" aria-hidden="true"></i><span>Delete</span></span>

                                                    </div>



                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>

                                    </div>
                        </div>
                    </div>
                </td>
            </tr>
        )
    }


    RenderCuisines(Cuisines) {
        if (this.state.ShowLoader === true || this.state.ShowLoader === undefined) {
            return this.loading()
            // return;
        }

        var htmlCuisines = [];

        if (Cuisines === null || Cuisines.length == 0) {
            return <div className="no-record">no record found</div>
        }

        for (var i = 0; i < Cuisines.length; i++) {

            htmlCuisines.push(this.LoadCuisinesHtml(Cuisines[i], i));

        }

        return (
            <tbody>
                {htmlCuisines.map((cuisinesHtml) => cuisinesHtml)}
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
        //if (this.state.FilterText !== '')
        //this.GetEnterprises(this.state.activePage, pageSize, this.state.FilterText);
        // else
        //this.GetEnterprises(this.state.activePage, pageSize);
        // if(control.toUpperCase() === 'A' ) totalRec = this.state.Enterprises[this.state.Enterprises.length - 1].Id;


        // filteredData = this.state.Enterprises.filter((enterprise) => {

        //   let result = true;

        //   if(!chkAll && !chkChurned) {
        //     result =  false;
        //   }
        //    else if(chkAll && chkChurned) {
        //     result =   true;
        //    }

        //     else if(chkAll && !chkChurned) {
        //       if(enterprise.IsChurned){
        //         result =  false;
        //       }
        //     } 

        //     else if(!chkAll && chkChurned) {
        //       if(!enterprise.IsChurned){
        //         result =  false;
        //       }
        //     }

        //     return result;

        // });

        //  this.setState({ChkChurned : chkChurned, ChkAll: chkAll});
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




        this.GetEnterprises(this.state.activePage, pageSize)
        // this.GetAllEnterprises(1,500);

    }

    shouldComponentUpdate() {
        return true;
    }
    // handlePageChange(pageNumber) {
    //     console.log(`active page is ${pageNumber}`);
    //     this.GetEnterprises(pageNumber, pageSize);
    //     this.setState({ activePage: pageNumber });
    // }

    // AddNewRestaurant() {

    //     localStorage.setItem(Constants.Session.ENTERPRISE_ID, 1);
    //     window.location.href = '/enterprise/general-setup';
    // }

    bindDataTable() {
        $("#tblCuisines").DataTable().destroy();
        $('#tblCuisines').DataTable({
            "paging": true,
            "ordering": false,
            "info": true,
            "processing": true,
            "lengthChange": false,
            "lengthMenu": [[100, 150, 200], [100, 150, 200]],
            "search": {
                "smart": false
            },
            "language": {
                "searchPlaceholder": "Search",
              "search":""
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
       
        this.RemoveSpecialChars(e);
        let CuisineName = e.target.value;
        this.setState({CuisineName: CuisineName});
    }
    
    RemoveSpecialChars(e){
    
        e.target.value = e.target.value.replace(/'/gi, "").replace(/_/gi, "").replace(/\./g, "").replace(/#/gi,"");
        Utilities.RemoveSpecialChars(e);
        Utilities.RemoveDefinedSpecialChars(e);
    }

    SaveCuisine = (event, values) => {
        
        var info = {
            Type: this.state.cuisineSelectedType,
            Name: values.cuisineName,
            HitCount: values.hitcounts
        }
        this.processSaveCuisine(info)
    }

    processSaveCuisine = async (info) => {
        var response = await CuisinesService.Save(info)
        if (response === '1') {
            // this.GetEnterprises(this.state.activePage, pageSize);

            // this.setState({ modalVisible: false })
            this.setState({
                CuisineName: '',
                hitCounts: 0,
                openEditModal: false
            })
             this.setState({ ShowLoader: true });
            this.getCuisines()
            Utilities.notify("Saved successfully.", "s");
        }
        else
            Utilities.notify("Saving failed.", "e");

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

    processUpdation = async (info) => {
        var response = await CuisinesService.Update(info)
        if (response === '1') {
            // this.GetEnterprises(this.state.activePage, pageSize);

            this.setState({ 
                CuisineName: '',
                hitCounts: 0,
                openEditModal: false })
            this.getCuisines()
            Utilities.notify("Updated successfully.", "s");
        }
        else
            Utilities.notify("Update failed.", "e");

    }

    editCuisines = (cuisines) => {
        // console.log('cuisineSelectedType', this.state.cuisineSelectedType)
        // console.log('cuisines', cuisines)
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

    processDeletion = async (Id) => {
        var response = await CuisinesService.Delete(Id)
        if (response === '1') {
            // this.GetEnterprises(this.state.activePage, pageSize);
            this.getCuisines()
            this.setState({
                deletedSuccessfully: true,
                deleteAlertTitle: 'Deleted!',
                deleteAlertMessage: '\"' + this.state.editCuisine.Name + '\"' + ' deleted successfully'
            })
            //Utilities.notify("Deleted successfully.", "s");
        }
        else {
            this.setState({
                deletedSuccessfully: true,
                deleteAlertTitle: 'Error!',
                deleteAlertMessage: '\"' + this.state.editCuisine.Name + '\"' + ' not deleted successfully'
            })

        }
    }

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
        // console.log(croppedArea, croppedAreaPixels)
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

    photoSavingApi = async (info) => {
        var response = await CuisinesService.AddPhoto(info)
        this.setState({ IsSave: false })
        if (response === '1') {
            // this.GetEnterprises(this.state.activePage, pageSize);
            this.toggleLogoModal()
            this.setState({ openEditModal: false })
            this.getCuisines()
            Utilities.notify("Photo added successfully.", "s");
        }
        else {
            this.toggleLogoModal()
            Utilities.notify("Failed to add a photo.", "e");
        }
    }

    render() {
        if (this.state.toRestaurant === true && !this.state.IsEnterprise) {
            this.setState({ toRestaurant: false });
            return <Redirect to='/enterprise/general-setup' />
        }
        return (
            <div className="card">
                      <div className="m-b-20 card-new-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 className="card-title " data-tip data-for='happyFace'>{Utilities.GetResourceValue(GlobalData.restaurants_data.Supermeal_dev.Platform, 'Cuisines', 'Categories')}
                        </h3>
                        {this.state.HasEnterpriseCreatePermission ? <span className="btn btn-primary-plus  btn btn-secondary" onClick={(e) => this.setState({
                            openEditModal: true, addEditLabel: 'Add'
                        })}><i className="fa fa-plus" aria-hidden="true"></i> Add New</span> : ""}
                    </div>
                <div className="card-body card-body-res">

              

                    {this.state.IsEnterprise ? "" :

                        <div className="left-row-rest">

                            <label htmlFor="chkAll">
                                <input type="checkbox" className="form-checkbox" name="cuisine" id="chkAll" value={this.state.checkedCuisine} checked={this.state.checkedCuisine} onChange={(e) => this.FilterCheckbox(e, 'A')} /> <span className="settingsLabel" >{'Cuisines    '}</span>
                            </label>
                            <label htmlFor="chkChurned">
                                <input type="checkbox" name="dietary" className="form-checkbox" id="chkChurned" checked={this.state.checkedDietry} value={this.state.checkedDietry} onChange={(e) => this.FilterCheckbox(e, 'C')} /><span className="settingsLabel" >{'Dietary    '}</span>
                            </label>
                        </div>
                    }
                    <table className='table table-striped' id="tblCuisines">

                        <thead style={{ display: "none" }}>
                            <tr>
                                <th></th>
                            </tr>
                        </thead>


                        {this.RenderCuisines(this.state.cuisines)}

                    </table>
                </div>

                <Modal isOpen={this.state.openEditModal} toggle={() => this.setState({ openEditModal: !this.state.openEditModal })} >
                    {this.state.addEditLabel == 'Add' ?
                        <ModalHeader>Add {Utilities.GetResourceValue(GlobalData.restaurants_data.Supermeal_dev.Platform, 'Cuisine', 'Category')}</ModalHeader> :
                        <ModalHeader>Edit {this.state.editCuisine.Name}</ModalHeader>
                    }
                        <AvForm onValidSubmit={this.state.addEditLabel == 'Add' ? this.SaveCuisine : this.updateCuisine} id="cuisineAdditionForm">
                    <ModalBody>

                        <FormGroup className="modal-form-group">
                <Label htmlFor="name" className="control-label"> Name</Label>
                <AvField errorMessage="This is a required field" name="cuisineName" value={this.state.CuisineName} onKeyUp={this.RemoveSpecialChars} onChange={(e) => this.MakeCuisineName(e)} type="text" className="form-control" required />
              </FormGroup>
                        <FormGroup className="modal-form-group">
                <Label htmlFor="type" className="control-label"> Type</Label>
                {this.LoadCuisineTypeDropDown(this.state.cuisineTypes)}
              </FormGroup>
              <FormGroup className="modal-form-group">
                <Label htmlFor="hitcounts" className="control-label"> Hit Counts</Label>
                <AvField name="hitcounts" value={this.state.hitCounts} type="text" className="form-control"
                                        validate={{ myValidation: phoneNumValidation, }}
                                    />
              </FormGroup>
                        
                          
                       
                      
                    </ModalBody>
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
                <SweetAlert
                    show={this.state.showDeleteCuisinePopup}
                    title={this.state.showDeleteCuisineTitle}
                    text={this.state.showDeleteCuisineMessage + ' \"' + this.state.editCuisine.Name + '\"'}
                    showCancelButton
                    onConfirm={() => {
                        this.setState({ showDeleteCuisinePopup: false })
                        var info = {
                            Id: this.state.editCuisine.Id,
                            PhotoName: this.state.editCuisine.PhotoName
                        }
                        this.processDeletion(info)
                    }}
                    onEscapeKey={() => this.setState({ showDeleteCuisinePopup: false })}
                    onOutsideClick={() => this.setState({ showDeleteCuisinePopup: false })}
                    onCancel={() => {
                        this.setState({ showDeleteCuisinePopup: false });
                    }}
                />
                <SweetAlert
                    show={this.state.deletedSuccessfully}
                    title={this.state.deleteAlertTitle}
                    text={this.state.deleteAlertMessage}
                    onConfirm={() => {
                        this.setState({ deletedSuccessfully: false })
                    }}
                    onEscapeKey={() => this.setState({ deletedSuccessfully: false })}
                    onOutsideClick={() => this.setState({ deletedSuccessfully: false })}
                />
            </div>
        );
    }

}

export default Cuisines;
