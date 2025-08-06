import React, { Component } from 'react';
import { FormGroup,  Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { AvForm,AvGroup, AvField} from 'availity-reactstrap-validation';
//import Nestable from 'react-nestable';
import SweetAlert from 'sweetalert-react'; // eslint-disable-line import/no-extraneous-dependencies
import 'sweetalert/dist/sweetalert.css';
import * as MenuAddonService from '../../service/AddonGroup';
import * as CategoryService from '../../service/Category';
import * as ProductService from '../../service/Product';
import Constants from  '../../helpers/Constants';
import { AppSwitch } from '@coreui/react';
import * as Utilities from '../../helpers/Utilities';
import Config from '../../helpers/Config';
import {sortableContainer, sortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import Loader from 'react-loader-spinner';
import { Object } from 'core-js';
import ReactTooltip from 'react-tooltip';
import {SetMenuStatus} from '../../containers/DefaultLayout/DefaultHeader'
import Labels from '../../containers/language/labels';


const PriceValidation = (value, ctx) => {

  if (!Utilities.IsNumber(value)) {
    return " ";
  }
  return true;
}
const SortableItem = sortableElement(({value}) => <li className="sortableHelpernew">{value}</li>);

const SortableContainer = sortableContainer(({items}) => {
  
  if(items === undefined) {return;}
 
  return (
   <ul className="sortableHelpernew-wrap">
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`}style={{zIndex: 100000}}  index={index} value={value.GroupItems[0].Name} />
      ))}
    </ul>
  );
});


const SortableContainerGroupItem = sortableContainer(({items}) => {
  
  if(items === undefined) {return;}
 
  return (
   <ul className="sortableHelpernew-wrap">
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`}style={{zIndex: 100000}}  index={index} value={value.GroupName} />
      ))}
    </ul>
  );
});

class Extras extends Component {

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState(({SingleExtraItem}) => ({
      SingleExtraItem: arrayMove(SingleExtraItem, oldIndex, newIndex),
    }));

     this.GetUpdatedExtraSort(this.state.SingleExtraItem);

  };


  onGroupSortEnd = ({oldIndex, newIndex}) => {
    this.setState(({GroupExtraItem}) => ({
      GroupExtraItem: arrayMove(GroupExtraItem, oldIndex, newIndex),
    }));

     this.GetUpdatedExtraSort(this.state.GroupExtraItem);

  };


loading = () =>   <div className="page-laoder page-laoder-menu">
<div className="loader-menu-inner"> 
  <Loader type="Oval" color="#ed0000" height={50} width={50}/>  
  <div className="loading-label">Loading.....</div>
  </div>
