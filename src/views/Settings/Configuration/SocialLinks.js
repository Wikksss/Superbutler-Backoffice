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

export default class SocialLinks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageName: '',
            editorText: '',
            pageTitle: '',
            metaTitle: '',
            keyword: '',
            description: '',

            facebook: DefaultTheme.SocialLinks.facebook,
            youtube: DefaultTheme.SocialLinks.youtube,
            twitter: DefaultTheme.SocialLinks.twitter,
            tiktok: DefaultTheme.SocialLinks.tiktok,
            linkedin: DefaultTheme.SocialLinks.linkedin,
            instagram: DefaultTheme.SocialLinks.instagram,
            huaweiGallery: DefaultTheme.SocialLinks.huaweiGallery,
            AppStore: DefaultTheme.SocialLinks.AppStore,
            googlePlay: DefaultTheme.SocialLinks.googlePlay,
            microsoftStore: DefaultTheme.SocialLinks.microsoftStore,
        }

    }
    componentDidMount() {

    }

    saveDetial = () => {
        try {
            const { facebook, youtube, twitter, tiktok, linkedin, instagram, huaweiGallery, AppStore, googlePlay, microsoftStore } = this.state
            if (!Utilities.urlValidation(facebook)) {
                alert("enter correct Url")
                return
            }
            if (!Utilities.urlValidation(facebook)) {
                alert("enter correct Url")
                return
            }
            if (!Utilities.urlValidation(youtube)) {
                alert("enter correct Url")
                return
            }
            if (!Utilities.urlValidation(twitter)) {
                alert("enter correct Url")
                return
            }
            if (!Utilities.urlValidation(tiktok)) {
                alert("enter correct Url")
                return
            }
            if (!Utilities.urlValidation(linkedin)) {
                alert("enter correct Url")
                return
            }
            if (!Utilities.urlValidation(instagram)) {
                alert("enter correct Url")
                return
            }

            let socialLinks = {
                facebook: facebook,
                youtube: youtube,
                twitter: twitter,
                tiktok: tiktok,
                linkedin: linkedin,
                instagram: instagram,
                huaweiGallery: huaweiGallery,
                AppStore: AppStore,
                googlePlay: googlePlay,
                microsoftStore: microsoftStore
            }
            // console.log("socialLinks", socialLinks);
            DefaultTheme.setSocialLinks(socialLinks)
            let EnterpriseId = localStorage.getItem(Constants.Session.ENTERPRISE_ID);
            // console.log("EnterpriseId", EnterpriseId);
        }
        catch (e) {
            console.log("saveDetial Exception", e)
        }
    }

    render() {
        return (
            <div id="content-area" >
                <div className="continer ">
                    {/* <button className="btn btn-primary float-right">Add Layout </button> */}
                    <div className="row">
                        <div className="col-md-6 col-sm-4 ">
                            <div className="form-group mb-3">
                                <div style={{ marginTop: 10 }}>
                                    <div >
                                        <div className="form-group mb-3">
                                            <AvForm>
                                                <div className="form-body">
                                                    <div >
                                                        <label id="name" className="control-label">Facebook</label>
                                                        <AvField onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.facebook = value
                                                            }
                                                        }} name="txtImageUrl" value={this.state.facebook} type="text" className="form-control flex-1"
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
                                    <div >
                                        <div className="form-group mb-3">
                                            <AvForm>
                                                <div className="form-body">
                                                    <div >
                                                        <label id="name" className="control-label">Twitter</label>
                                                        <AvField onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.twitter = value
                                                            }
                                                        }} name="txtImageUrl" value={this.state.twitter} type="text" className="form-control flex-1"
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
                                    <div>
                                        <div className="form-group mb-3">
                                            <AvForm>
                                                <div className="form-body">
                                                    <div >
                                                        <label id="name" className="control-label">LinkedIn</label>
                                                        <AvField onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.linkedin = value
                                                            }
                                                        }} name="txtImageUrl" value={this.state.linkedin} type="text" className="form-control flex-1"
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
                                    <div >
                                        <div className="form-group mb-3">
                                            <AvForm>
                                                <div className="form-body">
                                                    <div >
                                                        <label id="GooglePlay" className="control-label">Google Play</label>
                                                        <AvField onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.googlePlay = value
                                                            }
                                                        }} name="googlePlay" value={this.state.googlePlay} type="text" className="form-control flex-1"
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
                                    <div >
                                        <div className="form-group mb-3">
                                            <AvForm>
                                                <div className="form-body">
                                                    <div >
                                                        <label id="MicrosoftStore" className="control-label">Microsoft Store</label>
                                                        <AvField onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.microsoftStore = value
                                                            }
                                                        }} name="MicrosoftStore" value={this.state.microsoftStore} type="text" className="form-control flex-1"
                                                        />
                                                    </div>
                                                </div>
                                            </AvForm>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="col-md-6 col-sm-4 ">
                            <div className="form-group mb-3">
                                <div style={{ marginTop: 10 }}>
                                    <div >
                                        <div className="form-group mb-3">
                                            <AvForm>
                                                <div className="form-body">
                                                    <div >
                                                        <label id="name" className="control-label">YouTube</label>
                                                        <AvField onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.youtube = value
                                                            }
                                                        }} name="txtImageUrl" value={this.state.youtube} type="text" className="form-control flex-1"
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
                                    <div >
                                        <div className="form-group mb-3">
                                            <AvForm>
                                                <div className="form-body">
                                                    <div >
                                                        <label id="name" className="control-label">TikTok</label>
                                                        <AvField onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.tiktok = value
                                                            }
                                                        }} name="txtImageUrl" value={this.state.tiktok} type="text" className="form-control flex-1"
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
                                    <div >
                                        <div className="form-group mb-3">
                                            <AvForm>
                                                <div className="form-body">
                                                    <div >
                                                        <label id="name" className="control-label">Instagram</label>
                                                        <AvField onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.instagram = value
                                                            }
                                                        }} name="txtImageUrl" value={this.state.instagram} type="text" className="form-control flex-1"
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
                                    <div >
                                        <div className="form-group mb-3">
                                            <AvForm>
                                                <div className="form-body">
                                                    <div >
                                                        <label id="AppStore" className="control-label">App Store</label>
                                                        <AvField onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.AppStore = value
                                                            }
                                                        }} name="AppStore" value={this.state.AppStore} type="text" className="form-control flex-1"
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
                                    <div >
                                        <div className="form-group mb-3">
                                            <AvForm>
                                                <div className="form-body">
                                                    <div >
                                                        <label id="huaweiGallery" className="control-label">HUAWEI APP Gallery</label>
                                                        <AvField onChange={(e) => {
                                                            if (e.target != undefined && e.target.value != undefined) {
                                                                var value = e.target.value
                                                                this.state.huaweiGallery = value
                                                            }
                                                        }} name="huaweiGallery" value={this.state.huaweiGallery} type="text" className="form-control flex-1"
                                                        />
                                                    </div>
                                                </div>
                                            </AvForm>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>


                    <div className="col-xs-12 setting-cus-field m-b-20 ">

                        <FormGroup>
                            <Button color="secondary" className="btn waves-effect waves-light btn-secondary pull-left " style={{ marginRight: 10 }}>Cancel</Button>
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