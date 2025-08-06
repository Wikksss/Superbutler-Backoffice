import React, { Fragment } from 'react';
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SweetAlert from 'sweetalert-react'; // eslint-disable-line import/no-extraneous-dependencies
import Loader from 'react-loader-spinner';
import ReactTooltip from 'react-tooltip';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import Slider from '@material-ui/core/Slider'
//import { Object } from 'core-js';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../helpers/CropImage'
import Dropdown from 'react-bootstrap/Dropdown';
import Config from '../../helpers/Config';
import Constants from '../../helpers/Constants';
import * as Utilities from '../../helpers/Utilities';
import * as PhotoDictionaryService from '../../service/PhotoDictionary';
import * as CategoryService from '../../service/Category';
import * as OrderRoutingService from '../../service/OrderRouting';
import * as AuthService from '../../service/Auth';
import * as ProductService from '../../service/Product';
import * as ProductOptionService from '../../service/ProductOption';
import * as AddonGroupService from '../../service/AddonGroup';
import * as EnterpriseSettingService from '../../service/EnterpriseSetting';
import * as GlobalConfigurationService from '../../service/GlobalConfiguration';
import * as TagService from '../../service/Tag';
import "react-tabs/style/react-tabs.css";
import 'sweetalert/dist/sweetalert.css';
import {SetMenuStatus} from '../../containers/DefaultLayout/DefaultHeader'
import Labels from '../../containers/language/labels';
import S3Browser from '../PhotoGallery/PhotoGallery'
import ImageViewer from '../Components/ImageViewer';
import Previews from '../Components/DropzoneMultipleImages';
import ImageUploader from '../Components/ImageUploader';
import { MdErrorOutline } from "react-icons/md";
import ReactPlayer from 'react-player'
import * as EnterpriseMenuService from '../../service/EnterpriseMenu';
import * as Enterprise from '../../service/Enterprise';
const FoodTypeSelectionValidation = (value, ctx) => {

  if (value === "0") {
    return "Please select food type.";
  }
  return true;
}


const SortableItem = sortableElement(({ value }) => <li className="sortableHelper">{value}</li>);

const SortableContainer = sortableContainer(({ items }) => {

  if (items === undefined) { return; }
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} style={{ zIndex: 100000 }} index={index} value={Utilities.SpecialCharacterDecode(value.name)} />
      ))}
    </ul>
  );
});

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

