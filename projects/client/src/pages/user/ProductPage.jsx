import React from "react";
import axios from "axios";
import { API_URL } from "../../helper";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateCart } from '../../action/useraction';
import { useDispatch, useSelector } from 'react-redux';

const ProductPage = (props) => {
    const [data, setData] = React.useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const [query, setQuery] = React.useState(10);
    const [category, setCategory] = React.useState([]);
    const [drop, setDrop] = React.useState(true);
    const [sort, setSort] = React.useState('');
    const [filterName, setFilterName] = React.useState('');

    const navigate = useNavigate();

    const { state, search } = useLocation();    //perlu idcategory dari daniel
    let id = search.split('');
    const [idPage, setIdPage] = React.useState(id[id.length - 1]);

    const [defaultSort, setDefaultSort] = React.useState('Terpopuler');

    const [loading, setLoading] = React.useState(false);

    const dispatch = useDispatch();

    const [userCartData, setUserCartData] = React.useState([]);

    const { status } = useSelector((state) => {
        return {
            status: state.userReducer.status_name
        }
    })


    const getProduct = () => {
        if (idPage == undefined) {
            console.log('Ini all')
            axios.post(API_URL + `/api/product/getproduct`, {
                query,
                sort,
                filterName
            })
                .then((res) => {
                    setData(res.data);
                })
                .catch((error) => {
                    console.log('Print product error', error);
                })
        } else {
            console.log('Ini filter')
            axios.post(API_URL + `/api/product/filterproduct/category?category_id=${idPage}`, {
                query,
                sort,
                filterName
            })
                .then((res) => {
                    setData(res.data);
                })
                .catch((error) => {
                    console.log('Print product error', error);
                })
        }
    }

    React.useEffect(() => {
        setTimeout(() => { setLoading(true) }, 1000)
        getProduct();
        return () => {
            setTimeout(() => { setLoading(true) }, 1000)
        }
    }, [
        loading
        // sort, query, idPage, loading
    ]);

    const printProduct = () => {
        return data.map((val, idx) => {
            if (loading) {
                return <div key={val.idproduct} className="row-span-3">
                    <div className="max-w-sm px-4 pb-3 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden mx-1 mt-3 md:h-auto" >
                        <img className="w-full pt-1 mb-2" src={val.picture} alt={val.idproduct} onClick={() => navigate(`/product/detail?product_name=${val.product_name}&category_id=${val.category_id}`)} />
                        <div className="" >
                            {val.product_name.length <= 21
                                ?
                                <div className="font-bold text-xs h-6 text-txt-500">
                                    {val.product_name}
                                </div>
                                :
                                <div className="font-bold text-xs h-10 text-txt-500">
                                    {val.product_name}
                                </div>
                            }

                            <div className="flex">
                                <p className="font-bold text-txt-500 text-xs">
                                    Rp{val.price}
                                </p>
                                <p className="text-txt-500 text-xs">
                                    /{val.default_unit}
                                </p>
                            </div>
                        </div>
                        {
                            val.product_name.length <= 21
                                ? <button type="button" className="mb-3 mt-7 md:mt-9 w-full text-btn-500 hover:text-white border
                            border-btn-500 hover:bg-btn-500 font-bold rounded-lg text-sm py-1.5 text-center" onClick={() => {
                                        if (status !== 'Unverified') {
                                            onAddToCart(val.idproduct)
                                        } else if (status === 'Unverified') {
                                            toast.info('Verified your account first!', {
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
                                    }}>Keranjang</button>
                                : <button type="button" className="my-3 md:my-5 w-full text-btn-500 hover:text-white border
                            border-btn-500 hover:bg-btn-500 font-bold rounded-lg text-sm py-1.5 text-center" onClick={() => {
                                        if (status !== 'Unverified') {
                                            onAddToCart(val.idproduct)
                                        } else if (status === 'Unverified') {
                                            toast.info('Verified your account first!', {
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
                                    }}>Keranjang</button>
                        }

                    </div>
                </div>

            } else {
                return <div className="row-span-3">
                    <div role="status" className="p-4 max-w-sm rounded border border-gray-200 shadow animate-pulse md:p-6 dark:border-gray-700 mx-1 mt-3 md:h-72">
                        <div className="flex justify-center items-center mb-4 h-32 bg-gray-300 rounded dark:bg-gray-700">
                            <svg className="w-12 h-12 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z"></path></svg>
                        </div>
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 mb-4"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                        <div>
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 mt-4 w-32 mb-2"></div>
                        </div>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            }
        })
    }

    const getCategory = () => {
        axios.get(API_URL + '/api/product/getcategory')
            .then((res) => {
                setCategory(res.data)
            })
            .catch((error) => {
                console.log('getCategory error :', error)
            })
    }

    React.useEffect(() => {
        getCategory();
        let userToken = localStorage.getItem('medcarelog');
        if (userToken !== null) {
            getUserCartData();
        }
    }, [])

    const onResetFilter = () => {
        setLoading(false);
        setSort('');
        setDefaultSort('Terpopuler');
        setFilterName('');
        setQuery(10)
    }

    const printCategory = () => {
        return category.map((val, idx) => {
            if (val.idcategory != idPage) {
                return <div key={val.idcategory}>
                    {/* Desktop */}
                    <button onClick={() => { navigate(`/product?id=${val.idcategory}`); setIdPage(val.idcategory); onResetFilter() }} className="hidden md:flex text-md mb-2 text-txt-500">
                        {val.category_name}
                    </button>
                    {/* Mobile */}
                    <li className="mr-2 md:hidden">
                        <button type="button" onClick={() => { navigate(`/product?id=${val.idcategory}`); setIdPage(val.idcategory); onResetFilter() }} className="inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">
                            {val.category_name}
                        </button>
                    </li>
                </div>
            } else {
                return <div key={val.idcategory}>
                    {/* Desktop */}
                    <button onClick={() => { navigate(`/product?id=${val.idcategory}`); setIdPage(val.idcategory); onResetFilter() }} className="hidden md:flex font-bold text-md mb-2 text-btn-500">
                        {val.category_name}
                    </button>
                    {/* Mobile */}
                    <li className="mr-2 md:hidden">
                        <button type="button" onClick={() => { navigate(`/product?id=${val.idcategory}`); setIdPage(val.idcategory); onResetFilter() }} className="inline-block p-4 text-btn-500 font-bold rounded-t-lg border-b-2 border-btn-500 active">
                            {val.category_name}
                        </button>
                    </li>
                </div>
            }
        })
    }

    // kemal add to cart APKG2-26
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

    // kemal add to cart APKG2-26
    const onAddToCart = async (id) => {
        try {
            console.log('idproduct', id);

            let userToken = localStorage.getItem('medcarelog');

            if (userToken === null) {
                toast.info('You need to login first', {
                    theme: "colored",
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                });
                navigate('/login');
            } else {

                let findIndex = userCartData.find(val => val.idproduct === id);

                // console.log(findIndex)

                if (findIndex === undefined) {
                    console.log(true);

                    let data = {
                        idproduct: id,
                        newQty: 1
                    };

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
                    }
                } else {
                    let data = {
                        idcart: findIndex.idcart,
                        newQty: findIndex.quantity + 1
                    };

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
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    };

    return <div className="container mx-auto">

        <div className="hidden md:flex space-x-2 text-btn-500 font-bold mt-10">
            <button className="flex-none text-md text-txt-500" onClick={() => navigate('/')}>Beranda /</button>
            <button className="flex-none" onClick={() => { setIdPage(undefined); navigate('/product'); onResetFilter() }}>Obat</button>
        </div>

        <div className="grid grid-flow-col gap-4">
            <div className="hidden md:row-span-3 md:inline">
                <div className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden mt-5 h-fit w-64">
                    <div className="px-4 pt-4 pb-2">
                        <div className="font-bold text-md mb-3 text-txt-500">CARI OBAT</div>
                        <form className="mb-5">
                            <div className="flex">
                                <div className="relative w-full">
                                    <input id="searchsm" onChange={(e) => setFilterName(e.target.value)} type="search" className="block p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-btn-500 focus:border-btn-500" placeholder="Example : Sanmol" required="" />
                                    <button onClick={() => { setLoading(false); document.getElementById("searchsm").value = null }} type="button" className="absolute top-0 right-0 p-2 text-sm font-medium text-white bg-btn-500 rounded-r-lg border border-btn-600 hover:bg-btn-600 focus:ring-4 focus:outline-none focus:ring-green-300">
                                        <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                        <span className="sr-only">Search</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="max-w-sm bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden mt-5 h-fit w-64">
                    <div className="px-4 py-4">
                        <div className="font-bold text-md mb-4 text-txt-500">KATEGORI</div>
                        {idPage == undefined ?
                            <button onClick={() => { setIdPage(undefined); navigate('/product'); onResetFilter() }} className="font-bold text-md mb-2 text-btn-500">
                                Semua Produk
                            </button>
                            :
                            <button onClick={() => { setIdPage(undefined); navigate('/product'); onResetFilter() }} className="text-md mb-2">
                                Semua Produk
                            </button>
                        }
                        {printCategory()}
                    </div>
                </div>
            </div>

            <div className="col-span-4 ml-5">
                <div className="grid grid-cols-1 justify-between">

                    {/* Mobile category */}
                    <div className="md:hidden text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                        <ul className="flex flex-wrap -mb-px">
                            {idPage == undefined ?
                                <li className="mr-2">
                                    <button type="button" onClick={() => { setIdPage(undefined); navigate('/product'); onResetFilter() }} className="inline-block p-4 text-btn-500 font-bold rounded-t-lg border-b-2 border-btn-500 active">
                                        Semua Produk
                                    </button>
                                </li>
                                :
                                <li className="mr-2">
                                    <button type="button" onClick={() => { setIdPage(undefined); navigate('/product'); onResetFilter() }} className="inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">
                                        Semua Produk
                                    </button>
                                </li>
                            }
                            {printCategory()}
                        </ul>
                    </div>

                    {/* Mobile search & sort */}
                    <div className="md:hidden flex justify-between mt-3 mr-5">
                        <form>
                            <div className="flex">
                                <div className="relative w-full">
                                    <input id="search" onChange={(e) => setFilterName(e.target.value)} type="search" className="block w-52 p-2 text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-btn-500 focus:border-btn-500" placeholder="Example : Sanmol" required="" />
                                    <button onClick={() => { setLoading(false); document.getElementById("search").value = null }} type="button" className="absolute top-0 right-0 p-2 text-sm font-medium text-white bg-btn-500 rounded-r-lg border border-btn-600 hover:bg-btn-600 focus:ring-4 focus:outline-none focus:ring-green-300">
                                        <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                        <span className="sr-only">Search</span>
                                    </button>
                                </div>
                            </div>
                        </form>

                        <button onClick={() => setDrop(!drop)} id="dropdownDefault" data-dropdown-toggle="dropdown" className="flex px-auto text-white bg-btn-500 hover:bg-btn-600 focus:ring-4 focus:outline-none focus:ring-green-300
                                font-bold rounded-lg text-xs w-fit px-2 items-center text-center" type="button">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path></svg>

                            {defaultSort}

                        </button>

                        {/* <!-- Dropdown menu --> */}
                        <div id="dropdown" className={`${drop == true ? 'hidden' : ''} z-10 w-44 bg-white rounded shadow dark:bg-gray-700`} style={{ position: "absolute", inset: "103px auto auto 164px" }}>
                            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefault">
                                <li>
                                    <button onClick={() => { setLoading(false); setDefaultSort('Nama Produk'); setSort('product_name'); setDrop(!drop) }} className="block py-2 pl-4 pr-16 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Nama Produk</button>
                                </li>
                                <li>
                                    <button onClick={() => { setLoading(false); setDefaultSort('Harga Terendah'); setSort('price'); setDrop(!drop) }} href="#" className="block py-2 pl-4 pr-12 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Harga Terendah</button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Desktop sort */}
                    <div className="hidden md:flex justify-between items-center">
                        <p className="text-2xl font-bold mt-5 mb-3 text-txt-500">OBAT</p>
                        <div className="flex items-center">
                            <p className="text-sm text-cyan-900 mr-2">Urutkan: </p>
                            <button onClick={() => setDrop(!drop)} id="dropdownDefault" data-dropdown-toggle="dropdown" className="text-white bg-btn-500 hover:bg-btn-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-4 h-8 mr-1 text-center inline-flex items-center" type="button">
                                {defaultSort}
                                <svg className="ml-2 w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            {/* <!-- Dropdown menu --> */}
                            <div id="dropdown" className={`${drop == true ? 'hidden' : ''} z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700`} style={{ position: "absolute", inset: "115px auto auto 1180px" }}>
                                <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefault">
                                    <li>
                                        <button onClick={() => { setLoading(false); setDefaultSort('Nama Produk'); setSort('product_name'); setDrop(!drop) }} className="block py-2 pl-4 pr-16 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Nama Produk</button>
                                    </li>
                                    <li>
                                        <button onClick={() => { setLoading(false); setDefaultSort('Harga Terendah'); setSort('price'); setDrop(!drop) }} href="#" className="block py-2 pl-4 pr-12 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Harga Terendah</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <hr className="hidden md:flex my-2 h-px bg-gray-200 border-0 dark:bg-gray-700" />

                    <div className="grid grid-cols-2 mr-4 md:mr-0 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 gap-2">
                        {printProduct()}
                    </div>
                    <div className="mx-auto">
                        {
                            data.length == 0 || data.length < query
                                ? <></>
                                : <button onClick={() => { setQuery(query + 10); setLoading(false) }} type="button" className="px-auto mt-7 mb-5 text-white bg-btn-500 hover:bg-btn-600 focus:ring-4 focus:outline-none focus:ring-green-300
                                font-bold rounded-lg text-sm w-44 ml-4 px-3 py-1.5 text-center">Selanjutnya</button>
                        }
                    </div>
                </div>
            </div>
        </div>
        <ToastContainer />
    </div>
}

export default ProductPage;