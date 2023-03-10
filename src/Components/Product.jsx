import { FaStar } from 'react-icons/fa'
import { BiHeart } from 'react-icons/bi'
export default function Product(props) {
    const Rating = [1, 2, 3, 4, 5];
    return (
        <div className="card border-0" key={props.productDetails.id}>
            <img className="card-img-top" src={props.productDetails.image} alt="props.productDetails.title" width={"200px"} height={"200px"} />
            <div className="card-img-overlay">
                <div className="px-2 py-1 d-inline bg-light float-end rounded border shadow" style={{ cursor: "pointer" }}>
                    <BiHeart className='text-danger fw-bold' />
                </div>
            </div>
            <div className="card-body text-center my-2 mt-5" style={{ height: "max-content" }}>
                <h4 className="card-title mb-2 fw-bold">{props.productDetails.title}</h4>
                <div className='d-flex justify-content-center gap-2'>{Rating.map((star, index) => { return (<FaStar key={index} className="text-danger opacity-75" />) })}</div>
                <p className='text-info fw-bold small my-2 opacity-75'>{props.productDetails.category}</p>
                <p className="text-danger text-center">{props.productDetails.price}$</p>
            </div>
        </div>
    )
}