import dotenv from 'dotenv';
import { GraphQLClient } from 'graphql-request';
dotenv.config();

const url = process.env.PUBLIC_GRAPHCMS_ENDPOINT;
const graphqlAPI = new GraphQLClient(url)

export const getUserData = async (userName, password) => {
    const query = `
      query GetUser {
        account(where: { password: "${password}", userName: "${userName}" }) {
          userName
          password
          
        }
      }
    `;
    try {
      const response = await graphqlAPI.request(query);
      return response.account;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };