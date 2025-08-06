import React, { Component } from 'react';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import {  Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import * as EnterpriseAddressService from '../../service/EnterpriseAddress';
import * as AreaService from '../../service/Area';
import * as Utilities from '../../helpers/Utilities';
import Config from '../../helpers/Config';
import Constants from '../../helpers/Constants';
import Loader from 'react-loader-spinner';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps";
import Autocomplete from 'react-google-autocomplete';
import Geocode from "react-geocode";
import config from 'react-transition-group';
import WrappedMap from "../../helpers/googleMap";
import GlobalData from '../../helpers/GlobalData'
import Labels from '../../containers/language/labels';
Geocode.setApiKey(Config.Setting.googleApi);
Geocode.enableDebug();
const $ = require('jquery');

$.DataTable = require('datatables.net');

class Addresses extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            EnterpriseAddress: [],
            SelectedAddress: {},
            showAlert: false,
            alertModelText: '',
            alertModelTitle:'',
            deleteConfirmationModelText : '',
            deleteComfirmationModelType : '',
            showDeleteConfirmation: false,
            modalNewAddress: false,
            AddressToBeRemovedID: '',
            ShowLoader: true,
            IsUpdate: false,
            Area: {},
            Areas: [],
            SelectedArea: "",
            SelectedAddressID: 0,
            TagAddress: "",
            AreaId: 0,
            AreaText: "",
            BuildingNum: "",
            Latitude: "",
            Longitude: "",
            activePage: 15,
            ShowError: false,
            AllowEdit: false,
            IsSave:false,
            ShowPostcodeLoader: false,
            seletedLocationAddress: "",
            LatLong: {lat: 0, lng:0},
            address: '',
            mapPosition: {},
            showMap: false,
            isValid: true,
            isBNumValid: true,
            IsNew: false,
            IsAddressValid: true,
            FormattedAddress: "",

        };

        let defaultLocation = Config.Setting.DefaultLocation;

        this.state.mapPosition = {lat: defaultLocation[0],  lng: defaultLocation[1]}

        // this.SetMapLocation(defaultLocation[0] , defaultLocation[1]);

        this.toggleNewAddressModal = this.toggleNewAddressModal.bind(this);
        this.GetEnterpriseAddress = this.GetEnterpriseAddress.bind(this);
        this.AddNewEnterpriseAddress = this.AddNewEnterpriseAddress.bind(this);
        this.SaveEnterpriseAddress = this.SaveEnterpriseAddress.bind(this);
        this.DeleteEnterpriseAddress = this.DeleteEnterpriseAddress.bind(this);
        
    }

//#region api calling

GetEnterpriseAddress = async () => {
   
    this.setState({ShowLoader : true});
    var data = await EnterpriseAddressService.Get();
    if(data.length > 0)
        data.sort(function(a,b){return !a.IsPrimary && b.IsPrimary});

    this.setState({EnterpriseAddress:data,ShowLoader: false});
    this.bindDataTable();
}

GetAddressBy = async (addressId) => {
    this.setState({showMap: false })
    let defaultLocation = Config.Setting.DefaultLocation;
    let data =  await EnterpriseAddressService.GetBy(addressId);
    let latitude = defaultLocation[0];
    let longitude = defaultLocation[1];

    if( data.Latitude !== 0 && data.Latitude !== undefined && data.Longitude !== 0 && data.Longitude !== undefined ){
        latitude = data.Latitude;
        longitude = data.Longitude;
    }

    this.setState({TagAddress: data.Label
        ,BuildingNum: data.Address1
        ,AreaText: data.SelectedAreaText
        ,Latitude: latitude
        ,Longitude: longitude
        ,SelectedAddressID: addressId
        ,seletedLocationName: data.Address1
        ,IsUpdate: true
        ,isBNumValid: true
        ,IsAddressValid: true
        ,FormattedAddress: data.FormattedAddress.replace(data.Address1,'')
        ,mapPosition: {
            lat: latitude,
            lng: longitude
        }
    });

    this.SetMapLocation(latitude, longitude);
    this.toggleNewAddressModal();
    
}


DeleteEnterpriseAddress = async() => {
   
    let DeletedMessage = await EnterpriseAddressService.Delete(this.state.AddressToBeRemovedID)
    this.setState({showDeleteConfirmation: false});
    let name = this.state.SelectedAddressName;
    
    if(DeletedMessage === '1'){
        this.GetEnterpriseAddress();
        this.setState({showAlert: true, alertModelTitle:'Deleted!', alertModelText:"'"+ name+'" deleted successfully' });
        
        return;
    } 
    
    let message = DeletedMessage === '0' ? name +'" not deleted successfully' :  DeletedMessage;
    this.setState({showAlert: true, alertModelTitle:'Error!', alertModelText: message});
    
}

