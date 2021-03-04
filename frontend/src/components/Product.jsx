import '../styles/Product.css'
import {useState} from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import {connect} from 'react-redux'
import shoppingCartActions from '../Redux/actions/shoppingCartActions'
const Product = ({product,addProductShoppingCart}) =>{
 const [add,setAdd]= useState(false)
    
 const addProductCart = () =>{
  alert('Agregado al carrito')
  addProductShoppingCart({idProduct:product._id,quantity:1})
 }
  if(product) {
       return(
      <div className='productContainer'>
        {/* Product Image View */}
          <div className='productPic' style={{backgroundImage:`url(${product.arrayPic[0]})`}}></div>
          {/* -- Price View */}
          <div className='productPrice'>
            <h4>{`$${product.price}`}</h4>
            <div onMouseOver={()=>setAdd(true)} onMouseOut={()=>setAdd(false)} onClick={addProductCart} className='iconCart'><FaShoppingCart/></div>
            <div>{add&&<p className='add'>Agregar al carrito</p>}</div> 
          </div>
          <div className='containerTitle'>
            <h4 className='productTitle'>{product.name}</h4>
          </div>
      </div>
    );     
    }else{
        return(
            <h5>Loading...</h5>
        )
    }
}
const mapDispatchToProps={
  addProductShoppingCart:shoppingCartActions.addProductShoppingCart
}
export default connect(null,mapDispatchToProps)(Product)