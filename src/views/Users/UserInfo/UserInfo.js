import React, { Component } from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Link } from "react-router-dom";
import 'sweetalert/dist/sweetalert.css';
import { FormGroup, Button } from 'reactstrap';
import * as EnterpriseUserService from '../../../service/EnterpriseUsers';
import * as EnterpriseService from '../../../service/Enterprise';
import * as OrderRoutingService from '../../../service/OrderRouting';
import * as DepartmentService from '../../../service/Department';
import * as AreaService from '../../../service/Area';
import * as Utilities from '../../../helpers/Utilities';
import Constants from '../../../helpers/Constants';
import Config from '../../../helpers/Config';
import GlobalData from '../../../helpers/GlobalData';
import Autocomplete from 'react-autocomplete';
import Loader from 'react-loader-spinner';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import 'react-select-search/style.css'
import { FaCheck } from "react-icons/fa";
import Avatar from 'react-avatar';
import { BsAsterisk } from "react-icons/bs";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Dropdown from 'react-bootstrap/Dropdown';
const passwordTextValidation = (value, ctx) => {

  if (value.toUpperCase() === "PASSWORD") {
    return "Your password not be 'password";
  }
  return true;
}


const RoleSelectionValidation = (value, ctx) => {

  if (value === "0") {
    return "Please select user role";
  }
  return true;
}

const DepartmentSelectionValidation = (value, ctx) => {

  if (value === "0") {
    return "Please select user department";
  }
  return true;
}

const ServiceSelectionValidation = (value, ctx) => {

  if (value === "0") {
    return "Please select service";
  }
  return true;
}

const MobileNumValidation = (value, ctx) => {
 if ((/^[+()\d-]+$/.test(value) || value == "") && (value.substr(0,1) == '+' && value.substr(1,1) != 0) ) {
    return true;
  } else {
    return "Please enter a valid mobile number."
  }
}
const phoneNumValidation = (value, ctx) => {
 if ((/^[+()\d-]+$/.test(value) || value == "")) {
    return true;
  } else {
    return "Invalid input"
  }
}

class UserInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      User: {},
      UserId: 0,
      loggedInUser: [],
      hdAreaCode: 0,
      PostCode: "",
      validateUserName: true,
      UserFieldFocused: false,
      UserNameText: "",
      ShowError: false,
      AreaId: 0,
      AreaText: "",
      Areas: [],
      ShowLoader: true,
      type: 'password',
      ShowPostcodeLoader: false,
      isRequired: true,
      IsSave: false,
      FromInvalid: false,
      id: props.userId,
      save: props.save,
      selectedRole: "0",
      selectedServiceId: 0,
      selectedDepartementId: 0,
      selectedDepartementCsv: "",
      selectedDepartementName: "",
      services: [],
      departments: [],
      filteredDepartments: [],
      addNew: false,
      departmentList:[],
      selectedDepartment:[],
      SelectedUserName:'',
      callingCode:'',
      mobOne: '',
      dialCode:'',
      mobError: false,
      focusout: true,
      roleSelectionError: false,
      showDropdown: false,
      showRoutingDropdown: false,
      selectedServices: [],
      enterpriseServices: [],
      chkAllServices: false,

      selectedOrderRouting: [],
      orderRouting: [],
      chkAllOrderRouting: false,

      options: [
        {
          name: 'Electrician',
          value: 'LY'
        },
        {
          name: 'Plumber',
          value: 'LI'
        },
      ],

    }
    this.btnSave = React.createRef();
    this.phone = React.createRef();
    this.form = React.createRef();
    this.showHide = this.showHide.bind(this);
    this.SaveEnterpriseUser = this.SaveEnterpriseUser.bind(this);

    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      this.state.loggedInUser = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
      this.state.callingCode = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT)).EnterpriseRestaurant.Country != null ? JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT)).EnterpriseRestaurant.Country.CallingCode : ''
      // this.state.selectedRole = this.state.loggedInUser.RoleLevel == 3 ? 3 : 4

    }
    else {
      this.props.history.push('/Dashboard')
    }

  }

  toggleDropdown = () => {
    this.setState((prevState) => ({
      showDropdown: !prevState.showDropdown,
    }));
  };

  closeDropdown = () => {
    this.setState({ showDropdown: false });
  };


  toggleOrderRoutingDropdown = () => {
    this.setState((prevState) => ({
      showRoutingDropdown: !prevState.showRoutingDropdown,
    }));
  };

  closeOrderRoutingDropdown = () => {
    this.setState({ showRoutingDropdown: false });
  };



handleOrderRoutingItemChange = (value) => {
  const { selectedOrderRouting, orderRouting } = this.state;
  const updatedItems = selectedOrderRouting.includes(value)
    ? selectedOrderRouting.filter((item) => item !== value)
    : [...selectedOrderRouting, value];

  // Check if all services are selected
  const allSelected = orderRouting.length > 0 && updatedItems.length === orderRouting.length;
  // Check if none are selected
  const noneSelected = updatedItems.length === 0;

  this.setState(
    {
      selectedOrderRouting: updatedItems,
      chkAllOrderRouting: allSelected,
    },
    () => {
      this.setSelectedOrderRouting(updatedItems);
      // If none selected, uncheck chkAllServices
      if (noneSelected) {
        this.setState({ chkAllOrderRouting: false });
      }
    }
  );
};
  handleCheckAllOrderRouting = () => {

    let checked = !this.state.chkAllOrderRouting;
    let orderRouting = this.state.orderRouting;
    this.setState({ chkAllOrderRouting: checked }, () => {
      if (checked) {
        orderRouting.forEach(routing => routing.IsSelected = true);
      } else {
        orderRouting.forEach(routing => routing.IsSelected = false);
      }

        this.setState({orderRouting: orderRouting, selectedOrderRouting: orderRouting.filter(routing => routing.IsSelected)})
      
    });
  };



