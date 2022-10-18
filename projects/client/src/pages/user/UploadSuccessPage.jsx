import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import confirm from '../../assets/confirm.png';
import LoadingComponent from "../../components/Loading";


const UploadSuccess = (props) => {

    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();

    const { username } = useSelector((state) => {
        return {
            username : state.userReducer.username
        }
    })

    return (
        <div className='container mx-auto py-5 h-screen'>
            <div className='flex flex-col items-center h-screen py-4'>
                <img src={confirm} className='max-w-xl' alt='successuploadprescription'/>
                <p className='font-bold text-4xl text-main-500 my-2'>Upload Prescription Success!</p>
                <p className='font-bold text-2xl text-main-600 my-2'>Your order will be confirmed by Admin soon.</p>
                <div className='w-1/2 my-2 flex justify-around'>
                    <button className='border-2 rounded-lg py-3 px-14 bg-white text-main-500 font-bold border-main-500 hover:bg-teal-50 focus:ring-2 focus:ring-main-500'
                    onClick={() => {
                        setLoading(true);
                        setTimeout(() => {
                            setLoading(false);
                            navigate('/', {replace: true})
                        }, 2000)
                    }}>Back to Homepage</button>
                    <button className='border-2 rounded-lg py-3 px-14 bg-main-500 text-white font-bold border-main-500 hover:bg-main-600 focus:ring-2 focus:ring-main-500'
                    onClick={() => {
                        setLoading(true);
                        setTimeout(() => {
                            setLoading(false);
                            navigate(`/transaction/${username}`, {replace: true})
                        }, 2000)
                    }}>Go To Order Progress</button>
                </div>
            </div>
            <LoadingComponent loading={loading} />
        </div>
    )
};

export default UploadSuccess;