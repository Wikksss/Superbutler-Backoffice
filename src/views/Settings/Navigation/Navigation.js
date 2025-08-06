import React, { Component, Fragment } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Avatar from 'react-avatar';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import { Link } from 'react-router-dom'
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader, Form, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import * as CampaignService from '../../../service/Campaign';
import * as Utilities from '../../../helpers/Utilities';
import Loader from 'react-loader-spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import ImageUploader from 'react-images-upload';
import 'rc-color-picker/assets/index.css';
//import ReactDOM from 'react-dom';
import ColorPicker from 'rc-color-picker';
import DatePicker from "react-datepicker";
import Constants from '../../../helpers/Constants';
import "react-datepicker/dist/react-datepicker.css";
import GlobalData from '../../../helpers/GlobalData'
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import * as DefaultTheme from '../../../helpers/DefaultTheme';
import * as EnterpriseSettingService from '../../../service/EnterpriseSetting';
import * as EnterpriseCMSService from '../../../service/EnterpriseCMS';
import arrayMove from 'array-move';
const SortableItem = sortableElement(({ value }) => <li className="sortableHelper">{value}</li>);

const SortableContainer = sortableContainer(({ items }) => {
    if (items === undefined) { return; }
    return (
        <ul>
            {items.map((value, index) => (
                <SortableItem key={`item-${index}`} style={{ zIndex: 100000 }} index={index} value={value.Text} />
            ))}
        </ul>
    );
});



