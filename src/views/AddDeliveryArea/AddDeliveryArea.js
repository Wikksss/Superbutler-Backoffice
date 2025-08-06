import React, { Component } from 'react';
import { FormGroup, Label, Button } from 'reactstrap';
import 'sweetalert/dist/sweetalert.css';
import "react-tabs/style/react-tabs.css";
import { Link } from 'react-router-dom';
import * as DeliveryAreaService from '../../service/DeliveryArea';
import * as CityService from '../../service/City';
import * as AreaService from '../../service/Area';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import * as Utilities from '../../helpers/Utilities';
import Config from '../../helpers/Config';
import GlobalData from '../../helpers/GlobalData';
import Loader from 'react-loader-spinner';
const regExpNumber = /^[1-9]/;
const regExpDecimal = /^[0-9]+(\.[0-9]{0,2})?$/;


class AddDeliveryArea extends Component {

  constructor(props) {

    super(props);
    this.state = {
      addnew: false,
      editnew: false,
      dimensions: null,
      positionClass: 'not-fixed-delivery',
      Towns: [],
      AllTowns: [],
      cities: [],
      FilterDeliveryArea: [],
      SelectCityId: 0,
      TownAreas: [],
      SelectedTown: '',
      CheckAll: false,
      DefaultValue: false,
      SelectedCityId: 0,
      MinOrder: [],
      DeliveryArea: [],
      ExcludedDeliveryArea: [],
      AllDeliveryAreas: [],
      AreaId: 0,
      EditDeliveryArea: [],
      IsUpdate: false,
      ShowLoader: true,
      HasProcessed : true,
      SelectAreaValidation: false,
      IsSave:false
    };
    this.addModal = this.addModal.bind(this);
    this.editModal = this.addModal.bind(this);
    this.SearchDeliveryAreas = this.SearchDeliveryAreas.bind(this);
    this.SaveDeliveryArea = this.SaveDeliveryArea.bind(this);
    this.handleCheckAll = this.handleCheckAll.bind(this);
    this.LoadDeliveryArea = this.LoadDeliveryArea.bind(this);
  }



  // #region api calling


  SaveDeliveryAreaApi = async (deliveryAreaCsv) => {

    let message = await DeliveryAreaService.Save(deliveryAreaCsv);
    this.setState({IsSave:false})

    if (message === '1') {

      this.props.history.push('/settings/delivery-Areas')

    }
    this.setState({HasProcessed : true});

  }



  UpdateDeliveryAreaApi = async (deliveryAreaParam) => {

    let message = await DeliveryAreaService.Update(deliveryAreaParam);
    this.setState({IsSave:false})
    if (message === '1') {

      this.props.history.push('/settings/delivery-Areas')
    }
    this.setState({HasProcessed : true});
  }



