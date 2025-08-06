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
import TopSlider from './TopSlider';
import TopItems from './TopItems';
import TopCategories from './TopCategories';
import { updateSlider } from './TopSlider';
import * as EnterpriseMenuService from '../../../service/EnterpriseMenu'
const CdnUrl = GlobalData.restaurants_data.Supermeal_dev.baseImageUrl;
export default class HomePageSetting extends Component {

  //#region Constructor
  constructor(props) {
    super(props);

    this.state = {

      headerTheme: ThemeSetting.header,
      bodyTheme: ThemeSetting.body,
      footerTheme: ThemeSetting.footer,
      menuJson: ''

    };


    this.GetThemeSetting();
    this.GetEnterpriseMenuJson();
  }

  GetEnterpriseMenuJson = async () => {

    let json = await EnterpriseMenuService.GetEnterpriseJson()
    this.setState({
      menuJson: json.MenuJson
    })

    // this.menuTopItems_WriteHtmlRestaurantCategory(json.MenuJson)
  }

  GetJsonFile = () => {
    try {
      let EnterpriseId = localStorage.getItem(Constants.Session.ENTERPRISE_ID)


    }
    catch (e) {
      console.log("GetJsonFile Exception", e)
    }
  }


  GetThemeSetting = async () => {
    try {
      let EnterpriseId = localStorage.getItem(Constants.Session.ENTERPRISE_ID)
      let response = await EnterpriseSettingService.GetSlidersJsonFIle(EnterpriseId);
      if (!Utilities.stringIsEmpty(response)) {
        ThemeSetting.setSliders(response.MenuSlider)
        // ThemeSetting.setTopItems(response.TopItems)
        // ThemeSetting.setPopularCategory(response.PopularCategory)
        updateSlider();
      }


    }
    catch (e) {
      console.log("GetThemeSetting Exception", e.message)
    }
  }

  loading = () => <div className="page-laoder-users">
    <div className="loader-menu-inner">
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
      <div className="loading-label">Loading.....</div>
    </div>
  </div>

  componentDidMount() {

    var id = this.props.match.params.id;

    if (id !== undefined) {
      this.setState({ CampaignId: id });
      this.GetCampaign(id);
    } else {
      this.setState({ ShowLoader: false });
    }

  }

  shouldComponentUpdate() {
    return true;
  }
  saveTheme = async () => {
    try {
      let theme = {};

      theme.MenuSlider = ThemeSetting.menuSlider;
      // theme.TopItems = ThemeSetting.TopItems;
      // theme.PopularCategory = ThemeSetting.PopularCategory;
      let EnterpriseId = localStorage.getItem(Constants.Session.ENTERPRISE_ID)
      let response = await EnterpriseSettingService.updateSliders(theme, EnterpriseId)
      if (response.IsSave) {
        Utilities.notify("Slider setting updated successfully", "s");
        this.GetThemeSetting()
      }

    }
    catch (e) {
      Utilities.notify("Slider setting update failed.", "e");
      console.log("saveTheme Exception", e)
    }
  }

  saveThemeButton = () => {
    return (
      <div className="col-xs-12 setting-cus-field m-b-20">

        <FormGroup>
          <Button color="secondary" className="btn waves-effect waves-light btn-secondary pull-left  m-l-10" style={{ marginRight: 10 }}>Cancel</Button>
          <Button onClick={() => this.saveTheme()} color="primary" className="btn waves-effect waves-light btn-primary pull-left">Save</Button>

        </FormGroup>

        <div className="action-wrapper">
        </div>
      </div>
    )
  }
  render() {

    if (this.state.ShowLoader === true) {
      return this.loading()
    }

    return (
      <div className="card" id="CampaignDataWraper">
        {/* <div className="theme-heading-wrap m-b-20 card-new-title">
          <h3 className="card-title ">Slider Settings</h3>
          <div className="theme-btn">
          </div>
        </div> */}
        <div className="card-body">

        <div className="common-theme-wrap">
                <TopSlider headerTheme={this.state.headerTheme} />
                {/* {this.saveThemeButton()} */}
              </div>

          {/* <Tabs>
            <TabList>
              <Tab key={0}><span className="hidden-xs-down">Top Slider</span></Tab>
              <Tab key={1} ><span className="hidden-xs-down">Top Items</span></Tab>
              <Tab key={2} ><span className="hidden-xs-down">Top Categories</span></Tab>
            </TabList>

            <TabPanel>
              <div className="common-theme-wrap">
                <TopSlider headerTheme={this.state.headerTheme} />
                {this.saveThemeButton()}
              </div>

            </TabPanel>
            <TabPanel>
              <div className="common-theme-wrap">
                <TopItems menuJson={this.state.menuJson} />
                <BodySetting bodyTheme={this.state.bodyTheme} />
                {this.saveThemeButton()}
              </div>
            </TabPanel>
            <TabPanel>
              <div className="common-theme-wrap">
                <TopCategories menuJson={this.state.menuJson} />
                <FooterSetting footerTheme={this.state.footerTheme} />
                {this.saveThemeButton()}
              </div>
            </TabPanel>

          </Tabs> */}



        </div>

      </div>

    );
  }

}
