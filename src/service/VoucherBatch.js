import UrlConstant from '../helpers/URLConstants';
import Config from '../helpers/Config';
import * as Utilities from '../helpers/Utilities';
import Constants from '../helpers/Constants';

export let GetBatches = async () => {
    try {
        const response = await
            fetch(UrlConstant.EnterpriseVoucherBatch,
                {
                    method: 'GET',
                    headers: Config.headers,
                }
            )
        const result = await response.json();
        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.VoucherBatch !== undefined) {
                return JSON.parse(result.Dictionary.VoucherBatch);
            }

        }
        return [];
    }
    catch (e) {
        console.log('error: ', e);
        return [];
    }
}
export let IsAvailable = async (id , name) => {
    try {
        const response = await
            fetch(UrlConstant.EnterpriseVoucherBatch + 'IsAvailable/' + id + '/' + name,
                {
                    method: 'GET',
                    headers: Config.headers,
                }
            )
        const result = await response.json();
        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.IsAvailable !== undefined) {
                return JSON.parse(result.Dictionary.IsAvailable);
            }

        }
        return [];
    }
    catch (e) {
        console.log('error: ', e);
        return [];
    }
}

export let GetBatchDetail = async (id) => {

    try {

        // console.log(localStorage.getItem(Constants.Session.AUTHENTICATION_TICKET), id)
        const response = await
            fetch(UrlConstant.EnterpriseVoucherBatch + "BatchDetail/" + id,
                {
                    method: 'GET',
                    headers: Config.headers,
                }
            )
        const result = await response.json();

        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.VoucherBatchDetail !== undefined) {
                return JSON.parse(result.Dictionary.VoucherBatchDetail);
            }

        }

        return [];

        //});
    }
    catch (e) {
        console.log('error: ', e);
        return [];
    }
}

export let GetVoucherDetailBy = async (id) => {
    try {
        const response = await
            fetch(UrlConstant.EnterpriseVoucher + "detail/" + id,
                {
                    method: 'GET',
                    headers: Config.headers,
                })
        const result = await response.json();
        if (!result.HasError && result !== undefined) {
            if (result.Dictionary.VoucherDetail !== undefined) {
                return JSON.parse(result.Dictionary.VoucherDetail);
            }
        }
        return [];
    }
    catch (e) {
        console.log('error: ', e);
        return [];
    }
}

export let GetVoucherDetailByUser = async (id,userInfo) => {
    try {
        const response = await
            fetch(UrlConstant.EnterpriseVoucher + `detail/Search/${id}`,
                {
                    method: 'Post',
                    headers: Config.headers,
                    body: "'" + userInfo + "'",
                })
        const result = await response.json();
        if (!result.HasError && result !== undefined) {
            if (result.Dictionary.VoucherDetail !== undefined) {
                return JSON.parse(result.Dictionary.VoucherDetail);
            }
        }
        return [];
    }
    catch (e) {
        console.log('error: ', e);
        return [];
    }
}




export let SaveBatch = async (voucher) => {
    try {
        const response = await fetch(UrlConstant.EnterpriseVoucherBatch + "SaveBatch",
                {
                    method: 'POST',
                    headers: Config.headers,
                    body: JSON.stringify(voucher),
                }
            )
        const result = await response.json();
        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.IsSaved !== undefined) {
                return JSON.parse(result.Dictionary.IsSaved);
            }

        }
        return false;
    }
    catch (e) {
        console.log('error: ', e);
        return false;
    }
}
export let UpdateBatch = async (voucher) => {
    try {
        const response = await fetch(UrlConstant.EnterpriseVoucherBatch + "UpdateBatch",
                {
                    method: 'PUT',
                    headers: Config.headers,
                    body: JSON.stringify(voucher),
                }
            )
        const result = await response.json();
        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.IsUpdated !== undefined) {
                return JSON.parse(result.Dictionary.IsUpdated);
            }

        }
        return false;
    }
    catch (e) {
        console.log('error: ', e);
        return false;
    }
}

export let suspendBatchVoucher = async (id) => {
    try {
        const response = await fetch(UrlConstant.EnterpriseVoucherBatch + "Suspend?id=" + id,
                {
                    method: 'PUT',
                    headers: Config.headers,
                }
            )
        const result = await response.json();
        return result;
    }
    catch (e) {
        console.log('error: ', e);
        return '0';
    }
}
export let activateBatchVoucher = async (id) => {
    try {
        
        const response = await fetch(UrlConstant.EnterpriseVoucherBatch + "Activate?id=" + id,
                {
                    method: 'PUT',
                    headers: Config.headers,
                }
            )
        const result = await response.json();
        return result;
    }
    catch (e) {
        console.log('error: ', e);
        return '0';
    }
}
export let deleteBatchVoucher = async (id) => {
    try {
        const response = await fetch(UrlConstant.EnterpriseVoucherBatch + "Delete?id=" + id,
                {
                    method: 'DELETE',
                    headers: Config.headers,
                }
            )
        const result = await response.json();
        return result;
    }
    catch (e) {
        console.log('error: ', e);
        return '0';
    }
}