</div> 


  constructor(props) {

    super(props);
    this.state = {
      ExtrasGroups: [],
      FilterExtraGroup: [],
      ActiveExtras:[],
      Categories: [],
     // SelectedItemCSV: '',
      SelectedCategoryId: 0,
      SelectedExtraItems: [],
      Products: [],
      FilterProducts:[],
      ProductOptons:[],
      SelectedExtraId: 0,
      SelectedProductId: 0,
      ExtrasQuantity: 1,
      IsGroupItem: false,
      SelectedExtra: {},
      SelectedExtrasDetail:[],
      ShowDeleteConfirmation : false,
      ShowMaxSelectionConfirmation: false,
      SelectedMaxSelection: 0,
      SortCsvExtraGroup: "",
      SortCsvExtraItem: "",
      DeleteConfirmationModelText:"",
      DeleteConfirmationModelTitle: "",
      SelectedExtraItem : {},
      Sort: false,
      ExtraItemModel: false,
      AddEditGoupModal: false,
      EditExtraGroupName: false,
      scrolled:false,
      modal: false,
      left: false,
      categoryedit: false,
      large: false,
      small: false,
      primary: false,
      success: false,
      warning: false,
      danger: false,
      info: false,
      itemImage: false,
      addoption: false,
      edititem: false,
      additemgroup: false,
      edititemgroup: false,
      classDisplay: 'no-display',
      show: false,
      SelectedGroupItemName: "",
      IsMandatory: false,
      IsSingleSideItem: false,
      IsSingleMainItem: false,
      IsGroupSideItem: false,
      IsGroupMainItem: false,
      SingleExtraItem: [],
      GroupExtraItem: [],
      ShowLoaderRightPanel: true,
      ShowLoaderLeftPanel: true,
      IsNewItem: true,
      IsGroupDeleteConfirmation : true,
      ProductOptionForRender: [],
      IsSave: false,
      countryConfigObj: JSON.parse(localStorage.getItem(Constants.Session.COUNTRY_CONFIGURATION))
    };
  

    this.GetUpdatedExtraSort = this.GetUpdatedExtraSort.bind(this);
    this.SortModal = this.SortModal.bind(this);
    this.CatgoryChangeEvenListner = this.CatgoryChangeEvenListner.bind(this);
    this.ProductChangeEvenListner = this.ProductChangeEvenListner.bind(this);
    this.SaveExtrasGroupItem = this.SaveExtrasGroupItem.bind(this);
    this.AddEditGroupName = this.AddEditGroupName.bind(this);
    this.CreateExtraGroup = this.CreateExtraGroup.bind(this);
    this.DecreaseExtrasQuantity = this.DecreaseExtrasQuantity.bind(this);
    this.IncreaseExtrasQuantity = this.IncreaseExtrasQuantity.bind(this);

    this.toggle = this.toggle.bind(this);
    this.leftpenal = this.leftpenal.bind(this);
    
    this.SearchExtra = this.SearchExtra.bind(this);
    this.AddEditExtraItemModal = this.AddEditExtraItemModal.bind(this);
    this.editItemModal = this.editItemModal.bind(this);
    this.addgroupItemModal = this.addgroupItemModal.bind(this);
    this.editgroupItemModal = this.editgroupItemModal.bind(this);
    this.GetSelectedExtraGroupItems = this.GetSelectedExtraGroupItems.bind(this);
    this.GetExtraPrice = this.GetExtraPrice.bind(this);
  }


  SortModal() {
   
   
  let selectedExtraGroupItem  = this.state.SelectedExtrasDetail
  let extraGroup = [];
  let extraItem = []; 
  //let sortCsvExtraGroup = '';
  //let sortCsvExtraItem = "";

  for(var yu=0; yu < selectedExtraGroupItem.length; yu++){
    
    selectedExtraGroupItem[yu].id = selectedExtraGroupItem[yu].Id
    
    if(selectedExtraGroupItem[yu].IsGroup=== "1"){
         extraGroup.push(selectedExtraGroupItem[yu]);
    }
    else if(selectedExtraGroupItem[yu].IsGroup === "0" && selectedExtraGroupItem[yu].GroupItems.length > 0){
      extraItem.push(selectedExtraGroupItem[yu]);
    }

  }

  extraGroup.sort((x, y) => ((x.SortOrder === y.SortOrder) ? 0 : ((x.SortOrder > y.SortOrder) ? 1 : -1)))
  extraItem.sort((x, y) => ((x.SortOrder === y.SortOrder) ? 0 : ((x.SortOrder > y.SortOrder) ? 1 : -1)))

  this.setState({SingleExtraItem : extraItem, GroupExtraItem: extraGroup,Sort: !this.state.Sort,});
   
  //   this.setState({
  //     Sort: !this.state.Sort,
  //   });
  }

 GetSelectedExtraGroupItems(isGroup,extraItem){

    let selectedExtraItems = [];
    let groupItems = extraItem.GroupItems;
    if(isGroup) {
      groupItems.forEach(item=>{
      
      if(Utilities.GetObjectArrId(item.Id,selectedExtraItems) === "-1") {
        
        selectedExtraItems.push({Id: Number(item.Id), Price: item.Price });
      }
    })
  } else {
    selectedExtraItems.push({Id: Number(groupItems[0].Id), Price: extraItem.Price });
  }
    
      return selectedExtraItems;
}

  AddEditExtraItemModal(isGroup, extraItem,isNewItem) {

    this.setState({
      ExtraItemModel: !this.state.ExtraItemModel,
      IsGroupItem: isGroup,
      Products: [],
      FilterProducts:[],
      ProductOptons:[],
      ProductOptionForRender:[],
      ExtrasQuantity : Object.keys(extraItem).length > 0 ?  Number(extraItem.Quantity) : 1,
      SelectedCategoryId: Object.keys(extraItem).length > 0 ? extraItem.GroupItems[0].CategoryId : 0,
      SelectedProductId : Object.keys(extraItem).length > 0 ? extraItem.GroupItems[0].MetaId : 0,
      SelectedExtraItem : extraItem,
      SelectedGroupItemName: isGroup ? extraItem.GroupName : "",
      IsMandatory: extraItem.IsMandatory === "0" ? false : true,
      IsSingleSideItem:  Object.keys(extraItem).length > 0 && (extraItem.GroupItems[0].SideItem === "0" ? false : true),
      IsSingleMainItem:  Object.keys(extraItem).length > 0 && (extraItem.GroupItems[0].MainItem === "0" ? false : true),
      IsGroupMainItem: extraItem.MainItem === "0" ? false : true,
      IsGroupSideItem: extraItem.SideItem === "0" ? false : true,
      IsNewItem: isNewItem,
      SelectedExtraItems: Object.keys(extraItem).length > 0 ? this.GetSelectedExtraGroupItems(isGroup,extraItem): []
    });

    if( Object.keys(extraItem).length > 0 ){
      this.GetProducts(extraItem.GroupItems[0].CategoryId);
    }
  }

  handleBottomClick () {
		setTimeout(
		  function() {
			smoothScroll.scrollTo('top');
		  }
		  ,
		  1000
	  );
		
	  }
  toggle() {
    this.setState({
      modal: !this.state.modal,
    })
  }
  AddEditGroupName(isEdit) {
    this.setState({
      AddEditGoupModal: !this.state.AddEditGoupModal,
      EditExtraGroupName : isEdit
    })
  }
  leftpenal() {
    this.setState({
      left: !this.state.left,
      SearchExtraText: '',
      IsSearchingGroup: false
    });
  }
 
  editItemModal() {
    this.setState({
      edititem: !this.state.edititem,
    });
  }

  addgroupItemModal() {
    this.setState({
      additemgroup: !this.state.additemgroup,
    });
  }
  editgroupItemModal() {
    this.setState({
      edititemgroup: !this.state.edititemgroup,
    });
  }

  componentWillUnmount(){

  }

  componentDidMount() {
		window.addEventListener('scroll', ()=>{
			const istop =window.scrollY < 20;
			
			if(istop !== true){
			  this.setState({scrolled: true})
			}
			else{
			  this.setState({scrolled: false})
			}
			
				});
    window.addEventListener('load', () => {
      this.setState({
        isMobile: window.innerWidth < 800
      });
    }, false);
    if (window.innerWidth < 800) {
      this.setState({
        isMobile : true
      })
     // this.state.isMobile = true;
    }
    if (window.innerWidth > 800) {
      this.setState({
        isMobile : false
      })
    }

    // console.log('calling extras');
    this.GetExtras();
    this.GetCategories();
  }

  shouldComponentUpdate() {
    return true;
  }

  getInitialState() {
    return {
      done: true
    };
  }

  SaveMenuAddonGroupWithDetail= async(addonGroupExtra) =>{

    let Name = addonGroupExtra.Name;
    let selectedExtraGroupId = addonGroupExtra.AddonGroupId;
    let id =  await MenuAddonService.SaveWithDetail(addonGroupExtra);
    this.setState({ IsSave: false })
    let deleteExtra  = Object.keys(this.state.SelectedExtraItem).length > 0
    if(id > 0) {
      SetMenuStatus(true);
      this.setState({AddEditGoupModal : false, SelectedExtraId: id, EditExtraGroupName: false, ExtraItemModel: false,  SelectedExtraItem:{},ShowDeleteConfirmation : false, SelectedExtraItems:[], ShowMaxSelectionConfirmation: false });
      addonGroupExtra = MenuAddonService.AddonGroupExtra;
      addonGroupExtra.MaxSelection = 0;
      addonGroupExtra.AddonGroupId  = 0;
      addonGroupExtra.DeletedGroupItemCsv = "";
      addonGroupExtra.UpdatedGroupItemCsv = "";
      addonGroupExtra.Name= "";
      addonGroupExtra.AddedGroupItemCsv= "";
      
      if(selectedExtraGroupId > 0)
       Utilities.notify("Extra Group " + Utilities.SpecialCharacterDecode(Name) + " updated successfully.", "s");
       else
       Utilities.notify("New Group " + Utilities.SpecialCharacterDecode(Name) + " created successfully.", "s");

      if(deleteExtra){
        this.GetExtrasDetails( this.state.SelectedExtraId);
        this.GetExtras();
        return;
      }
      this.GetExtras();
    } else {
      Utilities.notify( Utilities.SpecialCharacterDecode(Name) + " update failed.", "e");
    }

  }

  DeleteExtraItem(){

    var extraItem = this.state.SelectedExtraItem;
    var addonGroupExtra = MenuAddonService.AddonGroupExtra;
    addonGroupExtra.MaxSelection = this.state.SelectedExtra.MaxSelection >= this.state.SelectedExtrasDetail.length && this.state.SelectedExtra.MaxSelection > 1 ?  this.state.SelectedExtra.MaxSelection - 1 : this.state.SelectedExtra.MaxSelection;
    // addonGroupExtra.MaxSelection = this.state.SelectedExtrasDetail.length > 1 ?  this.state.SelectedExtrasDetail.length - 1 : 1;
    addonGroupExtra.AddonGroupId  = this.state.SelectedExtraId;
    addonGroupExtra.DeletedGroupItemCsv = extraItem.Id;
    addonGroupExtra.Name = this.state.SelectedExtra.Name;
    this.SaveMenuAddonGroupWithDetail(addonGroupExtra);
  }

  CreateExtraGroup(event, values){

    if (this.state.IsSave) return;
		this.setState({ IsSave: true })
	
    var addonGroupExtra = MenuAddonService.AddonGroupExtra;
    addonGroupExtra.MaxSelection =  1;
    addonGroupExtra.AddonGroupId  = 0;

    addonGroupExtra.Name =  Utilities.SpecialCharacterEncode(values.groupName);

    if(!this.state.EditExtraGroupName){
      this.SaveMenuAddonGroupWithDetail(addonGroupExtra);
      return;
    }
    
    addonGroupExtra.MaxSelection = this.state.SelectedExtra.MaxSelection;
    addonGroupExtra.AddonGroupId  = this.state.SelectedExtraId;
    
    //return;
    this.SaveMenuAddonGroupWithDetail(addonGroupExtra);

  }


  SaveExtrasGroupItem(event, values){

    if (this.state.IsSave) return;
		this.setState({ IsSave: true })
    

    var addonGroupExtra = MenuAddonService.AddonGroupExtra;
    var extraItem = this.state.SelectedExtraItem;
    // addonGroupExtra.MaxSelection = this.state.SelectedExtra.MaxSelection;
    addonGroupExtra.AddonGroupId  = this.state.SelectedExtraId;
    addonGroupExtra.Name = Utilities.SpecialCharacterEncode(this.state.SelectedExtra.Name);
    let csv = '';
    let groupName = values.groupName  == undefined ? "" : Utilities.SpecialCharacterEncode(values.groupName);
    let isMandatary = this.state.IsMandatory === true ? 1 : 0;


    let sideItem =  (this.state.IsGroupItem ? this.state.IsGroupSideItem :  this.state.IsSingleSideItem) === true ? 1 : 0;
    let mainItem = (this.state.IsGroupItem ? this.state.IsGroupMainItem :  this.state.IsSingleMainItem)  === true ? 1 : 0;
    // let IsGroupSideItem = this.state.IsGroupSideItem === true ? 1 : 0;
    // let IsGroupMainItem = this.state.IsGroupMainItem === true ? 1 : 0;
    
    let selectedExtraItems = this.state.SelectedExtraItems;
    let price = this.state.IsGroupItem == 1 ? 0 : selectedExtraItems[0].Price;
    for (var itemRow in selectedExtraItems){
      csv = csv + selectedExtraItems[itemRow].Id + (this.state.IsGroupItem == 1 ? '|' + selectedExtraItems[itemRow].Price + '^^^' : '');
    }
    
   
    if(Object.keys(extraItem).length === 0) {
      addonGroupExtra.MaxSelection = this.state.SelectedExtrasDetail.length + 1
      addonGroupExtra.AddedGroupItemCsv = Utilities.FormatCsv(csv, Config.Setting.csvSeperator) + '@@@' + this.state.ExtrasQuantity + '@@@' + this.state.IsGroupItem + '@@@' + groupName + '@@@' + isMandatary + '@@@' + price + "@@@" + mainItem +  "@@@" + sideItem
    }
    else{
      addonGroupExtra.MaxSelection = this.state.SelectedExtrasDetail.length;
      addonGroupExtra.UpdatedGroupItemCsv =  extraItem.Id + '@@@' + this.state.ExtrasQuantity + '@@@' + isMandatary + '@@@' + price + '@@@' + Utilities.FormatCsv(csv, Config.Setting.csvSeperator) + '@@@' + groupName + "@@@" + mainItem +  "@@@" + sideItem
    }
   
    this.SaveMenuAddonGroupWithDetail(addonGroupExtra);
  }



  SearchExtra(e){

    let searchText = e.target.value;
    let filteredData = []
  
    this.setState({SearchExtraText: searchText})
   if(searchText.toString().trim() === ''){
    this.setState({FilterExtraGroup: this.state.ExtrasGroups, IsSearchingGroup: false });
    return;
   }
  
   filteredData = this.state.ExtrasGroups.filter((extra) => {
      
      let arr = searchText.toUpperCase().trim();
      let isExists = false;
  
    
  
        if (extra.Name.toUpperCase().indexOf(arr) !== -1) {
          isExists = true;
         
      }
      
      return isExists
    })

    this.setState({FilterExtraGroup: filteredData, IsSearchingGroup: true});

}  


