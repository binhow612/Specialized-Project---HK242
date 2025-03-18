module.exports = {
    jwt: {
      secret: process.env.JWT_SECRET || "supersecret",
      expiresIn: "10d"
    },
    bcryptSaltRounds: 10,
    helmet: true // Bật bảo vệ HTTP headers
  };
  