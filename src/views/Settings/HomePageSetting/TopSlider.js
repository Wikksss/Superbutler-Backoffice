import React, { Component, Fragment } from 'react';
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
import * as EnterpriseSettingService from '../../../service/EnterpriseSetting';
import * as ThemeSetting from '../../../helpers/DefaultTheme';
import Constants from '../../../helpers/Constants';

import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import * as DefaultTheme from '../../../helpers/DefaultTheme';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
const SortableItem = sortableElement(({ value }) => <li className="sortableHelper">{value}</li>);
export var updateSlider;
const regex = /(<([^>]+)>)/ig;
const SortableContainer = sortableContainer(({ items }) => {
    if (items === undefined) { return; }
    return (
        <ul>
            {items.map((value, index) => (
                <SortableItem key={`item-${index}`} style={{ zIndex: 100000 }} index={index} value={value.Heading.replace(regex, '')} />
            ))}
        </ul>
    );
});
export default class TopSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultTheme: this.props.headerTheme,
            visibleColorCheck: [],
            newSlide: false,
            // sliderData: [],
            sliderData: DefaultTheme.menuSlider,
            ImageUrl: '',
            SliderResponsiveImageUrl: '',
            Heading: '',
            Paragraph: '',
            button: '',
            Link: '',
            isEdit: false,
            sliderId: -1,
            showDeleteConfirmation: false,
            deleteItem: '',
            Sort: false,
            SortCategories: [],
            SortCategoriesIdCsv: '',

        }

        this.updateSlider = this.updateSlider.bind(this);
        this.setSortState = this.setSortState.bind(this);

    }

    saveTheme = async () => {
        try {
          let theme = {};
    
          theme.MenuSlider = ThemeSetting.menuSlider;
          // theme.TopItems = ThemeSetting.TopItems;
          // theme.PopularCategory = ThemeSetting.PopularCategory;
          let EnterpriseId = localStorage.getItem(Constants.Session.ENTERPRISE_ID)
          let response = await EnterpriseSettingService.updateSliders(theme, EnterpriseId)
          if (response.IsSave) {
            Utilities.notify("Slider setting updated successfully", "s");
            this.GetThemeSetting()
          }
    
        }
        catch (e) {
          Utilities.notify("Slider setting update failed.", "e");
          console.log("saveTheme Exception", e)
        }
      }

      GetThemeSetting = async () => {
        try {
          let EnterpriseId = localStorage.getItem(Constants.Session.ENTERPRISE_ID)
          let response = await EnterpriseSettingService.GetSlidersJsonFIle(EnterpriseId);
          if (!Utilities.stringIsEmpty(response)) {
            ThemeSetting.setSliders(response.MenuSlider)
            // ThemeSetting.setTopItems(response.TopItems)
            // ThemeSetting.setPopularCategory(response.PopularCategory)
            this.updateSlider();
          }
    
    
        }
        catch (e) {
          console.log("GetThemeSetting Exception", e.message)
        }
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
            let temp = this.state.sliderData
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
                sliderData: this.state.SortCategories,
            }, () => {
                DefaultTheme.setSliders(this.state.sliderData)
                this.saveTheme(this.state.sliderData)
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
            <Modal isOpen={this.state.Sort} toggle={()=>this.SortModal()} className={this.props.className}>
                <ModalHeader>Sort Slider</ModalHeader>
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

    updateSlider = updateSlider = () => {
        // console.log("DefaultTheme.topSlider", DefaultTheme.menuSlider);
        this.setState({
            sliderData: DefaultTheme.menuSlider,
        })
    }
    addNewSlide = () => {
        this.setState({
            newSlide: !this.state.newSlide,
            ImageUrl: '',
            SliderResponsiveImageUrl:'',
            Heading: '',
            Paragraph: '',
            ButtonText: '',
            Link: '',
            isEdit: false,
            sliderId: -1
        })
    }

    resetState = () => {
        let temp = this.state.sliderData
        this.setState({
            sliderData: temp,
            ImageUrl: '',
            SliderResponsiveImageUrl:'',
            Heading: '',
            Paragraph: '',
            ButtonText: '',
            Link: '',
            isEdit: false,
            sliderId: -1,
            newSlide: false

        })
    }

    addSlide = () => {
        try {
            let temp = this.state.sliderData;
            let obj = {
                Id: temp.length,
                ImageUrl: this.state.ImageUrl,
                SliderResponsiveImageUrl: this.state.SliderResponsiveImageUrl,
                Heading: this.state.Heading,
                Paragraph: this.state.Paragraph,
                ButtonText: this.state.ButtonText,
                Link: this.state.Link
            }
            temp.push(obj);
            this.setState({
                sliderData: temp
            })
            this.resetState()
            this.saveTheme(temp)
            // this.addNewSlide()
        }
        catch (e) {
            console.log("addSlide Exception", e)
        }
    }
    editSlider = item => {
        try {
            // console.log("item", item);
            this.setState({
                ImageUrl: item.ImageUrl,
                SliderResponsiveImageUrl: item.SliderResponsiveImageUrl,
                Heading: item.Heading,
                Paragraph: item.Paragraph,
                ButtonText: item.ButtonText,
                Link: item.Link,
                isEdit: true,
                sliderId: item.Id,
                newSlide: !this.state.newSlide,
            })


        }
        catch (e) {
            console.log("editSlider Exception", e)
        }
    }
    deleteConfirmModal = (item) => {
        this.setState({
            showDeleteConfirmation: true,
            deleteConfirmationModelText: item.Heading,
            deleteItem: item
        })
    }
    GenerateSweetConfirmationWithCancel(item) {
        return (
            <SweetAlert
                show={this.state.showDeleteConfirmation}
                title="Are you sure you want to remove this slide?"
                text={this.state.deleteConfirmationModelText}
                showCancelButton
                onConfirm={() => this.deleteSlider(item)}
                confirmButtonText="Yes"
                onCancel={() => {
                    this.setState({ showDeleteConfirmation: false });
                }}
                onEscapeKey={() => this.setState({ showDeleteConfirmation: false })}
            // onOutsideClick={() => this.setState({ showDeleteConfirmation: false })}
            />
        )
    }
    deleteSlider = (item) => {
        try {
            let temp = this.state.sliderData
            let index = temp.findIndex(a => a.Id == item.Id)
            temp.splice(index, 1);
            this.setState({
                sliderData: temp,
                showDeleteConfirmation: false
            })
            this.saveTheme(temp)
        }
        catch (e) {
            console.log("deleteSlider Exception", e.message)
        }
    }
    handleValidSubmit = () => {
        this.state.isEdit ? this.upDateSlider() : this.addSlide() 
    }
    upDateSlider = () => {
        try {
            let temp = this.state.sliderData
            let obj = {
                Id: this.state.sliderId,
                ImageUrl: this.state.ImageUrl,
                SliderResponsiveImageUrl: this.state.SliderResponsiveImageUrl,
                Heading: this.state.Heading,
                Paragraph: this.state.Paragraph,
                ButtonText: this.state.ButtonText,
                Link: this.state.Link,

            }
            let index = temp.findIndex(a => a.Id == this.state.sliderId)
            temp.splice(index, 1, obj);
            this.setState({
                sliderData: temp
            })
            this.saveTheme(temp)
            this.resetState()
        }
        catch (e) {
            console.log("upDateSlider Exception", e)
        }
    }

    // saveTheme = (DataJson) => {
    //     try {
    //         DefaultTheme.setSliders(DataJson)
    //     }
    //     catch (e) {
    //         console.log("saveTheme Exceptin", e)
    //     }
    // }
    renderSlide = () => {
        try {
            let temp = this.state.sliderData;
            if (temp.length > 0) {
                return (
                    temp.map((item, index) => {
                        return (
                            <div key={index} className="mb-4 slide-view-wrap" >
                                <img src={item.ImageUrl} />
                                <img src={item.SliderResponsiveImageUrl} className='ml-2'/>
                                <div className="card-body">
                                    {item.Heading != "" &&
                                        <div>
                                            {/* <h5 className="card-title">Slider Heading</h5> */}
                                            <h2>{item.Heading.replace(regex, '')}</h2>
                                        </div>
                                    }
                                    {item.Paragraph != "" &&
                                        <div>
                                            {/* <h5 className="card-title">Slider text</h5> */}
                                            <p>{item.Paragraph}</p>
                                        </div>
                                    }

                                    {item.ButtonText != "" &&
                                        <div className="url-wrap">

                                            <a href={item.Link} className="btn btn-primary pl-4 pr-4">{item.ButtonText}</a>
                                            <a href={item.Link} target="_blank" className="item-url">{item.Link}</a>
                                        </div>
                                    }


                                </div>
                                <div className="d-flex slider-buttons">
                                    <div><span class="m-b-0 statusChangeLink m-r-20" onClick={() => this.editSlider(item)} ><span><i class="fa fa-edit font-18"></i>Edit</span></span>
                                        <span class="m-b-0 statusChangeLink m-r-20" onClick={() => this.deleteConfirmModal(item)}><i class="fa fa-trash-o font-18 delete" aria-hidden="true"></i> Remove</span></div>
                                </div>
                            </div>
                        )
                    })
                )
            }
        }
        catch (e) {
            console.log("renderSlide Exception", e)
        }
    }
    AddSlideModal = () => {
        return (
            <Modal isOpen={this.state.newSlide} toggle={this.addNewSlide} size="md" className={this.props.className}>
                <AvForm onValidSubmit={this.handleValidSubmit}>
                <ModalHeader toggle={this.toggleModal}>Add Slider </ModalHeader>
                <ModalBody className='d-flex flex-column'>
                    {/* <AvField name="txtSliderImageUrl" type="text" className="form-control" value={this.state.sliderImageUrl} /> */}
                    <div style={{ marginTop: 10 }} className="row">
                        <div className="col-md-12 ">
                            <div className="form-group mb-3">
                                
                                    <div className="form-body">
                                        <div className="formPadding">
                                            <label id="name" className="control-label">Image Url</label>
                                            <AvField onChange={(e) => {
                                                if (e.target != undefined && e.target.value != undefined) {
                                                    var value = e.target.value
                                                    this.state.ImageUrl = value
                                                }
                                            }} name="txtImageUrl" value={this.state.ImageUrl} type="text" className="form-control flex-1"
                                            validate={{
                                                required: {errorMessage: 'This is a required field' },
                                                }}
                                            />
                                        </div>
                                    </div>
                               
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: 10 }} className="row">
                        <div className="col-md-12 ">
                            <div className="form-group mb-3">
                                
                                    <div className="form-body">
                                        <div className="formPadding">
                                            <label id="name" className="control-label">Slider Responsive Image Url</label>
                                            <AvField onChange={(e) => {
                                                if (e.target != undefined && e.target.value != undefined) {
                                                    var value = e.target.value
                                                    this.state.SliderResponsiveImageUrl = value
                                                }
                                            }} name="txtResponsiveImageUrl" value={this.state.SliderResponsiveImageUrl} type="text" className="form-control flex-1"
        
                                            />
                                        </div>
                                    </div>
                               
                            </div>
                        </div>
                    </div>

                    {/* <div style={{ marginTop: 10 }} className="row">
                        <div className="col-md-12 ">
                            <div className="form-group mb-3">
                                
                                    <div className="form-body">
                                        <div className="formPadding">
                                            <label id="name" className="control-label">Heading</label>
                                            <AvField onChange={(e) => {
                                                if (e.target != undefined && e.target.value != undefined) {
                                                    var value = e.target.value
                                                    this.state.Heading = value
                                                }
                                            }} name="txtHeading" value={this.state.Heading.replace(regex, '')} type="text" className="form-control "

                                            />
                                        </div>
                                    </div>
                               
                            </div>
                        </div>
                    </div> */}

                    {/* <div style={{ marginTop: 10 }} className="row">
                        <div className="col-md-12 ">
                            <div className="form-group mb-3">
                            
                                    <div className="form-body">
                                        <div className="formPadding">
                                            <label id="name" className="control-label">Text</label>
                                            <AvField onChange={(e) => {
                                                if (e.target != undefined && e.target.value != undefined) {
                                                    var value = e.target.value
                                                    this.state.Paragraph = value
                                                }
                                            }} name="txtParagraph" value={this.state.Paragraph} type="text" className="form-control"

                                            />
                                        </div>
                                    </div>
                               
                            </div>
                        </div>
                    </div> */}

                    {/* <div style={{ marginTop: 10 }} className="row">
                        <div className="col-md-12 ">
                            <div className="form-group mb-3">
                               
                                    <div className="form-body">
                                        <div className="formPadding">
                                            <label id="name" className="control-label">Button Text</label>
                                            <AvField onChange={(e) => {
                                                if (e.target != undefined && e.target.value != undefined) {
                                                    var value = e.target.value
                                                    this.state.ButtonText = value
                                                }
                                            }} name="txtbutton" value={this.state.ButtonText} type="text" className="form-control"

                                            />
                                        </div>
                                    </div>
                                
                            </div>
                        </div>
                    </div> */}

                    {/* <div style={{ marginTop: 10 }} className="row">
                        <div className="col-md-12 ">
                            <div className="form-group mb-3">
                               
                                    <div className="form-body">
                                        <div className="formPadding">
                                            <label id="name" className="control-label">Button Link</label>
                                            <AvField onChange={(e) => {
                                                if (e.target != undefined && e.target.value != undefined) {
                                                    var value = e.target.value
                                                    this.state.Link = value
                                                }
                                            }} name="txtLink" value={this.state.Link} type="text" className="form-control"

                                            />
                                        </div>
                                    </div>
                               
                            </div>
                        </div>
                    </div> */}
                    <div className="col-md-12 ">
                        <div className="theme-btn float-left">
                            
                            <Button onClick={() => this.addNewSlide()} className="btn  btn-secondary pull-left   btn btn-secondary mr-2" >Cancel</Button>
                            <button
                               
                                className="btn pull-left btn btn-primary">{this.state.isEdit ? "Update" : "Add"}</button>
                        </div>
                    </div>
                </ModalBody>
            </AvForm>
            </Modal>
        )
    }
    render() {
        return (
            <div >
                <div className="theme-btn float-right justify-content-between">
                    {/* <button className="btn  btn-secondary pull-left   btn btn-secondary" >Reset</button> */}
                    <div className="">
                        <h3 className="card-title ">Slider Settings</h3>
                    </div>
                    <div className='d-flex align-items-center'>
                    <div className="menu-sort-link" onClick={() => this.SortModal()}>
                        <i className=" fa fa-sort-amount-asc" aria-hidden="true"></i>
                        Sort Slider
                    </div>
                    <button onClick={() => this.addNewSlide()} className="btn pull-left btn btn-primary">Add New Slider</button>
                    </div>
                </div>

                {this.AddSlideModal()}

                {this.renderSlide()}
                {this.GenerateSweetConfirmationWithCancel(this.state.deleteItem)}
                {this.GenerateNavigationSortModel()}
                {/* {this.headerTheme(this.state.defaultTheme)} */}

            </div>
        )
    }
}