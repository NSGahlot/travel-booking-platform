import axios from "axios";
import { DB_URL } from "./firebase";

export const getListings = async () => {
  const res = await axios.get(`${DB_URL}/listings.json`);
  return res.data;
};

export const addListing = async (listing) => {
  const res = await axios.post(`${DB_URL}/listings.json`, listing);
  return res.data;
};

export const updateListing = async (id, listing) => {
  await axios.put(`${DB_URL}/listings/${id}.json`, listing);
};

export const deleteListing = async (id) => {
  await axios.delete(`${DB_URL}/listings/${id}.json`);
};
