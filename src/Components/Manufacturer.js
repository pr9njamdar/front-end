import React, { useState, useReducer, useEffect } from "react";
import "./Manufacturer.css";
import axios from "axios";

function reducer(Order, action) {
  switch (action.type) {
    case "UpdateOrderId":
      return { ...Order, orderId: action.value };
    case "UpdateTo":
      return { ...Order, to: action.value };
    case "UpdateQuantity":
      return { ...Order, quantity: action.value };
    case "UpdateAddress":
      return { ...Order, address: action.value };
    case "UpdateTransporter":
      return { ...Order, transporter: action.value };
    case "UpdateFrom":
      return { ...Order, from: action.value };
  }
}

function Manufacturer() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [Transporters, setTransporters] = useState([]);
  const [Orders, seTOrders] = useState([]);
  const [Confirm, seTConfirm] = useState(true);
  const [Order, dispatch] = useReducer(reducer, {
    orderId: "",
    to: "",
    from: "",
    quantity: "1",
    address: "",
    transporter: "",
  });

  useEffect(() => {
    if (localStorage.getItem("CompanyName")) {
      axios.get("http://localhost:5000/GetAllTransporters").then((res) => {
        setTransporters(() => res.data);
        dispatch({ type: "UpdateTransporter", value: res.data[0].CompanyName });
      });
      axios({
        method: "get",
        url: "http://localhost:5000/GetOrders",
        params: {
          CompanyName: localStorage.getItem("CompanyName"),
        },
      }).then((res) => {
        seTOrders(() => res.data);
      });
    } else {
      window.location = "/";
    }
  }, []);

  const handleSelectMessage = (message) => {
    axios({
      method: "get",
      url: "http://localhost:5000/GetOrders/Id",
      params: {
        CompanyName: localStorage.getItem("CompanyName"),
        OrderID: message,
        GetPrice: "Yes",
      },
    }).then((res) => {
      document.getElementById(
        "Transporter"
      ).innerText = `Transporter : ${res.data.Transporter}`;
      document.getElementById("To").innerText = `To : ${res.data.To}`;
      document.getElementById("From").innerText = `From : ${res.data.From}`;
      document.getElementById("Price").innerText = `Price : ${res.data.Price}`;
      document.getElementById(
        "Address"
      ).innerText = `Address : ${res.data.Address}`;
      document.getElementById(
        "Quantity"
      ).innerText = `Quantity : ${res.data.Quantity}`;
      if (res.data.Confirmation === true || res.data.Confirmation === false) {
        document.getElementById(
          "Confirmation"
        ).innerText = `Confirmation Status : ${
          res.data.Confirmation === true ? "Confirmed" : "Rejected"
        }`;
        document.getElementsByClassName("Confirmform")[0].style.display =
          "none";
      }
    });

    setSelectedMessage(message);
    setIsPopupVisible(true);
  };

  const handleConfirm = () => {
    if (document.getElementById("Price").innerText !== "Price : Not set") {
      axios({
        method: "post",
        url: "http://localhost:5000/ConfirmOrder",
        data: {
          CompanyName: document
            .getElementById("Transporter")
            .innerText.slice(14),
          OrderID: selectedMessage,
          Price: parseInt(document.getElementById("Price").innerText.slice(8)),
          Confirmation: Confirm,
        },
        params: {
          Manufacturer: localStorage.getItem("CompanyName"),
        },
      }).then((res) => {
        console.log(res.data);
      });
    }

    setSelectedMessage(null);
    setIsPopupVisible(false);
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (Order.transporter) {
      axios
        .post(
          "http://localhost:5000/SubmitOrder",
          {
            OrderID: Order.orderId,
            To: Order.to,
            From: Order.from,
            Quantity: Order.quantity,
            Address: Order.address,
            Manufacturer: localStorage.getItem("CompanyName"),
          },
          { params: { Transporter: Order.transporter } }
        )
        .then((res) => {
          console.log(res.data);
        });

      dispatch({ type: "UpdateOrderId", value: "" });
      dispatch({ type: "UpdateTo", value: "" });
      dispatch({ type: "UpdateFrom", value: "" });
      dispatch({ type: "UpdateQuantity", value: "" });
      dispatch({ type: "UpdateAddress", value: "" });
      dispatch({ type: "UpdateTransporter", value: "" });
    }
  };

  return (
    <div className={`containerM ${isPopupVisible ? "popup-visible" : ""}`}>
      <div className="messages-section">
        <h2>Messages</h2>
        <ul className="listbox">
          {Orders
            ? Orders.map((Order) => (
                <li
                  key={Order.OrderID}
                  onClick={() => handleSelectMessage(Order.OrderID)}
                >
                  {Order.OrderID}
                </li>
              ))
            : ""}
        </ul>
      </div>
      <div className="new-order-section">
        <h2>New Order</h2>
        <form onSubmit={handleOrderSubmit}>
          <div className="input-fieldM">
            <label htmlFor="order-id">Order ID:</label>
            <input
              type="text"
              id="order-id"
              value={Order.orderId}
              onChange={(e) =>
                dispatch({ type: "UpdateOrderId", value: e.target.value })
              }
            />
          </div>
          <div className="input-fieldM">
            <label htmlFor="to">To:</label>
            <input
              type="text"
              id="to"
              value={Order.to}
              onChange={(e) =>
                dispatch({ type: "UpdateTo", value: e.target.value })
              }
            />
          </div>
          <div className="input-fieldM">
            <label htmlFor="from">From:</label>
            <input
              type="text"
              id="from"
              value={Order.from}
              onChange={(e) =>
                dispatch({ type: "UpdateFrom", value: e.target.value })
              }
            />
          </div>
          <div className="input-fieldM">
            <label htmlFor="quantity">Quantity:</label>
            <select
              id="quantity"
              value={Order.quantity}
              onChange={(e) =>
                dispatch({ type: "UpdateQuantity", value: e.target.value })
              }
            >
              <option value="1">1 ton</option>
              <option value="2">2 tons</option>
              <option value="3">3 tons</option>
            </select>
          </div>
          <div className="input-fieldM">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              value={Order.address}
              onChange={(e) =>
                dispatch({ type: "UpdateAddress", value: e.target.value })
              }
            />
          </div>
          <div className="input-fieldM">
            <label htmlFor="transporter">Transporter:</label>
            <select
              id="transporter"
              value={Order.transporter}
              onChange={(e) =>
                dispatch({ type: "UpdateTransporter", value: e.target.value })
              }
              required
            >
              {Transporters
                ? Transporters.map((transporter) => (
                    <option value={transporter.CompanyName}>
                      {transporter.CompanyName}
                    </option>
                  ))
                : " "}
            </select>
          </div>
          <button className="submit-button" type="submit">
            Confirm
          </button>
        </form>
      </div>
      {selectedMessage && (
        <div className="popup1">
          <p>{selectedMessage}</p>
          <h3 id="Transporter"></h3>
          <h4 id="To"></h4>
          <h4 id="From"></h4>
          <h4 id="Quantity"></h4>
          <h4 id="Address"></h4>
          <h4 id="Price"></h4>
          <h4 id="Confirmation"></h4>
          <div className="Confirmform">
            <div className="check">
              <label htmlFor="Confirm">Confirm</label>
              <input
                type="checkbox"
                onChange={() => {
                  seTConfirm(!Confirm);
                }}
                checked={Confirm}
                name="Confirm"
                id="Confirm"
              />
              <label htmlFor="Reject">Reject</label>
              <input
                type="checkbox"
                onChange={() => {
                  seTConfirm(!Confirm);
                }}
                checked={!Confirm}
                name="Reject"
                id="Reject"
              />
            </div>

            <button className="submit-button" onClick={handleConfirm}>
              submit
            </button>
          </div>
        </div>
      )}
      <div>
        <button
          className="submit-button"
          onClick={() => {
            localStorage.removeItem("CompanyName");
            window.location = "/";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Manufacturer;
