import React, { Fragment } from 'react';
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import SweetAlert from 'sweetalert-react'; // eslint-disable-line import/no-extraneous-dependencies
import Loader from 'react-loader-spinner';
import ReactTooltip from 'react-tooltip';
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
import * as Utilities from '../../helpers/Utilities';
import * as EnterpriseOrderSource from '../../service/EnterpriseOrderSource';
import "react-tabs/style/react-tabs.css";
import 'sweetalert/dist/sweetalert.css';
import Labels from '../../containers/language/labels';
import 'react-select-search/style.css'
import { FiCheck } from "react-icons/fi";
import Avatar from 'react-avatar';
import { AppSwitch } from '@coreui/react';
import Constants from '../../helpers/Constants';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { BsClipboard } from "react-icons/bs";
// import { IoCopyOutline } from "react-icons/io5";

const NumberValidation = (value, ctx) => {

  if (!Utilities.IsNumber(value) && Number(value) !== -1) {
    return "Invalid value";
  }
  return true;
}

class OrderSource extends React.Component {



  constructor(props) {

    super(props);

    this.state = {
      ShowLoaderRightPanel: true,
      ShowLoaderLeftPanel: true,
      showSweetAlertConfirmation: false,
      comfirmationModelType: '', 
      sweetAlertConfirmationModelText: '',
      showAlert: false,
      isEdit: true,
      left: false,
      scrolled: false,
      loading: true,
      AddOrderSource: false,
      isSave: false,
      isDefault: false,
      sourceName:'',
      isSourceLinkEmpty: false,
      isSourceAddLinkEmpty: false,
      isNewModeCreated: false,
      description:'',
      Id: 0,
      selectedSourceId:0,
      storeSelectedSourceId:0,
      selectedName:'',
      sourceLink:'',
      addSourceName: '', 
      addSourceLink: '',
      isEditSourceLink: false,
      isEditAddSourceLink: false,
      index: 0,
      source:[],
      compareSource:'',
      disabled: true,
      newModeButtonDisabled: false, 
      modeError: false, 
      parameterError: false,
      modeErrorMessage: "",
      parameterErrorMessage: "",
      rules: {
        AllowCustomerToOrder: false,
        AllowGuestCheckout: false,
        EmailRequired: false,
        MobileRequired: false,
        FullNameRequired: false,
        AuthenticationRequired: false,
        AskGuestForDayAndTime: false,
        AskGuestForNoOfSeats: false,
        AskGuestForNoOfBabySeats: false,
        AskGuestForFurtherInstructions: false,
        ShowRoomNumber: false,
        ShowTableNumber: false,
        AllowGuestToCallStaff: false,
        AllowExpressCheckout: false,
        NormalCheckout: false,
        ResponsiveLeft: false,
        copied: false,
      },
      allowCustomerRules:{},
      normalCheckoutRules:{},
      EnterpriseTypeId: 0,
      siteUrl:''
    }

    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
      this.state.EnterpriseTypeId = userObj.Enterprise.EnterpriseTypeId;
      this.state.siteUrl = localStorage.getItem(Constants.Session.SITE_URL)
      
    }
    this.GetSource()
  }
  componentWillMount() {
    document.body.classList.add('v-auto');
  }

  componentWillUnmount() {
    document.body.classList.remove('v-auto');
  }
  //#endregion
  loading = () => <div className="page-laoder page-laoder-menu">
    <div className="loader-menu-inner">
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
      <div className="loading-label">Loading.....</div>
    </div>
  </div>

  AddOrderSourceModal = () => {
    if(!this.state.disabled && !this.state.parameterError && !this.state.modeError){
       this.state.storeSelectedSourceId = this.state.selectedSourceId
       this.saveModeConfirmation(this.state.selectedSourceId, this.state.selectedName)
      return
      }
    if(!this.state.AddOrderSource){
      // this.freshRulesforNewOrderSource()
      this.setState({
        AddOrderSource: !this.state.AddOrderSource,
        // sourceName:'',
        rules: this.state.rules,
        description:'',
        // sourceLink:'',
        isEdit: false,
        // isEditSourceLink: false,
        // isSourceLinkEmpty: true
        isSourceAddLinkEmpty: true,
        modeError: false,
        parameterError: false,
        newModeButtonDisabled: false,
        disabled: true
      })
      
      return
    }
    this.setState({ AddOrderSource: !this.state.AddOrderSource, addSourceName:'', addsourceLink:'', isSourceAddLinkEmpty: false, isEditAddSourceLink: false, isEdit: true, modeError: false, parameterError: false, disabled: true})
    this.GetSource()
    
  }

  ResponsiveLeftModal() {
    this.setState({
      ResponsiveLeft: !this.state.ResponsiveLeft,
    })
}


  EditOrderSourceModal = (v,i) =>{
    this.setState({ isEdit: true, isSourceLinkEmpty: false, AddOrderSource: !this.state.AddOrderSource, selectedSourceId: v.Id, rules: v.Rules , sourceName: v.Name, sourceLink: v.Parameter, description: v.Description, isEditSourceLink: false })
  }


  HandleOnConfirmation = () => {

    let type = this.state.comfirmationModelType;

    switch (type.toUpperCase()) {
      case 'DS':
        this.DeleteSource();
        break;
      case 'SC':
        this.saveSource();
        this.state.selectedSourceId = this.state.storeSelectedSourceId
        break;
      default:
        break;
    }

  }

  GenerateSweetConfirmationWithCancel() {
    return (
      <SweetAlert
        show={this.state.showSweetAlertConfirmation}
        title=""
        text={this.state.sweetAlertConfirmationModelText}
        showCancelButton
        onConfirm={() => { this.HandleOnConfirmation() }}
        confirmButtonText={this.state.comfirmationModelType == 'sc' ? "Save Changes" : "Yes"}
        cancelButtonText={this.state.comfirmationModelType == 'sc' ? "Discard Changes" : "Cancel"}
        onCancel={() => this.HandleOnCancel()}
        onEscapeKey={() => this.setState({ showSweetAlertConfirmation: false })}
      // onOutsideClick={() => this.setState({ showSweetAlertConfirmation: false })}
      />
    )
  }

  HandleOnCancel = () =>{
    let type = this.state.comfirmationModelType;

    switch (type.toUpperCase()) {
      case 'DS':
        this.setState({ showSweetAlertConfirmation: false });
        break;
      case 'SC':
        this.onSourceModeChangesDiscard();
        break;
      default:
        break;
    }
  }

  onSourceModeChangesDiscard = () =>{
    var data = JSON.parse(this.state.compareSource)
    var findIndex = data.findIndex(a => a.Id == this.state.storeSelectedSourceId)
    var selectedMode =  data[findIndex]
    this.setState({selectedSourceId:  selectedMode.Id, selectedName: selectedMode.Name, sourceName: selectedMode.Name, sourceLink: selectedMode.Parameter, description: selectedMode.Description, rules: selectedMode.Rules, disabled: true, showSweetAlertConfirmation: false })
  }

  GenerateSweetAlert() {
    return (
      <SweetAlert
        show={this.state.showAlert}
        //title={this.state.alertModelTitle}
        title={''}
        text={this.state.alertModelText}
        onConfirm={() => this.setState({ showAlert: false })}
        onEscapeKey={() => this.setState({ showAlert: false })}
      // onOutsideClick={() => this.setState({ showAlert: false })}
      />
    )
  }
