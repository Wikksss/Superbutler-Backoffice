import React, { Component } from 'react';
import { FormGroup, Button, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import 'sweetalert/dist/sweetalert.css';
import { AvForm, AvField } from 'availity-reactstrap-validation';
//import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Pagination from "react-js-pagination";
import * as EnterpriseService from '../../service/Enterprise';
import * as EnterpriseUserService from '../../service/EnterpriseUsers';
import * as EnterpriseMenuService from '../../service/EnterpriseMenu';
import * as UserService from '../../service/User';
import * as CountryService from '../../service/Country';
import * as AccountService from '../../service/Account';
import * as Utilities from '../../helpers/Utilities';
import Constants from '../../helpers/Constants';
import Config from '../../helpers/Config';
import Loader from 'react-loader-spinner';
import SweetAlert from 'sweetalert-react'; 
import 'sweetalert/dist/sweetalert.css';
import moment from 'moment';
import GlobalData from '../../helpers/GlobalData'

export default class Staff extends Component {
  constructor(props) {
    super(props);
    this.state = {
    departmentModal:false,
    staffModal:false,

    }
  }
  DepartmentModalFun() {
    this.setState({ departmentModal: !this.state.departmentModal, 
    })
  }
  StaffModalModalFun() {
    this.setState({ staffModal: !this.state.staffModal, 
    })
  }
  DepartmentModalHTML () {
    return(
      <Modal isOpen={this.state.departmentModal} className={this.props.className}>
      <ModalHeader>Add New</ModalHeader>
      <ModalBody className="padding-0">
        <AvForm >
        <div className="padding-20 scroll-model-web">
            <FormGroup className="modal-form-group">
              <Label htmlFor="categoryName" className="control-label">Department Name</Label> 
              <AvField errorMessage="This is a required field" value="" name="categoryName" type="text" className="form-control" required />
            </FormGroup>

            <FormGroup className="modal-form-group">
              <Label htmlFor="txtDesc" className="control-label">Description</Label> 
              <AvField style={{minHeight:120}} name="txtShortDesc" type="textarea" className="form-control" value="" />
            </FormGroup>
        
            <FormGroup className="modal-form-group">
              <Label htmlFor="CategoryTopping" className="control-label">Choose Service </Label>
              <select className="select2 form-control custom-select" name="CategoryTopping"  > 
                <option  value="0" >Tour Package</option>
                <option  value="-1">Housekeeping</option>
               </select>
            </FormGroup>
         
          </div>
          <FormGroup className="modal-footer">
            <Button color="secondary" onClick={() => this.DepartmentModalFun({})}>Cancel</Button>
            <Button color="primary" >
            {/* {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                           : <span className="comment-text">Save</span>} */}
                           <span className="comment-text">Save</span>
          
          </Button> 
          </FormGroup>
        </AvForm>
      </ModalBody>
    </Modal>
    )
      }

      StaffModalHTML () {
        return(
          <Modal isOpen={this.state.staffModal} className={this.props.className}>
          <ModalHeader>Electrician Staff </ModalHeader>
          <ModalBody >
            <div className='user-list-m'>
<div className='user-list-row'>
  <img src='https://media.istockphoto.com/photos/smiling-indian-man-looking-at-camera-picture-id1270067126?b=1&k=20&m=1270067126&s=612x612&w=0&h=tcabRaVlA0bsZhWCDBXxC1IYuGnh7_VuramO-vJ5jRs='/>
  <div className='u-l-label'>Bilal Manzoor</div>
</div>
            </div>
          </ModalBody>
          <FormGroup className="modal-footer">
            <Button color="secondary" onClick={() => this.StaffModalModalFun()}>Close</Button>
          
          </FormGroup>
        </Modal>
        )
          }

  render() {
    return (
      <div className="card">
           <div class="card-new-title d-flex align-items-center justify-content-between "> <h3 class="card-title" data-tip="true" data-for="happyFace">Departments</h3><button class=" btn btn-primary-plus  btn btn-secondary" onClick={() => this.DepartmentModalFun({})}><i class="fa fa-plus" aria-hidden="true"></i> Add new</button></div>
      <div className="card-body card-body-res blank-table" >
      <table>
  <tr>
    <th>Department Name</th>
    <th>Service</th>
    <th>Staff</th>
    <th></th>
  </tr>
  <tr>
    <td><a className='text-primary cursor-pointer mr-3  bold'>Electrician</a></td>
    <td>Housekeeping</td>
    <td><a className='text-primary cursor-pointer mr-3' onClick={() => this.StaffModalModalFun()}>4</a></td>
    <td><a className='text-primary cursor-pointer mr-3'>Edit</a> <a className='text-primary cursor-pointer'>Delete</a></td>
  </tr>
  
</table>
      </div>
      {this.DepartmentModalHTML()}
      {this.StaffModalHTML()}
      </div>
    )
  }
}
