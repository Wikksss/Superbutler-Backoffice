import UrlConstant from '../helpers/URLConstants';
import Config from '../helpers/Config';
import * as Utilities from '../helpers/Utilities';

const CdnUrl = Config.Setting.baseImageURL;
const DeleiveryPartnerEnterpriseType = 8;

export const EnterpriseSettings = {

    "MinimumDeliveryOrder": 0.0,
    "DeliveryCharges": 0.0,
    "FreeDeliveryDistance": 0,
    "MaximumDeliveryDistance": 0,
    "OrderDeliveryTime": 0,
    "OrderCollectionTime": 0,
    "PromotionMessage": "",
    "IsCashAccepted": false,
    "IsCardAccepted": false,
    "IsCryptoAccepted": false,
    "IsECashAccepted": false,
    "IsDeliveryOffered": false,
    "IsTakeawayOffered": false,
    "IsDineInOffered": false,
    "IsBuffetOffered": false,
    "IsExecutiveDineInOffered": false,
    "IsDeliveryChargesByAmount": false,
    "DeliveryChargesByAmount": 0,
    "OtherTagCsv": "",
    "FoodTypeCsv": "",
    "WorkingHoursCsv": "",
    "DeliveryHoursCsv": "",
    "FlickerGalleryID": "",
    "VideoUrl": "",
    "EnterpriseId": 0,
    "PhotoGroupName": "",
    "PhotoNameBitStream": "",
    "PhotoName": "",
    "OldPhotoName": "",
    "UpdateItemTiming": false,
    "IsSupermealDelivery": false,
    "DeliveryPartnerSettings": ''
}


