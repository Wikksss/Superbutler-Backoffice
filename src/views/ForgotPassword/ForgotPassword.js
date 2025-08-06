import React, { Component } from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { FormGroup, Label, Button, Modal, Col, Container, Row, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import * as EnterpriseService from '../../service/Enterprise';
import * as EnterpriseSettingService from '../../service/EnterpriseSetting';
import * as UserService from '../../service/User';
import Constants from '../../helpers/Constants';
import logo from '../../assets/img/brand/logo.png'
import Config from '../../helpers/Config';
import * as Utilities from '../../helpers/Utilities';

import Loader from 'react-loader-spinner';


class ForgotPassword extends Component {

    constructor(props) {
        
        super(props);
        this.state = {
            show: false,
              IsSave:false,
              ShowLoader: true,
              IsUpdate: false,
              Message: "",
              UserName:"",
              MembershipId: "",
              Token: "",
              TokenSent: false,
              TokenResent: false,
              TokenError: false,
              ResetErrorText: "",
              ResetError: false,
              type: 'password',
              NewPassword: "",
              errorMessage:"",
      };

      this.setState({UserName:"", Token:"", NewPassword: "" });

      if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.FORGOT_PASSWORD_OBJECT))) {
        let obj = JSON.parse(localStorage.getItem(Constants.Session.FORGOT_PASSWORD_OBJECT));
        this.state.TokenSent = true;
        this.state.MembershipId= obj.MembershipId;
        this.state.Message= obj.Message;
        this.state.UserName = obj.UserName;
    }

      this.ForgotPassword = this.ForgotPassword.bind(this);
      this.VerifyAndResetPassword = this.VerifyAndResetPassword.bind(this);

    }
    
    loading = () =>   <div className="page-laoder page-laoder-menu">
    <div className="loader-menu-inner"> 
      <Loader type="Oval" color="#ed0000" height={50} width={50}/>  
      <div className="loading-label">Loading.....</div>
      </div>
    </div> 

GoBack(){
    
    this.props.history.goBack();

  }

  ForgotPasswordApi = async (userName) => {

    let result = await UserService.ForgotPassword(userName)
    
    if (!result.HasError && result !== undefined) {
      
      if(this.state.TokenSent){
          this.setState({TokenResent: true});
      }

        result.Dictionary.TokenCode = "";
        result.Dictionary.UserName = userName;
        localStorage.setItem(Constants.Session.FORGOT_PASSWORD_OBJECT,JSON.stringify(result.Dictionary))
        this.setState({TokenSent: true, UserName: userName, MembershipId: result.Dictionary.MembershipId, Message: result.Dictionary.Message, IsSave:false });
        return
    }
    
    this.setState({IsSave:false, errorMessage: result.ErrorCodeCsv})

  }

ForgotPassword(event, values){
    if(this.state.IsSave) return;
    this.setState({IsSave:true})
    this.ForgotPasswordApi(values.txtUserName);

}


VerifyAndResetPasswordApi = async (token,newPwd) => {
    
    let changed = await UserService.VerifyTokenForgotPassword(token,newPwd,this.state.MembershipId)

    if (changed === '1') {

        // Utilities.notify("Password has been Reset successfully." ,"s");
        localStorage.removeItem(Constants.Session.FORGOT_PASSWORD_OBJECT);
        this.setState({Reset: true});
    }  else  if (changed === '0') {  
        this.setState({ResetErrorText: "Password reset failed.", ResetError: true})
      } else {
        this.setState({ResetErrorText: changed, ResetError: true})
      }
      this.setState({IsSave:false})

  }

VerifyAndResetPassword(event, values) {
    if(this.state.IsSave) return;
    this.setState({IsSave:true})
    this.VerifyAndResetPasswordApi(values.txtToken, values.txtNewPassword);
}


showHide = (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  this.setState({
    type: this.state.type === 'password' ? 'text' : 'password'
  })  
}

