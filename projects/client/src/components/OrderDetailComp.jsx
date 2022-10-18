import React from "react";
import axios from 'axios';
import { API_URL } from '../helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Datetime from "./DatetimeConverter";
import Currency from "./CurrencyComp";
import UploadPaymentProof from "./UploadPaymentProof";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { Spinner } from 'flowbite-react';
import LoadingComponent from "./Loading";

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

    const navigate = useNavigate();

    const { iduser, username } = useSelector((state) => {
        return {
            iduser: state.userReducer.iduser,
            username: state.userReducer.username
        }
    })

    React.useEffect(() => {
        // console.log('selected', selected);
        setData(selected);
        setDetail(selected.transaction_detail);
        setDate(parseInt(selected.invoice_number.split('/')[2]));
        setCourier(selected.shipping_courier.split('/')[0]);
        setDelivery(selected.shipping_courier.split('/')[1]);
    }, []);

    const printDetail = () => {
        return (
            detail.map((val, idx) => {
                return (
                    <div className="border rounded-lg flex my-1" key={val.idtransaction_detail}>
                        <div className="w-1/6">
                            <img src={val.product_image} alt={val.product_name} />
                        </div>
                        <div className="flex flex-col text-start h-full border-r w-3/6 p-2">
                            <p className="font-semibold">{val.product_name}</p>
                            <p>{val.product_qty} x <Currency price={val.product_price} /></p>
                        </div>
                        <div className="w-2/6 p-2 flex flex-col text-end">
                            <p>Total Item Price</p>
                            <p className="font-semibold"><Currency price={val.product_price * val.product_qty} /></p>
                            <div className="flex items-center justify-center my-2">
                                {
                                    data.status_id === 7 || data.status_id === 9 ?
                                        <button type='button'
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
                        navigate(`/transaction/${username}`, { replace: true })
                    }, 1500)
                }
            } else {
                // jika batal dari resep dokter dan belum ada item


            }


        } catch (error) {
            console.log(error)
        }
    };

    const onAcceptDelivery = async () => {
        try {
            setLoading(true);
            let patch = await axios.patch(API_URL +'/api/transaction/update', {acceptDeliv: true, id: data.idtransaction});

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
                    showModal(false);
                    navigate(`/transaction/${username}`, { replace: true })
                }, 1500)
            }

        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div tabIndex={-1} className="overflow-y-auto overflow-x-hidden backdrop-blur-sm fixed right-0 left-0 top-0 flex justify-center items-center z-50 ">
            <div className="relative p-4 w-1/2">
                <div className="relative border-2 bg-white rounded-lg shadow border-main-500">
                    <div className="p-6 text-center">
                        <div className="mb-5 flex justify-center">
                            <p className='text-2xl font-bold text-main-500'>Transaction Detail</p>
                            <button type='button' className="absolute right-10 font-extrabold pt-1 text-lg text-main-500" onClick={() => showModal(false)}>X</button>
                        </div>
                        <div className="flex">
                            <div className="w-2/3 flex flex-col p-1 overflow-y-auto h-[51rem]">
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
                                        <div className="flex w-1/3 justify-between items-center">
                                            <p>Total Price ({detail.length} Items)</p>
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
                            <div className="w-1/3 px-7">
                                <div className="flex flex-col my-1">
                                    {
                                        data.status_id === 7 || data.status_id === 9 ?
                                            <button type='button'
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
                                                <div className="relative p-4 w-full max-w-md h-full md:h-auto">
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
                                            <div tabIndex={-1} className="overflow-y-auto overflow-x-hidden backdrop-blur-sm fixed right-0 left-0 top-0 flex justify-center items-center z-50 md:inset-0 h-modal md:h-full">
                                                <div className="relative p-4 w-full max-w-md h-full md:h-auto">
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
                                                        <UploadPaymentProof id={data.idtransaction} showProofModal={setShowProofModal} />
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