import { UserService } from "../../services/user";
import type {
  CreateUserPayloadType,
  LoginUserPayloadType,
} from "../../validations/userValidations";

const queries = {
  loginUser: async (_: any, payload: LoginUserPayloadType) => {
    const response = await UserService.loginUser(payload);

    return response.token;
  },
};

const mutations = {
  createUser: async (_: any, payload: CreateUserPayloadType) => {
    const response = await UserService.createUser(payload);

    return response?.id;
  },
};

export const resolvers = { queries, mutations };
