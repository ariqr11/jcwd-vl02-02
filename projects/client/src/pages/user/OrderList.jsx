import React from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from "../../helper";
import axios from "axios";
import Datetime from "../../components/DatetimeConverter";
import Currency from "../../components/CurrencyComp";
import { useLocation, useNavigate } from "react-router";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import format from 'date-fns/format';
import nodata from '../../assets/nodata.png';
import OrderDetail from "../../components/OrderDetailComp";
import LoadingComponent from "../../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import BankInfo from "../../components/BankInfoAccordion";
import bni from '../../assets/Bank BNI Logo (PNG-1080p) - FileVector69.png';
import bca from '../../assets/Bank BCA Logo (PNG-1080p) - FileVector69.png';
import bri from '../../assets/bri.png';
import { Helmet } from "react-helmet";
import { updateCart } from "../../action/useraction";

const UserOrderList = (props) => {

    const [loading, setLoading] = React.useState(false);

    const [userTransactionData, setUserTransactionData] = React.useState([]);
    const [selected, setSelected] = React.useState({
        tab: '',
        type: '',
        sort: 'new'
    });

    const [tab, setTab] = React.useState('');
    const [type, setType] = React.useState('');
    const [sort, setSort] = React.useState('');
    const [start, setStart] = React.useState('');
    const [end, setEnd] = React.useState('');

    const [totalPage, setTotalPage] = React.useState(0);
    const [showPageList, setShowPageList] = React.useState([]);
    const [activePage, setActivePage] = React.useState(1);
    const [showAccept, setShowAccept] = React.useState(0);

    const [showFilterDate, setShowFilterDate] = React.useState(false);
    const [range, setRange] = React.useState([
        {
            startDate: '',
            endDate: '',
            key: 'selection',
            color: 'teal'
        }
    ]);

    const [userCartData, setUserCartData] = React.useState([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { search } = useLocation();

    const { username } = useSelector((state) => {
        return {
            username: state.userReducer.username
        }
    })

    const [showDetail, setShowDetail] = React.useState(false);
    const [selectedDetail, setSelectedDetail] = React.useState({});
    const [inputKeyword, setInputKeyword] = React.useState('');
    const [totalData, setTotalData] = React.useState(0);
    const [showPayment, setShowPayment] = React.useState(false);

    React.useEffect(() => {
        if (search) {
            let temp = search.split('?')[1];
            let temp2 = temp.split('&');
            temp2.map((val) => {
                if (val.includes('tab')) {
                    return setTab(val.split('=')[1]);
                } else if (val.includes('type')) {
                    return setType(val.split('=')[1]);
                } else if (val.includes('sort')) {
                    return setSort(val.split('=')[1]);
                } else if (val.includes('start')) {
                    let st = val.split('=')[1];
                    setStart(st.split('%20').join(' '));
                } else if (val.includes('end')) {
                    let en = val.split('=')[1];
                    setEnd(en.split('%20').join(' '));
                }
            });
        }
        getUserTransactionData(search);
    }, [selected, activePage, showDetail, showAccept]);

    const getUserTransactionData = async (search) => {
        try {
            if (search) {
                setLoading(true);
                console.log('search', search);
                let temp = [];

                if (search.includes('tab=waiting')) {
                    temp.push('status_id=3', 'status_id=4', 'status_id=5');
                } else if (search.includes('tab=process')) {
                    temp.push('status_id=6');
                } else if (search.includes('tab=delivery')) {
                    temp.push('status_id=8');
                } else if (search.includes('tab=finished')) {
                    temp.push('status_id=9');
                } else if (search.includes('tab=cancel')) {
                    temp.push('status_id=7');
                };

                if (search.includes('type=prescription')) {
                    temp.push('prescription_pic=is_not_null');
                } else if (search.includes('type=free')) {
                    temp.push('prescription_pic=is_null');
                };

                if (search.includes('sort=new')) {
                    temp.push('date_order=desc');
                } else if (search.includes('sort=old')) {
                    temp.push('date_order=asc');
                };

                if (search.includes('page')) {
                    temp.push(`limit=5`);
                    temp.push(`offset=${(activePage - 1) * 5}`);
                };

                if (search.includes('start') && search.includes('end')) {
                    temp.push(`start=${range[0].startDate.toLocaleString("sv-SE")}`);
                    temp.push(`end=${range[0].endDate.toLocaleDateString("sv-SE") + ' ' + '23:59:59'}`);
                };

                if (search.includes('keyword')) {
                    temp.push(`keyword=${inputKeyword}`);
                }

                // console.log(`start=${range[0].startDate.toLocaleString("sv-SE")}`);
                // console.log(`end=${range[0].endDate.toLocaleDateString("sv-SE") + ' ' + '23:59:59'}`);
                // console.log('start', start);
                // console.log('end', end);
                console.log('join search', temp.join('&'));

                let userToken = localStorage.getItem('medcarelog');
                let get = await axios.get(API_URL + `/api/transaction/all?${temp.join('&')}`, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                });

                console.log('data transaksi user', get.data.results);
                console.log('jumlah data', get.data.count);
                console.log('jumlah page', Math.ceil(get.data.count / 5));

                if (get.data.results !== undefined) {
                    setLoading(false);
                    let arr = [];
                    if (get.data.count > 10) {
                        if (activePage > 1 && activePage !== Math.ceil(get.data.count / 5)) {
                            arr[0] = activePage - 1;
                            arr[1] = activePage;
                            arr[2] = activePage + 1;
                        } else if (activePage === 1) {
                            arr[0] = activePage;
                            arr[1] = activePage + 1;
                            arr[2] = activePage + 2;
                        } else if (activePage === Math.ceil(get.data.count / 5)) {
                            arr[0] = activePage - 2;
                            arr[1] = activePage - 1;
                            arr[2] = activePage;
                        }
                    } else if (get.data.count > 5) {
                        if (activePage > 1 && activePage !== Math.ceil(get.data.count / 5)) {
                            arr[0] = activePage - 1;
                            arr[1] = activePage;
                        } else if (activePage === 1) {
                            arr[0] = activePage;
                            arr[1] = activePage + 1;
                        } else if (activePage === Math.ceil(get.data.count / 5)) {
                            arr[1] = activePage - 1;
                            arr[2] = activePage;
                        }
                    } else {
                        arr[0] = activePage;
                    }
                    console.log(arr);
                    setShowPageList(arr);

                    setTotalPage(Math.ceil(get.data.count / 5));
                    setTotalData(get.data.count);
                    setUserTransactionData(get.data.results);
                } else {
                    setLoading(false);
                    toast.error("Data not found!", {
                        theme: "colored",
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                    });
                }
            } else {
                //basic page
                console.log('no query');
                let temp = [];
                temp.push('date_order=desc')

                if (activePage >= 1) {
                    temp.push(`limit=5`);
                    temp.push(`offset=${(activePage - 1) * 5}`)
                }

                console.log(temp.join('&'));

                let userToken = localStorage.getItem('medcarelog');
                let get = await axios.get(API_URL + `/api/transaction/all?${temp.join('&')}`, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                })

                console.log('data transaksi user', get.data.results);
                console.log('jumlah data', get.data.count);
                console.log('jumlah page', Math.ceil(get.data.count / 5));

                if (get.data.results !== undefined) {
                    setLoading(false);
                    let arr = [];
                    if (get.data.count > 10) {
                        if (activePage > 1 && activePage !== Math.ceil(get.data.count / 5)) {
                            arr[0] = activePage - 1;
                            arr[1] = activePage;
                            arr[2] = activePage + 1;
                        } else if (activePage === 1) {
                            arr[0] = activePage;
                            arr[1] = activePage + 1;
                            arr[2] = activePage + 2;
                        } else if (activePage === Math.ceil(get.data.count / 5)) {
                            arr[0] = activePage - 2;
                            arr[1] = activePage - 1;
                            arr[2] = activePage;
                        }
                    } else if (get.data.count > 5) {
                        if (activePage > 1 && activePage !== Math.ceil(get.data.count / 5)) {
                            arr[0] = activePage - 1;
                            arr[1] = activePage;
                        } else if (activePage === 1) {
                            arr[0] = activePage;
                            arr[1] = activePage + 1;
                        } else if (activePage === Math.ceil(get.data.count / 5)) {
                            arr[1] = activePage - 1;
                            arr[2] = activePage;
                        }
                    } else {
                        arr[0] = activePage;
                    }
                    console.log(arr);
                    setShowPageList(arr);

                    setTotalPage(Math.ceil(get.data.count / 5));
                    setTotalData(get.data.count);
                    setUserTransactionData(get.data.results);
                } else {
                    setLoading(false);
                    toast.error("Data not found!", {
                        theme: "colored",
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                    });
                }
            };

        } catch (error) {
            console.log(error)
        }
    };

    const handleFilter = async () => {
        try {
            setLoading(true);
            setSort('new');
            let temp = [];
            if (tab === 'waiting') {
                temp.push('tab=waiting')
            } else if (tab === 'process') {
                temp.push('tab=process')
            } else if (tab === 'delivery') {
                temp.push('tab=delivery')
            } else if (tab === 'finished') {
                temp.push('tab=finished')
            } else if (tab === 'cancel') {
                temp.push('tab=cancel')
            }

            if (type === 'prescription') {
                temp.push('type=prescription')
            } else if (type === 'free') {
                temp.push('type=free')
            }

            temp.push('sort=new')

            if (range[0].startDate === range[0].endDate) {
                temp.push(`start=${range[0].startDate.toLocaleString("sv-SE")}`);
                temp.push(`end=${range[0].endDate.toLocaleDateString("sv-SE") + ' ' + '23:59:59'}`);
            } else {
                if (range[0].startDate !== '') {
                    temp.push(`start=${range[0].startDate.toLocaleString("sv-SE")}`)
                }

                if (range[0].endDate !== '') {
                    temp.push(`end=${range[0].endDate.toLocaleDateString("sv-SE") + ' ' + '23:59:59'}`)
                }
            }

            if (inputKeyword !== '') {
                temp.push(`keyword=${inputKeyword}`);
            }

            if (activePage >= 1) {
                temp.push(`page=${activePage}`);
            }

            console.log(temp);

            navigate(`/${username}/transaction?${temp.join('&')}`);
            getUserTransactionData(`?${temp.join('&')}`);
        } catch (error) {
            console.log(error)
        }
    };

    const handleKeyword = async () => {
        try {
            console.log(inputKeyword);
            console.log(selected);
            console.log('range', range)

            // setLoading(true);
            let temp = [];

            if (tab === 'waiting') {
                temp.push('tab=waiting')
            } else if (tab === 'process') {
                temp.push('tab=process')
            } else if (tab === 'delivery') {
                temp.push('tab=delivery')
            } else if (tab === 'finished') {
                temp.push('tab=finished')
            } else if (tab === 'cancel') {
                temp.push('tab=cancel')
            }

            if (type === 'prescription') {
                temp.push('type=prescription')
            } else if (type === 'free') {
                temp.push('type=free')
            }

            temp.push('sort=new')

            if (range[0].startDate !== '' || range[0].endDate !== '') {
                if (range[0].startDate === range[0].endDate) {
                    temp.push(`start=${range[0].startDate.toLocaleString("sv-SE")}`);
                    temp.push(`end=${range[0].endDate.toLocaleDateString("sv-SE") + ' ' + '23:59:59'}`);
                } else {
                    if (range[0].startDate !== '') {
                        temp.push(`start=${range[0].startDate.toLocaleString("sv-SE")}`)
                    }

                    if (range[0].endDate !== '') {
                        temp.push(`end=${range[0].endDate.toLocaleDateString("sv-SE") + ' ' + '23:59:59'}`)
                    }
                }
            }


            if (inputKeyword !== '') {
                temp.push(`keyword=${inputKeyword}`);
            }

            if (activePage >= 1) {
                temp.push(`page=${activePage}`);
            }


            console.log(temp.join('&'));
            navigate(`/${username}/transaction?${temp.join('&')}`);
            getUserTransactionData(`?${temp.join('&')}`);
        } catch (error) {
            console.log(error)
        }
    };

    const printTransaction = () => {
        return userTransactionData.map((val, idx) => {
            if (val.prescription_pic) {
                return (
                    <div key={val.idtransaction} className='px-5 md:px-10 py-5 my-4 border rounded-lg shadow-md'>
                        <div className="border-b-2 flex flex-col sm:flex-row justify-between pb-3 items-center">
                            <div className="w-full sm:w-3/4 2xl:w-1/2 flex flex-col 2xl:flex-row">
                                <Datetime value={val.date_order} />
                                <p className="2xl:mx-4 font-semibold">{val.invoice_number}</p>
                            </div>
                            <div className='self-start 2xl:self-center'>
                                {
                                    val.status_id === 3 || val.status_id === 4 || val.status_id === 5 ?
                                        <p className="border-2 py-1 px-2 text-orange-50 font-semibold bg-orange-300 border-orange-400 rounded-md">{val.status_name}</p>
                                        :
                                        ""
                                }
                                {
                                    val.status_id === 6 || val.status_id === 8 || val.status_id === 9 ?
                                        <p className="border-2 py-1 px-2 text-green-600 font-semibold bg-green-300 border-green-400 rounded-md">{val.status_name}</p>
                                        :
                                        ""
                                }
                                {
                                    val.status_id === 7 ?
                                        <p className="border-2 py-1 px-2 text-red-600 font-semibold bg-red-300 border-red-400 rounded-md">{val.status_name}</p>
                                        :
                                        ""
                                }
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row my-2">
                            <div className="w-1/2 sm:w-1/5 self-center">
                                <img src={API_URL + val.prescription_pic} className="w-full p-1" alt='prescription' />
                            </div>
                            <div className="w-full sm:w-4/5">
                                <div className="h-2/4 flex">
                                    <div className="w-2/3 px-3 py-1">
                                        <p className="font-semibold">Doctor's Prescription</p>
                                    </div>
                                    <div className="w-1/3 py-1 flex justify-center font-semibold">

                                    </div>
                                </div>
                                <div className="sm:h-1/4 flex">
                                    <div className="border-b-2 w-full px-3">
                                        <button type='button' className="text-sm text-main-500 hover:underline focus:underline"
                                            onClick={() => { setShowDetail(true); setSelectedDetail(val) }}
                                        >See Order Detail</button>
                                        {
                                            showDetail ?
                                                <OrderDetail selected={selectedDetail} showModal={setShowDetail} />
                                                :
                                                ""
                                        }
                                    </div>
                                </div>
                                <div className="h-1/4 flex">
                                    <div className="w-1/2 px-3 flex items-center">
                                        <p className="font-bold">Sub Total</p>
                                    </div>
                                    <div className="w-1/2 flex justify-end items-center">
                                        {
                                            val.status_id === 3 ?
                                                <p className="font-bold">Waiting for Admin Confirmation</p>
                                                :
                                                ""
                                        }
                                        {
                                            val.status_id === 4 || val.status_id === 5 || val.status_id === 6 || val.status_id === 8 || val.status_id === 9 ?
                                                <p className="font-bold"><Currency price={val.total_price + val.delivery_price} /></p>
                                                :
                                                ""
                                        }
                                        {
                                            val.status_id === 7 ?
                                                <p className="font-bold">Order Canceled</p>
                                                :
                                                ""
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            {
                                val.status_id === 4 ?
                                    <button type='button' className="px-4 py-2 text-white font-semibold bg-main-500 border rounded-lg hover:bg-main-600 focus:ring-2 focus:ring-main-500"
                                        onClick={() => setShowPayment(true)}>Pay Now</button>
                                    :
                                    ""
                            }
                            {
                                val.status_id === 8 ?
                                    <button type='button' onClick={() => setShowAccept(val.idtransaction)}
                                        className="px-4 py-2 text-white font-semibold bg-main-500 border rounded-lg hover:bg-main-600 focus:ring-2 focus:ring-main-500">Delivery Accepted</button>
                                    :
                                    ""
                            }
                        </div>
                        {
                            showAccept === val.idtransaction ?
                                <div tabIndex={-1} className="overflow-y-auto overflow-x-hidden backdrop-blur-sm fixed right-0 left-0 top-0 flex justify-center items-center z-50 md:inset-0 h-full">
                                    <div className="relative p-4 w-full max-w-md h-auto">
                                        <div className="relative border-2 bg-white rounded-lg shadow border-main-500">
                                            <div className="p-6 text-center">
                                                <p className="text-lg font-normal text-black mb-4">Are you sure the package has been delivered to you?</p>
                                                <button type="button" className="text-white bg-main-500 hover:bg-main-600 focus:ring-2 focus:outline-none focus:ring-main-500 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                                                    onClick={() => {
                                                        onAcceptDelivery(val.idtransaction);
                                                    }}
                                                >Yes, I have the package
                                                </button>
                                                <button type="button" className="text-black bg-white focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 "
                                                    onClick={() => setShowAccept(0)}
                                                >No, Go Back
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                ""
                        }
                    </div>
                )
            } else {
                return (
                    <div key={val.idtransaction} className='px-5 md:px-10 py-5 my-4 border rounded-lg shadow-md'>
                        <div className="border-b-2 flex flex-col sm:flex-row justify-between pb-3 items-center">
                            <div className="w-full sm:w-3/4 2xl:w-1/2 flex flex-col 2xl:flex-row">
                                <Datetime value={val.date_order} />
                                <p className="2xl:mx-4 font-semibold">{val.invoice_number}</p>
                            </div>
                            <div className='self-start 2xl:self-center'>
                                {
                                    val.status_id === 3 || val.status_id === 4 || val.status_id === 5 ?
                                        <p className="border-2 py-1 px-2 text-orange-50 font-semibold bg-orange-300 border-orange-400 rounded-md">{val.status_name}</p>
                                        :
                                        ""
                                }
                                {
                                    val.status_id === 6 || val.status_id === 8 || val.status_id === 9 ?
                                        <p className="border-2 py-1 px-2 text-green-600 font-semibold bg-green-300 border-green-400 rounded-md">{val.status_name}</p>
                                        :
                                        ""
                                }
                                {
                                    val.status_id === 7 ?
                                        <p className="border-2 py-1 px-2 text-red-600 font-semibold bg-red-300 border-red-400 rounded-md">{val.status_name}</p>
                                        :
                                        ""
                                }
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row my-2">
                            <div className="w-1/2 sm:w-1/5 self-center">
                                <img src={val.transaction_detail[0].product_image} className="w-full p-1" alt='product_image' />
                            </div>
                            <div className="w-full sm:w-4/5">
                                <div className="h-2/4 flex">
                                    <div className="w-2/3 px-3 py-1">
                                        <p className="font-semibold">{val.transaction_detail[0].product_name}</p>
                                        <p className="transform: capitalize">{val.transaction_detail[0].product_qty} {val.transaction_detail[0].product_unit}</p>
                                        {
                                            val.transaction_detail.length > 1 ?
                                                <p>+{val.transaction_detail.length - 1} Items</p>
                                                :
                                                ""
                                        }
                                    </div>
                                    <div className="w-1/3 py-1 flex justify-end font-semibold">
                                        <Currency price={val.transaction_detail[0].product_price * val.transaction_detail[0].product_qty} />
                                    </div>
                                </div>
                                <div className="sm:h-1/4 flex">
                                    <div className="border-b-2 w-full px-3">
                                        <button type='button' className="text-sm text-main-500 hover:underline focus:underline"
                                            onClick={() => { setShowDetail(true); setSelectedDetail(val) }}
                                        >See Order Detail</button>
                                        {
                                            showDetail ?
                                                <OrderDetail selected={selectedDetail} showModal={setShowDetail} />
                                                :
                                                ""
                                        }
                                    </div>
                                </div>
                                <div className="h-1/4 flex">
                                    <div className="w-1/2 px-3 flex items-center">
                                        <p className="font-bold">Sub Total</p>
                                    </div>
                                    <div className="w-1/2 flex justify-end items-center">
                                        <p className="font-bold">
                                            {
                                                val.status_id === 7 ?
                                                    <p className="font-bold">Order Canceled</p>
                                                    :
                                                    <Currency price={val.total_price + val.delivery_price} />
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            {
                                val.status_id === 4 ?
                                    <button type='button' className="px-4 py-2 text-white font-semibold bg-main-500 border rounded-lg hover:bg-main-600 focus:ring-2 focus:ring-main-500"
                                        onClick={() => setShowPayment(true)}>Pay Now</button>
                                    :
                                    ""
                            }
                            {
                                val.status_id === 8 ?
                                    <button type='button' onClick={() => setShowAccept(val.idtransaction)}
                                        className="px-4 py-2 text-white font-semibold bg-main-500 border rounded-lg hover:bg-main-600 focus:ring-2 focus:ring-main-500">Delivery Accepted</button>
                                    :
                                    ""
                            }

                            {
                                val.status_id === 9 ?
                                    <button type='button' className="px-4 py-2 text-white font-semibold bg-main-500 border rounded-lg hover:bg-main-600 focus:ring-2 focus:ring-main-500"
                                        onClick={() => onBuyAgain(val.transaction_detail)}>Buy Again</button>
                                    :
                                    ""
                            }
                        </div>
                        {
                            showAccept === val.idtransaction ?
                                <div tabIndex={-1} className="overflow-y-auto overflow-x-hidden backdrop-blur-sm fixed right-0 left-0 top-0 flex justify-center items-center z-50 md:inset-0 h-full">
                                    <div className="relative p-4 w-full max-w-md h-auto">
                                        <div className="relative border-2 bg-white rounded-lg shadow border-main-500">
                                            <div className="p-6 text-center">
                                                <p className="text-lg font-normal text-black mb-4">Are you sure the package has been delivered to you?</p>
                                                <button type="button" className="text-white bg-main-500 hover:bg-main-600 focus:ring-2 focus:outline-none focus:ring-main-500 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                                                    onClick={() => {
                                                        onAcceptDelivery(val.idtransaction);
                                                    }}
                                                >Yes, I have the package
                                                </button>
                                                <button type="button" className="text-black bg-white focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 "
                                                    onClick={() => setShowAccept(0)}
                                                >No, Go Back
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                ""
                        }
                    </div>
                )
            }
        })
    };

    const printPagination = () => {
        return showPageList.map((val, idx) => {
            if (activePage === val) {
                return (
                    <li key={idx} className="border border-main-500 px-3 py-1 bg-main-500 text-white hover:cursor-default"
                        type='button' onClick={() => {
                            setActivePage(parseInt(val))

                            let query = selected;
                            let temp = [];
                            for (let key in query) {
                                if (query[key] !== '') {
                                    temp.push(`${key}=${query[key]}`);
                                }
                            };

                            if (range[0].startDate !== '' || range[0].endDate !== '') {
                                if (range[0].startDate === range[0].endDate) {
                                    temp.push(`start=${range[0].startDate.toLocaleString("sv-SE")}`);
                                    temp.push(`end=${range[0].endDate.toLocaleDateString("sv-SE") + ' ' + '23:59:59'}`);
                                } else {
                                    if (range[0].startDate !== '') {
                                        temp.push(`start=${range[0].startDate.toLocaleString("sv-SE")}`)
                                    }

                                    if (range[0].endDate !== '') {
                                        temp.push(`end=${range[0].endDate.toLocaleDateString("sv-SE") + ' ' + '23:59:59'}`)
                                    }
                                }
                            };

                            if (inputKeyword !== '') {
                                temp.push(`keyword=${inputKeyword}`);
                            };

                            temp.push(`page=${val}`);

                            console.log(temp.join('&'));
                            navigate(`/${username}/transaction?${temp.join('&')}`);
                        }}
                    >{val}</li>
                )
            } else {
                return (
                    <li key={idx} className="border border-main-500 px-3 py-1 text-main-500 hover:cursor-pointer"
                        type='button' onClick={() => {
                            setActivePage(parseInt(val))

                            let query = selected;
                            let temp = [];
                            for (let key in query) {
                                if (query[key] !== '') {
                                    temp.push(`${key}=${query[key]}`);
                                }
                            };

                            if (range[0].startDate !== '' || range[0].endDate !== '') {
                                if (range[0].startDate === range[0].endDate) {
                                    temp.push(`start=${range[0].startDate.toLocaleString("sv-SE")}`);
                                    temp.push(`end=${range[0].endDate.toLocaleDateString("sv-SE") + ' ' + '23:59:59'}`);
                                } else {
                                    if (range[0].startDate !== '') {
                                        temp.push(`start=${range[0].startDate.toLocaleString("sv-SE")}`)
                                    }

                                    if (range[0].endDate !== '') {
                                        temp.push(`end=${range[0].endDate.toLocaleDateString("sv-SE") + ' ' + '23:59:59'}`)
                                    }
                                }
                            };

                            if (inputKeyword !== '') {
                                temp.push(`keyword=${inputKeyword}`);
                            };

                            temp.push(`page=${val}`);

                            console.log(temp.join('&'));
                            navigate(`/${username}/transaction?${temp.join('&')}`);
                        }}
                    >{val}</li>
                )
            }
        })
    };

    const onAcceptDelivery = async (idtransaction) => {
        try {
            setLoading(true);
            let patch = await axios.patch(API_URL + '/api/transaction/update', { acceptDeliv: true, id: idtransaction });

            if (patch.data.success) {
                setTimeout(() => {
                    setShowAccept(0);
                    setLoading(false);
                    toast.success('Thank you for your trust to buy in our shop!', {
                        theme: "colored",
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                    });
                    getUserTransactionData();
                    navigate(`/${username}/transaction`, { replace: true })
                }, 1500)
            }

        } catch (error) {
            console.log(error)
        }
    };

    React.useEffect(() => {
        let userToken = localStorage.getItem('medcarelog');
        if (userToken !== null) {
            getUserCartData();
        }
    }, []);

    const onBuyAgain = async (items) => {
        try {
            if (items.length === 1) {
                console.log('=1', items);
                let item = items;
                let userToken = localStorage.getItem('medcarelog');
                let findIndex = userCartData.find(val => val.idproduct === item[0].product_id);

                console.log(findIndex)
                if (findIndex === undefined) {
                    console.log(true);

                    let data = {
                        idproduct: item[0].product_id,
                        newQty: 1
                    };

                    setLoading(true);
                    let res = await axios.post(API_URL + '/api/product/addcart', data, {
                        headers: {
                            'Authorization': `Bearer ${userToken}`
                        }
                    });

                    if (res.data.success) {
                        toast.success('Item Added to Cart', {
                            theme: "colored",
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: false,
                            progress: undefined,
                        });
                        getUserCartData();
                        setTimeout(() => {
                            setLoading(false);
                            navigate('/cart');
                        }, 1000);
                    }
                } else {
                    let data = {
                        idcart: findIndex.idcart,
                        newQty: findIndex.quantity + item[0].product_qty
                    };

                    setLoading(true);
                    let res = await axios.patch(API_URL + '/api/product/updatecart', data, {
                        headers: {
                            'Authorization': `Bearer ${userToken}`
                        }
                    });

                    if (res.data.success) {
                        toast.success('Item Added to Cart', {
                            theme: "colored",
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: false,
                            progress: undefined,
                        });
                        getUserCartData();
                        setTimeout(() => {
                            setLoading(false);
                            navigate('/cart');
                        }, 1000);
                    }
                }
            } else if (items.length > 1) {
                setLoading(true);
                let userToken = localStorage.getItem('medcarelog');
                console.log('>1', items);
                console.log('cart', userCartData);

                if (userCartData.length === 0) {

                    let newItem = [];

                    items.forEach((val, idx) => {
                        newItem.push({ idproduct: val.product_id, qty: val.product_qty })
                    });

                    let dataNew = {
                        multiple: true,
                        new: newItem
                    }

                    let res = await axios.post(API_URL + '/api/product/addcart', dataNew, {
                        headers: {
                            'Authorization': `Bearer ${userToken}`
                        }
                    });

                    if (res.data.success) {
                        toast.success('Item Added to Cart', {
                            theme: "colored",
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: false,
                            progress: undefined,
                        });
                        getUserCartData();
                        setTimeout(() => {
                            setLoading(false);
                            navigate('/cart');
                        }, 1000);
                    }

                } else {
                    let newArrItems = [];
                    let newArrCarts = [];

                    let existItem = [];
                    let newItem = [];

                    items.forEach((val, idx) => {
                        newArrItems.push({ idproduct: val.product_id, qty: val.product_qty })
                    });

                    userCartData.forEach((val, idx) => {
                        newArrCarts.push({ idproduct: val.product_id, qty: val.quantity })
                    })

                    console.log('newArrItems', newArrItems)
                    console.log('newArrCarts', newArrCarts)

                    newArrCarts.forEach((val, idx) => {
                        newArrItems.forEach((value, index) => {
                            if (val.idproduct === value.idproduct) {
                                existItem.push(value);
                            } else {
                                if (!newItem.includes(value)) {
                                    newItem.push(value);
                                }
                            }
                        })
                    });

                    let ids = new Set(existItem.map(({ idproduct }) => idproduct));

                    newItem = newItem.filter(({ idproduct }) => !ids.has(idproduct));

                    let newArrExist = [];
                    existItem.map((val, idx) => {
                        userCartData.map((value, index) => {
                            if (val.idproduct === value.idproduct) {
                                newArrExist.push({ ...val, idcart: value.idcart })
                            }
                        })
                    });

                    console.log('new', newItem)
                    console.log('ext', existItem)
                    console.log('new ext', newArrExist)

                    let dataExist = {
                        multiple: true,
                        exist: newArrExist
                    };

                    let dataNew = {
                        multiple: true,
                        new: newItem
                    }

                    let success = [];

                    if (newArrExist.length > 0) {
                        let resUpd = await axios.patch(API_URL + '/api/product/updatecart', dataExist, {
                            headers: {
                                'Authorization': `Bearer ${userToken}`
                            }
                        });

                        if (resUpd.data.success) {
                            success.push(true);
                        }
                    }

                    if (newItem.length > 0) {
                        let res = await axios.post(API_URL + '/api/product/addcart', dataNew, {
                            headers: {
                                'Authorization': `Bearer ${userToken}`
                            }
                        });

                        if (res.data.success) {
                            success.push(true);
                        }
                    }

                    if (success.length > 0) {
                        toast.success('Item Added to Cart', {
                            theme: "colored",
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: false,
                            progress: undefined,
                        });
                        getUserCartData();
                        setTimeout(() => {
                            setLoading(false);
                            navigate('/cart');
                        }, 1000);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getUserCartData = async () => {
        try {
            let userToken = localStorage.getItem('medcarelog');
            let get = await axios.get(API_URL + '/api/product/getcartdata', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            console.log('user cart', get.data);
            setUserCartData(get.data);
            dispatch(updateCart(get.data));
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div>
            <Helmet>
                <title>List order</title>
                <meta name="description" content='list order' />
            </Helmet>
            <div className={showDetail ? "overflow-y-hidden container mx-auto h-[40vh]" : "container mx-auto"}>
                <div className="py-5 px-1 lg:px-5 flex flex-col justify-center items-center">
                    <p className="font-bold text-main-500 text-2xl">ORDER LIST</p>
                    <div className="border-2 rounded-lg my-8 w-full lg:w-3/4 px-4 sm:px-8 lg:px-16 py-5 shadow-lg">
                        <div className="border-b-2 flex overflow-x-auto sm:overflow-x-hidden">
                            <button type="button" onClick={() => {
                                setSelected({ ...selected, tab: '', sort: 'new' });
                                setTab('all');
                                setRange([{ startDate: '', endDate: '', key: 'selection', color: 'teal' }]);
                                setActivePage(1);
                                setInputKeyword(inputKeyword);

                                let query = { ...selected, tab: '', sort: 'new' }
                                console.log('selected', selected);
                                console.log('query', query);
                                let temp = [];
                                for (let key in query) {
                                    if (query[key] !== '') {
                                        temp.push(`${key}=${query[key]}`);
                                    }
                                };

                                if (inputKeyword !== '') {
                                    temp.push(`keyword=${inputKeyword}`)
                                }
                                temp.push(`page=1`);
                                console.log(temp.join('&'));
                                navigate(`/${username}/transaction?${temp.join('&')}`);
                            }}
                                className={tab === 'all' || tab === '' ? "py-4 px-6 border-b-2 border-b-main-500 text-main-500 font-semibold" : "py-4 px-6 font-semibold"}
                            >All</button>
                            <button type="button" onClick={() => {
                                setSelected({ ...selected, tab: 'waiting', sort: 'new' });
                                setTab('waiting');
                                setRange([{ startDate: '', endDate: '', key: 'selection', color: 'teal' }]);
                                setActivePage(1);
                                setInputKeyword(inputKeyword);

                                let query = { ...selected, tab: 'waiting', sort: 'new' };
                                console.log('selected', selected);
                                console.log('query', query);
                                let temp = [];
                                for (let key in query) {
                                    if (query[key] !== '') {
                                        temp.push(`${key}=${query[key]}`);
                                    }
                                };
                                if (inputKeyword !== '') {
                                    temp.push(`keyword=${inputKeyword}`)
                                }
                                temp.push(`page=1`);
                                console.log(temp.join('&'));
                                navigate(`/${username}/transaction?${temp.join('&')}`);
                            }}
                                className={tab === 'waiting' ? "p-4 border-b-2 border-b-main-500 text-main-500 font-semibold" : "p-4 font-semibold"}
                            >Waiting</button>
                            <button type="button" onClick={() => {
                                setSelected({ ...selected, tab: 'process', sort: 'new' });
                                setTab('process');
                                setRange([{ startDate: '', endDate: '', key: 'selection', color: 'teal' }]);
                                setActivePage(1);
                                setInputKeyword(inputKeyword);

                                let query = { ...selected, tab: 'process', sort: 'new' };
                                console.log('selected', selected);
                                console.log('query', query);
                                let temp = [];
                                for (let key in query) {
                                    if (query[key] !== '') {
                                        temp.push(`${key}=${query[key]}`);
                                    }
                                };
                                if (inputKeyword !== '') {
                                    temp.push(`keyword=${inputKeyword}`)
                                }
                                temp.push(`page=1`);
                                console.log(temp.join('&'))
                                navigate(`/${username}/transaction?${temp.join('&')}`);
                            }}
                                className={tab === 'process' ? "p-4 border-b-2 border-b-main-500 text-main-500 font-semibold" : "p-4 font-semibold"}
                            >In Process</button>
                            <button type="button" onClick={() => {
                                setSelected({ ...selected, tab: 'delivery', sort: 'new' });
                                setTab('delivery');
                                setRange([{ startDate: '', endDate: '', key: 'selection', color: 'teal' }]);
                                setActivePage(1);
                                setInputKeyword(inputKeyword);

                                let query = { ...selected, tab: 'delivery', sort: 'new' };
                                console.log('selected', selected);
                                console.log('query', query);
                                let temp = [];
                                for (let key in query) {
                                    if (query[key] !== '') {
                                        temp.push(`${key}=${query[key]}`);
                                    }
                                };
                                if (inputKeyword !== '') {
                                    temp.push(`keyword=${inputKeyword}`)
                                }
                                temp.push(`page=1`);
                                console.log(temp.join('&'));
                                navigate(`/${username}/transaction?${temp.join('&')}`);
                            }}
                                className={tab === 'delivery' ? "p-4 border-b-2 border-b-main-500 text-main-500 font-semibold" : "p-4 font-semibold"}
                            >On Delivery</button>
                            <button type="button" onClick={() => {
                                setSelected({ ...selected, tab: 'finished', sort: 'new' });
                                setTab('finished');
                                setRange([{ startDate: '', endDate: '', key: 'selection', color: 'teal' }]);
                                setActivePage(1);
                                setInputKeyword(inputKeyword);

                                let query = { ...selected, tab: 'finished', sort: 'new' };
                                console.log('selected', selected);
                                console.log('query', query);
                                let temp = [];
                                for (let key in query) {
                                    if (query[key] !== '') {
                                        temp.push(`${key}=${query[key]}`);
                                    }
                                };
                                if (inputKeyword !== '') {
                                    temp.push(`keyword=${inputKeyword}`)
                                }
                                temp.push(`page=1`);
                                console.log(temp.join('&'));
                                navigate(`/${username}/transaction?${temp.join('&')}`);
                            }}
                                className={tab === 'finished' ? "p-4 border-b-2 border-b-main-500 text-main-500 font-semibold" : "p-4 font-semibold"}
                            >Finished</button>
                            <button type="button" onClick={() => {
                                setSelected({ ...selected, tab: 'cancel' });
                                setTab('cancel');
                                setRange([{ startDate: '', endDate: '', key: 'selection', color: 'teal' }]);
                                setActivePage(1);
                                setInputKeyword(inputKeyword);

                                let query = { ...selected, tab: 'cancel' };
                                console.log('selected', selected);
                                console.log('query', query);
                                let temp = [];
                                for (let key in query) {
                                    if (query[key] !== '') {
                                        temp.push(`${key}=${query[key]}`);
                                    }
                                };
                                if (inputKeyword !== '') {
                                    temp.push(`keyword=${inputKeyword}`)
                                }
                                temp.push(`page=1`);
                                console.log(temp.join('&'));
                                navigate(`/${username}/transaction?${temp.join('&')}`);
                            }}
                                className={tab === 'cancel' ? "p-4 border-b-2 border-b-main-500 text-main-500 font-semibold" : "p-4 font-semibold"}
                            >Canceled</button>
                        </div>
                        <div className="2xl:mt-3 p-2 flex flex-col 2xl:flex-row justify-between">
                            <div className="flex w-full  2xl:w-3/4 items-center">
                                <p className="w-1/3 2xl:w-1/6 font-semibold text-main-500">Type of Order</p>
                                <div className="w-2/3 2xl:w-3/6 sm:flex sm:flex-row 2xl:justify-between">
                                    <button type="button" onClick={() => {
                                        setSelected({ ...selected, type: '' });
                                        setType('all');
                                        setRange([{ startDate: '', endDate: '', key: 'selection', color: 'teal' }]);
                                        setActivePage(1);
                                        setInputKeyword(inputKeyword);

                                        let query = { ...selected, type: '' };
                                        console.log('selected', selected);
                                        console.log('query', query);
                                        let temp = [];
                                        for (let key in query) {
                                            if (query[key] !== '') {
                                                temp.push(`${key}=${query[key]}`);
                                            }
                                        };
                                        if (inputKeyword !== '') {
                                            temp.push(`keyword=${inputKeyword}`)
                                        }
                                        temp.push(`page=1`);
                                        console.log(temp.join('&'));
                                        navigate(`/${username}/transaction?${temp.join('&')}`);
                                    }}
                                        className={type === "all" || type === "" ? "border px-4 py-2 rounded-full bg-main-500 font-semibold text-white" : "border px-4 py-2 rounded-full bg-transparent font-semibold text-main-500 border-main-500"}
                                    >All Type</button>
                                    <button type="button" onClick={() => {
                                        setSelected({ ...selected, type: 'prescription' });
                                        setType('prescription');
                                        setRange([{ startDate: '', endDate: '', key: 'selection', color: 'teal' }]);
                                        setActivePage(1);
                                        setInputKeyword(inputKeyword);

                                        let query = { ...selected, type: 'prescription' };
                                        console.log('selected', selected);
                                        console.log('query', query);
                                        let temp = [];
                                        for (let key in query) {
                                            if (query[key] !== '') {
                                                temp.push(`${key}=${query[key]}`);
                                            }
                                        };
                                        if (inputKeyword !== '') {
                                            temp.push(`keyword=${inputKeyword}`)
                                        }
                                        temp.push(`page=1`);
                                        console.log(temp.join('&'));
                                        navigate(`/${username}/transaction?${temp.join('&')}`);
                                    }}
                                        className={type === "prescription" ? "border px-4 py-2 sm:mx-1 rounded-full bg-main-500 font-semibold text-white" : "border px-4 py-2 sm:mx-1 rounded-full bg-transparent font-semibold text-main-500 border-main-500"}
                                    >Prescription</button>
                                    <button type="button" onClick={() => {
                                        setSelected({ ...selected, type: 'free' });
                                        setType('free');
                                        setRange([{ startDate: '', endDate: '', key: 'selection', color: 'teal' }]);
                                        setActivePage(1);
                                        setInputKeyword(inputKeyword);

                                        let query = { ...selected, type: 'free' };
                                        console.log('selected', selected);
                                        console.log('query', query);
                                        let temp = [];
                                        for (let key in query) {
                                            if (query[key] !== '') {
                                                temp.push(`${key}=${query[key]}`);
                                            }
                                        };
                                        if (inputKeyword !== '') {
                                            temp.push(`keyword=${inputKeyword}`)
                                        }
                                        temp.push(`page=1`);
                                        console.log(temp.join('&'));
                                        navigate(`/${username}/transaction?${temp.join('&')}`);
                                    }}
                                        className={type === "free" ? "border px-4 py-2 rounded-full bg-main-500 font-semibold text-white" : "border px-4 py-2 rounded-full bg-transparent font-semibold text-main-500 border-main-500"}
                                    >Free Drugs</button>
                                </div>
                            </div>
                            <div className="flex mt-3 2xl:mt-0 items-center 2xl:w-1/4 2xl:justify-between">
                                <p className="w-1/3 font-semibold text-main-500">Sort by:</p>
                                <select className="border rounded-lg border-main-500 text-gray-500"
                                    onChange={(e) => {
                                        setSelected({ ...selected, sort: e.target.value });
                                        setSort(e.target.value);
                                        setActivePage(1);
                                        setInputKeyword(inputKeyword)

                                        let query = { ...selected, sort: e.target.value };
                                        console.log('selected', selected);
                                        console.log('query', query);
                                        let temp = [];
                                        for (let key in query) {
                                            if (query[key] !== '') {
                                                temp.push(`${key}=${query[key]}`);
                                            }
                                        };

                                        if (inputKeyword !== '') {
                                            temp.push(`keyword=${inputKeyword}`);
                                        }

                                        if (range[0].startDate !== '') {
                                            let data = range[0];
                                            for (let key in data) {
                                                console.log(key, data[key]);
                                                if (key === 'startDate') {
                                                    temp.push(`start=${data[key].toLocaleString('sv-SE')}`);
                                                } else if (key === 'endDate') {
                                                    temp.push(`end=${data[key].toLocaleDateString('sv-SE')} 23:59:59`);
                                                }
                                            }
                                        };
                                        temp.push(`page=1`);
                                        console.log(temp.join('&'))
                                        navigate(`/${username}/transaction?${temp.join('&')}`);
                                        getUserTransactionData(`?${temp.join('&')}`);
                                    }}
                                    value={sort}>
                                    <option value="new">Newest</option>
                                    <option value="old">Oldest</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-2 flex items-center">
                            <div className="flex w-full 2xl:w-4/5">
                                <div className="flex w-1/3 2xl:w-1/6">
                                    <p className="font-semibold text-main-500 mr-2">Filter by Date :</p>
                                </div>
                                <div className="flex flex-col 2xl:flex-row w-2/3 sm:w-1/3 2xl:w-5/6">
                                    <div className="p-1 border border-main-500 rounded 2xl:flex mx-1">
                                        <input
                                            value={range[0].startDate !== '' ? `${format(range[0].startDate, "MM/dd/yyyy")}` : ''}
                                            className="text-center w-full"
                                            placeholder={search.includes('start') ? start.split(' ')[0].split('-').join('/') : 'Select Start Date'}
                                            onClick={() => setShowFilterDate(true)}
                                        />
                                    </div>
                                    <div className="p-1 border border-main-500 rounded 2xl:flex mx-1 mt-1 2xl:mt-0">
                                        <input
                                            value={range[0].endDate !== '' ? `${format(range[0].endDate, "MM/dd/yyyy")}` : ''}
                                            className="text-center w-full"
                                            placeholder={search.includes('end') ? end.split(' ')[0].split('-').join('/') : 'Select End Date'}
                                            onClick={() => setShowFilterDate(true)}
                                        />
                                    </div>
                                    <div className="flex">
                                        <button type="button" className="text-start ml-2 text-main-500 hover:underline focus:underline font-semibold"
                                            onClick={() => {
                                                setSort('new');
                                                setActivePage(1); handleFilter();
                                            }}>Filter</button>
                                        <button type="button" className="text-start ml-2 hover:underline"
                                            onClick={() => {
                                                setRange([{
                                                    startDate: '',
                                                    endDate: '',
                                                    key: 'selection',
                                                    color: 'teal'
                                                }]);
                                                setStart('');
                                                setEnd('');
                                                setSort('new');

                                                setSelected({ ...selected });
                                                setActivePage(1);
                                                setInputKeyword(inputKeyword);

                                                let query = { ...selected, sort: 'new' }
                                                console.log('selected', selected)
                                                console.log('query', query)
                                                let temp = [];
                                                for (let key in query) {
                                                    if (query[key] !== '') {
                                                        temp.push(`${key}=${query[key]}`)
                                                    }
                                                };
                                                if (inputKeyword !== '') {
                                                    temp.push(`keyword=${inputKeyword}`);
                                                }
                                                temp.push(`page=1`);
                                                console.log('clear', temp.join('&'))
                                                navigate(`/${username}/transaction?${temp.join('&')}`);
                                            }}
                                        >Clear</button>
                                    </div>
                                </div>
                                {
                                    showFilterDate ?
                                        <div tabIndex={-1} className="overflow-y-auto overflow-x-hidden backdrop-blur-sm fixed right-0 left-0 top-0 flex justify-center items-center z-50 md:inset-0 h-modal md:h-full">
                                            <div className="relative p-4 w-1/2 h-full md:h-auto">
                                                <div className="relative border-2 bg-white rounded-lg shadow border-main-500">
                                                    <div className="p-6 text-center flex flex-col items-center justify-center">
                                                        <DateRangePicker
                                                            onChange={item => setRange([item.selection])}
                                                            editableDateInputs={true}
                                                            moveRangeOnFirstSelection={false}
                                                            ranges={range}
                                                            months={2}
                                                            direction="horizontal"
                                                        />
                                                        <button type='button' className="border rounded-lg bg-main-500 text-white px-4 py-2 font-bold hover:bg-main-600 focus:ring-2 focus:ring-main-500"
                                                            onClick={() => {
                                                                setShowFilterDate(false);
                                                            }}>Set Date</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        ""
                                }
                            </div>
                        </div>
                        <div className="p-2 flex items-center">
                            <div className="flex w-full 2xl:w-4/5">
                                <div className="flex w-1/3 2xl:w-1/6">
                                    <p className="font-semibold text-main-500 mr-2">Search :</p>
                                </div>
                                <div className="flex flex-col 2xl:flex-row w-2/3 sm:w-1/3 2xl:w-5/6">
                                    <div className="p-1 border border-main-500 rounded mx-1">
                                        <input
                                            value={inputKeyword}
                                            className="text-center w-full"
                                            placeholder='Keyword'
                                            onChange={(e) => setInputKeyword(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-start">
                                        <button type="button" className="ml-2 text-main-500 hover:underline focus:underline font-semibold"
                                            onClick={() => {
                                                setActivePage(1);
                                                handleKeyword();
                                            }}>Search</button>
                                        <button type="button" className="ml-2 hover:underline"
                                            onClick={() => {
                                                setInputKeyword('');
                                                setRange([{
                                                    startDate: '',
                                                    endDate: '',
                                                    key: 'selection',
                                                    color: 'teal'
                                                }]);
                                                setStart('');
                                                setEnd('');
                                                setSort('new');

                                                setSelected({ ...selected });
                                                setActivePage(1);
                                                setInputKeyword('');

                                                let query = { ...selected, sort: 'new' }
                                                console.log('selected', selected)
                                                console.log('query', query)
                                                let temp = [];
                                                for (let key in query) {
                                                    if (query[key] !== '') {
                                                        temp.push(`${key}=${query[key]}`)
                                                    }
                                                };
                                                temp.push(`page=1`);
                                                console.log('clear', temp.join('&'))
                                                navigate(`/${username}/transaction?${temp.join('&')}`);
                                            }}
                                        >Clear</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            userTransactionData.length > 0 ?
                                <>
                                    <div>
                                        {printTransaction()}
                                    </div>
                                    <div className="text-center my-3">
                                        <p>Show <a className="font-bold">{(activePage * 5) - 4}</a> to <a className="font-bold">{activePage === totalPage ? totalData : activePage * 5}</a> of <a className="font-bold">{totalData}</a> Entries</p>
                                    </div>
                                    <div className="w-full flex justify-center items-center">
                                        <ul className="list-none flex">
                                            {
                                                activePage === 1 ?
                                                    <li className="hidden sm:block border border-gray-300 rounded-l-full px-3 py-1 font-semibold text-gray-300 hover:cursor-default">Previous</li>
                                                    :
                                                    <li className="hidden sm:block border border-main-500 rounded-l-full px-3 py-1 font-semibold text-main-500 hover:cursor-pointer"
                                                        type='button' onClick={() => {
                                                            setActivePage(activePage - 1);

                                                            let query = selected;
                                                            let temp = [];
                                                            for (let key in query) {
                                                                if (query[key] !== '') {
                                                                    temp.push(`${key}=${query[key]}`);
                                                                }
                                                            };

                                                            if (range[0].startDate !== '' || range[0].endDate !== '') {
                                                                if (range[0].startDate === range[0].endDate) {
                                                                    temp.push(`start=${range[0].startDate.toLocaleString("sv-SE")}`);
                                                                    temp.push(`end=${range[0].endDate.toLocaleDateString("sv-SE") + ' ' + '23:59:59'}`);
                                                                } else {
                                                                    if (range[0].startDate !== '') {
                                                                        temp.push(`start=${range[0].startDate.toLocaleString("sv-SE")}`)
                                                                    }

                                                                    if (range[0].endDate !== '') {
                                                                        temp.push(`end=${range[0].endDate.toLocaleDateString("sv-SE") + ' ' + '23:59:59'}`)
                                                                    }
                                                                }
                                                            };

                                                            if (inputKeyword !== '') {
                                                                temp.push(`keyword=${inputKeyword}`);
                                                            };

                                                            temp.push(`page=${activePage - 1}`);

                                                            console.log(temp.join('&'));
                                                            navigate(`/${username}/transaction?${temp.join('&')}`);
                                                        }}
                                                    >Previous</li>
                                            }
                                            {
                                                activePage === 1 ?
                                                    <li className="sm:hidden border border-gray-300 rounded-l-full px-3 py-1 font-semibold text-gray-300 hover:cursor-default">{'<'}</li>
                                                    :
                                                    <li className="sm:hidden border border-main-500 rounded-l-full px-3 py-1 font-semibold text-main-500 hover:cursor-pointer"
                                                        type='button' onClick={() => {
                                                            setActivePage(activePage - 1)
                                                            let query = selected;
                                                            let temp = [];
                                                            for (let key in query) {
                                                                if (query[key] !== '') {
                                                                    temp.push(`${key}=${query[key]}`);
                                                                }
                                                            };

                                                            if (range[0].startDate !== '' || range[0].endDate !== '') {
                                                                if (range[0].startDate === range[0].endDate) {
                                                                    temp.push(`start=${range[0].startDate.toLocaleString("sv-SE")}`);
                                                                    temp.push(`end=${range[0].endDate.toLocaleDateString("sv-SE") + ' ' + '23:59:59'}`);
                                                                } else {
                                                                    if (range[0].startDate !== '') {
                                                                        temp.push(`start=${range[0].startDate.toLocaleString("sv-SE")}`)
                                                                    }

                                                                    if (range[0].endDate !== '') {
                                                                        temp.push(`end=${range[0].endDate.toLocaleDateString("sv-SE") + ' ' + '23:59:59'}`)
                                                                    }
                                                                }
                                                            };

                                                            if (inputKeyword !== '') {
                                                                temp.push(`keyword=${inputKeyword}`);
                                                            };

                                                            temp.push(`page=${activePage - 1}`);

                                                            console.log(temp.join('&'));
                                                            navigate(`/${username}/transaction?${temp.join('&')}`);
                                                        }}
                                                    >{'<'}</li>
                                            }
                                            {printPagination()}
                                            {
                                                activePage === totalPage ?
                                                    <li className="sm:hidden border border-gray-300 rounded-r-full px-3 py-1 font-semibold text-gray-300 hover:cursor-default">{'>'}</li>
                                                    :
                                                    <li className="sm:hidden border border-main-500 rounded-r-full px-3 py-1 font-semibold text-main-500 hover:cursor-pointer"
                                                        type='button' onClick={() => {
                                                            setActivePage(activePage + 1)
                                                            let query = selected;
                                                            let temp = [];
                                                            for (let key in query) {
                                                                if (query[key] !== '') {
                                                                    temp.push(`${key}=${query[key]}`);
                                                                }
                                                            };

                                                            if (range[0].startDate !== '' || range[0].endDate !== '') {
                                                                if (range[0].startDate === range[0].endDate) {
                                                                    temp.push(`start=${range[0].startDate.toLocaleString("sv-SE")}`);
                                                                    temp.push(`end=${range[0].endDate.toLocaleDateString("sv-SE") + ' ' + '23:59:59'}`);
                                                                } else {
                                                                    if (range[0].startDate !== '') {
                                                                        temp.push(`start=${range[0].startDate.toLocaleString("sv-SE")}`)
                                                                    }

                                                                    if (range[0].endDate !== '') {
                                                                        temp.push(`end=${range[0].endDate.toLocaleDateString("sv-SE") + ' ' + '23:59:59'}`)
                                                                    }
                                                                }
                                                            };

                                                            if (inputKeyword !== '') {
                                                                temp.push(`keyword=${inputKeyword}`);
                                                            };

                                                            temp.push(`page=${activePage + 1}`);

                                                            console.log(temp.join('&'));
                                                            navigate(`/${username}/transaction?${temp.join('&')}`);
                                                        }}
                                                    >{'>'}</li>
                                            }
                                            {
                                                activePage === totalPage ?
                                                    <li className="hidden sm:block border border-gray-300 rounded-r-full px-5 py-1 font-semibold text-gray-300 hover:cursor-default">Next</li>
                                                    :
                                                    <li className="hidden sm:block border border-main-500 rounded-r-full px-5 py-1 font-semibold text-main-500 hover:cursor-pointer"
                                                        type='button' onClick={() => {
                                                            setActivePage(activePage + 1)
                                                            let query = selected;
                                                            let temp = [];
                                                            for (let key in query) {
                                                                if (query[key] !== '') {
                                                                    temp.push(`${key}=${query[key]}`);
                                                                }
                                                            };

                                                            if (range[0].startDate !== '' || range[0].endDate !== '') {
                                                                if (range[0].startDate === range[0].endDate) {
                                                                    temp.push(`start=${range[0].startDate.toLocaleString("sv-SE")}`);
                                                                    temp.push(`end=${range[0].endDate.toLocaleDateString("sv-SE") + ' ' + '23:59:59'}`);
                                                                } else {
                                                                    if (range[0].startDate !== '') {
                                                                        temp.push(`start=${range[0].startDate.toLocaleString("sv-SE")}`)
                                                                    }

                                                                    if (range[0].endDate !== '') {
                                                                        temp.push(`end=${range[0].endDate.toLocaleDateString("sv-SE") + ' ' + '23:59:59'}`)
                                                                    }
                                                                }
                                                            };

                                                            if (inputKeyword !== '') {
                                                                temp.push(`keyword=${inputKeyword}`);
                                                            };

                                                            temp.push(`page=${activePage + 1}`);

                                                            console.log(temp.join('&'));
                                                            navigate(`/${username}/transaction?${temp.join('&')}`);
                                                        }}
                                                    >Next</li>
                                            }
                                        </ul>
                                    </div>
                                    {/* MODAL SELECT PAYMENT */}
                                    {
                                        showPayment ?
                                            <div tabIndex={-1} className="overflow-y-auto overflow-x-hidden backdrop-blur-sm fixed right-0 left-0 top-0 flex justify-center items-center z-50 md:inset-0 h-full">
                                                <div className="relative p-4 w-full md:w-2/3 lg:w-1/2 h-full sm:h-auto">
                                                    <div className="relative border-2 bg-white rounded-lg shadow border-main-500">
                                                        <div className="p-6 text-center">
                                                            <div>
                                                                <p className='text-2xl font-bold text-main-500'>How to Pay</p>
                                                            </div>
                                                            <div className='flex w-full my-4 items-center justify-center'>
                                                                <img src={bni} className='w-20' alt="bnilogo" />
                                                                <img src={bca} className='w-20 mx-4' alt="bcalogo" />
                                                                <img src={bri} className='w-28' alt="brilogo" />
                                                            </div>
                                                            <p className='text-lg font-bold text-main-500'>See virtual account number on order detail</p>
                                                            <BankInfo />
                                                            <div className='w-full flex justify-center'>
                                                                <div className='w-1/2 flex justify-evenly items-center'>
                                                                    <button type="button" className="text-black bg-white focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-8 py-2.5 focus:z-10 "
                                                                        onClick={() => setShowPayment(false)}>Close</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            ""
                                    }
                                </>
                                :
                                <div className="flex flex-col justify-center items-center text-center my-5">
                                    <p className="font-bold text-2xl drop-shadow-lg text-main-500">You don't have any data yet</p>
                                    <img src={nodata} className="w-2/3" alt='placeholder' />
                                </div>
                        }
                    </div>
                </div>
                <ToastContainer />
                <LoadingComponent loading={loading} />
            </div>
        </div>
    )
};

export default UserOrderList;

