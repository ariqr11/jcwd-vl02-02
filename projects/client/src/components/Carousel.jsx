import React from 'react'
import {Carousel} from 'flowbite-react'

const CarouselComponent = () => {
  let dataImage = [
    {
      image: 'https://images.unsplash.com/photo-1576091358783-a212ec293ff3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1025&q=80',
      text: "Meet your health needs",
      position:'bg-top'
    },
    {
      image: 'https://images.unsplash.com/photo-1577368211130-4bbd0181ddf0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
      text: "Trusted by registering us with BPOM",
      position:'bg-center'
    },
    {
      image: 'https://images.unsplash.com/photo-1584988299603-3ab9216625bf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80',
      text: "Give us your recipe and we will provide it",
      position:'bg-center'
    },
  ]
  return (
        <div className="h-40 lg:h-80 lg:px-0 lg:w-full mx-auto my-3">
          <Carousel>
            {
              dataImage.map(data=>(
                <div 
                key={data.text}
                >
                  <div className='grid grid-cols-7 h-[500px]'>
                    <div className='col-span-2'>
                      <div className='bg-[#92C3D1] w-full h-full'>
                        <h1 className='text-xs backdrop-blur-sm lg:text-2xl font-semibold text-[#213360] py-56 mx-4 font-Public'> {data.text} </h1>
                      </div>
                    </div>
                    <div className='col-span-5'>
                      <div
                        className={`w-full h-full grayscale-[20%] ${data.position}`}
                        style={{
                          backgroundImage: `url(${data.image})`
                        }} 
                      />
                    </div>
                  </div>
                </div>
              ))
            }
          </Carousel>
        </div>
  )
}

export default CarouselComponent