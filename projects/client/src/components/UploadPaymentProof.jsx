import React from "react";
import axios from 'axios';
import { API_URL } from '../helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingComponent from './Loading';
import { useNavigate } from "react-router";
import placeholder from '../assets/placeholder.png';
import { useSelector } from 'react-redux';

const UploadPaymentProof = ({ id, showProofModal, loading }) => {

    const [showPic, setShowPic] = React.useState('');
    const [paymentProofPic, setPaymentProofPic] = React.useState('');
    const [loadPic, setLoadPic] = React.useState(false);

    const { username } = useSelector((state) => {
        return {
            username: state.userReducer.username
        }
    });

    const fileRef = React.useRef();
    const navigate = useNavigate();

    const onPaymentProof = async () => {
        try {
            console.log(id)
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
                    transactionId: id
                }));

                formProof.append('paymentproof_pic', paymentProofPic);

                loading(true);
                showProofModal(false);
                let res = await axios.patch(API_URL + '/api/transaction/addproof', formProof, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                });
                if (res.data.success) {
                    setTimeout(() => {
                        loading(false);
                        navigate(`/transaction/${username}`, { replace: true });
                    }, 3000)
                }
            }

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div tabIndex={-1} className="overflow-y-auto overflow-x-hidden backdrop-blur-sm fixed right-0 left-0 top-0 flex justify-center items-center z-50 md:inset-0 h-modal md:h-full">
                <div className="relative p-4 w-1/3 h-full md:h-auto">
                    <div className="relative border-2 bg-white rounded-lg shadow border-main-500 p-6">
                        <div className="flex justify-center items-center my-3">
                            <p className="text-center font-bold text-2xl text-main-500">UPLOAD PAYMENT PROOF</p>
                            <button type='button' className="absolute right-10 font-extrabold pt-1 text-lg text-main-500" onClick={() => showProofModal()}>X</button>
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
                            <img src={showPic === '' ? placeholder : showPic} className={loadPic ? 'hidden' : 'block max-w-lg'} alt='user_paymentproof' />
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
            <ToastContainer />
            <LoadingComponent loading={loading} />
        </div>
    )
};

export default UploadPaymentProof;