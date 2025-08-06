import React, { Component } from 'react'
import { BsSearch } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import Dropdown from 'react-bootstrap/Dropdown';
import *as svgIcon from '../../containers/svgIcon';
import * as EnterpriseMenu from '../../service/EnterpriseMenu';
import Constants from '../../helpers/Constants';
import * as Utilities from '../../helpers/Utilities';
import Avatar from 'react-avatar';
import { IoExitOutline } from "react-icons/io5";
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader, Table, Alert } from 'reactstrap';
import { AppSwitch } from '@coreui/react';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { HiOutlineUser } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
// import { HiOutlineUser } from "react-icons/hi";


export default class PointOfSale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusModal: false,
      dropdownOpen: false,
      ComplaintStatus: false,
      ComplaintDetail: false,
      isActive: false,
      PosItem: false,
      toppingShow: false,
      basketActive: false,
      OpenTable: false,
      userObject: {},
      menuJson: [],
      menu: [],
      menuItem:{},
      selectedMenuItemId: 0,
      extras: {}, 
      toppings: [],
      selectedToppings:[],
      selectedExtras:[],
      quantity: 0,
      totalAddAmount: 0,
      isEdit: false,
    }
    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      var userObject = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
      this.state.userObject = userObject;
      // if (userObject.RoleLevel !== Constants.Role.ENTERPRISE_ADMIN_ID) SetMenuStatus(false);
    }
    this.getEnterpriseProductJson()
  }
  OpenTableModal() {
    this.setState({
      OpenTable: !this.state.OpenTable,
    })
  }
  showHideSidebarRight = () => {
    this.setState({
      basketActive: !this.state.basketActive
    })
  }
  PosItemModal(menuItem,i) {
    // console.log('menuItem', menuItem)
    this.setState({
      PosItem: !this.state.PosItem,
      menuItem: menuItem != undefined ? menuItem : {},
      selectedMenuItemId: 0,
      toppingShow: false,
      extras: {}, 
      toppings: [], 
      quantity: 0,
      selectedExtras:[],
      selectedToppings:[]
    })
  }
  selectMenuItem = (menuItem) =>{
    // console.log('menuItem', menuItem)
    this.setState({ selectedMenuItemId: menuItem.Id, extras: menuItem.Extras, toppings: menuItem.Toppings, quantity: 0 })
  }
  toggleDropDown = () => this.setState({ dropdownOpen: !this.state.dropdownOpen });

  showHideSidebar = () => {
    this.setState({
      isActive: !this.state.isActive
    })
  }
  showToppingHide = (e, value) => {
    // console.log('checking show', e)
    this.setState({
      toppingShow: value
    })
  }

  getEnterpriseProductJson = async () => {
    var data = await EnterpriseMenu.GetEnterpriseJson();
    if (Object.keys(data).length > 0) {
      var menuJson = JSON.parse(data.MenuJson).RestaurantMenu
      this.setState({ menuJson: menuJson, selectedCatId: menuJson[0].Id, menu: menuJson[0] })
      // console.log('menuJson', menuJson)
    }
  }

  selectCategory = (value) => {
    // console.log('value', value)
    if(this.state.selectedCatId != value.Id){
      this.setState({selectedToppings:[], selectedExtras:[] })
    }
    this.setState({selectedCatId: value.Id, menu: value })
  }

  addSubtractQuantity = (value) =>{
    if(value == 1 && this.state.quantity != 0){
      this.setState({ quantity: this.state.quantity - 1 })
      return
    }
    if(value == 2) {
      this.setState({ quantity: this.state.quantity + 1 })
    }
  }
  addRemoveExtras = (e, extras, groupItem) =>{
      if(!!e.target.checked){
        groupItem.GroupName = extras.GroupName
        groupItem.GroupId = extras.Id
        this.state.selectedExtras.push(groupItem)
        this.setState({ selectedExtras: this.state.selectedExtras })
        return
      }
     var findIndex = this.state.selectedExtras.findIndex(v=> v.GroupId == extras.Id)
     this.state.selectedExtras.splice(findIndex,1)
     this.setState({ selectedExtras: this.state.selectedExtras })
  }

  selectedExtras = (id) =>{
    var isSelected = this.state.selectedExtras.filter(v=> v.GroupId == id)
    return isSelected.length > 0
  }
  selectedExtrasGroupItems = (id, groupId) =>{
    var isSelected = this.state.selectedExtras.filter(v=> v.GroupId == groupId)
    return isSelected.length > 0 && isSelected[0].Id == id
  }

  addRemoveExtrasGroupItems = (id, groupItem, extras) =>{
    var findItem = this.state.selectedExtras.filter(v=> v.Id == id)
    if(findItem.length > 0 && this.state.selectedExtras.GroupId ==  extras.Id) return
    var findIndex = this.state.selectedExtras.findIndex(v=> v.GroupId == extras.Id)
    if(findIndex != -1){
      this.state.selectedExtras.splice(findIndex,1)
    }
    groupItem.GroupName = extras.GroupName
    groupItem.GroupId = extras.Id
    this.state.selectedExtras.push(groupItem)
    this.setState({ selectedExtras: this.state.selectedExtras })
    // console.log('findIndex', findIndex)
  }

  addRemoveTopping = (e,topping) =>{
    if(!!e.target.checked){
      this.state.selectedToppings.push(topping)
      this.setState({ selectedToppings: this.state.selectedToppings })
      return
    }
    var toppingIndex = this.state.selectedToppings.findIndex(v => v.Id == topping.Id)
    var removeToppings = this.state.selectedToppings.splice(toppingIndex, 1)
    this.setState({ selectedToppings: this.state.selectedToppings  })
  }

  selectedToppings = (topping) =>{
   var isSelected = this.state.selectedToppings.filter(v=>v.Id == topping.Id)
    return isSelected.length > 0 
  }

  render() {
    // console.log('selectedToppings', this.state.selectedToppings)
    // console.log('selectedToppings',  this.state.userObject)
    const { userObject } = this.state;
    return (
      <div className='pos-wrap'>
        <div className='pos-search-wrap'>
          <div className='pos-s-field'>
            <span><BsSearch /></span>
            <input className='form-control search-menu' placeholder='Search Menu' />
          </div>
          <div className="pos-right-nav">
            <div className='p-nav-link' onClick={() => this.OpenTableModal()}>
              <span className='pos-table-i'>
                <span className='open-badge'>12</span>
                <svgIcon.OpenTable />
              </span>
              <div>Open Tables</div>
            </div>
            <div className='p-nav-link'>
              {
                Object.keys(this.state.userObject).length > 0 &&
                <div>
                  {this.state.userObject.PhotoName != "" ?
                    <img src={this.state.userObject.PhotoName} /> :
                    <Avatar className="header-avatar" name={this.state.userObject.DisplayName != "" ? this.state.userObject.DisplayName : (this.state.userObject.FirstName + ' ' + this.state.userObject.SurName)} round={true} size="25" textSizeRatio={1} />
                  }
                </div>
              }
              {/* <img src="https://www.shutterstock.com/image-photo/portrait-happy-mid-adult-man-260nw-1812937819.jpg"/> */}
              <div>{Object.keys(this.state.userObject).length > 0 ? this.state.userObject.DisplayName != "" ? this.state.userObject.DisplayName : (this.state.userObject.FirstName + ' ' + this.state.userObject.SurName) : '-'}</div>
            </div>
            <a className='p-nav-link' href="/">
              <span className='pos-exit-i '>
                <IoExitOutline />
              </span>

              <div className='mt-2'>Exit POS</div>
            </a>
          </div>
        </div>
        <div className='pos-left-right-wrap'>
          <div className='pos-left'>

            <div className='pos-c-wrap'>
              <div className='pos-c-name'>
                <div className='b-c-icon' onClick={() => this.showHideSidebar()}>
                  <RxHamburgerMenu />
                </div>
                <div className='b-c-text'>
                  Espresso and coffee
                </div>
              </div>
              <div className='pos-c-item-wrap'>
                {
                  Object.keys(this.state.menu).length > 0 && this.state.menu.MetaItems.length > 0 && this.state.menu.MetaItems.map((v, i) => (
                    <div key={i} className='item-name-link not-available-item' onClick={() => this.PosItemModal(v,i)}>
                     {
                      v.PhotoName != '' ?
                        <img src={Utilities.generatePhotoLargeURL(v.PhotoName)}
                      /> : 
                      <img src={"https://cloud.supershoply.com/images/no-image.jpg"}/>
                     }
                      
                      <span className="not-available"><i className="fa fa-warning mr-2"></i>Item not available</span>
                      <div className='item-name-text-wrap'>
                        <span className='item-link-label'>{v.Name}</span>

                      </div>

                    </div>
                  ))
                }
                {/* <div className='item-name-link'>
                    <img src="https://images.deliveryhero.io/image/fd-pk/Products/7873979.jpg?width=200" />
                    <div className='item-name-text-wrap'>
                      <span className='item-link-label'>Zingo Burger</span>
                    </div>
                  </div> */}
                {/* <div className='item-name-link not-available-item'>
                    <img src="https://images.deliveryhero.io/image/fd-pk/Products/7873846.jpg?width=200" />
                    <span className="not-available"><i className="fa fa-warning mr-2"></i>Item not available</span>
                    <div className='item-name-text-wrap'>
                      <span className='item-link-label'>Chicken Chow Mein</span>
                    </div>
                  </div> */}
                {/* <div className='item-name-link'>
                    <img src="https://images.deliveryhero.io/image/fd-pk/Products/6674071.jpg?width=200" />
                    <div className='item-name-text-wrap'>
                      <span className='item-link-label'>Crispy Chicken Mayo Garlic Roll</span>
                    </div>
                  </div> */}
                {/* <div className='item-name-link not-available-item'>
                    <img src="https://images.deliveryhero.io/image/fd-pk/Products/23395901.jpg?width=200" />
                    <span className="not-available"><i className="fa fa-warning mr-2"></i>Item not available</span>
                    <div className='item-name-text-wrap'>
                      <span className='item-link-label'>Crispy Chicken Lollipop Wings</span>
                      
                    </div>
                  </div> */}
                {/* <div className='item-name-link '>
                    <img src="https://images.deliveryhero.io/image/fd-pk/Products/22772218.jpg?width=200" />
                    <div className='item-name-text-wrap'>
                      <span className='item-link-label'>Alfredo Pasta </span>
                    </div>
                  </div> */}
                {/* <div className='item-name-link not-available-item'>
                    <img src="https://images.deliveryhero.io/image/fd-pk/Products/6674055.jpg?width=200" />
                    <span className="not-available"><i className="fa fa-warning mr-2"></i>Item not available</span>
                    <div className='item-name-text-wrap'>
                      <span className='item-link-label'>Plain Fries</span>
                     
                    </div>
                  </div> */}
                {/* <div className='item-name-link'>
                    <img src="https://images.deliveryhero.io/image/fd-pk/Products/23729872.jpg?width=1200" />
                    <div className='item-name-text-wrap'>
                      <span className='item-link-label'>Ramadan Deal 1</span>
                    </div>
                  </div>  */}
                {/* <div className='item-name-link'>
                    <img src="https://images.deliveryhero.io/image/fd-pk/Products/7873979.jpg?width=200" />
                    <div className='item-name-text-wrap'>
                      <span className='item-link-label'>Ramadan Deal 1</span>
                    </div>
                  </div> */}
                {/* <div className='item-name-link not-available-item'>
                    <img src="https://images.deliveryhero.io/image/fd-pk/Products/7873846.jpg?width=200" />
                    <span className="not-available"><i className="fa fa-warning mr-2"></i>Item not available</span>
                    <div className='item-name-text-wrap'>
                      <span className='item-link-label'>Ramadan Deal 1</span>
                     
                    </div>
                  </div> */}
                {/* <div className='item-name-link'>
                    <img src="https://images.deliveryhero.io/image/fd-pk/Products/6674071.jpg?width=200" />
                    <div className='item-name-text-wrap'>
                      <span className='item-link-label'>Ramadan Deal 1</span>
                    </div>
                  </div> */}
              </div>
            </div>

          </div>
          <div className={`pos-right slide-basket-right ${this.state.basketActive ? 'is-active ' : ''}c-menu c-menu--push-right`}>
            <div className="thank-you-wrap d-none" id="dvThankyou">
              <div className="thank-you-page-success-main-wrap ">
                <div className="thank-you-page-success-wrap">
                  <span className="thank-icon-border"><i className="thank-success-icon fa fa-check" aria-hidden="true"></i></span>
                </div>
              </div>
              <h2 className="energized thank-you mb-3">Thank You!</h2>
              <p className="order-placed-note"><strong>Your complaint is received. One of our staff will get in touch with you and resolve it at earliest.</strong></p>

              <a className="mt-3 btn btn-primary">That's Great</a>
            </div>

            <div className='main-basket-wrap'>
              <div className="panel-heading">

                <BiArrowBack className='mb-2 font-24 mr-3 basket-back-arrow' onClick={() => this.showHideSidebarRight()}></BiArrowBack>
                <h3 className="d-flex align-items-center justify-content-between ">
                  <div> Customer Order</div>


                </h3>
                <div className="a-remove-all-item-wrapper">
                  <span className="a-remove-all-item"><i className="fa fa-trash mr-2"></i> Remove all</span>
                </div>

              </div>
              <div className='basket-item-top-wrap'>
                <div className='basket-item-wrap'>
                  <div className="basket-order-empty d-none" id="dvBasketEmpty">
                    <span className="order-empty-basket">Your order basket is empty.</span>
                    <span className="order-empty-like-menu">What would you like to order today?</span>
                  </div>
                  <div className='pos-item-loop-p-wrap'>
                    <div className='pos-item-row'>
                      <div className="b-item-price">
                        <div className="b-item-name-label"><span className="quantity">1</span><span className='quantity-x'>x</span><span className="o-i-name">Double Trouble</span> <span className="o-i-varity">(Any 2 x 08 Inch Pizzas)</span></div>
                        <div className="b-item-price-label"><span className="pos-item-price">11.99</span></div>
                      </div>
                      <span className="b-item-quantity-plus-minus mb-3"><span className="q-plus-icon mr-3"><i className="fa fa-plus-circle" aria-hidden="true"></i>Add Qty</span><span className="q-minus-icon mr-3"><i className="fa fa-minus-circle" aria-hidden="true"></i>Remove</span></span>
                      <div className="item-topping-wrap mb-3">
                        <div className="w-100 d-flex flex-column">
                          <span className="tp-label"><span className='toping-extras-label'>Toppings</span></span>
                          <div className='item-t-e'><span className="topping-extra-dtl">1 x 1st Cheese </span><span className="topping-extra-price">£0.59</span></div>
                          <div className='item-t-e'><span className="topping-extra-dtl">1 x 1st Chicken </span><span className="topping-extra-price">£0.59</span></div>
                          <div><span className="menu-item-extras-edit-common"><i className="fa fa-pencil-square-o" aria-hidden="true"></i>change</span></div>

                        </div>
                      </div>
                      <div className="item-topping-wrap mb-3">
                        <div className="w-100 d-flex flex-column">
                          <span className="tp-label"><span className='toping-extras-label'>Extras</span></span>
                          <div className='item-t-e'><span className="topping-extra-dtl">1 x 1st Cheese </span><span className="topping-extra-price">£0.59</span></div>
                          <div className='item-t-e'><span className="topping-extra-dtl">1 x 1st Chicken </span><span className="topping-extra-price">£0.59</span></div>
                          <div><span className="menu-item-extras-edit-common"><i className="fa fa-pencil-square-o" aria-hidden="true"></i>change</span></div>

                        </div>
                      </div>

                    </div>
                    <div className='pos-item-row'>
                      <div className="b-item-price">
                        <div className="b-item-name-label"><span className="quantity">1</span><span className='quantity-x'>x</span><span className="o-i-name">Double Trouble</span> <span className="o-i-varity">(Any 2 x 08 Inch Pizzas)</span></div>
                        <div className="b-item-price-label"><span className="pos-item-price">11.99</span></div>
                      </div>
                      <span className="b-item-quantity-plus-minus mb-3"><span className="q-plus-icon mr-3"><i className="fa fa-plus-circle" aria-hidden="true"></i>Add Qty</span><span className="q-minus-icon mr-3"><i className="fa fa-minus-circle" aria-hidden="true"></i>Remove</span></span>


                    </div>


                  </div>

                </div>


                {/* <div className="pos-total-item-row mb-3">
                    <div className="item-total-label">Total
                    </div>
                    <div className="item-total-label text-right">
                      <span>$</span>
                      <span className="item-total-price-label ">112.94</span>

                    </div>

                  </div> */}

              </div>
              <div className="totall-amount-wrap position-relative">


                <div className="pos-total-item-row total">
                  <div className="item-total-label justify-content-end">Total</div>
                  <div className="item-total-label text-right"><span>$</span><span className="item-total-price-label">112.94</span></div>
                </div>
                <div className="pos-total-item-row d-none">
                  <div className="item-total-label">Items Total</div>
                  <div className="item-total-label text-right"><span>$</span><span className="item-total-price-label">112.94</span></div>
                </div>
                <div className="pos-total-item-row d-none">
                  <div className="item-total-label">GST 18%</div>
                  <div className="item-total-label text-right"><span className="item-total-price-label">$2.76</span></div>
                </div>
              </div>
              <div className='pos-table-c-name-wrap'>
                <div className='pos-input-row'>
                  <span className='p-table-icon'> <svgIcon.OpenTable /></span>
                  <input className='form-control' type="text" placeholder='Table No' />
                </div>
                <div className='pos-input-row'>
                  <span className='p-user-icon font-16'><HiOutlineUser></HiOutlineUser></span>
                  <input className='form-control' type="text" placeholder='Customer Name' />
                </div>
              </div>

              <div className="basket-checkout-btn-wrap d-flex justify-content-center">
                <div className="btn btn-primary btn-large-h d-flex align-items-center justify-content-center"><i className="fa fa-shopping-cart mr-2"></i>Confirm Order
                </div>
              </div>
            </div>
          </div>
          <div class="pos-overlay" onClick={() => this.showHideSidebarRight()}></div>
        </div>
        <div className="mobile-sidebar">
          <nav id="c-menu--push-left" className={`c-menu c-menu--push-left ${this.state.isActive ? 'is-active' : ''}`}>
            <div className="d-flex align-items-center justify-content-between py-1 px-3"><span className="browse-by-cat-wrap">Categories</span>
              <span className='close-s-bar' onClick={() => this.showHideSidebar()}><RxCross2 className=''></RxCross2></span>
            </div>
            <ul className="pos-category-wrap">
              {
                this.state.menuJson.length > 0 && this.state.menuJson.map((v, i) => (
                  <li key={i} onClick={() => this.selectCategory(v)} className={`pos-submenu ${this.state.selectedCatId == v.Id ? "active" : ''}`}>
                    <a className={`submenu-c ${v.Id == this.state.selectedCatId ? "active":""}`}>{v.Name}</a>
                  </li>
                ))
              }
              {/* <li className="pos-submenu">
                  <a className="submenu-c">PIZZAS</a>
                </li>
                <li className="pos-submenu">
                  <a className="submenu-c">CALZONES</a>
                </li>
                <li className="pos-submenu">
                  <a className="submenu-c"> Meal Deals</a>
                </li>
                <li className="pos-submenu">
                  <a className="submenu-c">BURGERS</a>
                </li>
                <li className="pos-submenu">
                  <a className="submenu-c">DESSERTS</a>
                </li> */}
            </ul>
          </nav>
          <div className='pos-overlay' onClick={() => this.showHideSidebar()}></div>
        </div>

        <Modal isOpen={this.state.PosItem} toggle={() => this.PosItemModal()} className={this.props.className}>
          <ModalHeader toggle={() => this.PosItemModal()} className="pos-header">
            {Object.keys(this.state.menuItem).length > 0 && this.state.menuItem.MenuCategoryName}
          </ModalHeader>
          <ModalBody className='pos-item-modal-wrap dynamic-modal-body-h'>
            <div className=''>
              <div className='mb-4'>
                <div class="bold flex-1 cursor-pointer font-16 mb-2">Choose Option</div>
                <div className='choose-options-item-wrap'>
                  {
                    Object.keys(this.state.menuItem).length > 0 && this.state.menuItem.Items.length > 0 && this.state.menuItem.Items.map((v,i)=>(
                      <div key={i} onClick={()=>this.selectMenuItem(v)} className={`${this.state.selectedMenuItemId == v.Id && 'active'} options-item flex-column`}>
                        {
                          this.state.selectedMenuItemId == v.Id &&
                          <span className='p-item-checked'><i className='fa fa-check-circle'></i></span>
                        }
                        <label>{v.Name}</label>
                        <span className='s-bold'>{userObject.EnterpriseRestaurant.Country.CurrencySymbol + v.Price}</span>
                      </div>
                    ))
                  }
                  {/* <div className='options-item flex-column' >
                    <label>Large</label>
                    <span className='s-bold'>£  0.80</span>
                  </div>
                  <div className='options-item flex-column'>
                    <label>Extra Large</label>
                    <span className='s-bold'>£  0.80</span>
                  </div> */}
                </div>
              </div>
              {
                Object.keys(this.state.extras).length > 0 &&
                <div className='mb-4'>
                  <div class="bold flex-1 cursor-pointer font-16 mb-2">Choose Extras</div>
                  <div>
                      {
                        this.state.extras.Item.length > 0 &&
                        <ul className="d-flex flex-wrap mb-2">
                          {
                            this.state.extras.Item.map((v, i) => (
                              <li className='d-flex'>
                                <label for="chkAll" className="d-flex align-items-center">
                                  <input type="checkbox" className="form-checkbox" checked={v.Mandatory == 1} value={v.Mandatory == 1} name="chkAll" id="chkAll" />
                                </label>
                                <div className='d-flex align-items-baseline'>
                                  <label class=" mr-2 cursor-pointer font-14 " for="chkAll">{v.Name}</label>
                                  {
                                    v.Mandatory == 1 &&
                                    <label className="button-link font-11" for="chkAll"> (Required)</label>
                                  }
                                </div>
                              </li>
                            ))
                          }
                        </ul>
                      }

                    {
                      this.state.extras.ItemGroup.length > 0 && this.state.extras.ItemGroup.map((v,i)=>(
                            <div key={i}>
                            <ul className="d-flex flex-wrap mb-2">
                            
                                <li className='d-flex'>
                                  <label for="chkAll" className="d-flex align-items-center">
                                    <input type="checkbox" className="form-checkbox" onChange={(e)=>this.addRemoveExtras(e,v, v.GroupItems[0])} checked={this.selectedExtras(v.Id)} name="chkAll" id="chkAll" value={this.selectedExtras(v.Id)} />
                                  </label>
                                  <div className='d-flex align-items-baseline'>
                                    <label class=" mr-2 cursor-pointer font-14 " for="chkAll">{v.GroupName}</label>
                                    {
                                      v.Mandatory == 1 &&
                                      <label className="button-link font-11" for="chkAll"> (Required)</label>
                                    }
                                  </div>
                                </li>
                            
                            </ul>
                          {
                            v.GroupItems.length > 0 && 
                              <div className='options-item-wrap d-flex  mb-2'>
                                {v.GroupItems.map((val,ind)=>(
                                  <div onClick={()=>this.addRemoveExtrasGroupItems(val.Id, val, v)} key={ind} class={`${this.selectedExtrasGroupItems(val.Id, v.Id) && "active"} options-item`}>
                                    <span class="p-item-checked">
                                      <i class="fa fa-check-circle"></i>
                                    </span>
                                    <label class=" s-bold">{val.Name}</label>
                                    {
                                      val.Price != 0 &&
                                      <span class="ml-4  s-bold badge badge-secondary px-2 py-1">{userObject.EnterpriseRestaurant.Country.CurrencySymbol + val.Price}</span>
                                    }
                                  </div>
                                // <div key={ind} className='active options-item'>
                                //   <span className='p-item-checked'><i className='fa fa-check-circle'></i></span>
                                //   <label className='s-bold'>{val.Name} </label>
                                //   <span class="s-bold ml-2"> £0.180</span>
                                // </div>
                                ))}
                              </div>
                            
                          }
                          </div>
                     ))
                    }


                  
                  </div>

                </div>
              }
             {
              this.state.toppings.length > 0 && 
                <div className='mb-4'>
                  <div class="bold flex-1 cursor-pointer font-16 mb-2 d-flex align-items-center ">
                    Add toppings?
                    <span className='pos-on-of-btn d-flex align-items-center ml-auto'>
                      <AppSwitch name="chkMandatary" onChange={(e) => this.showToppingHide(e, e.target.checked)} checked={this.state.toppingShow} className={'mr-auto'} variant={'3d'} color={'primary'} label dataOn={'\u2713'} dataOff={'\u2715'} />
                    </span>
                  </div>
                  <div className={`mb-3  flex-column ${!this.state.toppingShow ? 'd-none' : 'd-flex'}`}>
                      <div className='add-toppings-box d-flex flex-column'>
                        {
                          this.state.toppings.map((v, i) => (
                            v.ToppingList.length > 0 && v.ToppingList.map((val, ind) => (
                              <div className='pos-topping-row'>
                                <div className='pos-topping-checkbox w-100'>
                                  <label htmlFor={val.Id} className="d-flex align-items-center mr-3 mb-0">
                                    <input type="checkbox" onChange={(e)=>this.addRemoveTopping(e,val)} checked={this.selectedToppings(val)}  className="form-checkbox" name={val.Id} id={val.Id} />
                                    <span className="button-link"> {val.Name}</span>
                                    <div className='pos-p-price'>
                                  {userObject.EnterpriseRestaurant.Country.CurrencySymbol + val.Price}
                                </div>
                                  </label>
                                </div>

                               


                              </div>
                            ))
                          ))
                        }
                      </div>

                  </div>
                </div>
             }
             {/* {
              this.state.selectedMenuItemId != 0 &&
              <div className='pos-topping-row align-items-center'>
                <span className='mr-2'>Quantity</span>
                <div className='plus-minus-parent-wrap'>
                  <span class="plus-minus-topping-wrap">
                    <span onClick={()=>this.addSubtractQuantity(1)} class="minus-icon">
                      -
                    </span>
                    <span className='pos-item-quantity-label'>{this.state.quantity}</span>
                    <span onClick={()=>this.addSubtractQuantity(2)} class="plus-icon">
                      +
                    </span>
                  </span>

                </div>
              </div>
             } */}

            </div>
          </ModalBody>
          <FormGroup className="modal-footer" >
            <div className='mr-auto pos-item-modal-wrap'>
              {
                this.state.isEdit ?
                <div className={`pos-apply-quantity-wrap ${!this.state.toppingShow && 'd-none'}`}>
                <span>Apply changes to</span>
                <select className='form-control'>
                  <option selected>All</option>
                  <option value="1">1 quantity</option>
                  <option>2 quantities</option>
                  <option>3 quantities</option>
                  <option >4 quantities</option>
                </select>

              </div>
              :
                this.state.selectedMenuItemId != 0 &&
             
              <div className='pos-topping-row align-items-center'>
              <span className='mr-2'>Quantity</span>
              <div className='plus-minus-parent-wrap'>
                <span class="plus-minus-topping-wrap">
                  <span onClick={()=>this.addSubtractQuantity(1)} class="minus-icon">
                    -
                  </span>
                  <span className='pos-item-quantity-label'>{this.state.quantity}</span>
                  <span onClick={()=>this.addSubtractQuantity(2)} class="plus-icon">
                    +
                  </span>
                </span>

              </div>
            </div>
              }
             
             
            </div>
            <div>
              <Button className='mr-2 text-dark' color="secondary" onClick={() => this.PosItemModal()}>Cancel</Button>
              <Button color="primary" >
                <span className="comment-text">{this.state.totalAddAmount != 0 ? `Add for ${userObject.EnterpriseRestaurant.Country.CurrencySymbol + 10.95}` : "Add"}</span>
              </Button>
            </div>
          </FormGroup>
        </Modal>

        <Modal size='lg' isOpen={this.state.OpenTable} toggle={() => this.OpenTableModal()} className={this.props.className}>
          <ModalHeader toggle={() => this.OpenTableModal()} >Open Tables</ModalHeader>
          <ModalBody>
          <div className='pos-wrap mb-3 ml-2 pos-modal-search'>
              <div className='pos-search-wrap'>
                <div className='pos-s-field p-0'>
                    <span><BsSearch /></span>
                    <input className='form-control search-menu' placeholder='Search Tables'/>
                </div>
              </div>
           </div>
            <div className="open-table-wrap">
              <div className="open-table-row">
                <div className="table-no-label cursor-pointer" data-toggle="modal" data-target="#myModal">
                  <div> Table No. 12</div>
                  <div className="text-right">
                    $2400.00
                  </div>
                </div>
                <div className="name-c-s-wrap cursor-pointer" data-toggle="modal" data-target="#myModal">
                  <div className="c-name">
                    <HiOutlineUser className='mr-2 font-14'>
                    </HiOutlineUser>
                    <span>Bilal Manzoor</span>
                  </div>
                  <div className="s-name">
                    {/* <div className="user-avatar-web">
                        <Avatar className="header-avatar" name="Bilal Mazoor" round={true} size="25" textSizeRatio={2} />
                      </div> */}
                    <img src="https://preview.keenthemes.com/metronic8/demo1/assets/media/avatars/300-7.jpg" />
                    <span>Abdul Mannan</span>
                  </div>
                </div>
                <div className="name-c-s-wrap">
                  <div className="font-14 d-flex align-items-center">
                    <svgIcon.ClockIcon />
                    <span className="ml-2"> 2 hrs</span>
                  </div>
                  <div className="text-right">
                    <div class="d-flex flex-column dropdown open-table-dropdown open">

                      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown} className={"padding-dropdown-complaint "}>
                        <Dropdown.Toggle variant="secondary" className="">
                          <div >
                            <svgIcon.CompleteIcon />
                            <span className=''>Complete</span>
                          </div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <div className="menu-data-action-btn-wrap">
                            <span className='status-icon-svg '>
                              <Dropdown.Item ><span class="">
                                <span className="d-flex align-items-center justify-content-center svg-width">
                                  <svgIcon.OpenTableIcon />
                                </span>
                                <span>Open</span> </span>
                              </Dropdown.Item>
                            </span>

                            <span className='status-icon-svg '>
                              <Dropdown.Item ><span class="">
                                <span className="d-flex align-items-center justify-content-center svg-width">
                                  <svgIcon.CompleteIcon />
                                </span>
                                <span>Complete</span> </span>
                              </Dropdown.Item>
                            </span>



                          </div>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          </ModalBody>
          <FormGroup className="modal-footer" >
            <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger"></label>
            </div>
            <div>
              <Button className='mr-2 text-dark' color="secondary" onClick={() => this.OpenTableModal()}>Cancel</Button>
              <Button color="primary" >
                {/* <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>   */}
                <span className="comment-text">Save</span>
              </Button>
            </div>
          </FormGroup>
        </Modal>

        <div className="click-cart menu-responsive-checkout" onClick={() => this.showHideSidebarRight()}>
          <span className="menu-label-checkout d-md-none">Your Order</span>
          <span className="shopping-cart position-relative">
            <AiOutlineShoppingCart className='common-header-icon ' />
            <span className="c-bubble" id="spMasterBasket">1</span>
          </span>
          <span id="spBasketTotal" className="h-basket-w" >
            <span className="a-price-symbol">AED </span>
            <span className="a-price-whole">108</span>
            <span className="a-price-symbol">.00</span>
          </span>
        </div>
      </div>
    )
  }
}
