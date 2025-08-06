import  { Component } from 'react';
//import Config from '../../../helpers/Config';
import * as Utilities from '../../../helpers/Utilities';
import Constants from '../../../helpers/Constants';
import { disable } from 'darkreader';
//import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

class Logout extends Component {
  state = {interval: null}
  state = { username: '', password: '' , secureTextEntry:true}
  constructor(props) {
      super(props);
      let mID = localStorage.getItem(Constants.MEMBERSHIP_ID);
      let AdminObject = JSON.parse(localStorage.getItem(Constants.Session.ADMIN_OBJECT))
      let ParentObject = JSON.parse(localStorage.getItem(Constants.Session.PARENT_OBJECT))


       if(ParentObject !== null)
      {

         let impersonatorId = localStorage.getItem(Constants.Session.PARENTIMPERSONATORID)

        localStorage.setItem(Constants.Session.USER_OBJECT, JSON.stringify(ParentObject));
        localStorage.setItem(Constants.Session.ENTERPRISE_ID, ParentObject.Enterprise.Id);
        localStorage.setItem(Constants.Session.ENTERPRISE_NAME, ParentObject.Enterprise.Name);
        localStorage.setItem(Constants.Session.AUTHENTICATION_TICKET,ParentObject.AuthenticationToken);
        if(AdminObject !== null) {
          localStorage.setItem(Constants.Session.IMPERSONATORID,impersonatorId);
        } else {
          localStorage.setItem(Constants.Session.IMPERSONATORID,"");
        }
        localStorage.removeItem(Constants.Session.PARENT_OBJECT);
        localStorage.removeItem(Constants.Session.SELECTED_ORDER_QUERY)
        // localStorage.removeItem(Constants.ISAPP);
        localStorage.removeItem(Constants.MEMBERSHIP_ID);

        window.location.href = "/businesses";
      }


     else if(AdminObject !== null)
      {
        localStorage.setItem(Constants.Session.USER_OBJECT, JSON.stringify(AdminObject));
        localStorage.setItem(Constants.Session.ENTERPRISE_ID, AdminObject.Enterprise.Id);
        localStorage.setItem(Constants.Session.AUTHENTICATION_TICKET,AdminObject.AuthenticationToken);
        localStorage.setItem(Constants.Session.IMPERSONATORID,"");

        localStorage.removeItem(Constants.Session.ADMIN_OBJECT);
        localStorage.removeItem(Constants.Session.PARENTIMPERSONATORID);
        localStorage.removeItem(Constants.Session.SELECTED_ORDER_QUERY)
        // localStorage.removeItem(Constants.ISAPP);
        localStorage.removeItem(Constants.MEMBERSHIP_ID);

        window.location.href = "/businesses";
      }
    else{
      Utilities.ClearSession();
      if(Utilities.stringIsEmpty(mID) || mID == null ){
        this.props.history.push('/login');
      }
      else{
      window.location.href = '/logout'
      }

    }
  }

componentDidMount() {
  try {
    // Just disable DarkReader without clearing saved preference
    disable();

    // ✅ Do NOT reset localStorage or state — let the preference persist
    // DO NOT run: localStorage.setItem('darkMode', 'false');
    // DO NOT run: this.setState({ DarkMode: false });
  } catch (err) {
    console.error('Error disabling dark mode on logout page:', err);
  }
}

  render() {
      return ('');
  }
}

export default Logout;
