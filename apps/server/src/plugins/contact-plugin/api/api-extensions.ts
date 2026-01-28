import gql from 'graphql-tag';

export const shopApiExtensions = gql`
  input SubmitContactFormInput {
    name: String!
    email: String!
    phone: String
    company: String
    message: String!
    source: String
  }

  type ContactFormResult {
    success: Boolean!
    message: String
  }

  extend type Mutation {
    submitContactForm(input: SubmitContactFormInput!): ContactFormResult!
  }
`;

export const adminApiExtensions = gql`
  type ContactSubmission implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    email: String!
    phone: String
    company: String
    message: String!
    source: String
    ipAddress: String
    userAgent: String
    isRead: Boolean!
    notes: String
  }

  type ContactSubmissionList implements PaginatedList {
    items: [ContactSubmission!]!
    totalItems: Int!
  }

  input ContactSubmissionListOptions {
    skip: Int
    take: Int
    sort: ContactSubmissionSortParameter
    filter: ContactSubmissionFilterParameter
  }

  input ContactSubmissionSortParameter {
    id: SortOrder
    name: SortOrder
    email: SortOrder
    createdAt: SortOrder
    updatedAt: SortOrder
    isRead: SortOrder
  }

  input ContactSubmissionFilterParameter {
    id: IDOperators
    name: StringOperators
    email: StringOperators
    isRead: BooleanOperators
    createdAt: DateOperators
    updatedAt: DateOperators
  }

  input UpdateContactSubmissionInput {
    id: ID!
    isRead: Boolean
    notes: String
  }

  extend type Query {
    contactSubmissions(options: ContactSubmissionListOptions): ContactSubmissionList!
    contactSubmission(id: ID!): ContactSubmission
    unreadContactCount: Int!
  }

  extend type Mutation {
    updateContactSubmission(input: UpdateContactSubmissionInput!): ContactSubmission!
    markContactAsRead(id: ID!): ContactSubmission!
    deleteContactSubmission(id: ID!): DeletionResponse!
  }
`;
