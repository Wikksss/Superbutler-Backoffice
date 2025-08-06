import React, { Component } from "react";
import StarRatings from "../../../node_modules/react-star-ratings";
import CountUp from 'react-countup';
import Avatar from 'react-avatar';
//import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import * as RatingService from '../../service/Rating';
import * as Utilities from '../../helpers/Utilities';
import Constants from '../../helpers/Constants';
import Config from '../../helpers/Config';
import * as moment from 'moment';
import Iframe from 'react-iframe'
import Loader from 'react-loader-spinner';
import { AppSwitch } from '@coreui/react';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";

var timeZone = '';

class Reviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userObj: [],
      enterpriseId: 0,
      ratingObj: [],
      averageRating: 0,
      reviewCount: 0,
      taste: 0,
      orderTime: 0,
      quality: 0,
      price: 0,
      restaurantRatingId: 0,
      CommentModal: false,
      OrderModal: false,
      ShowError: true,
      ShowLoader: true,
      IsSending: false,
      openIframeModal: false,
      iframeUrl: '',

      //filters //
      oneStar: true,
      twoStar: true,
      threeStar: true,
      fourStar: true,
      fiveStar: true,
      allStar: true,
      sortfilter: '0',
      showAlert: false,
      alertModelTitle: "",
      alertModelText: "",
      ratingId:0,
      reviewApprovalValue: false,
      tabindex: 1,
      reviews:[],
      filterPendingCount: 0,
      filterApprovedCount:0

    }

    this.CloseModal = this.CloseModal.bind(this);
    this.SaveRatingReply = this.SaveRatingReply.bind(this);
    this.CommentModel = this.CommentModel.bind(this);
    this.OrderModel = this.OrderModel.bind(this);
    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      this.state.userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
      timeZone = this.state.userObj.EnterpriseRestaurant.Country.TimeZone;
      this.state.enterpriseId = this.state.userObj.Enterprise.Id
    }
    else {
      this.props.history.push('/menu/build-menu')
    }
    this.getRating();
  }

  componentDidMount() { }
  componentWillUnmount() { }

  loading = () => <div className="allorders-loader">
    <div className="loader-menu-inner">
      <Loader type="Oval" color="#ed0000" height={50} width={50} />
      <div className="loading-label">Loading.....</div>
    </div>
  </div>

  SaveRatingReplyApi = async (restaurantRatingId, comments) => {

    let ratingID = await RatingService.SaveReply(restaurantRatingId, comments);

    if (ratingID === '0')
      Utilities.notify("Reply failed.", "e");
    else
      this.getRating();

  }

  SaveRatingReply(event, values) {

    if (this.state.IsSending) return;
    let restaurantRatingId = this.state.restaurantRatingId;
    this.setState({ IsSending: true })
    this.SaveRatingReplyApi(restaurantRatingId, Utilities.SpecialCharacterEncode(values.txtComments).trim());

  }

  getRating = async () => {
    var ratingResult = await RatingService.Get(this.state.enterpriseId, 1, 500, 0);
    if (!ratingResult.HasError) {
      if (ratingResult.Dictionary.ReviewCount > 0)
        this.setRatingType(JSON.parse(ratingResult.Dictionary.EnterpriseRatingAndReview));
      this.setState({
        averageRating: ratingResult.Dictionary.AverageRating,
        reviewCount: ratingResult.Dictionary.ReviewCount,
        ratingObj: JSON.parse(ratingResult.Dictionary.EnterpriseRatingAndReview),
        CommentModal: false,

      })

    }
    this.handleCheckboxfilters()
    this.setState({ ShowLoader: false });

  }
  setRatingType = (enterpriseRatingAndReview) => {
    let taste = 0, orderTime = 0, quality = 0, price = 0;
    for (let i = 0; i < enterpriseRatingAndReview.length; i++) {
      //console.log(enterpriseRatingAndReview[i]);
      let ratingTypeArr = enterpriseRatingAndReview[i].RatingCsv.split(Config.Setting.csvSeperator)
      taste = taste + parseInt(ratingTypeArr[0].split(':')[1]);
      quality = quality + parseInt(ratingTypeArr[1].split(':')[1]);
      orderTime = orderTime + parseInt(ratingTypeArr[2].split(':')[1]);
      price = price + parseInt(ratingTypeArr[3].split(':')[1]);
    }

    this.setState({
      taste: (taste / enterpriseRatingAndReview.length),
      orderTime: (orderTime / enterpriseRatingAndReview.length),
      quality: (quality / enterpriseRatingAndReview.length),
      price: (price / enterpriseRatingAndReview.length)
    })
  }

  CloseModal() {
    this.setState({ CommentModal: false, OrderModal: false, IsSending: false });
  }


  CommentModel() {

    return (
      <Modal isOpen={this.state.CommentModal} className={this.props.className}>
        <ModalHeader>Comment</ModalHeader>
        <ModalBody className="padding-0 ">
          <AvForm onValidSubmit={this.SaveRatingReply}>
            <div className="padding-20">
              <div className="input-group">
                {/* <div className="name-field " style={{ flex: '1' }}> */}
                <AvField name="txtComments" type="textarea" placeholder="Message:" rows="4" cols="50" className="form-control"
                  validate={{ required: { value: this.props.isRequired, errorMessage: 'This is a required field' } }}
                />
                {/* </div> */}
              </div>
            </div>
            <div className="modal-footer">
              <div onClick={this.CloseModal} class="btn btn-secondary">Close</div>
              <Button color="primary" style={{ width: '130px' }}>
                {this.state.IsSending ? <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                  : <span className="comment-text">Send message</span>}
              </Button>

            </div>

          </AvForm>
        </ModalBody>
      </Modal>
    );
  }



  // viewOrderDetail (token,orderId)  {

  //   window.open( Config.Setting.baseUrl + '/order/' + orderId + '/'+ token, '_blank', 'toolbar=0,location=0,menubar=0,top=200,left=200');

  // }


  viewOrderDetail(token, orderId) {
    this.setState({
      openIframeModal: true,
      iframeUrl: Config.Setting.baseUrl + '/m/' + token
    })

  }

  toggleModal = () => {
    this.setState({
      openIframeModal: !this.state.openIframeModal
    })
  }

  OrderModel() {

    return (
      <Modal isOpen={this.state.OrderModal} className={this.props.className}>
        <ModalHeader>Order detail</ModalHeader>
        <ModalBody className="padding-0 ">
          <AvForm onValidSubmit={this.SaveRatingReply}>
            <div className="padding-20">

              <div className="moreDetails  background-white">
                <div className="row m-b-10">
                  <div className="col-sm-6"><span className="bold font-14">Order ID</span><div><div className="order-amount" style={{ textdecoration: 'underline' }}>12345</div></div></div>
                  <div className="col-sm-6"><span className="bold font-14">Amount</span><div className="order-amount">123.45$</div></div>
                </div>
                <div class="row m-b-10">
                  <div className="col-sm-6"><span className="bold font-14">Type</span><div className="order-amount">Delivery</div></div>
                  <div className="col-sm-6"><span className="bold font-14">Date</span><div className="order-amount">15 October 2018</div></div>
                </div>
                <div className="row m-b-10">
                  <div className="col-sm-6"><span className="bold font-14">Cashback</span><div className="order-amount">2.59$</div></div>
                  <div className="col-sm-6"><span className="bold font-14">Discount</span><div className="order-amount">0.00$</div></div>
                </div>
                <div className="row m-b-10  order-h">
                  <div className="col-sm-6 ">
                    <span className="bold font-16 ">Items</span>
                  </div>
                  <div className="col-sm-6">
                    <span className="bold font-16 ">Amount</span>
                  </div>
                </div>
                <div className="row ">
                  <div className="col-sm-6 p-10"><span className="m-r-5">1  x</span> Burger</div>
                  <div className="col-sm-6 p-10">2.50$</div>
                </div>
                <div className="row ">
                  <div className="col-sm-6 p-10"><span className="m-r-5">1  x</span>Pasta</div>
                  <div className="col-sm-6 p-10">3.23$</div>
                </div>
                <div className="row">
                  <div className="col-sm-6 p-10"><span className="m-r-5">3  x</span>Pizza</div>
                  <div className="col-sm-6 p-10">13.23$</div>
                </div>
                <div className="row m-t-10 ">
                  <div className="col-sm-6"><span className="bold font-20 ">Total</span></div>
                  <div className="col-sm-6 font-20 bold">22.22$</div>
                </div>
              </div>


            </div>
            <div className="modal-footer">
              <div onClick={this.CloseModal} class="btn btn-secondary">Close</div>

            </div>

          </AvForm>
        </ModalBody>
      </Modal>
    );
  }




  RenderComments(ratingReviews) {

    if (this.state.ShowLoader) {
      return this.loading();
    }




    var htmlComments = [];

    for (var i = 0; i < ratingReviews.length; i++) {

      htmlComments.push(this.LoadCommentsHtml(ratingReviews[i]));

    }

    return (
      <div id="CampaignDataWraper">
      {/* <Tabs className="ml-4">
            <TabList className={this.state.scrolled ? 'affix' : ' affix-top'}>
              <Tab key={0} onClick={() => this.updateReviewTab(0)}><span className="hidden-xs-down">Approved</span></Tab>
              <Tab key={1} onClick={() => this.updateReviewTab(1)}><span className="hidden-xs-down">Pending</span></Tab>
       </TabList>
             <TabPanel>
              <div className="">


              </div>
            </TabPanel>
            <TabPanel>
              <div className="">


              </div>
            </TabPanel>

          </Tabs> */}
      <div className="card-body reveiw-c-p-wrap row p-t-0 flex-column">{htmlComments.map((commentsHtml) => commentsHtml)}</div>
      </div>
    )
  }

  RenderReply(reply) {

    let photoName = reply.RoleId === "4" ? this.state.userObj.Enterprise.PhotoName : reply.UserPhotoName;
    let replyDate = Utilities.getDateByZone(reply.ReplyDate, 'YYYY-MM-DDTHH:mm:ss', timeZone)
    return (
      <div className="comment-main-level">
        <div className="d-flex align-items-center ">
          {photoName !== "" ? <span className="menu-item-image" style={{ backgroundImage: "url(" + Utilities.generatePhotoLargeURL(photoName, true, false) + ")" }}></span> : <Avatar className="header-avatar" name={reply.RoleId === "4" ? "Your reply" : reply.UserName} round={true} size="40" textSizeRatio="1.75" />}
          <div className="m-l-10">
            <div className="userDetailDV">
              <span>{reply.RoleId === "4" ? "Your reply" : reply.UserName}</span>
            </div>
            <div className="userlastSeenDV">
              <span>{Utilities.GetDateDifferenceInTime(replyDate, timeZone)}</span>
            </div>
          </div>
        </div>
        <div className="comment-box ">
          <pre className="comment-content">
            {Utilities.SpecialCharacterDecode(reply.Comments)}
          </pre>
        </div>

      </div>
    )


  }

  approveComments = async(ratingId, isApprove) =>{
    var approvalResult = await RatingService.approveComments(ratingId,isApprove);
    if(!!approvalResult){
      this.getRating()
      this.setState({ showAlert: false, reviewApprovalValue: false, ratingId: 0 })
    }
  }

  LoadCommentsHtml(ratingReviews) {

    var reviewText = Utilities.SpecialCharacterDecode(ratingReviews.Review).replace(/<p>/gi, function (x) {
      return x = '';
    });

    reviewText = reviewText.replace(/<\/\p>/gi, function (x) {
      return x = "\n";
    });

    reviewText = reviewText.split('\n').map((item, i) => {
      return <p key={i}>{item}</p>;
    });

    let reviewReply = JSON.parse(ratingReviews.RestaurantRatingJson)


    var htmlReviewReply = [];

    for (var i = 0; i < reviewReply.length; i++) {

      htmlReviewReply.push(this.RenderReply(reviewReply[i]));

    }

    return (
      <div className=" p-30 reveiw-single-wrap user-comment-star mt-0">
        <div>
          <h4 className="m-b-5 d-inline-block font-weight-500" style={{wordBreak:"break-all"}}>
            <span>{ratingReviews.ReviewerName}</span>
          </h4>
          <div className="rating-container theme-krajee-fa rating-xs rating-animate rating-disabled ">
            <StarRatings
              rating={ratingReviews.Rating}
              starDimension="25px"
              starRatedColor="#fdd22c"
              starSpacing="0px"
            />
          </div>
        </div>
        <div className="display-flex-imp width100per order-wrap">
          {
            ratingReviews.OrderId > 0 &&
            <span className="order-detail-wrap" onClick={() => this.props.history.push(`/order-detail/${ratingReviews.EnterpriseRestaurantId}/${ratingReviews.OrderToken}/${ratingReviews.OrderId}`)}
            // onClick={(e) => this.viewOrderDetail(ratingReviews.OrderToken, ratingReviews.OrderId)}
            >Order detail</span>
          }
          <h4 className="pull-right font-14 m-t-10">{Utilities.getDateByZone(ratingReviews.ReviewDate, 'DD MMM YYYY hh:mm a', timeZone)}</h4>
        </div>
        <div className="userCommentDV">
          <p className="text-justify m-b-5 m-t-5">
            {reviewText}
          </p>
        </div>
        <div className="comments-container">

          <ul className="comments-list  " style={{ listStyleType: "none" }}>
            <li>
              {htmlReviewReply.map((reviewReplyHtml) => reviewReplyHtml)}

            </li>
          </ul>
          <div className="d-flex justify-content-end">
            {/* {
              ratingReviews.OrderId == 0 &&
              <AppSwitch name="approval"
              // onChange={(e)=>this.approveComments(ratingReviews.Id, e.target.checked)}
              onChange={(e)=>this.approveUnapproveReviews(ratingReviews, e.target.checked)}
              checked={ratingReviews.IsApproved} value={ratingReviews.IsApproved} className={'mr-auto'} variant={'3d'} color={'primary'} label dataOn={'\u2713'} dataOff={'\u2715'} />
            } */}
            {
              !!ratingReviews.IsApproved &&
              <Button color="" className="px-4 add-option-btn pull-right" onClick={(e) => this.setState({ restaurantRatingId: ratingReviews.Id, CommentModal: true, IsSending: false })} >Comment</Button>
            }
            {
              ratingReviews.OrderId == 0 && !ratingReviews.IsApproved  &&
              <Button color="primary" className="px-4  pull-right ml-2" onClick={() => this.approveUnapproveReviews(ratingReviews, true)} >Approve</Button>
            }
            {
              ratingReviews.OrderId == 0 && !!ratingReviews.IsApproved &&
              <Button color="primary" className="px-4  pull-right ml-2" onClick={() => this.approveUnapproveReviews(ratingReviews, false)} >Disapprove</Button>
            }
          </div>
        </div>
      </div>
    )

  }

  handleCheckboxfilters = () => {
    const { oneStar, twoStar, threeStar, fourStar, fiveStar, ratingObj, tabindex } = this.state;
    const selectedStars = [oneStar && '1', twoStar && '2', threeStar && '3', fourStar && '4', fiveStar && '5']
      .filter(Boolean)
      .map(Number);
    const filterPendingCount = ratingObj.filter(val => !val.IsApproved);
    const filterApprovedCount = ratingObj.filter(val => val.IsApproved);
    const filterData = ratingObj.filter(val => selectedStars.includes(parseInt(val.Rating)) && val.IsApproved == (tabindex != 1));
    var sortdata = filterData.sort((a, b) => {
      if (this.state.sortfilter == '0') {
        return b.Rating - a.Rating;
      } else if (this.state.sortfilter === '1') {
        return a.Rating - b.Rating;
      }else if (this.state.sortfilter === '2') {
        return new Date(a.ReviewDate) - new Date(b.ReviewDate);
      }else if (this.state.sortfilter === '3') {
        return new Date(b.ReviewDate) - new Date(a.ReviewDate);
      }
    });
    this.setState({ reviews: sortdata, filterPendingCount: filterPendingCount.length,  filterApprovedCount: filterApprovedCount.length });

  }

  handleChangeCheckbox = (e) => {
    const id = e.target.id;
    const { allStar, oneStar, twoStar, threeStar, fourStar, fiveStar } = this.state;

    switch (id) {
      case 'all':
        const newAllStarState = !allStar;
        this.setState({
          allStar: newAllStarState,
          oneStar: newAllStarState,
          twoStar: newAllStarState,
          threeStar: newAllStarState,
          fourStar: newAllStarState,
          fiveStar: newAllStarState,
        }, () => {
          this.handleCheckboxfilters();
        });
        break;

      case 'one':
      case 'two':
      case 'three':
      case 'four':
      case 'five':
        const newStarState = !this.state[id + 'Star'];
        this.setState({
          [id + 'Star']: newStarState,
        }, () => {
          const anyUnchecked = !this.state.oneStar || !this.state.twoStar || !this.state.threeStar || !this.state.fourStar || !this.state.fiveStar;
          const allChecked = this.state.oneStar && this.state.twoStar && this.state.threeStar && this.state.fourStar && this.state.fiveStar;

          if (anyUnchecked) {
            this.setState({ allStar: false }, () => {
              this.handleCheckboxfilters();
            });
          } else if (allChecked) {
            this.setState({ allStar: true }, () => {
              this.handleCheckboxfilters();
            });
          } else {
            this.handleCheckboxfilters();
          }
        });
        break;

      default:
        break;
    }
  }

  sortFilter = (e) =>{
    this.setState({sortfilter: e.target.value},()=>{
      this.handleCheckboxfilters()
    })
  }

  GenerateSweetAlert(){
    return(
       <SweetAlert
         show={this.state.showAlert}
         title={this.state.alertModelTitle}
         text={this.state.alertModelText}
         showCancelButton
         onConfirm={() => this.approveComments(this.state.ratingId, this.state.reviewApprovalValue)}
         onEscapeKey={() => this.setState({ showAlert: false })}
         onCancel={() => this.setState({ showAlert: false })}
        //  onOutsideClick={() => this.setState({ showAlert: false })}
       />
     )
   }

   approveUnapproveReviews = (ratingReviews, value) =>{
    this.setState({ showAlert: true, alertModelTitle: 'Are you sure', alertModelText:`you want to ${value == true ? "approve" : "disapprove"} this review?`, reviewApprovalValue: value, ratingId: ratingReviews.Id })
   }

   updateReviewTab = (tabId) =>{
      this.setState({ tabindex: tabId },()=>{
        this.handleCheckboxfilters()
      })
   }

  render() {

    const { ratingObj, reviews } = this.state;
    const averageRating = Math.floor(this.state.averageRating * 10) / 10
    return (
      <div id="reviewWrapper" className="b-review-sec">
         <div className="d-flex mb-3 align-items-center reveiw-p-hdr-fix">
          <h3 className="card-title card-new-title mb-0">Reviews</h3>
          <Tabs id="CampaignDataWraper" className="ml-4 reviews-tab-m-wrap">
              <TabList className={this.state.scrolled ? 'affix' : ' affix-top'}>
                <Tab key={1} onClick={() => this.updateReviewTab(1)}>
                  <span className="hidden-xs-down">Pending
                    {
                      this.state.filterPendingCount != 0 &&
                      <span className="bubble-show">{this.state.filterPendingCount} </span>
                    }
                  </span>
                </Tab>
                <Tab key={0} onClick={() => this.updateReviewTab(0)}>
                  <span className="hidden-xs-down">Approved
                    {/* <span className="bubble-show">{this.state.filterApprovedCount != 0 &&   this.state.filterApprovedCount } </span>   */}
                  </span></Tab>
              </TabList>


            </Tabs>
            </div>
        <div className="animated fadeIn card b-rev-sticky-800">

          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center my-0 my-md-3">
        <div style={{ paddingLeft: 10 }}>
            <ul className='d-flex flex-wrap'>
              <li className='mr-4 mb-2'><label htmlFor="chkAll" className="d-flex mb-0 align-items-center">
                <input type="checkbox" className="form-checkbox" onChange={(e) => { this.handleChangeCheckbox(e) }} name="all" id="all" checked={this.state.allStar} value={this.state.allStar} />
                <span class="button-link">All</span>
              </label>
              </li>
              <li className='mr-4 mb-2'><label htmlFor="chkAll" className="d-flex mb-0 align-items-center">
                <input type="checkbox" className="form-checkbox" onChange={(e) => { this.handleChangeCheckbox(e) }} name="one" id="one" checked={this.state.oneStar} value={this.state.oneStar} />
                <span class="button-link">1 Star</span>
              </label>
              </li>
              <li className='mr-4 mb-2'><label htmlFor="chkAll" className="d-flex mb-0 align-items-center">
                <input type="checkbox" className="form-checkbox" onChange={(e) => { this.handleChangeCheckbox(e) }} name="two" id="two" checked={this.state.twoStar} value={this.state.twoStar} />
                <span class="button-link">2 Star</span>
              </label>
              </li>
              <li className='mr-4 mb-2'><label htmlFor="chkAll" className="d-flex mb-0 align-items-center">
                <input type="checkbox" className="form-checkbox" onChange={(e) => { this.handleChangeCheckbox(e) }} name="three" id="three" checked={this.state.threeStar} value={this.state.threeStar} />
                <span class="button-link">3 Star</span>
              </label>
              </li>
              <li className='mr-4 mb-2'><label htmlFor="chkAll" className="d-flex mb-0 align-items-center">
                <input type="checkbox" className="form-checkbox" onChange={(e) => { this.handleChangeCheckbox(e) }} name="four" id="four" checked={this.state.fourStar} value={this.state.fourStar} />
                <span class="button-link">4 Star</span>
              </label>
              </li>
              <li className='mr-4 mb-2'><label htmlFor="chkAll" className="d-flex mb-0 align-items-center">
                <input type="checkbox" className="form-checkbox" onChange={(e) => { this.handleChangeCheckbox(e) }} name="five" id="five" checked={this.state.fiveStar} value={this.state.fiveStar} />
                <span class="button-link">5 Star</span>
              </label>
              </li>

              {/* <li className='mr-4'><label htmlFor="chkNST" className="d-flex mb-0">
                <input type="checkbox" className="form-checkbox" name="noStock" onChange={(e) => { this.handleChangeCheckbox(e) }} id="chkNST" checked={this.state.noStockCheckbox} value={this.state.noStockCheckbox} />
                <span class="button-link"> No Stock Tracking [0]</span>
              </label>
              </li>
              <li className='mr-4'><label htmlFor="chkSM" className="d-flex mb-0">
                <input type="checkbox" className="form-checkbox" name="showModified" onChange={(e) => { this.handleChangeCheckbox(e) }} id="chkSM" checked={this.state.showModifiedCheckbox} value={this.state.showModifiedCheckbox} />
                <span class="button-link"> Show modified only [{this.state.update.length > 0 ? this.state.update.length : 0}]</span>
              </label>
              </li> */}
            </ul>
          </div>
        <select style={{maxWidth:"150px"}} className="custom-select ml-2" onChange={(e) => this.sortFilter(e)}>
        <option value={'0'}>High to low</option>
          <option value={'1'}>Low to high</option>
          <option value={'2'}>Oldest First</option>
          <option value={'3'}>Newest First</option>
        </select>
        </div>


        </div>
        {reviews.length === 0 &&
      <div className="not-found-menu m-b-20 rev-not-found-wrap"> No result found.</div>
        }

        <div className="animated fadeIn card mb-0 b-review-inner">
          {
                  this.state.tabindex != 1  && reviews.length != 0 &&
           <div className="card-body b-review-inner-l">

                    <div className="ratingMainDV">
                      <div className="ratingSubDVOne">
                        <h4 className="averageRatingHeading">Average Rating</h4>
                        <h1 className="averageRating">
                          <span>{averageRating == 0 ? '0.0' : averageRating}</span>
                          {/* <CountUp start={0} end={this.state.averageRating} duration={2.5} decimals={1} /> */}
                        </h1>
                        <div className="ratingContainer">
                          <StarRatings
                            rating={this.state.averageRating}
                            starDimension="35px"
                            starRatedColor="#fdd22c"
                            starSpacing="0px"
                          />
                        </div>
                        <h4 className="text-center m-t-10">
                          <span className="counter"><CountUp start={0} end={this.state.reviewCount} duration={2.5} /></span> Reviews
                        </h4>
                      </div>
                      {/* <div className="ratingSubDVTwo">
                        <div className="ratingGroupMain">
                          <div className="ratingGroupRow" style={{ marginBottom: 30 }}>
                            <div className="ratingGroupColumn">
                              <div className="ratingLabel">
                                <span>Taste</span>
                              </div>
                              <div>
                                <StarRatings
                                  rating={this.state.taste}
                                  starDimension="35px"
                                  starRatedColor="#fdd22c"
                                  starSpacing="0px"
                                />
                              </div>
                            </div>
                            <div className="ratingGroupColumn">
                              <div className="ratingLabel">
                                <span>Order Time</span>
                              </div>
                              <div>
                                <StarRatings
                                  rating={this.state.orderTime}
                                  starDimension="35px"
                                  starRatedColor="#fdd22c"
                                  starSpacing="0px"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="ratingGroupRow">
                            <div className="ratingGroupColumn">
                              <div className="ratingLabel">
                                <span>Quality</span>
                              </div>
                              <div>
                                <StarRatings
                                  rating={this.state.quality}
                                  starDimension="35px"
                                  starRatedColor="#fdd22c"
                                  starSpacing="0px"
                                />
                              </div>
                            </div>
                            <div className="ratingGroupColumn">
                              <div className="ratingLabel">
                                <span>Price</span>
                              </div>
                              <div>
                                <StarRatings
                                  rating={this.state.price}
                                  starDimension="35px"
                                  starRatedColor="#fdd22c"
                                  starSpacing="0px"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div> */}
                    </div>
          </div>
                }
          <div id="CampaignDataWraper" className="b-review-inner-r">
            {/* <Tabs className="ml-4">
              <TabList className={this.state.scrolled ? 'affix' : ' affix-top'}>
                <Tab key={1} onClick={() => this.updateReviewTab(1)}><span className="hidden-xs-down">Pending {this.state.filterPendingCount != 0 && '(' + this.state.filterPendingCount + ')'}</span></Tab>
                <Tab key={0} onClick={() => this.updateReviewTab(0)}><span className="hidden-xs-down">Approved {this.state.filterApprovedCount != 0 && '(' + this.state.filterApprovedCount + ')'}</span></Tab>
              </TabList>


            </Tabs> */}
            {this.RenderComments(reviews)}
            {this.CommentModel()}
            {this.OrderModel()}

            <Modal isOpen={this.state.openIframeModal} toggle={() => this.toggleModal()} >
              <ModalHeader>Order details</ModalHeader>
              <ModalBody >
                <Iframe url={this.state.iframeUrl}
                  width="100%"
                  height='450px'
                  frameBorder='0'
                />
              </ModalBody>
              <ModalFooter>
                <div>  <Button color="secondary" onClick={() => {
                  this.toggleModal()
                }}>Close</Button></div>
              </ModalFooter>
            </Modal>


          </div>
        </div>
        {this.GenerateSweetAlert()}
      </div>
    );
  }
}

export default Reviews;