RenderRightEmptyExtraItems(){
  
  if (this.state.ShowLoaderRightPanel === true) {
    return this.loading()
  }

  return (
    <div className="no-results-wrap"><div><div className="not-found-menu m-b-20">No results matched.</div><div className="cat-heading-wrap">
    <span className="common-heading"></span>
    <span className="add-cat-btn" onClick={() => this.AddEditGroupName(false)} >
      <i className="fa fa-plus m-r-5" ></i><span className="hide-in-responsive">Add New list</span>
    </span></div> </div></div>
  )

}


RenderExtraItem(extraItems){

  if(this.state.ShowLoaderRightPanel===true){
    return this.loading();
  }

  if(extraItems.GroupItems.length === 0){
    return ('')
  }

  let items = extraItems.GroupItems[0];
  let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
    return (
      <div className="extras-row-wrap" key={"dv"+ extraItems.Id}>
        <div className="extras-row">
        <span className="item-n">{items.MetaName === undefined ? items.Name : items.MetaName}  <span>{items.Variety!==undefined && items.Variety!==''  ? ' - '+ items.Variety : ''}</span></span>
          <span className="item-p">{Number(extraItems.Price) === 0 ? "Free" : userObj.EnterpriseRestaurant.Country.CurrencySymbol + extraItems.Price}</span>
          <span className="item-e-d">
            <span onClick={() => this.AddEditExtraItemModal(false, extraItems,false)}>
              <i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Edit"></i>
            </span>
            <span className="sa-warning" onClick={()=>this.setState({ ShowDeleteConfirmation: true, SelectedExtraItem: extraItems, IsGroupDeleteConfirmation: false })}>
              <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Remove"></i>
            </span>
          </span>
        </div>
      </div>
    
    )

}

RenderExtraGroup(extraDetails){
  let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
  return(

      <div className="extras-row-wrap" key={"dv"+ extraDetails.Id}>
        <div className="extras-row">
          <span className="item-n">{Utilities.SpecialCharacterDecode(extraDetails.GroupName)}</span>
          <span className="item-p"></span>
          <span className="item-e-d"><span onClick={() => this.AddEditExtraItemModal(true, extraDetails,false)}>
            <i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Edit"></i>
          </span>
            <span className="sa-warning" onClick={()=>this.setState({ ShowDeleteConfirmation: true, SelectedExtraItem: extraDetails,IsGroupDeleteConfirmation: false })}>
              <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Remove"></i>
            </span>
          </span>
        </div>
        <div className="extras-row-nested">
          {extraDetails.GroupItems.map((detail)  => (

                <div key={"dt-"+ detail.Id} className="extras-single-nested-row">
                <span className="item-n">{detail.MetaName === undefined ? Utilities.SpecialCharacterDecode(detail.Name) : Utilities.SpecialCharacterDecode(detail.MetaName)} <span> {detail.Variety!==undefined && detail.Variety!==''  ? ' - '+ Utilities.SpecialCharacterDecode(detail.Variety) : ''}</span></span>
                <span className="item-p">{detail.Price === "0.00" ? "Free" : userObj.EnterpriseRestaurant.Country.CurrencySymbol + Utilities.FormatCurrency(detail.Price, this.state.countryConfigObj.DecimalPlaces)}</span>
                </div>
          )
          )}
          
        </div>
      </div>

  )

}

RenderExtraRightPanel(){

  let extraItems = this.state.SelectedExtrasDetail;
  let htmlArr = [];

  for (var et = 0; et < extraItems.length; et++){
    htmlArr.push(extraItems[et].IsGroup === "1" ? this.RenderExtraGroup(extraItems[et]) : this.RenderExtraItem(extraItems[et]))
  }

  return(
    <div className="extras-item-detail-wrap">    
     {htmlArr.map((optionHtml) => optionHtml)}
    </div>
  )      

}

