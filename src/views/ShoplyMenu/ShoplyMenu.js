import React, { Fragment } from 'react';
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader,Table, Alert } from 'reactstrap';
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
import * as ProductService from '../../service/Product';
import * as BrandService from '../../service/Brand';
import * as ProductOptionService from '../../service/ProductOption';
import * as AddonGroupService from '../../service/AddonGroup';
import * as EnterpriseSettingService from '../../service/EnterpriseSetting';
import * as GlobalConfigurationService from '../../service/GlobalConfiguration';
import * as MoreImagesService from '../../service/MoreImages';
import * as MoreFilesService from '../../service/MoreFiles';
import * as SaveHtmlService from '../../service/SaveHtml';
import * as TagService from '../../service/Tag';
import "react-tabs/style/react-tabs.css";
import 'sweetalert/dist/sweetalert.css';
import {SetMenuStatus} from '../../containers/DefaultLayout/DefaultHeader'
import Autocomplete from 'react-autocomplete';

import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

const FoodTypeSelectionValidation = (value, ctx) => {

  if (value === "0") {
    return "Please choose Catalogue.";
  }
  return true;
}


const SortableItem = sortableElement(({ value }) => <li className="sortableHelper">{value}</li>);

const SortableContainer = sortableContainer(({ items }) => {

  if (items === undefined) { return; }
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} style={{ zIndex: 100000 }} index={index} value={value.name} />
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

class ShoplyMenu extends React.Component {

  MyFileUploader = (multiple) => {

    // specify upload params and url for your files
    const getUploadParams = ({ meta }) => {
      return { url: 'https://httpbin.org/post' }
    }
  
    // called every time a file's `status` changes
    const handleChangeStatus = ({ meta, file }, status, files) => {
      if (status == 'done') {
        this.convertFileTobase64(files.map(f => f.file))
      }
      if(status == 'removed'){
        this.setState({
          disbaleSaveForFiles: true
        })
      }
    }
  
    return (
      <Dropzone
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        multiple={multiple}
        accept='.pdf, image/*'
      />
    )
  }

  convertFileTobase64 = (files) =>{
    this.state.multipleFileStream = []
    files.forEach((f) => {
      let selectedFile = f;
      let file = null;
      let fileName = "";
      let fileToLoad = selectedFile;
      fileName = fileToLoad.name;
      let fileReader = new FileReader();
      fileReader.onload = function (fileLoadedEvent) {
        file = fileLoadedEvent.target.result;
        fileToLoad.fileStream = file
      };
      fileReader.readAsDataURL(fileToLoad);
    })
    setTimeout(() => {
      this.state.multipleFileStream = files
      this.setState({
        disbaleSaveForFiles: false
      })
    }, 500);
  }

  MyUploader = (multiple) => {

    // specify upload params and url for your files
    const getUploadParams = ({ meta }) => {
      return { url: 'https://httpbin.org/post' }
    }

    // called every time a file's `status` changes
    const handleChangeStatus = ({ meta, file }, status ,files) => {
      if(status == 'done'){
       // console.log("handleChangeStatus =>", status, meta, file, files)
        this.convertImageTOBase64(files.map(f => f.meta))
      }
      if(status == 'removed'){
        this.setState({
          disbaleSaveForImages: true
        })
      }
    }

    return (
      <Dropzone
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        multiple={multiple}
        accept='image/*'
      />
    )
  }

  deleteImage = (imageData) =>{
    console.log(imageData)
  }

  saveMoreImages = async () => {
    try {
      let product = this.state.SelectedProduct;
      let enterprizeId = Utilities.GetEnterpriseIDFromSession() 
      let productOptionId =product.Id;
      let imageStreams = []
      if (this.state.multipleImageStreams.length == 0) {
        this.setState({
          multipleImageAlert: true
        })
        return
      }
      for (let index = 0; index < this.state.multipleImageStreams.length; index++) {
        imageStreams.push({
          FileName: this.state.multipleImageStreams[index].name,
          InputStream: this.state.multipleImageStreams[index].imageStream,
          ContentType: this.state.multipleImageStreams[index].type,
          ContentLength: this.state.multipleImageStreams[index].size,
        })

      }
      let response = await MoreImagesService.addMoreImages(enterprizeId, productOptionId, imageStreams)
      if (response != undefined && response.HasError ==false) {
        var imagesCheck = String(response.Dictionary.MoreImages).includes(',')
        Utilities.notify( imagesCheck == true ?'Images uploaded successfully' : 'Image Uploaded Successfully', "s");
        this.state.ItemFiltersFields.MoreImages = response.Dictionary.MoreImages
        this.setState({
          ItemFiltersFields: this.state.ItemFiltersFields,
          multipleImageStreams: [],
          showMultipleImageModal: false,
          disbaleSaveForImages: true
        })
      } else {
        this.toggleModal()
        Utilities.notify("Uploading failed.", "e");
      }
    } catch (error) {
      console.log(error.message)
      Utilities.notify("Uploading failed. " + error.message, "e");
      this.toggleModal()
    }
  }
  saveMoreFiles = async () => {
    try {
      let product = this.state.SelectedProduct;
      let enterprizeId = Utilities.GetEnterpriseIDFromSession() 
      let productOptionId =product.Id;
      let fileStreams = []
      if (this.state.multipleFileStream.length == 0) {
        this.setState({
          multipleFileAlert: true
        })
        return
      }
      for (let index = 0; index < this.state.multipleFileStream.length; index++) {
        fileStreams.push({
          FileName: this.state.multipleFileStream[index].name,
          InputStream: this.state.multipleFileStream[index].fileStream,
          ContentType: this.state.multipleFileStream[index].type,
          ContentLength: this.state.multipleFileStream[index].size,
        })

      }
      // console.log('ItemFiltersFields', this.state.ItemFiltersFields)
      let response = await ProductOptionService.AddMoreFiles(enterprizeId, productOptionId, fileStreams)
      // let response = await MoreFilesService.addMoreFiles(enterprizeId, productOptionId, fileStreams)
      if (response != undefined && response.HasError ==false) {
        var fileCheck = String(response.Dictionary.MoreFiles).includes(',')
        Utilities.notify( fileCheck == true ?'Files uploaded successfully' : 'File Uploaded Successfully', "s");
        this.state.ItemFiltersFields.Document = response.Dictionary.MoreFiles
        this.setState({
          ItemFiltersFields: this.state.ItemFiltersFields,
          multipleFileStream: [],
          showMultipleFilesModal: false,
          disbaleSaveForFiles: true
        })
      } else {
        this.toggleFileModal()
        Utilities.notify("Uploading failed.", "e");
      }
    } catch (error) {
      console.log(error.message)
      Utilities.notify("Uploading failed. " + error.message, "e");
      this.toggleFileModal()
    }
  }

  saveHtmlEditorText = async () => {
    try {
      let product = this.state.SelectedProduct;
      let enterprizeId = Utilities.GetEnterpriseIDFromSession() 
      let productOptionId =product.Id;
      let htmlValue = draftToHtml(convertToRaw(this.state.htmlEditorState.getCurrentContent()))
      let response = await SaveHtmlService.saveHtmlValue(enterprizeId, productOptionId, htmlValue)
      if (response != undefined && response != null) {
        this.setState({
          htmlEditorState: EditorState.createEmpty(),
          htmlEditor: false
        })
      }
      else {
        this.toggleHTMLEditorModal()
        Utilities.notify("Update failed.", "e");
      }
    } catch (error) {
      Utilities.notify("Update failed. " + error.message, "e");
      this.toggleHTMLEditorModal()
    }
  }

  convertImageTOBase64 = async (files, allFiles) => {
    this.state.multipleImageStreams = []
    for (let index = 0; index < files.length; index++) {
      var CroppedAreaPixels = {
        height: files[index].height,
        width: files[index].width,
        x: 0,
        y: 0
      }
      let croppedImage = ''
      croppedImage = await getCroppedImg(
        files[index].previewUrl,
        CroppedAreaPixels
      )
      files[index].imageStream = croppedImage


    }
    this.state.multipleImageStreams = files
    this.setState({
      disbaleSaveForImages: false
    })
    // console.log(this.state.multipleImageStreams)

  }

  moreImagesModal(product, productOptions) {
    this.state.allCurrentImages = []
    if (product.ItemFilters != "") {
      var parsedImagesValue = JSON.parse(product.ItemFilters)
      this.state.ItemFiltersFields.MoreImages = parsedImagesValue.MoreImages
      if (this.state.ItemFiltersFields.MoreImages != "") {
        var splitImagesPhotoName = parsedImagesValue.MoreImages.split(',')
        for (let index = 0; index < splitImagesPhotoName.length; index++) {
          this.state.allCurrentImages.push({
            imageUrl: Utilities.generatePhotoLargeURL(splitImagesPhotoName[index]),
            photoName: splitImagesPhotoName[index]
          })
        }
      }
    }
    this.setState({
      allCurrentImages: this.state.allCurrentImages,
      showMultipleImageModal: !this.state.showMultipleImageModal,
      SelectedProduct: product
    });
  }
  moreFilesModal(product, productOptions) {
    this.state.allCurrentFiles = []
    if (product.ItemFilters != "") {
      var parsedImagesValue = JSON.parse(product.ItemFilters)
      this.state.ItemFiltersFields.Document = parsedImagesValue.Document
      if (this.state.ItemFiltersFields.Document != "") {
        var splitfileName = parsedImagesValue.Document.split(',')
        for (let index = 0; index < splitfileName.length; index++) {
          var isPdf = String(splitfileName[index]).includes('.pdf')
          var enterprizeId = Utilities.GetEnterpriseIDFromSession()
          if (isPdf) {
            this.state.allCurrentFiles.push({
              url: Config.Setting.baseImageURL + '/' + enterprizeId + '/files/' + splitfileName[index],
              fileName: splitfileName[index]
            })
          } else {
            this.state.allCurrentFiles.push({
              imageUrl: Utilities.generatePhotoLargeURL(splitfileName[index]),
              fileName: splitfileName[index]
            })
          }
        }
      }
    }
    this.setState({
      allCurrentFiles: this.state.allCurrentFiles,
      showMultipleFilesModal: !this.state.showMultipleFilesModal,
      SelectedProduct: product,
    });
  }
  htmlEditorModal(product, productOptions) {
    this.setState({
      htmlEditor: !this.state.htmlEditor,
      SelectedProduct: product,
    });
  }

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
      IsCategorySearching: false,
      IsProductSearching: false,
      SelectedMetaItems: [],
      MetaItems: [],
      FilteredMetaItems: [],
      SelectedMetaItemName: "",
      SelectedMetaItemId: 0,
      SelectedProductOptionName: '',
      SelectedProductOptionId: 0,
      modalMove: false,
      modalMoveItem: false,
      ItemFiltersFields : { Brand:"" , Tags: "", Dietary:"", VideoURL: "",Document: "", MoreImages:""},
      AllBrand: [],
      FilterBrand: [],
      BrandText: "",
      SelectedBrand: "",
      DietaryArray: [],
      FilteredDietary: [],
      showMultipleImageModal: false,
      showMultipleFilesModal: false,
      viewImageModal: false,
      htmlEditor: false,
      htmlEditorState: EditorState.createEmpty(),
      multipleImageStreams: [],
      multipleImageAlert: false,
      moreImagesActiveTab: '1',
      allCurrentImages: [],
      multipleFileStream: [],
      multipleFileAlert: false,
      disbaleSaveForFiles: true,
      disbaleSaveForImages: true
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



  SetActiveTab(activeTab) {
    this.setState({ ActiveTab: activeTab, disbaleSaveForFiles: true,  disbaleSaveForImages: true});

    if(activeTab == 0) {
      this.setState({ ShowGalleryLoader: true });
      return;
    }

    setTimeout(() => { 
      this.setState({ ShowGalleryLoader: false });
    }, 100)
    
  }


  //#endregion


  //#region Dynamic Field

  SetFiltersFields(itemFilter) {
    
    let itemFiltersFields = this.state.ItemFiltersFields;
    
    let brands = this.state.AllBrand.filter(brand => {
        if(Number(itemFilter.Brand) === brand.Id)
          return true;
    })
    
    itemFiltersFields.Brand = brands.length > 0 ? brands[0].Name : "";
    itemFiltersFields.Tags = itemFilter.Tags !== undefined ? itemFilter.Tags : "";
    itemFiltersFields.Dietary = itemFilter.Dietary !== undefined ? itemFilter.Dietary : "" ;
    itemFiltersFields.VideoURL = itemFilter.VideoURL !== undefined ? itemFilter.VideoURL : "" ;
    this.SetItemDietary(itemFiltersFields.Dietary);
    this.setState({ItemFiltersFields: itemFiltersFields});

}


SetItemDietary(dietaryCsv){
  let dietrayarr = dietaryCsv !== "" ? dietaryCsv.split(',') : []
  let dietrayArray = [];
  let dietary = this.state.Dietary;

  let filteredDietary = [];

  for (var i = 0; i < dietary.length; i++) {
  
    if(dietrayarr.indexOf(dietary[i].Id) === -1){
      filteredDietary.push(dietary[i]);
    } else {
      dietrayArray.push(dietary[i]);
    }
  }

  this.setState({FilteredDietary: filteredDietary, DietaryArray: dietrayArray});

}

CreateItemDietaryCsv(dietaryArr){

  let csv = "";
  dietaryArr.forEach(dietary =>{
      csv += dietary.Id + ","
  })

  csv = Utilities.FormatCsv(csv,",");

  return csv;
}

CreateItemFilterCsv(){
  let itemFilterArray  = this.state.ItemFiltersFields;
  let itemFilter = "";
  return itemFilter;
}

handleFilterChangeText(e,type) {
  
  let value = e.target.value;
  let itemFiltersFields = this.state.ItemFiltersFields;
    switch (type.toUpperCase()) {

      case 'B':
        itemFiltersFields.Brand = value;
        break;
      case 'T':
        itemFiltersFields.Tags = value;
        break;
      
      case 'V':
        itemFiltersFields.VideoURL = value;
        break;
      
      default:
        break;
    }

  this.setState({ItemFiltersFields: itemFiltersFields });

}


// RenderItemFilterFields(itemFilter, index) {

//   return (

//   <div className="modal-form-group set-price-field">
//   <label className="control-label">{itemFilter.Name}</label>                            
//   <div className="input-group h-set">                         
//   <input type="text" className="form-control" value={itemFilter.Value} onChange={(e) => this.handleChangeText(e,index)}/>
//       <div className="help-block with-errors"></div>
//   </div>                      
//   </div>
//   )
// }


// RenderItemFilterFields(itemFilter, index) {

//   return (

//   <div className="modal-form-group set-price-field">
//   <label className="control-label">{itemFilter.Name}</label>                            
//   <div className="input-group h-set">                         
//   <input type="text" className="form-control" value={itemFilter.Value} onChange={(e) => this.handleChangeText(e,index)}/>
//       <div className="help-block with-errors"></div>
//   </div>                      
//   </div>
//   )

// }



// LoadDynamicItemFields() {

//   if(this.state.ShowLoaderRightPanel){
//       return this.loading();
//   }

//   let itemFiltersFields  = this.state.ItemFiltersFields;

//   var htmlItemFilters = [];

//   for (var i = 0; i < itemFiltersFields.length; i++) {
      
//       if(itemFiltersFields[i] !== "")
//         htmlItemFilters.push(this.RenderItemFilterFields(itemFiltersFields[i],i));
//   }

//   return (htmlItemFilters.map((itemFiltersHtml) => itemFiltersHtml))

// }

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

  handleItemCheck(e,Id) {

    let checked = e.target.checked;
    let selectedMetaItems = this.state.SelectedMetaItems;
    
    if(checked) {
      selectedMetaItems.push(Id);
    } else {
    var index = selectedMetaItems.indexOf(Id);
    if (index > -1) selectedMetaItems.splice(index, 1);
  }

    this.setState({SelectedMetaItems: selectedMetaItems});
}

handleItemSelection(id,name){

if(id === 0) return;

this.setState({
SelectedMetaItemName: name,
SelectedMetaItemId: id,
modalMoveItem: true,
modalMove: false
});

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
      ModelHeaderTitle: Object.keys(product).length === 0 ? 'Add New Article' : 'Edit Article',
      OptionFoodTypeIdCsv: Object.keys(product).length === 0 ? '0' : product.FoodTypeIDCsv,
      CheckAll: false,
      AllDay: false,
    })
  }

  EditProductModal() {
    this.setState({
      edititem: !this.state.edititem,
    })
  }

  itemImageModal(optionName, optionId, isCategory,photoName) {
    let CategoryImageWH = Config.Setting.CategoryImage_W_H
    let ProductImageWH = Config.Setting.ProductImage_W_H;
    this.setState({
      viewImageModal: false,
      itemImage: !this.state.itemImage,
      SelectedProductOptionName: optionName,
      SelectedProductOptionId: optionId,
      SelectedProductOptionPhotoName: photoName,
      IsCategory: isCategory,
      FilterGalleryPhotos: this.state.GalleryPhotos,
      Aspect: isCategory ? CategoryImageWH[0] / CategoryImageWH[1] : ProductImageWH[0] / ProductImageWH[1],
      SeletedItemPhoto: "",
      Image: null,
      ShowGalleryLoader: true,
    })
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
      ModelHeaderTitle: Object.keys(category).length === 0 ? 'Add New Catalogue' : 'Edit Catalogue',
      HideFromPlatform: Object.keys(category).length === 0 ? false : category.HideFromPlatform,
      HideFromWhiteLabel: Object.keys(category).length === 0 ? false : category.HideFromWhiteLabel,
      IsDeal: Object.keys(category).length === 0 ? false : category.IsDeal,
      IsBuffet: Object.keys(category).length === 0 ? false : category.IsBuffet,
      MenuCategoryTagId: Object.keys(category).length === 0 ? 0 : category.FoodTypeIDCsv,
      MenuAddonExtraGroupId: Object.keys(category).length === 0 ? 0 : category.MenuAddonExtraGroupId ,
      MenuAddonGroupToppingId: Object.keys(category).length === 0 ? 0 : category.MenuAddonGroupId ,

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
    
    var itemFilterFields = this.state.ItemFiltersFields;
    
    itemFilterFields.Brand = "";
    itemFilterFields.Tags = "";
    itemFilterFields.Dietary = "";
    itemFilterFields.VideoURL = "";
    itemFilterFields.Document = "";
    itemFilterFields.MoreImages = "";

    this.setState({
      SelectedProduct: product,
      productOptionModal: !this.state.productOptionModal,
      ModelHeaderTitle: 'Add new option',
      OptionMenuAddonGroupId: this.state.SelectedCategory.MenuAddonGroupId,
      OptionMenuAddonExtraGroupId: this.state.SelectedCategory.MenuAddonExtraGroupId,
      FilteredDietary: this.state.Dietary,
      ItemFiltersFields :  itemFilterFields 
    });
  }

  ProductOptionEditModel(product, productOption) {

    let dynamicValues = productOption.ItemFilters != undefined && productOption.ItemFilters != "" ? JSON.parse(productOption.ItemFilters) : {};
    this.SetFiltersFields(dynamicValues);
    this.setState({
      SelectedProduct: product,
      ProductandOptionAction: productOption,
      ModelHeaderTitle: 'Edit '+ productOption.Name,
      productOptionModal: !this.state.productOptionModal,
      OptionMenuAddonGroupId: productOption.MenuAddonToppingId,
      OptionMenuAddonExtraGroupId: productOption.MenuAddonExtrasId,
      SelectedProductOptionPhotoName: productOption.ItemPhotoName,
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
   
    if (searchText.toString().trim() === '') {
      this.setState({ FilterProducts: this.state.Products,IsProductSearching: false });
      return;
    }

    filteredData = this.state.Products.filter((prod) => {

      let arr = searchText.toUpperCase().split(' ');
      let isExists = false;

      for (var t = 0; t <= arr.length; t++) {

        if (prod.MenuMetaName.toUpperCase().indexOf(arr[t]) !== -1 || prod.Name.toUpperCase().indexOf(arr[t]) !== -1 || prod.MenuMetaDescription.toUpperCase().indexOf(arr[t]) !== -1) {
          isExists = true;
          break;
        }
      }

      return isExists
    })


    this.setState({ FilterProducts: filteredData,IsProductSearching: true });
  }

  SearchMetaItem(e) {

    let searchText = e.target.value;
    let filteredData = []
    
    this.setState({SearchMetaItemText: searchText});
   
    if (searchText.toString().trim() === '') {
      this.setState({ FilteredMetaItems: this.state.MetaItems,IsMetaItemSearching: false });
      return;
    }

    filteredData = this.state.MetaItems.filter((prod) => {

      let arr = searchText.toUpperCase().split(' ');
      let isExists = false;

      for (var t = 0; t <= arr.length; t++) {

        if (prod.Name.toUpperCase().indexOf(arr[t]) !== -1) {
          isExists = true;
          break;
        }
      }

      return isExists
    })

    this.setState({ FilteredMetaItems: filteredData,IsMetaItemSearching: true });
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

      let arr = searchText.toUpperCase().split(' ');
      let isExists = false;

      for (var t = 0; t <= arr.length; t++) {

        if (cate.Name.toUpperCase().indexOf(arr[t]) !== -1 || cate.Description.toUpperCase().indexOf(arr[t]) !== -1) {
          
          isExists = cate.IsPublished ? activeCategory : inActiveCategory;
          break;
        }
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

  MetaItemHtml(metaItem){
    
    return (<tr key={metaItem.Id} onClick={() => this.handleItemSelection(metaItem.Id,metaItem.Name)}><td><span>{metaItem.Name}</span></td></tr>)
  }


  RenderMetaItems = (metaItems) => {

    let html = [];

    if(metaItems.length === 0) {
      return;
    }

     for (var i=0; i < metaItems.length;i++){

       html.push(this.MetaItemHtml(metaItems[i]));
     }
   
     return(       
           <tbody>{html.map((metaItem) => metaItem)} </tbody>
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

    //let a = 0;
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


  /*RenderNormalWorkingHour(hoursArr, productHours, day){
    
    console.log('in normal product:'+productHours);
    let hourCsvArr= [];
    /*let currentHour =  hoursArr.filter(hrArr => {
  
        if(hrArr.indexOf(day.SortOrder+'|') !== -1 ){
          hourCsvArr = hrArr.split('|');
        }
    })*/

  /*if(hourCsvArr.length === 0){
    return ('');
  }

  return(
          <li key={'h-'+ day.SortOrder}>
            <div className="checkbox-day">
              <AvField type="checkbox" className="form-checkbox" name={"chk-" + day.SortOrder} value={productHours.indexOf(day.SortOrder+'|') !== -1 ? true : false} />
              <label className="settingsLabel" htmlFor={"chk-" + day.SortOrder}>{day.Name}</label>
              <span>{hourCsvArr[1].replace('~', ' - ')}</span>
            </div>
          </li>
  )
}*/

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

    /*if(workingHourArr[0].indexOf('[') !== -1){
    
      //advanceworking hours
      return(
        <ul className="timing-list-wrap">
                <li>
                  <div className="checkbox-day"> Advance Working Hour</div>
                  </li>  
              </ul>
      )
    }*/

    //Normal Working hours
    /* return(
     
       <ul className="timing-list-wrap">
           {days.map(day=> 
             this.RenderNormalWorkingHour(workingHourArr, productWorkingHour, day))}           
       </ul>
     )*/

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
    return (<div className="add-option-btn" onClick={() => this.ProductOptionShowModal(product)}> <i className="fa fa-plus" aria-hidden="true"></i><span>Add option</span></div>)
  }

  RenderProductOption(productOptions, product) {


    if (productOptions.IsDeleted === true)
      return ('');
      
      var actions = <div><span class="m-b-0 statusChangeLink m-r-20 " >
      <span  onClick={(e) => this.toggleViewImageModal(productOptions.ItemPhotoName,productOptions.Id,productOptions.Name)}>
      <i class="fa fa-eye font-18" ></i>
        View image
        
    </span>
    </span><span class="m-b-0 statusChangeLink m-r-20"  ><a onClick={(e) => this.itemImageModal(productOptions.Name, productOptions.Id, false, productOptions.ItemPhotoName)}><i class="fa fa-edit font-18" ></i> Change image</a></span></div>;



    return (

      <div key={productOptions.Id} className="item-option-detail-wrap item-option-detail-shoply-wrap">

                    <div>
                      <input type="checkbox" className="form-checkbox" onChange={(e) => this.handleItemCheck(e,productOptions.Id)} />
                    </div>

        <span className="item-icon cursor-pointer">
            {productOptions.ItemPhotoName === "" ? <i onClick={(e) => this.itemImageModal(productOptions.Name, productOptions.Id, false, productOptions.ItemPhotoName )} className="fa fa-picture-o" aria-hidden="true"></i> :
              <div>
                <div className="menu-data-action-btn-wrap">
                  <div className="show-res">
                    <Dropdown className="shoply-dropdown">
                      <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                        <span className="border-item-image">
                          <span className="menu-item-image" style={{ backgroundImage: "url(" + Utilities.generatePhotoLargeURL(productOptions.ItemPhotoName, true, false) + ")" }}><i className="fa fa-edit"></i> </span></span>

                      </Dropdown.Toggle>

                      <Dropdown.Menu >
                        {actions}
                      </Dropdown.Menu>
                    </Dropdown>

                  </div>
                </div>
              </div>
            }



          </span>



        <div className="item-option-detail-inner-wrap">
          <div className="item-option-name-price">
            <span>{productOptions.Name.trim() === "" ? '(unnamed)' :  Utilities.SpecialCharacterDecode(productOptions.Name)}</span>
            <span className="bold text-right">{Config.Setting.currencySymbol}{Utilities.FormatCurrency(productOptions.Price, Config.Setting.decimalPlaces)}</span>
          </div>
          {/* <div className={productOptions.ExtraName === "" && productOptions.ToppingName === "" ? "item-option-topping-extras no-extras-top" : "item-option-topping-extras"}>
	            <span>
	             {productOptions.ExtraName === "" ? "No Extrassss" : 'Extras' } 
           
	             <span style={{fontSize:14, display:'block', color:'#333'}}>  {productOptions.ExtraName === "" ? "" : productOptions.ExtraName} </span>  
	              </span>
	            <span>{productOptions.ToppingName === "" ? "No Topping" :'Topping'}
	            <span style={{fontSize:14, display:'block', color:'#333'}}>  {productOptions.ToppingName === "" ? "" : productOptions.ToppingName} </span>  
	            </span>
	          </div> */}
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
        <div className="shoply-more-link show-web">
          <span className="font-16 show-add-option cursor-pointer">
            <span className="menu-sort-link m-sort-item" onClick={() => this.moreImagesModal(product, productOptions)}>
              More Images
            </span>
          </span>
          <span className="font-16 show-add-option cursor-pointer">
            <span className="menu-sort-link m-sort-item" onClick={() => this.moreFilesModal(product, productOptions)}>
              More Files
            </span>
          </span>
          <span className="font-16 show-add-option cursor-pointer">
            <div className="menu-sort-link m-sort-item" onClick={() => this.htmlEditorModal(product, productOptions)}>
              HTML editor
            </div>
          </span>
        </div>

        <div className="user-data-action-btn-res">

          <div className="show-res">
            <Dropdown >
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                <span>
                  <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                </span>
                <span>
                  Options
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <div>
                  <span className="menu-left-list-buttons">
                    <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.moreImagesModal(product, productOptions)}>
                      <i className="fa fa-picture-o" aria-hidden="true"></i>
                      <span className="common-cat-icon-span"> More Images</span>
                    </span>
                    <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.moreFilesModal(product, productOptions)}>
                      <i className=" fa fa-file-o" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Edit"></i>  <span className="common-cat-icon-span"> More Files</span>
                    </span>
                    <span className="m-b-0 statusChangeLink m-r-20" onClick={() => this.htmlEditorModal(product, productOptions)}>
                      <i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="Remove" data-placement="top" data-original-title="Remove"></i>
                      <span className="common-cat-icon-span"> HTML editor</span>
                    </span>

                  </span>
                </div>
              </Dropdown.Menu>
            </Dropdown>

          </div>
        
        </div>

        
      </div>

    )
  }

  RenderProductInfoWithDetail(product, productOption,index) {

    return (
      <div key={index} className={product.IsPublished === true ? "item-main-row  " : "item-main-row item-row-disable"}>
        <div className="item-row-wrap">
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
              <button className="btn btn-success"  onClick={() => this.ActivateDeactivateProductConfirmation(product)}>Activate</button>
          }

        </div>

        {product.MenuMetaDescription === '' ? ('') : (
          <p className="item-row-wrap">
            {Utilities.SpecialCharacterDecode(product.MenuMetaDescription)}
          </p>
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
    <div className="no-results-wrap"><div><div className="not-found-menu m-b-20">No results matched.</div><span className="add-cat-btn" onClick={() => this.CategoryModelShowHide({})}>Add New Catalogue</span></div> </div>
  )

}

  RenderRightProductPanel(products) {

    if (this.state.ShowLoaderRightPanel === true) {
      return this.loading()
    }

    if (products.length === 0)
      return (<div className="not-found-menu">No results matched.</div>)

    var prevMetaItem = '';
    var productOption = [];
    var html = [];

    for (var i = 0; i < products.length; i++) {

      if (products[i].MenuMetaName !== prevMetaItem && prevMetaItem !== '') {

        html.push(this.RenderProductInfoWithDetail(productOption[0], productOption,i));
        productOption = [];

        productOption.push(products[i]);
        prevMetaItem = products[i].MenuMetaName;

        continue;

      }

      productOption.push(products[i]);

      prevMetaItem = products[i].MenuMetaName;
    }

    if (productOption.length > 0) {
      html.push(this.RenderProductInfoWithDetail(productOption[0], productOption,i));
    }

    return (
      <div className="shoply-wrap">{html.map((optionHtml) => optionHtml)}</div>)
  }
  onScroll() {
    this.props.handleScroll(this.refs.elem.scrollTop);
  }
  SetCurrentCategoryState(category) {

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
            <ReactTooltip id='Edit'><span>Edit</span></ReactTooltip>
          </span>
          <span className="sa-warning" onClick={() => this.DeleteCategoryConfirmation(cate.Id, cate.Name)}>
            <i className="fa fa-trash" aria-hidden="true" data-tip data-for='Delete'></i>
            <ReactTooltip id='Delete'><span>Delete</span></ReactTooltip>
          </span>
          <span className="sa-suspended" onClick={() => this.ActivateDeactivateConfirmation(cate.IsPublished, cate.Name)}>
            <i className="fa fa-ban" aria-hidden="true" data-tip data-for='activate'></i>
            <ReactTooltip id='activate'><span>{cate.IsPublished === true ? 'Inactive' : 'Activate'}</span></ReactTooltip>
          </span>
        </span>
      </li>)
  }

  LoadCategories(categories) {
    if (this.state.ShowLoaderLeftPanel === true) {
      return this.loading()
    }

    if (categories.length === 0) {
      // this.SetCurrentCategoryState(categories[SelectedCategoryIndex])
      return ('Catalogue(s) not found')
    }

    var htmlActive = [];
    var htmlInActive = [];
    var SelectedCategoryIndex = 0;

    for (var i = 0; i < categories.length; i++) {

      if (this.state.SelectedCategoryId === categories[i].Id && this.state.inActiveCategoryCheck && this.state.inActiveCategoryCheck) {
        SelectedCategoryIndex = i;
      }

      // this.SetCurrentCategoryState(categories[i])

      if (categories[i].IsPublished === true) {
        htmlActive.push(this.RenderLeftCategoriesPanel(categories[i]));
      }
      else {
        htmlInActive.push(this.RenderLeftCategoriesPanel(categories[i]));
      }
    }

    if (!this.state.isMobile || this.state.IsCategoryClicked)
      this.SetCurrentCategoryState(categories[SelectedCategoryIndex])

    return (
      <div className="menu-left-cat-list">
        <h3 className={this.state.activeCategoryCheck && htmlActive.length > 0 ? "menu-cat-active-heading" : "no-display"}>Active</h3>
        <ul className={this.state.activeCategoryCheck && htmlActive.length > 0 ? "" : "no-display"}>{htmlActive.map((optionHtml) => optionHtml)}</ul>

        <h3 className={this.state.inActiveCategoryCheck && htmlInActive.length > 0 ? "menu-cat-not-active-heading" : "no-display"}>Inactive</h3>
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
          this.setState({ShowGalleryLoader: false});
        }, 500)
  
        
    }

    if(searchText.length < 3){
      return;
    }
    this.state.StopTyping = false;


    if (this.state.SelectedPhotoGroup !== 'All')
      FilteredByGroup = this.state.FilterGalleryPhotos
    else
      FilteredByGroup = this.state.GalleryPhotos

    filteredData = FilteredByGroup.filter((photo) => {

      let arr = searchText.toUpperCase().split(' ');
      let isExists = false;

      for (var t = 0; t <= arr.length; t++) {

        if (photo.Name.toUpperCase().indexOf(arr[t]) !== -1) {
          isExists = true;
          break;
        }
      }

      return isExists
    })

    setTimeout(() => { 
    
    if(this.state.StopTyping) { 
      this.setState({ShowGalleryLoader: true});

      setTimeout(() => { 
          this.setState({ FilterGalleryPhotos: filteredData }); 
          this.setState({ShowGalleryLoader: false});
        }, 500)
     
      }
    }, 1000)

    this.state.StopTyping = true;
    
  }


  RenderGalleryPhoto(galleryPhoto, val) {


    var selectedClass = this.state.SeletedItemPhoto === galleryPhoto.PhotoName ? "selected-photo photo-label" : "photo-label";

    return (

      <div className={selectedClass} key={val}>
        <div style={{ position: 'relative' }}>
          <div className="show-tick no-display">
            <span className="show-check "><i className="fa fa-check" aria-hidden="true"></i></span>
          </div>
          <img src={Utilities.generatePhotoLargeURL(galleryPhoto.PhotoName, true, false)} onClick={(e) => this.OnPhotoClick(galleryPhoto.PhotoName)} alt={galleryPhoto.PhotoName} />
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

  GetCategories = async () => {

    var data = await CategoryService.GetAll();

    data.sort((x, y) => ((x.SortOrder === y.SortOrder) ? 0 : ((x.SortOrder > y.SortOrder) ? 1 : -1)))

    this.setState({ Categories: data, FiltersMenuCategory: data, ShowLoaderLeftPanel: false, ShowLoaderRightPanel: false });

    if(Object.keys(this.state.SelectedCategory).length > 0) {
      var selectedCategoryId = this.state.SelectedCategory.Id;      
      var selectedCategory = data.filter(function(a){ return a.Id == selectedCategoryId })[0]
      this.setState({SelectedCategory: selectedCategory});
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
      message = category.IsPublished === true ? '"' + category.Name + '" has been Inactive' : '"' + category.Name + '" has been activated '
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
      Utilities.notify("Catalogue " + Utilities.SpecialCharacterDecode(category.Name) + ((isNewCategory === true) ? " created successfully." :" updated successfully.") ,"s");
    
    } else if(message === '0') {
     
      Utilities.notify("Update failed.","e");

    } else {
      Utilities.notify("Update failed. " + message ,"e");
    }
    
  }

  SaveCategory(event, values) {


    if(this.state.IsSave) return;
    this.setState({IsSave:true})
    
    let category = CategoryService.categoryObject
    let categoryToUpdate = this.state.CategoryAction;

    category.Name = Utilities.SpecialCharacterEncode(values.categoryName);
    category.Description = Utilities.SpecialCharacterEncode(values.description);
    category.MenuAddonExtrasGroupId = this.state.MenuAddonExtraGroupId //values.categoryExtras;
    category.MenuAddonToppingGroupId = this.state.MenuAddonGroupToppingId //values.CategoryTopping; 
    category.TagsIdsCsv =  this.state.MenuCategoryTagId //values.CategoryFoodType;
    category.IsDeal = this.state.IsDeal;
    category.IsBuffet = this.state.IsBuffet;
    category.HideFromPlatform = this.state.HideFromPlatform;
    category.HideFromWhiteLabel= this.state.HideFromWhiteLabel;
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

    this.setState({ ShowLoaderRightPanel: true,SelectedMetaItems: [] });
    var data = await ProductService.GetWithDetails(categoryId);
    data.sort((x, y) => ((x.IsPublished  === y.IsPublished) ? y.SortOrder - x.SortOrder : (!y.IsPublished ? 1 : -1)))
    data.reverse();
    this.setState({ Products: data, FilterProducts: data});
    this.FilterActiveInActiveProducts(this.state.activeProductCheck, this.state.inActiveProductCheck);
    this.setState({ShowLoaderRightPanel: false, left: false });

    //  if(!this.state.isMobile || this.state.IsCategoryClick)
    this.setState({ left: false, IsCategoryClicked: false });
    this.GetActiveProducts(data);
    this.GenerateMetaItemArray(data);
  
    
  }

GenerateMetaItemArray(metaItems){

  let metaItemCsv = '';
  let items = [];

  if(metaItems.length === 0){
    return;
  }


  this.state.SelectedItemMetaId = metaItems[0].MenuItemMetaId;
  
   for (var i=0;i < metaItems.length;i++) {

   if (!Utilities.isExistInCsv(metaItems[i].MenuMetaName , metaItemCsv, Config.Setting.csvSeperator))
  {
    items.push({Id: metaItems[i].MenuItemMetaId, Name: metaItems[i].MenuMetaName })
    metaItemCsv += metaItems[i].MenuMetaName + Config.Setting.csvSeperator;
  }
     
   }

   this.setState({MetaItems: items, FilteredMetaItems: items})

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

  MoveItemToOtherMetaApi = async (Id) => {

    let csv = this.GenerateSelectedItemCsv();

    let message = await ProductOptionService.UpdateItems(Id,csv);
    
    if (message === '1') {
      
      this.GetProducts(this.state.SelectedCategoryId);
    } else if(message === '0'){
     
      Utilities.notify("Update failed.","e");

    } else {
      Utilities.notify("Update failed. " + message ,"e");
    }

    this.setState({IsSave:false, modalMoveItem: false})

  }


  MoveItemToOtherMeta(){

    let metaItemName = this.state.SelectedMetaItemName;
    let metaItemId = this.state.SelectedMetaItemId;

    if(this.state.IsSave || metaItemId === 0) return;
     this.setState({IsSave:true})
   
     if(this.state.SelectedMetaItems.length == 0) {
      this.setState({ItemSelectionError: true,IsSave: false});
      return;
     }

     this.MoveItemToOtherMetaApi(metaItemId);


  }

GenerateSelectedItemCsv = () => {

  let selectedMetaItems = this.state.SelectedMetaItems
  let csv = '';
  
  for (var i = 0; i < selectedMetaItems.length; i++) {
  
    csv +=  selectedMetaItems[i] + Config.Setting.csvSeperator;
  }

  return Utilities.FormatCsv(csv, Config.Setting.csvSeperator);

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

          // console.log(data["chk-" + day.SortOrder] + ': ' + csv);
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
    product.TagsIdsCsv = this.state.OptionFoodTypeIdCsv === ""? this.state.FoodTypes[0].Id : this.state.OptionFoodTypeIdCsv ;
    product.HoursCsv = this.GenerateSelectedHourCsv(values);
    product.DietaryTypeIdsCsv = this.GenerateDietaryCsv(values);

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
      Utilities.notify("Article " + Utilities.SpecialCharacterDecode(product.Name) + ((updating === false) ? " created successfully." :" updated successfully.") ,"s");
    }
   else if(message === '0'){
     
    Utilities.notify("Update failed.","e");

  } else {
    Utilities.notify("Update failed. " + message ,"e");
  }
  }


  GetAllBrands = async () => {
    var data = await BrandService.GetAll();
    this.setState({AllBrand: data});
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
      this.GetAllBrands()
      SetMenuStatus(true);
      this.handleCategoryClick(this.state.SelectedCategory);
      this.ProductOptionHideModal();
      Utilities.notify("Option " + Utilities.SpecialCharacterDecode(option.Name) + ((option.Id === 0) ? " created successfully." :" updated successfully.") ,"s");

    } else if(message === '0'){
     
      Utilities.notify("Update failed.","e");

    } else {
      Utilities.notify("Update failed. " + message ,"e");
    }


  }

  SaveOption(event, values) {

    if(this.state.IsSave) return;
      this.setState({IsSave:true})

    let product = this.state.SelectedProduct;
    let option = ProductOptionService.Option;

      option.SKU = values.txtSKU;
      option.UnitStock = values.txtUnitStock;
      option.RecordAlert = values.txtRecordAlert;
      option.SaleLimit = values.txtSaleLimit;
      option.ItemFilters = JSON.stringify(this.state.ItemFiltersFields);
      option.Description = Utilities.SpecialCharacterEncode(values.itemDescription);


    //saving 
    if (Object.keys(this.state.ProductandOptionAction).length === 0) {

      option.Id = 0;
      option.ProductId = product.MenuItemMetaId;
      option.Price = Utilities.FormatCurrency(values.price, Config.Setting.decimalPlaces);
      option.Name =Utilities.SpecialCharacterEncode(product.MenuMetaName) + ' ' + Utilities.SpecialCharacterEncode(values.optionName);
      option.MenuAddonGroupId = this.state.OptionMenuAddonExtraGroupId //values.extras;
      option.MenuAddonToppingId =  this.state.OptionMenuAddonGroupId//values.topping;
      option.VarietyName = Utilities.SpecialCharacterEncode(values.optionName);
      option.PhotoName = '';
      this.SaveProductOpion(option);

      return;
    }

    //updating
    let productOption = this.state.ProductandOptionAction;

    option.Id = productOption.Id;
    option.ProductId = productOption.MenuItemMetaId;
    option.VarietyId = productOption.MenuVarietyId;
    option.Price = Utilities.FormatCurrency(values.price, Config.Setting.decimalPlaces);
    option.Name = Utilities.SpecialCharacterEncode(product.MenuMetaName) + ' ' + Utilities.SpecialCharacterEncode(values.optionName);
    option.MenuAddonGroupId = this.state.OptionMenuAddonExtraGroupId; //values.extras;
    option.MenuAddonToppingId = this.state.OptionMenuAddonGroupId //values.topping;
    option.VarietyName = Utilities.SpecialCharacterEncode(values.optionName);
    option.PhotoName = this.state.SelectedProductOptionPhotoName
    this.SaveProductOpion(option);
  }



  GetGalleryPhotos = async () => {

    var data = await PhotoDictionaryService.GetAllGalleryPhotos();
    this.setState({ GalleryPhotos: data, FilterGalleryPhotos: data});

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


    if (!isCategory) {

      let item = {};

      item.EnterpriseId = Utilities.GetEnterpriseIDFromSession();
      item.Id = this.state.SelectedProductOptionId;
      item.PhotoName = this.state.SeletedItemPhoto;
      item.PhotoNameBitStream = croppedImage;
      item.OldPhotoName = this.state.SelectedProductOptionPhotoName;
      newPhotoName = await ProductOptionService.UpdateItemPhoto(item);
    }
    else {

      let category = {};

      category.EnterpriseId = Utilities.GetEnterpriseIDFromSession();
      category.MenuCategoryId = this.state.SelectedCategoryId;
      category.PhotoName = this.state.SeletedItemPhoto;
      category.PhotoNameBitStream = croppedImage;
      newPhotoName = await CategoryService.UpdateCategoryPhoto(category);
    }
    this.setState({IsSave:false})
    if (newPhotoName !== "") {
      if (isCategory)
        this.state.SelectedCategory.PhotoName = newPhotoName;

      this.handleCategoryClick(this.state.SelectedCategory);
      SetMenuStatus(true);
    }

    else {

      Utilities.notify("Update failed." + (newPhotoName !== '' ? "[" + newPhotoName + "]" : "") ,"e");


    }

    this.setState({ itemImage: !this.state.itemImage });

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
      selectedProductTimingTitle: `Article availability timings (${workingHour.indexOf('[') !==-1 ? 'Advance' : 'Normal' })`
   });
    
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

    this.setState({ FoodTypes: foodTypes, Dietary: dietary, FilteredDietary: dietary});

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
      default:
        break;
    }

  }

  //#endregion

