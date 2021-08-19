import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Input, DatePicker, Space } from "antd";
const { RangePicker } = DatePicker;

export const Hotels = () => {
  const [hotelsData, setHotelsData] = useState([{}]);
  // const [hotelsEditData, setHotelsEditData] = useState({});
  const [roomsData, setRoomsData] = useState([{}]);
  const [roomsDates, setRoomsDates] = useState([]);
  const [searchParam] = useState([
    "hotel_name",
    "hotel_country",
    "hotel_address",
  ]);

  const [hotels, setHotels] = useState([
    {
      hotel_name: "",
      hotel_country: "",
      hotel_address: "",
    },
  ]);
  const [hotelsEdit, setHotelsEdit] = useState(
    {
      hotelId:'',
      hotel_name: "",
      hotel_country: "",
      hotel_address: "",
    },
  );
  const ref = useRef();
  const ref2 = useRef();
  const [q, setQ] = useState("");

  async function getHotels() {
    const res = await axios.post("/hotels/browseHotels");
    setHotelsData(res.data.hotelInfos);
  }
  async function getHotelsById(id) {
    const res = await axios.post("/hotels/browseHotelsById", {
      hotelId: id,
    });
    console.log(res.data.hotelInfos[0]);
    setHotelsEdit({
      hotelId:res.data.hotelInfos[0].id,
      hotel_name: res.data.hotelInfos[0].hotel_name,
      hotel_country: res.data.hotelInfos[0].hotel_country,
      hotel_address: res.data.hotelInfos[0].hotel_address,
  });
  }
  async function getRooms(from, to) {
    const res = await axios.post("/rooms/browseRoomsByDate", {
      room_availability_from: from,
      room_availability_to: to,
    });
    setHotelsData(
      res.data.roomInfos?.filter((data, i) => {
        return data.availableRooms.length > 0;
      })
    );
  }

  useEffect(() => {
    getHotels();
  }, []);
  useEffect(() => {
    if (roomsDates.length == 0 || roomsDates[0] == "") {
      getHotels();
    } else {
      console.log("data");
      getRooms(roomsDates[0], roomsDates[1]);
    }
  }, [roomsDates]);

  const handleDelete = async (id) => {
    const res = await axios.post("/hotels/deleteHotel", { hotelId: id });
    if (res.data.message == "Hotel Deleted") {
      getHotels();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("/hotels/createHotel", hotels);
    if (res.data.message == "Hotel successfully Added.") {
      ref.current.click();
      getHotels();
      setHotels([
        {
          hotel_name: "",
          hotel_country: "",
          hotel_address: "",
        },
      ]);
    }
  };
  const handleEdit= async (e) => {
    e.preventDefault();
    const res = await axios.post("/hotels/createHotel", hotelsEdit);
    if (res.data.message == "Hotel Details successfully Updated.") {
      ref2.current.click();
      getHotels();
      setHotelsEdit([
        {
          hotel_name: "",
          hotel_country: "",
          hotel_address: "",
        },
      ]);
    }
  };
  const handleChange = (e) => {
    setHotels({ ...hotels, [e.target.name]: e.target.value.trim() });
  };
  const handleChangeEdit = (e) => {
    setHotelsEdit({ ...hotelsEdit, [e.target.name]: e.target.value });
  };
  const search = (items) => {
    return items.filter((item) => {
      return searchParam.some((newItem) => {
        return (
          item[newItem]?.toString().toLowerCase().indexOf(q.toLowerCase()) > -1
        );
      });
    });
  };

  return (
    <>
      <div className="container text-center">
        <h1>Search Hotels</h1>
        <div className="d-flex justify-content-center mt-4">
          <div className="col-4 ">
            <div className="my-2">
              <Input
                placeholder="Search Hotels By Name, Destination, Country"
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            Or
            <div className="my-2">
              <Space direction="vertical" size={12}>
                <RangePicker
                  dateRender={(current) => {
                    const style = {};

                    return (
                      <div className="ant-picker-cell-inner" style={style}>
                        {current.date()}
                      </div>
                    );
                  }}
                  onChange={(date, dateString) => {
                    setRoomsDates(dateString);
                  }}
                />
              </Space>
            </div>
          </div>
        </div>
      </div>
      <div className="container  mt-4">
        {/* Add modal */}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Add Hotel
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  ref={ref}
                ></button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={(e) => {
                    handleSubmit(e);
                  }}
                >
                  <div className="mb-3">
                    <label htmlFor="exampleInput1" className="form-label">
                      Enter Hotel Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleInput1"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      name="hotel_name"
                      value={hotels.hotel_name}
                      placeholder="Hotel name"
                      aria-describedby="emailHelp"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="exampleInput2" className="form-label">
                      Enter Country
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleInput2"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      name="hotel_country"
                      value={hotels.hotel_country}
                      placeholder="Hotel country"
                      aria-describedby="emailHelp"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="exampleInput3" className="form-label">
                      Enter Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleInput3"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      name="hotel_address"
                      value={hotels.hotel_address}
                      placeholder="Hotel address"
                      aria-describedby="emailHelp"
                    />
                  </div>

                  <button type="submit" className="btn btn-outline-success">
                    Save
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* Add Modal */}
        {/* Edit Modal */}
        <div
          className="modal fade"
          id="exampleModalEdit"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel2"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel2">
                  Edit Hotel
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  ref={ref2}
                ></button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={(e) => {
                    handleEdit(e);
                  }}
                >
                  <div className="mb-3">
                    
                    <label htmlFor="exampleInput4" className="form-label">
                      Enter Hotel Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleInput4"
                      onChange={(e) => {
                        handleChangeEdit(e);
                      }}
                      name="hotel_name"
                      value={hotelsEdit.hotel_name}
                      placeholder="Hotel name"
                      
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="exampleInput5" className="form-label">
                      Enter Country
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleInput5"
                      onChange={(e) => {
                        handleChangeEdit(e);
                      }}
                      name="hotel_country"
                      value={hotelsEdit.hotel_country}
                      placeholder="Hotel country"
                      
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="exampleInput6" className="form-label">
                      Enter Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleInput6"
                      onChange={(e) => {
                        handleChangeEdit(e);
                      }}
                      name="hotel_address"
                      value={hotelsEdit.hotel_address}
                      placeholder="Hotel address"
                      
                    />
                  </div>

                  <button type="submit" className="btn btn-outline-success">
                    Update
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* Edit Modal */}
        <div className="row">
          <div className="col-4 ">
            <h4 className="text-left">Popolar Hotels</h4>
          </div>
          <div className="col-8 d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-outline-primary mx-2"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Add New Hotel
            </button>
            <Link to="/add-rooms" className="btn btn-outline-primary mx-2">
              Add New Rooms
            </Link>
          </div>
        </div>
        <div className="container m-5  ">
          <div className=" mt-4">
            <div className="row">
              {search(hotelsData)?.map((data, i) => {
                return (
                  <div className="col-5 m-2" key={i}>
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">{data.hotel_name}</h5>
                        <p className="card-text">{data.hotel_country}</p>
                        <p className="card-text">{data.hotel_address}</p>
                      </div>
                      <div className="card-footer d-flex justify-content-between px-4">
                        <button
                          type="button"
                          className="btn btn-outline-info mx-2"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModalEdit"
                          onClick={(e) => {
                            getHotelsById(data.id);
                          }}
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={(e) => {
                            handleDelete(data.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