  SaveDeliveryArea() {
    if(this.state.IsSave) return;
    this.setState({IsSave:true})
    this.setState({SelectAreaValidation : false})
    let deliveryArea = this.state.FilterDeliveryArea;
    let selectedTown = this.state.SelectedTown;
    let isUpdate = this.state.IsUpdate;
    let deliveryAreaParam = DeliveryAreaService.DeliveryArea;


    deliveryAreaParam.DeliveryAreasToBeSaved = "";
    deliveryAreaParam.DeliveryAreasToBeUpdated = "";
    deliveryAreaParam.DeliveryAreasToBeRemoved = "";
    deliveryAreaParam.SelectedCityId = this.state.SelectedCityId;
    deliveryAreaParam.SelectedTownName = selectedTown;

    // let areaId = this.state.AreaId;

    // var htmlArea = [];
    var townAreas = deliveryArea.filter(townArea => {
      return selectedTown === townArea.Area1
    })

    townAreas.forEach(area => {


      if (area.MinimumDeliveryOrder === "") area.MinimumDeliveryOrder = "0";
      if (area.DeliveryCharges === "") area.DeliveryCharges = "0";
      if (area.DeliveryTime === "") area.DeliveryTime = "0";

      if (area.Selected) {

        if (area.IsExcluded) {
          deliveryAreaParam.DeliveryAreasToBeSaved += area.Id + ":" + area.MinimumDeliveryOrder + ":" + (area.DeliveryCharges > 0 ? "0" : "1") + ":" + area.DeliveryCharges + ":" + area.DeliveryTime + ":" + (area.IgnoreZoneFilter ? "1" : "0") + Config.Setting.csvSeperator
        } else {
          deliveryAreaParam.DeliveryAreasToBeUpdated += area.Id + ":" + area.MinimumDeliveryOrder + ":" + (area.DeliveryCharges > 0 ? "0" : "1") + ":" + area.DeliveryCharges + ":" + area.DeliveryTime + ":" + (area.IgnoreZoneFilter ? "1" : "0") + Config.Setting.csvSeperator
        }

      } else if (!area.IsExcluded) {
        deliveryAreaParam.DeliveryAreasToBeRemoved += area.Id + ",";
      }

    })

    deliveryAreaParam.DeliveryAreasToBeSaved = Utilities.FormatCsv(deliveryAreaParam.DeliveryAreasToBeSaved, Config.Setting.csvSeperator);
    deliveryAreaParam.DeliveryAreasToBeUpdated = Utilities.FormatCsv(deliveryAreaParam.DeliveryAreasToBeUpdated, Config.Setting.csvSeperator);
    deliveryAreaParam.DeliveryAreasToBeRemoved = deliveryAreaParam.DeliveryAreasToBeRemoved.slice(0, -1);
    //Saving
    this.setState({HasProcessed : false})
    if (deliveryAreaParam.DeliveryAreasToBeSaved !== "" && !isUpdate) {
      this.SaveDeliveryAreaApi(deliveryAreaParam.DeliveryAreasToBeSaved);

      return;
    } else if (isUpdate){
      // updating
      this.UpdateDeliveryAreaApi(deliveryAreaParam);
    } else {
      this.setState({IsSave:false})
      this.setState({SelectAreaValidation : true,HasProcessed : true})
      // this.setState({})
    }
  }


  GetAllDeliveryAreas = async () => {

    var data = await DeliveryAreaService.GetAll();

    if (data.length !== 0) {
      // this.setState({ShowLoader: false});
      data.sort((x, y) => ((x.Area1 === y.Area1) ? 0 : ((x.Area1 > y.Area1) ? 1 : -1)))

      var areaId = this.state.AreaId;

      var townAreas = data.filter(area => {
        return areaId === area.AreaId

      })

      data.forEach(area => {
        area.IsExcluded = false
        area.Selected = true;
        area.AutoFocusDelCharges = false;
        area.AutoFocusDelTime = false;
        area.AutoFocusMinOrder = false;

      })

      this.setState({ AllDeliveryAreas: data, SelectedTown: townAreas[0].Area1 });
      this.GetDeliveryAreasBy(townAreas[0].Area1, townAreas[0].CityID)
    }

  }

  GetDeliveryAreas = async (cityId) => {

    var data = await DeliveryAreaService.Get(cityId, 1);
    this.setState({ SelectedCityId: cityId });

    if (data.length !== 0) {
      this.setState({ ShowLoader: false });
      data.sort((x, y) => ((x.Area1 === y.Area1) ? 0 : ((x.Area1 > y.Area1) ? 1 : -1)))
      //   this.setState({Towns: data,FilterDeliveryArea: data});
      this.setState({ SelectedTown: data[0].Area1 });

      let selectedTown = data[0].Area1

      for (var i = 0; i < data.length; i++) {
        data[i].IsExcluded = true;
        data[i].MinimumDeliveryOrder = GlobalData.restaurants_data.Supermeal_dev.MinimumDeliveryOrder;
        data[i].DeliveryCharges = GlobalData.restaurants_data.Supermeal_dev.DeliveryCharges;
        data[i].DeliveryTime = GlobalData.restaurants_data.Supermeal_dev.DeliveryTime;
        data[i].Selected = false;
        data[i].IgnoreZoneFilter = false;
        data.AutoFocusDelCharges = false;
        data.AutoFocusDelTime = false;
        data.AutoFocusMinOrder = false;

      }
      var townAreas = data.filter(townArea => {
        return selectedTown === townArea.Area1
      })


      this.setState({ AllTowns: data, Towns: townAreas, FilterDeliveryArea: townAreas });

    }

  }


