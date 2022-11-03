import React from "react";
import axios from "axios";
import { API_URL } from "../helper";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModalAddNettoUnit = ({ setModalAddNettoUnitOn, unit_type }) => {

    const [newNettoUnit, setNewNettoUnit] = React.useState('');

    console.log('ini unit_type dari modal add di modal edit', unit_type)

    const handleOKClick = () => {
        onAdd()
        setModalAddNettoUnitOn(false)
    }
    const handleCancelClick = () => {
        setModalAddNettoUnitOn(false)
    }

    const onAdd = () => {
        axios.post(API_URL + `/api/product/addunit?unit_type=${unit_type}`, {
            unit: newNettoUnit
        })
            .then((res) => {
                if (res.data.message) {
                    console.log('ini response onAdd', res)
                    toast.success('Add netto unit berhasil', {
                        position: "bottom-center",
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                } else {
                    toast.error('Add netto unit gagal, unit sudah tersedia', {
                        position: "bottom-center",
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                }
            })
            .catch((error) => {
                console.log('on add unit gagal :', error)
            })
    }

    return (

        <div className="bg-black bg-opacity-50 fixed inset-0 z-50">
            <div className="flex h-screen justify-center items-center">
                <div className="flex-col justify-center bg-white py-5 px-12 rounded-xl w-96" style={{ height: '200px' }}>

                    {/* <!-- Modal content --> */}
                    <div className="pt-6">
                        <h3 className="mb-3 text-xl font-medium text-gray-900">Add new netto unit</h3>
                        <input id="search" type="form" onChange={(e) => setNewNettoUnit(e.target.value)} placeholder="Input new name for netto unit" className="border rounded-lg py-2 px-2 text-sm w-full" />
                        <div className="mt-4 flex justify-end">
                        <button onClick={handleCancelClick} className="rounded-lg px-4 py-2 text-btn-500 text-sm bg-white border border-btn-500 font-bold">Cancel</button>
                        <button onClick={handleOKClick} className=" rounded-lg px-4 py-2 ml-4 text-white text-sm bg-btn-500 font-bold">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalAddNettoUnit;