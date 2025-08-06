import React from 'react';
import DefaultLayout from './containers/DefaultLayout';
import ForgotPassword from './views/ForgotPassword/ForgotPassword';
import Print from './views/Orders/Print/Print';

const AllOrders = React.lazy(() => import('./views/Orders/AllOrders'));
const ReportOrders = React.lazy(() => import('./views/Reports/Orders'));
const UserOrders = React.lazy(() => import('./views/Reports/UserOrders/Orders'));
const OrderOverview = React.lazy(() => import('./views/Orders/OrderOverview'));
const Settings = React.lazy(() => import('./views/Settings'));
const Billing = React.lazy(() => import('./views/Settings/Billing'));
const GeneralSettings = React.lazy(() => import('./views/Settings/GeneralSettings'));
const CommisionSetup = React.lazy(() => import('./views/CommisionSetup'));
const DeliveryZones = React.lazy(() => import('./views/DeliveryZones'));
const DeliveryHours = React.lazy(() => import('./views/Settings/DeliveryHours'));
const WorkingHours = React.lazy(() => import('./views/Settings/WorkingHours'));
const BankDetails = React.lazy(() => import('./views/BankDetails'));
const GeneralSetup = React.lazy(() => import('./views/GeneralSetup'));
const Addresses = React.lazy(() => import('./views/Addresses'));
const Media = React.lazy(() => import('./views/Settings/Media'));
const EnterpriseSetting = React.lazy(() => import('./views/Settings/EnterpriseSetting/EnterpriseSetting'));
const ThemeSettings = React.lazy(() => import('./views/Settings/ThemeSettings'));
const HomePageSetting = React.lazy(() => import('./views/Settings/HomePageSetting'));
const CustomPages = React.lazy(() => import('./views/Settings/CustomPages'));
const AllPages = React.lazy(() => import('./views/Settings/AllPages'));
const Navigation = React.lazy(() => import('./views/Settings/Navigation'));
const Configuration = React.lazy(() => import('./views/Settings/Configuration'));
const Menu = React.lazy(() => import('./views/Menu'));
const Complaints = React.lazy(() => import('./views/Complaints/Complaints'));
const Escalation = React.lazy(() => import('./views/Escalation/Escalation'));
const PastComplaints = React.lazy(() => import('./views/PastComplaints/PastComplaints'));
const ConciergeCommission = React.lazy(() => import('./views/ConciergeCommission/ConciergeCommission'));
const HotelDemos = React.lazy(() => import('./views/HotelDemos/HotelDemos'));
const CreateHotelDemos = React.lazy(() => import('./views/HotelDemos/CreateHotelDemo'));
const ExternalService = React.lazy(() => import('./views/ExternalService/ExternalService'));
const OrderSupport = React.lazy(() => import('./views/OrderSupport/OrderSupport'));
const ComplaintDetail = React.lazy(() => import('./views/ComplaintDetail/ComplaintDetail'));
const SupportTypes = React.lazy(() => import('./views/SupportTypes/SupportTypes'));
const OrderSource = React.lazy(() => import('./views/OrderSource/OrderSource'));
// const ReSellerBankDetail = React.lazy(() => import('./views/ReSeller/BankDetail'));

const ShoplyMenu = React.lazy(() => import('./views/ShoplyMenu'));
const MenuStatus = React.lazy(() => import('./views/MenuStatus'));
const Extras = React.lazy(() => import('./views/Extras'));
const Toppings = React.lazy(() => import('./views/Toppings'));
const AllTopping = React.lazy(() => import('./views/AllTopping'));
const Wallet = React.lazy(() => import('./views/Wallet'));
const Reviews = React.lazy(() => import('./views/Reviews'));
const Invoices = React.lazy(() => import('./views/Invoices'));
const DeliveryAreas = React.lazy(() => import('./views/DeliveryAreas'));
const AddDeliveryArea = React.lazy(() => import('./views/AddDeliveryArea'));
const Restaurants = React.lazy(() => import('./views/Restaurants'));
const QrPin = React.lazy(() => import('./views/QrPin'));
const Departments = React.lazy(() => import('./views/Departments/Departments'));
const Vouchers = React.lazy(() => import('./views/Vouchers'));
const AddVouchers = React.lazy(() => import('./views/AddVouchers'));
const Cuisines = React.lazy(() => import('./views/Cuisines'));
const AppNotification = React.lazy(() => import('./views/AppNotification'));
const AddNotification = React.lazy(() => import('./views/AddNotification'));
const SendReports = React.lazy(() => import('./views/Reports/SendReports/SendReports'));

