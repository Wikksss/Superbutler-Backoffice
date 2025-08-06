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
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { FaUserTie } from "react-icons/fa";
const $ = require('jquery');


class Resellers extends Component {

  //#region Constructor
  constructor(props) {
    super(props);
    this.state = {
      AddNewReseller: false,
      type:'password'
    };
    this.showHide = this.showHide.bind(this);
  }
  showHide(e) {
    // e.preventDefault();
    // e.stopPropagation();

    this.setState({
      type: this.state.type === 'password' ? 'text' : 'password'
    })
  }
  AddNewResellerModal() {
    this.setState({
      AddNewReseller: !this.state.AddNewReseller,
    })
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
  // shouldComponentUpdate() {
  // }
  

  render() {
    return (
      <div className="card resellers-new-m-wrap" id="userDataWraper">
               <div className="card-new-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>   <h3 className="card-title" data-tip data-for='happyFace'>{Labels.Reseller} (2)
                                </h3>
              {/* <button className="btn btn-primary"><i className="fa fa-plus" aria-hidden="true"></i> {Labels.Add_Users}</button> */}
              <span className="btn btn-primary" onClick={() => this.AddNewResellerModal()}><i className="fa fa-plus mr-2" aria-hidden="true"></i>Add new </span>
          
          </div>
        <div className="card-body">
          <div className="left-row-rest">

            <label htmlFor="chkAll">
              <input type="checkbox" className="form-checkbox" name="chkAll" id="chkAll"/> <span className="settingsLabel" >{'Active'}</span>
            </label>
            <label htmlFor="chkChurned">
              <input type="checkbox" name="chkChurned" className="form-checkbox" id="chkChurned"/><span className="settingsLabel" >{'Inactive'}</span>
            </label>
          </div>
          <div className='d-flex flex-column'>
          <div className="dataTables_filter"><label><input type="text" id="" className="form-control common-serch-field" placeholder="Search"/></label>
          </div>

            <div className='resellers-grid-wrap'>
              <div className='res-left'>
                <div className='left-img'>
                  <img src="https://cdn.superme.al/s/butler/images/000/001/000001633_images--1-.jpg" />
                </div>
                <div className='region-wrap'>
                  <div className='inner-left'>
                    <span className='c-name'>PC Lounge</span>
                  </div>
                  <div className='inner-right'>
                    {/* <span className='sub-text'>Region</span> */}
                    <div className='country-wrap'>
                      <img src='https://cdn.superme.al/s/butler/images/000/000/00000000_pakistan.png' />
                      <span className='country-name'>Pakistan</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='res-right'>
              <div className='hide-res'>
                <div className='impersonate'>
                  <span class="link-t-c">
                    <i class="fa fa-user-plus" aria-hidden="true"></i><span>Impersonate</span>
                  </span>
                </div>
                <div className='suspend'>
                  <span class="link-t-c c-change">
                    <i class="fa fa-ban" aria-hidden="true"></i><span>Suspend</span>
                  </span>
                </div>
                <a className='edit' href='/editbusiness'>
                  <span class="link-t-c">
                    <i class="fa fa-edit" aria-hidden="true"></i><span>Edit</span>
                  </span>
                </a>
              </div>
              <div className="user-data-action-btn-res right-dropdown">
                <div className="show-res">
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                      <span>
                        <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                      </span>
                      <span>
                        {Labels.Options}
                      </span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <div>
                        <span className="link-t-c m-b-0 statusChangeLink m-r-20" ><i className="fa fa-user-plus" aria-hidden="true"></i><span>{Labels.Impersonate}</span></span>
                        <span className="link-t-c m-b-0 statusChangeLink m-r-20" ><i className="fa fa-ban" aria-hidden="true"></i><span>{Labels.Suspend}</span></span>
                        <a href='/editbusiness'><span className="link-t-c m-b-0 statusChangeLink m-r-20" ><i className="fa fa-edit" aria-hidden="true"></i><span>{Labels.Edit}</span></span></a>
                        {/* {this.state.HasEnterpriseDeletePermission ? <span className="link-t-c m-b-0 statusChangeLink m-r-20" onClick={() => this.DeleteConfirmation(enterprise.Id, enterpriseName, enterprise.EnterpriseTypeId)}><i className="fa fa-trash-o" aria-hidden="true"></i><span>{Labels.Delete}</span></span>: ''} */}
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

              </div>

              </div>

          



            </div>

            <div className='resellers-grid-wrap'>
              <div className='res-left'>
                <div className='left-img'>
                  <img src="https://cdn.superme.al/s/butler/images/000/001/000001472_connekt.jpg" />
                </div>
                <div className='region-wrap'>
                  <div className='inner-left'>
                    <span className='c-name'>Connect Commercial Hub New</span>
                  </div>
                  <div className='inner-right'>
                    {/* <span className='sub-text'>Region</span> */}
                    <div className='country-wrap'>
                      <img src='https://cdn.superme.al/s/butler/images/000/000/00000000_united-kingdom.png' />
                      <span className='country-name'>United Kingdom</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='res-right'>
                <div className='hide-res'>
                <div className='impersonate'>
                  <span class="link-t-c">
                    <i class="fa fa-user-plus" aria-hidden="true"></i><span>Impersonate</span>
                  </span>
                </div>
                <div className='suspend'>
                  <span class="link-t-c c-change">
                    <i class="fa fa-ban" aria-hidden="true"></i><span>Suspend</span>
                  </span>
                </div>
                <a className='edit' href='/editbusiness'>
                  <span class="link-t-c">
                    <i class="fa fa-edit" aria-hidden="true"></i><span>Edit</span>
                  </span>
                </a>
                </div>
                <div className="user-data-action-btn-res right-dropdown">
                <div className="show-res">
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                      <span>
                        <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                      </span>
                      <span>
                        {Labels.Options}
                      </span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <div>
                        <span className="link-t-c m-b-0 statusChangeLink m-r-20" ><i className="fa fa-user-plus" aria-hidden="true"></i><span>{Labels.Impersonate}</span></span>
                        <span className="link-t-c m-b-0 statusChangeLink m-r-20" ><i className="fa fa-ban" aria-hidden="true"></i><span>{Labels.Suspend}</span></span>
                        <span className="link-t-c m-b-0 statusChangeLink m-r-20" ><i className="fa fa-edit" aria-hidden="true"></i><span>{Labels.Edit}</span></span>
                        {/* {this.state.HasEnterpriseDeletePermission ? <span className="link-t-c m-b-0 statusChangeLink m-r-20" onClick={() => this.DeleteConfirmation(enterprise.Id, enterpriseName, enterprise.EnterpriseTypeId)}><i className="fa fa-trash-o" aria-hidden="true"></i><span>{Labels.Delete}</span></span>: ''} */}
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

              </div>
              </div>

            



            </div>
        </div>

        <Modal isOpen={this.state.AddNewReseller} toggle={() => this.AddNewResellerModal()} className={this.props.className}>
          <ModalHeader toggle={() => this.AddNewResellerModal()} >Add Reseller</ModalHeader>
          <AvForm>
          <ModalBody >
          <div className="row">
          <div className="col-md-12">
                  <div className="form-group mb-3">
                    <label id="businessName" className="control-label">Business name
                    </label>
                    <AvField  name="businessName" type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label id="Email" className="control-label">Email
                    </label>
                    <AvField  name="businessName" type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label id="Username" className="control-label">Username
                    </label>
                    <AvField  name="businessName" type="text" className="form-control"
                      validate={{
                        required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
          <div className="form-group mb-3">
            <label id="Password" className="control-label">Password </label>
            <AvField  name="passwrd" type={this.state.type} className="form-control pr-5"
              validate={{
                required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                // myValidation: passwordTextValidation,
                // minLength: { value: 6, errorMessage: 'Your password must be more than 6 characters' },
              }}

            />
            <span className="password__show show-password-info" onClick={this.showHide}> <span className={this.state.type === 'password' ? 'fa fa-eye-slash ' : 'fa fa-eye '}></span></span>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label id="confirmPassword" className="control-label">Confirm Password </label>
            <AvField  name="confirmPassword" type={this.state.type} className="form-control pr-5"
              validate={{
                required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                // myValidation: passwordTextValidation,
                // minLength: { value: 6, errorMessage: 'Your password must be more than 6 characters' },
              }}

            />
            <span className="password__show show-password-info" onClick={this.showHide}> <span className={this.state.type === 'password' ? 'fa fa-eye-slash ' : 'fa fa-eye '}></span></span>
          </div>
        </div>
        <div className="col-md-6">
                  <div className="form-group mb-3 phone-number-eg-wrap">
                    <label id="mobileNmbrOne" className="control-label">Phone number
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
                      value={""} 
                      onChange={this.handleOnChange}
                      onFocus={this.handleOnFocus}
                      // onChange={phone => this.setState({ mobOne: phone, mobError: false })}
                    />
                    </div>
                    
                   
                  </div>
                </div>
                
            </div>
          </ModalBody>
          <FormGroup className="modal-footer" >
            <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger"></label>
            </div>
            <div>
              <Button className='mr-2 text-dark' color="secondary" onClick={() => this.AddNewResellerModal()}>Cancel</Button>
              <a className="btn btn-primary" href='/editbusiness'>
              {/* <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>   */}
                 <span className="comment-text">Continue</span> 
              </a>
            </div>
          </FormGroup>
          </AvForm>
        </Modal>
        </div>

    


      </div>

    );
  }

}

export default Resellers;
