import React, { Component } from 'react'
import MUIDataTable from "mui-datatables";
import Datepicker from "react-tailwindcss-datepicker";
import * as ComplaintService from '../../service/Complaint'
import Constants from '../../helpers/Constants';
import * as Utilities from '../../helpers/Utilities'
import moment from 'moment';
import GlobalData from '../../helpers/GlobalData';
import Config from '../../helpers/Config';
import Loader from 'react-loader-spinner';
import Labels from '../../containers/language/labels';
import Dropdown from 'react-bootstrap/Dropdown';
import { useDropzone } from 'react-dropzone'
import { MdDownload, MdAddAPhoto } from "react-icons/md";
import { AiOutlineGlobal } from "react-icons/ai";
import { FaLink } from "react-icons/fa6";
import { BiSolidFilePng } from "react-icons/bi";
import { FaFilePdf } from "react-icons/fa";
import QRCode from "react-qr-code";
import { FormGroup, Button, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
import S3Browser from '../PhotoGallery/PhotoGallery'
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as EnterpriseService from '../../service/Enterprise';
import demoHotelImage from '../../../src/assets/img/brand/Superbutler-homepage-background.bbdf5c27.jpg'
import demoHotelFooterImage from '../../../src/assets/img/brand/superbuter-logo-footer.png'
var timeZone = '';

const LogobgBody = ({ onDrop, setLogobdBody }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/jpeg, image/png, image/jpg',
    onDrop: acceptedFiles => {
      acceptedFiles.map(async file => {
        setLogobdBody(URL.createObjectURL(file))
      });
  }
  });

  return (
    <div {...getRootProps()} >
      <input {...getInputProps()} />
      {!isDragActive ? (
        <div className='logo-header-n'>
        </div>
      ) : (
        <div className='box-wrap'>

        </div>

      )}
    </div>
  );
};

const Circleimg1 = ({ onDrop, setCircleimg1 }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/jpeg, image/png, image/jpg',
    onDrop: acceptedFiles => {
      acceptedFiles.map(async file => {
        setCircleimg1(URL.createObjectURL(file))
      });
  }
  });

  return (
    <div {...getRootProps()} >
      <input {...getInputProps()} />
      {!isDragActive ? (
        <div className='logo-header-n'>
        </div>
      ) : (
        <div className='box-wrap'>

        </div>

      )}
    </div>
  );
};

const Circleimg2 = ({ onDrop , setCircleimg2}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/jpeg, image/png, image/jpg',
    onDrop: acceptedFiles => {
      acceptedFiles.map(async file => {
        setCircleimg2(URL.createObjectURL(file))
      });
  }
  });

  return (
    <div {...getRootProps()} >
      <input {...getInputProps()} />
      {!isDragActive ? (
        <div className='logo-header-n'>
          {/* <p>abdhifegvbrhgiebhgoerbhgewovhg</p> */}
        </div>
      ) : (
        <div className='box-wrap'>

        </div>

      )}
    </div>
  );
};

const Circleimg3 = ({ onDrop, setCircleimg3 }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/jpeg, image/png, image/jpg',
    onDrop: acceptedFiles => {
      acceptedFiles.map(async file => {
        setCircleimg3(URL.createObjectURL(file))
      });
  }
  });

  return (
    <div {...getRootProps()} >
      <input {...getInputProps()} />
      {!isDragActive ? (
        <div className='logo-header-n'>
        </div>
      ) : (
        <div className='box-wrap'>

        </div>

      )}
    </div>
  );
};



