import React from 'react'
import axios from 'axios';
import { API_URL } from '../helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NewAddressComponent from "../components/NewAddressModalComp";
import EditAddressComponent from './EditAddressModalComp';


const AddressComponent = (props) => {

    //////// KEMAL BAGIAN ADDRESS APKG2-15, MELIPUTI SEMUA FUNGSI CRUD ADDRESS DI PROFILING ////////
    const [addressData, setAddressData] = React.useState([]);
    const [showNewAddressModal, setShowNewAddressModal] = React.useState('');
    const [showEditAddressModal, setShowEditAddressModal] = React.useState('');
    const [modalDelete, setModalDelete] = React.useState(0);
    const [selectedEdit, setSelectedEdit] = React.useState({});

    React.useEffect(() => {
        getAddress();
    }, []);

    const getAddress = async () => {
        try {
            let userToken = localStorage.getItem('medcarelog');
            let get = await axios.get(API_URL + '/api/address/get', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            console.log("data address profiling", get.data);
            setAddressData(get.data);
        } catch (error) {
            console.log(error)
        }
    };

    const printAddress = () => {
        return addressData.map((val, idx) => {
            return (
                <div key={val.idaddress}
                    className={val.status_name === 'Primary' ? 'shadow-lg border-2 rounded-lg bg-teal-50 border-main-500 my-2 p-3 flex' : 'shadow-lg border-2 rounded-lg border-main-500 my-2 p-3 flex'}>
                    <div className='w-4/5'>
                        <p className='transform: capitalize font-bold text-main-600'>{val.fullname}</p>
                        <p>{val.phone_number}</p>
                        <p className='transform: capitalize'>{val.full_address}, Kecamatan {val.district}, {val.city}</p>
                        <p className='transform: capitalize'>{val.province}, {val.postal_code}</p>
                        <div className='w-1/3 flex justify-between items-center'>
                            <button type='button' className='text-main-500 hover:underline focus:underline' onClick={() => { setShowEditAddressModal('show'); setSelectedEdit(val) }}>Edit Address</button>
                            {
                                val.status_name !== 'Primary' ?
                                    <>
                                        <p className='font-bold text-main-500'>|</p>
                                        <button type='button' className='text-red-500 hover:underline focus:underline'
                                            onClick={() => setModalDelete(val.idaddress)}
                                        >Delete Address</button>
                                    </>
                                    :
                                    ""
                            }
                            {
                                modalDelete === val.idaddress ?
                                    <div tabIndex={-1} className="overflow-y-auto overflow-x-hidden backdrop-blur-sm fixed right-0 left-0 top-0 flex justify-center items-center z-50 md:inset-0 h-modal md:h-full">
                                        <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                                            <div className="relative border-2 bg-white rounded-lg shadow border-main-500">
                                                <div className="p-6 text-center">
                                                    <p className="text-lg font-normal text-black mb-4">Are you sure to delete this address?</p>
                                                    <div className='flex justify-center items-center'>
                                                    </div>
                                                    <button type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                                                        onClick={() => onDeleteAddress(val.idaddress)}>
                                                        Yes, Delete
                                                    </button>
                                                    <button type="button" className="text-black bg-white focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 focus:z-10 "
                                                        onClick={() => setModalDelete(0)}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    ""
                            }
                        </div>
                    </div>
                    <div className='w-1/5 flex justify-center items-center'>
                        {
                            val.status_name === 'Primary' ?
                                ""
                                :
                                <button type='button' onClick={() => onSelectPrimary(val.idaddress)}
                                    className='border p-3 rounded-lg bg-main-500 text-white font-bold hover:bg-main-600 focus:ring-2 focus:ring-main-500'>Select as Primary</button>
                        }
                    </div>
                </div>
            )
        })
    };

    const onSelectPrimary = async (id) => {
        try {
            let userToken = localStorage.getItem('medcarelog');
            let update = await axios.patch(API_URL + '/api/address/update', { setPrimary: id }, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            if (update.data.success) {
                getAddress();
            }
        } catch (error) {
            console.log(error)
        }
    };

    const onDeleteAddress = async (id) => {
        try {
            let del = await axios.delete(API_URL + `/api/address/delete/${id}`);

            if (del.data.success) {
                setModalDelete(0);
                toast.error('Address Removed', {
                    theme: "colored",
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                });
                getAddress();
            }

        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div>
            <div className='container mx-auto'>
                <p className='flex items-center justify-center text-main-500 font-bold text-2xl my-3'>ADDRESS</p>
                <div className='flex justify-center'>
                    <div className='border-2 w-2/3 rounded-lg p-4 shadow-lg'>
                        <div className='flex justify-end'>
                            <button type='button' onClick={() => setShowNewAddressModal('show')}
                                className='border p-3 rounded-lg bg-main-500 text-white font-bold hover:bg-main-600 focus:ring-2 focus:ring-main-5'>Add New Address</button>
                        </div>
                        {printAddress()}
                        {/* MODAL ALAMAT BARU */}
                        {
                            showNewAddressModal === 'show' ?
                                <NewAddressComponent showModal={setShowNewAddressModal} setAddress={getAddress()} />
                                :
                                ""
                        }
                        {/* MODAL EDIT ALAMAT */}
                        {
                            showEditAddressModal === 'show' ?
                                <EditAddressComponent selected={selectedEdit} showModal={setShowEditAddressModal} setAddress={getAddress()} />
                                :
                                ""
                        }
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default AddressComponent;