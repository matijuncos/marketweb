import React, { useEffect, useRef, useState } from 'react'
import "../styles/SingleProduct.css"
import { Alert, Button, ButtonToolbar } from 'rsuite';
import { connect } from 'react-redux';
import Comment from './Comment';
import { MdSend } from "react-icons/md";
import shoppingCartActions from '../Redux/actions/shoppingCartActions';
import productActions from '../Redux/actions/productActions'
import { AiOutlineCheckCircle } from "react-icons/ai";
import { BsFillStarFill } from 'react-icons/bs'
import { useHistory, Link } from "react-router-dom";

const SingleProduct = (props) => {
    const { allProducts, addProductShoppingCart, shoppingCart, ratingProduct, loggedUser } = props
    const id = props.match.params.id
    const [thisProduct, setThisProduct] = useState()
    const [visible, setVisible] = useState(false)
    const [newComment, setComment] = useState('')
    const [index, setIndex] = useState(0)
    const [quantity, setquantity] = useState(1)
    const [rating, setRating] = useState(3)
    let history = useHistory();
    const messageRef = useRef(null);

    useEffect(() => {
     
        allProducts.length === 0 && props.history.push('/')
        const product = allProducts.filter(product => product._id === id)
        setThisProduct(product[0])
        if (thisProduct && thisProduct._id && thisProduct.arrayRating.length !== 0) {
            const stars = thisProduct.arrayRating.reduce((a, b) => {
                return {
                    value: (a.value + b.value)
                }
            }, { value: 0 })

            setRating(Math.round(stars.value / thisProduct.arrayRating.length))
        } else {
            setRating(3)
        }
    }, [allProducts, thisProduct, loggedUser, id])
    useEffect(()=>{
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
          })
    },[])
    const setNumber = (e) => {
        const number = parseInt(e.target.value)
        setquantity(number)
        if (e.target.value > thisProduct.stock) {
            setquantity(thisProduct.stock)
            Alert.error('El número de unidades no puede superar al stock')
        }
    }
    const handleComments = (e) => {
        e.preventDefault()
        setComment(e.target.value)
    }

    const sendComment = e => {
        e.preventDefault()
        if(newComment.length === 0){
            Alert.error('Escribe un comentario', 3000)
        } else {
            props.commentProduct({
                comment: newComment,
                idProduct: thisProduct._id,
                idUser: loggedUser.userId
            })
            setComment('')
            // messageRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
        }

        //mando comment
    }

    const enterKey = (e) => {
        if (e.key === 'Enter') {
            //action de mandar nuevo comment
        }
    }
    const addToCart = async () => {
        const filterProductCart = shoppingCart.filter(product => product.idProduct === thisProduct._id)
        if (filterProductCart.length !== 0 && (filterProductCart[0].product.stock < filterProductCart[0].quantity + 1)) {
            Alert.warning(`No podes exceder el stock(${thisProduct.stock}) de este articulo.`, 3000)
        } else {
            Alert.success('Agregado al carrito.', 3500)
            addProductShoppingCart({ idProduct: id, quantity, product: thisProduct })
        }
    }

    const rankProduct =  e => {
        let newRating=e.target.value
        setRating(e.target.value)
        // Alert.error("Debe estar registrado para rankear",3000)
        const editFilter = thisProduct.arrayRating.filter(value => value.idUser === loggedUser.userId)
        //en primera vuelta el value llega null ver y corregir
        
          if(editFilter.length !== 0){
            ratingProduct({
                idProduct: thisProduct._id,
                idUser: loggedUser.userId,
                value: newRating,
                edit: true
            })
        } else {
            ratingProduct({
                idProduct: thisProduct._id,
                idUser: loggedUser.userId,
                value: newRating,           
            })
        }
     
        Alert.success('Calificaste con ' + e.target.value + ' estrellas!', 4000)
    }
    if (thisProduct) {
        return (
            <div className="mainSingleProduct">
                <Button onClick={() => history.goBack()} className="backNavButton" >{`Ir a ${thisProduct.category}`}</Button>
                <div className="mainSingleContainer">
                    <div className="leftSection">
                        {thisProduct.arrayPic.map((pic, i) => {
                            return (
                                <div key={i} className="lateralPic" onClick={() => setIndex(i)} style={{ width: '12vh', height: '12vh', backgroundImage: `url(${pic})`, backgroundPosition: 'center', backgroundSize: 'cover', borderRadius: '8px' }}>
                                    {/* <img src={pic} className="lateralPic" alt='' onClick={()=>setIndex(i)}></img>  */}
                                </div>
                            )
                        }
                        )}
                    </div>
                    <div className="middleSection">
                        <div className="picContainer" style={{ backgroundImage: `url(${thisProduct.arrayPic[index]})`}}></div>
                        <div className="descriptionContainer">
                            <h5>Sobre este producto:</h5>
                            <div className="liDescription">
                                {thisProduct.arrayDescription.map((desc, i) => {
                                    return <p key={i} className='description'><AiOutlineCheckCircle key={i} className='descriptionItem' />{desc}</p>
                                })}
                            </div>
                        </div>
                        {thisProduct.urlReview &&
                            <div className="video-responsive">
                                <iframe
                                    width="853"
                                    height="480"
                                    src={thisProduct.urlReview}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title="Embedded youtube"
                                />
                            </div>
                        }
                    </div>
                    <div className="rightSection">
                        <p className="singleProductName">{thisProduct.name}</p>
                        <p className="singleTextBlue">Marca: {thisProduct.mark}</p>
                        <p className="singleTextBlue">Hay {thisProduct.stock} {thisProduct.stock === 1 ? "unidad" : "unidades"} en stock!</p>
                        <p>Valoración:</p>


                        {!loggedUser ? <div>{[...Array(5)].map((m, i) => {
                            const ratingValue = i + 1
                            return (
                                <BsFillStarFill onClick={()=>{Alert.warning("Tenés que iniciar sesión.")}} className="star" style={{ cursor: 'default' }} color={(ratingValue <= rating) ? '#ffc107' : '#8C8C8C'} />
                            )
                        })}</div> :
                            <div>{[...Array(5)].map((m, i) => {
                                const ratingValue = i + 1
                                return (
                                    <label key={i}>
                                        <input
                                            className="starInput"
                                            type="radio"
                                            name="rating"
                                            value={ratingValue}
                                            onClick={rankProduct}
                                        />
                                        <BsFillStarFill className="star" color={(ratingValue <= rating) ? '#ffc107' : '#8C8C8C'} />
                                    </label>
                                )
                            })}</div>}
                        <p style={{}}>Garantía de {thisProduct.warranty} meses!</p>
                        <p style={{ fontSize: '2vw', fontWeight: 'bolder', color: 'rgb(20 170 52)' }}>$ {thisProduct.price}</p>
                        <div className='numberInput'>
                            <input type='number' className='number' min='1' onChange={setNumber} value={quantity} />
                        </div>
                        <div className="inputDiv">
                            {thisProduct.arrayComments.length !== 0 ? <p className="singleSimpleText cursor" style={{cursor:'pointer'}} onClick={() => setVisible(!visible)}>{visible ? 'Ocultar comentarios' : 'Ver comentarios'} ({thisProduct.arrayComments.length})</p> : <p onClick={() => setVisible(!visible)} className="singleSimpleText">Aún no hay comentarios</p>}
                            {visible && (
                            <div>
                            {thisProduct.arrayComments.length ? 
                                <div className="comments" >
                                    {thisProduct.arrayComments.map(comment => 
                                        <Comment idProduct={thisProduct._id} comment={comment}/>
                                    )}
                                </div>
                                :
                                <div className="comments" style={{display: 'flex', alignItems: 'center',
                                justifyContent: 'center'}}>
                                    <h5>Sé el primero en comentar.</h5>
                                </div>
                                }
                                <div className="inputDiv" onClick={() => !loggedUser ? Alert.error('Ingresa a tu cuenta para comentar.', 4000): '' }>
                                    <input type="text" name="content" onKeyDown={enterKey} placeholder={!loggedUser ? 'Ingresa a tu cuenta para comentar.' : 'Deja tu comentario.' } className="commentInput" onChange={handleComments} value={newComment} autoComplete="off" disabled={!loggedUser ? true : false} /> 
                                    <MdSend className="commentIcon" onClick={sendComment} />
                                </div>
                            </div>
                        )}
                            <ButtonToolbar className="singleButtons">
                                <Button color="cyan" className="singleButton" block onClick={addToCart}>Añadir al carrito</Button>
                            </ButtonToolbar>
                            <div className="whatsapp">
                        <Link target='_blank' to={{pathname:'https://api.whatsapp.com/send?phone=+5493584403782'}} className='navLinksWhatsapp'>
                            <div className="imgWhatsapp"></div>
                            <p>Alguna pregunta? Estamos para ayudarte.</p>
                        </Link>
                    </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        )
    }
    else {

        return (
            <h1>Somos la mejor elección!</h1>

        )
    }
}
const mapStateToProps = state => {
    return {
        allProducts: state.product.allProducts,
        shoppingCart: state.shoppingR.shoppingCart,
        loggedUser: state.userR.loggedUser
    }
}
const mapDispatchToProps = {
    addProductShoppingCart: shoppingCartActions.addProductShoppingCart,
    commentProduct: productActions.commentProduct,
    ratingProduct: productActions.ratingProduct
}
export default connect(mapStateToProps, mapDispatchToProps)(SingleProduct)