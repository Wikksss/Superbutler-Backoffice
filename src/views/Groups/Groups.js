import React, { Fragment } from 'react';
import { Tooltip, FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader, Table, Alert } from 'reactstrap';
import Cropper from 'react-easy-crop';
import Slider from '@material-ui/core/Slider'
import Loader from 'react-loader-spinner';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import "react-tabs/style/react-tabs.css";
import 'sweetalert/dist/sweetalert.css';
import MUIDataTable from "mui-datatables";
import { MdArrowBack, MdDragIndicator, MdDragHandle } from "react-icons/md";
import * as Utilities from  '../../helpers/Utilities';
import {BrowserRouter as Link } from "react-router-dom";


//Services
import * as EnterpriseGroupService from '../../service/EnterpriseGroup';



class Groups extends React.Component {

  //#region Constructor

  constructor(props) {
    super(props);
    this.state = {

      scrolled: false,
      showSubscription: false,
      active: false,
      GroupInfo: false,
      isLoading: true,
      GroupPhoto: false,
      enterpriseGroups: [],
    }
    
  }

  getGrouups = async () => {

    try {
      let response = await EnterpriseGroupService.GetAll()
      if (response.Message == undefined) {
        // console.log("responsssse: new ", response)
        // this.state.enterpriseGroups = response;
        
        this.setState({isLoading: false, enterpriseGroups: response})

      } else{ 

    console.log("error: ", response.Message)
    }

   
  } catch (error) {
      console.log('something went wrong'.error.message)
  }
  }

  GroupInfoModal() {
    this.setState({
      GroupInfo: !this.state.GroupInfo,
    })
}
GroupPhotoModal() {
  this.setState({
    GroupPhoto: !this.state.GroupPhoto,
    // LogoImage: null,
    // PhotoError: false
  });
}

  loading = () => <div className="page-laoder-users">
        <div className="loader-menu-inner">
            <Loader type="Oval" color="#ed0000" height={50} width={50} />
            <div className="loading-label">Loading.....</div>
        </div>
    </div>
  //#region api calling

 
  componentDidMount() {
    document.body.style.backgroundColor = "#fff";
    this.getGrouups();

  }

  componentWillUnmount() {
    document.body.style.backgroundColor = null;
  }

