import React, { Component, Fragment } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import Avatar from 'react-avatar';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import { Link } from 'react-router-dom'
import { FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader, Form, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation';
import * as CampaignService from '../../../service/Campaign';
import * as Utilities from '../../../helpers/Utilities';
import Loader from 'react-loader-spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import ImageUploader from 'react-images-upload';
import 'rc-color-picker/assets/index.css';
//import ReactDOM from 'react-dom';
import ColorPicker from 'rc-color-picker';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import GlobalData from '../../../helpers/GlobalData'

import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import * as DefaultTheme from '../../../helpers/DefaultTheme';
import * as EnterpriseMenuService from '../../../service/EnterpriseMenu'
const regex = /(<([^>]+)>)/ig;
export default class TopCategories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultTheme: this.props.headerTheme,
            searchItem: '',
            data: [],
            // menuJson: this.props.menuJson,
            menuJson: JSON.parse(this.props.menuJson).RestaurantMenu,
            topItem: DefaultTheme.TopItems,
            subCategoryId: '',
            selectedCheckBox: [],

        }

    }


    addItem = (item) => {
        try {
            let temp = this.state.topItem
            let isExist = [];
            isExist = temp.filter(a => a.Id == item.Id);
            if (isExist.length > 0) {
                alert("Already Selected")
                return
            }
            item.Title = item.Title.replace(regex, '')
            temp.push(item);
            this.setState({
                topItem: temp,
                searchItem: '',
                data: []
            })
            this.saveTheme(temp)
        }
        catch (e) {
            console.log("addItem Exception", e)
        }
    }
    deleteItem = (item) => {
        try {
            let temp = this.state.topItem
            let index = temp.findIndex(a => a.Id == item.Id)
            temp.splice(index, 1)
            this.setState({
                topItem: temp,
                searchItem: '',
                data: []
            })
            this.saveTheme(temp)
        }
        catch (e) {
            console.log("deleteItem Exception", e)
        }
    }


    saveTheme = (DataJson) => {
        try {
            DefaultTheme.setTopItems(DataJson)
        }
        catch (e) {
            console.log("saveTheme Exceptin", e)
        }
    }



    subCategory = (item) => {
        try {
            this.setState({
                subCategoryId: item.Id
            })

        }
        catch (e) {
            console.log("subCategory Exception ", e)
        }
    }
    renderSubCategory = item => {
        try {
            return (
                <div className="ml-3">
                    {item.MetaItems.map((data, index) => {
                        return (
                            <AvForm>
                                <div className="row">
                                    <AvInput className="form-checkbox" type="checkbox" name={"chkArea_" + index} />
                                    <span className="control-label pb-1">{data.Name}</span>
                                </div>
                            </AvForm>
                        )
                    })
                    }
                </div>
            )
        }



        catch (e) {
            console.log("renderSubCategory Exception ", e)
        }
    }
    updateCheckBox = (item, value) => {
        try {

        }
        catch (e) {
            console.log("updateCheckBox Exception", e)
        }
    }
    render() {
        // console.log("this.state.menuJson", this.state.menuJson);
        return (
            <div >

                <AvForm>
                    <div className="form-body">
                        <div className="dataTables_filter search-theme-field-wrap">
                            <AvField autoComplete="off" onChange={(e) => {

                                if (e.target != undefined && e.target.value != undefined) {
                                    var value = e.target.value
                                    this.state.searchItem = value

                                    this.state.data = [];
                                }
                            }} name="txtLink" value={this.state.searchItem} type="text" placeholder="Search items" className="form-control"
                            />
                            <div className="menu-sort-link" onClick={() => this.SortModal()}>
                                <i className=" fa fa-sort-amount-asc" aria-hidden="true"></i>
Sort Items
</div>

                        </div>

                        <div className="mb-4 slide-view-wrap">
                            <img src="data:image/jpeg;base64,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" />
                            <div className="card-body">
                                <h2>Kids</h2>
                                <p>{`Mens > Accessories > Sunglasses > Kids`}</p>
                            </div>
                            <div className="d-flex slider-buttons">
                                <div>
                                    <span className="m-b-0 statusChangeLink m-r-20">
                                        <i className="fa fa-trash-o font-18 delete" aria-hidden="true"> </i>
                                             Remove
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4 slide-view-wrap">
                            <img src="data:image/jpeg;base64,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" />
                            <div className="card-body">
                                <h2>Kids</h2>
                                <p>{`Mens > Accessories > Sunglasses > Kids`}</p>
                            </div>
                            <div className="d-flex slider-buttons">
                                <div>
                                    <span className="m-b-0 statusChangeLink m-r-20">
                                        <i className="fa fa-trash-o font-18 delete" aria-hidden="true"> </i>
                                             Remove 
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4 slide-view-wrap">
                            <img src="data:image/jpeg;base64,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" />
                            <div className="card-body">
                                <h2>Kids</h2>
                                <p>{`Mens > Accessories > Sunglasses > Kids`}</p>
                            </div>
                            <div className="d-flex slider-buttons">
                                <div>
                                    <span className="m-b-0 statusChangeLink m-r-20">
                                        <i className="fa fa-trash-o font-18 delete" aria-hidden="true"> </i>
                                             Remove 
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4 slide-view-wrap">
                            <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEhAQDxAQEBUSEBEQFRIVEBUPEBAXFhYWFhURFhYZICggGRolGxUVITEhJSkrLi4uGB8zODMsNygtLisBCgoKDg0OFRAPFSsdFxkrKy0tLSsrKy0tKy0tKysrLS03Ky0tLTcrNzc3LTctNystKzc3Ny0tLS0rNys3LSsrLf/AABEIAJ8BPgMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAABQMEBgcIAQL/xABJEAACAQMBAwgFBwcLBQEAAAAAAQIDBBEFEiExBgdBUWFxgZETIqGxwRQyQlJiktEVI3KCouHwJENTY3ODhJOjssI0NZTS4jP/xAAWAQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAXEQEBAQEAAAAAAAAAAAAAAAAAEQEx/9oADAMBAAIRAxEAPwDeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFOtXhBZnOMF1ykorzYFQEFdcstMpZU7+0TXFKvCcl4RbZZy5w9K6LpS7qdTHm4gZSDFVzgWD+bOpLuh+LKi5c2f9d/l59zFGTAxxctrHpnVX+Hqv3RZWp8sLB/z7j2zo1aa85RRKJ0EXb8o7Go8U7y1k/qqvTcvLOSThJNZTTXWnlFHoAAAAAAAAAAAAAAAAAAAACJ1rlLZ2f/U3EKbxlQztVGuvYjl47cGF6nzwW0Mq3t6tb7U5KjF9q+c/YjXvOHKX5RvdrOfTY8NmOz7MGJym5zVOLxu2pPpS6l2sDYuoc7Oo1HijGhQzw2YOpPzk2n5ERW5U6zW+dd3C/RaoeyKiQdG4dHKgo+WW+99JXhrD+lBeDwBdyr6lL515ceNzVfxPE9QXC7r/APk1V8T4hrFPpUl5MuqGo0pfTS79wV5T1fWKXzbu6f8AiJVF5SbJCz5ztWoNKrONXsq0Un5xwU4VIvg0+55E4KSxJJrqayhCMz0XngozxG7oOk+mVOW3H7rwzO9K5R2d0s0LinPs2kpLsw+k531PR0k50t2N7jx8iEp1ZReYtprpTw/MI64By7bcrL+ksU7y4iv7Rv3i65U6lVWJ311jq9POKfhFoUdK6nq9tbLaua9KivtzjFvsSe9vsRgOv879tTzGzpSuZfXlmlS70mtqXku80lOpKTcpNtvi28t97LnSrN125PKpp43bpVH04fQiDJtU5wtVu24qvKkn/N0I+jx+ssz/AGiEnYXFZ7VWTb+tUm5y897JmjTjBbMIqK6ksFQsEPDRPrVPKP7yotDpdLk/L8CUPSwRf5CodT9n4Hv5BofaXl+BJgQRa5Mwkm4ue7jvW7j1Y6mUKnJ6cH6tapB9WZQfvJxSa4NoqK5luziWM8V1rDEGLXVpewWVWqTXVtufsf4Edb63cUX6sth/ZXoZd+1T2X7TOqtVNP1EnnOVu3Y4YMc5RaYpRdWCw1x7e0kFWy5x9SpYUbqusddRVl3fnlP3mU6Jzx321s14W9aOy3810ajaWdnai3Hfj6pqcldJ0a4rPNKnOeGuC3LvfAg6A0TnPs67Sqwnbbt8pNTpp9W0t/jjyMus9Tt62PQ16NXP1KkZv2M5z/J9elCfpKU4/N4x3bn1lK2ruElJdmeKeM+/qFR04DSuj8srukvUrynHC9Wp+dw/q79649HWZRY85kY4+V0dlZxtU3l9+xLf7RVbCBD6XyosbnCo3NNt/Qk/Rz+7LDZMFAAAAAAAAAAAa055uT8JUFfQilUpyjCo0sbcJPZi31tScd/U32GltGpbdSp2zjHwSydK8vaHpNOvo4zi3nP7i21/tOdOTKTlWfVN+5ASVTSovhJrwyWtTSJ/RlF+aJpHqEVjdTT6q+g33by2nBrimu9YMvR64p8Un7RCMQRVhdVI8Kk145MkqafSlxhHw3e4tamh03wco+OUII2GsVo9Kl3x/AjbqWZN42cvOOhdxN1OT8uMai8Vgi7+0lTmozw3s53cMNv95EWkoNlWKMo5JaRK6bo29GjVrSh6ROt/+cIpxzu4ZwyVu+anU4xnU/k0sKU9iFSW10vZinFJ9SWQNcXEnsPHFtR8zLbCmoU4RXBRRiF+sJNcNpSJi31CpDCfrLqfwYwZAmfSZa2t1Gosx8V0ouEaFUHyj6KAPQB4AABTrw2oyj1xa9hUAGB2dtt1lDhmeO7L3HS/IvkxQoW1Jypxk5xUkpLaUU963Ppa3t9pz9p9JfKYLrqe5nVVKGzGMV0JLyWDIt56dQaw6NPHZBL3EFqnISxr5/NKD61u92GZOANU6jza16XrWtVtJ52X6y6t/Tw7GYVqOgXdBv0tKbxxksy8+k6LKdahCaxOMZd6yIOZkyb0jlRe22FRuKiS+hJ+kh3bMspeBt3VuRFncZbpqL61+PH2mF6tzZVYZdvPaXU9/wC/2MIkNG50M4jd0P16XvcJP3PwM40nXLa6WbetCfS45xNd8XvRom90i4t21VpSjj6SWY+fQUaFRxalFtNPKaeGu1NAdGg1Zya5eV6bjC5brw4bX87Htz9Lx39ptChWjOMZwalGSUk1wafBhX2AAAAAttSt/S0a1L+kpVIfei18Tlzk1mNWtB8eP8eR1Yc06vZ/JdWuqOMJ1auyvst7cP2ZoCQSPpI+sHuCq8SPpIH0iqJH0keI+kQe4MU5RSzWl2RivZn4mWGHahLbrz7ajXhHd8Cams+5mqL+WSl9WhKPnj8DdhrDmYssKvWa6FBPry//AJ9ps8I5n5w9F+TX11QSxGVRzh1bNVZjjsTk1+qQunzjKMXLg4rf0p9Ztvnz0bMbe9iuGbeo11PMqbfjtr9ZGnrZ4c49u2u6W9rweUQXs4SpSTT7U1waJqyulUXU1xXxLGxSqwlTlxjvi+rP8e0s2pUpdTT/AI8CjJEj0tbK8VRdTXFfHuLoo9PcBHpR8tHh9NHmAB4enjAiOTVD0l9Qh9asl5yx8Tp0535r7f0upUfsvb+69r/izogyAAAAAAAAKVa3hP58Iy70mWtPRLSLbjbUE30+ihn3F+ANf84WhUaVL5TShGDUlF43Lfwz2PGPFEzzd3npbOH2Zzj3b849rPjnQ/7bcvq9E/8AUgQnMnXcrW4T6Lj3wQGxQAAAAA0Xz42PoL62u0sKrGOX203sS/ZlA3oYHzzaL8p06c0syt5KquvZfqz9jT/VA11F5Sa6Vk9Ink7eekoxy/Wh6kuvdwfkSmS4r6PUz4yMgVMn0mUdobQV916qjGUvqxb8kYlY03Kbf8ZZMa5c4p7P1njwW9/Ak+bjQHdXFOLXqp+lqPqiuC8dy8SazrcPITTPk1nRi1iU16SXjw9mDIDxLG5bj0CN5R6TG8tq9tPH5yDSf1ZLfCXhJJ+By1fUZUamKkdiVOcqVSL4x34afdJe1nW5pLnr5M+jrK9hH83cepUwvm1UuP60V5xfWTRg+lSxUXamvj8CR1G1245Xzlw7ewgdIrYlFPjCSi+1PcpeKMnyXBjlOo4vK3NE9Y3iqLqkuK+KI3VbbD21wfHsZY06ji008NE4MqTPcljY3yqLD3S6uvtReo0r6yMnyAPSjdz2YTfVGXuKpYa1VxTa+s0vj8BqMo5kLJyuatXG6FN4fbujjym/I3aa95ltO9HZyqtYdapnwXD3o2EQAAAAAAAAAABifOo8aXd/3S/1YGP8xT/k11/bx/2Im+dyWNLue2VFf6sCD5il/Jrl9ddf7UBs0AAAAAKV1QjVhOnNbUZwlCS61JYa8mVQBy9qVlPSr6tRq52Nv0cn0b99Or3NPPiycz1G0ecjkNHU6e3T2Y14RcU3ujVjx9HJ9G/en0eO7R8oXmnTdC4pTxH6E/VnFfZfCUfYBPZPNoj6Os0ZcW4PqlFr28Cur+j/AEsPvIKucjaLOepUl9LPcmy0detdSVG3pyk5btlLanLvxwQFKrm5rKEE2s4WN7a/e/gdAchuTqsbdKSXpamJVH9Xd6tPujnzbIHm75A/I8XFyk6u5qPFQfW+1fx2bBIgACgWGu6TSvKFW2rLMakcZ6YvjGa7U0n4F+AOUOUmk1rC5nTqxxKnLZljhOPGM49j4onbK4jVhGcXnK9vSbj5xORkdSpKVPZjcUk/Rye5TXF0p9j6H0PvZoJW9ezqzp7EoyjLFS3l6sk+uHb2dO7Gck4MgqU1JOL4NEDc2c4Pg2uhpEraX1Or8x71xi904vqaK7bKqGtaE5Si4prDTzjBPlOJ9oD6yenyMlH0Quqt1KsKMd7yo+Mmv3F/e30aa65dEfi+pE5zTcm5Xdz8rqp+ioyzlrdUqdS7uLIa3Hyc09W1tQopY2KcU+/GWSQAQAAAAAAAAAAGEc8ksaZV7atBftp/AjuY6OLOq+uvL3JGWcs9A/KFrUtlNQblCcZNZScXnf2FtyB5OT0629BUlGUnUlJuOdnDe7iBkoAAAAAAABbX+n0biOxXpU60fqzgppdqzwLkAYTf81ul1W3GnVot/wBHVePKe0kRcuZuz6Lm5S/u3/xNlADALPmj02DzUlcVuyVRQi/uJP2mYaTotraR2bahTorp2Y+tL9KT3vxZfgAAAAAAAAAQHKrkhaajHFeDjOKxGtDEasezPCUex58CfAGitf5rtQpPNKNO+gvmyT9FcRXmn4KT7jFbu3urbKrU7qhj+lpbUfOSi3946fBIOW6erP61N98ZQXsciqtWf9T96p/6HS1bTqE/n0aU/wBKnGXvRRWiWi3q1tl/cU/wC1zZPWeiLjn9HP8Ay+Bd2ul6ndPFG3uZJ8Nmi6cf8ySS9p0lRtqcPmQhD9GKj7iqEaZ5N80VeclPUKipQzl0qcturLslPhHwz4G3tPsaVvThRoQjThBYjFLcvxfaXAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z" />
                            <div className="card-body">
                                <h2>Kidz</h2>
                                <p>{`Mens > Accessories > Sunglasses > Kidz`}</p>
                            </div>
                            <div className="d-flex slider-buttons">
                                <div>
                                    <span className="m-b-0 statusChangeLink m-r-20">
                                        <i className="fa fa-trash-o font-18 delete" aria-hidden="true"> </i>
                                             Remove
                                    </span>
                                </div>
                            </div>
                        </div>


                    </div>


                </AvForm>
            </div>
        )
    }
}