SaveEnterpriseAddressApi = async(enterpriseAddress) =>{

    let message = await EnterpriseAddressService.Save(enterpriseAddress);
    this.setState({IsSave:false})
    if(message === '1'){
     
        this.GetEnterpriseAddress();
        this.setState({ modalNewAddress: !this.state.modalNewAddress, });
    }
}
  
UpdateEnterpriseAddressApi = async(enterpriseAddress) =>{

    let message = await EnterpriseAddressService.Update(enterpriseAddress);
    this.setState({IsSave:false})
    if(message === '1') {
     
        this.GetEnterpriseAddress();
        this.setState({ modalNewAddress: !this.state.modalNewAddress});
    }
}

SaveEnterpriseAddress() {
  
    if(this.state.IsSave || this.state.IsNew) return;
    this.setState({IsSave:true})
    
    var tagAddress = this.state.TagAddress;
    var buildingNum = this.state.BuildingNum;
    var area = this.state.FormattedAddress;
    var valid = true;
    
    if(tagAddress === ''){
        this.setState({isValid : false})
        valid = false;
    }

    if(buildingNum === ''){
        this.setState({isBNumValid : false})
        valid = false;
    }

    if(area === ''){
        this.setState({IsAddressValid : false})
        valid = false;
    }

    if (!valid){
        this.setState({IsSave:false})
        return;
    }


    let isUpdate = this.state.IsUpdate;
    let enterpriseAddress = EnterpriseAddressService.EnterpriseAddress;
    enterpriseAddress.AreaId = 0;
    enterpriseAddress.ID = this.state.SelectedAddressID
    enterpriseAddress.Label = this.state.TagAddress ;//values.txtTagAddrs
    enterpriseAddress.Address = this.state.BuildingNum //values.txtAddress
    // enterpriseAddress.FormattedAddress = `${enterpriseAddress.Address} ${enterpriseAddress.GoogleLocation}` //values.txtAddress
    enterpriseAddress.FormattedAddress = `${enterpriseAddress.Address}, ${this.state.FormattedAddress}` //values.txtAddress
    
    //Saving
    if(!isUpdate ){
      this.SaveEnterpriseAddressApi(enterpriseAddress);
      return;
    } 

    // updating
        this.UpdateEnterpriseAddressApi(enterpriseAddress);
        
}
      
//#endregion


//#region  Confirmation Model Generation

DeleteAddressConfirmation(name,id){

    this.setState({AddressToBeRemovedID: id, SelectedAddressName: name,  showDeleteConfirmation:true, deleteConfirmationModelText: 'You want to delete "'+name+'".'})
  
  }

//#endregion 


//#region Models and alerts Html 

GenerateSweetConfirmationWithCancel(){
    return( 
       <SweetAlert
         show={this.state.showDeleteConfirmation}
         title="Are you sure?"
         text={this.state.deleteConfirmationModelText}
         showCancelButton
         onConfirm={() => {this.DeleteEnterpriseAddress()}}
         onCancel={() => { this.setState({ showDeleteConfirmation: false });
         }}
         onEscapeKey={() => this.setState({ showDeleteConfirmation: false })}
        //  onOutsideClick={() => this.setState({ showDeleteConfirmation: false })}
       />
     )
}
  
   GenerateSweetAlert(){
    return( 
       <SweetAlert
         show={this.state.showAlert}
         title={this.state.alertModelTitle}
         text={this.state.alertModelText}
         onConfirm={() => this.setState({ showAlert: false })}
         onEscapeKey={() => this.setState({ showAlert: false })}
        //  onOutsideClick={() => this.setState({ showAlert: false })}
       />
     )
   }

  //#endregion

loading = () =>   <div className="page-laoder page-laoder-menu">
<div className="loader-menu-inner"> 
  <Loader type="Oval" color="#ed0000" height={50} width={50}/>  
  <div className="loading-label">Loading.....</div>
  </div>
</div> 


OnChanges= (IsNew) => {
    let enterpriseAddress = EnterpriseAddressService.EnterpriseAddress;
    this.setState({IsNew});
    this.setState({FormattedAddress:  enterpriseAddress.GoogleLocation });
}

