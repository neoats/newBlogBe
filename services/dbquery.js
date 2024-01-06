import dotenv from "dotenv";
import { GraphQLClient } from "graphql-request";

dotenv.config();

const url = process.env.PUBLIC_GRAPHCMS_ENDPOINT;
const graphqlAPI = new GraphQLClient(url);

 export const getUserData = async (userName, password) => {
   console.log(userName+" "+password) 
  const query = `
  query GetUser {
    account(where: { userName: "${userName}", password: "${password}" }) {
      userName
      password
      isAdmin

    }
  }`;
  try {
    /*     const response = await graphqlAPI.request(query); */
    const response = await graphqlAPI.request(query);

    return response.account;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

/* export const getUserData = async (userName,email, password) => {
  const query = `
  query GetUser {
  accounts(where: { OR: [{ email: "${email}" }, { userName: "${userName}" }],password:"${password}" }) {
    name
    password
    isAdmin
  }
}`;
  try {
   
    const response = await graphqlAPI.request(query);

    return response.account;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
 */