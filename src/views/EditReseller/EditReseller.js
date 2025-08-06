import React, { Component,Fragment } from 'react';
import Avatar from 'react-avatar';
import Slider from '@material-ui/core/Slider'
import SweetAlert from 'sweetalert-react'; // eslint-disable-line import/no-extraneous-dependencies
import 'sweetalert/dist/sweetalert.css';
import { Link } from 'react-router-dom'
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader, Table, Alert } from 'reactstrap';
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
import Loader from 'react-loader-spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import Labels from '../../containers/language/labels';
import { useDropzone } from 'react-dropzone'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { FaUserTie } from "react-icons/fa";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { IoArrowBackOutline } from "react-icons/io5";
// import ImageUploader from '../Components/ImageUploader';
const $ = require('jquery');


const LogoHeader = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div {...getRootProps()} >
      <input {...getInputProps()} />
      {!isDragActive ? (
                   <div className='logo-header-n'>
                   <img src='https://cloud-supershoply.s3.eu-west-2.amazonaws.com/enterprise/10/images/TEM-logo-online-638107626633985856.png'/>
                   </div>
      ) : (
       <div className='box-wrap'>
        <div className='media-image-wrap-header'>
          <div className='box-wrap text-center'> 
          <i className="fa fa-plus"></i>
          <p>Add Logo Header</p>
          </div>
        </div>
        </div>

      )}
    </div>
  );
};
const LogoFooter = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div {...getRootProps()} >
      <input {...getInputProps()} />
      {!isDragActive ? (
                   <div className='logo-footer-n'>
                   <img src='https://cloud-supershoply.s3.eu-west-2.amazonaws.com/enterprise/10/images/10154205-10152407398329511-2268122556600735905-n-638079085940871204.png'/>
                   </div>
      ) : (
       <div className='box-wrap'>
        <div className='media-image-wrap-footer'>
          <div className='box-wrap text-center'> 
          <i className="fa fa-plus"></i>
          <p>Add Logo Header</p>
          </div>
        </div>
        </div>

      )}
    </div>
  );
};
const Favicon = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div {...getRootProps()} >
      <input {...getInputProps()} />
      {!isDragActive ? (
                   <div className='logo-favicon-n'>
                   <img src='https://cloud-supershoply.s3.eu-west-2.amazonaws.com/enterprise/10/images/10154205-10152407398329511-2268122556600735905-n-638079085940871204.png'/>
                   </div>
      ) : (
       <div className='box-wrap'>
        <div className='media-image-wrap-favicon'>
          <div className='box-wrap text-center'> 
          <i className="fa fa-plus"></i>
          
          </div>
        </div>
        </div>

      )}
    </div>
  );
};
const LogoWebsite = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div {...getRootProps()} >
      <input {...getInputProps()} />
      {!isDragActive ? (
                   <div className='logo-website-n'>
                   <img src='https://cloud-supershoply.s3.eu-west-2.amazonaws.com/enterprise/10/images/ogimage-638079914773213399.png'/>
                   </div>
      ) : (
       <div className='box-wrap'>
        <div className='media-image-wrap-website'>
          <div className='box-wrap text-center'> 
          <i className="fa fa-plus"></i>
          <p>Add OG graph</p>
          </div>
        </div>
        </div>

      )}
    </div>
  );
};
class EditReseller extends Component {

  //#region Constructor
  constructor(props) {
    super(props);
    this.state = {
      ResellerInfo: false,
      OwnerInfo: false,
      type:'password'
    };
    this.showHide = this.showHide.bind(this);
  }

  onDrop = acceptedFiles => {
    // Do something with the files
  };
  showHide(e) {
    // e.preventDefault();
    // e.stopPropagation();

    this.setState({
      type: this.state.type === 'password' ? 'text' : 'password'
    })
  }
  ResellerInfoModal() {
    this.setState({
      ResellerInfo: !this.state.ResellerInfo,
    })
}
OwnerInfoModal() {
    this.setState({
      OwnerInfo: !this.state.OwnerInfo,
    })
}
GoBack(){
    
  this.props.history.goBack();

}

  loading = () => <div className="page-laoder-users">
    <div className="loader-menu-inner">
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
      <div className="loading-label">Loading.....</div>
    </div>
  </div>

  //#region Event 


  componentDidMount() {

    // this.GetEnterpriseUsers();

  }
  componentWillUnmount() {

  }
  
  onDrop = acceptedFiles => {
    // Do something with the files
    console.log(acceptedFiles);
  };

  onDrop = acceptedFiles => {
    // Do something with the files
    console.log(acceptedFiles);
  };
  

