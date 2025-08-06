import React, { Component } from 'react';
//import { FormGroup, Label, Input, Button, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import {  Link } from 'react-router-dom';
import Collapsible from 'react-collapsible';
import * as DeliveryAreaService from '../../service/DeliveryArea';
import * as AreaService from '../../service/Area';
import * as CityService from '../../service/City';
//import { AvForm, AvField, AvCheckbox,AvInput,AvGroup } from 'availity-reactstrap-validation';
import * as Utilities from '../../helpers/Utilities';
//import Constants from '../../helpers/Constants';
import Config from '../../helpers/Config';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import Loader from 'react-loader-spinner';
//import { FormGroup, Label, Input, Button, Modal, ModalBody, ModalFooter, ModalHeader,HiddenField} from 'reactstrap';



class DeliveryAreas extends Component {
    constructor(props) {

        super(props);
        this.state = {
          addnew: false,
          editnew:false,
          positionClass: 'not-fixed-delivery',
          DeliveryArea: [],
          cities:[],
          FilterDeliveryArea: [],
          show: false,
          UserList: [],
          showAlert: false,
          alertModelText: '',
          alertModelTitle:'',
          deleteConfirmationModelText : '',
          showDeleteConfirmation: false,
          deleteComfirmationModelType : '',
          deliveryAreasToBeRemovedCsv: '',
          SelectedTownName: '',
          SelectedCityId: 0,
          ExcludedDeliveryArea: [],
          ShowLoader: true,
          IsSave:false
        };
        this.addModal = this.addModal.bind(this);
        this.editModal = this.addModal.bind(this);
        this.SearchTowns  = this.SearchTowns.bind(this);
        this.GetDeliveryAreasBy  = this.GetDeliveryAreasBy.bind(this);
        
      }



handleChange = (e) => {
      this.setState({ searchString:e.target.value });
    }


//#region  Confirmation Model Generation

DeleteTownConfirmation(name,deliveryAreasCsv){

    this.setState({deliveryAreasToBeRemovedCsv: deliveryAreasCsv, SelectedTownName: name,  showDeleteConfirmation:true, deleteConfirmationModelText: 'You want to delete "'+name+'".'})
  
  }

//#endregion 

// #region api calling

GetDeliveryAreas = async (cityId) => {

  this.setState({SelectedCityId: cityId});
  var data = await DeliveryAreaService.Get(cityId,0);

  if(data.length !== 0){
    
    data.forEach(area =>{
        area.IsExcluded = false
    })
  
    this.setState({DeliveryArea: data,FilterDeliveryArea: data});

  }
  this.setState({ShowLoader: false});

}


GetAllDeliveryAreas = async (cityId) => {
   
    this.setState({ShowLoader: true});
    this.setState({SelectedCityId: cityId});
    var data = await DeliveryAreaService.GetAll();
    
    if(data.length !== 0){
        
        data.forEach(area =>{
            area.IsExcluded = false
        })
    
        this.setState({DeliveryArea: data,FilterDeliveryArea: data});
        
        let deliveryAreaParam = DeliveryAreaService.DeliveryArea;

        if(deliveryAreaParam.SelectedTownName !== "")
            this.GetDeliveryAreasBy(deliveryAreaParam.SelectedTownName,deliveryAreaParam.SelectedCityId)
     
            this.GetDeliveryAreasByCityId(cityId);
    }

    this.setState({ShowLoader: false});
  
  }



GetDeliveryAreasBy = async (townName,cityId) => {

    this.setState({SelectedCityId: cityId});
    var data = await AreaService.GetTownArea(townName,cityId);
    let deliveryAreas = this.state.DeliveryArea;
    //let excludedDeliveryAreas = []
    
    if(data.length !== 0){
      
      

        data.forEach(exDeliveryArea =>{

            var rowId = "-1";
            for (var arrobj = 0, arrlen = deliveryAreas.length; arrobj < arrlen; arrobj++) {
            if (deliveryAreas[arrobj].Area2 === exDeliveryArea.Area2) {
                rowId = arrobj;
                break;
            }
        }
        if(rowId === "-1"){
            exDeliveryArea.IsExcluded = true;
            deliveryAreas.push(exDeliveryArea);
        }


        })
        this.setState({DeliveryArea: deliveryAreas,FilterDeliveryArea: deliveryAreas});
            
    }
        
        
  }

GetCities = async () => {

    var data = await CityService.Get();
    let deliveryAreaParam = DeliveryAreaService.DeliveryArea;

    if(data.length !== 0){
        data.sort(Utilities.SortByName);
        this.setState({cities: data});

        if(deliveryAreaParam.SelectedCityId === 0) {
        
             this.GetAllDeliveryAreas(data[0].Id);
            //  this.GetAllDeliveryAreas(0);
        } else {
            this.GetAllDeliveryAreas(deliveryAreaParam.SelectedCityId);
        }

    }
  
  }
  

