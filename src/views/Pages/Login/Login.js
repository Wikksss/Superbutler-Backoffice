import React, { Component } from 'react';
import Config from '../../../helpers/Config';
import Constants from '../../../helpers/Constants';
import * as Utilities from '../../../helpers/Utilities';
import * as AuthService from '../../../service/Auth'
import * as UserService from '../../../service/User'
import * as CountryService from '../../../service/Country'
import * as PermissionService from '../../../service/Permission'
import * as EnterpriseMenuService from '../../../service/EnterpriseMenu';
import logo from '../../../assets/img/brand/logo.png'
import loginright from '../../../assets/img/brand/backkoffice-login.jpg'
import Loader from 'react-loader-spinner';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import GlobalData, { firebaseVapidKey } from '../../../helpers/GlobalData';
import moment from 'moment';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import * as deviceHelpher from '../../../helpers/Devices';

class Login extends Component {
  state = { interval: null }
  
  loading = () =>   <div className="page-laoder">
    <div> 
      <Loader type="Oval" color="#ed0000" height={50} width={50}/>  
      <div className="loading-label">Loading.....</div>
      </div>
  </div> 

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      secureTextEntry:true,
      errorUsername: '',
      errorPassword: '',
      errorMsg: '',
      classDisplay: 'no-display',
      type: 'password',
      score: 'null',
      showLoader: false,
    };
    this.showHide = this.showHide.bind(this);
    
    var pathName = this.props.location.pathname.toLowerCase();
    var mId = "";
    var authId = "";
    if(pathName.indexOf("/app/") !== -1)  {
    
      var params = pathName.split('/app/')[1].split('/');
    
         mId = params[0];
         authId = params[1];
        
        if(mId !== '')
    {
        localStorage.setItem(Constants.Session.AUTHENTICATION_TICKET,authId)
        localStorage.setItem(Constants.MEMBERSHIP_ID,mId);
        localStorage.setItem(Constants.Session.IMPERSONATORID, "");
        window.history.pushState('Login', 'Login', '/login');
    }
    
    } 

    if(localStorage.getItem('deviceId') == null || localStorage.getItem('deviceId')  === '') {
      localStorage.setItem('deviceId', UserService.create_UUID());
    }    


    if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT)) && Utilities.stringIsEmpty(mId)){
      let loginUser = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT));
      if(loginUser.Enterprise.EnterpriseTypeId == 5 || loginUser.RoleLevel === Constants.Role.SYSTEM_ADMIN_ID 
        || loginUser.RoleLevel === Constants.Role.SYSTEM_OPERATOR_ID || loginUser.RoleLevel === Constants.Role.FOORTAL_SUPPORT_ADMIN_ID 
        || loginUser.RoleLevel === Constants.Role.FOORTAL_SUPPORT_USER_ID || loginUser.RoleLevel == Constants.Role.RESELLER_ADMIN_ID || loginUser.RoleLevel == Constants.Role.RESELLER_MODERATOR_ID
        || loginUser.RoleLevel == Constants.Role.RESELLER_KEY_ACCOUNT_MANAGER_ID){
      this.props.history.push(loginUser.Enterprise.EnterpriseTypeId == 5 ? 'dashboard' : '/businesses');
      } 
      else if(loginUser.Enterprise.EnterpriseTypeId == 15) {
        this.props.history.push(`${loginUser.RoleLevel == Constants.Role.STAFF_ID || loginUser.Enterprise.TotalComplaints > 0 ? "/active-requests": "/support-types"}`);
      }
      else if(loginUser.RoleLevel === Constants.Role.MARKETING_ADMIN_ID){
        this.props.history.push('/app-notification');
      }
      else{
      this.props.history.push('/menu/build-menu');
      }
    }
    this.handleSubmit = this.handleSubmit.bind(this);

   

    localStorage.removeItem(Constants.Session.FORGOT_PASSWORD_OBJECT);

  }

  handleSubmit(e) {
    e.preventDefault();
    var eUsername = '';
    var ePassword = '';

    const { username, password } = this.state;

    if (username.length === 0) {
      eUsername =  "Username cannot be empty";
    }

    if (password.length === 0) {
      ePassword = "Password  cannot be empty";
    }

    if (username.length === 0 || password.length === 0)  {
      this.setState({ errorUsername: eUsername, errorPassword: ePassword, classDisplay: 'no-display' });
      return;
    }

    this.signIn()
  }

  componentDidMount() {
    
    this.auth();
    // this.interval = setInterval(() =>  this.heartbeat() , Config.Setting.heartbeatInterval);
    
  }

  // heartbeat = async () => {
  // await AuthService.heartbeat();
  // }

  
  auth = async (mId,authId) => {

    
        await AuthService.getJWTToken();
    
    var mID = localStorage.getItem(Constants.MEMBERSHIP_ID);
    
    
    
    if(!Utilities.stringIsEmpty(mID) && mID !== null ){
      this.setUser();
    }
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

  


  setUser = async () => {

  let permissions =  await PermissionService.GetAll();
  // console.log("permissions: ", permissions);
   var mid =  localStorage.getItem(Constants.MEMBERSHIP_ID);
  var authId = localStorage.getItem(Constants.Session.AUTHENTICATION_TICKET);
  var noImage = "000000000_no-image.jpg";
  let userData = await UserService.GetByMembershipId(mid);
  // console.log("membershipUser: ", userData);

if(userData !=null && userData.length != 0 ) {

  if (!Utilities.stringIsEmpty(userData.PhotoName)) {
    userData.photoThumbUrl = Utilities.generatePhotoThumbURL(userData.PhotoName, true, false);
  }

  if (!Utilities.stringIsEmpty(userData.PhotoName)) {
    userData.photoLargeUrl = Utilities.generatePhotoLargeURL(userData.PhotoName, true, false);
  }

  if (userData.photoThumbUrl === Utilities.generatePhotoThumbURL(noImage, true, false) || userData.photoLargeUrl === Utilities.generatePhotoLargeURL(noImage, true, false)) {
    userData.photoThumbUrl = "";
  }
              let SessionStartTime = moment(new Date());

  localStorage.setItem(Constants.Session.ALL_PERMISSION, JSON.stringify(permissions));
  
  localStorage.setItem(Constants.Session.USER_OBJECT, JSON.stringify(userData));
  localStorage.setItem(Constants.Session.ENTERPRISE_ID, userData.Enterprise.Id);
  localStorage.setItem(Constants.Session.ENTERPRISE_NAME, userData.Enterprise.Name);
  localStorage.setItem(Constants.Session.IMPERSONATORID, "");
  localStorage.setItem(Constants.Session.SESSION_START_AT, SessionStartTime);
  let loginUser = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT));
  if(userData.Enterprise.EnterpriseTypeId == 5 || userData.RoleLevel === Constants.Role.SYSTEM_ADMIN_ID || userData.RoleLevel === Constants.Role.SYSTEM_OPERATOR_ID || userData.RoleLevel === Constants.Role.FOORTAL_SUPPORT_ADMIN_ID || userData.RoleLevel === Constants.Role.FOORTAL_SUPPORT_USER_ID || userData.RoleLevel === Constants.Role.RESELLER_ADMIN_ID || userData.RoleLevel == Constants.Role.RESELLER_MODERATOR_ID ) {
    
    window.location.href = loginUser.Enterprise.EnterpriseTypeId == 5 ? 'dashboard' : '/businesses'; 
  }

  else  if(userData.Enterprise.EnterpriseTypeId == 15 ) {
    
    window.location.href = userData.RoleLevel === Constants.Role.STAFF_ID || userData.Enterprise.TotalComplaints > 0 ? "/active-requests": "/support-types";
    
  }

  else if(userData.RoleLevel === Constants.Role.MARKETING_ADMIN_ID){
    this.props.history.push('/app-notification');
  }

  else {
    let json = await EnterpriseMenuService.GetEnterpriseJson()
    if (json !== null && json !== undefined) {
      
      }
    window.location.href = '/menu/build-menu';
  }

} else 
{
  window.location.href = '/Logout'
}
}

  signIn = async () => {
    
    if(this.state.showLoader) return;
    this.setState({ showLoader: true })

    if (Utilities.stringIsEmpty(this.state.username)) {
      // console.log("username required");
      
    }
    else if (Utilities.stringIsEmpty(this.state.password)) {
      this.state.errorMessage = "password required";
      // console.log("password required");
      this.setState({ showLoader: false })
      return;
    }
    else {
         //this.setState({ classDisplay: '' });

         var response = await UserService.login(this.state.username, this.state.password);
         
         if(response.status !== 200) { 
          this.setState({ errorMsg: `Error : [${response.status}]  ${response.statusText}` , errorPassword : '',  classDisplay: 'no-display'   });
          return;
        }

        var  result = await response.json();
         
         var noImage = "000000000_no-image.jpg";
         if(!result.HasError) {
          if(result.Dictionary.LoggedInUser !== undefined) {
            
            let permissions =  await PermissionService.GetAll();
            var userData = JSON.parse(result.Dictionary.LoggedInUser);
            
            if(userData.RoleLevel === Constants.Role.CONSUMER_ID){
              this.setState({ errorMsg: `You cannot log in to Backoffice using consumer account.` , errorPassword : '',  classDisplay: 'no-display'   });
              return;
            }

              if (!Utilities.stringIsEmpty(userData.PhotoName)) {
                userData.photoThumbUrl = Utilities.generatePhotoThumbURL(userData.PhotoName, true, false);
              }
    
              if (!Utilities.stringIsEmpty(userData.PhotoName)) {
                userData.photoLargeUrl = Utilities.generatePhotoLargeURL(userData.PhotoName, true, false);
              }
              
              if (userData.photoThumbUrl === Utilities.generatePhotoThumbURL(noImage, true, false) || userData.photoLargeUrl === Utilities.generatePhotoLargeURL(noImage, true, false)) {
                userData.photoThumbUrl = "";
              }
              let SessionStartTime = moment(new Date());

              localStorage.setItem(Constants.Session.ALL_PERMISSION, JSON.stringify(permissions));
              localStorage.setItem(Constants.Session.AUTHENTICATION_TICKET, userData.AuthenticationToken)
              localStorage.setItem(Constants.Session.USER_OBJECT, JSON.stringify(userData));
              localStorage.setItem(Constants.Session.ENTERPRISE_ID, userData.Enterprise.Id);
              localStorage.setItem(Constants.Session.ENTERPRISE_NAME, userData.Enterprise.Name);
              localStorage.setItem(Constants.Session.SESSION_START_AT, SessionStartTime);
              localStorage.setItem(Constants.Session.IMPERSONATORID, "");
            if (userData.Enterprise.Id != undefined && userData.Enterprise.Id != 0 && userData.Enterprise.Id != null) {
              //this.deviceRegistration(userData.Enterprise.Id);
              
              await new Promise(resolve => setTimeout(resolve, 2000));

              let countyObj =  await CountryService.getCountry(userData.EnterpriseRestaurant.CountryId);
              localStorage.setItem(Constants.Session.COUNTRY_CONFIGURATION, JSON.stringify(countyObj))
            }
              
              if(userData.Enterprise.EnterpriseTypeId == 5 || userData.RoleLevel == Constants.Role.SYSTEM_ADMIN_ID || userData.RoleLevel == Constants.Role.SYSTEM_OPERATOR_ID 
                || userData.RoleLevel === Constants.Role.FOORTAL_SUPPORT_ADMIN_ID || userData.RoleLevel === Constants.Role.FOORTAL_SUPPORT_USER_ID 
                || userData.RoleLevel === Constants.Role.RESELLER_ADMIN_ID || userData.RoleLevel === Constants.Role.RESELLER_MODERATOR_ID 
                || userData.RoleLevel == Constants.Role.RESELLER_KEY_ACCOUNT_MANAGER_ID
                ) {
                
                window.location.href = userData.Enterprise.EnterpriseTypeId == 5 ? 'dashboard' : '/businesses'; 
                
              }  else if(userData.Enterprise.EnterpriseTypeId == 15)
              
              {
                window.location.href = userData.RoleLevel === Constants.Role.STAFF_ID || userData.Enterprise.TotalComplaints > 0 ? "/active-requests": "/support-types";
              }
              
              else if(userData.RoleLevel === Constants.Role.MARKETING_ADMIN_ID){
                this.props.history.push('/app-notification');
              }
              else {
                let json = await EnterpriseMenuService.GetEnterpriseJson()
                if (json !== null && json !== undefined) {
               
                  }
                window.location.href = '/menu/build-menu';
             }
           }
      }else {
       
        if(result.HasError){
          // var eMsg = "Invalid username or password" ;
          this.setState({ errorMsg: result.ErrorCodeCsv, errorPassword : '', errorUsername:'', classDisplay: 'no-display'   });
          return;
        }
      }

      this.setState({ showLoader: false })
    }
  }
  
  deviceRegistration = (EnterpriseId) => {
    try {
    // console.log("EnterpriseId: ", EnterpriseId)
      if (isSupported()) {
      const messaging = getMessaging();
      Notification.requestPermission().then((permission)=>{
        if(permission == 'granted'){
          getToken(messaging, { vapidKey: firebaseVapidKey })
          .then((token) => {
              if (token) {
                // console.log('current token for client: ', token);
                let deviceinfo = deviceHelpher.getDeviceInfo(token, EnterpriseId)
                deviceHelpher.saveDeviceInfo(deviceinfo)
              } else {
                console.log('No registration token available. Request permission to generate one.');
              }
            }).catch((err) => {
              console.log('An error occurred while retrieving token. ', err);
            });
            return
        }
        Notification.requestPermission()
        console.log('Notification Permission Denied.');
      })

        }
    }
    catch (e) {
      console.log("Exception deviceRegistration", e)
    }
  }


  ForgotPassword(e) {
    e.preventDefault();
    this.props.history.push('/forgot-password')
  }


  render() {
   var mID = localStorage.getItem(Constants.MEMBERSHIP_ID);

   if(!Utilities.stringIsEmpty(mID) && mID !== null )
   return this.loading()

    return (
      <div className="app flex-row align-items-center" id="loginWrapper">
        <Container>
          <Row className="">
 
            <Col lg="8" md="12" sm="12">
              <CardGroup className="loginMainDV">
                <Card className="loginBox">
                <div className="login-title-wrap">                                                                          
                <img  className="lazy responsive-logo" src={Utilities.generatePhotoURL("/images/logo.png")} alt="logo" />
             

            </div>
                  <CardBody style={{backgroundColor:'transparent'}}>
                    <Form onSubmit={this.handleSubmit}>
                      <h1 className="login-title">Login to your account</h1>
                      <div className="login-field-error" style={{marginTop:'0px'}}>{this.state.errorMsg}</div>
                       {/* <div className={this.state.classDisplay}>
                          {this.loading()}
                       </div> */}
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText className="form-control-right">
                            <i className="fa fa-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" className="loginInput form-control-left" value={this.state.username} placeholder="Username" onChange={e => this.onChangeText('username', e.target.value)} />
                      
                      </InputGroup>
                      <div className="login-field-error">{this.state.errorUsername}</div>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText className="form-control-right">
                            <i className="fa fa-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type={this.state.type}  className="loginInput form-control-left" value={this.state.password} placeholder="Password" onChange={e => this.onChangeText('password', e.target.value)} />
                      
                        <span className="password__show" onClick={this.showHide}> <span className={this.state.type === 'password' ? 'fa fa-eye-slash ' : 'fa fa-eye '}></span></span>
                      </InputGroup>
                      <div className="login-field-error">{this.state.errorPassword}</div>
                      <Row className="mb-3">
                        <Col xs="6">
                          <Button type="submit" color="primary" className="px-4 btn-square btn-lg ">

                             {this.state.showLoader ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                                            : <span className="comment-text">Login</span>}
                          </Button>

                          




                        </Col>
                        <Col xs="6" className="text-right" style={{whiteSpace: 'nowrap'}}>
                          <Button color="link" className="px-0" onClick={(e) =>this.ForgotPassword(e)}>Forgot password?</Button>
                      </Col>
                      </Row>
                      <Row>
                   
                     
                      </Row>
                      
                      {/* <Button color="link" className="px-0" style={{display:'flex',justifyContent:'center',width:'100%', marginTop:'0.5rem'}}>Register as a new user</Button> */}
                    </Form>
                  </CardBody>
                </Card>
                {/* <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card> */}
              </CardGroup>
            </Col>
            <Col md="4" className="login-rightimg">
            
                <div> <img  className="lazy responsive-logo" src={loginright} alt="logo" />
</div>
</Col>
        
          </Row>
        </Container>
      </div>
    );
  }
}

// var LoadingDiv = React.createClass({
//   render: function() {
//       return (
//         ''
//       );
//   }
// });

/*const LoadingDiv = () => (
  <div className='modal'>
        Hello, World!
    </div>
  )*/

export default Login;
