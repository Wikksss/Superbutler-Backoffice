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
import HeaderSetting from './HeaderSetting';
import FooterSetting from './FooterSetting';
import BodySetting from './BodySetting';
import * as ThemeSetting from '../../../helpers/DefaultTheme';
import Constants from '../../../helpers/Constants';
import { updateHeader } from './HeaderSetting';
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel, } from 'react-accessible-accordion';
// import { AiOutlineShoppingCart } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { HiOutlineUser } from "react-icons/hi";
import { BsImage } from "react-icons/bs";
import { AiOutlineArrowUp } from "react-icons/ai";
// import { BiArrowBack } from "react-icons/bi";
// import { RxCross2 } from "react-icons/rx";
// import *as svgIcon from '../../containers/svgIcon';
import 'react-accessible-accordion/dist/fancy-example.css';
import { updateFooter } from './FooterSetting';
import { updateBody } from './BodySetting';
// import 'react-datepicker/dist/react-datepicker.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import moment from 'moment-timezone';
// import DatePicker from 'react-datepicker';
// $.DataTable = require('datatables.net');
// var ColorPicker = require('rc-color-picker');
// var React = require('react');
// var ReactDOM = require('react-dom');

const moment = require('moment-timezone');
const $ = require('jquery');
const PhotoGroupName = ["CampaignLogo", "CampaignMainBanner", "CampaignSubBanner", "CampaignFoodImages", "CampaignBackgroundImages", "CampaignAppBackgroundImages"];

function closeHandler(colors) {
  console.log(colors);
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

const MyUploader = (multiple) => {
  // specify upload params and url for your files
  const getUploadParams = ({ meta }) => { return { url: 'https://httpbin.org/post' } }

  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, file }, status) => { console.log(status, meta, file) }

  // receives array of files that are done uploading when submit button is clicked
  const handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
  }

  return (
    <Dropzone
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      multiple={multiple}
      accept="image/*,audio/*,video/*"
    />
  )
}
class ThemeSettings extends Component {