MaxSelectionHtml(row){

    // let isSelected = false;

    // if(Number(row) == Number(this.state.SelectedExtra.MaxSelection))
    // isSelected = true;
    
    return(<option key={row} value={row}>{row}</option>);
}

RenderMaxSelectionDropDown(){

 let html = [];

  for (var p=1;p <= this.state.SelectedExtrasDetail.length;p++){

    html.push(this.MaxSelectionHtml(p)
       
    )
  }

  return(
    
      <select className="form-control custom-select" value={this.state.SelectedExtra.MaxSelection}  onChange={(e) => this.setState({ShowMaxSelectionConfirmation: true, SelectedMaxSelection: e.target.value})}>
        {html.map((maxSelection) => maxSelection)}
      </select>
      
  )

}


GetExtrasDetails = async(extraId) => {

  var data = await MenuAddonService.GetExtrasDetail(extraId);
  //this.RenderExtraDetails(data);
  let sortCsvExtraGroup = "";
  let sortCsvExtraItem = "";

  if(data.ExtraItems === undefined){
    return;
  }


  for (var vt = 0; vt < data.ExtraItems.length; vt++){
    
    if(data.ExtraItems[vt].IsGroup=== "1"){
      sortCsvExtraGroup = sortCsvExtraGroup + data.ExtraItems[vt].Id + Config.Setting.csvSeperator;
    }
    else if(data.ExtraItems[vt].IsGroup === "0" && data.ExtraItems[vt].GroupItems.length > 0){
      sortCsvExtraItem = sortCsvExtraItem + data.ExtraItems[vt].Id+ Config.Setting.csvSeperator
    }

  }

  this.setState({ SelectedExtrasDetail : data.ExtraItems, SortCsvExtraGroup: sortCsvExtraGroup, SortCsvExtraItem : sortCsvExtraItem,ShowLoaderRightPanel: false, left: false })
  
  }

  HandleExtrasClick(extra){

      this.setState({SelectedExtraId: extra.Id, SelectedExtra: extra, SelectedExtrasDetail:[],ShowLoaderRightPanel: true});
      this.GetExtrasDetails(extra.Id);
  }


  GetExtras = async () => {
    
    
    this.setState({ classDisplay: '' });
		var data = await MenuAddonService.GetAll(Constants.MenuAddonGroupExtra);
    
    if(data !== undefined && data.length > 0 && this.state.SelectedExtraId === 0){
      this.HandleExtrasClick(data[0]);
    }
    else if(this.state.SelectedExtraId > 0)
    {
      //console.log('1');
      let extra = data.filter((ext) => {
        let valid = false;  
        if(ext.Id === this.state.SelectedExtraId)
          valid = true;    
        
          return valid;
      });
      this.HandleExtrasClick(extra[0]);
    }
      
    this.setState({ ExtrasGroups : data, FilterExtraGroup : data, classDisplay: 'no-display', ShowLoaderLeftPanel: false, ShowMaxSelectionConfirmation: false , ShowLoaderRightPanel: data.length !== 0});
    
    // if(data.length === 0){
    //   this.setState({ShowLoaderRightPanel: false});
    // }

  }

  GetCategories = async () => {

    var data = await CategoryService.GetAll(Utilities.GetEnterpriseIDFromSessionObject());
   
    data.sort((x, y) => ((x.SortOrder === y.SortOrder) ? 0 : ((x.SortOrder > y.SortOrder) ? 1 : -1)))
  
    this.setState({Categories:data});
  
  }


GetExtraPrice(itemId,selectedExtraItem){

  var SelectedItemCsvArray = selectedExtraItem.TableRecordIdsCsv.split('^^^');
  var price = "0";
  SelectedItemCsvArray.forEach(item=>{
      if(item.indexOf(itemId) !== -1)
      {
        price =this.state.IsGroupItem ? item.split('|')[1] : selectedExtraItem.Price ;
      }
})

return price;
}

  GetProducts = async(categoryId)=>{

      let data = await ProductService.GetWithDetails(Utilities.GetEnterpriseIDFromSession(), categoryId);
    
      let prevMetaItem = '';
      let productOption = [];
      let filterProducts = [];
      var isGroupItem = this.state.IsGroupItem;
      var selectedProductId =  this.state.SelectedProductId;
      var selectedExtraItem  = this.state.SelectedExtraItem;

      this.setState({ProductOptionForRender: []})

      for (var i = 0; i < data.length; i++) {
          
        data[i].extraPrice = "0";
        if(Number(data[i].MenuItemMetaId) === Number(selectedProductId) || isGroupItem ){
          data[i].IsSelected = Object.keys(selectedExtraItem).length > 0 && selectedExtraItem.TableRecordIdsCsv.indexOf(data[i].Id) !== -1 ? true : false;
          data[i].extraPrice = Object.keys(selectedExtraItem).length > 0 && selectedExtraItem.TableRecordIdsCsv.indexOf(data[i].Id) !== -1 ? this.GetExtraPrice(data[i].Id,selectedExtraItem) : 0;
          productOption.push(data[i]);
        }

          if(data[i].MenuMetaName !== prevMetaItem){            
            filterProducts.push (data[i]);
            prevMetaItem = data[i].MenuMetaName;
            continue;

          }
          prevMetaItem = data[i].MenuMetaName;

          
      }
    
      //sorting via selected items
     
      if(!isGroupItem){
      this.setState({FilterProducts:filterProducts, Products: data, ProductOptons: productOption, ProductOptionForRender: this.SortSelectedItems(productOption)});
      return;
    }    

    this.setState({SelectedProductId: 0, Products: data, ProductOptons: data, ProductOptionForRender: this.SortSelectedItems(data)})
  
  }


  SortSelectedItems(productWithOption){

    let selectedProduct = [];
    let unSelectedProduct = [];

    productWithOption.forEach(po => {

      let menuItemMetaId = po.MenuItemMetaId;
      if(po.IsSelected) {
      productWithOption.forEach((po) => {
      
      if(po.MenuItemMetaId === menuItemMetaId){
        selectedProduct.push(po);
      }

      });
    } 
    });


    productWithOption.forEach((po) => {
      
      if(selectedProduct.indexOf(po) == -1) {
        unSelectedProduct.push(po);
      }

      });
     
    
    let productOptions =  selectedProduct.concat(unSelectedProduct);

    return productOptions;
  }

  LoadExtras(){
      
    let extras = this.state.FilterExtraGroup;


    if(this.state.ShowLoaderLeftPanel===true){
      return this.loading()
    }


      if(extras === undefined)
			return ('');

		//  console.log('inside Load Extras Extras:' + extras);
    
      if(extras.length === 0){
        
        return (`${Labels.Extra}(s) not found`);
        
      }
		  var htmlActive = [];

		  for (var i=0; i < extras.length; i++){	
			  if(extras[i].IsPublished === true){
				  htmlActive.push(this.RenderLefExtrasPanel(extras[i]));
			  }
		  }
	
		  return(<ul>{htmlActive.map((optionHtml) => optionHtml)}</ul>)
		
	}

	RenderLefExtrasPanel(t){
		return (<li key={t.Id} onClick={ this.state.SelectedExtraId === t.Id ? null : () => this.HandleExtrasClick(t)} className={this.state.SelectedExtraId === t.Id ? "active" : "" }>
            <span id="top" onClick={this.handleBottomClick}  className="menu-left-list-label">{ Utilities.SpecialCharacterDecode(t.Name) + ' (' + t.ItemCount + ')'}</span></li>)
   }
   handleBottomClick () {
		setTimeout(
		  function() {
			smoothScroll.scrollTo('top');
		  }
		  ,
		  1000
	  );
		
	  }

  DeleteExtraGroup = async() =>{
    
    if(Object.keys(this.state.SelectedExtraItem).length > 0){

      this.DeleteExtraItem();
      Utilities.notify("Successfully deleted.","s");
      return;
    }

    let isDeleted = await MenuAddonService.Delete(this.state.SelectedExtra.Id, Constants.MenuAddonGroupExtra);
    
    this.setState({ShowDeleteConfirmation: false, SelectedExtraId : 0, SelectedExtraItem: {}});	
    
    if(isDeleted) {			
			this.GetExtras();
      Utilities.notify("Successfully deleted.","s");
		}
		
   }

   SaveSortExtraGroup = async() =>{

      let csv = this.state.SortCsvExtraItem + Config.Setting.csvSeperator + this.state.SortCsvExtraGroup;
      
      //csv = Utilities.FormatCsv(csv, Config.Setting.csvSeperator);
      // console.log(csv);

      let isUpdated = await MenuAddonService.UpdateSort(csv);

      if(isUpdated === true){
        this.GetExtrasDetails(this.state.SelectedExtraId);
        this.setState({Sort:false});
      }

   }
 
   GetUpdatedExtraSort(extras){
      
      let sortCSV= '';
      for(var u = 0; u < extras.length; u++){
      sortCSV += extras[u].id + Config.Setting.csvSeperator;
      }
  
      sortCSV = Utilities.FormatCsv(sortCSV, Config.Setting.csvSeperator);
      
      if( extras.length > 0 && extras[0].IsGroup=== "1"){
        this.setState({SortCsvExtraGroup:sortCSV})
      }
      else if( extras.length > 0 && extras[0].IsGroup !== "1"){
        this.setState({SortCsvExtraItem:sortCSV})
      }
    
      // console.log(sortCSV)
   }

  GenerateSweetConfirmationWithCancel(){
    
    var extraItem = this.state.SelectedExtraItem;
    var name = Object.keys(extraItem).length > 0 && !this.state.IsGroupDeleteConfirmation ?  (extraItem.IsGroup === "1"  ? Utilities.SpecialCharacterDecode(extraItem.GroupName) : extraItem.GroupItems[0].MetaName === undefined ? Utilities.SpecialCharacterDecode(extraItem.GroupItems[0].Name) : Utilities.SpecialCharacterDecode(extraItem.GroupItems[0].MetaName))  :  Utilities.SpecialCharacterDecode(this.state.SelectedExtra.Name);
    //var delteMsg = 'Are you sure?';
    var deleteMsgname='Remove ' + name + '?';
  
  return( 
		
	<SweetAlert
		show={this.state.ShowDeleteConfirmation}
		title={''}
		text={deleteMsgname}
    showCancelButton
    confirmButtonText="Yes"
		onConfirm={() => {this.DeleteExtraGroup()}}
		onCancel={() => { this.setState({ ShowDeleteConfirmation: false});
		}}
		onEscapeKey={() => this.setState({ ShowDeleteConfirmation: false})}
		// onOutsideClick={() => this.setState({ ShowDeleteConfirmation: false})}
	/>
	)
}
  

