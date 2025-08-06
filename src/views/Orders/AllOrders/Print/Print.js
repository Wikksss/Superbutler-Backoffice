import React, { Component } from 'react';
import * as EnterpriseOrderService from '../../../service/Orders';
import Config from '../../../helpers/Config';
import Constants from '../../../helpers/Constants';
import * as Utilities from '../../../helpers/Utilities';
import Loader from 'react-loader-spinner';
import Labels from '../../../containers/language/labels';
const moment = require('moment-timezone');

var timeZone = '';
var currencySymbol = '';
var taxLabel = "VAT";
var taxPercentage = "0";
const format = "DD MMM YYYY hh:mm a";
class Print extends Component {
  constructor(props) {
    super(props);
    this.state = {
     orderDetail:{},
     ShowLoader : true,
     shortPrint: false,
     token: this.props.token,
     extraFieldJson:"" ,
     countryConfigObj: {},
    }
    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.COUNTRY_CONFIGURATION))) {
      this.state.countryConfigObj = JSON.parse(localStorage.getItem(Constants.Session.COUNTRY_CONFIGURATION))
    }
    if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      var userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
      
      timeZone = Config.Setting.timeZone;
      currencySymbol = Config.Setting.currencySymbol;
      
      if(userObj.EnterpriseRestaurant.Country != null) {
        timeZone = userObj.EnterpriseRestaurant.Country.TimeZone;
        currencySymbol = userObj.EnterpriseRestaurant.Country.CurrencySymbol;
        taxLabel = userObj.EnterpriseRestaurant.Country.TaxLabel;
        taxPercentage = userObj.EnterpriseRestaurant.Country.TaxPercentage;
        }
    }


  }

  loading = () =>   <div className="page-laoder page-laoder-menu">
<div className="loader-menu-inner"> 
  <Loader type="Oval" color="#ed0000" height={50} width={50}/>  
  <div className="loading-label">Loading.....</div>
  </div>
</div> 

  GetOrderDetail = async (orderDetail) => {

    var data = await EnterpriseOrderService.GetOrderDetail(orderDetail);
    // console.log("Detail", data);
    var ExtraFieldJson = ""
    if(data.ExtraFieldJson != undefined && data.ExtraFieldJson != ""){
      for (var i = 0; i < data.ExtraFieldJson.length; i++) {
        ExtraFieldJson = data.ExtraFieldJson.replace(new RegExp("\\" + "^", "gi"), '"');
      }
    }
    this.setState({orderDetail : data, extraFieldJson : ExtraFieldJson !="" ? JSON.parse(ExtraFieldJson) : ExtraFieldJson,});
    this.setState({ ShowLoader: false });
  
  }

  componentDidMount() {
    
     var token = this.props.match.params.token;
    
    if(token != undefined) {
        this.GetOrderDetail(token);

    } else if (this.state.token != undefined){

      this.GetOrderDetail(this.state.token);
    
    } else {
      this.setState({ ShowLoader: false });
    }

  }

  printReceipt = (shortPrint) => {

    this.setState({shortPrint: shortPrint}, () => { 
      window.print()
      this.setState({shortPrint: false})
    })

  }


SetDateFormat = (orderDate, status, isPlacedDate) => {

  if(isPlacedDate)
  orderDate = moment(orderDate,"DD/MM/YYYY h:mm a").format("YYYY-MM-DDThh:mm:ss");
  else 
  orderDate = moment(orderDate).format("YYYY-MM-DDThh:mm:ss")


  if (Number(status) == 0 || Number(status) == 1 || Number(status) == 2) {

    var date = Utilities.getDateByZone(orderDate, "YYYY-MM-DD", timeZone);
    // var today = moment(new Date()).format('YYYY-MM-DD');
    var today = new Date(moment.tz(timeZone).format("YYYY-MM-DD"));

    if (moment(date).isSame(today, 'day')) {
      return Utilities.getDateByZone(orderDate, "h:mm a", timeZone);//moment(orderDate).format('h:mm a')
    }
  }

  var date = Utilities.getDateByZone(orderDate, "DD MMM YYYY  h:mm a", timeZone);

  return Utilities.getDateByZone(orderDate, "DD MMM YYYY  h:mm a", timeZone);

}


