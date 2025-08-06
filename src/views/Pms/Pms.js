import React, { Component,Fragment } from 'react';
import Avatar from 'react-avatar';
import Slider from '@material-ui/core/Slider'
import SweetAlert from 'sweetalert-react'; // eslint-disable-line import/no-extraneous-dependencies
import 'sweetalert/dist/sweetalert.css';
import { Link } from 'react-router-dom'
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader, Table, Alert } from 'reactstrap';
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
import Loader from 'react-loader-spinner';
import * as PMSService from '../../service/PMS-Integration';
import Dropdown from 'react-bootstrap/Dropdown';
import Labels from '../../containers/language/labels';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { FaUserTie } from "react-icons/fa";
import moment from 'moment';
const $ = require('jquery');

const   MewsBody =  "{\r\n  \"ClientToken\": \"E0D439EE522F44368DC78E1BFB03710C-D24FB11DBE31D4621C4817E028D9E1D\",\r\n  \"AccessToken\": \"C66EF7B239D24632943D115EDE9CB810-EA00F8FD8294692C940F6B5A8F9453D\",\r\n  \"Client\": \"SuperButlerV1.0\"\r\n}"
var mewsBaseUrl = "https://api.mews-demo.com/api/connector/v1";

class Pms extends Component {

  //#region Constructor
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      response: "",
      AddNewReseller: false,
      expandedKeys: {},
      payload: {},
      type:'password',
      products: [],
      ApiCall: false,
      requestURL: '',
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

