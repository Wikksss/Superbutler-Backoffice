import React, { Component } from 'react'
import MUIDataTable from "mui-datatables";
// import Datepicker from "react-tailwindcss-datepicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as OrderSupports from '../../service/OrderSupport';
import * as EnterpriseUsers from '../../service/EnterpriseUsers';
import * as CategoryService from '../../service/Category';
import * as ProductService from '../../service/Product';
import Constants from '../../helpers/Constants';
import * as Utilities from '../../helpers/Utilities'
import moment from 'moment';
import GlobalData from '../../helpers/GlobalData';
import Config from '../../helpers/Config';
import Loader from 'react-loader-spinner';
import Labels from '../../containers/language/labels';
import Dropdown from 'react-bootstrap/Dropdown';
import Avatar from 'react-avatar';
import { IoMdSend } from "react-icons/io";

import { BiArrowBack } from "react-icons/bi";
import { FormGroup, Button, Modal, ModalBody, ModalFooter, ModalHeader, Label } from 'reactstrap';
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { getMessaging, onMessage, isSupported } from "firebase/messaging";
import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import { FaRegSmile } from "react-icons/fa";

import {Notify, orderSupportBubbleNotification, PlayNotificationSound } from '../../containers/DefaultLayout/DefaultLayout';
import *as svgIcon from '../../containers/svgIcon';
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel, } from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import { BiImageAdd } from "react-icons/bi";
import { SlBasketLoaded } from "react-icons/sl";
import { FiCheck } from "react-icons/fi";
import { FiX } from "react-icons/fi";

var timeZone = '';
var currencySymbol = '';


function readFile(file) {
  return new Promise(resolve => {
      const reader = new FileReader()
      reader.addEventListener(
          'load',
          () => resolve(reader.result),
          false
      )
      reader.readAsDataURL(file)
  })
}

export default class OrderSupport extends Component {
  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
    this.state = {

      value: {},
      startDate: moment(),
      endDate: moment(),
      histroyComplaints: [""],
      pageNumber: 1,
      pageSize: GlobalData.restaurants_data.Supermeal_dev.PageSize,
      showLoader: true,
      supportLoader: true,
      isLoading: true,
      TotalComplaint: 0,
      TotalResolved: 0,
      ComplaintChat: false,
      complainDetail: {},
      complainHistory: [],
      averageTime: 0,
      dropdownOpen: false,
      inputValue: '',
      slideRespActive: false,
      emojiPickerTrayState: false,
      supportConversation: [],
      activeConversationId: 0,
      supportConversationDetail: [],
      selectedConversation: {},
      userObj: {},
      sorting: false,
      users: [],
      filteredSupportConversation: [],
      lastConversaion: '',
      shouldRefresh: true,
      searchText: "",
      appendLocally: false,
      fetchSupportinterval: null,
      chkConcierge: true,
      chkSupport: true,
      categories: [],
      filteredCategories: [],
      // activeSection:'itinerary',
       activeSection:'chat-section-comp',
      itineraryInfo:false,
      itineraryDetail: {},
      itineraryLoader: false,
      categorySearchText: "",
      value1: {
        startDate: null,
        endDate: null,
    },
    selectedProducts: [],
    totalSelectedItemPrice: 0,
    selectedItemCsv: '',
    selectedItemId: 0,
    saved: false,
    saving: false,
    selectedIndex: 0,
    itemPriceValue: 0,
    selectedAccordion: "item-0",
    deletingPhotoName: "",
    countryConfigObj: {},
    }
    localStorage.setItem(Constants.ORDERSUPPORT_NOTIFICATION_BUBBLE, JSON.stringify(false))


    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.COUNTRY_CONFIGURATION))) {
      this.state.countryConfigObj = JSON.parse(localStorage.getItem(Constants.Session.COUNTRY_CONFIGURATION))
    }
    timeZone = Config.Setting.timeZone;
    currencySymbol = Config.Setting.currencySymbol;

    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      this.state.userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
      timeZone = this.state.userObj.EnterpriseRestaurant.Country.TimeZone;
      currencySymbol = this.state.userObj.EnterpriseRestaurant.Country.CurrencySymbol;
    }
    this.chatDetailRef = React.createRef();
    this.conversationDivRef = React.createRef();
    const messaging = getMessaging();
    var pathName = this.props.location.pathname.toLowerCase();
    if (isSupported()) {

      onMessage(messaging, (payload) => {
        let temp = payload;
        if(orderSupportBubbleNotification && pathName.indexOf('/order-support') == -1){
          orderSupportBubbleNotification(temp)
        }
        Notify(payload);
        if (temp.data.ActivityType == "OrderSupportNotification") {
          PlayNotificationSound();
          this.closeSupportInterval()
          this.supportInterval()

          if(this.state.selectedConversation.Id == temp.data.OrderSupportId){

             this.GetConceirgeOrderDetail(this.state.selectedConversation.Id);

             if (this.state.activeSection === 'itinerary' && temp.data.UserId != 0) {
              this.setState({ hasNewMessageInChatTab: true });
            }

          }

          var conversationIndex = this.state.supportConversation.findIndex(v => v.Id == temp.data.OrderSupportId)
          var filterConversation = this.state.supportConversation.filter(v => v.Id == temp.data.OrderSupportId)

          // console.log('payload', payload)
          // console.log('payload', filterConversation)

         if(temp.data.Type == 1){
          if(conversationIndex != -1){
            if (filterConversation.length > 0 && temp.data.IsCompleteMessage == '1') {
              const currentTimestamp = Date.now();
              const formattedDateTime = moment.utc().format("DD/MM/YYYY h:mm a");//`/Date(${currentTimestamp})/`;
              var messageDetailObj = {};
              messageDetailObj.CreatedOn = formattedDateTime
              messageDetailObj.Id = temp.data.OrderSupportConversationId
              messageDetailObj.IsRead = false
              messageDetailObj.IsSeen = false
              messageDetailObj.Message = temp.notification.body
              messageDetailObj.OrderSupportId = filterConversation[0].Id
              messageDetailObj.Reaction = ""
              messageDetailObj.UserId = temp.data.UserId //filterConversation[0].ReportedBy
              messageDetailObj.UserName = temp.data.UserName //temp.data.IsConsumer != 0 ? filterConversation[0].UserName : (this.state.userObj.DisplayName != "" ? this.state.userObj.DisplayName : (this.state.userObj.FirstName + " " + this.state.userObj.SurName))
              // var conversationIndex = this.state.supportConversation.findIndex(v => v.Id == temp.data.OrderSupportId)
              if (filterConversation[0]?.supportConversationDetail){
                var isMessageFound = filterConversation[0].supportConversationDetail.filter(v=>v.Id == temp.data.OrderSupportConversationId)
                if(isMessageFound.length > 0){
                  return
                }
                filterConversation[0].supportConversationDetail.push(messageDetailObj);
                this.state.supportConversation[conversationIndex].supportConversationDetail = filterConversation[0].supportConversationDetail
                this.state.supportConversation[conversationIndex].LastConversationDateTime = formattedDateTime
                if(this.state.supportConversation[conversationIndex].Status == 3){
                    this.state.supportConversation[conversationIndex].Status = 2
                    if(this.state.activeConversationId == filterConversation[0].Id){
                        this.state.selectedConversation.Status = 2
                    }
                }
                if(this.state.activeConversationId != this.state.supportConversation[conversationIndex].Id){
                  this.state.supportConversation[conversationIndex].NewMessageCount += 1
                }
                if (this.state.activeConversationId == filterConversation[0].Id) {
                    this.IsReadMessage(filterConversation[0].Id)
                  // this.setState({ supportConversationDetail: this.state.supportConversation[conversationIndex].supportConversationDetail })
                }
                this.state.appendLocally = false;
                this.sortConversation()
                return
              }
              this.state.supportConversation[conversationIndex].LastConversationDateTime = formattedDateTime
              this.state.supportConversation[conversationIndex].NewMessageCount += 1
              this.state.appendLocally = false;
              this.sortConversation()
              return
            }
            this.GetSingleConversationDetailMessage(temp.data.OrderSupportConversationId)
            // console.log('payload', payload)
            // console.log('payload2', filterConversation)
            return
          }
         }
          else if(temp.data.Type == 2)
            {
              if(conversationIndex != -1){
              this.state.supportConversation[conversationIndex].AssignedToName = temp.data.AssignedUserName;
              this.state.supportConversation[conversationIndex].AssignTo = temp.data.AssignTo;
              this.state.supportConversation[conversationIndex].Status = 1;
              this.setState({});
              return;
              }
            } else if(temp.data.Type == 3)
            {
              if(conversationIndex != -1){
                this.state.supportConversation[conversationIndex].Status = temp.data.Status;
                this.setState({});
                return;
              }
            }
            this.state.appendLocally = false;
          if(this.state.supportConversation.length > 0){

            this.GetSingleSupportConversation(temp.data.OrderSupportId)
          }else
          {

            this.GetSupportConversation();

          }
          this.SearchConversation(this.state.searchText);
          return
        }
        // if (temp.data.ActivityType == "OrderSupportNotification"){
        //   this.sortConversation()
        // }
      });
    }
  }



  itineraryInfoModal() {
    this.setState({
      itineraryInfo: !this.state.itineraryInfo,
    })

    var categories = this.state.categories;

    categories.forEach(cat => {

      cat.Products.forEach(prod => {

        prod.IsChecked = false;

     });

    });

    this.setState({categories: categories, filteredCategories: categories});

    if(this.state.categories.length > 0) return
      this.GetCategories();

}


// Start menu method for conceirge chat