componentDidMount() {
     

   } 

   render() {
    

    return (
      <div class="app flex-row align-items-center" id="forgotpswdpage">
        <Container>
          <Row className="">
        <Col md="8" className="forgotpswdinner">
          <div className="card " id="generalSettingsDv"> 
           <div className="forgotlogo card-new-title"> <img  className="lazy responsive-logo forgotlogotext" style={{width:200}} src={ Utilities.generatePhotoURL('/images/logo-horizontal.png')} alt="logo" />
                </div>
                {/* <div className="forgotlogotext">Business Backoffice Portal</div> */}
        {!this.state.Reset ?  <h3 className="card-title" style={{padding:"0px 15px"}}>Forgot Password</h3> : ""}
        <div className="card-body">
   
            
        {!this.state.Reset ? 

             this.state.MembershipId === "" ?
            
           <AvForm onValidSubmit={this.ForgotPassword}>
            <div className="">
        
          <FormGroup className="modal-form-group">
            <Label for="txtUserName" className="control-label">Please enter your username</Label>
            <AvField value={this.state.UserName} name="txtUserName" autocomplete="off"  validate={{
              required: { value: this.props.isRequired, errorMessage: "You can't leave Username empty"},
              
            }}
              className="form-control" required  />
              <span className='text-danger'>{this.state.errorMessage}</span>
          </FormGroup>
            </div>
                  
                    <Button color="primary" className="f-contbtn btn btn-primary">
                    {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                    : <span className="comment-text">Continue</span>}
                      </Button>
                      <Button color="secondary" className="f-cancelbtn" onClick={() => this.GoBack()} style={{ marginRight: 10 }}>Cancel</Button>
                
            </AvForm>
             
             :

            <AvForm onValidSubmit={this.VerifyAndResetPassword}>
            <div className="">
            
          <FormGroup className="modal-form-group">
            <Label for="txtToken" className="control-label">{this.state.Message}</Label>
            <div className="codeblow"> Please enter the code below.</div>
            <Label for="txtNewPassword"  className="control-label">Password Reset Code</Label>
            <AvField value={this.state.Token}  name="txtToken" type="text" placeholder="Code" validate={{
              required: { value: this.props.isRequired, errorMessage: "You can't leave code empty"},
            }}
              className="form-control"  />
          </FormGroup>
         
          <FormGroup className="modal-form-group position-relative">
            <Label for="txtNewPassword" className="control-label">New Password</Label>
            <AvField value={this.state.NewPassword} autocomplete="off" name="txtNewPassword" placeholder="New Password" type={this.state.type} validate={{
              required: { value: this.props.isRequired, errorMessage: "You can't leave Password empty"},
            }}
              className="form-control"
              />
              <span className="password__show show-password-users" onClick={this.showHide}> <span className={this.state.type === 'password' ? 'fa fa-eye-slash ' : 'fa fa-eye '}></span></span>
              <p className="resentcode">
                <a href="#" onClick={() => this.ForgotPasswordApi(this.state.UserName)}>Didn't get code? Resend</a>
              </p>
              {this.state.ResetError ? <p className="forgot-eror">{this.state.ResetErrorText}</p> : ""} 
              {this.state.TokenResent ? <div className="codeblow"> Code resent successfully.</div> : ""}
          </FormGroup>

            </div>
                    <Button color="primary"  className="f-contbtn">
                    {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                    : <span className="comment-text">Reset</span>}
                      </Button>
                      <div className="f-loging">
                      <a href="/login">Back to login</a>
                </div>            
                </AvForm>
          
                        :
           
            <div className="forgotpswdmsg">
               <div className="pswdmsgshow">
                 <p><i class="fa fa-check-circle" aria-hidden="true"></i> <span>Password has been reset!</span></p>
               </div>
               <div className="f-loging">
                      <a href="/login">Back to login</a>
                </div>
            </div>
        }

            {!this.state.Reset ? 
                    <div className="forgot-note">
                        <p><strong> NOTE: </strong>If you have any issues with recovering your password, please write to us on <strong>{Config.Setting.SupportEmail}</strong></p>
                      </div>
            :""}
        </div>
    </div>
    </Col>
        
        </Row>
      </Container>
        </div>
    
    );
}
}

export default ForgotPassword;