const PhotoGallery = React.lazy(() => import('./views/PhotoGallery'));

const Users = React.lazy(() => import('./views/Users/Users'));
const UserInfo = React.lazy(() => import('./views/Users/UserInfo'));
const CampaignThemes = React.lazy(() => import('./views/Campaign/CampaignThemes'));
const CampaignAddEdit = React.lazy(() => import('./views/Campaign/EditCampaignTheme'));
const ChangePassword = React.lazy(() => import('./views/ChangePassword/ChangePassword'));
const ParentChild = React.lazy(() => import('./views/ParentChild/ParentChild'));
const CountryConfig = React.lazy(() => import('./views/CountryConfig/CountryConfig'));
const GroupVoucher = React.lazy(() => import('./views/GroupVoucher/GroupVoucher'));
const Groups = React.lazy(() => import('./views/Groups/Groups'));
const GroupsEdit = React.lazy(() => import('./views/GroupsEdit/GroupsEdit'));
const AddGroupVoucher = React.lazy(() => import('./views/AddGroupVoucher/AddGroupVoucher'));
const CreateVoucher = React.lazy(() => import('./views/CreateVoucher/CreateVoucher'));
const GroupVoucherDetails = React.lazy(() => import('./views/GroupVoucher/GroupVoucherDetails'));
const GroupVoucherSpecificDetails = React.lazy(() => import('./views/GroupVoucher/GroupVoucherSpecificDetails'));
const ManageUser = React.lazy(() => import('./views/ManageUser/UserDetails'));
const AddUser = React.lazy(() => import('./views/ManageUser/AddUser'));
const OrderDetail = React.lazy(() => import('./views/OrderDetail'));
// const Reseller = React.lazy(() => import('./views/Reseller/Reseller'));
const Resellers = React.lazy(() => import('./views/Resellers/Resellers'));  
const EditReseller = React.lazy(() => import('./views/EditReseller/EditReseller'));
const ImportQRPIN = React.lazy(() => import('./views/ImportQrPin/ImportQrPin'));
const ConciergeCommissions = React.lazy(() => import('./views/ConciergeCommission/ConciergeCommission'));
const Mews = React.lazy(() => import('./views/MewsPMS/Mews'));

