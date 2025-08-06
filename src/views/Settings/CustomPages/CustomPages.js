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
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import * as DefaultTheme from '../../../helpers/DefaultTheme';
import * as EnterpriseSettingService from '../../../service/EnterpriseSetting';
import arrayMove from 'array-move';
import AceEditor from "react-ace";
const $ = require('jquery');

export default class CustomPages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageName: '',
            editorText: '',
            pageTitle: '',
            metaTitle: '',
            keyword: '',
            description: '',
        }
        if(Object.keys(props.location.state.item).length > 0){
            this.state.pageName = props.location.state.item.Name
            this.state.pageTitle = props.location.state.item.Title
            this.state.metaTitle = props.location.state.item.MetaTitle
            this.state.keyword = props.location.state.item.MetaKeywords
            this.state.description = props.location.state.item.MetaDescription
        }
    }

    saveDetial = () => {
        try {
            let text = this.refs.aceEditor.editor.getValue();
            this.setState({
                editorText: text,
            })
            text = text.replace(/(\r\n|\n|\r)/gm, GlobalData.restaurants_data.Supermeal_dev.csvSeperator)

            let obj = {
                PageName: this.state.pageName,
                PageTitle: this.state.pageTitle,
                MetaTitle: this.state.metaTitle,
                Description: this.state.description,
                EditorText: text,
            }
            // console.log("obj", obj);
            let EnterpriseId = localStorage.getItem(Constants.Session.ENTERPRISE_ID);
            // console.log("EnterpriseId", EnterpriseId);
        }
        catch (e) {
            console.log("saveDetial Exception", e)
        }
    }

    render() {
        return (
            <div id="content-area" class="container">
                <div className="continer ">
                    <button className="btn btn-primary float-right">Add Layout </button>
                    <div className="row">
                        <div className="col-md-6 col-sm-4 ">
                            <h1>Page Description</h1>
                            <div className="form-group mb-3">
                                <div style={{ marginTop: 10 }}>
                                    <div className="col-md-9 col-sm-3 ">
                                        <div className="form-group mb-3">
                                            <AvForm>
                                                <div className="form-body">
                                                    <div className="formPadding">
                                                        <label id="name" className="control-label">Name</label>
                                                        <AvField onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.pageName = value
                                                            }
                                                        }} name="txtImageUrl" value={this.state.pageName} type="text" className="form-control flex-1"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </AvForm>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group mb-3">
                                <div style={{ marginTop: 10 }} >
                                    <div className="col-md-9 ">
                                        <div className="form-group mb-3">
                                            <AvForm>
                                                <div className="form-body">
                                                    <div className="formPadding">
                                                        <label id="name" className="control-label">Title</label>
                                                        <AvField onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.pageTitle = value
                                                            }
                                                        }} name="txtImageUrl" value={this.state.pageTitle} type="text" className="form-control flex-1"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </AvForm>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group mb-3">
                                <div style={{ marginTop: 10 }}>
                                    <div className="col-md-9 ">
                                        <div className="form-group mb-3">
                                            <AvForm>
                                                <div className="form-body">
                                                    <div className="formPadding">
                                                        <label id="name" className="control-label">Meta Title</label>
                                                        <AvField onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.metaTitle = value
                                                            }
                                                        }} name="txtImageUrl" value={this.state.metaTitle} type="text" className="form-control flex-1"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </AvForm>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group mb-3">
                                <div style={{ marginTop: 10 }}>
                                    <div className="col-md-9 ">
                                        <div className="form-group mb-3">
                                            <AvForm>
                                                <div className="form-body">
                                                    <div className="formPadding">
                                                        <label id="name" className="control-label">Keyword</label>
                                                        <AvField onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.keyword = value
                                                            }
                                                        }} name="txtImageUrl" value={this.state.keyword} type="text" className="form-control flex-1"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </AvForm>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group mb-3">
                                <div style={{ marginTop: 10 }}>
                                    <div className="col-md-9 ">
                                        <div className="form-group mb-3">
                                            <AvForm>
                                                <div className="form-body">
                                                    <div className="formPadding">
                                                        <label id="name" className="control-label">Description</label>
                                                        <AvField onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.description = value
                                                            }
                                                        }} name="txtImageUrl" value={this.state.description} type="tex" className="form-control flex-1"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </AvForm>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-4">
                            <h1>Html Editor</h1>
                            <AceEditor

                                style={{ width: '100%', height: 400, marginBottom: 15, fontSize: 16 }}
                                mode='css'
                                theme="github"
                                // onChange={this.onChangeCustomCss}
                                ref="aceEditor"
                                name="UNIQUE-ID"
                                value={this.state.editorText}
                                editorProps={{
                                    $blockScrolling: true
                                }}
                                className="AceEditortext"
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 setting-cus-field m-b-20 ">

                        <FormGroup>
                            <Button color="secondary" className="btn waves-effect waves-light btn-secondary pull-left  m-l-10" style={{ marginRight: 10 }} onClick={()=> this.props.history.goBack()}>Cancel</Button>
                            <Button onClick={() => this.saveDetial()} color="primary" className="btn waves-effect waves-light btn-primary pull-left">Save</Button>

                        </FormGroup>

                        <div className="action-wrapper">
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}