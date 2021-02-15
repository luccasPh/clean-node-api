/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongodb:27017/clean-node-api',
  port: process.env.PORT || 5050,
  jwtSecretKey: process.env.JWT_SECRET_KEY || 'ur$z192sb9jea4h8!dckg8o)ex*s8*r2$x^2cjs&k6&rt)m^l#'
}
