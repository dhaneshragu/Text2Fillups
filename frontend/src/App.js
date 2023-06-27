import React, { useEffect, useState } from "react";
import Axios from "axios";
import Navbar from "./components/Navbar";
import Fillups from "./components/Fillups";
import CircularProgress from "@mui/material/CircularProgress";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ViewFillups from "./components/ViewFillups";

function App() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    Axios.get("http://127.0.0.1:8000/load-model")
      .then((res) => {
        console.log(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <BrowserRouter>
      <>
        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "40px",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
            }}
          >
            <CircularProgress size={70} />
            <h1>Loading...</h1>
          </div>
        ) : (
          <div style={{boxSizing:"border-box", margin:"0", padding:"0", height:"inherit", width:"inherit"}}>
          <Navbar></Navbar>
          <div style={{paddingLeft: "1rem", paddingRight:"1rem", margin:0,height:"100%",width:"100%"}}>
              <Routes>
                <Route exact path="/" element={<Fillups />} />
                <Route exact path = "/view" element = {<ViewFillups/>} />
              </Routes>

          </div>
          </div>
        )}
      </>
    </BrowserRouter>
  );
}

export default App;