  DeleteTown = async() =>{
 
    var deliveryAreasToBeRemovedCsv = this.state.deliveryAreasToBeRemovedCsv;
    deliveryAreasToBeRemovedCsv = deliveryAreasToBeRemovedCsv.slice(0, -1);
    this.setState({showDeleteConfirmation: false});
    let DeletedMessage = await DeliveryAreaService.Delete(deliveryAreasToBeRemovedCsv)
    let name = this.state.SelectedTownName;
    
    if(DeletedMessage === '1'){
  
        this.setState({showAlert: true, alertModelTitle:'Deleted!', alertModelText:"'"+ name+'" deleted successfully' });
        this.GetAllDeliveryAreas(this.state.SelectedCityId)
        return;
    } 
    
    let message = DeletedMessage === '0' ? name +'" not deleted successfully' :  DeletedMessage;
  
    //this.setState({SelectedCategoryId: 0});
    this.setState({showAlert: true, alertModelTitle:'Error!', alertModelText: message});
    
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
         onConfirm={() => {this.DeleteTown()}}
         onCancel={() => { this.setState({ showDeleteConfirmation: false });
         }}
         onEscapeKey={() => this.setState({ showDeleteConfirmation: false })}
         onOutsideClick={() => this.setState({ showDeleteConfirmation: false })}
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
         onOutsideClick={() => this.setState({ showAlert: false })}
       />
     )
   }
  
  
  //#endregion
  

GetDeliveryAreasByCityId (cityId)  {

    let towns = this.state.DeliveryArea;
    
    let selectedTownName = DeliveryAreaService.DeliveryArea.SelectedTownName;
    let sortOrder = 1;
    let deliveryArea = towns.filter(area => {

        if(selectedTownName === area.Area1) {
            area.IsOpen = true;
            area.SortOrder = 1;
        }else {
            area.IsOpen = false;
            sortOrder = sortOrder + 1
            area.SortOrder = sortOrder;
            
        }


        return  area.CityID === cityId

        })
    

  if(selectedTownName !== ""){ 

    // deliveryArea.sort(function(x,y){ return x.IsOpen ? -1 : y.IsOpen ? 1 : 0; });
    deliveryArea.sort((x, y) => ((x.SortOrder === y.SortOrder) ? 0 : ((x.SortOrder > y.SortOrder) ? 1 : -1)))
  }
    this.setState({DeliveryArea: deliveryArea,FilterDeliveryArea: deliveryArea});
    this.setState({ShowLoader: false});
}


EditDeliveryArea(areaId) {

    this.props.history.push('/edit-delivery-area/'+areaId)

}

RenderCity(city)
{
    if(this.state.SelectedCityId === city.Id) {
    return (
        <option key={'opt-'+city.Id} value={city.Id} selected>{city.Name}</option>
   )
} else {
    return (
        <option key={'opt-'+city.Id} value={city.Id}>{city.Name}</option>
   )
}
 }

LoadCities(cities){
    
    var htmlCity = [];

    if(cities.length === 0){
        return;
    //   return <option value="-1">Select city</option>
    }

  for (var i=0; i < cities.length; i++){
    
    htmlCity.push(this.RenderCity(cities[i]));
      }

  return(

    // <select className="form-control custom-select" onChange={(e) => this.GetDeliveryAreas(Number(e.target.value))}>  <option key="0"  value="0">All</option> {htmlCity.map((cityHtml) => cityHtml)}</select>
    <select className="form-control custom-select" onChange={(e) => this.GetDeliveryAreas(Number(e.target.value))}> {htmlCity.map((cityHtml) => cityHtml)}</select>

   )
   
  }


      addModal() {
        this.setState({
            addnew: !this.state.addnew,
        });
      }
      editModal() {
        this.setState({
            editnew: !this.state.editnew,
        });
      }