GenerateSweetMaxSelectionConfirmation(){
    
  var extraItem = this.state.SelectedExtraItem;
  var name = Object.keys(extraItem).length > 0 && !this.state.IsGroupDeleteConfirmation ?  (extraItem.IsGroup === "1"  ? Utilities.SpecialCharacterDecode(extraItem.GroupName) : extraItem.GroupItems[0].MetaName === undefined ? Utilities.SpecialCharacterDecode(extraItem.GroupItems[0].Name) : Utilities.SpecialCharacterDecode(extraItem.GroupItems[0].MetaName))  : Utilities.SpecialCharacterDecode(this.state.SelectedExtra.Name);
  var confirmationMsg='Do you want to change maximum selection for ' + name + '?';

 return( 
  
 <SweetAlert
  show={this.state.ShowMaxSelectionConfirmation}
  title={''}
  text={confirmationMsg}
  showCancelButton
  confirmButtonText="Yes"
  onConfirm={() => {this.ChangeMaxSelection()}}
  onCancel={() => { this.GetExtras();
  }}
  onEscapeKey={() => this.setState({ ShowMaxSelectionConfirmation: false})}
  // onOutsideClick={() => this.setState({ ShowMaxSelectionConfirmation: false})}
 />
 )
}

CatgoryChangeEvenListner(event){

  this.setState({SelectedCategoryId: event.target.value})
  // console.log(event.target.value);
  this.GetProducts(event.target.value);
}

ProductChangeEvenListner(event){
      
      var productOption = [];
      var products = this.state.Products;
     // var prevMetaItem = '';
     // var isGroupItem = this.state.IsGroupItem;

      for (var i = 0; i < products.length; i++) {
          
        if(Number(products[i].MenuItemMetaId) === Number(event.target.value) ){
          
          products[i].IsSelected = false;
          productOption.push(products[i]);
        }
        
       // prevMetaItem = products[i].MenuMetaName;
      }

      this.setState({SelectedProductId: event.target.value, ProductOptons: productOption, ProductOptionForRender:productOption})
}

 ChangeMandatoryStatus(e,mandatory){  
  this.setState({IsMandatory: mandatory});
 }

 ChangeSideORMainItem(e,value,name){  
  switch (name) {
    case "SSI":
      this.setState({ IsSingleSideItem: value , IsSingleMainItem: value == true ? !value : false})
      break;
    case "SMI":
      this.setState({ IsSingleSideItem: value == true ? !value : false , IsSingleMainItem: value})
      break;
    case "GSI":
      this.setState({ IsGroupSideItem: value , IsGroupMainItem: value == true ? !value : false})
      break;
    case "GMI":
      this.setState({ IsGroupSideItem: value == true ? !value : false , IsGroupMainItem: value})
      break;
  
    default:
      break;
  }
  // this.setState({IsMandatory: mandatory});
 }

 ChangeMaxSelection()
 {
    var addonGroupExtra = MenuAddonService.AddonGroupExtra;
    //var extraItem = this.state.SelectedExtraItem;
    addonGroupExtra.MaxSelection = this.state.SelectedMaxSelection;
    addonGroupExtra.AddonGroupId  = this.state.SelectedExtraId;
    addonGroupExtra.Name = this.state.SelectedExtra.Name;
    this.SaveMenuAddonGroupWithDetail(addonGroupExtra);

 }
 countDecimals(value) {
  return value % 1 ? value.toString().split(".")[1].length : 0;
};

OnPriceChange(e,id){

let price = e.target.value
let selectedExtraItems = this.state.SelectedExtraItems;

selectedExtraItems.forEach(item=>{
  
if(Number(item.Id) === Number(id)){
  item.Price = Utilities.IsNumber(price) ? Number(price) : price ;
}

});

this.setState({SelectedExtraItems: selectedExtraItems});

}

