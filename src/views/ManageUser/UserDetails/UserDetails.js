import React, { Component } from 'react';
import * as Utilities from '../../../helpers/Utilities';
import Config from '../../../helpers/Config';
import Constants from '../../../helpers/Constants';
import * as UserService from '../../../service/User';

import Loader from 'react-loader-spinner';
import { AppSwitch } from '@coreui/react';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';

import Avatar from 'react-avatar';
import Dropdown from 'react-bootstrap/Dropdown';

const $ = require("jquery");
const moment = require('moment-timezone');
$.DataTable = require("datatables.net");

class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: 'Moderators',
      addBtnText: 'Add new Moderator',
      moderator: true,
      marketingAdmin: false,
      restaurantAdmin: false,
      supportAdmin: false,
      supportUser: false,
      restaurantUser: false,
      agent: false
    }
    // console.log(props)
    this.getUserByType(2)
  }

  getUserByType = async (roleLevel) => {
    let response = await UserService.GetUser(roleLevel, 1, 50, 'Name', 1, '')
    // console.log(response)
  }

  componentDidMount() {
    this.bindDataTable()
  }

  setPageValues = () => {
    var roleLevel = 2
    var { userName, addBtnText } = this.state
    if (this.state.moderator == true) {
      userName = 'Moderators'
      addBtnText = 'Add new Moderator'
      roleLevel = 2
    }
    else if (this.state.marketingAdmin == true) {
      userName = 'Marketing Admin'
      addBtnText = 'Create Marketing Admin'
      roleLevel = 11
    }
    else if (this.state.restaurantAdmin == true) {
      userName = 'Restaurant Admins'
      addBtnText = 'Add new Restaurant Admin'
      roleLevel = 12
    }
    else if (this.state.supportAdmin == true) {
      userName = 'Support Admins'
      addBtnText = 'Add new Support Admin'
      roleLevel = 14
    }
    else if (this.state.supportUser == true) {
      userName = 'Support Users'
      addBtnText = 'Add new Support User'
      roleLevel = 15
    }
    else if (this.state.restaurantUser == true) {
      userName = 'Restaurant Users'
      addBtnText = 'Add new Restaurant User'
      roleLevel = 13
    }
    else {
      userName = 'Agents'
      addBtnText = 'Create Agents'
      roleLevel = 2
    }
    this.getUserByType(roleLevel)
    this.setState({
      userName: userName,
      addBtnText: addBtnText
    })
  }

  bindDataTable = () => {
    $("#userData").DataTable().destroy();
    $('#userData').DataTable({
      "paging": true,
      "ordering": false,
      "info": true,
      "lengthChange": false,
      "search": {
        "smart": false
      },
      "language": {
        "searchPlaceholder": "Search",
        "search": ""
      }
      //   "oLanguage": {
      //     "sLengthMenu": "Show  _MENU_ results",
      //     //Showing 1 to 7 of 7 entries
      //     "sInfo": "Showing  _TOTAL_ results (_START_ to _END_)"
      // }
    });
  }

  loading = () => <div className="allorders-loader">
    <div className="loader-menu-inner">
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
      <div className="loading-label">Loading.....</div>
    </div>
  </div>

  setCheckBoxUser = (value) => {
    var moderator = value == '1' ? true : false
    var marketingAdmin = value == '2' ? true : false
    var restaurantAdmin = value == '3' ? true : false
    var supportAdmin = value == '4' ? true : false
    var supportUser = value == '5' ? true : false
    var restaurantUser = value == '6' ? true : false
    var agent = value == '7' ? true : false

    this.setState({
      moderator: moderator,
      marketingAdmin: marketingAdmin,
      restaurantAdmin: restaurantAdmin,
      supportAdmin: supportAdmin,
      supportUser: supportUser,
      restaurantUser: restaurantUser,
      agent: agent,
    }, () => {
      this.setPageValues()
    })
  }

  AddUser = () =>{
    this.props.history.push('/manageuser/adduser')
  }

  render() {
    return (
      <div className="card" id="orderWrapper">
        <div className="m-b-20 card-new-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="card-title ">Users
            </h3>
            <span className="btn btn-primary-plus btn btn-secondary" onClick={(e) => this.AddUser()}><i className="fa fa-plus" aria-hidden="true"></i> Add new</span>
          </div>
        <div className="card-body card-body-res">
          
          <div className="orderlink-wraper">
            <ul>
              <li>
                <label htmlFor="chkAll">
                  <input checked={this.state.moderator} type="checkbox" className="form-checkbox" name="chkAll" id="chkAll" onClick={() => this.setCheckBoxUser('1')} /> <span className="button-link" > Moderators </span>
                </label>
              </li>
              <li>
                <label htmlFor="chkNew">
                  <input checked={this.state.marketingAdmin} type="checkbox" className="form-checkbox" name="chkNew" id="chkNew" onClick={() => this.setCheckBoxUser('2')} /> <span className="button-link " > Marketing Admin </span>
                </label>
              </li>
              <li>
                <label htmlFor="chkInKitchen">
                  <input checked={this.state.restaurantAdmin} type="checkbox" className="form-checkbox" name="chkInKitchen" id="chkInKitchen" onClick={() => this.setCheckBoxUser('3')} /> <span className="button-link " > Business Admin </span>
                </label>
              </li>
              <li>
                <label htmlFor="chkReady">
                  <input checked={this.state.supportAdmin} type="checkbox" className="form-checkbox" name="chkReady" id="chkReady" onClick={() => this.setCheckBoxUser('4')} /> <span className="button-link " > Support Admin </span>
                </label>
              </li>
              <li>
                <label htmlFor="chkDelivered">
                  <input checked={this.state.supportUser} type="checkbox" className="form-checkbox" name="chkDelivered" id="chkDelivered" onClick={() => this.setCheckBoxUser('5')} /> <span className="button-link " > Support User </span>
                </label>
              </li>
              <li>
                <label htmlFor="chkCancelled">
                  <input checked={this.state.restaurantUser} type="checkbox" className="form-checkbox" name="chkCancelled" id="chkCancelled" onClick={() => this.setCheckBoxUser('6')} /> <span className="button-link " >
                  Business User </span>
                </label>
              </li>
              <li>
                <label htmlFor="chkBooking">
                  <input checked={this.state.agent} type="checkbox" className="form-checkbox" name="chkBooking" id="chkBooking" onClick={() => this.setCheckBoxUser('7')} /> <span className="button-link " > Agent </span>
                </label>
              </li>
            </ul>
          </div>
          <div id="userDataWraper" className="vouchers-main-wrap" style={{ marginTop: '20px' }}>
            <table id="userData" cellSpacing="0">
              <thead>
                <tr>
                  <th style={{ width: '190px' }}></th>
                  <th style={{ width: '200px' }}></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="vatar-name-wraper">
                      <div className="user-avatar-web">
                        <Avatar className="header-avatar" name="Bilal Mazoor" round={true} size="45" textSizeRatio={2} />
                      </div>
                      <div className="user-avatar-res">
                        <Avatar className="header-avatar" name="Bilal Mazoor" round={true} size="35" textSizeRatio={1} />
                      </div>
                      <div className="user-left-col">
                        <span className="u-heading">
                          <span>Mr. Bilal Manzoor <i>- Bilal144</i></span>
                          <span className="rest-admin">
                          Business Admin</span>
                        </span>
                        <span className="user-d-wrap">
                          <span><i className="fa fa-envelope-o"></i> bilalkhan1293@yahoo.com	</span>
                          <span>
                            <i className="fa fa-phone"></i> 03452098754</span>
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="user-data-action-btn-res">
                      <div className="show-res">
                        <Dropdown >
                          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            <span>
                              <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                            </span>
                            <span>Options</span>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <div>
                              <span className="m-b-0 statusChangeLink m-r-20">
                                <span><i className="fa fa-edit font-18" ></i>Edit</span>
                              </span>
                              <span className="m-b-0 statusChangeLink m-r-20">
                                <span><i className="fa fa-key font-18" ></i> Reset password</span>
                              </span>
                              <span className="m-b-0 statusChangeLink m-r-20" ><i className="fa fa-trash-o font-18 delete" aria-hidden="true"  ></i> Delete</span>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                      <div className="show-web">
                        <div>
                          <span className="m-b-0 statusChangeLink m-r-20">
                            <span><i className="fa fa-edit font-18" ></i>Edit</span>
                          </span>
                          <span className="m-b-0 statusChangeLink m-r-20">
                            <span><i className="fa fa-key font-18" ></i> Reset password</span>
                          </span>
                          <span className="m-b-0 statusChangeLink m-r-20" ><i className="fa fa-trash-o font-18 delete" aria-hidden="true"  ></i> Delete</span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    );
  }
}

export default UserDetails;