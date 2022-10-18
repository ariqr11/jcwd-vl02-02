import React from "react";
import axios from "axios";
import { API_URL } from "../helper";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiFillEdit } from "react-icons/ai";
import ModalAddMainUnit from "./ModalAddMainUnit";
import ModalAddNettoUnit from "./ModalAddNettoUnit";
import ModalSettingCategory from "./ModalSettingCategory";
import { useSelector } from 'react-redux'

const ModalEdit = ({ setModalEditOn, dataproduct, category, setLoading }) => {
    let { iduser } = useSelector((state) => {
        return {
            iduser: state.userReducer.iduser,
        }
    })

    const [newCat, setNewCat] = React.useState('');
    const [product_name, setProduct_Name] = React.useState('');
    const [price, setPrice] = React.useState(null);
    const [category_id, setCategory_Id] = React.useState(null);
    const [netto_stock, setNetto_Stock] = React.useState(null);
    const [netto_unit, setNetto_Unit] = React.useState('');
    const [default_unit, setDefault_Unit] = React.useState('');
    const [picture, setPicture] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [dosis, setDosis] = React.useState('');
    const [aturan_pakai, setAturan_Pakai] = React.useState('');

    const [stock_unit, setStock_Unit] = React.useState('');

    // Add new netto unit & main unit
    const [all_netto, setAll_Netto] = React.useState([]);
    const [all_main, setAll_Main] = React.useState([]);

    const [modalAddMainUnitOn, setModalAddMainUnitOn] = React.useState(false);
    const [unit_type, setUnit_Type] = React.useState('');

    const [modalAddNettoUnitOn, setModalAddNettoUnitOn] = React.useState(false);

    // Add, edit, delete category 
    const [modalSetCategoryOn, setModalSetCategoryOn] = React.useState(false);

    const handleOKClick = () => {
        editProduct()
        setModalEditOn(false)
        setLoading(false)
    }
    const handleCancelClick = () => {
        setModalEditOn(false)
    }

    const getNetto = () => {
        axios.get(API_URL + `/api/product/getunit?unit_type=netto`)
            .then((res) => {
                setAll_Netto(res.data)
            })
            .catch((error) => {
                console.log('getNetto error :', error)
            })
    }

    const getMain = () => {
        axios.get(API_URL + `/api/product/getunit?unit_type=main`)
            .then((res) => {
                setAll_Main(res.data)
            })
            .catch((error) => {
                console.log('getMain error :', error)
            })
    }

    React.useEffect(() => {
        getNetto()
        getMain()
    })

    const prtintNetto = () => {
        return all_netto.map((val, idx) => {
            return <option key={val.idunit} value={val.unit}>{val.unit}</option>
        })
    }

    const printMain = () => {
        return all_main.map((val, idx) => {
            return <option key={val.idunit} value={val.unit}>{val.unit}</option>
        })
    }

    const printCategory = () => {
        return category.map((val, idx) => {
            return <option value={`${val.idcategory}`}>{val.category_name}</option>
        })
    }

    const editProduct = () => {
        let formData = new FormData();
        formData.append('data', JSON.stringify({
            iduser,
            price,
            category_id,
            netto_stock,
            netto_unit,
            default_unit,
            description,
            dosis,
            aturan_pakai,
            stock_unit,
            unit: default_unit
        }));
        formData.append('images', picture);
        axios.patch(API_URL + `/api/product/edit/${dataproduct.idproduct}`, formData)
            .then((res) => {
                if (res.data) {
                    toast.success('Edit product berhasil', {
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
                console.log('edit product gagal', error)
            })
    }

    return (

        <div className="bg-black bg-opacity-50 fixed inset-0 z-50">
            <div className="flex h-screen justify-center items-center">
                <div className="flex-col justify-center bg-white py-5 px-24 rounded-xl" style={{ height: '650px' }}>


                    {/* <!-- Modal content --> */}
                    <div className="py-6" style={{ height: "540px" }}>
                        <h3 className="mb-7 text-xl font-medium text-gray-900">Edit Product</h3>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <div className="block">
                                    <label className="mb-2 text-sm font-medium text-gray-900 flex">
                                        Category  <button type="button" className="w-6 text-btn-500 rounded-md font-bold">
                                            {<AiFillEdit onClick={() => setModalSetCategoryOn(true)} size={13} className="mx-2" />}
                                        </button>
                                    </label>
                                    <select onChange={(e) => setCategory_Id(e.target.value)} className='bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2'>
                                        <option defaultValue='Choose category'>Choose category</option>
                                        {printCategory()}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="product_name" className="block mt-4 mb-2 text-sm font-medium text-gray-900">
                                        Product Name
                                    </label>
                                    <input defaultValue={dataproduct.product_name} type="text" onChange={(e) => setProduct_Name(e.target.value)} name="product_name" id="product_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Contoh : Sanmol 6 Kapsul" required />
                                </div>
                                <div>
                                    <label htmlFor="description" className="block mt-4 mb-2 text-sm font-medium text-gray-900">
                                        Price
                                    </label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-l-md border border-r-0 border-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                                            Rp
                                        </span>
                                        <input defaultValue={dataproduct.price} type="number" onChange={(e) => setPrice(e.target.value)} name="description" id="description" className="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5" placeholder="Masukkan harga" required />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="description" className="block mt-4 mb-2 text-sm font-medium text-gray-900">
                                        Description
                                    </label>
                                    <textarea defaultValue={dataproduct.description} onChange={(e) => setDescription(e.target.value)} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' placeholder="Tulis deskripsi singkat dari obat untuk inhtmlFormasi pembeli" type='text' />
                                </div>
                                <div>
                                    <label htmlFor="dosis" className="block mt-4 mb-2 text-sm font-medium text-gray-900">
                                        Dosis
                                    </label>
                                    <input defaultValue={dataproduct.dosis} type="text" onChange={(e) => setDosis(e.target.value)} name="dosis" id="dosis" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Anjuran dosis penggunaan obat" required />
                                </div>
                            </div>
                            <div className="ml-8">
                                <div>
                                    <div>
                                        <label htmlFor="aturan_pakai" className="block mb-2 text-sm font-medium text-gray-900">
                                            Aturan Pakai
                                        </label>
                                        <input defaultValue={dataproduct.aturan_pakai} type="text" onChange={(e) => setAturan_Pakai(e.target.value)} name="aturan_pakai" id="aturan_pakai" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4" placeholder="Anjuran aturan pemakaian obat" required />
                                    </div>
                                    <div className="columns-2">
                                        <div>
                                            <div>
                                                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900">
                                                    Main Stock
                                                </label>
                                                <input defaultValue={dataproduct.stock_unit} type="number" onChange={(e) => setStock_Unit(e.target.value)} name="category" id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Jumlah stok obat" required />
                                            </div>
                                            <div>
                                                <label className="mt-4 mb-2 text-sm font-medium text-gray-900 flex">
                                                    Main Unit  <button type="button" className="w-6 text-btn-500 rounded-md font-bold">
                                                        {<AiFillEdit onClick={() => { setModalAddMainUnitOn(true); setUnit_Type('main') }} size={13} className="mx-2" />}
                                                    </button>
                                                </label>
                                                <select onChange={(e) => setDefault_Unit(e.target.value)} className='bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2'>
                                                    <option defaultValue='Pilih Unit Utama'>Pilih unit utama obat</option>
                                                    {printMain()}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <div>
                                                <label htmlFor="description" className="block mt-4 mb-2 text-sm font-medium text-gray-900">
                                                    Netto Stock
                                                </label>
                                                <input defaultValue={dataproduct.netto_stock} type="number" onChange={(e) => setNetto_Stock(e.target.value)} name="description" id="description" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Isi per obat" required disabled />
                                            </div>
                                            <div>
                                                <label className="mt-4 mb-2 text-sm font-medium text-gray-900 flex">
                                                    Netto Unit  <button type="button" className="w-6 text-btn-500 rounded-md font-bold">
                                                        {<AiFillEdit onClick={() => { setModalAddNettoUnitOn(true); setUnit_Type('netto') }} size={13} className="mx-2" />}
                                                    </button>
                                                </label>
                                                <select onChange={(e) => setNetto_Unit(e.target.value)} className='bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2'>
                                                    <option defaultValue='Pilih Unit Netto'>Pilih unit isi obat</option>
                                                    {prtintNetto()}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="description" className="block mt-4 mb-2 text-sm font-medium text-gray-900">Product Image</label>

                                    <div className="flex justify-center items-center w-full">
                                        <label htmlFor="dropzone-file" className="flex flex-col justify-center items-center w-full h-30 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                            <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                                <svg aria-hidden="true" className="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                            </div>
                                            <input id="dropzone-file" type="file" onChange={(e) => setPicture(e.target.files[0])} className="hidden" />
                                        </label>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end mt-3">
                        <button onClick={handleCancelClick} className="rounded-lg px-4 py-2 text-btn-500 bg-white border border-btn-500 font-bold">Cancel</button>
                        <button onClick={handleOKClick} className=" rounded-lg px-4 py-2 ml-4 text-white  bg-btn-500 font-bold">Submit</button>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="bottom-center"
                autoClose={2000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            {modalAddMainUnitOn && <ModalAddMainUnit setModalAddMainUnitOn={setModalAddMainUnitOn} unit_type={unit_type} />}
            {modalAddNettoUnitOn && <ModalAddNettoUnit setModalAddNettoUnitOn={setModalAddNettoUnitOn} unit_type={unit_type} />}
            {modalSetCategoryOn && <ModalSettingCategory setModalSetCategoryOn={setModalSetCategoryOn} category={category} />}

        </div>
    );
}

export default ModalEdit;