AddNewEnterpriseAddress(){
    this.setState({showMap: false })
    let defaultLocation = Config.Setting.DefaultLocation;
    this.setState({TagAddress: ""
    ,SelectedCityId: 0
    ,SelectedAddressID: 0
    ,BuildingNum: ""
    ,AreaText: ""
    ,Latitude: ""
    ,Longitude: ""
    ,modalNewAddress: !this.state.modalNewAddress
    ,Cities: []
    ,Towns: []
    ,IsUpdate: false
    ,isValid: true,
    isBNumValid: true,
    IsNew: true,
    mapPosition: {
        lat: defaultLocation[0],   
        lng: defaultLocation[1]
    },

},() => {


  setTimeout(() => {
    var inputs = document.getElementsByClassName('input-for-map');
   inputs[0].focus();
    
  }, 1000);


});

this.SetMapLocation(defaultLocation[0],defaultLocation[1])

}

SetMapLocation(lat,long){
    let enterpriseAddress = EnterpriseAddressService.EnterpriseAddress;
    let defaultLocation = Config.Setting.DefaultLocation;
    Geocode.fromLatLng( lat , long ).then(
        response => {
         const address = response.results[0].formatted_address ;
         enterpriseAddress.GoogleLocation = address;
         enterpriseAddress.Latitude = lat;
         enterpriseAddress.Longitude =  long;
       this.setState( {
          address: lat !== defaultLocation[0] ? address : '',
            mapPosition: {lat: lat, lng: long},
            showMap: true
         })

        },
        error => {
         console.error(error);
        }
       );
}



RenderAddress(address){

  return (
    <tr key={address.Id}>
          
          <td>
           {Utilities.SpecialCharacterDecode(address.Label)}
           </td>
         
          <td>
            {address.FormattedAddress}
           </td>

          <td> 
            {this.state.AllowEdit ? <div> 
                <span className="m-b-0 statusChangeLink m-r-20" onClick={(e) => this.GetAddressBy(address.Id)} ><span><i className="fa fa-edit font-18"></i></span ></span>
            {address.IsPrimary ? "" : <span className="m-b-0 statusChangeLink m-r-20" onClick={(e) => this.DeleteAddressConfirmation(address.Label,address.Id)}><span><i className="fa fa-trash  font-18"></i></span></span>}</div>
          : <div></div> }
          
          
            </td>

        </tr>
       )
}

LoadEnterpriseAddress(enterpriseAddress){
    
    if(this.state.ShowLoader===true) {
        return this.loading()
      }

    var htmlAddress = [];

    if(enterpriseAddress.length === 0){
      return <div></div>
    }

  for (var i=0; i < enterpriseAddress.length; i++){
    
         htmlAddress.push(this.RenderAddress(enterpriseAddress[i]));
      }

  return(

    <tbody>{htmlAddress.map((enterpriseAddress) => enterpriseAddress)}</tbody>

   )

}

bindDataTable() { 
    $("#tblAddress").DataTable().destroy();
    $('#tblAddress').DataTable({
       "paging": true,
        "ordering": false,
        "info": true,
        "lengthChange": false,
        "search": {
            "smart": false
        },
        "language": {
          "searchPlaceholder": "Search",
        "search":""
      }
    });
}

OnItemSelect(value){
    
    this.setState({AreaText: value })

    let areas = this.state.Areas;

    let area = areas.filter((area) => {
        return area.Area2 = value
    })

    this.setState({AreaId: area[0].Id })
}

  //#endregion

toggleNewAddressModal() {
        this.setState({ modalNewAddress: !this.state.modalNewAddress, ShowError:false,isValid: true, isBNumValid: true});
        
}

componentDidMount() {

  this.GetEnterpriseAddress();
  if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))){
    var userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
    var HasPermission = Utilities.HasPermission(userObj.RoleLevel, Constants.Permission.ENTERPRISE_SETTING_UPDATE);
    this.setState({AllowEdit : HasPermission});
}
        
}

shouldComponentUpdate() {
        return true;
}

handleFormattedAddressChange(e){
    var text = e.target.value;
    this.state.FormattedAddress = text;
    if(!this.state.IsAddressValid){
        this.setState({IsAddressValid: true});
    }
 }


  handleTagAddressChange(e){
   var text = e.target.value;
   this.state.TagAddress = text;
   if(!this.state.isValid){
       this.setState({isValid: true});
   }
   
  }

  handleBulidingNumChange(e){
    var text = e.target.value;
    this.state.BuildingNum = text;
    if(!this.state.isBNumValid){
        this.setState({isBNumValid: true});
    }
    
   }
