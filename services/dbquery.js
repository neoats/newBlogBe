import dotenv from "dotenv";
import { GraphQLClient } from "graphql-request";

dotenv.config();

const url = process.env.PUBLIC_GRAPHCMS_ENDPOINT;
const graphqlAPI = new GraphQLClient(url);

export const getUserData = async (usernameOrEmail) => {
  let fieldName, fieldValue;

  if (usernameOrEmail !== null && usernameOrEmail !== "") {
    if (usernameOrEmail.includes("@")) {
      fieldName = "email";
      fieldValue = usernameOrEmail;
    } else {
      fieldName = "userName";
      fieldValue = usernameOrEmail;
    }
  }

  const query = `
    query GetUser {
      accounts(where: { OR: [{ email: "${fieldValue}" }, { userName: "${fieldValue}" }]}) {
        userName
        isAdmin
        password
      }
    }`;

  try {
    const response = await graphqlAPI.request(query);
    return response.accounts[0];
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