RenderArea(area){

return(
    <div className="delivery-area-row" key={area.Id}>
    <div className="delivery-title-warp">
       <span className="delivery-t">{area.Area2}</span>

    </div>
    <div className="delivery-d-wrap">
    <div style={{position:'relative'}}>
    <span className="zone-ignore-label">Ignore Zones: <span className={area.IgnoreZoneFilter?"yes":"no"}>{area.IgnoreZoneFilter?"YES":"NO" }</span></span>
           <div className="delivery-d-heaing-row">
           <span>
           Min Order
           </span>
           <span>
           Charges
           </span>
           <span>
           Time
           </span>
           </div>
       </div> 
       <div className="delivery-detail-row">
       <span>
       {Utilities.GetCurrencySymbol()}{area.MinimumDeliveryOrder}
      </span>
       <span>
       {Utilities.GetCurrencySymbol()}{area.DeliveryCharges}
       </span>
       <span>
       {area.DeliveryTime} min
       </span>
       </div>
          

    </div>
</div>
)

}     
loadAreasHtml(areas){

    var htmlAreas = [];
    

    if(this.state.ShowLoader===true){
        return this.loading()
      }


    for (var i = 0; i < areas.length; i++) {

        htmlAreas.push(this.RenderArea(areas[i]));
   
    }

    return (<div className="accordian-open-wrap">{htmlAreas.map((areaHtml) => areaHtml)}
    

{this.LoadExcludedAreas(areas[0].Area1)}

    
    
    </div>)

}


LoadExcludedAreas(selectedTown){
  
    let excludedTownAreaCsv = "";
    let towns = this.state.FilterDeliveryArea;

    var excludedTownAreas = towns.filter(excludedTownArea => {
    return  excludedTownArea.Area1 === selectedTown && excludedTownArea.IsExcluded
    })

excludedTownAreas.forEach(townArea => {
excludedTownAreaCsv += townArea.Area2 + ", "
})

if(excludedTownAreaCsv === "")
{
    return;
}
    return(

        <div className="area-notes-wrap">Others areas in {selectedTown} which are not added: <span className="bold">{excludedTownAreaCsv}</span></div>
    )
}
loadTownsHtml(town,townNameWithoutSpaces) {

    if(town.length === 0)
    {
        return <span></span>
    }
    
    
    var deliveryAreasToBeRemovedCsv = "";

    for (var i = 0; i < town.length; i++) {

       deliveryAreasToBeRemovedCsv += town[i].AreaId + ",";
   
    }
    
    

    return (
<div className="relative" key={townNameWithoutSpaces}>
<div className="accordian-c-t-d-wrap">
<span onClick = {() => this.EditDeliveryArea(town[0].AreaId)}>
<i className="fa fa-edit"></i>
Edit

</span>
<span onClick = {() => this.DeleteTownConfirmation(town[0].Area1,deliveryAreasToBeRemovedCsv)}>
<i className="fa fa-trash"></i>
Delete

</span>
</div>
 <Collapsible  open={town[0].IsOpen}
        trigger={
          <div className="accordian-c-t-wrp" onClick = {() => this.GetDeliveryAreasBy(town[0].Area1,town[0].CityID)}>
<div className="accordian-title-icon-wrap">
<span><i className="fa fa-chevron-right"></i></span>
<span>{townNameWithoutSpaces}</span>
</div>

          </div>
            }
        triggerWhenOpen={
            <div className="accordian-c-t-wrp">
            <div className="accordian-title-icon-wrap">
            <span><i className="fa fa-chevron-down"></i></span>
            <span>{townNameWithoutSpaces}</span>
            </div>
           
                                              </div>
            }
    >
       
          
   {this.loadAreasHtml(town)}
  
    </Collapsible>
    </div>
    )
}



