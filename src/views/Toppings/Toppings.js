import React, { Component } from 'react';
import { Table,  Button,  Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
// import Nestable from 'react-nestable';
import {sortableContainer, sortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import SweetAlert from 'sweetalert-react'; // eslint-disable-line import/no-extraneous-dependencies
import 'sweetalert/dist/sweetalert.css';
import * as MenuAddonService from '../../service/MenuAddonGroup';
import * as ToppingService from '../../service/Topping';
import Constants from  '../../helpers/Constants';
import * as Utilities from '../../helpers/Utilities';
import {  Link } from 'react-router-dom';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import Loader from 'react-loader-spinner';
import Config from '../../helpers/Config';
import ReactTooltip from 'react-tooltip';
import {SetMenuStatus} from '../../containers/DefaultLayout/DefaultHeader'
import Labels from '../../containers/language/labels';
const SortableItem = sortableElement(({value}) => <li className="sortableHelpernew">{value}</li>);

const SortableContainer = sortableContainer(({items}) => {
  
  if(items === undefined) {return;}
 
  return (
   <ul className="sortableHelpernew-wrap">
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`}style={{zIndex: 100000}}  index={index} value={value.name} />
      ))}
    </ul>
  );
});
class Toppings extends Component {
	onSortEnd = ({oldIndex, newIndex}) => {
		this.setState(({AddonGroupDetails}) => ({
			AddonGroupDetails: arrayMove(AddonGroupDetails, oldIndex, newIndex),
		}));
	
		 this.GetUpdatedAddonGroupSort(this.state.AddonGroupDetails);
	
	  };


	loading = () =>   <div className="page-laoder">
	<div> 
	  <Loader type="Oval" color="#ed0000" height={50} width={50}/>  
	  <div className="loading-label">Loading.....</div>
	  </div>
  </div> 

Rightloading = () =>   <div className="right-laoder"> 
<div className="innerloader"> 
	<Loader type="Oval" color="#ed0000" height={50} width={50}/>  
	<div className="loading-label">Loading.....</div>
	</div>
</div> 

innerLoading = () =>   <div className="page-laoder page-laoder-menu">
<div className="loader-menu-inner"> 
  <Loader type="Oval" color="#ed0000" height={50} width={50}/>  
  <div className="loading-label">Loading.....</div>
  </div>
</div> 

	constructor(props) {

		super(props);
		this.state = {
			GlobelGroupItems: [],
			FilterGlobelGroupItems:[],
			checkboxGroupItems : '',
			AddonGroups: [],
			FiltersAddonGroups:[],
			ActiveAddonGroup:[],
			AddonGroupItems:[],
			SortAddonGroupIdsCSV: '',
			SelectedAddonGroupId : 0,
			SelectedAddonGroupName: '',
			AddonGroupDetails: [],
			SelectedAddonGroup: {},
			SelectedAddonGroupItemId : 0,
			SelectedAddonGroupItemName: '',
			SelectedAddonGroupItems: [],
			activeItemCheck: true,
			scrolled:false,
			modal: false,
			sort: false,
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
			addcategory: false,
			editcategory: false,
			editToppingName: false,
			edititem: false,
			addtopping: false,
			edittopping: false,
			additem: false,
			additemgroup: false,
			classDisplay: 'no-display',
			MessageClass: 'no-display',
			RightLoaderClass: 'no-display',
			MessageText: '',
			ModalMessageClass: 'no-display',
			ModalMessageText: '',
			ShowDeleteConfirmation: false,
			ShowDeleteToppingConfirmation: false,
			deleteConfirmationModelText : '',
			ShowLoaderRightPanel: true,
			ShowLoaderLeftPanel: true,
			show: false,
			ToppingModalMessageClass:'',
			ToppingModalMessageText: '',
			SortAddonGroupNameArray: [],
			SearchToppingGroupText:'',
			SearchToppingGroupItemText:'',
			IsSearchingGroup: false,
			IsSearchingItem: false,
			IsSave: false,
			countryConfigObj: JSON.parse(localStorage.getItem(Constants.Session.COUNTRY_CONFIGURATION))

		};
		

		this.toggle = this.toggle.bind(this);
		this.leftpenal = this.leftpenal.bind(this);
		this.addToppingList = this.addToppingList.bind(this);
		this.sortModal = this.sortModal.bind(this);
		this.addItemModal = this.addItemModal.bind(this);
		this.editItemModal = this.editItemModal.bind(this);
		this.addgroupItemModal = this.addgroupItemModal.bind(this);
		this.editgroupItemModal = this.editgroupItemModal.bind(this);
		this.addCategoryModal = this.addCategoryModal.bind(this);
		this.editCategoryModal = this.editCategoryModal.bind(this);
		this.editToppingNameModal = this.editToppingNameModal.bind(this);
		this.handleAddonGroupItemClick = this.handleAddonGroupItemClick.bind(this);
		this.handleToppingEditClick = this.handleToppingEditClick.bind(this);
		this.SearchAddonGroup = this.SearchAddonGroup.bind(this);
		this.SearchAddonGroupItems = this.SearchAddonGroupItems.bind(this);
		this.GetUpdatedAddonGroupSort = this.GetUpdatedAddonGroupSort.bind(this);
		this.handleGroupEditSubmit = this.handleGroupEditSubmit.bind(this);
		this.handleGroupSaveSubmit = this.handleGroupSaveSubmit.bind(this);
		this.handleToppingEditSubmit = this.handleToppingEditSubmit.bind(this);
		this.handleAddonGroupSaveSubmit = this.handleAddonGroupSaveSubmit.bind(this);
		this.handleDeleteTopping = this.handleDeleteTopping.bind(this);
		this.deleteAddonGroupModal = this.deleteAddonGroupModal.bind(this);
		this.deleteToppingModal = this.deleteToppingModal.bind(this);
		this.GetUpdatedAddonGroupSortByName = this.GetUpdatedAddonGroupSortByName.bind(this);
		
	}
	toggle() {
		this.setState({
			modal: !this.state.modal,
		})
	}
	addToppingList() {
		this.setState({
			addtopping: !this.state.addtopping,
			SearchToppingGroupItemText: "",
			IsSearchingItem: false,
			SelectedAddonGroupItems: [],
			ToppingModalMessageText: "",
			ToppingModalMessageClass: "",
			
		})
	}
	editCategoryModal() {
		this.setState({editcategory: !this.state.editcategory, FilterGlobelGroupItems: this.state.GlobelGroupItems, SortAddonGroupNameArray: [],SearchToppingGroupItemText: "",IsSearchingItem: false})
	}
	editToppingNameModal() {
		this.setState({editToppingName: !this.state.editToppingName,})
	}
	addCategoryModal() {
		this.setState({addcategory: !this.state.addcategory, FilterGlobelGroupItems: this.state.GlobelGroupItems,SearchToppingGroupItemText: "",IsSearchingItem: false, SelectedAddonGroupItems: []})
	}
	leftpenal() {
		this.setState({
			left: !this.state.left,
		});
	}
	sortModal() {
		this.setState({
			sort: !this.state.sort,
		});
	}

	addItemModal() {
		this.setState({
			additem: !this.state.additem,
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
	deleteAddonGroupModal(){
		this.setState({ShowDeleteConfirmation: !this.state.ShowDeleteConfirmation, classDisplay: 'no-display', MessageClass:'no-display', MessageText: ''});
	}

	deleteToppingModal(addonGroup, addonGroupDetailItems){
		this.setState({ShowDeleteToppingConfirmation: !this.state.ShowDeleteToppingConfirmation, classDisplay: 'no-display', MessageClass:'no-display', MessageText: '', SelectedAddonGroupItemId: addonGroup.id, SelectedAddonGroupItemName: addonGroup.name, SelectedAddonGroupItems: addonGroupDetailItems});
	}

	CancelToppingGroupSearch(){
    
		this.setState({ 
		  FiltersAddonGroups: this.state.AddonGroups,
		  SearchToppingGroupText: "",
		  IsSearchingGroup: false
		});
	
	  }

	  CancelToppingGroupItemSearch(){
    
		this.setState({ 
		
			FilterGlobelGroupItems: this.state.GlobelGroupItems, 
			SearchToppingGroupItemText: "",
			IsSearchingItem: false
		});
	
	  }



	componentDidMount() {

		window.addEventListener('load', () => {
			this.setState({
				isMobile: window.innerWidth < 800
			});
		}, false);
		if (window.innerWidth < 800) {
			this.setState({
				isMobile : true
			})
			//this.state.isMobile = true;
		}
		if (window.innerWidth > 800) {
			this.setState({
				isMobile : false
			})
			//this.state.isMobile = false;
		}
		
		this.GetTopping();
		this.GetAddonGroupItems();
		window.addEventListener('scroll', ()=>{
			const istop =window.scrollY < 70;
			
			if(istop !== true){
			  this.setState({scrolled: true})
			}
			else{
			  this.setState({scrolled: false})
			}
			
				});
	}

	shouldComponentUpdate() {
		return true;
	}
	getInitialState() {
		return {
			done: true
		};
	}

	handleDeleteTopping= async() =>{
		this.setState({ classDisplay: '', MessageClass:'', MessageText: '', deleteConfirmationModelText: '' });
		var menuAddonGroupId = this.state.SelectedAddonGroupId;

		let isDeleted = await MenuAddonService.Delete(menuAddonGroupId, Constants.MenuAddonGroupTopping);
			
		if(isDeleted) {
			SetMenuStatus(true);
			this.setState({ShowDeleteConfirmation: false, classDisplay: 'no-display' });
			Utilities.notify("Successfully deleted.","s");
			this.GetTopping();
		}
		else {
			this.setState({ShowDeleteConfirmation: false, classDisplay: 'no-display', MessageClass:'alert alert-danger', MessageText: 'Unable to deleted' });
		}
	}

	handleDeleteToppingItem= async() =>{
		this.setState({ classDisplay: '', MessageClass:'', MessageText: '', deleteConfirmationModelText: '' });
		//var itemName = this.state.SelectedAddonGroupItemName;
		var id = this.state.SelectedAddonGroupItemId;
		var addonGroupDetails = this.state.AddonGroupDetails;
		var groupItemsCsv = '';

		var groupName = this.state.SelectedAddonGroupName;
		var groupId =this.state.SelectedAddonGroupId;

		for(var i=0; i< addonGroupDetails.length; i++){
			if(addonGroupDetails[i].id !== id)
				groupItemsCsv += addonGroupDetails[i].TableRecordIdsCsv + "@@@" + addonGroupDetails[i].name + "|||" 
		}

		groupItemsCsv = Utilities.FormatCsv(groupItemsCsv,  "|||" );
		if(groupName !== "")
		{
			let isUpdated = await ToppingService.UpdateGroupItem(groupId, groupName, groupItemsCsv, Constants.MenuAddonGroupTopping);

				if(isUpdated) {
					SetMenuStatus(true);
						this.GetTopping();
						this.GetAddonGroupItems();
						this.setState({ShowDeleteToppingConfirmation: false, classDisplay: 'no-display' });
						Utilities.notify("Successfully deleted.","s");
				}
				else {
					this.setState({ShowDeleteToppingConfirmation: false, classDisplay: 'no-display',MessageClass:'alert alert-dangers', MessageText: 'Failed to delete.' })
				}

		}else {
			this.setState({ShowDeleteToppingConfirmation: false, classDisplay: 'no-display',MessageClass:'alert alert-dangers', MessageText: 'Failed to delete.' })
		}

	}

	handleAddonGroupSaveSubmit= async(event, errors, values)=> { 
		
		if (this.state.IsSave) return;
		this.setState({ IsSave: true })
	
		
		this.setState({ classDisplay: 'no-display',MessageClass:'no-display', MessageText: ''  });

		var globelAddonGroupItems = this.state.FilterGlobelGroupItems;
		let addonGroupItems = this.state.SelectedAddonGroupItems;
		var groupName = values["toppingAddNewName"];
		var categoryName= values["toppingCategoryName"];
		var groupItemsCsv = '';
		var checkValues = Object.keys(values);

		if(groupName === ''){
				this.setState({classDisplay: 'no-display',IsSave: false});
				//this.notify("Name can not be empty","e");
				return;
		}

		if(categoryName === ''){
			this.setState({classDisplay: 'no-display',IsSave: false});
			return;
		}

		for(var i=0; i < addonGroupItems.length; i++){
			var sid = String(addonGroupItems[i].Id) + "|" + String(addonGroupItems[i].Price);
				groupItemsCsv += sid + Config.Setting.csvSeperator;
		}

		groupItemsCsv = Utilities.FormatCsv(groupItemsCsv,  Config.Setting.csvSeperator);

		if(groupItemsCsv === ''){
			this.setState({IsSave: false,classDisplay: 'no-display', ToppingModalMessageClass: 'alert alert-danger', ToppingModalMessageText: 'Please select items from the list.'});
			return;
		}

		groupItemsCsv += "@@@" + categoryName;
		let isSaved = await MenuAddonService.Save(0, groupName, groupItemsCsv, Constants.MenuAddonGroupTopping);
		this.setState({IsSave: false});
		if(isSaved.Dictionary !== undefined) {
					if(isSaved.Dictionary.IsGroupItemSaved !== undefined && !isSaved.Dictionary.IsGroupItemSaved) {
						SetMenuStatus(true);
						// this.setState({addtopping: false, classDisplay: 'no-display', MessageClass: 'alert alert-danger', MessageText: isSaved.Dictionary.Reason});
						this.setState({IsSave: false,classDisplay: 'no-display', ToppingModalMessageClass: 'alert alert-danger', ToppingModalMessageText: isSaved.Dictionary.Reason});
						return;
					}
				}

		if(isSaved.Dictionary.IsGroupItemSaved) {
			this.setState({SelectedAddonGroupId: isSaved.Dictionary.id});
			this.GetTopping();
			this.GetAddonGroupItems();
			this.setState({addtopping: false, classDisplay: 'no-display'});
			Utilities.notify("Successfully added.","s");
		}
		else
			this.setState({addtopping: false, classDisplay: 'no-display', MessageClass: 'alert alert-dangers', MessageText: 'Failed to add.'});
	}


	handleGroupSaveSubmit= async(event, errors, values)=>{
		
		
		if (this.state.IsSave) return;
		this.setState({ IsSave: true })
	
		
		
		this.setState({ classDisplay: 'no-display',MessageClass:'no-display', MessageText: ''  });
		
		var globelAddonGroupItems = this.state.FilterGlobelGroupItems;
		//var addonGroupId = this.state.SelectedAddonGroupId;
		let addonGroupItems = this.state.SelectedAddonGroupItems;
		var addonGroupDetails = this.state.AddonGroupDetails;
		var name = this.state.SelectedAddonGroupName;
		var Id =this.state.SelectedAddonGroupId;

		var checkValues = Object.keys(values);
		var groupName = '';
		var groupItemsCsv = '';


		if(addonGroupItems.length === 0) {
			this.setState({ classDisplay: 'no-display',IsSave: false });
			Utilities.notify("Please select item from the list.","e");
			return false;
		}


		groupName = values["addAddonGroupName"];
		if(groupName === null || groupName === "")
		{
			this.setState({ classDisplay: 'no-display', IsSave: false});
			return false;
		}

		var fCheckItemSelected = false;

		for(var k=0; k < addonGroupDetails.length; k++){
				groupItemsCsv += addonGroupDetails[k].TableRecordIdsCsv + "@@@" + addonGroupDetails[k].name + "|||" 
		}
	
		for(var i=0; i < addonGroupItems.length; i++){
			var sid = String(addonGroupItems[i].Id) + "|" + String(addonGroupItems[i].Price);
				groupItemsCsv += sid + Config.Setting.csvSeperator;
		}

		groupItemsCsv = Utilities.FormatCsv(groupItemsCsv,  Config.Setting.csvSeperator );
		if(groupItemsCsv !== "")
		{
				groupItemsCsv += "@@@" + groupName;

				let isUpdated = await ToppingService.UpdateGroupItem(Id, name, groupItemsCsv, Constants.MenuAddonGroupTopping);
				this.setState({IsSave: false});
				if(isUpdated) {
						SetMenuStatus(true);
						this.GetTopping();
						this.GetAddonGroupItems();
						this.setState({addcategory: false, editcategory: false ,classDisplay: 'no-display' });
						Utilities.notify("Successfully saved.","s");
				}
				else {
					this.setState({addcategory: false, editcategory: false ,classDisplay: 'no-display',MessageClass:'alert alert-dangers', MessageText: 'Failed to add new add-ons group.' })
				}

		}else {
			this.setState({ classDisplay: 'no-display',MessageClass:'alert alert-dangers', MessageText: 'Please select add-ons from the list.'  });
		}
	}

	handleGroupEditSubmit= async(event, errors, values)=>{
		
		
		if (this.state.IsSave) return;
		this.setState({ IsSave: true })
	
		this.setState({ classDisplay: 'no-display',MessageClass:'no-display', MessageText: ''  });
		
		var globelAddonGroupItems = this.state.FilterGlobelGroupItems;
		//var addonGroupId = this.state.SelectedAddonGroupId;
		var id = this.state.SelectedAddonGroupItemId;
		let addonGroupItems = this.state.SelectedAddonGroupItems;
		var addonGroupDetails = this.state.AddonGroupDetails;
		var name = this.state.SelectedAddonGroupName;
		var Id =this.state.SelectedAddonGroupId;

		var checkValues = Object.keys(values);
		var groupName = '';
		var groupItemsCsv = '';
		groupName = values.editcategoryName;
		for(var k=0; k< addonGroupDetails.length; k++){
			if(addonGroupDetails[k].id !== id)
				groupItemsCsv += addonGroupDetails[k].TableRecordIdsCsv + "@@@" + addonGroupDetails[k].name + "|||" 
		}
	
		for(var i=0; i < addonGroupItems.length; i++){
			if(Utilities.IsNumber(addonGroupItems[i].Id)) {
			var sid = String(addonGroupItems[i].Id) + "|" + String(addonGroupItems[i].Price);
			groupItemsCsv += sid + Config.Setting.csvSeperator;
			
		}

		}
		groupItemsCsv = Utilities.FormatCsv(groupItemsCsv, Config.Setting.csvSeperator );
		if(groupItemsCsv !== "")
		{
				groupItemsCsv += "@@@" + groupName;
				
				let isUpdated = await ToppingService.UpdateGroupItem(Id, name, groupItemsCsv, Constants.MenuAddonGroupTopping);
				this.setState({ IsSave: false })
	
				if(isUpdated) {
						SetMenuStatus(true);
						this.GetTopping();
						this.GetAddonGroupItems();
						this.setState({addcategory: false, editcategory: false ,classDisplay: 'no-display' });
						
				}
				else {
					this.setState({addcategory: false, editcategory: false ,classDisplay: 'no-display',MessageClass:'alert alert-dangers', MessageText: 'Failed to add new add-ons group.',SortAddonGroupNameArray: [] })
				}

		}else {
			this.setState({ classDisplay: 'no-display',MessageClass:'alert alert-dangers', MessageText: 'Please select add-ons from the list.', SortAddonGroupNameArray: []  });
		}
  }

	handleToppingEditSubmit= async(event, errors, values)=>{
		
			
		if (this.state.IsSave) return;
		this.setState({ IsSave: true })

		this.setState({ classDisplay: '',ModalMessageClass:'no-display', ModalMessageText: '' ,MessageClass:'no-display', MessageText: '' });

		var addonGroupDetails = this.state.AddonGroupDetails;
		var prvName = this.state.SelectedAddonGroupName;
		var Id =this.state.SelectedAddonGroupId;

		var name = values["editToppingName"];
		//var groupName = '';
		var groupItemsCsv = '';

		if(name === prvName || name === "") {
			this.setState({classDisplay: 'no-display', ModalMessageClass:'alert alert-danger', ModalMessageText: 'Nothing to update.'});
		}
		else {
			for(var i=0; i< addonGroupDetails.length; i++){
					groupItemsCsv += addonGroupDetails[i].TableRecordIdsCsv + "@@@" + addonGroupDetails[i].name + "|||" 
			}
			
			groupItemsCsv = Utilities.FormatCsv(groupItemsCsv,  "|||" );
		
			let isUpdated = await ToppingService.UpdateGroupItem(Id, name, groupItemsCsv);
			this.setState({ IsSave: false })
		
			if(isUpdated) {
					SetMenuStatus(true);
					this.GetTopping();
					this.setState({editToppingName: !this.state.editToppingName, classDisplay: 'no-display'  });
					Utilities.notify("Successfully updated.","s");
			}
			else {
				this.setState({editToppingName: !this.state.editToppingName, classDisplay: 'no-display'  })
				Utilities.notify("Updated failed.","e");
			}
		}
	}

	SearchAddonGroupItems(e){
		let searchText = e.target.value;
		let filteredData = []

		this.setState({SearchToppingGroupItemText : searchText});
	   if(searchText.toString().trim() === ''){
			this.setState({FilterGlobelGroupItems: this.state.GlobelGroupItems, IsSearchingItem: false});
			return;
	   }
	  
	   filteredData = this.state.GlobelGroupItems.filter((g) => {
		  
		  let arr = searchText.toUpperCase().trim();
		  let isExists = false;
			
				if (g.Name.toUpperCase().indexOf(arr) !== -1) {
					isExists = true;
		  }
		  
		  return isExists
		})
	
		this.setState({FilterGlobelGroupItems: filteredData, IsSearchingItem: true});
	}

	SearchAddonGroup(e){

		let searchText = e.target.value;
		let filteredData = []

		this.setState({SearchToppingGroupText: searchText});
	
	   if(searchText.toString().trim() === ''){
			this.setState({FiltersAddonGroups: this.state.AddonGroups, IsSearchingGroup: false});
			return;
	   }
	  
	   filteredData = this.state.AddonGroups.filter((g) => {
		  
		  let arr = searchText.toUpperCase().trim();
		  let isExists = false;
		  
				if (g.Name.toUpperCase().indexOf(arr) !== -1) {
					isExists = true;
		  }
		  
		  return isExists
		})
	
		this.setState({FiltersAddonGroups: filteredData, IsSearchingGroup: true});
	
	}  

	handleAddonGroupClick(addonGroup){

				this.setState({RightLoaderClass: '', SelectedAddonGroupId: addonGroup.Id, SelectedAddonGroupName: addonGroup.Name, SelectedAddonGroup: addonGroup, ShowLoaderRightPanel: true});
				this.GetAddonGroup(addonGroup.Id);
	  }

		handleAddonGroupItemClick(addonGroup, addonGroupDetailItems){
			this.setState({editcategory: !this.state.editcategory, SelectedAddonGroupItemId: addonGroup.id, SelectedAddonGroupItemName: addonGroup.name, SelectedAddonGroupItems: addonGroupDetailItems});
			this.GetUpdatedAddonGroupSortByName(this.state.AddonGroupDetails);
		}

		handleToppingEditClick(){
			this.setState({editToppingName: !this.state.editToppingName});
		}

	 GetAddonGroup = async(menuAddonGroupId)=>{
			var data = await ToppingService.GetToppingItemsById(menuAddonGroupId);

			let ag  = []
			for (var i = 0; i < data.length; i++)
				ag.push({"id": data[i].Id, "name": Utilities.SpecialCharacterDecode(data[i].GroupName), "IsDeleted": data[i].IsDeleted, "TableRecordIdsCsv":  data[i].TableRecordIdsCsv});

				if(this.state.SortAddonGroupNameArray.length > 0){
					var groupDetail = this.SortByName(ag, this.state.SortAddonGroupNameArray, 'name')
					this.GetUpdatedAddonGroupSort(groupDetail)
					this.UpdateAddonGroupSort();
				}

			this.setState({AddonGroupDetails:ag, classDisplay: 'no-display' ,RightLoaderClass:'no-display',ShowLoaderRightPanel: false, left: false});
	  }


	  RenderRightEmptyAddonItemsPanel(){
  
		if (this.state.ShowLoaderRightPanel === true) {
		  return this.loading()
		}
	  
		return (
		  <div className="no-results-wrap"><div><div className="not-found-menu m-b-20">No items found.</div><div className="cat-heading-wrap">
		  <span className="common-heading"></span>
		  <span className="add-cat-btn" onClick={this.addToppingList} >
								<i className="fa fa-plus m-r-5" ></i><span className="hide-in-responsive">New list</span>
		</span></div> </div></div>
		)
	  
	  }

	  RenderRightAddonItemsPanel(AddonGroupDetails, selectedAddonGroupName, rlClass){
				
		if(this.state.ShowLoaderRightPanel===true){
			return this.innerLoading()
		  }

				if(AddonGroupDetails === undefined)
					return ('');

				if(AddonGroupDetails.length === 0)
						return(
													
							<div className="extras-header-wrap">
								<div className="extras-header-left">
									<span className="common-heading">{Utilities.SpecialCharacterDecode(selectedAddonGroupName)}</span> 
									<span>
										<i data-toggle="modal" data-target="#editNewExtrasList" className="fa fa-pencil-square-o" aria-hidden="true" title="" data-placement="top" data-original-title="Edit" onClick={ this.state.SelectedAddonGroupName === selectedAddonGroupName ? ()=> this.handleToppingEditClick() : ()=> this.handleToppingEditClick() }></i>
										Edit
									
										</span>
									
									<span className="add-cat-btn new-cat-res-set" onClick={this.addCategoryModal}>
										<i className="fa fa-plus m-r-5" aria-hidden="true"></i>
										<span>New category</span>
									</span>
								</div>
								<div className="extras-buttons-wrap">
									<span onClick={this.sortModal}><i className="fa fa-sort-amount-asc" aria-hidden="true"></i>Sort items</span>
									<span onClick={this.deleteAddonGroupModal}> <i className="fa fa-trash" aria-hidden="true" ></i>Delete</span>
								</div>
							</div>
						);

				var htmlActive = [];

				for (var i=0; i < AddonGroupDetails.length; i++){	
					if(AddonGroupDetails[i].IsDeleted === false){
						htmlActive.push(this.RenderAddonInfoWithDetail(AddonGroupDetails[i]));
					}
				}

				return(
					<div>
					<div className={rlClass}>
						{this.Rightloading()}
					</div>
					<div className="extras-header-wrap">
						<div className="extras-header-left">
							<span className="common-heading">{Utilities.SpecialCharacterDecode(selectedAddonGroupName)}</span> 
						<span>	<i data-toggle="modal" data-tip data-for='Edit-c'  className="fa fa-pencil-square-o"  onClick={ this.state.SelectedAddonGroupName === selectedAddonGroupName ? ()=> this.handleToppingEditClick() : ()=> this.handleToppingEditClick() }></i>
						Edit
							<ReactTooltip id='Edit-c'><span>Edit</span></ReactTooltip></span>
							<span className="add-cat-btn new-cat-res-set" onClick={this.addCategoryModal}>
								<i className="fa fa-plus m-r-5" aria-hidden="true"></i>
								<span>New category</span>
							</span>
						</div>
						<div className="extras-buttons-wrap">
							<span onClick={this.sortModal}><i className="fa fa-sort-amount-asc" aria-hidden="true"></i>Sort items</span>
							<span onClick={this.deleteAddonGroupModal}> <i className="fa fa-trash" aria-hidden="true" ></i>Delete</span>
						</div>
					</div>

					<div className="Topping-item-wrap">{htmlActive.map((optionHtml) => optionHtml)}</div>
					</div>
				);
	  }
	  
	  RenderAddonInfoWithDetail(addonGroup){
				//let arr = addonGroup.TableRecordIdsCsv.split('^^^');
				let addonGroupDetailItems = [];

				if(addonGroup.TableRecordIdsCsv !== undefined && addonGroup.TableRecordIdsCsv !== '')
				{
					let arr = addonGroup.TableRecordIdsCsv.split('^^^');
					//var htmlActive = [];
		
					if(this.state.GlobelGroupItems !== undefined && this.state.GlobelGroupItems.length > 0 ){
			
						var addonGroupItems = this.state.GlobelGroupItems;

						for(var i=0; i < arr.length; i++){
							
							if(arr[i] !== "") {
							
							let item = arr[i].split('|');
							addonGroupDetailItems.push({
								Id: parseInt(item[0]),
								Price: item[1],
								GroupItem: addonGroupItems.find(x => x.Id === parseInt(item[0])),
							});
						}
						}
					}
				}

				return(
					<div className="topping-row" key={addonGroup.id}>
						<div className="topping-heading-row">
							<span className="topping-common-heding">{Utilities.SpecialCharacterDecode(addonGroup.name)}</span>
							<span className="item-e-d"><span onClick={ this.state.SelectedAddonGroupItemId === addonGroup.id ? ()=> this.handleAddonGroupItemClick(addonGroup, addonGroupDetailItems) : ()=> this.handleAddonGroupItemClick(addonGroup, addonGroupDetailItems) }>
								<i className=" fa fa-pencil-square-o" data-tip data-for='edit'>
							<ReactTooltip id='edit'><span>Edit</span></ReactTooltip></i>
							</span>
								<span className="sa-warning">
									<i onClick={this.state.SelectedAddonGroupItemId === addonGroup.id ? ()=> this.deleteToppingModal(addonGroup, addonGroupDetailItems) : ()=> this.deleteToppingModal(addonGroup, addonGroupDetailItems)} className=" fa fa-trash" data-tip data-for='Delete'></i>
									<ReactTooltip id='Delete'><span>Delete</span></ReactTooltip>
								</span>
							</span>
						</div>
						{this.LoadAddonGroupItems(addonGroupDetailItems)}
					</div>
				);
	  }

	  RenderAddonGroupItemPanel(addonGroupItem){
			let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
			if(addonGroupItem.GroupItem !== undefined) {
			return(
				<div className="topping-item-list" key={addonGroupItem.Id}>
					<span>{Utilities.SpecialCharacterDecode(addonGroupItem.GroupItem.Name)}</span>
					<span>{userObj.EnterpriseRestaurant.Country.CurrencySymbol}{Utilities.FormatCurrency(addonGroupItem.Price === undefined ? addonGroupItem.GroupItem.Price : addonGroupItem.Price, this.state.countryConfigObj.DecimalPlaces)}</span>
				</div>);
			}
	  }

	LoadAddonGroupItems(addonGroupDetailItems){
		
		if(addonGroupDetailItems !== undefined && addonGroupDetailItems.length > 0)
		{
				var htmlActive = [];
				for(var i=0; i < addonGroupDetailItems.length; i++)
					htmlActive.push(this.RenderAddonGroupItemPanel(addonGroupDetailItems[i]));
				
				return(<span>{htmlActive.map((optionHtml) => optionHtml)}</span>)	
		}
	}

	GetTopping = async () => {
		this.setState({ classDisplay: '' });
		var data = await MenuAddonService.GetAll(Constants.MenuAddonGroupTopping);
		
		data.sort((x, y) => ((x.Name.toLowerCase() === y.Name.toLowerCase()) ? 0 : ((x.Name.toLowerCase() > y.Name.toLowerCase()) ? 1 : -1)));

		if(data !== undefined && data.length > 0){
		
			var index = Utilities.GetObjectArrId(this.state.SelectedAddonGroupId, data);
            if (index !== "-1") {
                this.handleAddonGroupClick(data[index]);
            } else 
				this.handleAddonGroupClick(data[0]);
		}

		this.setState({ AddonGroups : data, FiltersAddonGroups : data, classDisplay: 'no-display',ShowLoaderLeftPanel: false , ShowLoaderRightPanel: data.length !== 0  });

		
	}

	GetAddonGroupItems = async () => {
			this.setState({ classDisplay: '' });
			var data = await ToppingService.GetToppingItems();
			const addonGroupItems = [];
			
			if(data === undefined || data.length <= 0)
				return 'No data found';

			for (var i = 0; i < data.length; i++) {
				addonGroupItems.push({
					Id: data[i].Id,
					PhotoDictionaryId: data[i].PhotoDictionaryId,
					Name: data[i].Name,
					PhotoName: data[i].PhotoName,
					Price: data[i].Price,
					IsDeleted: data[i].IsDeleted,
					PhotoUri: data[i].PhotoUri
				})
			}

			//sort the globel group items
			addonGroupItems.sort((x, y) => ((x.Name.toLowerCase() === y.Name.toLowerCase()) ? 0 : ((x.Name.toLowerCase() > y.Name.toLowerCase()) ? 1 : -1)));

			this.setState({ GlobelGroupItems : addonGroupItems, FilterGlobelGroupItems: addonGroupItems, RightLoaderClass: 'no-display', classDisplay: 'no-display'  });
	  }

	  GetActiveAddonGroup(toppingList){
		let topping  = []
		
		for (var i = 0; i < toppingList.length; i++) {
	  
		  if(toppingList[i].IsPublished && !toppingList[i].IsDeleted){
			topping.push({"id": toppingList[i].Id, "Name": toppingList[i].Name, "AddonType": toppingList[i].AddonType, "MaxSelection": toppingList[i].MaxSelection});
		  }
		}
	
		this.setState({ActiveAddonGroup:topping});
	  
	  }

	  LoadAddonGroups(addonGroups){
			
		if(this.state.ShowLoaderLeftPanel===true) {
			return this.innerLoading()
		  }
		
		if(addonGroups === undefined)
				return ('');

			if(addonGroups.length === 0)
				return (`${Labels.Topping}(s) not found`);
		
			var htmlActive = [];

			for (var i=0; i < addonGroups.length; i++){	
				if(addonGroups[i].IsPublished === true){
					htmlActive.push(this.RenderAddonGroupPanel(addonGroups[i]));
				}
			}
		
			return(<ul>{htmlActive.map((optionHtml) => optionHtml)}</ul>)
		
	}

	RenderAddonGroupPanel(addonGroup){
		return (
			<li key={addonGroup.Id}  onClick={ this.state.SelectedAddonGroupId === addonGroup.Id ? null : ()=> this.handleAddonGroupClick(addonGroup)} className={this.state.SelectedAddonGroupId === addonGroup.Id ? "active" : "" }>
			<span className="menu-left-list-label" id="top" onClick={this.handleBottomClick} >{Utilities.SpecialCharacterDecode(addonGroup.Name)}</span></li>
		)
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
UpdateAddonGroupSort = async() =>{
	
	let csv = this.state.SortAddonGroupIdsCSV;

	let isUpdated = await ToppingService.UpdateSort(csv);

	if(isUpdated === true) {
		SetMenuStatus(true);
		if(this.state.SortAddonGroupNameArray.length == 0)
			this.handleAddonGroupClick(this.state.SelectedAddonGroup);
		this.setState({sort:false, SortAddonGroupNameArray: []});
		
	}
}

RenderSortAddonGroup  = ({item}) =>{
	
	return Utilities.SpecialCharacterDecode(item.name);
}

GetUpdatedAddonGroupSort(ag) {
    let sortCSV= '';

    for(var u = 0; u < ag.length; u++){
      sortCSV += ag[u].id + Config.Setting.csvSeperator;
    }
  
    sortCSV = Utilities.FormatCsv(sortCSV, Config.Setting.csvSeperator);

	this.setState({SortAddonGroupIdsCSV: sortCSV})
  }

  GetUpdatedAddonGroupSortByName(ag) {
    let sortArray=[] ;

    for(var u = 0; u < ag.length; u++){
		sortArray.push(ag[u].name);
    }
	this.setState({SortAddonGroupNameArray: sortArray})
  }
  
  SortByName (array, order, key) {

	array.sort( function (a, b) {
	  var A = a[key], B = b[key];
	  
	  if (order.indexOf(A) > order.indexOf(B)) {
		return 1;
	  } else {
		return -1;
	  }
	  
	});
	
	return array;
  };

GenerateAddonGroupSortModel(){

    return(

      <Modal isOpen={this.state.sort} toggle={this.sortModal} className={this.props.className}>
        <ModalHeader toggle={this.sortModal}>Sort items</ModalHeader>
        <ModalBody>
          <div className="m-b-15">Use mouse or finger to drag items and sort their positions.</div>
          <div className="sortable-wrap sortable-item">
            {/* <Nestable
              items= {this.state.AddonGroupDetails}
              renderItem= {this.RenderSortAddonGroup}
              maxDepth = {1}
              onChange = {this.GetUpdatedAddonGroupSort}
              ref={el => this.refNestable = el}
            /> */}
			    <SortableContainer  
            items={this.state.AddonGroupDetails}
            onSortEnd={this.onSortEnd}
             >
           </SortableContainer>
          </div>
        </ModalBody>
        <ModalFooter>          
          <Button color="primary" onClick={this.UpdateAddonGroupSort}>Save</Button>
          <Button color="secondary" onClick={this.sortModal}>Cancel</Button>
        </ModalFooter>
      </Modal>

    )
 }
 GenerateAddNewAddonGroupModel(){
	 
	if(!this.state.addtopping){
		return('')
	}
	
	return(
			<Modal isOpen={this.state.addtopping} toggle={this.addToppingList} className="modal-md">
			<ModalHeader toggle={this.addToppingList}>Add New {Labels.Topping}</ModalHeader>
			<ModalBody>
				<AvForm onSubmit={this.handleAddonGroupSaveSubmit}>
					<div className={this.state.ModalMessageClass}>{this.state.ModalMessageText}</div>
					<div className="name-field form-group m-b-15">
						<AvField errorMessage="This is a required field" name="toppingAddNewName" type="text" className="form-control" required />
						<span>Group Name</span>
					</div>
					<div className="name-field form-group m-b-15">
						<AvField errorMessage="This is a required field" name="toppingCategoryName" type="text" className="form-control" required />
						<span>Category Name</span>
					</div>
					<div className=" m-t-20 m-b-10" style={{ position: 'relative', float: 'left', width: '100%' }}>
						<input type="text" className="form-control common-serch-field" placeholder="Search List" style={{ paddingleft: '30px' }} value={this.state.SearchToppingGroupItemText} onChange={this.SearchAddonGroupItems}/>
							<i className="fa fa-search" aria-hidden="true" style={{ position: 'absolute', top: '11px', left: '12px', color: '#777' }}></i>
						{this.state.IsSearchingItem ? <span onClick={() => this.CancelToppingGroupItemSearch()}><i className="fa fa-times" style={{ position: 'absolute', top: '11px', color: '#777', right: '15px' }}></i></span> : ""}
						
						</div>
						<div className="inner-table-scroll">
						<Table>
							<thead>
								<tr>
									<th></th>
									<th>Name</th>
									<th>Price</th>
								</tr>
							</thead>
								{/* {this.GenerateToppingDetailsItem(this.state.SelectedAddonGroupItems)} */}
								{this.LoadToppingItemList(this.state.SelectedAddonGroupItems)}
						</Table>
						</div>
					
					<div className="modal-footer">

							<Button color="secondary" onClick={this.addToppingList}>Cancel</Button>
							
							<Button color="primary" style={{ marginRight: 10 }}>
              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                : <span className="comment-text">Save</span>}
            </Button>
							
							{/* <Button color="success">Save</Button> */}
							

						</div>
						<div className="error m-t-5" style={{textAlign: "right"}}>{this.state.ToppingModalMessageText}</div>
				
				</AvForm>
			</ModalBody>
		</Modal>
	 )
 }
 GenerateAddonGroupAddModel(){
	
	if(!this.state.addcategory){
		return('')
	}
	
	return(
				<Modal isOpen={this.state.addcategory} toggle={this.addCategoryModal} className="modal-md table-set-modal ">
				<ModalHeader toggle={this.addCategoryModal}>Add category</ModalHeader>
				<ModalBody className="padding-0">
					<AvForm onSubmit={this.handleGroupSaveSubmit}>
					<div className="padding-20">
						<div className="name-field form-group">
						<AvField errorMessage="This is a required field" name="addAddonGroupName" type="text" className="form-control" required  />
							<span>Category Name</span>
						</div>
						<div className=" m-t-20 m-b-20" style={{ position: 'relative', float: 'left', width: '100%' }}>
						<input type="text" className="form-control common-serch-field" placeholder="Search List" style={{ paddingleft: '30px' }} value={this.state.SearchToppingGroupItemText} onChange={this.SearchAddonGroupItems}/>
							<i className="fa fa-search" aria-hidden="true" style={{ position: 'absolute', top: '11px', left: '12px', color: '#777' }}></i>
						{this.state.IsSearchingItem ? <span onClick={() => this.CancelToppingGroupItemSearch()}><i className="fa fa-times" style={{ position: 'absolute', top: '11px', color: '#777', right: '15px' }}></i></span> : ""}
						</div>
					<div className="inner-table-scroll">
						<Table>
							<thead>
								<tr>
									<th></th>
									<th>Name</th>
									<th>Price</th>
								</tr>
							</thead>
								{/* {this.GenerateToppingDetailsItem(this.state.SelectedAddonGroupItems)} */}
								{this.LoadToppingItemList(this.state.SelectedAddonGroupItems)}
						</Table>
						</div>
						</div>
					<div className="modal-footer">
							
							<Button color="secondary" onClick={this.addCategoryModal}>Cancel</Button>
							
							<Button color="primary" style={{ marginRight: 10 }}>
              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                : <span className="comment-text">Save</span>}
            </Button>
							
							
							{/* <Button color="success">Save</Button> */}
						</div>
					</AvForm>
				</ModalBody>
			</Modal>)
 }

 GenerateAddonGroupEditModel(){
	 
	if(!this.state.editcategory){
		return('')
	}
	
	return(
				<Modal isOpen={this.state.editcategory} toggle={this.editCategoryModal} className="modal-md table-set-modal">
				<ModalHeader toggle={this.editCategoryModal}>Edit category
				</ModalHeader>
				<ModalBody className="padding-0">
			
					<AvForm onSubmit={this.handleGroupEditSubmit}>
					<div className="padding-20">
					<div className={this.state.ModalMessageClass}>{this.state.ModalMessageText}</div>
					<div className="name-field form-group">
						<AvField errorMessage="This is a required field" value={Utilities.SpecialCharacterDecode(this.state.SelectedAddonGroupItemName)} name="editcategoryName" type="text" className="form-control" required  />
						<span>Category Name</span>
					</div>
					<div className=" m-t-20 m-b-10" style={{ position: 'relative', float: 'left', width: '100%' }}>
						<input type="text" className="form-control common-serch-field" placeholder="Search List" style={{ paddingleft: '30px' }} value={this.state.SearchToppingGroupItemText} onChange={this.SearchAddonGroupItems}/>
						<i className="fa fa-search" aria-hidden="true" style={{ position: 'absolute', top: '11px', left: '12px', color: '#777' }}></i>
						{this.state.IsSearchingItem ? <span onClick={() => this.CancelToppingGroupItemSearch()}><i className="fa fa-times" style={{ position: 'absolute', top: '11px', color: '#777', right: '15px' }}></i></span> : ""}
					</div>
			  <div className="inner-table-scroll">
					<Table>
						<thead>
							<tr>
								<th></th>
								<th>Name</th>
								<th>Price</th>
							</tr>
						</thead>
							{/* {this.GenerateToppingDetailsItem(this.state.SelectedAddonGroupItems)} */}
							{this.LoadToppingItemList(this.state.SelectedAddonGroupItems)}
					</Table>
				</div>
			</div>
						<div className="modal-footer">

							<Button color="secondary" onClick={this.editCategoryModal}>Cancel</Button>
							{/* <Button color="success">Save</Button> */}

							<Button color="primary" style={{ marginRight: 10 }}>
              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                : <span className="comment-text">Save</span>}
            </Button>
							
						</div>
					</AvForm>
				</ModalBody>
				
			</Modal>
	 )
 }

 GenerateEditToppingModel(){
	
	if(!this.state.editToppingName){
		return('');
	}

	return(
			 <Modal isOpen={this.state.editToppingName} toggle={this.editToppingNameModal} className="modal-md">
			 <ModalHeader toggle={this.editToppingNameModal}>Edit category
			 </ModalHeader>
			 <ModalBody >
				 <AvForm onSubmit={this.handleToppingEditSubmit}>
				 <div className={this.state.ModalMessageClass}>{this.state.ModalMessageText}</div>
				 <div className="name-field form-group">
					 <AvField errorMessage="This is a required field" value={Utilities.SpecialCharacterDecode(this.state.SelectedAddonGroupName)} name="editToppingName" type="text" className="form-control" required  />
					 <span>Category Name</span>
				 </div>

					 <div className="modal-footer">
					
						 <Button color="secondary" onClick={this.editToppingNameModal}>Cancel</Button>
						 <Button color="primary">Done</Button>
					 </div>
				 </AvForm>
			 </ModalBody>
			
		 </Modal>
	)
}

handleCheckbox(e,id){

	let checked = e.target.checked;
	let addonGroup = this.state.SelectedAddonGroupItems;
	let globelAddonGroupItems = this.state.FilterGlobelGroupItems;
	let index = Utilities.GetObjectArrId(id,globelAddonGroupItems)
	let itemFound = Utilities.GetObjectArrId(id,addonGroup) !== -1;
	if(checked){
		if(itemFound)addonGroup.push(globelAddonGroupItems[index]);
	} else {
		index = Utilities.GetObjectArrId(id,addonGroup)
		addonGroup.splice(index, 1);
	}

	this.setState({SelectedAddonGroupItems: addonGroup});

	// console.log("value: ", checked)

}


 GenerateToppingDetailsItem(addonGroupItem){
		var htmlActive = [];
		var globelAddonGroupItems = this.state.FilterGlobelGroupItems;
		let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
		
		if(globelAddonGroupItems !== undefined && globelAddonGroupItems.length > 0){

				for(var i=0; i < globelAddonGroupItems.length; i++){
							
							var id = parseInt(globelAddonGroupItems[i].Id);
							var itemFound = Utilities.GetObjectArrId(id,addonGroupItem) !== "-1";

							htmlActive.push(<tr key={i}>
							<td>
								<AvField type="checkbox" className="form-checkbox" name={String(id)} value={itemFound} checked={itemFound} onChange={(e) => this.handleCheckbox(e,id)} />
							</td>
								<td>{Utilities.SpecialCharacterDecode(globelAddonGroupItems[i].Name)}</td>
								<td>{userObj.EnterpriseRestaurant.Country.CurrencySymbol}{Utilities.FormatCurrency(globelAddonGroupItems[i].Price, this.state.countryConfigObj.DecimalPlaces)}</td>
							</tr>);
				}

		}

		return(<tbody>{htmlActive}</tbody>);
 }

RenderToppingItemList(globelAddonGroupItem,itemFound){
	let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
return(
	<tr key={globelAddonGroupItem.Id}>
							<td>
								<AvField type="checkbox" className="form-checkbox" name={String(globelAddonGroupItem.Id)} value={itemFound} checked={itemFound} onChange={(e) => this.handleCheckbox(e,globelAddonGroupItem.Id)} />
							</td>
								<td>{Utilities.SpecialCharacterDecode(globelAddonGroupItem.Name)}</td>
								<td>{userObj.EnterpriseRestaurant.Country.CurrencySymbol}{Utilities.FormatCurrency(globelAddonGroupItem.Price, this.state.countryConfigObj.DecimalPlaces)}</td>
							</tr>
)

}


LoadToppingItemList(addonGroupItems){

    var htmlActive = [];
	var globelAddonGroupItems = this.state.FilterGlobelGroupItems;
    if(addonGroupItems === 0){
      return <div></div>
    }

  for (var i=0; i < globelAddonGroupItems.length; i++){
	var id = parseInt(globelAddonGroupItems[i].Id);
	var itemFound = Utilities.GetObjectArrId(id,addonGroupItems) !== "-1";
	htmlActive.push(this.RenderToppingItemList(globelAddonGroupItems[i],itemFound));
 }

  return(

    <tbody>{htmlActive.map((item) => item)}</tbody>

   )

}







 GenerateSweetConfirmationWithCancel(){
	//var delteMsg = 'Are you sure?  ';

	var delteparag='Remove ' + this.state.SelectedAddonGroupName + '?'
	return( 
		
	<SweetAlert
		show={this.state.ShowDeleteConfirmation}
		title={''}
		text={delteparag}
		showCancelButton
		confirmButtonText="Yes"
		onConfirm={() => {this.handleDeleteTopping()}}
		onCancel={() => { this.setState({ ShowDeleteConfirmation: false });
		}}
		onEscapeKey={() => this.setState({ ShowDeleteConfirmation: false })}
		// onOutsideClick={() => this.setState({ ShowDeleteConfirmation: false })}
	/>
	)
}

GenerateDeleteForTopping(){

	var delteMsg = 'Remove ' + this.state.SelectedAddonGroupItemName + '?';
	return( 
		
	<SweetAlert
		show={this.state.ShowDeleteToppingConfirmation}
		title=''
		text={delteMsg}
		showCancelButton
		confirmButtonText="Yes"
		onConfirm={() => {this.handleDeleteToppingItem()}}
		onCancel={() => { this.setState({ ShowDeleteToppingConfirmation: false });
		}}
		onEscapeKey={() => this.setState({ ShowDeleteToppingConfirmation: false })}
		// onOutsideClick={() => this.setState({ ShowDeleteToppingConfirmation: false })}
	/>
	)
}

	render() {
		const ModalDiv = this.state.isMobile;
		//const {AddonGroups } = this.state;
		const { FiltersAddonGroups }= this.state;
		const { AddonGroupDetails } = this.state;
		const { SelectedAddonGroupName }= this.state;
		//const { SelectedAddonGroupItemId }= this.state;
		//const {	SelectedAddonGroupItemName }= this.state;
		//const {	SelectedAddonGroupItems }= this.state;
		//const { GlobelGroupItems } = this.state;
		//const { FilterGlobelGroupItems } = this.state;
		//const { checkboxGroupItems } = this.state;
		//const { classDisplay } = this.state;
		const { RightLoaderClass } = this.state;
		return (
			<div>
			<div className="topping-l-wrap card-new-title">
				<div className="cat-heading-wrap">
						
							<h3 class="card-title ">{Labels.AddOn_List}</h3>
						

						</div>

						<Link to="/alltopping" >	<div className="btn btn-primary pull-right" href="topping">{Labels.All_AddOns}</div></Link>
						<span className="add-cat-btn" onClick={this.addToppingList} >
								<i className="fa fa-plus m-r-5" ></i><span className="hide-in-responsive">New list</span>
							</span>
			</div>

			<div className={this.state.MessageClass}>{this.state.MessageText}</div>
				<div className={this.state.scrolled?'menu-page-wrap topping-page-wrap affix':'menu-page-wrap topping-page-wrap affix-top'}>
					<div className="menu-left-penal ">
	
						<div className="select-cat-btn-res" onClick={this.leftpenal}>
							<span>{this.state.SelectedAddonGroupName}
            </span>
							<span className="change-cat-modal">Change
            </span>
						</div>
						{ModalDiv ? (
							<Modal isOpen={this.state.left} toggle={this.leftpenal} className={this.props.className}>
								<ModalHeader toggle={this.leftpenal}>Select Category</ModalHeader>
								<ModalBody className="menu-page-wrap" >
									<div className="menu-left-penal ">
										<div className="m-b-20 m-t-20" style={{ position: 'relative' }}>
											<input type="text" className="form-control common-serch-field" placeholder="Search List" />
											<i style={{ position: 'absolute', top: '11px', left: '12px', color: '#777' }} className="fa fa-search" aria-hidden="true"></i>
										</div>
										
										<div className="menu-left-cat-list ">
											{this.LoadAddonGroups(FiltersAddonGroups)}
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
									<div className="m-b-20 m-t-20" style={{ position: 'relative' }}>
										<input type="text" className="form-control common-serch-field" placeholder="Search List" value={this.state.SearchToppingGroupText} onChange={this.SearchAddonGroup}/>
										<i style={{ position: 'absolute', top: '11px', left: '12px', color: '#777' }} className="fa fa-search" aria-hidden="true"></i>
									{this.state.IsSearchingGroup? <span className="cross-add-search" onClick={() => this.CancelToppingGroupSearch()}>
     									<i className="fa fa-times" aria-hidden="true" ></i>
									</span> : ""}
									</div>
									<div className="menu-left-cat-list paddinglist">
										{this.LoadAddonGroups(FiltersAddonGroups)}
									</div>
								</div>
							)}
					</div>

					<div className={this.state.classDisplay}>
						{this.loading()}
					</div>
					<div className="menu-right-penal">
					
					{ this.state.FiltersAddonGroups.length == 0 ? this.RenderRightEmptyAddonItemsPanel() : 
						this.RenderRightAddonItemsPanel(AddonGroupDetails, SelectedAddonGroupName, RightLoaderClass)
						
						}
					</div>
					{this.GenerateAddonGroupAddModel()}
					{this.GenerateAddonGroupEditModel()}
					{this.GenerateAddonGroupSortModel()}
					{this.GenerateEditToppingModel()}
					{this.GenerateSweetConfirmationWithCancel()}
					{this.GenerateDeleteForTopping()}
					{this.GenerateAddNewAddonGroupModel()}
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
		
		if(window.innerWidth < 800)
			return;
		
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


export default Toppings;