  GetDeliveryAreasBy = async (townName, cityId) => {

    this.setState({ SelectedCityId: cityId });
    var data = await AreaService.GetTownArea(townName, cityId);
    let deliveryAreas = this.state.AllDeliveryAreas;
    let checkAll = true;
    if (data.length !== 0) {
      this.setState({ ShowLoader: false });
      data.forEach(exDeliveryArea => {

        var rowId = "-1";
        for (var i = 0, j = deliveryAreas.length; i < j; i++) {
          if (deliveryAreas[i].Area2 === exDeliveryArea.Area2) {
            rowId = i;
            break;
          }
        }

        if (rowId !== "-1") {

          exDeliveryArea.IsExcluded = false;
          exDeliveryArea.MinimumDeliveryOrder = String(deliveryAreas[i].MinimumDeliveryOrder);
          exDeliveryArea.DeliveryCharges = String(deliveryAreas[i].DeliveryCharges);
          exDeliveryArea.DeliveryTime = String(deliveryAreas[i].DeliveryTime);
          exDeliveryArea.Selected = deliveryAreas[i].Selected
          exDeliveryArea.IgnoreZoneFilter = deliveryAreas[i].IgnoreZoneFilter;
          data.AutoFocusDelCharges = deliveryAreas[i].AutoFocusDelCharges;
          data.AutoFocusDelTime = deliveryAreas[i].AutoFocusDelTime;
          data.AutoFocusMinOrder = deliveryAreas[i].AutoFocusMinOrder;

        } else {

          exDeliveryArea.IsExcluded = true;
          exDeliveryArea.MinimumDeliveryOrder = GlobalData.restaurants_data.Supermeal_dev.MinimumDeliveryOrder;
          exDeliveryArea.DeliveryCharges = GlobalData.restaurants_data.Supermeal_dev.DeliveryCharges;
          exDeliveryArea.DeliveryTime = GlobalData.restaurants_data.Supermeal_dev.DeliveryTime;
          exDeliveryArea.Selected = false;
          exDeliveryArea.IgnoreZoneFilter = false;
          data.AutoFocusDelCharges = false;
          data.AutoFocusDelTime = false;
          data.AutoFocusMinOrder = false;
        }
      })

      data.sort((x, y) => ((x.IsExcluded) - (y.IsExcluded)))

      
      data.forEach(deliveryArea => {

        if(!deliveryArea.Selected)
            checkAll = false
      });
      
      
      this.setState({ Towns: data, FilterDeliveryArea: data, CheckAll: checkAll });
    }

  }

  GetCities = async () => {

    var data = await CityService.Get();

    if (data.length !== 0) {
      data.sort(Utilities.SortByName);
      this.setState({ cities: data });
      this.setState({ SelectedCityId: data[0].Id });
      this.GetDeliveryAreas(data[0].Id);
    }

  }

  //#endregion

  ValidateInputs(value, control) {
    let valid = false;
    let decimalLength = 0;

    if (control.toUpperCase() === "CHK" || control.toUpperCase() === "ZONE") {
      return true;
    }


    switch (control.toUpperCase()) {

      case 'MIN':

        if (regExpDecimal.test(Number(value)) && String(value).length < 7 && decimalLength < 3) {
          valid = true;
        }
        break;

      case 'CHA':
        if (regExpDecimal.test(Number(value)) && String(value).length < 7 && decimalLength < 3) { valid = true; }

        break;

      case 'TIME':
        if (regExpNumber.test(Number(value)) && String(value).length < 4) { valid = true; }

        break;
      default:
        break;

    }

    return valid;


  }

