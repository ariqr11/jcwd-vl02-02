import React from 'react'
import image from '../assets/undraw_doctors_hwty.svg'
import { GiMedicines, GiChestnutLeaf, GiShinyApple, GiBeerBottle, GiSquareBottle, GiGlassShot, GiNotebook, GiShipBow } from 'react-icons/gi';
import bca from '../assets/Bank BCA Logo (PNG-1080p) - FileVector69.png'
import bri from '../assets/bri.png'
import bni from '../assets/Bank BNI Logo (PNG-1080p) - FileVector69.png'
import gopay from '../assets/Logo GoPay (PNG-1080p) - FileVector69.png'
import ovo from '../assets/ovo.png'
import shoppe from '../assets/ShopeePay Logo (PNG-1080p) - Vector69Com.png'
import Carousel from '../components/Carousel'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../helper';
import { useNavigate } from 'react-router';
import ProductCategory from '../components/ProductCategory';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import image2 from '../assets/undraw_conference_re_2yld.svg'
import image3 from '../assets/undraw_shopping_app_flsj.svg'

const LandingPages = () => {
  const navigate = useNavigate()
  const { email, status, iduser } = useSelector((state) => {
    return {
      email: state.userReducer.email,
      status: state.userReducer.status_name,
      iduser: state.userReducer.iduser
    }
  })

  let dataCategory = [
    {
      id: 1,
      icon: GiMedicines,
      name: 'Fever',
      fill: 'fill-purple-500'
    },
    {
      id: 2,
      icon: GiChestnutLeaf,
      name: 'Flu',
      fill: 'fill-red-500'
    },
    {
      id: 5,
      icon: GiBeerBottle,
      name: 'Eyes',
      fill: 'fill-green-500'
    },
    {
      id: 7,
      icon: GiMedicines,
      name: 'Hypertension',
      fill: 'fill-gray-500'
    },
    {
      id: 4,
      icon: GiGlassShot,
      name: 'Vitamin',
      fill: 'fill-yellow-500'
    },
  ]

  return (
    <div>
      <div>

        <div className='px-3 lg:px-[9.5rem]'>
          {/* Verification dipindahkan ke navbar */}
          <Carousel />
          <div className='grid grid-cols-2 my-3 w-full  py-10 shadow-lg bg-gradient-to-br from-[#92C3D1] to-[#C4E0E5] rounded-lg mt-8'>
            <div className=''>
              <img className='h-30 lg:h-52 lg:mx-auto' src={image} alt='medcare.com' />
            </div>
            <div className='mx-auto py-2 lg:mx-1 lg:py-4 md:mt-10 lg:mt-10 lg:flex justify-around'>
              <div className=''>
                <p className=' text-[#213360] text-sm font-bold lg:text-2xl font-Public ml-5 md:ml-0'>Punya Resep Dokter ?</p>
                <div className='w-80 h-12'>
                  <p className='text-[#525252] hidden md:flex'>Hanya foto resep anda dan unggah max 10mb tanpa perlu antri obat akan dikirimkan ke lokasi anda</p>
                </div>
              </div>
              <div className=' md:mt-10 lg:mt-5'>
                <button type='button' onClick={() => {
                  if (iduser !== null && status !== 'Unverified') {
                    navigate('/prescription')
                  } else if (status === 'Unverified') {
                    toast.info('You need to Verified first!', {
                      theme: "colored",
                      position: "top-center",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: false,
                      progress: undefined,
                    });
                  } else if (iduser === null) {
                    toast.info('You need to Login!', {
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
                  className='bg-teal-500 hover:bg-teal-600 ml-5 w-32 h-8 md:ml-0 lg:w-32 lg:h-12 rounded-lg text-white font-Public'
                >Unggah Resep</button>
              </div>
            </div>
          </div>
          <div className='py-5'>
            <div className='flex justify-between my-2'>
              <p className='text-sm font-bold text-[#213360] '>Kategori</p>
              <p className='text-xs font-bold  text-main-500' onClick={() => navigate('/product')}>Lihat Semua</p>
            </div>
            <div className='overflow-y-auto w-full'>
              <div className='flex justify-between mx-auto py-5' >
                {
                  dataCategory.map(data => (
                    <div key={data.id} onClick={() => navigate(`/product?id=${data.id}`)}>
                      <div className=' min-w-[195px] max-h-[119px] bg-white shadow-md rounded-2xl'>
                        <div className='py-5 hover:-translate-y-2'>
                          <data.icon size={50} className={`mx-auto ${data.fill}`} />
                          <p className='text-center pt-4 text-blue-900 text-base font-bold'>{data.name}</p>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
            <div className='grid md:grid-cols-2 gap-2 my-8 mx-auto'>
              <div className='bg-[#FFB156]  h-28 rounded-lg lg:h-40'>
                <div className='mt-2 flex px-5 lg:px-20'>
                  <img src={image2} alt='medcare.com' className='h-24 lg:h-36' />
                  <div className='pt-3 lg:pt-5 lg:pl-10 '>
                    <p className='text-medium font-bold  text-center text-txt-500 lg:text-2xl'>Program Hamil</p>
                    <p className='text-sm text-center  text-[#213360]'>Rencanakan kelahiran buah hati anda</p>
                  </div>
                </div>
              </div>
              <div className='bg-[#92C3D1] h-28 rounded-lg lg:h-40'>
                <div className='mt-2 flex px-5 lg:px-20'>
                  <img src={image3} alt='medcare.com' className='h-24 lg:h-36' />
                  <div className='pt-3 lg:pt-5 lg:pl-10 '>
                    <p className='text-medium font-bold  text-center text-txt-500 lg:text-2xl'>10-10 Flash Sale</p>
                    <p className='text-sm text-center  text-[#213360]'>Dapatkan diskon besar untuk keperluan anda</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex justify-between mt-8'>
              <p className='text-sm font-bold text-txt-500 font-Public'>Produk Populer</p>
              <p className='text-xs font-bold  text-main-500 font-Public' onClick={() => navigate('/product')}>Lihat Semua</p>
            </div>
            {/* Gunakan Produk Component */}
            <div className='bg-gradient-to-t from-white to-teal-50 mt-8'>
              <ProductCategory
                id={2}
              />
            </div>
          </div>
          <div className='mb-8 mt-4 '>
            <p className='text-sm font-bold text-blue-800 font-Public'>Jaminan Untuk Anda</p>
          </div>
          <div className='my-2'>
            <div className='grid gap-2 lg:grid-cols-3'>
              <div className='w-full h-32 rounded-lg shadow-lg bg-gradient-to-t from-teal-50 to-white'>
                <div className='grid grid-cols-3 px-5 py-4'>
                  <GiMedicines size={80} className='fill-red-600' />
                  <div className='col-span-2'>
                    <p className='text-blue-900 font-bold text-lg font-Public'>100% Obat asli</p>
                    <p className='text-sm text-gray-700 font-Public'>Semua Produk yang kami jual dijamin asli dengan kualitas yang baik</p>
                  </div>
                </div>
              </div>
              <div className='w-full h-32 rounded-lg shadow-lg bg-gradient-to-t from-teal-50 to-white'>
                <div className='grid grid-cols-3 px-5 py-4'>
                  <GiNotebook size={80} className='fill-green-600' />
                  <div className='col-span-2'>
                    <p className='text-blue-900 font-bold text-lg font-Public'>Terjamin dan Hemat</p>
                    <p className='text-sm text-gray-700 font-Public'>Kami menjamin pengembalian uang dari selisih perbedaan harga</p>
                  </div>
                </div>
              </div>
              <div className='w-full h-32 rounded-lg shadow-lg bg-gradient-to-t from-teal-50 to-white'>
                <div className='grid grid-cols-3 px-5 py-4'>
                  <GiShipBow size={80} className='fill-gray-300' />
                  <div className='col-span-2'>
                    <p className='text-blue-900 font-bold text-lg font-Public'>Gratis Ongkir</p>
                    <p className='text-sm text-gray-700 font-Public'>Kami kirim pembelian anda secara gratis tanpa antri</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='hidden lg:block w-full bg-gray-100 my-8 h-40'>
            <div className='p-4'>
              <p className='text-center text-txt-500 text-base leading-[18.8px] font-bold font-Public'>Metode Pembayaran</p>
              <div className='container mx-auto px-20 mt-10'>
                <div className='flex justify-center '>
                  <img src={bca} className='h-7' alt='medcare.com' />
                  <img src={bri} className='h-7 px-10' alt='medcare.com' />
                  <img src={bni} className='h-7 px-10' alt='medcare.com' />
                  <img src={ovo} className='h-10 px-10' alt='medcare.com' />
                  <img src={gopay} className='h-7 px-10' alt='medcare.com' />
                  <img src={shoppe} className='h-7 px-10' alt='medcare.com' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default LandingPages