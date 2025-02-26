"use client";

import { useEffect, useState } from "react";

export default function User(){

    const [total,setTotal]= useState(0)
    //total -> hasil nya/yang tampil
    //set -> Pengatur
    //useState dari react
    //(0) default 

    const count= ()=>{
        setTotal(total+1)
    }

    useEffect(()=>{
        count()
    },[])
    
    //Onload = pertama kali di eksekusi
    //[] triger apa datanya harus direaload/represh
    return(

        
        <div className="p-6 bg-gray-100 min-h-screen text-black">
            <br />
            <br />
            <br />
            <h1>{total}</h1>
            <button onClick={count} className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
  Klik Saya
</button>

        </div>
    );
}