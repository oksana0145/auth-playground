import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return res.status(401).json({
                message: "Access token is required",
            });
        }

        const [tokenType, accessToken] = authorizationHeader.split(" ");

        if (tokenType !== "Bearer" || !accessToken) {
            return res.status(401).json({
                message: "Invalid authorization format",
            });
        }

        const decodedToken = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_SECRET
        );

        req.user = decodedToken;

        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);

  return res.status(401).json({
    message: "Invalid or expired access token",
  });
    }
};