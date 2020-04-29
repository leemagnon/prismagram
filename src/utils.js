import { adjectives, nouns } from "./words";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

/**
 * ✡메일 인증✡
 */

export const generateSecret = () => {
  const randomNumber = Math.floor(Math.random() * adjectives.length);
  return `${adjectives[randomNumber]} ${nouns[randomNumber]}`;
};

const sendMail = (email) => {
  const options = {
    service: "Gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.GOOGLE_USER,
      pass: process.env.GOOGLE_PASS,
    },
  };
  const client = nodemailer.createTransport(options);
  return client.sendMail(email);
};

export const sendSecretMail = (address, secret) => {
  const email = {
    from: process.env.GOOGLE_USER,
    to: address,
    subject: "🔒Login Secret for Prismagram🔒",
    html: `Hello! Your login secret is <strong>${secret}</strong>.<br/>Copy paste on the app/website to log in`,
  };
  return sendMail(email);
};

/**
 * ✡토큰 발급✡
 */
export const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);
