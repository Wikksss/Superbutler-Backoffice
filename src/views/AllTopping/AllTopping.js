import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import 'sweetalert/dist/sweetalert.css';
import "react-tabs/style/react-tabs.css";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import Loader from 'react-loader-spinner';
import * as ToppingService from '../../service/Topping';
import SweetAlert from 'sweetalert-react'; // eslint-disable-line import/no-extraneous-dependencies
import 'sweetalert/dist/sweetalert.css';
import * as Utilities from '../../helpers/Utilities';
import Config from '../../helpers/Config';
import ReactTooltip from 'react-tooltip';
import {SetMenuStatus} from '../../containers/DefaultLayout/DefaultHeader'
import Constants from '../../helpers/Constants';
import Labels from '../../containers/language/labels';

class AllTopping extends Component {

	loading = () => <div className="page-laoder">
		<div>
			<Loader type="Oval" color="#ed0000" height={50} width={50} />
			<div className="loading-label">Loading.....</div>
		</div>
	</div>

	constructor(props) {
		super(props);
		this.state = {
			GlobelGroupItems: [],
			FilterGlobelGroupItems: [],
			classDisplay: 'no-display',
			MessageClass: 'no-display',
			MessageText: '',
			deleteConfirmationModelText: '',
			addTopping: false,
			editTopping: false,
			showDeleteConfirmation: false,
			SelectedGlobelToppingItem: [],
			scrolled: false,
			SelectedGlobelToppingId: 0,
			IsSave: false,
			countryConfigObj: JSON.parse(localStorage.getItem(Constants.Session.COUNTRY_CONFIGURATION))
		};

		this.addToppingModal = this.addToppingModal.bind(this);
		this.editToppingModal = this.editToppingModal.bind(this);
		this.SearchAddonGroupItems = this.SearchAddonGroupItems.bind(this);
		this.handleToppingEditSubmit = this.handleToppingEditSubmit.bind(this);
		this.handleToppingSaveSubmit = this.handleToppingSaveSubmit.bind(this);
		this.handleDeleteTopping = this.handleDeleteTopping.bind(this);
	}

	addToppingModal() {
		this.setState({ addTopping: !this.state.addTopping, classDisplay: 'no-display', MessageClass: 'no-display', MessageText: '', IsSave: false });
	}

	editToppingModal(globelToppingItem) {
		this.setState({ SelectedGlobelToppingItem: globelToppingItem, editTopping: !this.state.editTopping, classDisplay: 'no-display', MessageClass: 'no-display', MessageText: '' });
	}

	deleteToppingModal(globelToppingItem) {
		this.setState({ SelectedGlobelToppingItem: globelToppingItem, showDeleteConfirmation: true, classDisplay: 'no-display', MessageClass: 'no-display', MessageText: '' });
	}

	handleToppingEditSubmit = async (event, values) => {

		if (this.state.IsSave) return;
		this.setState({ IsSave: true })

		this.setState({ classDisplay: '', MessageClass: 'no-display', MessageText: '' });
		var sItem = this.state.SelectedGlobelToppingItem;

		var name = values.toppingName;
		var price = values.toppingPrice

		if (name === sItem.Name && price === sItem.Price) {
			Utilities.notify("Nothing to update.", "e");
		}
		else {
			let isUpdated = await ToppingService.UpdateGlobelTopping(sItem.Id, name, sItem.PhotoDictionaryId, price);
			this.setState({ IsSave: false })

			if (isUpdated.Dictionary !== undefined) {
				if (isUpdated.Dictionary.IsMenuToppingUpdated !== undefined && !isUpdated.Dictionary.IsMenuToppingUpdated) {
					SetMenuStatus(true);
					this.setState({ classDisplay: 'no-display', MessageClass: 'alert alert-danger', MessageText: isUpdated.Dictionary.Reason });
					return;
				}
			}

			if (isUpdated) {
				this.setState({ editTopping: !this.state.editTopping });
				this.GetAddonGroupItems();
				Utilities.notify("Successfully updated.", "s");
			}
		}
	}

	handleToppingSaveSubmit = async (event, values) => {
		
		
		if (this.state.IsSave) return;
		this.setState({ IsSave: true })

		this.setState({ classDisplay: '', MessageClass: 'no-display', MessageText: '' });

		var name = values.toppingName;
		var price = values.toppingPrice;

		if (name === "" && price === "") {
			Utilities.notify("Nothing to update.", "e");
		}
		else {
			let isUpdated = await ToppingService.SaveGlobelTopping(name, price);
			this.setState({ IsSave: false })

			if (isUpdated.Dictionary !== undefined) {
				
				if (isUpdated.Dictionary.IsMenuToppingSaved !== undefined && !isUpdated.Dictionary.IsMenuToppingSaved) {
					SetMenuStatus(true);
					this.setState({ classDisplay: 'no-display', MessageClass: 'alert alert-danger', MessageText: isUpdated.Dictionary.Reason });
					return;
				}
			}

			if (isUpdated) {
				this.setState({ addTopping: !this.state.addTopping });
				this.GetAddonGroupItems();
				Utilities.notify("Successfully saved.", "s");
			}
		}
	}

