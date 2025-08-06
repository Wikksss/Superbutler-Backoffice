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
import "react-datepicker/dist/react-datepicker.css";
import GlobalData from '../../../helpers/GlobalData'

import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import * as DefaultTheme from '../../../helpers/DefaultTheme';
import Labels from '../../../containers/language/labels';
export var updateHeader;
export default class HeaderSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultTheme: this.props.headerTheme,
            //savedDefaultTheme: JSON.stringify(this.props.headerTheme),
            visibleColorCheck: []

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
    toggleColorCheck = (control) => {
        try {
            let campaign = this.state.defaultTheme;
            let temp = this.state.visibleColorCheck;
            let obj = {
                name: control,
                value: true
            }
            let check = ''
            check = temp.filter(a => a.name == control)
            if (check != '') {
                let index = temp.findIndex(a => a.name == control)
                temp.splice(index, 1)
            }
            else {
                temp.push(obj)
            }
            let ar = '';
            ar = Object.keys(campaign).filter(a => a == control)
            // if (ar.length > 0) {
            //     campaign[ar[0]] = check != '' ? "transparent" : "#000000"
            // }
            if (ar.length > 0) {
                // campaign[ar[0]] = campaign[ar[0]] != 'transparent' ? "transparent" : JSON.parse(this.state.savedDefaultTheme)[ar[0]]
                campaign[ar[0]] = campaign[ar[0]] != 'transparent' ? "transparent" : "#000000"; //JSON.parse(this.state.savedDefaultTheme)[ar[0]]
            }
            this.setState({ defaultTheme: campaign })
            this.saveTheme(campaign)
            this.setState({
                visibleColorCheck: temp
            })
            this.props.reRenderComp();
        }
        catch (e) {
            console.log("toggleColorCheck Exception", e)
        }
    }
    colorchecked = (control) => {
        let temp = this.state.visibleColorCheck;
        let checked = temp.filter(a => a.name == control)
        return (
            <span className={(checked.length == 0) ? "colorPicker__hide" : "colorPicker__show"}
                onClick={() => this.toggleColorCheck(control)}
            >
                <span className={(this.state.defaultTheme[control]) == 'transparent'? "fa fa-eye-slash":  'fa fa-eye'}>
                { this.state.defaultTheme[control] == 'transparent'? <span className="rc-color-picker-trigger ban-icon"><i className="fa fa-ban" aria-hidden="true"></i></span> : '' }
                </span>
            </span>
        )
    }
    updateHeader = updateHeader = () => {
        this.setState({
            defaultTheme: this.props.headerTheme,
        })
    }

    saveTheme = (campaign) => {
        try {
            DefaultTheme.setheader(campaign)
        }
        catch (e) {
            console.log("saveTheme Exceptin", e)
        }
    }
    changeHandler(colors, control) {

        let campaign = this.state.defaultTheme;
        switch (control) {
            case "HeaderBgColor":
                campaign.HeaderBgColor = colors.color;
                break;

            case "HeaderIconColor":
                campaign.HeaderIconColor = colors.color;
                break;

            case "HeaderNavBgColor":
                campaign.HeaderNavBgColor = colors.color;
                break;
            case "HeaderNavColor":
                campaign.HeaderNavColor = colors.color;
                break;
            case "HeaderNavBgColorHover":
                campaign.HeaderNavBgColorHover = colors.color;
                break;
            case "HeaderNavColorActiveAndHover":
                campaign.HeaderNavColorActiveAndHover = colors.color;
                break;
            case "HeaderBasketBubbleBgColor":
                campaign.HeaderBasketBubbleBgColor = colors.color;
                break;
            case "HeaderBasketBubbleColor":
                campaign.HeaderBasketBubbleColor = colors.color;
                break;
            case "HeaderNotificationBubbleBgColor":
                campaign.HeaderNotificationBubbleBgColor = colors.color;
                break;
            case "HeaderNotificationBubbleColor":
                campaign.HeaderNotificationBubbleColor = colors.color;
                break;

            case "HeaderBtnBgColor":
                campaign.HeaderBtnBgColor = colors.color;
                break;
            case "HeaderBtnColor":
                campaign.HeaderBtnColor = colors.color;
                break;
            case "HeaderBtnBgColorHover":
                campaign.HeaderBtnBgColorHover = colors.color;
                break;
            case "HeaderBtnColorHover":
                campaign.HeaderBtnColorHover = colors.color;
                break;
            default:
                break;
        }
        this.setState({ defaultTheme: campaign })
        this.saveTheme(campaign)
        this.props.reRenderComp()


    }

    headerTheme(campaign) {

        if (campaign === null) {
            return (<div></div>)
        }
        return (
            <AvForm onValidSubmit={this.SaveCampaign}>

                <div className="form-body">
                    <div className="formPadding">

                        {this.renderheaderTheme(campaign)}

                    </div>

                </div>
            </AvForm>
        )

    }

    renderheaderTheme(campaign) {
        if (campaign === null) {
            return <div></div>
        }

        return (
            <div className="theme-list-m-wrap new-t">
                <div className="theme-list-b">
                    <h3 className=" font-16 m-t-20 m-b-10">{Labels.Background_And_Icons}</h3>
                    <div className="row">

                        <div className="col-md-12 theme-group-wrap">
                            <div className="form-group mb-3">
                                <div className="theme-value-wrap relative" style={{maxWidth:"100%"}}>
                                    <label id="lblBackgroundColor" className="control-label">{Labels.Bg_Color} </label>
                                    <div>
                                             <input onChange={(e) => this.changeHandler({color:e.target.value}, 'HeaderBgColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.HeaderBgColor}></input>
                                             </div>
                                    <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                        {campaign.HeaderBgColor != "transparent" &&
                                            <ColorPicker
                                                color={campaign.HeaderBgColor}
                                                enableAlpha={false}
                                                enableRGB={false}
                                                onChange={(colors) => this.changeHandler(colors, 'HeaderBgColor')}
                                                onClose={(colors) => this.changeHandler(colors, 'HeaderBgColor')}
                                                placement="topRight"
                                                className="some-class picker-color"

                                            >
                                                <span className="rc-color-picker-trigger ">
                                                    <span className="rc-color-picker-trigger custom-picker"></span>
                                                </span>

                                            </ColorPicker>
                                        }
                                        {this.colorchecked('HeaderBgColor')}


                                        <AvField name="txtBackgroundColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.HeaderBgColor} />
                                    </div>
                                </div>

                            </div>

                            <div className="form-group mb-3">
                                <div className="theme-value-wrap relative" style={{maxWidth:"100%"}}>
                                    <label id="lblIconColor" className="control-label">{Labels.Icon_Color} </label>
                                    <div>
                                             <input onChange={(e) => this.changeHandler({color:e.target.value}, 'HeaderIconColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.HeaderIconColor}></input>
                                             </div>
                                    <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                        {campaign.HeaderIconColor != "transparent" &&
                                            <ColorPicker
                                                color={campaign.HeaderIconColor}
                                                enableAlpha={false}
                                                enableRGB={false}
                                                onChange={(color) => this.changeHandler(color, 'HeaderIconColor')}
                                                onClose={(color) => this.changeHandler(color, 'HeaderIconColor')}
                                                placement="topRight"
                                                className="some-class picker-color"

                                            >
                                                <span className="rc-color-picker-trigger ">
                                                    <span className="rc-color-picker-trigger custom-picker"></span>
                                                </span>
                                            </ColorPicker>
                                        }

                                        <AvField name="txtHeaderIconColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.HeaderIconColor} />
                                    </div>
                                </div>

                            </div>

                        </div>




                    </div>
                </div>
                <div className="theme-list-b">
                    <h3 className=" font-16 m-t-20 m-b-10">{Labels.Navigation_Links_Color}</h3>
                    <div className="row">

                        <div className="col-md-12 theme-group-wrap">
                            <div className="form-group mb-3">
                                <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                                    <label id="lblBackgroundColor" className="control-label">{Labels.Nav_Link_Bg_Color} </label>
                                    <div>
                                             <input onChange={(e) => this.changeHandler({color:e.target.value}, 'HeaderNavBgColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.HeaderNavBgColor}></input>
                                             </div>
                                    <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                        {campaign.HeaderNavBgColor != "transparent" &&
                                            <ColorPicker
                                                color={campaign.HeaderNavBgColor}
                                                enableAlpha={false}
                                                enableRGB={false}
                                                onChange={(colors) => this.changeHandler(colors, 'HeaderNavBgColor')}
                                                onClose={(colors) => this.changeHandler(colors, 'HeaderNavBgColor')}
                                                placement="topRight"
                                                className="some-class picker-color"

                                            >
                                                <span className="rc-color-picker-trigger ">
                                                    <span className="rc-color-picker-trigger custom-picker"></span>
                                                </span>
                                            </ColorPicker>
                                        }
                                        {this.colorchecked('HeaderNavBgColor')}
                                        <AvField name="txtHeaderNavBgColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.HeaderNavBgColor} />
                                    </div>
                                </div>

                            </div>
                            <div className="form-group mb-3">
                            <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                                <label id="lblTextColor" className="control-label">{Labels.Nav_Link_Text_Color} </label>
                                <div>
                                             <input onChange={(e) => this.changeHandler({color:e.target.value}, 'HeaderNavColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.HeaderNavColor}></input>
                                             </div>
                                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                    <ColorPicker
                                        color={campaign.HeaderNavColor}
                                        enableAlpha={false}
                                        onChange={(colors) => this.changeHandler(colors, 'HeaderNavColor')}
                                        onClose={(colors) => this.changeHandler(colors, 'HeaderNavColor')}

                                        placement="topRight"
                                        className="some-class picker-color"
                                    >
                                        <span className="rc-color-picker-trigger ">
                                            <span className="rc-color-picker-trigger custom-picker"></span>
                                        </span>
                                    </ColorPicker>
                                    <AvField name="txtHeaderNavColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.HeaderNavColor} />
                                </div>
                                </div>         
                            </div>
                            <div className="form-group mb-3">
                            <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                                <label id="lblTextColor" className="control-label">{Labels.Nav_Link_Hover_Bg_color}
                                </label>          
                                    <div>
                                        <input onChange={(e) => this.changeHandler({ color: e.target.value }, 'HeaderNavBgColorHover')} style={{ paddingRight: "62px", minHeight: "38px" }} type='text' className='form-control' value={campaign.HeaderNavBgColorHover}></input>
                                    </div>

                                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                    {campaign.HeaderNavBgColorHover != "transparent" &&
                                        <ColorPicker
                                            color={campaign.HeaderNavBgColorHover}
                                            enableAlpha={false}
                                            onChange={(colors) => this.changeHandler(colors, 'HeaderNavBgColorHover')}
                                            onClose={(colors) => this.changeHandler(colors, 'HeaderNavBgColorHover')}

                                            placement="topRight"
                                            className="some-class picker-color"
                                        >
                                            <span className="rc-color-picker-trigger ">
                                                <span className="rc-color-picker-trigger custom-picker"></span>
                                            </span>
                                        </ColorPicker>
                                    }
                                    {this.colorchecked('HeaderNavBgColorHover')}
                                    <AvField name="txtHeaderNavBgColorHover" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.HeaderNavBgColorHover} />
                                </div>
                                </div>
                            </div>
                            <div className="form-group mb-3">
                            <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                                <label id="lblTextColor" className="control-label">{Labels.Nav_Link_Hover_Text_Color} </label>
                                <div>
                                             <input onChange={(e) => this.changeHandler({color:e.target.value}, 'HeaderNavColorActiveAndHover')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.HeaderNavColorActiveAndHover}></input>
                                             </div>
                                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                    <ColorPicker
                                        color={campaign.HeaderNavColorActiveAndHover}
                                        enableAlpha={false}
                                        onChange={(colors) => this.changeHandler(colors, 'HeaderNavColorActiveAndHover')}
                                        onClose={(colors) => this.changeHandler(colors, 'HeaderNavColorActiveAndHover')}

                                        placement="topRight"
                                        className="some-class picker-color"
                                    >
                                        <span className="rc-color-picker-trigger ">
                                            <span className="rc-color-picker-trigger custom-picker"></span>
                                        </span>
                                    </ColorPicker>
                                    <AvField name="txtHeaderNavColorActiveAndHover" type="text" className="border-0 form-control" value={Object.keys(campaign).length === 0 ? "" : campaign.HeaderNavColorActiveAndHover} />
                                </div>
                                    </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="theme-list-b">
                    <h3 className=" font-16 m-t-20 m-b-10">{Labels.Buttons}</h3>
                    <div className="row">

                        <div className="col-md-12 theme-group-wrap">
                            <div className="form-group mb-3">
                                <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                                    <label id="lblBackgroundColor" className="control-label">{Labels.Button_Bg_Color} </label>
                                    <div>
                                             <input onChange={(e) => this.changeHandler({color:e.target.value}, 'HeaderBtnBgColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.HeaderBtnBgColor}></input>
                                             </div>
                                    <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                        {campaign.HeaderBtnBgColor != "transparent" &&
                                            <ColorPicker
                                                color={campaign.HeaderBtnBgColor}
                                                enableAlpha={false}
                                                enableRGB={false}
                                                onChange={(colors) => this.changeHandler(colors, 'HeaderBtnBgColor')}
                                                onClose={(colors) => this.changeHandler(colors, 'HeaderBtnBgColor')}
                                                placement="topRight"
                                                className="some-class picker-color"

                                            >
                                                <span className="rc-color-picker-trigger ">
                                                    <span className="rc-color-picker-trigger custom-picker"></span>
                                                </span>
                                            </ColorPicker>
                                        }
                                        {this.colorchecked('HeaderBtnBgColor')}
                                        <AvField name="txtHeaderBtnBgColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.HeaderBtnBgColor} />
                                    </div>
                                </div>

                            </div>
                            <div className="form-group mb-3">
                            <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                                <label id="lblTextColor" className="control-label">{Labels.Button_Text_Color}</label>
                                <div>
                                             <input onChange={(e) => this.changeHandler({color:e.target.value}, 'HeaderBtnColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.HeaderBtnColor}></input>
                                             </div>
                                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                    <ColorPicker
                                        color={campaign.HeaderBtnColor}
                                        enableAlpha={false}
                                        onChange={(colors) => this.changeHandler(colors, 'HeaderBtnColor')}
                                        onClose={(colors) => this.changeHandler(colors, 'HeaderBtnColor')}

                                        placement="topRight"
                                        className="some-class picker-color"
                                    >
                                        <span className="rc-color-picker-trigger ">
                                            <span className="rc-color-picker-trigger custom-picker"></span>
                                        </span>
                                    </ColorPicker>
                                    <AvField name="txtHeaderBtnColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.HeaderBtnColor} />
                                </div>
                                        </div>
                            </div>
                            <div className="form-group mb-3">
                            <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                                <label id="lblTextColor" className="control-label">{Labels.Button_Hover_Bg_Color}
                          </label>
                          <div>
                                             <input onChange={(e) => this.changeHandler({color:e.target.value}, 'HeaderBtnBgColorHover')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.HeaderBtnBgColorHover}></input>
                                             </div>

                                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                    {campaign.HeaderBtnBgColorHover != "transparent" &&
                                        <ColorPicker
                                            color={campaign.HeaderBtnBgColorHover}
                                            enableAlpha={false}
                                            onChange={(colors) => this.changeHandler(colors, 'HeaderBtnBgColorHover')}
                                            onClose={(colors) => this.changeHandler(colors, 'HeaderBtnBgColorHover')}

                                            placement="topRight"
                                            className="some-class picker-color"
                                        >
                                            <span className="rc-color-picker-trigger ">
                                                <span className="rc-color-picker-trigger custom-picker"></span>
                                            </span>
                                        </ColorPicker>
                                    }
                                    {this.colorchecked('HeaderBtnBgColorHover')}
                                    <AvField name="txtHeaderBtnBgColorHover" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.HeaderBtnBgColorHover} />
                                </div>
                                    </div>
                            </div>
                            <div className="form-group mb-3">
                            <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                                <label id="lblTextColor" className="control-label">{Labels.Button_Hover_Text_Color}
                          </label>
                          <div>
                                             <input onChange={(e) => this.changeHandler({color:e.target.value}, 'HeaderBtnColorHover')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.HeaderBtnColorHover}></input>
                                             </div>

                                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                    <ColorPicker
                                        color={campaign.HeaderBtnColorHover}
                                        enableAlpha={false}
                                        onChange={(colors) => this.changeHandler(colors, 'HeaderBtnColorHover')}
                                        onClose={(colors) => this.changeHandler(colors, 'HeaderBtnColorHover')}

                                        placement="topRight"
                                        className="some-class picker-color"
                                    >
                                        <span className="rc-color-picker-trigger ">
                                            <span className="rc-color-picker-trigger custom-picker"></span>
                                        </span>
                                    </ColorPicker>
                                    <AvField name="txtHeaderBtnColorHover" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.HeaderBtnColorHover} />
                                </div>
                                    </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="theme-list-b">
                    <h3 className=" font-16 m-t-20 m-b-10">{Labels.Bubble_Icons} </h3>
                    <div className="row">

                        <div className="col-md-12 theme-group-wrap">
                            <div className="form-group mb-3">
                                <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                                    <label id="lblBackgroundColor" className="control-label">{Labels.Basket_Bubble_Bg_Color} </label>
                                    <div>
                                             <input onChange={(e) => this.changeHandler({color:e.target.value}, 'HeaderBasketBubbleBgColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.HeaderBasketBubbleBgColor}></input>
                                             </div>
                                    <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                        {campaign.HeaderBasketBubbleBgColor != "transparent" &&
                                            <ColorPicker
                                                color={campaign.HeaderBasketBubbleBgColor}
                                                enableAlpha={false}
                                                enableRGB={false}
                                                onChange={(colors) => this.changeHandler(colors, 'HeaderBasketBubbleBgColor')}
                                                onClose={(colors) => this.changeHandler(colors, 'HeaderBasketBubbleBgColor')}
                                                placement="topRight"
                                                className="some-class picker-color"

                                            >
                                                <span className="rc-color-picker-trigger ">
                                                    <span className="rc-color-picker-trigger custom-picker"></span>
                                                </span>
                                            </ColorPicker>
                                        }
                                        {this.colorchecked('HeaderBasketBubbleBgColor')}
                                        <AvField name="txtHeaderBasketBubbleBgColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.HeaderBasketBubbleBgColor} />
                                    </div>
                                </div>

                            </div>
                            <div className="form-group mb-3">
                            <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                                <label id="lblTextColor" className="control-label">{Labels.Basket_Bubble_Text_Color}</label>
                                <div>
                                             <input onChange={(e) => this.changeHandler({color:e.target.value}, 'HeaderBasketBubbleColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.HeaderBasketBubbleColor}></input>
                                             </div>
                                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                    <ColorPicker
                                        color={campaign.HeaderBasketBubbleColor}
                                        enableAlpha={false}
                                        onChange={(colors) => this.changeHandler(colors, 'HeaderBasketBubbleColor')}
                                        onClose={(colors) => this.changeHandler(colors, 'HeaderBasketBubbleColor')}

                                        placement="topRight"
                                        className="some-class picker-color"
                                    >
                                        <span className="rc-color-picker-trigger ">
                                            <span className="rc-color-picker-trigger custom-picker"></span>
                                        </span>
                                    </ColorPicker>
                                    <AvField name="txtHeaderBasketBubbleColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.HeaderBasketBubbleColor} />
                                </div>
                                </div>
                            </div>

                            <div className="form-group mb-3">
                                <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                                    <label id="lblBackgroundColor" className="control-label">{Labels.Notification_Bubble_Bg_Color} </label>
                                    <div>
                                             <input onChange={(e) => this.changeHandler({color:e.target.value}, 'HeaderNotificationBubbleBgColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.HeaderNotificationBubbleBgColor}></input>
                                             </div>
                                    <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                        {campaign.HeaderNotificationBubbleBgColor != "transparent" &&
                                            <ColorPicker
                                                color={campaign.HeaderNotificationBubbleBgColor}
                                                enableAlpha={false}
                                                enableRGB={false}
                                                onChange={(colors) => this.changeHandler(colors, 'HeaderNotificationBubbleBgColor')}
                                                onClose={(colors) => this.changeHandler(colors, 'HeaderNotificationBubbleBgColor')}
                                                placement="topRight"
                                                className="some-class picker-color"

                                            >
                                                <span className="rc-color-picker-trigger ">
                                                    <span className="rc-color-picker-trigger custom-picker"></span>
                                                </span>
                                            </ColorPicker>
                                        }
                                         {this.colorchecked('HeaderNotificationBubbleBgColor')}
                                        <AvField name="txtHeaderNotificationBubbleBgColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.HeaderNotificationBubbleBgColor} />
                                    </div>
                                </div>

                            </div>
                            <div className="form-group mb-3">
                            <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                                <label id="lblTextColor" className="control-label">{Labels.Notification_Bubble_Text_Color}</label>
                                <div>
                                             <input onChange={(e) => this.changeHandler({color:e.target.value}, 'HeaderNotificationBubbleColor')} style={{paddingRight:"62px", minHeight:"38px"}} type='text' className='form-control' value={campaign.HeaderNotificationBubbleColor}></input>
                                             </div>

                                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                    <ColorPicker
                                        color={campaign.HeaderNotificationBubbleColor}
                                        enableAlpha={false}
                                        onChange={(colors) => this.changeHandler(colors, 'HeaderNotificationBubbleColor')}
                                        onClose={(colors) => this.changeHandler(colors, 'HeaderNotificationBubbleColor')}

                                        placement="topRight"
                                        className="some-class picker-color"
                                    >
                                        <span className="rc-color-picker-trigger ">
                                            <span className="rc-color-picker-trigger custom-picker"></span>
                                        </span>
                                    </ColorPicker>
                                    <AvField name="txtHeaderNotificationBubbleColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.HeaderNotificationBubbleColor} />
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
                {this.headerTheme(this.state.defaultTheme)}
            </div>
        )
    }
}