  render() {
    return (
      <div className="card resellers-new-m-wrap" id="userDataWraper">
            {/* <ImageUploader/> */}
               <div className="card-new-title" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <div className='pr-3 cursor-pointer'  onClick={() => this.GoBack()}>
               <IoArrowBackOutline className='font-24'>  </IoArrowBackOutline>
               </div> 
               <h3 className="card-title" data-tip data-for='happyFace'>Edit Business
                                </h3>
              {/* <button className="btn btn-primary"><i className="fa fa-plus" aria-hidden="true"></i> {Labels.Add_Users}</button> */}
              {/* <span className="btn btn-primary" onClick={() => this.ResellerInfoModal()}><i className="fa fa-plus mr-2" aria-hidden="true"></i>Add new </span> */}
          
          </div>
        <div className="card-body mb-5 p-4" style={{boxShadow:"0 0 5px #00000030"}}>

        <div class="dropzone-main-wrap">
                    <div class="dropzone-left">
                      <div className='mb-1' style={{maxWidth:"350px"}}>
                      <h5>Logo Header</h5>
                      <p>Upload a PNG/JPG file not more than 1 MB in size.</p>
           
                    <LogoHeader onDrop={this.onDrop} />
                    </div>
                    </div>

                    <div class="dropzone-middle">
                    <div className='mb-1' style={{maxWidth:"350px"}}>
                      <h5>Logo Footer</h5>
                      <p>Upload a 1:1 PNG/JPG file which is not larger than 1 MB in size.</p>
           
                    <LogoFooter onDrop={this.onDrop} />
                    </div>
                    </div>
                    <div className='dropzone-right'>
                    <div className='mb-1' style={{maxWidth:"350px"}}>
                      <h5>Favicon</h5>
                      <p>Upload a 1:1 PNG file which is not larger than 200 KB in size.</p>
           
                    <Favicon onDrop={this.onDrop} />
                    </div>
                    </div>
                   
                </div>

                   <div class="dropzone-main-wrap website-wrap">
            <div class="dropzone-web">
              <div className='mb-1' >
                <h5>Website image</h5>
                <p>Upload a 1:1 PNG/JPG file which is not larger than 2 MB in size.</p>

                <LogoWebsite onDrop={this.onDrop} />
              </div>
            </div>
          </div> 

        </div>
        
        <div className="card-body mb-5 p-4" style={{ boxShadow: "0 0 5px #00000030" }}>
          <div className='calc-width'>
        <div class="d-flex align-items-baseline mb-4" >
          <h5>Reseller Info</h5>
          <a onClick={() => this.ResellerInfoModal()} class="ml-5 cursor-pointer text-primary"><i class="fa fa-edit mr-1"></i>Edit</a>
          </div>
          <div className='reseller-info-main-wrap'>
            <div className='mb-3 reseller-info-wrap'>
              <div className='info-label'>
                <label className="">Business Name</label>
              </div>
              <div className='info-value'>
                <span className="">Toyota Eastern Motors</span>
              </div>
            </div>
            <div className='mb-3 reseller-info-wrap'>
              <div className='info-label'>
                <label className="">Business Type</label>
              </div>
              <div className='info-value'>
                <span className="">Dealers & Distributors</span>
              </div>
            </div>
            <div className='mb-3 reseller-info-wrap'>
              <div className='info-label'>
                <label className="">Business Email</label>
              </div>
              <div className='info-value'>
                <span className="">parts@toyotaeastern.com</span>
              </div>
            </div>
            <div className='mb-3 reseller-info-wrap'>
              <div className='info-label'>
                <label className="">Business Mobile</label>
              </div>
              <div className='info-value'>
                <span className="">+923332622888</span>
              </div>
            </div>
            <div className='mb-3 reseller-info-wrap'>
              <div className='info-label'>
                <label className="">BusinessLandlines</label>
              </div>
              <div className='info-value'>
                <span className="">+92213481117477</span>
              </div>
            </div>
            <div className='mb-3 reseller-info-wrap'>
              <div className='info-label'>
                <label className="">Whatsapp numbers</label>
              </div>
              <div className='info-value'>
                <span className="">323232323232</span>
              </div>
            </div>
            {/* <div className='mb-3 reseller-info-wrap'>
              <div className='info-label'>
                <label className="">Country operated in?</label>
              </div>
              <div className='info-value'>
                <span className="">Pakistan</span>
              </div>
            </div> */}
            <div className='mb-3 reseller-info-wrap'>
              <div className='info-label'>
                <label className="">Short Description about your store</label>
              </div>
              <div className='info-value'>
                <span className="">Toyota Eastern Motors is Located at main Rashid Minhas Road, considered to be the future center of the Karachi city. It was the first major commercial venture in this locality. Soon, major developments began and now there is commercial activity all over.</span>
              </div>
            </div>
            <div className='mb-3 reseller-info-wrap'>
              <div className='info-label'>
                <label className="">Long Description</label>
              </div>
              <div className='info-value'>
                <span className="">Toyota Eastern Motors is Located at main Rashid Minhas Road, considered to be the future center of the Karachi city. It was the first major commercial venture in this locality. Soon, major developments began and now there is commercial activity all over.</span>
              </div>
            </div>
            {/* <div className='mb-3 reseller-info-wrap'>
              <div className='info-label'>
                <label className="">Promotional Message</label>
              </div>
              <div className='info-value'>
                <span className="">-</span>
              </div>
            </div> */}

          </div>
          </div>

        </div>

        <div className="card-body mb-5 p-4" style={{ boxShadow: "0 0 5px #00000030" }}>
          <div className='calc-width'>
        <div class="d-flex align-items-baseline mb-4" >
          <h5>Owner Info</h5>
          <a onClick={() => this.OwnerInfoModal()} class="ml-5 cursor-pointer text-primary"><i class="fa fa-edit mr-1"></i>Edit</a>
          </div>
          <div className='reseller-info-main-wrap'>
            <div className='mb-3 reseller-info-wrap'>
              <div className='info-label'>
                <label className="">First Name</label>
              </div>
              <div className='info-value'>
                <span className="">Syed Zafar</span>
              </div>
            </div>
            <div className='mb-3 reseller-info-wrap'>
              <div className='info-label'>
                <label className="">Surname</label>
              </div>
              <div className='info-value'>
                <span className="">Shah</span>
              </div>
            </div>
            <div className='mb-3 reseller-info-wrap'>
              <div className='info-label'>
                <label className="">Primary Email</label>
              </div>
              <div className='info-value'>
                <span className="">zafershah@gmail.com</span>
              </div>
            </div>
            <div className='mb-3 reseller-info-wrap'>
              <div className='info-label'>
                <label className="">Mobile1</label>
              </div>
              <div className='info-value'>
                <span className="">+923332622888</span>
              </div>
            </div>
            <div className='mb-3 reseller-info-wrap'>
              <div className='info-label'>
                <label className="">Mobile2</label>
              </div>
              <div className='info-value'>
                <span className="">-</span>
              </div>
            </div>
            <div className='mb-3 reseller-info-wrap'>
              <div className='info-label'>
                <label className="">Landline1</label>
              </div>
              <div className='info-value'>
                <span className="">+9221111836111</span>
              </div>
            </div>
            {/* <div className='mb-3 reseller-info-wrap'>
              <div className='info-label'>
                <label className="">Landline2</label>
              </div>
              <div className='info-value'>
                <span className="">-</span>
              </div>
            </div> */}
         

          </div>
          </div>

        </div>

    
        {/* Reseller Info modal starts  */}
<Modal isOpen={this.state.ResellerInfo} toggle={() => this.ResellerInfoModal()} className={this.props.className}>
          <ModalHeader toggle={() => this.ResellerInfoModal()} >Reseller Info</ModalHeader>
          <AvForm>
          <ModalBody className='reseller-info-modal'>
                  <div className="form-group mb-3 reseller-info-inner">
                    <label id="storeName" className="control-label">Business Name
                    </label>
                    <AvField  name="storeName" type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}
                    />
                  </div>
                  <div className="form-group mb-3 reseller-info-inner">
                    <label id="businessType" className="control-label">Business Type
                    </label>
                    <select class="select2 form-control custom-select" style={{height:"36px"}} >
                      <option value="1">Art & Craft</option>
                      <option value="2">Bed Bath</option>
                      <option value="3">Engineering</option>
                      </select>
                  </div>
                  <div className="form-group mb-3 reseller-info-inner">
                    <label id="businessEmail" className="control-label">Business Email
                    </label>
                    <AvField  name="businessEmail" type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}
                    />
                  </div>
                  <div className="form-group mb-3 reseller-info-inner">
                    <label id="businessMobile" className="control-label">Business Mobile
                    </label>
                    <AvField  name="businessMobile" type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}
                    />
                  </div>
                  <div className="form-group mb-3 reseller-info-inner">
                    <label id="businessLandline1" className="control-label">Business Landline 1
                    </label>
                    <AvField  name="businessLandline1" type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}
                    />
                  </div>
                  <div className="form-group mb-3 reseller-info-inner">
                    <label id="businessLandline2" className="control-label">Business Landline 2
                    </label>
                    <AvField  name="businessLandline2" type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}
                    />
                  </div>
                  <div className="form-group mb-3 reseller-info-inner">
                    <label id="whatsappNumber1" className="control-label">Whatsapp number 1
                    </label>
                    <AvField  name="whatsappNumber1" type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}
                    />
                  </div>
                  <div className="form-group mb-3 reseller-info-inner">
                    <label id="whatsappNumber2" className="control-label">Whatsapp number 2
                    </label>
                    <AvField  name="whatsappNumber2" type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}
                    />
                  </div>
                  <div className="form-group mb-3 reseller-info-inner">
                    <label id="whatsappNumber3" className="control-label">Whatsapp number 3
                    </label>
                    <AvField  name="whatsappNumber3" type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}
                    />
                  </div>
                  <div className="form-group mb-3 reseller-info-inner">
                    <label id="whatsappNumber4" className="control-label">Whatsapp number 4
                    </label>
                    <AvField  name="whatsappNumber4" type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}
                    />
                  </div>
                  <div className="form-group mb-3 reseller-info-inner">
                    <label id="whatsappNumber5" className="control-label">Whatsapp number 5
                    </label>
                    <AvField  name="whatsappNumber5" type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}
                    />
                  </div>
                  <div className="form-group mb-3 ">
                    <label id="shortDesc" className="control-label">Short Description
                    </label>
                    <textarea type="text" name="shortDesc" rows="4" maxlength="512" cols="50" id="shortDesc" class="form-control"></textarea>
                  </div>
                  <div className="form-group mb-3 ">
                    <label id="longDesc" className="control-label">Long Description
                    </label>
                    <div class="form-group" style={{ flex: "1" }}>
                <Editor className="Border-outline "
                  editorState={this.state.htmlEditorState}
                  toolbarClassName="toolbarClassName"
                  wrapperClassName="wrapperClassName"
                  editorClassName="editorClassName"
                  value={""}
                  onEditorStateChange={this.onEditorStateChange}
                  id="desc"

                />
              </div>
                  </div>
               
 
          </ModalBody>
          <FormGroup className="modal-footer" >
            <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger"></label>
            </div>
            <div>
              <Button className='mr-2 text-dark' color="secondary" onClick={() => this.ResellerInfoModal()}>Cancel</Button>
              <Button color="primary" >
              {/* <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>   */}
                 <span className="comment-text">Save</span> 
              </Button>
            </div>
          </FormGroup>
          </AvForm>
        </Modal>
           {/* Reseller Info modal ends  */}


             {/* Owner Info modal starts  */}
