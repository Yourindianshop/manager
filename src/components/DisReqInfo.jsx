import React, { useContext, useEffect, useState } from "react";
import "../stylesheet/AccReqInfo.css";
import { MyContext } from "../App";
import { fetchreq, getDate, uploadImageAws } from "../Helper/fetch";
import { useNavigate } from "react-router-dom";
const url = process.env.REACT_APP_URL;
const DisRqInfo = () => {
  const [showimg,setShowImg]=useState(false);
  const [showimg2,setShowImg2]=useState(false);
  const {dr,mg,isLogin}=useContext(MyContext);
  const [isApr,setisApr]=useState(false);
  const [wdt,setWdt]=useState(null);
  const [run,setRun]=useState(false);
  const nav = useNavigate();
  const [pktcnt,setPktCnt]=useState(1);
  const [pkt,setPkt]=useState([]);
  const rd = dr;
  const [len,setLen]=useState(null);
  const [hig,setHig]=useState(null)
  const [wid,setWid]=useState(null)
  const [wie,setWie]=useState(null)
  const [cus,setCus]=useState(null);

  // Generic handleChange function to update state
  
  const approve = async ()=>{
    //cid,wid,sid,lengh,width,hight,price of contry
    const findprice = await fetchreq("GET",`getPriceCountry/${rd?.Country}`,{});
    const cwid = await fetchreq("GET",`getCusWhUsingSid/${rd?.Sid}`,{})
    if(findprice && cwid){
        // console.log(findprice,cwid);
        const price = findprice?.result[0].Price;
        const volumetricWeight = (wdt.length * wdt.height * wdt.width) / 5000;
        const payment = Math.max(wdt.Weight, volumetricWeight) * price;
        const wid= cwid?.result[0]?.Wid;
        const cid = cwid?.result[0]?.Cid;
        const sid =rd?.Sid;
        // addPacket
        // const {sid,cid,wid,length,width,height,wight}=req.body;
        const rs = await fetchreq("POST","addPacket",{sid,cid,wid,length:wdt.length,width:wdt.width,height:wdt.height,wight:wdt.Weight,payment});
        await fetchreq("GET",`Dispatch/${rd?.Sid}`);
        await fetchreq("POST","sendMail",{email: cus?.email,subject:"Dispatch Request",html:`<h2>Dispatch Request Start Proceeding </h2><p> Your Dispatch Request has been Packed please Check on Portal and Proceed Further</p> <a href='https://yourindianshop.com'>yourindianshop.com</a>`});
        nav("/dispatch-req");
        // console.log(rs);
    }
    // 
  }
  const approve2= async ()=>{
    const findprice = await fetchreq("GET",`getPriceCountry/${rd?.Country}`,{});
    const cwid = await fetchreq("GET",`getCusWhUsingSid/${rd?.Sid}`,{})
    if(findprice && cwid){
        // console.log(findprice,cwid);
        const price = findprice?.result[0].Price;
        let pkts = pkt;
        const wid= cwid?.result[0]?.Wid;
        const cid = cwid?.result[0]?.Cid;
        const sid =rd?.Sid;
        pkts.forEach(el => {
            let tmp = (el[0]*el[1]*el[2])/5000;
            el.push(Math.max(tmp,el[3])*price);
        });
        const sendtoForm = JSON.stringify(pkts);
        
        const rs = await fetchreq("POST","addMulPacket",{sid,cid,wid,dt:sendtoForm});
        await fetchreq("GET",`Dispatch/${rd?.Sid}`);
        await fetchreq("POST","sendMail",{email: cus?.email,subject:"Dispatch Request",html:`<h2>Dispatch Request Start Proceeding </h2><p> Your Dispatch Request has been Packed please Check on Portal and Proceed Further</p> <a href='https://yourindianshop.com'>yourindianshop.com</a>`});
        nav("/dispatch-req");
    }
  }
  const getdt = async ()=>{
    const dt = await fetchreq("GET",`getDispachRelData/${rd?.Did}`);
    dt?setWdt(dt.result[0]):setWdt(null);
  }
  const addpkt = async (e)=>{
    e.preventDefault();
    const dt = [len,hig,wid,wie];
    let tmp = pkt;
    tmp.push(dt);
    setPkt(tmp);
    setPktCnt(pktcnt+1);
    setWid(null);
    setHig(null);
    setWie(null);
    setLen(null);
    document.getElementById("frm").reset();
  }
  const getCustomer=async (e)=>{
    const dt2 = await fetchreq("GET",`getCustomerBySid/${rd?.Sid}`);
    dt2?setCus(dt2.result[0]):setCus(null);
  }
  useEffect(()=>{
    if(!isLogin){
        nav("/");
    }else{
        !rd?.isMul && getdt();
        getCustomer();
    }
  },[])
  return (
    <div id="par-cont">
      {  <div id="par-info">
        <div>
            <p style={{color:'white'}}>Dispatch Info</p>
            <div>
                <div className="data-field">
                    <div className="df-l">Request Id</div>
                    <div className="df-r">{rd?.Sid}</div>
                </div>
                <div className="data-field">
                    <div className="df-l">Address Line 1</div>
                    <div className="df-r">{rd?.Address}</div>
                </div>
                <div className="data-field">
                    <div className="df-l">Address Line 2</div>
                    <div className="df-r">{rd?.Address2}</div>
                </div>
                <div className="data-field">
                    <div className="df-l">City</div>
                    <div className="df-r">{rd?.City}</div>
                </div>
                <div className="data-field">
                    <div className="df-l">State</div>
                    <div className="df-r">{rd?.State}</div>
                </div>
                <div className="data-field">
                    <div className="df-l">Country</div>
                    <div className="df-r">{rd?.Country}</div>
                </div>
                <div className="data-field">
                    <div className="df-l">Pincode</div>
                    <div className="df-r">{rd?.pincode}</div>
                </div>
                <div className="data-field">
                    <div className="df-l">Email</div>
                    <div className="df-r">{rd?.Email}</div>
                </div>
                <div className="data-field">
                    <div className="df-l">phoneNo</div>
                    <div className="df-r">{rd?.phoneNo}</div>
                </div>
                <div className="data-field">
                    <div className="df-l">Delivery Instruction</div>
                    <div className="df-r">{rd?.Dinstruct}</div>
                </div>
                <div className="data-field">
                    <div className="df-l">Request Time</div>
                    <div className="df-r">{getDate(rd?.Time)}</div>
                </div>

                <div className="data-field">
                    <div className="df-l">Status</div>
                    <div className="df-r">{rd?.Status==0?"Pending":"Seen"}</div>
                </div>

                {rd?.isMul && <div className="data-field">
                    <div className="df-l">Product Id</div>
                    <div className="df-r">{rd?.isMul.slice(1,-1)}</div>
                </div>}
            </div>
            {!rd.isMul && wdt &&<>
            <p style={{color:'white'}}>Product Info</p>
                <div className="data-field">
                    <div className="df-l">Product Id</div>
                    <div className="df-r">{rd?.Did}</div>
                </div>
                <div className="data-field">
                    <div className="df-l">Loker Id</div>
                    <div className="df-r">{wdt.LokerId}</div>
                </div>
                <div className="data-field">
                    <div className="df-l">Product Name</div>
                    <div className="df-r">{wdt.productName}</div>
                </div>
                <div className="data-field">
                    <div className="df-l">Product Description</div>
                    <div className="df-r">{wdt.Description}</div>
                </div>
                <div className="data-field">
                    <div className="df-l">Height</div>
                    <div className="df-r">{wdt.height}cm</div>
                </div>
                <div className="data-field">
                    <div className="df-l">Width</div>
                    <div className="df-r">{wdt.width}cm</div>
                </div>
                <div className="data-field">
                    <div className="df-l">Length</div>
                    <div className="df-r">{wdt.length}cm</div>
                </div>
                <div className="data-field">
                    <div className="df-l">Weight</div>
                    <div className="df-r">{wdt.Weight}kg</div>
                </div>
                <div className="data-field">
                    <div className="df-l">Recive time</div>
                    <div className="df-r">{getDate(wdt.time)}</div>
                </div>
                <div className="data-field">
                    <div className="df-l">Images</div>
                    <div className="df-r df-np">
                        <button onClick={()=>setShowImg2(!showimg2)} className="btn btn-0">{showimg2?"Hide ":"Show "}Images</button>
                    {showimg2 && wdt.photos.map((pt)=>{
                        return <img key={pt}
                        className="btn btn-o"
                        src={`${url}/${pt}`}
                    />
                    })}
                </div>
        </div>
            </> }
            {wdt &&<>
            <p style={{color:'white'}}>Customer Info</p>
                <div className="data-field">
                    <div className="df-l"> CustomerId</div>
                    <div className="df-r">{wdt.email}</div>
                </div>
                <div className="data-field">
                    <div className="df-l"> Name</div>
                    <div className="df-r">{wdt.Name}</div>
                </div>
                <div className="data-field">
                    <div className="df-l">phone Number</div>
                    <div className="df-r">{wdt.phoneNo}</div>
                </div>
                
            </> }
            {/* {!(rd?.Status!=0 || isApr) && wdt && <div className="btns">
                <div onClick={approve}  className="btn btn-g">{run?"please Wait":"Make Packet"}</div>
            </div>} */}
        </div>
      </div>}
      { rd.Status==0 && <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',color:'white'}}>
        <form id="frm" onSubmit={addpkt} >
            <h3 style={{color:'white'}}>Packet {pktcnt}</h3>
            <input value={hig} onChange={(e)=>setHig(e.target.value)} required type="number" min={0} step={1} placeholder="Enter Height in Cm"/><br />
            <input value={wid} onChange={(e)=>setWid(e.target.value)} required type="number" min={0} step={1} placeholder="Enter Width in Cm" /><br />
            <input value={len} onChange={(e)=>setLen(e.target.value)} required type="number" min={0} step={1} placeholder="Enter Lenght in Cm" /><br />
            <input value={wie} onChange={(e)=>setWie(e.target.value)} required type="number" min={0}  placeholder="Enter Weight in kg" /><br />
            <button className="btn btn-o">Add Packet {pktcnt}</button> <br /><br />
        </form>
        <h3>Added Packets</h3>
        {pkt.map((inp,ind)=>{
            return <div key={ind} style={{color:'wheat'}}>
                <h3>packet: {ind+1}</h3>
                <p>Length: {inp[0]}</p>
                <p>height: {inp[1]}</p>
                <p>Width: {inp[2]}</p>
                <p>Weight: {inp[3]}</p>
            </div>
        })}
        <br />
        {pkt.length!=0 && <button className="btn-o btn" onClick={approve2} >Confirtm And Save packets</button>}
    </div> }
    </div>
  );
};

export default DisRqInfo;