GetCategories = async () => {

    var data = await CategoryService.GetAll(this.state.selectedConversation.EnterpriseId);

    data.sort((x, y) => ((x.SortOrder === y.SortOrder) ? 0 : ((x.SortOrder > y.SortOrder) ? 1 : -1)))
    let filteredData = []
    filteredData = data.filter((cat) => {
      return cat.IsPublished
    })
    if(filteredData.length) {
      this.setState({ categories: filteredData, filteredCategories: filteredData});

      filteredData.forEach(cat => {
        this.GetProducts(cat.Id);
      });

    }

  }

    GetProducts = async (categoryId) => {

      this.setState({ ShowLoaderRightPanel: true });
      var data = await ProductService.GetWithDetails(this.state.selectedConversation.EnterpriseId, categoryId);
      data.sort((x, y) => ((x.IsPublished  === y.IsPublished) ? y.SortOrder - x.SortOrder : (!y.IsPublished ? 1 : -1)))
      data.reverse();
      let filteredData = []
        filteredData = data.filter((prod) => {
          return prod.IsPublished
        })

      var index = this.state.categories.findIndex(p => p.Id == categoryId)

      this.state.categories[index].Products = filteredData;

      this.setState({ FilterProducts: filteredData });
      this.GetActiveProducts(data);
    }

    GetActiveProducts(productList) {

      let prod = [];
      let productArr = [];

      for (var i = 0; i < productList.length; i++) {

        if (productList[i].IsPublished && Utilities.GetObjectArrId(productList[i].MenuItemMetaId,productArr) === "-1") {
          prod.push({ "id": productList[i].MenuItemMetaId, "name": productList[i].MenuMetaName , "SortOrder": productList[i].SortOrder,  });
          productArr.push({ "Id": productList[i].MenuItemMetaId});
        }
      }

      prod.sort((x, y) => ((x.SortOrder === y.SortOrder) ? 0 : ((x.SortOrder > y.SortOrder) ? 1 : -1)))

      this.setState({ SortProducts: prod });

    }

  // Handle expand event
  handleExpand = (expandedIds) => {
    console.log("Expanded Items:", expandedIds);
    this.setState({ expandedItems: expandedIds });

    if(expandedIds.length > 0)
    {
      expandedIds.forEach(id => {

        var category = this.state.categories.find(p => p.Id == id)

        if(category.Products == undefined){

          this.GetProducts(id);
        }

      });

    }

  };

  handleItemSelection = (catId, productId, isChecked) => {

    var categories = this.state.categories;
    var filteredCategories = this.state.filteredCategories;
    var selectedProducts = this.state.selectedProducts;

    var selectedCategoryIndex = categories.findIndex(c => c.Id == catId);
    var selectedProductIndex =  categories[selectedCategoryIndex].Products.findIndex(p => p.Id == productId);

    var selectedFilteredCategoryIndex = filteredCategories.findIndex(c => c.Id == catId);
    var selectedFilterdProductIndex =  filteredCategories[selectedFilteredCategoryIndex].Products.findIndex(p => p.Id == productId);

    var selectedProduct = categories[selectedCategoryIndex].Products.find(p => p.Id == productId);
    selectedProduct.IsChecked = isChecked;

    categories[selectedCategoryIndex].Products[selectedProductIndex] = selectedProduct;
    filteredCategories[selectedFilteredCategoryIndex].Products[selectedFilterdProductIndex] = selectedProduct;

    var totalSelectedItemPrice = 0;
    var selectedItemCsv = '';
    categories.forEach(cat => {

      cat.Products.forEach(prod => {

        if(prod.IsChecked){
          totalSelectedItemPrice += prod.Price;
          selectedItemCsv += prod.Id + Config.Setting.csvSeperator
        }
     });

    });

    selectedItemCsv = Utilities.FormatCsv(selectedItemCsv,Config.Setting.csvSeperator);


    if(isChecked) {
      if(Utilities.GetObjectArrId(productId, selectedProducts) == "-1") {
        selectedProducts.push(selectedProduct);
      }
    } else
    {
      selectedProducts = selectedProducts.filter(p => p.Id != productId);
    }
    this.setState({selectedProducts: selectedProducts,
      categories: categories,
      filteredCategories: filteredCategories,
      selectedItemCsv: selectedItemCsv,
      totalSelectedItemPrice: totalSelectedItemPrice});
}


addItinerary = async() => {

  if(this.state.IsSavingItems) return;

  this.setState({IsSavingItems: true})


  var data = await OrderSupports.AddItemsToItinerary(this.state.activeConversationId, this.state.selectedItemCsv);
  if (!data.HasError && !!data.Dictionary?.IsSaved) {

    const systemMessage = "New item(s) has been added.";
    this.state.inputValue = systemMessage;
    await this.GetConceirgeOrderDetail(this.state.selectedConversation.Id);
    this.sendMessages(0, 2);

    //this.onConversationClick(this.state.selectedConversation);
    this.setState({itineraryInfo: false});

  }

  this.setState({IsSavingItems: false})


}

updatePriceOnEnterKey = (e) => {

  if(e.keyCode === 13 && !e.shiftKey){
    if(this.state.inputValue.trim() !="" ) {
      e.preventDefault();
      this.sendMessages(1, 1)
      return
    }
    e.preventDefault();
  }

}

UpdateitineraryItemPrice = async(id, price, currentPrice, itemName, itemIndex) => {


  if(this.state.saving || currentPrice == price) return;

  this.setState({saving: true, selectedItemId: id, selectedIndex: itemIndex})


  var data = await OrderSupports.UpdateitineraryItemPrice(id, price);

  if (!data.HasError && !!data.Dictionary?.IsUpdated) {

    const systemMessage = `Price has been modified for ${itemName}.`;
    this.state.inputValue = systemMessage;
    await this.GetConceirgeOrderDetail(this.state.selectedConversation.Id);
    this.sendMessages(0, 2);

    //this.onConversationClick(this.state.selectedConversation);
  }

  setTimeout(() => {
    this.setState({saving: false})
  }, 2000);

  setTimeout(() => {
    this.setState({saved: false})
  }, 5000);


  this.setState({saved: true, itemFocused: false, selectedItemId: 0})

}

getTotalPrice = () => {
  const { itineraryDetail } = this.state;

  let total = 0;

  Object.values(itineraryDetail).forEach((items) => {
    items.forEach((item) => {
      const price = parseFloat(item.ItemPrice);
      if (!isNaN(price) && item.Status != 3) {
        total += price;
      }
    });
  });

  return total;
};

// end menu method for conceirge chat


handleChange = (newValue) => {

// Parse the input date string
    const parsedDate = moment(newValue, "ddd MMM DD YYYY");

    // Format the date as "YYYY-MM-DD"
    const formattedDate = parsedDate.format("YYYY-MM-DDT14:00");

    this.setState({
      validTillDate: formattedDate,
    });


  this.setState({ value: newValue });
}

