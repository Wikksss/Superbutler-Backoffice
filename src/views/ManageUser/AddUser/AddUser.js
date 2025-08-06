import React, { Component } from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Link } from "react-router-dom";
import 'sweetalert/dist/sweetalert.css';
import { FormGroup, Button} from 'reactstrap';
import * as EnterpriseUserService from '../../../service/EnterpriseUsers';
import * as AreaService from '../../../service/Area';
import * as Utilities from '../../../helpers/Utilities';
import Constants from '../../../helpers/Constants';
import Config from '../../../helpers/Config';
import Autocomplete from 'react-autocomplete';
import Loader from 'react-loader-spinner';


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

const phoneNumValidation = (value,ctx) => {

  if (/^[+()\d-]+$/.test(value) || value == "") {
      return true;
  } else {
      return "Invalid input"
  }
}

class AddUser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      User: {},
      UserId: 0,
      loggedInUser : [],
      hdAreaCode : 0,
      PostCode : "",
      validateUserName: true,
      UserFieldFocused: false,
      UserNameText : "",
      ShowError: false,
      AreaId: 0,
      AreaText: "",
      Areas: [],
      ShowLoader: true,
      type: 'password',
      ShowPostcodeLoader: false,
      isRequired: true,
      IsSave:false,
      FromInvalid: false,
    }
    this.showHide = this.showHide.bind(this);                      
    this.SaveEnterpriseUser = this.SaveEnterpriseUser.bind(this);
    
    if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))){
      this.state.loggedInUser = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
   }
    else{
      this.props.history.push('/Dashboard')
    }

  }


  loading = () => <div className="page-laoder page-laoder-menu">
  <div className="loader-menu-inner">
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
      <div className="loading-label">Loading.....</div>
  </div>
</div>


GetAreaBy(){

  var value = this.state.AreaText;
  if(value==""){
    return
}

  this.setState({ShowError : false, AreaId: 0});
  value = Utilities.FormatPostCodeUK(value);
  this.GetAreaByKeyword(value);
  
  }

    OnItemSelect(value){
        
        this.setState({AreaText: value })
    
        let areas = this.state.Areas;
    
        let area = areas.filter((area) => {
            return area.Area2 = value
        })
        // alert(area[0].Id);
        this.setState({AreaId: area[0].Id})
    }


  // #region api calling
  GetAreaByKeyword = async (txtSearch) => {

    this.setState({ShowPostcodeLoader: true})

    var data = await AreaService.GetBy(txtSearch);
    if(data.length > 0) {
        this.setState({Areas:data, AreaText: data[0].Area2, AreaId: data[0].Id});
    } else{
        this.setState({ShowError : true,});
    }
    this.setState({ShowPostcodeLoader: false})

}

onChangeText = (key, value) => {
  this.setState({ [key]: value })
}
showHide(e){
  e.preventDefault();
  e.stopPropagation();
  
  this.setState({
    type: this.state.type === 'password' ? 'text' : 'password'
  })  
}
  SaveEnterpriseUserApi = async(userObject,isNewUser) =>{
    
    let message = (isNewUser === true) ? await EnterpriseUserService.Save(userObject) : await EnterpriseUserService.Update(userObject)  
    this.setState({IsSave:false,FromInvalid: false});
    if(message === '1'){
      this.props.history.push('/users/all-users')
    }

    this.setState({IsSave:false})

  }
  
  SaveEnterpriseUser(event, values){
    if(this.state.IsSave) return;
if(!this.state.validateUserName || !this.state.isRequired){
  return;
}

    let user = EnterpriseUserService.UserObject
    let userToUpdate  = this.state.User;
    let loggedInUser = this.state.loggedInUser
    let userID = Object.keys(userToUpdate).length > 0 ? userToUpdate.EnterpiseUser.UserID : 0;
    user.EUser.Id = userID;
    user.EUser.Title = values.ddlTitle;
    user.EUser.FirstName = values.frstName;
    user.EUser.SurName = values.lastName;
    user.EUser.PrimaryEmail = values.lognEmail;
    user.EUser.Gender = values.ddlGender;
    user.EUser.Mobile1 = values.mobOne;
    user.EUser.Mobile2 = values.mobTwo;
    user.EUser.LandLine1 = values.lineOne;
    user.EUser.LandLine2 = values.lineTwo;
    user.EUser.CreatedBy =  loggedInUser.Id;
    user.EUser.RoleLevel = values.ddlRoleLevel;
    user.EUser.AddressUser.AreaID = this.state.AreaId;
    user.EUser.AddressUser.Address1 = values.address === null ? "" : values.address;
    user.EUser.EnterpiseUser.EnterpriseID = loggedInUser.Enterprise.Id;
    user.EUser.EnterpiseUser.RoleID = values.ddlRoleLevel;
    user.EUser.EnterpiseUser.UserID = userID;
    user.EUser.AddressUser.UserID = userID;
    user.Password  = values.passwrd;
    user.ConfirmPassword  = values.cnfrmPswrd;
    user.LoginUserName  = values.loginusrName;
    
    //Saving
    if(userID === 0){
      this.SaveEnterpriseUserApi(user,true);
      return;
    }

    //updating
    this.SaveEnterpriseUserApi(user, false);
  }



