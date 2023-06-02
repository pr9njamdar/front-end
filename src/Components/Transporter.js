import React, { useEffect, useState } from "react";
import "./Transporter.css"; // Import the CSS file
import axios from "axios";
const Transporter = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [input1, setInput1] = useState("");
  const [search, setSearch] = useState("");
  const [Orders, setOrders] = useState([]);
  const [SearchOrders, setSearchOrders] = useState([]);
  useEffect(() => {
    if (localStorage.getItem("CompanyName")) {
      getOrders();
    } else {
      window.location = "/";
    }
  }, []);

  const getOrders = () => {
    axios({
      method: "get",
      url: "http://localhost:5000/GetOrders",
      params: { CompanyName: localStorage.getItem("CompanyName") },
    }).then((res) => {
      setOrders(() => res.data);
      setSearchOrders(() => []);
    });
  };
  const handleOrderClick = (orderId) => {
    setSelectedOrder(orderId);

    axios({
      method: "get",
      url: "http://localhost:5000/GetOrders/Id",
      params: {
        CompanyName: localStorage.getItem("CompanyName"),
        OrderID: orderId,
        GetPrice: "No",
      },
    }).then((res) => {
      console.log(res.data);
      document.getElementById(
        "Manufacturer"
      ).innerText = `Manufacturer : ${res.data.Manufacturer}`;
      document.getElementById("To").innerText = `To : ${res.data.To}`;
      document.getElementById("From").innerHTML = `From : ${res.data.From}`;
      document.getElementById(
        "Quantity"
      ).innerText = `Quantity : ${res.data.Quantity}`;
      document.getElementById(
        "Address"
      ).innerText = `Adress : ${res.data.Address}`;

      if (res.data.Price) {
        document.getElementById(
          "Price"
        ).innerText = `Price : ${res.data.Price}`;
        document.getElementById(
          "Confirmation"
        ).innerText = `Confirmation Status : ${
          res.data.Confirmation === true
            ? "Confirmed"
            : res.data.Confirmation === false
            ? "Rejected"
            : "No Reply yet"
        }`;
        document.getElementsByTagName("form")[0].style.display = "none";
      }
    });

    setInput1("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    axios({
      method: "post",
      url: "http://localhost:5000/Deal",
      data: {
        OrderID: selectedOrder,
        Price: input1,
        Confirmation:'Not yet'
      },
      params: {
        Manufacturer: document
          .getElementById("Manufacturer")
          .innerText.slice(15),
      },
    });

    // Reset values
    setSelectedOrder(null);
    setInput1("");
  };

  const handleClose = () => {
    setSelectedOrder(null);
    setInput1("");
  };
  useEffect(() => {
    if (search) {
      axios({
        method: "get",
        url: "http://localhost:5000/Search/Order",
        params: {
          OrderID: search,
          CompanyName: localStorage.getItem("CompanyName"),
        },
      }).then((res) => {
        if (res.data !== "OrderNotFound") {
          console.log(res.data);
          setSearchOrders(() => res.data);
        }
      });
    } else {
      getOrders();
    }
  }, [search]);

  return (
    <div className={`Transportcontainer ${selectedOrder ? "active" : ""}`}>
      <div className="search">
        <input
          className="input-field"
          value={search}
          onChange={(e) => setSearch(() => e.target.value)}
          placeholder="Serach for order..."
          type="text"
        />{" "}
        <button className="submit-button">Go</button>{" "}
      </div>
      <div className="listboxContainer">
        <h1>Order List</h1>
        <div className="listbox">
          <ul>
            {Orders && search === ""
              ? Orders.map((Order, i) => {
                  return (
                    <li key={i} onClick={() => handleOrderClick(Order.OrderID)}>
                      {Order.OrderID}
                    </li>
                  );
                })
              : SearchOrders
              ? SearchOrders.map((Order) => {
                  return (
                    <li key={Order} onClick={() => handleOrderClick(Order)}>
                      {Order}
                    </li>
                  );
                })
              : ""}
          </ul>
        </div>
      </div>

      {selectedOrder && (
        <div className="popup1">
          <button className="close-button" onClick={handleClose}>
            X
          </button>

          <h2>Order ID: {selectedOrder}</h2>
          <h3 id="Manufacturer"></h3>
          <h4 id="To"></h4>
          <h4 id="From"></h4>
          <h4 id="Quantity"></h4>
          <h4 id="Price"></h4>
          <h4 id="Address"></h4>
          <h4 id="Confirmation"></h4>
          <form onSubmit={handleSubmit}>
            <label htmlFor="input1">Price :</label>
            <input
              type="text"
              id="input1"
              className="input-field"
              value={input1}
              placeholder="Enter price in ₹"
              onChange={(e) => setInput1(e.target.value)}
              required
            />
            <br />

            <button type="submit" id="subbtn" className="submit-button">
              Send
            </button>
          </form>
        </div>
      )}
      <div>
      <button className="submit-button" onClick={()=>{localStorage.removeItem('CompanyName')
    window.location='/'}}>Logout</button>
      </div>
      
    </div>
  );
};

export default Transporter;