	handleDeleteTopping = async () => {
		this.setState({ classDisplay: '', MessageClass: '', MessageText: '' });
		var sItem = this.state.SelectedGlobelToppingItem;

		let isDeleted = await ToppingService.DeleteGlobelTopping(sItem.Id);

		if (isDeleted) {
			SetMenuStatus(true);
			this.GetAddonGroupItems();
			Utilities.notify("Successfully removed.", "s");
		}
		else {
			Utilities.notify("Unable to remove.", "e");
		}
		this.setState({ showDeleteConfirmation: false, classDisplay: 'no-display' });
	}

	componentDidMount() {
		this.GetAddonGroupItems();
		window.addEventListener('scroll', () => {
			const istop = window.scrollY < 100;

			if (istop !== true) {
				this.setState({ scrolled: true })
			}
			else {
				this.setState({ scrolled: false })
			}

		});
	}


	GenerateSweetConfirmationWithCancel() {
		var delteMsg = 'Remove ' + Utilities.SpecialCharacterDecode(this.state.SelectedGlobelToppingItem.Name) + ' topping?';
		return (

			<SweetAlert
				show={this.state.showDeleteConfirmation}
				title={''}
				text={delteMsg}
				showCancelButton
				confirmButtonText="Yes"
				onConfirm={() => { this.handleDeleteTopping() }}
				onCancel={() => {
					this.setState({ showDeleteConfirmation: false });
				}}
				onEscapeKey={() => this.setState({ showDeleteConfirmation: false })}
				onOutsideClick={() => this.setState({ showDeleteConfirmation: false })}
			/>
		)
	}

	SearchAddonGroupItems(e) {
		let searchText = e.target.value;
		let filteredData = []

		if (searchText.toString().trim() === '') {
			this.setState({ FilterGlobelGroupItems: this.state.GlobelGroupItems });
			return;
		}

		// if (e.keyCode !== 8) {
		//   searchText = searchText + String.fromCharCode(e.keyCode);
		// }
		// else{
		//   searchText = searchText.substr(0, e.target.value.length-1)
		// }

		filteredData = this.state.GlobelGroupItems.filter((g) => {

			let arr = searchText.toUpperCase().split(' ');
			let isExists = false;

			for (var t = 0; t <= arr.length; t++) {
				if (g.Name.toUpperCase().indexOf(arr[t]) !== -1) {
					isExists = true;
					break;
				}
			}

			return isExists
		})

		this.setState({ FilterGlobelGroupItems: filteredData });
	}

	GetAddonGroupItems = async () => {
		this.setState({ classDisplay: '' });
		var data = await ToppingService.GetToppingItems();
		const addonGroupItems = [];

		if (data === undefined || data.length <= 0) {
			this.setState({ classDisplay: 'no-display' });
			return 'No data found';
		}

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

		//sessionStorage.setItem(Constants.Session.ADDON_GROUP_ITEMS, JSON.stringify(addonGroupItems));
		this.setState({ GlobelGroupItems: addonGroupItems, FilterGlobelGroupItems: addonGroupItems, classDisplay: 'no-display' });
	}

	RenderGlobelGroupItems() {

		var htmlActive = [];
		var globelAddonGroupItems = this.state.FilterGlobelGroupItems;
		if (globelAddonGroupItems !== undefined && globelAddonGroupItems.length > 0) {
			for (var i = 0; i < globelAddonGroupItems.length; i++) {
				let gi = globelAddonGroupItems[i];
				htmlActive.push(<div className="topping-list-row" key={`dvitem-${i}`}>
					<div className="topping-list-inner-row">
						<span className="item-n">
							<span>{Utilities.SpecialCharacterDecode(gi.Name)}</span>
							<span className="common-color-7 alltoppingsPrice">{Utilities.GetCurrencySymbol()}{Utilities.FormatCurrency(gi.Price, this.state.countryConfigObj.DecimalPlaces)}</span>
						</span>

						<span className="item-e-d">
							<span data-toggle="modal" data-tip data-for='edit'>
								<ReactTooltip id='edit'><span>Edit</span></ReactTooltip>
								<i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Edit" onClick={this.state.SelectedGlobelToppingId === gi.id ? () => this.editToppingModal(gi) : () => this.editToppingModal(gi)}></i>
							</span>
							<span className="sa-warning">
								<i className="fa fa-trash" aria-hidden="true" data-tip data-for='Delete' onClick={this.state.SelectedGlobelToppingId === gi.id ? () => this.deleteToppingModal(gi) : () => this.deleteToppingModal(gi)}></i>
								<ReactTooltip id='Delete'><span>Delete</span></ReactTooltip>
							</span>
						</span>
					</div>
				</div>);
			}
		}

		return (<div className="topping-list-wrap">{htmlActive}</div>);
	}