GetEnterpriseUser = async (userId) => {

  var data = await EnterpriseUserService.GetUser(userId);

  if(data.length !== 0){
    this.setState({User:data});
    this.GetUserArea(data.AddressUser.AreaID);
  }

  this.setState({ ShowLoader: false });

}

GetUserArea = async (areaId) => {

  var data = await EnterpriseUserService.GetArea(areaId);
  this.setState({AreaText : this.GetArea(data), AreaId: areaId});

}

UserAlreadyRegistered = async (userName,) => {

if (userName === ""){
  this.setState({validateUserName:true})
    return true;
}

  let message  = await EnterpriseUserService.IsUserAlreadyRegistered(userName);
 
  if(message === '1') {
     this.setState({validateUserName:true})
    return true;
  }
  this.setState({validateUserName:false})
  return false;

  
}
  //#endregion


GetArea(data)
{

  var selectedArea = "";
  if(data === null)
  {
return selectedArea;
  }

    
  switch (Config.Setting.countryCode)
			{
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
  this.setState({FromInvalid: true})
}

componentDidMount() {

    var id = this.props.match.params.id;
  
    if(id !== undefined){
      this.GetEnterpriseUser(id);
    } else {
      this.setState({ ShowLoader: false });
    }

  if(EnterpriseUserService.UserObject.EUser.Id === 0){
    this.setState({RoleLevel:""});
  }
}


SetGender(value) {

  var gender = "Male";
  if(value === "F"){
    gender = "Female";
  }

  return gender;
}

renderLoginInfo(user)
{
  
  if(user === null){
    return <div></div>
  }

  var invalidUserNameClass = this.state.validateUserName ? "form-control" : "form-control is-touched is-pristine av-invalid is-invalid form-control";
  var dvValidation = this.state.validateUserName ? <div></div> : <div className="invalid-feedback" style={{ display: 'block' }}>This Username already taken.</div>
  var loginField =  <AvField ref="txtlogin"  name="loginusrName" onBlur={(e) => this.UserAlreadyRegistered(e.target.value)}  type="text" className={invalidUserNameClass} validate={{ required: { value: this.props.isRequired, errorMessage: 'This is a required field' },}}/>

  //var readOnly = false;
  var passwordRow =   <div className="row">

<div className="col-md-6">
  <div className="form-group">
    <label id="loginPassword" className="control-label">Password <span className="st-show">*</span></label>
    <AvField  onChange={e => this.onChangeText('password', e.target.value)} name="passwrd" type={this.state.type}  className="form-control"
     validate={{
      required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
      myValidation: passwordTextValidation,
      minLength: {value: 6, errorMessage: 'Your password must be more than 6 characters'},
      }} 
    
    />
    <span className="password__show show-password-info" onClick={this.showHide}> <span className={this.state.type === 'password' ? 'fa fa-eye-slash ' : 'fa fa-eye '}></span></span>
  </div>
</div>
<div className="col-md-6">
  <div className="form-group">
    <label id="loginPassword" className="control-label">Confirm Password <span className="st-show">*</span></label>
    <AvField errorMessage="This is a required field" name="cnfrmPswrd" type={this.state.type} 
    validate={{
      required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
      myValidation: passwordTextValidation,
      match:{value:'passwrd',errorMessage: 'Confirm Password does not match'},
      minLength: {value: 6, errorMessage: 'Your password must be more than 6 characters'},
      }} 
    className="form-control" required  />
  </div>
</div>
</div>


if(user.EnterpiseUser !== undefined){

  passwordRow = "";
  loginField =   <AvField  value={Object.keys(user).length === 0 ? '': user.UserName} readOnly={true}  name="loginusrName"  type="text" className="form-control"/>
}

  return (
    <div>
        <div className="row">
        <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label">User role <span className="st-show">*</span></label>
                      
                      <AvField name="ddlRoleLevel" type="select"  value={Object.keys(user).length === 0? "0" :user.RoleLevel}  className="form-control custom-select"
                      validate={{myValidation: RoleSelectionValidation}}
                      
                      >
                      <option value="0">Select user role</option>
                    	<option value="4">Enterprise_Admin</option>
	                    <option value="5">Enterprise_Manager</option>
	                    <option value="6">Enterprise_User</option>
                      </AvField >
                    </div>
                  </div>
        </div>
    <div className="row">
    <div className="col-md-6">
      <div className="form-group">
        <label id="loginEmail" className="control-label">Email <span className="st-show">*</span></label>
        <AvField  name="lognEmail" errorMessage='please provide valid email' value={Object.keys(user).length === 0 ? '': user.PrimaryEmail} type="email" className="form-control"
        validate={{
          required: { value: this.props.isRequired, errorMessage: 'This is a required field' }
          
          }}
        
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="form-group">
        <label id="loginUserName" className="control-label">Username <span className="st-show">*</span></label>
      {loginField}
      {dvValidation}
       
      </div>
    </div>
  </div>
  
  {passwordRow}

  </div>
  )

}

IsUserAlreadyRegistered = (value,ctrl) => {

    this.UserAlreadyRegistered(value)
}

  LoadEnterpriseUser(user){

    if(user === null)
    {
      return (<div></div>)
    }
    
   

    return (
      <AvForm onValidSubmit={this.SaveEnterpriseUser} onInvalidSubmit={this.handleInvalidSubmit}>
            <div className="form-body">
              <h4 className="title-sperator m-t-20 m-b-20">Account Information</h4>
              <div className="formPadding">
    
            {this.renderLoginInfo(user)}

               
              </div>

            </div>
            <div className="form-body">
              <h4 className="title-sperator font-weight-600 m-t-30 m-b-20">Personal Information</h4>
              <div className="formPadding">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label id="lblTitle" className="control-label">Title</label>
                      <AvField name="ddlTitle" type="select" value={Object.keys(user).length === 0 || user.Title === undefined || user.Title === "" ? "Mr" :user.Title} className="form-control custom-select">
                      <option value="Mr">Mr</option>
                      <option value="Ms">Ms</option>
	                    <option value="Mrs">Mrs</option>
                      </AvField>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label id="lblGender" className="control-label">Gender</label>
                      <AvField name="ddlGender" type="select" value={Object.keys(user).length === 0? "M" : user.Gender}  className="form-control custom-select">
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                      </AvField>
                    </div>
                  </div>
                 
                </div>
                <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                      <label id="firstName" className="control-label">First Name
                      </label>
                      <AvField errorMessage="This is a required field" name="frstName" value={Object.keys(user).length === 0? "" :  user.FirstName} type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                        }}
                      
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label id="lastName" className="control-label">Last Name <span className="st-show">*</span>
                      </label>
                      <AvField errorMessage="This is a required field" name="lastName" value={Object.keys(user).length === 0? "" : user.SurName} type="text" className="form-control"
                      
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                        }}
                      
                      />
                    </div>
                  </div>

                </div>
                <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                      <label id="mobileNmbrOne" className="control-label">Mobile # 1
                      </label>
                      <AvField  name="mobOne" value={ Object.keys(user).length === 0? "" : user.Mobile1} type="text" className="form-control"  
                       validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                        myValidation: phoneNumValidation,
                        }} 
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label id="mobileNmbrTwo" className="control-label">Mobile # 2
                      </label>
                      <AvField  name="mobTwo"  type="text" className="form-control"  value={Object.keys(user).length === 0? "" : user.Mobile2} 
                       validate={{
                        myValidation: phoneNumValidation,
                        }} 
                      />                  
                    </div>
                  </div>
                 
                </div>

                <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                      <label id="landlineOne" className="control-label">Landline # 1
                      </label>
                      <AvField  name="lineOne" value={Object.keys(user).length === 0? "" : user.LandLine1} type="text" className="form-control"  
                        validate={{
                        myValidation: phoneNumValidation,
                        }} 
                      
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label id="landlineTwo" className="control-label">Landline # 2
                      </label>
                      <AvField  name="lineTwo" value={Object.keys(user).length === 0? "" : user.LandLine2} type="text" className="form-control"  
                        validate={{
                        myValidation: phoneNumValidation,
                        }} 
                      />
                    </div>
                  </div>
              
                </div>
              </div>

            </div>
            
            <div className="form-body" >
              <h4 className="title-sperator font-weight-600 m-t-30 m-b-20">Residential Information</h4>
              <div className="formPadding">
               
                <div className="row">
                 
                  <div className="col-md-6">
                    <div className="form-group post-code">
                      <label id="lblPostCode" className="control-label">Post Code</label>
                      {/* <AvField errorMessage="This is a required field" name="txtPostCode" value={Object.keys(user).length === 0? "" : this.state.PostCode}  type="text" className="form-control" /> */}
                      <div  className={this.state.ShowError ? "input-group  form-group  error-shwow-msg":"input-group  form-group "}>
                       {/* <AvField errorMessanpm stage="This is a required field" name="txtPostCode" type="text" className="form-control" onkey value={this.state.AreaText} required  /> */}
                       <AvField name="txtPostCode" type="text" className= "form-control" value={this.state.AreaText} onChange={(e) => this.setState({AreaText: e.target.value })} errorMessage="This is a required field" />
                       <div className="find-btn" onClick={(e) => this.GetAreaBy()}>
                                        {this.state.ShowPostcodeLoader ?
                                       <span className="loader-find-btn">
                                       <Loader type="Oval" color="#fff" height={20} width={20}/>  
                                       </span>
                                        :<span>Find</span>
                                        } 
                                            </div>                              
                                  {this.state.ShowError ? <div className="error-code">This is a required field</div> : ''}
                                        </div>

                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label id="lblAddress" className="control-label font-weight-500">Address</label>
                      <AvField errorMessage="This is a required field" value={ Object.keys(user).length === 0? "" : (user.AddressUser.Address1 === null? "":user.AddressUser.Address1)} name="address" type="text" className="form-control"  />
                    </div>
                  </div>
                </div>
              </div>

            </div>
            {/* <div className="col-xs-12 setting-cus-field m-b-20"> */}
            <div className="bottomBtnsDiv" style={{ paddingRight: '20px' }}>
            <FormGroup>

            {/* <Button color="secondary" className="btn waves-effect waves-light btn-secondary pull-right m-l-10">Cancel</Button> */}
            {/* <Link to="/settings/general"><Button color="secondary" className="btn waves-effect waves-light btn-secondary pull-right m-l-10" style={{ marginRight: 10 }}>Cancel</Button></Link> */}
     
            <Button color="primary"  className="btn waves-effect waves-light btn-primary pull-right" style={{width: '61px'}}>
                {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                : <span className="comment-text">Save</span>}
              </Button>
          </FormGroup>

          {this.state.FromInvalid ? <FormGroup>

<div className="gnerror error media-imgerror">One or more fields has errors.</div>

</FormGroup>
: ""}
              
              <div className="action-wrapper">
              </div>
            </div>
          </AvForm>
    )

  }

  render() {
   
    if (this.state.ShowLoader === true) {
      return this.loading()
     }

     return (
      <div className="card" id="userInfoDv">
       <h3 className="card-title card-new-title">Add New User</h3>
        <div className="card-body">
          {this.LoadEnterpriseUser(this.state.User)}
        </div>
      </div>
    );
  }
}

export default AddUser;