const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/menu/build-menu', name: 'Menu', component: Menu },
  { path: '/active-requests', name: 'Requests', component: Complaints },
  { path: '/escalation', name: 'Escalation', component: Escalation },
  { path: '/past-requests', name: 'PastRequests', component: PastComplaints },
  { path: '/concierge-commission', name: 'ConciergeCommission', component: ConciergeCommission },
  { path: '/hotel-demos', name: 'HotelDemos', component: HotelDemos },
  { path: '/hotel-demo/createhoteldemos', name: 'CreateHotelDemos', component: CreateHotelDemos },
  { path: '/external-service/:id', name: 'ExternalService', component: ExternalService },
  { path: '/external-service', name: 'ExternalService', component: ExternalService },
  { path: '/order-support/:id', name: 'OrderSupport', component: OrderSupport },
  { path: '/order-support', name: 'OrderSupport', component: OrderSupport },
  { path: '/request-detail', name: 'RequestDetail', component: ComplaintDetail },
  { path: '/support-types', name: 'SupportTypes', component: SupportTypes },
  { path: '/order-mode', name: 'OrderSource', component: OrderSource },
  
  { path: '/catalog', name: 'Shoply Menu', component: ShoplyMenu },
  { path: '/menu/status', name: 'Menu Status', component: MenuStatus },
  { path: '/menu/options', name: 'Menu Extras', component: Extras },
  { path: '/menu/add-ons', name: 'Toppings List', component: Toppings },
  { path: '/alltopping', name: 'AllTopping', component: AllTopping },
  { path: '/status', name: 'Menu Status', component: MenuStatus },
  { path: '/options', name: 'Menu Extras', component: Extras },

  { path: '/wallet', name: 'Wallet', component: Wallet },
  { path: '/invoices', name: 'Invoices', component: Invoices },
  { path: '/orders/allorders', name: 'AllOrders', component: AllOrders },
  { path: '/reviews', name: 'Reviews', component: Reviews },
  { path: '/orders/orderoverview', name: 'Order Overview', component: OrderOverview },
  { path: '/order-detail/:enterpriseId/:token/:orderId', name: 'Order Detail', component: OrderDetail },
  { path: '/settings/overview', name: 'Settings Overview', component: Settings },
  { path: '/settings/billing', name: 'billing', component: Billing },
  { path: '/settings/businesssetting', name: 'Enterprise Setting', component: EnterpriseSetting },
  { path: '/settings/general', name: 'General Settings', component: GeneralSettings },
  { path: '/enterprise/general', name: 'General Settings', component: GeneralSettings },
  { path: '/settings/delivery-hours', name: 'Delivery Hours', component: DeliveryHours },
  { path: '/settings/working-hours', name: 'Working Hours', component: WorkingHours },
  { path: '/settings/delivery-Areas', name: 'Delivery Areas', component: DeliveryAreas },
  { path: '/settings/add-delivery-area', name: 'Add Delivery Area', component: AddDeliveryArea },
  { path: '/enterprise/commission-setup', name: 'Commision Setup', component: CommisionSetup },
  { path: '/enterprise/bank-details', name: 'Bank Details', component: BankDetails },
  { path: '/enterprise/general-setup/:id', name: 'General Setup', component: GeneralSetup },
  { path: '/enterprise/general-setup/', name: 'General Setup', component: GeneralSetup },
  { path: '/settings/addresses', name: 'Addresses', component: Addresses },
  { path: '/enterprise/addresses', name: 'Addresses', component: Addresses },
  { path: '/settings/media', name: 'Media', component: Media },
  { path: '/sitesetting/colors-settings', name: 'ThemeSettings', component: ThemeSettings },
  { path: '/sitesetting/Navigation', name: 'Navigation', component: Navigation },
  { path: '/sitesetting/home-page-setting', name: 'HomePageSetting', component: HomePageSetting },
  { path: '/sitesetting/slider-setting', name: 'HomePageSetting', component: HomePageSetting },
  { path: '/sitesetting/customPages', name: 'CustomPages', component: CustomPages },
  { path: '/sitesetting/allpages', name: 'AllPages', component: AllPages },
  { path: '/sitesetting/configuration-setting', name: 'Configuration', component: Configuration },
  { path: '/enterprise/media', name: 'Media', component: Media },
  { path: '/settings/deliveryzones', name: 'Delivery Zones', component: DeliveryZones },
  { path: '/users/all-users', exact: true,  name: 'Users', component: Users },
  { path: '/users/add-new', exact: true,  name: 'User Info', component: UserInfo },
  { path: '/users/:id', exact: true,  name: 'User Info', component: UserInfo },
  { path: '/businesses', exact: true,  name: 'Restaurants', component: Restaurants },
  { path: '/services', exact: true,  name: 'Restaurants', component: Restaurants },
  { path: '/qr-pin', exact: true,  name: 'QrPin', component: QrPin },
  
  { path: '/departments', exact: true,  name: 'Staff', component: Departments },
  
  { path: '/vouchers', exact: true,  name: 'Vouchers', component: Vouchers },
  { path: '/voucher/add-new', exact: true,  name: 'Add Voucher', component: AddVouchers },
  { path: '/voucher/:id', exact: true,  name: 'Edit Voucher', component: AddVouchers },
  { path: '/edit-delivery-area/:areaId', name: 'Edit Delivery Area', component: AddDeliveryArea },
  { path: '/campaign/themes', exact: true,  name: 'Campaign Themes', component: CampaignThemes },
  { path: '/campaign/Add/', exact: true,  name: 'New Campaign', component: CampaignAddEdit },
  { path: '/campaign/edit/:id', exact: true,  name: 'Edit Campaign', component: CampaignAddEdit },
  { path: '/forgot-password',  name: 'Forgot Password', component: ForgotPassword },
  
  { path: '/cuisines', exact: true,  name: 'Cuisines', component: Cuisines },
  { path: '/app-notification', exact: true,  name: 'AppNotification', component: AppNotification },
  { path: '/new-notification', exact: true,  name: 'AddNotification', component: AddNotification },
  { path: '/new-notification/:id', exact: true,  name: 'AddNotification', component: AddNotification },
  { path: '/edit-notification/:id', exact: true,  name: 'EditNotification', component: AddNotification },
  
  { path: '/photo-gallery', exact: true,  name: 'Cuisines', component: PhotoGallery },
  { path: '/change-password', exact: true,  name: 'Change Password', component: ChangePassword },
  { path: '/dashboard', exact: true,  name: 'Orders', component: ReportOrders },
  { path: '/reports/user-orders/:id', exact: true,  name: 'User Orders', component: UserOrders },
  { path: '/reports/user-orders/', exact: true,  name: 'User Orders', component: UserOrders },
  { path: '/duplicate-menu', exact: true,  name: 'Duplicate Menu', component: ParentChild },
  { path: '/country-config', exact: true,  name: 'Country config', component: CountryConfig },
  { path: '/groups', exact: true,  name: 'Groups', component: Groups },
  { path: '/group-edit/:id', exact: true,  name: 'GroupsEdit', component: GroupsEdit },
  { path: '/Group-voucher', exact: true,  name: 'Group Voucher', component: GroupVoucher },
  { path: '/Group-voucher/batchDetails', exact: true,  name: 'Batch Voucher', component: GroupVoucherDetails },
  { path: '/Group-voucher/voucherDetails', exact: true,  name: 'VoucherDetails', component: GroupVoucherDetails },
  { path: '/Group-voucher/create', exact: true,  name: 'Create Voucher', component: CreateVoucher },
  { path: '/Group-voucher/add-new', exact: true,  name: 'Add Group Voucher', component: AddGroupVoucher },
  { path: '/Group-voucher/:id', exact: true,  name: 'Edit Group Voucher', component: AddGroupVoucher },
  { path: '/manageuser', exact: true,  name: 'User Details', component: ManageUser },
  { path: '/manageuser/moderator', exact: true,  name: 'User Details', component: ManageUser },
  { path: '/manageuser/marketingadmin', exact: true,  name: 'User Details', component: ManageUser },
  { path: '/manageuser/restaurantadmin', exact: true,  name: 'User Details', component: ManageUser },
  { path: '/manageuser/supportadmin', exact: true,  name: 'User Details', component: ManageUser },
  { path: '/manageuser/supportuser', exact: true,  name: 'User Details', component: ManageUser },
  { path: '/manageuser/restaurantuser', exact: true,  name: 'User Details', component: ManageUser },
  { path: '/manageuser/agent', exact: true,  name: 'User Details', component: ManageUser },
  { path: '/manageuser/adduser', exact: true,  name: 'Add user', component: AddUser },
  //{ path: '/reports/customersonmap', exact: true,  name: 'Customers on Map', component: CustomersOnMap },
  { path: '/reports/sendReports', exact: true,  name: 'Send Reports', component: SendReports },
  // { path: '/reseller', exact: true,  name: 'Users', component: Reseller },
   { path: '/resellers', exact: true,  name: 'Users', component: Resellers },
   { path: '/pms/mews', exact: true,  name: 'Users', component: Mews },
  { path: '/editbusiness', exact: true,  name: 'Users', component: EditReseller },
  { path: '/importQRPins', exact: true,  name: 'ImportQRPIN', component: ImportQRPIN },
  { path: '/concierge-commission', exact: true,  name: 'ImportQRPIN', component: ConciergeCommissions },

  // { path: '/reseller/bankDetails', exact: true,  name: 'Re-seller Bank Details', component: ReSellerBankDetail },
  
];

export default routes;
