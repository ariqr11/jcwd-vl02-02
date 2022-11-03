import React from "react";
import axios from 'axios';
import { API_URL } from '../helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Datetime from "./DatetimeConverter";
import Currency from "./CurrencyComp";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import LoadingComponent from "./Loading";
import placeholder from '../assets/placeholder.png';
import bni from '../assets/Bank BNI Logo (PNG-1080p) - FileVector69.png';
import bca from '../assets/Bank BCA Logo (PNG-1080p) - FileVector69.png';
import bri from '../assets/bri.png';
import BankInfo from "./BankInfoAccordion";
import { updateCart } from "../action/useraction";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdOutlineContentCopy } from "react-icons/md";

const OrderDetail = ({ selected, showModal }) => {

    const [data, setData] = React.useState({});
    const [detail, setDetail] = React.useState([]);
    const [date, setDate] = React.useState(0);
    const [courier, setCourier] = React.useState('');
    const [delivery, setDelivery] = React.useState('');
    const [showProofModal, setShowProofModal] = React.useState(false);
    const [showCancelModal, setShowCancelModal] = React.useState('');
    const [showAccept, setShowAccept] = React.useState('');
    const [reason, setReason] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [invoice, setInvoice] = React.useState('');

    const [showPic, setShowPic] = React.useState('');
    const [paymentProofPic, setPaymentProofPic] = React.useState('');
    const [loadPic, setLoadPic] = React.useState(false);
    const [phone, setPhone] = React.useState('');
    const [userCartData, setUserCartData] = React.useState([]);
    const [copied, setCopied] = React.useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fileRef = React.useRef();

    const { iduser, username } = useSelector((state) => {
        return {
            iduser: state.userReducer.iduser,
            username: state.userReducer.username
        }
    })

    React.useEffect(() => {
        console.log('selected', selected);
        setData(selected);
        setDetail(selected.transaction_detail);
        console.log(selected.transaction_detail);
        setInvoice(selected.invoice_number)
        setDate(selected.date_order);
        setCopied(false);
        setCourier(selected.shipping_courier.split('/')[0]);
        setDelivery(selected.shipping_courier.split('/')[1]);
        let ph = selected.user_phone_number;
        let setPh = '';
        if (ph.length > 3) {
            let temp = ph.split('');
            setPh = '0' + temp.splice(3, ph.length - 3).join('');
        };
        setPhone('10011' + setPh);
    }, []);

    const printDetail = () => {
        return (
            detail.map((val, idx) => {
                return (
                    <div className="border rounded-lg flex my-1" key={val.idtransaction_detail}>
                        <div className="w-1/6">
                            <img src={val.product_image.includes('http') ? val.product_image : API_URL + val.product_image} alt={val.product_name} 
                                onClick={() => navigate(`/product/detail?product_name=${val.product_name}`)}
                            />
                        </div>
                        <div className="flex flex-col text-start h-full border-r w-3/6 p-2">
                            <p className="font-semibold">{val.product_name}</p>
                            <p>{val.product_qty} <a className="transform: capitalize">{val.product_unit}</a> x <Currency price={val.product_price} /></p>
                        </div>
                        <div className="w-2/6 p-2 flex flex-col text-end">
                            <p>Total Item Price</p>
                            <p className="font-semibold"><Currency price={val.product_price * val.product_qty} /></p>
                            <div className="flex items-center justify-center my-2">
                                {
                                    data.status_id === 7 || data.status_id === 9 ?
                                        <button type='button' onClick={() => onBuyAgain([val])}
                                            className="px-3 py-1 border bg-white-500 text-main-500 font-semibold rounded-lg border-main-500 focus:ring-2 focus:ring-main-500"
                                        >Buy Again</button>
                                        :
                                        ""
                                }
                            </div>
                        </div>
                    </div>
                )
            })
        )
    };

    const onCancelOrder = async () => {
        try {
            console.log('reason', reason);
            console.log('data', data);
            console.log('detail', detail);

            // jika sudah ada item 
            if (detail.length > 0) {
                // cancel detail to update stock
                let temp = [];
                detail.forEach((val, idx) => {
                    temp.push({
                        product_name: val.product_name,
                        product_qty: val.product_qty,
                        product_price: val.product_price,
                        product_id: val.product_id,
                        product_unit: val.product_unit
                    })
                });
                console.log(temp);

                // cancel to update transaction
                let update = {
                    note: reason,
                    id: data.idtransaction,
                    iduser: iduser
                }
                setLoading(true);
                let cancel = await axios.patch(API_URL + '/api/transaction/update', { userCancel: true, update, stock: temp });

                if (cancel.data.success) {
                    setTimeout(() => {
                        setLoading(false);
                        toast.error('Order Canceled', {
                            theme: "colored",
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: false,
                            progress: undefined,
                        });
                        setShowCancelModal('');
                        showModal(false);
                        navigate(`/${username}/transaction`, { replace: true })
                    }, 1500)
                }
            } else {
                // cancel to update transaction from
                let update = {
                    note: reason,
                    id: data.idtransaction,
                    iduser: iduser
                }
                setLoading(true);
                let cancel = await axios.patch(API_URL + '/api/transaction/update', { userCancel: true, update });

                if (cancel.data.success) {
                    setTimeout(() => {
                        setLoading(false);
                        toast.error('Order Canceled', {
                            theme: "colored",
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: false,
                            progress: undefined,
                        });
                        setShowCancelModal('');
                        showModal(false);
                        navigate(`/${username}/transaction`, { replace: true })
                    }, 1500)
                }


            }


        } catch (error) {
            console.log(error)
        }
    };

    const onAcceptDelivery = async () => {
        try {
            setLoading(true);
            let patch = await axios.patch(API_URL + '/api/transaction/update', { acceptDeliv: true, id: data.idtransaction });

            if (patch.data.success) {
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
                    showModal(false);
                    navigate(`/${username}/transaction`, { replace: true })
                }, 1500)
            }

        } catch (error) {
            console.log(error)
        }
    };

    const onPaymentProof = async () => {
        try {
            if (paymentProofPic === '') {
                toast.error('You have not insert any image', {
                    theme: "colored",
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                });
            } else {
                let userToken = localStorage.getItem('medcarelog');

                let formProof = new FormData();
                formProof.append('datatransaction', JSON.stringify({
                    proof: true,
                    idtransaction: data.idtransaction
                }));

                formProof.append('paymentproof_pic', paymentProofPic);

                setLoading(true);
                let res = await axios.patch(API_URL + '/api/transaction/addproof', formProof, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                });
                console.log(res.data)
                if (res.data.success) {
                    setLoading(false);
                    setShowProofModal(false);
                    showModal(false);
                    toast.success('Upload Payment Proof Success', {
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
            }

        } catch (error) {
            console.log(error);
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
            console.log(items)
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
        <div tabIndex={-1} className="overflow-y-auto overflow-x-hidden backdrop-blur-sm fixed right-0 left-0 top-0 flex justify-center items-center z-50 h-full">
            <div className="relative p-4 w-full md:w-4/5 lg:w-2/3 xl:w-1/2 h-full sm:h-auto">
                <div className="relative border-2 bg-white rounded-lg shadow border-main-500">
                    <div className="p-6 text-center">
                        <div className="mb-5 flex justify-center">
                            <p className='text-2xl font-bold text-main-500'>Transaction Detail</p>
                            <button type='button' className="absolute right-10 font-extrabold pt-1 text-lg text-main-500" onClick={() => showModal(false)}>X</button>
                        </div>
                        <div className="flex flex-col sm:flex-row">
                            <div className="w-full sm:w-2/3 flex flex-col p-1 overflow-y-auto sm:h-[51rem]">
                                <div className="border shadow-md flex flex-col p-2 my-1">
                                    <p className={data.status_id === 7 ? "text-start font-semibold text-red-500" : "text-start font-semibold text-main-500"}>{data.status_name}</p>
                                    {
                                        data.status_id === 7 ?
                                            <p className="text-start font-semibold">User {data.note}</p>
                                            :
                                            ""
                                    }
                                    <div className="flex justify-between my-2 border-t">
                                        <p>No. Invoice</p>
                                        <p className="text-main-500 font-semibold">{data.invoice_number}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p>Purchase Date</p>
                                        <p><Datetime value={date} /></p>
                                    </div>
                                </div>
                                {
                                    data.status_id === 4 ?
                                        <div className="border shadow-md flex flex-col p-2 my-1">
                                            <p className="text-start underline font-semibold text-main-500">How to Pay</p>
                                            <div className="flex justify-between w-full items-center">
                                                <p className="font-semibold">Bank Virtual Account</p>
                                                <div className='flex flex-col sm:flex-row my-4'>
                                                    <img src={bni} className='w-12' alt="bnilogo" />
                                                    <img src={bca} className='w-14 sm:mx-4 my-2 sm:my-0' alt="bcalogo" />
                                                    <img src={bri} className='w-20' alt="brilogo" />
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-start font-bold text-lg sm:text-2xl">{phone}</p>
                                                {
                                                    copied ?
                                                        <p className="text-main-500 font-semibold">Copied!</p>
                                                        :
                                                        <CopyToClipboard text={phone}
                                                            onCopy={() => setCopied(true)}>
                                                            <button className="text-main-500 text-lg"><MdOutlineContentCopy /></button>
                                                        </CopyToClipboard>
                                                }
                                            </div>
                                            <BankInfo />
                                        </div>
                                        :
                                        ""
                                }
                                {
                                    data.prescription_pic ?
                                        <div className="border shadow-md flex flex-col p-2 my-1">
                                            <p className="text-start underline text-main-500 font-semibold mb-1">Doctor's Prescription</p>
                                            <img src={API_URL + data.prescription_pic} alt={data.product_name} className='w-1/2 self-center hover:scale-150' />
                                        </div>
                                        :
                                        ""
                                }
                                {
                                    detail.length > 0 ?
                                        <div className="border shadow-md flex flex-col p-2 my-1">
                                            <p className="text-start underline text-main-500 font-semibold mb-1">Product Detail</p>
                                            {printDetail()}
                                        </div>
                                        :
                                        ""
                                }
                                <div className="border shadow-md flex flex-col p-2 my-1">
                                    <p className="text-start underline font-semibold text-main-500">Delivery Information</p>
                                    <div className="my-1 flex">
                                        <div className="flex w-1/4 justify-between items-center">
                                            <p>Courier</p>
                                            <p>:</p>
                                        </div>
                                        <div className="flex pl-2 items-center w-3/4">
                                            <p className="transform: uppercase">{courier} - {delivery}</p>
                                        </div>
                                    </div>
                                    <div className="my-1 flex">
                                        <div className="flex w-1/4 justify-between">
                                            <p>Address</p>
                                            <p>:</p>
                                        </div>
                                        <div className="flex pl-2 items-start flex-col text-start w-3/4">
                                            <p className="transform: capitalize font-semibold">{data.user_name}</p>
                                            <p>{data.user_phone_number}</p>
                                            <p>{data.user_address}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="border shadow-md flex flex-col p-2 my-1">
                                    <p className="text-start underline font-semibold text-main-500">Payment Detail</p>
                                    <div className="my-1 flex">
                                        <div className="flex w-1/3 justify-between sm:items-center">
                                            <p className="text-start">Total Price ({detail.length} Items)</p>
                                            <p>:</p>
                                        </div>
                                        <div className="flex pl-2 justify-end w-2/3">
                                            {
                                                data.total_price ?
                                                    <p className="transform: capitalize"><Currency price={data.total_price} /></p>
                                                    :
                                                    <p className="transform: capitalize">Rp.0</p>
                                            }
                                        </div>
                                    </div>
                                    <div className="my-1 flex">
                                        <div className="flex w-1/3 justify-between items-center">
                                            <p>Delivery Price</p>
                                            <p>:</p>
                                        </div>
                                        <div className="flex pl-2 justify-end w-2/3">
                                            {
                                                data.delivery_price ?
                                                    <p className="transform: capitalize"><Currency price={data.delivery_price} /></p>
                                                    :
                                                    <p className="transform: capitalize">Rp.0</p>
                                            }
                                        </div>
                                    </div>
                                    <div className="my-1 flex border-t">
                                        <div className="flex w-1/3 justify-between items-center text-lg font-semibold">
                                            <p>Total</p>
                                            <p>:</p>
                                        </div>
                                        <div className="flex pl-2 justify-end w-2/3 text-lg font-semibold">
                                            {
                                                data.delivery_price && data.total_price ?
                                                    <p className="transform: capitalize"><Currency price={data.delivery_price + data.total_price} /></p>
                                                    :
                                                    <p className="transform: capitalize">Rp.0</p>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full sm:w-1/3 px-7">
                                <div className="flex flex-col my-1">
                                    {
                                        data.status_id === 7 && invoice.includes('/1/') || data.status_id === 9 && invoice.includes('/1/') ?
                                            <button type='button' onClick={() => onBuyAgain(detail)}
                                                className="border w-auto p-3 rounded-lg bg-main-500 text-white font-semibold hover:bg-main-600 focus:ring-2 focus:ring-main-500"
                                            >Buy Again ({detail.length} items)</button>
                                            :
                                            ""
                                    }
                                    {
                                        data.status_id === 3 || data.status_id === 4 || data.status_id === 5 ?
                                            <button type='button' onClick={() => setShowCancelModal('show')}
                                                className="border w-auto p-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 focus:ring-2 focus:ring-red-500"
                                            >Cancel Order</button>
                                            :
                                            ""
                                    }
                                    {
                                        showCancelModal === 'show' ?
                                            <div tabIndex={-1} className="overflow-y-auto overflow-x-hidden backdrop-blur-sm fixed right-0 left-0 top-0 flex justify-center items-center z-50 md:inset-0 h-modal md:h-full">
                                                <div className="relative p-4 w-full sm:w-1/2 xl:w-1/4 h-auto">
                                                    <div className="relative border-2 bg-white rounded-lg shadow border-main-500">
                                                        <div className="p-6 text-center">
                                                            <p className="text-lg font-normal text-black">Are you sure to cancel this order?</p>
                                                            <div className='flex flex-col justify-center items-center my-3'>
                                                                <p>Please select one of the reason below:</p>
                                                                <select onChange={(e) => setReason(e.target.value)} defaultValue=''>
                                                                    <option value=''>Please choose a reason</option>
                                                                    <option value='Want to change item or quantity'>Want to change item or quantity</option>
                                                                    <option value='Want to change delivery address'>Want to change delivery address</option>
                                                                    <option value='Already have the product'>Already have the product</option>
                                                                    <option value='Others/Change mind'>Others/Change mind</option>
                                                                </select>
                                                            </div>
                                                            <button type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                                                                onClick={() => {
                                                                    if (reason !== '') {
                                                                        onCancelOrder()
                                                                    } else {
                                                                        toast.error('Please choose a reason first', {
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
                                                                }}
                                                            >Yes, Cancel Order
                                                            </button>
                                                            <button type="button" className="text-black bg-white focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 "
                                                                onClick={() => setShowCancelModal('')}
                                                            >No, Go Back
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            ""
                                    }
                                    {
                                        data.status_id === 8 ?
                                            <button type='button' onClick={() => setShowAccept('show')}
                                                className="border w-auto p-3 rounded-lg bg-main-500 text-white font-semibold hover:bg-main-600 focus:ring-2 focus:ring-main-500"
                                            >Accept Delivery</button>
                                            :
                                            ""
                                    }
                                    {
                                        showAccept === 'show' ?
                                            <div tabIndex={-1} className="overflow-y-auto overflow-x-hidden backdrop-blur-sm fixed right-0 left-0 top-0 flex justify-center items-center z-50 md:inset-0 h-full">
                                                <div className="relative p-4 w-full sm:w-1/2 xl:w-1/4 h-auto">
                                                    <div className="relative border-2 bg-white rounded-lg shadow border-main-500">
                                                        <div className="p-6 text-center">
                                                            <p className="text-lg font-normal text-black mb-4">Are you sure the package has been delivered to you?</p>
                                                            <button type="button" className="text-white bg-main-500 hover:bg-main-600 focus:ring-2 focus:outline-none focus:ring-main-500 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                                                                onClick={() => {
                                                                    onAcceptDelivery();
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
                                <div className="flex flex-col my-1">
                                    {
                                        data.status_id === 4 ?
                                            <>
                                                <button type='button' onClick={() => setShowProofModal(true)}
                                                    className="border w-auto p-3 rounded-lg bg-white-500 border-main-500 text-main-500 font-semibold focus:ring-2 focus:ring-main-500"
                                                >Upload Payment Proof</button>
                                                {
                                                    showProofModal ?
                                                        <div tabIndex={-1} className="overflow-y-auto overflow-x-hidden backdrop-blur-sm fixed right-0 left-0 top-0 flex justify-center items-center z-50 md:inset-0 h-full">
                                                            <div className="relative p-4 w-full md:w-2/3 xl:w-1/2 2xl:w-1/3 h-auto">
                                                                <div className="relative border-2 bg-white rounded-lg shadow border-main-500 p-6">
                                                                    <div className="flex justify-center items-center my-3">
                                                                        <p className="text-center font-bold text-lg sm:text-2xl text-main-500">UPLOAD PAYMENT PROOF</p>
                                                                        <button type='button' className="absolute right-10 font-extrabold pt-1 text-lg text-main-500" onClick={() => setShowProofModal(false)}>X</button>
                                                                    </div>
                                                                    <div className='flex items-center my-4'>
                                                                        <button className='border rounded-lg bg-main-500 text-white font-bold py-2 px-5 hover:bg-main-600 focus:ring-2 focus:ring-main-500'
                                                                            onClick={() => fileRef.current.click()}>
                                                                            <input type="file"
                                                                                onChange={(e) => {
                                                                                    setShowPic('');
                                                                                    setLoadPic(true);
                                                                                    console.log(e.target.files[0]);
                                                                                    let split = e.target.files[0].name.split('.');
                                                                                    let temp = ['jpg', 'png', 'gif'];
                                                                                    if (temp.includes(split[split.length - 1])) {
                                                                                        if (e.target.files[0].size <= 1048596) {
                                                                                            setTimeout(() => {
                                                                                                setLoadPic(false);
                                                                                                setShowPic(URL.createObjectURL(e.target.files[0]));
                                                                                            }, 2000)
                                                                                            setPaymentProofPic(e.target.files[0]);
                                                                                        } else {
                                                                                            setTimeout(() => {
                                                                                                toast.error('Image more than 1 MB!', {
                                                                                                    theme: "colored",
                                                                                                    position: "top-center",
                                                                                                    autoClose: 2000,
                                                                                                    hideProgressBar: false,
                                                                                                    closeOnClick: true,
                                                                                                    pauseOnHover: true,
                                                                                                    draggable: false,
                                                                                                    progress: undefined,
                                                                                                });
                                                                                                setLoadPic(false);
                                                                                            }, 2000)
                                                                                        }
                                                                                    } else {
                                                                                        setTimeout(() => {
                                                                                            toast.error('Wrong Image Extension', {
                                                                                                theme: "colored",
                                                                                                position: "top-center",
                                                                                                autoClose: 2000,
                                                                                                hideProgressBar: false,
                                                                                                closeOnClick: true,
                                                                                                pauseOnHover: true,
                                                                                                draggable: false,
                                                                                                progress: undefined,
                                                                                            });
                                                                                            setLoadPic(false);
                                                                                        }, 2000)
                                                                                    }
                                                                                }} ref={fileRef} hidden
                                                                            />
                                                                            Upload</button>
                                                                        <p className='mx-2'>Max. 1 MB (jpg/png/gif)</p>
                                                                    </div>
                                                                    <div className='w-full my-4 flex justify-center'>
                                                                        {
                                                                            loadPic ?
                                                                                <div role="status" className='w-full flex items-center justify-center'>
                                                                                    <svg className="inline mr-2 w-8 h-8 text-gray-200 animate-spin  fill-main-600 " viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                                                    </svg>
                                                                                    <span className="sr-only">Loading...</span>
                                                                                </div>
                                                                                :
                                                                                ''
                                                                        }
                                                                        <img src={showPic === '' ? placeholder : showPic} className={loadPic ? 'hidden' : 'block'} alt='user_paymentproof' />
                                                                    </div>
                                                                    <div className="py-3 flex justify-center items-center">
                                                                        <button type='button' onClick={() => onPaymentProof()}
                                                                            className="py-2 border-2 rounded-lg w-full text-white bg-main-500 font-bold hover:bg-main-600 
                                                                                focus:ring-2 focus:ring-main-500"
                                                                        >Send Payment Proof</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        :
                                                        ""
                                                }
                                            </>
                                            :
                                            ""
                                    }
                                </div>
                                <div className="flex flex-col my-1">
                                    {
                                        data.status_id === 3 || data.status_id === 4 || data.status_id === 5 || data.status_id === 6 ?
                                            <button type='button'
                                                className="border w-auto p-3 rounded-lg bg-white-500 border-gray-300 text-gray-300 font-semibold hover:cursor-default"
                                            >Chat Seller</button>
                                            :
                                            ""
                                    }
                                </div>
                                <div className="flex flex-col my-1">
                                    <button type='button'
                                        className="border w-auto p-3 rounded-lg bg-white-500 border-gray-300 text-gray-300 font-semibold hover:cursor-default"
                                    >Need Help?</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
            <LoadingComponent loading={loading} />
        </div>
    )
};

export default OrderDetail;