	AddModel() {
		return (
			<Modal isOpen={this.state.addTopping} toggle={this.addToppingModal} backdrop={false} className={this.props.className}>
				<ModalHeader toggle={this.addToppingModal}>Add new</ModalHeader>
				<ModalBody className="padding-0">
					<AvForm onValidSubmit={this.handleToppingSaveSubmit}>
						<div className="padding-20">
							<div className={this.state.MessageClass}>{ Utilities.SpecialCharacterDecode(this.state.MessageText)}</div>
							<div className="name-field m-b-15">
								<AvField errorMessage="This is a required field" name="toppingName" type="text" className="form-control" required />
								<span>{Labels.Topping} Name</span>
							</div>
							<div className="input-group">
								<span className="input-group-prepend">
									<span className="input-group-text" >{Utilities.GetCurrencySymbol()}</span>
								</span>
								<div className="name-field " style={{ flex: '1' }}>
									<AvField type="text" name="toppingPrice" style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }} />
									<span> Price</span>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<Button color="secondary" onClick={this.addToppingModal}>Cancel</Button>
							{/* <Button color="success">Add</Button> */}
							<Button color="primary" style={{ marginRight: 10 }}>
              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                : <span className="comment-text">Add</span>}
            </Button>
						</div>
					</AvForm>
				</ModalBody>
			</Modal>
		);
	}

	EditModel() {

		if (this.state.SelectedGlobelToppingItem === undefined)
			return ('');

		return (
			<Modal isOpen={this.state.editTopping} toggle={this.editToppingModal} className={this.props.className}>

				<ModalHeader toggle={this.editToppingModal}>Edit</ModalHeader>
				<ModalBody className="padding-0">
					<AvForm onValidSubmit={this.handleToppingEditSubmit}>
						<div className="padding-20">
							<div className={this.state.MessageClass}>{this.state.MessageText}</div>
							<div className="name-field m-b-15">
								<AvField errorMessage="This is a required field" name="toppingName" value={Utilities.SpecialCharacterDecode(this.state.SelectedGlobelToppingItem.Name)} type="text" className="form-control" required />
								<span>{Labels.Topping} Name</span>
							</div>
							<div className="input-group">
								<span className="input-group-prepend">
									<span className="input-group-text" >{Utilities.GetCurrencySymbol()}</span>
								</span>
								<div className="name-field " style={{ flex: '1' }}>
									<AvField type="text" name="toppingPrice" value={Utilities.FormatCurrency(this.state.SelectedGlobelToppingItem.Price, this.state.countryConfigObj.DecimalPlaces)} style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }} />
									<span> Price</span>
								</div>
							</div>
						</div>
						<div class="modal-footer">
							<Button color="secondary" onClick={this.editToppingModal}>Cancel</Button>
							<Button color="primary" style={{ marginRight: 10 }}>
              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                : <span className="comment-text">Update</span>}
            </Button>
							
							{/* <Button color="success">Update</Button> */}
						</div>
					</AvForm>
				</ModalBody>
			</Modal>
		);
	}
	render() {
		return (

			<div className="card allToppingsWrapper" >
				<div className={this.state.classDisplay}>
					{this.loading()}
				</div>
				<div className={this.state.MessageClass}>{this.state.MessageText}</div>
				<div className={this.state.scrolled ? 'font-24  card-new-title topping-subheader-page topping-subheader-fixed' : 'card-new-title topping-subheader-page font-24 '}>
					<span className="topping-heading-page">{Labels.All_AddOns}</span>

					<span onClick={this.addToppingModal} className="add-cat-btn">
						<i className="fa fa-plus m-r-5" aria-hidden="true"></i><span className="hide-in-responsive" >New {Labels.Topping}</span>
					</span>
					<span className="topping-list-search">
						<input type="text" id="txtSearchEnterpriseTopping" className="form-control common-serch-field" placeholder="Search List" onChange={this.SearchAddonGroupItems} />

						<i className="fa fa-search" aria-hidden="true" style={{ position: 'absolute', top: '11px', left: '12px', color: '#777' }}></i>
						<span id="spClearSearch" className="no-display"><i className="fa fa-times" style={{ position: 'absolute', top: '11px', color: '#777', right: '15px' }}></i></span>
					</span>


				</div>

				<div className="card-body res-all-t-list">
					{this.RenderGlobelGroupItems()}
				</div>

				{this.AddModel()}
				{this.EditModel()}
				{this.GenerateSweetConfirmationWithCancel()}
			</div>
		);

	}
}

export default AllTopping;
