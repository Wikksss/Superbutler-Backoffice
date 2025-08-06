import React, { Component, Fragment } from 'react';
import StarRatings from "react-star-ratings";
import CountUp from 'react-countup';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Avatar from 'react-avatar';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import { Link } from 'react-router-dom'
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader, Form, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import * as CampaignService from '../../../service/Campaign';
import * as Utilities from '../../../helpers/Utilities';
import Loader from 'react-loader-spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import ImageUploader from 'react-images-upload';
import 'rc-color-picker/assets/index.css';
//import ReactDOM from 'react-dom';
import ColorPicker from 'rc-color-picker';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import GlobalData from '../../../helpers/GlobalData'

import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import * as DefaultTheme from '../../../helpers/DefaultTheme';
import * as EnterpriseMenuService from '../../../service/EnterpriseMenu';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
const SortableItem = sortableElement(({ value }) => <li className="sortableHelper">{value}</li>);
var menuTopItems_metaItemPrefix = "metaitem";
var metaItems = new Array();
const regex = /(<([^>]+)>)/ig;
var currencySymbol = GlobalData.restaurants_data.Supermeal_dev.currency;
const SortableContainer = sortableContainer(({ items }) => {
    if (items === undefined) { return; }
    return (
        <ul>
            {items.map((value, index) => (
                <SortableItem key={`item-${index}`} style={{ zIndex: 100000 }} index={index} value={value.Title} />
            ))}
        </ul>
    );
});
export default class TopItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultTheme: this.props.headerTheme,
            searchItem: '',
            data: [],
            menuJson: this.props.menuJson,
            topItem: DefaultTheme.TopItems,
            Sort: false,
            SortCategories: [],
            SortCategoriesIdCsv: '',
            showDeleteConfirmation: false,
            deleteItem: ''

        }
        this.setSortState = this.setSortState.bind(this);
    }

    SortModal() {
        this.setState({
            Sort: !this.state.Sort,
        }, () => {
            this.setSortState()
        });
    }
    setSortState = () => {
        try {

            let sortCSV = [];
            let temp = this.state.topItem
            for (var u = 0; u < temp.length; u++) {
                sortCSV.push(temp[u].Id);
            }
            sortCSV = sortCSV.toString()
            this.state.SortCategories = temp;
            this.state.SortCategoriesIdCsv = sortCSV
            this.setState({
                SortCategories: this.state.SortCategories,
                SortCategoriesIdCsv: this.state.SortCategoriesIdCsv

            })
        }
        catch (e) {
            console.log("setSortState Exception", e)
        }
    }
    onSortEnd = ({ oldIndex, newIndex }) => {
        this.setState(({ SortCategories }) => ({
            SortCategories: arrayMove(SortCategories, oldIndex, newIndex),
        }));

        this.GetUpdatedCategorySort(this.state.SortCategories);

    };
    GetUpdatedCategorySort(categories) {

        let sortCSV = [];
        categories = this.state.SortCategories

        for (var u = 0; u < categories.length; u++) {
            sortCSV.push(categories[u].Id);
        }
        sortCSV = sortCSV.toString()
        this.setState({ SortCategoriesIdCsv: sortCSV })
    }
    UpdateCategorySort = () => {
        try {
            this.setState({
                topItem: this.state.SortCategories,
            }, () => {
                DefaultTheme.setTopItems(this.state.topItem)
                this.saveTheme(this.state.topItem)
                this.SortModal()
            })
        }
        catch (e) {
            console.log("UpdateCategorySort exception", e)
        }
    }
    GenerateNavigationSortModel() {

        if (!this.state.Sort) {
            return ('');
        }
        return (
            <Modal isOpen={this.state.Sort} toggle={this.SortModal} className={this.props.className}>
                <ModalHeader>Sort Items</ModalHeader>
                <ModalBody>
                    <div className="m-b-15">Use mouse or finger to drag Articles and sort their positions.</div>
                    <div className="sortable-wrap sortable-item sortable-new-wrap">

                        <SortableContainer
                            items={this.state.SortCategories}
                            onSortEnd={this.onSortEnd}
                            hideSortableGhost={true} >

                        </SortableContainer>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => this.SortModal()}>Cancel</Button>
                    <Button color="primary" onClick={() => this.UpdateCategorySort()}>
                        {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                            : <span className="comment-text">Save</span>}

                    </Button>
                </ModalFooter>
            </Modal>

        )

    }


    addItem = (item) => {
        try {
            let temp = this.state.topItem
            let isExist = [];
            isExist = temp.filter(a => a.Id == item.Id);
            if (isExist.length > 0) {
                alert("Already Selected")
                return
            }
            item.Title = item.Title.replace(regex, '')
            temp.push(item);
            this.setState({
                topItem: temp,
                searchItem: '',
                data: []
            })
            this.saveTheme(temp)
        }
        catch (e) {
            console.log("addItem Exception", e)
        }
    }
    deleteConfirmModal = (item) => {
        this.setState({
            showDeleteConfirmation: true,
            deleteConfirmationModelText: item.Title,
            deleteItem: item
        })
    }
    GenerateSweetConfirmationWithCancel(item) {
        return (
            <SweetAlert
                show={this.state.showDeleteConfirmation}
                title="Are you sure you want to remove this item?"
                text={this.state.deleteConfirmationModelText}
                showCancelButton
                onConfirm={() => this.deleteItem(item)}
                confirmButtonText="Yes"
                onCancel={() => {
                    this.setState({ showDeleteConfirmation: false });
                }}
                onEscapeKey={() => this.setState({ showDeleteConfirmation: false })}
            // onOutsideClick={() => this.setState({ showDeleteConfirmation: false })}
            />
        )
    }
    deleteItem = (item) => {
        try {
            let temp = this.state.topItem
            let index = temp.findIndex(a => a.Id == item.Id)
            temp.splice(index, 1)
            this.setState({
                topItem: temp,
                searchItem: '',
                data: [],
                showDeleteConfirmation: false
            })
            this.saveTheme(temp)
        }
        catch (e) {
            console.log("deleteItem Exception", e)
        }
    }


    saveTheme = (DataJson) => {
        try {
            DefaultTheme.setTopItems(DataJson)
        }
        catch (e) {
            console.log("saveTheme Exceptin", e)
        }
    }

    menuTopItems_WriteHtmlRestaurantCategory(menuCategories) {
        var restaurantCategoryHtml = "";
        var menuTopItems_dataMenuCategory = "";
        var menuTopItems_restaurantInfoData = menuCategories
        if (menuCategories != "") {
            menuCategories = JSON.parse(menuCategories).RestaurantMenu
            menuTopItems_dataMenuCategory = menuCategories;
            if (menuTopItems_restaurantInfoData != null) {
                for (var i = 0; i < menuCategories.length; i++) {
                    var isMatrix = menuTopItems_dataMenuCategory[i].HasMatrix;
                    restaurantCategoryHtml += this.renderItem(menuCategories[i].Id, menuTopItems_dataMenuCategory[i], isMatrix);
                }
            }
        }
    }

    renderItem(categoryId, categoryData, isMatrixData) {
        var temp = this.state.data
        var searchItem = this.state.searchItem;
        if (searchItem.length == 0) {
            this.setState({
                data: []
            })
            return
        }
        var menuItemsRowHtml = "",
            metaItemObj = categoryData.MetaItems;
        categoryId = categoryId

        for (var i = 0; i < metaItemObj.length; i++) {
            for (var j = 0; j < metaItemObj[i].Items.length; j++) {
                var matchedItem = metaItemObj[i].Items[j].VarietyName.toLowerCase();
                if (matchedItem.match(searchItem.toLowerCase())) {
                    var searchedItem = searchItem
                    searchedItem = searchedItem.replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
                    var pattern = new RegExp("(" + searchedItem + ")", "gi");
                    metaItemObj[i].Items[j].VarietyName = metaItemObj[i].Items[j].VarietyName.replace(pattern, "<b>$1</b>");
                    let obj = {
                        categoryId: metaItemObj[i].Items[j].VarietyId,
                        Id: metaItemObj[i].Items[j].Id,
                        Title: metaItemObj[i].Items[j].VarietyName,
                        ImageUrl: Utilities.generatePhotoLargeURL(metaItemObj[i].Items[j].ItemPhotoName, true, false),
                        Price: metaItemObj[i].Items[j].Price,
                        PromotionalPrice: metaItemObj[i].Items[j].PromotionPrice,
                        RatingAverage: metaItemObj[i].Items[j].RatingAverage,
                        Description: metaItemObj[i].Items[j].Description,
                        Flag: ''
                    }
                    temp.push(obj)
                    this.setState({
                        data: temp
                    })
                }
            }
        }
    }

    render() {
        return (
            <div >
                <AvForm>
                    <div className="form-body">
                        <div className="dataTables_filter search-theme-field-wrap">


                            <AvField autoComplete="off" onChange={(e) => {

                                if (e.target != undefined && e.target.value != undefined) {
                                    var value = e.target.value
                                    this.state.searchItem = value

                                    this.state.data = [];
                                    this.menuTopItems_WriteHtmlRestaurantCategory(this.state.menuJson)
                                }
                            }} name="txtLink" value={this.state.searchItem} type="text" placeholder="Search items" className="form-control"
                            />
                              {this.state.data.length > 0 &&
                            <div className="autocomplete-search">
                                {this.state.data.map((item, index) => {
                                    return (
                                        <div onClick={() => this.addItem(item)} className="d-flex cursor-pointer " key={index}>

                                            {item.ImageUrl != "" ?
                                                <img className="item-image" src={item.ImageUrl} />
                                                :
                                                <i className="fa fa-picture-o item-image text-center pt-2" aria-hidden="true"></i>
                                            }
                                            <div className="item-text" dangerouslySetInnerHTML={{ __html: item.Title }} />

                                        </div>
                                    )
                                })}
                            </div>
                        }
                            <div className="menu-sort-link" onClick={() => this.SortModal()}>
                                <i className=" fa fa-sort-amount-asc" aria-hidden="true"></i>
                                Sort Items
                                </div>
                        </div>


                      

                        {this.state.topItem.length > 0 &&
                            <div className="common-theme-wrap ">

                                {this.state.topItem.map((item, index) => {
                                    var discountPrice = "";
                                    if (item.PromotionalPrice > 0) {
                                        discountPrice = (item.PromotionalPrice / item.Price) * 100;
                                        discountPrice = Math.ceil(discountPrice);
                                    }
                                    return (
                                        <div className="mb-4 slide-view-wrap" key={index}>
                                            {/* <span className="item-text">{index + 1}</span> */}
                                            {item.ImageUrl != "" ?
                                                <img src={item.ImageUrl} />
                                                :
                                                <div className="no-item-img">
                                                     <i class="fa fa-picture-o" aria-hidden="true"></i>
                                                </div>
                                            }
                                            <div className="card-body">
                                                <h2>
                                                    {item.Title.replace(regex, '')}
                                                </h2>
                                               
                                                    <p  dangerouslySetInnerHTML={{ __html: item.Description }} />
                                               
                                                <div className="rating-m-wrap">

                                                    <div className="top-item-rating-detail">

                                                        {item.RatingAverage != "0.00" &&
                                                            <div className="ratingContainer">
                                                                <StarRatings
                                                                    rating={Number(item.RatingAverage)}
                                                                    starDimension="20px"
                                                                    starRatedColor="#fdd22c"
                                                                    starSpacing="0px"
                                                                />
                                                            </div>
                                                        }
                                                        {/* <p>
    <span className="counter"><CountUp start={0} end={20} duration={2.5}/></span> Reviews
  </p> */}
                                                    </div>

                                                </div>
                                                <div className="pricing-meta">
                                                    {item.PromotionalPrice > "0.00" ?
                                                        <ul>
                                                            <li className="old-price">{currencySymbol + item.Price}</li>
                                                            <li className="current-price">{currencySymbol + item.PromotionalPrice}</li>
                                                            <li className="discount-price">{discountPrice}%</li>
                                                        </ul>
                                                        :
                                                        <ul>
                                                            <li className="old-price" style={{ textDecoration: "none" }}>{currencySymbol + item.Price}</li>
                                                        </ul>
                                                    }
                                                </div>
                                            </div>
                                            <div className="d-flex slider-buttons">
                                                <div>
                                                    <span class="m-b-0 statusChangeLink m-r-20" onClick={() => this.deleteConfirmModal(item)}><i class="fa fa-trash-o font-18 delete" aria-hidden="true"></i> Remove</span></div>

                                            </div>

                                        </div>
                                    )
                                })}
                            </div>
                        }


                    </div>
                </AvForm>

                { this.GenerateSweetConfirmationWithCancel(this.state.deleteItem)}
                { this.GenerateNavigationSortModel()}
            </div >
        )
    }
}