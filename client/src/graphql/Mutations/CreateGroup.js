// import gql from 'graphql-tag'
// import GROUP_FRAGMENT from '../Fragments/Group'

// const CREATE_GROUP_MUTATION = gql`
//   mutation createGroup($group: CreateGroupInput!, $messageConnection: ConnectionInput = { first: 1 }) {
//     createGroup(group: $group) {
//       ... GroupFragment
//     }
//   }
//   ${GROUP_FRAGMENT}
// `

// export default CREATE_GROUP_MUTATION

import gql from 'graphql-tag'

const CREATE_GROUP_MUTATION = gql`
  mutation createGroup($group: CreateGroupInput!) {
    createGroup(group: $group) {
      id
      name
      users {
        id
        username
      }
    }
  }
`

export default CREATE_GROUP_MUTATION