SearchTowns(e){

    let searchText = e.target.value;
    let filteredData = []
  
  
    // if (e.keyCode !== 8) {
    //   searchText = searchText;
    // }
    // else{
    //   searchText = searchText.substr(0, e.target.value.length-1)
    // }
  
    if(searchText.toString().trim() === ''){
     this.setState({FilterDeliveryArea: this.state.DeliveryArea});
    }
  
    filteredData = this.state.DeliveryArea.filter((area) => {
      
      let arr = searchText.toUpperCase().split(' ');
      let isExists = false;
      if(area.Area1 ==null) return isExists;
      for (var t = 0; t <= arr.length; t++) {
  
          if (area.Area1.toUpperCase().indexOf(arr[t]) !== -1) {
              isExists = true;
              break;
          }
      }
      
      return isExists
    })
  
  
     this.setState({FilterDeliveryArea: filteredData});
  }


renderTowns(towns)
{


    if(this.state.ShowLoader===true){
        return this.loading()
      }

    var htmlTowns = [];
    var townsCsv = "";

    if(towns === null || towns.length <1)
    {
        return (<div className="not-found-menu m-b-20">No delivery area found.</div>);
    }

    for (var i = 0; i < towns.length; i++) {
        
       
        var townName = towns[i].Area1;
        if(townName === null) continue;
        var townNameWithoutSpaces =  towns[i].Area1.replace(/ /g,'-');
    //	var townDiv = document.getElementById('divTown-' + townNameWithoutSpaces);
        var townAreas = towns.filter(town => {
                return townName === town.Area1 && !town.IsExcluded
          })

		if (!Utilities.isExistInCsv(townNameWithoutSpaces, townsCsv, Config.Setting.csvSeperator))// Adds town html only once
		{
            // this.GetDeliveryAreasBy(townName,townAreas[0].CityId);
            htmlTowns.push(this.loadTownsHtml(townAreas,townNameWithoutSpaces));
            townsCsv += townNameWithoutSpaces + Config.Setting.csvSeperator;
		}
	}


    return(

        <div>{htmlTowns.map((townHtml) => townHtml)}</div>

    )

}

loading = () =>   <div className="page-laoder page-laoder-menu">
<div className="loader-menu-inner"> 
  <Loader type="Oval" color="#ed0000" height={50} width={50}/>  
  <div className="loading-label">Loading.....</div>
  </div>
</div> 

    listenScrollEvent = e => {
        if (window.scrollY > 140) {
          this.setState({positionClass: 'fixed-delivery'})
        } else {
          this.setState({positionClass: 'not-fixed-delivery'})
        }
      }
    
      componentDidMount() {
        
        this.GetCities();
        window.addEventListener('scroll', this.listenScrollEvent)
      }

    render() {
        return (
            <div className="delivery-area-page">
                <div className="card">
                    <div className="card-body">
                        <h3 className="m-b-15 card-title" ><span >Delivery Areas </span>  <Link to="/settings/add-delivery-area"><span className="add-cat-btn pull-right"><i className="fa fa-plus m-r-5" aria-hidden="true"></i><span >Add new</span></span></Link></h3>
                        <div className="select-city-search-wrap">
                            <div className="select-city">
                                <span className="control-label m-r-10">City</span>
                                
                                {this.LoadCities(this.state.cities)}
                            </div>

                            <span className={'Delivery-search ' + this.state.positionClass} >
                                <input type="text" id="txtSearchEnterpriseTopping"  className="form-control common-serch-field" placeholder="Search List" onChange={this.SearchTowns} />

                                <i className="fa fa-search" aria-hidden="true" style={{ position: 'absolute', top: '11px', left: '12px', color: '#777' }}></i>
                                <span className="no-display"><i className="fa fa-times" style={{ position: 'absolute', top: '11px', color: '#777', right: '15px' }}></i></span>
                            </span>
                        </div>

                    {this.renderTowns(this.state.FilterDeliveryArea)}

                    </div>
                </div>
{this.GenerateSweetConfirmationWithCancel()}
{this.GenerateSweetAlert()}
            </div>
        );
    }
}

export default DeliveryAreas;
