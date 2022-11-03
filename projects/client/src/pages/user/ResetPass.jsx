import React,{useState} from 'react'
import { BsEye,BsEyeSlash } from 'react-icons/bs';
import axios from 'axios'
import { API_URL } from '../../helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useParams, useNavigate} from 'react-router-dom'
import Loading from '../../components/Loading';
import { Helmet } from 'react-helmet';


const ResetPass = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [visible, setVisible]=useState('password')
  const [repeat, setrepeat]=useState('password')
  const [loading,setLoading]=useState(false)

  const[password, setPassword]=useState('')
  const[repeatPassword, setRepeatPassword]=useState('')


  const showPass = ()=>{
    if(visible=="password"){
        setVisible("text")
    }else if(visible=="text"){
        setVisible("password")
    }
}

const showNew = ()=>{
    if(repeat==="password"){
        setrepeat("text")
    }else if(repeat==="text"){
        setrepeat("password")
    }
}
console.log(params)

const onSubmit = async ()=>{
  setLoading(true)
  if(password === repeatPassword){
    axios.post(API_URL+`/api/user/reset-password`,{
      password:password
    },
    {
      headers:{
        'Authorization': `Bearer ${params.token}`
    }
    }).then((res)=>{
      setLoading(false)
      toast.success('Success', {
        theme: "colored",
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
    })
    navigate('/login')
    setPassword('')
    setRepeatPassword('')
    }).catch((err)=>{
      setLoading(false)
      toast.error(`${err}`, {
        theme: "colored",
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
    })
    })
  }else{
    setLoading(false)
    toast.error(`Cek repeat password`, {
      theme: "colored",
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
  })
  }
}

  return (
  <div>
    <Helmet>
      <title>Reset Password</title>
      <meta name="description" content="Reset password"/>
    </Helmet>
    <div className='container mx-auto px-96 mt-10 '>
      <label className=' block mb-3 '>
        <span className='block text-sm font-medium text-slate-700 mb-1 font-Public'>Password</span>
        <div className='relative'>
        <input type={visible} onChange={(e)=>setPassword(e.target.value)} name='password' className='border border-gray-400 w-full rounded-md px-2' />
          {
            visible === 'password' ?
            <BsEye className='absolute top-3 right-2' onClick={showPass} />
            :
            <BsEyeSlash className='absolute top-3 right-2' onClick={showPass} />
          }
        </div>
      </label>
      <label className='block mb-3'>
        <span className='block text-sm font-medium text-slate-700 mb-1 font-Public'>Repeat Password</span>
        <div className='relative'>
          <input type={repeat} onChange={(e)=>setRepeatPassword(e.target.value)} name='newPassword' className='border border-gray-400 w-full rounded-md px-2' />
            {
              repeat === 'password' ?
                <BsEye className='absolute top-3 right-2' onClick={showNew} />
              :
                <BsEyeSlash className='absolute top-3 right-2' onClick={showNew} />
            }
        </div>
      </label>
        <button className=' mt-5 border bg-teal-500 hover:bg-teal-700 rounded-md py-2 text-white px-10' onClick={onSubmit}>Save</button>
  </div>
  <ToastContainer />
  <div className='absolute top-1/3 right-[45%]'>
            <Loading loading={loading}/>
        </div>

</div>
  )
}

export default ResetPass