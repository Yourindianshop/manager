import React, { useContext, useEffect, useRef, useState } from 'react'
import { deleteallphoto, fetchreq, getDate } from '../Helper/fetch';
import { MyContext } from '../App';
import { useReactToPrint } from "react-to-print";

function PacketesTable() {
    const {mg}=useContext(MyContext)
    const [pkts,setPkts]=useState(null);
    const loadpkts = async ()=>{
        const dt  = await fetchreq("GET",`getpkts/${mg?.Wid}`,{});
        dt? setPkts(dt.result): setPkts([]);
        
    }
    const dispach = async (p)=>{
        if(await window.confirm(`Confirm  PacketId  ${p} is Dispached? `)){
            const dt = await fetchreq("GET",`dispatchPacket/${p}`,{});
            const dt2 = await fetchreq("GET",`SetDispatchInDispachReq/${p}`,{});
            const dt3 = await fetchreq("GET",`updateWdstatusOnPid/${p}/3`,{});
            await deleteallphoto(p);
            if(dt && dt2 && dt3){
                let tmp = pkts;
                tmp.forEach(el => {
                    if(el.Pid==p){
                        el.status=1;
                    }
                });
                setPkts(null);
                setTimeout(() => {
                    setPkts(tmp);
                }, 500);
                alert("Dispatch Successfully...");
            }else{
                alert("Not Dispached");
            }
        }else{
            alert("Dispatch Canceled...");
        }
    }
    const componentRef = useRef();
    const printDocument = useReactToPrint({
        content: () => componentRef.current,
    });
    const [doc,setDoc]=useState(null);
    const print = async (pk)=>{
        setDoc(pk);
        setTimeout(() => {
            printDocument();
            setDoc(null);
        }, 500);
    }
    useEffect(()=>{
        loadpkts();
    },[])
    
  return (
    <div>PacketesTable
        {doc &&  <div ref={componentRef} style={{padding:"2",margin:"30px",borderRadius:"8px",fontSize:'1.2rem',border:'2px solid cyan',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                <h2>YourIndianShop</h2> <hr style={{color:'cyan'}}/><br /> 
                <p>PacketId: {doc?.Pid}</p>
                <p>ShipmentId: {doc?.Sid}</p>
                <p>Time: {getDate(doc?.time)}</p>
                <p>Time: {getDate(doc?.time)}</p>
                <p>Dimensions (Cm): {doc?.height}*{doc?.width}*{doc?.length} CM</p>
                <p>Wight: {doc?.wight} Kg</p>
                <p>Payment: ₹{doc?.payment}</p>
                <p>Curior Service Provider: DHL</p>
        </div> }
        {pkts && pkts.map((pk)=>(<div style={{margin:'50px'}}>
            <h3>PacketId: {pk.Pid}</h3>
            <p>ShipmentId: {pk.Sid} </p>
            <p>CustomerId: {pk.email}</p>
            <p>time: {getDate(pk.time)}</p>
            <p>Payment: ${pk.payment}</p>
            <p>Payment Status: {pk.Sp?"Done":"Pending"}</p>
            {pk.Sp && <p>Service Provider: {pk.Sp}</p>}
            <p>length: {pk.length} Cm</p>
            <p>Width: {pk.width} Cm</p>
            <p>Height: {pk.height} Cm</p>
            <p>Weight: {pk.wight} Kg</p>
            <p>Dispach Status: {pk.status?"Dispached": ( pk.Sp? "Not Dispached":"Curior Not selected By Customer")}</p>
            {!pk.status && pk.Sp && <button className='btn btn-o' style={{width:"200px"}} onClick={()=>{dispach(pk.Pid)}}>Dispach</button>}
            {pk.status==1 && <button className='btn btn-o' style={{width:"200px"}} onClick={()=>{print(pk)}}>Print</button>}
        </div>))}
        {!pkts && <p>Loading...</p> }
    </div>
  )
}

export default PacketesTable;