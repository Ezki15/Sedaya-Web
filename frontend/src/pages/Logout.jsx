import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


export default function Logout(){
    const navigate = useNavigate();
    
    useEffect(() => {
        async function logout(){
            try{
                const res = api.delete("/authentications", {withCredentials: true});
                if(res.status === 200){
                    setTimeout(() => {
                        navigate("/");
                    }, 2000);
                }
                alert('Logout berhasil!');
            } catch (err){
                alert('Logout gagal');
                console.log(err)
            }
        }
        logout();
    }, [navigate]);

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh"
        }}>
            <div style={{
                background: "#fff",
                padding: "2rem",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                textAlign: "center",
                minWidth: "300px"
            }}>
                <h2>Logout Berhasil!</h2>
                <p>Kamu akan diarahkan ke halaman utama...</p>
            </div>
        </div>
    )
}