export default class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navigationLeftPanel: [{ id: 0, name: "Header Nav" }, { id: 1, name: "Footer Nav" },],
            selectedLeftPanelId: 0,
            headerJson: [],
            footerJson: [],
            scrolled: false,
            addnewModal: false,
            navName: '',
            navLink: '',
            navNewTab: false,
            isEdit: false,
            Sort: false,
            SortCategories: [],
            SortCategoriesIdCsv: '',
            showDeleteConfirmation: false,
            showInvalidUrlAlert: false,
            showInvalidSlugAlert: false,
            linksList: [],
            searchList: [],
            slug: '',
            pages: true,
            isExternal: false,
            pagesAndExternalSwitch: false,
            pageName: ''
        }
        this.setSortState = this.setSortState.bind(this)
        this.getCustomPages()
        this.getNavigationJson();
    }

    getCustomPages = async () => {
        try {
            let EnterpriseId = localStorage.getItem(Constants.Session.ENTERPRISE_ID)
            let response = await EnterpriseCMSService.getCustomPages(EnterpriseId)
            if (!Utilities.stringIsEmpty(response)) {
                this.setState({
                    linksList: response
                })
            }
        } catch (error) {
            console.log('Settings => HomePageSettings, Navigation ,getCustomPages', error.message)
        }

    }

    SortModal() {
        this.setState({
            Sort: !this.state.Sort,
            slug: ''
        });
    }
    saveNavigationJson = async () => {
        try {
            let theme = {}
            theme.header = DefaultTheme.NavigationheaderJson
            theme.footer = DefaultTheme.NavigationFooterJson;
            let EnterpriseId = localStorage.getItem(Constants.Session.ENTERPRISE_ID)
            let response = await EnterpriseSettingService.UpdateNavigation(theme, EnterpriseId)
            if (response.IsSave) {
                Utilities.notify("Navigation setting updated successfully", "s");
                this.getNavigationJson()
                this.setState({
                    slug: ''
                })
            }

        }
        catch (e) {
            Utilities.notify("Navigation setting update failed.", "e");
            console.log("saveTheme Exception", e)
        }
    }

    getNavigationJson = async () => {
        try {
            let EnterpriseId = localStorage.getItem(Constants.Session.ENTERPRISE_ID)
            let response = await EnterpriseSettingService.GetNavigationJson(EnterpriseId);
            if (!Utilities.stringIsEmpty(response)) {
                DefaultTheme.setNavigationheaderJson(response.header)
                DefaultTheme.setNavigationFooterJson(response.footer)
                this.setState({
                    headerJson: DefaultTheme.NavigationheaderJson,
                    footerJson: DefaultTheme.NavigationFooterJson,
                }, () => this.setSortState())
            }
        }
        catch (e) {
            console.log("GetThemeSetting Exception", e.message)
        }
    }
    componentDidMount() {
        window.addEventListener('scroll', () => {
            const istop = window.scrollY < 350;

            if (istop !== true && !this.state.scrolled) {
                this.setState({ scrolled: true })
            }
            else if (istop == true && this.state.scrolled) {
                this.setState({ scrolled: false })
            }

        });
    }

    addnewModalToggle = () => {
        this.setState({
            addnewModal: !this.state.addnewModal,
            navLink: '',
            navName: '',
            navNewTab: false,
            slug: '',
            isEdit: false
        })
    }
    navigationToggle = (param) => {
        this.setState({
            selectedLeftPanelId: param
        }, () => this.setSortState())
    }

    resetState = () => {
        this.setState({

            navLink: '',
            navName: '',
            navNewTab: false,
            addnewModal: false,
            isEdit: false,
        })
    }
    RenderLineSeperator() {
        return (<p className="separator"><span></span></p>)
    }



    addPage = () => {
        try {
            let temp = this.state.selectedLeftPanelId == 0 ? this.state.headerJson : this.state.footerJson;
            let EnterpriseId = localStorage.getItem(Constants.Session.ENTERPRISE_ID)
            let obj = {
                Id: temp.length + 1,
                Text: this.state.navName,
                Url: this.state.slug != "" ? EnterpriseId > 0 ? String(this.state.slug).includes('pages/') ? this.state.slug: 'pages/' + this.state.slug : this.state.slug : this.state.navLink,
                //Url: this.state.slug != "" ? EnterpriseId > 0 ? 'pages/' + this.state.slug : this.state.slug : this.state.navLink,
                PageName: this.state.isExternal == true ? '' : this.state.pageName,
                Target: this.state.navNewTab ? "_blank" : "",
                IsExternal: this.state.isExternal
            }
            if (this.state.isExternal == true) {
                var regex = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
                var check = regex.test(obj.Url)
                if (!check) {
                    this.setState({
                        showInvalidUrlAlert: true
                    })
                    return
                }
            }
            if (this.state.pages == true) {
                var slugChecker = false
                var url = this.state.slug != '' ? this.state.slug : this.state.navLink
                if(String(url).includes('pages/')){
                    url = url.split('/')[1].trim()
                }
                for (let index = 0; index < this.state.linksList.length; index++) {
                    if (url == this.state.linksList[index].Slug) {
                        slugChecker = true
                        break
                    }
                }
                if (!slugChecker) {
                    this.setState({
                        showInvalidSlugAlert: true
                    })
                    return
                }
            }
            temp.push(obj);
            if (this.state.selectedLeftPanelId == 0) {
                this.setState({
                    headerJson: temp
                })
                DefaultTheme.setNavigationheaderJson(temp)
            }
            else {
                this.setState({
                    footerJson: temp
                })
                DefaultTheme.setNavigationFooterJson(temp)
            }
            this.resetState();
            this.saveNavigationJson();
        }
        catch (e) {
            console.log("addPage Exception", e)
        }
    }

    AssignValues = (event) => {
        this.setState({
            navNewTab: event
        })
    }
    AssignPageValues = (value) => {
        this.setState({
            pages: value,
            isExternal: false,
            navLink:''
        })
    }
    AssignIsExternalValues = (e) => {
        this.setState({
            isExternal: e,
            pages: false,
            slug: '',
            navLink:''
        })
    }

    getFilterData(query) {
        try {
            if (query === '') {
                this.setState({
                    searchList: []
                })
            }
            if (query !== "" && query !== null && query !== undefined) {
                const { linksList } = this.state;
                const regex = new RegExp(`${query.trim()}`, 'i');
                this.state.searchList = linksList.filter(item => item.Name.search(regex) >= 0);
                this.setState({
                    searchList: linksList.filter(item => item.Name.search(regex) >= 0)
                })
            }
        }
        catch (e) {
            console.log("GetThemeSetting Exception, getFilterData", e.message)
        }
    }

    selectValue = (value) => {
        this.setState({
            navLink: value.Name,
            slug: value.Slug,
            searchList: '',
            pageName: value.Name
        })
    }

    AddNewPage = () => {
        return (
            <Modal isOpen={this.state.addnewModal} toggle={this.addnewModalToggle} size="md" className={this.props.className}>
                <ModalHeader toggle={this.toggleModal}> {this.state.isEdit ? 'Edit page': 'Add Page'} </ModalHeader>
                <ModalBody>
                    <div style={{ marginTop: 10 }} className="row">
                        <div className="col-md-12 ">
                            <div className="form-group mb-3">
                                <AvForm>
                                    <div className="form-body">
                                        <div className="formPadding">
                                            <label id="name" className="control-label">Name</label>
                                            <AvField onChange={(e) => {
                                                if (e.target != undefined && e.target.value != undefined) {
                                                    var value = e.target.value
                                                    this.state.navName = value
                                                }
                                            }} name="txtImageUrl" value={this.state.navName} type="text" className="form-control flex-1"
                                                required
                                            />
                                        </div>
                                    </div>
                                </AvForm>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: 20 }} className='row ml-2'>
                        <div className="row">
                            <div className="col-md-12 ">
                                <div className="form-group mb-3">
                                    <AvForm>
                                        <div className="flex row">
                                            <AvField type="checkbox" name="chkNav" value={this.state.pages} checked={this.state.pages}
                                                onChange={(e) => {
                                                    this.AssignPageValues(e.target.checked)
                                                }
                                                }
                                                className="form-checkbox" />
                                            <Label htmlFor={"chkNav"} className="modal-label-head">Pages</Label>

                                        </div>
                                    </AvForm>
                                </div>
                            </div>
                        </div>

                        <div className="row ml-2">
                            <div className="col-md-12 ">
                                <div className="form-group mb-3">
                                    <AvForm>
                                        <div className="flex row">
                                            <AvField type="checkbox" name="chkNav" value={this.state.isExternal} checked={this.state.isExternal}
                                                onChange={(e) => {
                                                    this.AssignIsExternalValues(e.target.checked)
                                                }
                                                }
                                                className="form-checkbox" />
                                            <Label htmlFor={"chkNav"} className="modal-label-head">External</Label>

                                        </div>
                                    </AvForm>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{marginTop: -20}} className="row ">
                        <div className="col-md-12 ">
                            <div className="form-group mb-3">
                                <AvForm>
                                    <div className="form-body">
                                        <div className="formPadding">
                                            {/* <label id="name" className="control-label">Link</label> */}
                                            <AvField onChange={(e) => {
                                                if (e.target != undefined && e.target.value != undefined) {
                                                    var value = e.target.value
                                                    this.state.navLink = value
                                                    if (value == '') {
                                                        this.setState({
                                                            slug: ''
                                                        })
                                                    }
                                                    this.getFilterData(value)
                                                }
                                            }} name="txtHeading" value={this.state.navLink} type="text" className="form-control "
                                                required
                                            />
                                            {
                                                this.state.searchList != "" && this.state.pages == true &&
                                                <div>
                                                    {
                                                        this.state.searchList.map((res) => {
                                                            return (
                                                                <div style={{ padding: 5, justifyContent: 'center', marginTop: 5, marginBottom: 5 }} onClick={() => {
                                                                    this.selectValue(res)
                                                                }}>
                                                                    {res.Name}
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </AvForm>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: 10 }} className="row">
                        <div className="col-md-12 ">
                            <div className="form-group mb-3">
                                <AvForm>
                                    <div className="flex row">
                                        <AvField type="checkbox" name="chkNav" value={this.state.navNewTab} checked={this.state.navNewTab}
                                            onChange={(e) => this.AssignValues(e.target.checked)}
                                            className="form-checkbox" />
                                        <Label htmlFor={"chkNav"} className="modal-label-head">New Tab</Label>

                                    </div>
                                </AvForm>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 ">
                        <div className="theme-btn float-left">
                            <button onClick={() => this.addnewModalToggle()} className="btn  btn-secondary pull-left   btn btn-secondary mr-2" >Cancel</button>
                            <button
                                onClick={() => { this.state.isEdit ? this.updateNavigation() : this.addPage() }}
                                className="btn pull-left btn btn-success">{this.state.isEdit ? "Update" : "Add"}</button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        )
    }

    editPage = (item) => {
        try {
            this.setState({
                navName: item.Text,
                navLink: item.IsExternal == true ? item.Url : item.PageName,
                pageName: item.IsExternal == true ? '' : item.PageName,
                slug: item.Url,
                pages: !item.IsExternal,
                isExternal: item.IsExternal,
                ReadOnly: item.ReadOnly,
                navNewTab: item.Target == "" ? false : true,
                addnewModal: true,
                id: item.Id,
                isEdit: true
            })
        }
        catch (e) {
            console.log("editPage Exception ", e)
        }
    }
    updateNavigation = () => {
        let temp = this.state.selectedLeftPanelId == 0 ? this.state.headerJson : this.state.footerJson;
        let EnterpriseId = localStorage.getItem(Constants.Session.ENTERPRISE_ID)
        let obj = {
            Id: this.state.id,
            Text: this.state.navName,
             Url: this.state.slug != "" ? EnterpriseId > 0 ? String(this.state.slug).includes('pages/') ? this.state.slug: 'pages/' + this.state.slug : this.state.slug : this.state.navLink,
            //Url: this.state.slug != "" ?  this.state.slug : this.state.navLink,
            PageName: this.state.isExternal == true ? '' : this.state.pageName,
            Target: this.state.navNewTab ? "_blank" : "",
            IsExternal: this.state.isExternal
        }
        if (this.state.isExternal == true) {
            var regex = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
            var check = regex.test(obj.Url)
            if (!check) {
                this.setState({
                    showInvalidUrlAlert: true
                })
                return
            }
        }
        if (this.state.pages == true) {
            var slugChecker = false
            var url = this.state.slug != '' ? this.state.slug : this.state.navLink
            if(String(url).includes('pages/')){
                url = url.split('/')[1].trim()
            }
            for (let index = 0; index < this.state.linksList.length; index++) {
                if (url == this.state.linksList[index].Slug) {
                    slugChecker = true
                }
            }
            if (!slugChecker) {
                this.setState({
                    showInvalidSlugAlert: true
                })
                return
            }
        }
        let updateIndexItem = temp.findIndex(a => a.Id == this.state.id)
        temp.splice(updateIndexItem, 1, obj);
        this.setState({
            headerJson: this.state.selectedLeftPanelId == 0 ? temp : this.state.headerJson,
            footerJson: this.state.selectedLeftPanelId == 1 ? temp : this.state.footerJson,
        }, () => {
            DefaultTheme.setNavigationheaderJson(this.state.headerJson)
            DefaultTheme.setNavigationFooterJson(this.state.footerJson)
            this.saveNavigationJson()
            this.resetState()
        })
    }
    deletePage = (item) => {
        try {
            let temp = this.state.selectedLeftPanelId == 0 ? this.state.headerJson : this.state.footerJson
            let updatedList = temp.filter(a => a.Id != item.Id);
            if (this.state.selectedLeftPanelId == 0) {
                this.setState({
                    headerJson: updatedList
                })
                DefaultTheme.setNavigationheaderJson(updatedList)
            }
            else {
                this.setState({
                    footerJson: updatedList
                })
                DefaultTheme.setNavigationFooterJson(updatedList)
            }
            this.setState({
                showDeleteConfirmation: false
            })
            this.saveNavigationJson()
        }
        catch (e) {
            console.log("editPage Exception ", e)
        }
    }

    deleteConfirmModal = (item) => {
        this.setState({
            showDeleteConfirmation: true,
            deleteConfirmationModelText: item.Text,
            deleteItem: item
        })
    }



    GenerateSweetConfirmationWithCancel(item) {
        return (
            <SweetAlert
                show={this.state.showDeleteConfirmation}
                title=""
                text={this.state.deleteConfirmationModelText}
                showCancelButton
                onConfirm={() => this.deletePage(item)}
                confirmButtonText="Yes"
                onCancel={() => {
                    this.setState({ showDeleteConfirmation: false });
                }}
                onEscapeKey={() => this.setState({ showDeleteConfirmation: false })}
            // onOutsideClick={() => this.setState({ showDeleteConfirmation: false })}
            />
        )
    }

    GenerateSweetAlertForURlValidation() {
        return (
            <SweetAlert
                show={this.state.showInvalidUrlAlert}
                title="Validation"
                text={'Invalid Url!'}
                onConfirm={() => this.setState({ showInvalidUrlAlert: false })}
                confirmButtonText="Okay"
                onEscapeKey={() => this.setState({ showInvalidUrlAlert: false })}
            />
        )
    }
    GenerateSweetAlertForSlugValidation() {
        return (
            <SweetAlert
                show={this.state.showInvalidSlugAlert}
                title="Validation"
                text={'Incorrect value for pages!'}
                onConfirm={() => this.setState({ showInvalidSlugAlert: false })}
                confirmButtonText="Okay"
                onEscapeKey={() => this.setState({ showInvalidSlugAlert: false })}
            />
        )
    }

    setSortState = () => {
        try {

            let sortCSV = [];
            let temp = (this.state.selectedLeftPanelId == 0) ? this.state.headerJson : this.state.footerJson
            for (var u = 0; u < temp.length; u++) {
                sortCSV.push(temp[u].Id);
            }
            sortCSV = sortCSV.toString()
            this.state.SortCategories = temp;
            this.state.SortCategoriesIdCsv = sortCSV
            this.setState({
                SortCategories: this.state.SortCategories,
                SortCategoriesIdCsv: this.state.SortCategoriesIdCsv

            })
        }
        catch (e) {
            console.log("setSortState Exception", e)
        }
    }

    onSortEnd = ({ oldIndex, newIndex }) => {
        this.setState(({ SortCategories }) => ({
            SortCategories: arrayMove(SortCategories, oldIndex, newIndex),
        }));

        this.GetUpdatedCategorySort(this.state.SortCategories);

    };

    GetUpdatedCategorySort(categories) {

        let sortCSV = [];
        categories = this.state.SortCategories

        for (var u = 0; u < categories.length; u++) {
            sortCSV.push(categories[u].Id);
        }
        sortCSV = sortCSV.toString()
        this.setState({ SortCategoriesIdCsv: sortCSV })
    }
    UpdateCategorySort = () => {
        try {
            this.setState({
                headerJson: this.state.selectedLeftPanelId == 0 ? this.state.SortCategories : this.state.headerJson,
                footerJson: this.state.selectedLeftPanelId == 1 ? this.state.SortCategories : this.state.footerJson,
            }, () => {
                DefaultTheme.setNavigationheaderJson(this.state.headerJson);
                DefaultTheme.setNavigationFooterJson(this.state.footerJson);
                this.saveNavigationJson()
                this.SortModal()
            })
        }
        catch (e) {
            console.log("UpdateCategorySort exception", e)
        }
    }
    GenerateNavigationSortModel() {

        if (!this.state.Sort) {
            return ('');
        }
        return (
            <Modal isOpen={this.state.Sort} toggle={this.SortModal} className={this.props.className}>
                <ModalHeader>Sort Navigation</ModalHeader>
                <ModalBody>
                    <div className="m-b-15">Use mouse or finger to drag Articles and sort their positions.</div>
                    <div className="sortable-wrap sortable-item sortable-new-wrap">

                        <SortableContainer
                            items={this.state.SortCategories}
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
    render() {
        return (
            <div className="card" id="CampaignDataWraper">
                     <div className="theme-heading-wrap m-b-20 card-new-title">
                        <h3 className="card-title ">Navigation Settings</h3>
                       
                    </div>
                <div className="card-body common-theme-wrap">
               

                    <Tabs>
                        <TabList>
                            <Tab onClick={() => this.navigationToggle(0)} key={0}><span className="hidden-xs-down">Header</span></Tab>
                            <Tab onClick={() => this.navigationToggle(1)} key={1} ><span className="hidden-xs-down">Footer</span></Tab>
                        </TabList>
                        <div className="theme-btn float-right">
                        <div className="menu-sort-link" onClick={() => this.SortModal()}>
                            <i className=" fa fa-sort-amount-asc" aria-hidden="true"></i>
                                Sort Navigation
                                </div>
                        <span className="add-cat-btn float-right" onClick={() => this.addnewModalToggle()}>
                            <i className="fa fa-plus" aria-hidden="true"></i>
                            <span className="hide-in-responsive">Add New </span>
                        </span>
                        </div>
                        
                        <TabPanel>
                            <div className="common-theme-wrap">

                                <div className="ml-1 p-2 ">
                                    {this.state.selectedLeftPanelId == 0 && this.state.headerJson.length > 0 &&
                                        <div className="">
                                            {this.state.headerJson.map((nav, index) => {
                                                return (
                                                    <div key={index} className="navigation-item-row">
                                                        <div className="navigation-item" >
                                                           
                                                            <span className="item-option-name-price">{index + 1 + "  -  "}{nav.Text}</span>
                                                            <div className="d-flex slider-buttons">
                                    <div><span class="m-b-0 statusChangeLink m-r-20" onClick={() => this.editPage(nav)} ><span><i class="fa fa-edit font-18"></i>Edit</span></span>
                                        <span class="m-b-0 statusChangeLink " onClick={() => this.deleteConfirmModal(nav)}><i class="fa fa-trash-o font-18 delete" aria-hidden="true"></i> Remove</span></div>
                                </div>
                                                        
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    }
                                </div>
                            </div>

                        </TabPanel>
                        <TabPanel>
                            <div className="common-theme-wrap">
                                <div className="ml-1 p-2 ">
                                    {this.state.selectedLeftPanelId == 1 && this.state.footerJson.length > 0 &&
                                        <div>
                                            {this.state.footerJson.map((nav, index) => {
                                                return (
                                                    <div key={index} className="item-main-row ">
                                                        <div className="p-2" >
                                                            <span className="item-option-name-price">{index + 1 + ") "}</span>
                                                            <span className="item-option-name-price">{nav.Text}</span>

                                                            <span className="menu-right-list-buttons">
                                                                <span className="ml-4">
                                                                    <i className={"fa fa-pencil-square-o"} data-tip data-for='Edit' aria-hidden="true"
                                                                        onClick={() => this.editPage(nav)}
                                                                    > Edit</i>
                                                                </span>
                                                                <span className="sa-warning ml-4">
                                                                    <i className={"fa fa-trash"} aria-hidden="true" data-tip data-for='Delete'
                                                                        onClick={() => this.deleteConfirmModal(nav)}
                                                                    > Delete</i>
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    }
                                </div>
                            </div>
                        </TabPanel>


                    </Tabs>

                    {this.AddNewPage()}
                    {this.GenerateNavigationSortModel()}
                    {this.GenerateSweetAlertForURlValidation()}
                    {this.GenerateSweetAlertForSlugValidation()}
                    {this.GenerateSweetConfirmationWithCancel(this.state.deleteItem)}

                </div>

            </div>

        )
    }
}