GetOrderType(type) {

  var OrderType = "Delivery";

  if (type == 2)
    OrderType = "Pick-up";

  if (type == 3)
    OrderType = "Eat-in-Room";

  if (type == 4)
    OrderType = "Eat-at-Restaurant";

  if (type == 6)
    OrderType = "SPA & Fitness";

  if (type == 7)
    OrderType = "Car Rental";

  if (type == 8)
    OrderType = "Travel & Tours";
 
  if (type == 9)
    OrderType = "Executive Lounge";

  if (type == 10)
    OrderType = "Room Support";

  if (type == 11)
    OrderType = "Laundry";

  if (type == 12)
    OrderType = "Shop";

  return OrderType;

}


SetPaymentMode = (paymentModes, status, payableAmount) => {

  let paymentMode = "BY CASH";
  paymentModes.forEach(mode => {
    if (Number(mode.PaymentMode) === 1 && Number(payableAmount > 0)) {
      paymentMode = "BY CASH";
      if (Number(status) === 4) {
        paymentMode = "PAID CASH";
      }
    }  else if(Number(mode.PaymentMode) === 5 && Number(payableAmount > 0)) {
      paymentMode = "Pay by Card (Terminal)";
    } else if(Number(mode.PaymentMode) === 2){
      paymentMode = "Online Payment";
    } else if (Number(mode.PaymentMode) === 6 && Number(payableAmount > 0)) {
      paymentMode = "Post to Room";
    } else if (Number(mode.PaymentMode) === 7 && Number(payableAmount > 0)) {
      paymentMode = "Bank Transfer";
    }
  });
  return paymentMode;
}

  SetPaymentLabel(paymentMode){
    
    let label = "Cashback Discount";

    if(Number(paymentMode) == 2) {
        label = "Paid By Card"
    }

    return label;

  }


  OrderDetailHtml(item){

    let itemHtml = <tr className="bold-mar"><td width="70%" style={{textAlign:"left", padding:"0px 0px 0px 1%"}} ><div>{item.Quantity} +{' x '}  {Utilities.SpecialCharacterDecode(item.ItemName)}
    </div></td><td style={{textAlign:"right", padding:"0px 1% 0px 0"}}><div>{item.Price}</div></td> </tr>

   
    return itemHtml;

  }


  render() {

    if( this.state.ShowLoader){
       return this.loading();
    }

    let order = this.state.orderDetail;
    console.log('order', order)

    if( order.length === 0){
        return <div>No data found.</div>;
     }
    var additionalCharges = order.AdditionalChargesJson != "" ? JSON.parse(order.AdditionalChargesJson):[]
    return (
      <div  id="printOrder">
        {/* <div className="hidden-print" style={{fontSize: 16, display:'flex', cursor:'pointer', width:'130px', height:'50px', alignItems:'center', padding:'0px 10px', fontFamily:'poppins, sans-serif'}}   onClick={() => {
              window.close()
              this.props.history.goBack()
            }
            }>
          <i className="fa fa-arrow-left"
            style={{ paddingRight: 15, fontSize: 18 }}></i> Back
        </div> */}
   <div className="print">
   {this.state.shortPrint &&
    <div>
    <p className="common-text text-transform center">
    {Utilities.SpecialCharacterDecode(order.Restaurant.Name)}
</p>
   <h3 className="common-title text-transform center" style={{fontSize:'20px'}} >#{order.Id}</h3> 
  
   </div>}
   <div className={this.state.shortPrint ? "hidden-print" : ""}>
   {/* <a className="print-button hidden-print" style={{marginTop:'10px'}} target="_blank" onClick={() => window.print()}>
    <i class="fa fa-print"> </i>
      Print     
  </a> */}

<div className='d-flex justify-content-between mb-2'>
    <a className="btn btn-primary hidden-print text-white w-100 mr-2" style={{marginTop:'0px'}} target="_blank" onClick={() => this.printReceipt(false)}>
    <i className="fa fa-print mr-2"> </i>
    Print Receipt     
  </a>

  <a className="btn btn-success hidden-print text-white w-100" style={{marginTop:'0px'}} target="_blank" onClick={() => this.printReceipt(true)}>
    <i className="fa fa-print mr-2"> </i>
    Print Items     
  </a>
  </div>

	   <p className="common-text text-transform center">
            {Utilities.SpecialCharacterDecode(order.Restaurant.Name)}
        </p>
        <p className="common-text text-transform center">
        ORDER RECEIPT
        </p>

     
     <p className="border-dash">

      -------------------------------
      </p> 
		<h3 className="common-title text-transform center" style={{fontSize:'24px', margin:'0px'}}>{this.SetPaymentMode(order.OrderPayments,order.OrderStatus,order.TotalAmount)}</h3>
    
    <p className="border-dash">
      -------------------------------
      </p> 

       <h3 className="common-title text-transform center" style={{fontSize:'20px'}} >#{order.Id}</h3>
       {!Utilities.stringIsEmpty(order.RoomNo) && order.OrderType != 12 && <p className="common-title text-transform center" style={{fontSize:'16px'}}>Room No: {order.RoomNo} </p>}
		
      {!Utilities.stringIsEmpty(order.PreOrderTime) && Number(order.OrderStatus) === 0 ? 
        
        <p><h3 className="common-title text-transform center" >[ PRE ORDER ]</h3>
        <h3 className="common-title text-transform center" style={{display:'flex',fontSize:'12px', marginBottom:'0px', marginTop:'5px',  justifyContent:'space-between', fontWeight:'normal'}}>
        <span>{this.GetOrderType(Number(order.OrderType))} TIME</span> <span className="bold">{this.SetDateFormat(order.PreOrderTime, order.OrderStatus,true)}</span>
        </h3>
      
         </p> :
         

         Number(order.OrderStatus) != 0 && !Utilities.stringIsEmpty(order.CompletionTime) ?

          <h3 className="common-title text-transform center" style={{display:'flex',fontSize:'13px', justifyContent:'space-between'}}>
          <span>ORDER TIME</span> 
          <span >{this.SetDateFormat(order.CompletionTime, order.OrderStatus, false)}</span>
          </h3>
          : ""
         }
               <h3 className="common-title text-transform center" style={{display:'flex',fontSize:'12px', marginBottom:'0px', marginTop:'5px',  justifyContent:'space-between', fontWeight:'normal'}}>
            <span>Order placed at</span> <span className="bold">{this.SetDateFormat(order.OrderPlaceDate,order.OrderStatus, true)}</span>
        </h3>
        </div>
         
		
     <p className="border-dash">
      -------------------------------
      </p> 
         {
          order.OrderType == '11' && this.state.extraFieldJson !="" &&
          <>
          <div>
            <strong>Collection Details</strong>
            <br />
            <span style={{ color: "#666" }}>Time</span>
            <br />
            <span >{Utilities.getDateByZone(this.state.extraFieldJson.CollectionTime, format, timeZone)}</span>
            <br />
            <span style={{ color: "#666" }}>Collection Instructions</span>
            <br />
            <span >{Utilities.SpecialCharacterDecode(this.state.extraFieldJson.CollectionDriverInstruction)}</span>
          </div>

          <br />

          <div>
            <strong>Delivery Details</strong>
            <br />
            <span style={{ color: "#666" }}>Time</span>
            <br />
            <span >{Utilities.getDateByZone(this.state.extraFieldJson.DeliveryTime, format, timeZone)}</span>
            <br />
            <span style={{ color: "#666" }}>Delivery Instructions</span>
            <br />
            <span >{Utilities.SpecialCharacterDecode(this.state.extraFieldJson.DeliveryDriverInstruction)}</span>
          </div>
          <p className="border-dash">
            -------------------------------
          </p> 
          </>
         }
      { Number(order.OrderStatus) !== 3 ?
      <>
      {
       order.DescriptionNoteDetails != undefined && order.DescriptionNoteDetails !="" &&
      <div><p className="commit-text" style={{fontWeight:'normal'}}>CUSTOMER COMMENTS</p>
      <p className="common-text text-transform">
        
        {/* { Utilities.SpecialCharacterDecode(order.DescriptionNoteDetails)}
         */}

          {
          Utilities.stringIsEmpty(order.DescriptionNoteDetails) ? "None" :
          Utilities.SpecialCharacterDecode(order.DescriptionNoteDetails).split("\n").map((note) => {

          return(
            <p>{Utilities.SpecialCharacterDecode(note)}</p>

          )

          })
            }

        
        </p>
      <p className="border-dash">
      -------------------------------
      </p> 
      </div>
    }
      </>
      : 
      <div className={this.state.shortPrint ? "hidden-print" : ""}><p class="commit-text" style={{fontWeight:'normal'}}>REASON</p>
      <p className="common-text text-transform" >{Utilities.stringIsEmpty(order.OrderStatusHistory.Notes) ? "None" : Utilities.SpecialCharacterDecode(order.OrderStatusHistory.Notes)}</p>
      <p className="border-dash">
      -------------------------------
      </p> 
      </div>  }

		
		<table style={{fontSize:'13px'}} cellPadding="0" >
                            
                            { order.OrderDetails.length > 0 ? 
                            
                            order.OrderDetails.map(data => {
                                
                                let notes = !Utilities.stringIsEmpty(data.DescriptionNoteIdItemsDetails) ?  JSON.parse(data.DescriptionNoteIdItemsDetails) : "" ;
                                let topping = !Utilities.stringIsEmpty(data.DescriptionNoteIdItemsDetails) ?  JSON.parse(data.DescriptionNoteIdItemsDetails) : "" ;
                                
                                let itemExtras = notes.ItemExtra !== undefined ? notes.ItemExtra : [];
                                let itemToppings = notes.ItemToppings !== undefined ? notes.ItemToppings : [];;

                                return (
                                    <tbody>
                                    <tr className="bold-mar">
                                    <td width="70%" style={{textAlign:'left', padding:'0px 0px 0px 1%'}} ><div>{data.Quantity} x {Utilities.SpecialCharacterDecode(data.ItemName)}
                                    </div>
                                    </td>
                                
                                    <td className={this.state.shortPrint ? "hidden-print" : ""} style={{textAlign:'right', padding:'0px 1% 0px 0'}} ><div>{Utilities.FormatCurrency(data.Price, this.state.countryConfigObj?.DecimalPlaces)}</div></td>
                                </tr>

                                    {/* { itemExtras.length > 0 ? <tr>
                                            <td className="no-border" width="70%">Extras:</td>
                                     
                                            <td className="no-border" style={{textAlign:'right', padding:'0px 1% 0px 0'}}>&nbsp;</td>
                                        </tr> 
                                    : "" } */}

                                    {itemExtras.map(extra => {
                                     return  <tr><td className="no-border" >{extra.Quantity} x {Utilities.SpecialCharacterDecode(extra.Name)} </td><td className={this.state.shortPrint ? "no-border hidden-print" : "no-border"}>{Number(extra.Price) > 0 ? Utilities.FormatCurrency(extra.Price, this.state.countryConfigObj?.DecimalPlaces) : "Free"}</td></tr>
                                    })
                                }


                                  { itemToppings.length > 0 ? <tr>
                                            <td className="no-border" width="70%">Extra Toppings:</td>
                                     
                                            <td className="no-border" style={{textAlign:'right', padding:'0px 1% 0px 0'}}>&nbsp;</td>
                                        </tr> 
                                    : "" }

                                    {itemToppings.map(topping => {
                                     return  <tr><td className="no-border" >+ {Utilities.SpecialCharacterDecode(topping.Name)} </td><td className={this.state.shortPrint ? "no-border hidden-print" : "no-border"} >{Number(topping.Price) > 0 ? Utilities.FormatCurrency(topping.Price, this.state.countryConfigObj?.DecimalPlaces) : "Free"}</td></tr>
                                    })
                                }
    
                                </tbody>
                                );
                              })
                            
                             : "" }
                           
</table>

<table className={this.state.shortPrint ? "hidden-print" : ""} style={{fontSize:'13px'}} cellPadding="0" >
<tbody>                     
    <tr>
                                <td colSpan="2">	
                                <p className="border-dash">
                                -------------------------------
      </p>  </td>
                            </tr>
					 <tr> 
					
					<td  className="right" colSpan="2">
					{order.Currency} 
					 </td>
				 </tr> 
                            <tr>
							<td className="right amount-bold">Items Cost</td>
                            <td className="amount-bold">{Utilities.FormatCurrency(order.TotalAmountExTax, this.state.countryConfigObj?.DecimalPlaces)}</td>
                            </tr>
                           
                            
							   {Number(order.OrderType) === 1 ?
                               <tr>
							<td className="right amount-bold">Delivery charges</td>
                            <td className="amount-bold" colSpan="2">{Number(order.DeliveryCharges) > 0 ? Utilities.FormatCurrency(Number(order.DeliveryCharges), this.state.countryConfigObj?.DecimalPlaces) : "Free"}</td>
                            </tr>
                                : ""}
                             <tr>
                                <td  colSpan="2"><p className="border-dash small"> ---------</p> </td>
                            </tr>
							
                              <tr>
                                <td className="right amount-bold">Sub Total </td>
                                <td className="amount-bold"  colSpan="2">{Utilities.FormatCurrency(Number(order.TotalAmountExTax) + Number(order.DeliveryCharges), this.state.countryConfigObj?.DecimalPlaces)} </td>
                            </tr>
                            {
                                  order.ServiceCharge > 0 &&
                                  <tr>
							                      <td className="right amount-bold">{Labels.Service_Charge} @ {order.ServiceChargePercentage} %</td>
                                    <td className="amount-bold">{Utilities.FormatCurrency((Number(order.ServiceCharge)), this.state.countryConfigObj?.DecimalPlaces)}</td>
                                 </tr>
                                }

                            {
                                  additionalCharges.length > 0 && additionalCharges.map((v,i)=>(
                                    <tr key={i}>
                                      <td className="right amount-bold">{Utilities.SpecialCharacterDecode(v.Label)}</td>
                                      <td className="amount-bold">{Utilities.FormatCurrency((Number(v.Amount)), this.state.countryConfigObj?.DecimalPlaces)}</td>
                                  </tr>
                                  ))
                                }

                            { Number(order.DiscountedAmount) > 0 ?
                            
                            Number(order.DiscountType) !== 2 ?
                            <tr>
                                <td className="right amount-bold">Discount by Business</td>
                                <td className="amount-bold" colSpan="2">-{Utilities.FormatCurrency(Number(order.DiscountedAmount), this.state.countryConfigObj?.DecimalPlaces)}</td>
                            </tr>
                            : 
                            <tr>
                                <td className="right amount-bold">Superbutler discount (Cashback)</td>
                                <td className="amount-bold" colSpan="2">-{Utilities.FormatCurrency(Number(order.DiscountedAmount), this.state.countryConfigObj?.DecimalPlaces)}</td>
                            </tr>
                            : 
                            ""
                             }
                            {Number(order.TotalTax > 0) ?

                              <tr>
                                <td className="right amount-bold">Total Tax {Number(taxPercentage) > 0 ? `@ ${taxPercentage} %` : "" }</td>
                                <td className="amount-bold" colSpan="2">{Utilities.FormatCurrency(Number(order.TotalTax), this.state.countryConfigObj?.DecimalPlaces)}</td>
                            </tr>
                            : ""
                        }

                             <tr>
                                <td colSpan="2"><p className="border-dash small">---------</p> </td>
                            </tr>
                            <tr>
                                <td className="right amount-bold" >Total Payable </td>
                                <td className="amount-bold" colSpan="2">{Utilities.FormatCurrency(Number(order.TotalAmount), this.state.countryConfigObj?.DecimalPlaces)}</td>
								</tr>
								{Number(order.OrderPayments[0].Amount) > 0 ?
                                    <tr>
                                
                                <td className="right amount-bold">{this.SetPaymentLabel(Number(order.OrderPayments[0].PaymentMode))}</td>
                                <td className="amount-bold" colSpan="2">{Utilities.FormatCurrency(Number(order.OrderPayments[0].Amount), this.state.countryConfigObj?.DecimalPlaces)}</td>
								</tr>
                                : ""}
                           	{Number(order.OrderPayments[0].Amount) > 0 ?
                            <tr>
                                <td colSpan="2"><p className="border-dash small">---------</p> </td>
                            </tr>
                            : ""}

                            	{Number(order.OrderPayments[0].Amount) > 0 ?
								    <tr>
                                <td className="right amount-bold">Total Due </td>
                                <td className="amount-bold" colSpan="2">{Utilities.FormatCurrency(Number(order.TotalAmount) - Number(order.OrderPayments[0].Amount), this.state.countryConfigObj?.DecimalPlaces)}</td>
								</tr> : ""}
                           
                        </tbody></table>


      { order.OrderType == 4 &&

        
<div className={this.state.shortPrint ? "bottom hidden-print" : "bottom"}>
<p className="border-dash"> -------------------------------</p> 
<h3 className="common-title text-transform">Booking Detail</h3>
<p className="common-text text-transform"><span style={{fontWeight:'normal', fontSize:'14px'}}>Name:</span>
<span className='ml-2'>{Utilities.SpecialCharacterDecode(order.ContactPerson)}
</span></p>
<p className="common-text text-transform"><span style={{fontWeight:'normal', fontSize:'14px'}}>Table No:</span><span className='ml-2'>{order.RestaurantTableBooking.TableNo}</span></p>
<p className="common-text text-transform"><span style={{fontWeight:'normal', fontSize:'14px'}}>Booking Date:</span><span className='ml-2'>{Utilities.getDateByZone(order.RestaurantTableBooking.BookedDateTime, "DD MMM YYYY", timeZone) }</span></p>
<p className="common-text text-transform"><span style={{fontWeight:'normal', fontSize:'14px'}}>Booking Time::</span><span className='ml-2'>{Utilities.getDateByZone(order.RestaurantTableBooking.BookedDateTime, "hh:mm a", timeZone) }</span></p>
{
  order.RestaurantTableBooking.NoOfBabySeat > 0 &&
  <p className="common-text text-transform"><span style={{fontWeight:'normal', fontSize:'14px'}}>No of seat:</span><span className='ml-2'>{order.RestaurantTableBooking.NoOfBabySeat}</span></p>
}
{
  order.RestaurantTableBooking.NoOfSeat > 0 &&
  <p className="common-text text-transform"><span style={{fontWeight:'normal', fontSize:'14px'}}>No of baby seat:</span><span className='ml-2'>{order.RestaurantTableBooking.NoOfSeat}</span></p>
}
</div>

      }


                        <div className={this.state.shortPrint ? "bottom hidden-print" : "bottom"}>
        {
          ((!Utilities.stringIsEmpty(order.ConsumerDetails.FirstName)) || (!Utilities.stringIsEmpty(order.ConsumerDetails.SurName)) || (order.ConsumerDetails.Mobile1 !='')  || (!Utilities.stringIsEmpty(order.ContactPerson))) ?
          <>
            <p className="border-dash"> ------------------------------- </p> 
            <h3 className="common-title text-transform">Customer Detail</h3>
          </>:""
        }
        <p className="common-text text-transform">
        {Utilities.stringIsEmpty(order.ConsumerDetails.FirstName) ? Utilities.SpecialCharacterDecode(order.ConsumerDetails.DisplayName) : `${Utilities.SpecialCharacterDecode(order.ConsumerDetails.FirstName)} ${Utilities.SpecialCharacterDecode(order.ConsumerDetails.SurName)}`}
        {order.ConsumerDetails.OrderCount > 0 &&
          <span style={{fontWeight:'normal', fontSize:'14px', textTransform:'lowercase'}}>{`(${order.ConsumerDetails.OrderCount} orders)`}</span>
        }
        </p>
		  <p className="common-text text-transform m-b-15">
        {Utilities.maskString(order.ConsumerDetails.Mobile1)}
        {order.OrderType === 1 ?
        <p className="common-text text-transform">
        {Utilities.SpecialCharacterDecode(order.DeliveryAddress)}
        </p>   :""}
        </p>
      
         
        {!Utilities.stringIsEmpty(order.ContactPerson) ? 
		<p>
        <h3 className="common-title text-transform">Contact Person</h3>
        <p className="common-text text-transform m-b-15">{Utilities.SpecialCharacterDecode(order.ContactPerson)} <span>{Utilities.maskString(order.ContactNumber)}</span></p>
        </p>
        : ""}

        {Number(order.OrderPayments[0].Amount) > 0 && Number(order.OrderPayments[0].PaymentMode) === 2 && Number(order.OrderType) === 2 && (!Utilities.stringIsEmpty(order.CardNumber) || !Utilities.stringIsEmpty(order.CardType)) ?

        <p>
		<h3 className="common-title text-transform">Card used:</h3>
        
        {!Utilities.stringIsEmpty(order.CardNumber) ?

        <p className="common-text text-transform">
            {order.CardNumber}
        </p> : ""}
		 
        {!Utilities.stringIsEmpty(order.CardType) ?
         
          <p className="common-text text-transform m-b-15" >
            {order.CardType}
        </p> : "" }
    </p>
        : "" }
	

    { order.ConsumerDetails.OrderCount > 0 ? "" : 
(Number(order.OrderPayments[0].PaymentMode) === 2 || Number(order.OrderPayments[0].PaymentMode) === 4 ) ?
<p className={this.state.shortPrint ? "hidden-print" : ""}>
		<h3 className="common-title text-transform " style={{fontWeight:'bold'}}>Note:</h3>
        <div className="common-text text-transform" style={{fontSize:'12px'}}>
            Please verify customer card on arrival.
        </div>
        </p>:""  }
		<p className="border-dash">
    -------------------------------
      </p> 

	        <div className="common-text text-transform center" style={{fontSize:'12px'}}>
Thank you for your order
        </div>

<p style={{textAlign:'center', margin:'10px 0px'}}><img src={Utilities.generatePhotoURL('/images/logo.png')} style={{width:'140px', display:'inline-block'}} /></p>
<br/>

<div className='d-flex justify-content-between mb-2'>
    <a className="btn btn-primary hidden-print text-white w-100 mr-2" style={{marginTop:'0px'}} target="_blank" onClick={() => this.printReceipt(false)}>
    <i className="fa fa-print mr-2"> </i>
    Print Receipt     
  </a>

  <a className="btn btn-success hidden-print text-white w-100" style={{marginTop:'0px'}} target="_blank" onClick={() => this.printReceipt(true)}>
    <i className="fa fa-print mr-2"> </i>
    Print Items     
  </a>
  </div>
 
 
  </div>

  {this.state.shortPrint &&
  <p className="border-dash"> -------------------------------</p> 
  }
    </div>
      </div>

    );
  }
}

export default Print;