class Menu extends React.Component {

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ SortCategories }) => ({
      SortCategories: arrayMove(SortCategories, oldIndex, newIndex),
    }));

    this.GetUpdatedCategorySort(this.state.SortCategories);

  };

  onProductSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ SortProducts }) => ({
      SortProducts: arrayMove(SortProducts, oldIndex, newIndex),
    }));

    this.GetUpdatedProductSort(this.state.SortProducts);

  };


  //#region Constructor

  constructor(props) {

    super(props);

    this.state = {
      Categories: [],
      ShowLoaderRightPanel: true,
      ShowLoaderLeftPanel: true,
      FiltersMenuCategory: [],
      SortCategories: [],
      Products: [],
      FilterProducts: [],
      SelectedCategoryId: 0,
      SelectedProduct: {},
      SelectedCategory: {},
      CategoryAction: {},
      ProductandOptionAction: {},
      SelectedCategoryName: '',
      SortCategoriesIdCsv: '',
      showDeleteConfirmation: false,
      showAlert: false,
      alertModelText: '',
      alertModelTitle: '',
      deleteConfirmationModelText: '',
      deleteComfirmationModelType: '',
      activeCategoryCheck: true,
      selectedProductInAction: {},
      selectedProductTimingTitle: '',
      selectedProductOptionInAction: {},
      ToppingGroup: [],
      ExtrasGroup: [],
      Days: [],
      inActiveCategoryCheck: true,
      activeProductCheck: true,
      inActiveProductCheck: true,
      productOptionModal: false,
      CategoryModel: false,
      ModelHeaderTitle: "",
      ProductModal: false,
      WorkingHourCSV: '',
      IsNormalHours: true,
      FoodTypes: [],
      Dietary: [],
      ShowMenu: false,
      GalleryPhotos: [],
      FilterGalleryPhotos: [],
      SelectedMenuMetaName: "",
      SeletedItemPhoto: "",
      SelectedItemMetaId: 0,
      ShowGalleryLoader: true,
      SelectedPhotoGroup: "All",
      IsCategory: false,
      IsCategoryClicked: true,
      PhotoName: null,
      CroppedAreaPixels: null,
      CroppedImage: null,
      CheckAll: false,
      AllDay: false,
      Image: null,
      Crop: { x: 0, y: 0 },
      Zoom: 1,
      Aspect: 200 / 200,
      OldImage: null,

      ActiveTab: 0,

      Sort: false,
      left: false,

      itemImage: false,
      categoryImage: false,
      scrolled: false,
      items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
      IsDeal: false,
      IsBuffet: false,
      HideFromPlatform:false,
      HideFromWhiteLabel:false,
      MenuAddonGroupToppingId: 0,
      MenuAddonExtraGroupId: 0,
      MenuCategoryTagId: 0,
      OptionMenuAddonGroupId: 0,
      OptionMenuAddonExtraGroupId : 0,
      OptionFoodTypeIdCsv: '0',
      SearchCategoryText: '',
      SearchProductText: '',
      IsSave:false,
      SortProducts: [],
      SortProductsIdCsv: '',
      ProductSort: false,
      viewImageModal: false,
      viewS3ImageModal: false,
      imageUrl: '',
      userObject: {},
      itemMetaPhotos: [],
      selectedMedia: [],
      IsCategorySearching: false,
      IsProductSearching: false,
      SelectedMetaItemPhotoName: "",
      currencySymbol: Config.Setting.currencySymbol,
      countryConfigObj: JSON.parse(localStorage.getItem(Constants.Session.COUNTRY_CONFIGURATION)),
      media: {},
      videoUrl:'',
      videoUrlError: false,
      loadingItemImage: false,
      ignoredFiles: [],
      loadingS3Content: true,
      shouldRefresh: true,
      currentFolder: "",
      previewUrl:"",
      btnShow: false,
      fileError:false,
      downloadLink:'',
      knowledgebaseLoader: false,
      isSystemAdmin: false,
      posLoader: false,
      orderRouting: [],
      orderRoutingId: 0,
      orderRoutingError: false,
     
    }

    //#region button binding

    this.SearchProduct = this.SearchProduct.bind(this);
    this.SearchCategory = this.SearchCategory.bind(this);
    this.GetUpdatedCategorySort = this.GetUpdatedCategorySort.bind(this);
    this.ProductOptionShowModal = this.ProductOptionShowModal.bind(this);
    this.ProductOptionHideModal = this.ProductOptionHideModal.bind(this);
    this.SaveOption = this.SaveOption.bind(this);
    this.SaveCategory = this.SaveCategory.bind(this);
    this.SaveProduct = this.SaveProduct.bind(this);
    this.CategoryModelShowHide = this.CategoryModelShowHide.bind(this);
    this.ProductModalShowHide = this.ProductModalShowHide.bind(this);
    this.ShowMenu = this.ShowMenu.bind(this);
    this.SortModal = this.SortModal.bind(this);
    this.SortProductModal = this.SortProductModal.bind(this);
    this.EditProductModal = this.EditProductModal.bind(this);
    this.CloseMenu = this.CloseMenu.bind(this);
    this.categoryModalEdit = this.categoryModalEdit.bind(this);
    this.itemImageModal = this.itemImageModal.bind(this);
    this.leftpenal = this.leftpenal.bind(this);
    this.SearchPhoto = this.SearchPhoto.bind(this);

    //#endregion


    if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.ADMIN_OBJECT))){
        this.state.isSystemAdmin = true
    }
    if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))){
      var userObject = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
      this.state.userObject = userObject;
      this.state.currencySymbol = Utilities.GetCurrencySymbol();
      // if(userObject.Enterprise.EnterpriseTypeId === 4){
      //     this.props.history.push('/catalog')
      //    }    
    }
  }

  //#endregion
  loading = () => <div className="page-laoder page-laoder-menu">
    <div className="loader-menu-inner">
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
      <div className="loading-label">Loading.....</div>
    </div>
  </div>


  //#region Image UploadCrop

  onCropChange = crop => {
    this.setState({ Crop: crop })
  }

  onZoomChange(zoom) {

    this.setState({ Zoom: zoom })
  }

  onCropComplete = (croppedArea, croppedAreaPixels) => {
    this.setState({ CroppedAreaPixels: croppedAreaPixels })
  }
  fileErrorModal() {
    this.setState({
      fileError: !this.state.fileError,
    })
}
  onFileChange = async (e) => {

    if (e.target.files && e.target.files.length > 0) {
      this.setState({ PhotoName: e.target.files[0].name, SeletedItemPhoto: e.target.files[0].name });
      const imageDataUrl = await readFile(e.target.files[0])

      this.setState({
        Image: imageDataUrl,
        Crop: { x: 0, y: 0 },
        Zoom: 1,
      })

    }
  }

  toggleViewImageModal = (photoName,metaId,menuMetaName) => {
    this.setState({
      viewImageModal: !this.state.viewImageModal,
      SelectedMetaItemPhotoName:photoName,
      SelectedItemMetaId: metaId,
      SelectedMenuMetaName: menuMetaName,
    })
  }

  
  toggleViewS3ImageModal = (image) => {
    this.setState({
      viewS3ImageModal: !this.state.viewS3ImageModal,
      btnShow: false,
      imageToOpen: image,
      currentFolder: image ? image.parentId : ""
    })
  }


  showClosebtn = () => {
    this.setState({btnShow: true});
  }


  RefreshS3Files = (shouldRefresh) => {

    if(!shouldRefresh) this.state.currentFolder = "";
   
    if(this.state.viewS3ImageModal)
      this.setState({viewS3ImageModal: false})

  
      this.setState({shouldRefresh: shouldRefresh})


  }

  async SetActiveTab(activeTab) {
    // this.GetGalleryPhotos();

    this.setState({loadingItemImage: true})
    this.setState({ ActiveTab: activeTab});

    if(activeTab == 0) {
      this.setState({ ShowGalleryLoader: true, loadingItemImage: false });
      return;
    }

    var data = await PhotoDictionaryService.GetAllGalleryPhotos();
    this.setState({ GalleryPhotos: data, FilterGalleryPhotos: data});

    setTimeout(() => { 
      this.setState({ ShowGalleryLoader: false });
    }, 100)
    
  }


  //#endregion



  //#region toggle functions


  ShowMenu(event) {

    event.preventDefault();

    this.setState({ ShowMenu: true }, () => {
      document.addEventListener('click', this.CloseMenu);
    });
  }
  CloseMenu() {
    this.setState({ ShowMenu: false }, () => {
      document.removeEventListener('click', this.CloseMenu);
    });
  }

  handleCategoryClick(category) {

    this.setState({ SelectedCategoryId: category.Id, SelectedCategoryName: category.Name, SelectedCategory: category, ShowLoaderRightPanel: true, Products: [], FilterProducts: [], IsCategoryClicked: true });
    this.GetProducts(category.Id);
  }

  handleActiveCategoryCheck() {

    this.setState({
      activeCategoryCheck: !this.state.activeCategoryCheck
    }, () => {
      this.SearchCategory(this.state.SearchCategoryText); 
    })
  }

  handleInActiveCategoryCheck() {

    this.setState({
      inActiveCategoryCheck: !this.state.inActiveCategoryCheck
    }, () => {
      this.SearchCategory(this.state.SearchCategoryText); 
    })
    
  }

  handleActiveProductCheck() {

    let state = !this.state.activeProductCheck
    this.setState({
      activeProductCheck: state
    })
    this.FilterActiveInActiveProducts(state, this.state.inActiveProductCheck)
  }

  handleInActiveProductCheck() {

    let state = !this.state.inActiveProductCheck

    this.setState({
      inActiveProductCheck: state
    })

    this.FilterActiveInActiveProducts(this.state.activeProductCheck, state)
  }

  handleCheck() {
    this.setState({
      checked: !this.state.checked
    })
  }

  ProductModalShowHide(product) {

    //if(Object.keys(product).length > 0)
    //product.HourCsv="1|[LUNCH|11:00~02:00,DINNER|00:00~02:00]^^^2|[LUNCH|11:00~02:00,DINNER|00:00~02:00]^^^3|[LUNCH|11:00~02:00,DINNER|00:00~02:00]^^^4|[LUNCH|11:00~02:00,DINNER|00:00~02:00]^^^5|[LUNCH|11:00~02:00,DINNER|00:00~02:00]^^^6|[LUNCH|11:00~02:00,DINNER|00:00~02:00]";
    this.GetEnterpriseWorkingHours();
    this.setState({
      ProductModal: !this.state.ProductModal,
      selectedProductInAction: product,
      ModelHeaderTitle: Object.keys(product).length === 0 ? 'Add New Item' : 'Edit Item',
      OptionFoodTypeIdCsv: Object.keys(product).length === 0 ? this.state.SelectedCategory.FoodTypeIDCsv : product.FoodTypeIDCsv,
      SelectedMetaItemPhotoName: product.PhotoName,
      CheckAll: false,
      AllDay: false,
    })
  }

  EditProductModal() {
    this.setState({
      edititem: !this.state.edititem,
    })
  }

  categoryImageModal(menuMetaName, metaId) {
    let CategoryImageWH = Config.Setting.CategoryImage_W_H
    
    this.setState({
      viewImageModal: false,
      categoryImage: !this.state.categoryImage,
      SelectedItemMetaId: metaId,
      IsCategory: true,
      FilterGalleryPhotos: this.state.GalleryPhotos,
      Aspect:  CategoryImageWH[0] / CategoryImageWH[1] ,
      SeletedItemPhoto: "",
      Image: null,
      ShowGalleryLoader: true,
      ActiveTab: 0,
      itemMetaPhotos: [],
      
    });
    
  }


  itemImageModal(menuMetaName, metaId, isCategory,photoName) {
    let CategoryImageWH = Config.Setting.CategoryImage_W_H
    let ProductImageWH = Config.Setting.ProductImage_W_H;
    
    if(!this.state.itemImage) 
      {
        this.GetSettings();
      } else 
      {
        sessionStorage.removeItem(Constants.CONFIG_SETTINGS);
      }

    this.setState({
      viewImageModal: false,
      itemImage: !this.state.itemImage,
      SelectedMenuMetaName: menuMetaName,
      SelectedMetaItemPhotoName: photoName,
      SelectedItemMetaId: metaId,
      IsCategory: isCategory,
      FilterGalleryPhotos: this.state.GalleryPhotos,
      Aspect: isCategory ? CategoryImageWH[0] / CategoryImageWH[1] : ProductImageWH[0] / ProductImageWH[1],
      SeletedItemPhoto: "",
      Image: null,
      ShowGalleryLoader: true,
      ActiveTab: 0,
      itemMetaPhotos: [],
      videoUrlError: false,
      videoUrl: "",
      ignoredFiles: [],
      
      
    });
    this.setState({ loadingItemImage: true });
    setTimeout(() => {
      if(this.state.itemImage)
      { 
        this.GetProductMediaJson(metaId);
      }  
    }, 500);
  }




  OnPhotoClick(selectedPhoto) {

    this.setState({ SeletedItemPhoto: selectedPhoto });
  }

  ChangeGroupHandler(selectedValue) {

    this.setState({ShowGalleryLoader: true});
    let gallery = this.state.GalleryPhotos;
    if (selectedValue === '0') {
      
      setTimeout(() => { 
        this.setState({ FilterGalleryPhotos: this.state.GalleryPhotos, SelectedPhotoGroup: selectedValue });
        this.setState({ShowGalleryLoader: false});
      }, 500)
      return;
    }


    let filteredData = gallery.filter(value => {
      if (value.GroupName === selectedValue) {
        return true;
      }
    })

    
    setTimeout(() => { 
      this.setState({ FilterGalleryPhotos: filteredData, SelectedPhotoGroup: selectedValue });
      this.setState({ShowGalleryLoader: false});
    }, 500)
  }
  /*toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }*/

  categoryModalEdit() {
    this.setState({
      categoryedit: !this.state.categoryedit,
    });
  }




  CategoryModelShowHide(category) {
    this.setState({ CategoryModel: !this.state.CategoryModel, 
      CategoryAction: category, 
      orderRoutingError: false,
      ModelHeaderTitle: Object.keys(category).length === 0 ? 'Add New Category' : 'Edit Category',
      HideFromPlatform: Object.keys(category).length === 0 ? false : category.HideFromPlatform,
      HideFromWhiteLabel: Object.keys(category).length === 0 ? false : category.HideFromWhiteLabel,
      IsDeal: Object.keys(category).length === 0 ? false : category.IsDeal,
      IsBuffet: Object.keys(category).length === 0 ? false : category.IsBuffet,
      MenuCategoryTagId: Object.keys(category).length === 0 ? 0 : category.FoodTypeIDCsv,
      MenuAddonExtraGroupId: Object.keys(category).length === 0 ? 0 : -1 ,
      MenuAddonGroupToppingId: Object.keys(category).length === 0 ? 0 : -1 ,
      orderRoutingId: Object.keys(category).length === 0 || category.RoutingId === undefined || category.RoutingId === 0 ? this.state.orderRouting.length === 0 ? 0 : -1 : category.RoutingId,

    })
  }

  ProductOptionHideModal() {
    this.setState({
      ProductandOptionAction: {},
      productOptionModal: !this.state.productOptionModal,
      OptionMenuAddonGroupId: 0,
      OptionMenuAddonExtraGroupId: 0
    });
  }

  ProductOptionShowModal(product) {
    this.setState({
      SelectedProduct: product,
      productOptionModal: !this.state.productOptionModal,
      ModelHeaderTitle: 'Add new option',
      OptionMenuAddonGroupId: this.state.SelectedCategory.MenuAddonGroupId,
      OptionMenuAddonExtraGroupId: this.state.SelectedCategory.MenuAddonExtraGroupId
      
    });
  }

  ProductOptionEditModel(product, productOption) {

    this.setState({
      SelectedProduct: product,
      ProductandOptionAction: productOption,
      ModelHeaderTitle: 'Edit option',
      productOptionModal: !this.state.productOptionModal,
      OptionMenuAddonGroupId: productOption.MenuAddonToppingId,
      OptionMenuAddonExtraGroupId: productOption.MenuAddonExtrasId,
    });

  }

  SortProductModal() {
    this.setState({
      ProductSort: !this.state.ProductSort,
    });
  }



  SortModal() {
    this.setState({
      Sort: !this.state.Sort,
    });
  }
  leftpenal() {
    this.setState({
      left: !this.state.left,
    });
  }
  // toggleLarge() {
  //  this.setState({
  //    large: !this.state.large,
  //  });
  // }

  // toggleSmall() {
  //  this.setState({
  //    small: !this.state.small,
  //  });
  //}

  //togglePrimary() {
  //  this.setState({
  //    primary: !this.state.primary,
  //  });
  // }

  /* toggleSuccess() {
     this.setState({
       success: !this.state.success,
     });
   }
 
   toggleWarning() {
     this.setState({
       warning: !this.state.warning,
     });
   }
 
   toggleDanger() {
     this.setState({
       danger: !this.state.danger,
     });
   }
 
   toggleInfo() {
     this.setState({
       info: !this.state.info,
     });
   }
 */
  //#endregion

  //#region html rendering function

  GetActiveCategories(categoryList) {
    let cate = []

    for (var i = 0; i < categoryList.length; i++) {

      if (categoryList[i].IsPublished) {
        cate.push({ "id": categoryList[i].Id, "name": categoryList[i].Name, "SortOrder": categoryList[i].SortOrder });
      }
    }

    cate.sort((x, y) => ((x.SortOrder === y.SortOrder) ? 0 : ((x.SortOrder > y.SortOrder) ? 1 : -1)))

    this.setState({ SortCategories: cate });
    

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

  // RenderSortCategories  = ({item}) =>{

  //   let cat = this.state.SortCategories

  //   return item.name;
  // }


  GetUpdatedCategorySort(categories) {

    let sortCSV = '';
    categories = this.state.SortCategories

    for (var u = 0; u < categories.length; u++) {
      sortCSV += categories[u].id + Config.Setting.csvSeperator;
    }

    sortCSV = Utilities.FormatCsv(sortCSV, Config.Setting.csvSeperator);

    this.setState({ SortCategoriesIdCsv: sortCSV })
  }


  GetUpdatedProductSort(products) {

    let sortCSV = '';
    products = this.state.SortProducts

    for (var u = 0; u < products.length; u++) {
      sortCSV += products[u].id + Config.Setting.csvSeperator;
    }

    sortCSV = Utilities.FormatCsv(sortCSV, Config.Setting.csvSeperator);

    this.setState({ SortProductsIdCsv: sortCSV })
  }

  FilterActiveInActiveProducts(active, inactive) {

    let filteredData = []

    if (!active && inactive) {

      filteredData = this.state.Products.filter((prod) => {
        return !prod.IsPublished
      })
    }
    else if (active && !inactive) {

      filteredData = this.state.Products.filter((prod) => {
        return prod.IsPublished
      })
    }
    else if (active && inactive) {
      filteredData = this.state.Products
    }

    this.setState({ FilterProducts: filteredData });

  }


  SearchProduct(e) {

    let searchText = e.target.value;
    let filteredData = []
    
    this.setState({SearchProductText: searchText});
    // if (e.keyCode !== 8) {
    //   searchText = searchText + String.fromCharCode(e.keyCode);
    // }
    // else{
    //   searchText = searchText.substr(0, e.target.value.length-1)
    // }

    if (searchText.toString().trim() === '') {
      this.setState({ FilterProducts: this.state.Products,IsProductSearching: false });
      return;
    }

    filteredData = this.state.Products.filter((prod) => {

      let arr = searchText.toUpperCase().trim();
      let isExists = false;

      if (prod.MenuMetaName.toUpperCase().indexOf(arr) !== -1 || prod.Name.toUpperCase().indexOf(arr) !== -1 || prod.MenuMetaDescription.toUpperCase().indexOf(arr) !== -1) {
          isExists = true;
        }

      return isExists
    })


    this.setState({ FilterProducts: filteredData,IsProductSearching: true });
  }

  SearchCategory(value) {

    let searchText = value;
    let filteredData = []
    let activeCategory = this.state.activeCategoryCheck
    let inActiveCategory = this.state.inActiveCategoryCheck
    this.setState({SearchCategoryText: searchText});
    if (searchText.toString().trim() === '') {
      this.setState({FiltersMenuCategory: this.state.Categories,IsCategorySearching : false });
      return;
    }

    filteredData = this.state.Categories.filter((cate) => {

      let arr = searchText.toUpperCase().trim();
      let isExists = false;

        if (cate.Name.toUpperCase().indexOf(arr) !== -1 || cate.Description.toUpperCase().indexOf(arr) !== -1) {
          
          isExists = cate.IsPublished ? activeCategory : inActiveCategory;
        }

      return isExists
    })

    this.setState({ FiltersMenuCategory: filteredData, IsCategorySearching : true });

  }


  RenderAdvancedHours(productHrArr, workingHr, daySort) {

    let workingTime = workingHr.split('|')[0]

    let chckSelected = productHrArr.filter(arr => {
      return (arr.indexOf(workingTime) !== -1);
    })

    //onChange={(e) => this.checkHandleChangeEvent(e)} 
    return (
      <li key={daySort + '-' + workingTime}>
        <div className="checkbox-day">
          <AvField type="checkbox" className="form-checkbox" name={'chk-' + daySort + '-' + workingTime} value={chckSelected.length > 0} />
          <label className="settingsLabel" htmlFor={'chk-' + daySort + '-' + workingTime}>{workingTime}</label>
        </div>
      </li>
    )

  }


  checkHandleChangeEvent(event) {

    event.preventDefault();
    let currentCheckBox = event.target.name;
    let formData = event.target.form;


    for (var i = 0; i < formData.length; i++) {

      if (formData[i].name.indexOf(currentCheckBox) !== -1 && formData[i].name !== currentCheckBox) {

        event.target.form[i].value = event.target.value;
        event.target.form[i].checked = event.target.value === "true" ? "checked" : "";

      }

    }
    event.preventDefault();

  }



  RenderWorkingHour = (hoursArr, productHours, day, isAdvanceHour,index) => {

    let hourCsvArr = [];
    let ProductHourSelected = hoursArr.filter(hrArr =>  {

      if (hrArr.indexOf(day.SortOrder + '|') !== -1) {
        hourCsvArr = (isAdvanceHour === false) ? hrArr.split('|') : hrArr.substr(2, hrArr.length).replace('[', '').replace(']', '').split(',');
      }
      return hourCsvArr.length > 0
    });

    if (hourCsvArr.length === 0) {
      return ('');
    }

    let productArr = [];

    if (isAdvanceHour === true) {

      let productDayHr = productHours.split(Config.Setting.csvSeperator).filter(productHr => {

        if (productHr.indexOf(day.SortOrder + '|') !== -1) {
          productArr = productHr.substr(2, productHr.length).replace('[', '').replace(']', '').split(',');
        }
        return productArr.length > 0
      });
    }
    // onChange={(e) => this.checkHandleChangeEvent(e)}
    return (
      <li key={'h-' + day.SortOrder}>
        <div className="checkbox-day">
          <AvField type="checkbox" className="form-checkbox" name={"chk-" + day.SortOrder} value={day.IsSelected} checked={day.IsSelected} onChange={(e) => this.HandleCheckWeekDay(e,index)} />
          <label className="settingsLabel" htmlFor={"chk-" + day.SortOrder}>{day.Name}</label>
          {isAdvanceHour === true ? ('') : (<span>{hourCsvArr[1].replace('~', ' - ')}</span>)}
        </div>
        {isAdvanceHour === true ?
          (
            <ul>
              {
                hourCsvArr.map(WorkingArr =>
                  this.RenderAdvancedHours(productArr, WorkingArr, day.SortOrder))
              }
            </ul>
          ) : ('')}
      </li>
    )
  }


 

  RenderWorkingHourForProduct() {

    let workingHourArr = this.state.WorkingHourCSV.split(Config.Setting.csvSeperator);
    let productWorkingHour = (Object.keys(this.state.selectedProductInAction).length === 0) ? '' : this.state.selectedProductInAction.HourCsv
    let days = this.state.Days;
    let checkAll = true;

    if(!this.state.AllDay) {

      days.forEach(selectedDay => {
      selectedDay.IsSelected = productWorkingHour.indexOf(selectedDay.SortOrder + '|') !== -1 ? true : false

    });
  }


  if (workingHourArr.length === 0) {
      return (<ul className="timing-list-wrap">
        <li>
          <div className="checkbox-day"> No working hours set </div>
        </li>
      </ul>
      )
    }

    let isAdvanceHour = workingHourArr[0].indexOf('[') !== -1;

    //Normal Working hours
    return (
      <ul className="timing-list-wrap">
        
        <li key='allDays'>
        <div className="checkbox-day">
          <AvField type="checkbox" className="form-checkbox" onChange={(e) => this.HandleCheckAll(e)} name={"chk-AllDays"} value={this.state.CheckAll} checked={this.state.CheckAll} />
          <label className="settingsLabel" htmlFor={"chk-AllDays"}>All Days</label>
        </div>
      </li>
      
        {days.map((day,index )=> this.RenderWorkingHour(workingHourArr, productWorkingHour, day, isAdvanceHour,index))}
      </ul>
    )

  }

  RenderLineSeperator() {
    return (<p className="separator"><span></span></p>)
  }

  RenderAddOptionButton(product) {
    return (<div className="add-option-btn" onClick={() => this.ProductOptionShowModal(product)}> <i className="fa fa-plus" aria-hidden="true"></i><span>{Labels.Add_Option}</span></div>)
  }

  RenderProductOption(productOptions, product) {


    if (productOptions.IsDeleted === true)
      return ('');
      
    return (

      <div key={productOptions.Id} className="item-option-detail-wrap">
        <div className="item-option-detail-inner-wrap">
          <div className="item-option-name-price">
            <span>{productOptions.Name.trim() === "" ? '(unnamed)' :  Utilities.SpecialCharacterDecode(productOptions.Name)}</span>
            <span className="bold text-right">{this.state.currencySymbol}{Utilities.FormatCurrency(productOptions.Price, this.state.countryConfigObj.DecimalPlaces)}</span>
          </div>
          {
            (this.state.userObject.Enterprise.EnterpriseTypeId == 3 || this.state.userObject.Enterprise.EnterpriseTypeId == 6) && 
            <div className={productOptions.ExtraName === "" && productOptions.ToppingName === "" ? "item-option-topping-extras no-extras-top" : "item-option-topping-extras"}>
              <span>
                {productOptions.ExtraName === "" ? Labels.No_Extras : Labels.Options}

                <span style={{ fontSize: 14, display: 'block', color: '#333' }}>  {productOptions.ExtraName === "" ? "" : Utilities.SpecialCharacterDecode(productOptions.ExtraName)} </span>
              </span>
              <span>{productOptions.ToppingName === "" ? Labels.No_Toppings : Labels.Topping}
                <span style={{ fontSize: 14, display: 'block', color: '#333' }}>  {productOptions.ToppingName === "" ? "" : Utilities.SpecialCharacterDecode(productOptions.ToppingName)} </span>
              </span>
            </div>
          }
        </div><div className="item-option-edit">
          <span className="font-16 show-add-option cursor-pointer">
            <i className="fa fa-pencil-square-o" data-tip data-for='Edit' aria-hidden="true" onClick={() => this.ProductOptionEditModel(product, productOptions)}></i>
            {/* <ReactTooltip id='Edit'><span>Edit</span></ReactTooltip> */}
          </span>
          <span className="sa-warning">
            <i className="fa fa-trash" aria-hidden="true" data-tip data-for='Delete' onClick={() => this.DeleteProductOptionConfirmation(productOptions)} data-placement="top" data-original-title="Remove"></i>
            {/* <ReactTooltip id='Delete'><span>Delete</span></ReactTooltip> */}
          </span>
        </div>

      </div>

    )
  }

  RenderProductInfoWithDetail(product, productOption) {

    var actions = <div><span class="m-b-0 statusChangeLink m-r-20 "  >
     
     <span  onClick={(e) => this.toggleViewImageModal(product.PhotoName,product.MenuItemMetaId,product.MenuMetaName)}><i class="fa fa-eye font-18" >
     </i>{Labels.View_Image}
    </span>
    </span><span class="m-b-0 statusChangeLink m-r-20"  ><a onClick={(e) => this.itemImageModal(product.MenuMetaName, product.MenuItemMetaId, false,product.PhotoName)}><i class="fa fa-edit font-18" ></i> Change image</a></span>

    <span class="m-b-0 statusChangeLink m-r-20 "  >
     
     <span onClick={() => this.DeleteProductPhotoConfirmation(product)}><i class="fa fa-trash font-18" >
     </i>{Labels.Remove_Image}
    </span>
    </span></div>;




    return (
      <div key={product.MenuItemMetaId} className={product.IsPublished === true ? "item-main-row  " : "item-main-row item-row-disable"}>
        <div className="item-row-wrap">
          <span className="item-icon cursor-pointer">
            {product.PhotoName === "" ? <i onClick={(e) => this.itemImageModal(product.MenuMetaName, product.MenuItemMetaId, false,product.PhotoName)} className="fa fa-picture-o" aria-hidden="true"></i> :
              <div>
                <div className="menu-data-action-btn-wrap">
                  <div className="show-res">
                    <Dropdown >
                      <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                        <span className="border-item-image">
                          <span onClick={(e) => this.itemImageModal(product.MenuMetaName, product.MenuItemMetaId, false,product.PhotoName)} className="menu-item-image" style={{ backgroundImage: "url('" + Utilities.generatePhotoLargeURL(decodeURIComponent(product.PhotoName),true,false) + "')" }}><i className="fa fa-edit"></i> </span></span>

                      </Dropdown.Toggle>

                      {/* <Dropdown.Menu >
                        {actions}
                      </Dropdown.Menu> */}
                    </Dropdown>

                  </div>
                </div>
              </div>
            }



          </span>

          <span className="item-name">{Utilities.SpecialCharacterDecode(product.MenuMetaName)}</span>
          {
            product.IsPublished === true ? <span className="menu-right-list-buttons">
              <span onClick={() => this.EditProductModal()}>
                <i className="fa fa-pencil-square-o" data-tip data-for='Edit' aria-hidden="true" onClick={() => this.ProductModalShowHide(product)}></i>
                {/* <ReactTooltip id='Edit'><span>Edit</span></ReactTooltip> */}
              </span>
              <span className="sa-warning">
                <i className="fa fa-trash" aria-hidden="true" data-tip data-for='Delete' onClick={() => this.DeleteProductConfirmation(product)} ></i>
                {/* <ReactTooltip id='Delete'><span>Delete</span></ReactTooltip> */}
              </span>
              <span className="sa-suspended">
                <i className={product.IsPublished === true ? "fa fa-ban" : ""} data-tip data-for='Activate' aria-hidden="true" onClick={() => this.ActivateDeactivateProductConfirmation(product)}  ></i>
                {/* <ReactTooltip id='Activate'><span>{product.IsPublished === true ? "Inactive" : "Activate"}</span></ReactTooltip> */}
              </span>
            </span> :
              <button className="btn btn-success" style={{ padding: '4px 10px' }} onClick={() => this.ActivateDeactivateProductConfirmation(product)}>{Labels.Activate}</button>
          }

        </div>

        {/* <p className="item-row-wrap">
              Tomato base with mozzarella and cheddar cheese
          </p> */}
        {product.MenuMetaDescription == '' ? ('') : (
          
          product.MenuMetaDescription.split('<br>').map((desc) => {

            return (
              <p className="item-row-wrap">
              {Utilities.SpecialCharacterDecode(desc)}
            </p>
            )

          })
          
        )
        }

        {productOption.map(option =>
          this.RenderProductOption(option, product)
        )}

        {this.RenderAddOptionButton(product)}
        {this.RenderLineSeperator()}
      </div>
    );

  }

RenderRightEmptyProductPanel(){
  
  if (this.state.ShowLoaderRightPanel === true) {
    return this.loading()
  }

  return (
    <div className="no-results-wrap"><div><div className="not-found-menu m-b-20">{Labels.No_Items_Found}</div><span className="add-cat-btn" onClick={() => this.CategoryModelShowHide({})}>{Labels.Add_New_Category}</span></div> </div>
  )

}

  RenderRightProductPanel(products) {

    if (this.state.ShowLoaderRightPanel === true) {
      return this.loading()
    }

    if (products.length === 0)
      return (<div className="not-found-menu">{Labels.No_Items_Found}</div>)

    var prevMetaItem = '';
    var productOption = [];
    var html = [];

    for (var i = 0; i < products.length; i++) {

      if (products[i].MenuMetaName !== prevMetaItem && prevMetaItem !== '') {

        html.push(this.RenderProductInfoWithDetail(productOption[0], productOption));
        productOption = [];

        productOption.push(products[i]);
        prevMetaItem = products[i].MenuMetaName;

        continue;

      }

      productOption.push(products[i]);

      prevMetaItem = products[i].MenuMetaName;
    }

    if (productOption.length > 0) {
      html.push(this.RenderProductInfoWithDetail(productOption[0], productOption));
    }

    return (
      <div>{html.map((optionHtml) => optionHtml)}</div>)
  }
  onScroll() {
    this.props.handleScroll(this.refs.elem.scrollTop);
  }
  SetCurrentCategoryState(category) {

    if(category == undefined) return;
    //let isFound  = this.state.SelectedCategoryId > 0
    // if(category == undefined){
    // this.GetProducts(0);
    // return;
    // }
    if (Object.keys(this.state.SelectedCategory).length === 0 || this.state.SelectedCategory.Name !== category.Name) {
      this.setState({ SelectedCategoryId: category.Id, SelectedCategoryName: category.Name, SelectedCategory: category })
      this.GetProducts(category.Id);
    }

  }
  handleBottomClick() {
    setTimeout(
      function () {
        if (window.innerWidth > 800)
          smoothScroll.scrollTo('top');
      },
      1000
    );

  }

  RenderLeftCategoriesPanel(cate) {

    return (
      <li key={cate.Id} onClick={() => this.state.SelectedCategoryId === cate.Id ? null : this.handleCategoryClick(cate)} className={this.state.SelectedCategoryId === cate.Id ? "active" : ""}>
        <span className="menu-left-list-label" id="top" onClick={(e) => this.handleBottomClick(e)} >{Utilities.SpecialCharacterDecode(cate.Name)}</span>
        <span className="menu-left-list-buttons">
          <span data-toggle="modal" data-target="#categoryModalEdit">
            <i className="fa fa-pencil-square-o" aria-hidden="true" data-tip data-for='Edit' onClick={() => this.CategoryModelShowHide(cate)} ></i>
            <ReactTooltip id='Edit'><span>{Labels.Edit}</span></ReactTooltip>
          </span>
          <span className="sa-warning" onClick={() => this.DeleteCategoryConfirmation(cate.Id, cate.Name)}>
            <i className="fa fa-trash" aria-hidden="true" data-tip data-for='Delete'></i>
            <ReactTooltip id='Delete'><span>{Labels.Delete}</span></ReactTooltip>
          </span>
          <span className="sa-suspended" onClick={() => this.ActivateDeactivateConfirmation(cate.IsPublished, cate.Name)}>
            <i className="fa fa-ban" aria-hidden="true" data-tip data-for='activate'></i>
            <ReactTooltip id='activate'><span>{cate.IsPublished === true ? 'Inactive' : 'Activate'}</span></ReactTooltip>
          </span>
        </span>
      </li>)
  }

  LoadCategories = (categories) => {
    if (this.state.ShowLoaderLeftPanel === true) {
      return this.loading()
    }

    if (categories.length === 0) {
      // this.SetCurrentCategoryState(categories[SelectedCategoryIndex])
      return ('Category(s) not found')
    }

    var htmlActive = [];
    var htmlInActive = [];
    var SelectedCategoryIndex = -1;

    for (var i = 0; i < categories.length; i++) {

      if (this.state.SelectedCategoryId === categories[i].Id && this.state.inActiveCategoryCheck) {
        SelectedCategoryIndex = i;
      } 
      // this.SetCurrentCategoryState(categories[i])

      if (categories[i].IsPublished == true) {
        htmlActive.push(this.RenderLeftCategoriesPanel(categories[i]));
        if(SelectedCategoryIndex == -1){
          SelectedCategoryIndex = i;
        } 
          
      }
      else {
        htmlInActive.push(this.RenderLeftCategoriesPanel(categories[i]));
      }
    }

    if (!this.state.isMobile || this.state.IsCategoryClicked)
      this.SetCurrentCategoryState(categories[SelectedCategoryIndex])

    return (
      <div className="menu-left-cat-list">
        <h3 className={this.state.activeCategoryCheck && htmlActive.length > 0 ? "menu-cat-active-heading" : "no-display"}>{Labels.Active}</h3>
        <ul className={this.state.activeCategoryCheck && htmlActive.length > 0 ? "" : "no-display"}>{htmlActive.map((optionHtml) => optionHtml)}</ul>

        <h3 className={this.state.inActiveCategoryCheck && htmlInActive.length > 0 ? "menu-cat-not-active-heading" : "no-display"}>{Labels.Inactive}</h3>
        <ul className={this.state.inActiveCategoryCheck && htmlInActive.length > 0 ? "" : "no-display"}>{htmlInActive.map((optionHtml) => optionHtml)}</ul>
      </div>)

  }

  CheckedDietry(dietry, dietaryArr) {

    let dietSelected = dietaryArr.filter((d) => {
      return dietry.Id === d
    });
    return dietSelected.length > 0
  }

  RenderDietry(dietry, selectedDietry) {

    let selectedDietryArr = selectedDietry.split(Config.Setting.csvSeperator);



    return (
      <div>
        {dietry.map(diet =>
          <div className="common-checkbox-wrap-center" key={'dv' + diet.Name}>
            <AvField type="checkbox" className="form-checkbox" name={diet.Name} value={this.CheckedDietry(diet, selectedDietryArr)} />
            <label className="settingsLabel" htmlFor={diet.Name}>{diet.Name}</label>
          </div>

        )}
      </div>
    )

  }


  SearchPhoto(e) {

    let searchText = e.target.value;
    let FilteredByGroup = [];
    let filteredData = [];

    if (searchText.toString().trim() === '' && this.state.FilterGalleryPhotos !== this.state.GalleryPhotos) {
    
      if (this.state.SelectedPhotoGroup !== 'All') {
        this.ChangeGroupHandler(this.state.SelectedPhotoGroup);
        this.state.StopTyping = false;
        return;
      }

        setTimeout(() => { 
          this.setState({ FilterGalleryPhotos: this.state.GalleryPhotos});
          // this.setState({ShowGalleryLoader: false});
        }, 10)
  
        
    }

    if(searchText.length < 3) {
      return;
    }
    this.state.StopTyping = false;

    if (this.state.SelectedPhotoGroup !== 'All')
      FilteredByGroup = this.state.FilterGalleryPhotos
    else
      FilteredByGroup = this.state.GalleryPhotos

    filteredData = FilteredByGroup.filter((photo) => {

      let arr = searchText.toUpperCase().trim();
      let isExists = false;

        if (photo.Name.toUpperCase().indexOf(arr) !== -1 && !Utilities.stringIsEmpty(arr) ) {
          isExists = true   
        }

      return isExists
    })

    // setTimeout(() => { 
    
    // if(this.state.StopTyping) { 
      // this.setState({ShowGalleryLoader: true});

      setTimeout(() => { 
          this.setState({ FilterGalleryPhotos: filteredData }); 
          // this.setState({ShowGalleryLoader: false});
        }, 10)
     
      // }
    //  }, 10)

    // this.state.StopTyping = true;
    
  }


  RenderGalleryPhoto(galleryPhoto, val) {


    var selectedClass = this.state.SeletedItemPhoto === galleryPhoto.PhotoName ? "selected-photo photo-label" : "photo-label";

    return (

      <div className={selectedClass} key={val} onClick={(e) => this.OnPhotoClick(galleryPhoto.PhotoName)}>
        <div className="show-tick no-display">
            <span className="show-check "><i className="fa fa-check" aria-hidden="true"></i></span>
          </div>
        <div style={{ position: 'relative' }}>
          
          <img src={Utilities.generatePhotoLargeURL(galleryPhoto.PhotoName, true, false)}  alt={galleryPhoto.PhotoName} />
        </div>
        <div>{galleryPhoto.Name}</div>
      </div>


    )
  }

  LoadGalleryPhotos(galleryPhotos) {



    var htmlPhotos = [];

    for (var i = 0; i < galleryPhotos.length; i++) {

      htmlPhotos.push(this.RenderGalleryPhoto(galleryPhotos[i], i));

    }

    return (htmlPhotos.map((photoHtml) => photoHtml))

  }


  RenderGalleryGroup(galleryPhoto, val) {

    return (<option value={galleryPhoto.GroupName} key={val}>{galleryPhoto.GroupName}</option>)
  }

  LoadGalleryGroup(galleryPhotos) {


    let outputArray = [];
    let htmlGroup = [];

    htmlGroup.push(<option value='0' key='0' >All</option>)
    for (var i = 0; i < galleryPhotos.length; i++) {

      if (!this.IsGroupExists(galleryPhotos[i].GroupName, outputArray))

        htmlGroup.push(this.RenderGalleryGroup(galleryPhotos[i], i + 1));
      outputArray.push(galleryPhotos[i].GroupName);

    }

    return (

      htmlGroup.map((groupHtml) => groupHtml)
    )

  }

  IsGroupExists = (groupName, arr) => {

    var flag = arr.filter(value => {
      if (value === String(groupName)) {
        return true;
      }
    })

    return flag.length > 0;
  }

  //#endregion


  //#region api calling


  //#region category

  GetSettings = async () => {

    var data = await AuthService.GetSetting();

    if(data.length > 0)
    {
      sessionStorage.setItem(Constants.CONFIG_SETTINGS, data);
    }

  }

    GetOrderRouting = async () => {

    var data = await OrderRoutingService.GetOrderRouting();

    if (data.length > 0) {
      
      this.setState({ orderRouting: data, orderRoutingId: "-1" });
    }
  
  }


  GetCategories = async () => {

    var data = await CategoryService.GetAll(Utilities.GetEnterpriseIDFromSessionObject());

    data.sort((x, y) => ((x.SortOrder === y.SortOrder) ? 0 : ((x.SortOrder > y.SortOrder) ? 1 : -1)))

    this.setState({ Categories: data, FiltersMenuCategory: data, ShowLoaderLeftPanel: false, ShowLoaderRightPanel: false });
    if(Object.keys(this.state.SelectedCategory).length > 0) {
      var selectedCategoryId = this.state.SelectedCategory.Id;      
      var selectedCategory = data.filter(function(a){ return a.Id == selectedCategoryId })[0]
      this.setState({SelectedCategory: selectedCategory != undefined ? selectedCategory : {}});
      this.GetProducts(this.state.SelectedCategoryId);
      }
    this.GetActiveCategories(data);

  }

  UpdateCategorySort = async () => {

    if(this.state.IsSave) return;
     this.setState({IsSave:true})

    let csv = this.state.SortCategoriesIdCsv;

    let isUpdated = await CategoryService.UpdateSort(csv);
      this.setState({IsSave:false})
    if (isUpdated === true) {
      this.GetCategories();
      this.setState({ Sort: false })

    }

  }

  DeleteCategory = async () => {

    this.setState({ showDeleteConfirmation: false });
    let DeletedMessage = await CategoryService.Delete(this.state.SelectedCategoryId)
    let name = this.state.SelectedCategoryName;

    if (DeletedMessage === '1') {

      this.setState({ SelectedCategoryId: 0 });
      this.GetCategories();
      this.setState({ showAlert: true, alertModelTitle: 'Removed!', alertModelText: name + ' has been removed' });
      SetMenuStatus(true);
      return;
    }

    let message = DeletedMessage === '0' ? '"' + name + '" has not been deleted' : DeletedMessage;

    //this.setState({SelectedCategoryId: 0});
    this.setState({ showAlert: true, alertModelTitle: 'Error!', alertModelText: message });

  }

  ActiveDeactivateCategory = async () => {

    this.setState({ showDeleteConfirmation: false });

    let category = this.state.SelectedCategory
    let messageData = await CategoryService.PublishUnpublish(this.state.SelectedCategoryId, !this.state.SelectedCategory.IsPublished)
    let name = this.state.SelectedCategoryName;

    let message = '';

    if (messageData === '1') {
      SetMenuStatus(true);
      let title = category.IsPublished === true ? 'Inactive!' : 'Activated!';
      message = category.IsPublished === true ? '"' + Utilities.SpecialCharacterDecode(category.Name) + '" has been Inactive' : '"' + Utilities.SpecialCharacterDecode(category.Name)  + '" has been activated '
      category.IsPublished = !category.IsPublished
      this.GetCategories()
      this.setState({ showAlert: true, alertModelTitle: title, alertModelText: message, SelectedCategoryId: category.Id, SelectedCategory: category });
      this.handleCategoryClick(category)
      return;
    }

    message = messageData === '0' ? ' "' + name + '" has not been ' + (category.IsPublished === true ? 'Inactive' : 'activated') + '' : messageData;
    this.setState({ showAlert: true, alertModelTitle: 'Error!', alertModelText: messageData });
    this.handleCategoryClick(category)
  }

  SaveCategoryApi = async (category, isNewCategory) => {

    let message = (isNewCategory === true) ? await CategoryService.Save(category) : await CategoryService.Update(category)
    this.setState({IsSave:false})
    if (message === '1') {
      SetMenuStatus(true);
      this.CategoryModelShowHide({});
      this.GetCategories();
      Utilities.notify("Category " + Utilities.SpecialCharacterDecode(category.Name) + ((isNewCategory === true) ? " created successfully." :" updated successfully.") ,"s");
      
      // If this is a new category, select it after saving
      if (isNewCategory) {
        const newCategories = await CategoryService.GetAll(Utilities.GetEnterpriseIDFromSessionObject());
        const newCategory = newCategories.find(c => c.Name === category.Name);
        if (newCategory) {
          await this.handleCategoryClick(newCategory);
        }
      }
    }
  }

  SaveCategory(event, values) {

    if(this.state.IsSave) return;
    this.setState({IsSave:true, orderRoutingError: false})
    
    if(this.state.orderRoutingId == '-1' || this.state.orderRoutingId === undefined || this.state.orderRoutingId === null) {
      this.setState({orderRoutingError: true, IsSave:false})
      return;
    }



    let category = CategoryService.categoryObject
    let categoryToUpdate = this.state.CategoryAction;

    category.Name = Utilities.SpecialCharacterEncode(values.categoryName);
    category.Description = Utilities.SpecialCharacterEncode(values.description);
    category.ReferenceId = values.categoryReferenceID != null ? values.categoryReferenceID : "";
    category.MenuAddonExtrasGroupId = this.state.MenuAddonExtraGroupId //values.categoryExtras;
    category.MenuAddonToppingGroupId = this.state.MenuAddonGroupToppingId //values.CategoryTopping; 
    category.TagsIdsCsv =  this.state.MenuCategoryTagId //values.CategoryFoodType;
    category.IsDeal = this.state.IsDeal;
    category.IsBuffet = this.state.IsBuffet;
    category.HideFromPlatform = this.state.HideFromPlatform;
    category.HideFromWhiteLabel= this.state.HideFromWhiteLabel;
    category.RoutingId = this.state.orderRoutingId;
    //Saving
    if (Object.keys(this.state.CategoryAction).length === 0) {
      this.SaveCategoryApi(category, true);
      return;
    }

    //updating
    category.PhotoName = categoryToUpdate.PhotoName;
    category.MenuCategoryId = categoryToUpdate.Id;
    
    this.SaveCategoryApi(category, false);
  }


  //#endregion


  //#region Products

  GetProducts = async (categoryId) => {

    this.setState({ ShowLoaderRightPanel: true });
    var data = await ProductService.GetWithDetails(Utilities.GetEnterpriseIDFromSession(), categoryId);
    data.sort((x, y) => ((x.IsPublished  === y.IsPublished) ? y.SortOrder - x.SortOrder : (!y.IsPublished ? 1 : -1)))
    data.reverse();
    this.setState({ Products: data, FilterProducts: data});
    this.FilterActiveInActiveProducts(this.state.activeProductCheck, this.state.inActiveProductCheck);
    this.setState({ShowLoaderRightPanel: false, left: false });

    //  if(!this.state.isMobile || this.state.IsCategoryClick)
    this.setState({ left: false, IsCategoryClicked: false });
    this.GetActiveProducts(data);
  }

  GetProductMediaJson = async (id) => {
    
    var productPhotoName = this.state.SelectedMetaItemPhotoName
    var oldPhoto = {};
    var hasOldPhoto = false;
    if(productPhotoName != "" && !(decodeURIComponent(productPhotoName).split('/').length > 1))
    {
      oldPhoto = {AbsoluteUrl: (`/images/${productPhotoName.substring(0, 3)}/${productPhotoName.substring(3, 6)}/${productPhotoName}`), AltText: productPhotoName}
      hasOldPhoto = true;
    }


    this.setState({ loadingItemImage: true });
    var data = await ProductService.GetProductMediaJson(id);
    
    if (data != undefined && data != '') {
      this.setState({
        media: data,
        itemMetaPhotos: data.Images,
        videoUrl: data.VideoURL
      }, () => {
        if(hasOldPhoto) this.state.itemMetaPhotos.unshift(oldPhoto)
      } );
    } else if(hasOldPhoto) {
        this.state.itemMetaPhotos.push(oldPhoto)
      }

      this.setState({ loadingItemImage: false});
  }

  ActivateDeActivateProduct = async () => {

    this.setState({ showDeleteConfirmation: false });

    let product = this.state.selectedProductInAction
    let messageData = await ProductService.PublishUnpublish(product.MenuItemMetaId, !product.IsPublished)


    let message = '';

    if (messageData === '1') {
      SetMenuStatus(true);
      let title = product.IsPublished === true ? 'Inactive!' : 'Activated!';
      message = product.IsPublished === true ? '"' + product.MenuMetaName + '" has been Inactive' : '"' + product.MenuMetaName + '" has been activated'
      this.setState({ showAlert: true, alertModelTitle: title, alertModelText: message, selectedProductInAction: {} });
      this.setState({activeCategoryCheck: this.state.activeCategoryCheck})
      this.handleCategoryClick(this.state.SelectedCategory)
      return;
    }

    message = messageData === '0' ? '"' + product.MenuMetaName + '" has not been ' + (product.IsPublished === true ? 'Inactive' : 'activated') + '' : messageData;
    this.setState({ showAlert: true, alertModelTitle: 'Error!', alertModelText: messageData, selectedProductInAction: {} });

  }


  UpdateProductSort = async () => {

    if(this.state.IsSave) return;
     this.setState({IsSave:true})

    let csv = this.state.SortProductsIdCsv;

    let isUpdated = await ProductService.UpdateSort(csv);
      this.setState({IsSave:false})
    if (isUpdated === true) {
      SetMenuStatus(true);
      this.GetProducts(this.state.SelectedCategoryId);
      this.setState({ ProductSort: false })

    }

  }

  SetSelectedMedia = (media) => 
  {
      this.state.selectedMedia = media;
      this.state.Image = media.length > 0 ? media: null;
      var btnNext = document.getElementById("btnNext");
      
      if (btnNext) {
        if (media.length > 0){ 
        btnNext.style.display = 'block';
      } else 
      {
        btnNext.style.display = 'none';
      }
    }
      
  }


  ValidateFiles = (files) => 
  {

    this.setState({ignoredFiles: files});

  }




  UpdateImageSorting = (media) => {

    this.state.itemMetaPhotos = media;

  }

  UpdateItemMetaMediaJson = async () => {

    if(this.state.IsSave || this.state.videoUrlError) return;
    this.setState({IsSave:true})
    var mediaJson = this.GenerateSelectedMediaJson();
    var media = this.state.selectedMedia;
    
    var mediaObj = {};
    mediaObj.Json = mediaJson;
    mediaObj.PhotoName = media.length > 0 ? media[0].AbsoluteUrl : "";
    mediaObj.MetaId = this.state.SelectedItemMetaId;
    mediaObj.EnterpriseId = Utilities.GetEnterpriseIDFromSession();

   let isUpdated = await ProductService.UpdateMedia(mediaObj);
     this.setState({IsSave:false})
   if (isUpdated == true) {
    SetMenuStatus(true);
    this.state.SelectedMetaItemPhotoName = mediaObj.PhotoName;
    if(this.state.ActiveTab == 1) {
      this.setState({ActiveTab: -1})
      setTimeout(() => {
        this.setState({ selectedMedia: [], ActiveTab: 0}, () =>  this.GetProductMediaJson( this.state.SelectedItemMetaId));
      }, 100);
      return;
    }
    else
    {
      Utilities.notify("Media changes saved successfully for " + Utilities.SpecialCharacterDecode(this.state.SelectedMenuMetaName)  ,"s");
      var selectedProduct = this.state.Products.find(p => p.MenuItemMetaId == this.state.SelectedItemMetaId)
      if(selectedProduct)
      {
        selectedProduct.PhotoName = mediaObj.PhotoName;
      }

    }
    sessionStorage.removeItem(Constants.CONFIG_SETTINGS);
    this.setState({selectedMedia: [], Image: null, itemImage: false});
    
   }
  }

  GenerateSelectedMediaJson = () => {

    var media = this.state.selectedMedia;
    var imageArray = []
    var mediaObj = {}
    var photoName = "";
    media.forEach((photo,i)=> {
      
      if(photo.id){
      var photoId = photo.id;

      var isExists = this.state.itemMetaPhotos.find(p => p.AbsoluteUrl == "/"+photoId) != undefined;

      if(!isExists)
      {
        imageArray.push({AbsoluteUrl: `/${photoId.replace(Config.Setting.envConfiguration.ContentPath, "")}`, AltText: photo.name});
      }
    }
    });
    var newList = []
    newList.push(...this.state.itemMetaPhotos, ...imageArray);
    mediaObj.Images = newList;
    this.state.selectedMedia = newList;
    mediaObj.VideoURL = this.state.videoUrl;
    return JSON.stringify(mediaObj);
    
  }

  DeleteProduct = async () => {

    this.setState({ showDeleteConfirmation: false });
    let product = this.state.selectedProductInAction
    let DeletedMessage = await ProductService.Delete(product.MenuItemMetaId)

    if (DeletedMessage === '1') {
      SetMenuStatus(true);
      this.handleCategoryClick(this.state.SelectedCategory);
      this.setState({ selectedProductInAction: {}, showAlert: true, alertModelTitle: 'Removed!', alertModelText: product.MenuMetaName + ' has been removed ' });
      return;
    }

    let message = DeletedMessage === '0' ? '"' + product.MenuMetaName + '" has been removed' : DeletedMessage;

    this.setState({ showAlert: true, alertModelTitle: 'Error!', alertModelText: message, selectedProductInAction: {} });

  }

  GenerateSelectedHourCsv(data) {

    let workingHoursCsv = this.state.WorkingHourCSV;
    let days = this.state.Days;
    /*if (workingHoursCsv.indexOf('[') !== -1) {
      //advance Hour
      return '';
    }*/

    //normal hours
    let csv = '';

    if (workingHoursCsv.indexOf('[') !== -1) {

      let workingHourArr = workingHoursCsv.split(Config.Setting.csvSeperator);
      days.forEach(day => {


        if (data["chk-" + day.SortOrder] === true) {

          csv = csv + day.SortOrder + '|';

          let dayHour = workingHourArr.filter(hrArr => {
            return (hrArr.indexOf(day.SortOrder + '|') !== -1)
          });

          dayHour = dayHour[0].substr(2, dayHour[0].length).replace('[', '').replace(']', '').split(',')

          csv = csv + '[';
          dayHour.forEach(advHr => {
            if (data["chk-" + day.SortOrder + '-' + advHr.split('|')[0]] === true) {
              csv = csv + advHr + ','
            }
          });

          csv = csv.substr(0, csv.length - 1) + ']' + Config.Setting.csvSeperator;

        }
      });

    }
    else {

      //normal hours
      days.forEach(day => {

        if (data["chk-" + day.SortOrder] === true) {
          let startIndex = workingHoursCsv.indexOf(day.SortOrder + '|');
          csv = csv + workingHoursCsv.substring(startIndex, startIndex + 13) + Config.Setting.csvSeperator

        }


      })

    }

    return Utilities.FormatCsv(csv, Config.Setting.csvSeperator);

  }

  GenerateDietaryCsv(data) {

    let dietary = this.state.Dietary;

    let csv = ''
    dietary.forEach(d => {

      if (data[d.Name] === true) {
        csv = csv + d.Id + Config.Setting.csvSeperator
      }

    })

    return Utilities.FormatCsv(csv, Config.Setting.csvSeperator);

  }


  SaveProduct(event, values) {
    
    if(this.state.IsSave) return;
    this.setState({IsSave:true})
    
    let product = ProductService.CategoryProduct;

    product.CategoryId = this.state.SelectedCategory.Id;
    product.Name = Utilities.SpecialCharacterEncode(values.productName);
    product.Description = Utilities.SpecialCharacterEncode(values.productDescription);
    product.ReferenceId = values.productReferenceId != null ? values.productReferenceId : "";
    product.PreparationTime = values.productPreparationTime;
    product.TagsIdsCsv = this.state.OptionFoodTypeIdCsv === "0"? this.state.SelectedCategory.FoodTypeIDCsv : this.state.OptionFoodTypeIdCsv;
    product.HoursCsv = this.GenerateSelectedHourCsv(values);
    product.DietaryTypeIdsCsv = this.GenerateDietaryCsv(values);
    product.PhotoName = this.state.SelectedMetaItemPhotoName;
    

    if(product.TagsIdsCsv === ""){
      product.TagsIdsCsv = "0" //this.state.FoodTypes[0].Id
    }


    if (Object.keys(this.state.selectedProductInAction).length === 0) {

      this.SaveCategoryProduct(product, false);
      return;
    }

    //updating
    product.ProductId = this.state.selectedProductInAction.MenuItemMetaId;
    this.SaveCategoryProduct(product, true);

  }

  SaveCategoryProduct = async (product, updating) => {

    let message = updating === false ? await ProductService.Save(product) : await ProductService.Update(product)
    this.setState({IsSave:false})
    if (message === '1') {
      SetMenuStatus(true);
      this.ProductModalShowHide({});
      this.handleCategoryClick(this.state.SelectedCategory);
      Utilities.notify("Item " + Utilities.SpecialCharacterDecode(product.Name) + ((updating === false) ? " created successfully." :" updated successfully.") ,"s");
    }

  }


  DeleteProductPhoto = async () => {
    this.setState({ showDeleteConfirmation: false });
    let product = this.state.selectedProductInAction
    
    let DeletedMessage = await ProductService.DeletePhoto(product.MenuItemMetaId,product.PhotoName )

    if (DeletedMessage === '1') {
      SetMenuStatus(true);
      this.handleCategoryClick(this.state.SelectedCategory);
      Utilities.notify("Photo has been removed for " + Utilities.SpecialCharacterDecode(product.MenuMetaName)  ,"s");
      return;
    } else if(DeletedMessage === '0'){
      Utilities.notify("Unable to remove photo from " + Utilities.SpecialCharacterDecode(product.MenuMetaName) ,"e");

    } else {
      Utilities.notify(product.MenuMetaName + "Unable to remove photo from " + Utilities.SpecialCharacterDecode(product.MenuMetaName) + " Error: " +  DeletedMessage ,"e");
    }

  }


  DeleteCategoryPhoto = async () => {
    this.setState({ showDeleteConfirmation: false });
    let category = this.state.SelectedCategory
    
    let DeletedMessage = await CategoryService.DeletePhoto(category.Id,category.PhotoName )

    if (DeletedMessage === '1') {
      SetMenuStatus(true);
      category.PhotoName = "";
      this.setState({SelectedCategory: category});
      this.handleCategoryClick(this.state.SelectedCategory);
      Utilities.notify("Photo has been removed for " + Utilities.SpecialCharacterDecode(category.Name)  ,"s");
      return;
    } else if(DeletedMessage === '0'){
      Utilities.notify("Unable to remove photo from " + Utilities.SpecialCharacterDecode(category.Name) ,"e");

    } else {
      Utilities.notify(category.Name + "Unable to remove photo from " + Utilities.SpecialCharacterDecode(category.Name) + " Error: " +  DeletedMessage ,"e");
    }

  }


  //#endregion

  //#region Product options

  DeleteProductOption = async () => {
    this.setState({ showDeleteConfirmation: false });
    let productOption = this.state.selectedProductOptionInAction
    let DeletedMessage = await ProductOptionService.Delete(productOption.Id)

    if (DeletedMessage === '1') {
      SetMenuStatus(true);
      this.handleCategoryClick(this.state.SelectedCategory);
      this.setState({ selectedProductOptionInAction: {}, showAlert: true, alertModelTitle: 'Removed!', alertModelText: productOption.Name + ' has been removed' });
      return;
    }

    let message = DeletedMessage === '0' ? productOption.Name + ' has not been removed' : DeletedMessage;
    this.setState({ showAlert: true, alertModelTitle: 'Error!', alertModelText: message, selectedProductOptionInAction: {} });

  }

  SaveProductOpion = async (option) => {

    let message = await ProductOptionService.SaveUpdate(option)
    this.setState({IsSave:false})
    if (message === '1') {
      SetMenuStatus(true);
      this.handleCategoryClick(this.state.SelectedCategory);
      this.ProductOptionHideModal();
      Utilities.notify("Option " + Utilities.SpecialCharacterDecode(option.Name) + ((option.Id === 0) ? " created successfully." :" updated successfully.") ,"s");
    }

  }

  SaveOption(event, values) {

    if(this.state.IsSave) return;
      this.setState({IsSave:true})

    let product = this.state.SelectedProduct;
    let option = ProductOptionService.Option;
    //saving 
    if (Object.keys(this.state.ProductandOptionAction).length === 0) {

      option.Id = 0;
      option.ProductId = product.MenuItemMetaId;
      option.Price = Utilities.FormatCurrency(values.price, this.state.countryConfigObj.DecimalPlaces);
      option.ReferenceId = values.optionReferenceId != null ? values.optionReferenceId : "";
      option.Name = (Utilities.SpecialCharacterEncode(product.MenuMetaName) + ' ' + Utilities.SpecialCharacterEncode(values.optionName)).trim();
      option.MenuAddonGroupId = this.state.OptionMenuAddonExtraGroupId //values.extras;
      option.MenuAddonToppingId =  this.state.OptionMenuAddonGroupId//values.topping;
      option.VarietyName =  Utilities.SpecialCharacterEncode(values.optionName).trim();
      option.CalorieCount = values.calorieCount != undefined ? values.calorieCount.trim() : '';
      option.Quantity = values.OptionQuantity != undefined ? Number(values.OptionQuantity.trim()) : 0;

      this.SaveProductOpion(option);

      return;
    }

    //updating
    let productOption = this.state.ProductandOptionAction;

    option.Id = productOption.Id;
    option.ProductId = productOption.MenuItemMetaId;
    option.VarietyId = productOption.MenuVarietyId;
    option.ReferenceId = values.optionReferenceId != null ? values.optionReferenceId : "";
    option.Price = Utilities.FormatCurrency(values.price, this.state.countryConfigObj.DecimalPlaces);
    option.Name = (Utilities.SpecialCharacterEncode(product.MenuMetaName) + ' ' + Utilities.SpecialCharacterEncode(values.optionName)).trim();
    option.MenuAddonGroupId = this.state.OptionMenuAddonExtraGroupId; //values.extras;
    option.MenuAddonToppingId = this.state.OptionMenuAddonGroupId //values.topping;
    option.VarietyName = Utilities.SpecialCharacterEncode(values.optionName).trim();
    option.CalorieCount = values.calorieCount != undefined ? values.calorieCount.trim() : '';
    option.Quantity = values.OptionQuantity != undefined ? Number(values.OptionQuantity.trim()) : 0;

    this.SaveProductOpion(option);
  }

  UpdateItemMetaPhoto = async () => {

    if(this.state.IsSave) return;
    this.setState({IsSave:true})
    
    let isCategory = this.state.IsCategory;
    let croppedImage = "";
    let newPhotoName = "";

    if (this.state.ActiveTab === 0) {

      croppedImage = await getCroppedImg(
        this.state.Image,
        this.state.CroppedAreaPixels
      )
    }

      let category = {};

      category.EnterpriseId = Utilities.GetEnterpriseIDFromSession();
      category.MenuCategoryId = this.state.SelectedCategoryId;
      category.PhotoName = Utilities.RemoveSpecialCharsFromString(this.state.SeletedItemPhoto);
      category.PhotoNameBitStream = croppedImage;
      newPhotoName = await CategoryService.UpdateCategoryPhoto(category);

    this.setState({IsSave:false})
    if (newPhotoName !== "") {
        this.state.SelectedCategory.PhotoName = newPhotoName;

      this.handleCategoryClick(this.state.SelectedCategory);
      SetMenuStatus(true);
    }

    else {

      Utilities.notify("Update failed." + (newPhotoName !== '' ? "[" + newPhotoName + "]" : "") ,"e");


    }

    this.setState({ categoryImage: !this.state.categoryImage });

  }


  //#endregion

  //#region AddonGroup

  GetAddonGroupTopping = async () => {

    let topping = await AddonGroupService.GetAll(Constants.MenuAddonGroupTopping);
    this.setState({ ToppingGroup: topping });


  }


  GetAddonGroupExtras = async () => {

    let extras = await AddonGroupService.GetAll(Constants.MenuAddonGroupExtra);
    this.setState({ ExtrasGroup: extras });

  }

  //#endregion


  //#region EnterpriseSetting

  GetEnterpriseWorkingHours = async () => {

    let workingHour = await EnterpriseSettingService.GetWorkingHour();
    this.setState({ 
      WorkingHourCSV: workingHour,
      selectedProductTimingTitle: workingHour != null ? `Item availability timings (${workingHour.indexOf('[') !==-1 ? 'Advance' : 'Normal'})` : "Normal" });
    
  }
  enterprisePosMenu = async () => {
    this.setState({ posLoader: true })
    let response = await EnterpriseMenuService.POSMENU();
    if(Object.keys(response).length > 0){
      this.setState({ posLoader: false })
      Utilities.notify(response.Result,'s')
      return
    }
    
  }
  getAIKnowledgebase = async () => {
    this.setState({ knowledgebaseLoader: true })
    let response = await Enterprise.GetAIKnowledge();
    if(response.length > 0){
      this.makeTextFile(response)
      return
    }
    Utilities.notify("Data not Found",'e')
    this.setState({ knowledgebaseLoader: false })
  }

  makeTextFile = (list) => {
    const formattedText = list.map(item => {
      if(this.state.userObject.Enterprise.EnterpriseTypeId == 3 || this.state.userObject.Enterprise.EnterpriseTypeId == 4 || this.state.userObject.Enterprise.EnterpriseTypeId == 7){
        let itemDetails = `${item.CategoryName}\n${item.Product}\n${item.Description}\n${item.Variants}\n${item.Price}\n`;
        if(item.CalorieCount != null && item.CalorieCount != ""){
          itemDetails +=`Calories: ${item.CalorieCount}\n`;
        }
        if(item.Serving != null && item.Serving != "" && item.Serving > 0){
          itemDetails +=`${item.Serving}\n`;
        }
        if(item.Dietary != null && item.Dietary != ""){
          itemDetails +=`Dietary Options: ${item.Dietary}\n`;
        }
        itemDetails += `${item.PhotoName}\n${item.MetaItem}\n${item.Url}\n${item.AddIntoBasket}\n`;
        return  itemDetails  // `${item.CategoryName}\n${item.Product}\n${item.Description}\n${item.Variants}\n${item.Price}\n${item.CalorieCount}${item.Serving}\n${item.Dietary}\n${item.PhotoName}\n${item.MetaItem}\n${item.Url}\n${item.AddIntoBasket}\n`;
      }
      return `${item.CategoryName}\n${item.Product}\n${item.Description}\n${item.Variants}\n${item.Price}\n${item.PhotoName}\n${item.MetaItem}\n${item.Url}\n${item.AddIntoBasket}\n`;
    }).join('\n\n'); 
    const data = new Blob([formattedText], { type: 'text/plain' });
    const downloadLink = window.URL.createObjectURL(data)
    const link = document.createElement("a");
    link.download = `${this.state.userObject.Enterprise.Name}-Knowledgebase.txt`;
    link.href = downloadLink;
    link.click();
    this.setState({ knowledgebaseLoader: false })
  }


  GetTags = async () => {

    let tags = await TagService.GetBy(Utilities.GetEnterpriseIDFromSession())

    let foodTypes = [];
    tags.forEach(tag => {

      if (tag.Type.toUpperCase() !== 'Dietary'.toUpperCase()) {
        foodTypes.push(tag);
      }
    });


    let dietary = []
    tags.forEach(tag => {

      if (tag.Type.toUpperCase() === 'Dietary'.toUpperCase()) {
        dietary.push(tag);
      }
    });

    this.setState({ FoodTypes: foodTypes, Dietary: dietary });

  }

  //#endregion  

  GetDays = async () => {

    let days = await GlobalConfigurationService.GetDays();
    this.setState({ Days: days });
  }


  //#endregion


  //#region  Confirmation Model Generation

  DeleteCategoryConfirmation(categoryId, name) {

    this.setState({ deleteComfirmationModelType: 'c', showDeleteConfirmation: true, deleteConfirmationModelText: 'Remove ' + Utilities.SpecialCharacterDecode(name) + '?' })

  }

  DeleteCategoryPhotoConfirmation(category) {

    this.setState({ selectedCategoryInAction: category, deleteComfirmationModelType: 'ci', showDeleteConfirmation: true, deleteConfirmationModelText: 'Remove photo from ' + Utilities.SpecialCharacterDecode(category.Name) + ' ?' })
  }

  ActivateDeactivateConfirmation(isActive, name) {

    if (isActive === true) {

      this.setState({ deleteComfirmationModelType: 'cp', showDeleteConfirmation: true, deleteConfirmationModelText: 'Inactive"' + Utilities.SpecialCharacterDecode(name) + '"?' })
      return;
    }

    this.setState({ deleteComfirmationModelType: 'cp', showDeleteConfirmation: true, deleteConfirmationModelText: 'Activate"' + Utilities.SpecialCharacterDecode(name) + '".' })

  }


  ActivateDeactivateProductConfirmation(product) {

    let isActive = product.IsPublished;
    let message = isActive === true ? 'Inactive ' + Utilities.SpecialCharacterDecode(product.MenuMetaName) + '?' : 'Activate ' + Utilities.SpecialCharacterDecode(product.MenuMetaName) + '".'
    this.setState({ selectedProductInAction: product, deleteComfirmationModelType: 'pp', showDeleteConfirmation: true, deleteConfirmationModelText: message })

  }

  DeleteProductConfirmation(product) {

    this.setState({ selectedProductInAction: product, deleteComfirmationModelType: 'pd', showDeleteConfirmation: true, deleteConfirmationModelText: 'Remove ' + Utilities.SpecialCharacterDecode(product.MenuMetaName) + '?' })
  }

  DeleteProductOptionConfirmation(productOption) {

    this.setState({ selectedProductOptionInAction: productOption, deleteComfirmationModelType: 'o', showDeleteConfirmation: true, deleteConfirmationModelText: 'Remove ' + Utilities.SpecialCharacterDecode(productOption.Name) + '?' })
  }


  DeleteProductPhotoConfirmation(product) {

    this.setState({ selectedProductInAction: product, deleteComfirmationModelType: 'pi', showDeleteConfirmation: true, deleteConfirmationModelText: 'Remove photo from ' + Utilities.SpecialCharacterDecode(product.MenuMetaName) + ' ?' })
  }

  HandleCheckWeekDay = (e,index) => {

    let isChecked =e.target.value === "false"? true : false;
    let days = this.state.Days;
    let checkAll = true;
    days[index].IsSelected = isChecked;
    days.forEach(day => {
            
      if(!day.IsSelected) {
          checkAll = false
          return;
      }
  });

  this.setState({AllDay: true,CheckAll : checkAll});

}

  HandleCheckAll = (e) => {
    
     let isChecked =e.target.value === "false"? true : false;
     let days = this.state.Days;

    days.forEach(selectedDay => {
      selectedDay.IsSelected = isChecked;
    });

    this.setState({Days: days,CheckAll: isChecked, AllDay: true});

}

  HandleOnConfirmation() {

    let type = this.state.deleteComfirmationModelType;

    switch (type.toUpperCase()) {

      case 'C':
        this.DeleteCategory();
        break;
      case 'CP':
        this.ActiveDeactivateCategory();
        break;
      case 'PD':
        this.DeleteProduct();
        break;
      case 'PP':
        this.ActivateDeActivateProduct();
        break;
      case 'O':
        this.DeleteProductOption();
        break;
        case 'PI':
        this.DeleteProductPhoto();
        break;
        case 'CI':
        this.DeleteCategoryPhoto();
        break;

      default:
        break;
    }

  }

  //#endregion


  //#region Models and alerts Html 

  GenerateProductModal(product) {


    if (!this.state.ProductModal) {
      return ('');
    }

    return (

      <Modal isOpen={this.state.ProductModal} className={this.props.className}>
        <ModalHeader>{this.state.ModelHeaderTitle}</ModalHeader>
        <ModalBody className="padding-0 ">
          <AvForm onValidSubmit={this.SaveProduct}>
            <div className="padding-20 scroll-model-web">
              <FormGroup className="modal-form-group">
                <Label htmlFor="productName" className="control-label">{Labels.Item_name}</Label>
                <AvField errorMessage="This is a required field" name="productName" value={Object.keys(product).length === 0 ? "" : Utilities.SpecialCharacterDecode(product.MenuMetaName)} type="text" className="form-control" required />
              </FormGroup>
              <FormGroup className="modal-form-group">
                <Label htmlFor="productDescription" className="control-label">{Labels.Description}</Label>
                <AvField errorMessage="This is a required field" name="productDescription" type="textarea" value={Object.keys(product).length === 0 ? "" : Utilities.SpecialCharacterDecode(product.MenuMetaDescription)} className="form-control" />
              </FormGroup>
              <FormGroup className="modal-form-group">
                <Label htmlFor="productReferenceId" className="control-label">{Labels.RefId}</Label>
                <AvField errorMessage="This is a required field" name="productReferenceId" value={Object.keys(product).length === 0 ? "" : product.MenuItemMetaReferenceId} type="text" className="form-control"  />
              </FormGroup>
            {(this.state.userObject.Enterprise.EnterpriseTypeId == 3 || this.state.userObject.Enterprise.EnterpriseTypeId == 6) &&
              <FormGroup className="modal-form-group">
                               
                <div className="col-md-12">
                <Label htmlFor="productPreparationTime" className="control-label">{Labels.Preparation_Time}</Label>
                                            <div className="input-group mb-3 form-group">
                                            <AvField  type="tel" name="productPreparationTime"  value={product.PreparationTime} className="borderRadiusRightNone form-control form-control-right" id="txtproductPreparationTime"
                                                validate={{ tel: {pattern: '^[0-9]', errorMessage: 'Invalid input '}, }} 
                                            />
                                                <div className="input-group-append">
                                                    <span className="input-group-text form-control borderRightRadius" style={{maxHeight:"35.19px"}}>Minutes</span>
                                                </div>
                                            </div>
                                        </div>
                                           <div className="help-block with-errors"></div>

              </FormGroup>
            }

              { this.state.userObject.Enterprise.EnterpriseTypeId == 6 &&
              <FormGroup className="modal-form-group">
                <Label htmlFor="productFoodType" className="control-label">{Labels.Select_Food_Type}</Label>
                {/* <AvField type="select" value={Object.keys(product).length === 0 ? this.state.SelectedCategory.FoodTypeIDCsv : product.FoodTypeIDCsv} name="productFoodType">
                  {this.state.FoodTypes.map((tags) => <option key={tags.Id} value={tags.Id}>{tags.Name}</option>)}
                </AvField> */}

              <select className="select2 form-control custom-select"  name="extras" onChange={(e) => this.handleSelectOptions(e,'of')} style={{ width: '100%', height: '36px' }}> 
                  {this.state.FoodTypes.map((tags) => Object.keys(product).length === 0 ? <option key={tags.Id} value={tags.Id} selected={(Number(this.state.SelectedCategory.FoodTypeIDCsv) === Number(tags.Id) )}>{tags.Name}</option> :  <option key={tags.Id} value={tags.Id} selected={(Number(product.FoodTypeIDCsv) === Number(tags.Id) )}>{tags.Name}</option>)}
               </select>

              </FormGroup>
            }

              {this.state.Dietary.length === 0 ? '' : <FormGroup className="modal-form-group">
                <Label htmlFor="exampleSelect" className="control-label">{Labels.Select_Dietary_Type}</Label>
                {this.RenderDietry(this.state.Dietary, Object.keys(product).length === 0 ? '' : product.DietryIDCsv)}
              </FormGroup>
              }
              <FormGroup className="modal-form-group" >
                <Label htmlFor="exampleSelect" className="control-label">{this.state.selectedProductTimingTitle}  </Label>
                {this.RenderWorkingHourForProduct()}

              </FormGroup>
              <FormGroup className="modal-form-group  no-display" >
                <Label htmlFor="exampleSelect" className="control-label">{Labels.Item_Availability_Timings} (Advance)</Label>
                <ul className="timing-list-wrap">
                  <li>
                    <div className="checkbox-day">
                      <input type="checkbox" className="form-checkbox" id="Sunday" />
                      <label className="settingsLabel" htmlFor="Sunday">{Labels.Sunday}</label>

                    </div>
                    <ul>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Breakfast" />
                          <label className="settingsLabel" htmlFor="Breakfast">{Labels.Breakfast}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Brunch" />
                          <label className="settingsLabel" htmlFor="Brunch">{Labels.Brunch}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Lunch" />
                          <label className="settingsLabel" htmlFor="Lunch">{Labels.Lunch}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Hi-Tea" />
                          <label className="settingsLabel" htmlFor="Hi-Tea">{Labels.Hi_Tea}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Dinner" />
                          <label className="settingsLabel" htmlFor="Dinner">{Labels.Dinner}</label>
                        </div>
                      </li>
                    </ul>
                  </li>


                  <li>
                    <div className="checkbox-day">
                      <input type="checkbox" className="form-checkbox" id="Sunday" />
                      <label className="settingsLabel" htmlFor="Sunday">{Labels.Monday}</label>

                    </div>
                    <ul>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Breakfast" />
                          <label className="settingsLabel" htmlFor="Breakfast">{Labels.Breakfast}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Brunch" />
                          <label className="settingsLabel" htmlFor="Brunch">{Labels.Brunch}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Lunch" />
                          <label className="settingsLabel" htmlFor="Lunch">{Labels.Lunch}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Hi-Tea" />
                          <label className="settingsLabel" htmlFor="Hi-Tea">{Labels.Hi_Tea}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Dinner" />
                          <label className="settingsLabel" htmlFor="Dinner">{Labels.Dinner}</label>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div className="checkbox-day">
                      <input type="checkbox" className="form-checkbox" id="Sunday" />
                      <label className="settingsLabel" htmlFor="Sunday">{Labels.Tuesday}</label>

                    </div>
                    <ul>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Breakfast" />
                          <label className="settingsLabel" htmlFor="Breakfast">{Labels.Breakfast}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Brunch" />
                          <label className="settingsLabel" htmlFor="Brunch">{Labels.Brunch}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Lunch" />
                          <label className="settingsLabel" htmlFor="Lunch">{Labels.Lunch}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Hi-Tea" />
                          <label className="settingsLabel" htmlFor="Hi-Tea">{Labels.Hi_Tea}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Dinner" />
                          <label className="settingsLabel" htmlFor="Dinner">{Labels.Dinner}</label>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div className="checkbox-day">
                      <input type="checkbox" className="form-checkbox" id="Sunday" />
                      <label className="settingsLabel" htmlFor="Sunday">{Labels.Wednesday}</label>

                    </div>
                    <ul>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Breakfast" />
                          <label className="settingsLabel" htmlFor="Breakfast">{Labels.Breakfast}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Brunch" />
                          <label className="settingsLabel" htmlFor="Brunch">{Labels.Brunch}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Lunch" />
                          <label className="settingsLabel" htmlFor="Lunch">{Labels.Lunch}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Hi-Tea" />
                          <label className="settingsLabel" htmlFor="Hi-Tea">{Labels.Hi_Tea}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Dinner" />
                          <label className="settingsLabel" htmlFor="Dinner">{Labels.Dinner}</label>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div className="checkbox-day">
                      <input type="checkbox" className="form-checkbox" id="Sunday" />
                      <label className="settingsLabel" htmlFor="Sunday">{Labels.Thursday}</label>

                    </div>
                    <ul>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Breakfast" />
                          <label className="settingsLabel" htmlFor="Breakfast">{Labels.Breakfast}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Brunch" />
                          <label className="settingsLabel" htmlFor="Brunch">{Labels.Brunch}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Lunch" />
                          <label className="settingsLabel" htmlFor="Lunch">{Labels.Lunch}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Hi-Tea" />
                          <label className="settingsLabel" htmlFor="Hi-Tea">{Labels.Hi_Tea}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Dinner" />
                          <label className="settingsLabel" htmlFor="Dinner">{Labels.Dinner}</label>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div className="checkbox-day">
                      <input type="checkbox" className="form-checkbox" id="Sunday" />
                      <label className="settingsLabel" htmlFor="Sunday">{Labels.Friday}</label>

                    </div>
                    <ul>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Breakfast" />
                          <label className="settingsLabel" htmlFor="Breakfast">{Labels.Breakfast}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Brunch" />
                          <label className="settingsLabel" htmlFor="Brunch">{Labels.Brunch}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Lunch" />
                          <label className="settingsLabel" htmlFor="Lunch">{Labels.Lunch}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Hi-Tea" />
                          <label className="settingsLabel" htmlFor="Hi-Tea">{Labels.Hi_Tea}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Dinner" />
                          <label className="settingsLabel" htmlFor="Dinner">{Labels.Dinner}</label>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div className="checkbox-day">
                      <input type="checkbox" className="form-checkbox" id="Sunday" />
                      <label className="settingsLabel" htmlFor="Sunday">{Labels.Saturday}</label>

                    </div>
                    <ul>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Breakfast" />
                          <label className="settingsLabel" htmlFor="Breakfast">{Labels.Breakfast}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Brunch" />
                          <label className="settingsLabel" htmlFor="Brunch">{Labels.Brunch}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Lunch" />
                          <label className="settingsLabel" htmlFor="Lunch">{Labels.Lunch}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Hi-Tea" />
                          <label className="settingsLabel" htmlFor="Hi-Tea">{Labels.Hi_Tea}</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Dinner" />
                          <label className="settingsLabel" htmlFor="Dinner">{Labels.Dinner}</label>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>

              </FormGroup>
              {/* <div class="alert alert-danger">Sever side error</div> */}
            </div>
            <FormGroup className="modal-footer">
              <Button color="secondary" onClick={() => this.ProductModalShowHide({})}>{Labels.Cancel}</Button>
              <Button color="primary">
              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                             : <span className="comment-text">{Labels.Save}</span>}
            </Button> 
            </FormGroup>
          </AvForm>
        </ModalBody>
      </Modal>

    )

  }

  GenerateProductOptionModel(ProductandOptionAction) {


    if (!this.state.productOptionModal) {
      return ('');
    }

    return (
      <Modal isOpen={this.state.productOptionModal} className={this.props.className}>
        <ModalHeader>{this.state.ModelHeaderTitle}</ModalHeader>
        <ModalBody className="padding-0 ">
          <AvForm onValidSubmit={this.SaveOption} >
          <div className="padding-20 scroll-model-web">
              <FormGroup className="modal-form-group">
                <Label htmlFor="exampleEmail" className="control-label">{Labels.Name}</Label>
                <AvField errorMessage="This is a required field" onKeyUp={Utilities.RemoveDefinedSpecialChars} value={Object.keys(ProductandOptionAction).length === 0 ? "" : Utilities.SpecialCharacterDecode(ProductandOptionAction.Name)} name="optionName" type="text" className="form-control" />
              </FormGroup>
              <FormGroup className="modal-form-group">
                <Label htmlFor="exampleEmail" className="control-label">{Labels.Options_Quantity}</Label>
                <AvField errorMessage="This is a required field" onKeyUp={Utilities.ValidateDecimals} value={Object.keys(ProductandOptionAction).length === 0 ? "" : String(ProductandOptionAction.Quantity)} name="OptionQuantity" type="tel" className="form-control"
                 validate={{ tel: {pattern: '^[0-9]', errorMessage: 'Required a number'}, }}  />
              </FormGroup>
              <FormGroup className="modal-form-group set-price-field">
                <Label htmlFor="price" className="control-label">{Labels.Price}</Label>
                <div className="input-group h-set">
                  <div className="input-group-prepend">
                    <span className="input-group-text">{this.state.currencySymbol}</span>
                  </div>
                  <AvField type="text" className="form-control" maxLength="10" name="price" onKeyUp={Utilities.ValidateDecimals} value={Object.keys(ProductandOptionAction).length === 0 ? "0" : String(ProductandOptionAction.Price)} />
                </div>
              </FormGroup>
              <FormGroup className="modal-form-group">
                <Label htmlFor="optionReferenceId" className="control-label">{Labels.RefId}</Label>
                <AvField errorMessage="This is a required field" value={Object.keys(ProductandOptionAction).length === 0 ? "" : ProductandOptionAction.ReferenceId} name="optionReferenceId" type="text" className="form-control" />
              </FormGroup>
              {(this.state.userObject.Enterprise.EnterpriseTypeId == 3 || this.state.userObject.Enterprise.EnterpriseTypeId == 6) &&
              <>
              <FormGroup className="modal-form-group">
              <Label htmlFor="exampleEmail" className="control-label">{Labels.CalorieCount}</Label>
              <AvField  value={Object.keys(ProductandOptionAction).length == 0 ? "" : ProductandOptionAction.CalorieCount} name="calorieCount" type="tel" className="form-control"
              validate={{ tel: {pattern: '^[0-9]', errorMessage: 'Required a number'}, }} 
              />
            </FormGroup>
              </>}
              
              {(this.state.userObject.Enterprise.EnterpriseTypeId != Constants.ENTERPRISE_TYPE_IDS.HOTEL && this.state.userObject.Enterprise.EnterpriseTypeId != Constants.ENTERPRISE_TYPE_IDS.CONCIERGE_CHAT && this.state.userObject.Enterprise.EnterpriseTypeId != Constants.ENTERPRISE_TYPE_IDS.EXECUTIVE_LOUNGE) &&
            <>
              <FormGroup className="modal-form-group">
                <Label htmlFor="topping" className="control-label">{Labels.Select_Toppings}</Label>
                
                 <select className="select2 form-control custom-select"  name="topping" onChange={(e) => this.handleSelectOptions(e,'ot')} style={{ width: '100%', height: '36px' }}> 
                  <option key={0} value="0">{Labels.No_Toppings}</option>
                  {this.state.ToppingGroup.map((topping) => Object.keys(this.state.ProductandOptionAction).length === 0 ? <option key={topping.Id} value={topping.Id} selected={(Number(this.state.SelectedCategory.MenuAddonGroupId) === Number(topping.Id) )}>{Utilities.SpecialCharacterDecode(topping.Name)}</option> :  <option key={topping.Id} value={topping.Id} selected={(Number(this.state.ProductandOptionAction.MenuAddonToppingId) === Number(topping.Id) )}>{Utilities.SpecialCharacterDecode(topping.Name)}</option>)}
                  </select>
              </FormGroup>

               <FormGroup className="modal-form-group">
                <Label htmlFor="extras" className="control-label">{Labels.Select_Extras}</Label>
                
                  <select className="select2 form-control custom-select"  name="extras" onChange={(e) => this.handleSelectOptions(e,'oe')} style={{ width: '100%', height: '36px' }}> 
                  <option key={0} value="0">{Labels.No_Extras}</option>
                  {this.state.ExtrasGroup.map((extra) => Object.keys(this.state.ProductandOptionAction).length === 0 ? <option key={extra.Id} value={extra.Id} selected={(Number(this.state.SelectedCategory.MenuAddonExtraGroupId) === Number(extra.Id) )}>{Utilities.SpecialCharacterDecode(extra.Name)}</option> :  <option key={extra.Id} value={extra.Id} selected={(Number(this.state.ProductandOptionAction.MenuAddonExtrasId) === Number(extra.Id) )}>{Utilities.SpecialCharacterDecode(extra.Name)}</option>)}
                  </select>

              </FormGroup>
              </>
              }


              {/* <div class="alert alert-danger">Sever side error</div> */}
            </div>
            <FormGroup className="modal-footer" >
              <Button color="secondary" onClick={() => this.ProductOptionHideModal()}>{Labels.Cancel}</Button>
              <Button color="primary">
              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                             : <span className="comment-text">{Labels.Save}</span>}
            
            </Button> 
            </FormGroup>

          </AvForm>
        </ModalBody>

      </Modal>

    )
  }


  GenerateSweetConfirmationWithCancel() {
    return (
      <SweetAlert
        show={this.state.showDeleteConfirmation}
        title=""
        text={this.state.deleteConfirmationModelText}
        showCancelButton
        onConfirm={() => { this.HandleOnConfirmation() }}
        confirmButtonText="Yes"
        onCancel={() => {
          this.setState({ showDeleteConfirmation: false });
        }}
        onEscapeKey={() => this.setState({ showDeleteConfirmation: false })}
        // onOutsideClick={() => this.setState({ showDeleteConfirmation: false })}
      />
    )
  }

  GenerateSweetAlert() {
    return (
      <SweetAlert
        show={this.state.showAlert}
        //title={this.state.alertModelTitle}
        title={''}
        text={this.state.alertModelText}
        onConfirm={() => this.setState({ showAlert: false })}
        onEscapeKey={() => this.setState({ showAlert: false })}
        // onOutsideClick={() => this.setState({ showAlert: false })}
      />
    )
  }

  GenerateCategorySortModel() {

    if (!this.state.Sort) {
      return ('');
    }

    return (

      <Modal isOpen={this.state.Sort} toggle={this.SortModal} className={this.props.className}>
        <ModalHeader>Sort items</ModalHeader>
        <ModalBody>
          <div className="m-b-15">Use mouse or finger to drag items and sort their positions.</div>
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


  hadleCategoryChecks(e,chk){

    // let category = this.state.CategoryAction
    
    if(chk.toUpperCase() === 'P'){

      this.setState({HideFromPlatform: !this.state.HideFromPlatform});
      // category.HideFromPlatform = !category.HideFromPlatform
    }

    else if(chk === 'W'){
      this.setState({HideFromWhiteLabel: !this.state.HideFromWhiteLabel});
      // category.HideFromWhiteLabel = !category.HideFromWhiteLabel
    }

    else if(chk === 'D'){
      this.setState({IsDeal: !this.state.IsDeal});
      // category.IsDeal = !category.IsDeal
    }
    
    else if(chk === 'B'){
      this.setState({IsBuffet: !this.state.IsBuffet});
      // category.IsBuffet = !category.IsBuffet
    }


    // this.setState({CategoryAction: category});

  }

  handleSelectOptions(e,control) {
    
    let value = e.target.value;
   
    switch (control.toUpperCase()) {

      case 'T':
      this.state.MenuAddonGroupToppingId = value
        break;
      case 'E':
      this.state.MenuAddonExtraGroupId = value
        break;
      case 'F':
      this.state.MenuCategoryTagId = value
        break;

      case 'OT':
      this.state.OptionMenuAddonGroupId = value
        break;

        case 'OE':
        this.state.OptionMenuAddonExtraGroupId = value
       break;

       case 'OF':
       this.state.OptionFoodTypeIdCsv = value
      break;

       case 'OR':
       this.state.orderRoutingId = value
      break;

      default:
        break;
    }

  }

  GenerateCategoryModel() {

    if (!this.state.CategoryModel) {
      return ('');
    }

    return (

      <Modal isOpen={this.state.CategoryModel} className={this.props.className}>
        <ModalHeader>{this.state.ModelHeaderTitle}</ModalHeader>
        <ModalBody className="padding-0">
          <AvForm onValidSubmit={this.SaveCategory}>
          <div className="padding-20 scroll-model-web">
              <FormGroup className="modal-form-group">
                <Label htmlFor="categoryName" className="control-label">{Labels.Category_Name}</Label>
                <AvField errorMessage="This is a required field" value={Object.keys(this.state.CategoryAction).length === 0 ? "" : Utilities.SpecialCharacterDecode(this.state.CategoryAction.Name)} name="categoryName" type="text" className="form-control" required />
              </FormGroup>
              <FormGroup className="modal-form-group">
                <Label htmlFor="description" className="control-label">{Labels.Description}</Label>
                <AvField errorMessage="This is a required field" name="description" type="textarea" value={Object.keys(this.state.CategoryAction).length === 0 ? "" : Utilities.SpecialCharacterDecode(this.state.CategoryAction.Description)} className="form-control" />
              </FormGroup>
              <FormGroup className="modal-form-group">
                <Label htmlFor="categoryReferenceID" className="control-label">{Labels.RefId}</Label>
                <AvField errorMessage="This is a required field" value={Object.keys(this.state.CategoryAction).length === 0 ? "" : this.state.CategoryAction.ReferenceId} name="categoryReferenceID" type="text" className="form-control"  />
              </FormGroup>

                {(this.state.userObject.Enterprise.EnterpriseTypeId != Constants.ENTERPRISE_TYPE_IDS.HOTEL && this.state.userObject.Enterprise.EnterpriseTypeId != Constants.ENTERPRISE_TYPE_IDS.CONCIERGE_CHAT && this.state.userObject.Enterprise.EnterpriseTypeId != Constants.ENTERPRISE_TYPE_IDS.EXECUTIVE_LOUNGE) &&
              <>
            
              { this.state.orderRouting.length > 0 &&
              <FormGroup className="modal-form-group">
                <Label htmlFor="CategoryOrderRouting" className="control-label">{Labels.Select_OrderRouting}</Label>
                <select className="select2 form-control custom-select" name="CategoryOrderRouting" onChange={(e) => this.handleSelectOptions(e,'or')}  style={{ width: '100%', height: '36px' }}> 
                  <option key={0} value="-1" selected={this.state.CategoryAction.Id === undefined}>{Labels.Select_OrderRouting}</option>
                  {this.state.orderRouting.map((routing) =>  
                  <option selected={this.state.orderRoutingId === routing.Id} key={routing.Id} value={routing.Id}>{Utilities.SpecialCharacterDecode(routing.Name)}</option> )}
                 </select>
              {this.state.orderRoutingError && <span className='text-danger'>This is a required field</span>}
              </FormGroup>
          }


              <FormGroup className="modal-form-group">
                <Label htmlFor="CategoryTopping" className="control-label">{Labels.Select_Toppings}</Label>
               
                <select className="select2 form-control custom-select"  name="CategoryTopping" onChange={(e) => this.handleSelectOptions(e,'t')} style={{ width: '100%', height: '36px' }}> 
                  {/* {this.state.CategoryAction.MenuAddonGroupId === undefined ? */}
                  <option key={0} value="0" selected={this.state.CategoryAction.Id === undefined}>{Labels.No_Toppings}</option>
                  <option key={-1} value="-1" selected={this.state.CategoryAction.Id !== undefined}>{Labels.DonT_Change}</option>
                  {this.state.ToppingGroup.map((topping) =>  <option key={topping.Id} value={topping.Id}>{Utilities.SpecialCharacterDecode(topping.Name)}</option> )}
                 </select>

              </FormGroup>

              <FormGroup className="modal-form-group">
                <Label htmlFor="categoryExtras" className="control-label">{Labels.Select_Extras}</Label>

                <select className="select2 form-control custom-select"  name="categoryExtras" onChange={(e) => this.handleSelectOptions(e,'e')} style={{ width: '100%', height: '36px' }}> 
                <option key={0} value="0" selected={this.state.CategoryAction.Id === undefined }>{Labels.No_Extras}</option>
                <option key={-1} value="-1" selected={this.state.CategoryAction.Id !== undefined}>{Labels.DonT_Change}</option>
                {this.state.ExtrasGroup.map((extra) => <option key={extra.Id} value={extra.Id}>{ Utilities.SpecialCharacterDecode(extra.Name)}</option> )}
                 </select>

              </FormGroup>
              </>
            }

              <FormGroup className="modal-form-group" style={{display:'none'}}>
                <Label htmlFor="CategoryFoodType" className="control-label">{Labels.Select_Food_Type}</Label>

                
                <select className="select2 form-control custom-select"  name="CategoryFoodType" onChange={(e) => this.handleSelectOptions(e,'f')} style={{ width: '100%', height: '36px' }}> 
                {Object.keys(this.state.CategoryAction).length !== 0 && <option key={-1} value="-1">{Labels.DonT_Change}</option> }
                {this.state.FoodTypes.map((tags) => <option key={tags.Id} value={tags.Id}>{tags.Name}</option>)}
               </select>

              </FormGroup>
              { this.state.userObject.Enterprise.EnterpriseTypeId == 6 || this.state.userObject.Enterprise.EnterpriseTypeId == 3 &&
        <div  className="menu-ch">      
        
         <FormGroup className="modal-form-group items-check-boxes" style={{ display: 'flex'}}>
             <AvField type="Checkbox" className="form-checkbox"  checked={this.state.IsDeal} onChange={(e) => this.hadleCategoryChecks(e,'D')} name="chkIsDeal">
                </AvField>
                <Label htmlFor="chkIsDeal" className="control-label" style={{cursor:'pointer'}}>{Labels.Deal}</Label>
             
            </FormGroup>
{ this.state.userObject.Enterprise.EnterpriseTypeId == 6 &&
             <FormGroup className="modal-form-group items-check-boxes"  style={{ display: 'flex'}}>
             <AvField type="Checkbox" className="form-checkbox"  checked={this.state.IsBuffet} onChange={(e) => this.hadleCategoryChecks(e,'B')} name="chkIsBuffet">
                </AvField>
                <Label htmlFor="chkIsBuffet" className="control-label" style={{cursor:'pointer'}}>{Labels.Buffet}</Label>
             
            </FormGroup>
  }
     </div>
  }

  <div  className="menu-ch" style={{  display:"none"}}>   
              <FormGroup className="modal-form-group items-check-boxes" style={{ display: 'flex'}}>
              {/* <AvField type="Checkbox" className="form-checkbox"  checked={Object.keys(this.state.CategoryAction).length === 0 ? false : this.state.CategoryAction.HideFromPlatform}  onChange={(e) => this.hadleCategoryChecks(e,'P')} name="chkHideFromPlatform"> */}
              <AvField type="Checkbox" className="form-checkbox"  checked={this.state.HideFromPlatform}  onChange={(e) => this.hadleCategoryChecks(e,'P')} name="chkHideFromPlatform">
                </AvField>
                <Label htmlFor="chkHideFromPlatform" className="control-label" style={{cursor:'pointer'}}>Hide from Superbutler platform</Label>
              
              </FormGroup>

             <FormGroup className="modal-form-group items-check-boxes"  style={{ display: 'flex'}}>
             <AvField type="Checkbox" className="form-checkbox"  checked={this.state.HideFromWhiteLabel} onChange={(e) => this.hadleCategoryChecks(e,'W')} name="chkHideFromPlatform1">
                </AvField>
                <Label htmlFor="chkHideFromPlatform1" className="control-label" style={{cursor:'pointer'}}>Hide from White Label</Label>
             
            </FormGroup></div>

            </div>
            <FormGroup className="modal-footer">
              <Button color="secondary" onClick={() => this.CategoryModelShowHide({})}>{Labels.Cancel}</Button>
              <Button color="primary" >
              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                             : <span className="comment-text">{Labels.Save}</span>}
            
            </Button> 
            </FormGroup>
          </AvForm>
        </ModalBody>
      </Modal>



    )
  }


  GenerateProductSortModel() {

    if (!this.state.ProductSort) {
      return ('');
    }

    return (

      <Modal isOpen={this.state.ProductSort} toggle={this.SortProductModal} className={this.props.className}>
        <ModalHeader>{Labels.Sort_Items}</ModalHeader>
        <ModalBody>
          <div className="m-b-15">Use mouse or finger to drag items and sort their positions.</div>
          <div className="sortable-wrap sortable-item sortable-new-wrap">

            <SortableContainer
              items={this.state.SortProducts}
              onSortEnd={this.onProductSortEnd}
              hideSortableGhost={true} >

            </SortableContainer>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => this.SortProductModal()}>{Labels.Cancel}</Button>
          <Button color="primary" onClick={() => this.UpdateProductSort()}>
          {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                             : <span className="comment-text">{Labels.Save}</span>}
            
            </Button> 
        </ModalFooter>
      </Modal>

    )

  }


  //#endregion


  componentDidMount() {

    window.addEventListener('load', () => {
      this.setState({
        isMobile: window.innerWidth < 800
      });
    }, false);
    if (window.innerWidth < 800) {
      this.setState({
        isMobile: true
      })
      // this.state.isMobile = true;
    }
    if (window.innerWidth > 800) {
      this.setState({
        isMobile: false
      })
      //this.state.isMobile = false;
    }

    this.GetDays();
    this.GetTags();
    this.GetEnterpriseWorkingHours();
    this.GetCategories();
    this.GetAddonGroupExtras();
    this.GetAddonGroupTopping();
    this.GetOrderRouting();
    // this.GetGalleryPhotos();


    window.addEventListener('scroll', () => {
      const istop = window.scrollY < 80;

      if (istop !== true && !this.state.scrolled) {
        this.setState({ scrolled: true })
      }
      else if(istop == true && this.state.scrolled) {
        this.setState({ scrolled: false })
      }

    });

  }

  CancelCategorySearch(){
    
    this.setState({ 
      FiltersMenuCategory: this.state.Categories ,
      SearchCategoryText: "",
      IsCategorySearching: false
    
    });

  }

  CancelProductSearch(){
    
    this.setState({ 
      FilterProducts: this.state.Products ,
      SearchProductText: "",
      IsProductSearching: false
    
    });

  }

  onTabChange = (activeTab) => 
  {
    this.setState({ActiveTab: -1})
    setTimeout(() => {
      this.setState({ActiveTab: activeTab});
    }, 100);
    
  }
  shouldComponentUpdate() {
    return true;
  }


  // checkUrlValidation = () => {
  
  //   if(this.state.videoUrl != ""){
  //     const videoRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|embed)\/|watch\?(?:\S*?&?v=)?)([\w-]{11}))|(?:youtu\.be\/([\w-]{11}))/;
  
  //     var checkValidation = videoRegex.test(this.state.videoUrl);
  
  //     if(!checkValidation){
  //       this.setState({ videoUrlError: true })
  //       return
  //     }
  //     this.setState({ videoUrlError: false })
  //     this.SetYouTubeEmbedUrl(this.state.videoUrl)
  //     return
  //  } 
  //  this.setState({ videoUrlError: false })
  // }

