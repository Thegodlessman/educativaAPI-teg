export const verifyToken = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: "Acceso denegado, token no proporcionado" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();  // Continúa con la siguiente función del middleware o controlador
    } catch (error) {
        return res.status(401).json({ message: "Token no válido" });
    }
};