  AssignValues(e, index, control) {


    let DeliveryAreas = this.state.FilterDeliveryArea;
    let value = e.target.value;
    let checkAll = true;
    DeliveryAreas.forEach(area => {

      area.AutoFocusDelCharges = false;
      area.AutoFocusDelTime = false;
      area.AutoFocusMinOrder = false;
    })


    if (!this.ValidateInputs(value, control)) {

      value = value.slice(0, -1);

    }


    switch (control.toUpperCase()) {

      case 'MIN':
        DeliveryAreas[index].MinimumDeliveryOrder = String(value);
        DeliveryAreas[index].AutoFocusMinOrder = true;

        break;

      case 'CHA':
        DeliveryAreas[index].DeliveryCharges = String(value);
        DeliveryAreas[index].AutoFocusDelCharges = true;
        break;

      case 'TIME':

        value = value.indexOf('.') === -1 ? value : value.slice(0, -1);
        DeliveryAreas[index].DeliveryTime = String(value);
        DeliveryAreas[index].AutoFocusDelTime = true;
        break;

      case 'ZONE':
        DeliveryAreas[index].IgnoreZoneFilter = value === "false" ? true : false;
        break;

      case 'CHK':
        DeliveryAreas[index].Selected = value === "false" ? true : false;
        DeliveryAreas.forEach(deliveryArea => {

          if(!deliveryArea.Selected)
              checkAll = false
        });
        this.setState({CheckAll : checkAll});

        break;
      default:
        break;
    }


    this.setState({ FilterDeliveryArea: DeliveryAreas});

    return;


  }

  handleCheckAll(value) {

    let deliveryAreas = this.state.FilterDeliveryArea;

    if (value === "false") {

      deliveryAreas.forEach(deliveryArea => {

        deliveryArea.Selected = !this.state.CheckAll;
      });

    }
    else {
      deliveryAreas.forEach(deliveryArea => {

        deliveryArea.Selected = !this.state.CheckAll;
      });
    }


    this.setState({ CheckAll: !this.state.CheckAll, FilterDeliveryArea: deliveryAreas })

  }

  handleDefaultVaue(value) {

    if (value === "false") {

      this.state.FilterDeliveryArea.forEach(deliveryArea => {

        deliveryArea.MinimumDeliveryOrder = GlobalData.restaurants_data.Supermeal_dev.MinimumDeliveryOrder;
        deliveryArea.DeliveryTime = GlobalData.restaurants_data.Supermeal_dev.DeliveryTime;
        deliveryArea.DeliveryCharges = GlobalData.restaurants_data.Supermeal_dev.DeliveryCharges;

      })

      this.setState({ DefaultValue: true });

    }


  }

  SearchDeliveryAreas(e) {

    let searchText = e.target.value;
    let filteredData = []




    if (searchText.toString().trim() === '') {
      this.setState({ FilterDeliveryArea: this.state.Towns });
    }

    filteredData = this.state.Towns.filter((area) => {

      let arr = searchText.toUpperCase().split(' ');
      let isExists = false;
      if (area.Area1 === null) return isExists;
      for (var t = 0; t <= arr.length; t++) {

        if (area.Area2.toUpperCase().indexOf(arr[t]) !== -1) {
          isExists = true;
          break;
        }
      }

      return isExists
    })


    this.setState({ FilterDeliveryArea: filteredData });
  }


  RenderDeliveryArea(area, count) {

    if (this.state.ShowLoader === true) {
      return this.loading()
    }

    var townNameWithoutSpaces = area.Area2.replace(/ /g, '-');

    //var values = this.state.values;
    // var minOrder = "";
    // var deliveryTime = "";
    // var deliveryCharges= "";
    return (

      <div key={'dv' + count} className="area-modal-row">

        <div className="area-modal-body-headng">
          <div className="flex">

            <AvField type="checkbox" name={"chkArea_" + count} value={area.Selected} checked={area.Selected} onChange={(e) => this.AssignValues(e, count, "CHK")} className="form-checkbox" />
            <Label htmlFor={"chkArea_" + count} className="modal-label-head">{townNameWithoutSpaces}</Label>

          </div>
        </div>
        <div className="area-modal-detail-wrap">
          <div className="name-field form-group">

            <AvField className="form-control" name={"minOrder_" + count} autoFocus={area.AutoFocusMinOrder} onChange={(e) => this.AssignValues(e, count, "MIN")} value={area.MinimumDeliveryOrder}
              validate={{
                maxLength: { value: 6 },
                pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, errorMessage: 'please fill correct value' }
              }}
            />

            <div className="icon-symbal">{Utilities.GetCurrencySymbol()}</div>
            <span>Min Order</span>
          </div>
          <div className="name-field form-group">
            <AvField className="form-control" name={"delCharges_" + count} autoFocus={area.AutoFocusDelCharges} onChange={(e) => this.AssignValues(e, count, "CHA")} value={area.DeliveryCharges}
              validate={{
                maxLength: { value: 6 },
                pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, errorMessage: 'please fill correct value' }
              }}
            />
            <div className="icon-symbal">{Utilities.GetCurrencySymbol()}</div>
            <span>Charges</span>
          </div>
          <div className="name-field form-group time-field">
            <AvField className="form-control" name={"delTime_" + count} autoFocus={area.AutoFocusDelTime} onChange={(e) => this.AssignValues(e, count, "TIME")} value={area.DeliveryTime}
              validate={{
                maxLength: { value: 3 },
                tel: { pattern: '^[0-9]' }
              }}
            />
            <div className="icon-symbal">mins</div>
            <span>Time</span>
          </div>
          <div>