export let GetWorkingHour = async () => {

    try {

        const response = await

            fetch(UrlConstant.EnterpriseSetting + 'WorkingHour/' + Utilities.GetEnterpriseIDFromSession(),
                {
                    method: 'GET',
                    headers: Config.headers,
                })

        const result = await response.json();

        if (!result.HasError && result !== undefined) {
            return result.Dictionary.WorkingHour;
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '';

    }
    catch (e) {
        console.log('error: ', e);
        return '';
    }
}

export let GetDeliveryHour = async () => {

    try {

        const response = await

            fetch(UrlConstant.EnterpriseSetting + 'DeliveryHour/' + Utilities.GetEnterpriseIDFromSession(),
                {
                    method: 'GET',
                    headers: Config.headers,
                })

        const result = await response.json();

        if (!result.HasError && result !== undefined) {
            return result.Dictionary.DeliveryHour;
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '';

    }
    catch (e) {
        console.log('error: ', e);
        return '';
    }
}


export let Get = async () => {

    try {

        const response = await
            fetch(UrlConstant.EnterpriseSetting + Utilities.GetEnterpriseIDFromSessionObject(),
                {
                    method: 'GET',
                    headers: Config.headers,
                }
            )
        const result = await response.json();

        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.EnterpriseDetail !== undefined) {
                return JSON.parse(result.Dictionary.EnterpriseDetail);
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

export let GetQuickSetting = async () => {

    try {

        const response = await
            fetch(UrlConstant.EnterpriseQuickSetting,
                {
                    method: 'GET',
                    headers: Config.headers,
                }
            )
        const result = await response.json();

        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.EnterpriseQuickSetting !== undefined) {
                return JSON.parse(result.Dictionary.EnterpriseQuickSetting);
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

export let GetDeliveryPartners = async () => {

    try {

        const response = await
            fetch(UrlConstant.Enterprise + "ByTypeId/" + DeleiveryPartnerEnterpriseType,
                {
                    method: 'GET',
                    headers: Config.headers,
                })

        const result = await response.json();

        if (!result.HasError && result !== undefined) {
            return JSON.parse(result.Dictionary.Enterprises);
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '';

    }
    catch (e) {
        console.log('error: ', e);
        return '';
    }
}

export let Update = async (enterpriseSetting) => {

    try {

        enterpriseSetting.EnterpriseId = Utilities.GetEnterpriseIDFromSessionObject();
        const response = await

            fetch(UrlConstant.EnterpriseSetting + 'GeneralSetting',
                {
                    method: 'Put',
                    headers: Config.headers,
                    body: JSON.stringify(enterpriseSetting),
                }
            )

        const result = await response.json();

        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.IsUpdated === true) {
                return '1';
            }
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '0';

    }
    catch (e) {
        console.log('error: ', e);
        return '0';
    }
}
export let UpdateV2 = async (enterpriseSetting) => {

    try {

        enterpriseSetting.EnterpriseId = Utilities.GetEnterpriseIDFromSessionObject();
        const response = await

            fetch(UrlConstant.EnterpriseSetting + 'GeneralSetting/V2',
                {
                    method: 'Put',
                    headers: Config.headers,
                    body: JSON.stringify(enterpriseSetting),
                }
            )

        const result = await response.json();

        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.IsUpdated === true) {
                return '1';
            }
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '0';

    }
    catch (e) {
        console.log('error: ', e);
        return '0';
    }
}

export let SaveDeliveryOrWoringHours = async (enterpriseSetting) => {

    try {

        enterpriseSetting.EnterpriseId = Utilities.GetEnterpriseIDFromSessionObject();
        const response = await

            fetch(UrlConstant.EnterpriseSetting + 'SaveHours',
                {
                    method: 'Post',
                    headers: Config.headers,

                    body: JSON.stringify(enterpriseSetting),
                }
            )

        const result = await response.json();

        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.IsSaved === true) {
                return '1';
            }
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '0';

    }
    catch (e) {
        console.log('error: ', e);
        return '0';
    }
}

export let SaveMediaSeting = async (enterpriseSetting) => {

    try {

        enterpriseSetting.EnterpriseId = Utilities.GetEnterpriseIDFromSessionObject();
        const response = await

            fetch(UrlConstant.EnterpriseSetting + "Media",
                {
                    method: 'Post',
                    headers: Config.headers,

                    body: JSON.stringify(enterpriseSetting),
                }
            )

        const result = await response.json();

        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.IsUpdated === true) {
                return '1';
            }
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '0';

    }
    catch (e) {
        console.log('error: ', e);
        return '0';
    }
}


export let SavePhoto = async (enterpriseSetting) => {

    try {

        enterpriseSetting.EnterpriseId = Utilities.GetEnterpriseIDFromSessionObject();
        const response = await

            fetch(UrlConstant.EnterpriseSetting + "Photo",
                {
                    method: 'Post',
                    headers: Config.headers,

                    body: JSON.stringify(enterpriseSetting),
                }
            )

        const result = await response.json();
        return result
        // if (!result.HasError && result !== undefined) {

        //     if (result.Dictionary.IsChangesSuccessful === true) {
        //         return result.Dictionary.PhotoName;
        //     }
        // }

        // return "";

    }
    catch (e) {
        console.log('error: ', e);
        return '';
    }
}

export let ScheduleEnterpriseQuickSetting = async (enterpriseQuickSetting) => {

    try {

        const response = await fetch(UrlConstant.ScheduleEnterpriseQuickSetting,
            {
                method: 'Post',
                headers: Config.headers,

                body: JSON.stringify(enterpriseQuickSetting),
            }
        )

        const result = await response.json();

        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.IsSucceeded === true) {
                return '1';
            }
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '0';

    }
    catch (e) {
        console.log('error: ', e);
        return '0';
    }
}

export let UpdateBankDetails = async (bankDetails) => {

    try {

        const response = await

            fetch(UrlConstant.EnterpriseSetting + 'UpdateBankDetails/',
                {
                    method: 'PUT',
                    headers: Config.headers,
                    body: '["' + Utilities.GetEnterpriseIDFromSessionObject() + '","' + bankDetails + '"]',
                }
            )

        const result = await response.json();

        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.IsUpdated) {
                return '1';
            }
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '0';

    }
    catch (e) {
        console.log('error: ', e);
    }

}

export let GetHomeJsonFIle = async (enterpriseId) => {

    try {
        let GetjsonPath = CdnUrl + `/${enterpriseId}/files/homesettings.json`;
        const response = await
            fetch(GetjsonPath,
                {
                    method: 'GET',
                })

        const result = await response.json();
        if (!result.HasError && result !== undefined) {
            return result;
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '';

    }
    catch (e) {
        console.log('error: ', e);
        return '';
    }
}
export let GetSlidersJsonFIle = async (enterpriseId) => {
    try {
        let GetjsonPath = CdnUrl + `/enterprise/${enterpriseId}/files/slider.json`;
        const response = await
            fetch(GetjsonPath,
                {
                    method: 'GET',
                    cache: "no-store"
                })

        const result = await response.json();
        if (!result.HasError && result !== undefined) {
            // console.log('result', result)
            return result;
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '';

    }
    catch (e) {
        console.log('error: ', e);
        return '';
    }
}
export let GetNavigationJson = async (enterpriseId) => {

    try {
        let GetjsonPath = CdnUrl + `/${enterpriseId}/files/navigation.json`;
        const response = await
            fetch(GetjsonPath,
                {
                    method: 'GET',
                })

        const result = await response.json();
        if (!result.HasError && result !== undefined) {
            return result;
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '';

    }
    catch (e) {
        console.log('error: ', e);
        return '';
    }
}
export let GetThemeSetting = async (enterpriseId) => {

    try {
        const response = await
            fetch(UrlConstant.GetTheme + '/' + enterpriseId,
                {
                    method: 'GET',
                    headers: Config.headers,
                })

        const result = await response.json();
        if (!result.HasError && result !== undefined) {
            return result.Dictionary;
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '';

    }
    catch (e) {
        console.log('error: ', e);
        return '';
    }
}
export let UpdateTheme = async (param, enterpriseId, themeView) => {

    try {
        const response = await
            fetch(UrlConstant.UpdateTheme + "/" + enterpriseId + "/" + themeView,
                {
                    method: 'PUT',
                    headers: Config.headers,
                    body: JSON.stringify(JSON.stringify(param))
                })

        const result = await response.json();

        if (!result.HasError && result !== undefined) {
            return result.Dictionary;
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '';

    }
    catch (e) {
        console.log('error: ', e);
        return '';
    }
}
export let UpdateNavigation = async (param, enterpriseId) => {

    try {
       const response = await
            fetch(UrlConstant.SaveNavigation + "/" + enterpriseId,
                {
                    method: 'POST',
                    headers: Config.headers,
                    body: JSON.stringify(JSON.stringify(param))
                })

        const result = await response.json();
        // console.log('result', result);
        if (!result.HasError && result !== undefined) {
            return result.Dictionary;
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '';

    }
    catch (e) {
        console.log('error: ', e);
        return '';
    }
}
export let updateHomeSettings = async (param, enterpriseId) => {

    try {
        const response = await
            fetch(UrlConstant.UpdateHomeSettings + "/" + enterpriseId,
                {
                    method: 'POST',
                    headers: Config.headers,
                    body: JSON.stringify(JSON.stringify(param))
                })

        const result = await response.json();
        if (!result.HasError && result !== undefined) {
            return result.Dictionary;
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '';

    }
    catch (e) {
        console.log('error: ', e);
        return '';
    }
}
export let updateSliders = async (param, enterpriseId) => {

    try {
        const response = await
            fetch(UrlConstant.UpdateSliders + "/" + enterpriseId,
                {
                    method: 'POST',
                    headers: Config.headers,
                    body: JSON.stringify(JSON.stringify(param))
                })

        const result = await response.json();
        if (!result.HasError && result !== undefined) {
            return result.Dictionary;
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '';

    }
    catch (e) {
        console.log('error: ', e);
        return '';
    }
}
export let UpdateCustomCss = async (param, enterpriseId) => {

    try {
        const response = await
            fetch(UrlConstant.UpdateCustomCss + "/" + enterpriseId,
                {
                    method: 'PUT',
                    headers: Config.headers,
                    body: JSON.stringify(param)
                })

        const result = await response.json();
        if (!result.HasError && result !== undefined) {
            return result.Dictionary;
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '';

    }
    catch (e) {
        console.log('error: ', e);
        return '';
    }
}

export let GetEnterpriseSetting = async () => {

    try {

        const response = await
            fetch(UrlConstant.EnterpriseSetting + "Settings/" + `${Utilities.GetEnterpriseIDFromSessionObject()}`,
                {
                    method: 'GET',
                    headers: Config.headers,
                }
            )
        const result = await response.json();
        // return result;
        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.enterpriseSettings !== undefined) {
                return JSON.parse(result.Dictionary.enterpriseSettings);
            }

        }

        return {};

    }
    catch (e) {
        console.log('error: ', e);
        return {};
    }
}

export let GetProfileHealth = async () => {

    try {
        const response = await fetch(UrlConstant.EnterpriseProfileHealth + Utilities.GetEnterpriseIDFromSessionObject() ,
                {
                    method: 'GET',
                    headers: Config.headers,
                }
            )
        const result = await response.json();
        if (!result.HasError && result !== undefined) {

            if (result.Dictionary.ProfileHealth !== undefined) {
                return JSON.parse(result.Dictionary.ProfileHealth);
            }

        }
        return [];

    }
    catch (e) {
        console.log('error: ', e);
        return [];
    }
}

export let OwnerInfo = async (body) => {

    try {
        const response = await
            fetch(UrlConstant.EnterpriseSetting + `ownerInfo/` + Utilities.GetEnterpriseIDFromSessionObject(),
                {
                    method: 'PUT',
                    headers: Config.headers,
                    body: JSON.stringify(body)
                })

        const result = await response.json();
        if (!result.HasError && result !== undefined) {
            return result.Dictionary;
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '';

    }
    catch (e) {
        console.log('error: ', e);
        return '';
    }
}
export let EnterpriseInfo = async (body) => {

    try {
        const response = await
            fetch(UrlConstant.EnterpriseSetting + `enterpriseInfo`,
                {
                    method: 'PUT',
                    headers: Config.headers,
                    body: JSON.stringify(body)
                })

        const result = await response.json();
        if (!result.HasError && result !== undefined) {
            return result.Dictionary;
        }

        return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '';

    }
    catch (e) {
        console.log('error: ', e);
        return '';
    }
}
export let StoreFacilities = async (body) => {

    try {
        const response = await
            fetch(UrlConstant.EnterpriseSetting + `facilities`,
                {
                    method: 'PUT',
                    headers: Config.headers,
                    body: JSON.stringify(body)
                })

        const result = await response.json();
        return result;
        // if (result !== undefined && !result.HasError) {
        //     return result.Dictionary;
        // }

        // return result.HasError === true && result.ErrorCodeCsv !== '' ? result.ErrorCodeCsv : '';

    }
    catch (e) {
        console.log('error: ', e);
        return '';
    }
}

export let StoreOtherSetting = async (body) => {

    try {
        const response = await
            fetch(UrlConstant.EnterpriseSetting + `othersettings`,
                {
                    method: 'PUT',
                    headers: Config.headers,
                    body: JSON.stringify(body)
                })

        const result = await response.json();
        return result;

    }
    catch (e) {
        console.log('error: ', e);
        return '';
    }
}