export default class HotelDemos extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.onPNGClick = this.onPNGClick.bind(this);
    this.state = {
      showLoader: true,
      isLoading: true,
      isHovered: false,
      HotelDemo: false,
      DownloadQr: false,
      ImageGallery: false,
      shouldRefresh: true,
      currentFolder: "",
      HeaderBgColor:"",
      HeaderTextColor:"",
      FilterEnterprises:[],
      selectedEnterprise: {},
      logobdBody:"",
      circleimg1:"",
      circleimg2:"",
      circleimg3:""
      
    }
    
  }

  onPNGClick() {
    if (this.ref.current === null) {
      return;
    }
  
    html2canvas(this.ref.current, {
      scale: 3,
      allowTaint: true, // Allows cross-origin images without CORS headers, but disables CORS security checks
      useCORS: true // Allows cross-origin images to be captured properly
    })
    .then((canvas) => {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'Hotel-demo.png';
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => {
      console.log(err);
    });
    
  }



  downloadPDF = () => {
    const input = document.getElementById('ModalPDF'); // Select the modal content
  
    html2canvas(input, {
      scale: 3, // Adjust the scale to get a higher resolution image
      allowTaint: true, // Allows cross-origin images without CORS headers, but disables security checks
      useCORS: true // Enables cross-origin image capture
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a5'); // Create a new jsPDF instance for A5 size
  
        const imgWidth = 148; // A5 page width in mm
        const pageHeight = 350; // A5 page height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
        let heightLeft = imgHeight;
        let position = 0;
  
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
  
        // Add more pages if content exceeds one page
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
  
        pdf.save('Hotel-demo.pdf'); // Save the PDF
      })
      .catch((error) => {
        console.error('Could not generate PDF', error);
      });
  };


  changeHandler = (colors, control) => {


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

  
  HotelDemoModal() {
    this.setState({
      HotelDemo: !this.state.HotelDemo,
    })
  }
  DownloadQrModal(selectedEnterprise) {

    this.setState({
      DownloadQr: !this.state.DownloadQr,
      selectedEnterprise: selectedEnterprise != undefined ? selectedEnterprise : {},
      logobdBody:"",
      circleimg1:"",
      circleimg2:"",
      circleimg3:"",
    })
  
  }
  handleMouseEnter = () => {
    this.setState({ isHovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ isHovered: false });
  };

  ImageGalleryModal() {
    this.setState({
      ImageGallery: !this.state.ImageGallery,
    })
  }
  toggleViewS3ImageModal = (image) => {
    this.setState({
      viewS3ImageModal: !this.state.viewS3ImageModal,
      btnShow: false,
      imageToOpen: image,
      currentFolder: image ? image.parentId : ""
    })
  }
  SetSelectedMedia = (media) => {
    this.state.selectedMedia = media;
    this.state.Image = media.length > 0 ? media : null;
    var btnNext = document.getElementById("btnNext");

    if (btnNext) {
      if (media.length > 0) {
        btnNext.style.display = 'block';
      } else {
        btnNext.style.display = 'none';
      }
    }

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


  componentWillMount() {
    document.body.classList.add('hide-overflow-hidden');

  }

  componentDidMount() {
   
    setTimeout(() => {
      const searchInput = document.querySelector('input[placeholder="Search"]');
      if (searchInput) {
        searchInput.blur();
      }
    }, 100);
    this.GetEnterprises()
  }


  isBottom(el) {

    if (el != null) return el.getBoundingClientRect().bottom <= window.innerHeight + 5;
    else return null;
  }




  componentWillUnmount() {
    document.body.classList.remove('hide-overflow-hidden');
  }


  GetEnterprises = async (searchKeyword) => {
    // this.state.FilterEnterprises = this.state.parentsEnterprises.length > 1 ? this.state.parentsEnterprises : this.state.FilterEnterprises;
    // pageNumber = pageNumber + 1
    

    this.setState({ ShowLoader: true });
    let data = await EnterpriseService.GetAllDemoEnterprise();
    if (data === null) {
      Utilities.ClearSession();
      window.location.href = "/login"
    }

    if (data.length !== 0) {

      var parentsEnterprises =  data.filter((p) => 
        {
          var index = this.state.FilterEnterprises.findIndex(e => e.Id == p.Id)
          if(index != -1) p.ChildEnterprises = this.state.FilterEnterprises[index].ChildEnterprises;
          return p.EnterpriseId != 0

        })
      this.setState({ Enterprises: parentsEnterprises, FilterEnterprises: data.length > 1 ? parentsEnterprises : this.state.FilterEnterprises , totalRecord: data[data.length - 1].Id, parentsEnterprises: parentsEnterprises, ShowLoader: false,  });
      return
    }

    // this.setState({ ShowLoader: false });

  }

  setLogobdBody = (url) =>{
    this.setState({ logobdBody: url})
  }
  setCircleimg1 = (url) =>{
    this.setState({ circleimg1: url})
  }
  setCircleimg2 = (url) =>{
    this.setState({ circleimg2: url})
  }
  setCircleimg3 = (url) =>{
    this.setState({ circleimg3: url})
  }



  render() {
    const { isHovered } = this.state;

    const data = [
      { Name: "Ramada Plaze", Loaction: "Karachi, Pakistan", VistDemo: "ramada", DownloadQR: "Download QR", Createdon: "Created on" },
      // { name: "John Walsh", company: "Test Corp", city: "Hartford", state: "CT" },
      // { name: "Bob Herm", company: "Test Corp", city: "Tampa", state: "FL" },
      // { name: "James Houston", company: "Test Corp", city: "Dallas", state: "TX" },
    ];

    const columns = [

      {
        name: "Name",
        label: "Name",
        options: {
          sort: false,
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <div className='cursor-pointer d-flex align-items-start'>
              <img className='rounded-circle mr-2' width={35} src={Utilities.generatePhotoLargeURL(this.state.FilterEnterprises[tableMeta.rowIndex].Logo)}></img>
              <span>{Utilities.SpecialCharacterDecode(this.state.FilterEnterprises[tableMeta.rowIndex].Name)}</span>
            </div>
          )
        }
      },
      {
        name: "Loaction",
        label: "Location",
        options: {
          sort: false,
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <div>
              <span>{this.state.FilterEnterprises[tableMeta.rowIndex]?.Address != "" ? Utilities.SpecialCharacterDecode(this.state.FilterEnterprises[tableMeta.rowIndex]?.Address) : "-"}</span>
            </div>
          )
        }
      },
      {
        name: "Createdon",
        label: "Created on",
        options: {
          sort: false,
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <div>
              <span>{this.state.FilterEnterprises[tableMeta.rowIndex]?.CreatedOn ? Utilities.getDateByZone(this.state.FilterEnterprises[tableMeta.rowIndex].CreatedOn, "DD MMM YYYY", Config.Setting.timeZone) : "-"}</span>
            </div>
          )
        }
      },
      {
        name: "",
        label: "",
        options: {
          sort: false,
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => (
            <div className='d-flex align-items-center justify-content-end' style={{ gap: 40 }}>
              <div>
                <a style={{ gap: 8 }} className='text-dark d-flex align-items-center' target='_blank' href={this.state.FilterEnterprises[tableMeta.rowIndex]?.SubDomain !="" ? `https://${this.state.FilterEnterprises[tableMeta.rowIndex].SubDomain}.mysuperbutler.com/` : ""}><FaLink className='font-18 text-primary' /> View Demo </a>
              </div>
              <div onClick={() => this.DownloadQrModal(this.state.FilterEnterprises[tableMeta.rowIndex])}>
                <a style={{ gap: 8 }} className='text-dark cursor-pointer d-flex align-items-center'> <i className="fa fa-qrcode font-18 text-primary"></i>  Download QR</a>
              </div>
            </div>
          )
        }
      },


    ];


    const options = {
      searchOpen: false,
      searchAlwaysOpen: true,
      searchPlaceholder: "Search",
      selectableRowsHideCheckboxes: true,
      selectableRowsOnClick: false,
      sort: false,
      sortFilterList: false,
      pagination: true,
      serverSide: false,
      rowsPerPage: this.state.pageSize,
      rowsPerPageOptions: [100, 200, 500],
      print: false,
      download: false,
      filter: false,
      viewColumns: false,
      responsive: window.innerWidth < 700 ? "scroll" : "",
      setTableProps: () => ({ className: "classname-to-attach-to-table" }),
      textLabels: {
        body: {
          noMatch: this.state.isLoading ? <span className="comment-loader"><Loader type="Oval" color="#000" height={22} width={22} /></span> : "Sorry, no matching records found",
        }
      },
      onChangePage: this.onChangePage,
      onChangeRowsPerPage: this.onChangeRowsPerPage,

    }


    return (
      <div className='card' id='header'>
        <div className="d-flex align-items-center justify-content-between mb-2 p-l-r card-body">
          <h3 className="card-title card-new-title ml-0 mb-0 pl-0">Hotel Demos</h3>
          <a className="btn btn-primary mr-2 " href='/create-demo'><i className="fa fa-plus mr-2" aria-hidden="true"></i>Create new</a>
        </div>
        
        <div class="card-body">

          <div className='past-comp-mui-wrap hotel-demos-mui'>
            <MUIDataTable
              // title={"Employee List"}
              data={this.state.FilterEnterprises}
              columns={columns}
              options={options}
            />

            {/* {
              this.state.bottomLoader &&
              <div className='page-end-loader d-flex w-100 justify-content-center  mt-4'>
                <Loader type="Oval" color="#ed0000" height={30} width={30} />
              </div>
            }
            {
              this.state.histroyComplaints.length >= this.state.TotalResolved && this.state.histroyComplaints.length > 0 && this.state.histroyComplaints.length > this.state.pageSize &&
              <div className='page-end-loader d-flex w-100 justify-content-center mt-4'>
                <p>End of results</p>
              </div>
            } */}

          </div>
        </div>
        <Modal  isOpen={this.state.DownloadQr} toggle={() => this.DownloadQrModal()} className='modal-media-main download-qr-m-wrap'>
        
          <AvForm>
            {/* <ModalHeader toggle={() => this.DownloadQrModal()} >Create New Hotel Demo</ModalHeader> */}
           
            <ModalBody >
            <div ref={this.ref} id='ModalPDF'>
              <img  className='qr-body-bg-img' style={{ backgroundImage: "url(" + `${this.state.logobdBody !="" ? this.state.logobdBody : demoHotelImage}` + ")" }}>
              </img>


              <div className='qr-body-inner-wrap'>

                <div className='mb-4'>

                  <div className='qr-logo-wrap'>
                    <img src={Object.keys(this.state.selectedEnterprise).length > 0 ? Utilities.generatePhotoLargeURL(this.state.selectedEnterprise.Logo) : `${demoHotelImage}`} />
                  </div>

                  <div class="qr-images-wrapper">
                    <div onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} class="circle-image img1" style={{ backgroundImage: "url(" + `${this.state.circleimg1 !="" ? this.state.circleimg1 : demoHotelImage}` + ")" }}>
                      <div className='multi-img-c-overlay'>

                      </div>
                      <div className='multi-img-chng-o-i'>
                        <MdAddAPhoto />
                        <div className='bdy-drop-zone' >
                          <Circleimg1 onDrop={this.onDrop} setCircleimg1={(v)=>this.setCircleimg1(v)} />
                        </div>
                      </div>
                      <span className='change-txt-circle-img'>Change</span>
                    </div>
                    <div onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} class="circle-image img2" style={{ backgroundImage: "url(" + `${this.state.circleimg2 !="" ? this.state.circleimg2 : demoHotelImage}` + ")" }}>
                      <div className='multi-img-c-overlay'>

                      </div>
                      <div className='multi-img-chng-o-i'>
                        <MdAddAPhoto />
                        <div className='bdy-drop-zone' >
                          <Circleimg2 onDrop={this.onDrop} setCircleimg2={(v)=>this.setCircleimg2(v)} />
                        </div>
                      </div>
                      <span className='change-txt-circle-img'>Change</span>
                    </div>
                    <div onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} class="circle-image img3" style={{ backgroundImage: "url(" + `${this.state.circleimg3 !="" ? this.state.circleimg3 : demoHotelImage}` + ")" }}>
                      <div className='multi-img-c-overlay'>

                      </div>
                      <div className='multi-img-chng-o-i'>
                        <MdAddAPhoto />
                        <div className='bdy-drop-zone' >
                          <Circleimg3 onDrop={this.onDrop} setCircleimg3={(v)=>this.setCircleimg3(v)} />
                        </div>
                      </div>
                      <span className='change-txt-circle-img'>Change</span>
                    </div>
                  </div>

                  <div className='scan-qr-serv-wrap'>
                    <div className='scan-qr-inner-l'>
                      <div className='scan-qr-inner-text'>
                        <span>Scan for in-Room Services</span>
                      </div>
                      <div className='qr-scan-points'>
                        <span>Room Service</span>
                        <span>Housekeeping</span>
                        <span>Gourmet Room Services 24/7</span>
                      </div>
                    </div>
                    <div className='scan-qr-inner-r position-relative' style={{ display: 'inline-block' }}>
                      <div style={{ height: "auto", marginLeft: "auto", maxWidth: 120, width: "100%" }}>
                        <QRCode
                          size={256}
                          style={{ padding: 5, background: "#fff", height: "auto", maxWidth: "100%", width: "100%" }}
                          value={`https://${this.state.selectedEnterprise.SubDomain}.mysuperbutler.com/services/?ordertype=in-room`}
                          viewBox={`0 0 256 256`}
                        />
                      </div>


                    </div>

                  </div>

                  <div className={isHovered ? 'qr-overlay qr-overlay-hover' : 'qr-overlay'}></div>
                  <div className={isHovered ? 'body-img-chge body-img-chge-hover' : 'body-img-chge '}>

                    <MdAddAPhoto />
                    <div className='bdy-drop-zone' >
                      <LogobgBody onDrop={this.onDrop} setLogobdBody={(v)=>this.setLogobdBody(v)} />
                    </div>
                  </div>
                  <div className={isHovered ? 'd-img-chge-txt d-img-chge-txt-hover' : 'd-img-chge-txt '}>
                    <span className='font-12'>Change Background</span>
                  </div>
                  <div style={{ display: "none" }} onClick={() => this.DownloadQrModal()} className='close-d-res-btn'>
                    Close
                  </div>


                </div>
                <div className='pwrd-by-s-b'>
                  <span className='pwrd-by-s-b-i'>Powered by</span>
                  <img height={40} src={demoHotelFooterImage} />
                </div>





              </div>
              </div>
            </ModalBody>
              
            {/* <FormGroup className="modal-footer" >
                <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger"></label>
                </div>
                <div>
                  <Button className='mr-2 text-dark' color="secondary" onClick={() => this.DownloadQrModal()}>Cancel</Button>
                  <Button color="primary" >
                    <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>  
                    <span className="comment-text">Save</span>
                  </Button>
                </div>
              </FormGroup> */}
          </AvForm>
         
          <div style={{ zIndex: 1 }} className='dr-download-btn-wrap'>
            <button onClick={this.onPNGClick} title='Download PNG' className="btn btn-primary dr-grn-btn"><BiSolidFilePng className='font-24 ' />Download</button>
            <span onClick={this.downloadPDF} title='Download PDF' className="btn btn-primary dr-red-btn"><FaFilePdf className='font-24' />Download</span>
          </div>
        </Modal>

        <Modal isOpen={this.state.ImageGallery} toggle={() => this.ImageGalleryModal()} style={{ maxWidth: "80%" }} className={this.props.className}>
          <ModalHeader toggle={() => this.ImageGalleryModal()} >Choose from media library</ModalHeader>
          <ModalBody className='scroll-media modal-media-wrap'>
            <S3Browser toggleViewS3ImageModal={this.toggleViewS3ImageModal} setSelectedMedia={this.SetSelectedMedia} ignoredFilesBySize={this.ValidateFiles} shouldRefresh={this.state.shouldRefresh} RefreshS3Files={this.RefreshS3Files} currentFolder={this.state.currentFolder} />
          </ModalBody>
          <FormGroup className="modal-footer" >
            <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger"></label>
            </div>
            <div>
              <Button className='mr-2 text-dark' color="secondary" onClick={() => this.ImageGalleryModal()}>Cancel</Button>
              <Button color="primary" >
                {/* <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>   */}
                <span className="comment-text">Save</span>
              </Button>
            </div>
          </FormGroup>
        </Modal>
      </div>
    )
  }
}
