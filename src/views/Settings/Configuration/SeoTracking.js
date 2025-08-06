import React, { Component, Fragment, useCallback, useState } from 'react';
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
import * as EnterpriseService from '../../../service/EnterpriseService';
import { useDropzone } from 'react-dropzone'
import arrayMove from 'array-move';
import AceEditor from "react-ace";
import { AiOutlineExclamation } from "react-icons/fi";
import Lables from '../../../containers/language/labels';
const $ = require('jquery');
const img = {
    display: 'block',
    width: 'auto',
    display: 'block',
    maxHeight: '100%',
    maxWidth: '100%',
    position: 'absolute',
    zIndex: '1',
    // width: '100%',
    // height: '100%'
};
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

  function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed())} ${sizes[i]}`
}

export function MyFavicon (props) {
    const [favicon, setNewFavicon] = useState({});
    const [faviconPath, setFaviconPath] = useState("");
    const [faviconBase64, setfaviconBase64] = useState('');
    const [faviconSize, setfaviconSize] = useState('');
   
    
    const { getRootProps, getInputProps, isDragActive } =  useDropzone({
        
        accept:'image/png',
        // multiple:true,
        
        onDrop: acceptedFiles => {
            acceptedFiles.map(async file => {
                props.faviconImageSizeDimensionValidationfalse()
                setNewFavicon(file)
                setFaviconPath(URL.createObjectURL(file))
                if ((file.size / 1048576) > 0.2) {
                    // formatBytes(file.size)
                    props.faviconImageSizeDimensionValidation(`${file.name} (${formatBytes(file.size)}) exceeds the file size limit of 200 KB `)
                    return;
                  }
            
                const imageBase64Url = await readFile(file)
                setfaviconBase64(imageBase64Url)
                setfaviconSize(imageBase64Url)
            });
        }
    })
   function onImgLoads ({ target: img }){
        const { offsetHeight, offsetWidth, naturalHeight, naturalWidth } = img;
        if((naturalHeight != naturalWidth)){
            setfaviconSize('')
            // formatBytes(favicon.size)
            props.faviconImageSizeDimensionValidation(`The image you have provided is not a 1:1 ratio. Please upload a 200x200 or 400x400 pixel image.`)
            return
        }
        setfaviconSize('')
        props.setImage(faviconBase64)
        props.disableButton()
      };
    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />

            <div className='favicon-logo-wrap w-64'>
                <div className='font-14  mb-1'>{Lables.Favicon}</div>
                <p className='mb-2 font-12'>Upload a 1:1 PNG file which is not larger than 200 KB in size.</p>
                {
                    (faviconPath != '' || (props.oldImageUrl != undefined && props.oldImageUrl !='')) ? 
                    <div>
                        <img  src={faviconPath != '' ? faviconPath : Utilities.generatePhotoURL(props.oldImageUrl)}  style={{ maxWidth:64}}/>
                        {
                            faviconSize !="" &&
                            <img onLoad={onImgLoads} src={faviconSize}  style={{opacity: 0}}/>
                        }
                    </div>
                    :
                    
                        <div className="media-image-wrap-display">
                            <div className="box-wrap text-center" id="lnkAddMenuCoverimage" >
                          <i className="fa fa-plus"></i>
                        </div>
                        </div>
                }
                
            </div>
            

        </div>
    )
}
export function MyOGgraph(props) {
    const [ogGraph, setNewogGraph] = useState({});
    const [Ogpath, setOgPath] = useState("");
    const [ogGraphError, setError] = useState(false);
    const [ogGraphErrorMessage, setErrorMessage] = useState('');
    const [ogGraphBase64, setogGraphBase64] = useState('');
    const [ogGraphSize, setogGraphSize] = useState('');
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept:'image/jpeg, image/png, image/jpg',
        multiple:false,
        onDrop: acceptedFiles => {
            acceptedFiles.map(async files => {
                props.OGImageSizeDimensionValidationfalse()
                setError(false)
                setNewogGraph(files)
                setOgPath(URL.createObjectURL(files))
                if ((files.size/1048576) > 0.2) {
                    setError(true)
                    setErrorMessage(`${files.name} (${formatBytes(files.size)}) exceeds the file size limit of 200 MB `)
                    props.OGImageSizeDimensionValidation()
                    return;
                  }
                  const imageBase64Url = await readFile(files)
                  setogGraphBase64(imageBase64Url)
                  setogGraphSize(imageBase64Url)
            });
            
          
        }
    })
    function onImgLoad ({ target: img }){
        const { offsetHeight, offsetWidth, naturalHeight, naturalWidth } = img;
        if((naturalHeight != naturalWidth )){
            setogGraphSize('')
            setError(true)
            setErrorMessage(`The image you have provided is not a 1:1 ratio. Please upload a 200x200 or 400x400 pixel image.`)
            props.OGImageSizeDimensionValidation()
            return
        }
        if(!ogGraphError){
            setogGraphSize('')
            props.setOGImage(ogGraphBase64)
            props.disableButton()
        }
      };
    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />

            <div className='favicon-logo-wrap-og'>
                <div className='font-14  mb-1'>{Lables.WebsiteImage}</div>
                <p className='mb-2 font-12'>Upload a 1:1 PNG/JPG file which is not larger than 2 MB in size.</p>
                
                {
                    (Ogpath != '' || (props.oldImageUrl !=undefined && props.oldImageUrl != '') )? 
                    
                   <div className='position-relative d-inline-flex justify-content-center align-items-center'> 
                    <img className='w-100 w-min-100' src={Ogpath != '' ? Ogpath : Utilities.generatePhotoURL(props.oldImageUrl)} style={{minWidth: 500}} />
                    {
                        ogGraphSize !="" &&
                        <img className='w-100 w-min-100' onLoad={onImgLoad} src={ogGraphSize} style={{opacity: 0}} />
                    }
                   {
                    ogGraphError &&
                    <>
                        < label id="name" class="control-label mt-2 p-2 rounded bg-danger font-12 overlay-error d-flex align-items-center"><i class="fa fa-exclamation-circle"></i> {ogGraphErrorMessage}</label>
                        <div class="overlay-website-img"></div>
                    </>
                   }
                    
                </div>
                   :
                        <div className="media-image-wrap-OGgraph" >
                            <div className="box-wrap text-center" id="lnkAddMenuCoverimage" >
                          <i className="fa fa-plus"></i>
                          <p>{Lables.AddOgGraph}</p>
                        </div>
                        </div>
                }
            </div>

        </div>
    )
}
export default class SeoTracking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageName: '',
            editorText: '',
            pageTitle: '',
            metaTitle: '',
            keyword: '',
            description: '',
            seoTracking: false,

            icon: DefaultTheme.SeoAndTrackingLinks.Icon,
            title: DefaultTheme.SeoAndTrackingLinks.Title,
            metaKeyword: DefaultTheme.SeoAndTrackingLinks.MetaKeywords,
            metaDescription: DefaultTheme.SeoAndTrackingLinks.MetaDescription,
            GATCode: DefaultTheme.SeoAndTrackingLinks.GatCode,
            GoogleSearchCode: DefaultTheme.SeoAndTrackingLinks.GoogleSearchConsoleCode,

            //New states
            seofields: {},
            disabled: true,
            OGOldImage: '',
            faviconOldImage: '',
            faviconError: false,
            faviconErrorMessage:'',
            OGError: false,
            OGErrorMessage:'',
            loader: true,
            focusField:''
        }
        this.getNavigationJson()
    }

    componentDidMount() {
        this.getSEOFields()
    }

    onEnter =(e)=>{
            if (e.which == 13) {
              e.target.blur();
            }
    }
    getNavigationJson = async () => {
        try {
            let EnterpriseId = localStorage.getItem(Constants.Session.ENTERPRISE_ID)
            let response = await EnterpriseSettingService.GetNavigationJson(EnterpriseId);
            if (!Utilities.stringIsEmpty(response)) {
                DefaultTheme.setNavigationheaderJson(response.header)
                DefaultTheme.setNavigationFooterJson(response.footer)
                if (response.socialAndApp != undefined && response.seoAndTracking != undefined) {
                    DefaultTheme.setSocialLinks(response.socialAndApp)
                    DefaultTheme.setSeoAndTrackingLinks(response.seoAndTracking)
                }
                this.setState({
                    icon: response.seoAndTracking.Icon,
                    title: response.seoAndTracking.Title,
                    metaKeyword: response.seoAndTracking.MetaKeywords,
                    metaDescription: response.seoAndTracking.MetaDescription,
                    GATCode: response.seoAndTracking.GatCode,
                    GoogleSearchCode: response.seoAndTracking.GoogleSearchConsoleCode
                })
            }
        }
        catch (e) {
            console.log("GetThemeSetting Exception", e.message)
        }
    }

    saveDetials = async () => {
        try {
            const { icon, title, metaKeyword, metaDescription, GATCode, GoogleSearchCode } = this.state
            let seoAndTrackingLinks = {
                Icon: icon,
                Title: title,
                MetaKeywords: metaKeyword,
                MetaDescription: metaDescription,
                GatCode: GATCode,
                GoogleSearchConsoleCode: GoogleSearchCode,
            }
           
            DefaultTheme.setSeoAndTrackingLinks(seoAndTrackingLinks)
            let theme = {}
            theme.header = DefaultTheme.NavigationheaderJson
            theme.footer = DefaultTheme.NavigationFooterJson;
            theme.socialAndApp = DefaultTheme.SocialLinks
            theme.seoAndTracking = DefaultTheme.SeoAndTrackingLinks
            let EnterpriseId = localStorage.getItem(Constants.Session.ENTERPRISE_ID)
            let response = await EnterpriseSettingService.UpdateNavigation(theme, EnterpriseId)
            if (response.IsSave) {
                this.getNavigationJson()
                Utilities.notify("Seo and trackings links updated successfully", "s");
            }

        }
        catch (e) {
            Utilities.notify("Seo and trackings links update failed.", "e");
            console.log("saveDetial Exception", e)
        }
    }

    toggleSeoTrackingModal() {
        this.setState({
            seoTracking: !this.state.seoTracking,
        })
    }



    getSEOFields = async () => {
        try {
            var data = await EnterpriseService.Get('2');
            if (data != undefined && data.Message == undefined) {
                var changeFieldData = []
                if (data.EnterpriseServiceValues.length == 0) {
                    data.ServiceKeys.forEach(v => {
                        var fields = {}
                        fields.Id = 0
                        fields.ServiceKeyId = v.Id
                        fields.EnterpriseId = Utilities.GetEnterpriseIDFromSession()
                        fields.Value = ""
                        fields.Key = v.Key
                        changeFieldData.push(fields)
                    });
                    data.SeoTracking = true
                    data.EnterpriseServiceValues = changeFieldData
                    this.setState({ seofields: data, loader: false })
                    return
                }
                data.SeoTracking = true
                var foundFaviconIndex = data.EnterpriseServiceValues.findIndex(x => x.Key == "Favicon")
                var foundOGIndex = data.EnterpriseServiceValues.findIndex(x => x.Key == "OGImage")
                if(foundFaviconIndex != -1){
                    const getFaviconindexImage = data.EnterpriseServiceValues[foundFaviconIndex].Value;
                    this.setState({ faviconOldImage: getFaviconindexImage })
                }
                if(foundOGIndex != -1){
                    const getOGindexImage = data.EnterpriseServiceValues[foundOGIndex].Value;
                    this.setState({ OGOldImage: getOGindexImage })
                }
                this.setState({ seofields: data, loader: false })
            }

        } catch (e) {
            console.log('Error in Configuration Email getEmailFields', e)
        }
    }


    editFields = (e, v) => {
        var foundIndex = this.state.seofields.EnterpriseServiceValues.findIndex(x => x.ServiceKeyId == v.Id)
        this.state.seofields.EnterpriseServiceValues[foundIndex].Value = Utilities.SpecialCharacterEncode(Utilities.removeExtraSpaces(e.target.value));
        this.setState({ disabled: false, OGError: false, faviconError: false })
       
    }
    fieldsValue = (v) => {
        var foundIndex = this.state.seofields.EnterpriseServiceValues.findIndex(x => x.ServiceKeyId == v.Id);
        return Utilities.SpecialCharacterDecode(this.state.seofields.EnterpriseServiceValues[foundIndex].Value)

    }

    handleFocusField = (value) => {
        this.state.focusField = value;
    }

    handleFocusOut = (value) => {

        if (this.state.focusField != value)
          this.saveDetail();
    
      }

    saveDetail = async () => {
        try {
            this.setState({ isSaving: true })
            // if((this.state.OGError || this.state.faviconError)) return this.setState({ isSaving: false, disabled: true })
           
            var data = undefined;//await EnterpriseService.Put(this.state.seofields);
           
            let message = '';
            if (data != undefined && data.Message == undefined) {
                this.setState({ isSaving: false, disabled: true })
                this.getSEOFields()
                message = `SEO setting updated successfully.`
                Utilities.notify(message, 's');
                return;
            }
            message = `${data.Message}.`
            Utilities.notify(message, 'e');
            this.setState({ isSaving: false })
        } catch (e) {
            console.log('Error in Configuration sms saveDetail', e)
            this.setState({ isSaving: false, disabled: true })
        }
    }

    setFaviconImage = (props) =>{
        var foundIndex = this.state.seofields.EnterpriseServiceValues.findIndex(x => x.Key == "Favicon")
        // if(foundIndex != -1){
            const getFaviconindexData = this.state.seofields.EnterpriseServiceValues[foundIndex];
            if(props !== undefined && props != '' && getFaviconindexData != undefined && getFaviconindexData.Value == ''){
                this.state.seofields.EnterpriseServiceValues[foundIndex].Value = '^' + props
                this.saveDetail()
                return;
            }else if(props !== undefined && props != '' && getFaviconindexData != undefined && props != undefined){
                this.state.seofields.EnterpriseServiceValues[foundIndex].Value = getFaviconindexData.Value + '^' + props
                this.saveDetail()
                return;
            }
        // }
        // var foundServiceIndex = this.state.seofields.ServiceKeys.findIndex(x => x.Key == "Favicon")
        // const getFaviconImageId = this.state.seofields.ServiceKeys[foundServiceIndex].Id;
        // var foundEnterpriseServiceIndex = this.state.seofields.EnterpriseServiceValues.findIndex(x => x.ServiceKeyId == getFaviconImageId)
        // this.state.seofields.EnterpriseServiceValues[foundEnterpriseServiceIndex].Value = '^' + props
    }
    setOGGraphImage = (props) =>{
        var foundIndex = this.state.seofields.EnterpriseServiceValues.findIndex(x => x.Key == "OGImage")
        // if(foundIndex != -1){
            const getOGImageindexData = this.state.seofields.EnterpriseServiceValues[foundIndex];
            if(props !== undefined && props != '' && getOGImageindexData != undefined && getOGImageindexData.Value == ''){
                this.state.seofields.EnterpriseServiceValues[foundIndex].Value = '^' + props
                this.saveDetail()
                return;
            }else if(props !== undefined && props != '' && getOGImageindexData != undefined && props != undefined){
                this.state.seofields.EnterpriseServiceValues[foundIndex].Value = getOGImageindexData.Value + '^' + props
                this.saveDetail()
                return;
            }

        // }
        // var foundServiceIndex = this.state.seofields.ServiceKeys.findIndex(x => x.Key == "OGImage")
        // const getOGImageId = this.state.seofields.ServiceKeys[foundServiceIndex].Id;
        // var foundEnterpriseServiceIndex = this.state.seofields.EnterpriseServiceValues.findIndex(x => x.ServiceKeyId == getOGImageId)
        // this.state.seofields.EnterpriseServiceValues[foundEnterpriseServiceIndex].Value = '^' + props
    }

    buttonState = () =>{
        this.setState({ disabled : false})
    }

    faviconImageSizeDimensionValidation = (message) =>{
        this.setState({ faviconError: true, faviconErrorMessage: message ? message : '', disabled: true })
    }
    OGImageSizeDimensionValidation = () =>{
        this.setState({ OGError: true, disabled: true })
    }
    faviconImageSizeDimensionValidationfalse = () =>{
        this.setState({ faviconError: false, faviconErrorMessage: '', disabled: false })
    }
    OGImageSizeDimensionValidationfalse = () =>{
        this.setState({ OGError: false, disabled: false })
    }
    
    render() {
   
        if(this.state.loader) {
            return(
                <div id="content-area" className="custom-loader">
                    <Loader type="Oval" color="#ff0000" height={50} width={50} />
                    <div className="loading-label">Loading.....</div>
                </div>
            )
        }   
        else{
            return (
                <div id="content-area" className=" p-l-15 p-r-15" >
                   {
                    Object.keys(this.state.seofields).length > 0 && this.state.seofields.ServiceLabels.length > 0 ?
                    <>
                    <div className="continer ">
                        {/* <div className='d-flex align-items-center justify-content-end mt-4'>
                            <button onClick={() => this.toggleSeoTrackingModal()} className="btn btn-primary">Add Search Engine </button>
                        </div> */}
                        <div className='d-flex mt-2 row'>
                            <div className=' col-md-12 col-sm-12 col-lg-6'>
                                <MyOGgraph 
                                    setOGImage={(v)=>this.setOGGraphImage(v)} 
                                    enterpriseData={this.state.seofields} 
                                    OGImageSizeDimensionValidation={()=>this.OGImageSizeDimensionValidation()} 
                                    OGImageSizeDimensionValidationfalse={()=>this.OGImageSizeDimensionValidationfalse()}  
                                    disableButton={()=>this.buttonState()} 
                                    oldImageUrl={this.state.OGOldImage} 
                                    />
                                {
                                    this.state.OGError &&
                                    <label id="name" class="control-label mt-2 text-danger">{this.state.OGErrorMessage}</label>
                                }
                                
                            </div>
                            <div className=' col-md-12 col-sm-12 col-lg-6'>
                                <MyFavicon 
                                    setImage={(v)=>this.setFaviconImage(v)} 
                                    enterpriseData={this.state.seofields} 
                                    faviconImageSizeDimensionValidation={(v)=>this.faviconImageSizeDimensionValidation(v)} 
                                    faviconImageSizeDimensionValidationfalse={()=>this.faviconImageSizeDimensionValidationfalse()} 
                                    disableButton={()=>this.buttonState()} 
                                    oldImageUrl={this.state.faviconOldImage}
                                    // onChange={()=>this.onChange()}
                                />
                                {
                                    this.state.faviconError &&
                                    <label id="name" class="control-label mt-2 text-danger">{this.state.faviconErrorMessage}</label>
                                }
                                <div className='mt-1'>
                                    {/* <label id="name" class="control-label mt-2 ">Title</label> */}
                                    <div className="form-group mb-3">
                                                <AvForm>
                                                    <div className="form-body">
                                                    {
                                                            Object.keys(this.state.seofields).length > 0 && this.state.seofields.ServiceKeys.map((v, i) => (
                                                                v.Key == "MetaTitle" ?
                                                                <div>
                                                                    <label id="name" class="control-label mt-3 ">{v.Label}</label>
                                                                    <AvField onChange={(e) => {
                                                                        if (e.target != undefined && e.target.value != undefined) {
                                                                            this.editFields(e, v)
                                                                            }
                                                                        }} onFocus={(e) => this.handleFocusField(e.target.value)} onBlur={(e) => this.handleFocusOut(e.target.value)} onKeyPress={(e)=>this.onEnter(e)} name="txtImageUrl" value={this.fieldsValue(v)} type="text" className="form-control flex-1"
                                                                    />
                                                                </div>
                                                                : 
                                                                (v.Key == "MetaDescription" || v.Key == "MetaKeywords") &&
                                                                <div>
                                                                    <label id="name" class="control-label mt-3 ">{v.Label}</label>
                                                                    <AvField onChange={(e) => {
                                                                        if (e.target != undefined && e.target.value != undefined) {
                                                                            this.editFields(e, v)
                                                                        }
                                                                        
                                                                    }} onFocus={(e) => this.handleFocusField(e.target.value)}  onBlur={(e) => this.handleFocusOut(e.target.value)} rows="4" name="txtImageUrl" value={this.fieldsValue(v)} type="textarea" class="form-control flex-1"/>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </AvForm>
                                            </div>
                                            {/* <textarea rows="4" name="txtImageUrl" type="TEXT" class="form-control flex-1">RayBan</textarea> */}
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-12 col-sm-12 ">
                               
    
                                <div className="form-group mb-3">
                                    <div style={{ marginTop: 10 }}>
                                        <div >
                                            <div className="form-group ">
                                                <AvForm>
                                                    <div className="form-body grid-display-wrap">
                                                        {
                                                            Object.keys(this.state.seofields).length > 0 && this.state.seofields.ServiceKeys.map((v, i) => (
                                                                (v.Key != "MetaTitle" && v.Key != "MetaDescription" && v.Key != "MetaKeywords" && v.Key != "Favicon" && v.Key != "OGImage") &&
                                                                <div key={i}>
                                                                    <label id="name" className="control-label mt-2">{v.Label}</label>
                                                                    <AvField type='textarea' rows={4} onChange={(e) => {
                                                                        if (e.target != undefined && e.target.value != undefined) {
                                                                            this.editFields(e, v)
                                                                        }
                                                                    }} onFocus={(e) => this.handleFocusField(e.target.value)} onBlur={(e) => this.handleFocusOut(e.target.value)} name="txtImageUrl" value={this.fieldsValue(v)} className="form-control flex-1"
                                                                    />
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </AvForm>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                           
    
    
                        </div>
    
    
                        <div className="col-xs-12 setting-cus-field m-b-20 ">
     
                           {/* <FormGroup>
                                <Button onClick={() => this.saveDetail()} disabled={this.state.disabled} color="primary" className="btn waves-effect waves-light btn-primary pull-left mt-2">
                                    {this.state.isSaving ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span> : <span className="comment-text">Save</span>}
                                </Button>
                            </FormGroup> */}
    
                            <div className="action-wrapper">
                            </div>
                        </div>
                    </div>
                    <Modal isOpen={this.state.seoTracking} toggle={() => this.toggleSeoTrackingModal()} className={this.props.className}>
                        <ModalHeader >Add Search Engine</ModalHeader>
                        <ModalBody></ModalBody>
                    </Modal>
                    </> 
                    :
                     <div class="d-flex  serv-unavailable badge-dark p-3 px-5">Service not available</div>
                   }
                </div>
            )
        }
    }
}