//   SetYouTubeEmbedUrl(url) {
//     const youtubeIframeUrlPattern = "https://www.youtube.com/embed/";

//     if (url.indexOf("watch?v=") != -1) {
//         url = url.replace("watch?v=", "")
//     }
//     try {
//         var urlArray = url.split("/");
//         var videoId = urlArray[urlArray.length - 1].split("?")[0];
//         var output = youtubeIframeUrlPattern + videoId;
//         this.setState({ previewUrl: output })
//     }
//     catch (e) {
//         console.log("error in formatting url", e.message);
//         return url;
//     }
    
    
// }
  //#region Page view html 

  render() {
    // var shown = { display: this.state.shown ? "block" : "none" };

    //var hidden = { display: this.state.shown ? "none" : "block" };
    var height_h = window.innerHeight
    var width_w = window.innerWidth
    const ModalDiv = this.state.isMobile;
    const classModalFade = this.state.isMobile ? 'modal fade' : '';
    const classDialog = this.state.isMobile ? 'modal-dialog modal-lg' : '';
    const classModalContent = this.state.isMobile ? 'modal-content' : '';
    const classModalHeader = this.state.isMobile ? 'modal-header' : 'no-display';
    const classModalBody = this.state.isMobile ? 'modal-body' : '';
    const classModalFooter = this.state.isMobile ? 'modal-footer' : 'no-display';

    //const { FilterProducts } = this.state;
    //const {ToppingGroup} = this.state;
    //const {ExtrasGroup} = this.state;

 
    return (
<div >
  <div className='d-flex align-items-center justify-content-between'>
        <div className='row'><h3 class="card-title card-new-title">{Labels.Build_Menu}</h3>
         
          
        </div>
        {
          this.state.userObject.Enterprise.ExternalReference !="" &&
          <button onClick={()=>this.enterprisePosMenu()} className='btn btn-primary ml-auto' color="primary" style={{marginLeft:10, minHeight:"36px", minWidth:"130px" }}>
                { this.state.posLoader ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span> 
                : <span className="hide-in-responsive">Fetch Pos Menu</span>}
            </button>
        }
        {
            this.state.isSystemAdmin &&
            <button className='btn btn-primary mr-3' color="primary" style={{ marginLeft: 10, minWidth:"167px" }}>
              {this.state.knowledgebaseLoader ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                : <span onClick={() => this.getAIKnowledgebase()} className="comment-text d-flex align-items-center" style={{gap:"5px"}}> 
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version={1.0}
                      width="1000.000000pt"
                      height="1000.000000pt"
                      viewBox="0 0 1000.000000 1000.000000"
                      preserveAspectRatio="xMidYMid meet"
                      style={{ height: 25, width: 25 }}
                    >
                      <g
                        transform="translate(0.000000,1000.000000) scale(0.100000,-0.100000)"
                        fill="#ffffff"
                        stroke="none"
                      >
                        <path d="M7020 9253 c-154 -673 -534 -1169 -1115 -1453 -138 -67 -270 -118 -413 -161 -41 -12 -70 -25 -65 -29 4 -4 55 -22 113 -40 448 -139 804 -372 1062 -695 185 -232 347 -581 419 -902 13 -56 25 -101 27 -98 3 2 22 71 42 153 110 431 295 761 581 1037 262 252 544 405 998 541 22 7 11 12 -97 44 -474 141 -882 419 -1134 775 -162 228 -300 542 -364 830 -10 44 -21 84 -24 88 -4 5 -17 -36 -30 -90z" />
                        <path d="M4211 8070 c-188 -1092 -774 -2034 -1606 -2585 -222 -147 -422 -250 -683 -354 -125 -50 -380 -132 -504 -162 -54 -13 -98 -27 -98 -30 0 -3 39 -16 88 -29 349 -92 760 -263 1062 -443 407 -243 775 -581 1043 -960 224 -316 411 -694 546 -1106 53 -159 129 -449 157 -596 9 -49 20 -96 24 -103 3 -7 21 57 39 143 301 1447 1088 2432 2326 2910 128 49 354 124 474 156 51 13 78 25 70 29 -8 4 -50 17 -94 29 -44 12 -143 42 -220 68 -1319 432 -2149 1356 -2509 2793 -24 96 -52 216 -61 265 -10 50 -21 93 -25 98 -3 4 -17 -51 -29 -123z" />
                        <path d="M7031 4072 c-77 -358 -243 -720 -441 -962 -246 -301 -588 -528 -998 -663 -89 -30 -165 -56 -167 -59 -3 -3 48 -22 112 -42 403 -129 689 -299 944 -563 257 -265 434 -602 535 -1015 15 -65 31 -115 35 -110 4 4 14 43 24 87 23 110 104 351 154 461 259 575 711 957 1359 1150 51 15 89 31 85 34 -5 4 -44 17 -88 30 -259 74 -550 219 -760 378 -88 67 -258 235 -330 327 -186 237 -321 519 -405 842 -17 63 -30 123 -30 133 0 43 -18 25 -29 -28z" />
                      </g>
                    </svg>

                Knowledge base</span>}

            </button> 
          }
          </div>
      <div className={this.state.scrolled ? 'menu-page-wrap affix' : 'menu-page-wrap affix-top'} >
        <div className="menu-left-penal" >
          <div className="cat-heading-wrap">
            <h2 className="common-heading">{Labels.Categories}</h2>
            <span className="add-cat-btn" onClick={() => this.CategoryModelShowHide({})}>
              <i className="fa fa-plus" aria-hidden="true"></i> <span className="hide-in-responsive">{Labels.New}</span>
            </span>

          </div>
          <div className="select-cat-btn-res" onClick={() => this.leftpenal()}>
            <span>
              {this.state.SelectedCategoryName}
            </span>
            <span className="change-cat-modal">
              {Labels.Change}
            
            </span>
          </div>
          {ModalDiv ? (
            <Modal isOpen={this.state.left} className={this.props.className}>
              <ModalHeader ><i className="fa fa-chevron-left cat-back-btn" onClick={() => this.leftpenal()}> </i> {Labels.Select_Category}</ModalHeader>
              <ModalBody className="menu-page-wrap">
                <div className=" menu-left-penal ">
                  <div className="categorie-check-box-wrap">
                    <div>
                      <input type="checkbox" className="form-checkbox" id="Active" checked={this.state.activeCategoryCheck ? "checked" : ""} onChange={() => this.handleActiveCategoryCheck()} />
                      <label className="settingsLabel" htmlFor="Active">{Labels.Active}</label>
                    </div>
                    <div>
                      <input type="checkbox" className="form-checkbox" id="Inactive" checked={this.state.inActiveCategoryCheck ? "checked" : ""} onChange={() => this.handleInActiveCategoryCheck()} />
                      <label className="settingsLabel" htmlFor="Inactive">{Labels.Inactive}</label>
                    </div>
                    <div className="menu-sort-link" onClick={() => this.SortModal()}>
                      <i className=" fa fa-sort-amount-asc" aria-hidden="true"></i>{Labels.Sort_Category}</div>
                  </div>
                  <div className="m-b-20 m-t-20 search-item-wrap"  style={{ position: 'relative' }}>
                    <input type="text" className="form-control common-serch-field"   placeholder="Search Categories" value={this.state.SearchCategoryText} onChange={(e) => this.SearchCategory(e.target.value)} />
                    <i className="fa fa-search" aria-hidden="true" ></i>
                  { this.state.IsCategorySearching ?  <span className="cross-add-search"  onClick={() => this.CancelCategorySearch()} >
                    	<i className="fa fa-times" aria-hidden="true"></i>
                  	</span> : ""}
                  </div>

                  {this.LoadCategories(this.state.FiltersMenuCategory)}

                </div>
              </ModalBody>

            </Modal>
          ) : (
              <div id="leftcategory" className={classModalFade} isopen={this.state.left.toString()} >
                <div className={classDialog}>
                  <div className={classModalContent}>
                    <div className={classModalHeader}>
                      <h4 className="modal-title">{Labels.Select_Category}</h4>
                      <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                    </div>
                    <div className={classModalBody}>
                      <div className="categorie-check-box-wrap">
                        <div>
                          <input type="checkbox" className="form-checkbox" id="chkActiveCategory" checked={this.state.activeCategoryCheck ? "checked" : ""} onChange={() => this.handleActiveCategoryCheck()} />
                          <label className="settingsLabel" htmlFor="chkActiveCategory">{Labels.Active}</label>
                        </div>
                        <div>
                          <input type="checkbox" className="form-checkbox" id="chkInActiveCategory" checked={this.state.inActiveCategoryCheck ? "checked" : ""} onChange={() => this.handleInActiveCategoryCheck()} />
                          <label className="settingsLabel" htmlFor="chkInActiveCategory">{Labels.Inactive}</label>
                        </div>
                        <div className="menu-sort-link" onClick={() => this.SortModal()}>
                          <i className=" fa fa-sort-amount-asc" aria-hidden="true"></i>{Labels.Sort_Items}</div>
                      </div>
                      <div className="m-b-20 m-t-20 search-item-wrap" style={{ position: 'relative' }}>
                        <input type="text" className="form-control common-serch-field" placeholder="Search Categories" value={this.state.SearchCategoryText} onChange={(e) => this.SearchCategory(e.target.value)} />
                        <i className="fa fa-search" aria-hidden="true" ></i>
                      { this.state.IsCategorySearching ?  <span className="cross-add-search"  onClick={() => this.CancelCategorySearch()} >
     	                  <i className="fa fa-times" aria-hidden="true" ></i>
                      </span> : ""}
                      </div>

                      {this.LoadCategories(this.state.FiltersMenuCategory)}

                    </div>
                    <div className={classModalFooter}>
                      <button type="button" className="btn btn-default waves-effect" data-dismiss="modal">{Labels.Cancel}</button>
                      <button type="button" className="btn btn-success waves-effect" >{Labels.Save}</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>

        <div className="menu-right-penal">
          { this.state.FiltersMenuCategory.length == 0  ? this.RenderRightEmptyProductPanel()  :
        <div>
 
       
          <div className="menu-category-image-wraper">
            <div className="bg-image" style={{ backgroundImage: 'url(' + Utilities.generatePhotoLargeURL(this.state.SelectedCategory.PhotoName, true, false) + ')' }}>
            </div>
            <h1 className="menu-heading-desc-wrapper">
              {Utilities.SpecialCharacterDecode(this.state.SelectedCategory.Name)}
            </h1>
            <div className="web-ponsive-cate">
            <span className="menu-left-list-buttons">
                          <span className="list-item-d" onClick={(e) => this.categoryImageModal(this.state.SelectedCategory.Name, 0, true)}>
                            <i className="fa fa-picture-o" aria-hidden="true"></i>
                            <span className="common-cat-icon-span">{Labels.Change_Photo}</span>
                          </span>
                          <span className="list-item-d" onClick={() => this.CategoryModelShowHide(this.state.SelectedCategory)}>
                            <i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Edit"></i>  <span className="common-cat-icon-span">{Labels.Edit}</span>
                          </span>
                          <span className="sa-warning list-item-d" onClick={() => this.DeleteCategoryConfirmation(this.state.SelectedCategory.Id, this.state.SelectedCategory.Name)} >
                            <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="Remove" data-placement="top" data-original-title="Remove"></i>
                            <span className="common-cat-icon-span">{Labels.Delete}</span>
                          </span>

                      {!Utilities.stringIsEmpty(this.state.SelectedCategory.PhotoName)  ?
                     
                         <span className="sa-warning list-item-d" onClick={() => this.DeleteCategoryPhotoConfirmation(this.state.SelectedCategory)} >
                            <i className="fa fa-eraser" aria-hidden="true" data-toggle="tooltip" title="Remove Image" data-placement="top" data-original-title="Remove"></i>
                            <span className="common-cat-icon-span">{Labels.Image_Remove}</span>
                          </span>
                          : "" }

                          <span className="sa-suspended list-item-d" onClick={() => this.ActivateDeactivateConfirmation(this.state.SelectedCategory.IsPublished, this.state.SelectedCategory.Name)} title={this.state.SelectedCategory.IsPublished === true ? 'Inactive' : 'Activate'}>
                            <i className="fa fa-ban" aria-hidden="true" data-toggle="tooltip" data-placement="top" data-original-title="Disable"></i>
                            <span className="common-cat-icon-span">{this.state.SelectedCategory.IsPublished === true ? 'Inactive' : 'Activate'}</span>
                          </span>
                        </span>
            </div>
            <div className="res-ponsive-cate">

              <div>
                <span className="more-button-toggle" onClick={(e) => this.ShowMenu(e)}><i style={{ fontSize: '30px' }} className="fa fa-ellipsis-v"></i><span style={{ cursor: 'pointer' }}>{Labels.Options}</span></span>
                {
                  this.state.ShowMenu
                    ? (
                      <div
                        className="menu"
                        ref={(element) => {
                          this.dropdownMenu = element;
                        }}
                      >
                        <span className="menu-left-list-buttons">
                          <span className="list-item-d" onClick={(e) => this.categoryImageModal(this.state.SelectedCategory.Name, 0, true)}>
                            <i className="fa fa-picture-o" aria-hidden="true"></i>
                            <span className="common-cat-icon-span">Change Photo</span>
                          </span>
                          <span className="list-item-d" onClick={() => this.CategoryModelShowHide(this.state.SelectedCategory)}>
                            <i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Edit"></i>  <span className="common-cat-icon-span">{Labels.Edit}</span>
                          </span>
                          <span className="sa-warning list-item-d" onClick={() => this.DeleteCategoryConfirmation(this.state.SelectedCategory.Id, this.state.SelectedCategory.Name)} >
                            <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="Remove" data-placement="top" data-original-title="Remove"></i>
                            <span className="common-cat-icon-span">{Labels.Delete}</span>
                          </span>

                          {!Utilities.stringIsEmpty(this.state.SelectedCategory.PhotoName) ?
                     
                     <span className="sa-warning list-item-d" onClick={() => this.DeleteCategoryPhotoConfirmation(this.state.SelectedCategory.Id, this.state.SelectedCategory.Name)} >
                     <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="Remove Image" data-placement="top" data-original-title="Remove"></i>
                     <span className="common-cat-icon-span">{Labels.Remove_Image}</span>
                   </span>
                      : "" }

                          <span className="sa-suspended list-item-d" onClick={() => this.ActivateDeactivateConfirmation(this.state.SelectedCategory.IsPublished, this.state.SelectedCategory.Name)} title={this.state.SelectedCategory.IsPublished === true ? 'Inactive' : 'Activate'}>
                            <i className="fa fa-ban" aria-hidden="true" data-toggle="tooltip" data-placement="top" data-original-title="Disable"></i>
                            <span className="common-cat-icon-span">{this.state.SelectedCategory.IsPublished === true ? 'Inactive' : 'Activate'}</span>
                          </span>
                        </span>
                      </div>
                    )
                    : (
                      null
                    )
                }
              </div>


            </div>

          </div>

          <div className="add-item-btn-wrap">
                <div className="items-check-boxes-wrap">
                  <div className="items-heading">
                   {Labels.Items}
               </div>

                </div>

            
                <span className="add-cat-btn" onClick={() => this.ProductModalShowHide({})}>
                  <i className="fa fa-plus" aria-hidden="true"></i>
                  <span className="hide-in-responsive">{Labels.Add_Item}</span>
                </span>

              </div>
              <div className="shoply-btn-wrap">
                <div className="btn-inner-wrap">
                  <div className="items-check-boxes">
                    <div className="categorie-check-box-wrap">
                      <div>
                        <input type="checkbox" className="form-checkbox" id="chkActiveProduct" checked={this.state.activeProductCheck ? "checked" : ""} onChange={() => this.handleActiveProductCheck()} />
                        <label className="settingsLabel" htmlFor="chkActiveProduct">{Labels.Active}</label>
                      </div>
                      <div>
                        <input type="checkbox" id="chkInactiveProduct" className="form-checkbox" checked={this.state.inActiveProductCheck ? "checked" : ""} onChange={() => this.handleInActiveProductCheck()} />
                        <label className="settingsLabel"  htmlFor="chkInactiveProduct">{Labels.Inactive}</label>
                      </div>
                    </div>
                  </div>
                  <div className="menu-sort-link m-sort-item" onClick={() => this.SortProductModal()}>
                    <i className=" fa fa-sort-amount-asc" aria-hidden="true"></i>{Labels.Sort_Products}</div>

              
                </div>
                <div className="search-item-wrap">
                  <input type="text" className="form-control common-serch-field" placeholder="Search items" value={this.state.SearchProductText} onChange={this.SearchProduct} />
                  <i className="fa fa-search" aria-hidden="true" ></i>
                  {this.state.IsProductSearching ? <span className="cross-add-search" onClick={() => this.CancelProductSearch()}>
                    <i className="fa fa-times" aria-hidden="true" ></i>
                  </span> : ""}
                </div>
              </div>
              <div className='d-flex justify-content-center'>
          <p className="separator">
            <span></span>
          </p>
          </div>
          
           {this.RenderRightProductPanel(this.state.FilterProducts)}
              </div>    }      
        </div>
     

        <Modal className='modal-media-main' isOpen={this.state.itemImage} toggle={(e) => this.itemImageModal()} size="lg" style={{maxWidth: '80%'}}>
          <ModalHeader className="text-change-common-res" toggle={(e) => this.itemImageModal()}><span className="bold">{Utilities.SpecialCharacterDecode(this.state.SelectedMenuMetaName)}</span> Media</ModalHeader>
          <ModalBody className="scroll-media modal-media-wrap">
           
          {Number(this.state.ActiveTab) != -1 &&
           
            <Tabs forceRenderTabPanel defaultIndex={Number(this.state.ActiveTab)}>
              <TabList>
                <Tab key={0} onClick={(e) => this.SetActiveTab(0)}><span className="hidden-sm-up"><i className="fa fa-picture-o" aria-hidden="true"></i></span><span className="hidden-xs-down">Product Images</span></Tab>
                <Tab key={1} onClick={(e) => this.SetActiveTab(1)}><span className="hidden-sm-up"><i className="fa fa-picture-o" aria-hidden="true"></i></span><span className="hidden-xs-down">{Labels.Choose_From_Media_Library}</span></Tab>
                <Tab key={2} onClick={(e) => this.SetActiveTab(2)}><span className="hidden-sm-up"><i className="fa fa-play" aria-hidden="true"></i></span><span className="hidden-xs-down">{Labels.Product_Video}</span></Tab>
              </TabList>

             <TabPanel>
              {!this.state.loadingItemImage && this.state.ActiveTab == 0?
                // <ImageViewer imageList={this.state.itemMetaPhotos} UpdateImageSorting={this.UpdateImageSorting} onTabChange={this.onTabChange}/>
                <Previews existingPhotos={this.state.itemMetaPhotos} UpdateImageSorting={this.UpdateImageSorting} onTabChange={this.onTabChange}/>
                :
                <div className="loader-menu-inner">
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
      <div className="loading-label">Loading.....</div>
    </div>
              }
             </TabPanel>
              <TabPanel>
              {this.state.itemImage && this.state.ActiveTab == 1 &&
              <S3Browser setSelectedMedia={this.SetSelectedMedia} ignoredFilesBySize={this.ValidateFiles} shouldRefresh={this.state.shouldRefresh} RefreshS3Files={this.RefreshS3Files} currentFolder={this.state.currentFolder}/>
              }
              </TabPanel>
              <TabPanel>
                
                <AvForm>
                  <div className='mt-4 w-100' style={{maxWidth:500}}>
                    <label className='control-label'> Add Youtube video URL</label>
                    <AvField class="form-control"  name="Video URL" 
                      value={this.state.videoUrl}
                      onChange={(e)=>this.setState({
                        videoUrl: e.target.value,
                        videoUrlError: false
                      }
                      // ,()=> this.checkUrlValidation()
                      )} 
                    />

                        {
                          this.state.videoUrl != "" && !this.state.videoUrlError &&
                          <ReactPlayer
                            url={this.state.videoUrl}
                            onError={(e) => this.setState({ videoUrlError: true })}
                            width="100%"
                            height="315px"
                            className='mt-3'
                          />
                        }
                    {/* {
                      this.state.videoUrl != "" && !this.state.videoUrlError &&
                        <iframe className='mt-3'
                          title="YouTube Video"
                          width="100%"
                          height="315"
                          src={this.state.previewUrl}
                          frameBorder="0"
                          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                    } */}

                    {
                      this.state.videoUrlError &&
                      <span className='text-danger'>Invalid URL</span>
                    }
                {/* </AvField> */}
                </div>
                </AvForm>
              </TabPanel>
            </Tabs>
          }
          </ModalBody>
          <ModalFooter className='justify-content-between flex-nowrap'>
              {
                this.state.ActiveTab != 2 && this.state.videoUrlError &&
                <span className='text-danger'>Invalid URL</span>
              }



{this.state.ignoredFiles.length > 0 &&

<div className='display-n-services ml-3 w-100 file-s-err'>

<div className='alert alert-danger p-2 d-inline-flex align-items-center mb-0'>
<MdErrorOutline className='mr-2 font-20 d-none d-md-flex' />
 <span className='text-left'>One or more file is either invalid or larger than 1 mb file size limit. <span style={{textDecoration:"underline"}} className='text-primary cursor-pointer' onClick={() => this.fileErrorModal()}>See invalid files</span></span>



</div>

</div>

  }
            <div className='d-flex align-items-center justify-content-end w-100 flex-1'>
            <Button color="secondary" onClick={(e) => this.itemImageModal()}>Cancel</Button>
            {/* {(this.state.ActiveTab == 1 && this.state.selectedMedia.length > 0) ?  */}
           
            {(this.state.ActiveTab == 1 ) &&
            <Button color="primary" id="btnNext" onClick={(e) => this.UpdateItemMetaMediaJson()} style={{display: "none",marginLeft:10}}>
            {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                             : <span className="comment-text">Next</span>}
            
            </Button> }
            </div>
            {(this.state.ActiveTab === 0 || this.state.ActiveTab === 2) ? 
            
            <Button color="primary" onClick={(e) => this.UpdateItemMetaMediaJson()}>
            {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                             : <span className="comment-text">Done</span>}
            
            </Button> : ""}

          </ModalFooter>
        </Modal>
        
        <Modal isOpen={this.state.fileError} toggle={() => this.fileErrorModal()} className={this.props.className}>
          <ModalHeader toggle={() => this.ReviewCarouselModal()} >Invalid files</ModalHeader>
          <ModalBody >
              {

                this.state.ignoredFiles.map((fileName, index) => {

                  return (
                    <div className='d-flex flex-column mb-3'>
                    <span className='text-danger'>
                    <span className='mr-2'> {index + 1} ) </span>
                      {fileName}
                    </span>
                    </div>
                  )

                })

              }
          </ModalBody>
          <FormGroup className="modal-footer" >
            <div className='mr-auto'> <label id="name" class="control-label mt-2 text-danger"></label>
            </div>
            <div>
              <Button className='mr-2 text-dark' color="secondary" onClick={() => this.fileErrorModal()}>Close</Button>
              {/* <Button color="primary" >
              <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>  
                 <span className="comment-text">Save</span> 
              </Button> */}
            </div>
          </FormGroup>
        </Modal>

        <Modal isOpen={this.state.categoryImage} toggle={(e) => this.categoryImageModal()} size="lg">
          <ModalHeader className="text-change-common-res" toggle={(e) => this.categoryImageModal()}>Change <span className="bold">{this.state.SelectedMenuMetaName}</span> photo</ModalHeader>
          <ModalBody className="scroll-media">
            <Tabs>
              <TabList>
                <Tab key={0} onClick={(e) => this.SetActiveTab(0)}><span className="hidden-sm-up"><i className="fa fa-upload" aria-hidden="true"></i></span><span className="hidden-xs-down">{Labels.Upload_photo}</span></Tab>
                <Tab key={1} onClick={(e) => this.SetActiveTab(1)}><span className="hidden-sm-up"><i className="fa fa-picture-o" aria-hidden="true"></i></span><span className="hidden-xs-down">{Labels.Choose_From_Media_Library}</span></Tab>
              </TabList>

              <TabPanel>
                <div className="popup-web-body-wrap">
                  <div className="file-upload-btn-wrap position-relative">
                    <div className="fileUpload">
                      <span>{Labels.Choose_File}</span>
                      <input type="file" accept="image/*" id="logoUpload" className="upload"
                        onChange={(e) => this.onFileChange(e)} />
                    </div>
                  </div>

                  <div id="upload-image" className="upload-image-wrap" >
                    <div className="upload-dragdrop-wrap" id="dragImage">
                      <div className="dragdrop-icon-text-wrap">{Labels.PREVIEW_ONLY}</div>
                      <div className="dragdrop-icon-wrap">
                        <i className="fa fa-file-image-o" aria-hidden="true"></i>
                      </div>
                    </div>

                    <div className="crop-image-main-wrap ">

                      {this.state.Image && <Fragment>
                        <div className="crop-container">
                          <Cropper
                            image={this.state.Image}
                            crop={this.state.Crop}
                            zoom={this.state.Zoom}
                            aspect={this.state.Aspect}
                            onCropChange={this.onCropChange}
                            onCropComplete={this.onCropComplete}
                            onZoomChange={(e) => this.onZoomChange(e)}
                          />
                        </div>
                        <div className="controls">
                          <Slider
                            value={this.state.Zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e, zoom) => this.onZoomChange(zoom)}
                          />
                        </div>
                      </Fragment>
                      }
                    </div>

                  </div>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="modal-media-library-wrap">
                  <div className="select-media-name">
                    <span className="control-label">{Labels.Select_Group}</span>
                    <span>
                      <select className="form-control custom-select" value={this.state.SelectedPhotoGroup} onChange={(e) => this.ChangeGroupHandler(e.target.value)} data-placeholder="Choose a Category" tabindex="1" >
                        {this.LoadGalleryGroup(this.state.GalleryPhotos)}
                      </select>
                    </span>
                  </div>
                  <div className="search-photo-wrap">
                    <span className="control-label">{Labels.Search_Photo}
                                    </span>
                    <span>
                      <input type="text"  placeholder="Photo name or tag"  className="form-control" onChange={this.SearchPhoto} />
                    </span>
                  </div>
                  <div className="photo-library-wrap" style={{maxHeight:height_h - 360}}>

                    { this.state.ShowGalleryLoader ? 
                       
                      <div className="loader-menu-inner">
                      <Loader type="Oval" color="#ed0000" height={50} width={50} />
                      <div className="loading-label">Loading.....</div>
                    </div>
                    :
                     (this.state.FilterGalleryPhotos.length > 0 ? this.LoadGalleryPhotos(this.state.FilterGalleryPhotos) : <div><div className="not-found-menu m-b-20">No results matched.</div></div>)
                      }
                  </div>
                </div>
              </TabPanel>
            </Tabs>
          </ModalBody>
          <ModalFooter>

            <Button color="secondary" onClick={(e) => this.categoryImageModal()}>Cancel</Button>
            {this.state.Image !== null || (this.state.ActiveTab === 1 && this.state.SeletedItemPhoto) ? 
            
            <Button color="primary" onClick={(e) => this.UpdateItemMetaPhoto()}>
            {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                             : <span className="comment-text">Add</span>}
            
            </Button> : ""}
          </ModalFooter>
        </Modal>






        <Modal size="md" isOpen={this.state.viewImageModal } backdrop={'static'} toggle={(e)=>this.toggleViewImageModal()}  className={this.props.className}>
        <ModalHeader>{this.state.SelectedMenuMetaName}</ModalHeader>
 <ModalBody>
        {this.state.SelectedMetaItemPhotoName === "" ?  '' :
              <div className="view-image-wrap">
                     <img src={Utilities.generatePhotoLargeURL(this.state.SelectedMetaItemPhotoName, true, false).replace("images", "cropped-images")} style={{width:'100%'}}/>    
             </div>

              
            }

        </ModalBody>
        <ModalFooter style={{padding:'10px 15px' }}>
        <Button color="primary" onClick={(e) => this.itemImageModal(this.state.SelectedMenuMetaName, this.state.SelectedItemMetaId, false, this.state.SelectedMetaItemPhotoName)}>
           Change image
          </Button> 
  <Button color="secondary" onClick={(e) => this.toggleViewImageModal()}>{Labels.Cancel}</Button>

</ModalFooter>
 </Modal>

 <Modal size="lg" isOpen={this.state.viewS3ImageModal }  toggle={(e)=>this.toggleViewS3ImageModal()}  style={{maxWidth: '80%'}}  className="edit-image-uploader-parent">
 <ModalBody className='edit-image-uploader-wrap'>
          <div className='position-relative'>
          <ImageUploader Image={this.state.imageToOpen} ShowCloseButton={this.showClosebtn} Refresh={this.RefreshS3Files}/>
          </div>
          {this.state.btnShow &&
          <div className='cstm-text-abs'>
          <Button className='cstm-cls-btn' color="secondary" onClick={(e) => this.toggleViewS3ImageModal()}>{Labels.Close}</Button>         
            <span className='abs-txt'>Compare</span>
            <span className='abs-txt' style={{left:"50%"}}>Zoom out</span>
            <span className='abs-txt' style={{left:"54.5%"}}>Zoom in</span>
            <span className='abs-txt' style={{left:"auto", right:"115px", position:"absolute", top:"55px"}}>Reset</span>
            <span className='abs-txt' style={{left:"auto", right:"77px", position:"absolute", top:"55px"}}>Undo</span>
            <span className='abs-txt' style={{left:"auto", right:"40px", position:"absolute", top:"55px"}}>Redo</span>
          </div>
          }
        </ModalBody>
       
 </Modal>

        {this.GenerateSweetConfirmationWithCancel()}
        {this.GenerateSweetAlert()}
        {this.GenerateProductModal(this.state.selectedProductInAction)}
        {this.GenerateCategorySortModel()}
        {this.GenerateProductSortModel()}
        {this.GenerateProductOptionModel(this.state.ProductandOptionAction)}
        {this.GenerateCategoryModel()}

      </div>
      </div>
    )

  }
}
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
          return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
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
      bottomScrollableY - (height - nodeTop - nodeHeight + offset) :
      delta;

    startTime = Date.now();
    percentage = 0;

    if (this.timer) {
      clearInterval(this.timer);
    }

    function step() {
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
//#endregion

export default Menu;
