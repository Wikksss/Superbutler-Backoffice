import React, { Component } from 'react'
import Constants from '../../helpers/Constants';
import * as Utilities from '../../helpers/Utilities'
import Config from '../../helpers/Config';
import Loader from 'react-loader-spinner';
import Labels from '../../containers/language/labels';
import Dropdown from 'react-bootstrap/Dropdown';
import { useDropzone } from 'react-dropzone'
import { MdDownload, MdAddAPhoto } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";
import { TbWorldWww } from "react-icons/tb";
import { RiWhatsappFill } from "react-icons/ri";
import QRCode from "react-qr-code";
import { FormGroup, Button, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import demoHotelImage from '../../../src/assets/img/brand/Superbutler-homepage-background.bbdf5c27.jpg'
import demoHotelFooterImage from '../../../src/assets/img/brand/superbuter-logo-footer.png'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
var timeZone = '';
const existHotelImages = require.context('../../../src/assets/hotelQRDemos', true, /\.(png|jpe?g|svg)$/);
const LogobgBody = ({ onDrop, setLogobdBody }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({

    accept: 'image/jpeg, image/png, image/jpg',
    // multiple:true,

    onDrop: acceptedFiles => {
        acceptedFiles.map(async file => {
            setLogobdBody(URL.createObjectURL(file))
        });
    }
})

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
    // multiple:true,

    onDrop: acceptedFiles => {
        acceptedFiles.map(async file => {
          setCircleimg1(URL.createObjectURL(file))
        });
    }
})

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

