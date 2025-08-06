/* global google */
import React, { Component } from 'react';
import { FormGroup, Button, Modal, ModalBody, ModalFooter, ModalHeader, Label,Table } from 'reactstrap';
import {AvForm, AvField } from 'availity-reactstrap-validation';
//import { BrowserRouter, Link } from 'react-router-dom';
import Collapsible from 'react-collapsible';
import * as DeliveryZoneService from '../../service/DeliveryZone';
import * as AreaPolygonService from '../../service/AreaPolygon';
import * as EnterpriseAddressService from '../../service/EnterpriseAddress';
import * as Utilities from '../../helpers/Utilities';
//import Constants from '../../helpers/Constants';
import Config from '../../helpers/Config';
import SweetAlert from 'sweetalert-react';
import Loader from 'react-loader-spinner';
import 'sweetalert/dist/sweetalert.css';
import Map from '../../helpers/Map';
import GlobalData from '../../helpers/GlobalData';
import radius from '../../assets/radius.png';
import polycon from '../../assets/polycon.png';
import Constants from '../../helpers/Constants';

const jsts = require('jsts')
//const AnyReactComponent = ({ text }) => <div>{text}</div>;
const collapsibleClass = ["collapsibleHeaderOne","collapsibleHeaderTwo","collapsibleHeaderThree","collapsibleHeaderFour","collapsibleHeaderFive"]
const Days = [{dayId: 7, dayName: "Sunday" , shortName: "Sun", IsChecked: false},{dayId: 1, dayName: "Monday",shortName: "Mon", IsChecked: false},{dayId: 2, dayName: "Tuesday",shortName: "Tue", IsChecked: false},{dayId: 3, dayName: "Wednesday",shortName: "Wed", IsChecked: false},{dayId: 4, dayName: "Thursday",shortName: "Thu", IsChecked: false},{dayId: 5, dayName: "Friday",shortName: "Fri", IsChecked: false},{dayId: 6, dayName: "Saturday",shortName: "Sat", IsChecked: false}];
const { innerWidth: width, innerHeight: height } = window;
const PriceValidation = (value, ctx) => {

    if (!Utilities.IsNumber(value) && Number(value) !== -1) {
      return "Invalid value";
    }
    return true;
  }

class DeliveryZones extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalAddZone: false,
            modalDeleteZone: false,
            DeliveryZones: [],
            Name: "",
            Radius: 0,
            MinimumDeliveryOrder: "",
            DeliveryCharges: "",
            DeliveryTime: "",
            Days: [{dayId: 7, dayName: "Sunday" , shortName: "Sun", IsChecked: false},{dayId: 1, dayName: "Monday",shortName: "Mon", IsChecked: false},{dayId: 2, dayName: "Tuesday",shortName: "Tue", IsChecked: false},{dayId: 3, dayName: "Wednesday",shortName: "Wed", IsChecked: false},{dayId: 4, dayName: "Thursday",shortName: "Thu", IsChecked: false},{dayId: 5, dayName: "Friday",shortName: "Fri", IsChecked: false},{dayId: 6, dayName: "Saturday",shortName: "Sat", IsChecked: false}],
            IsZoneLimited: true,
            SelectedZone: {},
            show: false,
            alertModelText: '',
            alertModelTitle:'',
            deleteConfirmationModelText : '',
            showDeleteConfirmation: false,
            deleteComfirmationModelType : '',
            DeliveryZoneToBeRemovedID: 0,
            SelectedZoneName: "",
            SelectedZoneID: 0,
            IsUpdate: false,
            Latitude: 0,
            Longitude: 0,
            PrimaryEnterpriseAddress: {},
            ShowLoader: true,
            MapData: [],
            CheckAll: false,
            ValidateDaysCsv: true,
            IsSave:false,
            path: "",
            PolygoneCoords: "",
            SelectedShapeId: 0,
            Editable: false,
            SelectedZoneIndex: 0,
            ShowMapLoader: false,
            AddNewZone: false,
            HasPolygonEdited : false,
            PolygonLatLong: "",
            PolygonSelected: false,
            //MapData : [],
            SelectedPolygonId: 0,
            ZoneType: -1, //0 is for radius and 1 is for polygon.
            ValidPolygonModal: false,
            ZonesExist:true,
            Outline: '',
            IsSupermealDelivery:false,
            AreaPolygons: [],
            FilterAreaPolygons: [],
            SelectedAreaPolygons: [],
            UnSelectedAreaPolygons: [],
            SearchAreaPolygonsText: "",
            modalEditAreaPolygon: false,
            SelectedAreaCSV: "",
            IsUpdating: false,
            SelectedCityId: 0,
            SelectedCityName: "",
            currencySymbol: Config.Setting.currencySymbol,
            defaultLocation: Config.Setting.DefaultLocation,
        }

        if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
            let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
            this.state.IsSupermealDelivery = userObj.EnterpriseRestaurant.RestaurantSettings.IsSupermealDelivery
            this.state.currencySymbol = Utilities.GetCurrencySymbol();
          }


        this.addZoneModaltoggle = this.addZoneModaltoggle.bind(this);
        this.deleteZoneModaltoggle = this.deleteZoneModaltoggle.bind(this);
        this.SaveDeliveryZone = this.SaveDeliveryZone.bind(this);
        this.onPolygonSelection = this.onPolygonSelection.bind(this);
    }


    loading = () =>   <div className="res-loader-wraper"><div className="loader-menu-inner"> 
    <Loader type="Oval" color="#ed0000" height={50} width={50}/>  
    <div className="loading-label">Loading.....</div>
    </div>
    </div>


//#region  Confirmation Model Generation

