import React, { Component, Fragment } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader, Form, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import * as Utilities from '../../../helpers/Utilities';
import Loader from 'react-loader-spinner';
import 'rc-color-picker/assets/index.css';
//import ReactDOM from 'react-dom';
import Constants from '../../../helpers/Constants';
import "react-datepicker/dist/react-datepicker.css";
import 'react-dropzone-uploader/dist/styles.css'
import * as EnterpriseCMSService from '../../../service/EnterpriseCMS';





export default class AllPages extends Component {
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
            linksList: [],
            searchList: [],
            slug: '',

            //
            ContentFile: "",
            MetaDescription: "",
            MetaKeywords: "",
            MetaTitle: "",
            Name: "",
            Slug: "",
            Title: "",
        }
        this.getCustomPages()
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

    editPage = (item) => {
        try {
            this.props.history.push('/sitesetting/CustomPages', { item: item })
        }
        catch (e) {
            console.log("editPage Exception ", e)
        }
    }


    deletePage = (item) => {
        try {
            // console.log('item', item)
            this.setState({
                showDeleteConfirmation: false
            })
        }
        catch (e) {
            console.log("editPage Exception ", e)
        }
    }

    deleteConfirmModal = (item) => {
        this.setState({
            showDeleteConfirmation: true,
            deleteConfirmationModelText: 'Are you sure you want to delete ' + item.Name + '?',
            deleteItem: item
        })
    }

    addnewModalToggle() {
        this.props.history.push('/sitesetting/CustomPages', { item: {} })
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

    render() {
        return (
            <div className="card" id="CampaignDataWraper">
                 <div className="theme-heading-wrap m-b-20 card-new-title">
                        <h3 className="card-title ">All Pages</h3>
                        <div className="theme-btn">
                        </div>
                    </div>
                <div className="card-body">
                   
                    <span className="add-cat-btn float-right" onClick={() => this.addnewModalToggle()}>
                        <i className="fa fa-plus" aria-hidden="true"></i>
                        <span className="hide-in-responsive">Add New </span>
                    </span>
                    <div className="common-theme-wrap">
                        <div className="ml-1 p-2 mt-2">
                            {this.state.linksList.length > 0 &&
                                <div className="">
                                    {this.state.linksList.map((nav, index) => {
                                        return (
                                            <div key={index} className="item-main-row ">
                                                <div className="p-2" >
                                                    <span className="item-option-name-price">{index + 1 + ") "}</span>
                                                    <span className="item-option-name-price">{nav.Name}</span>
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
                    {this.GenerateSweetConfirmationWithCancel(this.state.deleteItem)}
                </div>
            </div>
        )
    }
}