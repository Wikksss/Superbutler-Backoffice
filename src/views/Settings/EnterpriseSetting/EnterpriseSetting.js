import React, { Component, Fragment } from 'react';
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader, Table, Alert } from 'reactstrap';
import { Editor } from "react-draft-wysiwyg";
import Cropper from 'react-easy-crop';
import Slider from '@material-ui/core/Slider'
import * as EnterpriseSettingService from '../../../service/EnterpriseSetting';
import * as Utilities from '../../../helpers/Utilities';
import Constants from '../../../helpers/Constants';
//import Config from '../../../helpers/Config';
//import { Switch } from 'react-router-dom';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
import getCroppedImg from '../../../helpers/CropImage'
import Loader from 'react-loader-spinner';
import { MdArrowBack, } from "react-icons/md";
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertFromRaw, convertToRaw, Modifier, ContentState, convertFromHTML } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import 'rc-time-picker/assets/index.css';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import DeliveryZones from '../../DeliveryZones/DeliveryZones';
import EnterpriseInfo from './EnterpriseInfo';
import OwnerInfo from './OwnerInfo';
import PaymentOptions from './PaymentOptions';
import OtherSettings from './EnterpriseOtherSettings';
import Address from './Address';
import Media from './Media';
import WorkingHours from './WorkingHours';
import * as DeliveryZoneService from '../../../service/DeliveryZone';
import Config from '../../../helpers/Config';
import Labels from '../../../containers/language/labels';
import SEO from './Seo';
const PhotoGroupName = ["Enterprise", "EnterpriseCoverPhoto", "Cover-Photo"];


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

var timeZone = '';
var currencySymbol = '';

class EnterpriseSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      StoreInfo: false,
      OwnerInfo: false,
      AddressesInfo: false,
      WorkingHoursInfo: false,
      modalSearchCover: false,
      modalLogo: false,
      focusField: '',
      htmlEditorState: EditorState.createEmpty(),
      active: false,
      scrolled: false,
      EnterpriseSetting: {},
      UserObject: {},
      DeliveryZones: [],
      Loader: true,
      ZoneType: -1,
      showDeliveryZone: false,
      profileScore: 0,
      progressBarColor: 'p-c-red',
      Days: [{ dayId: 7, dayName: "Sunday", shortName: "Sun", IsChecked: false }, { dayId: 1, dayName: "Monday", shortName: "Mon", IsChecked: false }, { dayId: 2, dayName: "Tuesday", shortName: "Tue", IsChecked: false }, { dayId: 3, dayName: "Wednesday", shortName: "Wed", IsChecked: false }, { dayId: 4, dayName: "Thursday", shortName: "Thu", IsChecked: false }, { dayId: 5, dayName: "Friday", shortName: "Fri", IsChecked: false }, { dayId: 6, dayName: "Saturday", shortName: "Sat", IsChecked: false }],
    };
    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      var userObject = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
      this.state.UserObject = userObject;

      timeZone = Config.Setting.timeZone;
      currencySymbol = Config.Setting.currencySymbol;

      if(userObject.EnterpriseRestaurant.Country != null) {
        timeZone = userObject.EnterpriseRestaurant.Country.TimeZone;
        currencySymbol = userObject.EnterpriseRestaurant.Country.CurrencySymbol;
        }


      // if (userObject.RoleLevel !== Constants.Role.ENTERPRISE_ADMIN_ID) SetMenuStatus(false);
    }
    this.GetEnterpriseSetting()
    this.GetEnterpriseZones()
    this.GetEnterpriseProfileHealth()
  }
  componentDidMount() {

    window.addEventListener('scroll', () => {
      const istop = window.scrollY < 95;

      if (istop !== true && !this.state.scrolled) {
        this.setState({ scrolled: true })
      }
      else if (istop == true && this.state.scrolled) {
        this.setState({ scrolled: false })
      }
    });
  }

  GetEnterpriseSetting = async () => {
    try {
      this.setState({ Loader: true });
      var data = await EnterpriseSettingService.GetEnterpriseSetting();
      if (data != undefined && data.Message == undefined) {
        //data.PhotoName = "";
        this.setState({ EnterpriseSetting: data, Loader: false });

      }
    } catch (e) {
      console.log('error in GetEnterpriseSetting EnterpriseSetting', e)
    }
  }

  GetEnterpriseProfileHealth = async () => {
    try {
      var data = await EnterpriseSettingService.GetProfileHealth();
      if (data != undefined && data.Message == undefined) {
        this.setProfileHealth(data[0])
      }
    } catch (e) {
      console.log('error in GetEnterpriseProfileHealth EnterpriseSetting', e)
    }
  }

  setProfileHealth = (dataJson) => {
    try {
      var totalProperties = Object.keys(dataJson).length;
      var missingInfo = "";
      var pending = "";
      var count = 0;
      var progressbarColor = this.state.progressBarColor;
      Object.keys(dataJson).forEach(function (key) {
        if (dataJson[key] == 1) {
          count = count + 1;
        }
        // else if (dataJson[key] > 0 && dataJson[key] < 1) {
        //   count = count + dataJson[key];
        //   pending = pending == "" ? key : pending + ", " + key
        // }
        // else if (dataJson[key] == 0) {
        //   missingInfo = missingInfo == "" ? key : missingInfo + ", " + key
        // }
      });
      count = (count / totalProperties) * 100;
      if (count > 25 && count <= 50) {
        progressbarColor = "p-c-orange"
      } else if (count > 50 && count <= 75) {
        progressbarColor = "p-c-yellow"
      } else if (count > 75 && count <= 100) {
        progressbarColor = "p-c-green"
      }
      localStorage.setItem(Constants.Session.PROFILE_HEALTH, count)
      this.setState({
        profileScore: count, progressBarColor: progressbarColor,
        // missingInformation: missingInfo, pendingApproval: pending 
      })
    }
    catch (e) {

    }
  }

  GetEnterpriseZones = async () => {
    let data = await DeliveryZoneService.Get();
    if (data.length != 0) {

      this.state.ZoneType = data[0].Radius === 0 && data[0].PolygonLatLong === "" ? 2 : (data[0].Radius === 0 && data[0].PolygonLatLong !== "" ? 1 : 0);

      data.forEach(deliveryZone => {
        let dayShortNameCsv = "";
        let days = this.state.Days;
        let dayCsvObj = deliveryZone.DayCsv.split(Config.Setting.csvSeperator);
        days.forEach(deliveryDay => {

          var rowId = "-1";
          for (var i = 0, j = dayCsvObj.length; i < j; i++) {
            if (Number(dayCsvObj[i]) === deliveryDay.dayId) {
              rowId = i;
              break;
            }
          }

          if (rowId !== "-1")
            dayShortNameCsv += deliveryDay.shortName + ", ";
        })

        deliveryZone.DayShortNameCSV = dayShortNameCsv.slice(0, -2);

      })

    }
    this.setState({ DeliveryZones: data })
  }

  showDeliveryZone = () => {
    this.setState({ active: !this.state.active, showDeliveryZone: !this.state.showDeliveryZone });
    window.scrollTo(0, 0)
  }


  loading = () => <div className="page-laoder-users">
    <div className="loader-menu-inner">
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
      <div className="loading-label">Loading.....</div>
    </div>
  </div>

  render() {
    if (this.state.Loader) return this.loading()
    return (
      <div className='page-slider-wrapper' style={{ overflow: 'initial', contain: 'paint' }}>



        <div className={this.state.active ? 'page-slider-inner-wrapper slide-active-page' : 'page-slider-inner-wrapper'} >

          <div className='slide-div sale-detail-wrap mb-4' style={{ overflow: "initial", contain: "paint" }}>
            <div className='card'>
              <div id='header'>
                <div style={{ boxShadow: "0 0 5px #00000030" }} className={this.state.scrolled ? ' flex-md-row flex-column sub-h fixed-sub-header d-flex align-items-start justify-content-between mb-4 card-body mb-5 p-3 m-3' : 'card-body m-3 mb-5 p-3 flex-md-row flex-column sub-h d-flex align-items-start justify-content-between'} >
                  <div className='flex-1 pr-5 w-100 mb-3'>
                    <h3 class="card-title card-new-title d-flex align-items-start mb-0 flex-1 mr-4">
                      <span className='mr-3 cursor-pointer' onClick={() => this.props.history.goBack()}><MdArrowBack size={24} /> </span>
                      <div className='w-100'>
                        <div>
                          {"Business Settings"}
                        </div>

                      </div>
                    </h3>
                    <div className='mt-3 pl-3 mb-2'>Your profile is {parseInt(this.state.profileScore)}% completed</div>
                    <div className='w-100 register-s-form pl-3 '> <ProgressBar now={this.state.profileScore} className={`w-100 ${this.state.progressBarColor}`} /></div>
                  </div>
                  <div className='d-flex flex-column w-100 px-3' style={{ maxWidth: 320 }}>
                    <h5 className='mb-2'>Hire a Superbutler Professional</h5>
                    <p>Get help with your website`s design marketing and small task from a professional freelancer or agency.</p>
                    <a className='text-primary cursor-pointer'>Start Now</a>
                  </div>
                </div>
                {/* <div className='card-body d-flex' style={{ paddingLeft: "25px", paddingRight: "25px", marginBottom: "25px" }}>
                  <div className='flex-1 mr-4'>
                    <h3>Store Setting</h3>
               
                  </div>
                    
                </div> */}

                <div className=''>

                  <Media enterpriseInfo={this.state.EnterpriseSetting} GetEnterpriseHealth={() => this.GetEnterpriseProfileHealth()} />
                </div>
                {/* Store info starts */}
                <div className='' >
                  <EnterpriseInfo enterpriseInfo={this.state.EnterpriseSetting} GetEnterpriseHealth={() => this.GetEnterpriseProfileHealth()} />
                </div>

                {/* Owner info starts */}
                <div className='pt-0 pb-0' >
                  <OwnerInfo enterpriseInfo={this.state.EnterpriseSetting} GetEnterpriseHealth={() => this.GetEnterpriseProfileHealth()} />
                </div>

                {/* Facilities Section starts */}
                {/* {
                  this.state.UserObject.Enterprise.EnterpriseTypeId != 5 && this.state.UserObject.Enterprise.EnterpriseTypeId != 15 &&
                  <div className='  pb-0'>
                    <PaymentOptions enterpriseInfo={this.state.EnterpriseSetting} GetEnterpriseHealth={() => this.GetEnterpriseProfileHealth()} />
                  </div>
                } */}

                {/* Addresses section starts  */}
                <div className=' pb-0'>
                  <Address enterpriseInfo={this.state.EnterpriseSetting} GetEnterpriseSetting={() => this.GetEnterpriseSetting()} GetEnterpriseHealth={() => this.GetEnterpriseProfileHealth()} />
                </div>

                {/* Delivery Zone starts */}
                {
                   this.state.UserObject.Enterprise.EnterpriseTypeId != 15 && 
                    <div className=' pb-0 card-body mx-0'>

                      <div class="row">
                        <div className=" mb-4 p-4 m-3 w-100" style={{ boxShadow: "0 0 5px #00000030" }}>
                          <div class="col-md-12 text-sizes px-0">
                            <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: "25px" }}>
                              <div className='d-flex align-items-center w-100'>
                                <h5>Delivery Zones</h5>
                                {
                                  Object.keys(this.state.EnterpriseSetting).length > 0 && this.state.EnterpriseSetting.EnterprisesAddresses.length > 0 &&
                                
                                  <span onClick={() => this.showDeliveryZone()} class="ml-auto add-cat-btn  flex-shrink-0 d-flex align-items-center justify-content-between">
                                    <i class="fa fa-plus mr-2" aria-hidden="true"></i>
                                    <span class="hide-in-responsive">Add New</span>
                                  </span>
                              
                                }
                              </div>
                            </div>
                            <div className='row'>
                              {
                                this.state.DeliveryZones.length > 0 && this.state.DeliveryZones.map((v, i) => (
                                  <div key={i} className="mb-4 zone-list col-md-12" style={{ maxWidth: "800px" }}>
                                    <label className="col-lg-3 p-0 bold">{v.Name}</label>
                                    <a class=" cursor-pointer text-primary" onClick={() => this.showDeliveryZone()}><i class="fa fa-edit mr-1"></i>{Labels.Edit}</a>
                                    <div className="row mb-3">
                                      <label className="col-lg-3 text-muted fw-semibold mb-0">Minimum order for delivery</label>
                                      <div className="col-lg-8">
                                        <span className="font-14">{v.MinimumDeliveryOrder != "" ? currencySymbol + " " + v.MinimumDeliveryOrder : '-'}</span>
                                      </div>
                                    </div>
                                    <div className="row mb-3">
                                      <label className="col-lg-3 text-muted fw-semibold mb-0">Delivery Charges</label>
                                      <div className="col-lg-8">
                                        <span className="font-14"> {v.DeliveryCharges != "" ? currencySymbol + " " + v.DeliveryCharges : '-'}</span>
                                      </div>
                                    </div>
                                    <div className="row mb-3">
                                      <label className="col-lg-3 text-muted fw-semibold mb-0">Delivery Time</label>
                                      <div className="col-lg-8">
                                      
                                        <span className="font-14">{v.DeliveryTime != "" ? v.DeliveryTime + " mins" : '-'}</span>
                                      </div>
                                    </div>
                                    <div className="row mb-3">
                                      <label className="col-lg-3 text-muted fw-semibold mb-0">Active days</label>
                                      <div className="col-lg-8">
                                        <span className="font-14">{v.DayShortNameCSV != "" ? v.DayShortNameCSV : '-'}</span>
                                      </div>
                                    </div>

                                  </div>
                                ))
                              }
                            </div>
                            {
                              Object.keys(this.state.EnterpriseSetting).length > 0 && this.state.EnterpriseSetting.EnterprisesAddresses.length == 0 &&
                              <div class="coming-soon-d badge badge-dark p-3 px-5 font-14 mt-2">
                                <span>Add address to view delivery zone setting</span>
                              </div>
                            }
                          </div>
                        </div>
                      </div>


                    </div>
                }

                {/* Working Hours starts */}
                <div className=''>
                  <WorkingHours enterpriseInfo={this.state.EnterpriseSetting} GetEnterpriseSetting={() => this.GetEnterpriseSetting()} GetEnterpriseHealth={() => this.GetEnterpriseProfileHealth()} />
                </div>

                 {/* Other Settings Section starts */}
                 {
                    this.state.UserObject.Enterprise.EnterpriseTypeId != 15 &&
                    <div className='  pb-0'>
                      <OtherSettings enterpriseInfo={this.state.EnterpriseSetting} GetEnterpriseHealth={() => this.GetEnterpriseProfileHealth()} />
                    </div>
                 }

                {
                  this.state.UserObject.Enterprise.EnterpriseTypeId == 5 &&
                  <div className=' pb-0'>
                    <SEO enterpriseInfo={this.state.EnterpriseSetting} GetEnterpriseHealth={() => this.GetEnterpriseProfileHealth()} />
                  </div>
                }
              </div>

              {/* All modals here */}
            </div>
          </div>
          {
            this.state.showDeliveryZone &&
            <div className='slide-div sale-detail-wrap mb-4'>
              <div className='card'>
                <div className='d-flex align-items-center justify-content-between mb-4'>
                  <h3 class="card-title card-new-title d-flex align-items-center mb-0 ">
                    <span className='mr-3 cursor-pointer' onClick={() => this.showDeliveryZone()}><MdArrowBack size={24} /> </span>
                    <div>
                      <div>
                        Shop settings/Delivery Zones
                      </div>
                    </div>
                  </h3>
                </div>
                <div class="card-body p-4">
                  <DeliveryZones GetEnterpriseZones={() => this.GetEnterpriseZones()} GetEnterpriseHealth={() => this.GetEnterpriseProfileHealth()} />
                </div>
              </div>
            </div>
          }
        </div>

      </div>

    );
  }
}

export default EnterpriseSetting;