HandleDateChange = (id, date, itemName, index) => {


 // Step 1: Extract the raw date + time parts
 const datePart = moment(date).format('YYYY-MM-DD');
 const timePart = moment(date).format('HH:mm');

 // Step 2: Recreate datetime as if it was picked in targetTimeZone
 const assumedDateTime = moment.tz(`${datePart} ${timePart}`, 'YYYY-MM-DD HH:mm', timeZone);

 // Step 3: Convert to UTC
 const utcTime = assumedDateTime.clone().utc();

  this.ItineraryUpdateItemDate(id, utcTime, itemName, index);

}

  componentWillMount() {
    document.body.classList.add('main-pad-remove');
    // document.addEventListener('visibilitychange', this.closeSupportInterval);
  }

  initialData = () => {
    this.GetSupportConversation()
    if(this.state.shouldRefresh) {
      this.initializeTextareas();
     this.scrollToBottom();
    }
  }

  onFocusTab = () => {

    this.initialData()

  }

  handleSectionChange = (section) => {
    //this.GetConceirgeOrderDetail(this.state.selectedConversation.Id)
    this.setState({ activeSection: section });

    if (section === 'chat-section-comp') {
      this.setState({ hasNewMessageInChatTab: false });
    }

  };

  handleStatusChange = (id, status, enterpriseId, itemName, index) => {
   this.ConciergeStatusUpdate(id, status, enterpriseId, itemName, index);
  };

  handlePaidByChange = (paidBy) => {
    this.setState({ paidBy: paidBy });
  };


  GetStatusTextAndClass = (status, isText) => {

    var className = "";
    var statusText = "";
    if (status == 1) {
        className = 'new-bg';
        statusText = "Pending"
    }

    if (status == 2) {
        className = 'confirm-bg';
        statusText = "Confirmed"
    } else if (status == 3) {
      className = "cancelled-bg";
      statusText = "Cancelled";
    } else if (status == 4) {
      className = "completed-bg";
      statusText = "Completed";
    }

    if(isText)
      return statusText;
    else
      return className;

  };



  GetStatusUpdateMessages = (status, itemName) => {

    var msg = "";

    if (status == 1) {
      msg = '';
    }

    if (status == 2) {
      msg = `The concierge confirmed the ${itemName}.`;
    } else if (status == 3) {
      msg = `The concierge cancelled the ${itemName}.`;
    } else if (status == 4) {
      msg = `The concierge marked the ${itemName} as completed.`;
    }

    return msg;
  };




  componentDidMount() {
    this.initialData()
    this.supportInterval()
    window.addEventListener('focus', this.onFocusTab);
    document.addEventListener('visibilitychange', this.closeSupportInterval);
    localStorage.removeItem(Constants.ORDERSUPPORT_NOTIFICATION_BUBBLE);

  }
  supportInterval = () =>{
    const fetchSupportinterval = setInterval(this.initialData, 60000); // Interval set to 1 minute (60000 milliseconds)
    this.setState({ fetchSupportinterval });
  }

  closeSupportInterval = () => { // Interval set to 1 minute (60000 milliseconds)
    clearInterval(this.state.fetchSupportinterval)
  }

  componentDidUpdate() {
    this.initializeTextareas();
    this.scrollToBottom();
  }
  initializeTextareas = () => {
    const tx = document.getElementsByTagName("textarea");
    for (let i = 0; i < tx.length; i++) {
      tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:auto;");
      tx[i].addEventListener("input", this.onInput, false);
    }
  }
  onInput = (event) => {
    event.target.style.height = 'auto';
    event.target.style.height = (event.target.scrollHeight) + "px";
  }

  handleInputChange = (event) => {
    this.setState({
      inputValue: event.target.value,
    });
  };
  handleSpanClick = (event) => {
    this.fileInputRef.current.click();
    event.stopPropagation();
  };

  handleFileChange = async (e, itemId) => {

    if(this.state.uploadingImage) return;

    this.setState({uploadingImage: true, selectedItemId: itemId})

    var bitStream = ""
    if (e.target.files && e.target.files.length > 0) {
      this.setState({ PhotoName: e.target.files[0].name });
      bitStream = await readFile(e.target.files[0])

      console.log("imageDataUrl", bitStream);

      var media = {};
      media.EnterpriseId = this.state.selectedConversation.EnterpriseId;
      media.PhotoBitStream = bitStream
      media.PhotoName = e.target.files[0].name;
      media.PhotoGroupName = "Concierge";

      console.log("media:", media)
      var data =  await OrderSupports.AdditineraryPhoto(media, itemId);

      if(!data.HasError && !!data.Dictionary?.IsUpdated) {

        if(!!data.Dictionary?.PhotoUrl) {

          const updatedItinerary = { ...this.state.itineraryDetail };

      // Loop over all dates
      Object.keys(updatedItinerary).forEach((date) => {
        updatedItinerary[date] = updatedItinerary[date].map((item) => {
          if (item.Id === itemId) {
            let existingMedia = [];

            if (!Utilities.stringIsEmpty(item.MediaJson)) {
              try {
                existingMedia = JSON.parse(item.MediaJson);
              } catch (e) {
                console.error("Invalid MediaJson:", e);
              }
            }

            // Add the new media object
            const newMedia = { AbsoluteUrl: data.Dictionary?.PhotoUrl };
            const updatedMedia = [...existingMedia, newMedia];

            return {
              ...item,
              MediaJson: JSON.stringify(updatedMedia)
            };
          }
          return item;
        });
      });

      const systemMessage = "The concierge uploaded a new media item.";
      this.state.inputValue = systemMessage;

      this.sendMessages(0, 2);
      // Utilities.notify("Status has been updated.", 's')
      this.setState({ itineraryDetail: updatedItinerary });

        }
      }

  }

  this.setState({uploadingImage: false})


  };

  DeletePhoto  = async (itemId, photoUrlToDelete) => {

    this.setState({deletingPhotoName: photoUrlToDelete})
    var data =  await OrderSupports.DeletePhoto(itemId, photoUrlToDelete);
    this.setState({deletingPhotoName: ""})
    if(!data.HasError && !!data.Dictionary?.IsDeleted) {

    const updatedItinerary = { ...this.state.itineraryDetail };

  Object.keys(updatedItinerary).forEach((date) => {
    updatedItinerary[date] = updatedItinerary[date].map((item) => {
      if (item.Id === itemId) {
        let existingMedia = [];

        if (!Utilities.stringIsEmpty(item.MediaJson)) {
          try {
            existingMedia = JSON.parse(item.MediaJson);
          } catch (e) {
            console.error("Invalid MediaJson:", e);
          }
        }

        // Filter out the media with the matching URL
        const updatedMedia = existingMedia.filter(
          (media) => media.AbsoluteUrl !== photoUrlToDelete
        );

        return {
          ...item,
          MediaJson: JSON.stringify(updatedMedia)
        };
      }
      return item;
    });
  });

  this.setState({ itineraryDetail: updatedItinerary });
  }

}


  showHideSidebarRight = (conversation) => {
    this.setState(prevState => ({
      slideRespActive: !prevState.slideRespActive
    }
    ));
  }
  handleChildClick(e) {
    e.stopPropagation();
  }
  triggerPickerTray(event) {
    // event.preventDefault();
    this.setState({
      emojiPickerTrayState: !this.state.emojiPickerTrayState

    })
  }
  closedtriggerPicker(event) {
    // event.preventDefault();
    if (this.state.emojiPickerTrayState) {
      this.setState({

        emojiPickerTrayState: false,


      })
    }
  }
  EmojiInputHtml() {
    let emojiPickerTray;
    if (this.state.emojiPickerTrayState) {
      emojiPickerTray = (
        <Picker
          title="Pick your emoji…"
          emoji="point_up"
          onSelect={emoji =>
            this.setState({
              messageTray: this.state.messageTray + emoji.native,
              inputValue: this.state.inputValue + emoji.native
            })
          }
        />
      );
    }
    return (
      <div className='order-support-emoji-wrap-p' style={{ zIndex: 99 }} onClick={this.handleChildClick} >
        {emojiPickerTray}
      </div>
    )

  }
  isBottom(el) {

    if (el != null) return el.getBoundingClientRect().bottom <= window.innerHeight + 5;
    else return null;
  }

  trackScrolling = () => {
    const wrappedElement = document.getElementById('header');

    // console.log("this.state.countAll", this.state.TotalComplaint);

  }

  scrollToBottom = () => {
    if (this.chatDetailRef.current) {
      this.chatDetailRef.current.scrollTop = this.chatDetailRef.current.scrollHeight;
    }
  };

  componentWillUnmount() {
    document.body.classList.remove('main-pad-remove');
    const tx = document.getElementsByTagName("textarea");
    for (let i = 0; i < tx.length; i++) {
      tx[i].removeEventListener("input", this.onInput, false);
    }
  }

  ComplaintChatModal(id) {
    this.setState({
      ComplaintChat: !this.state.ComplaintChat
    })

  }

  GetSupportConversation = async () => {
    var data = await OrderSupports.Get();
    if (data.length > 0) {
      var sortConversations = data.sort((a, b) => {
        const dateA = moment(a.LastConversationDateTime,"DD/MM/YYYY h:mm a");
          const dateB = moment(b.LastConversationDateTime,"DD/MM/YYYY h:mm a");
        return dateB - dateA;

      })

        this.state.shouldRefresh = (JSON.stringify(sortConversations) != this.state.lastConversaion)

        if(this.state.shouldRefresh) {
        var selectedConversation = Object.keys(this.state.selectedConversation).length > 0 ? this.state.selectedConversation : sortConversations[0];
        this.setState({ supportConversation: sortConversations, lastConversaion: JSON.stringify(sortConversations), activeConversationId: selectedConversation.Id, selectedConversation: selectedConversation },() => {
          this.state.selectedConversation = selectedConversation;
          this.GetAllUsers(selectedConversation.EnterpriseId)
          setTimeout(() => {
            this.GetSupportConversationDetail(selectedConversation)
          }, 500);
          this.IsReadMessage(selectedConversation.Id)
          this.SearchConversation(this.state.searchText)
        })
      }

      // this.sortConversation()
    }

    this.setState({showLoader: false, supportLoader: false})

  }

  GetSingleSupportConversation = async(supportId) =>{


    var data =  await OrderSupports.GetSingleConversation(supportId);
    if (data.length > 0){
        this.state.supportConversation.push(data[0])
        this.sortConversation()
    }
  }

  GetConceirgeOrderDetail = async(supportId) => {

    var data = await OrderSupports.GetConceirgeOrderDetail(supportId);
    var conceirgeOrderDetail = [];

    if (data.length > 0){

      data = data.reduce((acc, item) => {
        const date = item.DateTime.split(" ")[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(item);
        return acc;
    }, {});

    conceirgeOrderDetail = data;
    this.setState({itineraryDetail: data});
    }
    this.setState({showLoader: false, itemPriceValue: 0});

  }

  GetSingleConversationDetailMessage = async (conversationId) => {
    var data = await OrderSupports.GetSingleMessageDetail(conversationId);
    if(Object.keys(data).length > 0){
      var filterConversation = this.state.supportConversation.filter(v => v.Id == data.OrderSupportId)
      var conversationIndex = this.state.supportConversation.findIndex(v => v.Id == data.OrderSupportId)
      if (filterConversation[0]?.supportConversationDetail) {
        filterConversation[0].supportConversationDetail.push(data);
        this.state.supportConversation[conversationIndex].supportConversationDetail = filterConversation[0].supportConversationDetail
        this.state.supportConversation[conversationIndex].LastConversationDateTime = data.CreatedOn
        if(this.state.activeConversationId != this.state.supportConversation[conversationIndex].Id){
          this.state.supportConversation[conversationIndex].NewMessageCount += 1
        }
        this.sortConversation()
        return
      }
      this.state.supportConversation[conversationIndex].LastConversationDateTime = data.CreatedOn
      this.state.supportConversation[conversationIndex].NewMessageCount += 1
      this.sortConversation()
    }
  }

  GetSupportConversationDetail = async (conversation) => {
    this.setState({showLoader: true, itineraryDetail: {}})
    var filterConversation = this.state.supportConversation.filter(v => v.Id == conversation.Id)

    if(conversation.SupportType == 2)
      {
        await this.GetConceirgeOrderDetail(conversation.Id);
      }

    if (filterConversation.length > 0 && filterConversation[0]?.supportConversationDetail) {
      this.setState({ activeConversationId: conversation.Id, supportConversationDetail: filterConversation[0]?.supportConversationDetail, showLoader: false  })
      return
    }
    var data = await OrderSupports.GetDetail(conversation.Id);
    if (data.length > 0) {
      // if (filterConversation.length > 0) {
      //   filterConversation[0].supportConversationDetail = data
      // }
      var conversationIndex = this.state.supportConversation.findIndex(v => v.Id == data[0].OrderSupportId)
      this.state.supportConversation[conversationIndex].supportConversationDetail = data
      if(this.state.activeConversationId == data[0].OrderSupportId){
        this.setState({ supportConversationDetail: data,  showLoader: conversation.SupportType == 2 })
      }
    }

    // if(conversation.SupportType == 2)
    // {
    //   this.GetConceirgeOrderDetail(conversation.Id);
    // }

    this.setState({ showLoader: false })

  }

  onConversationClick = (conversation) => {
    this.setState({ activeConversationId: conversation.Id, selectedConversation: conversation, showLoader: true })
    this.showHideSidebarRight()

    this.GetAllUsers(conversation.EnterpriseId)

    setTimeout(() => {

      this.GetSupportConversationDetail(conversation)
    }, 500)
    this.IsReadMessage(conversation.Id)
  }

  loading = () => <div className="page-laoder page-laoder-menu">
  <div className="loader-menu-inner">
    <Loader type="Oval" color="#ed0000" height={50} width={50} />
    <div className="loading-label">Loading.....</div>
  </div>
</div>


  scrollToTop = () => {
      if (this.conversationDivRef.current) {
        this.conversationDivRef.current.scrollTop = 0;
      }
  };

  sortConversation = () =>{
      // Set state to indicate sorting is in progress
      this.setState({ sorting: true }, () => {
        // Sort conversations based on LastConversationDateTime
        const sortConversations = this.state.supportConversation.sort((a, b) => {
          const dateA = moment(a.LastConversationDateTime,"DD/MM/YYYY h:mm a");
          const dateB = moment(b.LastConversationDateTime,"DD/MM/YYYY h:mm a");
          return dateB - dateA;
        });

        // Delay setting state to simulate animation (optional, can adjust timing as needed)
        setTimeout(() => {
          this.scrollToTop()
          this.setState({ supportConversation: sortConversations, sorting: false });
        }, 300); // Adjust the timeout to match your CSS transition duration
      });
  }

  sendMessages = async (messageType, supportType) => {
    const { selectedConversation } = this.state;
    var messageObj = {};
    messageObj.Id = selectedConversation.Id
    messageObj.EnterpriseId = selectedConversation.EnterpriseId;
    messageObj.OrderId = supportType == 1 ? selectedConversation.OrderId : 0;
    messageObj.Status = selectedConversation.Status;
    messageObj.DeviceId = selectedConversation.DeviceId;
    messageObj.OrderToken = selectedConversation.OrderToken;
    messageObj.ReportedBy = selectedConversation.ReportedBy;
    messageObj.Type = messageType;
    messageObj.SupportType = supportType;
    messageObj.Conversation = {};
    messageObj.Conversation.Message = this.state.inputValue;
    messageObj.Conversation.UserId = messageType == 0 ? 0 : this.state.userObj.Id;

    this.setState({ inputValue: '' })

    var data = await OrderSupports.Save(messageObj);
    if (data !== undefined && !data.HasError && data.Dictionary.IsSaved === true) {
      const currentTimestamp = Date.now();
      const formattedDateTime = moment.utc().format("DD/MM/YYYY h:mm a"); //`/Date(${currentTimestamp})/`;
      this.state.appendLocally = true;
      var messageDetailObj = {};
      messageDetailObj.CreatedOn = formattedDateTime
      messageDetailObj.Id = data.Dictionary.ConversationId
      messageDetailObj.IsRead = false
      messageDetailObj.IsSeen = false
      messageDetailObj.Message = messageObj.Conversation.Message
      messageDetailObj.OrderSupportId = selectedConversation.Id
      messageDetailObj.Reaction = ""
      messageDetailObj.UserId = messageType == 0 ? 0 : this.state.userObj.Id;
      messageDetailObj.UserName =  messageType == 0 ? "" : this.state.userObj.DisplayName != "" ? this.state.userObj.DisplayName : (this.state.userObj.FirstName + " " + this.state.userObj.SurName)
      messageDetailObj.PhotoName = this.state.userObj.PhotoName;
      var conversationIndex = this.state.supportConversation.findIndex(v => v.Id == selectedConversation.Id)
      var isMessageFound = this.state.supportConversation[conversationIndex]?.supportConversationDetail.filter(v=>v.Id == data.Dictionary.ConversationId)
      if(isMessageFound.length == 0){
        this.state.supportConversation[conversationIndex].supportConversationDetail.push(messageDetailObj)
        this.state.supportConversation[conversationIndex].LastConversationDateTime = formattedDateTime
        this.setState({ supportConversationDetail: this.state.supportConversation[conversationIndex].supportConversationDetail })
      }
      // this.GetSupportConversationDetail({Id: data.Dictionary.OrderSupportId})
      this.setState({ inputValue: '' })
      this.closedtriggerPicker()
      this.removetextDynamicHeight()
      this.sortConversation()
      return
    }
    Utilities.notify(data.ErrorCodeCsv, 'e')
  }

  removetextDynamicHeight = () => {
    const tx = document.getElementsByTagName("textarea");
    for (let i = 0; i < tx.length; i++) {
      tx[i].setAttribute("style", "height:initial;");
    }
  }

  toggleDropDown = () => this.setState({ dropdownOpen: !this.state.dropdownOpen });


  sendMessageOnEnter = (e) =>{
    if(e.key === 'Enter' && e.shiftKey){
      e.preventDefault();
      this.setState((prevState) => ({
        inputValue: prevState.inputValue + '\n'
      }));
    }
    if(e.keyCode === 13 && !e.shiftKey){
      if(this.state.inputValue.trim() !="" ){
        e.preventDefault();
        this.sendMessages(1, 1)
        return
      }
      e.preventDefault();
    }
  }

  SetDateFormat = (conversationDate) => {

    conversationDate = moment(conversationDate,"DD/MM/YYYY h:mm a").format("YYYY-MM-DDThh:mm:ss");

      var date = Utilities.getDateByZone(conversationDate, "YYYY-MM-DD HH:mm", timeZone);

      var today = new Date(moment.tz(timeZone).format("YYYY-MM-DD HH:mm"));

      if (moment(date).isSame(today, 'day')) {
        return Utilities.getDateByZone(conversationDate, "h:mm a", timeZone);//moment(conversationDate).format('h:mm a')
      }

    return Utilities.getDateByZone(conversationDate, "DD MMM YYYY  h:mm a", timeZone);

  }

  SetItineraryFormat = (itemDate) => {

      itemDate = moment(itemDate,"DD/MM/YYYY HH:mm").format("YYYY-MM-DDThh:mm:ss");

      return Utilities.getDateByZone(itemDate, "YYYY-MM-DD HH:mm", timeZone);

    //   var today = new Date(moment.tz(timeZone).format("YYYY-MM-DD HH:mm"));

    //   if (moment(date).isSame(today, 'day')) {
    //     return Utilities.getDateByZone(conversationDate, "h:mm a", timeZone);//moment(conversationDate).format('h:mm a')
    //   }

    // return Utilities.getDateByZone(conversationDate, "DD MMM YYYY  h:mm a", timeZone);

  }

  // SearchCategory(value) {

  //   let searchText = value;
  //   let filteredData = []
  //   let activeCategory = this.state.activeCategoryCheck
  //   let inActiveCategory = this.state.inActiveCategoryCheck
  //   this.setState({SearchCategoryText: searchText});
  //   if (searchText.toString().trim() === '') {
  //     this.setState({FiltersMenuCategory: this.state.Categories,IsCategorySearching : false });
  //     return;
  //   }

  //   filteredData = this.state.Categories.filter((cate) => {

  //     let arr = searchText.toUpperCase().trim();
  //     let isExists = false;

  //       if (cate.Name.toUpperCase().indexOf(arr) !== -1 || cate.Description.toUpperCase().indexOf(arr) !== -1) {

  //         isExists = cate.IsPublished ? activeCategory : inActiveCategory;
  //       }

  //     return isExists
  //   })

  //   this.setState({ FiltersMenuCategory: filteredData, IsCategorySearching : true });

  // }


  SearchCategoryProduct = (e) => {
    let categorySearchText = e.target.value;
    let filteredCategories = [];

    this.setState({ categorySearchText });

    if (categorySearchText.trim() == '') {
      this.setState({
        filteredCategories: this.state.categories,
      });
      return;
    }

    const upperSearch = categorySearchText.toUpperCase();

    filteredCategories = this.state.categories
      .map((category) => {
        const filteredProducts = category.Products?.filter((prod) =>
          prod.MenuMetaName?.toUpperCase().includes(upperSearch)
        );

        const isCategoryMatch = category.Name?.toUpperCase().includes(upperSearch);

        if (isCategoryMatch || (filteredProducts && filteredProducts.length > 0)) {
          return {
            ...category,
            Products: filteredProducts,
          };
        }
        return null;
      })
      .filter((cat) => cat !== null);

    this.setState({
      filteredCategories,
    });
  };



  SearchConversation(value) {

    let searchText = value;
    let filteredData = []
    let allConversation = this.state.supportConversation;

    if (!this.state.chkSupport) {
      allConversation = allConversation.filter(item => item.SupportType != 1);
    }
    if (!this.state.chkConcierge) {
      allConversation = allConversation.filter(item => item.SupportType != 2);
    }

    this.setState({searchText: searchText});
    if (searchText.toString().trim() === '') {

      this.setState({filteredSupportConversation: allConversation });
      return;
    }

    filteredData = allConversation.filter((sc) => {

      let arr = searchText.toUpperCase().trim();
      let isExists = false;

        if ((sc.OrderId+"").indexOf(arr) !== -1 || (sc.Id+"").indexOf(arr) !== -1 || sc.UserName.toUpperCase().indexOf(arr) !== -1 || (sc.RoomNo+"").indexOf(arr) !== -1 || (sc.TableNo+"").indexOf(arr) !== -1) {

          isExists = true;
        }

      return isExists
    })

    this.setState({ filteredSupportConversation: filteredData });

  }

  IsReadMessage = async(conversationId) =>{
    var data = await OrderSupports.IsReadMessages(conversationId);
    if(!data.HasError && !!data.Dictionary?.IsUpdated && this.state.supportConversation.length > 0) {
      var conversationIndex = this.state.supportConversation.findIndex(v => v.Id == conversationId)
      this.state.supportConversation[conversationIndex].NewMessageCount = 0
      this.setState({supportConversation: this.state.supportConversation})
      // console.log('data',data)
      return
    }
  }

  ChangeStatus = async(conversationId, status, enterpriseId) => {
    var selectedConversationCopy = this.state.selectedConversation
    selectedConversationCopy.Status = status
    var data = await OrderSupports.UpdateStatus(selectedConversationCopy);
    if(!data.HasError && !!data.Dictionary?.IsUpdated){
      var conversationIndex = this.state.supportConversation.findIndex(v => v.Id == conversationId)
      this.state.supportConversation[conversationIndex].Status = status
      this.state.selectedConversation.Status = status

      var systemMessage = "has " + (this.GetStatusTextAndClass(status, true)).toLowerCase() + " Theater tickets - 1 Person";

      //this.state.inputValue



      this.setState({ selectedConversation: this.state.selectedConversation })
      // console.log('data',data)
      return
    }
  }


  ConciergeStatusUpdate = async(id, status, enterpiseId, itemName, itemIndex) => {

    if(this.state.saving) return;

    this.setState({saving: true, selectedItemId: id, selectedIndex: itemIndex})

    var data = await OrderSupports.ConciergeStatusUpdate(id, status, enterpiseId);
    if (!data.HasError && !!data.Dictionary?.IsUpdated) {
      const updatedItinerary = { ...this.state.itineraryDetail };

      // Loop over all dates
      Object.keys(updatedItinerary).forEach((date) => {
        updatedItinerary[date] = updatedItinerary[date].map((item) => {
          // Match item by ID
          if (item.Id === id) {
            return {
              ...item,
              Status: status,
            };
          }
          return item;
        });
      });

      const systemMessage = this.GetStatusUpdateMessages(status, itemName);
      this.state.inputValue = systemMessage;

      this.sendMessages(0, 2);
      this.setState({ itineraryDetail: updatedItinerary }, () => {
        console.log(systemMessage); // or display a toast
      });
    }


  setTimeout(() => {
    this.setState({saving: false})
  }, 2000);

  setTimeout(() => {
    this.setState({saved: false})
  }, 5000);

  this.setState({saved: true})
  }




  ItineraryUpdateItemDate = async(id, date, itemName, itemIndex) => {

    if(this.state.saving) return;

    this.setState({saving: true, selectedItemId: id, selectedIndex: itemIndex})


    var data = await OrderSupports.UpdateitineraryItemDate(id, date);
    if (!data.HasError && !!data.Dictionary?.IsUpdated) {
      await this.GetConceirgeOrderDetail(this.state.selectedConversation.Id);

      const systemMessage = "Conceirge has change datetime for " + itemName;
      this.state.inputValue = systemMessage;

      this.sendMessages(0, 2);
    }


    setTimeout(() => {
      this.setState({saving: false})
    }, 2000);

    setTimeout(() => {
      this.setState({saved: false})
    }, 5000);

    this.setState({saved: true})
  }


  ItineraryPaidByUpdate = async(id, paidBy, enterpiseId, itemName, itemIndex) => {

    if(this.state.saving) return;

    this.setState({saving: true, selectedItemId: id, selectedIndex: itemIndex})


    var data = await OrderSupports.ItineraryPaidByUpdate(id, paidBy, enterpiseId);
    if (!data.HasError && !!data.Dictionary?.IsUpdated) {
      const updatedItinerary = { ...this.state.itineraryDetail };

      // Loop over all dates
      Object.keys(updatedItinerary).forEach((date) => {
        updatedItinerary[date] = updatedItinerary[date].map((item) => {
          // Match item by ID
          if (item.Id === id) {
            return {
              ...item,
              PaidBy: paidBy,
            };
          }
          return item;
        });
      });

      const systemMessage = "The concierge updated the payment method for the " + itemName;
      this.state.inputValue = systemMessage;

      this.sendMessages(0, 2);
      // Utilities.notify("Status has been updated.", 's')
      this.setState({ itineraryDetail: updatedItinerary }, () => {
        console.log(systemMessage); // or display a toast
      });
    }

    setTimeout(() => {
      this.setState({saving: false})
    }, 2000);

    setTimeout(() => {
      this.setState({saved: false})
    }, 5000);

     this.setState({saved: true})
  }


  GetAllUsers = async(orderSupportEnterpriseId) =>{
    const enterpriseId = Utilities.GetEnterpriseIDFromSessionObject()
    const enterpriseCsv = `${enterpriseId},${orderSupportEnterpriseId}`
    var data = await EnterpriseUsers.GetEnterpriseUsers(enterpriseCsv);
    if(data.length > 0){

      data = data.filter(u => !u.IsDeleted && u.IsActive)

        this.setState({ users: data })
    }
    // console.log('GetAllUsers', data)
  }


  AssignUser = async(supportId, userId, assignById, assignToUsername, enterpriseId, userImage) =>{
    var selectedConversationCopy = this.state.selectedConversation
    selectedConversationCopy.AssignTo = userId
    selectedConversationCopy.AssignedBy = assignById
    var data = await OrderSupports.AssignUser(selectedConversationCopy);
    if(!data.HasError && !!data.Dictionary?.IsUpdated){
        // var selectedUser = this.state.users.find(v=>v.Id == userId)
          var supportIndex = this.state.supportConversation.findIndex(v=>v.Id == supportId)
          this.state.users[supportIndex].AssignedToName = assignToUsername
          this.state.selectedConversation.AssignedToName = assignToUsername
          this.state.users[supportIndex].UserImage = userImage
          this.state.selectedConversation.UserImage = userImage
          this.state.selectedConversation.Status = 1;
          this.setState({ selectedConversation: this.state.selectedConversation })
    }
    // console.log('data',data)
  }

  setStatusHtml(status) {
    if (status == 0) {
      return "New"
    }else if (status == 1) {
      return "Assigned"
    }else if (status == 2) {
      return "Re-Opened"
    }else if (status == 3) {
      return "Closed"
    }

}
  setStatusClass(status) {
    if (status == 0) {
      return "assigne-new-badge"
    }else if (status == 1) {
      return "assigne-assigned-badge"
    }else if (status == 2) {
      return "assigne-reopened-badge"
    }else if (status == 3) {
      return "assigne-close-badge"
    }

}

MakeSixDigitNumber = (number) => {
  try {
    // Convert the number to a string
    let numStr = number.toString();

    // Use padStart to add leading zeros if necessary
    let sixDigitStr = numStr.padStart(6, '0');

    // Convert back to a number if needed
    return sixDigitStr;
  }
  catch (e) {
    return number
  }
}
isDropdownDisabled = () =>{
  if((this.state.userObj.RoleLevel == Constants.Role.SYSTEM_ADMIN_ID || this.state.userObj.RoleLevel == Constants.Role.SYSTEM_OPERATOR_ID || this.state.userObj.RoleLevel == Constants.Role.ENTERPRISE_ADMIN_ID || this.state.userObj.RoleLevel == Constants.Role.ENTERPRISE_MANAGER_ID)){
    return false
  }
  return true
}

isStatusDropdownDisabled = () =>{
  if ((this.state.userObj.RoleLevel == Constants.Role.SYSTEM_ADMIN_ID || this.state.userObj.RoleLevel == Constants.Role.SYSTEM_OPERATOR_ID || this.state.userObj.RoleLevel == Constants.Role.ENTERPRISE_ADMIN_ID || this.state.userObj.RoleLevel == Constants.Role.ENTERPRISE_MANAGER_ID) || (this.state.userObj.RoleLevel == Constants.Role.STAFF_ID && this.state.selectedConversation.AssignTo == this.state.userObj.Id))
     return false

  return true
}

  render() {

    const { slideRespActive, userObj  } = this.state;
    const activeClass = slideRespActive ? 'active' : '';
    const { activeSection } = this.state;
    const { value1 } = this.state;
    const { inputValue } = this.state;
    return (
      <div className='card' id='header' onClick={() => this.closedtriggerPicker()}>

       {!this.state.supportLoader ?
        <div class="card-body px-0 pt-0">
        {
           this.state.supportConversation.length == 0 &&
          <div>
          <div className="d-flex align-items-center p-0 mb-2 p-l-r card-body">
          <h3 className="card-title card-new-title ml-0 mb-0 pl-0">{Labels.Order_Support}</h3>
        </div>
          <div className='no-conversation-found-wrap'>{Labels.No_Conversation_Found}</div>
        </div>
        }
        {
          this.state.supportConversation.length > 0 &&

          <div className={`conversation-main-wrap `}>
            <div className='conversation-left-wrap'>
              <div className='conversation-left-inner'>
                <div className="d-flex align-items-center p-0 mb-2 p-l-r card-body">
                  <h3 className="card-title card-new-title ml-0 mb-0 pl-0">{Labels.Order_Support}</h3>
                </div>
                <div className='chat-itenary-btn-wrap-filter'>
                <div className="left-row-rest">
                  <label htmlFor="chkSupport">
                    <input type="checkbox" name="chkSupport" className="form-checkbox" id="chkSupport" value={this.state.chkSupport} checked={this.state.chkSupport} onChange={(e) => {this.state.chkSupport = e.target.checked; this.SearchConversation(this.state.searchText)} }/><span className="settingsLabel">{'Order Support'}</span>
                  </label>
                  <label htmlFor="chkConcierge">
                    <input type="checkbox" className="form-checkbox" name="chkConcierge" id="chkConcierge" value={this.state.chkConcierge} checked={this.state.chkConcierge} onChange={(e) => {this.state.chkConcierge = e.target.checked; this.SearchConversation(this.state.searchText)} }/> <span className="settingsLabel" >{'Concierge Chat'}</span>
                  </label>
                </div>
                  </div>

                <div className='sticky-search-wr'>
                  <div class="dataTables_filter w-100">
                    <input type="search" className="form-control common-serch-field" placeholder="Search" value={this.state.searchText} onChange={(e) => this.SearchConversation(e.target.value)}/>
                  </div>
                </div>


                {
                  this.state.filteredSupportConversation.length > 0 ?
                  <div ref={this.conversationDivRef} className='single-chat-tab-scroll'>
                    {
                      this.state.filteredSupportConversation.map((v, i) => (
                        <div key={v.Id} className={`single-chat-tab ${this.state.activeConversationId == v.Id ? "active" : ""} conversation-item ${this.state.sorting ? 'sorting' : ''}`} onClick={() => this.onConversationClick(v)}>
                          <div className='s-user-img'>
                            {
                                <Avatar className="header-avatar" name={v.UserName != "" ? v.UserName : "Guest"} round={true} size="40" textSizeRatio={2} />
                            }
                          </div>
                          <div className='single-chat-tab-p'>
                            <div className='single-chat-tab-i'>

                              <div className='s-user-info-wrap'>
                                {/* <span className={`name-o ${v.NewMessageCount !=0 ? "bold" : ""}`}>{v.UserName != "" ? v.UserName : "Guest"}<span className=''> ({this.MakeSixDigitNumber(v.Id)}) </span></span> */}
                                <span className={`name-o ${v.NewMessageCount !=0 ? "bold" : ""}`}>{v.UserName != "" ? v.UserName : "Guest"}<span className=''> ({v.SupportType == 1 ? v.OrderId : v.Id}) </span></span>
                                <span className={`${this.setStatusClass(v.Status)}`}>{this.setStatusHtml(v.Status)}</span>


                              </div>
                              {/* <span className='name-o font-12'>Chat ID. <span className='bold'> {v.Id} </span></span>
                               */}


                            </div>
                            <div className='s-user-info-time mt-1'>
                              {
                                v.RoomNo != "" &&
                                <span className={`room-o w-100 ${v.NewMessageCount !=0 ? "bold" : ""}`} style={{ minWidth: 170 }}>{Labels.Room_No} {v.RoomNo} </span>
                              }
                              {
                                v.TableNo != "" &&
                                <span className={`room-o w-100 ${v.NewMessageCount !=0 ? "bold" : ""}`} style={{ minWidth: 170 }}>{Labels.Table_No} {v.TableNo} </span>
                              }
                              <div className='d-flex justify-content-end w-100'>
                                <div className={`unread-bubble ${v.NewMessageCount != 0 ? "active" : ""}`}>
                                  <span className='number-o'>{v.NewMessageCount}</span>
                                </div>
                              </div>
                            </div>
                            <div className='iten-chat-fil-wrap'>
                            <span className='time-o font-12 color-7'>{this.SetDateFormat(v.LastConversationDateTime)}</span>
                            {v.SupportType == 2 ?
                              <span class="itinerary-badge">Concierge</span>
                              :
                            <span class="assigne-assigned-badge">Support</span>
                            }
                              </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                : <div className="no-conversation-found-wrap">{Labels.No_Result}</div>}
              </div>
            </div>
            {
              this.state.supportConversation.length > 0 &&
              <div className={`conversation-right-wrap ${activeClass}`}>

                <div className="support-chat-section">
                  <div className="c-heading-wrap">
                    <div className='d-flex align-items-center flex-1'>
                      <BiArrowBack style={{ display: "none" }} className='font-24 mr-3 basket-back-arrow cursor-pointer chat-back-arrow' onClick={() => this.showHideSidebarRight()}></BiArrowBack>
                      <div className='s-user-img d-flex align-items-center'>

                        {
                          // this.state.selectedConversation.UserImage != "" ?
                          //   <img src={Utilities.generatePhotoLargeURL(this.state.selectedConversation.UserImage, true, false)} />
                          //   :
                            // <svg viewBox="0 0 212 212" height="212" width="212" preserveAspectRatio="xMidYMid meet" class="xh8yej3 x5yr21d" version="1.1" x="0px" y="0px" enable-background="new 0 0 212 212" >
                            //   <path fill="#DFE5E7" class="background" d="M106.251,0.5C164.653,0.5,212,47.846,212,106.25S164.653,212,106.25,212C47.846,212,0.5,164.654,0.5,106.25 S47.846,0.5,106.251,0.5z"></path><g>
                            //     <path fill="#FFFFFF" class="primary" d="M173.561,171.615c-0.601-0.915-1.287-1.907-2.065-2.955c-0.777-1.049-1.645-2.155-2.608-3.299 c-0.964-1.144-2.024-2.326-3.184-3.527c-1.741-1.802-3.71-3.646-5.924-5.47c-2.952-2.431-6.339-4.824-10.204-7.026 c-1.877-1.07-3.873-2.092-5.98-3.055c-0.062-0.028-0.118-0.059-0.18-0.087c-9.792-4.44-22.106-7.529-37.416-7.529 s-27.624,3.089-37.416,7.529c-0.338,0.153-0.653,0.318-0.985,0.474c-1.431,0.674-2.806,1.376-4.128,2.101 c-0.716,0.393-1.417,0.792-2.101,1.197c-3.421,2.027-6.475,4.191-9.15,6.395c-2.213,1.823-4.182,3.668-5.924,5.47 c-1.161,1.201-2.22,2.384-3.184,3.527c-0.964,1.144-1.832,2.25-2.609,3.299c-0.778,1.049-1.464,2.04-2.065,2.955 c-0.557,0.848-1.033,1.622-1.447,2.324c-0.033,0.056-0.073,0.119-0.104,0.174c-0.435,0.744-0.79,1.392-1.07,1.926 c-0.559,1.068-0.818,1.678-0.818,1.678v0.398c18.285,17.927,43.322,28.985,70.945,28.985c27.678,0,52.761-11.103,71.055-29.095 v-0.289c0,0-0.619-1.45-1.992-3.778C174.594,173.238,174.117,172.463,173.561,171.615z"></path><path fill="#FFFFFF" class="primary" d="M106.002,125.5c2.645,0,5.212-0.253,7.68-0.737c1.234-0.242,2.443-0.542,3.624-0.896 c1.772-0.532,3.482-1.188,5.12-1.958c2.184-1.027,4.242-2.258,6.15-3.67c2.863-2.119,5.39-4.646,7.509-7.509 c0.706-0.954,1.367-1.945,1.98-2.971c0.919-1.539,1.729-3.155,2.422-4.84c0.462-1.123,0.872-2.277,1.226-3.458 c0.177-0.591,0.341-1.188,0.49-1.792c0.299-1.208,0.542-2.443,0.725-3.701c0.275-1.887,0.417-3.827,0.417-5.811 c0-1.984-0.142-3.925-0.417-5.811c-0.184-1.258-0.426-2.493-0.725-3.701c-0.15-0.604-0.313-1.202-0.49-1.793 c-0.354-1.181-0.764-2.335-1.226-3.458c-0.693-1.685-1.504-3.301-2.422-4.84c-0.613-1.026-1.274-2.017-1.98-2.971 c-2.119-2.863-4.646-5.39-7.509-7.509c-1.909-1.412-3.966-2.643-6.15-3.67c-1.638-0.77-3.348-1.426-5.12-1.958 c-1.181-0.355-2.39-0.655-3.624-0.896c-2.468-0.484-5.035-0.737-7.68-0.737c-21.162,0-37.345,16.183-37.345,37.345 C68.657,109.317,84.84,125.5,106.002,125.5z">
                            //     </path>
                            //   </g>
                            // </svg>
                            <Avatar className="header-avatar" name={this.state.selectedConversation.UserName != "" ? this.state.selectedConversation.UserName : "Guest"} round={true} size="40" textSizeRatio={2} />
                        }
                      </div>
                      <div className='c-heading-wrap-inner-info'>
                        <span className="c-no-b">{this.state.selectedConversation.UserName != "" ? this.state.selectedConversation.UserName : "Guest"}<span className='bold'> ({this.state.selectedConversation.SupportType == 1 ? this.state.selectedConversation.OrderId : this.state.selectedConversation.Id  })</span></span>
                        {/* <span className="c-no-b">{this.state.selectedConversation.UserName != "" ? this.state.selectedConversation.UserName : "Guest"}<span className='bold'> ({this.MakeSixDigitNumber(this.state.selectedConversation.Id)})</span></span> */}
                        {
                          this.state.selectedConversation.RoomNo != "" &&
                          <span className="name-o font-14">{Labels.Room_No} <span className='bold'>{this.state.selectedConversation.RoomNo}</span></span>
                        }
                        {
                          this.state.selectedConversation.TableNo != "" &&
                          <span className="name-o font-14">{Labels.Room_No} <span className='bold'>{this.state.selectedConversation.TableNo}</span></span>
                        }

                      </div>
                    </div>
                    {/* <div className="align-items-center mb-md-0  ml-md-auto status-dropdown status-total-wrap-min d-flex  align-items-md-center justify-content-md-start justify-content-between">
                      <div className=" font-16 mr-3">Status:</div>
                    </div> */}
                    <div className='status-sec-d-wrap flex-1'>
                      <div className='user-assign-d-down'>
                        <Dropdown>
                          <Dropdown.Toggle disabled={this.isDropdownDisabled()} id="dropdown-basic">
                            {Object.keys(this.state.selectedConversation).length > 0 && this.state.selectedConversation.AssignedToName !="" ?
                            <span class="m-b-0 m-r-20 ">
                            <div className='d-flex assign-text-img align-items-center'>
                              <div className="user-avatar-web">
                               {
                                this.state.selectedConversation.UserImage != "" ?
                                  <div className='order-assign-u-m'>
                            <img className='assign-o-image' style={{width: 25}} src={Utilities.generatePhotoLargeURL(this.state.selectedConversation.UserImage, true, false)} />
                            </div>
                            :
                                 <Avatar className="header-avatar" name={this.state.selectedConversation.AssignedToName} round={true} size="30" textSizeRatio={2} />

                               }

                              </div>
                              <span>{this.state.selectedConversation.AssignedToName}</span>
                            </div>
                          </span>
                           :
                            "Assign to"
                          }
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            {
                              this.state.users.length > 0 && this.state.users.map((v,i)=>(

                              <Dropdown.Item key={i} onClick={()=>this.AssignUser(this.state.selectedConversation.Id, v.Id, this.state.userObj.Id, (v.DisplayName ? v.DisplayName : (v.FirstName + " " + v.SurName)), this.state.selectedConversation.EnterpriseId, v.PhotoName )} >
                                <span class="m-b-0 statusChangeLink m-r-20 ">
                                  <div className='d-flex assign-text-img align-items-center'>
                                    <div className="user-avatar-web">
                                      {!Utilities.stringIsEmpty(v.PhotoName)  ?
                                      <div className='order-assign-u-m'>
                                                                    <img src= {Utilities.generatePhotoLargeURL(v.PhotoName, true, false)}  className='assign-o-image'/>

                                                                    </div>:
                                      <Avatar className="header-avatar" name={v.DisplayName ? v.DisplayName : (v.FirstName + " " + v.SurName)} round={true} size="30" textSizeRatio={2} />
                                      }
                                    </div>
                                    <span>{v.DisplayName ? v.DisplayName : (v.FirstName + " " + v.SurName)}</span>

                                  </div>
                                </span>
                              </Dropdown.Item>
                              ))
                            }
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>

                      <div className='o-status-assign-d-down'>
                        <Dropdown>
                          <Dropdown.Toggle disabled={this.isStatusDropdownDisabled()} id="dropdown-basic" className={`${this.setStatusClass(this.state.selectedConversation.Status)}`}>
                              {this.setStatusHtml(this.state.selectedConversation.Status)}
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            {/* <Dropdown.Item onClick={()=>this.ChangeStatus(this.state.selectedConversation.Id, 0)}>
                              <span  class="m-b-0 statusChangeLink m-r-20 ">
                                <div className='d-flex assign-text-img align-items-center'>

                                  <span>New</span>
                                </div>
                              </span>
                            </Dropdown.Item> */}
                          {this.state.selectedConversation.Status != 1 &&

                            <Dropdown.Item onClick={()=>this.ChangeStatus(this.state.selectedConversation.Id, 1, this.state.selectedConversation.EnterpriseId)} >
                              <span class="m-b-0 statusChangeLink m-r-20 ">
                                <div className='d-flex assign-text-img align-items-center'>

                                  <span>{Labels.Assign}</span>
                                </div>
                              </span>
                            </Dropdown.Item>
                          }

                          {this.state.selectedConversation.Status != 3 &&
                            <Dropdown.Item  onClick={()=>this.ChangeStatus(this.state.selectedConversation.Id, 3, this.state.selectedConversation.EnterpriseId)}>
                              <span class="m-b-0 statusChangeLink m-r-20 ">
                                <div className='d-flex assign-text-img align-items-center'>

                                  <span>{Labels.Close}</span>
                                </div>
                              </span>
                            </Dropdown.Item>
                          }

                          {this.state.selectedConversation.Status != 2 && this.state.selectedConversation.Status == 3 &&
                            <Dropdown.Item  onClick={()=>this.ChangeStatus(this.state.selectedConversation.Id, 2, this.state.selectedConversation.EnterpriseId)}>
                              <span class="m-b-0 statusChangeLink m-r-20 ">
                                <div className='d-flex assign-text-img align-items-center'>

                                  <span>{Labels.Re_Open}</span>
                                </div>
                              </span>
                            </Dropdown.Item>
                           }

                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  </div>

                  {this.state.selectedConversation.SupportType == 2 &&

                <div className='chat-itenary-btn-wrap'>
                 <div  className={activeSection === 'chat-section-comp' ? 'active-button w-100 iten-tabs-p' : ' w-100 iten-tabs-p'}>
                 <div onClick={() => this.handleSectionChange('chat-section-comp')} className='iten-tabs d-flex align-items-center position-relative'>
                    <i class="fa fa-commenting-o" aria-hidden="true"></i><span>Chat</span>
                    {this.state.hasNewMessageInChatTab &&
                      // <span className="notification-bubble-chat-tab"></span>
                      <div className='o-support-nav'>
                      <div className='pro-item-content '>
                      <span className='o-support-nav-dot'></span>
                      </div>
                      </div>
                      // <div>New Notification</div>
                    }
                  </div>
                  <div className='iten-tabs-sep'></div></div>
                 <div className={activeSection === 'itinerary' ? 'active-button w-100 iten-tabs-p ' : ' w-100 iten-tabs-p'}> <div onClick={() => this.handleSectionChange('itinerary')} className='iten-tabs d-flex align-items-center'>  <svgIcon.itineraryIcon/><span>Itinerary <span className='ml-2'> <SlBasketLoaded className='mr-1' />{currencySymbol}{this.getTotalPrice()}</span></span> </div><div className='iten-tabs-sep'></div></div>
                  </div>
                  }
                  {activeSection === 'chat-section-comp' && (
                  <div className='chat-section-p-dynamic-height'>
                    <div ref={this.chatDetailRef} className="chat-section-p">
                      {/* <div className="chat-section-c">
                      <div className="images-multiple-wrap-inn">
                        <LightGallery speed={500} plugins={[lgThumbnail, lgZoom]} >
                          <a href="https://cdn.superme.al/s/butler/images/000/001/000001246_000001085-c3.jpg" className='images-singler-wrap-inn'>
                            <img src="https://cdn.superme.al/s/butler/images/000/001/000001246_000001085-c3.jpg" />
                          </a>
                        </LightGallery>
                      </div>
                      <div className="user-chat-sec ">
                        <div className="user-name-av">
                          <img className="" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D" />
                        </div>
                        <div className="chat-inner-wrap">
                          <span className="bold d-flex">Abdul Mannan</span>
                          <div className="chat-user-sec-inner" style={{}}>
                            <span className="chat-user-msg">
                              My order is 20 minutes late. Please try to resolve my issue.My
                              order is 20 minutes late. Please try to resolve my issue.
                            </span>
                          </div>
                          <span className="font-12 room-label ml-auto d-flex justify-content-end">
                            20/May/2024 11:26 AM
                          </span>
                        </div>
                      </div>
                    </div> */}

                      {
                        !this.state.showLoader && Object.keys(this.state.selectedConversation).length > 0 && this.state.supportConversationDetail.length > 0 ?
                          this.state.supportConversationDetail.map((v) => (
                            <div>
                              {
                                v.UserId == 0 ?

                                <div class="activity-chat-msg">
                                <p class="font-12 my-1">{this.SetDateFormat(v.CreatedOn)}<br /> {v.Message}</p>
                              </div>

                                :

                                this.state.selectedConversation.ReportedBy == v.UserId ?
                                  <div className="chat-section-c ">
                                    {/* <div className="images-multiple-wrap-inn">
                                  <a className='images-singler-wrap-inn'>
                                    <img src="https://cdn.superme.al/s/butler/images/000/001/000001246_000001085-c3.jpg" />
                                  </a>
                                </div> */}
                                    <div className='d-flex align-items-center'>
                                      <div className="user-chat-sec">
                                        <div className="user-name-av">
                                        { !Utilities.stringIsEmpty(v.PhotoName)  ?
                                                                    <div className='order-assign-u-m'>
                                                                    <img src= {Utilities.generatePhotoLargeURL(v.PhotoName, true, false)} className='assign-o-image'/>

                                                                    </div>:

                                          <Avatar className="header-avatar" name={v.UserName != "" ? v.UserName : "Guest"} round={true} size="30" textSizeRatio={2} />
                                        }
                                        </div>
                                        <div className="chat-inner-wrap">
                                          <span className="bold d-flex">{v.UserName != "" ? v.UserName : "Guest"}</span>
                                          <div className="chat-user-sec-inner">
                                            <span className="chat-user-msg">
                                              {v.Message}
                                            </span>
                                          </div>
                                          <span className="font-12 room-label ml-auto d-flex justify-content-end">
                                            {this.SetDateFormat(v.CreatedOn)}
                                            {/* {Utilities.getDateByZone(v.CreatedOn, 'DD MMM YYYY hh:mm a', timeZone)} */}
                                          </span>
                                        </div>



                                      </div>
                                      {/* <Dropdown className='messages-emoji-reaction' autoClose="outside">
                                        <Dropdown.Toggle variant="success" id="dropdown-autoclose-outside">
                                          <FaRegSmile />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                          <Dropdown.Item className='' href="#/action-1"> <IoIosThumbsUp /> <FaHeart className='msg-heart-emoji' /> <FaFaceGrinTears /> <FaSurprise /> < FaSadCry /> < LiaPrayingHandsSolid /> </Dropdown.Item>


                                        </Dropdown.Menu>
                                      </Dropdown> */}
                                    </div>
                                    {/* <div className='messages-emoji-reaction-show-p'>
                        <div className='messages-emoji-reaction-show'>
                                <FaHeart className='msg-heart-emoji' />
                                </div>
                                </div> */}
                                  </div>
                                  :
                                  <div>
                                  <div className="chat-section-c enterprise-chat-sec">
                                    {/* <div className="images-multiple-wrap-inn">
                                  <a className='images-singler-wrap-inn'>
                                    <img src="https://cdn.superme.al/s/butler/images/000/001/000001246_000001085-c3.jpg" />
                                  </a>
                                  <a className='images-singler-wrap-inn'>
                                    <img src="https://cdn.superme.al/s/butler/images/000/001/000001246_000001085-c3.jpg" />
                                  </a>
                                </div> */}
                                    <div className='position-relative'>
                                      <div className='d-flex align-items-center justify-content-end'>
                                        <div className="user-chat-sec">
                                          <div className="user-name-av">

                                            <a className='user-name-av'>
                                              {
                                                !Utilities.stringIsEmpty(v.PhotoName)  ?
                                                    <div className='order-assign-u-m'>
                                                    <img src= {Utilities.generatePhotoLargeURL(v.PhotoName, true, false)} className='assign-o-image'/>

                                                    </div>:

                                                  <Avatar className="header-avatar" name={v.UserName} round={true} size="25" textSizeRatio={2} />
                                              }
                                            </a>
                                          </div>
                                          <div className="chat-inner-wrap ">
                                            <span className="bold d-flex">{v.UserName}</span>
                                            <div className="chat-user-sec-inner" style={{}}>
                                              <span className="chat-user-msg">
                                                {v.Message}
                                              </span>
                                            </div>
                                            <span className="font-12 room-label ml-auto d-flex justify-content-end">
                                            {this.SetDateFormat(v.CreatedOn)}
                                              {/* {Utilities.getDateByZone(v.CreatedOn, 'DD MMM YYYY hh:mm a', timeZone)} */}
                                            </span>
                                          </div>
                                        </div>
                                        {/* <Dropdown className='messages-emoji-reaction' autoClose="outside">
                                          <Dropdown.Toggle variant="success" id="dropdown-autoclose-outside">
                                            <FaRegSmile />
                                          </Dropdown.Toggle>

                                          <Dropdown.Menu>
                                            <Dropdown.Item className='' href="#/action-1"> <IoIosThumbsUp /> <FaHeart className='msg-heart-emoji' /> <FaFaceGrinTears /> <FaSurprise /> < FaSadCry /> < LiaPrayingHandsSolid /> </Dropdown.Item>


                                          </Dropdown.Menu>
                                        </Dropdown> */}
                                      </div>
                                      {/* <div className='messages-emoji-reaction-show-p user-level-emoji-wrap'>
                        <div className='messages-emoji-reaction-show'>
                        <IoIosThumbsUp/>
                                </div>
                                  </div> */}
                                    </div>
                                  </div>
                                  </div>
                              }
                            </div>
                          ))
                          :
                          <div className="loader-menu-inner conversation-loader-c">
                            <Loader type="Oval" color="#ed0000" height={50} width={50} />
                            <div className="loading-label">Loading.....</div>
                          </div>
                      }
                    </div>

                    {
                    ((this.state.userObj.RoleLevel == Constants.Role.SYSTEM_ADMIN_ID || this.state.userObj.RoleLevel == Constants.Role.SYSTEM_OPERATOR_ID ||
                      this.state.userObj.RoleLevel == Constants.Role.ENTERPRISE_ADMIN_ID || this.state.userObj.RoleLevel == Constants.Role.ENTERPRISE_MANAGER_ID)
                      || (this.state.userObj.RoleLevel == Constants.Role.STAFF_ID && this.state.selectedConversation.AssignTo == this.state.userObj.Id)) &&

                    <div className="conversation-compose-p mt-2">
                      <div className="images-sec-p-wrap d-none">
                        <div className="images-multiple-wrap-inn justify-content-start">
                          <a className='images-singler-wrap-inn'>
                            <img src="https://cdn.superme.al/s/butler/images/000/001/000001246_000001085-c3.jpg" />
                          </a>
                          <a className='images-singler-wrap-inn'>
                            <img src="https://cdn.superme.al/s/butler/images/000/001/000001246_000001085-c3.jpg" />
                          </a>
                        </div>
                      </div>
                      <AvForm>
                        <div className="conversation-compose">
                          <div className="image-in-wrap">
                            <input id="fileInput" type="file" />
                            {this.EmojiInputHtml()}
                            <div className="order-support-emoji-wrap font-20 pr-2">
                              <span
                                class="ma4 b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                                onClick={() => this.triggerPickerTray()}
                              >
                                <span role="img" aria-label="">
                                  <FaRegSmile />
                                </span>
                              </span>
                            </div>
                            {/* <Dropdown className='add-photo-video-d-down' autoClose="outside">
                              <Dropdown.Toggle variant="success" id="dropdown-autoclose-outside">
                                <i class="fa fa-plus"></i>
                              </Dropdown.Toggle>

                              <Dropdown.Menu>
                                <Dropdown.Item onClick={this.handleSpanClick} className='input-file-action' href="#/action-1"><MdOutlinePhotoLibrary />Upload Photo</Dropdown.Item>
                                <Dropdown.Item onClick={this.handleSpanClick} className='input-file-action' href="#/action-2"><MdOutlineVideoLibrary />Upload Video</Dropdown.Item>
                                <input type="file" ref={this.fileInputRef} style={{ display: 'none' }} onChange={this.handleFileChange} />
                              </Dropdown.Menu>
                            </Dropdown> */}

                          </div>

                          {/* <input className="input-msg" name="input" placeholder="Type a message" autoComplete="off" autofocus="" /> */}
                          <AvField value={this.state.inputValue} onKeyDown={(e)=>this.sendMessageOnEnter(e)} onChange={(event) => this.handleInputChange(event)} placeholder="Type a message" name="abc" className="input-msg input-msg-text" errorMessage="This is a required field" type="textarea"
                          // validate={{
                          //   required: { value: this.props.isRequired, errorMessage: 'This is a required field' },
                          // }}

                          />


                          <button disabled={this.state.inputValue == "" } className="send body-btn-primary">
                            <div className="circle">
                              {/* {
                                this.state.inputValue != "" ? */}
                                  <IoMdSend onClick={() => this.sendMessages(1)} style={{ fontSize: "30px" }}></IoMdSend>
                                  {/* :
                                  <GrMicrophone style={{ fontSize: "30px" }}></GrMicrophone> */}
                              {/* } */}


                            </div>
                          </button>

                        </div>
                      </AvForm>
                    </div>

                    }
                  </div>
                     )}

                          {activeSection === 'itinerary' && (
                            <div className="itinerary-section itinerary-section-p">

                             { (this.state.itineraryDetail == undefined || Object.keys(this.state.itineraryDetail).length == 0) && !this.state.showLoader &&
                             <div className='itinerary-sec-btn-wrap'>
                             <button className="btn btn-primary" onClick={() => this.itineraryInfoModal()}><i className="fa fa-plus" aria-hidden="true"></i> Add item </button>
                              </div>
                              }
                              <div className='itinerary-inner-sec-p '>

                              { Object.keys(this.state.itineraryDetail).length > 0 &&
                              <div className='itinerary-sec-btn-wrap justify-content-end'>
                              <button className="btn btn-primary" onClick={() => this.itineraryInfoModal()}><i className="fa fa-plus" aria-hidden="true"></i> Add more </button>
                              </div> }

                              {
                                this.state.showLoader ?

                                <div className="loader-menu-inner conversation-loader-c">
                                <Loader type="Oval" color="#ed0000" height={50} width={50} />
                                <div className="loading-label">Loading.....</div>
                              </div>
                                :

                              <Accordion allowZeroExpanded preExpanded={[this.state.selectedAccordion]}>

                               {Object.entries(this.state.itineraryDetail).map(([date, items], index) => (

                                  <AccordionItem uuid={"item-" + index}>
                                  <AccordionItemHeading onClick={() => {this.setState({selectedAccordion: "item-" + index}); console.log("itemName", "item-" + index) }} className={index > 0 ? "mt-3" : "" }>
                                          <AccordionItemButton>
                                          { Utilities.getDateByZone(date, "DD MMM YYYY ", timeZone) }
                                       <div>

                                        {this.state.selectedIndex == index && this.state.saving && !this.state.saved &&
                                         <span className='d-flex font-13 align-items-center mr-3 badge badge-primary py-2 px-3 mb-0 border-primary'>
                                           <span className="mr-2">
                                             <Loader type="Oval" color="#fff" height={16} width={16} />
                                           </span>
                                           Saving...
                                         </span>
                                        }
                                        {this.state.saved && this.state.selectedIndex == index &&
                                         <span className={`d-flex font-13 align-items-center mr-3 badge badge-success py-2 px-3 mb-0 border-success ${!this.state.saving ? 'fadeOut' : ''}`}>
                                           Saved <i className='ml-2 font-15 fa fa-check-circle text-white'></i>
                                         </span>
                                        }

                                         {/* <span className='d-flex font-13 align-items-center mr-3 badge badge-danger py-2 px-3 mb-0 border-danger'>
                                           Error while saving changes.
                                         </span> */}
                                       </div>
                                          </AccordionItemButton>
                                        </AccordionItemHeading>

                                        {items.map((item, dIndex) => (
                                        <AccordionItemPanel>
                                  <div className='itinerary-inner-sec'>
                                    <div className='d-flex' style={{gap:10}}>
                                      <span>{dIndex + 1}.</span>
                                      <div className='iten-res-img'>
                                        <img src={Utilities.generatePhotoURL(item.PhotoName)} alt='Image'/>
                                        </div>
                                        <div className='d-flex flex-column'>
                                      <span for="ActiveN" className='itinerary-h mb-0 cursor-pointer font-16'>{item.MetaName}</span>
                                      <span for="ActiveN" className='itinerary-h mb-0 cursor-pointer font-12'>{item.ItemName}</span>

                                      </div>
                                    </div>
                                    <div className='itin-d-amount'>
                                      <div className='d-flex align-items-center justify-content-end itin-d-inner' style={{gap:"15px"}}>
                                    <div style={{width:"45%"}} className='d-flex'>
                                    {/* <Datepicker
                                    popoverDirection="down"
                                        useRange={false}
                                        showTimeSelect
                                        asSingle={true}
                                        value={value1}
                                        onChange={this.handleChange}
                                    /> */}


                                <DatePicker
                                    selected={new Date(this.SetItineraryFormat(item.DateTime))}
                                    onChange={(date) => this.HandleDateChange(item.Id, date,  item.MetaName + ' - ' + item.ItemName, index)}
                                    showTimeSelect
                                    minDate={new Date()}
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    timeCaption="time"
                                    dateFormat="dd-MM-yyyy HH:mm"
                                    className="form-control"
                                />

                                        </div>
                                    <div className='menu-page-wrap tick-cross-btn'>
                                        <div className="input-group flex-1 form-group">
                                          <div className="input-group-prepend">
                                            <span className="input-group-text form-control" id="basic-addon1">{currencySymbol}</span>
                                          </div>

                                          <AvForm>
                                            <AvField
                                              errorMessage="This is a required field"
                                              name="uniqueFieldName"
                                              value={item.ItemPrice}
                                              type="number"
                                              className="form-control borderRadiusLeftNone form-control-left borderRightRadius"
                                              onFocus={(e) => this.setState({itemPriceValue: item.ItemPrice, selectedItemId: item.Id, itemFocused: true})}
                                              onChange={(e) => this.setState({itemPriceValue: e.target.value})}
                                              onKeyDown={(e) => this.updatePriceOnEnterKey(item.Id, e.target.value, item.ItemPrice, item.MetaName + ' - ' + item.ItemName, index)}
                                            // required
                                            />
                                          </AvForm>
                                          {/* <div className="help-block with-errors"></div> */}
                                        </div>

                                        {item.Id == this.state.selectedItemId && this.state.itemFocused &&
                                        <>
                                        <button className="btn btn-primary ml-3"
                                         onClick={(e) => {
                                           this.UpdateitineraryItemPrice(item.Id, this.state.itemPriceValue, item.ItemPrice, item.MetaName + ' - ' + item.ItemName, index)
                                          }}
                                          ><FiCheck/></button>
                                        <button className="add-cat-btn"
                                         onClick={(e) => {this.setState({selectedItemId: 0, itemFocused: false, itemPriceValue: 0})}}
                                        style={{lineHeight:"inherit"}}><FiX/></button>
                                          </>
                                      }
                                      </div>
                                      </div>


                                        <div className='d-flex align-items-center'>

                                        {/* <span class="pay-at-venue">Pay at the venue</span> */}
                                                <div className='d-flex pay-ven-con-d-down'>
                                                  <Dropdown>
                                                    <Dropdown.Toggle id="dropdown-basic" className={ item.PaidBy == 1 ? "pay-at-venue" : "pay-at-con"}>
                                                      {item.PaidBy == 1 ? "Pay at the venue" : "Paid by Concierge"}
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                      <Dropdown.Item onClick={() => this.ItineraryPaidByUpdate(item.Id, 1, item.EnterpriseId, item.MetaName + ' - ' + item.ItemName, index)}>
                                                        <span class="m-b-0 statusChangeLink m-r-20 ">
                                                          <div className='d-flex assign-text-img align-items-center'>
                                                            <span>Pay at the venue</span>
                                                          </div>
                                                        </span>
                                                      </Dropdown.Item >
                                                      <Dropdown.Item onClick={() => this.ItineraryPaidByUpdate(item.Id, 2, item.EnterpriseId, item.MetaName + ' - ' + item.ItemName, index)}>
                                                        <span class="m-b-0 statusChangeLink m-r-20 ">
                                                          <div className='d-flex assign-text-img align-items-center'>
                                                            <span>Paid by Concierge</span>
                                                          </div>
                                                        </span>
                                                      </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                  </Dropdown>


                                                </div>
                                                <div className={`d-flex iten-d-down ${this.GetStatusTextAndClass(item.Status, false)}`}>
                                        <Dropdown >
                                  <Dropdown.Toggle id="dropdown-basic">
                                  <span class="m-b-0 statusChangeLink w-100">
                                  <div className='d-flex assign-text-img align-items-center justify-content-between w-100'>
                                  <span className='mr-2'>{this.GetStatusTextAndClass(item.Status, true)}</span>
                                  <span className='theme-d-wrap'></span>
                                  </div>
                                  </span>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>


                                   {item.Status != 2 &&
                                    <Dropdown.Item onClick={() => this.handleStatusChange(item.Id, 2, item.EnterpriseId, item.MetaName + ' - ' + item.ItemName, index)}>
                                    <span class="m-b-0 statusChangeLink w-100">
                                    <div className="orderlink-wraper my-0">
                                    <span className="button-link"> Confirm <span className="badge badge-info"></span></span>
                                    </div>
                                    </span>
                                    </Dropdown.Item>

                                   }

                                 {item.Status != 1 && item.Status != 4 &&
                                  <Dropdown.Item onClick={() => this.handleStatusChange(item.Id, 4, item.EnterpriseId, item.MetaName + ' - ' + item.ItemName, index)}>
                                  <span class="m-b-0 statusChangeLink w-100">
                                  <div className="orderlink-wraper my-0">
                                  <span className="button-link"> Complete <span className="badge badge-info"></span></span>
                                  </div>
                                  </span>
                                  </Dropdown.Item>
                                }

                                {item.Status != 3 &&
                                  <Dropdown.Item onClick={() => this.handleStatusChange(item.Id, 3, item.EnterpriseId, item.MetaName + ' - ' + item.ItemName, index)}>
                                  <span class="m-b-0 statusChangeLink w-100">
                                  <div className="orderlink-wraper my-0">
                                  <span className="button-link" > Cancel <span className="badge badge-info"></span></span>
                                  </div>
                                  </span>
                                  </Dropdown.Item>
                                }
                                  </Dropdown.Menu>
                                  </Dropdown>


                                  </div>
                                        </div>

                                    </div>
                                  </div>

                                {item.Status > 1 &&

                                
                                  <div className='iten-upload-img-display'>{this.state.DeletingPhoto}

                                      <LightGallery speed={500} plugins={[lgThumbnail, lgZoom]} >

                                      { !Utilities.stringIsEmpty(item.MediaJson) && JSON.parse(item.MediaJson).map((media) => (
                                     
                                     this.state.deletingPhotoName == media.AbsoluteUrl ?   <Loader type="Oval" color="#ed0000" height={35} width={35} />
                                     :
                                       
                                       <a href={Utilities.generatePhotoURL(media.AbsoluteUrl)}>
                                          <div className="image-wrapper-with-close">
                                        
                                        <img src={Utilities.generatePhotoURL(media.AbsoluteUrl)} />
                                        
                                        {item.Status == 2 &&
                                        <span className="close-icon" onClick={() => this.DeletePhoto(item.Id, media.AbsoluteUrl)} >
                                                    &times;
                                                  </span>
                                        }
                                        
                                        </div>
                                        </a>
                                      
                                      ))}

                                          
                                        </LightGallery>
                                     
                                        {item.Id == this.state.selectedItemId && this.state.uploadingImage &&
                                          
                                          <Loader type="Oval" color="#ed0000" height={35} width={35} />
                                        }
                                      {item.Status == 2 &&

                                        <div className='iten-upload-image'  onClick={() => this["fileInputRef_" + item.Id]?.click()}>
                                        <BiImageAdd />
                                        <input type="file" ref={(ref) => (this["fileInputRef_" + item.Id] = ref)} style={{ display: 'none' }} onChange={(e) => this.handleFileChange(e, item.Id)} />
                                          </div>
                                        }
                                      </div>
                                }
                                      {dIndex != items.length -1 &&

                                        <hr/>

                                      }

                                  </AccordionItemPanel>
                                  ))}
                                  </AccordionItem>

                                ))}

                              </Accordion >

                              }

                              </div>
                                <div className='itinerary-footer-wrap'>
                                  <span className='iten-f-total'>Estimated cost</span>
                                  <span className='iten-f-currency'>{currencySymbol}{this.getTotalPrice()}</span>
                                </div>
                            </div>
                          )}
                </div>

              </div>
            }
          </div>
           }
        </div> :
        this.loading()
      }
        <Modal isOpen={this.state.ComplaintChat} toggle={() => this.ComplaintChatModal()} className="">
          <ModalHeader toggle={() => this.ComplaintChatModal()} >{Labels.Complaint_Detail_Modal}</ModalHeader>
          <ModalBody className=''>

          </ModalBody>
          <FormGroup className="modal-footer" >
            <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger"></label>
            </div>
            <div>
              <Button className='mr-2 text-dark' color="secondary" onClick={() => this.ComplaintChatModal()}>{Labels.Close}</Button>
            </div>
          </FormGroup>
        </Modal>

        <Modal isOpen={this.state.itineraryInfo} toggle={() => this.itineraryInfoModal()} className={this.props.className}>
          <ModalHeader toggle={() => this.itineraryInfoModal()} >Add Items</ModalHeader>
          <ModalBody className='itinerary-modal-wrap'>
            <div className='sticky-iten-search'>
          <div class="dataTables_filter w-100">
                    <input type="search" className="form-control common-serch-field" placeholder="Search" value={this.state.categorySearchText}
                    onChange={this.SearchCategoryProduct} />
                  </div>
                  </div>
                  <Accordion
                  allowZeroExpanded
                  allowMultipleExpanded
                  onChange={this.handleExpand} // Event triggered on expand/collapse
                  className='iten-acc-wrap'>


            { this.state.filteredCategories.map((category) => {

            return(

            <AccordionItem uuid={category.Id}>
                <AccordionItemHeading>
                    <AccordionItemButton>
                        {Utilities.SpecialCharacterDecode(category.Name)}
                    </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>


                {category.Products != undefined && category.Products.map((prod, index) => {
                  if(prod.IsDeleted) return
                  if(index == 0)
                    return(<div> {currencySymbol} </div>)

            return(
                  <>
                    <div className='itinerary-modal-inner'>
                      <div className='d-flex align-items-center'>
                    <input type="checkbox" className="form-checkbox" id={prod.Id} onClick={(e) => this.handleItemSelection(category.Id, prod.Id, e.target.checked)}/>
                       <label for={prod.Id} className='itinerary-h mb-0 cursor-pointer'>{Utilities.SpecialCharacterDecode(prod.MenuMetaName)}</label>
                       </div>
                       <div className='itin-d-amount'>
                        {/* <span className='itin-date'>Tue/7/2025</span> */}
                        <span className='itin-amount'>{Utilities.FormatCurrency(prod.Price, this.state.countryConfigObj?.DecimalPlaces)}</span>
                       </div>
                    </div>
                  </>
              )})
            }
                </AccordionItemPanel>
            </AccordionItem>
            )})
        }
        </Accordion>

        <p class="separator"><span></span></p>

          </ModalBody>
          <FormGroup className="modal-footer" >
          <div className='iten-order-total'>
            <span className='iten-or-total'>Estimated cost</span>
            <span className='iten-or-total-amount'>{currencySymbol}{this.state.totalSelectedItemPrice}</span>
        </div>

            <div>
              <Button className='mr-2 text-dark' color="secondary" onClick={() => this.itineraryInfoModal()}>Cancel</Button>
              <Button color="primary" >
              {this.state.IsSavingItems ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>  :
                 <span className="comment-text" onClick={() => this.addItinerary()}>Done</span> }
              </Button>
            </div>
          </FormGroup>
        </Modal>

      </div>
    )
  }
}
