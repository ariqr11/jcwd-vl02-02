import React from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from "../../helper";
import axios from "axios";
import Datetime from "../../components/DatetimeConverter";
import Currency from "../../components/CurrencyComp";
import { useNavigate } from "react-router";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import format from 'date-fns/format';
import nodata from '../../assets/nodata.png';
import OrderDetail from "../../components/OrderDetailComp";
import LoadingComponent from "../../components/Loading";
import { useSelector } from "react-redux";

const UserOrderList = (props) => {

    const [loading, setLoading] = React.useState(false);

    const [userTransactionData, setUserTransactionData] = React.useState([]);
    const [selected, setSelected] = React.useState({
        tab: 'waiting',
        type: 'all',
        sort: 'new'
    });
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

    const navigate = useNavigate();

    const { username } = useSelector((state) => {
        return {
            username: state.userReducer.username
        }
    })

    const [showDetail, setShowDetail] = React.useState(false);
    const [selectedDetail, setSelectedDetail] = React.useState({});

    React.useEffect(() => {
        getUserTransactionData();
    }, [selected, range, activePage, showDetail, showAccept]);

    const getUserTransactionData = async () => {
        try {
            setLoading(true);
            let temp = [];
            if (selected.tab === 'waiting') {
                temp.push('status_id=3', 'status_id=4', 'status_id=5')
            } else if (selected.tab === 'process') {
                temp.push('status_id=6')
            } else if (selected.tab === 'delivery') {
                temp.push('status_id=8')
            } else if (selected.tab === 'finished') {
                temp.push('status_id=9')
            } else if (selected.tab === 'cancel') {
                temp.push('status_id=7')
            }

            if (selected.type === 'prescription') {
                temp.push('prescription_pic=is_not_null')
            } else if (selected.type === 'free') {
                temp.push('prescription_pic=is_null')
            }

            if (selected.sort === 'new') {
                temp.push('date_order=desc')
            } else if (selected.sort === 'old') {
                temp.push('date_order=asc')
            }

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

            if (get.data.results) {
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
                setUserTransactionData(get.data.results);
                setLoading(false);
            }
        } catch (error) {
            console.log(error)
        }
    };

    const handleFilter = async () => {
        try {
            setLoading(true);
            // console.log('range', range)
            let temp = [];
            if (selected.tab === 'waiting') {
                temp.push('status_id=3', 'status_id=4', 'status_id=5')
            } else if (selected.tab === 'process') {
                temp.push('status_id=6')
            } else if (selected.tab === 'delivery') {
                temp.push('status_id=8')
            } else if (selected.tab === 'finished') {
                temp.push('status_id=9')
            } else if (selected.tab === 'cancel') {
                temp.push('status_id=7')
            }

            if (selected.type === 'prescription') {
                temp.push('prescription_pic=is_not_null')
            } else if (selected.type === 'free') {
                temp.push('prescription_pic=is_null')
            }

            if (selected.sort === 'new') {
                temp.push('date_order=desc')
            } else if (selected.sort === 'old') {
                temp.push('date_order=asc')
            }

            if (range[0].startDate === range[0].endDate) {
                temp.push(`date_filter=${range[0].startDate.toLocaleDateString("sv-SE")}`)
            } else {
                if (range[0].startDate !== '') {
                    temp.push(`start=${range[0].startDate.toLocaleString("sv-SE")}`)
                }

                if (range[0].endDate !== '') {
                    temp.push(`end=${range[0].endDate.toLocaleDateString("sv-SE") + ' ' + '23:59:59'}`)
                }
            }

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
            console.log('data filter', get.data.results);
            console.log('jumlah data', get.data.count);
            console.log('jumlah page', Math.ceil(get.data.count / 5));

            if (get.data.results.length > 0) {
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
                setUserTransactionData(get.data.results);
                setLoading(false);
            } else if (get.data.failed) {
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
        } catch (error) {
            console.log(error)
        }
    };

    const printTransaction = () => {
        return userTransactionData.map((val, idx) => {
            if (val.prescription_pic) {
                return (
                    <div key={val.idtransaction} className='px-10 py-5 my-4 border rounded-lg shadow-md'>
                        <div className="border-b-2 flex justify-between pb-3 items-center">
                            <Datetime value={parseInt(val.invoice_number.split('/')[2])} />
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
                        <div className="flex my-2">
                            <div className="w-1/5">
                                <img src={API_URL + val.prescription_pic} className="w-full p-1" alt='prescription' />
                            </div>
                            <div className="w-4/5">
                                <div className="h-2/4 flex">
                                    <div className="w-2/3 px-3 py-1">
                                        <p className="font-semibold">Doctor's Prescription</p>
                                    </div>
                                    <div className="w-1/3 py-1 flex justify-center font-semibold">

                                    </div>
                                </div>
                                <div className="h-1/4 flex">
                                    <div className="border-b-2 w-full p-3">
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
                                    <button type='button' className="px-4 py-2 text-white font-semibold bg-main-500 border rounded-lg hover:bg-main-600 focus:ring-2 focus:ring-main-500">Pay Now</button>
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
                                <div tabIndex={-1} className="overflow-y-auto overflow-x-hidden backdrop-blur-sm fixed right-0 left-0 top-0 flex justify-center items-center z-50 md:inset-0 h-modal md:h-full">
                                    <div className="relative p-4 w-full max-w-md h-full md:h-auto">
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
                                                    onClick={() => setShowAccept('')}
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
                    <div key={val.idtransaction} className='px-10 py-5 my-4 border rounded-lg shadow-md'>
                        <div className="border-b-2 flex justify-between pb-2 items-center">
                            <div className="w-1/2 flex">
                                <Datetime value={parseInt(val.invoice_number.split('/')[2])} />
                                <p className="mx-4 font-semibold">{val.invoice_number}</p>
                            </div>
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
                        <div className="flex my-2">
                            <div className="w-1/5">
                                <img src={val.transaction_detail[0].product_image} className="w-full p-1" alt='product_image' />
                            </div>
                            <div className="w-4/5">
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
                                <div className="h-1/4 flex">
                                    <div className="border-b-2 w-full p-3">
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
                                    <button type='button' className="px-4 py-2 text-white font-semibold bg-main-500 border rounded-lg hover:bg-main-600 focus:ring-2 focus:ring-main-500">Pay Now</button>
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
                                    <button type='button' className="px-4 py-2 text-white font-semibold bg-main-500 border rounded-lg hover:bg-main-600 focus:ring-2 focus:ring-main-500">Buy Again</button>
                                    :
                                    ""
                            }
                        </div>
                        {
                            showAccept === val.idtransaction ?
                                <div tabIndex={-1} className="overflow-y-auto overflow-x-hidden backdrop-blur-sm fixed right-0 left-0 top-0 flex justify-center items-center z-50 md:inset-0 h-modal md:h-full">
                                    <div className="relative p-4 w-full max-w-md h-full md:h-auto">
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
                                                    onClick={() => setShowAccept('')}
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
                        type='button' onClick={() => setActivePage(parseInt(val))}
                    >{val}</li>
                )
            } else {
                return (
                    <li key={idx} className="border border-main-500 px-3 py-1 text-main-500 hover:cursor-pointer"
                        type='button' onClick={() => setActivePage(parseInt(val))}
                    >{val}</li>
                )
            }
        })
    };

    const onAcceptDelivery = async (idtransaction) => {
        try {
            setLoading(true);
            let patch = await axios.patch(API_URL +'/api/transaction/update', {acceptDeliv: true, id: idtransaction});

            if (patch.data.success){
                setTimeout(() => {
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
                    setShowAccept('');
                    navigate(`/transaction/${username}`, { replace: true })
                }, 1500)
            }

        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className={showDetail ? "overflow-y-hidden container mx-auto py-5 h-[55vh]" : "container mx-auto py-5"}>
            <div className="p-5 flex flex-col justify-center items-center">
                <p className="font-bold text-main-500 text-2xl">ORDER LIST</p>
                <div className="border-2 rounded-lg my-8 w-3/4 px-16 py-5 shadow-lg">
                    <div className="border-b-2">
                        <button type="button" onClick={() => { setSelected({ ...selected, tab: 'all' }); setRange([{ startDate: '', endDate: '', key: 'selection', color: 'teal' }]); setActivePage(1); }}
                            className={selected.tab === 'all' ? "py-4 px-6 border-b-2 border-b-main-500 text-main-500 font-semibold" : "py-4 px-6 font-semibold"}
                        >All</button>
                        <button type="button" onClick={() => { setSelected({ ...selected, tab: 'waiting' }); setRange([{ startDate: '', endDate: '', key: 'selection', color: 'teal' }]); setActivePage(1); }}
                            className={selected.tab === 'waiting' ? "p-4 border-b-2 border-b-main-500 text-main-500 font-semibold" : "p-4 font-semibold"}
                        >Waiting</button>
                        <button type="button" onClick={() => { setSelected({ ...selected, tab: 'process' }); setRange([{ startDate: '', endDate: '', key: 'selection', color: 'teal' }]); setActivePage(1); }}
                            className={selected.tab === 'process' ? "p-4 border-b-2 border-b-main-500 text-main-500 font-semibold" : "p-4 font-semibold"}
                        >In Process</button>
                        <button type="button" onClick={() => { setSelected({ ...selected, tab: 'delivery' }); setRange([{ startDate: '', endDate: '', key: 'selection', color: 'teal' }]); setActivePage(1); }}
                            className={selected.tab === 'delivery' ? "p-4 border-b-2 border-b-main-500 text-main-500 font-semibold" : "p-4 font-semibold"}
                        >On Delivery</button>
                        <button type="button" onClick={() => { setSelected({ ...selected, tab: 'finished' }); setRange([{ startDate: '', endDate: '', key: 'selection', color: 'teal' }]); setActivePage(1); }}
                            className={selected.tab === 'finished' ? "p-4 border-b-2 border-b-main-500 text-main-500 font-semibold" : "p-4 font-semibold"}
                        >Finished</button>
                        <button type="button" onClick={() => { setSelected({ ...selected, tab: 'cancel' }); setRange([{ startDate: '', endDate: '', key: 'selection', color: 'teal' }]); setActivePage(1); }}
                            className={selected.tab === 'cancel' ? "p-4 border-b-2 border-b-main-500 text-main-500 font-semibold" : "p-4 font-semibold"}
                        >Canceled</button>
                    </div>
                    {
                        userTransactionData.length > 0 ?
                            <>
                                <div className="my-3 p-2 flex justify-between">
                                    <div className="flex w-1/2 justify-between items-center">
                                        <p className="font-semibold text-main-500">Type of Order</p>
                                        <button type="button" onClick={() => { setSelected({ ...selected, type: 'all' }); setRange([{ startDate: '', endDate: '', key: 'selection', color: 'teal' }]); setActivePage(1); }}
                                            className={selected.type === "all" ? "border px-4 py-2 rounded-full bg-main-500 font-semibold text-white" : "border px-4 py-2 rounded-full bg-transparent font-semibold text-main-500 border-main-500"}
                                        >All Type</button>
                                        <button type="button" onClick={() => { setSelected({ ...selected, type: 'prescription' }); setRange([{ startDate: '', endDate: '', key: 'selection', color: 'teal' }]); setActivePage(1); }}
                                            className={selected.type === "prescription" ? "border px-4 py-2 rounded-full bg-main-500 font-semibold text-white" : "border px-4 py-2 rounded-full bg-transparent font-semibold text-main-500 border-main-500"}
                                        >Doctor Prescription</button>
                                        <button type="button" onClick={() => { setSelected({ ...selected, type: 'free' }); setRange([{ startDate: '', endDate: '', key: 'selection', color: 'teal' }]); setActivePage(1); }}
                                            className={selected.type === "free" ? "border px-4 py-2 rounded-full bg-main-500 font-semibold text-white" : "border px-4 py-2 rounded-full bg-transparent font-semibold text-main-500 border-main-500"}
                                        >Free Drugs</button>
                                    </div>
                                    <div className="flex items-center w-1/5 justify-between">
                                        <p className="font-semibold text-main-500">Sort by:</p>
                                        <select className="border rounded-lg border-main-500 text-gray-500"
                                            onChange={(e) => { setSelected({ ...selected, sort: e.target.value }); setRange([{ startDate: '', endDate: '', key: 'selection', color: 'teal' }]); setActivePage(1); }} defaultValue={'new'}>
                                            <option value="new">Newest</option>
                                            <option value="old">Oldest</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <div className="p-2 flex items-center">
                                        <p className="font-semibold text-main-500 mr-2">Filter by Date :</p>
                                        <div className="p-1 border border-main-500 rounded flex mx-1">
                                            <input
                                                value={range[0].startDate !== '' ? `${format(range[0].startDate, "MM/dd/yyyy")}` : ''}
                                                className="text-center"
                                                placeholder='Select Date Range'
                                                onClick={() => setShowFilterDate(true)}
                                            />
                                        </div>
                                        <div className="p-1 border border-main-500 rounded flex mx-1">
                                            <input
                                                value={range[0].endDate !== '' ? `${format(range[0].endDate, "MM/dd/yyyy")}` : ''}
                                                className="text-center"
                                                placeholder='Select Date Range'
                                                onClick={() => setShowFilterDate(true)}
                                            />
                                        </div>
                                        <button type="button" className="ml-2 text-main-500 hover:underline focus:underline font-semibold"
                                            onClick={() => { setActivePage(1); handleFilter() }}>Filter</button>
                                        <button type="button" className="ml-2 hover:underline"
                                            onClick={() => {
                                                setRange([{
                                                    startDate: '',
                                                    endDate: '',
                                                    key: 'selection',
                                                    color: 'teal'
                                                }]);
                                                setSelected({ ...selected });
                                            }}
                                        >Clear</button>
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
                                                                onClick={() => setShowFilterDate(false)}>Set Date</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            ""
                                    }
                                </div>
                                <div>
                                    {printTransaction()}
                                </div>
                                <div className="w-full flex justify-center items-center">
                                    <ul className="list-none flex">
                                        {
                                            activePage === 1 ?
                                                <li className="border border-gray-300 rounded-l-full px-3 py-1 font-semibold text-gray-300 hover:cursor-default">Previous</li>
                                                :
                                                <li className="border border-main-500 rounded-l-full px-3 py-1 font-semibold text-main-500 hover:cursor-pointer"
                                                    type='button' onClick={() => setActivePage(activePage - 1)}
                                                >Previous</li>
                                        }
                                        {printPagination()}
                                        {
                                            activePage === totalPage ?
                                                <li className="border border-gray-300 rounded-r-full px-5 py-1 font-semibold text-gray-300 hover:cursor-default">Next</li>
                                                :
                                                <li className="border border-main-500 rounded-r-full px-5 py-1 font-semibold text-main-500 hover:cursor-pointer"
                                                    type='button' onClick={() => setActivePage(activePage + 1)}
                                                >Next</li>
                                        }
                                    </ul>
                                </div>
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
    )
};

export default UserOrderList;

