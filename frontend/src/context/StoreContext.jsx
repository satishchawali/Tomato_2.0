import axios from "axios";
import { createContext, useEffect, useMemo, useState } from "react";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = "https://tomato-2-0-backend.onrender.com";
    const [token, setToken] = useState(() => localStorage.getItem("token") || "");
    const [food_list, setFoodList] = useState([]);

    useEffect(() => {
        localStorage.setItem("token", token);
    }, [token]);

    const addToCart = async (itemId) => {
        try {
            setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
            if (token) {
                await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } });
            }
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            setCartItems((prev) => {
                const updatedCart = { ...prev };
                if (updatedCart[itemId] > 1) {
                    updatedCart[itemId] -= 1;
                } else {
                    delete updatedCart[itemId];
                }
                return updatedCart;
            });
            if (token) {
                await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
            }
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            setFoodList(response.data.data);
        } catch (error) {
            console.error("Error fetching food list:", error);
        }
    };

    const loadCartData = async () => {
        try {
            const response = await axios.post(`${url}/api/cart/get`, {}, { headers: { token } });
            setCartItems(response.data.cartData);
        } catch (error) {
            console.error("Error loading cart data:", error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchFoodList();
            if (token) await loadCartData();
        };
        loadData();
    }, [token]);

    const totalCartAmount = useMemo(() => {
        return Object.entries(cartItems).reduce((total, [itemId, qty]) => {
            const itemInfo = food_list.find((product) => product._id === itemId);
            return total + (itemInfo?.price || 0) * qty;
        }, 0);
    }, [cartItems, food_list]);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        totalCartAmount,
        url,
        token,
        setToken,
    };

    return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;