//#region Autocomplete

  OnItemSelect(value){
        
    let itemFiltersFields = this.state.ItemFiltersFields;

    let filterbrands = this.state.FilterBrand.filter((brand) => {
        return brand.Name == value
    })

    itemFiltersFields.Brand = filterbrands[0].Name
    this.setState({ItemFiltersFields : itemFiltersFields})
  }
    
    
SearchBrand(e,value) {

  
  let searchText = value;
  let itemFiltersFields = this.state.ItemFiltersFields;
  itemFiltersFields.Brand = searchText;

  this.setState({ItemFiltersFields: itemFiltersFields,FilterBrand: []});

  if(value.length < 3) return;

  let filteredData = []
 
  if (searchText.toString().trim() === '') {
    this.setState({FilterBrand: []});
    return;
  }

    filteredData = this.state.AllBrand.filter((brand) => {
    let arr = searchText.toUpperCase().split(' ');
    let isExists = false;

    for (var t = 0; t <= arr.length; t++) {

      if (brand.Name.toUpperCase().indexOf(arr[t]) !== -1) {
            isExists = true
            break;
      }
    }

    return isExists
  })

  this.setState({ FilterBrand: filteredData});
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
                <Label htmlFor="productName" className="control-label">Article name</Label>
                <AvField errorMessage="This is a required field" name="productName" value={Object.keys(product).length === 0 ? "" : Utilities.SpecialCharacterDecode(product.MenuMetaName)} type="text" className="form-control" required />
              </FormGroup>
              <FormGroup className="modal-form-group">
                <Label htmlFor="productDescription" className="control-label">Description</Label>
                <AvField errorMessage="This is a required field" name="productDescription" type="textarea" value={Object.keys(product).length === 0 ? "" : Utilities.SpecialCharacterDecode(product.MenuMetaDescription)} className="form-control" />
              </FormGroup>

              <FormGroup className="modal-form-group">
                <Label htmlFor="productFoodType" className="control-label">Choose Category</Label>
                {/* <AvField type="select" value={Object.keys(product).length === 0 ? this.state.SelectedCategory.FoodTypeIDCsv : product.FoodTypeIDCsv} name="productFoodType">
                  {this.state.FoodTypes.map((tags) => <option key={tags.Id} value={tags.Id}>{tags.Name}</option>)}
                </AvField> */}

              <select className="select2 form-control custom-select"  name="extras" onChange={(e) => this.handleSelectOptions(e,'of')} style={{ width: '100%', height: '36px' }}> 
                  {this.state.FoodTypes.map((tags) => Object.keys(product).length === 0 ? <option key={tags.Id} value={tags.Id} selected={(Number(this.state.SelectedCategory.FoodTypeIDCsv) === Number(tags.Id) )}>{tags.Name}</option> :  <option key={tags.Id} value={tags.Id} selected={(Number(product.FoodTypeIDCsv) === Number(tags.Id) )}>{tags.Name}</option>)}
               </select>

              </FormGroup>

              {/* {this.state.Dietary.length === 0 ? '' : <FormGroup className="modal-form-group">
                <Label htmlFor="exampleSelect" className="control-label">Select dietary type</Label>
                {this.RenderDietry(this.state.Dietary, Object.keys(product).length === 0 ? '' : product.DietryIDCsv)}
              </FormGroup>
              } */}
              <FormGroup className="modal-form-group" >
                <Label htmlFor="exampleSelect" className="control-label">{this.state.selectedProductTimingTitle}  </Label>
                {this.RenderWorkingHourForProduct()}

              </FormGroup>
              <FormGroup className="modal-form-group  no-display" >
                <Label htmlFor="exampleSelect" className="control-label">Article availability timings (Advance)</Label>
                <ul className="timing-list-wrap">
                  <li>
                    <div className="checkbox-day">
                      <input type="checkbox" className="form-checkbox" id="Sunday" />
                      <label className="settingsLabel" htmlFor="Sunday">Sunday</label>

                    </div>
                    <ul>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Breakfast" />
                          <label className="settingsLabel" htmlFor="Breakfast">Breakfast</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Brunch" />
                          <label className="settingsLabel" htmlFor="Brunch">Brunch</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Lunch" />
                          <label className="settingsLabel" htmlFor="Lunch">Lunch</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Hi-Tea" />
                          <label className="settingsLabel" htmlFor="Hi-Tea">Hi-Tea</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Dinner" />
                          <label className="settingsLabel" htmlFor="Dinner">Dinner</label>
                        </div>
                      </li>
                    </ul>
                  </li>


                  <li>
                    <div className="checkbox-day">
                      <input type="checkbox" className="form-checkbox" id="Sunday" />
                      <label className="settingsLabel" htmlFor="Sunday">Monday</label>

                    </div>
                    <ul>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Breakfast" />
                          <label className="settingsLabel" htmlFor="Breakfast">Breakfast</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Brunch" />
                          <label className="settingsLabel" htmlFor="Brunch">Brunch</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Lunch" />
                          <label className="settingsLabel" htmlFor="Lunch">Lunch</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Hi-Tea" />
                          <label className="settingsLabel" htmlFor="Hi-Tea">Hi-Tea</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Dinner" />
                          <label className="settingsLabel" htmlFor="Dinner">Dinner</label>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div className="checkbox-day">
                      <input type="checkbox" className="form-checkbox" id="Sunday" />
                      <label className="settingsLabel" htmlFor="Sunday">Tuesday</label>

                    </div>
                    <ul>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Breakfast" />
                          <label className="settingsLabel" htmlFor="Breakfast">Breakfast</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Brunch" />
                          <label className="settingsLabel" htmlFor="Brunch">Brunch</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Lunch" />
                          <label className="settingsLabel" htmlFor="Lunch">Lunch</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Hi-Tea" />
                          <label className="settingsLabel" htmlFor="Hi-Tea">Hi-Tea</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Dinner" />
                          <label className="settingsLabel" htmlFor="Dinner">Dinner</label>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div className="checkbox-day">
                      <input type="checkbox" className="form-checkbox" id="Sunday" />
                      <label className="settingsLabel" htmlFor="Sunday">Wednesday</label>

                    </div>
                    <ul>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Breakfast" />
                          <label className="settingsLabel" htmlFor="Breakfast">Breakfast</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Brunch" />
                          <label className="settingsLabel" htmlFor="Brunch">Brunch</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Lunch" />
                          <label className="settingsLabel" htmlFor="Lunch">Lunch</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Hi-Tea" />
                          <label className="settingsLabel" htmlFor="Hi-Tea">Hi-Tea</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Dinner" />
                          <label className="settingsLabel" htmlFor="Dinner">Dinner</label>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div className="checkbox-day">
                      <input type="checkbox" className="form-checkbox" id="Sunday" />
                      <label className="settingsLabel" htmlFor="Sunday">Thursday</label>

                    </div>
                    <ul>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Breakfast" />
                          <label className="settingsLabel" htmlFor="Breakfast">Breakfast</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Brunch" />
                          <label className="settingsLabel" htmlFor="Brunch">Brunch</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Lunch" />
                          <label className="settingsLabel" htmlFor="Lunch">Lunch</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Hi-Tea" />
                          <label className="settingsLabel" htmlFor="Hi-Tea">Hi-Tea</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Dinner" />
                          <label className="settingsLabel" htmlFor="Dinner">Dinner</label>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div className="checkbox-day">
                      <input type="checkbox" className="form-checkbox" id="Sunday" />
                      <label className="settingsLabel" htmlFor="Sunday">Friday</label>

                    </div>
                    <ul>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Breakfast" />
                          <label className="settingsLabel" htmlFor="Breakfast">Breakfast</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Brunch" />
                          <label className="settingsLabel" htmlFor="Brunch">Brunch</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Lunch" />
                          <label className="settingsLabel" htmlFor="Lunch">Lunch</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Hi-Tea" />
                          <label className="settingsLabel" htmlFor="Hi-Tea">Hi-Tea</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Dinner" />
                          <label className="settingsLabel" htmlFor="Dinner">Dinner</label>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div className="checkbox-day">
                      <input type="checkbox" className="form-checkbox" id="Sunday" />
                      <label className="settingsLabel" htmlFor="Sunday">Saturday</label>

                    </div>
                    <ul>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Breakfast" />
                          <label className="settingsLabel" htmlFor="Breakfast">Breakfast</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Brunch" />
                          <label className="settingsLabel" htmlFor="Brunch">Brunch</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Lunch" />
                          <label className="settingsLabel" htmlFor="Lunch">Lunch</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Hi-Tea" />
                          <label className="settingsLabel" htmlFor="Hi-Tea">Hi-Tea</label>
                        </div>
                      </li>
                      <li>
                        <div className="checkbox-day">
                          <input type="checkbox" className="form-checkbox" id="Dinner" />
                          <label className="settingsLabel" htmlFor="Dinner">Dinner</label>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>

              </FormGroup>
              {/* <div class="alert alert-danger">Sever side error</div> */}
            </div>
            <FormGroup className="modal-footer">
              <Button color="secondary" onClick={() => this.ProductModalShowHide({})}>Cancel</Button>
              <Button color="primary">
              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                             : <span className="comment-text">Save</span>}
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

    let itemFiltersFields = this.state.ItemFiltersFields;

    return (
      <Modal isOpen={this.state.productOptionModal} className={this.props.className}>
        <ModalHeader>{this.state.ModelHeaderTitle}</ModalHeader>
        <ModalBody className="padding-0 ">
          <AvForm onValidSubmit={this.SaveOption} >
          <div className="padding-20 scroll-model-web">
              <FormGroup className="modal-form-group">
                <Label htmlFor="exampleEmail" className="control-label">Name</Label>
                <AvField onKeyUp={Utilities.RemoveDefinedSpecialChars} value={Object.keys(ProductandOptionAction).length === 0 ? "" : Utilities.SpecialCharacterDecode(ProductandOptionAction.Name)} name="optionName" type="text" className="form-control" 
                    validate={{
                      required: { value: this.props.isRequired, errorMessage: 'This is a required field' }
                      }}
                />
              </FormGroup>

              <FormGroup className="modal-form-group">
                <Label htmlFor="itemDescription" className="control-label">Description</Label>
                <AvField name="itemDescription" type="textarea" value={Object.keys(ProductandOptionAction).length === 0 ? "" : Utilities.SpecialCharacterDecode(ProductandOptionAction.Description)} className="form-control" />
              </FormGroup>

              <div class="row">
                <div class="col-md-6">
                  <FormGroup className="modal-form-group set-price-field">
                    <Label htmlFor="price" className="control-label">Price</Label>
                    <div className="input-group h-set">
                      <div className="input-group-prepend">
                        <span className="input-group-text">{Config.Setting.currencySymbol}</span>
                      </div>
                      <AvField type="text" className="form-control" maxLength="6" name="price" onKeyUp={Utilities.ValidateDecimals} value={Object.keys(ProductandOptionAction).length === 0 ? "0" : String(ProductandOptionAction.Price)} />
                    </div>
                  </FormGroup>
                </div>
                <div class="col-md-6">
                  <FormGroup className="modal-form-group set-price-field">
                    <Label htmlFor="price" className="control-label">SKU</Label>
                    <div className="input-group h-set">
                      <AvField type="text" className="form-control" name="txtSKU" value={ProductandOptionAction.SKU} />
                    </div>
                  </FormGroup>
                </div>
              </div>


              <div class="row">
                <div class="col-md-6">
                  <FormGroup className="modal-form-group set-price-field">
                    <Label htmlFor="price" className="control-label">Unit Stock</Label>
                    <div className="input-group h-set">
                      <AvField type="number" className="form-control" name="txtUnitStock" value={ProductandOptionAction.UnitStock} />
                    </div>
                  </FormGroup>
                </div>
                <div class="col-md-6">
                  <FormGroup className="modal-form-group set-price-field">
                    <Label htmlFor="price" className="control-label">Record Alert</Label>
                    <div className="input-group h-set">
                      <AvField type="number" className="form-control" name="txtRecordAlert" value={ProductandOptionAction.RecordAlert} />
                    </div>
                  </FormGroup>
                </div>
              </div>
    
             
             
              <div class="row">
                <div class="col-md-6">
                  <FormGroup className="modal-form-group set-price-field">
                    <Label htmlFor="price" className="control-label">Sale Limit</Label>
                    <div className="input-group h-set">
                      <AvField type="number" className="form-control" name="txtSaleLimit" value={ProductandOptionAction.SaleLimit} />
                    </div>
                  </FormGroup>

                </div>
                <div class="col-md-6">
                  <FormGroup className="modal-form-group set-price-field">
                    <Label htmlFor="price" className="control-label">Brand</Label>

                    <div className="input-group h-set-new">
                      {this.state.AllBrand !== [] &&
                        <Autocomplete
                          className="form-control "
                          getItemValue={(item) => item.Name}
                          items={this.state.FilterBrand}
                          renderItem={(item, isHighlighted) =>
                            <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                              {item.Name}
                            </div>
                          }

                          value={this.state.ItemFiltersFields.Brand}
                          onChange={(event, value) => this.SearchBrand(event, value)}
                          onSelect={(value) => this.OnItemSelect(value)}
                          selectOnBlur={true}
                        />
                      }
                    </div>
                  </FormGroup>
                </div>
              </div>


              <div class="row">
                <div class="col-md-12">
                  <FormGroup className="modal-form-group set-price-field">
                    <Label htmlFor="price" className="control-label">Tags</Label>
                    <div className="input-group h-set mb-1">
                      <AvField type="text" className="form-control" name="txtTags" value={itemFiltersFields.Tags} onChange={(e) => this.handleFilterChangeText(e, "T")} />
                    </div>
                    <span  >(Use  ' , '  to separate tags eg: Drink,Pizza,Dessert) </span>
                  </FormGroup>
                </div>

                <div class="col-md-12">
                  <FormGroup className="modal-form-group set-price-field">
                    <Label htmlFor="price" className="control-label">VideoUrl</Label>
                    <div className="input-group h-set">
                      <AvField type="text" className="form-control" name="txtVideoUrl" value={itemFiltersFields.VideoURL} onChange={(e) => this.handleFilterChangeText(e, "V")} />
                    </div>
                  </FormGroup>
                </div>
              </div>

     

          
            <div class="row">
              <div class="col-md-12">
              <FormGroup className="modal-form-group set-price-field">
                {/* <Label htmlFor="price" className="control-label">Dietary</Label> */}
                <select className="select2 form-control custom-select"  name="ddldietary" onChange={(e) => this.handleSelectDietary(e)} value={'-1'} style={{ width: '100%', height: '36px' }}> 
                <option key={'1'} value={'-1'}>{'Select Dietary'}</option>
                  {this.state.FilteredDietary.map((tags) => <option key={tags.Id} value={tags.Id}>{tags.Name}</option>)}
               </select>
               
              </FormGroup>
              </div>
            </div>
        

          


            <FormGroup className="modal-form-group set-price-field">
              {this.RenderItemDietary(this.state.DietaryArray)}
            </FormGroup>

            

              {/* {this.LoadDynamicItemFields()} */}

              {/* <FormGroup className="modal-form-group">
                <Label htmlFor="topping" className="control-label">Select Toppings</Label>

                 <select className="select2 form-control custom-select"  name="topping" onChange={(e) => this.handleSelectOptions(e,'ot')} style={{ width: '100%', height: '36px' }}> 
                  <option key={0} value="0">No Toppings</option>
                  {this.state.ToppingGroup.map((topping) => Object.keys(this.state.ProductandOptionAction).length === 0 ? <option key={topping.Id} value={topping.Id} selected={(Number(this.state.SelectedCategory.MenuAddonGroupId) === Number(topping.Id) )}>{topping.Name}</option> :  <option key={topping.Id} value={topping.Id} selected={(Number(this.state.ProductandOptionAction.MenuAddonToppingId) === Number(topping.Id) )}>{topping.Name}</option>)}
                  </select>


              </FormGroup>
              <FormGroup className="modal-form-group">
                <Label htmlFor="extras" className="control-label">Select Extras</Label>
                  <select className="select2 form-control custom-select"  name="extras" onChange={(e) => this.handleSelectOptions(e,'oe')} style={{ width: '100%', height: '36px' }}> 
                  <option key={0} value="0">No Extras</option>
                  {this.state.ExtrasGroup.map((extra) => Object.keys(this.state.ProductandOptionAction).length === 0 ? <option key={extra.Id} value={extra.Id} selected={(Number(this.state.SelectedCategory.MenuAddonExtraGroupId) === Number(extra.Id) )}>{extra.Name}</option> :  <option key={extra.Id} value={extra.Id} selected={(Number(this.state.ProductandOptionAction.MenuAddonExtrasId) === Number(extra.Id) )}>{extra.Name}</option>)}
                  </select>

              </FormGroup>
 */}
             


              {/* <div class="alert alert-danger">Sever side error</div> */}
            </div>
            <FormGroup className="modal-footer" >
              <Button color="secondary" onClick={() => this.ProductOptionHideModal()}>Cancel</Button>
              <Button color="primary">
              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                             : <span className="comment-text">Save</span>}
            
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
        onConfirm={() =>  this.HandleOnConfirmation() }
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
  GenerateSweetAlertForMoreImages() {
    return (
      <SweetAlert
        show={this.state.multipleImageAlert}
        //title={this.state.alertModelTitle}
        title={'Select Image!'}
        text={'Please select any image.'}
        onConfirm={() => this.setState({ multipleImageAlert: false })}
        onEscapeKey={() => this.setState({ multipleImageAlert: false })}
        // onOutsideClick={() => this.setState({ showAlert: false })}
      />
    )
  }
  GenerateSweetAlertForMoreFiles() {
    return (
      <SweetAlert
        show={this.state.multipleFileAlert}
        //title={this.state.alertModelTitle}
        title={'Select File!'}
        text={'Please select any File.'}
        onConfirm={() => this.setState({ multipleFileAlert: false })}
        onEscapeKey={() => this.setState({ multipleFileAlert: false })}
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
        <ModalHeader>Sort Articles</ModalHeader>
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

      default:
        break;
    }

  }



  handleSelectDietary(e) {

    let dietaryArray = this.state.DietaryArray;
    let filteredDietaryArr = this.state.FilteredDietary;
    let dietary = this.state.Dietary;
    let itemFiltersFields = this.state.ItemFiltersFields;

    if(Utilities.GetObjectArrId(e.target.value,dietaryArray) !== "-1") {
      return;
    }

      let dietaryIndex = Utilities.GetObjectArrId(e.target.value,dietary)
      dietaryArray.push(dietary[dietaryIndex]);
      
      let index =  Utilities.GetObjectArrId(e.target.value,filteredDietaryArr);
      
      filteredDietaryArr.splice(index, 1);
      filteredDietaryArr.sort(Utilities.SortByName);

      let dietaryCsv = this.CreateItemDietaryCsv(dietaryArray);     
      itemFiltersFields.Dietary = dietaryCsv;
      this.setState({DietaryArray: dietaryArray, FilteredDietary: filteredDietaryArr, ItemFiltersFields: itemFiltersFields});

    }


  RemoveSelectedDietary(id){

    let dietaryArray = this.state.DietaryArray;
    let filteredDietaryArr = this.state.FilteredDietary;
    let itemFiltersFields = this.state.ItemFiltersFields;

        let index =  Utilities.GetObjectArrId(id,this.state.Dietary);
        filteredDietaryArr.push(this.state.Dietary[index]);
      
        index =  Utilities.GetObjectArrId(id,dietaryArray);
        if (index > -1){ 
          dietaryArray.splice(index, 1);
      
      
        filteredDietaryArr.sort(Utilities.SortByName);


        let dietaryCsv = this.CreateItemDietaryCsv(dietaryArray);     
        itemFiltersFields.Dietary = dietaryCsv;

        this.setState({DietaryArray: dietaryArray,FilteredDietary: filteredDietaryArr, ItemFiltersFields: itemFiltersFields});
      }
  }


  RenderMetaItems = (metaItems) => {

    let html = [];

    if(metaItems.length === 0) {
      return;
    }

     for (var i=0; i < metaItems.length;i++){

       html.push(this.MetaItemHtml(metaItems[i]));
     }
   
     return(       
           <tbody>{html.map((metaItem) => metaItem)} </tbody>
     )
   
   }

   DietaryHtml(dietary){

    return (
      // <span>{dietary.Id}</span>
      <a>{dietary.Name}<span onClick={() => this.RemoveSelectedDietary(dietary.Id)}><i className="fa fa-times"></i></span></a>

      
    )

   }

  RenderItemDietary(dietaryArray){


  let html = [];

  if(dietaryArray.length === 0) {
    return;
  }
  for (var i=0; i < dietaryArray.length;i++){
    html.push(this.DietaryHtml(dietaryArray[i]));
  }

  return(       
        <div className="dietary-wrap">{html.map((metaItem) => metaItem)} </div>
  )

}


  toggleItemsConfirmationModal= () => {
    this.setState({
      modalMoveItem: !this.state.modalMoveItem,
    })
  }

  toggleMoveModal= () => {
    this.setState({
      modalMove: !this.state.modalMove,
    })
  }

  toggleModal = () => {
    this.setState({
      showMultipleImageModal: !this.state.showMultipleImageModal
    })
    this.SetActiveTab(0)
  }
  toggleFileModal = () => {
    this.setState({
      showMultipleFilesModal: !this.state.showMultipleFilesModal
    })
    this.SetActiveTab(0)
  }
  toggleViewImageModal = (photoName,id,name) => {
    this.setState({
      viewImageModal: !this.state.viewImageModal,
      SelectedProductOptionPhotoName:photoName,
      SelectedProductOptionName: name,
      SelectedProductOptionId: id,
    })
  }
  
  toggleHTMLEditorModal = () => {
    this.setState({
      htmlEditor: !this.state.htmlEditor
    })
  }

  onEditorStateChange = (htmlEditorState) => {
    this.setState({
      htmlEditorState,
    });
  };
  opemHTMLeditorModel() {
    if (!this.state.htmlEditor) {
      return ('');
    }

    return (

      <Modal isOpen={this.state.htmlEditor} toggle={this.toggleHTMLEditorModal} className={this.props.className}>
        <ModalHeader toggle={this.toggleHTMLEditorModal}>{"HTML Editor"}</ModalHeader>
        <ModalBody>

          <div>
            <Editor
              editorState={this.state.htmlEditorState}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              onEditorStateChange={this.onEditorStateChange}
            />
            <textarea
              style={{ width: '100%' }}
              disabled
              value={draftToHtml(convertToRaw(this.state.htmlEditorState.getCurrentContent()))}
            />
          </div>

          {/* <Editor
            editorState={this.state.htmlEditorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={this.onEditorStateChange}
          /> */}


        </ModalBody>
        <ModalFooter>

          <Button color="secondary" onClick={(e) => this.toggleHTMLEditorModal()}>Cancel</Button>
          {this.state.image !== null && <Button color="primary" style={{ marginRight: 10 }} onClick={(e) => this.saveHtmlEditorText()}>Save</Button>}
        </ModalFooter>
      </Modal>
    )
  }
  GenerateMoreFilesModel() {
    if (!this.state.showMultipleFilesModal) {
      return ('');
    }

    return (

      <Modal isOpen={this.state.showMultipleFilesModal} toggle={this.toggleFileModal} className={this.props.className}>
        <ModalHeader toggle={this.toggleFileModal}>{"Upload Multiple Files"}</ModalHeader>
        <ModalBody>
        <Tabs>
            <TabList>
              <Tab key={0} onClick={(e) => this.SetActiveTab(0)}><span className="hidden-sm-up"><i className="fa fa-picture-o" aria-hidden="true"></i></span><span className="hidden-xs-down">Current Files</span></Tab>
              <Tab key={1} onClick={(e) => this.SetActiveTab(1)}><span className="hidden-sm-up"><i className="fa fa-upload" aria-hidden="true"></i></span><span className="hidden-xs-down">Upload Files</span></Tab>
            </TabList>
            <TabPanel>
              <div className="modal-media-library-wrap">
                {
                  this.state.allCurrentFiles.length > 0 ?
                    <div>{this.horizontalFilesWrap()}</div>
                    :
                    <div>
                      No Files avaiable
                </div>
                }
              </div>
            </TabPanel>
            <TabPanel>
              <div id="logo-upload-image" className="upload-image-wrap-new">
                <div className="upload-dragdrop-wrap" id="logoDragImage">
                {this.MyFileUploader(true)}
                </div>
                <div className="crop-image-main-wrap ">
                </div>
              </div>
            </TabPanel>
          </Tabs>
          <div className="popup-web-body-wrap-new" style={{display:'none'}}>
            <div id="logo-upload-image" className="upload-image-wrap-new">
              <div className="upload-dragdrop-wrap" id="logoDragImage">
                {/* <div>
                {/* <ImageUploader
                label={"Max file size: 5mb, accepted:" + this.state.ImageExtension}
                buttonText='Choose images'
                onChange={this.onDrop}
                maxFileSize={5242880}
                fileSizeError='file size is too big'
                accept={this.state.ImageExtension}
                withPreview={true}
                singleImage={true}
                buttonClassName={this.state.FileTypeErrorMessage =='' && this.state.image ==null ? "":'hide-choose-btn'}
                /> 

                </div> */}
                {/* <MyUploader /> */}
                {this.MyFileUploader(true)}

              </div>
              <div className="crop-image-main-wrap ">
              </div>

            </div>
            {/* {this.state.FileTypeErrorMessage == '' ? '' :
              <div className="alert alert-danger" role="alert">
                {this.state.FileTypeErrorMessage}
              </div>
            } */}
          </div>

        </ModalBody>
        <ModalFooter>

          <Button color="secondary" onClick={(e) => this.toggleFileModal()}>Cancel</Button>
          {this.state.image !== null &&  this.state.ActiveTab == 1 && <Button disabled={this.state.disbaleSaveForFiles} color="primary" style={{ marginRight: 10 }} onClick={(e) => this.saveMoreFiles()}>Save</Button>}
        </ModalFooter>
      </Modal>
    )
  }

  changeTab = (value) =>{
    this.setState({
      moreImagesActiveTab: value
    })
  }

  horizontalImagesWrap = () => {
    var htmlImages = []
    for (let index = 0; index < this.state.allCurrentImages.length; index++) {
      htmlImages.push(
        <div className="photo-label" style={{ paddingBottom: 0 }}>
          <div style={{ position: 'relative' }}>
            <span className="cross-image" onClick={()=> this.deleteImage(this.state.allCurrentImages[index])}>×</span>
            <img style={{ marginBottom: 0 }} src={this.state.allCurrentImages[index].imageUrl} alt="000005979_Margherita.jpg" />
          </div>
        </div>
      )
      
    }
    return (
      <div className="photo-library-wrap">
        {
          htmlImages
        }
      </div>
    )
  }

  openNewWindow =(file) =>{
    window.open(file.url)
  }
  
  horizontalFilesWrap = () => {
    var htmlFiles = []
    for (let index = 0; index < this.state.allCurrentFiles.length; index++) {
      htmlFiles.push(
        <div className="photo-label" style={{ paddingBottom: 0 }} onClick={()=>{
          this.openNewWindow(this.state.allCurrentFiles[index])
        }}>
          <div style={{ position: 'relative' }}>
            <span className="cross-image" onClick={() => this.deleteImage(this.state.allCurrentFiles[index])}>×</span>
            {/* <img style={{ marginBottom: 0 }} src={this.state.allCurrentFiles[index].imageUrl} alt="000005979_Margherita.jpg" /> */}
            {
              String(this.state.allCurrentFiles[index].fileName).includes('.pdf') ?
              <>
                <img style={{ marginBottom: 0 }} src={require('../../assets/img/brand/pdfDocument.png')} alt="000005979_Margherita.jpg" />
                <div>{this.state.allCurrentFiles[index].fileName}</div>
                </>
                :
                <img style={{ marginBottom: 0 }} src="https://cdn.superme.al/s/shoply/images/000/163/000163068_UTB8.lRsXHPJXKJkSafSq6yqUXXaR.jpg_640x64.jpg" alt="000005979_Margherita.jpg" />
            }
          </div>
        </div>
      )

    }
    return (
      <div className="photo-library-wrap">
        {
          htmlFiles
        }
      </div>
    )
  }
 
