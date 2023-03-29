import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import ReactGA from "react-ga";

function App() {
  const [title, setTitle] = useState("");
  const [descriptions, setDescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    console.log(process.env.REACT_APP_API_KEY);
    if (!window.location.href.includes("localhost")) {
      ReactGA.initialize("G-KGGXEYE84V");

      ReactGA.pageview(window.location.pathname + window.location.search);
    }
    console.log(window.location.pathname);
    console.log(window.location.search);
    console.log(window.location);
    setInitialized(true);
  }, []);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const APIBODY = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "user", content: "Write Product Description for " + title },
    ],
    //prompt: "Write Product Description for " + title,
    max_tokens: 150,
    top_p: 1.0,
    // frequency_penalty: 0.0,
    // presence_penalty: 0.0,
  };

  async function handleClick() {
    setLoading(true);
    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(APIBODY),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const strRes = data.choices[0].message.content.trim();

        setDescriptions((current) => [...current, strRes]);

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }
  return (
    <div>
      <Navbar fixed="top" bg="#0A2647" style={{ backgroundColor: "#0A2647" }}>
        <Container>
          <Navbar.Brand href="#home">
            <h1
              style={{
                fontFamily: "Josefin Sans , sans-serif",
                color: "#fff",
              }}
            >
              DescriptoAI
            </h1>
          </Navbar.Brand>
        </Container>
      </Navbar>

      <div
        className=" col-11 col-md-8 mx-auto "
        //style={{ position: "relative", height: "60vh" }}
        style={{ marginTop: "20vh" }}
      >
        <div
          className="col-12 mx-auto text-center "
          // style={{
          //   position: "absolute",
          //   height: "100%",
          //   marginTop: "-50px",
          //   top: " 50%",
          // }}
        >
          <h1
            style={{
              fontFamily: "Josefin Sans , sans-serif",
              color: "#fff",
              fontSize: "3em",
              marginBottom: "30px",
            }}
          >
            Generate Accurate{" "}
            <span
              className="text-warning"
              style={{ fontFamily: "Josefin Sans , sans-serif" }}
            >
              Product Descriptions
            </span>
            .
          </h1>
          <Form.Control
            className="mt-3"
            type="text"
            size="lg"
            placeholder="Type descriptive Product Title to get best Product Description."
            onChange={(e) => {
              setTitle(e.target.value);
              setDescriptions([]);
            }}
          />
          <div style={{ alignContent: "center" }}>
            <Button
              onClick={handleClick}
              variant="light"
              className="mt-5 text-dark "
            >
              Generate
            </Button>
          </div>
        </div>
      </div>

      {descriptions &&
        descriptions.map((d, i) => (
          <Card
            className="col-11 col-md-6 mx-auto shadow-lg mt-4"
            style={{
              border: "5px solid #EBB02D",
              borderStyle: "dashed",
            }}
            key={i}
          >
            <div style={{ height: "30vh", overflowY: "auto" }}>
              <Card.Body>
                <h5 style={{ fontFamily: "Josefin Sans , sans-serif" }}>{d}</h5>
              </Card.Body>
            </div>
            <p
              onClick={() => {
                navigator.clipboard.writeText(d);
              }}
              className="text-center text-primary"
              style={{ cursor: "pointer" }}
            >
              Copy Text
            </p>
          </Card>
        ))}
      {loading && (
        <div className="text-center m-4">
          <Spinner animation="grow" variant="warning" />
        </div>
      )}
      {descriptions.length > 0 && (
        <p
          onClick={handleClick}
          className="mt-4 text-warning text-center mb-5"
          style={{ cursor: "pointer" }}
        >
          One More ?
        </p>
      )}
      <div>
        <br />
      </div>
      <div
        className="text-center"
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          backgroundColor: "#0A2647",
        }}
      >
        <p
          className="pt-2"
          style={{ fontFamily: "Josefin Sans , sans-serif", color: "#fff" }}
        >
          ©2023{" "}
          <a
            href="https://www.linkedin.com/in/khush-ag/"
            target="_blank"
            style={{ fontFamily: "Josefin Sans , sans-serif", color: "#fff" }}
          >
            Khush R Agrawal
          </a>{" "}
          .
        </p>
      </div>
    </div>
  );
}

export default App;
