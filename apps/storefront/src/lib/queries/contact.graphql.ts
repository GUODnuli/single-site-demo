import { graphql } from '@/gql';

export const SUBMIT_CONTACT_FORM = graphql(`
  mutation SubmitContactForm($input: SubmitContactFormInput!) {
    submitContactForm(input: $input) {
      success
      message
    }
  }
`);