handleItemChange = (value) => {
  const { selectedServices, enterpriseServices } = this.state;
  const updatedItems = selectedServices.includes(value)
    ? selectedServices.filter((item) => item !== value)
    : [...selectedServices, value];

  // Check if all services are selected
  const allSelected = enterpriseServices.length > 0 && updatedItems.length === enterpriseServices.length;
  // Check if none are selected
  const noneSelected = updatedItems.length === 0;

  this.setState(
    {
      selectedServices: updatedItems,
      chkAllServices: allSelected,
    },
    () => {
      this.setSelectedServices(updatedItems);
      // If none selected, uncheck chkAllServices
      if (noneSelected) {
        this.setState({ chkAllServices: false });
      }
    }
  );
};
  handleCheckAll = () => {

    let checked = !this.state.chkAllServices;
    let enterpriseServices = this.state.enterpriseServices;;
    this.setState({ chkAllServices: checked }, () => {
      if (checked) {
        enterpriseServices.forEach(service => service.IsSelected = true);
      } else {
        enterpriseServices.forEach(service => service.IsSelected = false);
      }

        this.setState({enterpriseServices: enterpriseServices, selectedServices: enterpriseServices.filter(service => service.IsSelected)})
      
    });
  };

  generateEnterpriseIdCsv = () => {
    let csv = "";
    this.state.selectedServices.forEach((enterprise, index) => {
        csv += enterprise.Id + ",";
    });
    
      csv = Utilities.FormatCsv(csv, ',');
      if(csv== null || csv == undefined || csv == "") {
        csv = "0"
      }
      return csv;
  }

  generateOrderRoutingIdCsv = () => {
    let csv = "";
    this.state.selectedOrderRouting.forEach((routing, index) => {
        csv += routing.Id + ",";
    });
    csv = Utilities.FormatCsv(csv, ',');
    if(csv== null || csv == undefined || csv == "") {
      csv = "0"
    }
    return csv;
  }
  

   handleClickOutside = (e) => {
    if (this.dropdownRef && !this.dropdownRef.contains(e.target)) {
      this.closeDropdown();
    }
  };

  handleOnChange = (value, data, event, formattedValue) => {
    // console.log('value',value)
    // console.log('data',data)
    this.setState({ mobOne: '+' + value, dialCode: '+'+ data.dialCode, focusout: false });
  }
  handleOnFocus = (value, data, event, formattedValue) => {
    // console.log('value',data)
    var mob = value.target.value.replace("-", ' ').replace(/ /g, '')
    this.setState({ mobOne: mob, dialCode: '+'+ data.dialCode, focusout: false });
  }

  loading = () => <div className="page-laoder page-laoder-menu">
    <div className="loader-menu-inner">
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
      <div className="loading-label">Loading.....</div>
    </div>
  </div>


  GetAreaBy() {

    var value = this.state.AreaText;
    if (value == "") {
      return
    }

    this.setState({ ShowError: false, AreaId: 0 });
    value = Utilities.FormatPostCodeUK(value);
    this.GetAreaByKeyword(value);

  }

  OnItemSelect(value) {

    this.setState({ AreaText: value })

    let areas = this.state.Areas;

    let area = areas.filter((area) => {
      return area.Area2 = value
    })
    // alert(area[0].Id);
    this.setState({ AreaId: area[0].Id })
  }


  // #region api calling
  GetAreaByKeyword = async (txtSearch) => {

    this.setState({ ShowPostcodeLoader: true })

    var data = await AreaService.GetBy(txtSearch);
    if (data.length > 0) {
      this.setState({ Areas: data, AreaText: data[0].Area2, AreaId: data[0].Id });
    } else {
      this.setState({ ShowError: true, });
    }
    this.setState({ ShowPostcodeLoader: false })

  }

  onChangeText = (key, value) => {
    this.setState({ [key]: value })
  }
  showHide(e) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      type: this.state.type === 'password' ? 'text' : 'password'
    })
  }
  SaveEnterpriseUserApi = async (userObject, isNewUser) => {

    let message = (isNewUser === true) ? await EnterpriseUserService.Save(userObject) : await EnterpriseUserService.Update(userObject)
    this.setState({ IsSave: false, FromInvalid: false });
    if (message === '1') {
      if (isNewUser == true)
        Utilities.notify("User " + this.state.SelectedUserName + " has been created successfully", 's');
      if (isNewUser != true)
        Utilities.notify("User " + this.state.SelectedUserName + " has been Updated successfully", 's');

      this.props.saved(-1);
    }

    this.setState({ IsSave: false })

  }

  SaveEnterpriseUser(event, values) {
    if (this.state.IsSave) return;
    this.setState({ IsSave: true })

    if (!this.state.validateUserName || !this.state.isRequired) {
      this.setState({ IsSave: false })
      return;
    }

    if(this.state.selectedRole == 0) {
      this.setState({ IsSave: false, roleSelectionError: true })
      return;
    }

    if(this.state.mobOne == "") {
      this.setState({ IsSave: false, mobError: true })
      return;
    }


    let user = EnterpriseUserService.UserObject
    let userToUpdate = this.state.User;
    let loggedInUser = this.state.loggedInUser
    let userID = Object.keys(userToUpdate).length > 0 ? userToUpdate.EnterpiseUser.UserID : 0;
    user.EUser.Id = userID;
    user.EUser.Title = values.ddlTitle;
    user.EUser.FirstName = values.frstName;
    user.EUser.SurName = values.lastName;
    user.EUser.PrimaryEmail = values.lognEmail;
    user.EUser.Gender = values.ddlGender;
    user.EUser.Mobile1 = this.state.mobOne.replace(/-/g, ' ').replace(/\(/g, " ").replace(/\)/g, " ").replace(/ /g, '');
    user.EUser.Mobile2 = values.mobTwo;
    user.EUser.LandLine1 = values.lineOne;
    user.EUser.LandLine2 = values.lineTwo;
    user.EUser.CreatedBy = loggedInUser.Id;
    user.EUser.RoleLevel = this.state.selectedRole;
    user.EUser.EnterpriseIdCsv = this.generateEnterpriseIdCsv();
    user.EUser.OrderRoutingIdCsv = this.generateOrderRoutingIdCsv();
    user.EUser.AddressUser.AreaID = this.state.AreaId;
    user.EUser.AddressUser.Address1 = ""; //values.address === null ? "" : values.address;
    user.EUser.EnterpiseUser.EnterpriseID = loggedInUser.Enterprise.Id;
    user.EUser.EnterpiseUser.RoleID = this.state.selectedRole;
    user.EUser.EnterpiseUser.DepartmentId = Number(this.state.selectedRole) == 6 ? this.state.selectedDepartementId : 0;
    user.EUser.EnterpiseUser.DepartmentIDCsv = Number(this.state.selectedRole) == 6 ? this.state.selectedDepartementCsv : "";
    user.EUser.EnterpiseUser.DepartmentName = Number(this.state.selectedRole) == 6 && this.state.selectedDepartementId == -1 ? values.newDept : "";
    user.EUser.EnterpiseUser.UserID = userID;
    user.EUser.AddressUser.UserID = userID;
    user.Password = values.passwrd;
    user.ConfirmPassword = values.cnfrmPswrd;
    user.LoginUserName = values.loginusrName;
    //Saving
    if (userID === 0) {
      this.SaveEnterpriseUserApi(user, true);
      return;
    }

    //updating
    this.SaveEnterpriseUserApi(user, false);
  }


  GetEnterpriseUser = async (userId) => {

    this.setState({ User: {} });

    var data = await EnterpriseUserService.GetUser(userId);

    if (Object.keys(data).length != 0) {
      this.setState({ User: data }, () => {
        // console.log('data', data.RoleLevel)
        this.state.selectedRole = data.RoleLevel;
        this.state.selectedDepartementId = data.EnterpiseUser.DepartmentID;
        this.state.SelectedUserName = data.DisplayName != null ? data.DisplayName : data.FirstName + " " + data.SurName
        this.state.selectedDepartementCsv = userId != 0 ? ',' + data.EnterpiseUser.DepartmentIDCsv.replace(/ +/g, "")  : ''
        this.GetDepartmentss();
      });

      this.setState({ chkAllServices: data.EnterpriseIdCsv == "" || data.EnterpriseIdCsv == null || data.EnterpriseIdCsv == "null",
        chkAllOrderRouting: data.OrderRoutingIdCsv == "" || data.OrderRoutingIdCsv == null || data.OrderRoutingIdCsv == "null"
       });

      this.GetUserArea(data.AddressUser.AreaID);

      var enterprise = this.state.loggedInUser.Enterprise;

      if(enterprise.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.HOTEL){
      this.GetEnterpriseServices(enterprise.Id, userId);
    }
    if(enterprise.EnterpriseTypeId != Constants.ENTERPRISE_TYPE_IDS.HOTEL){
      this.GetOrderRouting();
    }
    }
    // console.log('users', data)
    this.setState({ ShowLoader: false });

  }

  
  GetEnterpriseServices = async (parentId) => {
    let data = await EnterpriseService.GetAllServices(parentId);
    var user = this.state.User;

    
    if(data.length > 0 ) {
        data = data.filter((val) => !val.IsChurned && !val.IsExternal && !val.IsDeleted && val.IsActive && val.EnterpriseTypeId != 15)
        this.setState({ enterpriseServices: data },() => {
       if(user.Id != 0)
      {
        let selectedServices = [];
        this.state.enterpriseServices.forEach(service => {
          if (Utilities.isExistInCsv(service.Id, user.EnterpriseIdCsv + ",", ',') || user.EnterpriseIdCsv == '' || user.EnterpriseIdCsv == undefined || user.EnterpriseIdCsv == null) {
            selectedServices.push(service);
            service.IsSelected = true;
          }
        });
        this.setState({ selectedServices: selectedServices })
      }

        })
      }
  }

  setSelectedServices = (selectedServices) => {
    
    let enterpriseServices = this.state.enterpriseServices;
    enterpriseServices.forEach(service => {
      if (selectedServices.includes(service)) {
        service.IsSelected = true;
      } else {
        service.IsSelected = false;
      }
    });
    this.setState({ selectedServices: selectedServices })
  }


  GetOrderRouting = async () => {
    let data = await OrderRoutingService.GetOrderRouting();
    var user = this.state.User;
    
    if(data.length > 0 ) {
        this.setState({ orderRouting: data },() => {
       if(user.Id != 0)
      {
        let selectedOrderRouting = [];
        this.state.orderRouting.forEach(routing => {
          if (Utilities.isExistInCsv(routing.Id, user.OrderRoutingIdCsv + ",", ',') || user.OrderRoutingIdCsv == '' || user.OrderRoutingIdCsv == undefined || user.OrderRoutingIdCsv == null) {
            selectedOrderRouting.push(routing);
            routing.IsSelected = true;
          }
        });
        this.setState({ selectedOrderRouting: selectedOrderRouting })
      }

        })
      }
  }

  setSelectedOrderRouting = (selectedOrderRouting) => {
    
    let orderRouting = this.state.orderRouting;
    orderRouting.forEach(routing => {
      if (selectedOrderRouting.includes(routing)) {
        routing.IsSelected = true;
      } else {
        routing.IsSelected = false;
      }
    });
    this.setState({ selectedOrderRouting: selectedOrderRouting })
  }


  GetDepartmentss = async () => {

    var data = await DepartmentService.GetAll();

    if (data.length !== 0) {
      if(this.state.id != 0){
        var DeptIdCsv =  this.state.User.EnterpiseUser.DepartmentIDCsv.split(",")
        var department = []
        for (let i = 0; i < DeptIdCsv.length; i++) {
          const element = DeptIdCsv[i].trim()
          var filter = data.filter(v=> v.Id == element.trim())
          department  =  [...department , ...filter]
        }
        // console.log('users', department)
        this.setState({ selectedDepartment: department })
      }
      data.push({Id:'-1', Name:'+ Add Department'});
      this.setState({ departments: data , departmentList: data});

      // console.log("departments", data)
    }

  }


  GetUserArea = async (areaId) => {

    var data = await EnterpriseUserService.GetArea(areaId);
    this.setState({ AreaText: this.GetArea(data), AreaId: areaId });

  }

  UserAlreadyRegistered = async (userName,) => {

    if (userName === "") {
      this.setState({ validateUserName: true })
      return true;
    }

    let message = await EnterpriseUserService.IsUserAlreadyRegistered(userName);

    if (message === '1') {
      this.setState({ validateUserName: true })
      return true;
    }
    this.setState({ validateUserName: false })
    return false;

  }
  //#endregion


  filterDepartmentsByServiceId = (serviceId) => {

    var filterDept = this.state.departments.filter((dept) => { return dept.EnterpriseId == serviceId })
    this.setState({ filteredDepartments: filterDept, selectedDepartementId: 0 });
  }

  GetArea(data) {

    var selectedArea = "";
    if (data === null) {
      return selectedArea;
    }


    switch (Config.Setting.countryCode) {
      case "+92":
        selectedArea = data.Area2;
        break;
      default:
        selectedArea = data.Area4;
        break;
    }
    return selectedArea;

  }

  handleInvalidSubmit = () => {
    this.setState({ FromInvalid: true })
  }


  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    var enterprise = this.state.loggedInUser.Enterprise;


    if (this.state.id != undefined && this.state.id > 0) {
      this.GetEnterpriseUser(this.state.id);
    } else {
      this.GetEnterpriseServices(enterprise.Id, 0);
      this.GetDepartmentss();
      this.setState({ ShowLoader: false, chkAllServices: true });
    }

    if (EnterpriseUserService.UserObject.EUser.Id == 0) {
      this.setState({ RoleLevel: "" });
    }

  }

    componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleChangeRole = (e) => {
    // console.log('e', e.target.value)
    var value = e.target.value;
    this.setState({ selectedRole: value, roleSelectionError: false })

  }

  handleChangeService = (e) => {

    var value = Number(e.target.value);
    this.setState({ selectedServiceId: value }, () => {
      this.filterDepartmentsByServiceId(value)
    })

  }

  handleChangeDepartment = (e) => {

    var value = Number(e.target.value);
    this.setState({ selectedDepartementId: value, addNew: value == -1, selectedDepartementName: e.target.selectedOptions[0].text })
  }

  SetGender(value) {

    var gender = "Male";
    if (value === "F") {
      gender = "Female";
    }

    return gender;
  }
  // renderSearch = () =>{
  //   return(
  //     <div className='staff-item item-checked'>
  //     <span>Bilal Manzoor</span>
  //     <span className='staff-check'><FiCheck/></span>

  //   </div>

  //   )

  // }
  renderLoginInfo(user) {

    if (user == null || this.state.ShowLoader) {
      return <div></div>;
    }

    var invalidUserNameClass = this.state.validateUserName ? "form-control" : "form-control is-touched is-pristine av-invalid is-invalid form-control";
    var dvValidation = this.state.validateUserName ? <div></div> : <div className="invalid-feedback" style={{ display: 'block' }}>This Username already taken.</div>
    var loginField = <AvField ref="txtlogin" name="loginusrName" onBlur={(e) => this.UserAlreadyRegistered(e.target.value)} type="text" className={invalidUserNameClass} validate={{ required: { value: this.props.isRequired, errorMessage: 'This is a required field' }, }} />

    //var readOnly = false;
    var passwordRow =
      <div className="row">

        <div className="col-md-6">
          <div className="form-group">
            <label id="loginPassword" className="control-label">Password <BsAsterisk className='st-show'></BsAsterisk></label>
            <AvField onChange={e => this.onChangeText('password', e.target.value)} name="passwrd" type={this.state.type} className="form-control"
              validate={{
                required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                myValidation: passwordTextValidation,
                minLength: { value: 6, errorMessage: 'Your password must be more than 6 characters' },
              }}

            />
            <span className="password__show show-password-info" onClick={this.showHide}> <span className={this.state.type === 'password' ? 'fa fa-eye-slash ' : 'fa fa-eye '}></span></span>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label id="loginPassword" className="control-label">Confirm Password <BsAsterisk className='st-show'></BsAsterisk></label>
            <AvField errorMessage="This is a required field" name="cnfrmPswrd" type={this.state.type}
              validate={{
                required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                myValidation: passwordTextValidation,
                match: { value: 'passwrd', errorMessage: 'Confirm Password does not match' },
                minLength: { value: 6, errorMessage: 'Your password must be more than 6 characters' },
              }}
              className="form-control" required />
          </div>
        </div>
      </div>


    if (user.EnterpiseUser != undefined) {

      passwordRow = "";
      loginField = <AvField value={Object.keys(user).length === 0 ? '' : user.UserName} readOnly={true} name="loginusrName" type="text" className="form-control" />
    }

    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label id="loginEmail" className="control-label">Email <BsAsterisk className='st-show'></BsAsterisk></label>
              <AvField name="lognEmail" errorMessage='please provide valid email' value={Object.keys(user).length === 0 ? '' : user.PrimaryEmail} type="email" className="form-control"
                validate={{
                  required: { value: this.props.isRequired, errorMessage: 'This is a required field' }

                }}

              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label id="loginUserName" className="control-label">Username <BsAsterisk className='st-show'></BsAsterisk></label>
              {loginField}
              {dvValidation}

            </div>
          </div>
        </div>

        {passwordRow}

      </div>
    )

  }

  IsUserAlreadyRegistered = (value, ctrl) => {

    this.UserAlreadyRegistered(value)
  }


  SearchDepartment = (value) =>{
    if(value.length > 2){
      var search =  this.state.departments.filter(v=> (v.Name).toLowerCase().indexOf(value.trim().toLowerCase(), 0) !== -1)
      this.setState({ departments: search })
      return
    }
    this.setState({ departments: this.state.departmentList })
  }

  selectDepartment = (v, i) =>{
    if(v.Id=='-1'){
      //  history.push("/support-types");
        this.props.props.history.push("/support-types");
        return
      }

    if(!Utilities.isExistInCsv(v.Id, this.state.selectedDepartementCsv + ",", ',')){
      this.state.selectedDepartementCsv = this.state.selectedDepartementCsv + ',' + v.Id
      var dept = this.state.departments.filter(val=> val.Id == v.Id)
      var addDept = [...this.state.selectedDepartment, ...dept]
      this.setState({ selectedDepartementCsv: this.state.selectedDepartementCsv, selectedDepartment: addDept })
      return
    }

    var removeUserCsv = this.state.selectedDepartementCsv.replace(`,${v.Id}`, "")
    var deptIndex = this.state.selectedDepartment.findIndex(a => a.Id == v.Id)
    var removeDept = this.state.selectedDepartment.splice(deptIndex, 1)
    this.setState({ selectedDepartementCsv:  removeUserCsv, selectedDepartment: this.state.selectedDepartment })
}

