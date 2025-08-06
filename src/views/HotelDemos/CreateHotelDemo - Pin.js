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
import { IoMdDownload } from "react-icons/io";
import { FaFilePdf } from "react-icons/fa";
import QRCode from "react-qr-code";
import { FormGroup, Button, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
import S3Browser from '../PhotoGallery/PhotoGallery'
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import * as Enterprise from '../../service/Enterprise';
import {  Link } from 'react-router-dom';
import demoHotelImage from '../../../src/assets/img/brand/Superbutler-homepage-background.bbdf5c27.jpg'
import demoHotelFooterImage from '../../../src/assets/img/brand/superbuter-logo-footer.png'
import { IoIosArrowDown, IoIosArrowUp  } from "react-icons/io";
import Autocomplete from 'react-autocomplete';
import { IoSearchSharp } from "react-icons/io5";
import VerificationInput from "react-verification-input";
import * as ThemeSetting from '../../helpers/DefaultTheme';
var timeZone = '';

const LogobgBody = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
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

const Circleimg1 = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
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

const Circleimg2 = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
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

const Circleimg3 = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
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
      HeaderBgColor:"#000000",
      HeaderTextColor:"#FFFFFF",
      selectedThemeName: "Super Black",
      logoHorizontal:"",
      CountryCode: "gb",
      countryCallingCode: "",
      mobile:"",
      phone:"",
      errorMessage: false,
      IsSave: false,
      creatingHotel: false, 
      showDetail: false,
      showMoreDetail: false,
      subDomainName: "yourhotel",
      hotelName: "Your Hotel",
      FilterEnterprises: [],
      Enterprises: [],
      searchText: "",
      CreateNewDemo: false,
      percentage: 0,
      headerTheme: ThemeSetting.header,
      bodyTheme: ThemeSetting.body,
      footerTheme: ThemeSetting.footer,
      menuJson: ''
      
    }
    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
      
      if(userObj.EnterpriseRestaurant.Country != null) {
        this.state.CountryCode = userObj.EnterpriseRestaurant.Country.IsoCode2.toLowerCase();
        }
    }
  }

  loading = () =>  <div className="page-laoder" style={{ backgroundColor: '#431c51', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <div> 
     <Loader 
  type="Oval"
  color="#fff"
  height={50}	
  width={50}/>  
  <div className="loading-label" style={{color: "#fff"}} >Loading.....</div>
  </div>
  </div> 

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


   // Method to get the text color based on the background color
   getTextBasedOnBackground = (backgroundColor) => {
    const colorMapping = {
      '#0077B6': '#FFFFFF',
      '#000000': '#FFFFFF',
      '#FF5733': '#FFFFFF',
      '#228B22': '#FFFFFF',
      '#FFC0CB': '#333333',
      '#FFD700': '#333333',
      '#D3D3D3': '#333333',
      '#4B0082': '#FFFFFF',
      '#98FF98': '#333333',
      '#DC143C': '#FFFFFF',
      '#FF7F50': '#FFFFFF',
      '#87CEEB': '#333333',
      '#E6E6FA': '#333333',
      '#996515': '#FFFFFF',
      '#6A5ACD': '#FFFFFF',
      '#F5F5F0': '#4D4D4D'
    };

    return colorMapping[backgroundColor] || '#000000'; // Default to black if color is not found
  };

   // Method to get the text color based on the background color
   getThemeNameBasedOnBackground = (backgroundColor) => {
    const colorMapping = {
      '#0077B6': 'Ocean Blue',
      '#000000': 'Super Black',
      '#FF5733': 'Sunset Orange',
      '#228B22': 'Forest Green',
      '#FFD700': 'Lemon Yellow',
      '#D3D3D3': 'Cloud Grey',
      '#4B0082': 'Midnight Purple',
      '#98FF98': 'Mint Green',
      '#DC143C': 'Crimson Red',
      '#FF7F50': 'Peach Coral',
      '#996515': 'Golden Brown',
      '#6A5ACD': 'Slate Blue',
      '#F5F5F0': 'Moonlit Ivory'
    };

    return colorMapping[backgroundColor] || '#4D4D4D'; // Default to black if color is not found
  };


  // Event handler for changing the color
  handleColorChange = (color) => {

    var headerBgColor = color.toUpperCase();
    var headerTextColor = this.getTextBasedOnBackground(headerBgColor);
    var selectedThemeName = this.getThemeNameBasedOnBackground(headerBgColor)
    this.setState({ HeaderBgColor: headerBgColor, HeaderTextColor: headerTextColor, selectedThemeName: selectedThemeName });
  };


  generateTheme = () => 
  {
    var headerTheme = this.state.headerTheme
    //Bg header color
    headerTheme.HeaderBgColor = this.state.HeaderBgColor;
    headerTheme.HeaderNavBgColor = this.state.HeaderBgColor;
    headerTheme.HeaderNavBgColorHover = this.state.HeaderBgColor;
    headerTheme.HeaderBasketBubbleColor = this.state.HeaderBgColor;
    headerTheme.HeaderNotificationBubbleColor = this.state.HeaderBgColor;
    headerTheme.HeaderBtnColor = this.state.HeaderBgColor;
    headerTheme.HeaderBtnColorHover = this.state.HeaderBgColor;

    //Text header Color
    headerTheme.HeaderNavColor = this.state.HeaderTextColor;
    headerTheme.HeaderNavColorActiveAndHover = this.state.HeaderTextColor;
    headerTheme.HeaderBasketBubbleBgColor = this.state.HeaderTextColor;
    headerTheme.HeaderNotificationBubbleBgColor = this.state.HeaderTextColor;
    headerTheme.HeaderBtnBgColor  = this.state.HeaderTextColor;
    headerTheme.HeaderBtnBgColorHover = this.state.HeaderTextColor;
    headerTheme.HeaderIconColor  = this.state.HeaderTextColor;
  
    var bodyTheme = this.state.bodyTheme; 
    //Bg body color
    bodyTheme.BodyHeadingColor = this.state.HeaderBgColor;
    bodyTheme.BodyAColor = this.state.HeaderBgColor;
    bodyTheme.BodyAColorHover = this.state.HeaderBgColor;
    bodyTheme.BodyIconColor = this.state.HeaderBgColor;
    bodyTheme.BodyPrimaryBtnBgColor = this.state.HeaderBgColor;
    bodyTheme.BodyPrimaryBtnBgColorHover = this.state.HeaderBgColor;
    bodyTheme.BackTopBtnBgColorIcon = this.state.HeaderBgColor;
    bodyTheme.BackTopBtnBgColorHover = this.state.HeaderBgColor;
    
    //Text body Color
    bodyTheme.BodyPrimaryBtnColor = this.state.HeaderTextColor;
    bodyTheme.BodyPrimaryBtnColorHover = this.state.HeaderTextColor;
    bodyTheme.BackTopBtnBgColor = this.state.HeaderTextColor;
    bodyTheme.BackTopBtnBgColorIconHover = this.state.HeaderTextColor;

    bodyTheme.ImageRadius = "35%"
    bodyTheme.InputRadius = "5px"
    bodyTheme.ButtonRadius = "25px"

    var footerTheme = this.state.footerTheme;
    //Bg footer color
    footerTheme.FooterHeadingColor = this.state.HeaderBgColor;
    footerTheme.FooterPColor = this.state.HeaderBgColor;
    footerTheme.FooterLinkColor = this.state.HeaderBgColor;
    footerTheme.FooterLinkColorHover = this.state.HeaderBgColor;
    footerTheme.FooterBtnBgColor = this.state.HeaderBgColor;
    footerTheme.FooterBtnBgColorHover = this.state.HeaderBgColor;
    footerTheme.FooterIconColor = this.state.HeaderBgColor;
    
    //Text footer color
    footerTheme.FooterBgColor = this.state.HeaderTextColor;
    footerTheme.FooterBtnColor = this.state.HeaderTextColor;
    footerTheme.FooterBtnColorHover = this.state.HeaderTextColor;
    footerTheme.FooterIconColorHover = this.state.HeaderTextColor;
   

    this.setState({
      headerTheme: headerTheme,
      bodyTheme: bodyTheme,
      footerTheme: footerTheme,
    })

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

setLoaderPercentageBeforeAPI = () => {

  this.timer = setInterval(() => {
    this.setState((prevState) => {

      // Generate a random number between 1 and 5
      const randomIncrement = Math.floor(Math.random() * 5) + 1;

      if (prevState.percentage < 30) { // Target percentage
        var percentageNumber = prevState.percentage +  randomIncrement;
        return { percentage: percentageNumber > 30 ? 30 : percentageNumber};
      } else {
        clearInterval(this.timer); // Stop the interval once the target is reached
        return { percentage: 30 };
      }
    });
  }, 200); // Interval speed

}

setLoaderPercentageAfterAPI = () => {

  clearInterval(this.timer);
  this.timer1 = setInterval(() => {
    this.setState((prevState) => {
     
      // Generate a random number between 1 and 5
      const randomIncrement = Math.floor(Math.random() * 5) + 1;

      if (prevState.percentage < 100) { // Target percentage
        return { percentage: prevState.percentage +  randomIncrement};
      } else {
        clearInterval(this.timer1); // Stop the interval once the target is reached
         window.location.href = "/thankyou"; 
        return { percentage: 100 };
      }
    });
  }, 200); // Interval speed

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
    document.body.classList.add('body-demo-bg-img');

  }

  
  onFocusTab = () => {
    
    this.IsDemoValidation();
    
   }

  componentDidMount() {
    window.addEventListener('focus', this.onFocusTab);
    setTimeout(() => {
      const searchInput = document.querySelector('input[placeholder="Search"]');
      if (searchInput) {
        searchInput.blur();
      }
    }, 100);


    this.IsDemoValidation()
  }


  isBottom(el) {

    if (el != null) return el.getBoundingClientRect().bottom <= window.innerHeight + 5;
    else return null;
  }

  componentWillUnmount() {
    document.body.classList.remove('body-demo-bg-img');
  }

  createdemo = async(event, values) => {
    
    if (this.state.IsSave) return;
		this.setState({ IsSave: true })
    var pin = localStorage.getItem("PinCode")
    var valid = await this.ValidatePin(pin)
    if(!valid)
    {
        this.props.history.push("/pin-validation");
    }

    this.generateTheme();

    //Setting Theme
    let theme = {};

    theme.Header = ThemeSetting.header;
    theme.Body = ThemeSetting.body;
    theme.Footer = ThemeSetting.footer;


   
    var demo = {};
    demo.Name = Utilities.SpecialCharacterEncode(values.hotelName)
    demo.ContactPerson = values.contactPerson
    demo.Email = values.email
    demo.Address = values.address
    demo.Mobile = this.state.countryCallingCode + this.state.mobile
    demo.Logo = this.state.logoHorizontal
    this.setState({creatingHotel: true}, () => this.setLoaderPercentageBeforeAPI());


    var response = await Enterprise.createHotelDemo(demo, theme);
    
    if (!response.HasError && response !== undefined) {
      
      if (response.Dictionary.IsCreated) {
        this.setState({subDomainName: response.Dictionary.SubDomainName, hotelName:  Utilities.SpecialCharacterDecode(values.hotelName)})
        
        localStorage.setItem(Constants.DemoHotel, JSON.stringify(response.Dictionary.NewDemo))
        
        Utilities.notify("Successfully created hotel " + `'${demo.Name}'`, "s");
        
        this.setLoaderPercentageAfterAPI();

      }
  } else 
  {

    if(response.ErrorCodeCsv == "Unauthorize access");{
      window.location.href = "/pin-validation"; 
  }


    this.setState({creatingHotel: false, showDetail: false, IsSave: false});
    Utilities.notify("Something went wrong while creating hotel " + `'${demo.Name}'`, "e");
  }

  this.setState({ IsSave: false })

}

CreateHotel = () => {

  this.setState({showDetail: false, creatingHotel: false, hotelName: "", subDomainName: ""});
}

showMoreDetail = () => {

  this.setState({showMoreDetail: !this.state.showMoreDetail});

}

UpdateSelectedImage = async () => {

  var media = this.state.selectedMedia;
  // var externalService = this.state.externalService;
  var selectedPhoto = media.length > 0 ? `/${media[0].id.replace(process.env.REACT_APP_CONTENT_PATH, "")}` : "";

  
  // if(this.state.isLogo){
  //   externalService.Logo = selectedPhoto;
  // } else {
  //   externalService.CoverPhoto = selectedPhoto;
  // }

  // console.log("ExternalService", externalService);
  this.setState({selectedMedia: [], logoHorizontal: selectedPhoto, Image: null, itemImage: false, ImageGallery: false});
  
}

ValidatePin = async (pin) => {

  let validate = await Enterprise.ValidatePin(pin);
  return validate;

}

IsDemoValidation = async () => {

  this.setState({ showLoader: true });
  let response = await Enterprise.IsDemoValidation();
  
  if (response) {

    var pin = localStorage.getItem("PinCode")
    
    if (!Utilities.stringIsEmpty(pin)) 
    {
     
      var validate = await this.ValidatePin(pin);
      if(!validate)
        {
          this.props.history.push("/pin-validation");
          return;
        } else 
        {
          this.GetEnterprises();
        } 
    } else 
    {
      this.props.history.push("/pin-validation");
    }

  } else 
  {
    this.GetEnterprises();
  }

  this.setState({showLoader: false});

}

GetEnterprises = async () => {

  this.setState({ showLoader: true });
  let data = await Enterprise.GetAllDemoEnterprise();

  if (data.length > 0) {

    this.setState({ Enterprises: data, showLoader: false});
    return
  }
  
  this.setState({showLoader: false});

}

SearchEnterprise(e,value) {
  
  let searchText = value;
  this.setState({searchText: searchText,FilterEnterprises: []});
  
  let filteredData = []
  if (searchText.toString().trim() == '' || searchText.toString().trim().length < 3 ) {
    this.setState({FilterEnterprises: []});
    return;
  }

  filteredData = this.state.Enterprises.filter((enterprise) => {
  let arr = searchText.toUpperCase().split(' ');
  let isExists = false;

    for (var t = 0; t <= arr.length; t++) {

      if (enterprise.Name.toUpperCase().indexOf(arr[t]) !== -1) {
            isExists = true
            break;
      }
    }
    return isExists
  })

  filteredData.forEach((enterprise) => {
    enterprise.FullName = Utilities.SpecialCharacterDecode(`${enterprise.Name}-${enterprise.Id}`)
  })

  this.setState({ FilterEnterprises: filteredData});
}



ImageGalleryModal() {
  this.setState({
    ImageGallery: !this.state.ImageGallery,
  })
}

handleOnChange = (value, data, event, formattedValue) => {
 
  var value = "+"+value;
  var countryCallingCode =  "+" + data.dialCode
  var phoneNo = value.replace(countryCallingCode, '')

  const withoutLeading0 = phoneNo == "" ? "" : parseInt(phoneNo, 10);

  // console.log(withoutLeading0);

  this.setState({phone: formattedValue, mobile: withoutLeading0 + "", countryCallingCode: data.dialCode});

  // this.setState({ mobOne: '+' + value, dialCode: '+'+ data.dialCode, focusout: false });
}

OnItemSelect(value) {

  console.log("Value:", value);
  let enterprises = this.state.FilterEnterprises.filter((enterprise) => {
      return enterprise.Name == value
  });

  this.setState({SelectedEnterprise : enterprises[0], searchText : `${enterprises[0].Name}`}, () => {
    localStorage.setItem(Constants.DemoHotel, JSON.stringify(this.state.SelectedEnterprise))
    this.props.history.push("/thankyou");

  })

}

  render() {
    
    if(this.state.showLoader) return this.loading();

    const CircularProgressBar = ({ sqSize, strokeWidth, percentage }) => {
      const radius = (sqSize - strokeWidth) / 2;
      const viewBox = `0 0 ${sqSize} ${sqSize}`;
      const dashArray = radius * Math.PI * 2;
      const dashOffset = dashArray - (dashArray * percentage) / 100;
    
      return (
        <svg width={sqSize} height={sqSize} viewBox={viewBox}>
          <circle
            className="circle-background-demo"
            cx={sqSize / 2}
            cy={sqSize / 2}
            r={radius}
            strokeWidth={`${strokeWidth}px`}
          />
          <circle
            className="circle-progress-demo"
            cx={sqSize / 2}
            cy={sqSize / 2}
            r={radius}
            strokeWidth={`${strokeWidth}px`}
            transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
            style={{
              strokeDasharray: dashArray,
              strokeDashoffset: dashOffset,
            }}
          />
          <text
            className="circle-text-demo"
            x="50%"
            y="50%"
            dy=".3em"
            textAnchor="middle">
            {`${percentage}%`}
          </text>
        </svg>
      );
    };
    
    // Default props
    CircularProgressBar.defaultProps = {
      sqSize: 200,
      percentage: 67, // Default percentage
      strokeWidth: 10,
    };

    const { showMoreDetail, subDomainName, percentage } = this.state; // Access the state using `this.state`
    const { isHovered } = this.state; 
    return (
      <div className='create-demo-page-wrap body-demo-bg-img' >
      {!this.state.creatingHotel && !this.state.showDetail &&
      <div className='card' id='header'>
        <div className='d-flex align-items-center justify-content-center demo-page-logo-wrap mt-4'>
            <img alt='Superbutler'style={{height:"auto"}} width={200} src='https://www.superbutler.ai/_next/static/media/superbuter-logo-whiteicon-ai.ccfd6ff5.png'></img>
        </div>
       
                            {/* <span className="mb-3 text-white text-center font-22 mt-5">Search Hotel</span> */}
                            <div className='position-relative mt-5 mb-3'>
                            <div className="input-group h-set-new demo-p-auto-complete">
                                    <Autocomplete 
                                     className="form-control"
                                     getItemValue={(item) => item.Name}
                                    items={this.state.FilterEnterprises}
                                    renderItem={(item, isHighlighted) =>
                                    
                                     <div style={{ background: isHighlighted ? 'lightgray' : 'white', lineHeight: "40px"}}>
                                     {Utilities.SpecialCharacterDecode(`${item.Name}`)}
                                        </div>
                                    }
                                value={ Utilities.SpecialCharacterDecode(this.state.searchText)}
                                onChange={(event, value) => this.SearchEnterprise(event,value)}
                                onSelect={(value) => this.OnItemSelect(value)}
                                inputProps={{ placeholder: "Search demo by hotel name" }}
                                // selectOnBlur={true}
                                />
                                    </div> 
                                    <div className='demo-s-icon-a'>
                                < IoSearchSharp></IoSearchSharp>
                                </div>
                                    </div>
                                    <div className='mb-3 text-white text-center font-22 mt-5 d-flex align-items-center justify-content-center' style={{gap:15}}> <span class="demo-divider"></span> OR <span class="demo-divider"></span> </div>

            <div className='d-flex align-items-center justify-content-center'>
              <h3 className="card-title card-new-title ml-0 mb-0 pl-0 mr-0">Create your hotel demo in less than 30 seconds</h3>
            </div>
        <div className="card-body">
        <div class=" card-body-inner modal-media-main external-service-wrap" style={{maxWidth:600}}>

        { !this.state.showDetail  &&
         
         this.state.CreateNewDemo ? 

          <AvForm onValidSubmit={this.createdemo}>
              <div className="row mb-4">
                <div className="col-md-12">
                  <div className="form-group">
                   
                    <AvField placeholder="Enter your hotel name" errorMessage="This is a required field" name="hotelName" type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}

                    />
                  </div>
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-md-12">
                  <div className="form-group d-flex align-items-center" style={{gap:10}}>
                    <label id="SelectTheme" className="control-label">Select theme
                    </label>
                    <div className='demo-theme-d-down ml-auto'>
                    <Dropdown>
                        <Dropdown.Toggle  id="dropdown-basic">
                        <span class="m-b-0 statusChangeLink w-100">
                                  <div className='d-flex assign-text-img align-items-center justify-content-between w-100'>
                                    
                                    <span className='mr-2'>{this.state.selectedThemeName}</span>
                                    <span className='theme-d-wrap' style={{background: this.state.HeaderBgColor}}></span>
                                  </div>
                                </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>

                              <Dropdown.Item  onClick={()=>this.handleColorChange("#0077B6")}  >
                                <span class="m-b-0 statusChangeLink w-100">
                                  <div className='d-flex assign-text-img align-items-center justify-content-between w-100'>
                                    
                                    <span className='mr-2'>Ocean Blue</span>
                                    <span className='theme-d-wrap' style={{background:"#0077B6"}}></span>
                                  </div>
                                </span>
                              </Dropdown.Item>
                              <Dropdown.Item  onClick={()=>this.handleColorChange("#000000")}  >
                              <span class="m-b-0 statusChangeLink w-100">
                                  <div className='d-flex assign-text-img align-items-center justify-content-between w-100'>
                                    
                                    <span className='mr-2'>Super Black</span>
                                    <span className='theme-d-wrap' style={{background:"#000000"}}></span>
                                  </div>
                                </span>
                              </Dropdown.Item>
                              <Dropdown.Item  onClick={()=>this.handleColorChange("#FF5733")}  >
                              <span class="m-b-0 statusChangeLink w-100">
                                  <div className='d-flex assign-text-img align-items-center justify-content-between w-100'>
                                    
                                    <span className='mr-2'>Sunset Orange</span>
                                    <span className='theme-d-wrap' style={{background:"#FF5733"}}></span>
                                  </div>
                                </span>
                              </Dropdown.Item>
                              <Dropdown.Item  onClick={()=>this.handleColorChange("#228B22")}  >
                              <span class="m-b-0 statusChangeLink w-100">
                                  <div className='d-flex assign-text-img align-items-center justify-content-between w-100'>
                                    
                                    <span className='mr-2'>Forest Green</span>
                                    <span className='theme-d-wrap' style={{background:"#228B22"}}></span>
                                  </div>
                                </span>
                              </Dropdown.Item>
                              <Dropdown.Item  onClick={()=>this.handleColorChange("#4B0082")}  >
                              <span class="m-b-0 statusChangeLink w-100">
                                  <div className='d-flex assign-text-img align-items-center justify-content-between w-100'>
                                    
                                    <span className='mr-2'>Midnight Purple</span>
                                    <span className='theme-d-wrap' style={{background:"#4B0082"}}></span>
                                  </div>
                                </span>
                              </Dropdown.Item>
                             
                              <Dropdown.Item  onClick={()=>this.handleColorChange("#DC143C")} >
                              <span  class="m-b-0 statusChangeLink w-100">
                                  <div className='d-flex assign-text-img align-items-center justify-content-between w-100'>
                                    
                                    <span className='mr-2'>Crimson Red</span>
                                    <span className='theme-d-wrap' style={{background:"#DC143C"}}></span>
                                  </div>
                                </span>
                              </Dropdown.Item>
                              <Dropdown.Item  onClick={()=>this.handleColorChange("#FF7F50")} >
                              <span  class="m-b-0 statusChangeLink w-100">
                                  <div className='d-flex assign-text-img align-items-center justify-content-between w-100'>
                                    
                                    <span className='mr-2'>Peach Coral</span>
                                    <span className='theme-d-wrap' style={{background:"#FF7F50"}}></span>
                                  </div>
                                </span>
                              </Dropdown.Item>
                             
                              <Dropdown.Item  onClick={()=>this.handleColorChange("#996515")} >
                              <span  class="m-b-0 statusChangeLink w-100">
                                  <div className='d-flex assign-text-img align-items-center justify-content-between w-100'>
                                    
                                    <span className='mr-2'>Golden Brown</span>
                                    <span className='theme-d-wrap' style={{background:"#996515"}}></span>
                                  </div>
                                </span>
                              </Dropdown.Item>
                              <Dropdown.Item  onClick={()=>this.handleColorChange("#6A5ACD")} >
                              <span  class="m-b-0 statusChangeLink w-100">
                                  <div className='d-flex assign-text-img align-items-center justify-content-between w-100'>
                                    
                                    <span className='mr-2'>Slate Blue</span>
                                    <span className='theme-d-wrap' style={{background:"#6A5ACD"}}></span>
                                  </div>
                                </span>
                              </Dropdown.Item>
                             
                             
                        </Dropdown.Menu>
                      </Dropdown>
                      </div>
                  </div>
                </div>
              </div>
              <div className='slide-toggle-demo-wrap-par text-white  cursor-pointer mb-3' onClick={() => this.showMoreDetail()}>
              <a className='text-white d-flex'> Additional info (optional) </a>
              {showMoreDetail ? <IoIosArrowUp /> : <IoIosArrowDown /> }  
              </div>

          <>
          <div  className={`slide-toggle-demo-wrap ${showMoreDetail ? 'slide-toggle-demo-wrap-open' : ''}`}>

              <div className="row mb-4">
                <div className="col-md-12">
                  <div className="form-group">
                    <label id="firstName" className="control-label">Hotel Address
                    </label>
                    <AvField name="address" type="text" className="form-control"/>
                  </div>
                </div>
              </div>
             
              <div className="row mb-4">
                <div className="col-md-12">
                  <div className="form-group">
                    <label id="firstName" className="control-label">Hotel Email Address
                    </label>
                    <AvField name="email" type="text" className="form-control"/>
                  </div>
                </div>
              </div>
              
              <div className="row mb-4">
                <div className="col-md-12">
                  <div className="form-group">
                    <label id="firstName" className="control-label">Hotel Mobile
                    </label>
                    <div className='custom-ph-no'>
                    <PhoneInput
                    autocompleteSearch
                    enableSearch
                      country={this.state.CountryCode}
                      value={this.state.countryCallingCode + this.state.mobile}
                      // onChange={phone => this.setState({ phone })}
                      onChange={this.handleOnChange}
                    />
                    </div>
                  </div>
                </div>
              </div>
             
              <div className="row mb-4">
                <div className="col-md-12">
                  <div className="form-group">
                    <label id="firstName" className="control-label">Contact Person
                    </label>
                    <AvField name="contactPerson" type="text" className="form-control"/>
                  </div>
                </div>
              </div>

              {/* <div className="row mb-4">
                  <div className="form-group">
                    <label id="lbllogo" className="control-label mb-0">Logo
                    </label>
                    <p className='mb-1'>Upload a PNG/JPG file not more than 1 MB in size.</p>
                    <div className='logo-image-wrap cvr-p' onClick={() => this.ImageGalleryModal()}>
                      {
                        this.state.logoHorizontal !="" ? 
                        <div className='inner-logo-img cvr-p'>
                          <img src={Utilities.generatePhotoURL(this.state.logoHorizontal)} />
                        </div>
                        :
                        <div className='logo-image-wrap cvr-p' onClick={() => this.ImageGalleryModal()}>
                        <div className='logo-inner text-center d-flex'>
                          <i className="fa fa-plus"></i>
                        </div>
                      </div>
                      }
                    </div>
                    
                  </div>
                </div>
              </div> */}
              </div>
              </>

           
              <div className="bottomBtnsDiv demo-p-btn-wrap" style={{ marginTop: 20, display:'flex', justifyContent:'flex-start' }}>

{/* <Link style={{outline:"none"}} to="/hotel-demos"> <Button type="button" color="secondary" style={{ marginRight: 10 }}>{Labels.Cancel}</Button> </Link> */}

<Button color="primary" >
{this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
: <span className="comment-text">Create My Demo</span>}
</Button>
</div>

          </AvForm>
          :

          <div className="bottomBtnsDiv demo-p-btn-wrap" style={{marginTop: 20, display:'flex', justifyContent:'flex-start' }}>

          {/* <Link style={{outline:"none"}} to="/hotel-demos"> <Button type="button" color="secondary" style={{ marginRight: 10 }}>{Labels.Cancel}</Button> </Link> */}
          
          <Button color="primary" onClick={() => this.setState({CreateNewDemo: true})} >
           <span className="comment-text">Create New Demo</span>
          </Button>
          </div>
       }

     
      
          </div>
      </div>
      </div>
}

{ this.state.showDetail &&
        <div className='d-flex flex-column '>
          <div>
<div className='modal-media-main download-qr-m-wrap download-qr-m-wrap-override'>
<div className='d-flex align-items-center justify-content-center demo-page-logo-wrap mt-4'>
            <img alt='Superbutler'style={{height:"auto"}} width={200} src='https://www.superbutler.ai/_next/static/media/superbuter-logo-whiteicon-ai.ccfd6ff5.png'></img>
        </div>
        <div className='d-flex align-items-center justify-content-center mb-5 mt-5'>
        <span className="thank-icon-border mr-3"><i class="thank-success-icon fa fa-check" aria-hidden="true"></i></span>
        <div>
        <h3 className="card-title card-new-title ml-0 mb-0 pl-0 mt-0" style={{textAlign:"left"}}>Congarats!</h3>
        <p className='text-white mt-2 mb-0'>Your hotel demo is ready. Please find your demo QR below</p>
        </div>
        </div>
  <div className='modal-body'>
<AvForm>

<div ref={this.ref} id='ModalPDF'>
          

              <div className='qr-body-inner-wrap'>
              <img  className='qr-body-bg-img' style={{ backgroundImage: "url(" + `${demoHotelImage}` + ")" }}>
              </img>

                <div className='mb-4'>
                   <div className='qr-logo-wrap d-flex align-items-center justify-content-center'>
        <h6 className="card-title ml-0 mb-0 pl-0" style={{fontSize: "28px", maxWidth: "400px", marginTop: "30px"}}>{this.state.hotelName}</h6>
        </div>

                  <div class="qr-images-wrapper">
                    <div onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} class="circle-image img1" style={{ backgroundImage: "url(" + `${demoHotelImage}` + ")" }}>
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
                    <div onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} class="circle-image img2" style={{ backgroundImage: "url(" + `${demoHotelImage}` + ")" }}>
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
                    <div onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} class="circle-image img3" style={{ backgroundImage: "url(" + `${demoHotelImage}` + ")" }}>
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
                        <span>In-Room Dining</span>
                        <span>Room Support</span>
                        <span>Gourmet Room Services 24/7</span>
                      </div>
                    </div>
                    <div className='scan-qr-inner-r position-relative' style={{ display: 'inline-block' }}>
                      <div style={{ height: "auto", marginLeft: "auto", maxWidth: 120, width: "100%" }}>
                        <QRCode
                          size={256}
                          style={{ padding: 5, background: "#fff", height: "auto", maxWidth: "100%", width: "100%" }}
                          value={`https://${this.state.subDomainName}.mysuperbutler.com`}
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
                  {/* <div style={{ display: "none" }} onClick={() => this.DownloadQrModal()} className='close-d-res-btn'>
                    Close
                  </div> */}


                </div>
                <div className='pwrd-by-s-b'>
                  <span className='pwrd-by-s-b-i'>Powered by</span>
                  <img height={40} src={demoHotelFooterImage} />
                </div>

              </div>
              </div>

 </AvForm>
 </div>
 <a href={`https://${this.state.subDomainName}.mysuperbutler.com`}>
 <div className="bottomBtnsDiv demo-p-btn-wrap" style={{ marginTop: 20, display:'flex', justifyContent:'flex-start'}}>

{/* <Link style={{outline:"none"}} to="/hotel-demos"> <Button type="button" color="secondary" style={{ marginRight: 10 }}>{Labels.Cancel}</Button> </Link> */}

<Button color="primary"> <span className="comment-text font-16">View Demo</span></Button>
</div>
</a>


 <div style={{ zIndex: 1 }} className='dr-download-btn-wrap'>
            <button onClick={this.onPNGClick} title='Download PNG' className="btn btn-primary dr-grn-btn"><IoMdDownload  className='font-24 ' />Save as PNG</button>
            {/* <span onClick={this.downloadPDF} title='Download PDF' className="btn btn-primary dr-red-btn"><FaFilePdf className='font-24' />Download</span> */}
          </div>
</div>
</div>
<Button className='create-another-htl-btn' color="primary" onClick={() => this.CreateHotel()}>

 <span className="comment-text">Create another</span>

</Button>

        </div>
      }
        
          { this.state.creatingHotel &&  
          <div>
           <div className='d-flex align-items-center justify-content-center demo-page-logo-wrap mt-4'>
           <img alt='Superbutler'style={{height:"auto"}} width={200} src='https://www.superbutler.ai/_next/static/media/superbuter-logo-whiteicon-ai.ccfd6ff5.png'></img>
       </div>
          <div className="multi-spinner-container-p">
            <div class="multi-spinner-container">
              <div>
                <CircularProgressBar
                  sqSize={150}   // Set square size
                  strokeWidth={10} // Set stroke width
                  percentage={percentage > 100 ? 100 : percentage }  // Set your percentage
                />
              </div>

            </div>
            <div className="loading-label">Creating your Hotel demo, please wait...</div>
          </div> 
            {/* <div>
              <div className='d-flex align-items-center justify-content-center demo-page-logo-wrap mt-4'>
                <img alt='Superbutler' style={{ height: "auto" }} width={200} src='https://www.superbutler.ai/_next/static/media/superbuter-logo-whiteicon-ai.ccfd6ff5.png'></img>
              </div>
              <div className='demo-verification-pin-wrap-p'>
                <div className='d-flex align-items-center justify-content-center'>
                  <h3 className="card-title card-new-title ml-0 mb-0 pl-0 mr-0">Please enter your PIN</h3>

                </div>
                <VerificationInput
                  placeholder="_"
                  length={6}
                  validChars="0-9" inputProps={{ inputMode: "numeric" }}

                  classNames={{
                    container: "demo-verification-pin-wrap",
                    character: "character",
                    characterInactive: "character--inactive",
                    characterSelected: "character--selected",
                    characterFilled: "character--filled",
                  }}
                />
                <div
                  className="alert alert-danger font-14 mb-0 text-danger"
                  style={{ color: "#a94442!important", padding: "2px 10px" }}
                >
                  Invalid PIN
                </div>
                <div className="bottomBtnsDiv demo-p-btn-wrap w-100" style={{ display: 'flex', justifyContent: 'flex-start' }}>

                 

                  <Button color="primary" >
                    {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                      : <span className="comment-text">Continue</span>}
                  </Button>
                </div>
              </div>
            </div> */}
          </div>
  } 
  
        <a class="pwrd-by-s-b" href={`https://www.superbutler.ai/`} target='_blank'>
          <span class="pwrd-by-s-b-i">Powered by</span>
          <img height="40" alt="footer" src="https://speaktest.superbutler.ai/static/media/superbuter-logo-whiteicon-ai.043890f7a61dc44f2e96.png" />
        </a>
      </div>
    )
  }
}
