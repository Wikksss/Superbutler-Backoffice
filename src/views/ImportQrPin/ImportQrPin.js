import React, { Component } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { read, utils, writeFile } from 'xlsx';
import { MdArrowBack, MdDragIndicator, MdDragHandle } from "react-icons/md";
import MUIDataTable from "mui-datatables";
import Pagination from "react-js-pagination";
import * as UserService from '../../service/User';
import moment from 'moment';
import Config from '../../helpers/Config';
import Loader from 'react-loader-spinner';
import * as Utilities from '../../helpers/Utilities';
import Constants from '../../helpers/Constants';
import GlobalData from '../../helpers/GlobalData';
import Lables from '../../containers/language/labels';
import Messages from '../../containers/language/Messages';

const pageSize = 50;
var timeZone = '';
var XLSX = require("xlsx");
const $ = require('jquery');
$.DataTable = require('datatables.net');
class ImportQrPin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userObj: [],
      fileName: "",
      isLoading: false,
      isUpdated: false,
      enterpriseId: 0,
      excelSheetRecords:[],
      uploadData:[],
      SheetColumns:[],
      UploadExcelPIN:[],
      ExcelData:[],
      validRecords:[],
      invalidRecord:[],
      headers: ['RoomNo','Pin', "CheckoutDate", "CheckinDate", "FirstName", "LastName", "Mobile1", "Email"],
      callingCode: GlobalData.restaurants_data.Supermeal_dev.countryCode,
      EnterpriseName: '',
     };

     if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
      let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
      // this.setState({ userObj: userObj })
      
      timeZone = Config.Setting.timeZone;
      this.state.EnterpriseName = Utilities.SpecialCharacterDecode(userObj.Enterprise.Name)

      if(userObj.EnterpriseRestaurant.Country != null) {
        timeZone = userObj.EnterpriseRestaurant.Country.TimeZone;
        this.state.callingCode = userObj.EnterpriseRestaurant.Country.CallingCode
        }
    }

  }

  componentDidMount() {
    
  }

handleImport = ($event) => {

  const files = $event.target.files;
  if (files.length) {
      this.Reset();
      this.setState({isLoading: true});
      const file = files[0];
      const reader = new FileReader();
      // console.log("file", file)
      this.setState({fileName : file.name})
      reader.onload = (event) => {
          const wb = read(event.target.result, { type: "array" });
          const sheets = wb.SheetNames;
          this.setState({isUpdated: false})
          if (sheets.length) {
              const firstSheetName = wb.SheetNames[0];
              const worksheet = wb.Sheets[firstSheetName];
              const rows = utils.sheet_to_json(worksheet);
              var rowNew = utils.sheet_to_json(utils.json_to_sheet(rows, {header: this.state.headers}))
              this.setState({excelSheetRecords : rowNew});
              this.ValidateExcelData(rowNew);
          }
      }
      reader.readAsArrayBuffer(file);
  }

}

handleOnClick = () => {


}

