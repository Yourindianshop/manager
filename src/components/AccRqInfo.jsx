import React, { useContext, useEffect, useState } from "react";
import "../stylesheet/AccReqInfo.css";
import { MyContext } from "../App";
import { fetchreq, getDate, uploadImageAws } from "../Helper/fetch";
import { useNavigate } from "react-router-dom";
const url = process.env.REACT_APP_URL;
const request = {
  requestId: 1,
  customerName: "John Doe",
  customerEmail: "john.doe@example.com",
  productId: "ABC123",
  productName: "Air Buds",
  Description: "With number 1 quality and apple features we can introduce apple air buds",
  warehouseId: "Warehouse 1",
  requestTimestamp: "2023-08-25 10:00 AM",
  status: "Pending",
  proof: "Proof Link",
};

const AccRqInfo = () => {
  const [showimg,setShowImg]=useState(false);
  const [showimg2,setShowImg2]=useState(false);
  const {rd,mg,isLogin}=useContext(MyContext);
  const [isApr,setisApr]=useState(false);
  const [wdt,setWdt]=useState(null);
  const [run,setRun]=useState(false);
  const nav = useNavigate();
  const [cus,setCus]=useState(null);
  const [formData, setFormData] = useState({
    weight: '',
    height: 10,
    width: 10,
    length: 10,
    lockerNumber: '',
    image1: null,
    image2: null,
    image3: null,
  });
  

  // Generic handleChange function to update state
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    // If the input is a file input, set the state to the files
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const approve = async ()=>{
    const dt = await fetchreq("GET",`verifyPAR/${rd?.Rid}`);
    if(dt){
      setisApr(true);
    }
  }
  async function checkimg(a,b,c){
    const s1 = a?.size / 1024;
    const s2= b?.size / 1024;
    const s3 = c?.size / 1024;
    if(s1>1000){
      alert("Image 1 size Must be less than 1 MB");
      return true;
    }else if(s2>1000){
      alert("Image 2 size Must be less than 1 MB");
      return true;
    }else if(s3>1000){
      alert("Image 3 size Must be less than 1 MB");
      return true;
    }else{
      return false;
    }
  }
  const handleSumit = async (e)=>{
    e.preventDefault();
    if(await checkimg(formData.image1,formData.image2,formData.image3)){
      return;
    }else if(!run){
      setRun(true);
      const url1= await uploadImageAws(formData.image1.name,formData.image1);
      const url2= await uploadImageAws(formData.image2.name,formData.image2);
      const url3= await uploadImageAws(formData.image3.name,formData.image3);
      const photos=[url1,url2,url3];
      // const photos=["1.jpg","2.jpg","3.jpg"]
      const body = {
        Wid: mg.Wid,
        photos,
        height: formData.height,
        width: formData.width,
        length: formData.length,
        Weight: formData.weight,
        Cid: rd?.Cid,
        Rid: rd?.Rid,
        LokerId: formData.lockerNumber
      }
      const dt = await fetchreq("POST","addWareHouseData",body);
      console.log("DT",dt);
      if(dt){
        await fetchreq("GET",`submitPAR/${rd?.Rid}`);
        await fetchreq("POST",'addWdPayment',{Rid: rd?.Rid,note: `bill of Item ${rd?.productName}`});
        await fetchreq("POST","sendMail",{email: cus?.email,subject:"Acceptance Request",html:`<h2>Product Acceptance Request Accepted </h2><p> Your Product Request of Product ${rd?.productName} has been Accepted successfully</p>`});
        alert("data Upload Successfully");
        nav("/product-acceptance");
      }else{
        alert("something went wrong");
      }
      setRun(false);
    }else{
      alert("please Wait");
    }
    // {Wid,Height,Width,Length,Weight,Cid,Rid,photos}
  }
  // const reject = ()=>{
    
  // }
  const getdt = async ()=>{
    const dt = await fetchreq("GET",`getWareDataonReq/${rd?.Rid}`);
    dt?setWdt(dt.result[0]):setWdt(null);
  }
  const getCustomer = async ()=>{
    const dt2 = await fetchreq("GET",`getCustomerByRid/${rd?.Rid}`);
    dt2?setCus(dt2.result[0]):setCus(null);
  }
  
  useEffect(()=>{
    if(!isLogin){
      nav("/");
    }else{
      if(rd?.Verify==1){
        getdt();
      }else{
        getCustomer();
      }
    }
  },[])
  return (
    <div id="par-cont">
      <div id="par-info">
        <div>
          <div className="data-field">
            <div className="df-l">Request Id</div>
            <div className="df-r">{rd?.Rid}</div>
          </div>

          <div className="data-field">
            <div className="df-l">Customer Id</div>
            <div className="df-r">{rd?.email}</div>
          </div>

          <div className="data-field">
            <div className="df-l">Product Name</div>
            <div className="df-r">{rd?.productName}</div>
          </div>

          <div className="data-field">
            <div className="df-l">Product Description</div>
            <div className="df-r">{rd?.Description}</div>
          </div>

          <div className="data-field">
            <div className="df-l">Request Time</div>
            <div className="df-r">{getDate(rd?.time)}</div>
          </div>

          <div className="data-field">
            <div className="df-l">Status</div>
            <div className="df-r">
              {rd?.Verify == 0 ? "Pending" : "Approved"}
            </div>
          </div>

          <div className="data-field">
            <div className="df-l">Product Img</div>
            <div className="df-r df-np">
              <button
                onClick={() => setShowImg(!showimg)}
                className="btn btn-0"
              >
                {showimg ? "Hide " : "Show "}Product Image
              </button>
              {showimg && (
                <img className="btn btn-o" src={`${url}/${rd?.proof}`} />
              )}
            </div>
          </div>
          {!(rd?.Verify != 0 || isApr) && (
            <div className="btns">
              <div onClick={approve} className="btn btn-g">
                Approve
              </div>
              {/* <div onClick={reject} className="btn btn-r">
                Reject
              </div> */}
            </div>
          )}
        </div>
        {(rd?.Verify == 2 || isApr) && (
          <form onSubmit={handleSumit}>
            <div className="data-field df-o">
              <div className="df-l ">Weight</div>
              <div className="df-r df-np">
                <input
                  required
                  type="number"
                  name="weight"
                  placeholder="ex: 5kg"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* <div className="data-field df-o">
              <div className="df-l ">Product Dimensions</div>
              <div className="df-r df-np d-flex">
                <input
                  required
                  type="number"
                  name="height"
                  placeholder="Height : ex 15cm"
                  value={formData.height}
                  onChange={handleChange}
                />
                <input
                  required
                  type="number"
                  name="width"
                  placeholder="Width : ex 15cm"
                  value={formData.width}
                  onChange={handleChange}
                />
                <input
                  required
                  type="number"
                  name="length"
                  placeholder="Length : ex 15cm"
                  value={formData.length}
                  onChange={handleChange}
                />
              </div>
            </div> */}
            <div className="data-field df-o">
              <div className="df-l ">Locker Number</div>
              <div className="df-r df-np">
                <input
                  required
                  type="number"
                  name="lockerNumber"
                  placeholder="ex: 1245783"
                  value={formData.lockerNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="data-field df-o">
              <div className="df-l ">Product Images</div>
              <div className="df-r df-np d-flex">
                <input
                  required
                  className="btn btn-o"
                  type="file"
                  name="image1"
                  onChange={handleChange}
                />
                <input
                  required
                  className="btn btn-o"
                  type="file"
                  name="image2"
                  onChange={handleChange}
                />
                <input
                  required
                  className="btn btn-o"
                  type="file"
                  name="image3"
                  onChange={handleChange}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-g">
              {run ? "Submiting..." : "Submit"}
            </button>
          </form>
        )}
        {wdt && (
          <div>
            <div className="data-field">
              <div className="df-l">WarehouseData Id</div>
              <div className="df-r">{wdt.Did}</div>
            </div>

            <div className="data-field">
              <div className="df-l">Weight</div>
              <div className="df-r">{wdt.Weight}kg</div>
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
              <div className="df-l">Approved Time</div>
              <div className="df-r">{getDate(wdt.time)}</div>
            </div>

            <div className="data-field">
              <div className="df-l">Images</div>
              <div className="df-r df-np">
                <button
                  onClick={() => setShowImg2(!showimg2)}
                  className="btn btn-0"
                >
                  {showimg2 ? "Hide " : "Show "}Images
                </button>
                {showimg2 &&
                  (wdt.photos).map((pt) => {
                    return (
                      <img
                        key={pt}
                        className="btn btn-o"
                        src={`${url}/${pt}`}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccRqInfo;
