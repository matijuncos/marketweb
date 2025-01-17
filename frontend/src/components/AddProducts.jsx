import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Alert, Message } from 'rsuite';
import DropFiles from './DropFiles'
import '../styles/addProducts.css'

import productActions from '../Redux/actions/productActions';


const AddProducts = (props) => {
   
    const {addProduct,categories } = props
    const [itemsDescription,setItemsDescription] = useState([])
    const [newItem,setNewItem] = useState('')

    const [product, setProduct] = useState({
        name:'',
        mark:'',
        price:'',
        stock:'',
        category:'',
        arrayPic:[],
        arrayDescription:[]
    })
    const [errores, setErrores] = useState([])

    const readInput = e => {
        const value = e.target.value
        const property = e.target.name
        setProduct({
            ...product,
            [property]: value
        })
    }

    const addItemDescription = (e) => {
        const value = e.target.value
        setNewItem(value)
    }

    const addLine = () => {

        if (newItem !== '') {
            setItemsDescription([...itemsDescription, newItem.trim()])
            setNewItem('')

        } else {
            alert('Escriba algo antes de agregar otro item')
        }
    }

    const Validate = async e => {
        e.preventDefault()
        setErrores([])
        const {name,mark,price,stock,category,arrayPic} = product
        
        if(name===''||mark===''||price===''||stock===''||category===''||arrayPic.length===0){
            setErrores(['Debe completar todos los campos'])
            return false
        }  
        var arrayFinal=[...itemsDescription]
        if(newItem && newItem.trim()!==''&&itemsDescription.indexOf(newItem.trim())===-1){
           arrayFinal= [...itemsDescription,newItem.trim()]
        }
    
        const fdNewProduct = new FormData()
        fdNewProduct.append('name', name)
        fdNewProduct.append('mark', mark)
        fdNewProduct.append('price', price)
        if(product.warranty && product.warranty!==''){
            fdNewProduct.append('warranty', product.warranty)
        }
        if(product.urlReview && product.urlReview!==''){
            fdNewProduct.append('urlReview',product.urlReview)
        }
        fdNewProduct.append('stock', stock)

        if(product.outstanding){
            fdNewProduct.append('outstanding', product.outstanding )
        }
        fdNewProduct.append('category', category)
        arrayPic.map((pic,i) =>{
            fdNewProduct.append('arrayPics',arrayPic[i])
            return false
        })
        arrayFinal.map((item, i) => {
            fdNewProduct.append('arrayDescription', arrayFinal[i])
            return false
        })
    

        if(errores.length===0){
         const response = await addProduct(fdNewProduct)
        if (response && !response.success) {
            Alert.error('Hubo un error en la carga, intente más tarde')
        } else {
            Alert.success('Producto almacenado exitosamente')
        } }
    }

    return (
        <div className="containerAddProducts">
            <div className="formularioProd">
                <h2>Cargue sus productos</h2>
               {/*  {errores !== '' && <Message type='info' description={errores} style={{ marginBottom: '2vh' }} />} */}
                <div className="inputDiv addProductInput">
                    <input type="text" name="name" placeholder="Nombre del producto" onChange={readInput} />
                </div>
                <div className="inputDiv addProductInput">
                    <input type="text" name="mark" placeholder="Marca" onChange={readInput} />
                </div>
                <div className="inputDiv addProductInput">
                    <input type="number" name="price" placeholder="Precio" onChange={readInput} />
                </div>
                <div className="inputDiv addProductInput">
                    <input type="number" name="warranty" placeholder="Garantía(cantidad de meses)" onChange={readInput} />
                </div>
                <div className="inputDiv addProductInput">
                    <input type="number" name="stock" placeholder="Cantidad en stock" onChange={readInput} />
                </div>
                <select onChange={readInput} label='category' name='category'>
                    <option value='' name='category' >Selecciona categoría</option>
                    {categories.length !== 0 && categories.map(category => {
                        return (
                            <option value={category.category} name='category' key={category.category}>{category.category}</option>
                        )
                    })}
                </select>
                <label className='outstanding' onChange={readInput} name='outstanding'>¿Es producto destacado?
                   <div className='radios'>
                        <div className="inputRadio"><input name='outstanding' type='radio' value={true} />Si</div>
                        <div className="inputRadio"><input name='outstanding' type='radio' value={false} />No</div>
                    </div>

                </label>
                <div className="inputDiv addProductInput">
                    <input type="uri" name="urlReview" placeholder="Ingrese un link de alguna reseña o video relacionado(opcional)" onChange={readInput} />
                </div>
                <DropFiles product={product} setProduct={setProduct} />

                <div className="inputDiv">
                    <h3 style={{color:'white'}}>Descripción</h3>
            
                <div className='addDescription'>
                 <input type="text" value={newItem} name='description' placeholder="Descripción(una oración por línea)" onChange={addItemDescription}/>
                 </div>
            {itemsDescription.map(item =>{
                   return( 
                   <div className='itemsDescription'>
                       <div>
                       <h5>{item}</h5>
                       </div>
                       <button className='removeLine' name={item} onClick={(e)=>setItemsDescription(itemsDescription.filter(item=> item!==e.target.name))}>Borrar</button>
                       </div>)
                })
            }
                
            </div>
            <div className='buttons'>
                <button onClick={addLine} className='btn'>Agregar otra descripción</button>
                <button className="btn" onClick={(e)=>Validate(e)}>Confirmar producto</button>
            </div>
            <Link to='/'>
            <button className='btn'>Volver al Inicio</button>
            </Link>
           
                {errores&& errores.map((error, i) =>{
                    return <p key={i+'e'}>{error}</p>
                })}


            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        categories: state.product.categories
    }
}
const mapDispatchToProps = {
    addProduct: productActions.addProduct
}
export default connect(mapStateToProps, mapDispatchToProps)(AddProducts)