OnCheck(productWithDetail, option ,selectedValue){
  
  //console.log(selectedValue);
  //console.log(option.Id);
  //console.log(productWithDetail.length);
  let isGroup = this.state.IsGroupItem;
  let selectedExtraItems = isGroup ? this.state.SelectedExtraItems : [];
  let selectedProduct = this.state.ProductOptons;

  selectedProduct.forEach(p=>{
    
    if(option.MenuItemMetaId == p.MenuItemMetaId && option.Id != p.Id) {
      p.IsSelected = false;
      // p.Price = "";
      if(Utilities.GetObjectArrId(p.Id,selectedExtraItems) != "-1") selectedExtraItems.splice(Utilities.GetObjectArrId(p.Id,selectedExtraItems),1);
      
    }
    else if(option.Id == p.Id){
      p.IsSelected = true;
      selectedValue?  selectedExtraItems.push({Id:option.Id, Price: 0.00}) : selectedExtraItems.splice(Utilities.GetObjectArrId(option.Id,selectedExtraItems),1);
    }

  });

    this.setState({ProductOptons: selectedProduct, SelectedExtraItems: selectedExtraItems, ProductOptionForRender: selectedProduct})


 // let itemCsv =  this.state.SelectedItemCSV

  //if(selectedValue === true){
  //  itemCsv = itemCsv + option.Id + Config.Setting.csvSeperator;
 // }
 // console.log(itemCsv);

}

RenderProductOptionHtml(productOptions, product){

    if(productOptions.IsDeleted === true)
      return('');

   let productOptionsIndex = Utilities.GetObjectArrId(productOptions.Id,this.state.SelectedExtraItems);
  // let selectedExtraItems = this.state.SelectedExtraItem
  let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
    return(
      <li key={'li-' + productOptions.Id}>
        <div className="item-single-checked">
          <AvField type="checkbox" value = {productOptionsIndex !== "-1"} checked= {Utilities.GetObjectArrId(productOptions.Id,this.state.SelectedExtraItems) !== "-1"} className="option-input radio" name={'chk-'+ productOptions.Id} onChange = {(e) => this.OnCheck(product, productOptions, e.target.checked)} />
          <label htmlFor={'chk-'+ productOptions.Id}>{productOptions.Name}<span className="common-color-7"> {'('+userObj.EnterpriseRestaurant.Country.CurrencySymbol + productOptions.Price})</span></label>
          <span className={productOptionsIndex !== "-1" ? 'input-group' : "input-group no-display" } id={'dv-'+productOptions.Id}>
            <span className="input-group-prepend">
              <span className="input-group-text">{userObj.EnterpriseRestaurant.Country.CurrencySymbol}</span>
            </span>
            <AvField type="text" className="form-control form-control-left" value={productOptionsIndex !== "-1" ? this.state.SelectedExtraItems[productOptionsIndex].Price : productOptions.extraPrice}  name={'txt-'+ productOptions.Id} onChange={(e) => this.OnPriceChange(e,productOptions.Id)}
            validate={{myValidation: PriceValidation}}
            />
          </span>
        </div>
      </li>

    )

}

RenderProductInfoWithDetail(options, productWithOption, isGroupItem){

  return(
    <AvGroup className="modal-form-group" key={options[0].MenuItemMetaId}>
      <div className="add-item-rd-row" >
      <div className="control-label">{options.length === 0 ? '' : Utilities.SpecialCharacterDecode(options[0].MenuMetaName)}</div>
     
      <ul className="icheck-list">
      {options.map(option => 
              this.RenderProductOptionHtml(option, productWithOption)
            )}
      </ul>
      </div>
    </AvGroup>
  )

}

RenderProductOption(){

     // let productId  = this.state.SelectedProductId;
      //let products = this.state.FilterProducts; 
      let productWithOption = this.state.ProductOptionForRender; 
      let productOption = [];
      var isGroupItem = this.state.IsGroupItem;

      
      var prevMetaItem = '';

      var html = [];

      for (var i = 0; i < productWithOption.length; i++) {
          
          
          if(productWithOption[i].MenuMetaName !== prevMetaItem && prevMetaItem !== ''){
            
            html.push (this.RenderProductInfoWithDetail(productOption ,productWithOption, isGroupItem));
            productOption = [];
             
            productOption.push(productWithOption[i]);
            prevMetaItem = productWithOption[i].MenuMetaName;
            
            continue;
          
          }
          
          productOption.push(productWithOption[i]);
          prevMetaItem = productWithOption[i].MenuMetaName;
          
      }
      
      if(productOption.length > 0){
         html.push (this.RenderProductInfoWithDetail(productOption, productWithOption, isGroupItem));
      }

  return(
    <div>{html.map((optionHtml) => optionHtml)}</div>
  )

}

IncreaseExtrasQuantity(){
  
  if(this.state.ExtrasQuantity < 99 ){
    this.setState({ExtrasQuantity: this.state.ExtrasQuantity + 1});
  }
}

DecreaseExtrasQuantity(){

  if( this.state.ExtrasQuantity > 1){
    this.setState({ExtrasQuantity: this.state.ExtrasQuantity - 1});
  }


}


CancelSearching(){

this.setState({
  FilterExtraGroup: this.state.ExtrasGroups,
   IsSearchingGroup: false,
   SearchExtraText: ''
})
}

GenerateExtraGroupItemSortModel(){

  if(!this.state.Sort){
    return('');
  }


  return(
<Modal isOpen={this.state.Sort} className={this.props.className}>
    <ModalHeader>Sort items</ModalHeader>
    <ModalBody>
      <div className="m-b-15">Use mouse or finger to drag items and sort their positions.</div>
      <div className="sortable-wrap sortable-item">
        Items <br/>

         <SortableContainer  
            items={this.state.SingleExtraItem}
            onSortEnd={this.onSortEnd}
             >
           </SortableContainer>

        <br/>
        Group Items <br/>
        <SortableContainerGroupItem  
            items={this.state.GroupExtraItem}
            onSortEnd={this.onGroupSortEnd}
             >
           </SortableContainerGroupItem>
      
      </div>
    </ModalBody>
    <ModalFooter>           

      <Button color="secondary" onClick = {this.SortModal}>Cancel</Button>
      <Button color="primary" onClick={() => this.SaveSortExtraGroup()}>Save</Button>
    </ModalFooter>
    </Modal>
  )

}

