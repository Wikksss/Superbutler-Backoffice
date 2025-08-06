import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, } from 'reactstrap';
//import { Link } from 'react-router-dom';
import { actionCreators } from '../../store/Invoice';
import * as Utilities from '../../helpers/Utilities';
import Config from '../../helpers/Config';
import Constants from '../../helpers/Constants';
import Iframe from 'react-iframe'
const $ = require('jquery');
$.DataTable = require('datatables.net');


class Invoice extends Component{


    constructor(props){
        super(props);
        this.state = { userObj : [],
           enterpriseId: 0,
           openIframeModal: false,
           iframeUrl: ''
           }
      
        if(!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))){
          this.state.userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
          this.state.enterpriseId = this.state.userObj.Enterprise.Id
       }
        else{
          this.props.history.push('/login')
        }
      }

      componentDidMount() {
        // This method is called when the component is first added to the document
         this.getEnterpriseInvoices();
         
       }



    viewDetail (url) { 

      window.open(url, '_blank');


      // this.setState({
      //   openIframeModal: true,
      //   iframeUrl: url
      // })
      }

    viewUnpaidDetail(url,id,LastUnpaidInvoice,invoiceToken){

      var invoices = this.props.enterpriseInvoices;

      var index = Utilities.GetObjectArrId(LastUnpaidInvoice,invoices)

      var invoiceNumber = "";
      var token = ""

      if(index !== '-1'){
        invoiceNumber = invoices[index].ID;
        token = invoices[index].TokenCode;
      }
      this.setState({
        openIframeModal: true,
        iframeUrl: url.replace(String(id),String(LastUnpaidInvoice)).replace(String(invoiceToken),String(token))
      })
      }


      getEnterpriseInvoices() {
        this.props.requestEnterpriseInvoice();
    }

setIsPaid = (isPaid) => {

    if(isPaid){
        return(<span class="label label-success font-14">Paid</span>)
    }else {
        return(<span class="label label-danger  font-14">Not Paid</span>)
    }

}

toggleModal = () => {
  this.setState({
    openIframeModal: !this.state.openIframeModal
  })
}

    renderData = (props)=> { //console.log(props.enterpriseInvoices)
        return props.enterpriseInvoices.length > 0 ? (
          <table className='table' id="tblInvoice">
            <thead style={{display:'none'}}>
              <tr>
                <th>Sequence No</th>
                {/* <th>Invoice No</th>
                <th>Invoice Date</th>
                <th>Invoice Cycle</th>
                <th>Status</th> */}
              </tr>
            </thead>
            <tbody>
              {props.enterpriseInvoices.map(data =>
                <tr >

                <td> <div className="invoice-wrap">
                                      <div className="my-order-wrap">
                                      <div className="my-order-id-name-wrap">
                                      <span  onClick={()=>this.viewDetail(data.InvoiceUrl)} className="my-order-id-label">{data.ID}</span> <span>
                                        
                                        {data.LastUnpaidInvoice == 0 ? this.setIsPaid(data.IsPaid) 
                                        :
                                        <span className="forward-id-label">Carried forward to  <span onClick={()=>this.viewUnpaidDetail(data.InvoiceUrl,data.ID,data.LastUnpaidInvoice,data.TokenCode)}>#{data.LastUnpaidInvoice}</span></span>}
                                        
                                        </span></div>
                                      <div className="my-order-new-row"  onClick={()=>this.viewDetail(data.InvoiceUrl)}>
                                      <div className="left-row">
                                      <div className="my-order-left">
                                      <div className="my-order-label">Sequence No</div>
                                      <div className="my-order-label-sub"><span>{data.SequenceNo}</span></div> 
                                      </div>
                                      <div className="my-order-right">
                                      <div className="my-order-label">Invoice Date</div>
                                       <div className="my-order-label-sub"><span>{data.IssueDate}</span></div>
                                       </div>  
                                       </div>
                                       <div className="right-row"> 
                                            <div className="my-order-left">
                                              <div className="my-order-label">Invoice Cycle</div>
                                              <div className="my-order-label-sub"> <span>{data.InvoiceCycle}</span></div>
                                            </div>
                                         
                                        </div>
                                        </div>

                                        </div>
                                      </div></td>
                </tr>

              )}
             </tbody>
           </table>
        ) : <div style={{fontSize:'16px', color:'#777', textAlign:'center'}}>No record found</div>;
        
      }

      bindDataTable = () => { 
        $("#tblInvoice").DataTable().destroy();
        $('#tblInvoice').DataTable({
            "paging": true,
            "ordering": false,
            "info": true,
            "lengthChange": false,
            "search": {
                "smart": false
            },
            "language": {
              "searchPlaceholder": "Search",
              "search":""
          }
        });
      }

      render() {
    
        return (
          <div class="card invoice-main-wrap">
                  <h3 class="card-title card-new-title">Invoices</h3>
                                <div class="card-body">
                              
                                 
                                      {this.renderData(this.props)}
                                

                                 </div>
                                 <Modal className="invoice-modal-height" size="lg" isOpen={this.state.openIframeModal} toggle={() => this.toggleModal()} >
          <ModalHeader>Invoice Details</ModalHeader>
          <ModalBody  className="invoice-iframe-body">
            <Iframe className="invoice-iframe" url={this.state.iframeUrl}
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

       );
       
      }

}


export default connect(
    state => state.enterpriseInvoices,
    dispatch => bindActionCreators(actionCreators, dispatch)
  )(Invoice);
