import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Input, DatePicker, Space, Select } from "antd";
import { Link } from "react-router-dom";
const { RangePicker } = DatePicker;
const { Option } = Select;

export const Rooms = () => {
  const [hotelsData, setHotelsData] = useState([{}]);

  const [rooms, setRooms] = useState([
    {
      room_type: "",
      room_price: "",
      room_availability_from: "",
      room_availability_to: "",
      status: 0,
      hotel_id: "",
    },
  ]);

  async function getHotels() {
    const res = await axios.post("/hotels/browseHotels");
    setHotelsData(res.data.hotelInfos);
  }

  useEffect(() => {
    getHotels();
  }, []);

  const handleSubmit = async (e) => {
    console.log(rooms);
    e.preventDefault();
    let data = {
      room_type: rooms.room_type,
      room_price: rooms.room_price,
      room_availability_from: rooms.room_availability_from,
      room_availability_to: rooms.room_availability_to,
      status: 0,
      hotel_id: rooms.hotel_id,
    };
    console.log(data);
    const res = await axios.post("/rooms/createRoom", data);
    if (res.data.message == "Room successfully Added.") {
      alert(res.data.message);
     
    }
  };
  const handleChange = (e) => {
    setRooms({ ...rooms, [e.target.name]: e.target.value.trim() });
  };

  return (
    <>
      <div className="container  mt-4">
        <div className="d-flex justify-content-between ">
          <Link to="/" className="btn btn-outline-primary mx-2">
            Back
          </Link>
          <div className="col-11 text-center">
            <h4>Add Rooms</h4>
          </div>
        </div>
        <div className="container  m-5  ">
          <div className=" mt-4">
            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <div className="mb-3">
                <label htmlFor="exampleInput1" className="form-label">
                  Select Hotel
                </label>
                <div className="d-flex ">
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select Hotel"
                    optionFilterProp="children"
                    onChange={(e) => {
                      setRooms({
                        ...rooms,
                        hotel_id: e,
                      });
                    }}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    name="hotel_id"
                  >
                    {hotelsData.map((data, i) => {
                      return (
                        <Option key={i} value={data.id}>
                          {data.hotel_name}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInput3" className="form-label">
                  Enter Room Type
                </label>
                <input
                  type="text"
                  className="ant-input"
                  id="exampleInput3"
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  name="room_type"
                  placeholder="Enter Room Type"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInput2" className="form-label">
                  Enter Room Price
                </label>
                <input
                  type="text"
                  className="ant-input"
                  id="exampleInput2"
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  name="room_price"
                  placeholder="Enter Room Price"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="exampleInput3" className="form-label">
                  Enter Available From
                </label>
                <div className="d-flex">
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Select Available From"
                    onChange={(date, dateString) => {
                      setRooms({
                        ...rooms,
                        room_availability_from: dateString,
                      });
                    }}
                    name="room_availability_from"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInput3" className="form-label">
                  Enter Available To
                </label>
                <div className="d-flex">
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Select Available To"
                    onChange={(date, dateString) => {
                      setRooms({
                        ...rooms,
                        room_availability_to: dateString,
                      });
                    }}
                    name="room_availability_to"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-outline-success">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
