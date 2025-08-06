import React, { Component, Fragment } from 'react';
import Avatar from 'react-avatar';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import { Link } from 'react-router-dom'
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import * as CampaignService from '../../service/Campaign';
import * as Utilities from '../../helpers/Utilities';
import Loader from 'react-loader-spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import ImageUploader from 'react-images-upload';
import 'rc-color-picker/assets/index.css';
//import ReactDOM from 'react-dom';
import ColorPicker from 'rc-color-picker';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import GlobalData from '../../helpers/GlobalData';

import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'

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
class EditCampaignTheme extends Component {

  //#region Constructor
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      CampaignList: [],
      ShowLoader: true,
      CampaignTheme: [],
      CampaignContentJson : [],
      WebContent : {},
      AppContent : {},
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

    };
    
   // this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.SaveCampaign = this.SaveCampaign.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.RemoveContentImageHandler = this.RemoveContentImageHandler.bind(this);
    
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
  changeHandler(colors,control) {
 
    let campaign = this.state.CampaignTheme;
    let webContent = this.state.WebContent;
    switch(control) {
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
      webContent.SearchInputTextColor= colors.color;  
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
  
      this.setState({CampaignTheme : campaign, WebContent : webContent})

  }

  onDrop = async  (picture)  => {
   
    $('.uploadPicturesWrapper').find('div uploadPictureContainer').first().remove();
    this.setState({FileTypeErrorMessage: "", image: null});
    let pics = this.state.pictures.concat(picture);
    
    let photoName = "";
    let imageDataUrl = "";
    if(picture.length > 0) {
      photoName = pics[picture.length-1].name;
      imageDataUrl = await readFile(pics[picture.length-1]);
      let img = document.getElementById("tempImg");
      this.setState({ image: imageDataUrl, PhotoName : photoName,ImageExtension:""});
      
      setTimeout(
        function() {
         
          this.ValidateImageSize(img.width, img.height,pics[0].type);
        }
        .bind(this),
        100
    );

      
    } else{
      this.setImageExtension(this.state.groupName);
    }
   

}


ValidateImageSize(width, height, imageType){

  let groupName = this.state.groupName;
  let validate = false;
  let validationMessage = "";
  switch (groupName) {

    case PhotoGroupName[0]:
    let LogoWidthHeight = GlobalData.restaurants_data.Supermeal_dev.Campaign_Logo_Image_Width_Height;
    validate = width === Number(LogoWidthHeight[0]) && height === Number(LogoWidthHeight[1]) && imageType ==="image/png";
    validationMessage = "Logo should be a "+Number(LogoWidthHeight[0]) +" x "+ Number(LogoWidthHeight[1]) +"px PNG file. "  
    break;
    
    case PhotoGroupName[1]:
    let MainBannerWidthHeight = GlobalData.restaurants_data.Supermeal_dev.Campaign_Main_Banner_Width_Height;
    validate = width === Number(MainBannerWidthHeight[0]) && height === Number(MainBannerWidthHeight[1]) && imageType ==="image/png";
    validationMessage = "Main Banner should be a "+Number(MainBannerWidthHeight[0]) +" x "+ Number(MainBannerWidthHeight[1]) +"px PNG file. "  
    break;
    
    case PhotoGroupName[2]:
    let SubBannerWidthHeight = GlobalData.restaurants_data.Supermeal_dev.Campaign_Sub_Banner_Width_Height;
    validate = width === Number(SubBannerWidthHeight[0]) && height === Number(SubBannerWidthHeight[1]) && imageType ==="image/jpeg";
    validationMessage = "Desktop sub banner should be a "+Number(SubBannerWidthHeight[0]) +" x "+ Number(SubBannerWidthHeight[1]) +"px JPG file. "  
    break;
    
    case PhotoGroupName[3]:
    let FoodImageWidthHeight = GlobalData.restaurants_data.Supermeal_dev.Campaign_Food_Image_Width_Height;
    validate = width === Number(FoodImageWidthHeight[0]) && height === Number(FoodImageWidthHeight[1]) && imageType ==="image/png";
    validationMessage = "Food image should be a "+Number(FoodImageWidthHeight[0]) +" x "+ Number(FoodImageWidthHeight[1]) +"px PNG file. "  
    break;

    case PhotoGroupName[4]:
    let BackgroundWidthHeight = GlobalData.restaurants_data.Supermeal_dev.Campaign_Background_Image_Width_Height;
    validate = width === Number(BackgroundWidthHeight[0]) && height === Number(BackgroundWidthHeight[1]) && imageType ==="image/jpeg";
    validationMessage = "Desktop background image should be a "+Number(BackgroundWidthHeight[0]) +" x "+ Number(BackgroundWidthHeight[1]) +"px JPG file. "  
    break;
    
    case PhotoGroupName[5]:
    let AppBackgroundWidthHeight = GlobalData.restaurants_data.Supermeal_dev.Campaign_App_Background_Image_Width_Height;
    validate = width === Number(AppBackgroundWidthHeight[0]) && height === Number(AppBackgroundWidthHeight[1]) && imageType ==="image/jpeg";
    validationMessage = "App background image  should be a "+Number(AppBackgroundWidthHeight[0]) +" x "+ Number(AppBackgroundWidthHeight[1]) +"px JPG file. "  
    break;

    case PhotoGroupName[6]:
    let AppSubBannerWidthHeight = GlobalData.restaurants_data.Supermeal_dev.Campaign_App_Sub_Banner_Width_Height;
    validate = width === Number(AppSubBannerWidthHeight[0]) && height === Number(AppSubBannerWidthHeight[1]) && imageType ==="image/jpeg";
    validationMessage = "App sub banner  should be a "+Number(AppSubBannerWidthHeight[0]) +" x "+ Number(AppSubBannerWidthHeight[1]) +"px JPG file. "  
    break;
   
    default:
    break;


  }

   if(!validate)
      this.setState({FileTypeErrorMessage: validationMessage, image: null});
      
}

  handleSubmit(e) {
    e.preventDefault();
    let main = this.state.startDate
    // console.log(main.format('L'));
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
   
    let campaignContentJson =[];
    let webContent = CampaignService.WebBanners;
    let appContent = CampaignService.AppBanners;
    let startDate = new Date();
    let endDate = "";
    
    if(Object.keys(data). length > 0) {
        startDate = new Date(Utilities.FormatDate(data.StartDate)); 
        endDate =   new Date(Utilities.FormatDate(data.EndDate));

    if(data.ContentJson.trim() !== "") {

        campaignContentJson = JSON.parse(data.ContentJson);
        webContent = campaignContentJson[0];
        appContent = campaignContentJson[1];
    }

     this.setState({startDate: startDate, endDate: endDate});
  }
     this.setState({ CampaignTheme: data,
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

    if (message === '1'){
        Utilities.notify("Updated successfully.","s");
        this.GetCampaign(campaign.Id);
    }
     
    else
    {
      Utilities.notify("Update failed.","e");
    }

  }


  SaveCampaign(e,values) {

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
     campaignAppContent.WalletStripTextColor =  values.txtTextWalletStripe;

    campaign.ContentBanner.push(campaignWebContent);
    campaign.ContentBanner.push(campaignAppContent);

      this.SaveCampaignApi(campaign);
  }

  SavePhotoApi = async (oldPhotoName, bitStream, photoName, groupName) => {

     let campaign = CampaignService.Campaign;

     let webContent = this.state.WebContent;
     let appContent = this.state.AppContent;

     campaign.Id = this.state.CampaignId
     campaign.OldPhotoName = oldPhotoName;
     campaign.PhotoNameBitStream = bitStream;
     campaign.PhotoGroupName = groupName;
     campaign.PhotoName = photoName;

     let result = await CampaignService.SavePhoto(campaign);
     
     let photoPath = "";
     let newPhotoName = "";
     
     if(!result.HasError){
      
        newPhotoName = result.Dictionary.PhotoName;
        photoPath = result.Dictionary.AbsolutePhotoPath;
      
      switch (groupName) {

        case PhotoGroupName[0]:
        webContent.Logo = photoPath;
        appContent.Logo = photoPath;
        this.setState({OldLogoPhotoName: newPhotoName});

        break;
        
        case PhotoGroupName[1]:
        webContent.MainBannersCsv = photoPath;
        appContent.MainBannersCsv = photoPath;
        this.setState({OldMainBannerPhotoName: newPhotoName});

        break;
        
        case PhotoGroupName[2]:
        webContent.SubBanner = photoPath;
        this.setState({OldSubBannerPhotoName: newPhotoName});

        break;
        
        case PhotoGroupName[3]:
        webContent.FoodImagesCsv = photoPath;
        appContent.FoodImagesCsv = photoPath;
        this.setState({OldFoodPhotoName: newPhotoName});

        break;

        case PhotoGroupName[4]:
        webContent.BackgroundCsv = photoPath;
        this.setState({OldBackgroundPhotoName: newPhotoName});

        break;
        
        case PhotoGroupName[5]:
        appContent.BackgroundCsv = photoPath;
        this.setState({OldAppBackgroundPhotoName: newPhotoName});

        break;
       
        case PhotoGroupName[6]:
        appContent.SubBanner = photoPath;
        this.setState({OldAppSubBannerPhotoName: newPhotoName})
        


        default:
        break;

    }
      this.setState({AppContent : appContent, WebContent: webContent, showModal: !this.state.showModal});
    }
  }


  //#endregion

  //#region Image Methods

GenerateImageModal(){
    return(
        <Modal isOpen={this.state.showModal} toggle={this.toggleModal} className={this.props.className}>
        <ModalHeader toggle={this.toggleModal}>{this.state.modalHeader}</ModalHeader>
        <ModalBody>
          <div className="popup-web-body-wrap-new">
            <div id="logo-upload-image" className="upload-image-wrap-new">
              <div className="upload-dragdrop-wrap" id="logoDragImage">
                {/* <div>
                {/* <ImageUploader
                label={"Max file size: 5mb, accepted:" + this.state.ImageExtension}
                buttonText='Choose images'
                onChange={this.onDrop}
                maxFileSize={5242880}
                fileSizeError='file size is too big'
                accept={this.state.ImageExtension}
                withPreview={true}
                singleImage={true}
                buttonClassName={this.state.FileTypeErrorMessage =='' && this.state.image ==null ? "":'hide-choose-btn'}
                /> 

                </div> */}
                {/* <MyUploader /> */}
                {MyUploader(true)}

              </div>
              <div className="crop-image-main-wrap ">
              </div>

            </div>
       { this.state.FileTypeErrorMessage==''?'':
           <div className="alert alert-danger" role="alert">
            {this.state.FileTypeErrorMessage}
            </div>
               }
          </div>
 
        </ModalBody>
        <ModalFooter>

          <Button color="secondary" onClick={(e) => this.toggleModal(this.state.groupName)}>Cancel</Button>
          {this.state.image !== null && <Button color="primary" style={{ marginRight: 10 }} onClick={(e) => this.SaveImage(this.state.groupName)}>Save</Button>}
        </ModalFooter>
      </Modal>
    )
}


RemoveContentImageHandler(groupName){

  let webContent = this.state.WebContent;
  let appContent = this.state.AppContent;

  switch (groupName) {

    case PhotoGroupName[0]:
    webContent.Logo = "";
    appContent.Logo = "";
    break;
    
    case PhotoGroupName[1]:
    webContent.MainBannersCsv = "";
    appContent.MainBannersCsv = "";
    break;
    
    case PhotoGroupName[2]:
    webContent.SubBanner = "";
    appContent.SubBanner = "";
    break;
    
    case PhotoGroupName[3]:
    webContent.FoodImagesCsv ="";
    appContent.FoodImagesCsv = "";
    break;

    case PhotoGroupName[4]:
    webContent.BackgroundCsv = "";
    break;
    
    case PhotoGroupName[5]:
    appContent.BackgroundCsv = "";
    break;
   

    case PhotoGroupName[6]:
    appContent.SubBanner = "";
    break;
   


    default:
    break;

}


}


SaveImage = async (group) => {

let oldPhotoName = ""

  switch (group) {

    case PhotoGroupName[0]:
    oldPhotoName = this.state.OldLogoPhotoName;

    break;
    
    case PhotoGroupName[1]:
    oldPhotoName = this.state.OldMainBannerPhotoName;

    break;
    
    case PhotoGroupName[2]:
    oldPhotoName = this.state.OldSubBannerPhotoName

    break;
    
    case PhotoGroupName[3]:
    oldPhotoName = this.state.OldFoodPhotoName;

    break;

    case PhotoGroupName[4]:
    oldPhotoName = this.state.OldBackgroundPhotoName;

    break;
    
    case PhotoGroupName[5]:
    oldPhotoName = this.state.OldAppBackgroundPhotoName;

    break;
   

    case PhotoGroupName[6]:
    oldPhotoName = this.state.OldAppSubBannerPhotoName;
    default:
    break;

}

     
    this.SavePhotoApi(oldPhotoName, this.state.image, this.state.PhotoName, group)

  }


  toggleModal(group) {
    
    this.setState({ showModal: !this.state.showModal,  groupName: group, FileTypeErrorMessage: "", image: null});

   this.setImageExtension(group);
  }


  setImageExtension(group){

    switch (group) {

      case PhotoGroupName[0]:
      this.setState({ modalHeader: "Upload Logo", ImageExtension: ['.png']});
      break;
      
      case PhotoGroupName[1]:
      this.setState({ modalHeader: "Upload Main Banner Image",ImageExtension: ['.png']});
      break;
      
      case PhotoGroupName[2]:
      this.setState({ modalHeader: "Upload Sub Banner Image",ImageExtension: ['.jpg']});
      break;
      
      case PhotoGroupName[3]:
      this.setState({ modalHeader: "Upload Food Image",ImageExtension: ['.png']});
      break;

      case PhotoGroupName[4]:
      this.setState({ modalHeader: "Upload Background Image",ImageExtension: ['.jpg']});
      break;
      
      case PhotoGroupName[5]:case PhotoGroupName[5]:
      this.setState({ modalHeader: "Upload App Background Image",ImageExtension: ['.jpg']});
      break;
     
      case PhotoGroupName[6]:
      this.setState({ modalHeader: "Upload App Sub Banner Image",ImageExtension: ['.jpg']});
      break;
     
      
      default:
      break;

  }

  }


  //#endregion





  hadleTeaserChange(e){

    let value = e.target.value;
    this.setState({SelectedTeaser: value})

  }

  componentDidMount() {

    var id = this.props.match.params.id;
  
    if(id !== undefined){
        this.setState({CampaignId: id});
        this.GetCampaign(id);
    } else {
      this.setState({ ShowLoader: false });
    }

  }

  shouldComponentUpdate() {
    return true;
  }

  renderCampaignInfo(campaign)
{
  
  if(campaign === null) {
    return <div></div>
  }

  return (
    <div>
                <div className="row">
                  <div className="col-md-6 ">
                    <div className="form-group mb-3">
                      <label id="name" className="control-label">Name
                      </label>
                      <AvField name="txtName" value={Object.keys(campaign).length === 0? "" :  campaign.Name} type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                        }}
                      
                      />
                    </div>
                  </div>
                    
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="control-label">Show Teaser Before</label>
                      
                      <AvField name="ddlTeaser" type="select" value={Object.keys(campaign).length === 0? "0" :campaign.ShowTeaserBefore}  className="form-control custom-select" onChange={(e) => this.hadleTeaserChange(e)}
                      >
                      <option value="0">Select Teaser</option>
                        <option value="6">06 hours</option>
                        <option value="12">12 hours</option>
	                    <option value="24">24 hours</option>
	                    <option value="48">48 hours</option>
                        <option value="72">72 hours</option>
                      </AvField >
                    </div>
                  </div>


                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label id="lblPreCampaignMsg" className="control-label">PreCampaign Message
                      </label>
                      <AvField name="txtPreCampaignMsg" value={Object.keys(campaign).length === 0? "" : campaign.PreLaunchText} type="text" className="form-control"
                      validate={this.state.SelectedTeaser > 0 ? {
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                        } : ''}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label id="lblPostCampaignMsg" className="control-label">PostCampaign Message
                      </label>
                      <AvField name="txtPostCampaignMsg" value={Object.keys(campaign).length === 0? "" : campaign.PostLaunchText} type="text" className="form-control"
                      
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="row">

                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label id="lblBackgroundColor" className="control-label">Backgound Color
                      </label>
                      <div className="relative">     
                                   <ColorPicker
      color={campaign.BackgroundColor}
      enableAlpha={false}
      enableRGB ={false}
      onChange={(colors) => this.changeHandler(colors,'C_B')}
      onClose={(colors) => this.changeHandler(colors,'C_B')} 
      placement="topRight"
      className="some-class picker-color"
      
    >
    <span className="rc-color-picker-trigger ">
      <span className="rc-color-picker-trigger custom-picker"></span>
      </span>
  </ColorPicker>
                      <AvField name="txtBackgroundColor"  type="text" className="form-control"  value={Object.keys(campaign).length === 0? "" : campaign.BackgroundColor}/>
                    </div>
                    </div>
                  </div>
                  <div className="col-md-6">

                    <div className="form-group mb-3">
                      <label id="lblTextColor" className="control-label">Text Color
                      </label>

                      <div className="relative">    
                                   <ColorPicker
      color={campaign.TextColor}
      enableAlpha={false}
      onChange={(colors) => this.changeHandler(colors,'C_T')}
      onClose={(colors) => this.changeHandler(colors,'C_T')}

      placement="topRight"
      className="some-class picker-color"
    >
     <span className="rc-color-picker-trigger ">
      <span className="rc-color-picker-trigger custom-picker"></span>
      </span>
    </ColorPicker>
    <AvField  name="txtTextColor"  type="text" className="form-control"  value={Object.keys(campaign).length === 0? "" : campaign.TextColor}/>
    </div>
                    </div>
                  </div>
                </div>

                <div className="row">

                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label id="lblStartDate" className="control-label">Start Date
                      </label>
                      <DatePicker
        selected={this.state.startDate}
        onChange={this.StartDateChange}
        showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15}
      timeCaption="time"
      dateFormat="dd/MM/yyyy hh:mm aa"
      className="form-control"
      />
                        {/* <DatePicker
                        selected={this.state.startDate}
                        onChange={this.handleChange}
                        /> */}
                          {/* <DatePicker
      selected={startDate}
      onChange={date => setStartDate(date)}
      showTimeSelect
      excludeTimes={[
        setHours(setMinutes(new Date(), 0), 17),
        setHours(setMinutes(new Date(), 30), 18),
        setHours(setMinutes(new Date(), 30), 19),
        setHours(setMinutes(new Date(), 30), 17)
      ]}
      dateFormat="MMMM d, yyyy h:mm aa"
    /> */}
                      {/* <AvField  name="txtStartDate" value={Object.keys(campaign).length === 0? "" : Utilities.FormatDate(campaign.StartDate).format("YYYY/MM/DD hh:mm")} className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                        }}
                      /> */}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label id="lblStartDate" className="control-label">End Date
                      </label>
                      {/* <AvField  name="txtEndDate" value={Object.keys(campaign).length === 0 ? "" : Utilities.FormatDate(campaign.EndDate).format("YYYY/MM/DD hh:mm")} className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field'},
                        }}
                      /> */}

<DatePicker
        selected={this.state.endDate}
        onChange={this.EndDateChange}
        showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15}
      timeCaption="time"
      dateFormat="dd/MM/yyyy hh:mm aa"
      className="form-control"
      />


                    </div>
                  </div>
                </div>
  </div>
  )

}

