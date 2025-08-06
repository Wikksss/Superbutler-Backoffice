import React, { Component } from 'react'
import Constants from '../../helpers/Constants';
import * as Utilities from '../../helpers/Utilities'
import Config from '../../helpers/Config';
import Loader from 'react-loader-spinner';
import { useDropzone } from 'react-dropzone'
import { FormGroup, Button, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'react-phone-input-2/lib/style.css'
import * as Enterprise from '../../service/Enterprise';
import VerificationInput from "react-verification-input";
import * as ThemeSetting from '../../helpers/DefaultTheme';


export default class HotelDemos extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      showLoader: true,
      isInvalidPin: false,
      pin: "",
      inProcess: false,
    }
    
  }

  loading = () =>  <div className="page-laoder" style={{ backgroundColor: '#431c51', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <div> 
     <Loader 
  type="Oval"
  color="#fff"
  height={50}	
  width={50}/>  
  <div className="loading-label" style={{color: "#fff"}} >Loading.....</div>
  </div>
  </div> 

  ValidatePin = async (pin, load) => {
    
    this.setState({inProcess: true});

    if (!Utilities.stringIsEmpty(pin)) 
    {
        let validate = await Enterprise.ValidatePin(pin);
        
        if(validate) 
        {
          localStorage.setItem("PinCode", pin);
          this.props.history.push("/create-demo");
          return;
        }
        else 
        {
          this.setState({isInvalidPin: !load});
        }
    } 

    this.setState({showLoader: false, inProcess: false});

  }

  componentWillMount() {
    document.body.classList.add('body-demo-bg-img');

  }

  componentDidMount() {
    setTimeout(() => {
      const searchInput = document.querySelector('input[placeholder="Search"]');
      if (searchInput) {
        searchInput.blur();
      }
    }, 100);

    var pin = localStorage.getItem("PinCode")
    this.ValidatePin(pin, true);

  }

  onChangePIN = (value) => {
    this.setState({pin: value});
  }

  isBottom(el) {

    if (el != null) return el.getBoundingClientRect().bottom <= window.innerHeight + 5;
    else return null;
  }

  componentWillUnmount() {
    document.body.classList.remove('body-demo-bg-img');
  }

  render() {

    if(this.state.showLoader) return this.loading();

    return (
      <div className='create-demo-page-wrap body-demo-bg-img' >
            <div>
              <div className='d-flex align-items-center justify-content-center demo-page-logo-wrap mt-4'>
                <img alt='Superbutler' style={{ height: "auto" }} width={200} src='https://www.superbutler.ai/_next/static/media/superbuter-logo-whiteicon-ai.ccfd6ff5.png'></img>
              </div>
              <div className='demo-verification-pin-wrap-p'>
                <div className='d-flex align-items-center justify-content-center'>
                  <h3 className="card-title card-new-title ml-0 mb-0 pl-0 mr-0">Please enter your PIN</h3>
                </div>
                <VerificationInput
                  placeholder="_"
                  length={6}
                  autoFocus={true}
                  validChars="0-9" inputProps={{ inputMode: "numeric" }}
                  value={this.state.pin}
                  onChange={(value) => this.onChangePIN(value)}
                  classNames={{
                    container: "demo-verification-pin-wrap",
                    character: "character",
                    characterInactive: "character--inactive",
                    characterSelected: "character--selected",
                    characterFilled: "character--filled",
                  }}
                />
                
                {this.state.isInvalidPin &&
                <div
                  className="alert alert-danger font-14 mb-0 text-danger"
                  style={{ color: "#a94442!important", padding: "2px 10px" }}
                >
                  Invalid PIN
                </div>}
                <div className="bottomBtnsDiv demo-p-btn-wrap w-100" onClick={() => this.ValidatePin(this.state.pin, false)} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Button color="primary" >
                    {this.state.inProcess ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                      : <span className="comment-text">Continue</span>}
                  </Button>
                </div>
              </div>
            </div>
          
  
  
        <div class="pwrd-by-s-b">
          <span class="pwrd-by-s-b-i">Powered by</span>
          <img height="40" alt="footer" src="https://speaktest.superbutler.ai/static/media/superbuter-logo-whiteicon-ai.043890f7a61dc44f2e96.png" />
        </div>
      </div>
    )
  }
}
