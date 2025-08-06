
import * as UserService from '../service/User';
import Constants from '../helpers/Constants';
import * as DeviceService from '../service/Device';
import * as Utilities from '../helpers/Utilities'
export let getDeviceInfo = (token, EnterpriseId) => {
    try {
        let uniqueId = UserService.create_UUID()
        let deviceRegistrationId = token;
        let appVersion = "1.0.1";
        let appLocalVersion = appVersion + "^^^" + ("1" + "").replace(/[.]/g, "0");
        let resolution = window.innerWidth + " X " + window.innerHeight;
        var getBrowsers = getBrowserinfo()
        var operatingSystem = getOperatingSystem()
        let enterpriseId = EnterpriseId;
        var dInfo = {
            Id: uniqueId,
            appVersion: appLocalVersion,
            macAddress: '',
            model: '',
            resolution: resolution,
            operatingSystem: operatingSystem,
            registrationId: deviceRegistrationId,
            enterpriseId: Utilities.GetEnterpriseIDFromSession(),
            osVersion: getBrowsers,
            NotificationType: "firebase"
        }
        return dInfo;
    } catch (e) {
        console.log("getDeviceInfo Helper Exception", e)
    }
}

function getBrowserinfo() {
    try {
        let currentBrowser = 'Not known';
        if (window.navigator.userAgent.indexOf('Chrome') !== -1) { currentBrowser = 'Google Chrome'; }
        else if (window.navigator.userAgent.indexOf('Firefox') !== -1) { currentBrowser = 'Mozilla Firefox'; }
        else if (window.navigator.userAgent.indexOf('MSIE') !== -1) { currentBrowser = 'Internet Exployer'; }
        else if (window.navigator.userAgent.indexOf('Edge') !== -1) { currentBrowser = 'Edge'; }
        else if (window.navigator.userAgent.indexOf('Safari') !== -1) { currentBrowser = 'Safari'; }
        else if (window.navigator.userAgent.indexOf('Opera') !== -1) { currentBrowser = 'Opera'; }
        else if (window.navigator.userAgent.indexOf('Opera') !== -1) { currentBrowser = 'YaBrowser'; }
        else { console.log('Others'); }
        return currentBrowser;
    }
    catch (e) {
        console.log("getBrowserinfo Exception e", e);
        return "";
    }
}
function getOperatingSystem() {
    try {
        let operatingSystem = 'Not known';
        if (window.navigator.appVersion.indexOf('Win') !== -1) { operatingSystem = 'Windows OS'; }
        if (window.navigator.appVersion.indexOf('Mac') !== -1) { operatingSystem = 'MacOS'; }
        if (window.navigator.appVersion.indexOf('X11') !== -1) { operatingSystem = 'UNIX OS'; }
        if (window.navigator.appVersion.indexOf('Linux') !== -1) { operatingSystem = 'Linux OS'; }
        return operatingSystem;
    }
    catch (e) {
        console.log("getOperatingSystem Exception e", e);
        return "";
    }
}





export let saveDeviceInfo = async (params) => {
    let response = await DeviceService.registerDevice(params)
    if(response.status == 200)
    {

        localStorage.setItem("Registered", response.ok);
    }
    // console.log("response", response)

}