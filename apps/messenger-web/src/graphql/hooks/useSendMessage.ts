import { useMutation } from "@apollo/client";
import { graphql } from "../../graphql/generated";

const SEND_MESSAGE = graphql(`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      content
      createdAt
      sender {
        id
        username
      }
      threadId
    }
  }
`);

export default function useSendMessage() {
  return useMutation(SEND_MESSAGE);
}