render() {

        return (

            <div className="card" id="addressesWrap">
                  <div className="addressHeader card-new-title">
                        <h3 className="card-title" data-tip data-for='happyFace'>
                            {Labels.Addresses}
                        </h3>
                        {this.state.AllowEdit ? 
                        <span  onClick={this.AddNewEnterpriseAddress} className="btn btn-primary">{Labels.Add_New_Address}</span>
                        :""
                        }
                </div>
                <div className="card-body">


                    <table id="tblAddress" cellSpacing="0" className=" userPage table-hover table table-striped">
      <thead>
        <tr>
          <th style={{width:'150px'}}>{Labels.Tag_Name}</th>
          <th style={{width:'600px'}}>{Labels.Business_Address}</th>
          <th style={{width:'150px'}}>{Labels.Action}</th>
        </tr>
      </thead>
     
      {this.LoadEnterpriseAddress(this.state.EnterpriseAddress)}
     
    </table>

                </div>

                <Modal  isOpen={this.state.modalNewAddress} toggle={this.toggleNewAddressModal} className={[this.props.className, ""]}>
                <AvForm  onValidSubmit={this.SaveEnterpriseAddress}>
                  <ModalHeader toggle={this.toggleNewAddressModal}>{Labels.Add_New_Address}</ModalHeader>
                  <ModalBody>
                  <div className="card-body address-modal " style={{padding:0}}>
                       
                            <div className="form-body m-b-10">
                                
                                
                                <div className="m-t-10 m-b-20" style={{position:'relative'}}>
    {this.state.showMap ? 
        // this.GenerateAddressMap() 
        <WrappedMap
        
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${Config.Setting.googleApi}&libraries=places`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `40vh` }} />}
        centerLocation={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng, address: this.state.address, isNew : this.state.IsNew}}
        mapElement={<div style={{ height: `100%` }} />}
        onLocationChange={this.OnChanges}
      />
        : <div className="loader-menu-inner"> 
  <Loader type="Oval" color="#ed0000" height={50} width={50}/>  
  <div className="loading-label">Loading.....</div>
  </div>}
  </div>
  <div className="row"> 
  
                                <div className="col-md-12 mb-3">
                                       
                                       <div className="m-b-10 form-group height-input">    
                                       <label className="control-label">Area</label>                      
                                         <AvField  name="txtarea"  type="text" className= { this.state.IsAddressValid ? "form-control" : "is-touched is-pristine av-invalid is-invalid form-control"} value={this.state.FormattedAddress} onChange={(e) => this.handleFormattedAddressChange(e) } errorMessage="This is a required field" required  />
                                         <div class="invalid-feedback" style={this.state.IsAddressValid ? {"display" : "none"} : {"display" : "block"}}>This is a required field</div>
                                       
                                       <div className="help-block with-errors"></div>
                                       </div>                      
                                   </div>
                                
  <div className="col-md-12 mb-3">
                                       
                                       <div className=" form-group height-input">    
                                       <label className="control-label">{Labels.Building_Name} </label>                      
                                         <AvField  name="BuildingNum"  type="text" className= { this.state.isBNumValid ? "form-control" : "is-touched is-pristine av-invalid is-invalid form-control"} value={this.state.BuildingNum} onChange={(e) => this.handleBulidingNumChange(e) } errorMessage="This is a required field" required  />
                                         
                                       <div class="invalid-feedback" style={this.state.isBNumValid ? {"display" : "none"} : {"display" : "block"}}>This is a required field</div>
                                       
                                       <div className="help-block with-errors"></div>
                                       </div>                      
                                   </div>

                                    <div className="col-md-12 ">
                                       
                                        <div className=" height-input">    
                                        <label className="control-label">{Labels.Tag_This_Address_As} </label>                    
                                          <AvField  name="txtTagAddrs"  type="text" className= { this.state.isValid ? "form-control" : "is-touched is-pristine av-invalid is-invalid form-control"} value={this.state.TagAddress} onChange={(e) => this.handleTagAddressChange(e) } errorMessage="This is a required field" required  />
                                          
                                        <div class="invalid-feedback" style={this.state.isValid ? {"display" : "none"} : {"display" : "block"}}>This is a required field</div>
                                        
                                        <div className="help-block with-errors"></div>
                                        </div>                      
                                    </div>
                                   
                                    
                                 
                                </div>
                            </div>                 
                        
                    </div>
                  </ModalBody>
                  <ModalFooter>

                            <div className="btn btn-secondary"  onClick={this.toggleNewAddressModal}>Cancel</div>
                            <Button disabled={this.state.IsNew ? "disabled" : ""} className= {"btn btn-success"} onClick={this.SaveEnterpriseAddress} style={{width:'78px'}}>
                            {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                             : <span className="comment-text">{this.state.IsUpdate ? "Update" : "Add"}</span>}
                              </Button>
                  </ModalFooter>
                  </AvForm>
                </Modal>

               
                 {this.GenerateSweetConfirmationWithCancel()}
                   {this.GenerateSweetAlert()}    
            </div>
        );
    }

}

export default Addresses;
