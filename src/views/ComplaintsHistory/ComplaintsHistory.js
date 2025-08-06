import React, { Component } from 'react'

export default class ComplaintsHistory extends Component {
  render() {
    return (
      <div className='card'>
        <div className="d-flex align-items-center mb-2 p-l-r card-body">
          <h3 className="card-title card-new-title ml-0 mb-0 pl-0">Resolved Complaints</h3>
          </div>
      
      <div class="card-body">
      <div className="order-r mb-3 justify-content-start">
    <div className="total-r-label "><span className="t-label">Complaints</span><span>228</span></div>
    <div className="total-r-label r "><span className="t-label">Resolved</span><span>98</span></div>
    <div className="total-r-label "><span className="t-label">Overdue</span><span>80</span></div>
    {/* <div className="total-r-label r"><span className="t-label">Online Payments </span><span>₦189.12</span></div>
    <div className="total-r-label r"><span className="t-label">Cancelled (21) </span><span className='text-danger'>₦1,214.24</span></div> */}
</div>

        <div className='d-flex justify-content-end mb-3 mt-3'>
        <div class="search-item-wrap">
            <input type="text" class="form-control common-serch-field" placeholder="Search"/>
            <i class="fa fa-search" aria-hidden="true"></i>
          </div>
        </div>
        <div className='complaints-table-wrap'>

        <div class="table" id="results">
  <div class="theader">
    <div class="table_header">No.</div>
    <div class="table_header">Complaint</div>
    <div class="table_header">Room No.</div>
    <div class="table_header">Reported by</div>
    <div class="table_header">Status</div>
    <div class="table_header">Assigned by</div>
    <div class="table_header"> </div>
  </div>
  <div class="table_row">
    <div class="table_small">
      <div class="table_cell d-none">No.</div>
      <div class="table_cell complaint-no">12726</div>
    </div>
    <div class="table_small">
      <div class="table_cell d-none">Complaint</div>
      <div class="table_cell complaint-text-label">TV Not working</div>
    </div>
    <div class="table_small">
      <div class="table_cell">Room No.</div>
      <div class="table_cell">1023</div>
    </div>
    <div class="table_small">
      <div class="table_cell">Reported by</div>
      <div class="table_cell">Bilal Manzoor</div>
    </div>
    <div class="table_small">
      <div class="table_cell">Reported on</div>
      <div class="table_cell">24-Mar-22</div>
    </div>
    <div class="table_small">
      <div class="table_cell">Status</div>
      <div class="table_cell">New</div>
    </div>
    <div class="table_small">
      <div class="table_cell">Assigned by</div>
      <div class="table_cell">Waqas baig</div>
    </div>
  </div>
  
  
  
</div>

        </div>
      </div>
      </div>
    )
  }
}