LoadCampaignTheme(campaign){

    if(campaign === null)
    {
      return (<div></div>)
    }
    
    // let campaignContentJson = [];
    let webContent = this.state.WebContent;
    let appContent = this.state.AppContent;

    return (
      <AvForm onValidSubmit={this.SaveCampaign}>
            <div className="form-body">
              <h4 className="title-sperator m-t-20 m-b-20">Campaign</h4>
              <div className="formPadding">
    
            {this.renderCampaignInfo(campaign)}
                
              </div>

            </div>
            <div className="form-body">
              <h4 className="title-sperator font-weight-600 m-t-30 m-b-20">Content</h4>
              <div className="formPadding media-wraper">
               
              <div className="row campaign-wrap" id="mediaPageWrap">
                  <div className="col-md-6 mb-3">
                    <div className="form-group ">
                    
                    <div className="res-logo-wrap col-sm-12 margin-r-0" onClick={(e) => this.toggleModal(PhotoGroupName[4])}>
                    <h5>Backgound Image</h5>
                    <p>1920 x 1080 JPG</p>
                    {Object.keys(webContent).length !== 0 && (webContent.BackgroundCsv !== "" && webContent.BackgroundCsv !== null) ?
                    
                    <div className="box-wrap box-campaign-wrap">
                        <img className="image-responive" src={webContent.BackgroundCsv.split(',')[0]} />
                        
                        <div class="el-overlay">
                          <div className="image-edit" >
                            <i className="fa fa-edit"></i>
                            <span>Edit</span>
                          </div>
                        </div>
                      </div>
                      :
                      <div className="background-not-available">
                      <div className="uppy-DragDrop-inner">
                      <i class="fa fa-file-image-o" aria-hidden="true"></i>
                        <div className="uppy-DragDrop-label">Click here to upload 
                        </div><span className="uppy-DragDrop-note"></span></div>
                    </div>
                    }

                  </div>

                    </div>
                  </div>

                <div className="col-md-6 mb-3">
                    <div className="form-group">
                    <div className="res-logo-wrap col-sm-12 margin-r-0" onClick={(e) => this.toggleModal(PhotoGroupName[5])}>
                    <h5>App Backgound Image</h5>
                    <p>1000 x 1000 JPG</p>
                    {Object.keys(appContent).length !== 0 && (appContent.BackgroundCsv !== "" && appContent.BackgroundCsv !== null) ?
                      <div className="box-campaign-wrap box-wrap">
                        {/* <div className="media-image"  style={{ backgroundImage: "url(" + appContent.BackgroundCsv.split(',')[0] + ")", width: "100%", height:200 }}></div> */}
                        <img  src={appContent.BackgroundCsv.split(',')[0]} className="image-responive" />
                        <div class="el-overlay">
                          <div className="image-edit">
                            <i className="fa fa-edit"></i>
                            <span>Edit</span>
                          </div>
                        </div>
                      </div>
                      :
                      <div className="background-not-available">
                      <div className="uppy-DragDrop-inner">
                      <i class="fa fa-file-image-o" aria-hidden="true"></i>
                        <div className="uppy-DragDrop-label">Click here to upload 
                        </div><span className="uppy-DragDrop-note"></span></div>
                    </div>
                    }

                  </div>

                    </div>
                  </div>

                </div> 


              <div className="row   campaign-wrap" id="mediaPageWrap">
                  <div className="col-md-6 mb-3">
                    <div className="form-group">
                    
                    <div className="res-logo-wrap col-sm-12 margin-r-0" onClick={(e) => this.toggleModal(PhotoGroupName[3])}>
                    <h5>Food Image</h5>
                    <p>750 x 750 PNG</p>
                    {Object.keys(webContent).length !== 0 && (webContent.FoodImagesCsv !== "" && webContent.FoodImagesCsv !== null) ?
                      <div className="box-campaign-wrap box-wrap">
                        {/* <div className="media-image"  style={{ backgroundImage: "url(" + webContent.FoodImagesCsv.split(',')[0] + ")", width: "100%", height:200 }}></div> */}
                        <img  src={webContent.FoodImagesCsv.split(',')[0]} className="image-responive"/>
                        <div class="el-overlay">
                          <div className="image-edit" >
                            <i className="fa fa-edit"></i>
                            <span>Edit</span>
                          </div>
                        </div>
                      </div>
                      :
                      <div className="background-not-available">
                      <div className="uppy-DragDrop-inner">
                      <i class="fa fa-file-image-o" aria-hidden="true"></i>
                        <div className="uppy-DragDrop-label">Click here to upload 
                        </div><span className="uppy-DragDrop-note"></span></div>
                    </div>
                    }

                  </div>

                    </div>
                  </div>

                <div className="col-md-6 mb-3">
                    <div className="form-group">
                    
                    <div className="res-logo-wrap col-sm-12 margin-r-0" onClick={(e) => this.toggleModal(PhotoGroupName[1])}>
                    <h5>Main Banner Image</h5>
                    <p>600 x 300 PNG</p>
                    {Object.keys(webContent).length !== 0 && (webContent.MainBannersCsv !== "" && webContent.MainBannersCsv !== null) ?
                      <div className="box-wrap box-campaign-wrap">
                        {/* <div className="media-image"  style={{ backgroundImage: "url(" + webContent.MainBannersCsv.split(',')[0] + ")", width: "100%", height:200 }}></div> */}
                        <img src={webContent.MainBannersCsv.split(',')[0]} className="image-responive"/>
                        <div class="el-overlay">
                          <div className="image-edit">
                            <i className="fa fa-edit"></i>
                            <span>Edit</span>
                          </div>
                        </div>
                      </div>
                      :
                      <div className="background-not-available">
                      <div className="uppy-DragDrop-inner">
                      <i class="fa fa-file-image-o" aria-hidden="true"></i>
                        <div className="uppy-DragDrop-label">Click here to upload 
                        </div><span className="uppy-DragDrop-note"></span></div>
                    </div>
                    }

                  </div>

                    </div>
                  </div>

                </div>



                  <div className="row campaign-wrap" id="mediaPageWrap">
                  <div className="col-md-6 mb-3">
                    <div className="form-group">
                    
                    <div className="res-logo-wrap col-sm-12 margin-r-0" onClick={(e) => this.toggleModal(PhotoGroupName[2])}>
                    <h5>Sub Banner Image</h5>
                    <p>1920 x 150 JPG</p>
                    {Object.keys(webContent).length !== 0 && (webContent.SubBanner !== "" && webContent.SubBanner !== null) ?
                      <div className="box-wrap box-campaign-wrap">
                        {/* <div className="media-image"  style={{ backgroundImage: "url(" + webContent.SubBanner.split(',')[0] + ")", width: "100%", height:200 }}></div> */}
                        <img  src={webContent.SubBanner.split(',')[0]} className="image-responive" />
                        <div class="el-overlay">
                          <div className="image-edit" >
                            <i className="fa fa-edit"></i>
                            <span>Edit</span>
                          </div>
                        </div>
                      </div>
                      :
                      <div className="background-not-available">
                      <div className="uppy-DragDrop-inner">
                      <i class="fa fa-file-image-o" aria-hidden="true"></i>
                        <div className="uppy-DragDrop-label">Click here to upload 
                        </div><span className="uppy-DragDrop-note"></span></div>
                    </div>
                    }

                  </div>

                    </div>
                  </div>


                    <div className="col-md-6 mb-3">
                    <div className="form-group ">
                    
                    <div className="res-logo-wrap col-sm-12 margin-r-0" onClick={(e) => this.toggleModal(PhotoGroupName[0])}>
                    <h5>Logo</h5>
                    <p>175 x 55 PNG</p>
                    {Object.keys(webContent).length !== 0 && (webContent.Logo !== "" && webContent.Logo !== null) ?
                      <div className="box-wrap box-campaign-wrap">
                        {/* <div className="media-image"  style={{ backgroundImage: "url(" + webContent.Logo.split(',')[0] + ")", width: "100%", height:200 }}></div> */}
                        <img  src={webContent.Logo.split(',')[0]} />
                        <div class="el-overlay">
                          <div className="image-edit" >
                            <i className="fa fa-edit"></i>
                            <span>Edit</span>
                          </div>
                        </div>
                      </div>
                      :
                      <div className="background-not-available">
                      <div className="uppy-DragDrop-inner">
                      <i class="fa fa-file-image-o" aria-hidden="true"></i>
                        <div className="uppy-DragDrop-label">Click here to upload 
                        </div><span className="uppy-DragDrop-note"></span></div>
                    </div>
                    }

                  </div>

                    </div>
                  </div>


                </div>



              <div className="row " id="mediaPageWrap">
                  <div className="col-md-6">
                    <div className="form-group">
                    
                    <div className="res-logo-wrap col-sm-12 margin-r-0" onClick={(e) => this.toggleModal(PhotoGroupName[6])}>
                    <h5>App Sub Banner Image</h5>
                    <p>600 x 100 JPG</p>
                    {Object.keys(appContent).length !== 0 && (appContent.SubBanner !== "" && appContent.SubBanner !== null) ?
                    
                    <div className="box-wrap">
                        <img className="media-image" src={appContent.SubBanner.split(',')[0]} style={{width: "100%"}}/>
                        
                        <div class="el-overlay">
                          <div className="image-edit" >
                            <i className="fa fa-edit"></i>
                            <span>Edit</span>
                          </div>
                        </div>
                      </div>
                      :
                      <div className="background-not-available">
                      <div className="uppy-DragDrop-inner">
                      <i class="fa fa-file-image-o" aria-hidden="true"></i>
                        <div className="uppy-DragDrop-label">Click here to upload 
                        </div><span className="uppy-DragDrop-note"></span></div>
                    </div>
                    }

                  </div>

                    </div>
                  </div>

                </div>




 <div class="media-wraper m-t-40 m-b-10 campaign-title-heading"><h5>Search Input</h5></div>

<div class="input-color-row">
  <div className="input-color-text">Search Input</div>
  <div className="input-color">
  <ColorPicker
     color={webContent.SearchInputBgColor}
     enableAlpha={false}
     onChange={(colors) => this.changeHandler(colors,'S_B')}
     onClose={(colors) => this.changeHandler(colors,'S_B')}
     placement="topRight"
      className="some-class picker-color"
      style={{background:'#fff'}}
    >
 <span className="rc-color-picker-trigger ">
      <span className="rc-color-picker-trigger custom-picker"></span>
      </span>
  </ColorPicker>
  <AvField  name="txtBgSearchInput" value={Object.keys(webContent).length === 0? "" : webContent.SearchInputBgColor} className="form-control" />
  </div>
 
</div>
  
<div class="input-color-row">
  <div class="input-color-text">Text color</div>
   <div className="input-color">
  <ColorPicker
    color={webContent.SearchInputTextColor}
    enableAlpha={false}
    onChange={(colors) => this.changeHandler(colors,'S_T')}
    onClose={(colors) => this.changeHandler(colors,'S_T')}

    placement="topRight"
      className="some-class picker-color"
    >
 <span className="rc-color-picker-trigger ">
      <span className="rc-color-picker-trigger custom-picker"></span>
      </span>
  </ColorPicker>
  <AvField  name="txtTextSearchInput" value={Object.keys(webContent).length === 0 ? "" : webContent.SearchInputTextColor} className="form-control" />
  </div>
  
  </div>


  <div class="media-wraper m-t-40 m-b-10 campaign-title-heading"><h5>Search Button</h5></div>

<div class="input-color-row">
  <div className="input-color-text">Search Button</div>
  <div className="input-color">
  <ColorPicker
    color={webContent.SearchBtnBgColor}
    enableAlpha={false}
    onChange={(colors) => this.changeHandler(colors,'SB_B')}
    onClose={(colors) => this.changeHandler(colors,'SB_B')}

    placement="topRight"
      className="some-class picker-color"
    >
 <span className="rc-color-picker-trigger ">
      <span className="rc-color-picker-trigger custom-picker"></span>
      </span>
  </ColorPicker>
  <AvField  name="txtBgSearchBtn" value={Object.keys(webContent).length === 0? "" : webContent.SearchBtnBgColor} className="form-control" />
  </div>
  
</div>
<div class="input-color-row">
  <div class="input-color-text">Text color</div>
  <div className="input-color">
  <ColorPicker
     color={webContent.SearchBtnTextColor}
     enableAlpha={false}
     onChange={(colors) => this.changeHandler(colors,'SB_T')}
     onClose={(colors) => this.changeHandler(colors,'SB_T')}

     placement="topRight"
      className="some-class picker-color"
    >
 <span className="rc-color-picker-trigger ">
      <span className="rc-color-picker-trigger custom-picker"></span>
      </span>
  </ColorPicker>
  <AvField  name="txtTextSearchBtn" value={Object.keys(webContent).length === 0 ? "" : webContent.SearchBtnTextColor} className="form-control" />
  </div>
  
  </div>


  <div class="media-wraper m-t-40 m-b-10 campaign-title-heading"><h5>Wallet Stripe</h5></div>
<div class="input-color-row">
  <div className="input-color-text">Background color</div>
  <div className="input-color">
  <ColorPicker
    color={webContent.WalletStripBgColor}
    enableAlpha={false}
    onChange={(colors) => this.changeHandler(colors,'W_B')}
    onClose={(colors) => this.changeHandler(colors,'W_B')}

    placement="topRight"
      className="some-class picker-color"
    >
 <span className="rc-color-picker-trigger ">
      <span className="rc-color-picker-trigger custom-picker"></span>
      </span>
  </ColorPicker>
  <AvField  name="txtBgWalletStripe" value={Object.keys(webContent).length === 0? "" : webContent.WalletStripBgColor} className="form-control" />
  </div>
 
</div>
<div class="input-color-row">
  <div class="input-color-text">Text color</div>
  <div className="input-color">
  <ColorPicker
    color={webContent.WalletStripTextColor}
    enableAlpha={false}
    onChange={(colors) => this.changeHandler(colors,'W_T')}
    onClose={(colors) => this.changeHandler(colors,'W_T')}

    placement="topRight"
      className="some-class picker-color"
    >
   <span className="rc-color-picker-trigger ">
      <span className="rc-color-picker-trigger custom-picker"></span>
      </span>
  </ColorPicker>
  <AvField  name="txtTextWalletStripe" value={Object.keys(webContent).length === 0 ? "" : webContent.WalletStripTextColor} className="form-control" />
  </div>
  
  </div>
  
{/* <div className="row">

<div className="col-xs-3 col-md-3">
  <div className="form-group">
  <label id="lblSearchInput" className="control-label">
 </label>
  </div>
</div>
<div className="col-xs-4 col-md-4">
  <div className="form-group">
  <label id="lblSearchInput" className="control-label">BG Color
 </label>
  </div>
</div>
<div className="col-xs-4 col-md-4">
  <div className="form-group">
  <label id="lblSearchInput" className="control-label">Text Color
 </label>
  </div>
</div>
</div>
  */}
{/* <div className="row">
<div className="col-xs-3 col-md-3">
  <div className="form-group">
  <label id="lblSearchInput" className="control-label">SearchBtnBgColor
 </label>
  </div>
</div>
<div className="col-xs-4 col-md-4">
  <div className="form-group">
    {/* <AvField  name="txtBgSearchInput" value={Object.keys(webContent).length === 0? "" : webContent.SearchInputBgColor} className="form-control" /> 
  </div>
</div>
<div className="col-xs-4 col-md-4">
  <div className="form-group">
<AvField  name="txtTextSearchInput" value={Object.keys(webContent).length === 0 ? "" : webContent.SearchInputTextColor} className="form-control" /> 
  </div>
</div>
</div> */}



{/* <div className="row">

<div className="col-md-6">
  <div className="form-group">
  <label id="lblSearchBtn" className="control-label">Search Button
 </label>
  </div>
</div>
</div>
 
<div className="row">

<div className="col-md-6">
  <div className="form-group">
    <AvField  name="txtBgSearchBtn" value={Object.keys(webContent).length === 0? "" : webContent.SearchBtnBgColor} className="form-control" />
  </div>
</div>
<div className="col-md-6">
  <div className="form-group">
    <AvField  name="txtTextSearchBtn" value={Object.keys(webContent).length === 0 ? "" : webContent.SearchBtnTextColor} className="form-control" />
  </div>
</div>
</div> */}


{/* 
<div className="row">

<div className="col-md-6">
  <div className="form-group">
  <label id="lblWalletStripe" className="control-label">Wallet Stripe
 </label>
  </div>
</div>
</div>
 
<div className="row">

<div className="col-md-6">
  <div className="form-group">
    <AvField  name="txtBgWalletStripe" value={Object.keys(webContent).length === 0? "" : webContent.WalletStripBgColor} className="form-control" />
  </div>
</div>
<div className="col-md-6">
  <div className="form-group">
    <AvField  name="txtTextWalletStripe" value={Object.keys(webContent).length === 0 ? "" : webContent.WalletStripTextColor} className="form-control" />
  </div>
</div>
</div> */}


            </div>
            </div>
           
            <div className="col-xs-12 setting-cus-field m-b-20">
             
            <FormGroup>
            <Link to="/campaign/themes"><Button color="secondary" className="btn waves-effect waves-light btn-secondary pull-left  m-l-10" style={{ marginRight: 10 }}>Cancel</Button></Link>    
            <Button color="primary" className="btn waves-effect waves-light btn-primary pull-left">Save</Button>
        
          </FormGroup>
              
              <div className="action-wrapper">
              </div>
            </div>
            
          </AvForm>
    )

  }

  render() {

    if (this.state.ShowLoader === true) {
        return this.loading()
       }

    return (
      <div className="card" id="CampaignDataWraper">
        <h3 className="card-title card-new-title">Campaign Theme</h3>
        <div className="card-body">

            {this.LoadCampaignTheme(this.state.CampaignTheme)}
            {this.GenerateImageModal()}

            <img src={this.state.image} name="tempImg" id="tempImg" style={{display: "none"}}/>
        </div>
      </div>

    );
  }

}

export default EditCampaignTheme;