//zz
  GenerateMoreImagesModel() {
    if (!this.state.showMultipleImageModal) {
      return ('');
    }

    return (

      <Modal isOpen={this.state.showMultipleImageModal} size="lg" toggle={this.toggleModal} className={this.props.className}>
        <ModalHeader toggle={this.toggleModal}>{"Upload Multiple Image"}</ModalHeader>
        <ModalBody>
          <Tabs>
            <TabList>
              <Tab key={0} onClick={(e) => this.SetActiveTab(0)}><span className="hidden-sm-up"><i className="fa fa-picture-o" aria-hidden="true"></i></span><span className="hidden-xs-down">Current Images</span></Tab>
              <Tab key={1} onClick={(e) => this.SetActiveTab(1)}><span className="hidden-sm-up"><i className="fa fa-upload" aria-hidden="true"></i></span><span className="hidden-xs-down">Upload photos</span></Tab>
            </TabList>
            <TabPanel>
              <div className="modal-media-library-wrap">
                {
                  this.state.allCurrentImages.length > 0 ?
                    <div>{this.horizontalImagesWrap()}</div>
                    :
                    <div>
                      No images avaiable
                </div>
                }
              </div>
            </TabPanel>
            <TabPanel>
              <div id="logo-upload-image" className="upload-image-wrap-new">
                <div className="upload-dragdrop-wrap" id="logoDragImage">
                  {this.MyUploader(true)}
                </div>
                <div className="crop-image-main-wrap ">
                </div>
              </div>
            </TabPanel>
          </Tabs>
          <div className="popup-web-body-wrap-new" style={{ display: 'none' }}>
            {/* <div style={{ flexDirection: 'row', paddingBottom: 10 }}>
              <Button style={{ color: this.state.moreImagesActiveTab == '1' ? '#fff' : 'black', marginRight: 10, backgroundColor: this.state.moreImagesActiveTab == '1' ? '#2962ff' : '#fff' }} onClick={() => this.changeTab('1')}>
                Current Images
                </Button>
              <Button style={{ color: this.state.moreImagesActiveTab == '2' ? '#fff' : 'black', backgroundColor: this.state.moreImagesActiveTab == '2' ? '#2962ff' : '#fff' }} onClick={() => this.changeTab('2')}>
                More Images
                </Button>
            </div> */}
            {/* <Button color="secondary" onClick={(e) => this.toggleModal()}>Cancel</Button> */}
            {this.state.moreImagesActiveTab == '1' ?
              <div>
                No current images found
              </div>
              :
              <div id="logo-upload-image" className="upload-image-wrap-new">
                <div className="upload-dragdrop-wrap" id="logoDragImage">
                  {/* <div>
                {/* <ImageUploader
                label={"Max file size: 5mb, accepted:" + this.state.ImageExtension}
                buttonText='Choose images'
                onChange={this.onDrop}
                maxFileSize={5242880}
                fileSizeError='file size is too big'
                accept={this.state.ImageExtension}
                withPreview={true}
                singleImage={true}
                buttonClassName={this.state.FileTypeErrorMessage =='' && this.state.image ==null ? "":'hide-choose-btn'}
                /> 

                </div> */}
                  {/* <MyUploader /> */}
                  {this.MyUploader(true)}

                </div>
                <div className="crop-image-main-wrap ">
                </div>

              </div>
            }

            {/* {this.state.FileTypeErrorMessage == '' ? '' :
              <div className="alert alert-danger" role="alert">
                {this.state.FileTypeErrorMessage}
              </div>
            } */}
          </div>

        </ModalBody>
        <ModalFooter>

          <Button color="secondary" onClick={(e) => this.toggleModal()}>Cancel</Button>
          {this.state.image !== null && this.state.ActiveTab == 1 && <Button disabled={this.state.disbaleSaveForImages} color="primary" style={{ marginRight: 10 }} onClick={(e) => this.saveMoreImages()}>Save</Button>}
        </ModalFooter>
      </Modal>
    )
  }


