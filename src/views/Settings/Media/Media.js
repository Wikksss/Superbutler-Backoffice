import React, { Component, Fragment } from 'react';
import { Button, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Cropper from 'react-easy-crop';
import Slider from '@material-ui/core/Slider'
import * as EnterpriseSettingService from '../../../service/EnterpriseSetting';
import * as Utilities from '../../../helpers/Utilities';
import Constants from '../../../helpers/Constants';
//import Config from '../../../helpers/Config';
//import { Switch } from 'react-router-dom';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import getCroppedImg from '../../../helpers/CropImage'
import Loader from 'react-loader-spinner';
import Labels from '../../../containers/language/labels';

const PhotoGroupName = ["Restaurant", "RestaurantCoverPhoto", "Cover-Photo"];


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

class Media extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalLogo: false,
      modalSearchCover: false,
      modalMenuCover: false,
      EnterpriseSetting: {},

      PhotoName: null,
      CroppedAreaPixels: null,
      CroppedImage: null,

      LogoImage: null,
      LogoCrop: { x: 0, y: 0 },
      LogoZoom: 1,
      LogoAspect: 200 / 200,
      OldLogoImage: null,

      MenuCoverImage: null,
      MenuCoverCrop: { x: 0, y: 0 },
      MenuCoverZoom: 1,
      MenuCoverAspect: 1325 / 200,
      OldMenuCoverImage: null,

      SearchCoverImage: null,
      SearchCoverCrop: { x: 0, y: 0 },
      SearchCoverZoom: 1,
      SearchCoverAspect: 400 / 225,
      OldSearchCoverImage: null,

      HasEnterpriseUpdatePermission: false,
      IsSave:false,
      PhotoError:false
    };

    this.toggleLogoModal = this.toggleLogoModal.bind(this);
    this.toggleSearchCoverModal = this.toggleSearchCoverModal.bind(this);
    this.toggleMenuCoverModal = this.toggleMenuCoverModal.bind(this);
    this.SaveMediaSetting = this.SaveMediaSetting.bind(this);
  }


  //#region  api calling



  GetEnterpriseSetting = async () => {

    var data = await EnterpriseSettingService.Get();

    if (data.length !== 0) {
      //data.PhotoName = "";
      this.setState({ EnterpriseSetting: data, OldLogoImage: data.PhotoName, OldMenuCoverImage: data.CoverPhoto, OldSearchCoverImage: data.CoverPhotoName });

    }
  }


  SavePhotoApi = async (oldPhotoName, bitStream, photoName, groupName) => {

    let setting = EnterpriseSettingService.EnterpriseSettings;

    setting.OldPhotoName = oldPhotoName;
    setting.PhotoNameBitStream = bitStream;
    setting.PhotoGroupName = groupName;
    setting.PhotoName = photoName;

    let result = await EnterpriseSettingService.SavePhoto(setting);
    this.setState({IsSave:false})
    
    if (!result.HasError && result != undefined) {
            
      if (result.Dictionary.IsChangesSuccessful == true) {
                
         if(result.Dictionary.PhotoName){

      this.setState({
        modalLogo: false,
        modalSearchCover: false,
        modalMenuCover: false
      });

      this.GetEnterpriseSetting();
      return;
    }
    
  }
  }
  }


  SaveMediaSettingApi = async (enterpriseSetting) => {
    
    let message = await EnterpriseSettingService.SaveMediaSeting(enterpriseSetting)
    this.setState({IsSave:false})
    if (message === '1')
      Utilities.notify("Updated successfully.","s");
   
    else
      Utilities.notify("Update failed.","e");
     

  }

  SaveMediaSetting(event, values) {
    if(this.state.IsSave) return;
    this.setState({IsSave:true})
    let setting = EnterpriseSettingService.EnterpriseSettings;
    setting.FlickerGalleryID = values.txtFlickerGalleryId;
    setting.VideoUrl = values.txtVideoUrl;

    this.SaveMediaSettingApi(setting);

  }

  //#endregion


  onLogoCropChange = crop => {
    this.setState({ LogoCrop: crop })
  }

  onMenuCoverCropChange = crop => {
    this.setState({ MenuCoverCrop: crop })

  }

  onSearchCoverCropChange = crop => {
    this.setState({ SearchCoverCrop: crop })


  }


  onZoomChange(zoom, group) {

    switch (group) {

      case PhotoGroupName[0]:
        this.setState({ LogoZoom: zoom })
        break;

      case PhotoGroupName[1]:
        this.setState({ MenuCoverZoom: zoom })
        break;

      case PhotoGroupName[2]:
        this.setState({ SearchCoverZoom: zoom })
        break;
      default:
        break;
    }

  }

  onCropComplete = (croppedArea, croppedAreaPixels) => {
    
    this.setState({ CroppedAreaPixels: croppedAreaPixels })
  }

  onFileChange = async (e, group) => {

    if (e.target.files && e.target.files.length > 0) {
      this.setState({ PhotoName: e.target.files[0].name });
      const imageDataUrl = await readFile(e.target.files[0])

      switch (group) {

        case PhotoGroupName[0]:
          this.setState({
            LogoImage: imageDataUrl,
            LogoCrop: { x: 0, y: 0 },
            LogoZoom: 1,
          })

          break;

        case PhotoGroupName[1]:
          this.setState({
            MenuCoverImage: imageDataUrl,
            MenuCoverCrop: { x: 0, y: 0 },
            MenuCoverZoom: 1,
          })
          break;

        case PhotoGroupName[2]:
          this.setState({
            SearchCoverImage: imageDataUrl,
            SearchCoverCrop: { x: 0, y: 0 },
            SearchCoverZoom: 1,
          })
          break;
        default:
          break;

      }

    }
  }



  toggleLogoModal() {
    this.setState({
      modalLogo: !this.state.modalLogo,
      LogoImage: null,
      PhotoError: false
    });
  }

  toggleSearchCoverModal() {
    this.setState({
      modalSearchCover: !this.state.modalSearchCover,
      SearchCoverImage: null,
      PhotoError: false
    });
  }

  toggleMenuCoverModal() {
    this.setState({
      modalMenuCover: !this.state.modalMenuCover,
      MenuCoverImage: null,
      PhotoError: false
    });
  }


  SaveCroppedImage = async (group) => {

    if(this.state.IsSave) return;
    this.setState({IsSave:true})

    let croppedImage;

    switch (group) {

      case PhotoGroupName[0]:
        croppedImage = await getCroppedImg(
          this.state.LogoImage,
          this.state.CroppedAreaPixels
        )
        this.SavePhotoApi(this.state.OldLogoImage, croppedImage, this.state.PhotoName, "Restaurant")

        break;

      case PhotoGroupName[1]:
        croppedImage = await getCroppedImg(
          this.state.MenuCoverImage,
          this.state.CroppedAreaPixels
        )
        this.SavePhotoApi(this.state.OldMenuCoverImage, croppedImage, this.state.PhotoName, "RestaurantCoverPhoto")
        break;

      case PhotoGroupName[2]:

        croppedImage = await getCroppedImg(
          this.state.SearchCoverImage,
          this.state.CroppedAreaPixels
        )
        this.SavePhotoApi(this.state.OldSearchCoverImage, croppedImage, this.state.PhotoName, "Cover-Photo")
        break;

      default:
        break;

    }


  }


  componentDidMount() {


    if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      let  userObj= JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
      let UserRole = userObj.RoleLevel;
     
      let hasEnterpriseUpdatePermission = Utilities.HasPermission(userObj.RoleLevel, Constants.Permission.ENTERPRISE_RESTAURANT_UPDATE);
 
 
      this.setState({ HasEnterpriseUpdatePermission : hasEnterpriseUpdatePermission,}, () => {
 
      
 
      });
 
     }
 
    this.GetEnterpriseSetting();

  }

  getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result)
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {

    let setting = this.state.EnterpriseSetting;

    let photoName = Utilities.generatePhotoLargeURL(setting.PhotoName, true, false)
    let coverPhoto = Utilities.generatePhotoLargeURL(setting.CoverPhoto, true, true)
    let SearchCoverPhoto = Utilities.generatePhotoLargeURL(setting.CoverPhotoName, true, false)

    return (
      <div className="row" id="mediaPageWrap">

        <AvForm onValidSubmit={this.SaveMediaSetting}>
          <div className="col-lg-12">
            <div id="dvDisplayMessage">

            </div>

            <div className="card">
            <div className="card-new-title">
                  <h3 className="card-title">{Labels.Media}</h3>
                </div>
              <div className="card-body">
         
                <div className="media-wraper el-element-overlay	">
                  <div className="res-logo-wrap col-sm-4 margin-r-0"  onClick={ this.state.HasEnterpriseUpdatePermission ? this.toggleLogoModal : ''}>
                    {/* <h5>{Labels.Logo}</h5>
                    <p>{Labels.Two_Hundred_PNG}</p>
                    {this.state.EnterpriseSetting.PhotoName !== "" ?
                     <div>
                     <div className="box-wrap">
                        { this.state.HasEnterpriseUpdatePermission ?
                        <div className="media-image" style={{ backgroundImage: "url(" + photoName + ")"}}></div>
                        :
                        <div className="media-image" style={{ backgroundImage: "url(" + photoName + ")",  transform: "none" }}></div>
                        }
                        

              </div>
                                      {this.state.HasEnterpriseUpdatePermission ?

                                        <div className="image-edit btn btn-secondary" >
                                        <i className="fa fa-edit"></i>
                                        <span>{Labels.Edit}</span>
                                        </div>
                                                                : ''
                                                              }

</div>
                     
                      :
                      <div className="box-wrap" id="dvAddLogoImage">
                        <i className="fa fa-plus"></i>
                        <p>{Labels.Add_Logo}</p>

                      </div>
                    } */}

                  </div>
                  <div className=" res-search-photo-wrap col-sm-8 margin-r-0" onClick={this.state.HasEnterpriseUpdatePermission ? this.toggleSearchCoverModal : ''}>
                    <h5>{Labels.Search_Cover_Photo}</h5>
                    <p>{Labels.Four_Hundred_Two_Hundred_Twenty_Five_Jpg}</p>

                    {this.state.EnterpriseSetting.CoverPhotoName !== "" ?
                   <div>
                   <div className="box-wrap">
                      {this.state.HasEnterpriseUpdatePermission ? 
                        <div className="media-image" style={{ backgroundImage: "url(" + SearchCoverPhoto + ")" }}></div>
                        :
                        <div className="media-image" style={{ backgroundImage: "url(" + SearchCoverPhoto + ")",  transform: "none"  }}></div>
                      }


                     
                      </div>
                      {this.state.HasEnterpriseUpdatePermission ?
                       
                       <div className="image-edit btn btn-secondary" >
                     <i className="fa fa-edit"></i>
                     <span>{Labels.Edit}</span>
                   </div>
                

                 : '' }
                      </div>
                      :

                      <div className="box-wrap width100per" id="lnkAddSearchCoverImage">
                        <i className="fa fa-plus"></i>
                        <p>{Labels.Add_Search_Cover_Photo}</p>
                      </div>
                    }

                  </div>
                  <div className=" res-menu-photo-wrap col-sm-12 margin-r-0">

                    <div className="res-menu-photo-inner-wrap" onClick={this.state.HasEnterpriseUpdatePermission ? this.toggleMenuCoverModal : ''}>

                      <h5>{Labels.Menu_Cover_Photo}</h5>
                      <p>{Labels.Thirteen_Twentyfive_Two_Hundred}</p>


                      {this.state.EnterpriseSetting.CoverPhoto !== "" ?
                        <div className="menu-cover-wrap">
                        <div className="box-wrap">
                         
                         {this.state.HasEnterpriseUpdatePermission ?
                          <div className="media-image" style={{ backgroundImage: "url(" + coverPhoto + ")" }}></div>
                          :
                          <div className="media-image" style={{ backgroundImage: "url(" + coverPhoto + ")",  transform: "none"   }}></div>
                         }
                       
                        </div>
                        {this.state.HasEnterpriseUpdatePermission ?
                          
                         
                          <div className="image-edit btn btn-secondary" >
                               <i className="fa fa-edit"></i>
                               <span>Edit</span>
                             </div>
                          
                           : '' }
                        </div>
                        :
                        <div className="box-wrap" id="lnkAddMenuCoverimage" >
                          <i className="fa fa-plus"></i>
                          <p style={{maxWidth:"100%"}}>{Labels.Add_Menu_Cover_Photo}</p>
                        </div>
                      }

                    </div>


                    <div className="row">
                      <div className="col-xs-12 col-sm-12 m-t-20">
                        <div className="form-group">
                          <label><span className="help font-weight-500">{Labels.Add_Flicker_Gallery_ID}</span></label>

                          {/* <AvField errorMessage="This is a required field" name="productName" value=""  type="text" className="form-control" required  /> */}
                          <AvField name="txtFlickerGalleryId" value={setting.FlickerGallaryID} type="text" className="form-control" disabled={!this.state.HasEnterpriseUpdatePermission}/>
                          {/* <input ID="txtFlickerGalleryId"   className="form-control"></input> */}
                          {/* <AvForm>
                                                
                                                </AvForm> */}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xs-12 col-sm-12 m-t-20">
                        <div className="form-group">
                          <label><span className="help font-weight-500">{Labels.Video_URL}</span></label>
                          <AvField name="txtVideoUrl" value={setting.VideoUrl} type="text" className="form-control" disabled={!this.state.HasEnterpriseUpdatePermission} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xs-12 setting-cus-field m-b-20 m-t-20" style={{ float: 'right', marginTop: '20px'}}>
                {this.state.HasEnterpriseUpdatePermission ? <Button color="primary" style={{ marginRight: 15, width: '61px' }}
                >
                  {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                : <span className="comment-text">{Labels.Save}</span>}
                </Button> : ''}
                  {/* <Link to="/settings/media"><Button color="secondary" style={{ marginRight: 10 }}>Cancel</Button></Link> */}
                </div>

              </div>
            </div>
          </div>
          <Modal isOpen={this.state.modalLogo} toggle={this.toggleLogoModal} className={this.props.className}>
            <ModalHeader toggle={this.toggleLogoModal}>{Labels.Upload_Logo}</ModalHeader>
            <ModalBody>
              <div className="popup-web-body-wrap-new">
                <div className="file-upload-btn-wrap position-relative">
                  <div className="fileUpload">
                    <span>{Labels.Choose_File}</span>
                    <input type="file" accept="image/*" id="logoUpload" className="upload"
                      onChange={(e) => this.onFileChange(e, PhotoGroupName[0])} />
                  </div>
                </div>

                <div id="logo-upload-image" className="upload-image-wrap-new">
                  <div className="upload-dragdrop-wrap" id="logoDragImage">
                    <div>
                      <div className="dragdrop-icon-text-wrap">{Labels.PREVIEW_ONLY}</div>
                      <div className="dragdrop-icon-wrap">
                        <i className="fa fa-file-image-o" aria-hidden="true"></i>
                      </div>
                    </div>
                  </div>
                  <div className="crop-image-main-wrap ">

                    {this.state.LogoImage && <Fragment>
                      <div className="crop-container">
                        <Cropper
                          image={this.state.LogoImage}
                          crop={this.state.LogoCrop}
                          zoom={this.state.LogoZoom}
                          aspect={this.state.LogoAspect}
                          onCropChange={this.onLogoCropChange}
                          onCropComplete={this.onCropComplete}
                          onZoomChange={(e) => this.onZoomChange(e, PhotoGroupName[0])}
                        />
                      </div>
                      <div className="controls">
                        <Slider
                          value={this.state.LogoZoom}
                          min={1}
                          max={3}
                          step={0.1}
                          aria-labelledby="Zoom"
                          onChange={(e, zoom) => this.onZoomChange(zoom, PhotoGroupName[0])}
                        />
                      </div>
                    </Fragment>
                    }
                  </div>

                </div>
              </div>
            </ModalBody>
            <ModalFooter>

              <Button color="secondary" onClick={this.toggleLogoModal}>{Labels.Cancel}</Button>
              {this.state.LogoImage !== null && <Button color="primary" style={{ marginRight: 10 }} onClick={(e) => this.SaveCroppedImage(PhotoGroupName[0])}>
              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                             : <span className="comment-text">Save</span>}
              </Button>}
              {this.state.PhotoError ? <div className="error media-imgerror " style={{margin: 0}} >{Labels.Photo_Upload_Unsuccessful}</div> : ''} 
            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.modalSearchCover} toggle={this.toggleSearchCoverModal} className={this.props.className}>
            <ModalHeader toggle={this.toggleSearchCoverModal}>{Labels.Upload_Search_Cover_Photo}</ModalHeader>
            <ModalBody>
              <div className="popup-web-body-wrap-new">
                <div className="file-upload-btn-wrap position-relative">
                  <div className="fileUpload">
                    <span>{Labels.Choose_File}</span>
                    <input type="file" accept="image/*" id="logoUpload" className="upload"
                      onChange={(e) => this.onFileChange(e, PhotoGroupName[2])} />


                  </div>
                </div>

                <div id="logo-upload-image" className="upload-image-wrap-new">
                  <div className="upload-dragdrop-wrap" id="logoDragImage">
                    <div>
                      <div className="dragdrop-icon-text-wrap">{Labels.PREVIEW_ONLY}</div>
                      <div className="dragdrop-icon-wrap">
                        <i className="fa fa-file-image-o" aria-hidden="true"></i>
                      </div>
                    </div>
                  </div>

                  {this.state.SearchCoverImage && <Fragment>
                    <div className="crop-container">
                      <Cropper
                        image={this.state.SearchCoverImage}
                        crop={this.state.SearchCoverCrop}
                        zoom={this.state.SearchCoverZoom}
                        aspect={this.state.SearchCoverAspect}
                        onCropChange={this.onSearchCoverCropChange}
                        onCropComplete={this.onCropComplete}
                        onZoomChange={(e) => this.onZoomChange(e, PhotoGroupName[2])}
                      />
                    </div>
                    <div className="controls">
                      <Slider
                        value={this.state.SearchCoverZoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e, zoom) => this.onZoomChange(zoom, PhotoGroupName[2])}
                      />
                    </div>
                  </Fragment>
                  }

                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggleSearchCoverModal}>{Labels.Cancel}</Button>
              {this.state.SearchCoverImage !== null && <Button color="primary" style={{ marginRight: 10 }} onClick={(e) => this.SaveCroppedImage(PhotoGroupName[2])}>
              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                             : <span className="comment-text">Save</span>}
              </Button>}
              {this.state.PhotoError ? <div className="error media-imgerror" style={{margin: 0}} >{Labels.Photo_Upload_Unsuccessful}</div>: ''}
            </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.modalMenuCover} toggle={this.toggleMenuCoverModal} className={this.props.className}>
            <ModalHeader toggle={this.toggleMenuCoverModal}>{Labels.Upload_Menu_Cover_Photo}</ModalHeader>
            <ModalBody>
              <div className="popup-web-body-wrap-new" style={{ width: "100%" }}>
                <div className="file-upload-btn-wrap position-relative">
                  <div className="fileUpload">
                    <span>{Labels.Choose_File}</span>
                    <input type="file" accept="image/*" id="logoUpload" className="upload"
                      onChange={(e) => this.onFileChange(e, PhotoGroupName[1])} />
                  </div>
                </div>

                <div id="logo-upload-image" className="upload-image-wrap-new">
                  <div className="upload-dragdrop-wrap" id="logoDragImage">
                    <div>
                      <div className="dragdrop-icon-text-wrap">{Labels.PREVIEW_ONLY}</div>
                      <div className="dragdrop-icon-wrap">
                        <i className="fa fa-file-image-o" aria-hidden="true"></i>
                      </div>
                    </div>
                  </div>


                  {this.state.MenuCoverImage && <Fragment>
                    <div className="crop-container">
                      <Cropper
                        image={this.state.MenuCoverImage}
                        crop={this.state.MenuCoverCrop}
                        zoom={this.state.MenuCoverZoom}
                        aspect={this.state.MenuCoverAspect}
                        onCropChange={this.onMenuCoverCropChange}
                        onCropComplete={this.onCropComplete}
                        onZoomChange={(e) => this.onZoomChange(e, PhotoGroupName[1])}
                      />
                    </div>
                    <div className="controls">
                      <Slider
                        value={this.state.MenuCoverZoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e, zoom) => this.onZoomChange(zoom, PhotoGroupName[1])}
                      />
                    </div>
                  </Fragment>
                  }
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggleMenuCoverModal}>Cancel</Button>
              {this.state.MenuCoverImage !== null && <Button color="primary" style={{ marginRight: 10 }} onClick={(e) => this.SaveCroppedImage(PhotoGroupName[1])}>
              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                             : <span className="comment-text">{Labels.Save}</span>}
              </Button>}
              {this.state.PhotoError ? <div className="error media-imgerror" style={{margin: 0}} >{Labels.Photo_Upload_Unsuccessful}</div>: ''}


            </ModalFooter>
          </Modal>

        </AvForm>
      </div>
    );
  }
}

export default Media;
