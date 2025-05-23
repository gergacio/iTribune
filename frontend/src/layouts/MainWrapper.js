import { useState, useEffect } from "react";
import { setUser } from "../utils/auth.js";

const MainWrapper = ({ children }) => { 
    const [loading, setLoading] = useState(true); //useState store info

    useEffect(() => {
        const handler = async () => {
            setLoading(true);

            await setUser(); //check what is this func doing it
            setLoading(false);

        }
        handler();
    }, []); //pass dependancy array

    return <>{ loading? null: children}</>

}
export default MainWrapper;