GenerateMetaItemsList() {

  return(
				<Modal isOpen={this.state.modalMove} toggle={this.toggleMoveModal} className="modal-md table-set-modal">
				<ModalHeader toggle={this.toggleMoveModal}>Select Product to move Articles
				</ModalHeader>
				<ModalBody className="padding-0">
					<AvForm>
          <div className="padding-20">
					<div className="m-b-10" style={{ position: 'relative', float: 'left', width: '100%' }}>
						<input type="text" className="form-control common-serch-field" placeholder="Search List" style={{ paddingleft: '30px' }} value={this.state.SearchMetaItemText} onChange={(e) => this.SearchMetaItem(e)}/>
						<i className="fa fa-search" aria-hidden="true" style={{ position: 'absolute', top: '11px', left: '12px', color: '#777' }}></i>
						{this.state.IsMetaItemSearching ? <span onClick={() => this.CancelMetaItemSearch()}><i className="fa fa-times" style={{ position: 'absolute', top: '11px', color: '#777', right: '15px' }}></i></span> : ""}
					</div>
			  <div className="inner-table-scroll">
					<Table>
						<thead>
							<tr>
								<th style={{display: 'none'}}></th>
							</tr>
						</thead>
							{this.RenderMetaItems(this.state.FilteredMetaItems)}
					</Table>
				</div>
</div>

						
					</AvForm>
				</ModalBody>
        <ModalFooter>

        <div className="bottomBtnsDiv" style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', marginRight: '10px' }}>
        <Button color="secondary" style={{ marginRight: 10 }} onClick={() => this.toggleMoveModal()}>Cancel</Button>
        </div>
      </ModalFooter>
			</Modal>
	 )
  }


  GenerateMoveItemsConfirmationModal() {

    return(
      <Modal isOpen={this.state.modalMoveItem} toggle={this.toggleItemsConfirmationModal}  className={this.props.className}>
      <ModalHeader toggle={this.toggleItemsConfirmationModal}>Move Articles</ModalHeader>
      <ModalBody>
       <p> Do you want to move selected Articles to {this.state.SelectedMetaItemName}? </p>
      </ModalBody>
      <ModalFooter>
        {/* <Button color="primary" onClick={(e) => this.PublishedUnPublished()}>Publish</Button> */}

        <div className="bottomBtnsDiv" style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', marginRight: '10px' }}>

<Button color="secondary" style={{ marginRight: 10 }} onClick={() => this.toggleItemsConfirmationModal()}>Cancel</Button>
{/* <Button color="success" >Save</Button> */}
<Button onClick={(e) => this.MoveItemToOtherMeta()} color="primary" className="btn waves-effect waves-light btn-primary pull-right">
{this.state.IsSaving ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
: <span className="comment-text">Move</span>}
</Button>
</div>

      </ModalFooter>
</Modal>
    )



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
                <Label htmlFor="categoryName" className="control-label">Catalogue name</Label>
                <AvField errorMessage="This is a required field" value={Object.keys(this.state.CategoryAction).length === 0 ? "" : Utilities.SpecialCharacterDecode(this.state.CategoryAction.Name)} name="categoryName" type="text" className="form-control" required />
              </FormGroup>
              <FormGroup className="modal-form-group">
                <Label htmlFor="description" className="control-label">Description</Label>
                <AvField errorMessage="This is a required field" name="description" type="textarea" value={Object.keys(this.state.CategoryAction).length === 0 ? "" : Utilities.SpecialCharacterDecode(this.state.CategoryAction.Description)} className="form-control" />
              </FormGroup>
              {/* <FormGroup className="modal-form-group">
                <Label htmlFor="CategoryTopping" className="control-label">Select Toppings</Label>
               
                <select className="select2 form-control custom-select"  name="CategoryTopping" onChange={(e) => this.handleSelectOptions(e,'t')} style={{ width: '100%', height: '36px' }}> 
                  <option key={0} value="0" selected={this.state.CategoryAction.Id === undefined}>No Topping</option>
                  <option key={-1} value="-1" selected={this.state.CategoryAction.Id !== undefined}>Don't Change</option>
                  {this.state.ToppingGroup.map((topping) =>  <option key={topping.Id} value={topping.Id}>{topping.Name}</option> )}
                 </select>

              </FormGroup>
              <FormGroup className="modal-form-group">
                <Label htmlFor="categoryExtras" className="control-label">Select Extras</Label>

                <select className="select2 form-control custom-select"  name="categoryExtras" onChange={(e) => this.handleSelectOptions(e,'e')} style={{ width: '100%', height: '36px' }}> 
                <option key={0} value="0" selected={this.state.CategoryAction.Id === undefined }>No Extras</option>
                <option key={-1} value="-1" selected={this.state.CategoryAction.Id !== undefined}>Don't Change</option>
                {this.state.ExtrasGroup.map((extra) => <option key={extra.Id} value={extra.Id}>{extra.Name}</option> )}
                 </select>



              </FormGroup> */}

              <FormGroup className="modal-form-group">
                <Label htmlFor="CategoryFoodType" className="control-label">Choose Category</Label>

                
                <select className="select2 form-control custom-select"  name="CategoryFoodType" onChange={(e) => this.handleSelectOptions(e,'f')} style={{ width: '100%', height: '36px' }}> 
                {Object.keys(this.state.CategoryAction).length !== 0 && <option key={-1} value="-1">Don't Change</option> }
                {this.state.FoodTypes.map((tags) => <option key={tags.Id} value={tags.Id}>{tags.Name}</option>)}
               </select>

              </FormGroup>
<div  className="menu-ch" style={{ display: 'flex'}}>      
      <FormGroup className="modal-form-group items-check-boxes" style={{ display: 'flex'}}>
             <AvField type="Checkbox" className="form-checkbox"  checked={this.state.IsDeal} onChange={(e) => this.hadleCategoryChecks(e,'D')} name="chkIsDeal">
                </AvField>
                <Label htmlFor="chkIsDeal" className="control-label" style={{cursor:'pointer'}}>Deal</Label>
             
            </FormGroup>

             <FormGroup className="modal-form-group items-check-boxes"  style={{ display: 'flex'}}>
             <AvField type="Checkbox" className="form-checkbox"  checked={this.state.IsBuffet} onChange={(e) => this.hadleCategoryChecks(e,'B')} name="chkIsBuffet">
                </AvField>
                <Label htmlFor="chkIsBuffet" className="control-label" style={{cursor:'pointer'}}>Buffet</Label>
             
            </FormGroup>

  </div>

  <div  className="menu-ch" style={{ display: 'flex'}}>   
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
              <Button color="secondary" onClick={() => this.CategoryModelShowHide({})}>Cancel</Button>
              <Button color="primary" >
              {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                             : <span className="comment-text">Save</span>}
            
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
        <ModalHeader>Sort Articles</ModalHeader>
        <ModalBody>
          <div className="m-b-15">Use mouse or finger to drag Articles and sort their positions.</div>
          <div className="sortable-wrap sortable-item sortable-new-wrap">

            <SortableContainer
              items={this.state.SortProducts}
              onSortEnd={this.onProductSortEnd}
              hideSortableGhost={true} >

            </SortableContainer>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => this.SortProductModal()}>Cancel</Button>
          <Button color="primary" onClick={() => this.UpdateProductSort()}>
          {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                             : <span className="comment-text">Save</span>}
            
            </Button> 
        </ModalFooter>
      </Modal>

    )

  }


  //#endregion


  componentDidMount() {

    this.GetAllBrands();
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
    this.GetGalleryPhotos();


    window.addEventListener('scroll', () => {
      const istop = window.scrollY < 350;

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


  CancelMetaItemSearch(){
    
    this.setState({ 
      FilteredMetaItems: this.state.MetaItems ,
      SearchMetaItemText: "",
      IsMetaItemSearching: false
    
    });

  }

  shouldComponentUpdate() {
    return true;
  }


  //#region Page view html 

  render() {
    // var shown = { display: this.state.shown ? "block" : "none" };

    //var hidden = { display: this.state.shown ? "none" : "block" };

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

      <div className={this.state.scrolled ? 'menu-page-wrap affix' : 'menu-page-wrap affix-top'} >
        <div className="menu-left-penal" >
          <div className="cat-heading-wrap">
            <h2 className="common-heading">Catalogues</h2>
            <span className="add-cat-btn" onClick={() => this.CategoryModelShowHide({})}>
              <i className="fa fa-plus" aria-hidden="true"></i> <span className="hide-in-responsive">New</span>
            </span>

          </div>
          <div className="select-cat-btn-res" onClick={() => this.leftpenal()}>
            <span>
              {this.state.SelectedCategoryName}
            </span>
            <span className="change-cat-modal">
              Change
              <span>Catalogue</span>
            </span>
          </div>
          {ModalDiv ? (
            <Modal isOpen={this.state.left} className={this.props.className}>
              <ModalHeader ><i className="fa fa-chevron-left cat-back-btn" onClick={() => this.leftpenal()}> </i> Select Catalogue</ModalHeader>
              <ModalBody className="menu-page-wrap">
                <div className=" menu-left-penal ">
                  <div className="categorie-check-box-wrap">
                    <div>
                      <input type="checkbox" className="form-checkbox" id="Active" checked={this.state.activeCategoryCheck ? "checked" : ""} onChange={() => this.handleActiveCategoryCheck()} />
                      <label className="settingsLabel" htmlFor="Active">Active</label>
                    </div>
                    <div>
                      <input type="checkbox" className="form-checkbox" id="Inactive" checked={this.state.inActiveCategoryCheck ? "checked" : ""} onChange={() => this.handleInActiveCategoryCheck()} />
                      <label className="settingsLabel" htmlFor="Inactive">Inactive</label>
                    </div>
                    <div className="menu-sort-link" onClick={() => this.SortModal()}>
                      <i className=" fa fa-sort-amount-asc" aria-hidden="true"></i>Sort Catalogue</div>
                  </div>
                  <div className="m-b-20 m-t-20 search-item-wrap"  style={{ position: 'relative' }}>
                    <input type="text" className="form-control common-serch-field"   placeholder="Search Catalogues" value={this.state.SearchCategoryText} onChange={(e) => this.SearchCategory(e.target.value)} />
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
                      <h4 className="modal-title">Select Catalogue</h4>
                      <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                    </div>
                    <div className={classModalBody}>
                      <div className="categorie-check-box-wrap">
                        <div>
                          <input type="checkbox" className="form-checkbox" id="chkActiveCategory" checked={this.state.activeCategoryCheck ? "checked" : ""} onChange={() => this.handleActiveCategoryCheck()} />
                          <label className="settingsLabel" htmlFor="chkActiveCategory">Active</label>
                        </div>
                        <div>
                          <input type="checkbox" className="form-checkbox" id="chkInActiveCategory" checked={this.state.inActiveCategoryCheck ? "checked" : ""} onChange={() => this.handleInActiveCategoryCheck()} />
                          <label className="settingsLabel" htmlFor="chkInActiveCategory">Inactive</label>
                        </div>
                        <div className="menu-sort-link" onClick={() => this.SortModal()}>
                          <i className=" fa fa-sort-amount-asc" aria-hidden="true"></i>Sort Articles</div>
                      </div>
                      <div className="m-b-20 m-t-20 search-item-wrap" style={{ position: 'relative' }}>
                        <input type="text" className="form-control common-serch-field" placeholder="Search Catalogues" value={this.state.SearchCategoryText} onChange={(e) => this.SearchCategory(e.target.value)} />
                        <i className="fa fa-search" aria-hidden="true" ></i>
                      { this.state.IsCategorySearching ?  <span className="cross-add-search"  onClick={() => this.CancelCategorySearch()} >
     	                  <i className="fa fa-times" aria-hidden="true" ></i>
                      </span> : ""}
                      </div>

                      {this.LoadCategories(this.state.FiltersMenuCategory)}

                    </div>
                    <div className={classModalFooter}>
                      <button type="button" className="btn btn-default waves-effect" data-dismiss="modal">Cancel</button>
                      <button type="button" className="btn btn-success waves-effect" >Save</button>
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
                          <span className="list-item-d" onClick={(e) => this.itemImageModal(this.state.SelectedCategory.Name, 0, true)}>
                            <i className="fa fa-picture-o" aria-hidden="true"></i>
                            <span className="common-cat-icon-span">Change Photo</span>
                          </span>
                          <span className="list-item-d" onClick={() => this.CategoryModelShowHide(this.state.SelectedCategory)}>
                            <i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Edit"></i>  <span className="common-cat-icon-span">Edit</span>
                          </span>
                          <span className="sa-warning list-item-d" onClick={() => this.DeleteCategoryConfirmation(this.state.SelectedCategory.Id, this.state.SelectedCategory.Name)} >
                            <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="Remove" data-placement="top" data-original-title="Remove"></i>
                            <span className="common-cat-icon-span">Delete</span>
                          </span>
                          <span className="sa-suspended list-item-d" onClick={() => this.ActivateDeactivateConfirmation(this.state.SelectedCategory.IsPublished, this.state.SelectedCategory.Name)} title={this.state.SelectedCategory.IsPublished === true ? 'Inactive' : 'Activate'}>
                            <i className="fa fa-ban" aria-hidden="true" data-toggle="tooltip" data-placement="top" data-original-title="Disable"></i>
                            <span className="common-cat-icon-span">{this.state.SelectedCategory.IsPublished === true ? 'Inactive' : 'Activate'}</span>
                          </span>
                        </span>
            </div>
            <div className="res-ponsive-cate">

              <div>
                <span className="more-button-toggle" onClick={(e) => this.ShowMenu(e)}><i style={{ fontSize: '30px' }} className="fa fa-ellipsis-v"></i><span style={{ cursor: 'pointer' }}>Options</span></span>
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
                          <span className="list-item-d" onClick={(e) => this.itemImageModal(this.state.SelectedCategory.Name, 0, true)}>
                            <i className="fa fa-picture-o" aria-hidden="true"></i>
                            <span className="common-cat-icon-span">Change Photo</span>
                          </span>
                          <span className="list-item-d" onClick={() => this.CategoryModelShowHide(this.state.SelectedCategory)}>
                            <i className="fa fa-pencil-square-o" aria-hidden="true" data-toggle="tooltip" title="" data-placement="top" data-original-title="Edit"></i>  <span className="common-cat-icon-span">Edit</span>
                          </span>
                          <span className="sa-warning list-item-d" onClick={() => this.DeleteCategoryConfirmation(this.state.SelectedCategory.Id, this.state.SelectedCategory.Name)} >
                            <i className="fa fa-trash" aria-hidden="true" data-toggle="tooltip" title="Remove" data-placement="top" data-original-title="Remove"></i>
                            <span className="common-cat-icon-span">Delete</span>
                          </span>
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
                  Articles
               </div>

                </div>

            
                <span className="add-cat-btn" onClick={() => this.ProductModalShowHide({})}>
                  <i className="fa fa-plus" aria-hidden="true"></i>
                  <span className="hide-in-responsive">Add Articles</span>
                </span>

              </div>
              <div className="shoply-btn-wrap">
                <div className="btn-inner-wrap">
                  <div className="items-check-boxes">
                    <div className="categorie-check-box-wrap">
                      <div>
                        <input type="checkbox" className="form-checkbox" id="chkActiveProduct" checked={this.state.activeProductCheck ? "checked" : ""} onChange={() => this.handleActiveProductCheck()} />
                        <label className="settingsLabel" htmlFor="chkActiveProduct">Active</label>
                      </div>
                      <div>
                        <input type="checkbox" id="chkInactiveProduct" className="form-checkbox" checked={this.state.inActiveProductCheck ? "checked" : ""} onChange={() => this.handleInActiveProductCheck()} />
                        <label className="settingsLabel"  htmlFor="chkInactiveProduct">Inactive</label>
                      </div>
                    </div>
                  </div>
                  <div className="menu-sort-link m-sort-item" onClick={() => this.SortProductModal()}>
                    <i className=" fa fa-sort-amount-asc" aria-hidden="true"></i>Sort Products</div>
                    {/* <div className="menu-sort-link m-sort-item" onClick={() => this.moreImagesModal()}>
                  <i className=" fa fa-sort-amount-asc" aria-hidden="true"></i>More Images</div>
                <div className="menu-sort-link m-sort-item" onClick={() => this.moreFilesModal()}>
                  <i className=" fa fa-sort-amount-asc" aria-hidden="true"></i>More Files</div>
                <div className="menu-sort-link m-sort-item" onClick={() => this.htmlEditorModal()}>
                  <i className=" fa fa-sort-amount-asc" aria-hidden="true"></i>HTML editor</div> */}

                  {this.state.SelectedMetaItems.length > 0 ? <div>

                    <Button color="primary" onClick={(e) => this.setState({ modalMove: true })}>
                      <span>Move to</span>
                    </Button>
                    {/* {this.RenderItemSelectionDropDown()} */}
                  </div> : <Button disabled={true} color="secondary"><span>Move to</span></Button>}
                </div>
                <div className="search-item-wrap">
                  <input type="text" className="form-control common-serch-field" placeholder="Search Articles" value={this.state.SearchProductText} onChange={this.SearchProduct} />
                  <i className="fa fa-search" aria-hidden="true" ></i>
                  {this.state.IsProductSearching ? <span className="cross-add-search" onClick={() => this.CancelProductSearch()}>
                    <i className="fa fa-times" aria-hidden="true" ></i>
                  </span> : ""}
                </div>
              </div>
          

          <p className="separator">
            <span></span>
          </p>

           {this.RenderRightProductPanel(this.state.FilterProducts)}
              </div>    }      
        </div>
     

        <Modal isOpen={this.state.itemImage} toggle={(e) => this.itemImageModal()} size="lg">
          <ModalHeader toggle={(e) => this.itemImageModal()}>Change <span className="bold">{this.state.SelectedMenuMetaName}</span> photo</ModalHeader>
          <ModalBody>
            <Tabs>
              <TabList>
                <Tab key={0} onClick={(e) => this.SetActiveTab(0)}><span className="hidden-sm-up"><i className="fa fa-upload" aria-hidden="true"></i></span><span className="hidden-xs-down">Upload photo</span></Tab>
                <Tab key={1} onClick={(e) => this.SetActiveTab(1)}><span className="hidden-sm-up"><i className="fa fa-picture-o" aria-hidden="true"></i></span><span className="hidden-xs-down">Choose from media library</span></Tab>
              </TabList>

              <TabPanel>
                <div className="popup-web-body-wrap">
                  <div className="file-upload-btn-wrap position-relative">
                    <div className="fileUpload">
                      <span>Choose a file</span>
                      <input type="file" accept="image/*" id="logoUpload" className="upload"
                        onChange={(e) => this.onFileChange(e)} />
                    </div>
                  </div>

                  <div id="upload-image" className="upload-image-wrap" >
                    <div className="upload-dragdrop-wrap" id="dragImage">
                      <div className="dragdrop-icon-text-wrap">PREVIEW ONLY</div>
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
                    <span className="control-label">Select Group</span>
                    <span>
                      <select className="form-control custom-select" value={this.state.SelectedPhotoGroup} onChange={(e) => this.ChangeGroupHandler(e.target.value)} data-placeholder="Choose a Catalogue" tabindex="1" >
                        {this.LoadGalleryGroup(this.state.GalleryPhotos)}
                      </select>
                    </span>
                  </div>
                  <div className="search-photo-wrap">
                    <span className="control-label">Search photo
                                    </span>
                    <span>
                      <input type="text" className="form-control" placeholder="Photo name or tag"   onChange={this.SearchPhoto} />
                    </span>
                  </div>
                  <div className="photo-library-wrap">

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

            <Button color="secondary" onClick={(e) => this.itemImageModal()}>Cancel</Button>
            {this.state.Image !== null || (this.state.ActiveTab === 1 && this.state.SeletedItemPhoto) ? 
            
            <Button color="primary" onClick={(e) => this.UpdateItemMetaPhoto()}>
            {this.state.IsSave ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                             : <span className="comment-text">Add</span>}
            
            </Button> : ""}
          </ModalFooter>
        </Modal>

        <Modal size="md" isOpen={this.state.viewImageModal } backdrop={'static'} toggle={this.toggleViewImageModal}  className={this.props.className}>
        <ModalBody>
        {this.state.SelectedProductOptionPhotoName === "" ?  '' :
              <div>
                     <img src={Utilities.generatePhotoLargeURL(this.state.SelectedProductOptionPhotoName, true, false).replace("images", "cropped-images")} style={{width:'100%'}}/>    
             </div>
              
            }

        </ModalBody>
        <ModalFooter style={{padding:'10px 15px' }}>
        <Button color="primary" onClick={(e) => this.itemImageModal(this.state.SelectedProductOptionName, this.state.SelectedProductOptionId, false, this.state.SelectedProductOptionPhotoName)}>
           Change image
          </Button> 
<Button color="secondary" onClick={(e) => this.toggleViewImageModal()}>Cancel</Button>

</ModalFooter>
 </Modal>
        {this.GenerateSweetConfirmationWithCancel()}
        {this.GenerateSweetAlert()}
        {this.GenerateSweetAlertForMoreImages()}
        {this.GenerateSweetAlertForMoreFiles()}
        {this.GenerateProductModal(this.state.selectedProductInAction)}
        {this.GenerateCategorySortModel()}
        {this.GenerateProductSortModel()}
        {this.GenerateProductOptionModel(this.state.ProductandOptionAction)}
        {this.GenerateCategoryModel()}
        {this.GenerateMoveItemsConfirmationModal()}
        {this.GenerateMetaItemsList()}
        {this.GenerateMoreImagesModel()}
        {this.GenerateMoreFilesModel()}
        {this.opemHTMLeditorModel()}

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

export default ShoplyMenu;
