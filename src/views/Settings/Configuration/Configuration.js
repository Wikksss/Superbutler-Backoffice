import React, { Component, Fragment } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Avatar from 'react-avatar';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import { Link } from 'react-router-dom'
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
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
import AceEditor from "react-ace";
import "react-datepicker/dist/react-datepicker.css";
import GlobalData from '../../../helpers/GlobalData'
import * as EnterpriseSettingService from '../../../service/EnterpriseSetting';
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import * as ThemeSetting from '../../../helpers/DefaultTheme';
import Constants from '../../../helpers/Constants';
import SocialLinks from './SocialLinks';
import SeoTracking from './SeoTracking';
import PaymentSetting from './PaymentSetting';
import Lables from '../../../containers/language/labels';
import * as EnterpriseMenuService from '../../../service/EnterpriseMenu'
const CdnUrl = GlobalData.restaurants_data.Supermeal_dev.baseImageUrl;
export default class Configuration extends Component {

    //#region Constructor
    constructor(props) {
        super(props);

        this.state = {


        };


    }






    loading = () => <div className="page-laoder-users">
        <div className="loader-menu-inner">
            <Loader type="Oval" color="#ed0000" height={50} width={50} />
            <div className="loading-label">Loading.....</div>
        </div>
    </div>






    render() {

        if (this.state.ShowLoader === true) {
            return this.loading()
        }

        return (
            <div className="card" id="CampaignDataWraper">
                   <div className="theme-heading-wrap m-b-20 card-new-title">
                        <h3 className="card-title ">Configuration Settings</h3>
                        <div className="theme-btn">
                        </div>
                    </div>
                <div className="card-body">
                 

                    <Tabs>
                        <TabList>
                            <Tab key={0}><span className="hidden-xs-down">Payment Settings</span></Tab>
                            {/* <Tab key={1}><span className="hidden-xs-down">Social and App links</span></Tab> */}
                            <Tab key={2} ><span className="hidden-xs-down">SEO & Tracking</span></Tab>
                            {/* <Tab key={3} ><span className="hidden-xs-down">Email and SMS</span></Tab> */}
                            {/* <Tab key={3} ><span className="hidden-xs-down">Custom CSS</span></Tab> */}
                        </TabList>

                        <TabPanel>
                            <div className="common-theme-wrap">
                                <PaymentSetting />
                            </div>

                        </TabPanel>
                        {/* <TabPanel>
                            <div className="common-theme-wrap">
                                <SocialLinks />
                            </div>
                        </TabPanel> */}
                        <TabPanel>
                            <div className="common-theme-wrap">
                                <SeoTracking />
                            </div>
                        </TabPanel>

                    </Tabs>



                </div>

            </div>

        );
    }

}
