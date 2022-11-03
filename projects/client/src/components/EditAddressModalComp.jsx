import React from 'react'
import axios from 'axios';
import { API_URL } from '../helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const EditAddressComponent = ({ selected, showModal }) => {

    const [selectedEdit, setSelectedEdit] = React.useState({});

    // INPUT EDIT ADDRESS
    const [countEditFullAddress, setCountEditFullAddress] = React.useState(0);
    const [selectedEditProvinceID, setSelectedEditProvinceID] = React.useState(0);
    const [selectedEditCityID, setSelectedEditCityID] = React.useState(0);
    const [inputEditFullAddress, setInputEditFullAddress] = React.useState('');
    const [inputEditDistrict, setInputEditDistrict] = React.useState('');
    const [inputEditPostalCode, setInputEditPostalCode] = React.useState('');

    const [checkEditAddress, setCheckEditAddress] = React.useState('');
    const [checkEditProvince, setCheckEditProvince] = React.useState('');
    const [checkEditCity, setCheckEditCity] = React.useState('');
    const [checkEditDistrict, setCheckEditDistrict] = React.useState('');
    const [checkEditPostal, setCheckEditPostal] = React.useState('');

    // RAJAONGKIR
    const [dataProvince, setDataProvince] = React.useState([]);
    const [dataCity, setDataCity] = React.useState([]);
    const [filterCity, setFilterCity] = React.useState([]);

    React.useEffect(() => {
        setSelectedEdit(selected);
        getDataCity();
        getDataProvince();
    }, []);

    const getDataProvince = async () => {
        try {
            let province = await axios.get(API_URL + '/api/rajaongkir/province');

            //console.log(province.data)
            setDataProvince(province.data)
        } catch (error) {
            console.log(error)
        }
    };

    const getDataCity = async () => {
        try {
            let city = await axios.get(API_URL + '/api/rajaongkir/city');

            //console.log(city.data)
            setDataCity(city.data)
        } catch (error) {
            console.log(error)
        }
    };

    const handleFilterCity = (id) => {
        //console.log(id)
        let temp = [];

        dataCity.forEach((val, idx) => {
            if (val.province_id === id) {
                temp.push(val);
            }
        })
        //console.log(temp);
        setFilterCity(temp);
    };

    const onSaveEditAddress = async () => {
        try {
            let userToken = localStorage.getItem('medcarelog');
            // console.log("full", inputEditFullAddress);
            // console.log("district", inputEditDistrict);
            // console.log("postal", inputEditPostalCode);
            // console.log("cityID", selectedEditCityID);
            // console.log("provinceID", selectedEditProvinceID);
            // console.log(selectedEdit)

            let searchData = dataProvince.find(val => val.province_id === selectedEditProvinceID);
            let searchCity = filterCity.find(val => val.city_id === selectedEditCityID);

            let tempCity = '';
            if (searchCity === undefined) {
                tempCity = '';
            } else {
                tempCity = searchCity.type + ' ' + searchCity.city_name;
            }

            let tempProvince = '';
            if (searchData === undefined) {
                tempProvince = '';
            } else {
                tempProvince = searchData.province;
            }

            let dataEdit = {
                full_address: inputEditFullAddress,
                district: inputEditDistrict,
                city: tempCity,
                city_id: selectedEditCityID,
                province: tempProvince,
                province_id: selectedEditProvinceID,
                postal_code: inputEditPostalCode
            }

            if (tempProvince !== '' && tempCity === '') {
                setCheckEditCity('show');
            } else {
                if (inputEditPostalCode.match(/[a-zA-Z]/)){
                    setCheckEditPostal('show');
                } else {
                    let edit = await axios.patch(API_URL + '/api/address/update', { dataEdit, idaddress: selectedEdit.idaddress }, {
                        headers: {
                            'Authorization': `Bearer ${userToken}`
                        }
                    })
    
                    if (edit.data.success) {
                        toast.success('Address Edit Success!', {
                            theme: 'colored',
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        showModal('');
                        setInputEditFullAddress('');
                        setInputEditDistrict('');
                        setInputEditPostalCode('');
                        setSelectedEditCityID(0);
                        setSelectedEditProvinceID(0);
                    }
                }
            }
            console.log(dataEdit)
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div>
            <div tabIndex={-1} className="overflow-y-auto overflow-x-hidden backdrop-blur-sm fixed right-0 left-0 top-0 flex justify-center items-center z-50 md:inset-0 h-full">
                <div className="relative p-4 w-full md:w-2/3 lg:w-1/2 h-full sm:h-auto">
                    <div className="relative border-2 bg-white rounded-lg shadow border-main-500">
                        <div className="p-6 text-center">
                            <div>
                                <p className='text-2xl font-bold text-main-500'>Edit Address</p>
                            </div>
                            <div className='my-4'>
                                <div className='flex flex-col items-start px-3 mb-2'><p>Full Address<a className='text-red-600'>*</a> :</p>
                                    <div className='w-full flex'>
                                        <div className='w-full'>
                                            <textarea maxLength={200} type='text'
                                                className={checkEditAddress === 'show' ? 'border border-red-600 w-full rounded-lg px-3 mt-2' : 'border border-main-600 w-full rounded-lg px-3 mt-2 focus:ring-2 focus:ring-main-500'}
                                                placeholder={selectedEdit.full_address} onChange={(e) => { setInputEditFullAddress(e.target.value); setCountEditFullAddress(e.target.value.length); if (e.target.value.length > 0) { setCheckEditAddress('') } }}
                                                value={inputEditFullAddress} />
                                            <div className='flex justify-end w-full'>
                                                {countEditFullAddress} / 200
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col items-start px-3 mb-2'>
                                    <p>Province (Provinsi)<a className='text-red-600'>*</a> :</p>
                                    <div className='w-full flex'>
                                        <select type='text' onChange={(e) => { handleFilterCity(e.target.value); setSelectedEditProvinceID(e.target.value); if (e.target.value > 0) { setCheckEditProvince('') } }}
                                            className={checkEditProvince === 'show' ? 'w-full border border-red-600 rounded-lg px-3 h-10 mt-2' :
                                                'border border-main-600 w-full rounded-lg px-3 h-10 mt-2 focus:ring-2 focus:ring-main-500'}>
                                            <option value='' className='w-1/2'>Select Province</option>
                                            {
                                                dataProvince.map((val, idx) => {
                                                    return (
                                                        <option value={val.province_id} key={val.province_id}>{val.province}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className='flex flex-col items-start px-3 mb-2'>
                                    <p>City (Kota)<a className='text-red-600'>*</a> :</p>
                                    <div className='w-full flex'>
                                        <select type='text' onChange={(e) => { setSelectedEditCityID(e.target.value); if (e.target.value > 0) { setCheckEditCity('') } }}
                                            className={checkEditCity === 'show' ? 'border border-red-600 w-full rounded-lg px-3 h-10 mt-2' :
                                                'border border-main-600 w-full rounded-lg px-3 h-10 mt-2 focus:ring-2 focus:ring-main-500'}>
                                            <option value='' className='w-1/2'>Select City</option>
                                            {
                                                filterCity.map((val, idx) => {
                                                    return (
                                                        <option value={val.city_id} key={val.city_id}>{val.type} {val.city_name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className='flex flex-col items-start px-3 mb-2'>
                                    <p>District (Kecamatan/Kabupaten)<a className='text-red-600'>*</a> :</p>
                                    <div className='w-full flex'>
                                        <input type='text'
                                            className={checkEditDistrict === 'show' ? 'border border-red-600 w-full rounded-lg px-3 h-10 mt-2' :
                                                'border border-main-600 w-full rounded-lg px-3 h-10 mt-2 focus:ring-2 focus:ring-main-500'}
                                            placeholder={selectedEdit.district} onChange={(e) => { setInputEditDistrict(e.target.value); if (e.target.value.length > 0) { setCheckEditDistrict('') } }}
                                            value={inputEditDistrict} />
                                    </div>
                                </div>
                                <div className='flex flex-col items-start  px-3 mb-2'>
                                    <p>Postal Code (Kode Pos)<a className='text-red-600'>*</a> :</p>
                                    <div className='w-full flex'>
                                        <input type='text'
                                            className={checkEditPostal === 'show' ? 'border border-red-600 w-full rounded-lg px-3 h-10 mt-2' :
                                                'border border-main-600 w-full rounded-lg px-3 h-10 mt-2 focus:ring-2 focus:ring-main-500'}
                                            placeholder={selectedEdit.postal_code} onChange={(e) => { setInputEditPostalCode(e.target.value); if (e.target.value > 0) { setCheckEditPostal('') } }}
                                            value={inputEditPostalCode} maxLength={5} />
                                    </div>
                                </div>
                            </div>
                            <button type="button" className="mr-1 text-white bg-main-500 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-10 py-2.5 focus:z-10 disabled:bg-opacity-50"
                                onClick={() => { onSaveEditAddress() }} disabled={inputEditFullAddress === '' || inputEditDistrict === '' || inputEditPostalCode === '' || selectedEditProvinceID === 0 ? true : false}
                            >Save</button>
                            <button type="button" 
                            className="ml-1 text-white bg-red-500 focus:ring-2 focus:ring-red-500 border border-gray-200 hover:bg-red-600 rounded-lg text-sm font-medium px-10 py-2.5 focus:z-10 "
                                onClick={() => {
                                    showModal('');
                                    setInputEditFullAddress('');
                                    setInputEditDistrict('');
                                    setInputEditPostalCode('');
                                    setSelectedEditCityID(0);
                                    setSelectedEditProvinceID(0);
                                }}
                            >Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default EditAddressComponent;