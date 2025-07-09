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
  getCurrentUser: async (_: any, __: any, context: any) => {
    if (!context.user) {
      throw new Error("Unauthorized");
    }

    const user = await UserService.getCurrentUser(context.user.id);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
};

const mutations = {
  createUser: async (_: any, payload: CreateUserPayloadType) => {
    const response = await UserService.createUser(payload);

    return response?.id;
  },
};

export const resolvers = { queries, mutations };
