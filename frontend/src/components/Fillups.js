import React, { useState } from "react";
import {
  Container,
  TextField,
  Alert,
  Snackbar,
  Button,
  Slider,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import Axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Fillups() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [limit, setLimit] = useState(5);
  const [toast, setToast] = useState(false);
  const [errToast, seterrToast] = useState(false);
  const [data, setData] = useState([]);

  const handleGenerate = () => {
    setLoading(true);
    try {
      if (text === "") {
        throw new Error("Text Cant be empty!");
      }
      Axios.post("http://localhost:5000/get-fillups", {
        input: text,
        limit: limit,
      })
        .then((res) => {
          console.log(res);
          setLoading(false);
          setToast(true);
          const data = encodeURIComponent(JSON.stringify(res));
          setData(data);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } catch (error) {
      console.log("Error:", error);
      setLoading(false);
      seterrToast(true);
    }
  };

  return (
    <div style={{width:"inherit", height:"inherit"}}>
      <Snackbar
        open={toast}
        autoHideDuration={1800}
        onClose={() => {
          setToast(false);
          navigate(`/view?data=${data}`, { replace: true });
        }}
      >
        <Alert
          open={toast}
          onClose={() => {
            setToast(false);
            navigate(`/view?data=${data}`, { replace: true });
          }}
          severity="success"
          sx={{ width: "100%" , backgroundColor:'green'}}
        >
          Successfully Generated!🎉
        </Alert>
      </Snackbar>

      <Snackbar
        open={errToast}
        autoHideDuration={2000}
        onClose={() => seterrToast(false)}
      >
        <Alert
          open={errToast}
          onClose={() => seterrToast(false)}
          severity="error"
          sx={{ width: "100%", backgroundColor:'red' }}
        >
          Uh-oh, text can't be empty!💬
        </Alert>
      </Snackbar>

      <div
        style={{ display: "flex", flexDirection: "column", marginTop:"2rem"}}
      >
        <Box sx={{ minWidth: "50%", alignSelf: "center" }}>
          <Typography id="limit-slider" gutterBottom marginBottom={0} sx={{fontWeight:550}}>
            Max Questions :
          </Typography>
          <Slider
            aria-label="Question"
            defaultValue={5}
            valueLabelDisplay="auto"
            onChange={(e, val) => setLimit(val)}
            step={1}
            min={1}
            max={15}
            sx={{
              "& .MuiSlider-thumb": {
                height: 15,
                width: 15,
                "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
                  boxShadow: "inherit",
                },
                "&:before": {
                  display: "none",
                },
              },
              "& .MuiSlider-valueLabel": {
                
                fontSize: 10,
                background: "unset",
                padding: 0,
                width: 24,
                height: 24,
                top: 49,
                borderRadius: "50% 0 50% 50%",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                transformOrigin: "bottom left",
                transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
                "&:before": { display: "none" },
                "&.MuiSlider-valueLabelOpen": {
                  transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
                },
                "& > *": {
                  transform: "rotate(45deg)",
                },
              },
            }}
          />
        </Box>
        <TextField
          label="Enter the text"
          onChange={(e) => setText(e.target.value)}
          multiline
          
          InputLabelProps={{
            sx: {
              color: 'white',
              '&.Mui-focused':{
                color:'white',
                marginBottom:1,
                fontSize:'1rem',
              }
            },
          
          }}
          inputProps={{
            sx: {
              color: 'white',
            },
          }}
          InputProps={{
            sx: {
              border:'unset',
              '&:hover fieldset': {
                border: 'unset',
              },
              '&:focus-within fieldset, &:focus-visible fieldset': {
                border: '1.2px dashed white !important',
              },
            },
          }}
          sx={{
            alignSelf: "center",
            boxShadow: 1,
            borderRadius: 2,
            minWidth: "50%",
            justifySelf: "center",
            marginTop: "25px",
            marginBottom: "10px",
            backdropFilter: 'blur(18px) saturate(93%)',
            WebkitBackdropFilter: 'blur(18px) saturate(93%)',
            backgroundColor: 'rgba(187, 162, 162, 0.2)',
          }}
          minRows={5}
        ></TextField>
        <Button
          variant="contained"
          sx={{
            backdropFilter: 'blur(8px) saturate(128%)',
            WebkitBackdropFilter: 'blur(8px) saturate(128%)',
            backgroundColor: 'rgba(0, 0, 0, 0.76)',
            alignSelf: "center",
            marginTop: "15px",
            marginBottom: "10px",
            borderRadius: "50px",
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            '&.Mui-disabled': {
            backdropFilter: 'blur(8px) saturate(128%)',
            WebkitBackdropFilter: 'blur(8px) saturate(128%)',
            backgroundColor: 'rgba(64, 60, 60, 0.6);',
            color:'white',
            alignSelf: "center",
            marginTop: "15px",
            marginBottom: "10px",
            borderRadius: "50px",
              
            },
          }}
          onClick={handleGenerate}
          disabled={loading}
          endIcon={loading ? <CircularProgress size={16} /> : ""}
        >
          {loading ? "GENERATING" : "GENERATE"}
        </Button>
      </div>
    </div>
  );
}
