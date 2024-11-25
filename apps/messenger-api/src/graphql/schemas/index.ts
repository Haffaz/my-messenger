import { authTypeDefs } from "./auth.schema";
import { baseTypeDefs } from "./base.schema";
import { messageTypeDefs } from "./message.schema";
import { threadTypeDefs } from "./thread.schema";

export default `#graphql
  ${baseTypeDefs}
  ${authTypeDefs}
  ${messageTypeDefs}
  ${threadTypeDefs}
`;