<Modal isOpen={this.state.OwnerInfo} toggle={() => this.OwnerInfoModal()} className={this.props.className}>
          <ModalHeader toggle={() => this.OwnerInfoModal()} >Owner Info</ModalHeader>
          <AvForm>
          <ModalBody className='reseller-info-modal'>
            <div className='row'>
                  <div className="form-group mb-3 col-md-6">
                    <label id="firstName" className="control-label">First Name
                    </label>
                    <AvField  name="firstName" type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}
                    />
                  </div>
                  <div className="form-group mb-3 col-md-6">
                    <label id="surName" className="control-label">Surname
                    </label>
                    <AvField  name="surName" type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}
                    />
                  </div>
                  </div>
                  
                  <div className="form-group mb-3">
                    <label id="Primaryemail" className="control-label">Primary Email
                    </label>
                    <AvField  name="Primaryemail" type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label id="mobile1" className="control-label">Mobile1
                    </label>
                    <AvField  name="mobile1" type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label id="mobile2" className="control-label">Mobile2
                    </label>
                    <AvField  name="mobile2" type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label id="landline1" className="control-label">Landline1
                    </label>
                    <AvField  name="landline1" type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}
                    />
                  </div>
                  {/* <div className="form-group mb-3">
                    <label id="landline2" className="control-label">Landline2
                    </label>
                    <AvField  name="landline2" type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}
                    />
                  </div> */}
 
          </ModalBody>
          <FormGroup className="modal-footer" >
            <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger"></label>
            </div>
            <div>
              <Button className='mr-2 text-dark' color="secondary" onClick={() => this.OwnerInfoModal()}>Cancel</Button>
              <Button color="primary" >
              {/* <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>   */}
                 <span className="comment-text">Save</span> 
              </Button>
            </div>
          </FormGroup>
          </AvForm>
        </Modal>
           {/* Owner Info modal ends  */}
      </div>

      

    );
  }

}

export default EditReseller;
