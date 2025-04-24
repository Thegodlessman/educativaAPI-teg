import jwt from 'jsonwebtoken';

export const tokenSign = async (user) => {

    const payload = {
        id_user: user.id_user,
        active_role: user.active_role, 
        rol_name: user.rol_name,        
        full_name: user.user_name + '' + user.user_lastname,
        user_url: user.user_url
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });
};

export const verifyToken = async (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return null;
    }
};