ValidateExcelData = (data) => {
  if(data != undefined && data.length > 0){
    var validRows = [];
    var inValidRows = [];
     data.forEach(row => {
    if(row.Pin != undefined && row.Pin != "" 
    && row.RoomNo != undefined && row.RoomNo != ""
    && this.isDateValid(row.CheckoutDate)
    && this.isDateValid(row.CheckinDate)
    ){
      row.CheckoutDate = row.CheckoutDate == "" || row.CheckoutDate == undefined ? "" :  moment(row.CheckoutDate, "DD/MM/YYYY HH:mm:ss").format("DD MMM YYYY HH:mm:ss")
      row.CheckinDate =  row.CheckinDate == "" || row.CheckinDate == undefined?  "" : moment(row.CheckinDate, "DD/MM/YYYY HH:mm:ss").format("DD MMM YYYY HH:mm:ss")
      row.isValid = true
      
      row.Mobile1 = row.Mobile1 == "" || row.Mobile1 == undefined ? "" :  parseInt(row.Mobile1, 10);
      validRows.push(row)
    }else{
      row.isValid = false
      inValidRows.push(row)
    }
  });
    
    // console.log("validRows", validRows);
    this.setState({validRecords: validRows, invalidRecord :inValidRows},() => this.bindDataTable())
  
  }
  this.setState({isLoading:false})
  }


  isDateValid = (date) => {

    if(date == "" || date == undefined) return true;
    return moment(date, "DD/MM/YYYY HH:mm:ss").isValid()

  }


  bindDataTable() { 
    $("#tblQR").DataTable().destroy();
    $('#tblQR').DataTable({
       "paging": true,
       "pageLength": GlobalData.restaurants_data.Supermeal_dev.pageSize,
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

SaveUserPINs = async () => {
this.setState({ isLoading: true });

var userId = 0;
var enterpriseId = Utilities.GetEnterpriseIDFromSession();


if (!Utilities.stringIsEmpty(localStorage.getItem(Constants.Session.USER_OBJECT))) {
  let userObj = JSON.parse(localStorage.getItem(Constants.Session.USER_OBJECT))
  userId = userObj.Id;
}

var countryCode = this.state.callingCode;


var stringObj = JSON.stringify(this.state.validRecords);
var dataToBeSave = JSON.parse(stringObj);
dataToBeSave.forEach(data => {

  data.CheckoutDate = data.CheckoutDate == "" || data.CheckoutDate == undefined ? moment().format("DD MMM YYYY HH:mm:ss") :  moment(data.CheckoutDate).format("DD MMM YYYY HH:mm:ss")
  data.CheckinDate =  data.CheckinDate == "" || data.CheckinDate == undefined ? moment().format("DD MMM YYYY HH:mm:ss") : moment(data.CheckinDate).format("DD MMM YYYY HH:mm:ss")

  data.CheckoutDate = Utilities.ConvertLocalTimeToUTCWithZone(data.CheckoutDate, "YYYY-MM-DDTHH:mm:ss", timeZone);
  data.CheckinDate = Utilities.ConvertLocalTimeToUTCWithZone(data.CheckinDate, "YYYY-MM-DDTHH:mm:ss", timeZone);
  data.EnterpriseId = enterpriseId;
  data.UserId = userId;
  data.CountryCode = countryCode.replace("+", "");
  data.EnterpriseName = this.state.EnterpriseName
  data.Id = 0;
});



var data = await UserService.BulkInsertQrPin({records: dataToBeSave});
if (data != undefined && data.Message == undefined) {
  Utilities.notify("Import data successfully.", "s");
  this.setState({isUpdated: true})
}else { 
   Utilities.notify("Import data failed.", "e");
}

this.setState({ isLoading: false });
}


Reset = () => {
  $("#tblQR").DataTable().destroy();
  this.setState({ isLoading: false, fileName: "", validRecords:[], invalidRecord:[], excelSheetRecords:[], isUpdated:false });
}

  render() {

    return (
      <div class="card invoice-main-wrap">
        <div
          className={
            this.state.scrolled
              ? " sub-h fixed-sub-header d-flex align-items-center"
              : "sub-h d-flex align-items-center"
          }
        >
          <span
            className="mr-3 cursor-pointer"
            onClick={() => this.props.history.goBack()}
          >
            <MdArrowBack size={24} />{" "}
          </span>
          <h3 class="card-title ">{Lables.BulkQRPINs}</h3>
         
        </div>
        <div class="card-body"> 
        {!this.state.isUpdated &&
        <div>
        <div style={{fontSize:"16px"}} className="mb-2"> {Messages.UpdatePriceUploadFile}  <a href= {GlobalData.restaurants_data.Supermeal_dev.baseImageUrl + "/content/bulk-qr-sample.xlsx"}  >Download the sample file.</a></div>
        <div className="col-lg-6 p-0">
      
        <div className="custom-file mb-2">
        <input type="file" name="file" className="custom-file-input" id="inputGroupFile" required  onChange={(event)=>this.handleImport(event)}
                                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
            <label className="custom-file-label" htmlFor="inputGroupFile">Choose file</label>
        </div>
        <div className="mt-3 mb-1" style={{fontSize:"16px"}}>
                {
                  this.state.fileName != "" &&
                  <div>{Messages.QRPIN_SelectedFile} <span className="bold"> {this.state.fileName} </span></div>
                }
                </div>
                <div className="justify-content-start mb-4 order-r p-0">
               
                {
                  this.state.excelSheetRecords.length > 0 && 
                  <div className="total-r-label p-3"><span className="t-label">{Lables.BulkTotalRecords}</span><span> {this.state.excelSheetRecords.length}</span></div>
          
                }
                {
                  this.state.validRecords.length > 0 && 
                  <div className="total-r-label p-3"><span className="t-label">{Lables.BulkValidRecords}</span><span> {this.state.validRecords.length}</span></div>
          
                
                }
                {
                  this.state.invalidRecord.length > 0 && 
                  <div className="total-r-label p-3"><span className="t-label">{Lables.BulkInvalidRecords}</span><span> {this.state.invalidRecord.length}</span></div>
                }
                </div>
               
                {
                  this.state.validRecords.length > 0 && 
                   <div className="row">
                   <div className="col-md-12">
                       <div className="align-items-center d-inline-flex ">
                           <h5 className="mr-3 mb-2 ">
                              {Messages.QRPIN_DoYoWantToSave}
                           </h5>
                           <div className="bottomBtnsDiv mb-2" style={{  display: 'flex',  marginRight: '10px' }}>
                       <Button color="primary" style={{width:'60px', marginRight:"10px"}} disabled={this.state.isUpdated} className="btn waves-effect waves-light btn-primary" onClick={ () =>  this.SaveUserPINs()}>
                        {
                        this.state.isLoading ? 
                        <span className="comment-loader"><Loader type="Oval" color="#fff" height={22} width={22} /></span>
                        : <span className="comment-text">Save</span>
                        }
                      </Button>
                       <Button className='mr-2 text-dark' color="secondary" onClick={() => this.Reset()}>Cancel</Button>
                     
                        </div>
                       </div>
                   </div>
               </div>
                }
               
      </div>
      </div>
  }
   {
                  this.state.isUpdated &&
                  <div>
                    <span class="badge badge-success  px-3  py-1 mb-0 mb-2 font-14">Success</span>
                    <p style={{fontSize:'16px'}}>  {Messages.QRPIN_SuccessfullyUpdated}</p>
                      <div className="bottomBtnsDiv mb-2" style={{  display: 'flex',  marginRight: '10px' }}>
                       <Button color="primary" style={{ marginRight:"10px"}}  className="btn waves-effect waves-light btn-primary" onClick={ () =>  this.Reset()}>
                           <span className="comment-text"> Upload another file</span>
                       </Button>
                    </div>
                    </div>
                }



          <div className="mt-5 mr-3 ml-3">
            {this.state.excelSheetRecords.length > 0 &&
          <table className="table table-inventory-wrap"  id="tblQR">
          <thead>
          <tr>
          {this.state.headers.map((header) =>
          <th><span className="fontWeight: bold">{header.replace(new RegExp('_', 'g'),' ')}</span></th>
          )}
           </tr>
          </thead>
          <tbody> 
                  {
                       this.state.excelSheetRecords.map((data, index) => (
                          <tr key={index}>
                              <td style={{wordBreak:'break-all'}}>{ data.RoomNo }</td>
                              <td>{ data.Pin }</td>
                              <td>{ data.CheckoutDate }</td>
                              <td>{ data.CheckinDate }</td>
                              <td>{ data.FirstName }</td>
                              <td>{ data.LastName }</td>
                              <td>{ data.Mobile1 }</td>
                              <td>{ data.Email }</td>
                          </tr> 
                      ))
                    
                  }
          </tbody>
      </table>
  }
</div>

      </div>
      
      </div>
      
    );



    
//     return (
//       <div class="card invoice-main-wrap">
//         <div
//           className={
//             this.state.scrolled
//               ? " sub-h fixed-sub-header d-flex align-items-center"
//               : "sub-h d-flex align-items-center"
//           }
//         >
//           <span
//             className="mr-3 cursor-pointer"
//             onClick={() => this.props.history.goBack()}
//           >
//             <MdArrowBack size={24} />{" "}
//           </span>
//           <h3 class="card-title ">Import Inventory Price</h3>
         
//         </div>
//         <div class="card-body"> 
//         <div className="col-sm-12 offset-3">
//                     <div className="row">
//                         <div className="col-md-6">
//                             <div className="input-group">
//                                 <div className="custom-file">
//                                     <input type="file" name="file" className="custom-file-input" id="inputGroupFile" required onChange={(event)=>this.handleImport(event)}
//                                         accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
//                                     <label className="custom-file-label" htmlFor="inputGroupFile">Choose file</label>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {
//                   this.state.UploadExcelPIN.length > 0 && 
//                   <div className="row">
//                         <div className="col-md-6">
//                             <div className="input-group">
//                                 <div className="custom-file">
//                                     Total records {this.state.UploadExcelPIN.length + this.state.invalidRecord.length}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 }
//                 {
//                   this.state.invalidRecord.length > 0 && 
//                   <div className="row">
//                         <div className="col-md-6">
//                             <div className="input-group">
//                                 <div className="custom-file">
//                                     Invalid records {this.state.invalidRecord.length}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 }
//                 {
//                   this.state.isUpdated &&
//                   <div className="row">
//                         <div className="col-md-6">
//                             <div className="input-group">
//                                 <div className="custom-file">
//                                   {this.state.UploadExcelPIN.length} records updated successfully
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 }

//          <div className="mt-5 mr-3 ml-3">
//            {this.state.excelSheetRecords.length > 0 &&
//           <table className="table table-inventory-wrap">
//           <thead>
//           <tr>
//           {this.state.headers.map((header) =>
//           <td><span className="fontWeight: bold">{header.replace(new RegExp('_', 'g'),' ')}</span></td>
//           )}
//            </tr>
//           </thead>
//           <tbody> 
//                   {
//                        this.state.excelSheetRecords.map((data, index) => (
//                           <tr key={index}>
//                               <td style={{wordBreak:'break-all'}}>{ data.RoomNo }</td>
//                               <td>{ data.Pin }</td>
//                               <td>{ data.CheckoutDate }</td>
//                               <td>{ data.CheckinDate }</td>
//                               <td>{ data.FirstName }</td>
//                               <td>{ data.LastName }</td>
//                               <td>{ data.Mobile1 }</td>
//                               <td>{ data.Email }</td>
//                           </tr> 
//                       ))
                    
//                   }
//           </tbody>
//       </table>
      
//           }
//           {
//             this.state.excelSheetRecords.length > 0 &&
          
//           <div className="w-full flex justify-around">
//             <div className="res-page-wrap">   
//               <Pagination 
//                 activePage={this.state.currentPage} 
//                 itemsCountPerPage={pageSize}
//                 totalItemsCount={this.state.excelSheetRecords.length}
//                 onChange={this.handlePageChange} />
//             </div>
//           </div>
//           }


// {
//                   this.state.isUpdated &&
//                   <div>
//                     <span class="badge badge-success  px-3  py-1 mb-0 mb-2 font-14">Success</span>
//                     <p style={{fontSize:'16px'}}>  {Messages.UpdatePriceSuccessfullyUpdated}</p>
//                       <div className="bottomBtnsDiv mb-2" style={{  display: 'flex',  marginRight: '10px' }}>
//                        <Button color="primary" style={{ marginRight:"10px"}}  className="btn waves-effect waves-light btn-primary" onClick={ () =>  this.Reset()}>
//                            <span className="comment-text"> Upload another file</span>
//                        </Button>
//                       <Button color="default" onClick={() => this.props.history.goBack()} className="btn btn-outline-secondary">
//                       Go to Products 
//                       </Button>
//                     </div>
//                     </div>
//                 }


//           </div>
//       </div>
      
//       </div>
//     );
  
  
  
  
  
  }








}

export default ImportQrPin;