DeleteZoneConfirmation(name,id){

    if(this.state.Editable && id !== this.state.SelectedShapeId)
    {
        this.setState({HasPolygonEdited: true});
        return;
    }


    this.setState({DeliveryZoneToBeRemovedID: id, SelectedZoneName: name,  showDeleteConfirmation:true, deleteConfirmationModelText: 'You want to delete "'+name+'".'})
  
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
         onConfirm={() => {this.DeleteZone()}}
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
  
  
   GenerateValidPolygonModel() {

    return (
      <Modal isOpen={this.state.ValidPolygonModal} className={this.props.className}>
        <ModalHeader>Validation</ModalHeader>
        <ModalBody className="padding-0 ">
          <AvForm>
          <div className="padding-20 scroll-model-web">
              <FormGroup className="modal-form-group">
                <Label className="control-label">Line intersection is not allowed.
                </Label>
              </FormGroup>
            </div>
            <FormGroup className="modal-footer" >
            <div color="primary" className="btn waves-effect waves-light btn-primary pull-right" onClick={() => this.setState({ValidPolygonModal: false})}>Ok</div>
            </FormGroup>
          </AvForm>
        </ModalBody>
      </Modal>

    )
  }
  //#endregion
  

//#region  api calling


GetEnterprisePrimaryAddress = async () => {

    let data = await EnterpriseAddressService.Get();
    if (data.length !== 0) {
        data.sort(function(a,b){return !a.IsPrimary && b.IsPrimary});
        this.setState({PrimaryEnterpriseAddress: data});
    }
    this.setState({ShowLoader: false});
}


GetEnterpriseZones = async () => {

    this.setState({ Editable: false});
    this.setState({ShowMapLoader:true});
    let data = await DeliveryZoneService.Get();
    let selectedAreaCsv = "";
    if(data.length !== 0) {
        this.state.ZoneType = data[0].Radius === 0 && data[0].PolygonLatLong === ""? 2 : (data[0].Radius === 0 && data[0].PolygonLatLong !== "" ? 1 : 0);

        data.forEach(deliveryZone => {
        let dayShortNameCsv = "";
        let days = Days;
        let dayCsvObj = deliveryZone.DayCsv.split(Config.Setting.csvSeperator);
        selectedAreaCsv += deliveryZone.AreaPolygonIdsCsv + Config.Setting.csvSeperator;
        days.forEach(deliveryDay => {

            var rowId = "-1";
            for (var i = 0, j = dayCsvObj.length; i < j; i++) {
            if (Number(dayCsvObj[i]) === deliveryDay.dayId) {
                rowId = i;
                break;
            }
        }
      
        if(rowId !== "-1")
            dayShortNameCsv += deliveryDay.shortName + ", ";
    })

    deliveryZone.DayShortNameCSV = dayShortNameCsv.slice(0, -2);
        
})

    }

    selectedAreaCsv = Utilities.FormatCsv(selectedAreaCsv,Config.Setting.csvSeperator);
    this.setState({ZonesExist: data.length > 0, ZoneType: data.length > 0 ? this.state.ZoneType : -1})
    this.setState({DeliveryZones: data, IsZoneLimited: data.length < Config.Setting.zoneLimit, Editable: false, AddNewZone: false});
    // this.setState({ShowMapLoader:false, SelectedAreaCSV: selectedAreaCsv, SelectedAreaPolygons: []});
    this.setState({ShowMapLoader:false, SelectedAreaCSV: selectedAreaCsv,});
}



GetAreaPolygon = async () => {

    let data = await AreaPolygonService.Get();

    if(data.length > 0) {

    var filteredData = data.filter((g) => {
        return g.City == data[0].City;
       });

    this.setState({AreaPolygons:data,FilterAreaPolygons: filteredData, SelectedCityName: data[0].City});
    }
}


DeleteZone = async() => {
    
    let DeletedMessage = await DeliveryZoneService.Delete(this.state.DeliveryZoneToBeRemovedID)
    this.setState({showDeleteConfirmation: false});
    let name = this.state.SelectedZoneName;
    
    let deliveryZone = DeliveryZoneService.DeliveryZone;
    deliveryZone.PolygonLatLongArray = "";
    deliveryZone.PolygonLatLong = "";
    
    if(DeletedMessage === '1') {
  
        this.GetEnterpriseZones();
        this.setState({showAlert: true, alertModelTitle:'Deleted!', alertModelText:"'"+ name+'" deleted successfully' });
        return;
    } 
    
    let message = DeletedMessage === '0' ? name +'" not deleted successfully' :  DeletedMessage;
  
    //this.setState({SelectedCategoryId: 0});
    this.setState({showAlert: true, alertModelTitle:'Error!', alertModelText: message});
}


SaveDeliveryZoneApi = async(deliveryAreaCsv) => {
    let id = await DeliveryZoneService.Save(deliveryAreaCsv);
    this.setState({IsSave:false, Outline: '',SelectedAreaPolygons: []})
    if(id > 0) {
        
        if(this.state.ZoneType === 2) {
           
            this.setState({modalEditAreaPolygon: true,});

            if(this.state.AreaPolygons.length > 0){

            var filteredData = this.state.AreaPolygons.filter((g) => {
                return g.City == this.state.AreaPolygons[0].City;
               });

            this.setState({FilterAreaPolygons: filteredData, SelectedCityName: this.state.AreaPolygons[0].City, UnSelectedAreaPolygons: []});
            }

        } 

        this.setState({ modalAddZone: false, SelectedZoneID: id});
        this.GetEnterpriseZones();
    }
    let deliveryZone = DeliveryZoneService.DeliveryZone;
    deliveryZone.PolygonLatLongArray = "";
    deliveryZone.PolygonLatLong = "";
}
  


UpdateDeliveryZoneApi = async(deliveryAreaParam) =>{

    let message = await DeliveryZoneService.Update(deliveryAreaParam);
    this.setState({IsSave:false,Outline: ''})
    if(message === '1') {
     
        this.GetEnterpriseZones();
        this.setState({ modalAddZone: false });
    }
    let deliveryZone = DeliveryZoneService.DeliveryZone;
    deliveryZone.PolygonLatLongArray = "";
    deliveryZone.PolygonLatLong = "";
}
  

UpdateAreaPolygonApi = async(id,csv) =>{

    let message = await DeliveryZoneService.UpdateAreaPolygon(id,csv);
    this.setState({IsUpdating:false,Outline: ''})
    if(message === '1') {
        this.GetEnterpriseZones();
        this.setState({ modalEditAreaPolygon: false,SearchAreaPolygonsText: '', FilterAreaPolygons: this.state.AreaPolygons, UnSelectedAreaPolygon: [] });
        Utilities.notify("Updated successfully.","s");
    } else if (message === '0') {
        Utilities.notify("Update failed.","e");
    } else {
        Utilities.notify("Update failed." + message,"e");
    }

}


SaveDeliveryZone(event, values){
    if(this.state.IsSave) return;
    this.setState({IsSave:true})
    this.setState({ValidateDaysCsv: true})
    let deliveryZone = DeliveryZoneService.DeliveryZone;
    let days = this.state.Days;
    let daysCsv = "";
    days.forEach( currentDay =>{

        if(currentDay.IsChecked)
        {
            daysCsv += currentDay.dayId + "^^^";
        }

    })

    if(daysCsv == "") {
        this.setState({ValidateDaysCsv: false})
        this.setState({IsSave:false})
        return;
    }
        

    deliveryZone.ID = this.state.SelectedZoneID;
    deliveryZone.Name = values.txtZoneName;
    deliveryZone.Radius = this.state.ZoneType === 0 ? values.txtZoneRadius : this.state.Radius;
    deliveryZone.MinimumDeliveryOrder = values.txtZoneMinDelOrder;
    deliveryZone.DeliveryCharges = values.txtZoneDelCharges;
    deliveryZone.DeliveryTime = values.txtZoneDelTime;
    deliveryZone.DaysCSV = Utilities.FormatCsv(daysCsv, Config.Setting.csvSeperator);
    
    let polygonArray = deliveryZone.PolygonLatLongArray;
   
    
    if(polygonArray.length > 0) {

        let polygonLatLong = "POLYGON(("
        //polygonArray.push(polygonArray[0]);
   
    for (var i = 0; i < polygonArray.length; i++) {

        polygonLatLong += polygonArray[i].lng + " " + polygonArray[i].lat+ ","
    }
    
    polygonLatLong = polygonLatLong.substring(0, polygonLatLong.length - 1);
    polygonLatLong += "))"

    deliveryZone.PolygonLatLong = polygonLatLong;
    }
    

    if(deliveryZone.PolygonLatLong === "" || this.state.ZoneType !== 1)
    {
        deliveryZone.PolygonLatLong = this.state.PolygonLatLong;
    }
    //Saving
    if(!this.state.IsUpdate){
      this.SaveDeliveryZoneApi(deliveryZone);
      
      return;

    }
    // updating
      this.UpdateDeliveryZoneApi(deliveryZone);
}

UpdateAreaPolygonsInZone = () => {
    
    if(this.state.IsUpdating) return;
    this.setState({IsUpdating:true});

    var areaPolygonIdsCsv = this.CreateAreaIdCsv()
    var zoneId = this.state.SelectedZoneID;

    this.UpdateAreaPolygonApi(zoneId, areaPolygonIdsCsv);
    
}

CreateAreaIdCsv(){

    var csv = "";
    var selectedAreaPolygons = this.state.SelectedAreaPolygons;
    
    for (var i = 0; i < selectedAreaPolygons.length; i++) {
        
         csv += selectedAreaPolygons[i].Id + Config.Setting.csvSeperator
    }
      return Utilities.FormatCsv(csv,Config.Setting.csvSeperator);
}

//#endregion

AssignValues(e,index){

   // let zones = this.state.DeliveryZones
    let isCheked = e.target.value === "false"? true : false;
    let days = this.state.Days;
    let checkAll = true;
    days[index].IsChecked = isCheked;
    this.setState({Days: days});

    days.forEach(deliveryDay => {
        
        if(!deliveryDay.IsChecked) {
            checkAll = false
        }
    })

    this.setState({CheckAll : checkAll});

}

handelCheckAll(e){

    let isCheked = e.target.value === "false"? true : false;
    let days = this.state.Days;

    this.state.Days.forEach(deliveryDay => {
        deliveryDay.IsChecked = isCheked;
    })
    
    this.setState({Days: days,CheckAll : isCheked});

}

SetOutline(e) {
    this.setState({Outline: !Utilities.stringIsEmpty(e.target.value) ?  Number(e.target.value) : ''})
}


EditZone(index) {


    var deliveryZone = DeliveryZoneService.DeliveryZone;
    var polygonCoord = deliveryZone.PolygonLatLongArray;

    if(polygonCoord !== "") {

    polygonCoord.push(polygonCoord[0]);
    deliveryZone.PolygonLatLongArray = polygonCoord.length > 0 ?  polygonCoord : "";
   
    var isValid = this.ValidatePolygon(polygonCoord);
      if(!isValid) {
        deliveryZone.PolygonLatLongArray = "";
        this.setState({ValidPolygonModal: true})
       return;

      }
    }
    let zones = this.state.DeliveryZones;
        
        if(this.state.Editable && zones[index].ID !== this.state.SelectedShapeId)
        {
            this.setState({HasPolygonEdited: true});
            return;
        }
        let dayCsvObj = zones[index].DayCsv.split(Config.Setting.csvSeperator);
        let CheckAll = true;
        this.state.Days.forEach(deliveryDay => {

            var rowId = "-1";
            for (var i = 0, j = dayCsvObj.length; i < j; i++) {
            if (Number(dayCsvObj[i]) === deliveryDay.dayId) {
                rowId = i;
                break;
            }
        }
      
        if(rowId !== "-1"){
            deliveryDay.IsChecked = true
            
        } else {
            CheckAll = false;
            deliveryDay.IsChecked = false
        }
    })

        this.setState({
             SelectedZoneID: zones[index].ID
            ,Name: zones[index].Name
            ,Radius: zones[index].Radius
            ,MinimumDeliveryOrder: zones[index].MinimumDeliveryOrder
            ,DeliveryCharges: zones[index].DeliveryCharges
            ,DeliveryTime: zones[index].DeliveryTime
            ,Days: this.state.Days
            ,SelectedZone: zones[index]
            ,PolygonLatLong : zones[index].PolygonLatLong
            ,modalAddZone: !this.state.modalAddZone
            ,IsUpdate: true
            ,CheckAll: CheckAll
            ,HasPolygonEdited: false
            
        });
    }

    addZoneModaltoggle(){
    // this.setState({ShowMapLoader:true});
    if(this.state.modalAddZone)
    {
        // this.GetEnterpriseZones();

    }
    let newZoneName = "Zone 1";

    let totalZones = Config.Setting.zoneLimit;

    if (this.state.ZonesExist) {
        for (var i = 0; i < totalZones; i++) {
            var zoneName = "Zone " + (i + 1);
            var zone = this.state.DeliveryZones.filter((zone) => {
                return zone.Name === zoneName;
              })
            if (zone.length < 1) {
                newZoneName = zoneName;
                break;
            }
        }
    }
    


    this.state.Days.forEach(day => {
        day.IsChecked = false;
    })

        this.setState({
            SelectedZoneID: 0
           ,Name: newZoneName
           ,Radius: 0
           ,MinimumDeliveryOrder: ""
           ,DeliveryCharges: ""
           ,DeliveryTime: ""
           ,SelectedZone: ""
           ,modalAddZone: !this.state.modalAddZone
           ,IsUpdate: false
           ,CheckAll: false
           ,AddNewZone: false

       });




    }

    deleteZoneModaltoggle(id) {
        // this.setState({
        //     modalDeleteZone: !this.state.modalDeleteZone,
        // });
    }

    static defaultProps = {
        center: {
            lat: 59.95,
            lng: 30.33
        },
        zoom: 12
    };

        
componentDidMount() {

    this.GetAreaPolygon();
     this.GetEnterpriseZones();
     this.GetEnterprisePrimaryAddress();
}  
    

GetAreaName(areaIdCsv){
    var csv = "";
    var globelAreaPolygons = this.state.AreaPolygons;
    var index = "-1"
    var areaIdArray = Utilities.stringIsEmpty(areaIdCsv) ? [] : areaIdCsv.split(Config.Setting.csvSeperator);

    for (var i = 0; i < areaIdArray.length; i++) {
        index = Utilities.GetObjectArrId(areaIdArray[i],globelAreaPolygons)
       
        if(index !== "-1") {
            csv += globelAreaPolygons[index].Name + ", "
        }
    }

      return Utilities.FormatCsv(csv,", ");
    
}


LoadZoneHtml(zone,index){


let zoneIndex = zone.Name.split(' ')[1]


return (
    <div className="relative zone-wrap-now" key={index}>
           <span className="accordian-zone-wrap"> 
                <span onClick = {() => this.DeleteZoneConfirmation(zone.Name,zone.ID)} className="delete-zone">
                <i className="fa fa-trash"></i>
                <span>Delete</span>
                </span>
                <span onClick={(e) => this.EditZone(index)} style={{ marginRight: 0 }} className="edit-zone ">
               
                <i className="fa fa-edit" ></i>
                <span>Edit</span>
                </span>
            </span>
    <Collapsible
    trigger={
        <div onClick={(e) => this.onPolygonSelection(index,true)}  className={collapsibleClass[zoneIndex-1]}>
            <span className="mainheading">
                <p>
                    <i className="fa fa-chevron-right iconCollap"></i>
                </p> {zone.Name}
            </span>
         
        </div>
        }
    triggerWhenOpen={
        <div onClick={(e) => this.onPolygonSelection(index,false)}  className={collapsibleClass[Number(zoneIndex-1)]}>
            <span className="mainheading">
                <p>
                    <i className="fa fa-chevron-down iconCollap"></i>
                </p>{zone.Name}
                </span>
               
        </div>
        }
>
    <ul className="collapsibleList">
        
        { this.state.ZoneType === 0 ?
        <li>
            <p>Radius</p>
            <p>{zone.Radius} {Config.Setting.distanceUnit}</p>
        </li> : "" }

        <li>
            <p>Minimum order for delivery</p>
            <p> {this.state.currencySymbol + " " + zone.MinimumDeliveryOrder}</p>
        </li>
        <li>
            <p>Delivery charges</p>
            <p>{this.state.currencySymbol + " " +zone.DeliveryCharges}</p>
        </li>
        <li>
            <p>Delivery time</p>
            <p>{zone.DeliveryTime} mins</p>
        </li>
        <li>
            <p style={{ width: '170px' }}>Active days</p>
            <div className="deliveryDaysMainDiv ">
                <span style={{ textAlign: 'right' }}>{zone.DayShortNameCSV}</span>
            </div>
    
        </li>
        {this.state.ZoneType === 2 ? 
        <li>
        <p style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>Delivery Areas 
        {this.state.ZoneType === 2 ? 
           
       <span onClick = {() => this.EditAreaPolygon(zone.Name,zone.ID,zone.AreaPolygonIdsCsv)}>
       <span className="m-b-0 statusChangeLink d-flex" style={{alignItems:'center'}}>
       <i className="fa fa-edit font-16 m-r-5"></i>
           Edit
           </span>
       </span>

: ""
  }
        </p>
            <div className="deliveryDaysMainDiv ">
                <span>{this.GetAreaName(zone.AreaPolygonIdsCsv)}</span>
            </div>
        </li>
: ""}

       

    </ul>
</Collapsible>
</div>

)

}

SetZoneType(type) {
    this.setState({ZoneType: type,AddNewZone: false});
}

handleUpdateButton = () => {

    var zoneId = this.state.SelectedShapeId;
    var zones = this.state.DeliveryZones;
    for (var i = 0; i < zones.length; i++) {
    
        if(zones[i].ID == zoneId)
        {
            this.EditZone(i)
        }
    }

    // Code for direct polygon update
    // let deliveryZone = DeliveryZoneService.DeliveryZone;
    // let zones = this.state.DeliveryZones;
    // for (var i = 0; i < zones.length; i++) {
    
    //     if(zones[i].ID == this.state.SelectedShapeId)
    //     {
    //         deliveryZone.ID = zones[i].ID;
    //         deliveryZone.Name = zones[i].Name;
    //         deliveryZone.Radius = 0;//values.txtZoneRadius;
    //         deliveryZone.MinimumDeliveryOrder =zones[i].MinimumDeliveryOrder;
    //         deliveryZone.DeliveryCharges = zones[i].DeliveryCharges;
    //         deliveryZone.DeliveryTime = zones[i].DeliveryTime;
    //         deliveryZone.DaysCSV = zones[i].DayCsv;
           
    //         // updating
    //           this.UpdateDeliveryZoneApi(deliveryZone);
    //     }
    // }

}

onPoygonEdit = (id,hasEdited) => {

    if(id > 0){
     this.state.SelectedShapeId = id;
    }
    this.setState({Editable: hasEdited, HasPolygonEdited: false})
    var zones = this.state.DeliveryZones;
    for (var i = 0; i < zones.length; i++) {
    
        if(zones[i].ID == id)
        {
            this.setState({SelectedZoneName : zones[i].Name});
        }
    }

}

OnLocationChange= (lat,lng) => {
    
    var primaryEnterpriseAddress = this.state.PrimaryEnterpriseAddress
    primaryEnterpriseAddress.Latitude = lat;
    primaryEnterpriseAddress.Longitude = lng;
    this.setState({PrimaryEnterpriseAddress : primaryEnterpriseAddress});
  }

  GetSelectedAreaPolygons(areaPolygonIdsCsv){

    var areaPolygonArray = [];
    var globelAreaPolygons = this.state.AreaPolygons;
    var index = "-1"
    var areaIdArray = Utilities.stringIsEmpty(areaPolygonIdsCsv) ? [] : areaPolygonIdsCsv.split(Config.Setting.csvSeperator);

    for (var i = 0; i < areaIdArray.length; i++) {
        index = Utilities.GetObjectArrId(areaIdArray[i],globelAreaPolygons)
       
        if(index !== "-1") {
        
            let polygonLatLong = []

            let coordsLatLong = globelAreaPolygons[index].PolygonLatLong !== "" ? globelAreaPolygons[index].PolygonLatLong.split(",") : [];
            for (var p = 0; p < coordsLatLong.length-1; p++) {
              polygonLatLong[p] = {lat: Number(coordsLatLong[p].split(" ")[1]) , lng: Number(coordsLatLong[p].split(" ")[0])}
          }
        
            areaPolygonArray.push(polygonLatLong);
        }
    }

      return areaPolygonArray;

  }


RenderMap(PrimaryEnterpriseAddress) {

    if(this.state.ShowMapLoader)
    {
        return (
            <div className="loader-menu-inner zoneloader"> 
    <Loader type="Oval" color="#ed0000" height={50} width={50}/>
    <div className="loading-label">Loading.....</div>
    </div>
        )
    }
    
    var zones = this.state.DeliveryZones;

    zones = zones.sort(function (x, y) {
        return x.Radius === y.Radius ? 0 : (x.Radius < y.Radius ? 1 : -1);
    });


    let mapData = [];
   
    let strokeColors = GlobalData.restaurants_data.Supermeal_dev.Delivery_Zone_Color_Palette;
    let strokeOpacity = 1;
    
    for (var i = 0; i < zones.length; i++) {

    strokeOpacity =   strokeOpacity - 0.1
    let zoneIndex = zones[i].Name.split(' ')[1]

 

    let zoneAreaPolygons = this.state.ZoneType === 2 ? this.GetSelectedAreaPolygons(zones[i].AreaPolygonIdsCsv) : [];
    

     mapData[i] = {id: zones[i].ID , editable: false, index: i};

      let polygonLatLong = []
      let coordsLatLong = zones[i].PolygonLatLong !== "" ? zones[i].PolygonLatLong.split("((")[1].replace("))","").split(",") : [];
      for (var p = 0; p < coordsLatLong.length-1; p++) {
        polygonLatLong[p] = {lat: Number(coordsLatLong[p].split(" ")[1]), lng: Number(coordsLatLong[p].split(" ")[0])}
	}

    var areaPolygonWithOptions = [];
    for (var j = 0; j < zoneAreaPolygons.length; j++) {
        areaPolygonWithOptions[j] = {coords: zoneAreaPolygons[j],
            options: {
                strokeColor: strokeColors[Number(zoneIndex-1)],
                strokeOpacity: 0.2,
                strokeWeight: 5,
                fillColor: strokeColors[Number(zoneIndex-1)],
                fillOpacity: 0.4
              },
              id: zones[i].ID,
              editable: false, 
              index: i
        }
    }
    



    // Data for Circle
    mapData[i].circle = {
        radius: zones[i].Radius *  (Config.Setting.distanceUnit === 'miles' ? 1609.34 : 1000),
        options: {
          strokeColor: strokeColors[Number(zoneIndex-1)],
          strokeOpacity: 0.2,
          strokeWeight: 5,
          fillColor: strokeColors[Number(zoneIndex-1)],
          fillOpacity: 0.4
        }
      }

      // Data for Polygon
      mapData[i].polygon = {
        coords: polygonLatLong,
        path: polygonLatLong,
        areaPolygon: areaPolygonWithOptions,
        options: {
          strokeColor: strokeColors[Number(zoneIndex-1)],
          strokeOpacity: 0.2,
          strokeWeight: 5,
          fillColor: strokeColors[Number(zoneIndex-1)],
          fillOpacity: 0.4
        }
      }

    //   mapData[i].areaPolygon = areaPolygonWithOptions
    }

    zones.sort(Utilities.SortByName);
    // this.setState({MapData: mapData});
    
    for(var j= 0; j < mapData.length; j++) {
        
        if(mapData[j].id === this.state.SelectedPolygonId) {

            mapData[j].editable = true;
            mapData[j].zIndex = 100;
            
            if(this.state.ZoneType === 2) {
                for (var k = 0; k < mapData[j].polygon.areaPolygon.length; k++) {
                        mapData[j].polygon.areaPolygon[k].options.strokeOpacity = 0.5
                 }
            } else if(this.state.ZoneType === 0) {

                mapData[j].circle.options.strokeOpacity = 0.5;

            } else if(this.state.ZoneType === 1) {

                mapData[j].polygon.options.strokeOpacity = 0.5;

            }


        }

    }
    this.state.MapData = mapData ;

    let fitToCoordinates = []
    if (this.state.ZoneType == 2) {
        if (mapData.length > 0) {
            for (let index = 0; index < mapData.length; index++) {
                    for (let x = 0; x < mapData[index].polygon.areaPolygon.length; x++) {
                        for (let z = 0; z < mapData[index].polygon.areaPolygon[x].coords.length; z++) {
                            fitToCoordinates.push(mapData[index].polygon.areaPolygon[x].coords[z])
                        }
                    }
            }

        }
    }else if(this.state.ZoneType == 1){
        if (mapData.length > 0) {
            for (let index = 0; index < mapData.length; index++) {
                        for (let z = 0; z < mapData[index].polygon.coords.length; z++) {
                            fitToCoordinates.push(mapData[index].polygon.coords[z])
                        }
            }
        }
    }

    return (
    <Map
    center={{ lat: PrimaryEnterpriseAddress.Latitude == undefined ? this.state.defaultLocation[0] : Number(PrimaryEnterpriseAddress.Latitude), lng: PrimaryEnterpriseAddress.Longitude == undefined ? this.state.defaultLocation[1] : Number(PrimaryEnterpriseAddress.Longitude) }}
    zoom={12}
    limit={Config.Setting.zoneLimit}
    places={mapData}
    allPlaces={mapData}
    polygonId= {this.state.SelectedPolygonId}
    addNewZone = {this.state.AddNewZone}
    hasPolygonEdited = {this.state.HasPolygonEdited}
    zoneType= {this.state.ZoneType}
    outline = {this.state.Outline}
    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${Config.Setting.googleApi}&libraries=geometry,drawing,places`}
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: height - 180 }} />}
    mapElement={<div style={{ height: `100%` }} />}
    polygonSelected = {this.state.PolygonSelected}
    onPolygonComplete={this.onPolygonComplete}
    // onLocationChange={this.OnLocationChange}
    onEdit = {this.onPoygonEdit} 
    onPolygonSwitch = {this.handleUpdateButton}
    onPolygonSwitchConfirmation = {this.EditZone}
    onPolygonSelect =  {this.onPolygonSelection}
    fitToCoords= {fitToCoordinates}
    //zoneType={this.state.ZoneType}
    />

)
}

onPolygonSelection(index,isSelected) {

    let zones = this.state.DeliveryZones;
        
    if(index !== -1) {
    

      if(this.state.Editable && zones[index].ID !== this.state.SelectedShapeId)
    {
        this.setState({HasPolygonEdited: true});
        this.state.SelectedPolygonId = zones[index].ID;
        return;
    }
    
    
    let mapData = this.state.MapData;
    
    mapData.forEach(zoneData => {
        zoneData.editable = zoneData.index == index && isSelected;
    });

    mapData.sort(function(a,b){return !b.editable && a.editable}); 
    this.setState({MapData : mapData, SelectedPolygonId: zones[index].ID !== this.state.SelectedPolygonId && isSelected ? zones[index].ID : zones[index].ID === this.state.SelectedPolygonId? 0 : this.state.SelectedPolygonId} )   
    }
    this.setState({PolygonSelected: isSelected || index >=0 }) 
    
}
RenderZones(zones){

    var htmlZones = [];
   

    for (var i = 0; i < zones.length; i++) {

        htmlZones.push(this.LoadZoneHtml(zones[i],i));
            
	}

    return(

        <div>{htmlZones.map((zoneHtml) => zoneHtml)}</div>

    )
}

onPolygonLoad = polygon => {

     polygon.addListener("click", function(e) {
        this.setEditable(true)
    });
}


ValidatePolygon(polygonLatLongArray){
    var coordinates = this.Geo2JST(polygonLatLongArray);  
    var geometryFactory = new jsts.geom.GeometryFactory();
    var shell = geometryFactory.createLinearRing(coordinates);
    var jstsPolygon = geometryFactory.createPolygon(shell);
    var validator = new jsts.operation.IsSimpleOp(jstsPolygon);

    return validator.isSimpleLinearGeometry(jstsPolygon)
}


Geo2JST(boundaries){

        var coordinates = [];
        for (var i = 0; i < boundaries.length; i++) {
          coordinates.push(new jsts.geom.Coordinate(
              boundaries[i].lng, boundaries[i].lat));
        }
        
        return coordinates;
      }

// onPolygonComplete = (polygon,allPloygons) => {
onPolygonComplete = (polygon) => {
    
    const polygonLatLongArray = polygon.getPath().getArray().map(latLng => {
        
        return { lat: latLng.lat(),  lng: latLng.lng()};
    });

    polygonLatLongArray.push(polygonLatLongArray[0]);

    let deliveryZone = DeliveryZoneService.DeliveryZone;
    deliveryZone.PolygonLatLongArray = polygonLatLongArray.length > 0 ?  polygonLatLongArray : "";
   

    var isValid = this.ValidatePolygon(polygonLatLongArray);
      if(isValid) {
       
          this.addZoneModaltoggle();
      }
      else  {
        deliveryZone.PolygonLatLongArray = "";
        this.setState({ValidPolygonModal: true})
       

      }
  };

  Addnew(){
    
    if(this.state.ZoneType === 1)
        this.setState({AddNewZone: !this.state.AddNewZone})
    // Map.DrawingManager.setMap(null);
    else 
        this.addZoneModaltoggle();
  } 

  handleCancelUpdate(){

        
        if(this.state.Editable)
        {
            this.setState({HasPolygonEdited: true});
            return;
        }

  }


  EditAreaPolygon(name,id,polygonIdCsv){

    
    this.setState({SelectedZoneID: id, SelectedZoneName: name, modalEditAreaPolygon: true, UnSelectedAreaPolygons: []})
    var selectedIds = polygonIdCsv.split(Config.Setting.csvSeperator)
    var areaPolygons = this.state.AreaPolygons;
    var selectedAreaPolygon = [];

    for (var i=0; i < selectedIds.length; i++) { 
        
        var index = Utilities.GetObjectArrId(selectedIds[i],areaPolygons);

        if(index !== '-1'){
            selectedAreaPolygon.push(areaPolygons[index]);
        }
    }

    var selectedCityName = selectedAreaPolygon.length > 0 ? selectedAreaPolygon[0].City : this.state.AreaPolygons[0].City;

    var filteredData = this.state.AreaPolygons.filter((g) => {
        return g.City == selectedCityName;
       });


      this.setState({SelectedAreaPolygons: selectedAreaPolygon, FilterAreaPolygons: filteredData, SelectedCityName: selectedCityName})
  }

  SearchAreaPolygon(e){
    let searchText = e.target.value;
    let filteredData = []

    this.setState({SearchAreaPolygonsText : searchText});
   if(searchText.toString().trim() === ''){
        // this.setState({FilterAreaPolygons: this.state.AreaPolygons, IsSearchingItem: false});

        filteredData = this.state.AreaPolygons.filter((g) => {
         return g.City == this.state.SelectedCityName;
        });

        this.setState({FilterAreaPolygons: filteredData,IsSearchingItem: false});
        return;
   }
  
   filteredData = this.state.AreaPolygons.filter((g) => {
      
      let arr = searchText.toUpperCase().trim();
      let isExists = false;
        
            if (g.Name.toUpperCase().indexOf(arr) !== -1 && g.City == this.state.SelectedCityName) {
                isExists = true;
      }
      
      return isExists
    })

    this.setState({FilterAreaPolygons: filteredData, IsSearchingItem: true});
}


HandleChangeCity(e){
    let selectedValue = e.target.value;
    //this.setState({SelectedCityId : selectedValue})

    let index = Utilities.GetObjectArrId(selectedValue,this.state.AreaPolygons)
    let selectedCityName =  selectedValue; //this.state.AreaPolygons[index].City;
    let filteredData = []
  
   filteredData = this.state.AreaPolygons.filter((g) => {

        return g.City === selectedCityName
   });

   this.setState({FilterAreaPolygons: filteredData, SelectedCityName: selectedCityName});

}

 CityHtml(id,cityName){

    return(<option key={id} value={cityName}>{cityName}</option>);
 }

 RenderCityDropDown(areaPolygons){

    var cityCsv ="";
    var html = [];

  for (var p=0;p <= areaPolygons.length -1;p++){

    var cityName = areaPolygons[p].City;
    if(cityName === null) continue;
    var cityNameWithoutSpaces =  areaPolygons[p].City.trim().replace(/ /g,'-').toUpperCase();
    if (!Utilities.isExistInCsv(cityNameWithoutSpaces, cityCsv, Config.Setting.csvSeperator))
    {
        html.push(this.CityHtml(areaPolygons[p].Id,cityName) )
        cityCsv += cityNameWithoutSpaces + Config.Setting.csvSeperator;
    }
  }

  return(
    
      <select className="form-control custom-select" value={this.state.SelectedCityName}  onChange={(e) => this.HandleChangeCity(e)}>
        {html.map((htmlCity) => htmlCity)}
      </select>
    
  )

}

  AreaPolygonModal() {
    this.setState({modalEditAreaPolygon: !this.state.modalEditAreaPolygon, FilterAreaPolygons: this.state.AreaPolygons,SearchAreaPolygonsText: "",IsSearchingItem: false, SelectedAreaPolygons: [], UnSelectedAreaPolygons: []})
}

  RenderAreaPolygonList(globalAreaPolygons,itemFound,exists){

    return(
        <tr className={exists && !itemFound ? "disabled" : ""}  key={globalAreaPolygons.Id}>
                                {exists && !itemFound ? 
                                 <td>
                                 <AvField disabled type="checkbox" className="form-checkbox" name={String(globalAreaPolygons.Id)} value={itemFound} checked={itemFound} />
                                 
                             </td>
                            : 
                            <td>
                            <AvField type="checkbox" className="form-checkbox" name={String(globalAreaPolygons.Id)} value={itemFound} checked={itemFound} onChange={(e) => this.handleCheckbox(e,globalAreaPolygons.Id,exists)} />
                        </td> 
                             }
                             <td>{Utilities.SpecialCharacterDecode(globalAreaPolygons.Name)}</td>
                                </tr>
    )
    
    }
    
    
    LoadAreaPolygonList(areaPolygons){
    
        var htmlActive = [];
        var globalAreaPolygons = this.state.FilterAreaPolygons;
        var selectedAreaCsv = this.state.SelectedAreaCSV;
        var unSelectedAreaPolygon = this.state.UnSelectedAreaPolygons;
        if(areaPolygons === 0){
          return <div></div>
        }
    
      for (var i=0; i < globalAreaPolygons.length; i++){

        var id = parseInt(globalAreaPolygons[i].Id);
        var exists = Utilities.GetObjectArrId(id,unSelectedAreaPolygon) === "-1" && Utilities.isExistInCsv(id, selectedAreaCsv+Config.Setting.csvSeperator , Config.Setting.csvSeperator);
        var itemFound = Utilities.GetObjectArrId(id,areaPolygons) !== "-1";
        // if ((!exist) || itemFound)
        // {
            htmlActive.push(this.RenderAreaPolygonList(globalAreaPolygons[i],itemFound,exists));
        // } 
     }
    
      return(
    
        <tbody>{htmlActive.map((item) => item)}</tbody>
    
       )
    
    }

    handleCheckbox(e,id,exists){

        // if(exists) return;
        let checked = e.target.checked;
        let selectedAreaPolygon = this.state.SelectedAreaPolygons;
        let unSelectedAreaPolygon = this.state.UnSelectedAreaPolygons;
        let globelAreaPolygons = this.state.FilterAreaPolygons;
        let index = Utilities.GetObjectArrId(id,globelAreaPolygons)
        let itemFound = Utilities.GetObjectArrId(id,selectedAreaPolygon) !== -1;
        if(checked){
            if(itemFound)
            selectedAreaPolygon.push(globelAreaPolygons[index]);
            
        } else {
            index = Utilities.GetObjectArrId(id,selectedAreaPolygon)
            unSelectedAreaPolygon.push(selectedAreaPolygon[index]);
            selectedAreaPolygon.splice(index, 1);
        }
        
        this.setState({SelectedAreaPolygons: selectedAreaPolygon, UnSelectedAreaPolygon: unSelectedAreaPolygon});
    
    }
    CancelAreaPolygonSearch(){
    
		this.setState({ 
		
			FilterAreaPolygons: this.state.AreaPolygons, 
			SearchAreaPolygonsText: "",
			IsSearchingItem: false
		});
	
      }
      
      RemoveSelectedAreaPolygon(id){

        let selectedAreaPolygon = this.state.SelectedAreaPolygons
        let index =  Utilities.GetObjectArrId(id,selectedAreaPolygon);
        selectedAreaPolygon.splice(index, 1); 
        this.setState({SelectedAreaPolygons: selectedAreaPolygon});
          
    }

    SelectedAreaPolygonHtml(area) {

        return (
          // <span>{dietary.Id}</span>
          <a className="m-t-10 m-b-0" >{area.Name}<span onClick={() => this.RemoveSelectedAreaPolygon(area.Id)}><i className="fa fa-times"></i></span></a>
          
        )
    
       }
    
      RenderSelectedAreaPolygon(areaPolygon){
    
      let html = [];
    
      if(areaPolygon.length === 0) {
        return;
      }
      for (var i=0; i < areaPolygon.length;i++){
        html.push(this.SelectedAreaPolygonHtml(areaPolygon[i]));
      }
    
      return(       
            <div className="dietary-wrap">{html.map((polygon) => polygon)} </div>
      )
    
    }



  GenerateAreaPolygonModel(){
	
       if(!this.state.modalEditAreaPolygon){
            return('')
        }
        
        return(
                    <Modal isOpen={this.state.modalEditAreaPolygon} toggle={() => this.AreaPolygonModal()} className="modal-md table-set-modal ">
                    <ModalHeader toggle={() => this.AreaPolygonModal()}>{"Edit Areas for " + this.state.SelectedZoneName}</ModalHeader>
                    <ModalBody className="padding-0">
                        <AvForm onValidSubmit={this.UpdateAreaPolygonsInZone}>
                        <div className="padding-20">
                            <div className="name-field form-group">
                            {/* <AvField errorMessage="This is a required field" name="addAddonGroupName" type="text" className="form-control" required  />
                                <span>Category Name</span> */}
                            {this.RenderCityDropDown(this.state.AreaPolygons)}
                            <span>City</span>
                            </div>
                               
                            <div>
                                <FormGroup className=" set-price-field">
                                     {this.RenderSelectedAreaPolygon(this.state.SelectedAreaPolygons)}
                                 </FormGroup>
                                </div>
                            <div className=" m-t-20 m-b-20" style={{ position: 'relative', float: 'left', width: '100%' }}>

                        

                            <input type="text" className="form-control common-serch-field" placeholder="Search List" style={{ paddingleft: '30px' }} value={this.state.SearchAreaPolygonsText} onChange={(e) => this.SearchAreaPolygon(e)}/>
                                <i className="fa fa-search" aria-hidden="true" style={{ position: 'absolute', top: '11px', left: '12px', color: '#777' }}></i>
                            {this.state.IsSearchingItem ? <span onClick={() => this.CancelAreaPolygonSearch()}><i className="fa fa-times" style={{ position: 'absolute', top: '11px', color: '#777', right: '15px' }}></i></span> : ""}
                            </div>
                        <div className="inner-table-scroll">
                            <Table>
                                <thead>
                                    <tr>
                                        <th style={{width:"70px"}}></th>
                                        <th>Name</th>
                                    </tr>
                                </thead>
                                    {this.LoadAreaPolygonList(this.state.SelectedAreaPolygons)}
                            </Table>
                            </div>
                            </div>
                        <div className="modal-footer">
                                
                                <Button color="secondary" onClick={() => this.AreaPolygonModal()}>Cancel</Button>
                                <Button color="primary" className="btn waves-effect waves-light btn-primary pull-right" style={{width:'78px'}}>
                              
                              {this.state.IsUpdating ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                                : <span className="comment-text">Update</span>}
                              </Button>


                            </div>
                        </AvForm>
                    </ModalBody>
                </Modal>)
     }

    render() {

        if(this.state.ShowLoader){
            return this.loading();
        }

        const { PrimaryEnterpriseAddress } = this.state;

        return (
            <div className="deliveryZoneWrap">
                 <div className=" card-new-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> 
                        <h3 className=" card-title">Delivery Zones</h3>
                        {this.state.IsZoneLimited && this.state.ZoneType !== -1 && this.state.ZoneType !== 1 ? 
                        // {this.state.IsZoneLimited? 
                             <Button outline onClick={() => this.Addnew()} className=" btn btn-primary "> {this.state.AddNewZone? '' : <i className="fa fa-plus" aria-hidden="true"></i>} {this.state.ZonesExist ? (this.state.AddNewZone? " X Cancel new zone" : "Add another zone") : (this.state.AddNewZone? "X Cancel new zone" : "Add zone")}</Button>
                             : ""
                              }
                </div>
                <div>
               
               { this.state.IsSupermealDelivery ?  <div className="alert-info"><i className="fa fa-info-circle m-r-10" aria-hidden="true" ></i>Superbutler is doing delivery for this restaurant</div> : '' }
     
   {this.state.ZoneType !== -1 || this.state.ZonesExist ? "" :
     <div>
 <h5 className="m-b-5" style={{paddingLeft:'10px'}}>How would you set Zones for this Business?</h5>
<div className="zone-two-btn"> 
<section>
<div>
<input type="radio" id="radius" name="areaType" value="radius" checked={this.state.ZoneType === 0} onClick={() => this.SetZoneType(0)}/>
  <label htmlFor="radius">
<img src={radius} alt="radius"/>
  <h3>Radius</h3>
    <p>Ideal for Businesses which are located in center of the city.</p>
  </label>
</div>
<div>
<input type="radio" id="polygon" name="areaType" value="polygon" checked={this.state.ZoneType === 1} onClick={() => this.SetZoneType(1)}/>
  <label htmlFor="polygon">
  <img src={polycon} alt="radius"/>
  <h3>Custom Polygon</h3>
    <p>Ideal for Businesses which are located near Motorways, or Island, or Rivers etc</p>
  </label>
</div>

<div>
<input type="radio" id="areaPolygon" name="areaType" value="areaPolygon" checked={this.state.ZoneType === 2} onClick={() => this.SetZoneType(2)}/>
  <label htmlFor="areaPolygon">
  <img src={polycon} alt="radius"/>
  <h3>Area Polygon</h3>
    <p>Ideal for restaurants which are located near Motorways, or Island, or Rivers etc</p>
  </label>
</div>
</section>
</div>
</div>
    }
    
                    <div className="mapAddZoneMainDiv">
                    {!this.state.ShowMapLoader || this.state.ZonesExist ?  <div className="mapDiv" >
                          <div className="zone-map-wrap">
                   
                      {this.state.IsZoneLimited && this.state.ZoneType === 1 ?
                                <Button  onClick={() => this.Addnew()} className={this.state.AddNewZone?" ":"new-btn-zone btn btn-primary-plus "}>{this.state.AddNewZone? "Cancel Drawing" : "Draw Polygon"}</Button>
                                : ""
                      }  

                       
                       {this.state.ZoneType === 1 && this.state.ZonesExist ?   <input type="number" id="txtOutline" placeholder=" Draw outline" value={this.state.Outline} onChange={(e)=> this.SetOutline(e)}/> : ""}
                          
                          {this.state.Editable ?
                          
                          <div><Button color="primary" className="btn waves-effect waves-light btn-primary pull-right new-btn-update "  onClick={() => this.handleUpdateButton()}> {"Update " + this.state.SelectedZoneName}</Button> <div className="btn btn-secondary" onClick={() => this.handleCancelUpdate()}>Cancel</div></div> : ''}
                          
                                        </div> 
                          {this.state.ZoneType !== -1 || this.state.ZonesExist ?  this.RenderMap(this.state.PrimaryEnterpriseAddress[0]) : ""}

                        </div> :''
                  
    }
                        <div className="addZoneDiv" >


                            {this.RenderZones(this.state.DeliveryZones)}


                        </div>
                        
                        <Modal isOpen={this.state.modalAddZone} toggle={this.addZoneModaltoggle}  id="deliveryZoneNew">
                        <AvForm onValidSubmit={this.SaveDeliveryZone}>
                            <ModalHeader toggle={this.addZoneModaltoggle}>Add another zone</ModalHeader>
                            <ModalBody>
                            
                                <div className="row" >
                                    <div className="col-md-6">
                                        <label className="control-label font-weight-500">Zone Name</label>
                                        <div className="input-group mb-3 form-group">
                                            {/* <input type="text" className="form-control" style={{borderRadius:'3px'}} required data-error="This field is required" /> */}
                                            <AvField name="txtZoneName" value={this.state.Name} type="text" disabled className="form-control" 
                                             validate={{
                                                required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                                                
                                                }} 
                                            
                                            /> 
                                            <div className="input-group-append">
                                                {/* <span className="input-group-text form-control borderRightRadius">%</span> */}
                                            </div>
                                            <div className="help-block with-errors"></div>
                                        </div>
                                    </div>
                                    {/* <div className="col-md-6">
                                        <label className="control-label font-weight-500">Radius</label>
                                        <div className="input-group mb-3 form-group">
                                            <AvField name="txtZoneRadius" value={this.state.Radius} type="text" className="form-control" 
                                            validate={{
                                                required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                                                tel: {pattern: '^[0-9]'},
                                                }} 
                                            /> 
                                            <div className="input-group-append">
                                                <span className="input-group-text form-control borderRightRadius">{Config.Setting.distanceUnit}</span>
                                            </div>
                                            <div className="help-block with-errors"></div>
                                        </div>
                                    </div> */}

                                     <div className="col-md-6">
                                        <label className="control-label font-weight-500">Minimum order for delivery</label>
                                        <div className="input-group m-b-10 form-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text form-control" id="basic-addon1">{this.state.currencySymbol}</span>
                                            </div>
                                            {/* <input className="form-control form-control-left validatedField flexBasisValidation borderRightRadius"></input> */}
                                            <AvField name="txtZoneMinDelOrder" value={this.state.MinimumDeliveryOrder} type="text" className="form-control" required errorMessage="This is a required field" 
                                            validate={{
                                                required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                                                myValidation: PriceValidation
                                                // tel: {pattern: '^[0-9]+(\.[0-9]{1,2})?$', errorMessage: 'Invalid input '},
                                                }} 
                                            
                                            /> 
                                            <div className="help-block with-errors"></div>
                                        </div>
                                    </div>


                                </div>
                                <div className="row" >
                                   
                                    <div className="col-md-6">
                                        <label className="control-label font-weight-500">Delivery charges</label>
                                        <div className="input-group m-b-10 form-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text form-control" id="basic-addon1">{this.state.currencySymbol}</span>
                                            </div>
                                            {/* <input className="form-control form-control-left borderRightRadius" /> */}
                                            <AvField name="txtZoneDelCharges" value={this.state.DeliveryCharges} type="text" className="form-control" required errorMessage="This is a required field"
                                            validate={{
                                                required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                                                myValidation: PriceValidation
                                                // tel: {pattern: '^[0-9]+(\.[0-9]{1,2})?$', errorMessage: 'Invalid input '},
                                                }} 
                                            
                                            /> 
                                            <div className="help-block with-errors"></div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="control-label font-weight-500">Delivery time</label>
                                        <div className="input-group mb-3 form-group">
                                            {/* <input type="tel" className="form-control form-control-right"  required data-error="This field is required" /> */}
                                            <AvField name="txtZoneDelTime" value={this.state.DeliveryTime} type="number" className="form-control" required errorMessage="This is a required field"
                                            validate={{
                                                required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                                                tel: {pattern: '^[0-9]+(\.[0-9]{0,0})?$', errorMessage: 'Invalid input '},
                                                }} 
                                            /> 
                                            <div className="input-group-append">
                                                <span className="input-group-text form-control borderRightRadius">min(s)</span>
                                            </div>
                                            <div className="help-block with-errors"></div>
                                        </div>
                                    </div>
                                </div>                                
                                
                               { this.state.ZoneType === 0 ? <div className="row" >
                                    <div className="col-md-6">
                                        <label className="control-label font-weight-500">Radius</label>
                                        <div className="input-group mb-3 form-group">
                                            <AvField name="txtZoneRadius" value={this.state.Radius} type="text" className="form-control" 
                                            validate={{
                                                required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                                                tel: {pattern: '^[0-9]'},
                                                }} 
                                            /> 
                                            <div className="input-group-append">
                                                <span className="input-group-text form-control borderRightRadius">{Config.Setting.distanceUnit}</span>
                                            </div>
                                            <div className="help-block with-errors"></div>
                                        </div>
                                    </div>
                                </div> : ""}
                                <div className="row" >
                                    
                                </div>
                                {/* <AvCheckboxGroup inline name="chkDays"> */}
                                <div className="row" >
                                    <div className="col-md-12">
                                        <span className="control-label font-weight-500">Delivery days</span>
                                        <div className="input-group mb-3 form-group">

                                                <div className="col-xs-12 col-sm-3  checkDiv setting-cus-field" style={{    padding: '0px',marginTop: '5px'}}>
                                                 <input type="checkbox"  id="All Days" onChange={(e) => this.handelCheckAll(e)}  name="All Days" className="form-checkbox" value={this.state.CheckAll}  checked={this.state.CheckAll}/>
                                                 <Label htmlFor="All Days" className="modal-label-head">All Days</Label>
                                                </div>

                                            <div className="row col-xs-12 setting-cus-field m-t-15" >

                                                <div className="col-xs-12 col-sm-4 m-b-10 checkDiv">
                                                 <input type="checkbox" id={this.state.Days[0].dayName}  onChange={(e) => this.AssignValues(e,0)}  name={this.state.Days[0].dayName} className="form-checkbox" value={this.state.Days[0].IsChecked} checked={this.state.Days[0].IsChecked} />
                                                 <Label htmlFor={this.state.Days[0].dayName} className="modal-label-head">{this.state.Days[0].dayName}</Label>
                                                </div>
                                              
                                                <div className="col-xs-12 col-sm-4 m-b-10 checkDiv">
                                                <input type="checkbox" id={this.state.Days[1].dayName} onChange={(e) => this.AssignValues(e,1)} name={this.state.Days[1].dayName} className="form-checkbox"  value={this.state.Days[1].IsChecked} checked={this.state.Days[1].IsChecked}  />
                                                <Label htmlFor={this.state.Days[1].dayName} className="modal-label-head">{this.state.Days[1].dayName}</Label>
                                                </div>
                                                
                                                <div className="col-xs-12 col-sm-4 m-b-10 checkDiv">
                                                <input type="checkbox" id={this.state.Days[2].dayName} onChange={(e) => this.AssignValues(e,2)} name={this.state.Days[2].dayName} className="form-checkbox" value={this.state.Days[2].IsChecked} checked={this.state.Days[2].IsChecked} />
                                                <Label htmlFor={this.state.Days[2].dayName} className="modal-label-head">{this.state.Days[2].dayName}</Label>
                                                </div>
                                                
                                                <div className="col-xs-12 col-sm-4 m-b-10 checkDiv">
                                                <input type="checkbox" id={this.state.Days[3].dayName} onChange={(e) => this.AssignValues(e,3)} name={this.state.Days[3].dayName} className="form-checkbox" value={this.state.Days[3].IsChecked} checked={this.state.Days[3].IsChecked} />
                                                <Label htmlFor={this.state.Days[3].dayName} className="modal-label-head">{this.state.Days[3].dayName}</Label>
                                                </div>
                                                
                                                <div className="col-xs-12 col-sm-4 m-b-10 checkDiv">
                                                <input type="checkbox" id={this.state.Days[4].dayName} onChange={(e) => this.AssignValues(e,4)} name={this.state.Days[4].dayName} className="form-checkbox" value={this.state.Days[4].IsChecked} checked={this.state.Days[4].IsChecked} />
                                                <Label htmlFor={this.state.Days[4].dayName} className="modal-label-head">{this.state.Days[4].dayName}</Label>
                                                </div>
                                                
                                                <div className="col-xs-12 col-sm-4 m-b-10 checkDiv">
                                                <input type="checkbox" id={this.state.Days[5].dayName} onChange={(e) => this.AssignValues(e,5)} name={this.state.Days[5].dayName} className="form-checkbox" value={this.state.Days[5].IsChecked} checked={this.state.Days[5].IsChecked} />
                                                <Label htmlFor={this.state.Days[5].dayName} className="modal-label-head">{this.state.Days[5].dayName}</Label>
                                                </div>
                                                
                                                <div className="col-xs-12 col-sm-4 m-b-10 checkDiv">
                                                <input type="checkbox" id={this.state.Days[6].dayName} onChange={(e) => this.AssignValues(e,6)} name={this.state.Days[6].dayName} className="form-checkbox" value={this.state.Days[6].IsChecked} checked={this.state.Days[6].IsChecked} />
                                                <Label htmlFor={this.state.Days[6].dayName} className="modal-label-head">{this.state.Days[6].dayName}</Label>
                                                </div>

                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                                {/* </AvCheckboxGroup> */}
                                
                            </ModalBody>
                            <ModalFooter>
                            {this.state.ValidateDaysCsv ? "" : <div><div className="error" style={{margin:'0px'}}>Delivery days is required</div></div>}
                            <div className="btn btn-secondary" onClick={this.addZoneModaltoggle}>Cancel</div>
                            <Button color="primary" className="btn waves-effect waves-light btn-primary pull-right">
                              
                                {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                                : <span className="comment-text">{this.state.IsUpdate ? "Update" : (this.state.ZoneType === 2 ? "Add & Edit Areas" : "Add")}</span>}
                                </Button>
                                
                            </ModalFooter>
                            </AvForm>
                        </Modal>

                   {this.GenerateSweetConfirmationWithCancel()}
                   {this.GenerateSweetAlert()} 
                   {this.GenerateValidPolygonModel()}   
                   {this.GenerateAreaPolygonModel()}
                    </div>
                    
                </div>
            </div>

        );
    }

}

export default DeliveryZones;