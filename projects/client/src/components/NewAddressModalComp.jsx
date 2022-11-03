import React from 'react'
import axios from 'axios';
import { API_URL } from '../helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const NewAddressComponent = ({ showModal }) => {

    // INPUT NEW ADDRESS
    const [countFullAddress, setCountFullAddress] = React.useState(0);
    const [selectedProvinceID, setSelectedProvinceID] = React.useState(0);
    const [selectedCityID, setSelectedCityID] = React.useState(0);
    const [inputFullAddress, setInputFullAddress] = React.useState('');
    const [inputDistrict, setInputDistrict] = React.useState('');
    const [inputPostalCode, setInputPostalCode] = React.useState('');
    const [checkAddress, setCheckAddress] = React.useState('');
    const [checkProvince, setCheckProvince] = React.useState('');
    const [checkCity, setCheckCity] = React.useState('');
    const [checkDistrict, setCheckDistrict] = React.useState('');
    const [checkPostal, setCheckPostal] = React.useState('');

    // RAJAONGKIR
    const [dataProvince, setDataProvince] = React.useState([]);
    const [dataCity, setDataCity] = React.useState([]);
    const [filterCity, setFilterCity] = React.useState([]);

    React.useEffect(() => {
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

    const onSaveNewAddress = async () => {
        try {
            let userToken = localStorage.getItem('medcarelog');
            // console.log("full", inputFullAddress); string
            // console.log("district", inputDistrict); string
            // console.log("postal", inputPostalCode); number
            // console.log("cityID", selectedCityID); number
            // console.log("provinceID", selectedProvinceID); number

            let searchData = dataProvince.find(val => val.province_id === selectedProvinceID);
            let searchCity = filterCity.find(val => val.city_id === selectedCityID);

            // console.log("kota", searchCity.type + ' ' + searchCity.city_name);

            if (inputFullAddress === '' || inputDistrict === '' || searchData === undefined || searchCity === undefined || inputPostalCode === '') {
                if (inputFullAddress === '') {
                    setCheckAddress('show');
                }
                if (inputDistrict === '') {
                    setCheckDistrict('show');
                }
                if (searchData === undefined) {
                    setCheckProvince('show');
                }
                if (searchCity === undefined) {
                    setCheckCity('show');
                }
                if (inputPostalCode === '') {
                    setCheckPostal('show');
                }
            } else {
                if (inputPostalCode.match(/[a-zA-Z]/)){
                    setCheckPostal('show');
                } else {
                    let data = {
                        full_address: inputFullAddress,
                        district: inputDistrict,
                        city: searchCity.type + ' ' + searchCity.city_name,
                        city_id: selectedCityID,
                        province: searchData.province,
                        province_id: selectedProvinceID,
                        postal_code: inputPostalCode
                    }
    
                    // pakai authorization
                    let add = await axios.post(API_URL + '/api/address/add', { data }, {
                        headers: {
                            'Authorization': `Bearer ${userToken}`
                        }
                    })
    
                    if (add.data.success) {
                        toast.success('Address Added Success!', {
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
                        setInputFullAddress('');
                        setInputDistrict('');
                        setInputPostalCode('');
                        setSelectedProvinceID(0);
                        setSelectedCityID(0);
                        setCountFullAddress(0);
                        setCheckAddress('');
                        setCheckCity('');
                        setCheckDistrict('');
                        setCheckPostal('');
                        setCheckProvince('');
                    }
    
                    console.log(data)
                }
            }

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
                                <p className='text-2xl font-bold text-main-500'>Add New Address</p>
                            </div>
                            <div className='my-4'>
                                <div className='flex flex-col items-start px-3 mb-2'>
                                    <p>Full Address<a className='text-red-600'>*</a> :</p>
                                    <textarea maxLength={200} type='text'
                                        className={checkAddress === 'show' ? 'border border-red-600 w-full rounded-lg px-3 mt-2' : 'border border-main-600 w-full rounded-lg px-3 mt-2 focus:ring-2 focus:ring-main-500'}
                                        placeholder='Full Address' onChange={(e) => { setInputFullAddress(e.target.value); setCountFullAddress(e.target.value.length); if (e.target.value.length > 0) { setCheckAddress('') } }} value={inputFullAddress} />
                                    <div className='flex justify-end w-full'>
                                        {countFullAddress} / 200
                                    </div>
                                </div>
                                <div className='flex flex-col items-start px-3 mb-2'>
                                    <p>Province (Provinsi)<a className='text-red-600'>*</a> :</p>
                                    <select type='text' onChange={(e) => { handleFilterCity(e.target.value); setSelectedProvinceID(e.target.value); if (e.target.value > 0) { setCheckProvince('') } }}
                                        className={checkProvince === 'show' ? 'border border-red-600 w-full rounded-lg px-3 h-10 mt-2' :
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
                                <div className='flex flex-col items-start px-3 mb-2'>
                                    <p>City (Kota)<a className='text-red-600'>*</a> :</p>
                                    <select type='text' onChange={(e) => { setSelectedCityID(e.target.value); if (e.target.value > 0) { setCheckCity('') } }}
                                        className={checkCity === 'show' ? 'border border-red-600 w-full rounded-lg px-3 h-10 mt-2' :
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
                                <div className='flex flex-col items-start px-3 mb-2'>
                                    <p>District (Kecamatan/Kabupaten)<a className='text-red-600'>*</a> :</p>
                                    <input type='text'
                                        className={checkDistrict === 'show' ? 'border border-red-600 w-full rounded-lg px-3 h-10 mt-2' :
                                            'border border-main-600 w-full rounded-lg px-3 h-10 mt-2 focus:ring-2 focus:ring-main-500'}
                                        placeholder='District' onChange={(e) => { setInputDistrict(e.target.value); if (e.target.value.length > 0) { setCheckDistrict('') } }}
                                        value={inputDistrict} />
                                </div>
                                <div className='flex flex-col items-start px-3 mb-2'>
                                    <p>Postal Code (Kode Pos)<a className='text-red-600'>*</a> :</p>
                                    <input type='text'
                                        className={checkPostal === 'show' ? 'border border-red-600 w-full rounded-lg px-3 h-10 mt-2' :
                                            'border border-main-600 w-full rounded-lg px-3 h-10 mt-2 focus:ring-2 focus:ring-main-500'}
                                        placeholder='Postal Code' onChange={(e) => { setInputPostalCode(e.target.value); if (e.target.value > 0) { setCheckPostal('') } }}
                                        value={inputPostalCode} maxLength={5} />
                                </div>
                            </div>
                            <button type="button" className="mr-1 text-white bg-main-500 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-10 py-2.5 focus:z-10 "
                                onClick={() => {
                                    onSaveNewAddress();
                                }}>Save</button>
                            <button type="button"
                                className="ml-1 text-white bg-red-500 focus:ring-2 focus:ring-red-500 border border-gray-200 hover:bg-red-600 rounded-lg text-sm font-medium px-10 py-2.5 focus:z-10 "
                                onClick={() => {
                                    setInputFullAddress('');
                                    setInputDistrict('');
                                    setInputPostalCode('');
                                    setSelectedProvinceID(0);
                                    setSelectedCityID(0);
                                    setCountFullAddress(0);
                                    setCheckAddress('');
                                    setCheckCity('');
                                    setCheckDistrict('');
                                    setCheckPostal('');
                                    setCheckProvince('');
                                    showModal('');
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

export default NewAddressComponent;