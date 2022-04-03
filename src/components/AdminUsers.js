import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import "../style/index.css";
import { callApi } from "../axios-services";
import { ProductImage, ProductInfo, ProductCard } from ".";
import { Button, Card} from "react-bootstrap";
import cardplaceholder from "../imgs/cardplaceholder.png";
import useUser from "../hooks/useUser";


const AdminUsers = ({token}) =>{
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [product, setProduct] = useState({})
  const navigate = useNavigate();
  const { userId} = useParams();
//   console.log("this is admin", AdminPage)
  const { user, setUser, setShoppingCart, setUserOrder } = useUser();

const handleUsers = async () =>{
    try{
    const users = await callApi({ method: 'get', url: `/users`, token:token });
    setUsers(users);
    console.log('this is all the users ', users)
    }catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    handleUsers()
    },[setUsers, token]);


    const handleDeleteUser= async (event, id) => {
        event.preventDefault()
        try {
          
            const deletedUser = await callApi({ method: 'delete', url: `/users/${id}`,token:token})
          console.log(deletedUser)
          handleUsers()
        } catch (error) {
          console.error(error);
        }
      };

      return (
        <div className="admin-page-backdrop">
                  <h3 className="users-title">Active Users</h3>
      <Button  className="add-product-button"
                      onClick={() => {
                        navigate(`/admin-page/users/add`);
                      }}>Add User</Button>
      <div>
      {users.map(user => {
        const { id, username, password, email, isAdmin } = user;
           return (
            <div key={user.id}>
           <div className="list-of-users" style={{background: "#557272"}} >
             {user.username}
             <Button className="user-edit-button"
             onClick={() => {
              navigate(`/users/${id}/edit`);
            }}
             >Edit
             </Button>
             <Button  className="delete-user-button"
                      variant="dark"
                      onClick={(event) => {
                        handleDeleteUser(event, id, isAdmin);
                      }}>
                        Delete
            </Button>  
          </div>
          </div>
          )
        })}
      </div>
      </div> 
      )
    } 
export default AdminUsers