            <label className="delivery-zone-label" htmlFor="1">Ignore Zones</label>
            <div className="flex zone-center-checkbox">
              <AvField type="checkbox" name={"chkIgnorZone_" + count} checked={area.IgnoreZoneFilter} value={area.IgnoreZoneFilter} onChange={(e) => this.AssignValues(e, count, "ZONE", e.target.validate)} className="form-checkbox" />

            </div>
          </div>
        </div>

      </div>

    )

  }

  handlerOnChangeTown(townName) {

    this.setState({ SelectedTown: townName });
    let towns = this.state.AllTowns;

    var townAreas = towns.filter(townArea => {
      return townName === townArea.Area1
    })

    for (var i = 0; i < townAreas.length; i++) {

      townAreas[i].MinimumDeliveryOrder = GlobalData.restaurants_data.Supermeal_dev.MinimumDeliveryOrder;
      townAreas[i].DeliveryCharges = GlobalData.restaurants_data.Supermeal_dev.DeliveryCharges;
      townAreas[i].DeliveryTime = GlobalData.restaurants_data.Supermeal_dev.DeliveryTime;
      townAreas[i].Selected = false;
      townAreas[i].IgnoreZoneFilter = false;

    }

    this.setState({ FilterDeliveryArea: townAreas, Towns: townAreas, CheckAll: false })

  }


  HeadingHtml(isUpdate) {


    if (isUpdate) {

      var selectedTown = this.state.SelectedTown;

      return (
        <div className="back-page-link-wrap card-new-title ">
          <h3 className=" card-title">Edit delivery setting for " {selectedTown} "</h3>
          <Link to="/settings/delivery-Areas"> <i className="fa fa-chevron-left"></i>Back to delivery areas</Link>
        </div>
      )
    }


    return (
      <div className="back-page-link-wrap card-new-title">
        <h3 className=" card-title">Add new delivery area</h3>
        <Link to="/settings/delivery-Areas"> <i className="fa fa-chevron-left"></i>Back to delivery areas</Link>
      </div>
    )
  }



  LoadDeliveryArea(towns) {

    var htmlArea = [];


    for (var i = 0; i < towns.length; i++) {

      htmlArea.push(this.RenderDeliveryArea(towns[i], i));
    }


    return (

      <div className="area-modal-body-wrap">{htmlArea.map((areaHtml) => areaHtml)}


      </div>
    )

  }

  RenderCity(city) {
    return (
      <option key={'opt-' + city.Id} value={city.Id}>{city.Name}</option>
    )
  }


  LoadCities(cities) {

    var htmlCity = [];

    let isUpdate = this.state.IsUpdate

    if (isUpdate) {
      return;
    }

    if (cities.length === 0) {
      return;
    }

    for (var i = 0; i < cities.length; i++) {

      htmlCity.push(this.RenderCity(cities[i]));
    }

    return (

      <div className="select-city">
        <span className="control-label m-r-10">City</span><select className="form-control custom-select" onChange={(e) => this.GetDeliveryAreas(Number(e.target.value))}>{htmlCity.map((cityHtml) => cityHtml)}</select>
      </div>

    )

  }

  RenderTownsDropDown(town) {
    return (
      <option key={town.Area1} value={town.Area1}>{town.Area1}</option>
    )
  }


  LoadTownsDropDown(towns) {

    let isUpdate = this.state.IsUpdate

    if (isUpdate) {
      return;
    }

    var htmlTowns = [];
    var previousArea = "";
    if (towns === null || towns.length < 1) {
      // return <select className="form-control custom-select" onChange={(e) => this.GetTownAreas(Number(e.target.value))}><option value="-1">Select Town</option></select>
      return;
    }


    for (var i = 0; i < towns.length; i++) {
      if (towns[i].Area1 !== previousArea)
        htmlTowns.push(this.RenderTownsDropDown(towns[i]));

      previousArea = towns[i].Area1;
    }

    return (

      <div className="select-city">
        <span className="control-label m-r-10"> Town</span><select className="form-control custom-select" onChange={(e) => this.handlerOnChangeTown(e.target.value)}>{htmlTowns.map((townHtml) => townHtml)}</select>
      </div>
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
  loading = () => <div classNameName="animated fadeIn pt-1 text-center">Loading...</div>


  listenScrollEvent = e => {
    // if (window.scrollY > 120) {
    //   this.setState({positionClass: 'fixed-delivery'})
    // } else {
    //   this.setState({positionClass: 'not-fixed-delivery'})
    // }
  }

  componentDidMount() {


    var areaId = Number(this.props.match.params.areaId);
    
    if (areaId > 0) {
      this.setState({ AreaId: areaId });
      this.setState({ IsUpdate: true });
      this.GetAllDeliveryAreas();
    }

    else {
      this.GetCities();
    }
    // window.addEventListener('scroll', this.listenScrollEvent)

  }


  shouldComponentUpdate() {
    return true;
  }

  render() {
    //const { dimensions } = this.state;
    //  var towns = this.state.Towns;

    return (
      <div className="card">
{this.HeadingHtml(this.state.IsUpdate)}
        <div className="card-body" id="container">


          


          <AvForm onValidSubmit={this.SaveDeliveryArea}>

            <div className="add-deliver-modal-wrap add-delvery-uk-wrap">



              <div className="city-town-wrap">


                {this.LoadCities(this.state.cities)}


                {this.LoadTownsDropDown(this.state.AllTowns)}



                <div className={'search-add-delvery ' + this.state.positionClass}>
                  <input type="text" id="txtSearchEnterpriseTopping" className="form-control common-serch-field" placeholder="Search Area" onChange={this.SearchDeliveryAreas} />

                  <i className="fa fa-search" aria-hidden="true" style={{ position: 'absolute', top: '11px', left: '12px', color: '#777' }}></i>
                  <span className="no-display"><i className="fa fa-times" style={{ position: 'absolute', top: '11px', color: '#777', right: '15px' }}></i></span>
                </div>

              </div>
              <div className="m-b-10 flex res-pul-left" >

                <AvField type="checkbox" name="chkAll" onClick={(event) => this.handleCheckAll(event.target.value)} value={this.state.CheckAll} checked={this.state.CheckAll} className="form-checkbox" />
                <Label check for="chkAll">Select all areas</Label>

              </div>

              <div className="m-b-10 flex res-pul-left">
                <AvField type="checkbox" name="chkDefaultValue" onClick={(event) => this.handleDefaultVaue(event.target.value)} className="form-checkbox" />
                <Label check for="chkDefaultValue">Apply delivery settings</Label>
              </div>


              <div className="modal-area-wrap">
                <div className="area-m-b-heading">Areas</div>
                {this.LoadDeliveryArea(this.state.FilterDeliveryArea)}

              </div>
              {this.state.SelectAreaValidation ? 
                <div className="error"> Please select area.</div> : ''}
            </div>
            <div className="bottomBtnsDiv" >

              <FormGroup>
                
                <Link to="/settings/delivery-Areas"><Button color="secondary" style={{ marginRight: 10 }}>Cancel</Button></Link>
                <Button style={{width:'61px'}} color="success" className="btn waves-effect waves-light btn-success pull-right">
                {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                : <span className="comment-text">Save</span>}
                </Button>

              </FormGroup>
            </div>

          </AvForm>
        </div>
      </div>
    );

  }
}

export default AddDeliveryArea;
