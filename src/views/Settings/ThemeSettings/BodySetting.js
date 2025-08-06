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
import * as ThemeSetting from '../../../helpers/DefaultTheme';
import "react-datepicker/dist/react-datepicker.css";
import GlobalData from '../../../helpers/GlobalData'

import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import Labels from '../../../containers/language/labels';
export var updateBody;
export default class BodySetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultTheme: this.props.bodyTheme
    }
    this.changeHandler = this.changeHandler.bind(this)
  }
  componentDidMount() {

    window.onkeyup = function (e) {
      if ((e.which == 13 || e.which == 27)) {
        e.target.blur();
      }
    }

  } 

  updateBody = updateBody = () => {
    this.setState({
      defaultTheme: this.props.bodyTheme
    })
  }
  saveTheme = (campaign) => {
    try {
      ThemeSetting.setbody(campaign)
    }
    catch (e) {
      console.log("saveTheme Exception", e)
    }
  }
  changeHandler(colors, control) {

    let campaign = this.props.bodyTheme;
    switch (control) {
      case "BodyHeadingColor":
        campaign.BodyHeadingColor = colors.color;
        break;
      case "BodyPColor":
        campaign.BodyPColor = colors.color;
        break;
        case "BodyTextColor":
          campaign.BodyTextColor = colors.color;
          break;
      case "BodyIconColor":
        campaign.BodyIconColor = colors.color;
        break;
      case "BodyAColor":
        campaign.BodyAColor = colors.color;
        break;
      case "BodyAColorHover":
        campaign.BodyAColorHover = colors.color;
        break;

      case "BodyDefaultBtnColor":
        campaign.BodyDefaultBtnColor = colors.color;
        break;
      case "BodyDefaultBtnBgColor":
        campaign.BodyDefaultBtnBgColor = colors.color;
        break;
      case "BodyDefaultBtnBgColorHover":
        campaign.BodyDefaultBtnBgColorHover = colors.color;
        break;
      case "BodyDefaultBtnColorHover":
        campaign.BodyDefaultBtnColorHover = colors.color;
        break;
      case "BodySuccussBtnColor":
        campaign.BodySuccussBtnColor = colors.color;
        break;
      case "BodySuccussBtnBgColor":
        campaign.BodySuccussBtnBgColor = colors.color;
        break;
      case "BodySuccussBtnColorHover":
        campaign.BodySuccussBtnColorHover = colors.color;
        break;
      case "BodySuccussBtnBgColorHover":
        campaign.BodySuccussBtnBgColorHover = colors.color;
        break;
      case "BodyPrimaryBtnColor":
        campaign.BodyPrimaryBtnColor = colors.color;
        break;
      case "BodyPrimaryBtnBgColor":
        campaign.BodyPrimaryBtnBgColor = colors.color;
        break;
      case "BodyPrimaryBtnBgColorHover":
        campaign.BodyPrimaryBtnBgColorHover = colors.color;
        break;
      case "BodyPrimaryBtnColorHover":
        campaign.BodyPrimaryBtnColorHover = colors.color;
        break;
      case "BackTopBtnBgColor":
        campaign.BackTopBtnBgColor = colors.color;
        break;
      case "BackTopBtnBgColorIcon":
        campaign.BackTopBtnBgColorIcon = colors.color;
        break;
      case "BackTopBtnBgColorHover":
        campaign.BackTopBtnBgColorHover = colors.color;
        break;
      case "BackTopBtnBgColorIconHover":
        campaign.BackTopBtnBgColorIconHover = colors.color;
        break;


      case "SliderbtnBgColor":
        campaign.SliderbtnBgColor = colors.color;
        break;
      case "SliderBtnColor":
        campaign.SliderBtnColor = colors.color;
        break;
      case "SliderBtnBgColorHover":
        campaign.SliderBtnBgColorHover = colors.color;
        break;
      case "SliderBtnColorHover":
        campaign.SliderBtnColorHover = colors.color;
        break;

        case "SliderBgColor":
          campaign.SliderBgColor = colors.color;
          break;
        case "SliderHeadingColor":
          campaign.SliderHeadingColor = colors.color;
          break;
        case "SliderPColor":
          campaign.SliderPColor = colors.color;
          break;
      default:
        break;
    }
    this.setState({ defaultTheme: campaign })
    this.saveTheme(campaign)
    this.props.reRenderComp()
  }
  bodyTheme(campaign) {

    if (campaign === null) {
      return (<div></div>)
    }

    // let campaignContentJson = [];
    let webContent = this.state.WebContent;
    let appContent = this.state.AppContent;

    return (
      <AvForm onValidSubmit={this.SaveCampaign}>
        <div className="form-body">
          <div className="formPadding">
            {this.renderbodytheme(campaign)}

          </div>

        </div>
      </AvForm>
    )

  }

  renderbodytheme(campaign) {

    if (campaign === null) {
      return <div></div>
    }

    return (
      <div className="theme-list-m-wrap new-t">
        <div className="theme-list-b">
          <h3 className=" font-16 m-t-20 m-b-10">{Labels.Heading_Text_Icon}</h3>
          <div className="row">

            <div className="col-md-12 theme-group-wrap">

              <div className="form-group mb-3">
                <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                  <label id="lblBackgroundColor" className="control-label">{Labels.Heading_Color} </label>
                  <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'BodyHeadingColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.BodyHeadingColor}></input>
                    </div>
                  <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                    <ColorPicker
                      color={campaign.BodyHeadingColor}
                      enableAlpha={false}
                      enableRGB={false}
                      onChange={(colors) => this.changeHandler(colors, 'BodyHeadingColor')}
                      onClose={(colors) => this.changeHandler(colors, 'BodyHeadingColor')}
                      placement="topRight"
                      className="some-class picker-color"

                    >
                      <span className="rc-color-picker-trigger ">
                        <span className="rc-color-picker-trigger custom-picker"></span>
                      </span>
                    </ColorPicker>
                    <AvField name="txtBodyHeadingColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.BodyHeadingColor} />
                  </div>
                </div>

              </div>

              <div className="form-group mb-3">
                <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                  <label id="lblBackgroundColor" className="control-label">{Labels.Paragraph_Text_Color} </label>
                  <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'BodyPColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.BodyPColor}></input>
                    </div>
                  <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                    <ColorPicker
                      color={campaign.BodyPColor}
                      enableAlpha={false}
                      enableRGB={false}
                      onChange={(colors) => this.changeHandler(colors, 'BodyPColor')}
                      onClose={(colors) => this.changeHandler(colors, 'BodyPColor')}
                      placement="topRight"
                      className="some-class picker-color"

                    >
                      <span className="rc-color-picker-trigger ">
                        <span className="rc-color-picker-trigger custom-picker"></span>
                      </span>
                    </ColorPicker>
                    <AvField name="txtBodyPColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.BodyPColor} />
                  </div>
                </div>
              </div>

              <div className="form-group mb-3">
                <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                  <label id="lblBackgroundColor" className="control-label">{Labels.Body_Text_Color} </label>
                  <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'BodyTextColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.BodyTextColor}></input>
                    </div>
                  <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                    <ColorPicker
                      color={campaign.BodyTextColor}
                      enableAlpha={false}
                      enableRGB={false}
                      onChange={(colors) => this.changeHandler(colors, 'BodyTextColor')}
                      onClose={(colors) => this.changeHandler(colors, 'BodyTextColor')}
                      placement="topRight"
                      className="some-class picker-color"

                    >
                      <span className="rc-color-picker-trigger ">
                        <span className="rc-color-picker-trigger custom-picker"></span>
                      </span>
                    </ColorPicker>
                    <AvField name="txtBodyTextColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.BodyTextColor} />
                  </div>
                </div>
              </div>

              <div className="form-group mb-3">
                <div className="theme-value-wrap relative" style={{maxWidth:"100%"}}>
                  <label id="lblBackgroundColor" className="control-label">{Labels.Icon_Color} </label>
                  <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'BodyIconColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.BodyIconColor}></input>
                    </div>
                  <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                    <ColorPicker
                      color={campaign.BodyIconColor}
                      enableAlpha={false}
                      enableRGB={false}
                      onChange={(colors) => this.changeHandler(colors, 'BodyIconColor')}
                      onClose={(colors) => this.changeHandler(colors, 'BodyIconColor')}
                      placement="topRight"
                      className="some-class picker-color"

                    >
                      <span className="rc-color-picker-trigger ">
                        <span className="rc-color-picker-trigger custom-picker"></span>
                      </span>
                    </ColorPicker>
                    <AvField name="txtBodyIconColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.BodyIconColor} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="theme-list-b">
          <h3 className=" font-16 m-t-20 m-b-10">{Labels.Link_Color}</h3>
          <div className="row">

            <div className="col-md-12 theme-group-wrap">
              <div className="form-group mb-3">
                <div className="theme-value-wrap relative" style={{maxWidth:"100%"}}>
                  <label id="lblBackgroundColor" className="control-label">{Labels.link_Color} </label>
                  <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'BodyAColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.BodyAColor}></input>
                    </div>
                  <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                    <ColorPicker
                      color={campaign.BodyAColor}
                      enableAlpha={false}
                      enableRGB={false}
                      onChange={(colors) => this.changeHandler(colors, 'BodyAColor')}
                      onClose={(colors) => this.changeHandler(colors, 'BodyAColor')}
                      placement="topRight"
                      className="some-class picker-color"

                    >
                      <span className="rc-color-picker-trigger ">
                        <span className="rc-color-picker-trigger custom-picker"></span>
                      </span>
                    </ColorPicker>
                    <AvField name="txtBodyAColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.BodyAColor} />
                  </div>
                </div>

              </div>
              <div className="form-group mb-3">
              <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                <label id="lblTextColor" className="control-label"> {Labels.link_Hover_Color}
                </label>
                <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'BodyAColorHover')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.BodyAColorHover}></input>
                    </div>

                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                  <ColorPicker
                    color={campaign.BodyAColorHover}
                    enableAlpha={false}
                    onChange={(colors) => this.changeHandler(colors, 'BodyAColorHover')}
                    onClose={(colors) => this.changeHandler(colors, 'BodyAColorHover')}

                    placement="topRight"
                    className="some-class picker-color"
                  >
                    <span className="rc-color-picker-trigger ">
                      <span className="rc-color-picker-trigger custom-picker"></span>
                    </span>
                  </ColorPicker>
                  <AvField name="txtBodyAColorHover" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.BodyAColorHover} />
                </div>
                </div>
              </div>


            </div>

          </div>
        </div>
        <div className="theme-list-b">
          <h3 className=" font-16 m-t-20 m-b-10">{Labels.Default_Button}</h3>
          <div className="row">

            <div className="col-md-12 theme-group-wrap">
              <div className="form-group mb-3">
                <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                  <label id="lblBackgroundColor" className="control-label">{Labels.Default_Button_Bg_Color} </label>
                  <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'BodyDefaultBtnBgColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.BodyDefaultBtnBgColor}></input>
                    </div>
                  <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                    <ColorPicker
                      color={campaign.BodyDefaultBtnBgColor}
                      enableAlpha={false}
                      enableRGB={false}
                      onChange={(colors) => this.changeHandler(colors, 'BodyDefaultBtnBgColor')}
                      onClose={(colors) => this.changeHandler(colors, 'BodyDefaultBtnBgColor')}
                      placement="topRight"
                      className="some-class picker-color"

                    >
                      <span className="rc-color-picker-trigger ">
                        <span className="rc-color-picker-trigger custom-picker"></span>
                      </span>
                    </ColorPicker>
                    <AvField name="txtBodyDefaultBgColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.BodyDefaultBtnBgColor} />
                  </div>
                </div>

              </div>
              <div className="form-group mb-3">
              <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                <label id="lblTextColor" className="control-label">{Labels.Default_Button_Text_Color}</label>

                <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'BodyDefaultBtnColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.BodyDefaultBtnColor}></input>
                    </div>
                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                  <ColorPicker
                    color={campaign.BodyDefaultBtnColor}
                    enableAlpha={false}
                    onChange={(colors) => this.changeHandler(colors, 'BodyDefaultBtnColor')}
                    onClose={(colors) => this.changeHandler(colors, 'BodyDefaultBtnColor')}

                    placement="topRight"
                    className="some-class picker-color"
                  >
                    <span className="rc-color-picker-trigger ">
                      <span className="rc-color-picker-trigger custom-picker"></span>
                    </span>
                  </ColorPicker>
                  <AvField name="txtBodyDefaultColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.BodyDefaultBtnColor} />
                </div>
                </div>
              </div>
              <div className="form-group mb-3">
              <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                <label id="lblTextColor" className="control-label">{Labels.Default_Button_Hover_Bg_Color}
                </label>
                <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'BodyDefaultBtnBgColorHover')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.BodyDefaultBtnBgColorHover}></input>
                    </div>

                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                  <ColorPicker
                    color={campaign.BodyDefaultBtnBgColorHover}
                    enableAlpha={false}
                    onChange={(colors) => this.changeHandler(colors, 'BodyDefaultBtnBgColorHover')}
                    onClose={(colors) => this.changeHandler(colors, 'BodyDefaultBtnBgColorHover')}

                    placement="topRight"
                    className="some-class picker-color"
                  >
                    <span className="rc-color-picker-trigger ">
                      <span className="rc-color-picker-trigger custom-picker"></span>
                    </span>
                  </ColorPicker>
                  <AvField name="txtBodyDefaultBgColorHover" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.BodyDefaultBtnBgColorHover} />
                </div>
                </div>
              </div>
              <div className="form-group mb-3">
              <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                <label id="lblTextColor" className="control-label">{Labels.Default_Hover_Text_Color}
                </label>
                <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'BodyDefaultBtnColorHover')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.BodyDefaultBtnColorHover}></input>
                    </div>
                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                  <ColorPicker
                    color={campaign.BodyDefaultBtnColorHover}
                    enableAlpha={false}
                    onChange={(colors) => this.changeHandler(colors, 'BodyDefaultBtnColorHover')}
                    onClose={(colors) => this.changeHandler(colors, 'BodyDefaultBtnColorHover')}

                    placement="topRight"
                    className="some-class picker-color"
                  >
                    <span className="rc-color-picker-trigger ">
                      <span className="rc-color-picker-trigger custom-picker"></span>
                    </span>
                  </ColorPicker>
                  <AvField name="txtBodyDefaultColorHover" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.BodyDefaultBtnColorHover} />
                </div>
                </div>
              </div>


            </div>

          </div>
        </div>

        <div className="theme-list-b">
          <h3 className=" font-16 m-t-20 m-b-10">{Labels.Primary_Button} </h3>
          <div className="row">

            <div className="col-md-12 theme-group-wrap">
              <div className="form-group mb-3">
                <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                  <label id="lblBackgroundColor" className="control-label">{Labels.Primary_Button_Bg_Color} </label>
                  <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'BodyPrimaryBtnBgColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.BodyPrimaryBtnBgColor}></input>
                    </div>
                  <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                    <ColorPicker
                      color={campaign.BodyPrimaryBtnBgColor}
                      enableAlpha={false}
                      enableRGB={false}
                      onChange={(colors) => this.changeHandler(colors, 'BodyPrimaryBtnBgColor')}
                      onClose={(colors) => this.changeHandler(colors, 'BodyPrimaryBtnBgColor')}
                      placement="topRight"
                      className="some-class picker-color"

                    >
                      <span className="rc-color-picker-trigger ">
                        <span className="rc-color-picker-trigger custom-picker"></span>
                      </span>
                    </ColorPicker>
                    <AvField name="txtBodyPrimaryBgColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.BodyPrimaryBtnBgColor} />
                  </div>
                </div>

              </div>
              <div className="form-group mb-3">
              <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                <label id="lblTextColor" className="control-label">{Labels.Primary_Button_Text_Color}</label>
                
                <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'BodyPrimaryBtnColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.BodyPrimaryBtnColor}></input>
                    </div>
                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                  <ColorPicker
                    color={campaign.BodyPrimaryBtnColor}
                    enableAlpha={false}
                    onChange={(colors) => this.changeHandler(colors, 'BodyPrimaryBtnColor')}
                    onClose={(colors) => this.changeHandler(colors, 'BodyPrimaryBtnColor')}

                    placement="topRight"
                    className="some-class picker-color"
                  >
                    <span className="rc-color-picker-trigger ">
                      <span className="rc-color-picker-trigger custom-picker"></span>
                    </span>
                  </ColorPicker>
                  <AvField name="txtBodyPrimaryColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.BodyPrimaryBtnColor} />
                </div>
                </div>
              </div>
              <div className="form-group mb-3">
              <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                <label id="lblTextColor" className="control-label">{Labels.Primary_Button_Hover_Bg_Color}
                </label>

                <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'BodyPrimaryBtnBgColorHover')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.BodyPrimaryBtnBgColorHover}></input>
                    </div>
                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                  <ColorPicker
                    color={campaign.BodyPrimaryBtnBgColorHover}
                    enableAlpha={false}
                    onChange={(colors) => this.changeHandler(colors, 'BodyPrimaryBtnBgColorHover')}
                    onClose={(colors) => this.changeHandler(colors, 'BodyPrimaryBtnBgColorHover')}

                    placement="topRight"
                    className="some-class picker-color"
                  >
                    <span className="rc-color-picker-trigger ">
                      <span className="rc-color-picker-trigger custom-picker"></span>
                    </span>
                  </ColorPicker>
                  <AvField name="txtBodyPrimaryBgColorHover" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.BodyPrimaryBtnBgColorHover} />
                </div>
                </div>
              </div>
              <div className="form-group mb-3">
              <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                <label id="lblTextColor" className="control-label">{Labels.Primary_Hover_Text_Color}
                </label>
                <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'BodyPrimaryBtnColorHover')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.BodyPrimaryBtnColorHover}></input>
                    </div>
                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                  <ColorPicker
                    color={campaign.BodyPrimaryBtnColorHover}
                    enableAlpha={false}
                    onChange={(colors) => this.changeHandler(colors, 'BodyPrimaryBtnColorHover')}
                    onClose={(colors) => this.changeHandler(colors, 'BodyPrimaryBtnColorHover')}

                    placement="topRight"
                    className="some-class picker-color"
                  >
                    <span className="rc-color-picker-trigger ">
                      <span className="rc-color-picker-trigger custom-picker"></span>
                    </span>
                  </ColorPicker>
                  <AvField name="txtBodyPrimaryColorHover" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.BodyPrimaryBtnColorHover} />
                </div>
                </div>
              </div>

            </div>



          </div>
        </div>
        <div className="theme-list-b">
          <h3 className=" font-16 m-t-20 m-b-10">{Labels.Secondary_Button} </h3>
          <div className="row">

            <div className="col-md-12 theme-group-wrap">

              <div className="form-group mb-3">
                <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                  <label id="lblBackgroundColor" className="control-label">{Labels.Secondary_Button_Bg_Color} </label>
                  <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'BodySuccussBtnBgColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.BodySuccussBtnBgColor}></input>
                    </div>
                  <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                    <ColorPicker
                      color={campaign.BodySuccussBtnBgColor}
                      enableAlpha={false}
                      enableRGB={false}
                      onChange={(colors) => this.changeHandler(colors, 'BodySuccussBtnBgColor')}
                      onClose={(colors) => this.changeHandler(colors, 'BodySuccussBtnBgColor')}
                      placement="topRight"
                      className="some-class picker-color"

                    >
                      <span className="rc-color-picker-trigger ">
                        <span className="rc-color-picker-trigger custom-picker"></span>
                      </span>
                    </ColorPicker>
                    <AvField name="txtBodySuccussBgColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.BodySuccussBtnBgColor} />
                  </div>
                </div>

              </div>
              <div className="form-group mb-3">
              <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                <label id="lblTextColor" className="control-label">{Labels.Secondary_Button_Text_Color}</label>

                <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'BodySuccussBtnColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.BodySuccussBtnColor}></input>
                    </div>
                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                  <ColorPicker
                    color={campaign.BodySuccussBtnColor}
                    enableAlpha={false}
                    onChange={(colors) => this.changeHandler(colors, 'BodySuccussBtnColor')}
                    onClose={(colors) => this.changeHandler(colors, 'BodySuccussBtnColor')}

                    placement="topRight"
                    className="some-class picker-color"
                  >
                    <span className="rc-color-picker-trigger ">
                      <span className="rc-color-picker-trigger custom-picker"></span>
                    </span>
                  </ColorPicker>
                  <AvField name="txtBodySuccussColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.BodySuccussBtnColor} />
                </div>
                </div>
              </div>
              <div className="form-group mb-3">
              <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                <label id="lblTextColor" className="control-label">{Labels.Secondary_Button_Hover_Bg_Color}
                </label>

                <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'BodySuccussBtnBgColorHover')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.BodySuccussBtnBgColorHover}></input>
                    </div>
                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                  <ColorPicker
                    color={campaign.BodySuccussBtnBgColorHover}
                    enableAlpha={false}
                    onChange={(colors) => this.changeHandler(colors, 'BodySuccussBtnBgColorHover')}
                    onClose={(colors) => this.changeHandler(colors, 'BodySuccussBtnBgColorHover')}

                    placement="topRight"
                    className="some-class picker-color"
                  >
                    <span className="rc-color-picker-trigger ">
                      <span className="rc-color-picker-trigger custom-picker"></span>
                    </span>
                  </ColorPicker>
                  <AvField name="txtBodySuccussBgColorHover" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.BodySuccussBtnBgColorHover} />
                </div>
                </div>
              </div>
              <div className="form-group mb-3">
              <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                <label id="lblTextColor" className="control-label">{Labels.Secondary_Button_Hover_Text_Color}
                </label>

                <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'BodySuccussBtnColorHover')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.BodySuccussBtnColorHover}></input>
                    </div>
                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                  <ColorPicker
                    color={campaign.BodySuccussBtnColorHover}
                    enableAlpha={false}
                    onChange={(colors) => this.changeHandler(colors, 'BodySuccussBtnColorHover')}
                    onClose={(colors) => this.changeHandler(colors, 'BodySuccussBtnColorHover')}

                    placement="topRight"
                    className="some-class picker-color"
                  >
                    <span className="rc-color-picker-trigger ">
                      <span className="rc-color-picker-trigger custom-picker"></span>
                    </span>
                  </ColorPicker>
                  <AvField name="txtBodySuccussColorHover" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.BodySuccussBtnColorHover} />
                </div>
                </div>
              </div>
            </div>



          </div>
        </div>
        <div className="theme-list-b">
          <h3 className=" font-16 m-t-20 m-b-10">{Labels.Scroll_Back_To_Top_Button} </h3>
          <div className="row">

            <div className="col-md-12 theme-group-wrap">

              <div className="form-group mb-3">
                <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                  <label id="lblBackgroundColor" className="control-label">{Labels.Back_To_Top_Button_Bg_Color} </label>
                  <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'BackTopBtnBgColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.BackTopBtnBgColor}></input>
                    </div>
                  <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                    <ColorPicker
                      color={campaign.BackTopBtnBgColor}
                      enableAlpha={false}
                      enableRGB={false}
                      onChange={(colors) => this.changeHandler(colors, 'BackTopBtnBgColor')}
                      onClose={(colors) => this.changeHandler(colors, 'BackTopBtnBgColor')}
                      placement="topRight"
                      className="some-class picker-color"

                    >
                      <span className="rc-color-picker-trigger ">
                        <span className="rc-color-picker-trigger custom-picker"></span>
                      </span>
                    </ColorPicker>
                    <AvField name="txtBackTopBtnBgColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.BackTopBtnBgColor} />
                  </div>
                </div>

              </div>
              <div className="form-group mb-3">
              <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                <label id="lblTextColor" className="control-label">{Labels.Back_To_Top_Button_Icon_Color}</label>
                
                <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'BackTopBtnBgColorIcon')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.BackTopBtnBgColorIcon}></input>
                    </div>
                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                  <ColorPicker
                    color={campaign.BackTopBtnBgColorIcon}
                    enableAlpha={false}
                    onChange={(colors) => this.changeHandler(colors, 'BackTopBtnBgColorIcon')}
                    onClose={(colors) => this.changeHandler(colors, 'BackTopBtnBgColorIcon')}

                    placement="topRight"
                    className="some-class picker-color"
                  >
                    <span className="rc-color-picker-trigger ">
                      <span className="rc-color-picker-trigger custom-picker"></span>
                    </span>
                  </ColorPicker>
                  <AvField name="txtBackTopBtnBgColorIcon" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.BackTopBtnBgColorIcon} />
                </div>
                </div>
              </div>
              <div className="form-group mb-3">
              <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                <label id="lblTextColor" className="control-label">{Labels.Back_To_Top_Button_Hover_Bg_Color}
                </label>
                <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'BackTopBtnBgColorHover')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.BackTopBtnBgColorHover}></input>
                    </div>
                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                  <ColorPicker
                    color={campaign.BackTopBtnBgColorHover}
                    enableAlpha={false}
                    onChange={(colors) => this.changeHandler(colors, 'BackTopBtnBgColorHover')}
                    onClose={(colors) => this.changeHandler(colors, 'BackTopBtnBgColorHover')}

                    placement="topRight"
                    className="some-class picker-color"
                  >
                    <span className="rc-color-picker-trigger ">
                      <span className="rc-color-picker-trigger custom-picker"></span>
                    </span>
                  </ColorPicker>
                  <AvField name="txtBackTopBtnBgColorHover" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.BackTopBtnBgColorHover} />
                </div>
                </div>
              </div>
              <div className="form-group mb-3">
              <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                <label id="lblTextColor" className="control-label">{Labels.Back_To_Top_Hover_Icon_Color}
                </label>
                <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'BackTopBtnBgColorIconHover')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.BackTopBtnBgColorIconHover}></input>
                    </div>

                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                  <ColorPicker
                    color={campaign.BackTopBtnBgColorIconHover}
                    enableAlpha={false}
                    onChange={(colors) => this.changeHandler(colors, 'BackTopBtnBgColorIconHover')}
                    onClose={(colors) => this.changeHandler(colors, 'BackTopBtnBgColorIconHover')}

                    placement="topRight"
                    className="some-class picker-color"
                  >
                    <span className="rc-color-picker-trigger ">
                      <span className="rc-color-picker-trigger custom-picker"></span>
                    </span>
                  </ColorPicker>
                  <AvField name="txtBackTopBtnBgColorIconHover" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.BackTopBtnBgColorIconHover} />
                </div>
                </div>
              </div>
            </div>



          </div>
        </div>
        <div className="theme-list-b">
          <h3 className=" font-16 m-t-20 m-b-10">{Labels.Slider_Button} </h3>
          <div className="row">

            <div className="col-md-12 theme-group-wrap">

              <div className="form-group mb-3">
                <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                  <label id="lblBackgroundColor" className="control-label">{Labels.Slider_Button_Bg_Color} </label>
                  <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'SliderbtnBgColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.SliderbtnBgColor}></input>
                    </div>
                  <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                    <ColorPicker
                      color={campaign.SliderbtnBgColor}
                      enableAlpha={false}
                      enableRGB={false}
                      onChange={(colors) => this.changeHandler(colors, 'SliderbtnBgColor')}
                      onClose={(colors) => this.changeHandler(colors, 'SliderbtnBgColor')}
                      placement="topRight"
                      className="some-class picker-color"

                    >
                      <span className="rc-color-picker-trigger ">
                        <span className="rc-color-picker-trigger custom-picker"></span>
                      </span>
                    </ColorPicker>
                    <AvField name="txtBodySuccussBgColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.SliderbtnBgColor} />
                  </div>
                </div>

              </div>
              <div className="form-group mb-3">
              <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                <label id="lblTextColor" className="control-label">{Labels.Slider_Button_Text_Color}</label>
                <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'SliderBtnColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.SliderBtnColor}></input>
                    </div>

                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                  <ColorPicker
                    color={campaign.SliderBtnColor}
                    enableAlpha={false}
                    onChange={(colors) => this.changeHandler(colors, 'SliderBtnColor')}
                    onClose={(colors) => this.changeHandler(colors, 'SliderBtnColor')}

                    placement="topRight"
                    className="some-class picker-color"
                  >
                    <span className="rc-color-picker-trigger ">
                      <span className="rc-color-picker-trigger custom-picker"></span>
                    </span>
                  </ColorPicker>
                  <AvField name="txtBodySuccussColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.SliderBtnColor} />
                </div>
                </div>
              </div>
              <div className="form-group mb-3">
              <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                <label id="lblTextColor" className="control-label">{Labels.Slider_Button_Hover_Bg_Color}
                </label>
                <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'SliderBtnBgColorHover')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.SliderBtnBgColorHover}></input>
                    </div>
                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                  <ColorPicker
                    color={campaign.SliderBtnBgColorHover}
                    enableAlpha={false}
                    onChange={(colors) => this.changeHandler(colors, 'SliderBtnBgColorHover')}
                    onClose={(colors) => this.changeHandler(colors, 'SliderBtnBgColorHover')}

                    placement="topRight"
                    className="some-class picker-color"
                  >
                    <span className="rc-color-picker-trigger ">
                      <span className="rc-color-picker-trigger custom-picker"></span>
                    </span>
                  </ColorPicker>
                  <AvField name="txtBodySuccussBgColorHover" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.SliderBtnBgColorHover} />
                </div>
                </div>
              </div>
              <div className="form-group mb-3">
              <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                <label id="lblTextColor" className="control-label">{Labels.Slider_Button_Hover_Text_Color}
                </label>
                <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'SliderBtnColorHover')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.SliderBtnColorHover}></input>
                    </div>
                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                  <ColorPicker
                    color={campaign.SliderBtnColorHover}
                    enableAlpha={false}
                    onChange={(colors) => this.changeHandler(colors, 'SliderBtnColorHover')}
                    onClose={(colors) => this.changeHandler(colors, 'SliderBtnColorHover')}

                    placement="topRight"
                    className="some-class picker-color"
                  >
                    <span className="rc-color-picker-trigger ">
                      <span className="rc-color-picker-trigger custom-picker"></span>
                    </span>
                  </ColorPicker>
                  <AvField name="txtBodySuccussColorHover" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.SliderBtnColorHover} />
                </div>
                </div>
              </div>

              
            </div>

         
          </div>
        </div>
        <div className="theme-list-b">
          <h3 className=" font-16 m-t-20 m-b-10">{Labels.Slider_Background_And_Text}</h3>
          <div className="row">

            <div className="col-md-12 theme-group-wrap">

              <div className="form-group mb-3">
                <div className="theme-value-wrap relative" style={{maxWidth:"100%"}}>
                  <label id="lblBackgroundColor" className="control-label">{Labels.Bg_Color} </label>
                  <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'SliderBgColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.SliderBgColor}></input>
                    </div>
                  <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                    <ColorPicker
                      color={campaign.SliderBgColor}
                      enableAlpha={false}
                      enableRGB={false}
                      onChange={(colors) => this.changeHandler(colors, 'SliderBgColor')}
                      onClose={(colors) => this.changeHandler(colors, 'SliderBgColor')}
                      placement="topRight"
                      className="some-class picker-color"

                    >
                      <span className="rc-color-picker-trigger ">
                        <span className="rc-color-picker-trigger custom-picker"></span>
                      </span>
                    </ColorPicker>
                    <AvField name="txtBackTopBtnBgColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.SliderBgColor} />
                  </div>
                </div>

              </div>
              <div className="form-group mb-3">
              <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                <label id="lblTextColor" className="control-label">{Labels.Heading_Color}</label>
                
                <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'SliderHeadingColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.SliderHeadingColor}></input>
                    </div>
                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                  <ColorPicker
                    color={campaign.SliderHeadingColor}
                    enableAlpha={false}
                    onChange={(colors) => this.changeHandler(colors, 'SliderHeadingColor')}
                    onClose={(colors) => this.changeHandler(colors, 'SliderHeadingColor')}

                    placement="topRight"
                    className="some-class picker-color"
                  >
                    <span className="rc-color-picker-trigger ">
                      <span className="rc-color-picker-trigger custom-picker"></span>
                    </span>
                  </ColorPicker>
                  <AvField name="txtBackTopBtnBgColorIcon" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.SliderHeadingColor} />
                </div>
                </div>
              </div>
              <div className="form-group mb-3">
              <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                <label id="lblTextColor" className="control-label">{Labels.Text_Color}
                </label>
                <div>
                    <input onChange={(e) => this.changeHandler({color:e.target.value}, 'SliderPColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.SliderPColor}></input>
                    </div>
                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                  <ColorPicker
                    color={campaign.SliderPColor}
                    enableAlpha={false}
                    onChange={(colors) => this.changeHandler(colors, 'SliderPColor')}
                    onClose={(colors) => this.changeHandler(colors, 'SliderPColor')}

                    placement="topRight"
                    className="some-class picker-color"
                  >
                    <span className="rc-color-picker-trigger ">
                      <span className="rc-color-picker-trigger custom-picker"></span>
                    </span>
                  </ColorPicker>
                  <AvField name="txtBackTopBtnBgColorHover" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.SliderPColor} />
                </div>
                </div>
              </div>
             
            </div>



          </div>
        </div>
      </div>
    )

  }
  render() {
    return (
      <div>
        {this.bodyTheme(this.props.bodyTheme)}
      </div>
    )
  }
}