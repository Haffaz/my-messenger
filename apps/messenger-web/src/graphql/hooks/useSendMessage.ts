import { InternalRefetchQueryDescriptor, useMutation } from "@apollo/client";
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
type UseSendMessageOptions = {
  refetchQueries?: InternalRefetchQueryDescriptor[];
} | null;

export default function useSendMessage(options: UseSendMessageOptions = {}) {
  return useMutation(SEND_MESSAGE, {
    refetchQueries: options?.refetchQueries ?? [],
  });
}