  render() {

    const columns = [
      {
      
      name: "PhotoName",
      label: " ",
      options: {
        filter: true,
        setCellProps: () => ({
          style: {
            whiteSpace: "nowrap",
            position: "sticky",
            left: "0",
            background: "white",
            zIndex: 111
          }
        }),
        setCellHeaderProps: () => ({
          style: {
            whiteSpace: "nowrap",
            position: "sticky",
            left: 0,
            background: "white",
            zIndex: 111
          }
        }),
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            value != "" ?
              <div onClick={() => this.props.history.push(`/sale-detail/${this.state.enterpriseGroups[tableMeta.currentTableData[tableMeta.rowIndex].index].Id}`)}>
                <a className=' text-dark cursor-pointer d-flex sale-img'>
                <img
                      alt="Remy Sharp"
                      src={`${Utilities.generatePhotoURL(value)}`}
                      width="40px"

                    />
                </a>
              </div>
              :
              <div onClick={() => this.props.history.push(`/sale-detail/${this.state.enterpriseGroups[tableMeta.currentTableData[tableMeta.rowIndex].index].Id}`)} className="dropzone-photo  text-center cursor-pointer justify-content-center p-2 " style={{ width: 40, height: 40, flex: 'none' }} >
                <i class="fa fa-file-image-o" aria-hidden="true" style={{ fontSize: 20 }}></i>
              </div>

          );
        }
      }
    },
  {
    name: "Name",
    label: "Group Name",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <div style={{ width: 200 }} className='cursor-pointer' onClick={() => this.props.history.push(`/sale-detail/${this.state.enterpriseGroups[tableMeta.currentTableData[tableMeta.rowIndex].index].Id}`)}>
            <a style={{ color: '#000' }}>{Utilities.SpecialCharacterDecode(value)}</a>
          </div>

        );
      }
    }
  },
  
  {
    name: "SubDomainName",
    label: "SubDomain",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <div>{Utilities.SpecialCharacterDecode(value)}</div>
        );
      }
    }
  },
  
  
  
  {
    name: "TotalEnterprise",
    label: "Total Businesses",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <div>
             {value ? value : '-'}
          </div>

        );
      }
    }
  },
  {
    name: "Actions",
    options: {
      filter: true,
      setCellProps: () => ({
        style: {
          whiteSpace: "nowrap",
          position: "sticky",
          right: "0",
          background: "white",
          zIndex: 100
        }
      }),
      setCellHeaderProps: () => ({
        style: {
          whiteSpace: "nowrap",
          position: "sticky",
          right: 0,
          background: "white",
          zIndex: 111
        }
      }),
      sort: false,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <div style={{ width: 20 }}>

            <span id="removeTooltip" onClick={() => this.props.history.push("/GroupsEdit")}  className='icon-bg-h  cursor-pointer d-flex'>
              {/* <i className="fa fa-trash font-13 mr-3" title="remove" aria-hidden="true"></i> */}
            
              <i className="fa fa-edit font-13" title="edit" aria-hidden="true"></i>
             
            </span>

          </div>

        );
      }
    }
  },
  ];


    const options2 = {
      
      download:false,
      print:false,
      filter:false,
      viewColumns:false,
      filterType: 'checkbox',
      search: true,
      pagination: false,
      selectableRows: false,
      textLabels: {
        body: {
           noMatch: this.state.isLoading ? <span className="comment-loader"><Loader type="Oval" color="#000" height={22} width={22} /></span> : "Sorry, no matching records found",
        }
      },
     
    };

    return (

        


      <div>

        <div id='header'>

        <div className={this.state.scrolled ? ' sub-h fixed-sub-header d-flex align-items-center' : 'sub-h d-flex align-items-center group-edit-res'} >
                  <div className='d-flex w-100 justify-content-between flex-wrap '>
                    <div className='d-flex align-items-center header-res-m'>
                      <span className='mr-3 cursor-pointer' onClick={() => this.props.history.goBack()}><MdArrowBack size={24} /> </span>
                      <div className="" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 className="card-title ">Groups</h3>
                      </div>
                    </div>

                    <span className="btn btn-primary-plus btn btn-secondary mr-3" onClick={() => this.GroupInfoModal()} ><i className="fa fa-plus mr-2" aria-hidden="true"></i>New Group </span>

                  </div>
                </div>

          <div className='card'>
            <div className='group-edit-res  variant-wrap'>
          
              <div className='min-height-table position-relative'>
                {this.state.enterpriseGroups.length > 0 &&
                <MUIDataTable
                  data={this.state.enterpriseGroups}
                  columns={columns}
                  options={options2}
                />
              }
              </div>
            </div>
          </div>


        </div>

        {/* Modal starts here  */}
        <Modal isOpen={this.state.GroupInfo} backdrop={"false"} toggle={() => this.GroupInfoModal()} className={this.props.className}>
          <ModalHeader toggle={() => this.GroupInfoModal()} >Add New Group</ModalHeader>
          <ModalBody className='groups-modal-wrap' style={{ maxHeight: "450px", overflowY: "auto" }}>
            <AvForm>
              <div className='row'>
                <div className='col-md-6'>
                  {/* <div className='mb-1'>
                  
                  <div class="form-group w-100" style={{ flex: "1" }}>
                  <div className="media-wraper el-element-overlay	">
                  <div className="res-logo-wrap  margin-r-0"  onClick={() => this.GroupPhotoModal()}>
                    <h5>Group Photo</h5>
                   
                     <div>
                     <div className="box-wrap">
                        { this.state.HasEnterpriseUpdatePermission ?
                        <div className="media-image" style={{ backgroundImage: "url()"}}></div>
                        :
                        <div className="media-image" style={{ backgroundImage: "url()",  transform: "none" }}></div>
                        }
                        

              </div>
                                      {this.state.HasEnterpriseUpdatePermission ?

                                        <div className="image-edit btn btn-secondary" >
                                        <i className="fa fa-edit"></i>
                                        <span>Edit</span>
                                        </div>
                                                                : ''
                                                              }

</div>
                     
                      :
                      <div className="box-wrap" id="dvAddLogoImage">
                        <i className="fa fa-plus"></i>
                        <p>Add Logo</p>

                      </div>
                 

                  </div>
                  </div>
                  </div>
                  </div> */}
                  <div className='mb-1'>
                  <label id="name" class="control-label mb-1 mr-2 mt-2 modalsettings">Group Name</label>
                  <div class="form-group w-100" style={{ flex: "1" }}>
                    <AvField name="Buniness Landline 2" type="text" value={""} onKeyUp=""

                    />
                  </div>
                  </div>
                  <div className='mb-1'>
                  <label id="name" class="control-label mb-1 mr-2 mt-2 modalsettings">Description</label>
                  <div class="form-group w-100" style={{ flex: "1" }}>
                    <textarea type="text" name="shortDesc" rows="4" maxlength="512" cols="50" id="shortDesc" value={""} className="form-control mb-1 is-untouched is-pristine av-valid form-control">
                    </textarea>
                  </div>
                  </div>
                </div>
                <div className='col-md-6 group-sec-right'>
                  <div className='mb-1'>
                <label id="name" class="control-label mb-1 mr-2 mt-2 modalsettings">Slider Images</label>
                {/* <input type="file" name="upGroupPhotoUploader" id="upGroupPhotoUploader" class="input-file-upload" accept="gif|jpg|png|bmp|jpeg|jpe" maxlength="1"></input> */}
                <div className='d-flex align-items-center mb-3'>
                <AvField name="Buniness Landline 2"  type="text" placeholder="Slider Image 1" value={""} onKeyUp=""

                    />
                    <img src="https://superbutler.app/wp-content/uploads/2023/01/holiday-inn.jpg" width={"50px"} alt="" />
                    </div>
                    <div className='d-flex align-items-center mb-3'>
                <AvField name="Buniness Landline 2"  type="text" placeholder="Slider Image 2" value={""} onKeyUp=""

                    />
                    <img src="https://superbutler.app/wp-content/uploads/2023/01/holiday-inn.jpg" width={"50px"} alt="" />
                    </div>
                    <div className='d-flex align-items-center mb-3'>
                <AvField name="Buniness Landline 2"  type="text" placeholder="Slider Image 3" value={""} onKeyUp=""

                    />
                    <img src="https://superbutler.app/wp-content/uploads/2023/01/holiday-inn.jpg" width={"50px"} alt="" />
                    </div>
                    <div className='d-flex align-items-center mb-3'>
                <AvField name="Buniness Landline 2"  type="text" placeholder="Slider Image 4" value={""} onKeyUp=""

                    />
                    <img src="https://superbutler.app/wp-content/uploads/2023/01/holiday-inn.jpg" width={"50px"} alt="" />
                    </div>
                    <div className='d-flex align-items-center mb-3'>
                <AvField name="Buniness Landline 2"  type="text" placeholder="Slider Image 5" value={""} onKeyUp=""

                    />
                    <img src="https://superbutler.app/wp-content/uploads/2023/01/holiday-inn.jpg" width={"50px"} alt="" />
                    </div>
                    </div>
                </div>
              </div>
            </AvForm>
          </ModalBody>
          <FormGroup className="modal-footer" >
            <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger"></label>
            </div>
            <div>
              <Button className='mr-2 text-dark' color="secondary" onClick={() => this.GroupInfoModal()}>cancel</Button>
              <Button color="primary" >
                <span className="comment-text">save</span>
              </Button>
            </div>
          </FormGroup>
        </Modal>
        <Modal isOpen={this.state.GroupPhoto} toggle={this.GroupPhotoModal} className={this.props.className}>
            <ModalHeader toggle={this.GroupPhotoModal}>Upload Logo</ModalHeader>
            <ModalBody>
              <div className="popup-web-body-wrap-new">
                <div className="file-upload-btn-wrap position-relative">
                  <div className="fileUpload">
                    <span>Choose a file</span>
                    <input type="file" accept="image/*" id="logoUpload" className="upload"
                      />
                  </div>
                </div>

                <div id="logo-upload-image" className="upload-image-wrap-new">
                  <div className="upload-dragdrop-wrap" id="logoDragImage">
                    <div>
                      <div className="dragdrop-icon-text-wrap">PREVIEW ONLY</div>
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
                          // onZoomChange={(e) => this.onZoomChange(e, PhotoGroupName[0])}
                        />
                      </div>
                      <div className="controls">
                        <Slider
                          value={this.state.LogoZoom}
                          min={1}
                          max={3}
                          step={0.1}
                          aria-labelledby="Zoom"
                          // onChange={(e, zoom) => this.onZoomChange(zoom, PhotoGroupName[0])}
                        />
                      </div>
                    </Fragment>
                    }
                  </div>

                </div>
              </div>
            </ModalBody>
            <ModalFooter>

              <Button color="secondary" onClick={this.GroupPhotoModal}>Cancel</Button>
              {this.state.LogoImage !== null && <Button color="primary" style={{ marginRight: 10 }} >
              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                             : <span className="comment-text">Save</span>}
              </Button>}
              {this.state.PhotoError ? <div className="error media-imgerror " style={{margin: 0}} >Photo upload unsuccessful.</div> : ''} 
            </ModalFooter>
          </Modal>

      </div>

    )

  }
}


//#endregion

export default Groups;