GenerateExtraItemModel(){

if(!this.state.ExtraItemModel){
  return('');
}

let ModalTitle = this.state.IsNewItem ? ("Add item" + (this.state.IsGroupItem ? ' group' : '')) : ("Edit item"  + (this.state.IsGroupItem ? ' group' : ''))

  return (
    <Modal isOpen={this.state.ExtraItemModel} className={this.props.className}>
    <ModalHeader>{ModalTitle}</ModalHeader>

      <ModalBody className="padding-0">
        <AvForm onValidSubmit = {this.SaveExtrasGroupItem}>
        <div className="add-single-item-wrap  padding-20">
        <AvGroup className="modal-form-group"> 
          <div className="add-item-row switch-toggle-wrap">
            <label  className="font-16" htmlFor="chkMandatary">Is this a mandatory item</label>
            <AppSwitch name="chkMandatary" onChange={(e) => this.ChangeMandatoryStatus(e,e.target.checked)} checked={this.state.IsMandatory} className={'mx-1'} variant={'3d'} color={'success'} label dataOn={'\u2713'} dataOff={'\u2715'}/>
          </div>
          {
            !this.state.IsGroupItem &&
            <div>
              <div className="add-item-row switch-toggle-wrap">
                <label  className="font-16" htmlFor="chkMandatary">Is this a main item</label>
                <AppSwitch name="chkMandatary" onChange={(e) => this.ChangeSideORMainItem(e,e.target.checked, "SMI")} checked={this.state.IsSingleMainItem} className={'mx-1'} variant={'3d'} color={'success'} label dataOn={'\u2713'} dataOff={'\u2715'}/>
              </div>
              <div className="add-item-row switch-toggle-wrap">
                <label  className="font-16" htmlFor="chkMandatary">Is this a side item</label>
                <AppSwitch name="chkMandatary" onChange={(e) => this.ChangeSideORMainItem(e,e.target.checked, "SSI")} checked={this.state.IsSingleSideItem} className={'mx-1'} variant={'3d'} color={'success'} label dataOn={'\u2713'} dataOff={'\u2715'}/>
              </div>
            </div>
          }
          {
            this.state.IsGroupItem &&
            <div>
              <div className="add-item-row switch-toggle-wrap">
                <label  className="font-16" htmlFor="chkMandatary">Are these main items</label>
                <AppSwitch name="chkMandatary" onChange={(e) => this.ChangeSideORMainItem(e,e.target.checked, "GMI")} checked={this.state.IsGroupMainItem} className={'mx-1'} variant={'3d'} color={'success'} label dataOn={'\u2713'} dataOff={'\u2715'}/>
              </div>
              <div className="add-item-row switch-toggle-wrap">
                <label  className="font-16" htmlFor="chkMandatary">Are these side items</label>
                <AppSwitch name="chkMandatary" onChange={(e) => this.ChangeSideORMainItem(e,e.target.checked, "GSI")} checked={this.state.IsGroupSideItem} className={'mx-1'} variant={'3d'} color={'success'} label dataOn={'\u2713'} dataOff={'\u2715'}/>
              </div>
            </div>
          }
        </AvGroup>
      
        <div className="add-item-row" style={{ justifyContent: 'space-between' }}>
            <span className="font-16">Quantity</span>
            <span>
              <span className="maximum-count-wrap">
                <span className="minus-btn" onClick={this.DecreaseExtrasQuantity}><i className="fa fa-minus" aria-hidden="true"></i></span>
                <span className="minus-plus-count">{this.state.ExtrasQuantity}</span>
                <span className="plus-btn" onClick={this.IncreaseExtrasQuantity}><i className="fa fa-plus" aria-hidden="true"></i></span>
              </span>
            </span>
        </div>
        {this.state.IsGroupItem ? 
         (
              <AvGroup className="modal-form-group">
                <div className="add-item-row">
                  <div className="name-field form-group">
                    <AvField errorMessage="This is a required field" name="groupName"  value={Utilities.SpecialCharacterDecode(this.state.SelectedGroupItemName)} type="text" className="form-control" required />
                    <span>Name</span>
                  </div>
                </div>
              </AvGroup>
        ) : ('')}
      
        <AvGroup className="modal-form-group">
          <div className="add-item-row">
            
             <select className="select2 form-control custom-select" name="ddlCategory" onChange={(e) => this.CatgoryChangeEvenListner(e)} style={{ width: '100%', height: '36px' }}> 
                <option key={'pde-' + 0} value="0">Choose Category</option>
                {this.state.Categories.map((cate)=> Number(cate.Id) === Number(this.state.SelectedCategoryId) ? <option  key={'cte-' + cate.Id} value={cate.Id} selected>{Utilities.SpecialCharacterDecode(cate.Name)}</option> : <option  key={'cte-' + cate.Id} value={cate.Id}>{Utilities.SpecialCharacterDecode(cate.Name)}</option>)}
              </select>
   
          </div>
          </AvGroup>
          {this.state.IsGroupItem ? ('') : (
          <AvGroup className="modal-form-group">
            <div className="add-item-row">

             <select className="form-control custom-select"  onChange={(e) => this.ProductChangeEvenListner((e))}> 
                <option key={'pde-' + 0} value="0">Choose Product</option>
                {this.state.FilterProducts.map((prd)=> Number(prd.MenuItemMetaId) === Number(this.state.SelectedProductId) ? <option  key={'prd-' + prd.MenuItemMetaId} value={prd.MenuItemMetaId} selected>{Utilities.SpecialCharacterDecode(prd.MenuMetaName)}</option>: <option  key={'prd-' + prd.MenuItemMetaId} value={prd.MenuItemMetaId}>{Utilities.SpecialCharacterDecode(prd.MenuMetaName)}</option>)}
               </select>
            </div>
          </AvGroup>
          )}
          {this.RenderProductOption()}
          </div>
        <FormGroup className="modal-footer">
          <Button color="secondary" onClick={()=> this.AddEditExtraItemModal(false, {})}>Cancel</Button>
          <Button disabled={this.state.SelectedExtraItems.length == 0} color="primary" style={{ marginRight: 10 }}>
              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                : <span className="comment-text">Save</span>}
            </Button>
							
          
          {/* <Button color="success">Save</Button> */}
          
        </FormGroup>
  
        </AvForm>
      </ModalBody>
  
  </Modal>

  )


}


GenerateAddEditExtraGroupModel()
{

if(!this.state.AddEditGoupModal){
  return('');
}

  return (  
    <Modal isOpen={this.state.AddEditGoupModal}  className="modal-md">
      <ModalHeader >{this.state.EditExtraGroupName ? 'Edit' : `Add New ${Labels.Option_List}`}</ModalHeader>
      <ModalBody className="padding-0">
        <AvForm onValidSubmit={this.CreateExtraGroup}>
        <div className="padding-20">
        <FormGroup className="modal-form-group">
          <div className="name-field form-group">
            <AvField errorMessage="This is a required field" name="groupName" type="text" value={this.state.EditExtraGroupName ? Utilities.SpecialCharacterDecode(this.state.SelectedExtra.Name) : '' } className="form-control" required />
            <span>Name</span>
          </div>
          </FormGroup>

        <br/>  <br/>  <br/>  <br/>  <br/>  <br/>  <br/>
</div>
<FormGroup className="modal-footer">

            <Button color="secondary" onClick={()=>this.AddEditGroupName(false)}>Cancel</Button>
                    
            <Button color="primary" style={{ marginRight: 10 }}>
              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                : <span className="comment-text">Save</span>}
            </Button>
							
            {/* <Button color="success">Save</Button>  */}
          </FormGroup>
        </AvForm>
      </ModalBody>
    </Modal>
);

}

