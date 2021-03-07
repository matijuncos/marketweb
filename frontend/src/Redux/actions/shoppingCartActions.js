import axios from 'axios'
import {Alert} from 'rsuite'

const shoppingCartActions={
  addShoppingCart:(shoppingCart)=>{
    return async (dispatch, getState)=>{
      try {
        const response= await axios.post('https://gitmusicapp.herokuapp.com/api/products/shoppingcart',shoppingCart)
        if(response){
          console.log("Se guardo correctamente")
        }else{
          console.log("error al guardar")
        }
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
}
export default shoppingCartActions