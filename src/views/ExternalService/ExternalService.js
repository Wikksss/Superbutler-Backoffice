import React, { Component } from 'react'
import MUIDataTable from "mui-datatables";
import * as ComplaintService from '../../service/Complaint'
import Constants from '../../helpers/Constants';
import * as Utilities from '../../helpers/Utilities'
import moment from 'moment';
import GlobalData from '../../helpers/GlobalData';
import Config from '../../helpers/Config';
import Loader from 'react-loader-spinner';
import Labels from '../../containers/language/labels';
import Dropdown from 'react-bootstrap/Dropdown';
import * as EnterpriseService from '../../service/Enterprise';
import * as ExternalService from '../../service/ExternalService';
import * as AuthService from '../../service/Auth';
import { FormGroup, Button, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
import {  Link } from 'react-router-dom';
import S3Browser from '../PhotoGallery/PhotoGallery'
import { EditorState, convertFromRaw, convertToRaw, Modifier, ContentState, convertFromHTML } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
var timeZone = '';
export default class   extends Component {


  loading = () => <div className="page-laoder page-laoder-menu">
    <div className="loader-menu-inner">
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
      <div className="loading-label">Loading.....</div>
    </div>
  </div>

  constructor(props) {
    super(props);
    this.state = {
      ImageGallery: false,
      ShowLoader: true,
      shouldRefresh: true,
      currentFolder: "",
      IsSave: false,
      isLogo: false,
      enterpriseTypeError: false,
      enterpriseTypeErrorMessage: "Please select business type",
      EnterpriseTypeId: 0,
      enterpriseTypeList: [],
      externalService: {},
      htmlEditorState: EditorState.createEmpty(),
    }

    // this.state.htmlEditorState = EditorState.createWithContent(
    //   ContentState.createFromBlockArray(
    //     convertFromHTML(this.state.externalService?.ShortDescription)
    //   )
    // );
  }

  ImageGalleryModal(isLogo) {

    if(!this.state.ImageGallery) 
      {
        this.GetSettings();
      } else 
      {
        sessionStorage.removeItem(Constants.CONFIG_SETTINGS);
      }
      setTimeout(() => {
        this.setState({
          ImageGallery: !this.state.ImageGallery,
          isLogo: isLogo,
        })
      }, 500);


  }
  
  toggleViewS3ImageModal = (image) => {
    this.setState({
      viewS3ImageModal: !this.state.viewS3ImageModal,
      btnShow: false,
      imageToOpen: image,
      currentFolder: image ? image.parentId : ""
    })
  }

  GetSettings = async () => {

    var data = await AuthService.GetSetting();

    if(data.length > 0)
    {
      console.log("data", data);
      sessionStorage.setItem(Constants.CONFIG_SETTINGS, data);
    }

  }

  SetSelectedMedia = (media) => {
    this.state.selectedMedia = media;
    console.log("media", media);
    this.state.Image = media.length > 0 ? media : null;
    var btnOk = document.getElementById("btnOk");

    if (btnOk) {
      if (media.length > 0) {
        btnOk.style.display = '';
      } else {
        btnOk.style.display = 'none';
      }
    }

  }

  UpdateSelectedImage = async () => {

    var media = this.state.selectedMedia;
    var externalService = this.state.externalService;
    var selectedPhoto = media.length > 0 ? `/${media[0].id.replace(Config.Setting.envConfiguration.ContentPath, "")}` : "";
    
    if(this.state.isLogo){
      externalService.Logo = selectedPhoto;
    } else {
      externalService.CoverPhoto = selectedPhoto;
    }

    console.log("ExternalService", externalService);
    this.setState({selectedMedia: [], Image: null, itemImage: false, externalService: externalService, ImageGallery: false});
    
  }

  ValidateFiles = (files) => {

    this.setState({ ignoredFiles: files });

  }
  RefreshS3Files = (shouldRefresh) => {

    if (!shouldRefresh) this.state.currentFolder = "";

    if (this.state.viewS3ImageModal)
      this.setState({ viewS3ImageModal: false })


    this.setState({ shouldRefresh: shouldRefresh })
  }
  
  SetEnterpriseType(typeId){
    let externalServie = this.state.externalService;
    externalServie.EnterpriseTypeID = typeId;
    this.setState({externalServie: externalServie, enterpriseTypeError: false})
}

  LoadEnterpriseTypeDropDown(){
        
    var htmlEnterpriseType = [];
    var enterpriseTypeList = this.state.enterpriseTypeList;
    if (enterpriseTypeList === null || enterpriseTypeList.length < 1) {
      return;
    }

    for (var i = 0; i < enterpriseTypeList.length; i++) {
        
      
        if ((enterpriseTypeList[i].ID != 5 && enterpriseTypeList[i].ID != 6))   {
            
            htmlEnterpriseType.push(this.RenderEnterpriseTypeDropDown(enterpriseTypeList[i]));
        }

    }

    return (
      <div className="input-group mb-3 form-group flex-column">
         <select  style={{minHeight:35}}
          className="form-control w-100 mb-2"
          onChange={(e) => this.SetEnterpriseType(Number(e.target.value))}
          value={this.state.externalService.EnterpriseTypeID }
        >
          <option value={'0'}>Select Type</option>
          {htmlEnterpriseType.map((Html) => Html)}
        </select>
        {
            this.state.enterpriseTypeError &&
            <span className='text-danger'>{this.state.enterpriseTypeErrorMessage}</span>
        }
      </div>
    );
   
  }

  RenderEnterpriseTypeDropDown(enterpriseType)
  {
      return <option key={enterpriseType.ID} value={enterpriseType.ID}>{enterpriseType.Name}</option>
   
    }

   GetExternalServiceAPI= async(externalServiceId) => {

    this.setState({ShowLoader: true});
    let externalService = await ExternalService.GetExternalService(externalServiceId);
    console.log("externalService", externalService);
    var shortDesc = EditorState.createWithContent(
      ContentState.createFromBlockArray(
        convertFromHTML(externalService?.ShortDescription)
      )
    );
    this.setState({
      externalService: Object.keys(externalService).length > 0 ? externalService : {},
      ShowLoader: false,
      htmlEditorState: shortDesc
  })

  }

   SaveUpdateExternalServiceAPI= async(externalService) => {

    let result = await ExternalService.SaveUpdateExternalService(externalService);

    if (result.HasError) {

      Utilities.notify("Update failed." + result.ErrorCodeCsv, "e");
    }else {
      if(result.Dictionary.IsSaved){
        this.props.history.push(`/external-service/${result.Dictionary.NewID}`)
        Utilities.notify("Updated successfully.", "s");
      }
    }
    
    this.setState({IsSave:false});

  }


   SaveUpdateExternalService = (event, values) => {

    if (this.state.IsSave) return;
		this.setState({ IsSave: true })

    let externalServie = this.state.externalService;

    if(externalServie.EnterpriseTypeID == 0 || externalServie.EnterpriseTypeID == undefined)
    {
      this.setState({ IsSave: false, enterpriseTypeError: true})
      return;
    }

    externalServie.Name = Utilities.SpecialCharacterEncode(values.txtServiceName);
    externalServie.TargetURL = values.txtLink;
    externalServie.ShortDescription = this.checkAndReturnString(Utilities.convertNewLinetoHTMLTag(draftToHtml(convertToRaw((this.state.htmlEditorState.getCurrentContent())))))
    externalServie.EnterpriseId = Utilities.GetEnterpriseIDFromSession();
   
    this.SaveUpdateExternalServiceAPI(externalServie);
  }

  checkAndReturnString(desc) {
    // Remove HTML tags using a regular expression
    const cleanedInput = desc.replace(/<[^>]*>/g, '').trim();
    
    // If there's no non-whitespace content, return an empty string
    return cleanedInput ? desc : "";
  }
  


   GetEnterpriseTypes = async() => {
    let enterpriseTypes = await EnterpriseService.GetEnterpriseType();
    this.setState({
        enterpriseTypeList: enterpriseTypes != null ? enterpriseTypes : []
    })
}

  componentWillMount() {
    document.body.classList.add('hide-overflow-hidden');

  }

  componentDidMount() {

    var id = this.props.match.params.id;
    if(id != undefined){
      this.GetExternalServiceAPI(id);
    } else 
    {
      this.setState({ShowLoader: false})
    }

    // document.addEventListener('scroll', this.trackScrolling);
    this.GetEnterpriseTypes();
  
  }

  componentWillUnmount() {
    document.body.classList.remove('hide-overflow-hidden');
  }


  onEditorStateChange = (htmlEditorState) => {
    this.setState({
      htmlEditorState,
    }, () => {
      this.state.externalService.ShortDescription = Utilities.SpecialCharacterEncode(draftToHtml(convertToRaw(this.state.htmlEditorState.getCurrentContent())))
    });
  }

  render() {

    if(this.state.ShowLoader ){

      return this.loading();
  }
    const { externalService } = this.state;
    return (
      <div className='card' id='header'>
        <div className="d-flex align-items-center mb-2 p-l-r card-body tailwind-date-picker-main">
          <h3 className="card-title card-new-title ml-0 mb-0 pl-0">External Service</h3>
       

        </div>

        <div class="card-body modal-media-main external-service-wrap" style={{maxWidth:600}}>
        <AvForm onValidSubmit = {this.SaveUpdateExternalService}>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label id="lblServiceName" className="control-label">Service Name
                      </label>
                      <AvField errorMessage="This is a required field" name="txtServiceName" type="text" className="form-control" value={Utilities.SpecialCharacterDecode(externalService.Name)}
                        validate={{
                          required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label id="lblLink" className="control-label">Add Service Link
                      </label>
                      <AvField errorMessage="This is a required field" name="txtLink" type="text" className="form-control" value={externalService.TargetURL}
                        validate={{
                          required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                        }}

                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <div className="form-group">

                    <label className="color-7 font-weight-normal">{Labels.Business_Type}</label>
                                   
                                   {this.state.enterpriseTypeList.length > 0 &&  this.LoadEnterpriseTypeDropDown()}

                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label id="lblShortDesc" className="control-label">Short Description
                      </label>
                      {/* <AvField style={{minHeight:120}} name="txtShortDesc" type="textarea" className="form-control" value={Utilities.SpecialCharacterDecode(externalService.ShortDescription)}
                      /> */}
                       <div class="form-group" style={{ flex: "1" }}>
                          <Editor className="Border-outline "
                            editorState={this.state.htmlEditorState}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            value={externalService.ShortDescription}
                            onEditorStateChange={this.onEditorStateChange}
                            id="desc"
                          />
                        </div>
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label id="firstName" className="control-label mb-0">Add Logo
                      </label>
                      <p>Upload a 1:1 PNG/JPG file which is not larger than 1 MB in size.</p>
                     
                      {externalService.Logo != undefined && externalService.Logo != "" ?

                    <div className='inner-logo-img'  onClick={() => this.ImageGalleryModal(true)}>
                                    
                    <img src={externalService.Logo != "" ? Utilities.generatePhotoLargeURL(`${decodeURIComponent(externalService.Logo)}`) : `https://cdn.superme.al/s/butler/images/000/001/000001045_download--5-.jfif`} />

                    </div>

                    :
                     
                      <div className='logo-image-wrap' onClick={() => this.ImageGalleryModal(true)}>
                        <div className='logo-inner text-center d-flex'>
                          <i className="fa fa-plus"></i>
                        </div>
                      </div>
                      
                      }
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label id="lblCoverPhoto" className="control-label mb-0">Add Cover Photo
                      </label>
                      <p>Upload a PNG/JPG file not more than 1 MB in size.</p>

                          {externalService.CoverPhoto != undefined && externalService.CoverPhoto != "" ?

                          <div className='inner-logo-img cvr-p'  onClick={() => this.ImageGalleryModal(false)}>
                      <img src={externalService.CoverPhoto != "" ? Utilities.generatePhotoLargeURL(`${decodeURIComponent(externalService.CoverPhoto)}`) : `https://cdn.superme.al/s/butler/images/000/001/000001045_download--5-.jfif`} />

                      </div>
                      :
                      
                      <div className='logo-image-wrap cvr-p' onClick={() => this.ImageGalleryModal(false)}>
                        <div className='logo-inner text-center d-flex'>
                          <i className="fa fa-plus"></i>
                        </div>
                      </div>
  }

                    </div>
                  </div>
                </div>
            
                <div className="bottomBtnsDiv" style={{ marginTop: 20, display:'flex', justifyContent:'flex-start', marginLeft:'20px' }}>

<Link style={{outline:"none"}} to="/businesses"> <Button type="button" color="secondary" style={{ marginRight: 10 }}>{Labels.Cancel}</Button> </Link>

<Button color="primary" style={{width:'76px'}} >
{this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
: <span className="comment-text">{Labels.Save}</span>}
</Button>
</div>
            </AvForm>
        </div>

        <Modal isOpen={this.state.ImageGallery} toggle={() => this.ImageGalleryModal()} style={{ maxWidth: "80%" }} className={this.props.className}>
            <ModalHeader toggle={() => this.ImageGalleryModal()} >Choose from media library</ModalHeader>
            <ModalBody className='scroll-media modal-media-wrap'>
            {this.state.ImageGallery &&
              <S3Browser toggleViewS3ImageModal={this.toggleViewS3ImageModal} setSelectedMedia={this.SetSelectedMedia} ignoredFilesBySize={this.ValidateFiles} shouldRefresh={this.state.shouldRefresh} RefreshS3Files={this.RefreshS3Files} currentFolder={this.state.currentFolder} />
            }
            </ModalBody>
            <FormGroup className="modal-footer" >
              <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger"></label>
              </div>
              <div>
                <Button className='mr-2 text-dark' color="secondary" onClick={() => this.ImageGalleryModal()}>Cancel</Button>
                <Button onClick={(e) => this.UpdateSelectedImage()} color="primary" id="btnOk" style={{display: "none", width:'76px'}}>
                  {/* <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>   */}
                  <span className="comment-text">{Labels.Done}</span>
                </Button>
              </div>
            </FormGroup>
          </Modal>
    
      </div>
    )
  }
}
