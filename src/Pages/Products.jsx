import { useState, useEffect } from "react";
import axios from 'axios';
import Slider from "@mui/material/Slider";
import Product from "../Components/Product";
import { BiSearch } from 'react-icons/bi'
import { BsFillArrowDownCircleFill } from 'react-icons/bs'
import { BsFillArrowUpCircleFill } from 'react-icons/bs'
import { IoIosArrowDropdownCircle } from "react-icons/io";

export default function Products() {
    const [data, setData] = useState({
        Products: [],
        FilteredProducts: [],
        Categories: [],
    })

    const [control, setControl] = useState({
        search: "",
        sortingDirection: "asc",
        range: [0, 2000],
        showCategories: false,
    })

    function filtering() {
        let searchResult = [];
        data.FilteredProducts.map(Product => {
            if (Product.title.toLowerCase().includes(control.search)) {
                searchResult.push(Product)
            }
        })
        setData(old => ({ ...old, FilteredProducts: searchResult }))
        control.search === "" && setData(old => ({ ...old, FilteredProducts: old.Products }))
    }

    function Sort() {
        setData(old => ({
            ...old, FilteredProducts: [...old.FilteredProducts].sort((a, b) =>
                control.sortingDirection === "asc" ? a.title > b.title ? 1 : -1 : a.title > b.title ? -1 : 1)
        }))
    }
    function handleChanges(newValue) {
        setControl(old => ({ ...old, range: newValue }))
        let InRangeProducts = [];
        data.FilteredProducts.map(product => {
            if (product.price > control.range[0] && product.price < control.range[1]) {
                InRangeProducts.push(product);
            }
        })
        setData(old => ({ ...old, FilteredProducts: InRangeProducts }))
    }

    function GetAllCategories() {
        axios.get("https://fakestoreapi.com/products/categories")
            .then(res => {
                setData(old => ({ ...old, Categories: res.data }))
            }).catch((err) => {
                alert(err.message);
            });
    }

    //Get all products
    function GetAllProducts() {
        axios.get('https://fakestoreapi.com/products')
            .then(res => {
                setData(old => ({ ...old, Products: res.data, FilteredProducts: res.data }))
                setControl(old => ({ ...old, sortingDirection: "asc" }))
                if (control.search !== "")
                    filtering();
                Sort();
            }).catch((err) => {
                alert(err.message);
            });

    }

    function GetProductsByCategories(Category) {
        axios.get(`https://fakestoreapi.com/products/category/${Category}`)
            .then(res => {
                setData(old => ({ ...old, FilteredProducts: res.data }))
                setControl(old => ({ ...old, sortingDirection: "asc" }))
                if (control.search !== "")
                    filtering();
                Sort();
            }).catch((err) => {
                alert(err.message);
            });
    }

    useEffect(() => {
        GetAllProducts();
        GetAllCategories();
    }, [])

    useEffect(() => {
        Sort();
    }, [control.sortingDirection])

    return (
        <div className="container-fluid mt-3">
            <div className="row">
                <div className="col-12 col-md-4 col-lg-2">
                    <div className="input-group">
                        <input
                            className="form-control border-end-0 border"
                            type="search"
                            placeholder="search"
                            value={control.search}
                            onChange={(searchText) => { setControl(old => ({ ...old, search: searchText.target.value })) }}
                        />
                        <span className="input-group-append">
                            <button className="btn border border-start-0" onClick={filtering}>
                                <BiSearch />
                            </button>
                        </span>
                    </div>
                    <div className="my-2">
                        <button className="btn btn-outline-primary" onClick={() => { setControl(old => ({ ...old, sortingDirection: old.sortingDirection === "asc" ? "desc" : "asc" })); Sort() }}>
                            Sort Products alphabetically {control.sortingDirection === "asc" ? <BsFillArrowUpCircleFill /> : <BsFillArrowDownCircleFill />}
                        </button>
                    </div>
                    <div className="my-2">
                        <div className="d-flex align-items-end gap-3 my-3">
                            <p className="text-primary mt-3">Get Products by Category:</p>
                            <button className="btn " onClick={() => { setControl(old => ({ ...old, showCategories: !old.showCategories })) }}><IoIosArrowDropdownCircle className="text-primary mb-2" /></button>
                        </div>
                        <div className={control.showCategories ? "show" : "collapse"}>
                            <ul className="list-group">
                                <li className="list-group-item" style={{ cursor: "pointer" }} onClick={GetAllProducts}>ALL</li>
                                {data.Categories.map(Category => {
                                    return <li className="list-group-item" style={{ cursor: "pointer" }} onClick={() => { GetProductsByCategories(Category) }}>{Category}</li>
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="px-3">
                        <span>Price Range</span>
                        <Slider getAriaLabel={() => 'Price range'} valueLabelDisplay="auto" value={control.range} onChange={handleChanges} max={2000} min={0} />
                    </div>
                </div>
                <div className='col-12 col-md-8 col-lg-10 bg-light'>
                    <div className="d-flex flex-wrap bg-light">
                        {data.FilteredProducts.map((product, index) => {
                            return (
                                <div className="col-lg-3 col-sm-6 col-12 border rounded-3 bg-white p-2" key={index}>
                                    <Product productDetails={product} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}