copyText = () => {

  if(this.state.copied) {
    this.setState({ copied: false })
  }
  setTimeout(() => {
    this.setState({ copied: true });
     }, 100)

  
  // this.setState({ copied: true }, ()=>
  //   setTimeout(() => {
      
  //   }, 5000)
  //   )
  // this.state.copied = false
}
  componentDidMount() {

    window.addEventListener('load', () => {
      this.setState({
        isMobile: window.innerWidth < 800
      });
    }, false);
    if (window.innerWidth < 800) {
      this.setState({
        isMobile: true
      })
      // this.state.isMobile = true;
    }
    if (window.innerWidth > 800) {
      this.setState({
        isMobile: false
      })
      //this.state.isMobile = false;
    }


    window.addEventListener('scroll', () => {
      const istop = window.scrollY < 80;

      if (istop !== true && !this.state.scrolled) {
        this.setState({ scrolled: true })
      }
      else if (istop == true && this.state.scrolled) {
        this.setState({ scrolled: false })
      }

    });

  }

  selectSource = (v, i) =>{
    if(!this.state.disabled && !this.state.parameterError && !this.state.modeError){
      this.state.storeSelectedSourceId = v.Id
       this.saveModeConfirmation(this.state.selectedSourceId, this.state.selectedName)
       return
    }
    this.setState({ selectedSourceId: v.Id, selectedName: v.Name, index: i, rules: v.Rules , sourceName: v.Name, sourceLink: v.Parameter, description: v.Description, ResponsiveLeft:false, isDefault: v.IsDefault, parameterError: false, modeError: false, disabled: true  })
  }



  GetSource = async() =>{
    var data = await EnterpriseOrderSource.Get();
    if (data.length != 0) {
      if (this.state.isNewModeCreated){
        // var findIndex = data.findIndex(a => a.Id == this.state.selectedSourceId)
        var selectedMode =  data[data.length -1]
        this.setState({source: data, compareSource: JSON.stringify(data), selectedSourceId:  selectedMode.Id, selectedName: selectedMode.Name, sourceName: selectedMode.Name, sourceLink: selectedMode.Parameter, description: selectedMode.Description, rules: selectedMode.Rules, siteUrl: selectedMode.SiteUrl, loading: false, isNewModeCreated: false, isDefault: selectedMode.IsDefault, disabled: true })
        return
      }
      if (this.state.selectedSourceId !=''){
        var findIndex = data.findIndex(a => a.Id == this.state.selectedSourceId)
        var selectedMode =  data[findIndex]
        this.setState({source: data, compareSource: JSON.stringify(data), selectedSourceId:  selectedMode.Id, selectedName: selectedMode.Name, sourceName: selectedMode.Name, sourceLink: selectedMode.Parameter, description: selectedMode.Description, rules: selectedMode.Rules, siteUrl: selectedMode.SiteUrl, loading: false, isNewModeCreated: false, isDefault: selectedMode.IsDefault, disabled: true })
        return
      }
      this.setState({ source: data, compareSource: JSON.stringify(data), selectedSourceId: data[0].Id, selectedName: data[0].Name, sourceName: data[0].Name, sourceLink: data[0].Parameter , description: data[0].Description, rules: data[0].Rules, siteUrl: data[0].SiteUrl, loading: false, isNewModeCreated: false, isDefault: data[0].IsDefault, disabled: true });
      return
    }
    this.setState({ loading: false, source:[] });
  }


  compareData = () =>{
    const { description, Id, selectedSourceId, sourceName, isEdit, addSourceName } = this.state;
    var source = {}
    source.Id = isEdit ? selectedSourceId : 0
    source.IsDefault = isEdit ? this.state.isDefault : false
    source.EnterpriseId = Utilities.GetEnterpriseIDFromSession()
    source.Name = isEdit ? sourceName : addSourceName
    source.Parameter = isEdit ? this.state.sourceLink.toLowerCase().replaceAll(" ", '-') :  this.state.addSourceLink.toLowerCase().replaceAll(" ", '-')
    source.Description = isEdit ? description : ''
    source.SiteUrl = `${this.state.siteUrl}`
    source.Rules = this.state.rules
    var compareData = JSON.parse(this.state.compareSource).find(v=> v.Id == source.Id)
    if(JSON.stringify(source) !== JSON.stringify(compareData)){
      this.setState({ disabled: false })
      return
    }
    this.setState({ disabled: true })
   
  }

  saveSource = async() =>{
    this.setState({ isSave: true })
    const { description, Id, selectedSourceId, sourceName, isEdit, addSourceName } = this.state;
    if(!isEdit){
        this.state.rules.AllowCustomerToOrder = false
        this.state.rules.AllowGuestCheckout = false
        this.state.rules.NormalCheckout = false
        this.state.rules.EmailRequired = false
        this.state.rules.MobileRequired = false
        this.state.rules.FullNameRequired = false
        this.state.rules.AuthenticationRequired = false
        this.state.rules.AskGuestForDayAndTime = false
        this.state.rules.AskGuestForNoOfSeats = false
        this.state.rules.AskGuestForNoOfBabySeats = false
        this.state.rules.AskGuestForFurtherInstructions = false
        this.state.rules.ShowRoomNumber = false
        this.state.rules.ShowTableNumber = false
        this.state.rules.AllowGuestToCallStaff = false
        this.state.rules.AllowExpressCheckout = false
        this.state.normalCheckoutRules = {}
        this.state.allowCustomerRules = {}
    }
    var source = {}
    source.Id = isEdit ? selectedSourceId : 0
    source.IsDefault = isEdit ? this.state.isDefault : false
    source.EnterpriseId = Utilities.GetEnterpriseIDFromSession()
    source.Name = isEdit ? sourceName : addSourceName
    source.Parameter = isEdit ? this.state.sourceLink.toLowerCase().replaceAll(" ", '-') :  this.state.addSourceLink.toLowerCase().replaceAll(" ", '-')
    source.Description = isEdit ? description : ''
    source.Rules = this.state.rules

    let message = isEdit ? await EnterpriseOrderSource.Update(source)  : await EnterpriseOrderSource.Post(source) 
    if (message == '1') {
      Utilities.notify(Utilities.SpecialCharacterDecode(isEdit === false ? addSourceName : sourceName) + ((isEdit === false) ? " created successfully." : " updated successfully."), "s");
      this.setState({ isNewModeCreated: this.state.AddOrderSource, AddOrderSource: false, isSave: false, isEdit: true, allowCustomerRules:{}, normalCheckoutRules:{}, addSourceName:'', addsourceLink:'', isEditAddSourceLink: false, isSourceAddLinkEmpty:'', showSweetAlertConfirmation: false })
      this.GetSource()
      return
    }
    Utilities.notify(message, "e");

  }


  updateSwitch = (value, type) =>{
    switch (type) {
      case 'AGCS':
          this.state.rules.AllowGuestToCallStaff = value
          this.setState({ rules: this.state.rules},
            ()=>{
              this.compareData()
            })
          break;
      case 'ALC':
          if(!value){
            this.state.allowCustomerRules = Object.keys(this.state.allowCustomerRules).length == 0 ? JSON.parse(JSON.stringify(this.state.rules)) : JSON.parse(JSON.stringify(this.state.allowCustomerRules)) 
            this.state.rules.NormalCheckout = false 
            this.state.rules.AllowGuestCheckout = false
            this.state.rules.AuthenticationRequired = false
            this.state.rules.EmailRequired = false
            this.state.rules.MobileRequired = false
            this.state.rules.FullNameRequired = false
            this.state.rules.ShowRoomNumber = false
            this.state.rules.ShowTableNumber = false
            this.state.rules.AskGuestForDayAndTime = false
            this.state.rules.AskGuestForNoOfSeats = false
            this.state.rules.AskGuestForNoOfBabySeats = false
            this.state.rules.AskGuestForFurtherInstructions = false
            this.state.rules.AllowExpressCheckout = false
          }
          if(!!value && Object.keys(this.state.allowCustomerRules).length > 0){
            this.state.rules = this.state.allowCustomerRules
          }
          this.state.rules.AllowCustomerToOrder = value
          this.setState({ rules: this.state.rules},
            ()=>{
              this.compareData()
            })
          break;
      case 'AEC':
        if(!!value){
            this.state.normalCheckoutRules = Object.keys(this.state.normalCheckoutRules).length == 0 ? JSON.parse(JSON.stringify(this.state.rules)) : JSON.parse(JSON.stringify(this.state.normalCheckoutRules))
            this.state.rules.NormalCheckout = false 
            this.state.rules.AllowGuestCheckout = false
            this.state.rules.AuthenticationRequired = false
            this.state.rules.EmailRequired = false
            this.state.rules.MobileRequired = false
            this.state.rules.FullNameRequired = false
            this.state.rules.ShowRoomNumber = false
            this.state.rules.ShowTableNumber = false
            // this.state.rules.AskGuestForDayAndTime = false
            this.state.rules.AskGuestForNoOfSeats = false
            this.state.rules.AskGuestForNoOfBabySeats = false
            this.state.rules.AskGuestForFurtherInstructions = false
          }
          this.state.rules.AskGuestForDayAndTime = value
          this.state.rules.AllowExpressCheckout = value
          this.setState({ rules: this.state.rules },
            ()=>{
              this.compareData()
            })
          break;
      case 'NC':
        if(!!value && Object.keys(this.state.normalCheckoutRules).length > 0){
          this.state.rules = this.state.normalCheckoutRules
        }
          this.state.rules.NormalCheckout = value
          this.state.rules.AllowExpressCheckout = !!value && false
          if(!value){
            this.state.rules.AllowGuestCheckout = false
            this.state.rules.AuthenticationRequired = false
            this.state.rules.EmailRequired = false
            this.state.rules.MobileRequired = false
            this.state.rules.FullNameRequired = false
            this.state.rules.ShowRoomNumber = false
            this.state.rules.ShowTableNumber = false
            this.state.rules.AskGuestForDayAndTime = false
            this.state.rules.AskGuestForNoOfSeats = false
            this.state.rules.AskGuestForNoOfBabySeats = false
            this.state.rules.AskGuestForFurtherInstructions = false
            this.state.normalCheckoutRules = {}
          }
          if(this.state.EnterpriseTypeId == 3){
            this.state.rules.AllowGuestCheckout = value
          }
          this.setState({ rules: this.state.rules },
            ()=>{
              this.compareData()
            })
          break;
      case 'AGDT':
          this.state.rules.AskGuestForDayAndTime = value
          this.setState({ rules: this.state.rules },
            ()=>{
              this.compareData()
            })
          break;
      case 'AGNS':
          this.state.rules.AskGuestForNoOfSeats = value
          this.setState({ rules: this.state.rules },
            ()=>{
              this.compareData()
            })
          break;
      case 'AGBS':
          this.state.rules.AskGuestForNoOfBabySeats = value
          this.setState({ rules: this.state.rules },
            ()=>{
              this.compareData()
            })
          break;
      case 'AGFI':
          this.state.rules.AskGuestForFurtherInstructions = value
          this.setState({ rules: this.state.rules },
            ()=>{
              this.compareData()
            })
          break;
      case 'AGC':
          this.state.rules.AllowGuestCheckout = value
          this.setState({ rules: this.state.rules },
            ()=>{
              this.compareData()
            })
          break;
      case 'ER':
          this.state.rules.EmailRequired = value
          this.setState({ rules: this.state.rules },
            ()=>{
              this.compareData()
            })
          break;
      case 'MR':
          this.state.rules.MobileRequired = value
          this.setState({ rules: this.state.rules },
            ()=>{
              this.compareData()
            })
          break;
      case 'FNR':
          this.state.rules.FullNameRequired = value
          this.setState({ rules: this.state.rules },
            ()=>{
              this.compareData()
            })
          break;
      case 'AR':
          this.state.rules.AuthenticationRequired = value
          this.setState({ rules: this.state.rules },
            ()=>{
              this.compareData()
            })
          break;
      case 'SRN':
          this.state.rules.ShowRoomNumber = value
          this.setState({ rules: this.state.rules },
            ()=>{
              this.compareData()
            })
          break;
      case 'STN':
          this.state.rules.ShowTableNumber = value
          this.setState({ rules: this.state.rules },
            ()=>{
              this.compareData()
            })
          break;
      default:
        this.setState({ rules: this.state.rules },
          ()=>{
            this.compareData()
          });
        break;
  }
  
  }

  addDescription = (e) =>{
    this.setState({ description: e.target.value},
      ()=>{
        this.compareData()
      })
  }

  saveRules = () =>{
    this.setState({ isEdit: true })
    this.saveSource()
  }

  DeleteSource = async () => {

    this.setState({ showSweetAlertConfirmation: false });
    let DeletedMessage = await EnterpriseOrderSource.Delete(this.state.selectedSourceId)
    if (DeletedMessage === '1') {
      Utilities.notify((Utilities.SpecialCharacterDecode(this.state.sourceName) + " deleted successfully."), "s");
      this.GetSource()
      this.setState({ selectedSourceId: "", selectedName: "", sourceName: "", sourceLink: "" , description: ""  })
      return;
    }

    let message = DeletedMessage === '0' ? '"' + Utilities.SpecialCharacterDecode(this.state.sourceName) + '" has not been deleted' : DeletedMessage;
    Utilities.notify(message, "e");


  }

  DeleteSourceConfirmation = (Id, name) =>{

    this.setState({ sourceName: name, selectedSourceId: Id, comfirmationModelType: 'ds', showSweetAlertConfirmation: true, sweetAlertConfirmationModelText: 'Remove ' + Utilities.SpecialCharacterDecode(name) + '?' })

  }

  saveModeConfirmation  = (Id, name) =>{
    this.setState({ selectedSourceId: Id, comfirmationModelType: 'sc', showSweetAlertConfirmation: true, sweetAlertConfirmationModelText: 'You have unsaved changes for order mode ' + Utilities.SpecialCharacterDecode(name)})
  }

  setModeName = (name, check) =>{
    var checkMode =  this.state.source.find(v=> v.Name.toLowerCase() == name.toLowerCase().trim())
    var checkParameter = this.state.source.find(v=> v.Parameter.toLowerCase() == name.replaceAll(" ", '-').trim().toLowerCase())
    // console.log('source', this.state.source)
    // console.log('source', checkParameter)
    // console.log('source', this.state.isSourceAddLinkEmpty)
    switch (check) {
      case '1':
        var sourceLink = (!this.state.isSourceAddLinkEmpty) ? this.state.addSourceLink : name.replaceAll(" ", '-')
        this.setState({ addSourceName: name, addSourceLink: sourceLink.replaceAll(" ", '-')},
        ()=>{
          if(checkMode != undefined || checkParameter != undefined){
            this.setState ({ newModeButtonDisabled : true, modeError: checkMode != undefined ? true : false, parameterError: checkParameter != undefined ? true : false, modeErrorMessage: "Mode already exist.", parameterErrorMessage: "Parameter name already exist." })
            return
          }
          this.setState ({ newModeButtonDisabled : false, modeError: false, parameterError: false, modeErrorMessage: "", parameterErrorMessage:"" })
        }
        )
        break;
      case '2':
        var sourceLink = (!this.state.isSourceLinkEmpty) ? this.state.sourceLink : name.replaceAll(" ", '-')
        this.setState({ sourceName: name, sourceLink: sourceLink.replaceAll(" ", '-')},
        ()=>{
          this.compareData()
          if(checkMode != undefined){
            this.setState ({ modeError: true, modeErrorMessage: "Mode already exist." })
            return
          }
          this.setState ({ modeError: false, modeErrorMessage: "" })
        })
        
        break;
    
      default:
        break;
    }
  }

  setParameterName = (name, check) =>{
    var checkParameter = this.state.source.find(v=> v.Parameter.toLowerCase() == name.replaceAll(" ", '-').toLowerCase())
    switch (check) {
      case '1':
        var addsourceLink = name.replaceAll(" ", '-')
        this.setState({ addSourceLink: addsourceLink.replaceAll(" ", '-'), isSourceLinkEmpty: sourceLink == '' },
        ()=>{
          if(checkParameter != undefined){
            this.setState ({ newModeButtonDisabled : true, parameterError: true, parameterErrorMessage: "Parameter name already exist." })
            return
          }
          this.setState ({ parameterError: false, parameterErrorMessage: "",  newModeButtonDisabled : this.state.modeError == false ? false : true })
        }
        )
        break;
      case '2':
        var sourceLink = name.replaceAll(" ", '-')
        this.setState({ sourceLink: sourceLink.replaceAll(" ", '-'), isSourceLinkEmpty: sourceLink == '' },
        ()=>{
          this.compareData()
          if(checkParameter != undefined){
            this.setState ({ newModeButtonDisabled : true, parameterError: true, parameterErrorMessage: "Parameter name already exist." })
            return
          }
          this.setState ({ parameterError: false, parameterErrorMessage: "",  newModeButtonDisabled : this.state.modeError == false ? false : true })
        })
        break;
    
      default:
        break;
    }
  }


  editSourceLink = (check) =>{
    switch (check) {
      case '1':
        this.setState({ isEditAddSourceLink: !this.state.isEditAddSourceLink})
        break;
      case '2':
        this.setState({ isEditSourceLink: !this.state.isEditSourceLink, isSourceLinkEmpty: false })
        break;
    
      default:
        break;
    }
   
  }

  leftCatPanel = () =>{
    return(

    <div className="">
      <div>
        <div className="menu-left-cat-list h-auto">
          <ul className="mb-3">
            {
              this.state.source.map((v,i)=>(
              <li onClick={()=>this.selectSource(v,i)} key={i} className={`  ${v.Id == this.state.selectedSourceId && "active"}`}>
                <div className='d-flex  flex-column'>
                <div>
                <span className="menu-left-list-label mr-3">{v.Name}</span>
                {
                  v.IsDefault &&
                  <i class="fa fa-star font-18" style={{color:"#fde16d"}}></i>
                }
                </div>
                {/* {
                  this.state.selectedSourceId == v.Id &&
                  <div>
                    <span className='mr-3 font-12 badge badge-secondary px-2 py-1' style={{fontStyle:"italic"}}>{v.Parameter}</span>
                  </div> 
                } */}
                </div>
                <span className="menu-left-list-buttons mr-0 menu-left-icons-list">
                  {/* <span onClick={()=>this.EditOrderSourceModal(v,i)} data-toggle="modal" data-target="#categoryModalEdit"><i className="fa fa-pencil-square-o" aria-hidden="true" data-tip="true" data-for="Edit"></i></span> */}
                  <span onClick={()=>this.DeleteSourceConfirmation(v.Id, v.Name)} className="sa-warning"><i className="fa fa-trash" aria-hidden="true" data-tip="true" data-for="Delete"></i></span>
                </span>
               
              </li>
              ))
            }
          </ul>
        </div>
        <a className="text-primary font-14 cursor-pointer" onClick={() => this.AddOrderSourceModal()}>+ Add Order Source</a>
      </div>
    </div>
    )
  }

  markDefault = (e) => {
    this.setState({ isDefault: e.target.checked },()=>
      this.compareData()
    )
  }

  render() {

    if(this.state.loading) return this.loading()

    return (
      <div>
        <div className='d-flex align-items-center w-100 mb-3 p-l-r'><h3 class="card-title card-new-title ml-0 mb-0 pl-0">Order Modes</h3>
          {/* <span className="add-cat-btn ml-auto" >
            <span className="hide-in-responsive">+ {Labels.Add_New}</span>
          </span> */}
        </div>
        <div className='menu-page-wrap p-0 order-sourse-main-wrap'>
          <div className="menu-left-penal s-l-wrap">
            <div className="select-cat-btn-res" onClick={() => this.ResponsiveLeftModal()}>
              <span>{this.state.selectedName}</span>
              <span className="change-cat-modal">Change</span>
            </div>
            <div id="leftcategory" className="" isopen="false">
              <div className="">
                <div className="">
                  <div className="no-display">
                    <h4 className="modal-title">Select Order Mode</h4>
                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                  </div>
                  {this.state.source.length > 0 ? this.leftCatPanel() :
                     <a className="text-primary font-14 cursor-pointer" onClick={() => this.AddOrderSourceModal()}>+ Add Order Mode</a>  
                  }
                  <div className="no-display">
                    <button type="button" className="btn btn-default waves-effect" data-dismiss="modal">Cancel</button>
                    <button type="button" className="btn btn-success waves-effect">Save</button>
                    </div>
                </div>
              </div>
            </div>
          </div>

          
          <div className="menu-right-penal border-0 " style={{ maxWidth: 400 }}>
            {
              this.state.source.length > 0 ?
              <AvForm onValidSubmit={this.saveSource} >
              <div>
                  <div className=''>
                    <div className='d-flex'>
                      <input type="checkbox" className="form-checkbox" id="default" value={this.state.isDefault} checked={this.state.isDefault} onChange={(e)=>this.markDefault(e)} />
                      <label className="control-label">Mark as Default?</label>
                    </div>
                    <label className="control-label">Mode Name</label>
                    <AvField onChange={(e) => this.setModeName(e.target.value, '2')} value={this.state.sourceName} type="text" className=" form-control mr-3" name="sourcename" id="sourcename"
                      validate={{
                        required: { errorMessage: 'This is a required field' }
                      }}
                    />
                      {
                            this.state.modeError &&
                            <span className='d-flex mt-2 text-danger'>{this.state.modeErrorMessage}</span>
                          }
                   
                    {/* {
                      this.state.isEditSourceLink && */}
                      <div className='mt-3'>
                        <label className="control-label">Parameter Name</label>
                        <AvField onChange={(e) => this.setParameterName(e.target.value, '2')} value={this.state.sourceLink.toLowerCase()} type="text" className=" form-control mr-3" name="sourceLink" id="sourceLink"
                          validate={{
                            required: { errorMessage: 'This is a required field' }
                          }}
                        />
                         {
                            this.state.parameterError &&
                            <span className='d-flex mt-2 text-danger'>{this.state.parameterErrorMessage}</span>
                          }
                      </div>
                    {/* } */}

                    {this.state.sourceName.length > 0 &&
                      <div>
                        {/* {
                          !this.state.isEditSourceLink &&
                          <div className='d-flex  align-items-center mt-3 '>
                            <span className='text-primary mr-3'>{Utilities.SpecialCharacterEncode(this.state.sourceLink.toLowerCase())}</span>
                            <a onClick={() => this.editSourceLink('2')} class=" cursor-pointer font-12"><i class="fa fa-edit mr-1" style={{fontSize:12}}></i>Edit</a>
                          </div>
                        } */}
                        <span className='d-flex mt-3'>Use above parameter in your URL while creating QR.</span>
                        <div className='d-flex mt-2 position-relative flex-column'>
                        <a href={`${this.state.siteUrl}?mode=${Utilities.SpecialCharacterEncode(this.state.sourceLink.toLowerCase())}`} target="_blank" className='color-7 font-14 mr-3 exapmle-c-clip text-primary cursor-pointer mb-2'>{this.state.siteUrl}?mode={Utilities.SpecialCharacterEncode(this.state.sourceLink.toLowerCase())}</a>
                        <div>
                          <CopyToClipboard text={`${this.state.siteUrl}?mode=${Utilities.SpecialCharacterEncode(this.state.sourceLink.toLowerCase())}`}
                            onCopy={() => this.copyText()}>
                            <span className='clipboard-icon px-2'><BsClipboard className='mr-2 font-12'></BsClipboard><span className='font-12'> Copy URL </span></span>
                          </CopyToClipboard>
                          {this.state.copied ? <span className='fadeOut clipboard-tool'><span className='font-12'>Copied. </span></span> : null}
                          </div>
                          </div>
                      </div>
                      

                    }
                  </div>
                  <div className='mt-3'>
                    <label className="control-label">Notes</label>
                    <AvInput onChange={(e)=>this.addDescription(e)} value={this.state.description} type="textarea" className=" form-control mr-3" name="address" id="address" style={{ width: "100%", maxWidth:'400px', height: "80px" }} />
                  </div>
                <div className='mb-3 font-16 mt-5'>
                  <span class=" bold ">Rules</span>
                </div>
                {
                  this.state.EnterpriseTypeId == 3 &&
                  <div className="support-row-wrap mb-3">
                    <div className='d-flex align-items-center w-100 '>
                      <label className="m-0 cursor-pointer w-100  w-100" for="chkAll">Allow Guest to call staff</label>
                    </div>
                    <AppSwitch name="ALC" onChange={(e)=>this.updateSwitch(e.target.checked, 'AGCS')} checked={this.state.rules.AllowGuestToCallStaff} value={this.state.rules.AllowGuestToCallStaff} className={'mr-auto'} variant={'3d'} color={'primary'} label dataOn={'\u2713'} dataOff={'\u2715'} />

                  </div>
                }
                 <div className="support-row-wrap mb-3">
                  <div className='d-flex align-items-center w-100 '>
                    <label className="m-0 cursor-pointer w-100  w-100" for="chkAll">Allow customer to order</label>
                  </div>
                  <AppSwitch name="ALC" onChange={(e)=>this.updateSwitch(e.target.checked, 'ALC')} checked={this.state.rules.AllowCustomerToOrder} value={this.state.rules.AllowCustomerToOrder} className={'mr-auto'} variant={'3d'} color={'primary'} label dataOn={'\u2713'} dataOff={'\u2715'} />

                </div>
                {
                  this.state.rules.AllowCustomerToOrder &&
                  <div>
 <div className="support-row-wrap mb-3 pl-2">
                  <div className='d-flex align-items-center w-100 '>
                    <label className="m-0 cursor-pointer w-100  w-100" for="chkAll">Allow Express checkout</label>
                  </div>
                  <AppSwitch name="AEC" onChange={(e)=>this.updateSwitch(e.target.checked, 'AEC')} checked={this.state.rules.AllowExpressCheckout} value={this.state.rules.AllowExpressCheckout} className={'mr-auto'} variant={'3d'} color={'primary'} label dataOn={'\u2713'} dataOff={'\u2715'} />

                </div>
                <div className="support-row-wrap mb-3 pl-2">
                  <div className='d-flex align-items-center w-100 '>
                    <label className="m-0 cursor-pointer w-100  w-100" for="chkAll">Normal checkout</label>
                  </div>
                  <AppSwitch name="NC" onChange={(e)=>this.updateSwitch(e.target.checked, 'NC')} checked={this.state.rules.NormalCheckout} value={this.state.rules.NormalCheckout} className={'mr-auto'} variant={'3d'} color={'primary'} label dataOn={'\u2713'} dataOff={'\u2715'} />

                </div>
                {
                  this.state.rules.NormalCheckout &&
                  <div> 
                    {
                      this.state.EnterpriseTypeId != 3 && 
                      <div className="support-row-wrap mb-3 pl-4">
                        <div className='d-flex align-items-center w-100'>
                          <label className="m-0 cursor-pointer w-100" for="chk2">Allow Guest Checkout</label>
                        </div>
                        <AppSwitch name="AGC" onChange={(e)=>this.updateSwitch(e.target.checked, 'AGC')} checked={this.state.rules.AllowGuestCheckout} value={this.state.rules.AllowGuestCheckout} className={'mr-auto'} variant={'3d'} color={'primary'} label dataOn={'\u2713'} dataOff={'\u2715'} />
                      </div>
                    }

                    {
                      this.state.rules.AllowGuestCheckout &&
                      <div>
                          <div className={`support-row-wrap mb-3 ${this.state.EnterpriseTypeId == 3 && "pl-4"}`} style={{ paddingLeft: this.state.EnterpriseTypeId != 3 ? "3rem" : "" }}>
                            <div className='d-flex align-items-center w-100'>
                              <label className="m-0 cursor-pointer w-100" for="chk3">Ask guest for day and time</label>
                            </div>
                            <AppSwitch name="AGDT" onChange={(e)=>this.updateSwitch(e.target.checked, 'AGDT')} checked={this.state.rules.AskGuestForDayAndTime} value={this.state.rules.AskGuestForDayAndTime} className={'mr-auto'} variant={'3d'} color={'primary'} label dataOn={'\u2713'} dataOff={'\u2715'} />
                          </div>
                          <div className={`support-row-wrap mb-3 ${this.state.EnterpriseTypeId == 3 && "pl-4"}`} style={{ paddingLeft: this.state.EnterpriseTypeId != 3 ? "3rem" : "" }}>
                            <div className='d-flex align-items-center w-100'>
                              <label className="m-0 cursor-pointer w-100" for="chk3">Ask guest for No.of seats</label>
                            </div>
                            <AppSwitch name="AGNS" onChange={(e)=>this.updateSwitch(e.target.checked, 'AGNS')} checked={this.state.rules.AskGuestForNoOfSeats} value={this.state.rules.AskGuestForNoOfSeats} className={'mr-auto'} variant={'3d'} color={'primary'} label dataOn={'\u2713'} dataOff={'\u2715'} />
                          </div>
                          <div className={`support-row-wrap mb-3 ${this.state.EnterpriseTypeId == 3 && "pl-4"}`} style={{ paddingLeft: this.state.EnterpriseTypeId != 3 ? "3rem" : "" }}>
                            <div className='d-flex align-items-center w-100'>
                              <label className="m-0 cursor-pointer w-100" for="chk3">Ask guest for No.of baby seats</label>
                            </div>
                            <AppSwitch name="AGBS" onChange={(e)=>this.updateSwitch(e.target.checked, 'AGBS')} checked={this.state.rules.AskGuestForNoOfBabySeats} value={this.state.rules.AskGuestForNoOfBabySeats} className={'mr-auto'} variant={'3d'} color={'primary'} label dataOn={'\u2713'} dataOff={'\u2715'} />
                          </div>
                          <div className={`support-row-wrap mb-3 ${this.state.EnterpriseTypeId == 3 && "pl-4"}`} style={{ paddingLeft: this.state.EnterpriseTypeId != 3 ? "3rem" : "" }}>
                            <div className='d-flex align-items-center w-100'>
                              <label className="m-0 cursor-pointer w-100" for="chk3">Ask guest for further instructions</label>
                            </div>
                            <AppSwitch name="AGFI" onChange={(e)=>this.updateSwitch(e.target.checked, 'AGFI')} checked={this.state.rules.AskGuestForFurtherInstructions} value={this.state.rules.AskGuestForFurtherInstructions} className={'mr-auto'} variant={'3d'} color={'primary'} label dataOn={'\u2713'} dataOff={'\u2715'} />
                          </div>
                          <div className={`support-row-wrap mb-3 ${this.state.EnterpriseTypeId == 3 && "pl-4"}`} style={{ paddingLeft: this.state.EnterpriseTypeId != 3 ? "3rem" : "" }}>
                            <div className='d-flex align-items-center w-100'>
                              <label className="m-0 cursor-pointer w-100" for="chk3">Email required</label>
                            </div>
                            <AppSwitch name="ER" onChange={(e)=>this.updateSwitch(e.target.checked, 'ER')} checked={this.state.rules.EmailRequired} value={this.state.rules.EmailRequired} className={'mr-auto'} variant={'3d'} color={'primary'} label dataOn={'\u2713'} dataOff={'\u2715'} />
                          </div>
                          <div className={`support-row-wrap mb-3 ${this.state.EnterpriseTypeId == 3 && "pl-4"}`} style={{ paddingLeft: this.state.EnterpriseTypeId != 3 ? "3rem" : "" }}>
                            <div className='d-flex align-items-center w-100'>
                              <label className="m-0 cursor-pointer w-100" for="chk5">Full Name Required</label>
                            </div>
                            <AppSwitch name="FNR" onChange={(e)=>this.updateSwitch(e.target.checked, 'FNR')} checked={this.state.rules.FullNameRequired} value={this.state.rules.FullNameRequired} className={'mr-auto'} variant={'3d'} color={'primary'} label dataOn={'\u2713'} dataOff={'\u2715'} />
                          </div>
                          <div className={`support-row-wrap mb-3 ${this.state.EnterpriseTypeId == 3 && "pl-4"}`} style={{ paddingLeft: this.state.EnterpriseTypeId != 3 ? "3rem" : "" }}>
                            <div className='d-flex align-items-center w-100'>
                              <label className="m-0 cursor-pointer w-100" for="chk4">Mobile required</label>
                            </div>
                            <AppSwitch name="MR" onChange={(e)=>this.updateSwitch(e.target.checked, 'MR')} checked={this.state.rules.MobileRequired} value={this.state.rules.MobileRequired} className={'mr-auto'} variant={'3d'} color={'primary'} label dataOn={'\u2713'} dataOff={'\u2715'} />
                          </div>   
                      </div>
                    }
                    {
                      this.state.EnterpriseTypeId == 6 &&
                    <div className="support-row-wrap mb-3 pl-4">
                      <div className='d-flex align-items-center w-100'>
                        <label className="m-0 cursor-pointer w-100" for="chk6">Authentication Required</label>
                      </div>
                      <AppSwitch name="AR" onChange={(e)=>this.updateSwitch(e.target.checked, 'AR')} checked={this.state.rules.AuthenticationRequired} value={this.state.rules.AuthenticationRequired} className={'mr-auto'} variant={'3d'} color={'primary'} label dataOn={'\u2713'} dataOff={'\u2715'} />
                    </div>
                  }                   
                   <div className="support-row-wrap mb-3 pl-4">

                      <div className='d-flex align-items-center w-100'>
                        <label className="m-0 cursor-pointer w-100" for="chk7">Show Room Number</label>
                      </div>
                      <AppSwitch name="SRN" onChange={(e)=>this.updateSwitch(e.target.checked, 'SRN')} checked={this.state.rules.ShowRoomNumber} value={this.state.rules.ShowRoomNumber} className={'mr-auto'} variant={'3d'} color={'primary'} label dataOn={'\u2713'} dataOff={'\u2715'} />
                    </div>
                    <div className="support-row-wrap mb-3 pl-4">
                      <div className='d-flex align-items-center w-100'>
                        <label className="m-0 cursor-pointer w-100" for="chk8">Show Table Number</label>
                      </div>
                      <AppSwitch name="STN" onChange={(e)=>this.updateSwitch(e.target.checked, 'STN')} checked={this.state.rules.ShowTableNumber} value={this.state.rules.ShowTableNumber} className={'mr-auto'} variant={'3d'} color={'primary'} label dataOn={'\u2713'} dataOff={'\u2715'} />
                    </div>
                  </div>
                }
                  </div>
                }
                


                {/* <AvForm onValidSubmit={this.saveRules}> */}
                 
                <div className="support-row-wrap mt-4">
                  <div className='d-flex align-items-center w-100'>
                      <Button color="primary" disabled={this.state.disabled || this.state.modeError || this.state.parameterError} >
                      {this.state.isSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                          : <span className="comment-text">{Labels.Save}</span>}
                    
                    </Button> 
                  </div>
                </div>
              
              </div>
                </AvForm>
              :
              <div className='d-flex align-items-center not-found-label mb-4'>No Rules Added Yet</div>
            }
          </div>

          <Modal isOpen={this.state.AddOrderSource} toggle={() => this.AddOrderSourceModal(this.state.AddOrderSource)} className={this.props.className}>
            <ModalHeader toggle={() => this.AddOrderSourceModal(this.state.AddOrderSource)} >{this.state.isEdit ? "Edit Mode" : "Add New Mode"}</ModalHeader>
            <AvForm onValidSubmit={this.saveSource} >
              <ModalBody >
                <div className=''>
                  <label className="control-label">Mode Name</label>
                  <AvField onChange={(e)=>this.setModeName(e.target.value, '1')} value={this.state.addSourceName} type="text" className=" form-control mr-3" name="sourcename" id="sourcename" 
                    validate={{
                      required: { errorMessage: 'This is a required field' }
                    }}
                  />
                   {
                      this.state.modeError &&
                      <span className='d-flex mt-2 text-danger'>{this.state.modeErrorMessage}</span>
                    }
                  {
                    this.state.isEditAddSourceLink &&
                    <div className='mt-3'>
                      <label className="control-label">Parameter Name</label>
                      <AvField onChange={(e)=>this.setParameterName(e.target.value, '1')} value={this.state.addSourceName.toLowerCase()} type="text" className=" form-control mr-3" name="sourceLink" id="sourceLink" 
                        validate={{
                          required: { errorMessage: 'This is a required field' }
                        }}
                      />
                      {
                      this.state.parameterError &&
                      <span className='d-flex mt-2 text-danger'>{this.state.parameterErrorMessage}</span>
                    }
                    </div>
                    }
                    
                    {this.state.addSourceName.length > 0 &&
                      <div>
                        {
                          !this.state.isEditAddSourceLink &&
                          <div className='d-flex  align-items-center mt-3 '>
                            <span className='text-primary mr-3'>{Utilities.SpecialCharacterEncode(this.state.addSourceLink.toLowerCase())}</span>
                            {/* <IoCopyOutline className='cursor-pointer'></IoCopyOutline> */}
                            <a onClick={()=>this.editSourceLink('1')} class=" cursor-pointer"><i class="fa fa-edit mr-1"></i>Edit</a>
                          </div>
                        }
                        <span className='d-flex mt-3'>Use above parameter in your URL while creating QR.</span>
                        <span className='color-7 font-12'>eg: {this.state.siteUrl}?mode={Utilities.SpecialCharacterEncode(this.state.addSourceLink.toLowerCase())}</span>
                      </div>
                    
                  }
                </div>
                
              </ModalBody>
              <FormGroup className="modal-footer" >
                <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger"></label>
                </div>
                <div>
                  <Button className='mr-2 text-dark' color="secondary" onClick={() => this.AddOrderSourceModal()}>Cancel</Button>
                  <Button color="primary" disabled={this.state.newModeButtonDisabled} >
                  { this.state.isSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>  :
                    <span  className="comment-text">Save</span> }
                  </Button>
                </div>
              </FormGroup>
            </AvForm>
          </Modal>

          <Modal isOpen={this.state.ResponsiveLeft} toggle={() => this.ResponsiveLeftModal()} className={this.props.className}>
          <ModalHeader  > 
          <i className='fa fa-chevron-left cat-back-btn' onClick={() => this.ResponsiveLeftModal()}></i>
          Select Order Mode
           </ModalHeader>
          <ModalBody >
          <div className="menu-page-wrap p-0 order-sourse-main-wrap p-res-0">
            <div className="menu-left-penal s-l-wrap">
            {this.state.source.length > 0 ? this.leftCatPanel() :
                     <a className="text-primary font-14 cursor-pointer" onClick={() => this.AddOrderSourceModal()}></a>  
                  }
              </div>
              </div>
         
          </ModalBody>
          {/* <FormGroup className="modal-footer" >
            <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger"></label>
            </div>
            <div>
              <Button className='mr-2 text-dark' color="secondary" onClick={() => this.ResponsiveLeftModal()}>Cancel</Button>
              <Button color="primary" >
           
                 <span className="comment-text">Save</span> 
              </Button>
            </div>
          </FormGroup> */}
        </Modal>

          {this.GenerateSweetConfirmationWithCancel()}

        </div>
      </div>
    )

  }
}

export default OrderSource;
