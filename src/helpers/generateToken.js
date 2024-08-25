import jwt from 'jsonwebtoken'

const tokenSign = async (user) => {
    return jwt.sign(
        {
            _id: user.id_user,
            id_role: user.id_role
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