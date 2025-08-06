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
export var updateFooter;
export default class FooterSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
             defaultTheme: this.props.footerTheme
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

    updateFooter = updateFooter = () => {
        this.setState({
            defaultTheme: this.props.footerTheme,
        })
    }

    saveTheme = (campaign) => {
        try {
            ThemeSetting.setfooter(campaign)
        }
        catch (e) {
            console.log("saveTheme Exception", e)
        }
    }
    changeHandler(colors, control) {

        let campaign = this.state.defaultTheme;
        switch (control) {
            case "FooterBgColor":
                campaign.FooterBgColor = colors.color;
                break;

            case "FooterHeadingColor":
                campaign.FooterHeadingColor = colors.color;
                break;
            case "FooterPColor":
                campaign.FooterPColor = colors.color;
                break;
            case "FooterLinkColor":
                campaign.FooterLinkColor = colors.color;
                break;
            case "FooterLinkColorHover":
                campaign.FooterLinkColorHover = colors.color;
                break;
            case "FooterBtnBgColor":
                campaign.FooterBtnBgColor = colors.color;
                break;
            case "FooterBtnColor":
                campaign.FooterBtnColor = colors.color;
                break;
            case "FooterBtnBgColorHover":
                campaign.FooterBtnBgColorHover = colors.color;
                break;
            case "FooterBtnColorHover":
                campaign.FooterBtnColorHover = colors.color;
                break;
            case "FooterIconColor":
                campaign.FooterIconColor = colors.color;
                break;

            case "FooterIconColorHover":
                campaign.FooterIconColorHover = colors.color;
                break;


            default:
                break;
        }
        this.setState({ defaultTheme: campaign })
        this.saveTheme(campaign)

    }
    footerTheme(campaign) {

        if (campaign === null) {
            return (<div></div>)
        }
        return (
            <AvForm onValidSubmit={this.SaveCampaign}>

                <div className="form-body">
                    <div className="formPadding">

                        {this.renderFooterTheme(campaign)}

                    </div>

                </div>
            </AvForm>
        )

    }

    renderFooterTheme(campaign) {

        if (campaign === null) {
            return <div></div>
        }

        return (
            <div className="theme-list-m-wrap new-t">
                <div className="theme-list-b">
                    <h3 className=" font-16 m-t-20 m-b-10">{Labels.Background_And_Text}</h3>
                    <div className="row">

                        <div className="col-md-12 theme-group-wrap">
                            <div className="form-group mb-3">
                                <div className="theme-value-wrap relative" style={{maxWidth:"100%"}}>
                                    <label id="lblBackgroundColor" className="control-label">{Labels.Bg_Color} </label>
                                    <div>
                                        <input onChange={(e) => this.changeHandler({ color: e.target.value }, 'FooterBgColor')} style={{ paddingRight: "62px", minHeight: "38px" }} type='text' className='form-control' value={campaign.FooterBgColor}></input>
                                    </div>
                                    <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                        <ColorPicker
                                            color={campaign.FooterBgColor}
                                            enableAlpha={false}
                                            enableRGB={false}
                                            onChange={(colors) => this.changeHandler(colors, 'FooterBgColor')}
                                            onClose={(colors) => this.changeHandler(colors, 'FooterBgColor')}
                                            placement="topRight"
                                            className="some-class picker-color"

                                        >
                                            <span className="rc-color-picker-trigger ">
                                                <span className="rc-color-picker-trigger custom-picker"></span>
                                            </span>
                                        </ColorPicker>
                                        <AvField name="txtFooterBgColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.FooterBgColor} />
                                    </div>
                                </div>

                            </div>

                            <div className="form-group mb-3">
                                <div className="theme-value-wrap relative" style={{maxWidth:"100%"}}>
                                    <label id="lblBackgroundColor" className="control-label">{Labels.Text_Color} </label>
                                    <div>
                                        <input onChange={(e) => this.changeHandler({ color: e.target.value }, 'FooterPColor')} style={{ paddingRight: "62px", minHeight: "38px" }} type='text' className='form-control' value={campaign.FooterPColor}></input>
                                    </div>
                                    <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                        <ColorPicker
                                            color={campaign.FooterPColor}
                                            enableAlpha={false}
                                            enableRGB={false}
                                            onChange={(colors) => this.changeHandler(colors, 'FooterPColor')}
                                            onClose={(colors) => this.changeHandler(colors, 'FooterPColor')}
                                            placement="topRight"
                                            className="some-class picker-color"

                                        >
                                            <span className="rc-color-picker-trigger ">
                                                <span className="rc-color-picker-trigger custom-picker"></span>
                                            </span>
                                        </ColorPicker>
                                        <AvField name="txtFooterPColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.FooterPColor} />
                                    </div>
                                </div>

                            </div>
                            <div className="form-group mb-3">
                                <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                                    <label id="lblBackgroundColor" className="control-label">{Labels.Heading_Color} </label>
                                    <div>
                                        <input onChange={(e) => this.changeHandler({ color: e.target.value }, 'FooterHeadingColor')} style={{ paddingRight: "62px", minHeight: "38px" }} type='text' className='form-control' value={campaign.FooterHeadingColor}></input>
                                    </div>
                                    <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                        <ColorPicker
                                            color={campaign.FooterHeadingColor}
                                            enableAlpha={false}
                                            enableRGB={false}
                                            onChange={(colors) => this.changeHandler(colors, 'FooterHeadingColor')}
                                            onClose={(colors) => this.changeHandler(colors, 'FooterHeadingColor')}
                                            placement="topRight"
                                            className="some-class picker-color"

                                        >
                                            <span className="rc-color-picker-trigger ">
                                                <span className="rc-color-picker-trigger custom-picker"></span>
                                            </span>
                                        </ColorPicker>
                                        <AvField name="txtFooterHeadingColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.FooterHeadingColor} />
                                    </div>
                                </div>

                            </div>

                            {/* <div className="form-group mb-3">
                                <div className="theme-value-wrap">
                                    <label id="lblBackgroundColor" className="control-label">Heading border color </label>
                                    <div className="relative">
                                        <ColorPicker
                                            color={campaign.BackgroundColor}
                                            enableAlpha={false}
                                            enableRGB={false}
                                            onChange={(colors) => this.changeHandler(colors, 'C_B')}
                                            onClose={(colors) => this.changeHandler(colors, 'C_B')}
                                            placement="topRight"
                                            className="some-class picker-color"

                                        >
                                            <span className="rc-color-picker-trigger ">
                                                <span className="rc-color-picker-trigger custom-picker"></span>
                                            </span>
                                        </ColorPicker>
                                        <AvField name="txtBackgroundColor" type="text" className="form-control" value={Object.keys(campaign).length === 0 ? "" : campaign.BackgroundColor} />
                                    </div>
                                </div>

                            </div> */}

                        </div>




                    </div>
                </div>
                <div className="theme-list-b">
                    <h3 className=" font-16 m-t-20 m-b-10">{Labels.Links_Color}</h3>
                    <div className="row">

                        <div className="col-md-12 theme-group-wrap">
                            <div className="form-group mb-3">
                                <div className="theme-value-wrap relative" style={{maxWidth:"100%"}}>
                                    <label id="lblBackgroundColor" className="control-label">{Labels.link_Color} </label>
                                    <div>
                                        <input onChange={(e) => this.changeHandler({ color: e.target.value }, 'FooterLinkColor')} style={{ paddingRight: "62px", minHeight: "38px" }} type='text' className='form-control' value={campaign.FooterLinkColor}></input>
                                    </div>
                                    <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                        <ColorPicker
                                            color={campaign.FooterLinkColor}
                                            enableAlpha={false}
                                            enableRGB={false}
                                            onChange={(colors) => this.changeHandler(colors, 'FooterLinkColor')}
                                            onClose={(colors) => this.changeHandler(colors, 'FooterLinkColor')}
                                            placement="topRight"
                                            className="some-class picker-color"

                                        >
                                            <span className="rc-color-picker-trigger ">
                                                <span className="rc-color-picker-trigger custom-picker"></span>
                                            </span>
                                        </ColorPicker>
                                        <AvField name="txtFooterLinkColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.FooterLinkColor} />
                                    </div>
                                </div>

                            </div>
                            <div className="form-group mb-3">
                            <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                                <label id="lblTextColor" className="control-label"> {Labels.link_Hover_Color}
                                </label>
                                <div>
                                        <input onChange={(e) => this.changeHandler({ color: e.target.value }, 'FooterLinkColorHover')} style={{ paddingRight: "62px", minHeight: "38px" }} type='text' className='form-control' value={campaign.FooterLinkColorHover}></input>
                                    </div>

                                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                    <ColorPicker
                                        color={campaign.FooterLinkColorHover}
                                        enableAlpha={false}
                                        onChange={(colors) => this.changeHandler(colors, 'FooterLinkColorHover')}
                                        onClose={(colors) => this.changeHandler(colors, 'FooterLinkColorHover')}

                                        placement="topRight"
                                        className="some-class picker-color"
                                    >
                                        <span className="rc-color-picker-trigger ">
                                            <span className="rc-color-picker-trigger custom-picker"></span>
                                        </span>
                                    </ColorPicker>
                                    <AvField name="txtFooterLinkColorHover" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.FooterLinkColorHover} />
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
                                        <input onChange={(e) => this.changeHandler({ color: e.target.value }, 'FooterBtnBgColor')} style={{ paddingRight: "62px", minHeight: "38px" }} type='text' className='form-control' value={campaign.FooterBtnBgColor}></input>
                                    </div>
                                    <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                        <ColorPicker
                                            color={campaign.FooterBtnBgColor}
                                            enableAlpha={false}
                                            enableRGB={false}
                                            onChange={(colors) => this.changeHandler(colors, 'FooterBtnBgColor')}
                                            onClose={(colors) => this.changeHandler(colors, 'FooterBtnBgColor')}
                                            placement="topRight"
                                            className="some-class picker-color"

                                        >
                                            <span className="rc-color-picker-trigger ">
                                                <span className="rc-color-picker-trigger custom-picker"></span>
                                            </span>
                                        </ColorPicker>
                                        <AvField name="txtFooterBtnBgColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.FooterBtnBgColor} />
                                    </div>
                                </div>

                            </div>
                            <div className="form-group mb-3">
                            <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                                <label id="lblTextColor" className="control-label">{Labels.Button_Text_Color}</label>
                                <div>
                                        <input onChange={(e) => this.changeHandler({ color: e.target.value }, 'FooterBtnColor')} style={{ paddingRight: "62px", minHeight: "38px" }} type='text' className='form-control' value={campaign.FooterBtnColor}></input>
                                    </div>
                                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                    <ColorPicker
                                        color={campaign.FooterBtnColor}
                                        enableAlpha={false}
                                        onChange={(colors) => this.changeHandler(colors, 'FooterBtnColor')}
                                        onClose={(colors) => this.changeHandler(colors, 'FooterBtnColor')}

                                        placement="topRight"
                                        className="some-class picker-color"
                                    >
                                        <span className="rc-color-picker-trigger ">
                                            <span className="rc-color-picker-trigger custom-picker"></span>
                                        </span>
                                    </ColorPicker>
                                    <AvField name="txtFooterBtnColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.FooterBtnColor} />
                                </div>
                                </div>
                            </div>
                            <div className="form-group mb-3">
                            <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                                <label id="lblTextColor" className="control-label">{Labels.Button_Hover_Bg_Color}
                          </label>
                                    <div>
                                        <input onChange={(e) => this.changeHandler({ color: e.target.value }, 'FooterBtnBgColorHover')} style={{ paddingRight: "62px", minHeight: "38px" }} type='text' className='form-control' value={campaign.FooterBtnBgColorHover}></input>
                                    </div>
                                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                    <ColorPicker
                                        color={campaign.FooterBtnBgColorHover}
                                        enableAlpha={false}
                                        onChange={(colors) => this.changeHandler(colors, 'FooterBtnBgColorHover')}
                                        onClose={(colors) => this.changeHandler(colors, 'FooterBtnBgColorHover')}

                                        placement="topRight"
                                        className="some-class picker-color"
                                    >
                                        <span className="rc-color-picker-trigger ">
                                            <span className="rc-color-picker-trigger custom-picker"></span>
                                        </span>
                                    </ColorPicker>
                                    <AvField name="txtFooterBtnBgColorHover" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.FooterBtnBgColorHover} />
                                </div>
                                </div>
                            </div>
                            <div className="form-group mb-3">
                            <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                                <label id="lblTextColor" className="control-label">{Labels.Button_Hover_Text_Color}
                          </label>
                                    <div>
                                        <input onChange={(e) => this.changeHandler({ color: e.target.value }, 'FooterBtnColorHover')} style={{ paddingRight: "62px", minHeight: "38px" }} type='text' className='form-control' value={campaign.FooterBtnColorHover}></input>
                                    </div>
                                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                    <ColorPicker
                                        color={campaign.FooterBtnColorHover}
                                        enableAlpha={false}
                                        onChange={(colors) => this.changeHandler(colors, 'FooterBtnColorHover')}
                                        onClose={(colors) => this.changeHandler(colors, 'FooterBtnColorHover')}

                                        placement="topRight"
                                        className="some-class picker-color"
                                    >
                                        <span className="rc-color-picker-trigger ">
                                            <span className="rc-color-picker-trigger custom-picker"></span>
                                        </span>
                                    </ColorPicker>
                                    <AvField name="txtFooterBtnColorHover" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.FooterBtnColorHover} />
                                </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="theme-list-b">
                    <h3 className=" font-16 m-t-20 m-b-10">{Labels.Social_Icons} </h3>
                    <div className="row">

                        <div className="col-md-12 theme-group-wrap">
                            <div className="form-group mb-3">
                                <div className="theme-value-wrap relative" style={{maxWidth:"100%"}}>
                                    <label id="lblBackgroundColor" className="control-label">{Labels.Icon_Color} </label>
                                    <div>
                                        <input onChange={(e) => this.changeHandler({ color: e.target.value }, 'FooterIconColor')} style={{ paddingRight: "62px", minHeight: "38px" }} type='text' className='form-control' value={campaign.FooterIconColor}></input>
                                    </div>
                                    <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                        <ColorPicker
                                            color={campaign.FooterIconColor}
                                            enableAlpha={false}
                                            enableRGB={false}
                                            onChange={(colors) => this.changeHandler(colors, 'FooterIconColor')}
                                            onClose={(colors) => this.changeHandler(colors, 'FooterIconColor')}
                                            placement="topRight"
                                            className="some-class picker-color"

                                        >
                                            <span className="rc-color-picker-trigger ">
                                                <span className="rc-color-picker-trigger custom-picker"></span>
                                            </span>
                                        </ColorPicker>
                                        <AvField name="txtFooterIconColor" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.FooterIconColor} />
                                    </div>
                                </div>

                            </div>
                            <div className="form-group mb-3">
                            <div className="theme-value-wrap relative align-items-start" style={{maxWidth:"100%"}}>
                                <label id="lblTextColor" className="control-label">{Labels.Icon_Hover_Color}</label>
                                <div>
                                        <input onChange={(e) => this.changeHandler({ color: e.target.value }, 'FooterIconColorHover')} style={{ paddingRight: "62px", minHeight: "38px" }} type='text' className='form-control' value={campaign.FooterIconColorHover}></input>
                                    </div>
                                <div className="" style={{position:"absolute", right:"1px", top:"1px", width:"40px"}}>
                                    <ColorPicker
                                        color={campaign.FooterIconColorHover}
                                        enableAlpha={false}
                                        onChange={(colors) => this.changeHandler(colors, 'FooterIconColorHover')}
                                        onClose={(colors) => this.changeHandler(colors, 'FooterIconColorHover')}

                                        placement="topRight"
                                        className="some-class picker-color"
                                    >
                                        <span className="rc-color-picker-trigger ">
                                            <span className="rc-color-picker-trigger custom-picker"></span>
                                        </span>
                                    </ColorPicker>
                                    <AvField name="txtFooterIconColorHover" type="text" className="form-control border-0" value={Object.keys(campaign).length === 0 ? "" : campaign.FooterIconColorHover} />
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
                {this.footerTheme(this.state.defaultTheme)}
            </div>
        )
    }
}