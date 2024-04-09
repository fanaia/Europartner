const { default: axios } = require("axios");

const apiOmie = axios.create({
  baseURL: process.env.OMIE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = { apiOmie };