render() {
    const ModalDiv = this.state.isMobile;
 
    return (<div>
<div class="topping-l-wrap card-new-title">
  <div class="cat-heading-wrap">
    <h3 class="card-title ">{Labels.Option_List}</h3>
    </div>
    <span className="add-cat-btn" onClick={() => this.AddEditGroupName(false)} >
              <i className="fa fa-plus m-r-5" ></i><span className="hide-in-responsive">New list</span>
            </span>
            </div>


      	<div className={this.state.scrolled?'menu-page-wrap extra-page-wrap affix':'menu-page-wrap extra-page-wrap affix-top'}>
        <div className="menu-left-penal ">
        
          <div className="select-cat-btn-res" onClick={this.leftpenal}>
            <span>{Object.keys(this.state.SelectedExtra).length === 0 ? '' : Utilities.SpecialCharacterDecode(this.state.SelectedExtra.Name)}
            </span>
            <span className="change-cat-modal">Change
            </span>
          </div>
          {ModalDiv ? (
            <Modal isOpen={this.state.left} toggle={this.leftpenal} className={this.props.className}>
              <ModalHeader toggle={this.leftpenal}>Select {Labels.Option_List}</ModalHeader>
              <ModalBody className="menu-page-wrap" >
                <div className="menu-left-penal ">
                  <div className="m-b-20 m-t-20" style={{ position: 'relative' }}>
                    <input type="text" className="form-control common-serch-field" placeholder="Search List" value={this.state.SearchExtraText} onChange={this.SearchExtra} />
                    <i style={{ position: 'absolute', top: '11px', left: '12px', color: '#777' }} className="fa fa-search" aria-hidden="true"></i>
                    {this.state.IsSearchingGroup ?  <span className="cross-add-search" onClick={() => this.CancelSearching()}>
                  <i className="fa fa-times" aria-hidden="true" ></i>
                  </span> : ""}
                  </div>
                  <div className="menu-left-cat-list">
                    {this.LoadExtras()}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                {/* <Button color="secondary" onClick={this.leftpenal}>Cancel</Button>
                <Button color="success" onClick={this.leftpenal}>Done</Button> */}

              </ModalFooter>
            </Modal>


          ) : (
              <div id="leftcategory" >
                <div className="m-b-20" style={{ position: 'relative' }}>
                  <input type="text" className="form-control common-serch-field" placeholder="Search List" value={this.state.SearchExtraText} onChange={this.SearchExtra} />
                  <i style={{ position: 'absolute', top: '11px', left: '12px', color: '#777' }} className="fa fa-search" aria-hidden="true"></i>
                  {this.state.IsSearchingGroup ?  <span className="cross-add-search" onClick={() => this.CancelSearching()}>
                  <i className="fa fa-times" aria-hidden="true" ></i>
                  </span> : ""}
                </div>
                <div className="menu-left-cat-list">

                  <div className={this.state.classDisplay}>
                    
                  </div>

                  {this.LoadExtras()}
                </div>
              </div>
            )}
        </div>

        <div className="menu-right-penal">        { this.state.FilterExtraGroup.length == 0 ? this.RenderRightEmptyExtraItems() :
         <div>
         <div className="extras-header-wrap">
        <div className="extras-header-left">
              <span className="common-heading" >{Object.keys(this.state.SelectedExtra).length === 0 ? '' : Utilities.SpecialCharacterDecode(this.state.SelectedExtra.Name)}</span> 
              <span>
                <i data-toggle="modal" data-tip data-for='Edit-c' data-target="#editNewExtrasList" className="fa fa-pencil-square-o" aria-hidden="true"  title="" data-placement="top" data-original-title="Edit"  onClick={() => this.AddEditGroupName(true)}></i>
              Edit
              <ReactTooltip id='Edit-c'><span>Edit</span></ReactTooltip>
              </span>
            </div>
            <div className="extras-buttons-wrap">
             {this.state.SelectedExtrasDetail.length > 1 ? <span onClick={() => this.SortModal()}><i className="fa fa-sort-amount-asc" aria-hidden="true"></i>Sort items</span> : ""}
              {/* <span><i className="fa fa-check" aria-hidden="true"></i>Save</span> */}
              <span onClick={(e)=>this.setState({ ShowDeleteConfirmation: true, IsGroupDeleteConfirmation: true })}><i className="fa fa-trash" aria-hidden="true"></i>Delete</span>
            </div>
          </div>
          <div className="extras-item-wrap">
            <div className="extas-common-heading">
              Items
            </div>

            {this.RenderExtraRightPanel()}
                      
            <div className="extras-maxium-item-select extra-resp-maxium-wrap">
              <span className="font-16" >Maximum item selection</span>
            <span style={{marginLeft: '20px'}}>
         
            {this.RenderMaxSelectionDropDown()}
              
            </span>
              
            </div>

          

          </div>
         
          
          <div className="extras-footer-buttons-wrap">
            <div>
              <button type="button" className="btn btn-primary btn-icon-center" onClick={() => this.AddEditExtraItemModal(false, {},true)}><i className="fa fa-plus m-r-5"></i>Single item</button>
              <button type="button" className="btn btn-primary btn-icon-center"onClick={() => this.AddEditExtraItemModal(true, {},true)} style={{ marginLeft: '15px' }} ><i className="fa fa-plus m-r-5"></i>Group item</button>
            </div>
            <div className="extras-buttons-wrap">
            {this.state.SelectedExtrasDetail.length > 1 ?  <span onClick={() =>this.SortModal()}><i className="fa fa-sort-amount-asc" aria-hidden="true"></i>Sort items</span> : ""}
              {/* <span><i className="fa fa-check" aria-hidden="true"></i>Save</span> */}
              <span onClick={()=>this.setState({ ShowDeleteConfirmation: true, IsGroupDeleteConfirmation: true })}><i className="fa fa-trash" aria-hidden="true"></i>Delete</span>
            </div>

          </div>
          </div>
        }
        </div>

        {this.GenerateSweetConfirmationWithCancel()}
        {this.GenerateSweetMaxSelectionConfirmation()}
        {this.GenerateExtraGroupItemSortModel()}
        {this.GenerateExtraItemModel()}
        {this.GenerateAddEditExtraGroupModel()}      
      
            
      </div>
      </div>
    );
  }

}
// scroll code

var smoothScroll = {
	timer: null,

	stop: function () {
		clearTimeout(this.timer);
	},

	scrollTo: function (id, callback) {
		var settings = {
			duration: 1000,
			easing: {
				outQuint: function (x, t, b, c, d) {
					return c*((t=t/d-1)*t*t*t*t + 1) + b;
				}
			}
		};
		var percentage;
		var startTime;
		var node = document.getElementById(id);
		var nodeTop = node.offsetTop;
		var nodeHeight = node.offsetHeight;
		var body = document.body;
		var html = document.documentElement;
		var height = Math.max(
			body.scrollHeight,
			body.offsetHeight,
			html.clientHeight,
			html.scrollHeight,
			html.offsetHeight
		);
		var windowHeight = window.innerHeight
		var offset = window.pageYOffset;
		var delta = nodeTop - offset + 30;
		var bottomScrollableY = height - windowHeight;
		var targetY = (bottomScrollableY < delta) ?
			bottomScrollableY - (height - nodeTop - nodeHeight + offset):
			delta;

		startTime = Date.now();
		percentage = 0;

		if (this.timer) {
			clearInterval(this.timer);
		}

		function step () {
			var yScroll;
			var elapsed = Date.now() - startTime;

			if (elapsed > settings.duration) {
				clearTimeout(this.timer);
			}

			percentage = elapsed / settings.duration;

			if (percentage > 1) {
				clearTimeout(this.timer);

				if (callback) {
					callback();
				}
			} else {
				yScroll = settings.easing.outQuint(0, elapsed, offset, targetY, settings.duration);
				window.scrollTo(0, yScroll);
				this.timer = setTimeout(step, 20);     
			}
		}

		this.timer = setTimeout(step, 20);
	}
};

export default Extras;
