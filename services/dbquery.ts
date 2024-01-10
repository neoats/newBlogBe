import { GraphQLClient } from 'graphql-request';

const graphqlAPI = new GraphQLClient('your_graphql_endpoint');

interface Account {
  userName: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export const getUserDataByUserName = async (userName: string, password: string): Promise<Account> => {
  const query = `
    query GetUser {
      account(where: { userName: "${userName}", password: "${password}" }) {
        userName
        password
        isAdmin
      }
    }`;

  try {
    const response = await graphqlAPI.request<{ account: Account }>(query);
    return response.account;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const getUserDataByUserNameAndEmail = async (
  userName: string | null,
  email: string | null,
  password: string | null,
): Promise<Account> => {
  const query = `
    query GetUser {
      accounts(where: { OR: [{ email: "${email}" }, { userName: "${userName}" }], password: "${password}" }) {
        userName
        password
        isAdmin
      }
    }`;

  try {
    const response = await graphqlAPI.request<{ accounts: Account[] }>(query);
    return response.accounts[0];
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
