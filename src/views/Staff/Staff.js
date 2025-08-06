import React, { Component } from 'react';
import { FormGroup, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
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
  render() {
    return (
      <div className="card">
      <div className="m-b-20 card-new-title">
      <h3 className="card-title">Staff</h3>
      </div>
      <div className="card-body card-body-res">
      </div>
      </div>
    )
  }
}