  //#region Constructor
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      CampaignList: [],
      ShowLoader: true,
      CampaignTheme: [],
      CampaignContentJson: [],
      WebContent: {},
      AppContent: {},
      CampaignId: 0,
      startDate: new Date(),
      endDate: new Date(),
      pictures: [],
      showModal: false,
      groupName: "",
      oldPhotoName: "",
      modalHeader: "",
      PhotoName: null,
      SelectedTeaser: 0,
      OldLogoPhotoName: "",
      OldBackgroundPhotoName: "",
      OldAppBackgroundPhotoName: "",
      OldFoodPhotoName: "",
      OldMainBannerPhotoName: "",
      OldSubBannerPhotoName: "",
      OldAppSubBannerPhotoName: "",
      ImageExtension: '.png',
      TempImg: "",
      image: null,
      FileTypeErrorMessage: "",
      background: '#fff',
      headerHover: [false, false, false, false],
      bodylinksHover: [false, false, false, false, false],
      footerLinksHover: [false, false, false],
      footerSocialIcon: [false, false, false, false, false],
      footerbtnHover: false,
      headerTheme: ThemeSetting.header,
      bodyTheme: ThemeSetting.body,
      footerTheme: ThemeSetting.footer,
      customCss: '',
      scrolled: false,
      IsSave: false,
      IsEditorSave: false,
      tabindex: 0,
      showDesktopView: true,
      isActive: false,
      widthmobile: true,
      height: 0,
      CustomCssN: false,
      themeView:'theme-classic',
      userObj: {},
      loadingTheme: true,
    };

    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
      this.state.userObj = userObj
    }

    // this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    // this.SaveCampaign = this.SaveCampaign.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.toggleHover = this.toggleHover.bind(this);
    this.footerSocialIconHover = this.footerSocialIconHover.bind(this);
    this.footerLinksHover = this.footerLinksHover.bind(this);
    this.footerbtnHover = this.footerbtnHover.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.showText = this.showText.bind(this);
    // this.RemoveContentImageHandler = this.RemoveContentImageHandler.bind(this);
    this.GetThemeSetting();
  }

  GetThemeSetting = async () => {
    try {
      this.setState({loadingTheme: true})
      let EnterpriseId = localStorage.getItem(Constants.Session.ENTERPRISE_ID)
      let response = await EnterpriseSettingService.GetThemeSetting(EnterpriseId);
      if (!Utilities.stringIsEmpty(response)) {
        if(response.ThemeJson != ""){
          let themeresponse = JSON.parse(response.ThemeJson)
          ThemeSetting.setheader(themeresponse.Header)
          ThemeSetting.setbody(themeresponse.Body)
          ThemeSetting.setfooter(themeresponse.Footer)
        }

        this.setState({
          headerTheme: ThemeSetting.header,
          bodyTheme: ThemeSetting.body,
          footerTheme: ThemeSetting.footer,
          themeView: response.ThemeName == "" || response.ThemeName == undefined ? this.state.themeView : response.ThemeName,
          IsSave: false
        })
        updateHeader();
        updateFooter()
      }
      if (!Utilities.stringIsEmpty(response.CustomCss)) {
        let custom = response.CustomCss;
        custom = custom.replaceAll(GlobalData.restaurants_data.Supermeal_dev.csvSeperator, "\n");
        this.setState({
          customCss: custom,
          savedCustomCss: custom
        })
      }
    }
    catch (e) {
      this.setState({
        IsSave: false
      })
      console.log("GetThemeSetting Exception", e.message)
    }
    this.setState({loadingTheme: false})
  }
  scrollTop = () => {
    window.scrollTo({ top: 50, left: 0, });
  }

  saveCustomCss = async (savingTheme) => {
    try {
      let EnterpriseId = localStorage.getItem(Constants.Session.ENTERPRISE_ID)
      let customCss = this.state.customCss
      let response = await EnterpriseSettingService.UpdateCustomCss(customCss, EnterpriseId)
      if (response.IsUpdated) {
        this.setState({
          IsEditorSave: false
        })
        // if(!savingTheme)
        //   Utilities.notify("Custom Css updated successfully", "s");
      }
    }
    catch (e) {
      this.setState({
        IsEditorSave: false
      })
      if (!savingTheme)
        Utilities.notify("Custom Css update failed.", "e");
      console.log("saveCustomCss Exception", e)
    }
  }
  showText(savingTheme) {

    //let text = this.refs.aceEditor.editor.getValue();
    
    this.setState({
      
      IsEditorSave: !savingTheme
    }, () => {
      this.saveCustomCss(false)
    })
  }

  toggleHover(index) {
    let temp = this.state.headerHover;
    temp[index] = !temp[index]
    this.setState({
      headerHover: temp
    })
  }
  bodylinksHover(index) {
    let temp = this.state.bodylinksHover;
    temp[index] = !temp[index]
    this.setState({
      bodylinksHover: temp
    })
  }
  footerSocialIconHover(index) {
    let temp = this.state.footerSocialIcon;
    temp[index] = !temp[index]
    this.setState({
      footerSocialIcon: temp
    })
  }
  footerLinksHover(index) {
    let temp = this.state.footerLinksHover;
    temp[index] = !temp[index]
    this.setState({
      footerLinksHover: temp
    })
  }
  footerbtnHover() {

    this.setState({ footerbtnHover: !this.state.footerbtnHover });
  }
  toggleModal() {

    this.setState({ showModal: !this.state.showModal });
  }

  handleDesktopClick = () => {
    this.setState({
      showDesktopView: true,
      widthmobile: false,
    });
  }

  handleMobileClick = () => {
    this.setState({
      showDesktopView: false
    });
  }

  showHideSidebarRight = () => {
    this.setState(prevState => ({
      isActive: !prevState.isActive
    }));
  }

  handleChangeComplete = (color) => {
    this.setState({ background: color.hex });
  };
  StartDateChange = date => {
    this.setState({ startDate: date });
  };
  EndDateChange = date => {
    this.setState({ endDate: date });
  };
  changeHandler(colors, control) {

    let campaign = this.state.CampaignTheme;
    let webContent = this.state.WebContent;
    switch (control) {
      case "C_B":
        campaign.BackgroundColor = colors.color;
        break;

      case "C_T":
        campaign.TextColor = colors.color;
        break;

      case "S_B":
        webContent.SearchInputBgColor = colors.color;
        break;
      case "S_T":
        webContent.SearchInputTextColor = colors.color;
        break;
      case "SB_B":
        webContent.SearchBtnBgColor = colors.color;
        break;
      case "SB_T":
        webContent.SearchBtnTextColor = colors.color;
        break;
      case "W_B":
        webContent.WalletStripBgColor = colors.color;
        break;
      case "W_T":
        webContent.WalletStripTextColor = colors.color;
        break;

      default:
        break;
    }

    this.setState({ CampaignTheme: campaign, WebContent: webContent })

  }

  onDrop = async (picture) => {

    $('.uploadPicturesWrapper').find('div uploadPictureContainer').first().remove();
    this.setState({ FileTypeErrorMessage: "", image: null });
    let pics = this.state.pictures.concat(picture);

    let photoName = "";
    let imageDataUrl = "";
    if (picture.length > 0) {
      photoName = pics[picture.length - 1].name;
      imageDataUrl = await readFile(pics[picture.length - 1]);
      let img = document.getElementById("tempImg");
      this.setState({ image: imageDataUrl, PhotoName: photoName, ImageExtension: "" });

      setTimeout(
        function () {

          this.ValidateImageSize(img.width, img.height, pics[0].type);
        }
          .bind(this),
        100
      );


    } else {
      this.setImageExtension(this.state.groupName);
    }


  }


  ValidateImageSize(width, height, imageType) {

    let groupName = this.state.groupName;
    let validate = false;
    let validationMessage = "";
    switch (groupName) {

      case PhotoGroupName[0]:
        let LogoWidthHeight = GlobalData.restaurants_data.Supermeal_dev.Campaign_Logo_Image_Width_Height;
        validate = width === Number(LogoWidthHeight[0]) && height === Number(LogoWidthHeight[1]) && imageType === "image/png";
        validationMessage = "Logo should be a " + Number(LogoWidthHeight[0]) + " x " + Number(LogoWidthHeight[1]) + "px PNG file. "
        break;

      case PhotoGroupName[1]:
        let MainBannerWidthHeight = GlobalData.restaurants_data.Supermeal_dev.Campaign_Main_Banner_Width_Height;
        validate = width === Number(MainBannerWidthHeight[0]) && height === Number(MainBannerWidthHeight[1]) && imageType === "image/png";
        validationMessage = "Main Banner should be a " + Number(MainBannerWidthHeight[0]) + " x " + Number(MainBannerWidthHeight[1]) + "px PNG file. "
        break;

      case PhotoGroupName[2]:
        let SubBannerWidthHeight = GlobalData.restaurants_data.Supermeal_dev.Campaign_Sub_Banner_Width_Height;
        validate = width === Number(SubBannerWidthHeight[0]) && height === Number(SubBannerWidthHeight[1]) && imageType === "image/jpeg";
        validationMessage = "Desktop sub banner should be a " + Number(SubBannerWidthHeight[0]) + " x " + Number(SubBannerWidthHeight[1]) + "px JPG file. "
        break;

      case PhotoGroupName[3]:
        let FoodImageWidthHeight = GlobalData.restaurants_data.Supermeal_dev.Campaign_Food_Image_Width_Height;
        validate = width === Number(FoodImageWidthHeight[0]) && height === Number(FoodImageWidthHeight[1]) && imageType === "image/png";
        validationMessage = "Food image should be a " + Number(FoodImageWidthHeight[0]) + " x " + Number(FoodImageWidthHeight[1]) + "px PNG file. "
        break;

      case PhotoGroupName[4]:
        let BackgroundWidthHeight = GlobalData.restaurants_data.Supermeal_dev.Campaign_Background_Image_Width_Height;
        validate = width === Number(BackgroundWidthHeight[0]) && height === Number(BackgroundWidthHeight[1]) && imageType === "image/jpeg";
        validationMessage = "Desktop background image should be a " + Number(BackgroundWidthHeight[0]) + " x " + Number(BackgroundWidthHeight[1]) + "px JPG file. "
        break;

      case PhotoGroupName[5]:
        let AppBackgroundWidthHeight = GlobalData.restaurants_data.Supermeal_dev.Campaign_App_Background_Image_Width_Height;
        validate = width === Number(AppBackgroundWidthHeight[0]) && height === Number(AppBackgroundWidthHeight[1]) && imageType === "image/jpeg";
        validationMessage = "App background image  should be a " + Number(AppBackgroundWidthHeight[0]) + " x " + Number(AppBackgroundWidthHeight[1]) + "px JPG file. "
        break;

      case PhotoGroupName[6]:
        let AppSubBannerWidthHeight = GlobalData.restaurants_data.Supermeal_dev.Campaign_App_Sub_Banner_Width_Height;
        validate = width === Number(AppSubBannerWidthHeight[0]) && height === Number(AppSubBannerWidthHeight[1]) && imageType === "image/jpeg";
        validationMessage = "App sub banner  should be a " + Number(AppSubBannerWidthHeight[0]) + " x " + Number(AppSubBannerWidthHeight[1]) + "px JPG file. "
        break;

      default:
        break;


    }

    if (!validate)
      this.setState({ FileTypeErrorMessage: validationMessage, image: null });

  }

  handleSubmit(e) {
    e.preventDefault();
    let main = this.state.startDate
    console.log(main.format('L'));
  }
  //#endregion

  loading = () => <div className="page-laoder-users">
    <div className="loader-menu-inner">
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
      <div className="loading-label">Loading.....</div>
    </div>
  </div>

  //#region api calling

  GetCampaign = async (id) => {

    var data = await CampaignService.Get(id);

    let campaignContentJson = [];
    let webContent = CampaignService.WebBanners;
    let appContent = CampaignService.AppBanners;
    let startDate = new Date();
    let endDate = "";

    if (Object.keys(data).length > 0) {
      startDate = new Date(Utilities.FormatDate(data.StartDate));
      endDate = new Date(Utilities.FormatDate(data.EndDate));

      if (data.ContentJson.trim() !== "") {

        campaignContentJson = JSON.parse(data.ContentJson);
        webContent = campaignContentJson[0];
        appContent = campaignContentJson[1];
      }

      this.setState({ startDate: startDate, endDate: endDate });
    }
    this.setState({
      CampaignTheme: data,
      WebContent: webContent,
      AppContent: appContent,
      ShowLoader: false,
      OldLogoPhotoName: "",
      OldBackgroundPhotoName: "",
      OldAppBackgroundPhotoName: "",
      OldFoodPhotoName: "",
      OldMainBannerPhotoName: "",
      OldSubBannerPhotoName: "",
      OldAppSubBannerPhotoName: "",
    });

  }


  SaveCampaignApi = async (campaign) => {

    let message = await CampaignService.Update(campaign);

    if (message === '1') {
      Utilities.notify("Updated successfully.", "s");
      this.GetCampaign(campaign.Id);
    }

    else {
      Utilities.notify("Update failed.", "e");
    }

  }


  SaveCampaign(e, values) {

    let campaign = CampaignService.Campaign;

    let campaignWebContent = this.state.WebContent;
    let campaignAppContent = this.state.AppContent;

    campaign.ContentBanner = [];

    campaign.Id = this.state.CampaignId
    campaign.Name = values.txtName;
    campaign.PreLaunchText = values.txtPreCampaignMsg;
    campaign.PostLaunchText = values.txtPostCampaignMsg;
    campaign.BackgroundColor = values.txtBackgroundColor;
    campaign.TextColor = values.txtTextColor;
    campaign.StartDate = this.state.startDate; //values.txtStartDate;
    campaign.EndDate = this.state.endDate; //values.txtEndDate;
    campaign.ShowTeaserBefore = values.ddlTeaser;
    campaign.ContentJson = "";

    campaignWebContent.ContentType = "WEB"
    campaignWebContent.MainBannerType = "IMAGE"
    campaignWebContent.SearchInputBgColor = values.txtBgSearchInput;
    campaignWebContent.SearchInputTextColor = values.txtTextSearchInput;
    campaignWebContent.SearchBtnBgColor = values.txtBgSearchBtn;
    campaignWebContent.SearchBtnTextColor = values.txtTextSearchBtn;
    campaignWebContent.WalletStripBgColor = values.txtBgWalletStripe;
    campaignWebContent.WalletStripTextColor = values.txtTextWalletStripe;

    campaignAppContent.ContentType = "APP"
    campaignAppContent.MainBannerType = "IMAGE"
    campaignAppContent.SearchInputBgColor = values.txtBgSearchInput;
    campaignAppContent.SearchInputTextColor = values.txtTextSearchInput;
    campaignAppContent.SearchBtnBgColor = values.txtBgSearchBtn;
    campaignAppContent.SearchBtnTextColor = values.txtTextSearchBtn;
    campaignAppContent.WalletStripBgColor = values.txtBgWalletStripe;
    campaignAppContent.WalletStripTextColor = values.txtTextWalletStripe;

    campaign.ContentBanner.push(campaignWebContent);
    campaign.ContentBanner.push(campaignAppContent);

    this.SaveCampaignApi(campaign);
  }

  // SavePhotoApi = async (oldPhotoName, bitStream, photoName, groupName) => {

  //   let campaign = CampaignService.Campaign;

  //   let webContent = this.state.WebContent;
  //   let appContent = this.state.AppContent;

  //   campaign.Id = this.state.CampaignId
  //   campaign.OldPhotoName = oldPhotoName;
  //   campaign.PhotoNameBitStream = bitStream;
  //   campaign.PhotoGroupName = groupName;
  //   campaign.PhotoName = photoName;

  //   let result = await CampaignService.SavePhoto(campaign);

  //   let photoPath = "";
  //   let newPhotoName = "";

  //   if (!result.HasError) {

  //     newPhotoName = result.Dictionary.PhotoName;
  //     photoPath = result.Dictionary.AbsolutePhotoPath;

  //     switch (groupName) {

  //       case PhotoGroupName[0]:
  //         webContent.Logo = photoPath;
  //         appContent.Logo = photoPath;
  //         this.setState({ OldLogoPhotoName: newPhotoName });

  //         break;

  //       case PhotoGroupName[1]:
  //         webContent.MainBannersCsv = photoPath;
  //         appContent.MainBannersCsv = photoPath;
  //         this.setState({ OldMainBannerPhotoName: newPhotoName });

  //         break;

  //       case PhotoGroupName[2]:
  //         webContent.SubBanner = photoPath;
  //         this.setState({ OldSubBannerPhotoName: newPhotoName });

  //         break;

  //       case PhotoGroupName[3]:
  //         webContent.FoodImagesCsv = photoPath;
  //         appContent.FoodImagesCsv = photoPath;
  //         this.setState({ OldFoodPhotoName: newPhotoName });

  //         break;

  //       case PhotoGroupName[4]:
  //         webContent.BackgroundCsv = photoPath;
  //         this.setState({ OldBackgroundPhotoName: newPhotoName });

  //         break;

  //       case PhotoGroupName[5]:
  //         appContent.BackgroundCsv = photoPath;
  //         this.setState({ OldAppBackgroundPhotoName: newPhotoName });

  //         break;

  //       case PhotoGroupName[6]:
  //         appContent.SubBanner = photoPath;
  //         this.setState({ OldAppSubBannerPhotoName: newPhotoName })



  //       default:
  //         break;

  //     }
  //     this.setState({ AppContent: appContent, WebContent: webContent, showModal: !this.state.showModal });
  //   }
  // }


  //#endregion

  //#region Image Methods

  GenerateImageModal() {
    return (
      <Modal isOpen={this.state.showModal} toggle={this.toggleModal} size="lg" className={this.props.className}>
        <ModalHeader toggle={this.toggleModal}>Preview </ModalHeader>
        <ModalBody>
          <div className="popup-web-body-wrap-new skin-blue" >
            <div className="section-heading"><span className="dashed"></span>  <span className="headding-span">HEADER</span> <span className="dashed"></span></div>
            <header className="topbar" style={{ backgroundColor: ThemeSetting.header.HeaderBgColor }}>
              <nav className="navbar top-navbar navbar-expand-md navbar-dark ">

                <div>
                  <a className="navbar-brand">
                    <i className="fa fa-angle-left" aria-hidden="true"></i></a>
                </div>

                <ul className="navbar-nav my-lg-0" style={{ marginLeft: 'auto' }}>

                  <li className="nav-item ">
                    <a className="nav-link"
                      onMouseEnter={() => this.toggleHover(0)} onMouseLeave={() => this.toggleHover(0)}
                      style={{
                        backgroundColor: (!this.state.headerHover[0]) ?
                          ThemeSetting.header.HeaderNavBgColor
                          :
                          ThemeSetting.header.HeaderNavBgColorHover,
                        color: (!this.state.headerHover[0]) ?
                          ThemeSetting.header.HeaderNavColor :
                          ThemeSetting.header.HeaderNavColorActiveAndHover
                      }} href="" aria-expanded="false" aria-haspopup="true">
                      Home
                    </a>

                  </li>
                  <li className="nav-item ">
                    <a className="nav-link" onMouseEnter={() => this.toggleHover(1)} onMouseLeave={() => this.toggleHover(1)}
                      style={{
                        backgroundColor: (!this.state.headerHover[1]) ?
                          ThemeSetting.header.HeaderNavBgColor
                          :
                          ThemeSetting.header.HeaderNavBgColorHover,
                        color: (!this.state.headerHover[1]) ?
                          ThemeSetting.header.HeaderNavColor :
                          ThemeSetting.header.HeaderNavColorActiveAndHover
                      }} href="" aria-expanded="false" aria-haspopup="true">
                      Reviews
                    </a>

                  </li>
                  <li className="nav-item ">
                    <a className="nav-link" href="" onMouseEnter={() => this.toggleHover(2)} onMouseLeave={() => this.toggleHover(2)}
                      style={{
                        backgroundColor: (!this.state.headerHover[2]) ?
                          ThemeSetting.header.HeaderNavBgColor
                          :
                          ThemeSetting.header.HeaderNavBgColorHover,
                        color: (!this.state.headerHover[2]) ?
                          ThemeSetting.header.HeaderNavColor :
                          ThemeSetting.header.HeaderNavColorActiveAndHover
                      }} aria-expanded="false" aria-haspopup="true">
                      Info
                    </a>

                  </li>
                  <li className="nav-item ">
                    <a className="nav-link" href="" onMouseEnter={() => this.toggleHover(3)} onMouseLeave={() => this.toggleHover(3)}
                      style={{
                        backgroundColor: (!this.state.headerHover[3]) ?
                          ThemeSetting.header.HeaderNavBgColor
                          :
                          ThemeSetting.header.HeaderNavBgColorHover,
                        color: (!this.state.headerHover[3]) ?
                          ThemeSetting.header.HeaderNavColor :
                          ThemeSetting.header.HeaderNavColorActiveAndHover
                      }} aria-expanded="false" aria-haspopup="true">
                      Login/Register
                    </a>

                  </li>
                  <li className="nav-item ">
                    <div className=" notification-header">
                      <a className="nav-link " href="#">
                        <i className="fa fa-bell" style={{ color: ThemeSetting.header.HeaderIconColor }}></i>
                        <span className="notification-bubble" style={{ backgroundColor: ThemeSetting.header.HeaderBasketBubbleBgColor, color: ThemeSetting.header.HeaderBasketBubbleColor }} ></span></a>
                    </div>
                  </li>
                  <li className="nav-item ">
                    <a id="cart_block_top" className="blockcart cart-preview inactive">
                      <span className="click-cart">

                        <span className="shopping-cart">
                          <span className="fa fa-shopping-basket" style={{ color: ThemeSetting.header.HeaderIconColor }}></span>
                          <span className="cart-products-count" style={{ backgroundColor: ThemeSetting.header.HeaderBasketBubbleBgColor, color: ThemeSetting.header.HeaderBasketBubbleColor }} >1</span>
                        </span>
                        <span id="spBasketTotal" >£255</span>
                      </span>



                    </a>


                  </li>

                </ul>
              </nav>
            </header>

            <div className="section-heading"><span className="dashed"></span>  <span className="headding-span">Body</span> <span className="dashed"></span></div>
            <div className="body-theme">

              <div className="body-inner-wrap">

                <div className="body-detail">
                  <h2 style={{ color: ThemeSetting.body.BodyHeadingColor }}>
                    Headings, h1, h2, h3, h4, h5, h6
                  </h2>
                  <p style={{ color: ThemeSetting.body.BodyPColor }}>
                    Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book.
                  </p>
                  <p>
                    <a href="#"
                      onMouseEnter={() => this.bodylinksHover(0)} onMouseLeave={() => this.bodylinksHover(0)}
                      style={{

                        color: (!this.state.bodylinksHover[0]) ?
                          ThemeSetting.body.BodyAColor :
                          ThemeSetting.body.BodyAColorHover
                      }}
                    >
                      {'Read more >>'}
                    </a>
                  </p>

                  {/* <h2>body buttons here</h2> */}

                </div>
                <div className="body-detail-right">
                  <button className="btn btn-secondary"
                    onMouseEnter={() => this.bodylinksHover(1)} onMouseLeave={() => this.bodylinksHover(1)}
                    style={{
                      backgroundColor: (!this.state.bodylinksHover[1]) ?
                        ThemeSetting.body.BodyDefaultBtnBgColor :
                        ThemeSetting.body.BodyDefaultBtnBgColorHover,
                      color: (!this.state.bodylinksHover[1]) ?
                        ThemeSetting.body.BodyDefaultBtnColor :
                        ThemeSetting.body.BodyDefaultBtnColorHover
                    }} > Default button</button>

                  <button className="btn btn-primary"
                    onMouseEnter={() => this.bodylinksHover(2)} onMouseLeave={() => this.bodylinksHover(2)}
                    style={{
                      backgroundColor: (!this.state.bodylinksHover[2]) ?
                        ThemeSetting.body.BodyPrimaryBtnBgColor :
                        ThemeSetting.body.BodyPrimaryBtnBgColorHover,
                      color: (!this.state.bodylinksHover[2]) ?
                        ThemeSetting.body.BodyPrimaryBtnColor :
                        ThemeSetting.body.BodyPrimaryBtnColorHover
                    }}>Primary button</button>


                  <button className="btn btn-success"
                    onMouseEnter={() => this.bodylinksHover(3)} onMouseLeave={() => this.bodylinksHover(3)}
                    style={{
                      backgroundColor: (!this.state.bodylinksHover[3]) ?
                        ThemeSetting.body.BodySuccussBtnBgColor :
                        ThemeSetting.body.BodySuccussBtnBgColorHover,
                      color: (!this.state.bodylinksHover[3]) ?
                        ThemeSetting.body.BodySuccussBtnColor :
                        ThemeSetting.body.BodySuccussBtnColorHover
                    }}>Secondary button</button>
                  <a href="#0" className="cd-top " onMouseEnter={() => this.bodylinksHover(4)} onMouseLeave={() => this.bodylinksHover(4)} style={{
                    backgroundColor: (!this.state.bodylinksHover[4]) ?
                      ThemeSetting.body.BackTopBtnBgColor :
                      ThemeSetting.body.BackTopBtnBgColorHover,
                    color: (!this.state.bodylinksHover[4]) ?
                      ThemeSetting.body.BackTopBtnBgColorIcon :
                      ThemeSetting.body.BackTopBtnBgColorIconHover
                  }}><i className="fa fa-arrow-up" aria-hidden="true" ></i></a>
                </div>
              </div>
            </div>
            <div className="section-heading"><span className="dashed"></span>  <span className="headding-span">Footer</span> <span className="dashed"></span></div>
            <footer className="footer-area" style={{ backgroundColor: ThemeSetting.footer.FooterBgColor }}>
              <div className="footer-top">
                <div className="container">
                  <div className="row">

                    <div className="col-md-6 col-lg-4">
                      <h4 className="footer-herading" style={{ color: ThemeSetting.footer.FooterHeadingColor }}>About Company</h4>
                      <div className="about-footer">
                        <p style={{ color: ThemeSetting.footer.FooterPColor }}>
                          Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.
                          <address>

                            (+800) 345 678

                          </address>
                        </p>

                        <div className="social-info">
                          <ul>
                            <li>
                              <a href="#"><i className="fa fa-facebook"
                                onMouseEnter={() => this.footerSocialIconHover(0)} onMouseLeave={() => this.footerSocialIconHover(0)}
                                style={{
                                  color: (!this.state.footerSocialIcon[0]) ?
                                    ThemeSetting.footer.FooterIconColor :
                                    ThemeSetting.footer.FooterIconColorHover
                                }} ></i></a>
                            </li>
                            <li>
                              <a href="#"><i className="fa fa-twitter"
                                onMouseEnter={() => this.footerSocialIconHover(1)} onMouseLeave={() => this.footerSocialIconHover(1)}
                                style={{
                                  color: (!this.state.footerSocialIcon[1]) ?
                                    ThemeSetting.footer.FooterIconColor :
                                    ThemeSetting.footer.FooterIconColorHover
                                }}
                              ></i></a>
                            </li>
                            <li>
                              <a href="#"><i className="fa fa-youtube" onMouseEnter={() => this.footerSocialIconHover(2)} onMouseLeave={() => this.footerSocialIconHover(2)}
                                style={{
                                  color: (!this.state.footerSocialIcon[2]) ?
                                    ThemeSetting.footer.FooterIconColor :
                                    ThemeSetting.footer.FooterIconColorHover
                                }}></i></a>
                            </li>
                            <li>
                              <a href="#"><i className="fa fa-google" onMouseEnter={() => this.footerSocialIconHover(3)} onMouseLeave={() => this.footerSocialIconHover(3)}
                                style={{
                                  color: (!this.state.footerSocialIcon[3]) ?
                                    ThemeSetting.footer.FooterIconColor :
                                    ThemeSetting.footer.FooterIconColorHover
                                }}></i></a>
                            </li>
                            <li>
                              <a href="#"><i className="fa fa-instagram" onMouseEnter={() => this.footerSocialIconHover(4)} onMouseLeave={() => this.footerSocialIconHover(4)}
                                style={{
                                  color: (!this.state.footerSocialIcon[4]) ?
                                    ThemeSetting.footer.FooterIconColor :
                                    ThemeSetting.footer.FooterIconColorHover
                                }}></i></a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 col-lg-2 mt-res-sx-30px mt-res-md-30px">
                      <div className="single-wedge">
                        <h4 className="footer-herading" style={{ color: ThemeSetting.footer.FooterHeadingColor }}>Site Map</h4>
                        <div className="footer-links">
                          <ul>
                            <li><a href="#" onMouseEnter={() => this.footerLinksHover(0)} onMouseLeave={() => this.footerLinksHover(0)}
                              style={{
                                color: (!this.state.footerLinksHover[0]) ?
                                  ThemeSetting.footer.FooterLinkColor :
                                  ThemeSetting.footer.FooterLinkColorHover
                              }}>Link 1</a></li>
                            <li><a href="#" onMouseEnter={() => this.footerLinksHover(1)} onMouseLeave={() => this.footerLinksHover(1)}
                              style={{
                                color: (!this.state.footerLinksHover[1]) ?
                                  ThemeSetting.footer.FooterLinkColor :
                                  ThemeSetting.footer.FooterLinkColorHover
                              }}>Link 2</a></li>
                            <li><a href="#" onMouseEnter={() => this.footerLinksHover(2)} onMouseLeave={() => this.footerLinksHover(2)}
                              style={{
                                color: (!this.state.footerLinksHover[2]) ?
                                  ThemeSetting.footer.FooterLinkColor :
                                  ThemeSetting.footer.FooterLinkColorHover
                              }}>Link 3</a></li>



                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 col-lg-6 mt-res-md-50px mt-res-sx-30px mt-res-md-30px">
                      <div className="single-wedge">
                        <h4 className="footer-herading" style={{ color: ThemeSetting.footer.FooterHeadingColor }}>Subscribe</h4>
                        <div className="subscrib-text">
                          <p style={{ color: ThemeSetting.footer.FooterPColor }}>
                            Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.
                          </p>
                        </div>
                        <div id="mc_embed_signup" className="subscribe-form">
                          <form id="mc-embedded-subscribe-form" className="validate">
                            <div id="mc_embed_signup_scroll" className="mc-form">
                              <input className="email" type="email" required="" placeholder="Enter your email here.." name="EMAIL" />
                              <div className="mc-news" aria-hidden="true" style={{ position: 'absolute', left: '-5000px' }}>
                                <input type="text" value="" tabindex="-1" name="b_6bbb9b6f5827bd842d9640c82_05d85f18ef" />
                              </div>
                              <div className="clear">
                                <input id="mc-embedded-subscribe"
                                  onMouseEnter={() => this.footerbtnHover()} onMouseLeave={() => this.footerbtnHover()}
                                  style={{
                                    color: (!this.state.footerbtnHover) ?
                                      ThemeSetting.footer.FooterBtnColor :
                                      ThemeSetting.footer.FooterBtnColorHover,
                                    backgroundColor: (!this.state.footerbtnHover) ?
                                      ThemeSetting.footer.FooterBtnBgColor :
                                      ThemeSetting.footer.FooterBtnBgColorHover,
                                  }}
                                  className="button" type="submit" name="subscribe" value="Sign Up" />
                              </div>
                            </div>
                          </form>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              </div>

              <div className="footer-bottom">
                <div className="container">
                  <div className="row">
                    <div className="col-md-6 col-lg-4">
                      <p className="copy-text" style={{ color: ThemeSetting.footer.FooterPColor }}>Copyright ©  All Rights Reserved</p>
                    </div>

                  </div>
                </div>
              </div>

            </footer>
          </div>

        </ModalBody>
        <ModalFooter>

          <Button color="secondary" onClick={(e) => this.toggleModal()}>Close</Button>
          {/* <Button color="success" style={{ marginRight: 10 }} onClick={(e) => this.SaveImage()}>Save</Button> */}
        </ModalFooter>
      </Modal>
    )
  }


  // RemoveContentImageHandler(groupName) {

  //   let webContent = this.state.WebContent;
  //   let appContent = this.state.AppContent;

  //   switch (groupName) {

  //     case PhotoGroupName[0]:
  //       webContent.Logo = "";
  //       appContent.Logo = "";
  //       break;

  //     case PhotoGroupName[1]:
  //       webContent.MainBannersCsv = "";
  //       appContent.MainBannersCsv = "";
  //       break;

  //     case PhotoGroupName[2]:
  //       webContent.SubBanner = "";
  //       appContent.SubBanner = "";
  //       break;

  //     case PhotoGroupName[3]:
  //       webContent.FoodImagesCsv = "";
  //       appContent.FoodImagesCsv = "";
  //       break;

  //     case PhotoGroupName[4]:
  //       webContent.BackgroundCsv = "";
  //       break;

  //     case PhotoGroupName[5]:
  //       appContent.BackgroundCsv = "";
  //       break;


  //     case PhotoGroupName[6]:
  //       appContent.SubBanner = "";
  //       break;



  //     default:
  //       break;

  //   }


  // }


  // SaveImage = async (group) => {

  //   let oldPhotoName = ""

  //   switch (group) {

  //     case PhotoGroupName[0]:
  //       oldPhotoName = this.state.OldLogoPhotoName;

  //       break;

  //     case PhotoGroupName[1]:
  //       oldPhotoName = this.state.OldMainBannerPhotoName;

  //       break;

  //     case PhotoGroupName[2]:
  //       oldPhotoName = this.state.OldSubBannerPhotoName

  //       break;

  //     case PhotoGroupName[3]:
  //       oldPhotoName = this.state.OldFoodPhotoName;

  //       break;

  //     case PhotoGroupName[4]:
  //       oldPhotoName = this.state.OldBackgroundPhotoName;

  //       break;

  //     case PhotoGroupName[5]:
  //       oldPhotoName = this.state.OldAppBackgroundPhotoName;

  //       break;


  //     case PhotoGroupName[6]:
  //       oldPhotoName = this.state.OldAppSubBannerPhotoName;
  //     default:
  //       break;

  //   }


  //   this.SavePhotoApi(oldPhotoName, this.state.image, this.state.PhotoName, group)

  // }


  // toggleModal(group) {

  //   this.setState({ showModal: !this.state.showModal, groupName: group, FileTypeErrorMessage: "", image: null });

  //   this.setImageExtension(group);
  // }


  // setImageExtension(group) {

  //   switch (group) {

  //     case PhotoGroupName[0]:
  //       this.setState({ modalHeader: "Upload Logo", ImageExtension: ['.png'] });
  //       break;

  //     case PhotoGroupName[1]:
  //       this.setState({ modalHeader: "Upload Main Banner Image", ImageExtension: ['.png'] });
  //       break;

  //     case PhotoGroupName[2]:
  //       this.setState({ modalHeader: "Upload Sub Banner Image", ImageExtension: ['.jpg'] });
  //       break;

  //     case PhotoGroupName[3]:
  //       this.setState({ modalHeader: "Upload Food Image", ImageExtension: ['.png'] });
  //       break;

  //     case PhotoGroupName[4]:
  //       this.setState({ modalHeader: "Upload Background Image", ImageExtension: ['.jpg'] });
  //       break;

  //     case PhotoGroupName[5]: case PhotoGroupName[5]:
  //       this.setState({ modalHeader: "Upload App Background Image", ImageExtension: ['.jpg'] });
  //       break;

  //     case PhotoGroupName[6]:
  //       this.setState({ modalHeader: "Upload App Sub Banner Image", ImageExtension: ['.jpg'] });
  //       break;


  //     default:
  //       break;

  //   }

  // }


  //#endregion





  // hadleTeaserChange(e) {

  //   let value = e.target.value;
  //   this.setState({ SelectedTeaser: value })

  // }

  onChangeCustomCss = (value) => {

    this.setState({ customCss: value })

  }
  componentDidMount() {
    this.setState({ widthmobile: window.innerWidth < 800, height: window.innerHeight }, () => {
      //  console.log("width mobile", this.state.width);
    });

    var id = this.props.match.params.id;

    if (id !== undefined) {
      this.setState({ CampaignId: id });
      this.GetCampaign(id);
    } else {
      this.setState({ ShowLoader: false });
    }


    window.addEventListener('scroll', () => {
      const istop = window.scrollY < 95;

      if (istop !== true && !this.state.scrolled) {
        this.setState({ scrolled: true })
      }
      else if (istop == true && this.state.scrolled) {
        this.setState({ scrolled: false })
      }

    });
    document.body.classList.add('theme-p-s-body');
  }
  CustomCssNModal() {
    this.setState({
      CustomCssN: !this.state.CustomCssN,
      customCss: this.state.savedCustomCss
    })
  }

  handleDoneCustomCssModal = () => {

    let text = this.refs.aceEditor.editor.getValue();
    if (!Utilities.stringIsEmpty(text)) {
    
    text = text.replace(/(\r\n|\n|\r)/gm, GlobalData.restaurants_data.Supermeal_dev.csvSeperator)
    this.setState({
      CustomCssN: false,
      customCss: text,
      savedCustomCss: text
    })
  }
  }
  componentWillUnmount() {
    document.body.classList.remove('theme-p-s-body');
  }
  shouldComponentUpdate() {
    return true;
  }
  saveTheme = async () => {
    try {

      this.setState({ IsSave: true });

      this.showText(false);

      //  if(this.state.tabindex == 3) { this.showText(this.state.tabindex == 3)};

      let theme = {};

      theme.Header = ThemeSetting.header;
      theme.Body = ThemeSetting.body;
      theme.Footer = ThemeSetting.footer;
      let EnterpriseId = localStorage.getItem(Constants.Session.ENTERPRISE_ID)
      let response = await EnterpriseSettingService.UpdateTheme(theme, EnterpriseId, this.state.themeView)
      if (response.IsUpdated) {
        Utilities.notify("Theme setting updated successfully", "s");
        this.GetThemeSetting()
        return
      }
      Utilities.notify("Theme setting update failed.", "e");
      this.setState({ IsSave: false })
    }
    catch (e) {
      Utilities.notify("Theme setting update failed.", "e");
      this.setState({
        IsSave: false
      })
      console.log("saveTheme Exception", e)
    }
  }

  handleThemeAndStyle = (value, control) => {

    let campaign = this.state.bodyTheme;
   
    switch (control.toUpperCase()) {

      case "B_S":
        campaign.ButtonRadius = value;
        break;

      case "IN_S":
        campaign.InputRadius = value;
        break;
      case "IM_S":
        campaign.ImageRadius = value;
        break;
      case "T_V":
        this.setState({ themeView: value })
        break;

      default:
        break;
    }
    this.setState({ bodyTheme: campaign })
    // console.log('bodyTheme', this.state.bodyTheme)
    try {
      ThemeSetting.setbody(campaign)
    }
    catch (e) {
      console.log("saveTheme Exception", e)
    }

  }

  saveThemeButton = () => {
    return (
      <div className="col-xs-12 setting-cus-field m-b-20 d-flex">

        <FormGroup>
          <Button color="secondary" className="btn waves-effect waves-light btn-secondary pull-left  m-l-10" style={{ marginRight: 10 }}>Cancel</Button>
          {/* <Button onClick={() => this.saveTheme()} color="success" className="btn waves-effect waves-light btn-success pull-left">Save</Button> */}

          <Button disabled={this.state.IsSave} onClick={() => {
            this.setState({
              IsSave: true
            }, () => {
              this.saveTheme()
            })
          }} color="primary" className="btn waves-effect waves-light btn-primary pull-left">
            {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
              : <span className="comment-text">Save</span>}
          </Button>
        </FormGroup>

        <div className="action-wrapper">
        </div>
      </div>
    )
  }


  reRenderComp = () =>{
    this.setState({  })
  }

  render() {

    const { isActive } = this.state;
    const activeClass = isActive ? 'active' : '';

    const { bodyTheme, headerTheme  } = this.state;
    // console.log('bodyTheme', bodyTheme)
    // console.log('headerTheme', this.state.headerTheme)
    if (this.state.ShowLoader === true) {
      return this.loading()
    }

    return (
      <div>
        <div className='theme-res-heading-wrap'>
          <div className="theme-heading-wrap m-b-20 mx-0 card-new-title">

            <h3 className="card-title ">Theme and Appearance</h3>
            <div className="theme-btn">
              {/* <button className="btn  pull-left btn btn-preview m-l-10" onClick={(e) => this.toggleModal()} style={{ marginRight: 10 }}>Preview</button> */}
              {/* <button className="btn  btn-secondary pull-left   btn btn-secondary" >Reset</button> */}
              <Button disabled={this.state.IsSave || this.state.loadingTheme} onClick={() => {
                this.saveTheme()
              }} color="primary" className="btn waves-effect waves-light btn-primary pull-left">
                {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                  : <span className="comment-text">Save changes</span>}
              </Button>
            </div>
          </div>
        </div>
        <div className="card theme-page-n-wrap position-relative" id="CampaignDataWraper">
          {this.state.loadingTheme &&
            
          <div className='progress-loader-theme'>
          <div className="loader-menu-inner">
                            <Loader type="Oval" color="#fff" height={50} width={50} />
                            <div className="loading-label text-white">Loading...</div>
                        </div>
          </div>
          }
          <div className='theme-page-left-wrap'>

            <div className="card-body">
              <div className='accordion-m-wrap'>
                <Accordion allowZeroExpanded>
                  <AccordionItem>
                    <AccordionItemHeading onClick={() => this.scrollTop()}>
                      <AccordionItemButton>
                        <a>Theme and style</a>
                      </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      <div className='choose-theme-style'>
                        {/* <div>
            <h4 className='card-new-title font-20'>Choose your theme and style</h4>
            </div> */}

                        <div className='theme-d-select align-items-center card-new-title mx-0'>
                          <span className='font-14 color-7 mr-3'>Theme</span>
                          <select className="form-control custom-select" value={this.state.themeView} onChange={(e) => this.handleThemeAndStyle(e.target.value, 'T_V')}>
                            <option value="theme-classic">Classic</option>
                            <option value="theme-modern">Modern</option>
                          </select>
                        </div>

                        <div className='theme-d-select align-items-center card-new-title mx-0'>
                          <span className='font-14 color-7 mr-3'>Button style</span>
                          <select className="form-control custom-select" onChange={(e) => this.handleThemeAndStyle(e.target.value, 'B_S')} value={this.state.bodyTheme.ButtonRadius}>
                            <option value="0px">Plain</option>
                            <option value="5px">Rounded</option>
                            <option value="25px">Modern</option>
                          </select>
                        </div>

                        <div className='theme-d-select align-items-center card-new-title mx-0'>
                          <span className='font-14 color-7 mr-3'>Input style</span>
                          <select className="form-control custom-select" onChange={(e) => this.handleThemeAndStyle(e.target.value, 'IN_S')} value={this.state.bodyTheme.InputRadius}>
                            <option value="0px">Plain</option>
                            <option value="5px">Rounded</option>
                            <option value="25px">Modern</option>
                          </select>
                        </div>

                        <div className='theme-d-select align-items-center card-new-title mx-0'>
                          <span className='font-14 color-7 mr-3'>Image style</span>
                          <select className="form-control custom-select" onChange={(e) => this.handleThemeAndStyle(e.target.value, 'IM_S')} value={this.state.bodyTheme.ImageRadius}>
                            <option value="0px">Plain</option>
                            <option value="5px">Rounded</option>
                            <option value="35%">Modern</option>
                          </select>
                        </div>

                        {/* <div className="col-xs-12 setting-cus-field m-b-20 d-flex">

                          <FormGroup>
                            <Button color="secondary" className="btn waves-effect waves-light btn-secondary pull-left" style={{ marginRight: 10 }}>Cancel</Button>

                            <Button 
                            
                            color="primary" className="btn waves-effect waves-light btn-primary pull-left">
                              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                                : <span className="comment-text">Save</span>}
                            </Button>
                          </FormGroup>

                         
                        </div> */}

                        {/* <div className='theme-style-select card-new-title mb-0'>
              <div className='button-style mb-3'>
                <span className='font-16 d-flex mb-2'>Button style</span>
              <div className="custom-control custom-radio mb-1">
                <input type="radio" id="customRadio1" name="customRadio" className="custom-control-input" />
                <label className="custom-control-label" for="customRadio1">Plain</label>
              </div>
              <div className="custom-control custom-radio mb-1">
                <input type="radio" id="customRadio2" name="customRadio" className="custom-control-input" />
                <label className="custom-control-label" for="customRadio2">Rounded</label>
              </div>
              <div className="custom-control custom-radio mb-1">
                <input type="radio" id="customRadio3" name="customRadio" className="custom-control-input" />
                <label className="custom-control-label" for="customRadio3">Modern</label>
              </div>
              </div>

              <div className='input-style mb-3'>
                <span className='font-16 d-flex mb-2'>Input style</span>
              <div className="custom-control custom-radio mb-1">
                <input type="radio" id="customRadio4" name="customRadio" className="custom-control-input" />
                <label className="custom-control-label" for="customRadio4">Plain</label>
              </div>
              <div className="custom-control custom-radio mb-1">
                <input type="radio" id="customRadio5" name="customRadio" className="custom-control-input" />
                <label className="custom-control-label" for="customRadio5">Rounded</label>
              </div>
              <div className="custom-control custom-radio mb-1">
                <input type="radio" id="customRadio6" name="customRadio" className="custom-control-input" />
                <label className="custom-control-label" for="customRadio6">Modern</label>
              </div>
              </div>


              <div className='image-style mb-3'>
                <span className='font-16 d-flex mb-2'>Image style</span>
              <div className="custom-control custom-radio mb-1">
                <input type="radio" id="customRadio7" name="customRadio" className="custom-control-input" />
                <label className="custom-control-label" for="customRadio7">Plain</label>
              </div>
              <div className="custom-control custom-radio mb-1">
                <input type="radio" id="customRadio8" name="customRadio" className="custom-control-input" />
                <label className="custom-control-label" for="customRadio8">Rounded</label>
              </div>
              <div className="custom-control custom-radio mb-1">
                <input type="radio" id="customRadio9" name="customRadio" className="custom-control-input" />
                <label className="custom-control-label" for="customRadio9">Modern</label>
              </div>
              </div>
            </div> */}
                      </div>
                    </AccordionItemPanel>
                  </AccordionItem>

                  <AccordionItem>
                    <AccordionItemHeading onClick={() => this.scrollTop()}>
                      <AccordionItemButton>
                        <a>    Header Colors</a>
                      </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      <div className="common-theme-wrap">
                        <HeaderSetting headerTheme={this.state.headerTheme} reRenderComp={()=>this.reRenderComp()}/>
                        {/* {this.saveThemeButton()} */}
                      </div>
                    </AccordionItemPanel>
                  </AccordionItem>
                  <AccordionItem>
                    <AccordionItemHeading onClick={() => this.scrollTop()}>
                      <AccordionItemButton>
                        <a> Body Colors</a>

                      </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      <div className="common-theme-wrap">

                        <BodySetting bodyTheme={this.state.bodyTheme} reRenderComp={()=>this.reRenderComp()}/>
                        {/* {this.saveThemeButton()} */}
                      </div>
                    </AccordionItemPanel>
                  </AccordionItem>
                  <AccordionItem>
                    <AccordionItemHeading onClick={() => this.scrollTop()}>
                      <AccordionItemButton>
                        <a>Footer Colors</a>
                      </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      <div className="common-theme-wrap">

                        <FooterSetting footerTheme={this.state.footerTheme} />
                        {/* {this.saveThemeButton()} */}
                      </div>
                    </AccordionItemPanel>
                  </AccordionItem>
                  <AccordionItem className='mb-0 accordion-item-border'>
                    <AccordionItemHeading className='hide-acc-arr' onClick={() => this.CustomCssNModal()}>
                      <AccordionItemButton>
                        Custom CSS
                      </AccordionItemButton>
                    </AccordionItemHeading>
                    {/* <AccordionItemPanel>
                
                  </AccordionItemPanel> */}
                  </AccordionItem>

                </Accordion>
              </div>

              {/* <Tabs>
            <TabList className={this.state.scrolled ? 'affix' : ' affix-top'}>
              <Tab key={0} onClick={() => this.setState({tabindex: 0})}><span className="hidden-xs-down">Header</span></Tab>
              <Tab key={1} onClick={() => this.setState({tabindex: 1})}><span className="hidden-xs-down">Body</span></Tab>
              <Tab key={2} onClick={() => this.setState({tabindex: 2})}><span className="hidden-xs-down">Footer</span></Tab>
              <Tab key={3} onClick={() => this.setState({tabindex: 3})}><span className="hidden-xs-down">Custom CSS</span></Tab>
            </TabList>
           
             


            <TabPanel>
              <div className="common-theme-wrap">
                <HeaderSetting headerTheme={this.state.headerTheme} />
                {this.saveThemeButton()}
              </div>

            </TabPanel>
            <TabPanel>
              <div className="common-theme-wrap">

                <BodySetting bodyTheme={this.state.bodyTheme} />
                {this.saveThemeButton()}
              </div>
            </TabPanel>
            <TabPanel>
              <div className="common-theme-wrap">

                <FooterSetting footerTheme={this.state.footerTheme} />
                {this.saveThemeButton()}
              </div>
            </TabPanel>
            <TabPanel>
              <div className="common-theme-wrap">
                <AceEditor

                  style={{ width: '100%', height: 400, marginBottom: 15, fontSize: 16 }}
                  mode='css'
                  theme="github"
                  onChange={this.onChangeCustomCss}
                  ref="aceEditor"
                  name="UNIQUE-ID"
                  value={this.state.customCss}
                  editorProps={{
                    $blockScrolling: true
                  }}
                  className="AceEditortext"
                />
                <div className="col-xs-12 setting-cus-field m-b-20">

                  <FormGroup>
                    <Button disabled={this.state.IsEditorSave} onClick={() => {  
                        this.showText()
                    }} color="primary" className="btn waves-effect waves-light btn-primary pull-left">
                      {this.state.IsEditorSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                        : <span className="comment-text">Save</span>}
                    </Button>
                  </FormGroup>

                  <div className="action-wrapper">
                  </div>
                </div>
              </div>
            </TabPanel>
          </Tabs> */}



            </div>
            <div>

            </div>
            {this.GenerateImageModal()}
          </div>
          <div className={`theme-page-right-wrap ${activeClass}`}>
            <div className='d-flex align-items-center justify-content-between mb-2 header-sticky'>
              <div className='d-flex align-items-center'>
                <BiArrowBack className='mb-2 font-24 mr-3 basket-back-arrow cursor-pointer' onClick={() => this.showHideSidebarRight()}></BiArrowBack>
                <h4 class="">Preview</h4>
              </div>
              <div className='d-flex'>
                <div class="add-cat-btn mr-2 d-flex align-items-center" onClick={this.handleDesktopClick}> <i class="fa fa-desktop mr-2" aria-hidden="true"></i><span>Desktop</span></div>
                <div class="add-cat-btn d-flex align-items-center" onClick={this.handleMobileClick}> <i class="fa fa-mobile font-20 mr-2" aria-hidden="true"></i><span>Moible</span></div>
              </div>
            </div>
            <div className="popup-web-body-wrap-new skin-blue" >
              <div className="section-heading"><span className="dashed"></span>  <span className="headding-span">HEADER</span> <span className="dashed"></span></div>
              <header className="topbar" style={{ backgroundColor: headerTheme.HeaderBgColor }}>
                <nav className="navbar top-navbar navbar-expand-md navbar-dark ">

                  <div className='d-flex align-items-center'>
                    <a className="navbar-brand">
                      <i className="fa fa-angle-left" aria-hidden="true"></i>
                    </a>
                    <div className='header-img'>
                      <img style={{ borderRadius: bodyTheme?.ImageRadius || '0px'}} width="30px" src={Utilities.generatePhotoThumbURL(this.state.userObj.Enterprise.PhotoName)} />
                    </div>
                  </div>

                  <ul className="navbar-nav my-lg-0 align-items-center" style={{ marginLeft: 'auto' }}>

                    <li className="nav-item hide-800 mr-2">
                      <a className="nav-link"
                        onMouseEnter={() => this.toggleHover(0)} onMouseLeave={() => this.toggleHover(0)}
                        style={{
                          backgroundColor: (!this.state.headerHover[0]) ?
                            ThemeSetting.header.HeaderNavBgColor
                            :
                            ThemeSetting.header.HeaderNavBgColorHover,
                          color: (!this.state.headerHover[0]) ?
                            ThemeSetting.header.HeaderNavColor :
                            ThemeSetting.header.HeaderNavColorActiveAndHover
                        }} href="" aria-expanded="false" aria-haspopup="true">
                        Link 1
                      </a>

                    </li>
                    <li className="nav-item hide-800 mr-2">
                      <a className="nav-link" onMouseEnter={() => this.toggleHover(1)} onMouseLeave={() => this.toggleHover(1)}
                        style={{
                          backgroundColor: (!this.state.headerHover[1]) ?
                            ThemeSetting.header.HeaderNavBgColor
                            :
                            ThemeSetting.header.HeaderNavBgColorHover,
                          color: (!this.state.headerHover[1]) ?
                            ThemeSetting.header.HeaderNavColor :
                            ThemeSetting.header.HeaderNavColorActiveAndHover
                        }} href="" aria-expanded="false" aria-haspopup="true">
                        Link 2
                      </a>

                    </li>
                    {/* <li className="nav-item ">
                    <a className="nav-link" href="" onMouseEnter={() => this.toggleHover(2)} onMouseLeave={() => this.toggleHover(2)}
                      style={{
                        backgroundColor: (!this.state.headerHover[2]) ?
                          ThemeSetting.header.HeaderNavBgColor
                          :
                          ThemeSetting.header.HeaderNavBgColorHover,
                        color: (!this.state.headerHover[2]) ?
                          ThemeSetting.header.HeaderNavColor :
                          ThemeSetting.header.HeaderNavColorActiveAndHover
                      }} aria-expanded="false" aria-haspopup="true">
                      Link 3
</a>

                  </li> */}
                    {/* <li className="nav-item ">
                    <a className="nav-link" href="" onMouseEnter={() => this.toggleHover(3)} onMouseLeave={() => this.toggleHover(3)}
                      style={{
                        backgroundColor: (!this.state.headerHover[3]) ?
                          ThemeSetting.header.HeaderNavBgColor
                          :
                          ThemeSetting.header.HeaderNavBgColorHover,
                        color: (!this.state.headerHover[3]) ?
                          ThemeSetting.header.HeaderNavColor :
                          ThemeSetting.header.HeaderNavColorActiveAndHover
                      }} aria-expanded="false" aria-haspopup="true">
                      Login/Register
</a>

                  </li> */}

                    <button 
                      onMouseEnter={() => this.bodylinksHover(2)} onMouseLeave={() => this.bodylinksHover(2)}
                      style={{
                        borderRadius: bodyTheme?.ButtonRadius || '0px',
                        background: (!this.state.bodylinksHover[2]) ?
                          ThemeSetting.header.HeaderBtnBgColor:
                          ThemeSetting.header.HeaderBtnBgColorHover,
                        color: (!this.state.bodylinksHover[2]) ?
                        ThemeSetting.header.HeaderBtnColor :
                        ThemeSetting.header.HeaderBtnColorHover
                      }}
                      className="btn hide-800"
                      >Button</button>

                    <li className="nav-item ">
                      <div className=" notification-header">
                        <a className="nav-link " href="#"><i className="fa fa-bell" style={{ color: headerTheme.HeaderIconColor }}></i><span className="notification-bubble" style={{ backgroundColor: ThemeSetting.header.HeaderNotificationBubbleBgColor, color: ThemeSetting.header.HeaderNotificationBubbleColor }}>2</span></a>
                      </div>
                    </li>
                    <li className="nav-item ">
                      <a id="cart_block_top" className="blockcart cart-preview inactive">
                        <span className="click-cart">

                          <span className="shopping-cart">
                            <span className="fa fa-shopping-basket" style={{ color: headerTheme.HeaderIconColor }}></span>
                            <span className="cart-products-count" style={{ backgroundColor: headerTheme.HeaderBasketBubbleBgColor, color: headerTheme.HeaderBasketBubbleColor }} >1</span>
                          </span>
                          <span id="spBasketTotal" >£255</span>
                        </span>



                      </a>


                    </li>
                    <li  className="nav-item d-flex align-items center">
                      <i style={{color: headerTheme.HeaderIconColor}} className='fa fa-bars'></i>
                    </li>

                  </ul>
                </nav>
              </header>
              <div className="section-heading"><span className="dashed"></span>  <span className="headding-span">Body</span> <span className="dashed"></span></div>
              {this.state.showDesktopView && !this.state.widthmobile ? (
                <div>
                  {
                    this.state.themeView != "theme-classic" ?

                      <div className='skeleton-p-wrap modern'>
                        <div className='category-wrap'>
                          <div className='category-list'>
                            <a>
                              <span style={{ borderRadius: bodyTheme?.ButtonRadius || '0px', color: bodyTheme?.BodyPrimaryBtnColor || '#000', backgroundColor: bodyTheme?.BodyPrimaryBtnBgColor || '#000', borderColor: bodyTheme?.BodyPrimaryBtnBgColor || '#000'}} className='catgory-name active'>Category 1</span>
                            </a>
                            <a>
                              <span style={{color: bodyTheme?.BodyTextColor || '#000'}} className='catgory-name'>Category 2</span>
                            </a>
                            <a>
                              <span style={{color: bodyTheme?.BodyTextColor || '#000'}} className='catgory-name'>Category 3</span>
                            </a>
                            <a>
                              <span style={{color: bodyTheme?.BodyTextColor || '#000'}} className='catgory-name'>Category 4</span>
                            </a>
                            <a>
                              <span style={{color: bodyTheme?.BodyTextColor || '#000'}} className='catgory-name'>Category 5</span>
                            </a>
                          </div>

                          <div class="m-b-20 m-t-20 search-item-wrap position-relative">
                            <input style={{ borderRadius: bodyTheme?.InputRadius || '0px'}} type="text" class="form-control common-serch-field" placeholder="Search" value="" />
                            <i class="fa fa-search" aria-hidden="true"></i>
                          </div>
                        </div>

                        <section className='main-cat-basket'>
                          <div className=''>
                            <div class="category-heading">
                              <h2 style={{color: bodyTheme?.BodyHeadingColor || '#000'}}>Heading 1</h2>
                              <div style={{background: bodyTheme?.BodyPrimaryBtnBgColor || '#000'}} class="cat-separater"></div>
                              <p style={{color: bodyTheme?.BodyPColor || '#777'}}>Big on Flavour: Our signature tender burger packs a punch.</p>
                            </div>
                            <div className='category-items'>
                              <div>
                                <div className='item-row'>
                                  <div className='left-item-img'>
                                    <BsImage style={{ borderRadius: bodyTheme?.ImageRadius || '0px'}}/>
                                  </div>
                                </div>
                                <div className='item-img-btn-wrap'>
                                  <h3 style={{color: bodyTheme?.BodyHeadingColor || '#000'}} className='label-item-name font-12 bold'>Item Heading 1</h3>
                                  <p style={{color: bodyTheme?.BodyPColor || '#777'}} className='font-12'>Lorem ipsum, or lipsum as it is sometimes known.</p>
                                </div>
                                <div className='item-title-row'>
                                  <div className='d-flex flex-column'>
                                    <span style={{color: bodyTheme?.BodyTextColor || '#000'}} className='font-12 color-7'>Starting from</span>
                                    <span style={{color: bodyTheme?.BodyTextColor || '#000'}} className='bold font-12'>£10</span>
                                  </div>

                                  <div style={{color: bodyTheme?.BodyPrimaryBtnBgColor || '#000', borderColor: bodyTheme?.BodyPrimaryBtnBgColor || '#000'}} className='add-basket-btn'>
                                    <i class="fa fa-plus"></i>
                                  </div>
                                </div>

                              </div>

                              <div>
                                <div className='item-row'>
                                  <div className='left-item-img'>
                                    <BsImage style={{ borderRadius: bodyTheme?.ImageRadius || '0px'}} />
                                  </div>
                                </div>
                                <div className='item-img-btn-wrap'>
                                  <h3 style={{color: bodyTheme?.BodyHeadingColor || '#000'}} className='label-item-name font-12 bold'>Item Heading 2</h3>
                                  <p style={{color: bodyTheme?.BodyPColor || '#777'}} className='font-12'>Lorem ipsum, or lipsum as it is sometimes known.</p>
                                </div>
                                <div className='item-title-row'>
                                  <div className='d-flex flex-column'>
                                    <span style={{color: bodyTheme?.BodyTextColor || '#000'}} className='font-12 color-7'>Starting from</span>
                                    <span style={{color: bodyTheme?.BodyTextColor || '#000'}} className='bold font-12'>£20</span>
                                  </div>

                                  <div style={{color: bodyTheme?.BodyPrimaryBtnBgColor || '#000', borderColor: bodyTheme?.BodyPrimaryBtnBgColor || '#000'}} className='add-basket-btn'>
                                    <i class="fa fa-plus"></i>
                                  </div>
                                </div>

                              </div>

                              <div>
                                <div className='item-row'>
                                  <div className='left-item-img'>
                                    <BsImage style={{ borderRadius: bodyTheme?.ImageRadius || '0px'}} />
                                  </div>
                                </div>
                                <div className='item-img-btn-wrap'>
                                  <h3 style={{color: bodyTheme?.BodyHeadingColor || '#000'}} className='label-item-name font-12 bold'>Item Heading 3</h3>
                                  <p style={{color: bodyTheme?.BodyPColor || '#777'}} className='font-12'>Lorem ipsum, or lipsum as it is sometimes known.</p>
                                </div>
                                <div className='item-title-row'>
                                  <div className='d-flex flex-column'>
                                    <span style={{color: bodyTheme?.BodyTextColor || '#000'}} className='font-12 color-7'>Starting from</span>
                                    <span style={{color: bodyTheme?.BodyTextColor || '#000'}} className='bold font-12'>£30</span>
                                  </div>

                                  <div style={{color: bodyTheme?.BodyPrimaryBtnBgColor || '#000', borderColor: bodyTheme?.BodyPrimaryBtnBgColor || '#000'}} className='add-basket-btn'>
                                    <i class="fa fa-plus"></i>
                                  </div>
                                </div>

                              </div>
                            </div>
                          </div>

                          <div className='basket-wrap'>
                            <div className='main-basket-wrap'>
                              <div className="panel-heading">

                                <BiArrowBack className='mb-2 font-24 mr-3 basket-back-arrow' ></BiArrowBack>
                                <h3 className="d-flex align-items-center justify-content-between ">
                                  <div style={{color: bodyTheme?.BodyHeadingColor || '#000'}} className='font-12'> Your order</div>


                                </h3>
                                <div className="a-remove-all-item-wrapper">
                                  <span className="a-remove-all-item"><i className="fa fa-trash mr-2"></i> Remove all</span>
                                </div>

                              </div>
                              <div className='basket-item-top-wrap'>
                                <div className='basket-item-wrap'>
                                  <div className="basket-order-empty d-none" id="dvBasketEmpty">
                                    <span className="order-empty-basket">Your order basket is empty.</span>
                                    <span className="order-empty-like-menu">What would you like to order today?</span>
                                  </div>
                                  <div className='pos-item-loop-p-wrap'>
                                    <div className='pos-item-row'>
                                      <div className="b-item-price">
                                        <div style={{color: bodyTheme?.BodyHeadingColor || '#000'}}  className="b-item-name-label"><span className="quantity">1</span><span className='quantity-x'>x</span><span className="o-i-name">Double Trouble</span> </div>
                                        <div style={{color: bodyTheme?.BodyTextColor || '#000'}} className="b-item-price-label"><span className="pos-item-price">11.99</span></div>
                                      </div>
                                      <span className="b-item-quantity-plus-minus mb-3"><span style={{ borderRadius: bodyTheme?.ButtonRadius || '0px'}} className="q-plus-icon mr-3"><i className="fa fa-plus-circle" aria-hidden="true"></i>Add Qty</span>
                                      <span style={{ borderRadius: bodyTheme?.ButtonRadius || '0px'}} className="q-minus-icon mr-3"><i className="fa fa-minus-circle" aria-hidden="true"></i>Remove</span></span>
                                      {/* <div className="item-topping-wrap mb-3">
                          <div className="w-100 d-flex flex-column">
                            <span className="tp-label"><span className='toping-extras-label'>Toppings</span></span>
                            <div className='item-t-e'><span className="topping-extra-dtl">1 x 1st Cheese </span><span className="topping-extra-price">£0.59</span></div>
                            <div className='item-t-e'><span className="topping-extra-dtl">1 x 1st Chicken </span><span className="topping-extra-price">£0.59</span></div>
                            <div><span className="menu-item-extras-edit-common"><i className="fa fa-pencil-square-o" aria-hidden="true"></i>change</span></div>

                          </div>
                        </div> */}
                                      {/* <div className="item-topping-wrap mb-3">
                          <div className="w-100 d-flex flex-column">
                            <span className="tp-label"><span className='toping-extras-label'>Extras</span></span>
                            <div className='item-t-e'><span className="topping-extra-dtl">1 x 1st Cheese </span><span className="topping-extra-price">£0.59</span></div>
                            <div className='item-t-e'><span className="topping-extra-dtl">1 x 1st Chicken </span><span className="topping-extra-price">£0.59</span></div>
                            <div><span className="menu-item-extras-edit-common"><i className="fa fa-pencil-square-o" aria-hidden="true"></i>change</span></div>

                          </div>
                        </div> */}

                                    </div>
                                    <div className='pos-item-row'>
                                      <div className="b-item-price">
                                        <div style={{color: bodyTheme?.BodyHeadingColor || '#000'}} className="b-item-name-label"><span className="quantity">1</span><span className='quantity-x'>x</span><span className="o-i-name">Double Trouble</span> </div>
                                        <div style={{color: bodyTheme?.BodyTextColor || '#000'}} className="b-item-price-label"><span className="pos-item-price">11.99</span></div>
                                      </div>
                                      <span className="b-item-quantity-plus-minus mb-3">
                                        <span style={{ borderRadius: bodyTheme?.ButtonRadius || '0px'}} className="q-plus-icon mr-3">
                                          <i className="fa fa-plus-circle" aria-hidden="true"></i>Add Qty
                                        </span>
                                        <span style={{ borderRadius: bodyTheme?.ButtonRadius || '0px'}} className="q-minus-icon mr-3"><i className="fa fa-minus-circle" aria-hidden="true"></i>Remove</span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="totall-amount-wrap position-relative">


                                <div className="pos-total-item-row total">
                                  <div style={{color: bodyTheme?.BodyTextColor || '#000'}} className="item-total-label justify-content-end">Total</div>
                                  <div style={{color: bodyTheme?.BodyTextColor || '#000'}} className="item-total-label text-right"><span>£</span><span className="item-total-price-label">112.94</span></div>
                                </div>
                                <div className="pos-total-item-row d-none">
                                  <div style={{color: bodyTheme?.BodyTextColor || '#000'}} className="item-total-label">Items Total</div>
                                  <div style={{color: bodyTheme?.BodyTextColor || '#000'}} className="item-total-label text-right"><span>$</span><span className="item-total-price-label">112.94</span></div>
                                </div>
                                <div className="pos-total-item-row d-none">
                                  <div style={{color: bodyTheme?.BodyTextColor || '#000'}} className="item-total-label">GST 18%</div>
                                  <div style={{color: bodyTheme?.BodyTextColor || '#000'}} className="item-total-label text-right"><span className="item-total-price-label">$2.76</span></div>
                                </div>
                              </div>



                              <div className='pos-input-row-full mb-3'>
                                {/* <span className='p-table-icon'> <svgIcon.OpenTable /></span> */}
                                <input style={{ borderRadius: bodyTheme?.InputRadius || '0px'}} className='form-control' type="text" value="At Restaurant" />
                                <i class="fa fa-angle-down m-r-5"></i>
                              </div>
                              <div className='pos-table-c-name-wrap'>

                                <div className='pos-input-row'>
                                  {/* <span className='p-table-icon'> <svgIcon.OpenTable /></span> */}
                                  <input style={{ borderRadius: bodyTheme?.InputRadius || '0px'}} className='form-control' type="text" value="Now" />
                                  <i class="fa fa-angle-down m-r-5"></i>
                                </div>
                                <div className='pos-input-row'>
                                  {/* <span className='p-user-icon font-16'><HiOutlineUser></HiOutlineUser></span> */}
                                  <input style={{ borderRadius: bodyTheme?.InputRadius || '0px'}} className='form-control' type="text" value="Today" />
                                  <i class="fa fa-angle-down m-r-5"></i>
                                </div>
                              </div>

                              <div className="basket-checkout-btn-wrap d-flex justify-content-center">
                                <div style={{ borderRadius: bodyTheme?.ButtonRadius || '0px', background: bodyTheme?.BodyPrimaryBtnBgColor || "#000", color: bodyTheme?.BodyPrimaryBtnColor || "#000"}} className="w-100 btn btn-large-h d-flex align-items-center justify-content-center"><i className="fa fa-shopping-cart mr-2"></i>Confirm Order
                                </div>
                              </div>
                            </div>

                          </div>



                        </section>


                      </div>
                      :
                      <div className='skeleton-p-wrap classic'>
                        <div className='basket-cat-b-wrap'>
                          <div className='category-wrap'>
                            <div className='category-list'>
                              <a>
                                <span style={{ borderRadius: bodyTheme?.ButtonRadius || '0px', color: bodyTheme?.BodyPrimaryBtnColor || '#000', backgroundColor: bodyTheme?.BodyPrimaryBtnBgColor || '#000', borderColor: bodyTheme?.BodyPrimaryBtnBgColor || '#000'}} className='catgory-name active'>Category 1</span>
                              </a>
                              <a>
                                <span style={{color: bodyTheme?.BodyTextColor || '#000'}} className='catgory-name'>Category 2</span>
                              </a>
                              <a>
                                <span style={{color: bodyTheme?.BodyTextColor || '#000'}} className='catgory-name'>Category 3</span>
                              </a>
                              <a>
                                <span style={{color: bodyTheme?.BodyTextColor || '#000'}} className='catgory-name'>Category 4</span>
                              </a>
                              <a>
                                <span style={{color: bodyTheme?.BodyTextColor || '#000'}} className='catgory-name'>Category 5</span>
                              </a>
                            </div>

                            <div class="m-b-20 m-t-20 search-item-wrap position-relative">
                              <input style={{ borderRadius: bodyTheme?.InputRadius || '0px'}} type="text" class="form-control common-serch-field" placeholder="Search" value="" />
                              <i class="fa fa-search" aria-hidden="true"></i>
                            </div>
                          </div>

                          <section className='main-cat-basket'>
                            <div className='d-flex flex-column'>
                              <div className='mb-4'>
                                <div class="category-heading">
                                  <h2 style={{color: bodyTheme?.BodyHeadingColor || '#000'}}>Heading 1</h2>
                                  <div style={{background: bodyTheme?.BodyPrimaryBtnBgColor || '#000'}} class="cat-separater"></div>
                                  <p style={{color: bodyTheme?.BodyPColor || '#777'}}>Big on Flavour: Our signature tender burger packs a punch.</p>
                                </div>
                                <div className='category-items'>
                                  <div className='d-flex flex-row-reverse'>
                                    <div className='item-row'>
                                      <div className='left-item-img'>
                                        <BsImage style={{ borderRadius: bodyTheme?.ImageRadius || '0px'}} />
                                      </div>
                                    </div>
                                    <div className='right-items-price-w'>
                                      <div className='item-img-btn-wrap'>
                                        <h3 style={{color: bodyTheme?.BodyHeadingColor || '#000'}} className='label-item-name font-12 bold'>Item Heading 1</h3>
                                        <p style={{color: bodyTheme?.BodyPColor || '#777'}} className='font-12'>Lorem ipsum, or lipsum as it is sometimes known.</p>
                                      </div>
                                      <div className='item-title-row'>
                                        <div className='d-flex flex-column'>
                                          <span style={{color: bodyTheme?.BodyTextColor || '#000'}} className='font-12 color-7'>Starting from</span>
                                          <span style={{color: bodyTheme?.BodyTextColor || '#000'}} className='bold font-12'>£20</span>
                                        </div>
                                        <div style={{color: bodyTheme?.BodyPrimaryBtnBgColor || '#000', borderColor: bodyTheme?.BodyPrimaryBtnBgColor || '#000'}} className='add-basket-btn'>
                                          <i class="fa fa-plus"></i>
                                        </div>
                                      </div>
                                    </div>


                                  </div>

                                </div>
                              </div>

                              <div className='mb-4'>
                                <div class="category-heading">
                                  <h2 style={{color: bodyTheme?.BodyHeadingColor || '#000'}}>Heading 2</h2>
                                  <div style={{background: bodyTheme?.BodyPrimaryBtnBgColor || '#000'}} class="cat-separater"></div>
                                  <p style={{color: bodyTheme?.BodyPColor || '#777'}}>Big on Flavour: Our signature tender burger packs a punch.</p>
                                </div>
                                <div className='category-items'>
                                  <div className='d-flex flex-row-reverse'>
                                    <div className='item-row'>
                                      <div className='left-item-img'>
                                        <BsImage style={{ borderRadius: bodyTheme?.ImageRadius || '0px'}} />
                                      </div>
                                    </div>
                                    <div className='right-items-price-w'>
                                      <div className='item-img-btn-wrap'>
                                        <h3 style={{color: bodyTheme?.BodyHeadingColor || '#000'}} className='label-item-name font-12 bold'>Item Heading 2</h3>
                                        <p style={{color: bodyTheme?.BodyPColor || '#777'}} className='font-12'>Lorem ipsum, or lipsum as it is sometimes known.</p>
                                      </div>
                                      <div className='item-title-row'>
                                        <div className='d-flex flex-column'>
                                          <span style={{color: bodyTheme?.BodyTextColor || '#000'}} className='font-12 color-7'>Starting from</span>
                                          <span style={{color: bodyTheme?.BodyTextColor || '#000'}} className='bold font-12'>£20</span>
                                        </div>
                                        <div style={{color: bodyTheme?.BodyPrimaryBtnBgColor || '#000', borderColor: bodyTheme?.BodyPrimaryBtnBgColor || '#000'}} className='add-basket-btn'>
                                          <i class="fa fa-plus"></i>
                                        </div>
                                      </div>
                                    </div>


                                  </div>

                                </div>
                              </div>
                            </div>


                            <div className='basket-wrap'>
                              <div className='main-basket-wrap'>
                                <div className="panel-heading">

                                  <BiArrowBack className='mb-2 font-24 mr-3 basket-back-arrow' ></BiArrowBack>
                                  <h3 className="d-flex align-items-center justify-content-between ">
                                    <div style={{color: bodyTheme?.BodyHeadingColor || '#000'}} className='font-12'> Your order</div>


                                  </h3>
                                  <div className="a-remove-all-item-wrapper">
                                    <span className="a-remove-all-item"><i className="fa fa-trash mr-2"></i> Remove all</span>
                                  </div>

                                </div>
                                <div className='basket-item-top-wrap'>
                                  <div className='basket-item-wrap'>
                                    <div className="basket-order-empty d-none" id="dvBasketEmpty">
                                      <span className="order-empty-basket">Your order basket is empty.</span>
                                      <span className="order-empty-like-menu">What would you like to order today?</span>
                                    </div>
                                    <div className='pos-item-loop-p-wrap'>
                                      <div className='pos-item-row'>
                                        <div className="b-item-price">
                                          <div style={{color: bodyTheme?.BodyHeadingColor || '#000'}} className="b-item-name-label"><span className="quantity">1</span><span className='quantity-x'>x</span><span className="o-i-name">Double Trouble</span> </div>
                                          <div style={{color: bodyTheme?.BodyTextColor || '#000'}} className="b-item-price-label"><span className="pos-item-price">11.99</span></div>
                                        </div>
                                        <span className="b-item-quantity-plus-minus mb-3"><span style={{ borderRadius: bodyTheme?.ButtonRadius || '0px'}} className="q-plus-icon mr-3"><i className="fa fa-plus-circle" aria-hidden="true"></i>Add Qty</span>
                                        <span style={{ borderRadius: bodyTheme?.ButtonRadius || '0px'}} className="q-minus-icon mr-3"><i className="fa fa-minus-circle" aria-hidden="true"></i>Remove</span></span>
                                        {/* <div className="item-topping-wrap mb-3">
                          <div className="w-100 d-flex flex-column">
                            <span className="tp-label"><span className='toping-extras-label'>Toppings</span></span>
                            <div className='item-t-e'><span className="topping-extra-dtl">1 x 1st Cheese </span><span className="topping-extra-price">£0.59</span></div>
                            <div className='item-t-e'><span className="topping-extra-dtl">1 x 1st Chicken </span><span className="topping-extra-price">£0.59</span></div>
                            <div><span className="menu-item-extras-edit-common"><i className="fa fa-pencil-square-o" aria-hidden="true"></i>change</span></div>

                          </div>
                        </div> */}
                                        {/* <div className="item-topping-wrap mb-3">
                          <div className="w-100 d-flex flex-column">
                            <span className="tp-label"><span className='toping-extras-label'>Extras</span></span>
                            <div className='item-t-e'><span className="topping-extra-dtl">1 x 1st Cheese </span><span className="topping-extra-price">£0.59</span></div>
                            <div className='item-t-e'><span className="topping-extra-dtl">1 x 1st Chicken </span><span className="topping-extra-price">£0.59</span></div>
                            <div><span className="menu-item-extras-edit-common"><i className="fa fa-pencil-square-o" aria-hidden="true"></i>change</span></div>

                          </div>
                        </div> */}

                                      </div>
                                      <div className='pos-item-row'>
                                        <div className="b-item-price">
                                          <div style={{color: bodyTheme?.BodyHeadingColor || '#000'}} className="b-item-name-label"><span className="quantity">1</span><span className='quantity-x'>x</span><span className="o-i-name">Double Trouble</span> </div>
                                          <div style={{color: bodyTheme?.BodyTextColor || '#000'}} className="b-item-price-label"><span className="pos-item-price">11.99</span></div>
                                        </div>
                                        <span className="b-item-quantity-plus-minus mb-3">
                                          <span style={{ borderRadius: bodyTheme?.ButtonRadius || '0px'}} className="q-plus-icon mr-3">
                                            <i className="fa fa-plus-circle" aria-hidden="true"></i>Add Qty
                                          </span>
                                          <span style={{ borderRadius: bodyTheme?.ButtonRadius || '0px'}} className="q-minus-icon mr-3"><i className="fa fa-minus-circle" aria-hidden="true"></i>Remove</span>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="totall-amount-wrap position-relative">


                                  <div className="pos-total-item-row total">
                                    <div style={{color: bodyTheme?.BodyTextColor || '#000'}} className="item-total-label justify-content-end">Total</div>
                                    <div style={{color: bodyTheme?.BodyTextColor || '#000'}} className="item-total-label text-right"><span>£</span><span className="item-total-price-label">112.94</span></div>
                                  </div>
                                  <div className="pos-total-item-row d-none">
                                    <div style={{color: bodyTheme?.BodyTextColor || '#000'}} className="item-total-label">Items Total</div>
                                    <div style={{color: bodyTheme?.BodyTextColor || '#000'}} className="item-total-label text-right"><span>$</span><span className="item-total-price-label">112.94</span></div>
                                  </div>
                                  <div className="pos-total-item-row d-none">
                                    <div style={{color: bodyTheme?.BodyTextColor || '#000'}} className="item-total-label">GST 18%</div>
                                    <div style={{color: bodyTheme?.BodyTextColor || '#000'}} className="item-total-label text-right"><span className="item-total-price-label">$2.76</span></div>
                                  </div>
                                </div>



                                <div className='pos-input-row-full mb-3'>
                                  {/* <span className='p-table-icon'> <svgIcon.OpenTable /></span> */}
                                  <input style={{ borderRadius: bodyTheme?.InputRadius || '0px'}} className='form-control' type="text" value="At Restaurant" />
                                  <i class="fa fa-angle-down m-r-5"></i>
                                </div>
                                <div className='pos-table-c-name-wrap'>

                                  <div className='pos-input-row'>
                                    {/* <span className='p-table-icon'> <svgIcon.OpenTable /></span> */}
                                    <input style={{ borderRadius: bodyTheme?.InputRadius || '0px'}} className='form-control' type="text" value="Now" />
                                    <i class="fa fa-angle-down m-r-5"></i>
                                  </div>
                                  <div className='pos-input-row'>
                                    {/* <span className='p-user-icon font-16'><HiOutlineUser></HiOutlineUser></span> */}
                                    <input style={{ borderRadius: bodyTheme?.InputRadius || '0px'}} className='form-control' type="text" value="Today" />
                                    <i class="fa fa-angle-down m-r-5"></i>
                                  </div>
                                </div>

                                <div className="basket-checkout-btn-wrap d-flex justify-content-center">
                                  <div style={{ borderRadius: bodyTheme?.ButtonRadius || '0px', background: bodyTheme?.BodyPrimaryBtnBgColor || "#000", color: bodyTheme?.BodyPrimaryBtnColor || "#000"}} className="w-100 btn btn-large-h d-flex align-items-center justify-content-center"><i className="fa fa-shopping-cart mr-2"></i>Confirm Order
                                  </div>
                                </div>
                              </div>

                            </div>



                          </section>
                        </div>
                      </div>
                  }
                </div>
              ) :

                <div class="mobile case-wrap">
                  <div class="temp-wrapper">
                    <div class="px">
                      <div class="px__body">
                        <div class="px__body__cut"></div>
                        <div class="px__body__speaker"></div>
                        <div class="px__body__sensor"></div>

                        <div class="px__body__mute"></div>
                        <div class="px__body__up"></div>
                        <div class="px__body__down"></div>
                        <div class="px__body__right"></div>
                      </div>

                      <div class="px__screen">
                        <div class="px__screen__">
                          <div class="px__screen__frame" >
                            <div className='skeleton-p-wrap mobile'>
                              <div className='category-wrap'>
                                <div className='category-list'>
                                  <a>
                                    <span style={{ borderRadius: bodyTheme?.ButtonRadius || '0px', color: bodyTheme?.BodyPrimaryBtnColor || '#000', backgroundColor: bodyTheme?.BodyPrimaryBtnBgColor || '#000', borderColor: bodyTheme?.BodyPrimaryBtnBgColor || '#000'}} className='catgory-name active'>Category 1</span>
                                  </a>
                                  <a>
                                    <span style={{color: bodyTheme?.BodyTextColor || '#000'}}className='catgory-name'>Category 2</span>
                                  </a>
                                  <a>
                                    <span style={{color: bodyTheme?.BodyTextColor || '#000'}} className='catgory-name'>Category 3</span>
                                  </a>
                                </div>

                                <div class="m-b-20 m-t-20 search-item-wrap position-relative">
                                  <input style={{ borderRadius: bodyTheme?.InputRadius || '0px'}} type="text" class="form-control common-serch-field" placeholder="Search" value="" />
                                  <i class="fa fa-search" aria-hidden="true"></i>
                                </div>
                              </div>

                              <div className='basket-cat-b-wrap'>
                                <section className='main-cat-basket'>
                                  <div className='d-flex flex-column'>
                                    <div className='mb-4'>
                                      <div class="category-heading">
                                        <h2 style={{color: bodyTheme?.BodyHeadingColor || '#000'}}>Heading 1</h2>
                                        <div style={{background: bodyTheme?.BodyPrimaryBtnBgColor || '#000'}} class="cat-separater"></div>
                                        <p style={{color: bodyTheme?.BodyPColor || '#777'}}>Big on Flavour: Our signature tender burger packs a punch.</p>
                                      </div>
                                      <div className='category-items'>
                                        <div className='d-flex flex-row-reverse justify-content-end'>
                                          <div className='item-row'>
                                            <div className='left-item-img'>
                                              <BsImage style={{ borderRadius: bodyTheme?.ImageRadius || '0px'}} />
                                            </div>
                                          </div>
                                          <div className='right-items-price-w'>
                                            <div className='item-img-btn-wrap'>
                                              <h3 style={{color: bodyTheme?.BodyHeadingColor || '#000'}} className='label-item-name font-12 bold'>Item Heading 1</h3>
                                              <p style={{color: bodyTheme?.BodyPColor || '#777'}} className='font-12'>Lorem ipsum, or lipsum as it is sometimes known.</p>
                                            </div>
                                            <div className='item-title-row'>
                                              <div className='d-flex flex-column'>
                                                <span style={{color: bodyTheme?.BodyTextColor || '#000'}} className='font-12 color-7'>Starting from</span>
                                                <span style={{color: bodyTheme?.BodyTextColor || '#000'}} className='bold font-12'>£20</span>
                                              </div>
                                              <div style={{color: bodyTheme?.BodyPrimaryBtnBgColor || '#000', borderColor: bodyTheme?.BodyPrimaryBtnBgColor || '#000'}} className='add-basket-btn'>
                                                <i class="fa fa-plus"></i>
                                              </div>
                                            </div>
                                          </div>


                                        </div>

                                      </div>
                                    </div>

                                    <div className='mb-4'>
                                      <div class="category-heading">
                                        <h2 style={{color: bodyTheme?.BodyHeadingColor || '#000'}}>Heading 2</h2>
                                        <div style={{background: bodyTheme?.BodyPrimaryBtnBgColor || '#000'}} class="cat-separater"></div>
                                        <p style={{color: bodyTheme?.BodyPColor || '#777'}}>Big on Flavour: Our signature tender burger packs a punch.</p>
                                      </div>
                                      <div className='category-items'>
                                        <div className='d-flex flex-row-reverse justify-content-end'>
                                          <div className='item-row'>
                                            <div className='left-item-img'>
                                              <BsImage style={{ borderRadius: bodyTheme?.ImageRadius || '0px'}} />
                                            </div>
                                          </div>
                                          <div className='right-items-price-w'>
                                            <div className='item-img-btn-wrap'>
                                              <h3 style={{color: bodyTheme?.BodyHeadingColor || '#000'}} className='label-item-name font-12 bold'>Item Heading 2</h3>
                                              <p style={{color: bodyTheme?.BodyPColor || '#777'}} className='font-12'>Lorem ipsum, or lipsum as it is sometimes known.</p>
                                            </div>
                                            <div className='item-title-row'>
                                              <div className='d-flex flex-column'>
                                                <span style={{color: bodyTheme?.BodyTextColor || '#000'}} className='font-12 color-7'>Starting from</span>
                                                <span style={{color: bodyTheme?.BodyTextColor || '#000'}} className='bold font-12'>£30</span>
                                              </div>
                                              <div style={{color: bodyTheme?.BodyPrimaryBtnBgColor || '#000', borderColor: bodyTheme?.BodyPrimaryBtnBgColor || '#000'}} className='add-basket-btn'>
                                                <i class="fa fa-plus"></i>
                                              </div>
                                            </div>
                                          </div>


                                        </div>

                                      </div>
                                    </div>
                                  </div>


                                  <div className='basket-wrap'>
                                    <div className='main-basket-wrap'>
                                      <div className="panel-heading">

                                        <BiArrowBack className='mb-2 font-24 mr-3 basket-back-arrow' ></BiArrowBack>
                                        <h3 className="d-flex align-items-center justify-content-between ">
                                          <div style={{color: bodyTheme?.BodyHeadingColor || '#000'}} className='font-12'> Your order</div>


                                        </h3>
                                        <div className="a-remove-all-item-wrapper">
                                          <span className="a-remove-all-item"><i className="fa fa-trash mr-2"></i> Remove all</span>
                                        </div>

                                      </div>
                                      <div className='basket-item-top-wrap'>
                                        <div className='basket-item-wrap'>
                                          <div className="basket-order-empty d-none" id="dvBasketEmpty">
                                            <span className="order-empty-basket">Your order basket is empty.</span>
                                            <span className="order-empty-like-menu">What would you like to order today?</span>
                                          </div>
                                          <div className='pos-item-loop-p-wrap'>
                                            <div className='pos-item-row'>
                                              <div className="b-item-price">
                                                <div style={{color: bodyTheme?.BodyHeadingColor || '#000'}} className="b-item-name-label"><span className="quantity">1</span><span className='quantity-x'>x</span><span className="o-i-name">Double Trouble</span> </div>
                                                <div style={{color: bodyTheme?.BodyTextColor || '#000'}} className="b-item-price-label"><span className="pos-item-price">11.99</span></div>
                                              </div>
                                              <span className="b-item-quantity-plus-minus mb-3"><span className="q-plus-icon mr-3"><i className="fa fa-plus-circle" aria-hidden="true"></i>Add Qty</span><span className="q-minus-icon mr-3"><i className="fa fa-minus-circle" aria-hidden="true"></i>Remove</span></span>

                                            </div>
                                            <div className='pos-item-row'>
                                              <div className="b-item-price">
                                                <div style={{color: bodyTheme?.BodyHeadingColor || '#000'}} className="b-item-name-label"><span className="quantity">1</span><span className='quantity-x'>x</span><span className="o-i-name">Double Trouble</span> </div>
                                                <div style={{color: bodyTheme?.BodyTextColor || '#000'}} className="b-item-price-label"><span className="pos-item-price">11.99</span></div>
                                              </div>
                                              <span className="b-item-quantity-plus-minus mb-3">
                                                <span style={{ borderRadius: bodyTheme?.ButtonRadius || '0px'}} className="q-plus-icon mr-3">
                                                  <i className="fa fa-plus-circle" aria-hidden="true"></i>Add Qty
                                                </span>
                                                <span style={{ borderRadius: bodyTheme?.ButtonRadius || '0px'}} className="q-minus-icon mr-3"><i className="fa fa-minus-circle" aria-hidden="true"></i>Remove</span>
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="totall-amount-wrap position-relative">


                                        <div className="pos-total-item-row total">
                                          <div style={{color: bodyTheme?.BodyTextColor || '#000'}} className="item-total-label justify-content-end">Total</div>
                                          <div style={{color: bodyTheme?.BodyTextColor || '#000'}} className="item-total-label text-right"><span>$</span><span className="item-total-price-label">112.94</span></div>
                                        </div>
                                        <div className="pos-total-item-row d-none">
                                          <div style={{color: bodyTheme?.BodyTextColor || '#000'}} className="item-total-label">Items Total</div>
                                          <div style={{color: bodyTheme?.BodyTextColor || '#000'}} className="item-total-label text-right"><span>$</span><span className="item-total-price-label">112.94</span></div>
                                        </div>
                                        <div className="pos-total-item-row d-none">
                                          <div style={{color: bodyTheme?.BodyTextColor || '#000'}} className="item-total-label">GST 18%</div>
                                          <div style={{color: bodyTheme?.BodyTextColor || '#000'}} className="item-total-label text-right"><span className="item-total-price-label">$2.76</span></div>
                                        </div>
                                      </div>



                                      <div className='pos-input-row-full mb-3'>
                                        {/* <span className='p-table-icon'> <svgIcon.OpenTable /></span> */}
                                        <input className='form-control' type="text" value="At Restaurant" />
                                        <i class="fa fa-angle-down m-r-5"></i>
                                      </div>
                                      <div className='pos-table-c-name-wrap'>

                                        <div className='pos-input-row'>
                                          {/* <span className='p-table-icon'> <svgIcon.OpenTable /></span> */}
                                          <input className='form-control' type="text" value="Now" />
                                          <i class="fa fa-angle-down m-r-5"></i>
                                        </div>
                                        <div className='pos-input-row'>
                                          {/* <span className='p-user-icon font-16'><HiOutlineUser></HiOutlineUser></span> */}
                                          <input className='form-control' type="text" value="Today" />
                                          <i class="fa fa-angle-down m-r-5"></i>
                                        </div>
                                      </div>

                                      <div  className="basket-checkout-btn-wrap d-flex justify-content-center">
                                        <div style={{ borderRadius: bodyTheme?.ButtonRadius || '0px', background: bodyTheme?.BodyPrimaryBtnBgColor || "#000", color: bodyTheme?.BodyPrimaryBtnColor || "#000"}} className="w-100 btn btn-large-h d-flex align-items-center justify-content-center"><i className="fa fa-shopping-cart mr-2"></i>Confirm Order
                                        </div>
                                      </div>
                                    </div>

                                  </div>



                                </section>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div class="temp-wrapper temp-wrapper--wide">
<div class="px px--ls">
  <div class="px__body">
    <div class="px__body__cut"></div>
    <div class="px__body__speaker"></div>
    <div class="px__body__sensor"></div>

    <div class="px__body__mute"></div>
    <div class="px__body__up"></div>
    <div class="px__body__down"></div>
    <div class="px__body__right"></div>
  </div>

  <div class="px__screen">
    <div class="px__screen__">
      <div class="px__screen__frame" style={{backgroundImage:"url('https://github.com/muhammederdem/vue-interactive-paycard/blob/master/src/assets/images/15.jpeg?raw=true')"}}>
        <i class="fa fa-apple"></i>
      </div>
    </div>
  </div>
</div>
</div> */}
                </div>

              }

             



              <div className="body-theme">

                <div className="body-inner-wrap">

                  <div className="body-detail">
                    <h2 className='font-14 bold mr-2 mb-0' style={{ color: ThemeSetting.body.BodyHeadingColor }}>
                      Buttons
                    </h2>

                    <button className="btn btn-secondary mr-2"
                      onMouseEnter={() => this.bodylinksHover(1)} onMouseLeave={() => this.bodylinksHover(1)}
                      style={{
                        borderRadius: bodyTheme?.ButtonRadius || '0px',
                        backgroundColor: (!this.state.bodylinksHover[1]) ?
                          ThemeSetting.body.BodyDefaultBtnBgColor :
                          ThemeSetting.body.BodyDefaultBtnBgColorHover,
                        color: (!this.state.bodylinksHover[1]) ?
                          ThemeSetting.body.BodyDefaultBtnColor :
                          ThemeSetting.body.BodyDefaultBtnColorHover
                      }} > Default</button>

                    <button className="btn mr-2"
                      onMouseEnter={() => this.bodylinksHover(2)} onMouseLeave={() => this.bodylinksHover(2)}
                      style={{
                        borderRadius: bodyTheme?.ButtonRadius || '0px',
                        backgroundColor: (!this.state.bodylinksHover[2]) ?
                          ThemeSetting.body.BodyPrimaryBtnBgColor :
                          ThemeSetting.body.BodyPrimaryBtnBgColorHover,
                        color: (!this.state.bodylinksHover[2]) ?
                          ThemeSetting.body.BodyPrimaryBtnColor :
                          ThemeSetting.body.BodyPrimaryBtnColorHover
                      }}>Primary</button>


                    <button className="btn btn-success mr-2"
                      onMouseEnter={() => this.bodylinksHover(3)} onMouseLeave={() => this.bodylinksHover(3)}
                      style={{
                        borderRadius: bodyTheme?.ButtonRadius || '0px',
                        backgroundColor: (!this.state.bodylinksHover[3]) ?
                          ThemeSetting.body.BodySuccussBtnBgColor :
                          ThemeSetting.body.BodySuccussBtnBgColorHover,
                        color: (!this.state.bodylinksHover[3]) ?
                          ThemeSetting.body.BodySuccussBtnColor :
                          ThemeSetting.body.BodySuccussBtnColorHover
                      }}>Secondary</button>

                    <a href="#0" className="cd-top " onMouseEnter={() => this.bodylinksHover(4)} onMouseLeave={() => this.bodylinksHover(4)} style={{
                     
                      backgroundColor: (!this.state.bodylinksHover[4]) ?
                        ThemeSetting.body.BackTopBtnBgColor :
                        ThemeSetting.body.BackTopBtnBgColorHover,
                      color: (!this.state.bodylinksHover[4]) ?
                        ThemeSetting.body.BackTopBtnBgColorIcon :
                        ThemeSetting.body.BackTopBtnBgColorIconHover
                    }}><AiOutlineArrowUp className='font-18'></AiOutlineArrowUp> </a>
                    {/* <p style={{ color: ThemeSetting.body.BodyPColor }}>
                    Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.
               </p> */}
                    {/* <p>
                    <a href="#"
                      onMouseEnter={() => this.bodylinksHover(0)} onMouseLeave={() => this.bodylinksHover(0)}
                      style={{

                        color: (!this.state.bodylinksHover[0]) ?
                          ThemeSetting.body.BodyAColor :
                          ThemeSetting.body.BodyAColorHover
                      }}
                    >
                      {'Read more >>'}
                    </a>
                  </p> */}

                    {/* <h2>body buttons here</h2> */}

                  </div>
                  <div className="body-detail-right d-none">



                  </div>
                </div>
              </div>
              <div className="section-heading d-none"><span className="dashed"></span>  <span className="headding-span">Footer</span> <span className="dashed"></span></div>
              <footer className="footer-area d-none" style={{ backgroundColor: ThemeSetting.footer.FooterBgColor }}>
                <div className="footer-top">
                  <div className="container">
                    <div className="row">

                      <div className="col-md-6 col-lg-4">
                        <h4 className="footer-herading" style={{ color: ThemeSetting.footer.FooterHeadingColor }}>About Company</h4>
                        <div className="about-footer">
                          <p style={{ color: ThemeSetting.footer.FooterPColor }}>
                            Lorem ipsum, or lipsum as it is sometimes known, is dummy text.
                            <address>

                              (+800) 345 678

                            </address>
                          </p>

                          <div className="social-info">
                            <ul>
                              <li>
                                <a href="#"><i className="fa fa-facebook"
                                  onMouseEnter={() => this.footerSocialIconHover(0)} onMouseLeave={() => this.footerSocialIconHover(0)}
                                  style={{
                                    color: (!this.state.footerSocialIcon[0]) ?
                                      ThemeSetting.footer.FooterIconColor :
                                      ThemeSetting.footer.FooterIconColorHover
                                  }} ></i></a>
                              </li>
                              <li>
                                <a href="#"><i className="fa fa-twitter"
                                  onMouseEnter={() => this.footerSocialIconHover(1)} onMouseLeave={() => this.footerSocialIconHover(1)}
                                  style={{
                                    color: (!this.state.footerSocialIcon[1]) ?
                                      ThemeSetting.footer.FooterIconColor :
                                      ThemeSetting.footer.FooterIconColorHover
                                  }}
                                ></i></a>
                              </li>
                              <li>
                                <a href="#"><i className="fa fa-youtube" onMouseEnter={() => this.footerSocialIconHover(2)} onMouseLeave={() => this.footerSocialIconHover(2)}
                                  style={{
                                    color: (!this.state.footerSocialIcon[2]) ?
                                      ThemeSetting.footer.FooterIconColor :
                                      ThemeSetting.footer.FooterIconColorHover
                                  }}></i></a>
                              </li>
                              <li>
                                <a href="#"><i className="fa fa-google" onMouseEnter={() => this.footerSocialIconHover(3)} onMouseLeave={() => this.footerSocialIconHover(3)}
                                  style={{
                                    color: (!this.state.footerSocialIcon[3]) ?
                                      ThemeSetting.footer.FooterIconColor :
                                      ThemeSetting.footer.FooterIconColorHover
                                  }}></i></a>
                              </li>
                              <li>
                                <a href="#"><i className="fa fa-instagram" onMouseEnter={() => this.footerSocialIconHover(4)} onMouseLeave={() => this.footerSocialIconHover(4)}
                                  style={{
                                    color: (!this.state.footerSocialIcon[4]) ?
                                      ThemeSetting.footer.FooterIconColor :
                                      ThemeSetting.footer.FooterIconColorHover
                                  }}></i></a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-2 mt-res-sx-30px mt-res-md-30px">
                        <div className="single-wedge">
                          <h4 className="footer-herading" style={{ color: ThemeSetting.footer.FooterHeadingColor }}>Site Map</h4>
                          <div className="footer-links">
                            <ul>
                              <li><a href="#" onMouseEnter={() => this.footerLinksHover(0)} onMouseLeave={() => this.footerLinksHover(0)}
                                style={{
                                  color: (!this.state.footerLinksHover[0]) ?
                                    ThemeSetting.footer.FooterLinkColor :
                                    ThemeSetting.footer.FooterLinkColorHover
                                }}>Link 1</a></li>
                              <li><a href="#" onMouseEnter={() => this.footerLinksHover(1)} onMouseLeave={() => this.footerLinksHover(1)}
                                style={{
                                  color: (!this.state.footerLinksHover[1]) ?
                                    ThemeSetting.footer.FooterLinkColor :
                                    ThemeSetting.footer.FooterLinkColorHover
                                }}>Link 2</a></li>
                              <li><a href="#" onMouseEnter={() => this.footerLinksHover(2)} onMouseLeave={() => this.footerLinksHover(2)}
                                style={{
                                  color: (!this.state.footerLinksHover[2]) ?
                                    ThemeSetting.footer.FooterLinkColor :
                                    ThemeSetting.footer.FooterLinkColorHover
                                }}>Link 3</a></li>



                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-6 mt-res-md-50px mt-res-sx-30px mt-res-md-30px d-none">
                        <div className="single-wedge">
                          <h4 className="footer-herading" style={{ color: ThemeSetting.footer.FooterHeadingColor }}>Subscribe</h4>
                          <div className="subscrib-text">
                            <p style={{ color: ThemeSetting.footer.FooterPColor }}>
                              Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.
                            </p>
                          </div>
                          <div id="mc_embed_signup" className="subscribe-form">
                            <form id="mc-embedded-subscribe-form" className="validate">
                              <div id="mc_embed_signup_scroll" className="mc-form">
                                <input className="email" type="email" required="" placeholder="Enter your email here.." name="EMAIL" />
                                <div className="mc-news" aria-hidden="true" style={{ position: 'absolute', left: '-5000px' }}>
                                  <input type="text" value="" tabindex="-1" name="b_6bbb9b6f5827bd842d9640c82_05d85f18ef" />
                                </div>
                                <div className="clear">
                                  <input id="mc-embedded-subscribe"
                                    onMouseEnter={() => this.footerbtnHover()} onMouseLeave={() => this.footerbtnHover()}
                                    style={{
                                      color: (!this.state.footerbtnHover) ?
                                        ThemeSetting.footer.FooterBtnColor :
                                        ThemeSetting.footer.FooterBtnColorHover,
                                      backgroundColor: (!this.state.footerbtnHover) ?
                                        ThemeSetting.footer.FooterBtnBgColor :
                                        ThemeSetting.footer.FooterBtnBgColorHover,
                                    }}
                                    className="button" type="submit" name="subscribe" value="Sign Up" />
                                </div>
                              </div>
                            </form>
                          </div>

                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                <div className="footer-bottom">
                  <div className="container">
                    <div className="row">
                      <div className="col-md-6 col-lg-4">
                        <p className="copy-text" style={{ color: ThemeSetting.footer.FooterPColor }}>Copyright ©  All Rights Reserved</p>
                      </div>

                    </div>
                  </div>
                </div>

              </footer>
            </div>

          </div>
          <div className="click-cart menu-responsive-preview" onClick={() => this.showHideSidebarRight()}>
            {/* <span className="menu-label-checkout d-md-none">Your Order</span> */}
            {/* <span className="shopping-cart position-relative">
            <AiOutlineShoppingCart className='common-header-icon ' />
            <span className="c-bubble" id="spMasterBasket">1</span>
          </span> */}
            <span id="spBasketTotal" className="h-basket-w" >
              <span className="a-price-symbol"><i class="fa fa-eye font-18"></i></span>
            </span>
          </div>
          <Modal style={{ maxWidth: 800 }} isOpen={this.state.CustomCssN} toggle={() => this.CustomCssNModal()} className={this.props.className}>
            <ModalHeader toggle={() => this.CustomCssNModal()} >Custom css</ModalHeader>
            <ModalBody >
              <div className="common-theme-wrap">
                <AceEditor
                  style={{ width: '100%', height: 400, marginBottom: 15, fontSize: 16 }}
                  mode='css'
                  theme="github"
                  onChange={this.onChangeCustomCss}
                  ref="aceEditor"
                  name="UNIQUE-ID"
                  value={this.state.customCss}
                  editorProps={{
                    $blockScrolling: true
                  }}
                  className="AceEditortext"
                />
                <div className="col-xs-12 setting-cus-field m-b-20">

                  {/* <FormGroup>
                    <Button disabled={this.state.IsEditorSave} onClick={() => {  
                        this.showText()
                    }} color="primary" className="btn waves-effect waves-light btn-primary pull-left">
                      {this.state.IsEditorSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                        : <span className="comment-text">Save</span>}
                    </Button>
                  </FormGroup> */}

                  <div className="action-wrapper">
                  </div>
                </div>
              </div>
            </ModalBody>
            <FormGroup className="modal-footer" >
              <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger"></label>
              </div>
              <div>
                <Button className='mr-2 text-dark' color="secondary" onClick={() => this.CustomCssNModal()}>Cancel</Button>
                <Button color="primary" >
                  {/* <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>   */}
                  <span className="comment-text" onClick={() => this.handleDoneCustomCssModal()}>Done</span>
                </Button>
              </div>
            </FormGroup>
          </Modal>
        </div>
      </div>
    );
  }

}

export default ThemeSettings;