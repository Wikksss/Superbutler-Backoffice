import React, { Component } from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import * as EnterpriseService from '../../service/Enterprise';
import * as EnterpriseSettingService from '../../service/EnterpriseSetting';
import * as UserService from '../../service/User';
import Constants from '../../helpers/Constants';
import Config from '../../helpers/Config';
import * as Utilities from '../../helpers/Utilities';
import Loader from 'react-loader-spinner';

const passwordTextValidation = (value, ctx) => {

    if(value === "" || value === undefined || null) return;
    if (value.toUpperCase() === "PASSWORD") {
      return "Your password cannot be 'password'";
    }
    return true;
  }

class ChangePassword extends Component {

    constructor(props) {
        // let bankDetailArray  = Config.Setting.bankkDetails.split(';');
        super(props);
        this.state = {
            show: false,
              IsSave:false,
              ShowLoader: true,
              IsUpdate: false,
              SelectedUserName: "",
              type: 'password',
              OldPwdtype: 'password', 
              Empty:true,
      };

      if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      
        let userObj= JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
          this.state.SelectedUserName = Utilities.stringIsEmpty(userObj.UserName) ? userObj.PrimaryEmail : userObj.UserName
      }  

      this.ChangePassword = this.ChangePassword.bind(this);
      this.ChangePasswordApi = this.ChangePasswordApi.bind(this);

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

componentDidMount() {
  
   } 

  onChangeText = (key, value) => {
    this.setState({ [key]: value })
  }

  showHide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    this.setState({
      type: this.state.type === 'password' ? 'text' : 'password'
    })  
  }

  showHideOldPwd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    this.setState({
      OldPwdtype: this.state.OldPwdtype === 'password' ? 'text' : 'password'
    })  
  }

  ChangePasswordApi = async (oldPassword, newPassword) => {

    this.setState({Empty: false});
    let changed = await UserService.ChangePassword(oldPassword, newPassword)
    
    if (changed === '1') {

      Utilities.notify("Password has been changed successfully." ,"s");

      setTimeout(() => { 
        
        this.setState({Empty: true, type: 'password', OldPwdtype: 'password'});
      }, 100)
    
    } else if(changed === '0') {
     
      Utilities.notify("Update failed.","e");

    } else {
      Utilities.notify("Update failed. " + changed ,"e");
    }
    this.setState({IsSave:false})

  }

  ChangePassword(event, values) {
    
    if(this.state.IsSave) return;
    this.setState({IsSave:true})
    this.ChangePasswordApi(values.txtOldPassword, values.txtNewPassword);

  }

   render() {
    return (
        <div className="card " id="generalSettingsDv"> 
           <h3 className="card-title card-new-title">Change Password</h3>
            <div className="card-body">

                {this.state.Empty? 
                
                <AvForm onValidSubmit={this.ChangePassword}>
                <div className="padding-20">
             
              <FormGroup className="modal-form-group position-relative">
                <Label for="txtOldPassword" className="control-label">Current Password</Label>
                <AvField name="txtOldPassword" type={this.state.OldPwdtype}  validate={{
                  required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                }}
                  className="form-control" />
                      <span className="password__show show-password-users" onClick={this.showHideOldPwd}> <span className={this.state.OldPwdtype === 'password' ? 'fa fa-eye-slash ' : 'fa fa-eye '}></span></span>
              </FormGroup>
              <FormGroup className="modal-form-group position-relative">
                <Label for="txtNewPassword" className="control-label">New Password</Label>
                <AvField  onChange={e => this.onChangeText('password', e.target.value)} name="txtNewPassword" type={this.state.type}  validate={{
                  required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                  myValidation: passwordTextValidation,
                  minLength: { value: 6, errorMessage: 'Your password must be more than 6 characters'},
                }}
                  className="form-control" />
                      <span className="password__show show-password-users" onClick={this.showHide}> <span className={this.state.type === 'password' ? 'fa fa-eye-slash ' : 'fa fa-eye '}></span></span>
              </FormGroup>

              <FormGroup className="modal-form-group">
                <Label for="confirmPassword" className="control-label">Confirm Password</Label>
                <AvField  name="confirmPassword" type={this.state.type} validate={{
                  required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                  myValidation: passwordTextValidation,
                  match: { value: 'txtNewPassword', errorMessage: 'Confirm Password does not match' },
                  minLength: { value: 6, errorMessage: 'Your password must be more than 6 characters' },
                }}
                  className="form-control" required />
              </FormGroup>

              <FormGroup className="modal-form-group">
                <AvField name="hdMembershipId" type="hidden" value={this.state.membershipUserId} />
              </FormGroup>

            </div>
                       
                        <Button color="secondary" onClick={() => this.GoBack()} style={{ marginRight: 10 }}>Cancel</Button>				
                        <Button color="primary" style={{width:'80px'}}>
                        {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                        : <span className="comment-text">Change</span>}
                          </Button>
                    
                </AvForm>
              : 
              <AvForm onValidSubmit={this.ChangePassword}>
              <div className="padding-20">
           
            <FormGroup className="modal-form-group position-relative">
              <Label for="txtOldPassword1" className="control-label">Current Password</Label>
              <AvField  value="" name="txtOldPassword1" type={this.state.OldPwdtype}  validate={{
                required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
              }}
                className="form-control" />
                    <span className="password__show show-password-users" onClick={this.showHideOldPwd}> <span className={this.state.OldPwdtype === 'password' ? 'fa fa-eye-slash ' : 'fa fa-eye '}></span></span>
            </FormGroup>
            <FormGroup className="modal-form-group position-relative">
              <Label for="txtNewPassword1" className="control-label">New Password</Label>
              <AvField  value="" onChange={e => this.onChangeText('password', e.target.value)} name="txtNewPassword1" type={this.state.type}  validate={{
                required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                myValidation: passwordTextValidation,
                minLength: { value: 6, errorMessage: 'Your password must be more than 6 characters'},
              }}
                className="form-control" />
                    <span className="password__show show-password-users" onClick={this.showHide}> <span className={this.state.type === 'password' ? 'fa fa-eye-slash ' : 'fa fa-eye '}></span></span>
            </FormGroup>

            <FormGroup className="modal-form-group">
              <Label for="confirmPassword1" className="control-label">Confirm Password</Label>
              <AvField  value="" name="confirmPassword1" type={this.state.type} validate={{
                required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                myValidation: passwordTextValidation,
                match: { value: 'txtNewPassword', errorMessage: 'Confirm Password does not match' },
                minLength: { value: 6, errorMessage: 'Your password must be more than 6 characters' },
              }}
                className="form-control" required />
            </FormGroup>

            <FormGroup className="modal-form-group">
              <AvField name="hdMembershipId" type="hidden" value={this.state.membershipUserId} />
            </FormGroup>

          </div>
                     
                      <Button color="secondary" onClick={() => this.GoBack()} style={{ marginRight: 10 }}>Cancel</Button>				
                      <Button color="primary" style={{width:'78px'}}>
                      {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                      : <span className="comment-text">Change</span>}
                        </Button>
                  
              </AvForm>
              
              }
            </div>
        </div>
    );
}
}

export default ChangePassword;

