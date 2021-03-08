import '../styles/DrawerContent.css'
import {  FaTrashAlt, FaArrowLeft, FaArrowRight} from 'react-icons/fa'
import { connect } from 'react-redux'
import {Alert,Input} from 'rsuite'
import shoppingCartActions from '../Redux/actions/shoppingCartActions'

const DrawerContent = ({shoppingCart,editProductCart,deleteProductCart}) => {
    console.log(shoppingCart)
    const deleteProduct = id => {
        console.log(id)
        // const filterProduct = shoppingCart.filter(product => product.idProduct !== id)
        // deleteProductCart(id)
    }
    const manageQuantityForStock=(operation,product)=>{
        const inputProduct=document.querySelector(`#input${product.idProduct}`)
        if(operation==='subtract'){
            if((parseInt(inputProduct.value)-1)<1){
                Alert.warning("Debes tener almenos 1.",3000)
            }else{
                inputProduct.value=parseInt(inputProduct.value)-1
                editProductCart(parseInt(inputProduct.value),product)
            }
        }else if(operation==='add'){
            if((parseInt(inputProduct.value)+1)>product.product.stock){
            Alert.warning(`No podes exceder el stock(${product.product.stock}) del articulo.`,3000)
            }else{
                inputProduct.value=parseInt(inputProduct.value)+1
                editProductCart(parseInt(inputProduct.value),product)
            }
        }
    }
    const inputModifyQuantity=(value,e,product)=>{
        if(value>product.product.stock){
            Alert.warning(`No podes exceder el stock(${product.product.stock}) del articulo.`,3000)
            e.target.value=product.quantity
        }else if(value<1){
            Alert.warning("Selecciona un numero distinto a 0 ó numeros negativos.",3000)
            e.target.value=product.quantity
        }else{
            editProductCart(parseInt(value),product)
        }
    }
    console.log(shoppingCart)
    return (
        <>
            {shoppingCart.length !== 0 ? shoppingCart.map(product => 
                <div className="drawerProductContainer" >
                    <div>
                        <p className="textProduct"><strong>Producto:</strong> {product.product.name}</p>
                        <p className="textProduct"><strong>Marca:</strong> {product.product.mark}</p>
                        <p className="textProduct"><strong>Precio:</strong> {product.product.price}</p>
                        <div className="manageProduct">
                            <div className="manageQuantityProduct">
                                <FaArrowLeft onClick={(e) =>manageQuantityForStock("subtract",product)} className="bottonManage arrow"/>
                                <span><Input id={`input${product.idProduct}`} class="quantityValue" onChange={(value,e)=>inputModifyQuantity(value,e,product)} defaultValue={product.quantity}/></span>
                                <FaArrowRight onClick={(e) =>manageQuantityForStock("add",product)} className="bottonManage arrow"/>
                            </div>
                            <FaTrashAlt onClick={() => deleteProduct(product.idProduct)} className="bottonManage delete"/>
                        </div>
                    </div>
                    <div className="drawerProductImg" style={{backgroundImage: `url(${product.product.arrayPic[0]})`}}>
                        
                    </div>
                </div>
            ) :(
                <h4>Aún no tenés productos en el carrito</h4>
            )
            }
       </> 
    )
}
const mapStateToProps = state =>{
    return{
        shoppingCart:state.shoppingR.shoppingCart,
        allProducts: state.product.allProducts,
        loggedUser: state.userR.loggedUser
    }
}
const mapDispatchToProps={
    editProductCart:shoppingCartActions.editProductCart,
    deleteProductCart:shoppingCartActions.deleteProductCart
}
export default connect(mapStateToProps,mapDispatchToProps)(DrawerContent)

//<FaRegWindowClose onClick={() => deleteProduct(product.idProduct)} className="removeDrawerProduct" />