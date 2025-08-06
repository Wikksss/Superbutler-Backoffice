import React, { Component } from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import Loadable from 'react-loadable';
import './App.scss';
import Loader from 'react-loader-spinner';

const   loadingDemo = () =>  <div className="page-laoder" style={{ backgroundColor: '#431c51', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
<div> 
   <Loader 
type="Oval"
color="#fff"
height={50}	
width={50}/>  
<div className="loading-label" style={{color: "#fff"}} >Loading.....</div>
</div>
</div> ;

const  loading = () =>   <div className="page-laoder">
<div> 
   <Loader 
type="Oval"
color="#ed0000"
height={50}	
width={50}/>  
<div className="loading-label">Loading.....</div>
</div>
</div> ;


// Containers
const DefaultLayout = Loadable({
  loader: () => import('./containers/DefaultLayout'),
  loading
  
});

// Pages
const Logout = Loadable({
  loader: () => import('./views/Pages/Logout'),
  loading
});

const Login = Loadable({
  loader: () => import('./views/Pages/Login'),
  loading
});
const Print = Loadable({
  loader: () => import('./views/Orders/Print'),
  loading
});

const ForgotPassword = Loadable({
  loader: () => import('./views/ForgotPassword/ForgotPassword'),
  loading
});

const Register = Loadable({
  loader: () => import('./views/Pages/Register'),
  loading
});

const Page404 = Loadable({
  loader: () => import('./views/Pages/Page404'),
  loading
});

const Page500 = Loadable({
  loader: () => import('./views/Pages/Page500'),
  loading
});
const PointOfSale = Loadable({
  loader: () => import('./views/PointOfSale/PointOfSale'),
  loading
});

const CreateHotelDemo = Loadable({
  loader: () => import('./views/HotelDemos/CreateHotelDemo'),
  loading: loadingDemo
});


const ThankyouHotelDemo = Loadable({
  loader: () => import('./views/HotelDemos/ThankyouHotelDemo'),
  loading: loadingDemo
});
class App extends Component {

  render() {
    return (
      <BrowserRouter basename='/'>
          <Switch>
            <Route path="/login/app/:mid/:authid/:isapp" name="Login Page" component={Login} />
            <Route path="/create-demo" name="Create Hotel Demos" component={CreateHotelDemo} />
            <Route path="/thankyou" name="Thank you Hotel Demos" component={ThankyouHotelDemo} />
            <Route exact path="/login" name="Login Page" component={Login} />
            <Route exact path="/print/:token" name="Print" component={Print} />
            <Route exact path="/logout" name="Logout Page" component={Logout} />
            <Route exact path="/forgot-password" name="Forgot Password" component={ForgotPassword} />
            <Route exact path="/register" name="Register Page" component={Register} />
            <Route exact path="/404" name="Page 404" component={Page404} />
            <Route exact path="/500" name="Page 500" component={Page500} />
            <Route path="/pos" name="Home" component={PointOfSale} />
            <Route path="/" name="Home" component={DefaultLayout} />
          </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
