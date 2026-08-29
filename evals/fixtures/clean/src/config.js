module.exports = {
  stripeKey: process.env.STRIPE_SECRET_KEY,
  debug: process.env.NODE_ENV !== 'production' && process.env.DEBUG === '1'
}