  loading = () => 
    <div className="loader-menu-inner">
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
      <div className="loading-label">Loading.....</div>
    </div>
  


//#region api

Reservations = async(url) => {

  this.setState({showLoader: true});
  let params = JSON.parse(MewsBody);
  params.StartUtc =  moment().add(-1, 'd').format('YYYY-MM-DDT00:00:00Z');
  params.EndUtc = moment().format('YYYY-MM-DDT00:00:00Z');
  
  let response = await PMSService.MewsPost(url, params);
  this.setState({response: response, payload: params, requestURL: url, ApiCall: true, showLoader: false});
}

Services = async(url) => {
  this.setState({showLoader: true});
  let params = JSON.parse(MewsBody);
  params.Limitation= { "Count": 100}
  let response = await PMSService.MewsPost(url, params);
  this.setState({response: response, payload: params, requestURL: url, ApiCall: true, showLoader: false});
}

Customers = async(url) => {
  this.setState({showLoader: true});
  let params = JSON.parse(MewsBody);
  params.Emails = ["sbguest@domain.com"]
  let response = await PMSService.MewsPost(url, params);
  this.setState({response: response, payload: params, requestURL: url, ApiCall: true, showLoader: false});
}

Productcategories = async(url) => {
  this.setState({showLoader: true});
  let params = JSON.parse(MewsBody);
  params.ServiceIds = ["7cf76fec-86f7-4152-adb3-b1b800942b48"];
  params.Limitation= { "Count": 100}
  let response = await PMSService.MewsPost(url, params);
  this.setState({response: response, payload: params, requestURL: url, ApiCall: true, showLoader: false});
}

Products = async(url) => {
  this.setState({showLoader: true});
  let params = JSON.parse(MewsBody);
  params.ServiceIds = ["7cf76fec-86f7-4152-adb3-b1b800942b48"];
  params.Limitation= { "Count": 100}
  let response = await PMSService.MewsPost(url, params);
  this.setState({response: response, products: response.Products, requestURL: url, ApiCall: true, payload: params, showLoader: false});
}

AddOrder = async(url) => {
  let products = this.state.products;
  if(products.length == 0) return;
  this.setState({showLoader: true});
  const randomNum = Math.floor(Math.random() * products.length);
  const count = Math.floor(Math.random() * 10) + 1;

  let params = JSON.parse(MewsBody);
  params.EnterpriseId = "851df8c8-90f2-4c4a-8e01-a4fc46b25178";
  params.AccountId= "316801ef-4895-4d2f-8ff0-b1b200c35c8a";
  params.ServiceId = "7cf76fec-86f7-4152-adb3-b1b800942b48";
  params.ProductOrders =  [{"ProductId": products[randomNum].Id, "Count": count }]
  
  let response = await PMSService.MewsPost(url, params);
  this.setState({response: response, payload: params, requestURL: url, ApiCall: true, showLoader: false});
}

//#endregion 
toggleExpand = (key) => {
  this.setState((prevState) => ({
    expandedKeys: {
      ...prevState.expandedKeys,
      [key]: !prevState.expandedKeys[key]
    }
  }));
};

renderJson = (data, parentKey = '') => {
  return Object.entries(data).map(([key, value]) => {
    const compositeKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === 'object' && value !== null) {
      const isExpanded = !!this.state.expandedKeys[compositeKey];

      if (Array.isArray(value)) {
        return (
          <div className='font-16'  key={compositeKey}>
            <span
              onClick={() => this.toggleExpand(compositeKey)}
              style={{ cursor: 'pointer'}}
            >
              {isExpanded ? <i class="fa fa-chevron-down mr-2 font-18"></i> :  <i class="fa fa-chevron-right mr-2 font-18"></i>}
              <strong>{key}:</strong>
            </span>
            {isExpanded && (
              <ul style={{ listStyleType: 'none', paddingLeft: 20 }}>
                {value.map((item, index) => (
                  <li key={`${compositeKey}[${index}]`}>
                    <span
                      onClick={() =>
                        this.toggleExpand(`${compositeKey}[${index}]`)
                      }
                      style={{ cursor: 'pointer' }}
                    >
                      {this.state.expandedKeys[`${compositeKey}[${index}]`]
                        ? <i class="fa fa-chevron-down mr-2 font-18"></i> :  <i class="fa fa-chevron-right mr-2 font-18"></i>}
                      <strong>{index}:</strong>
                    </span>
                    {this.state.expandedKeys[`${compositeKey}[${index}]`] && (
                      <div style={{ marginLeft: 20 }}>
                        {this.renderJson(item, `${compositeKey}[${index}]`)}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      } else {
        return (
          <div className='font-16'  key={compositeKey}>
            <span
              onClick={() => this.toggleExpand(compositeKey)}
              style={{ cursor: 'pointer'}}
            >
              {isExpanded ? <i class="fa fa-chevron-down mr-2 font-18"></i> :  <i class="fa fa-chevron-right mr-2 font-18"></i>}
              <strong>{key}:</strong>
            </span>
            {isExpanded && (
              <div style={{ marginLeft: 20 }}>
                {this.renderJson(value, compositeKey)}
              </div>
            )}
          </div>
        );
      }
    } else {
      return (
        <div key={compositeKey}>
          <strong>{key}:</strong> {value !== null ? value.toString() : 'null'}
        </div>
      );
    }
  });
};

renderJson1 = (data, parentKey = '') => {
  return Object.entries(data).map(([key, value]) => {
    const compositeKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === 'object' && value !== null) {
      const isExpanded = !this.state.expandedKeys[compositeKey];
        return (
          <div className='font-16' key={compositeKey}>
            <span onClick={() => this.toggleExpand(compositeKey)} style={{ cursor: 'pointer'}}>
            {isExpanded ? <i class="fa fa-chevron-down mr-2 font-18"></i> :  <i class="fa fa-chevron-right mr-2 font-18"></i>}
              <strong>{key}:</strong>
            </span>
            {isExpanded && <div style={{ marginLeft: 20 }}>{this.renderJson(value, compositeKey)}</div>}
          </div>
        );
      
    } else {
      return (
        <div className='font-16' key={compositeKey}>
          <strong>{key}:</strong> {value !== null ? value.toString() : 'null'}
        </div>
      );
    }
  });
};

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
               <div className="card-new-title" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>   <h3 className="card-title  mr-3" data-tip data-for='happyFace'> MEWS
                                </h3>
                                {/* <select className="form-control mr-3" style={{maxWidth:150}}>
                                        <option value="0">Option A</option>
                                        <option value="1">Option B</option>
                                         <option value="2">Option C</option>
                                       <option value="3">Option D</option>
                                        </select> */}

                                {/* <span className="btn btn-primary" >JSON </span> */}
          
          </div>
        <div className="card-body">
          <div className='row'>
            <div className='col-md-4'>
              <span className='font-18 w-100 d-flex'>
               API Calls
              </span>

            <div className='d-inline-flex flex-column mt-3' style={{gap:"15px"}}>
              <span className="btn btn-primary" onClick={() => this.Reservations(mewsBaseUrl + "/reservations/getAll", true)}>Reservation</span>
              <span className="btn btn-primary" onClick={() => this.Services(mewsBaseUrl + "/services/getAll")}>Services</span>
              <span className="btn btn-primary" onClick={() => this.Customers(mewsBaseUrl + "/customers/getAll")}>Customer </span>
              <span className="btn btn-primary" onClick={() => this.Productcategories(mewsBaseUrl + "/productCategories/getAll")}>Product categories</span>
              <span className="btn btn-primary" onClick={() => this.Products(mewsBaseUrl + "/products/getAll")}>Products</span>
              <span className={`btn btn-primary ${this.state.products.length > 0 ? "" : "disabled"}`} onClick={() => this.AddOrder(mewsBaseUrl + "/orders/add")}>Add order</span>
              </div>
            </div>

           
         

            <div className='col-md-8'>
            <span className='font-18 w-100 d-flex'>
               API Response
              </span>
            {this.state.showLoader ? this.loading()
            
            : 
           <>
            {this.state.requestURL != '' &&  
            
            <span className='font-18 mt-5 d-flex flex-column'>
                
                <span className='mb-3'>Request URL</span>        
                {/* <div>{JSON.stringify(this.state.payload)}</div> */}
                <div><strong>{this.state.requestURL}</strong></div>
              </span>
            }

            {this.state.payload != null && Object.keys(this.state.payload).length > 0 &&  
            
            <span className='font-18 mt-5 d-flex flex-column'>
                
                <span className='mb-3'>Payload</span>        
                {/* <div>{JSON.stringify(this.state.payload)}</div> */}
                <div>{this.renderJson1(this.state.payload)}</div>
              </span>
            }
             {this.state.response != null && this.state.response != undefined && this.state.ApiCall &&         
              <span className='font-18 mt-5 d-flex flex-column'>
                <span className='mb-3'>Response</span>
                       
                <div>{this.renderJson(this.state.response)}</div>
              </span>
              }
              
             
           
           
           </>
           
               }
            </div>
       
          </div>

        </div>

      </div>

    );
  }

}

export default Pms;
