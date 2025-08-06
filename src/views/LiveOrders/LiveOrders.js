import React, { Component } from 'react';
import * as Utilities from '../../helpers/Utilities';
import Constants from '../../helpers/Constants';
import Config from '../../helpers/Config';
import Loader from 'react-loader-spinner';
import { Button, Badge, Modal, ModalBody, ModalFooter, ModalHeader, } from 'reactstrap';
import Iframe from 'react-iframe'
import GlobalData from '../../helpers/GlobalData';
import './Live.css'
class LiveOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userObj: [],
      ShowLoader: true,
      openIframeModal: false,
      iframeUrl: '',
    }

  }

  Refresh ()  {
    this.setState({ ShowLoader: true });
    this.GetEnterpriseOrders(this.state.SelectedStatus);

  }

  componentDidUpdate() {
    const formElementKey1Exists = document.getElementById("element1");
    const formElementKey2Exists = document.getElementById("element2");
   
    if (formElementKey1Exists  && formElementKey2Exists) {
        document.getElementById('ltiLaunchForm').submit();
    }
}

componentWillMount(){
 
  document.body.style.overflow = "hidden";
  
}

componentWillUnmount(){
  
  document.body.style.overflow = "auto";

}
  render() {

    let loginUser = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT));

    return (
      <div className="card" id="orderWrapper">
       {/* <form id="ltiLaunchForm" method="post" target="_blank" enctype="multipart/form-data" action={GlobalData.restaurants_data.Supermeal_dev.liveOrderUrl}>
              <input type="hidden" name="AuthenticationTicket" value={localStorage.getItem(Constants.Session.AUTHENTICATION_TICKET) + "^" + loginUser.MembershipUserId}/>
              <button type="submit">Live Orders </button>
      </form>
        */}
       {/* <Iframe url={Config.Setting.baseUrl}/> */}
       <Iframe url={GlobalData.restaurants_data.Supermeal_dev.liveOrderUrl + "?t=" +localStorage.getItem(Constants.Session.AUTHENTICATION_TICKET) + "^" + loginUser.MembershipUserId }
        width="1070px"
        height="1000px"
        id="myId"
        className="myClassname"
        display="initial"
        position="relative"/>
      </div>

    );
  }
}

export default LiveOrders;