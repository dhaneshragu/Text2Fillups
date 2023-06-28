import { React, useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import { Grid, Chip, Container, Alert, Snackbar } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined";
import QuestionMarkOutlinedIcon from "@mui/icons-material/QuestionMarkOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LinkIcon from "@mui/icons-material/Link";
import Axios from "axios";
import { useLocation } from "react-router-dom";

export default function ViewFillups() {
  const [revealedAnswers, setRevealedAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recLink, setrecLink] = useState(false);
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(false);
  const location = useLocation();
  const URLParams = new URLSearchParams(location.search);
  let data = [];
  data = URLParams.get("data");
  if (data) {
    data = decodeURIComponent(data);
    data = JSON.parse(data);
    data = data.data;
    data = data.data;
    console.log(data);
  }
  const handleToggleAnswer = (index) => {
    if (revealedAnswers.includes(index)) {
      setRevealedAnswers(revealedAnswers.filter((item) => item !== index));
    } else {
      setRevealedAnswers([...revealedAnswers, index]);
    }
  };

  const handleCopy = () => {
    setToast(true);
    navigator.clipboard.writeText(link);
    setCopied(true);
  };

  const handleLinkGenerate = () => {
    setLoading(true);
    Axios.post("http://localhost:5005/create-form", {
      data: data,
    })
      .then((res) => {
        console.log(res.data);
        setLoading(false);
        setrecLink(true);
        setLink(res.data["link"]);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        setrecLink(false);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "inherit",
        height: "inherit",
      }}
    >
      <Snackbar
        open={toast}
        autoHideDuration={1200}
        onClose={() => {
          setToast(false);
        }}
      >
        <Alert
          open={toast}
          onClose={() => {
            setToast(false);
          }}
          severity="info"
          sx={{ width: "100%", backgroundColor: "#1f8ba6" }}
        >
          Link copied to Clipboard!
        </Alert>
      </Snackbar>

      {data.length ? (
        <>
          {recLink ? (
            <Chip
              label={link}
              sx={{
                p: 2,
                pr: 1,
                pl: 1,
                alignSelf: "center",
                mt: "20px",
                backdropFilter: "blur(8px) saturate(128%)",
                WebkitBackdropFilter: "blur(8px) saturate(128%)",
                backgroundColor: "rgba(0, 0, 0, 0.76)",
              }}
              deleteIcon={
                !copied ? (
                  <ContentCopyIcon sx={{ width: "16px" }} />
                ) : (
                  <CheckCircleOutlineIcon sx={{ width: "17px" }} />
                )
              }
              onDelete={handleCopy}
            />
          ) : (
            <Button
              variant="contained"
              sx={{
                backdropFilter: "blur(8px) saturate(128%)",
                WebkitBackdropFilter: "blur(8px) saturate(128%)",
                backgroundColor: "rgba(0, 0, 0, 0.76)",
                alignSelf: "center",
                marginTop: "20px",
                borderRadius: "50px",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
                "&.Mui-disabled": {
                  backdropFilter: "blur(8px) saturate(128%)",
                  WebkitBackdropFilter: "blur(8px) saturate(128%)",
                  backgroundColor: "rgba(64, 60, 60, 0.6);",
                  color: "white",
                  alignSelf: "center",
                  marginTop: "20px",
                  borderRadius: "50px",
                },
              }}
              onClick={handleLinkGenerate}
              disabled={loading}
              endIcon={
                loading ? (
                  <CircularProgress size={16} />
                ) : (
                  <LinkIcon size={20} sx={{ color: "white" }} />
                )
              }
            >
              {loading ? "Link on the way" : "Create Google Quiz Link"}
            </Button>
          )}

          <Grid
            container
            spacing={4}
            sx={{ mt: 0, pt: 0, mb: "2rem", pl: "20px", pr: "20px" }}
          >
            {data.map((item, index) => (
              <Grid item key={index} xs={12} md={6} lg={4}>
                <Card
                  key={index}
                  sx={{
                    backdropFilter: "blur(18px) saturate(95%)",
                    WebkitBackdropFilter: "blur(18px) saturate(95%)",
                    backgroundColor: "rgba(0, 0, 0, 0.27)",
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.125)",
                    marginBottom: "10px",
                    transition: "transform 0.4s ease-in",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                  raised
                >
                  <CardContent sx={{ pb: "8px" }}>
                    <Chip
                      icon={<QuestionMarkOutlinedIcon sx={{ width: 15 }} />}
                      label={item.question}
                      sx={{
                        backdropFilter: "blur(18px) saturate(200%)",
                        WebkitBackdropFilter: "blur(18px) saturate(200%)",
                        backgroundColor: "rgba(255, 255, 255, 0.14)",
                        height: "auto",
                        p: "5px",
                        "& .MuiChip-label": {
                          display: "block",
                          whiteSpace: "normal",
                        },
                      }}
                    ></Chip>
                  </CardContent>
                  <CardActions sx={{ pl: 0 }}>
                    {revealedAnswers.includes(index) ? (
                      <>
                        <CardContent sx={{ pb: "8px", pt: 0, ml: 0, mr: 0 }}>
                          <Chip
                            icon={
                              <EmojiObjectsOutlinedIcon sx={{ width: 17 }} />
                            }
                            label={item.answer}
                            sx={{
                              backdropFilter: "blur(18px) saturate(200%)",
                              WebkitBackdropFilter: "blur(18px) saturate(200%)",
                              backgroundColor: "rgba(255, 255, 255, 0.14)",
                              height: "auto",
                              p: "5px",
                              "& .MuiChip-label": {
                                display: "block",
                                whiteSpace: "normal",
                              },
                            }}
                          ></Chip>
                        </CardContent>
                        <IconButton
                          onClick={() => handleToggleAnswer(index)}
                          sx={{ marginLeft: "auto" }}
                        >
                          <VisibilityOff />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton
                        onClick={() => handleToggleAnswer(index)}
                        sx={{ marginLeft: "auto" }}
                      >
                        <Visibility />
                      </IconButton>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Container sx={{ mt: "11%" }}>
          <h1
            style={{
              textAlign: "center",
              backdropFilter: "blur(18px) saturate(120%)",
              WebkitBackdropFilter: "blur(18px) saturate(120%)",
              backgroundColor: "rgba(255, 255, 255, 0.09)",
              padding: "1rem",
              borderRadius: "20px",
              fontWeight: 550,
            }}
          >
            Uh-oh 🙊✨! <br></br> Our AI friend seems to have misplaced its
            spectacles and couldn't locate any questions.<br></br> Let's give it
            another shot with different text, shall we? 🤔✨
          </h1>
        </Container>
      )}
    </div>
  );
}
