import axios from 'axios'
import {Alert} from 'rsuite'

const shoppingCartActions={
  addShoppingCart:(shoppingCart)=>{
    return async (dispatch, getState)=>{
      try {
        const response= await axios.post('https://gitmusicapp.herokuapp.com/api/products/shoppingcart',shoppingCart)
        dispatch({
          type: "SHOPPING_SAVE",
          payload: response.data.response
        })
      } catch (error) {
        return ({success:false,error:"error"})
      }
      return ({success:true,response:"success"})
    }
  },
  addProductShoppingCart:(product)=>{
    return(dispatch,getState)=>{
      try {
      dispatch({
        type: "ADD_PRODUCT_SHOPPING_CART",
        payload:product
      })
      localStorage.setItem('shoppingCart',JSON.stringify(getState().shoppingR.shoppingCart))
      return ({success:true,response:getState()})
      } catch (error) {
        return ({success:false,error:error})
      }
      }
  },
  preservedShoppingCart:(shoppingCart)=>{
      return(dispatch,getState)=>{
        try {
          dispatch({
            type: "PRESERVED_SHOPPING_CART",
            payload:JSON.parse(shoppingCart)
          })
          return ({success:true,response:"success"})
        } catch (error) {
          return ({success:false,error:"error"})
        }
    }
  },
  clearCart: () =>{
    return async (dispatch, getState) =>{
      dispatch({
        type: "CLEAR_CART"
      })
      Alert.success('Carrito Vacio')
    }
  },
  editProductCart:(value,product)=>{
    return async (dispatch, getState)=>{
      dispatch({
        type: "EDIT_PRODUCT_CART",
        payload:{value:value,product:product}
      })
      localStorage.setItem('shoppingCart',JSON.stringify(getState().shoppingR.shoppingCart))
      Alert.success('Producto actualizado')
    }
  },
  deleteProductCart:(idProduct)=>{
    return async (dispatch, getState)=>{
      dispatch({
        type: "DELETE_PRODUCT_CART",
        payload:{idProduct:idProduct}
      })
      localStorage.setItem('shoppingCart',JSON.stringify(getState().shoppingR.shoppingCart))
      Alert.error('Se elimino el articulo del carrito.')
    }
  },
  emailShopCart:(email,dataCart)=>{
    return async (dispatch,getstate)=>{
      try{
        const data = await axios.post('https://gitmusicapp.herokuapp.com/api/confirmPurchase',{email,dataCart})
        if(data.status===200&& data.data.response){
          dispatch({type: "EMAIL_SENT",payload:''})
          return data.data.response

        }else{
          Alert.error('Hubo un error, intente más tarde')
          return data.data
        }
      }catch(error){
        Alert.error('Hubo un error, intente más tarde')
        return error
      }

    }
  },
}
export default shoppingCartActions