selectedDepartment = (v,i) =>{
  return Utilities.isExistInCsv(v.Id, this.state.selectedDepartementCsv + ",", ',')
}

  LoadEnterpriseUser(user) {
    if (user === null) {
      return (<div></div>)
    }
 const { showDropdown, selectedServices, showRoutingDropdown, selectedOrderRouting } = this.state;
    return (
     
      // return this.loading()
    
      <AvForm onValidSubmit={this.SaveEnterpriseUser} onInvalidSubmit={this.handleInvalidSubmit}>
        
         {this.state.ShowLoader  ? 
             <div className="loader-menu-inner" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
      <div className="loading-label">Loading.....</div>
    </div>
         
         :
        <>
        <div className='User-info-modal-inner'>
        <p>Fields marked as <BsAsterisk className='st-show'></BsAsterisk> are required.</p>
          <div className="form-body">
            {/* <h4 className="title-sperator font-weight-600 m-t-30 m-b-20">Personal Information</h4> */}
            <div className="">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label id="firstName" className="control-label">First Name <BsAsterisk className='st-show'></BsAsterisk>
                    </label>
                    <AvField errorMessage="This is a required field" name="frstName" value={Object.keys(user).length === 0 ? "" : user.FirstName} type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}

                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label id="lastName" className="control-label">Last Name <BsAsterisk className='st-show'></BsAsterisk>
                    </label>
                    <AvField errorMessage="This is a required field" name="lastName" value={Object.keys(user).length === 0 ? "" : user.SurName} type="text" className="form-control"

                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}

                    />
                  </div>
                </div>

              </div>

              {this.renderLoginInfo(user)}

              <div className="row d-none" >
                <div className="col-md-6">
                  <div className="form-group">
                    <label id="lblTitle" className="control-label">Title</label>
                    <AvField name="ddlTitle" type="select" value={Object.keys(user).length === 0 || user.Title === undefined || user.Title === "" ? "Mr" : user.Title} className="form-control custom-select">
                      <option value="Mr">Mr</option>
                      <option value="Ms">Ms</option>
                      <option value="Mrs">Mrs</option>
                    </AvField>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label id="lblGender" className="control-label">Gender</label>
                    <AvField name="ddlGender" type="select" value={Object.keys(user).length === 0 ? "M" : user.Gender} className="form-control custom-select">
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </AvField>
                  </div>
                </div>

              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group phone-number-eg-wrap">
                    <label id="mobileNmbrOne" className="control-label">Mobile # 1 <BsAsterisk className='st-show'></BsAsterisk>
                    </label>
                    {/* <AvField name="mobOne" value={Object.keys(user).length === 0 ? "" : user.Mobile1} type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                        myValidation: MobileNumValidation,
                      }}
                    />  */}
                     <div className='custom-ph-no'>
                    <PhoneInput
                    autocompleteSearch
                    enableSearch
                    inputProps={{
                      autoFocus: true
                    }}
                      country={'us'}
                      value={Object.keys(user).length === 0 ? "" : user.Mobile1}
                      onChange={this.handleOnChange}
                      onFocus={this.handleOnFocus}
                      // onChange={phone => this.setState({ mobOne: phone, mobError: false })}
                    />
                    </div>

                    {/* <span class="color-7 font-12">e.g.{this.state.callingCode !="" ? this.state.callingCode : GlobalData.restaurants_data.Supermeal_dev.countryCode }xxx-xxxxxxx</span> */}
                    <span class="color-7 font-12">e.g.{this.state.dialCode}xxx-xxxxxxx</span>
                    {
                      !!this.state.mobError &&
                      <div class="invalid-feedback d-flex">This is a required field</div>
                    }
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label id="landlineOne" className="control-label">Landline # 1
                    </label>
                    <AvField name="lineOne" value={Object.keys(user).length === 0 ? "" : user.LandLine1} type="text" className="form-control"
                    />
                  </div>
                </div>
                {/* <div className="col-md-6 d-none">
                  <div className="form-group">
                    <label id="mobileNmbrTwo" className="control-label">Mobile # 2
                    </label>
                    <AvField name="mobTwo" type="text" className="form-control" value={Object.keys(user).length === 0 ? "" : user.Mobile2}
                      validate={{
                        myValidation: phoneNumValidation,
                      }}
                    />
                  </div>
                </div> */}

              </div>

              {/* <div className="row d-none">
                <div className="col-md-6">
                  <div className="form-group">
                    <label id="landlineOne" className="control-label">Landline # 1
                    </label>
                    <AvField name="lineOne" value={Object.keys(user).length === 0 ? "" : user.LandLine1} type="text" className="form-control"
                      validate={{
                        myValidation: phoneNumValidation,
                      }}

                    />
                  </div>
                </div>
                <div className="col-md-6 ">
                  <div className="form-group">
                    <label id="landlineTwo" className="control-label">Landline # 2
                    </label>
                    <AvField name="lineTwo" value={Object.keys(user).length === 0 ? "" : user.LandLine2} type="text" className="form-control"
                      validate={{
                        myValidation: phoneNumValidation,
                      }}
                    />
                  </div>
                </div>

              </div> */}
            </div>

          </div>
          <div className="form-body">
            {/* <h4 className="title-sperator m-t-20 m-b-20">Account Information</h4> */}
            <div className="">

              {/* {this.renderLoginInfo(user)} */}

              <div className="row">
                  {
                  (this.state.selectedRole != Constants.Role.ENTERPRISE_ADMIN_ID || this.props.canChangeRole || this.props.userId == 0) &&
                <div className="col-md-6">

                    <div className="form-group">
                      <label className="control-label">User role for this <BsAsterisk className='st-show'></BsAsterisk></label>
                      {/* {
                        this.state.loggedInUser.Enterprise.Id != 1 ?
                        <AvField name="ddlRoleLevel" type="select" value={Object.keys(user).length === 0 ? "0" : user.RoleLevel} className="form-control custom-select"
                        validate={{ myValidation: RoleSelectionValidation }} onChange={(e) => this.handleChangeRole(e)}

                      >
                        <option value="0">Select user role</option>
                        <option value="4">Admin</option>
                        <option value="5">Manager</option>
                        <option value="6">Staff</option>
                        <option value="2">Moderator</option>
                      </AvField >
                      :
                      <AvField name="ddlRoleLevel" type="select" value={Object.keys(user).length === 0 ? "0" : user.RoleLevel} className="form-control custom-select"
                        validate={{ myValidation: RoleSelectionValidation }} onChange={(e) => this.handleChangeRole(e)}

                      >
                        <option value="0">Select user role</option>
                        <option value="2">Moderator</option>
                      </AvField >
                      } */}
                      {
                        this.state.loggedInUser.Enterprise.Id != 1 && (this.state.loggedInUser.RoleLevel == 4 || this.state.loggedInUser.RoleLevel == 5 || this.state.loggedInUser.RoleLevel == 6)?
                        <select className="form-control custom-select" onChange={(e) => this.handleChangeRole(e)}>
                        {<option value="0" selected={this.state.selectedRole == 0}>{"Select Role"}</option> }
                        {this.state.loggedInUser.RoleLevel == 4 && <option value="4" selected={this.state.selectedRole == 4}>{Constants.Role.ENTERPRISE_ADMIN}</option> }
                        {this.state.loggedInUser.RoleLevel <= 5 && <option value="5" selected={this.state.selectedRole == 5}>{Constants.Role.ENTERPRISE_MANAGER}</option>}
                        {this.state.loggedInUser.RoleLevel <= 6 && <option value="6" selected={this.state.selectedRole == 6}>{Constants.Role.ENTERPRISE_USER}</option> }

                      </select>

                      :

                      (this.state.loggedInUser.RoleLevel == 3 || this.state.loggedInUser.RoleLevel == 16 || this.state.loggedInUser.RoleLevel == 17)?

                      <select className="form-control custom-select" onChange={(e) => this.handleChangeRole(e)}>
                        <option value="0" selected={this.state.selectedRole == 0}>{"Select Role"}</option>
                        {this.state.loggedInUser.RoleLevel == Constants.Role.RESELLER_ADMIN_ID &&  <option value={Constants.Role.RESELLER_ADMIN_ID} selected={this.state.selectedRole == Constants.Role.RESELLER_ADMIN_ID}>Admin</option>}
                        {this.state.loggedInUser.RoleLevel <= Constants.Role.RESELLER_MODERATOR_ID &&  <option value={Constants.Role.RESELLER_MODERATOR_ID} selected={this.state.selectedRole == Constants.Role.RESELLER_MODERATOR_ID}>Moderator</option>}
                        {this.state.loggedInUser.RoleLevel <= Constants.Role.RESELLER_KEY_ACCOUNT_MANAGER_ID &&  <option value={Constants.Role.RESELLER_KEY_ACCOUNT_MANAGER_ID} selected={this.state.selectedRole == Constants.Role.RESELLER_KEY_ACCOUNT_MANAGER_ID}>Manager</option>}
                      </select>

                      :

                    <select className="form-control custom-select" onChange={(e) => this.handleChangeRole(e)} value={this.state.selectedRole}>
                        {<option value="0" selected={this.state.selectedRole == 0}>{"Select Role"}</option> }
                        {(this.state.loggedInUser.RoleLevel == 1 || this.state.loggedInUser.RoleLevel == 2) && <option value="2">Moderator</option>}
                      </select>
                      }
                      {this.state.roleSelectionError && <div className="invalid-feedback" style={{ display: 'block' }}>Please select role</div>}
                    </div>
                </div>
                  }
{Number(this.state.loggedInUser.RoleLevel) == Constants.Role.ENTERPRISE_ADMIN_ID && this.state.loggedInUser.Enterprise.EnterpriseTypeId == Constants.ENTERPRISE_TYPE_IDS.HOTEL &&
<>
                <div className='col-md-6'>
                  <div className="form-group">
                      <label className="control-label">Choose Services to Display <BsAsterisk className='st-show'></BsAsterisk></label>

                        <div className='user-serv-assign-d-down' ref={(node) => (this.dropdownRef = node)}>
                    <Dropdown show={showDropdown} onToggle={this.toggleDropdown}>
                      <Dropdown.Toggle id="dropdown-basic" onClick={this.toggleDropdown}>
                        <span className="m-b-0 statusChangeLink w-100">
                          <div className="d-flex assign-text-img align-items-center justify-content-between w-100">
                            <span className="mr-2 line-clamp">Select Services</span>
                            <span className="theme-d-wrap"></span>
                          </div>
                        </span>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                          <Dropdown.Item
                            key={"all"}
                            as="div"
                          >
                            <label onClick={(e) => e.stopPropagation()}  className="cursor-pointer d-flex align-items-center">
                              <input
                                type="checkbox"
                                // Checked={service.IsSelected} value={service.IsSelected}
                                className="form-checkbox mr-2"
                                checked={this.state.chkAllServices}
                                value={this.state.chkAllServices}
                                onChange={() => this.handleCheckAll()}
                                onClick={(e) => e.stopPropagation()} // prevents menu from closing
                              />
                              <span className="button-link">
                                All
                                <span className="badge badge-info ml-2"></span>
                              </span>
                            </label>
                          </Dropdown.Item>


                        {this.state.enterpriseServices.map((service, index) => (
                          <Dropdown.Item
                            key={index}
                            as="div"
                          >
                            <label onClick={(e) => e.stopPropagation()}  className="cursor-pointer d-flex align-items-center">
                              <input
                                type="checkbox"
                                // Checked={service.IsSelected} value={service.IsSelected}
                                className="form-checkbox mr-2"
                                checked={selectedServices.includes(service)}
                                value={selectedServices.includes(service)}
                                onChange={() => this.handleItemChange(service)}
                                onClick={(e) => e.stopPropagation()} // prevents menu from closing
                              />
                              <span className="services-img-dashboard">
                                <img
                                  src={Utilities.generatePhotoLargeURL(service.PhotoName, true, false)}
                                  alt=""
                                  style={{ width: '25px', height: '25px', marginRight: '10px', borderRadius:"50%", border:"1px solid #d2d2d2" }}
                                />
                              </span>
                              <span className="button-link">
                                {Utilities.SpecialCharacterDecode(service.Name)}
                                <span className="badge badge-info ml-2"></span>
                              </span>
                            </label>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <p className='mt-2' style={{fontSize:13}}>Select the services that should be visible to the user.</p>
                      </div>
                </div>
                <div className='w-100'>
                {this.state.selectedServices.length > 0 && <label className="control-label" style={{padding:"0px 15px"}}>Selected Servcies</label>}
                <div className="selected-div-show user-serv w-100" style={{padding:"0px 15px"}}>


              {this.state.selectedServices.map((service, index) => (

                  <a>
                    <img src={Utilities.generatePhotoLargeURL(service.PhotoName, true, false)} />
                    <div className="d-flex align-items-start flex-column">
                      <span className="mr-1">{Utilities.SpecialCharacterDecode(service.Name)}</span>
                    </div>
                    <span className="cursor-pointer ml-auto fa fa-trash" onClick={(e) => this.handleItemChange(service)} />
                  </a>
            ))}
  
                </div>
                </div>
</>
  }


                {/* orderRouting */}

                {(Number(this.state.loggedInUser.RoleLevel) == Constants.Role.ENTERPRISE_ADMIN_ID || Number(this.state.loggedInUser.RoleLevel) == Constants.Role.ENTERPRISE_MANAGER_ID) &&  this.state.loggedInUser.Enterprise.EnterpriseTypeId != Constants.ENTERPRISE_TYPE_IDS.HOTEL && this.state.orderRouting.length > 0 &&   
              <>
              
                <div className='col-md-6'>
                  <div className="form-group">
                      <label className="control-label">Choose Order Routing</label>

                        <div className='user-serv-assign-d-down' ref={(node) => (this.dropdownRef = node)}>
                    <Dropdown show={showRoutingDropdown} onToggle={this.toggleOrderRoutingDropdown}>
                      <Dropdown.Toggle id="dropdown-basic" onClick={this.toggleOrderRoutingDropdown}>
                        <span className="m-b-0 statusChangeLink w-100">
                          <div className="d-flex assign-text-img align-items-center justify-content-between w-100">
                            <span className="mr-2 line-clamp">Select Routing</span>
                            <span className="theme-d-wrap"></span>
                          </div>
                        </span>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                          <Dropdown.Item
                            key={"orderRoutingAll"}
                            as="div"
                          >
                            <label  className="cursor-pointer d-flex align-items-center">
                              <input
                                type="checkbox"
                                // Checked={service.IsSelected} value={service.IsSelected}
                                className="form-checkbox mr-2"
                                checked={this.state.chkAllOrderRouting}
                                value={this.state.chkAllOrderRouting}
                                onChange={() => this.handleCheckAllOrderRouting()}
                                onClick={(e) => e.stopPropagation()} // prevents menu from closing
                              />
                              <span className="button-link">
                                All
                                <span className="badge badge-info ml-2"></span>
                              </span>
                            </label>
                          </Dropdown.Item>


                        {this.state.orderRouting.map((routing, index) => (
                          <Dropdown.Item
                            key={index}
                            as="div"
                          >
                            <label onClick={(e) => e.stopPropagation()}  className="cursor-pointer d-flex align-items-center">
                              <input
                                type="checkbox"
                                // Checked={service.IsSelected} value={service.IsSelected}
                                className="form-checkbox mr-2"
                                checked={selectedOrderRouting.includes(routing)}
                                value={selectedOrderRouting.includes(routing)}
                                onChange={() => this.handleOrderRoutingItemChange(routing)}
                                onClick={(e) => e.stopPropagation()} // prevents menu from closing
                              />

                              <span className="button-link">
                                {Utilities.SpecialCharacterDecode(routing.Name)}
                                <span className="badge badge-info ml-2"></span>
                              </span>
                            </label>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <p className='mt-2' style={{fontSize:13}}>Select the order routing for the user.</p>
                      </div>
                </div>
                
                <div className='w-100'>
                  {this.state.selectedOrderRouting.length > 0 && <label className="control-label" style={{padding:"0px 15px"}}>Selected Order Routing</label>}
                  <div className="selected-div-show user-serv w-100" style={{padding:"0px 15px"}}>


                  {this.state.selectedOrderRouting.map((routing, index) => (

                    <a>
                      <div className="d-flex align-items-start flex-column">
                        <span className="mr-1">{Utilities.SpecialCharacterDecode(routing.Name)}</span>
                      </div>
                      <span className="cursor-pointer ml-auto fa fa-trash" onClick={(e) => this.handleOrderRoutingItemChange(routing)} />
                    </a>
              ))}
    
                  </div>
                </div>
            
           </>
              }


                {Number(this.state.selectedRole) == 6 && this.state.loggedInUser.Enterprise.EnterpriseTypeId == 15  &&
                  <>
                    {/* <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label">Choose Service <BsAsterisk className='st-show'></BsAsterisk></label>

                      <AvField name="ddlRoleLevel2" value={this.state.selectedServiceId} type="select" className="form-control custom-select" onChange={(e) => this.handleChangeService(e)}
                       validate={{myValidation: ServiceSelectionValidation}}
                      >
                      <option value={0}>{"Select Service"}</option>
                      {this.state.services.map((service) => {
                        return(
                        <option value={service.Id} >{service.Name}</option>)

                      }) }

                      </AvField >
                    </div>
                  </div> */}


                    <div className="col-md-12">
                      <div className="form-group">
                        {
                           this.state.selectedDepartment.length > 0 &&
                           <div>
                            <label className="control-label">Assigned Departments <BsAsterisk className='st-show'></BsAsterisk></label>

                            <div className='selected-div-show'>
                              {
                                this.state.selectedDepartment.map((v,i)=>(
                                  <a >{v.Name} < span onClick={()=>this.selectDepartment(v, i)} className='closs-text-i ml-auto'>+</span></a>
                                ))
                              }
                            </div>
                           </div>
                        }
                        <label class="font-13">Choose departments you want to assign to this user.</label>
                      <div>
                        <div className="select-search-container select-search-is-multiple">
                          <div className="select-search-value">
                            <input tabindex="0" onChange={(e) => this.SearchDepartment(e.target.value)} placeholder="Search departments" autocomplete="on" className="select-search-input" />
                          </div>
                          {
                            this.state.departments.length > 0 &&
                              <div  className="select-search-select">
                                <ul className="select-search-options">
                                {this.state.departments.map((v, i) => (
                                  <li onClick={()=>this.selectDepartment(v, i)}  className={v.Id=='-1'?"Add-link-wrap":'select-search-row'} role="menuitem" data-index="0">
                                  <div className={v.Id=='-1'?"Add-link": this.selectedDepartment(v,i)?'staff-item item-checked':'staff-item'}>
                                      <span >{v.Name}</span>
                                      {
                                        this.selectedDepartment(v, i) &&
                                        <span className='staff-check'><FaCheck /></span>
                                      }

                                    </div>
                                  </li>
                                  ))}
                                </ul>
                              </div>

                          }
                        </div>
                      </div>

                      </div>
                    </div>

                  </>
                }

                {this.state.addNew &&
                  <div className="col-md-12">
                    <div className="form-group">
                      <label id="newDept" className="control-label">New Department
                      </label>
                      <AvField errorMessage="This is a required field" name="newDept" type="text" className="form-control"
                        validate={{
                          required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                        }}
                      />
                    </div>
                  </div>

                }

              </div>
            </div>

          </div>
        </div>
        {/* <div className="col-xs-12 setting-cus-field m-b-20"> */}
        <div className="bottomBtnsDiv justify-content-end" style={{ borderTop: "1px solid #d2d2d2", paddingTop: "13px" }}>
          {this.state.FromInvalid ? <span className='mb-0 d-flex align-items-center'>

            <div className="gnerror error media-imgerror pt-0 mb-0 mr-3">One or more fields has errors.</div>

          </span>
            : ""}
          <FormGroup className='mb-0 mt-3'>
            <Button color="secondary" onClick={() => this.props.saved(0)} className="mr-2">Cancel</Button>

            <Button color="primary" className="btn waves-effect waves-light btn-primary pull-right" style={{ width: '61px' }}>
              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                : <span className="comment-text">Save</span>}
            </Button>
          </FormGroup>



          <div className="action-wrapper">
          </div>
        </div>
        </>}
      </AvForm>
    )

  }

  render() {

    

    return (
      <div className="card mb-0" id="userInfoDv">
        {/* <h3 className="card-title card-new-title">User Information</h3> */}
        <div style={{ boxShadow: "none" }}>

          {this.LoadEnterpriseUser(this.state.User)}
        </div>
      </div>
    );
  }
}

export default UserInfo;
