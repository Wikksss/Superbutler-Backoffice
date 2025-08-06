import React, { Fragment } from "react";
import {
  FormGroup,
  Label,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import SweetAlert from "sweetalert-react"; // eslint-disable-line import/no-extraneous-dependencies
import Loader from "react-loader-spinner";
import ReactTooltip from "react-tooltip";
import { AvForm, AvField } from "availity-reactstrap-validation";
import Config from "../../helpers/Config";
import Constants from "../../helpers/Constants";
import * as Utilities from "../../helpers/Utilities";
import * as PhotoDictionaryService from "../../service/PhotoDictionary";
import * as ProductService from "../../service/Product";
import * as DepartmentService from "../../service/Department";
import * as EnterpriseUsers from "../../service/EnterpriseUsers";
import * as SupportTypeService from "../../service/SupportType";
import * as EnterpriseMenuService from "../../service/EnterpriseMenu";
import "react-tabs/style/react-tabs.css";
import "sweetalert/dist/sweetalert.css";
import { SetMenuStatus } from "../../containers/DefaultLayout/DefaultHeader";
import Labels from "../../containers/language/labels";
import SelectSearch, { fuzzySearch } from "react-select-search";
import "react-select-search/style.css";
import { FaCheck } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import Avatar from "react-avatar";
import * as Enterprise from "../../service/Enterprise";

const NumberValidation = (value, ctx) => {
  if (!Utilities.IsNumber(value) && Number(value) !== -1) {
    return "Invalid value";
  }
  return true;
};

const NonZeroNumberValidation = (value, ctx) => {
  if (!Utilities.IsNumber(value) && Number(value) != -1 && Number(value)) {
    return "Invalid value";
  } else if (Number(value) < 1) {
    return "Count cannot be less then 1";
  }

  return true;
};

class SupportTypes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Categories: [],
      ShowLoaderRightPanel: true,
      ShowLoaderLeftPanel: true,
      Products: [],
      FilterProducts: [],
      SelectedCategoryId: 0,
      SelectedProduct: {},
      SelectedCategory: {},
      CategoryAction: {},
      ProductandOptionAction: {},
      SelectedCategoryName: "",
      SortCategoriesIdCsv: "",
      showDeleteConfirmation: false,
      showAlert: false,
      alertModelText: "",
      alertModelTitle: "",
      deleteConfirmationModelText: "",
      deleteComfirmationModelType: "",
      activeCategoryCheck: true,
      selectedProductInAction: {},
      selectedProductTimingTitle: "",
      selectedProductOptionInAction: {},
      ToppingGroup: [],
      ExtrasGroup: [],
      Days: [],
      inActiveCategoryCheck: true,
      activeProductCheck: true,
      inActiveProductCheck: true,
      productOptionModal: false,
      CategoryModel: false,
      departmentModal: false,
      isEdit: false,
      ModelHeaderTitle: "",
      ProductModal: false,
      WorkingHourCSV: "",
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
      posLoader: false,
      userObject: {},
      ActiveTab: 0,

      Sort: false,
      left: false,
      scrolled: false,
      IsBuffet: false,
      HideFromPlatform: false,
      HideFromWhiteLabel: false,
      MenuAddonGroupToppingId: 0,
      MenuAddonExtraGroupId: 0,
      MenuCategoryTagId: 0,
      OptionMenuAddonGroupId: 0,
      OptionMenuAddonExtraGroupId: 0,
      OptionFoodTypeIdCsv: "0",
      SearchCategoryText: "",
      SearchProductText: "",
      IsSave: false,
      SortProducts: [],
      SortProductsIdCsv: "",
      ProductSort: false,
      viewImageModal: false,

      IsCategorySearching: false,
      IsProductSearching: false,
      SelectedMetaItemPhotoName: "",
      currencySymbol: Config.Setting.currencySymbol,
      departments: [],
      supportTypes: [],
      selectedDepartment: "",
      departmentName: "",
      departmentId: 0,
      chooseDepartmentId: 0,
      resolvedTimeLabel: "mins",
      resolvedTime: "",
      supportTypeName: "",
      supportTypeDescription: "",
      supportTypeId: 0,
      departmentReferencId: "",
      supportTypeReferencId: "",
      supportTypeModal: false,
      isSupportTypeEdit: false,
      loading: true,
      loadingSupportType: true,
      usersList: [],
      userData: [],
      selectedUsersCsv: "",
      selectedUser: [],
      supportTypeCount: 1,
      options: [
        {
          name: "Electrician",
          value: "LY",
        },
        {
          name: "Plumber",
          value: "LI",
        },
      ],
      knowledgebaseLoader: false,
      isSystemAdmin: false,
    };

    //#region button binding
    this.ProductOptionShowModal = this.ProductOptionShowModal.bind(this);
    this.ProductOptionHideModal = this.ProductOptionHideModal.bind(this);
    this.departmentModalHideShow = this.departmentModalHideShow.bind(this);

    this.EditProductModal = this.EditProductModal.bind(this);
    this.leftpenal = this.leftpenal.bind(this);
    this.GetDepartmentss();
    this.GetUsers();
    //#endregion

    if (
      !Utilities.stringIsEmpty(
        localStorage.getItem(Constants.Session.ADMIN_OBJECT)
      )
    ) {
      this.state.isSystemAdmin = true;
    }

    if (
      !Utilities.stringIsEmpty(
        localStorage.getItem(Constants.Session.USER_OBJECT)
      )
    ) {
      var userObject = JSON.parse(
        localStorage.getItem(Constants.Session.USER_OBJECT)
      );
      this.state.userObject = userObject;
      console.log("ikm", this.state.userObject);
      this.state.currencySymbol = Utilities.GetCurrencySymbol();
      if (userObject.Enterprise.EnterpriseTypeId === 4) {
        this.props.history.push("/catalog");
      }
    }
  }
  componentWillMount() {
    document.body.classList.add("v-auto");
  }

  componentWillUnmount() {
    document.body.classList.remove("v-auto");
  }
  //#endregion
  loading = () => (
    <div className="page-laoder page-laoder-menu">
      <div className="loader-menu-inner">
        <Loader type="Oval" color="#ed0000" height={50} width={50} />
        <div className="loading-label">Loading.....</div>
      </div>
    </div>
  );

  toggleViewImageModal = (photoName, metaId, menuMetaName) => {
    this.setState({
      viewImageModal: !this.state.viewImageModal,
      SelectedMetaItemPhotoName: photoName,
      SelectedItemMetaId: metaId,
      SelectedMenuMetaName: menuMetaName,
    });
  };

  async SetActiveTab(activeTab) {
    // this.GetGalleryPhotos();

    this.setState({ ActiveTab: activeTab });

    if (activeTab == 0) {
      this.setState({ ShowGalleryLoader: true });
      return;
    }

    var data = await PhotoDictionaryService.GetAllGalleryPhotos();
    this.setState({ GalleryPhotos: data, FilterGalleryPhotos: data });

    setTimeout(() => {
      this.setState({ ShowGalleryLoader: false });
    }, 100);
  }

  //#endregion

  //#region toggle functions
  enterprisePosMenu = async () => {
    this.setState({ posLoader: true });
    let response = await EnterpriseMenuService.POSMENU();
    if (Object.keys(response).length > 0) {
      this.setState({ posLoader: false });
      Utilities.notify(response.Result, "s");
      this.GetDepartmentss();
      return;
    }
  };

  getAIKnowledgebase = async () => {
    this.setState({ knowledgebaseLoader: true });
    let response = await Enterprise.GetAIKnowledge();
    if (response.length > 0) {
      console.log("response", response);

      this.makeTextFile(response);
      return;
    }
    Utilities.notify("Data not Found", "e");
    this.setState({ knowledgebaseLoader: false });
  };

  makeTextFile = (list) => {
    try {
      const formattedText = list
        .map((item) => {
          const lines = [];

          const isEnterpriseWithExtraFields = [3, 4, 7].includes(
            this.state.userObject.Enterprise.EnterpriseTypeId
          );

          // Always include these
          lines.push(item.CategoryName || "");
          lines.push(item.Product || "");
          lines.push(item.Description || "");
          lines.push(item.Variants || "");
          lines.push(item.Price || "");

          // Conditional fields
          if (isEnterpriseWithExtraFields) {
            if (item.CalorieCount) lines.push(`Calories: ${item.CalorieCount}`);
            if (item.Serving && item.Serving > 0) lines.push(`${item.Serving}`);
            if (item.Dietary) lines.push(`Dietary Options: ${item.Dietary}`);
          }

          // Always include these (only if not null or empty)
          if (item.PhotoName) lines.push(item.PhotoName);
          if (item.MetaItem) lines.push(item.MetaItem);
          if (item.Url) lines.push(item.Url);
          if (item.AddIntoBasket) lines.push(item.AddIntoBasket);

          return lines.join("\n");
        })
        .join("\n\n");

      const data = new Blob([formattedText], { type: "text/plain" });
      const downloadLink = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.download = `${this.state.userObject.Enterprise.Name}-Knowledgebase.txt`;
      link.href = downloadLink;
      link.click();
      this.setState({ knowledgebaseLoader: false });
    } catch (error) {
      console.log("makeTextFile error", error);
    }
  };

  handleCategoryClick(category) {
    this.setState({
      SelectedCategoryId: category.Id,
      SelectedCategoryName: category.Name,
      SelectedCategory: category,
      ShowLoaderRightPanel: true,
      Products: [],
      FilterProducts: [],
      IsCategoryClicked: true,
    });
  }

  handleActiveCategoryCheck() {
    this.setState(
      {
        activeCategoryCheck: !this.state.activeCategoryCheck,
      },
      () => {}
    );
  }

  handleInActiveCategoryCheck() {
    this.setState(
      {
        inActiveCategoryCheck: !this.state.inActiveCategoryCheck,
      },
      () => {}
    );
  }

  handleActiveProductCheck() {
    let state = !this.state.activeProductCheck;
    this.setState({
      activeProductCheck: state,
    });
  }

  handleInActiveProductCheck() {
    let state = !this.state.inActiveProductCheck;

    this.setState({
      inActiveProductCheck: state,
    });
  }

  handleCheck() {
    this.setState({
      checked: !this.state.checked,
    });
  }

  supportTypeModalShowHide = (value, isSupportTypeEdit) => {
    this.setState({
      supportTypeModal: !this.state.supportTypeModal,
      // selected: product,
      chooseDepartmentId:
        value !== undefined && value !== ""
          ? value.DeparmentId
          : this.state.chooseDepartmentId,
      supportTypeReferencId:
        value !== undefined && value !== "" ? value.ReferenceId : "",
      ModelHeaderTitle: isSupportTypeEdit
        ? "Edit support type"
        : "Add new support type",
      supportTypeName:
        value !== undefined && value !== "" ? value.Description : "",
      supportTypeDescription:
        value !== undefined && value !== "" ? value.LongDescription : "",
      supportTypeCount: value !== undefined && value != "" ? value.Count : 1,
      supportTypeId: value != undefined && value != "" ? value.Id : 0,
      resolvedTime:
        value != undefined && value != ""
          ? value.AverageJobTime > 60
            ? (Number(value.AverageJobTime) / 60).toFixed(2)
            : value.AverageJobTime
          : "",
      resolvedTimeLabel:
        value != undefined && value != ""
          ? value.AverageJobTime > 60
            ? "hours"
            : "mins"
          : "mins",
      isSupportTypeEdit: isSupportTypeEdit,
    });
  };

  EditProductModal() {
    this.setState({
      edititem: !this.state.edititem,
    });
  }

  departmentModalHideShow(value, isEdit) {
    this.GetUsers();
    this.setState({ selectedUser: [], selectedUsersCsv: "" });
    if (isEdit) {
      var StaffIdCsv = value.StaffIdCsv.split(",");
      var users = [];
      for (let i = 0; i < StaffIdCsv.length; i++) {
        const element = StaffIdCsv[i].trim();
        users = [
          ...users,
          ...this.state.usersList.filter((v) => v.Id == element),
        ];
      }

      this.setState({ selectedUser: users });
    }
    this.setState({
      departmentModal: !this.state.departmentModal,
      ModelHeaderTitle: isEdit ? "Edit Department" : "Add Department",
      departmentName: value !== undefined && value !== "" ? value.Name : "",
      departmentReferencId:
        value !== undefined && value !== "" ? value.ReferenceId : "",
      departmentDescription:
        value !== undefined && value !== "" ? value.Description : "",
      departmentId: value != undefined && value != "" ? value.Id : 0,
      isEdit: isEdit,
      selectedUsersCsv: isEdit ? "," + value.StaffIdCsv.replace(/ +/g, "") : "",
    });
    // this.EditUser()
  }

  ProductOptionHideModal() {
    this.setState({
      ProductandOptionAction: {},
      productOptionModal: !this.state.productOptionModal,
      OptionMenuAddonGroupId: 0,
      OptionMenuAddonExtraGroupId: 0,
    });
  }

  ProductOptionShowModal(product) {
    this.setState({
      SelectedProduct: product,
      productOptionModal: !this.state.productOptionModal,
      ModelHeaderTitle: "Add new option",
      OptionMenuAddonGroupId: this.state.SelectedCategory.MenuAddonGroupId,
      OptionMenuAddonExtraGroupId:
        this.state.SelectedCategory.MenuAddonExtraGroupId,
    });
  }

  leftpenal() {
    this.setState({
      left: !this.state.left,
    });
  }
  GetDepartmentss = async () => {
    var data = await DepartmentService.GetAll();
    if (data.length != 0) {
      this.setState({
        departments: data,
        selectedDepartment:
          this.state.selectedDepartment != ""
            ? this.state.selectedDepartment
            : data[0].Id,
        chooseDepartmentId:
          this.state.chooseDepartmentId != 0
            ? this.state.chooseDepartmentId
            : data[0].Id,
        loading: false,
      });
      this.GetSupportType(
        this.state.chooseDepartmentId != 0
          ? this.state.chooseDepartmentId
          : data[0].Id
      );
      return;
    }
    this.setState({ loading: false, loadingSupportType: false });
  };

  GetUsers = async () => {
    let enterpriseId = Utilities.GetEnterpriseIDFromSession();
    var data = await EnterpriseUsers.GetAll(enterpriseId);
    // var data = await EnterpriseUsers.GetUsers();
    if (data.length !== 0) {
      data.push({ Id: "-1", DisplayName: "+ Add User" });
      this.setState({ usersList: data, userData: data });
      return;
    }
    // this.setState({ loading: false });
  };

  onScroll() {
    this.props.handleScroll(this.refs.elem.scrollTop);
  }

  SaveDepartmentApi = async (department, isNewDepartment) => {
    let message =
      isNewDepartment === true
        ? await DepartmentService.Save(department)
        : await DepartmentService.Update(department);
    this.setState({ IsSave: false });
    if (message == "1") {
      // SetMenuStatus(true);
      this.departmentModalHideShow("", false);
      this.GetDepartmentss();
      Utilities.notify(
        "Department " +
          Utilities.SpecialCharacterDecode(department.Name) +
          (isNewDepartment === true
            ? " created successfully."
            : " updated successfully."),
        "s"
      );
      return;
    }
    Utilities.notify(message, "e");
  };

  SaveDepartments = () => {
    if (this.state.IsSave) return;
    this.setState({ IsSave: true });
    let departments = {};
    departments.Name = Utilities.removeExtraSpaces(
      Utilities.SpecialCharacterEncode(this.state.departmentName)
    );
    departments.Description = Utilities.removeExtraSpaces(
      Utilities.SpecialCharacterEncode(this.state.departmentDescription)
    );
    departments.Id = this.state.departmentId;
    departments.EnterpriseId = Utilities.GetEnterpriseIDFromSession();
    departments.ReferenceId = this.state.departmentReferencId;
    departments.StaffIdCsv = this.state.selectedUsersCsv.substring(1);
    if (!this.state.isEdit) {
      this.SaveDepartmentApi(departments, true);
      return;
    }

    this.SaveDepartmentApi(departments, false);
  };

  SaveSupportTypes = () => {
    if (this.state.IsSave) return;
    this.setState({ IsSave: true });
    // console.log('departmentId', this.state.departmentId)
    let supportType = {};
    supportType.Description = Utilities.removeExtraSpaces(
      Utilities.SpecialCharacterEncode(this.state.supportTypeName)
    );
    supportType.LongDescription = Utilities.removeExtraSpaces(
      Utilities.SpecialCharacterEncode(this.state.supportTypeDescription)
    );
    supportType.Count = Utilities.removeExtraSpaces(
      this.state.supportTypeCount
    );
    supportType.AverageJobTime =
      this.state.resolvedTimeLabel == "mins"
        ? parseInt(this.state.resolvedTime)
        : parseInt(Number(this.state.resolvedTime) * 60);
    supportType.Id = this.state.supportTypeId;
    supportType.DeparmentId = this.state.chooseDepartmentId;
    supportType.ReferenceId = this.state.supportTypeReferencId;
    supportType.EnterpriseId = Utilities.GetEnterpriseIDFromSession();
    if (!this.state.isSupportTypeEdit) {
      this.SaveSupportTypeApi(supportType, true);
      return;
    }

    this.SaveSupportTypeApi(supportType, false);
  };

  SaveSupportTypeApi = async (supportType, isNewType) => {
    let message =
      isNewType === true
        ? await SupportTypeService.Save(supportType)
        : await SupportTypeService.Update(supportType);
    this.setState({ IsSave: false });
    if (message == "1") {
      // SetMenuStatus(true);
      this.supportTypeModalShowHide("", false);
      this.GetSupportType(this.state.selectedDepartment);
      Utilities.notify(
        Utilities.SpecialCharacterDecode(supportType.Description) +
          (isNewType === true
            ? " created successfully."
            : " updated successfully."),
        "s"
      );
      return;
    }
    Utilities.notify(message, "e");
  };

  DeleteProduct = async () => {
    this.setState({ showDeleteConfirmation: false });
    let product = this.state.selectedProductInAction;
    let DeletedMessage = await ProductService.Delete(product.MenuItemMetaId);

    if (DeletedMessage === "1") {
      SetMenuStatus(true);
      this.handleCategoryClick(this.state.SelectedCategory);
      this.setState({
        selectedProductInAction: {},
        showAlert: true,
        alertModelTitle: "Removed!",
        alertModelText: product.MenuMetaName + " has been removed ",
      });
      return;
    }

    let message =
      DeletedMessage === "0"
        ? '"' + product.MenuMetaName + '" has been removed'
        : DeletedMessage;

    this.setState({
      showAlert: true,
      alertModelTitle: "Error!",
      alertModelText: message,
      selectedProductInAction: {},
    });
  };

  DeleteCategoryConfirmation(categoryId, name) {
    this.setState({
      deleteComfirmationModelType: "c",
      showDeleteConfirmation: true,
      deleteConfirmationModelText:
        "Remove " + Utilities.SpecialCharacterDecode(name) + "?",
    });
  }

  DeleteProductConfirmation(product) {
    this.setState({
      selectedProductInAction: product,
      deleteComfirmationModelType: "pd",
      showDeleteConfirmation: true,
      deleteConfirmationModelText:
        "Remove " +
        Utilities.SpecialCharacterDecode(product.MenuMetaName) +
        "?",
    });
  }

  HandleOnConfirmation() {
    let type = this.state.deleteComfirmationModelType;

    switch (type.toUpperCase()) {
      case "DD":
        this.DeleteDepartment();
        break;
      case "ST":
        this.DeleteSupportType();
        break;

      default:
        break;
    }
  }

  DeleteDepartmentConfirmation = (deptId, name) => {
    this.setState({
      departmentName: name,
      departmentId: deptId,
      deleteComfirmationModelType: "dd",
      showDeleteConfirmation: true,
      deleteConfirmationModelText:
        "Remove " + Utilities.SpecialCharacterDecode(name) + "?",
    });
  };
  DeleteSupportTypeConfirmation = (typeId, name) => {
    this.setState({
      supportTypeName: name,
      supportTypeId: typeId,
      deleteComfirmationModelType: "st",
      showDeleteConfirmation: true,
      deleteConfirmationModelText:
        "Remove " + Utilities.SpecialCharacterDecode(name) + "?",
    });
  };

  DeleteDepartment = async () => {
    this.setState({ showDeleteConfirmation: false });
    let DeletedMessage = await DepartmentService.Delete(
      this.state.departmentId
    );
    if (DeletedMessage === "1") {
      Utilities.notify(
        "Department " +
          Utilities.SpecialCharacterDecode(this.state.departmentName) +
          " deleted successfully.",
        "s"
      );
      this.setState({ selectedDepartment: "", chooseDepartmentId: 0 });
      this.GetDepartmentss();
      return;
    }

    let message =
      DeletedMessage === "0"
        ? '"' +
          Utilities.SpecialCharacterDecode(this.state.departmentName) +
          '" has not been deleted'
        : DeletedMessage;
    Utilities.notify(message, "e");
  };
  DeleteSupportType = async () => {
    this.setState({ showDeleteConfirmation: false });
    let DeletedMessage = await SupportTypeService.Delete(
      this.state.supportTypeId
    );
    if (DeletedMessage === "1") {
      Utilities.notify(
        Utilities.SpecialCharacterDecode(this.state.supportTypeName) +
          " deleted successfully.",
        "s"
      );
      this.GetSupportType(this.state.selectedDepartment);
      // this.setState({ showAlert: true, alertModelTitle: 'Removed!', alertModelText: name + ' has been removed' });
      return;
    }

    let message =
      DeletedMessage === "0"
        ? '"' +
          Utilities.SpecialCharacterDecode(this.state.supportTypeName) +
          '" has not been deleted'
        : DeletedMessage;
    Utilities.notify(message, "e");
  };

  departmentNameResponsive = (Id) => {
    var department = this.state.departments.filter((v) => v.Id == Id);
    return department.length > 0
      ? department[0].Name
      : this.state.departments[0].Name;
  };

  // renderSearch = () =>{
  //   return(
  //     <div className='staff-item item-checked'>
  //     <span><img src="https://randomuser.me/api/portraits/men/40.jpg"/> </span>
  //     <span><Avatar className="header-avatar" name="Bilal Manzoor" round={true} size="25" textSizeRatio={2} /></span>
  //     <span>Bilal Manzoor</span>
  //     <span className='staff-check'><FiCheck/></span>

  //   </div>

  //   )

  // }
  SearchUser = (value) => {
    if (value.length > 2) {
      var search = this.state.usersList.filter(
        (v) =>
          (v.DisplayName == null
            ? v.FirstName + " " + v.SurName
            : v.DisplayName
          )
            .toLowerCase()
            .indexOf(value.trim().toLowerCase(), 0) !== -1
      );
      this.setState({ usersList: search });
      return;
    }
    this.setState({ usersList: this.state.userData });
  };

  selectUser = (v, i) => {
    // console.log('val', v)
    if (v.Id == "-1") {
      //  history.push("/support-types");
      this.props.history.push("/users/all-users");
      return;
    }
    if (!Utilities.isExistInCsv(v.Id, this.state.selectedUsersCsv + ",", ",")) {
      this.state.selectedUsersCsv = this.state.selectedUsersCsv + "," + v.Id;
      var user = this.state.usersList.filter((val) => val.Id == v.Id);
      var addUser = [...this.state.selectedUser, ...user];
      this.setState({
        selectedUsersCsv: this.state.selectedUsersCsv,
        selectedUser: addUser,
      });
      return;
    }

    var removeUserCsv = this.state.selectedUsersCsv.replace(`,${v.Id}`, "");
    var userIndex = this.state.selectedUser.findIndex((a) => a.Id == v.Id);
    var removeUser = this.state.selectedUser.splice(userIndex, 1);
    this.setState({
      selectedUsersCsv: removeUserCsv,
      selectedUser: this.state.selectedUser,
    });
  };

  selectedUsers = (v, i) => {
    return Utilities.isExistInCsv(v.Id, this.state.selectedUsersCsv + ",", ",");
  };

  CreateDepartmentModal() {
    if (!this.state.departmentModal) {
      return "";
    }

    return (
      <Modal
        isOpen={this.state.departmentModal}
        className={this.props.className}
      >
        <ModalHeader>{this.state.ModelHeaderTitle}</ModalHeader>
        <ModalBody className="padding-0">
          <AvForm onValidSubmit={this.SaveDepartments}>
            <div
              className="padding-20 Complaint-parent-detail-wrap"
              style={{ minHeight: "280px" }}
            >
              <FormGroup className="modal-form-group">
                <Label htmlFor="categoryName" className="control-label">
                  {Labels.Department_name}
                </Label>
                <AvField
                  errorMessage="This is a required field"
                  onChange={(e) => this.setDepartmentName(e.target.value)}
                  value={Utilities.SpecialCharacterDecode(
                    this.state.departmentName
                  )}
                  name="categoryName"
                  type="text"
                  className="form-control"
                  required
                />
              </FormGroup>

              <FormGroup className="modal-form-group">
                <Label htmlFor="txtDesc" className="control-label">
                  Description
                </Label>
                <AvField
                  style={{ minHeight: 120 }}
                  name="txtShortDesc"
                  type="textarea"
                  onChange={(e) =>
                    this.setDepartmentDescription(e.target.value)
                  }
                  className="form-control"
                  value={Utilities.SpecialCharacterDecode(
                    this.state.departmentDescription
                  )}
                />
              </FormGroup>

              <FormGroup className="modal-form-group d-flex align-sm-items-center  flex-column ">
                <Label htmlFor="referenceId" className="control-label  mb-2 ">
                  {Labels.Reference_Id}
                </Label>
                <AvField
                  onChange={(e) =>
                    this.setState({ departmentReferencId: e.target.value })
                  }
                  multiline={true}
                  name="referenceId"
                  value={this.state.departmentReferencId}
                  type="text"
                  className="form-control"
                />
              </FormGroup>

              <div>
                {this.state.selectedUser.length > 0 && (
                  <div>
                    <Label htmlFor="categoryName" className="control-label">
                      Users in this department
                    </Label>
                    <div className="selected-div-show">
                      {this.state.selectedUser.map((v, i) => (
                        <a>
                          {v.PhotoName != null ? (
                            <img
                              src={Utilities.generatePhotoLargeURL(
                                v.PhotoName,
                                true,
                                false
                              )}
                            />
                          ) : (
                            <Avatar
                              className="header-avatar"
                              name={
                                v.DisplayName == null
                                  ? v.FirstName + " " + v.SurName
                                  : v.DisplayName
                              }
                              round={true}
                              size="25"
                              textSizeRatio={1}
                            />
                          )}
                          <div class="d-flex align-items-start flex-column">
                            <span class="mr-1">
                              {v.DisplayName == null
                                ? v.FirstName + " " + v.SurName
                                : v.DisplayName}
                            </span>
                            {/* <span className={`alert alert-secondary enterprise-txt mt-2 mb-2 p-2 ${user.RoleLevel ==4? 'admin-color': user.RoleLevel==5? 'manager-color':'staff-color'}`}>{user.RoleLevel==4? <RiAdminFill/>: user.RoleLevel==5? <FaUserTie/>:<i className='fa fa-user'/>} {this.GetRoleLevel(user.RoleLevel)}</span> */}

                            {v.Id != "-1" && (
                              <span
                                className={`alert alert-secondary enterprise-txt mb-0 p-1 px-2  font-12 ${
                                  v.RoleLevel == 4
                                    ? "admin-color"
                                    : v.RoleLevel == 5
                                    ? "manager-color"
                                    : "staff-color"
                                }`}
                              >
                                {v.RoleLevel == 4 ? (
                                  <RiAdminFill />
                                ) : v.RoleLevel == 5 ? (
                                  <FaUserTie />
                                ) : (
                                  <i className="fa fa-user" />
                                )}{" "}
                                {v.RoleLevel == 4
                                  ? "Admin"
                                  : v.RoleLevel == 5
                                  ? "Manager"
                                  : v.RoleLevel == 6
                                  ? "Staff"
                                  : v.RoleLevel == 7
                                  ? "Moderaor"
                                  : "-"}
                              </span>
                            )}
                          </div>
                          <span
                            onClick={() => this.selectUser(v, i)}
                            className="cursor-pointer ml-auto fa fa-trash"
                          ></span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                <label class="font-13">
                  Choose users from the list below which you want to add to this
                  department.
                </label>
                {/* <SelectSearch
               className="select-search"
               options={this.state.options}
              renderOption={(item)=>this.renderSearch(item)}
               multiple
               search
               placeholder="Search users"

                 /> */}
                <div className="select-search-container select-search-is-multiple">
                  <div className="select-search-value">
                    <input
                      onChange={(e) => this.SearchUser(e.target.value)}
                      placeholder="Search users"
                      autocomplete="on"
                      className="select-search-input"
                    />
                  </div>
                  {this.state.usersList.length > 0 && (
                    <div className="select-search-select">
                      <ul className="select-search-options">
                        {this.state.usersList.map(
                          (v, i) =>
                            !v.IsDeleted &&
                            !!v.IsActive && (
                              <li
                                key={i}
                                onClick={() => this.selectUser(v, i)}
                                className={
                                  v.Id == "-1"
                                    ? "Add-link-wrap"
                                    : "select-search-row"
                                }
                                role="menuitem"
                                data-index="0"
                              >
                                <div
                                  className={
                                    v.Id == "-1"
                                      ? "Add-link"
                                      : this.selectedUsers(v, i)
                                      ? "staff-item item-checked"
                                      : "staff-item"
                                  }
                                >
                                  {v.Id == "-1" ? (
                                    ""
                                  ) : v.PhotoName != null ? (
                                    <span>
                                      <img
                                        src={Utilities.generatePhotoLargeURL(
                                          v.PhotoName,
                                          true,
                                          false
                                        )}
                                      />{" "}
                                    </span>
                                  ) : (
                                    <span className="av-color-n">
                                      <Avatar
                                        className="header-avatar"
                                        name={
                                          v.DisplayName == null
                                            ? v.FirstName + " " + v.SurName
                                            : v.DisplayName
                                        }
                                        round={true}
                                        size="25"
                                        textSizeRatio={2}
                                      />
                                    </span>
                                  )}
                                  <span className="flex-column d-flex">
                                    <span>
                                      {v.DisplayName == null
                                        ? v.FirstName + " " + v.SurName
                                        : v.DisplayName}
                                    </span>
                                    {v.Id != "-1" && (
                                      <span
                                        className={`alert alert-secondary enterprise-txt mb-0 p-1 px-2  font-12 ${
                                          v.RoleLevel == 4
                                            ? "admin-color"
                                            : v.RoleLevel == 5
                                            ? "manager-color"
                                            : "staff-color"
                                        }`}
                                      >
                                        {v.RoleLevel == 4 ? (
                                          <RiAdminFill />
                                        ) : v.RoleLevel == 5 ? (
                                          <FaUserTie />
                                        ) : (
                                          <i className="fa fa-user" />
                                        )}{" "}
                                        {v.RoleLevel == 4
                                          ? "Admin"
                                          : v.RoleLevel == 5
                                          ? "Manager"
                                          : v.RoleLevel == 6
                                          ? "Staff"
                                          : v.RoleLevel == 2
                                          ? "Moderator"
                                          : "-"}
                                      </span>
                                    )}
                                  </span>

                                  {this.selectedUsers(v, i) && (
                                    <span className="staff-check">
                                      <FaCheck />
                                    </span>
                                  )}
                                </div>
                              </li>
                            )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <FormGroup className="modal-footer">
              <Button
                color="secondary"
                onClick={() => this.departmentModalHideShow("", false)}
              >
                {Labels.Cancel}
              </Button>
              <Button color="primary">
                {this.state.IsSave ? (
                  <span className="comment-loader">
                    <Loader type="Oval" color="#fff" height={22} width={22} />
                  </span>
                ) : (
                  <span className="comment-text">{Labels.Save}</span>
                )}
              </Button>
            </FormGroup>
          </AvForm>
        </ModalBody>
      </Modal>
    );
  }

  selectResolvedTimeLabel = (e) => {
    this.setState({ resolvedTimeLabel: e.target.value });
  };

  chooseDepartment = (value) => {
    if (value == -1) {
      this.departmentModalHideShow("", false);
      return;
    }
    this.setState({ chooseDepartmentId: value });
  };

  SupportTypeModal = (product) => {
    if (!this.state.supportTypeModal) {
      return "";
    }

    return (
      <Modal
        isOpen={this.state.supportTypeModal}
        className={this.props.className}
      >
        <ModalHeader>{this.state.ModelHeaderTitle}</ModalHeader>
        <ModalBody className="padding-0 ">
          <AvForm onValidSubmit={this.SaveSupportTypes}>
            <div className="padding-20 scroll-model-web new-support-type-wrap">
              <div className="row">
                <div className="col-lg-12">
                  <FormGroup className="modal-form-group d-flex align-sm-items-center  flex-column ">
                    <Label
                      htmlFor="productName"
                      className="control-label  mb-2 "
                    >
                      {Labels.Support_Type}
                    </Label>
                    <AvField
                      onChange={(e) =>
                        this.setState({ supportTypeName: e.target.value })
                      }
                      multiline={true}
                      errorMessage="This is a required field"
                      name="productName"
                      value={this.state.supportTypeName}
                      type="text"
                      className="form-control"
                      required
                    />
                  </FormGroup>

                  <FormGroup className="modal-form-group">
                    <Label htmlFor="txtSupportDesc" className="control-label">
                      Description
                    </Label>
                    <AvField
                      style={{ minHeight: 120 }}
                      name="txtSupportDesc"
                      type="textarea"
                      onChange={(e) =>
                        this.setState({
                          supportTypeDescription: e.target.value,
                        })
                      }
                      className="form-control"
                      value={Utilities.SpecialCharacterDecode(
                        this.state.supportTypeDescription
                      )}
                    />
                  </FormGroup>

                  <FormGroup className="modal-form-group d-flex align-sm-items-center  flex-column ">
                    <Label
                      htmlFor="referenceId"
                      className="control-label  mb-2 "
                    >
                      {Labels.Reference_Id}
                    </Label>
                    <AvField
                      onChange={(e) =>
                        this.setState({ supportTypeReferencId: e.target.value })
                      }
                      multiline={true}
                      name="referenceId"
                      value={this.state.supportTypeReferencId}
                      type="text"
                      className="form-control"
                    />
                  </FormGroup>

                  <FormGroup className="modal-form-group">
                    <Label htmlFor="txtCount" className="control-label">
                      Count
                    </Label>
                    <AvField
                      name="txtCount"
                      type="text"
                      onChange={(e) =>
                        this.setState({
                          supportTypeCount:
                            e.target.value > 0 ? e.target.value : 1,
                        })
                      }
                      className="form-control"
                      value={this.state.supportTypeCount}
                      validate={{
                        required: {
                          value: this.props.isRequired,
                          errorMessage: "This is a required field",
                        },
                        myValidation: NonZeroNumberValidation,
                      }}
                    />
                  </FormGroup>
                </div>
                <div className="col-lg-6">
                  <FormGroup className=" d-flex align-sm-items-center  flex-column ">
                    <Label
                      htmlFor="productFoodType"
                      className="control-label  mb-2 "
                    >
                      {Labels.Estimated_Resolution_Time}
                    </Label>

                    <div className="input-group mb-3 form-group">
                      <AvField
                        name="txtZoneDelTime"
                        value={this.state.resolvedTime}
                        type="text"
                        className="form-control new-support-type-input"
                        required
                        errorMessage="This is a required field"
                        onChange={(e) =>
                          this.setState({ resolvedTime: e.target.value })
                        }
                        validate={{
                          required: {
                            value: this.props.isRequired,
                            errorMessage: "This is a required field",
                          },
                          myValidation: NumberValidation,
                        }}
                      />
                      <div className="input-group-append">
                        <select
                          className="select2 form-control custom-select"
                          onChange={(e) => this.selectResolvedTimeLabel(e)}
                          value={this.state.resolvedTimeLabel}
                          style={{
                            width: "100%",
                            height: "34.6px",
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                          }}
                        >
                          <option value="hours">hours</option>
                          <option value="mins">mins</option>
                        </select>
                      </div>
                      {/* <span class="input-group-text" id="basic-addon2" onChange={(e) => this.selectResolvedTimeLabel(e)} value={this.state.resolvedTimeLabel}>{Labels.hours}</span> */}
                      <div className="help-block with-errors"></div>
                    </div>
                  </FormGroup>
                </div>
                {this.state.departments.length > 0 && (
                  <div className="col-lg-6">
                    <FormGroup className="modal-form-group d-flex align-sm-items-center  flex-column ">
                      <Label
                        htmlFor="productFoodType"
                        className="control-label  mb-2 "
                      >
                        {Labels.Select_Department}{" "}
                      </Label>
                      <select
                        onChange={(e) => this.chooseDepartment(e.target.value)}
                        value={this.state.chooseDepartmentId}
                        className="select2 form-control custom-select"
                        name="extras"
                        style={{ width: "100%", height: "36px" }}
                      >
                        {this.state.departments.map((v, i) => (
                          <option value={v.Id}>{v.Name}</option>
                        ))}
                        <option value={-1}>{"Add New"}</option>
                      </select>
                    </FormGroup>
                  </div>
                )}
                {/* <div className='col-lg-6'>
                  <FormGroup className="modal-form-group d-flex align-sm-items-center  flex-column ">
                    <Label htmlFor="productFoodType" className="control-label  mb-2 ">Select Category </Label>

                    <select className="select2 form-control custom-select" name="extras" style={{ width: '100%', height: '36px' }}>
                      <option> AC & Appliances</option>
                      <option> Wifi & Internet</option>
                      <option>Add New</option>
                    </select>

                  </FormGroup>
                </div> */}
              </div>

              {/* <div class="alert alert-danger">Sever side error</div> */}
            </div>
            <FormGroup className="modal-footer">
              <Button
                color="secondary"
                onClick={() => this.supportTypeModalShowHide("", false)}
              >
                {Labels.Cancel}
              </Button>
              <Button color="primary">
                {this.state.IsSave ? (
                  <span className="comment-loader">
                    <Loader type="Oval" color="#fff" height={22} width={22} />
                  </span>
                ) : (
                  <span className="comment-text">{Labels.Save}</span>
                )}
              </Button>
            </FormGroup>
          </AvForm>
        </ModalBody>
      </Modal>
    );
  };

  GenerateSweetConfirmationWithCancel() {
    return (
      <SweetAlert
        show={this.state.showDeleteConfirmation}
        title=""
        text={this.state.deleteConfirmationModelText}
        showCancelButton
        onConfirm={() => {
          this.HandleOnConfirmation();
        }}
        confirmButtonText="Yes"
        onCancel={() => {
          this.setState({ showDeleteConfirmation: false });
        }}
        onEscapeKey={() => this.setState({ showDeleteConfirmation: false })}
        // onOutsideClick={() => this.setState({ showDeleteConfirmation: false })}
      />
    );
  }

  GenerateSweetAlert() {
    return (
      <SweetAlert
        show={this.state.showAlert}
        //title={this.state.alertModelTitle}
        title={""}
        text={this.state.alertModelText}
        onConfirm={() => this.setState({ showAlert: false })}
        onEscapeKey={() => this.setState({ showAlert: false })}
        // onOutsideClick={() => this.setState({ showAlert: false })}
      />
    );
  }

  setDepartmentName = (value) => {
    this.setState({ departmentName: value });
  };

  setDepartmentDescription = (value) => {
    this.setState({ departmentDescription: value });
  };

  componentDidMount() {
    window.addEventListener(
      "load",
      () => {
        this.setState({
          isMobile: window.innerWidth < 800,
        });
      },
      false
    );
    if (window.innerWidth < 800) {
      this.setState({
        isMobile: true,
      });
      // this.state.isMobile = true;
    }
    if (window.innerWidth > 800) {
      this.setState({
        isMobile: false,
      });
      //this.state.isMobile = false;
    }

    window.addEventListener("scroll", () => {
      const istop = window.scrollY < 80;

      if (istop !== true && !this.state.scrolled) {
        this.setState({ scrolled: true });
      } else if (istop == true && this.state.scrolled) {
        this.setState({ scrolled: false });
      }
    });
  }

  shouldComponentUpdate() {
    return true;
  }

  GetSupportType = async (deptID) => {
    this.setState({
      loadingSupportType: true,
    });
    var data = await SupportTypeService.GetSupportType(deptID);
    this.setState({
      loadingSupportType: false,
    });
    if (data !== null && data.length !== 0) {
      this.setState({ supportTypes: data });
      console.log("supportTypes", data);
      return;
    }

    this.setState({ supportTypes: [] });
  };

  selectDepartment = (Id) => {
    if (this.state.selectedDepartment == Id) return;
    this.setState({ selectedDepartment: Id, chooseDepartmentId: Id });
    this.GetSupportType(Id);
    this.GetUsers();
  };

  LeftCateFun() {
    return (
      <div>
        <div className="menu-left-cat-list h-auto s-res-m-t">
          {/* <h3 className={this.state.activeCategoryCheck && htmlActive.length > 0 ? "menu-cat-active-heading" : "no-display"}>Active</h3> */}
          <ul className="mb-3">
            {this.state.departments.map((v, i) => (
              <li
                key={i}
                onClick={() => this.selectDepartment(v.Id)}
                className={`${
                  this.state.selectedDepartment == v.Id ? "active" : ""
                }`}
              >
                <span className="menu-left-list-label">{v.Name}</span>
                <span className="menu-left-list-buttons  mr-0">
                  <span
                    onClick={() => this.departmentModalHideShow(v, true)}
                    data-toggle="modal"
                    data-target="#categoryModalEdit"
                  >
                    <i
                      className="fa fa-pencil-square-o"
                      aria-hidden="true"
                      data-tip
                      data-for="Edit"
                    ></i>
                    <ReactTooltip id="Edit">
                      <span>Edit</span>
                    </ReactTooltip>
                  </span>
                  <span
                    onClick={() =>
                      this.DeleteDepartmentConfirmation(v.Id, v.Name)
                    }
                    className="sa-warning"
                  >
                    <i
                      className="fa fa-trash"
                      aria-hidden="true"
                      data-tip
                      data-for="Delete"
                    ></i>
                    <ReactTooltip id="Delete">
                      <span>Delete</span>
                    </ReactTooltip>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <a
          className="text-primary font-14 cursor-pointer"
          onClick={() => this.departmentModalHideShow("", false)}
        >
          + {Labels.Add_Department}
        </a>
      </div>
    );
  }
  //#region Page view html

  render() {
    if (this.state.loading) return this.loading();
    const ModalDiv = this.state.isMobile;
    const classModalFade = this.state.isMobile ? "modal fade" : "";
    const classDialog = this.state.isMobile ? "modal-dialog modal-lg" : "";
    const classModalContent = this.state.isMobile ? "modal-content" : "";
    const classModalHeader = this.state.isMobile
      ? "modal-header"
      : "no-display";
    const classModalBody = this.state.isMobile ? "modal-body" : "";
    const classModalFooter = this.state.isMobile
      ? "modal-footer"
      : "no-display";
    // console.log('usersList', this.state.usersList)
    return (
      <div>
        <div className="d-flex align-items-center mb-3 p-l-r flex-wrap" style={{gap:"10px 0px"}}>
          <h3 class="card-title card-new-title ml-0 mb-0 pl-0">
            {Labels.Support_Types}
          </h3>
          {this.state.userObject.Enterprise.ExternalReference != "" && (
            <button
              onClick={() => this.enterprisePosMenu()}
              className="btn btn-primary ml-0 ml-md-auto mr-2"
              color="primary"
              style={{ minHeight: "36px", minWidth: "130px" }}
            >
              {this.state.posLoader ? (
                <span className="comment-loader">
                  <Loader type="Oval" color="#fff" height={22} width={22} />
                </span>
              ) : (
                <span className="hide-in-responsive">Fetch Pos Menu</span>
              )}
            </button>
          )}
          {this.state?.isSystemAdmin && (
            <button
              className="btn btn-primary ml-0 ml-md-2 mr-2"
              color="primary"
              style={{ marginLeft: 10, minWidth: "167px" }}
            >
              {this.state.knowledgebaseLoader ? (
                <span className="comment-loader">
                  <Loader type="Oval" color="#fff" height={22} width={22} />
                </span>
              ) : (
                <span
                  onClick={() => this.getAIKnowledgebase()}
                  className="comment-text d-flex align-items-center"
                  style={{ gap: "5px" }}
                >
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
                  Knowledge base
                </span>
              )}
            </button>
          )}
          {this.state.departments.length > 0 && (
            <span
              className="add-cat-btn ml-0"
              onClick={() => this.supportTypeModalShowHide("", false)}
            >
              <span className="hide-in-responsive">+ {Labels.Add_New}</span>
            </span>
          )}
        </div>
        <div className="menu-page-wrap p-0">
          <div className="menu-left-penal s-l-wrap">
            {this.state.departments.length > 0 ? (
              <div
                className="select-cat-btn-res"
                onClick={() => this.leftpenal()}
              >
                <span>
                  {/* {this.state.SelectedCategoryName} */}

                  {this.departmentNameResponsive(this.state.selectedDepartment)}
                </span>
                <span className="change-cat-modal">{Labels.Change}</span>
              </div>
            ) : (
              <div className=" d-lg-none">
                <li className="d-flex align-items-center not-found-label mb-3 pr-0">
                  {Labels.No_Department_Added_Yet}
                </li>
                <a
                  className="text-primary font-14 cursor-pointer"
                  onClick={() => this.departmentModalHideShow("", false)}
                >
                  + {Labels.Add_Department}
                </a>
              </div>
            )}

            {ModalDiv ? (
              <Modal isOpen={this.state.left} className={this.props.className}>
                <ModalHeader>
                  <i
                    className="fa fa-chevron-left cat-back-btn"
                    onClick={() => this.leftpenal()}
                  >
                    {" "}
                  </i>{" "}
                  {Labels.Select_Category}
                </ModalHeader>
                <ModalBody className="menu-page-wrap">
                  <div className=" menu-left-penal ">
                    {this.state.departments.length > 0 && this.LeftCateFun()}
                  </div>
                </ModalBody>
              </Modal>
            ) : (
              <div
                id="leftcategory"
                className={classModalFade}
                isopen={this.state.left.toString()}
              >
                <div className={classDialog}>
                  <div className={classModalContent}>
                    <div className={classModalHeader}>
                      <h4 className="modal-title">{Labels.Select_Category}</h4>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-hidden="true"
                      >
                        ×
                      </button>
                    </div>
                    <div className={classModalBody}>
                      {this.state.departments.length > 0 ? (
                        this.LeftCateFun()
                      ) : (
                        <div>
                          <li className="d-flex align-items-center not-found-label mb-3 pr-0">
                            {Labels.No_Department_Added_Yet}
                          </li>
                          <a
                            className="text-primary font-14 cursor-pointer"
                            onClick={() =>
                              this.departmentModalHideShow("", false)
                            }
                          >
                            + {Labels.Add_Department}
                          </a>
                        </div>
                      )}
                    </div>
                    <div className={classModalFooter}>
                      <button
                        type="button"
                        className="btn btn-default waves-effect"
                        data-dismiss="modal"
                      >
                        {Labels.Cancel}
                      </button>
                      <button
                        type="button"
                        className="btn btn-success waves-effect"
                      >
                        {Labels.Save}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="menu-right-penal border-0">
            {this.state.loadingSupportType ? (
              this.loading()
            ) : this.state.supportTypes.length > 0 ? (
              this.state.supportTypes.map((v, i) => (
                <div key={i} className="support-row-wrap">
                  <span class="support-label">{v.Description}</span>
                  <span className="menu-left-list-buttons">
                    <span
                      onClick={() => this.supportTypeModalShowHide(v, true)}
                      data-toggle="modal"
                      data-target="#categoryModalEdit"
                    >
                      <i
                        className="fa fa-pencil-square-o"
                        aria-hidden="true"
                        data-tip
                        data-for="Edit"
                      ></i>
                      <ReactTooltip id="Edit">
                        <span>{Labels.Edit}</span>
                      </ReactTooltip>
                    </span>
                    <span
                      onClick={() =>
                        this.DeleteSupportTypeConfirmation(v.Id, v.Description)
                      }
                      className="sa-warning"
                    >
                      <i
                        className="fa fa-trash"
                        aria-hidden="true"
                        data-tip
                        data-for="Delete"
                      ></i>
                      <ReactTooltip id="Delete">
                        <span>{Labels.Delete}</span>
                      </ReactTooltip>
                    </span>
                  </span>
                </div>
              ))
            ) : (
              <div>
                <div className="d-flex align-items-center not-found-label mb-4">
                  {" "}
                  {Labels.No_Support_Types_Added_Yet}
                </div>
                {this.state.departments.length > 0 && (
                  <span
                    className="add-cat-btn ml-0"
                    onClick={() => this.supportTypeModalShowHide("", false)}
                  >
                    + Add Support Type
                  </span>
                )}
              </div>
            )}
            {/* <div className='support-row-wrap'>
            <span class="support-label">Other</span>
          <span className="menu-left-list-buttons">
              <span data-toggle="modal" data-target="#categoryModalEdit">
                <i className="fa fa-pencil-square-o" aria-hidden="true" data-tip data-for='Edit'  ></i>
                <ReactTooltip id='Edit'><span>Edit</span></ReactTooltip>
              </span>
              <span className="sa-warning">
                <i className="fa fa-trash" aria-hidden="true" data-tip data-for='Delete'></i>
                <ReactTooltip id='Delete'><span>Delete</span></ReactTooltip>
              </span>

            </span>
          </div> */}
          </div>

          {this.GenerateSweetConfirmationWithCancel()}
          {this.CreateDepartmentModal()}
          {this.SupportTypeModal()}
        </div>
      </div>
    );
  }
}

export default SupportTypes;
