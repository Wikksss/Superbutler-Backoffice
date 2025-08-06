export var setheader = (param) => {
    header = param;
}
export var setfooter = (param) => {
    footer = param;
}
export var setbody = (param) => {
    body = param;
}
export var setTopSlider = (param) => {
    topSlider = param;
}
export var setSliders = (param) => {
    menuSlider = param;
}
export var setTopItems = (param) => {
    TopItems = param;
}
export var setPopularCategory = (param) => {
    PopularCategory = param;
}
export var setNavigationheaderJson = (param) => {
    NavigationheaderJson = param;
}

export var setNavigationFooterJson = (param) => {
    NavigationFooterJson = param;
}
export var setSocialLinks = (param) => {
    SocialLinks = param;
}
export var setAppLinks = (param) => {
    AppLinks = param;
}
export var setSeoAndTrackingLinks = (param) => {
    SeoAndTrackingLinks = param;
}


export var header = {
    HeaderBgColor: '#4A4A4A',
    HeaderNavBgColor: '#4A4A4A',
    HeaderNavColor: '#ffffff',
    HeaderNavBgColorHover: '#000000',
    HeaderNavColorActiveAndHover: '#ffffff',
    HeaderIconColor: '#ffffff',
    HeaderBasketBubbleBgColor: '#0BC113',
    HeaderBasketBubbleColor: '#ffffff',
    HeaderNotificationBubbleBgColor: '#0BC113',
    HeaderNotificationBubbleColor: '#ffffff',
    HeaderBtnBgColor: '#000000',
    HeaderBtnColor: '#ffffff',
    HeaderBtnBgColorHover: '#4A4A4A',
    HeaderBtnColorHover: '#fff',
}

export var body = {
    BodyHeadingColor: '#000000',
    BodyPColor: '#777',
    BodyTextColor: '#000',
    BodyAColor: '#2196f3',
    BodyAColorHover: '#0072cc',
    BodyIconColor: "#777777",

    BodySuccussBtnBgColor: '#0BC113',
    BodySuccussBtnColor: '#ffffff',
    BodySuccussBtnColorHover: '#ffffff',
    BodySuccussBtnBgColorHover: '#006104',

    BodyPrimaryBtnBgColor: ' #387ef5',
    BodyPrimaryBtnColor: '#ffffff',
    BodyPrimaryBtnBgColorHover: '#00358e',
    BodyPrimaryBtnColorHover: ' #ffffff',

    BodyDefaultBtnColor: '#f2f2f2',
    BodyDefaultBtnBgColor: '#000000',
    BodyDefaultBtnBgColorHover: '#d2d2d2',
    BodyDefaultBtnColorHover: '#000000',

    /*top button colors css*/
    BackTopBtnBgColor: '#4A4A4A',
    BackTopBtnBgColorIcon: "#ffffff",
    BackTopBtnBgColorHover: '#000000',
    BackTopBtnBgColorIconHover: '#ffffff',


    /*slider btn color*/
    SliderbtnBgColor: '#4fb68d',
    SliderBtnColor: '#ffffff',
    SliderBtnBgColorHover: '#253237',
    SliderBtnColorHover: '#ffffff',
    SliderHeadingColor: '#000000',
    SliderPColor: '#333333',
    SliderBgColor: '#000',

    /*Theme and style*/
    ImageRadius: '0px',
    InputRadius: '0px',
    ButtonRadius: '0px',

}

export var footer = {
    FooterBgColor: '#d2d2d2',
    FooterHeadingColor: '#000000',
    FooterPColor: '#777777',
    FooterLinkColor: '#2196f3',
    FooterLinkColorHover: '#0064b3',
    FooterBtnBgColor: '#4fb68d',
    FooterBtnColor: '#4fb68d',
    FooterBtnBgColorHover: '#4fb68d',
    FooterBtnColorHover: '#4fb68d',
    FooterIconColor: "#0064b3",
    FooterIconColorHover: '#000000',
}

export var topSlider = []
export var menuSlider = []
export var TopItems = []
export var PopularCategory = []
export var NavigationheaderJson = []
export var NavigationFooterJson = []
export var SocialLinks = {
    facebook: '',
    youtube: '',
    twitter: '',
    tiktok: '',
    linkedin: '',
    instagram: '',
    huaweiGallery: '',
    AppStore: '',
    googlePlay: '',
    microsoftStore: ''

}
export var AppLinks = []


export var SeoAndTrackingLinks = {
    Icon: '',
    Title: '',
    MetaKeywords: '',
    MetaDescription: '',
    GatCode: '',
    GoogleSearchConsoleCode: '',

}

export var CurrencyList = [
    { Id: 1, Symbol: "Rs", Currency: "PKR", SmallCurrency: 'paise', DecimalPlaces: "0", CurrencyName: "Pakitani Rupees" },
    { Id: 2, Symbol: "$", Currency: "USD", SmallCurrency: "cent", DecimalPlaces: "2.00", CurrencyName: "US dollar" },
    { Id: 3, Symbol: "£", Currency: "GBP", SmallCurrency: "penny", DecimalPlaces: "2.00", CurrencyName: "pound sterling" },
    { Id: 4, Symbol: "AED", Currency: "AED", SmallCurrency: "fils", DecimalPlaces: "2.00", CurrencyName: "Emirates darham" },

]
export var PaymentGatewayList = [
    { Id: 1, name: "PayPal", labelId: "Client Id", labelSecret: "Secret" },
    { Id: 2, name: "Stripe", labelId: "Client key", labelSecret: "Secret" },
    { Id: 3, name: "2Checkout", labelId: "Account Number", labelSecret: "Secret Word" },
    { Id: 4, name: "Network N-Genius", labelId: "Outlet Reference", labelSecret: "Service Account API key" },
    { Id: 5, name: "WorldnetTPS", labelId: "Terminal Id", labelSecret: "Shared Secret" },


]