import UrlConstant from '../helpers/URLConstants';
import Config from '../helpers/Config';
import * as Utilities from '../helpers/Utilities';
import Constants from '../helpers/Constants';

export const Voucher = {

    "Id": 0,
    "Title": "",
    "VoucherDescription": "",
    "TermAndCondition": "",
    "VoucherType": -1,
    "VoucherValue": 0.00,
    "Code": "",
    "FixedCharges": 0.0,
    "CommisssionPer": 0.0,
    "Quantity": 1,
    "Label": "",
    "MinimumOrderAmount": 0.0,
    "OverrideMinimumOrderAmount": 0.0,
    "OverrideDeliveryCharges": 0.0,
    "PhotoName": "",
    "SalesTaxNumber": 0,
    "StartDate": "",
    "ExpiryDate": "",
    "IsActive": false,
    "IsVisible": false,
    "AllowMultipleUse": false,
    "IsUserRestricted": false,
    "IsExternal": false,
    "ISDeliveryOffered": false,
    "IsCollectionOffered": false,
    "IsDineInOffered": false,
    "ExcludedCatIdsCsv": "",
    "HourCsv": "",
    "Base64Image": ""

}

// Enterprise Vouchers Method Start from here

export let GetAllEnterpriseOffers = async (enterpriseId) => {

    try {

        const response = await
            fetch(UrlConstant.EnterpriseVoucher + `EnterpriseVouchers/${enterpriseId}`,
                {
                    method: 'GET',
                    headers: Config.headers,
                }
            )
        const result = await response.json();

        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.Offers !== undefined) {
                return JSON.parse(result.Dictionary.Offers);
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

export let Get = async () => {

    try {

        let enterpriseId = Utilities.GetEnterpriseIDFromSessionObject();

        const response = await
            fetch(UrlConstant.EnterpriseVoucher + enterpriseId,
                {
                    method: 'GET',
                    headers: Config.headers,
                }
            )
        const result = await response.json();

        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.Vouchers !== undefined) {
                return JSON.parse(result.Dictionary.Vouchers);
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


export let GetBy = async (voucherId) => {

    try {

        let enterpriseId = Utilities.GetEnterpriseIDFromSessionObject();

        const response = await
            fetch(UrlConstant.EnterpriseVoucher + `/detail/${enterpriseId}/${voucherId}`,
                {
                    method: 'GET',
                    headers: Config.headers,
                }
            )
        const result = await response.json();

        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.VoucherDetail !== undefined) {
                return JSON.parse(result.Dictionary.VoucherDetail);
            }

        }

        return {};

        //});
    }
    catch (e) {
        console.log('error: ', e);
        return {};
    }

}


export let Save = async (voucher) => {

    try {

        voucher.EnterpriseId = Utilities.GetEnterpriseIDFromSession();

        const response = await

            fetch(UrlConstant.EnterpriseVoucher + "/Save",
                {
                    method: 'POST',
                    headers: Config.headers,
                    body: JSON.stringify(voucher),
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
export let saveGroupVoucher = async (voucher) => {
    try {
        const response = await fetch(UrlConstant.EnterpriseVoucher + "SaveGroupVoucher",
                {
                    method: 'POST',
                    headers: Config.headers,
                    body: JSON.stringify(voucher),
                }
            )

        const result = await response.json();
        return result;
    }
    catch (e) {
        console.log('error: ', e);
    }

}


export let Revert = async (voucherId, redemptionId, redemptionStatusID) => {
    try {
        const response = await fetch(UrlConstant.EnterpriseVoucher + "Revert",
                {
                    method: 'PUT',
                    headers: Config.headers,
                    // body: JSON.stringify(voucher),
                    body: '["' + voucherId + '","' + redemptionId+ '", "' + redemptionStatusID+ '"]'
                }
            )
        const result = await response.json();
        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.Reverted !== undefined) {
                return JSON.parse(result.Dictionary.Reverted);
            }

        }
        return false;
    }
    catch (e) {
        console.log('error: ', e);
        return false;
    }
}

export let Update = async (voucher) => {

    try {

        voucher.EnterpriseId = Utilities.GetEnterpriseIDFromSession();

        const response = await

            fetch(UrlConstant.EnterpriseVoucher + "/Update",
                {
                    method: 'PUT',
                    headers: Config.headers,
                    body: JSON.stringify(voucher),
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

export let ActivateVoucher = async (id) => {
    try {
        const response = await fetch(UrlConstant.EnterpriseVoucher + "Activate?id=" + id,
                {
                    method: 'PUT',
                    headers: Config.headers,
                    // body: JSON.stringify(id),
                }
            )
        const result = await response.json();
        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.Activated !== undefined) {
                return JSON.parse(result.Dictionary.Activated);
            }

        }
        return result;
    }
    catch (e) {
        console.log('error: ', e);
        return '0';
    }

}

export let SuspendVoucher = async (id) => {
    try {
        const response = await fetch(UrlConstant.EnterpriseVoucher + "Suspend?id=" + id,
                {
                    method: 'PUT',
                    headers: Config.headers,
                    // body: JSON.stringify(id),
                }
            )
        const result = await response.json();
        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.Suspended !== undefined) {
                return JSON.parse(result.Dictionary.Suspended);
            }
        }
        return result;
    }
    catch (e) {
        console.log('error: ', e);
        return '0';
    }
}

export let DeleteVoucher = async (id) => {
    try {
        const response = await fetch(UrlConstant.EnterpriseVoucher + "Delete?id=" + id,
                {
                    method: 'DELETE',
                    headers: Config.headers,
                    // body: JSON.stringify(id),
                }
            )
        const result = await response.json();
        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.Deleted !== undefined) {
                return JSON.parse(result.Dictionary.Deleted);
            }
        }
        return result;
    }
    catch (e) {
        console.log('error: ', e);
        return '0';
    }
}




// Enterprise Vouchers Method End here


export let SearchVoucher = async(notificationTypeId,searchText) =>{


    try {


        var parameter = {};
        parameter.NotificationVoucherType = notificationTypeId;
        parameter.SearchText = searchText;

        const response = await
            fetch(UrlConstant.VoucherSearch,
                {
                    method: 'POST',
                    headers: Config.headers,
                    body: JSON.stringify(parameter),
                }
            )
        const result = await response.json();

        if (!result.HasError && result !== undefined) {

            return JSON.parse(result.Dictionary.VoucherList)
        }

        return [];

    }
    catch (e) {
        console.log('error: ', e);
        return [];
    }


}




export let GetQRCode = async (token) => {

    try {

        const response = await
            fetch(UrlConstant.EnterpriseVoucher + "QRCode/" + token,
                {
                    method: 'GET',
                    headers: Config.headers,
                }
            )
        const result = await response.json();

        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.ImageSrc !== undefined) {
                return result.Dictionary.ImageSrc;
            }
        }

        return "";

        //});
    }
    catch (e) {
        console.log('error: ', e);
        return "";
    }
}