const Circleimg2 = ({ onDrop, setCircleimg2 }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({

    accept: 'image/jpeg, image/png, image/jpg',
    // multiple:true,

    onDrop: acceptedFiles => {
        acceptedFiles.map(async file => {
          setCircleimg2(URL.createObjectURL(file))
        });
    }
})

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

const Circleimg3 = ({ onDrop, setCircleimg3 }) => {
  const { getRootProps, getInputProps, isDragActive } =  useDropzone({

    accept: 'image/jpeg, image/png, image/jpg',
    // multiple:true,

    onDrop: acceptedFiles => {
        acceptedFiles.map(async file => {
          setCircleimg3(URL.createObjectURL(file))
        });
    }
})

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



export default class ThankyouHotelDemo extends Component {
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
      HeaderBgColor: "",
      HeaderTextColor: "",
      logoHorizontal: "",
      CountryCode: "gb",
      countryCallingCode: "",
      mobile: "",
      phone: "",
      errorMessage: false,
      IsSave: false,
      creatingHotel: false,
      showDetail: false,
      showMoreDetail: false,
      subDomainName: "yourhotel",
      hotelName: "Your Hotel",
      demoHotelJson: {},
      logoBdBody:"",
      circleimg1:"",
      circleimg2:"",
      circleimg3:"",
      demoHotelBGImage:"",
      demoHotelcircleimg1Image:"",
      demoHotelcircleimg2Image:"",
      demoHotelcircleimg3Image:"",

    }
   
    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))

      if (userObj.EnterpriseRestaurant.Country != null) {
        this.state.CountryCode = userObj.EnterpriseRestaurant.Country.IsoCode2.toLowerCase();
      }
    }
    var demoHotel = localStorage.getItem("DemoHotel")
    this.state.demoHotelJson = JSON.parse(demoHotel)
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
        <span className={(this.state.defaultTheme[control]) == 'transparent' ? "fa fa-eye-slash" : 'fa fa-eye'}>
          {this.state.defaultTheme[control] == 'transparent' ? <span className="rc-color-picker-trigger ban-icon"><i className="fa fa-ban" aria-hidden="true"></i></span> : ''}
        </span>
      </span>
    )
  }

  HotelDemoModal() {
    this.setState({
      HotelDemo: !this.state.HotelDemo,
    })
  }
  DownloadQrModal() {
    this.setState({
      DownloadQr: !this.state.DownloadQr,
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

  componentWillMount() {
    document.body.classList.add('body-demo-bg-img');

  }

  componentDidMount() {
    this.getImageByFileName()
    this.getBackgroundImageByFileName()
    this.getFoodImageByFileName()
    setTimeout(() => {
      const searchInput = document.querySelector('input[placeholder="Search"]');
      if (searchInput) {
        searchInput.blur();
      }
    }, 100);

  }


  isBottom(el) {

    if (el != null) return el.getBoundingClientRect().bottom <= window.innerHeight + 5;
    else return null;
  }


  componentWillUnmount() {
    document.body.classList.remove('body-demo-bg-img');
  }

  CreateHotel = () => {

    window.location.href = "/create-demo";
  }

  UpdateSelectedImage = async () => {

    var media = this.state.selectedMedia;
    var selectedPhoto = media.length > 0 ? `/${media[0].id.replace(Config.Setting.envConfiguration.ContentPath, "")}` : "";

    this.setState({ selectedMedia: [], logoHorizontal: selectedPhoto, Image: null, itemImage: false, ImageGallery: false });

  }


  getImageByFileName = (fileName) => {
    fileName = `${this.state.demoHotelJson.Id}.jpg`
    try {
      const image = existHotelImages(`./${fileName}`);
      // console.log('file', image);
      var hotelJSON = this.state.demoHotelJson
      this.state.subDomainName = hotelJSON.SubDomain
      return image.default || image; // Return the image path
    } catch (error) {
      var hotelJSON = this.state.demoHotelJson
      this.state.hotelName = hotelJSON.Name
      this.state.subDomainName = hotelJSON.SubDomain
      // console.log('Image not found:', error); // Log if the image is not found
      return ""; // Return empty string if image is not found
    }
  };


  getBackgroundImageByFileName = (fileName) => {
    var randomNumber = Math.floor(Math.random() * 5) + 1
    fileName = `bg_${randomNumber}.jpg`
    try {
      // console.log('file', existHotelImages(`./bgQRdemo/${"bg_1.jpg"}`));
      const image = existHotelImages(`./bgQRdemo/${fileName}`);
      // console.log('file', image);
      this.setState({demoHotelBGImage: image.default || image})
      // this.state.demoHotelBGImage = image.default || image; // Return the image path
    } catch (error) {
      console.log('Image not found:', error); // Log if the image is not found
      this.state.demoHotelBGImage = demoHotelImage
      return ""; // Return empty string if image is not found
    }
  };
  getFoodImageByFileName = () => {
    var randomNumberCir1 = Math.floor(Math.random() * 13) + 1
    var randomNumberCir2 = Math.floor(Math.random() * 13) + 1
    var randomNumberCir3 = Math.floor(Math.random() * 13) + 1
    var fileName1 = `food${randomNumberCir1}.jpg`
    var fileName2 = `food${randomNumberCir2}.jpg`
    var fileName3 = `food${randomNumberCir3}.jpg`
    try {
      const image1 = existHotelImages(`./foodpictures/${fileName1}`);
      const image2 = existHotelImages(`./foodpictures/${fileName2}`);
      const image3 = existHotelImages(`./foodpictures/${fileName3}`);
      // console.log('file', image);
      this.setState({demoHotelcircleimg1Image: image1.default || image1, demoHotelcircleimg2Image: image2.default || image2, demoHotelcircleimg3Image: image3.default || image3})
      // this.state.demoHotelcircleimg1Image = image1.default || image1; // Return the image path
      // this.state.demoHotelcircleimg2Image = image2.default || image2; // Return the image path
      // this.state.demoHotelcircleimg3Image = image3.default || image3; // Return the image path
    } catch (error) {
      console.log('Image not found:', error); // Log if the image is not found
      this.state.demoHotelcircleimg1Image = demoHotelImage; // Return the image path
      this.state.demoHotelcircleimg2Image = demoHotelImage; // Return the image path
      this.state.demoHotelcircleimg3Image = demoHotelImage; // Return the image path
      return ""; // Return empty string if image is not found
    }
  };



  setLogobdBody = (image) =>{
    this.setState({ logoBdBody: image})
  }
  setCircleimg1 = (image) =>{
    this.setState({ circleimg1: image})
  }
  setCircleimg2 = (image) =>{
    this.setState({ circleimg2: image})
  }
  setCircleimg3 = (image) =>{
    this.setState({ circleimg3: image})
  }


  render() {
    const { showMoreDetail, subDomainName } = this.state; // Access the state using `this.state`
    const { isHovered } = this.state;
    return (
      <div className='create-demo-page-wrap body-demo-bg-img' >
        <div className='d-flex flex-column '>
          <div>
            <div className='modal-media-main download-qr-m-wrap download-qr-m-wrap-override'>
              <a href={`/create-demo`} className='d-flex align-items-center justify-content-center demo-page-logo-wrap mt-4'>
                <img alt='Superbutler' style={{ height: "auto" }} width={200} src={demoHotelFooterImage}></img>
              </a>
              <div className='d-flex align-items-center justify-content-center mb-4 mt-4'>
                <span className="thank-icon-border mr-3"><i class="thank-success-icon fa fa-check" aria-hidden="true"></i></span>
                <div>
                  <h3 className="card-title card-new-title ml-0 mb-0 pl-0 mt-0" style={{ textAlign: "left" }}>Congrats!</h3>
                  <p className='text-white mt-2 mb-0'>Your hotel demo is ready. Please find your demo QR below</p>
                </div>
              </div>
              <div className='modal-body'>
                <AvForm>
                  {
                    this.getImageByFileName() == "" ?
                      <div ref={this.ref} id='ModalPDF'>


                        <div className='qr-body-inner-wrap '>
                          <img className='qr-body-bg-img' style={{ backgroundImage: "url(" + `${this.state.logoBdBody !="" ? this.state.logoBdBody : this.state.demoHotelBGImage}` + ")" }}>
                          </img>

                          <div className='mb-2 pl-2 pr-2'>
                            <div className='qr-logo-wrap d-flex align-items-center justify-content-center'>
                              <h6 className="card-title ml-0 mb-0 pl-0 text-center text-white hotel-name-demo-t">{Utilities.SpecialCharacterDecode(this.state.hotelName)}</h6>
                            </div>

                            <div class="qr-images-wrapper">
                              <div onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} class="circle-image img1" style={{ backgroundImage: "url(" + `${this.state.circleimg1 !="" ? this.state.circleimg1 : this.state.demoHotelcircleimg1Image}` + ")" }}>
                                <div className='multi-img-c-overlay'>

                                </div>
                                <div className='multi-img-chng-o-i'>
                                  <MdAddAPhoto />
                                  <div className='bdy-drop-zone' >
                                    <Circleimg1 onDrop={this.onDrop} setCircleimg1={(v) => this.setCircleimg1(v)} />
                                  </div>
                                </div>
                                <span className='change-txt-circle-img'>Change</span>
                              </div>
                              <div onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} class="circle-image img2" style={{ backgroundImage: "url(" + `${this.state.circleimg2 !="" ? this.state.circleimg2 : this.state.demoHotelcircleimg2Image}` + ")" }}>
                                <div className='multi-img-c-overlay'>

                                </div>
                                <div className='multi-img-chng-o-i'>
                                  <MdAddAPhoto />
                                  <div className='bdy-drop-zone' >
                                    <Circleimg2 onDrop={this.onDrop} setCircleimg2={(v) => this.setCircleimg2(v)} />
                                  </div>
                                </div>
                                <span className='change-txt-circle-img'>Change</span>
                              </div>
                              <div onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} class="circle-image img3" style={{ backgroundImage: "url(" + `${this.state.circleimg3 !="" ? this.state.circleimg3 : this.state.demoHotelcircleimg3Image}` + ")" }}>
                                <div className='multi-img-c-overlay'>

                                </div>
                                <div className='multi-img-chng-o-i'>
                                  <MdAddAPhoto />
                                  <div className='bdy-drop-zone' >
                                    <Circleimg3 onDrop={this.onDrop} setCircleimg3={(v) => this.setCircleimg3(v)} />
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
                                  <div style={{background:"#fff", padding:"5px"}}>
                                  <QRCode
                                    size={256}
                                    style={{height: "auto", maxWidth: "100%", width: "100%" }}
                                    value={`https://${this.state.subDomainName}.mysuperbutler.com`}
                                    viewBox={`0 0 256 256`}
                                  />
                                  </div>
                                </div>


                              </div>

                            </div>
                            <div className='pwrd-by-s-b'>
                            <span className='pwrd-by-s-b-i'>Powered by</span>
                            <img height={40} src={demoHotelFooterImage} />
                          </div>

                            <div className={isHovered ? 'qr-overlay qr-overlay-hover' : 'qr-overlay'}></div>
                            <div className={isHovered ? 'body-img-chge body-img-chge-hover' : 'body-img-chge '}>

                              <MdAddAPhoto />
                              <div className='bdy-drop-zone' >
                                <LogobgBody onDrop={this.onDrop} setLogobdBody={(v) => this.setLogobdBody(v)} />
                              </div>
                            </div>
                            <div className={isHovered ? 'd-img-chge-txt d-img-chge-txt-hover' : 'd-img-chge-txt '}>
                              <span className='font-12'>Change Background</span>
                            </div>
                            {/* <div style={{ display: "none" }} onClick={() => this.DownloadQrModal()} className='close-d-res-btn'>
                    Close
                  </div> */}


                          </div>
                          





                        </div>
                      </div> :
                      <div ref={this.ref}>
                        <img className='w-100 h-auto' src={this.getImageByFileName()} />
                        {/* <img className='qr-body-bg-img' style={{ backgroundImage: "url(" + `${this.getImageByFileName()}` + ")" }}/> */}
                        {/* <img className='qr-body-bg-img' style={{ backgroundImage: "url(" + `${demoHotelImage}` + ")" }}/> */}
                      </div>
                  }

                </AvForm>
              </div>
              <a href={`https://${this.state.subDomainName}.mysuperbutler.com`} target='_blank' >
                <div className="bottomBtnsDiv demo-p-btn-wrap" style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-start' }}>

                  <Button color="primary"> <span className="comment-text font-16"><TbWorldWww className='mr-2 font-24'/>Go to demo website</span></Button>
                </div>
              </a>

              <div style={{ zIndex: 1 }} className='dr-download-btn-wrap'>
                <button onClick={this.onPNGClick}  className="btn btn-primary dr-download-btn"><IoMdDownload className='font-24 ' />Save as PNG</button>
                {/* <span onClick={this.downloadPDF} title='Download PDF' className="btn btn-primary dr-red-btn"><FaFilePdf className='font-24' />Download</span> */}
              </div>

              <a href={`https://wa.me/${447954405280}`} target='_blank' style={{ zIndex: 1, backgroundColor:"#25D366", lineHeight:"50px" }} className='dr-download-btn-wrap'>
                <button style={{color:'#fff'}} className="btn btn-primary dr-grn-btn"><RiWhatsappFill className='font-24 ' />Need Assistance? Chat Now</button>
                {/* <span onClick={this.downloadPDF} title='Download PDF' className="btn btn-primary dr-red-btn"><FaFilePdf className='font-24' />Download</span> */}
              </a>
             
            </div>
          </div>
          
          <Button className='create-another-htl-btn' color="primary" onClick={() => this.CreateHotel()}>

            <span className="comment-text">Create another</span>

          </Button>

        </div>


        <a class="pwrd-by-s-b" href={`https://www.superbutler.ai/`} target='_blank'>
          <span class="pwrd-by-s-b-i">Powered by</span>
          <img height="40" alt="footer" src={demoHotelFooterImage} />
        </a>
      </div>
    )
  }
}
