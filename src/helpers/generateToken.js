import jwt from 'jsonwebtoken'

const tokenSign = async (user) => {
    return jwt.sign(
        {
            id_user: user.id_user,
            id_role: user.id_role,
            role: user.rol_name
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "2h"
        }
    )
}

const verifyToken = async (token) => {
    try{
        return jwt.verify(token, process.env.JWT_SECRET)
    }catch(e){
        return null
    }
}

export { tokenSign, verifyToken }